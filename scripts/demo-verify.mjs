/**
 * XRPL Demo Verifier — Tamper-Proof Verification
 * 
 * Reads all anchored provenance nodes from Supabase,
 * verifies each against the XRPL Testnet, and outputs
 * a pass/fail report showing the integrity of the Lineage chain.
 * 
 * The "money shot": demonstrates that altering a Supabase record
 * after anchoring is detectable because the XRPL hash won't match.
 * 
 * Run: node scripts/demo-verify.mjs
 * Tamper test: node scripts/demo-verify.mjs --tamper
 */

import 'dotenv/config';
import { Client } from 'xrpl';
import { createHash } from 'crypto';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY;
const XRPL_URL = 'wss://s.altnet.rippletest.net:51233';

// ── Supabase ───────────────────────────────────────────────

async function supabaseGet(table, query = '') {
  const res = await fetch(`${supabaseUrl}/rest/v1/${table}?${query}`, {
    headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` },
  });
  return res.json();
}

async function supabasePatch(table, id, data) {
  return fetch(`${supabaseUrl}/rest/v1/${table}?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(data),
  });
}

// ── Main ───────────────────────────────────────────────────

async function main() {
  const tamperMode = process.argv.includes('--tamper');

  console.log('');
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║   AIOS × XRPL · Tamper-Proof Verification           ║');
  console.log('║   Verifying Lineage integrity against XRPL Testnet   ║');
  if (tamperMode) {
    console.log('║   🔴 TAMPER MODE: Will simulate data manipulation    ║');
  }
  console.log('╚══════════════════════════════════════════════════════╝\n');

  // Step 1: Read anchored nodes from Supabase
  console.log('📥 Step 1: Reading anchored provenance nodes from Supabase...');
  const allNodes = await supabaseGet('provenance_nodes', 'order=created_at.asc&limit=100');
  const anchored = allNodes.filter(n => n.agl_tx_hash);
  const unanchored = allNodes.filter(n => !n.agl_tx_hash);

  console.log(`   Total nodes: ${allNodes.length}`);
  console.log(`   Anchored:    ${anchored.length}`);
  console.log(`   Un-anchored: ${unanchored.length}\n`);

  if (anchored.length === 0) {
    console.log('⚠️  No anchored nodes found. Run demo-scenarios.mjs first.');
    process.exit(0);
  }

  // Step 2: Connect to XRPL
  console.log('🌐 Step 2: Connecting to XRPL Testnet...');
  const client = new Client(XRPL_URL);
  await client.connect();
  console.log('   ✅ Connected\n');

  // Step 3: Tamper simulation (if --tamper flag)
  let tamperedNodeId = null;
  let originalHash = null;

  if (tamperMode && anchored.length > 0) {
    // Pick a random anchored node to tamper with
    const target = anchored[Math.floor(Math.random() * anchored.length)];
    tamperedNodeId = target.id;
    originalHash = target.content_hash;

    console.log('🔴 TAMPER SIMULATION');
    console.log('   ─────────────────────────────────────────────');
    console.log(`   Target: ${target.id}`);
    console.log(`   Actor:  ${target.actor_name}`);
    console.log(`   Type:   ${target.node_type}`);
    console.log(`   Original hash: ${originalHash.substring(0, 32)}...`);
    console.log('');
    console.log('   Simulating: Someone modifies the Supabase record...');
    console.log('   (Changing content_hash to simulate data tampering)');
    console.log('');

    // Modify the content_hash in Supabase
    const fakeHash = createHash('sha256').update('TAMPERED DATA ' + Date.now()).digest('hex');
    await supabasePatch('provenance_nodes', target.id, { content_hash: fakeHash });
    console.log(`   Tampered hash:  ${fakeHash.substring(0, 32)}...`);
    console.log('   ─────────────────────────────────────────────\n');

    // Re-read the nodes so verification picks up the tampered data
    const refreshed = await supabaseGet('provenance_nodes', 'order=created_at.asc&limit=100');
    anchored.length = 0;
    refreshed.filter(n => n.agl_tx_hash).forEach(n => anchored.push(n));
  }

  // Step 4: Verify each anchored node
  console.log(`🔍 Step 3: Verifying ${anchored.length} anchored nodes against XRPL...\n`);

  let passed = 0;
  let failed = 0;
  let errors = 0;
  const results = [];

  for (const node of anchored) {
    process.stdout.write(`   ${node.id.substring(0, 8)}... `);

    try {
      // Look up the XRPL transaction
      const txResponse = await client.request({
        command: 'tx',
        transaction: node.agl_tx_hash,
      });

      const tx = txResponse.result;
      // xrpl.js v4: Memos are under tx_json, not top-level
      const txData = tx.tx_json || tx;
      const memos = txData.Memos;

      if (!memos || memos.length === 0) {
        console.log('⚠️  No memos found on TX');
        errors++;
        results.push({ id: node.id, status: 'ERROR', reason: 'No memos on TX' });
        continue;
      }

      // Decode the memo
      const memoData = Buffer.from(memos[0].Memo.MemoData, 'hex').toString();
      const payload = JSON.parse(memoData);

      // Compare the hash
      const onChainHash = payload.lineage_hash;
      const currentHash = node.content_hash;
      const isTampered = node.id === tamperedNodeId;

      if (onChainHash === currentHash) {
        console.log(`✅ VERIFIED  [${node.node_type}] ${node.actor_name}`);
        passed++;
        results.push({ id: node.id, status: 'PASS', actor: node.actor_name, type: node.node_type });
      } else {
        console.log(`🔴 TAMPERED! [${node.node_type}] ${node.actor_name}`);
        console.log(`      Supabase hash: ${currentHash.substring(0, 32)}...`);
        console.log(`      On-chain hash: ${onChainHash.substring(0, 32)}...`);
        console.log(`      ⛓️  XRPL TX:    ${node.agl_tx_hash}`);
        if (isTampered) {
          console.log('      ↑ This is the tampered record — the XRPL caught it!');
        }
        failed++;
        results.push({ id: node.id, status: 'TAMPERED', actor: node.actor_name, type: node.node_type,
          supabase_hash: currentHash, onchain_hash: onChainHash });
      }

    } catch (err) {
      console.log(`❌ ERROR: ${err.message}`);
      errors++;
      results.push({ id: node.id, status: 'ERROR', reason: err.message });
    }
  }

  // Step 5: Restore tampered data
  if (tamperMode && tamperedNodeId && originalHash) {
    console.log('\n🔧 Restoring tampered record to original state...');
    await supabasePatch('provenance_nodes', tamperedNodeId, { content_hash: originalHash });
    console.log('   ✅ Original hash restored\n');
  }

  // Step 6: Results
  console.log('\n');
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║   VERIFICATION RESULTS                               ║');
  console.log('╠══════════════════════════════════════════════════════╣');
  console.log(`║   Verified:  ${String(passed).padEnd(3)} ✅                                 ║`);
  console.log(`║   Tampered:  ${String(failed).padEnd(3)} 🔴                                 ║`);
  console.log(`║   Errors:    ${String(errors).padEnd(3)} ❌                                 ║`);
  console.log(`║   Total:     ${String(anchored.length).padEnd(3)}                                    ║`);
  console.log('║                                                      ║');

  if (failed === 0 && errors === 0) {
    console.log('║   🟢 INTEGRITY: ALL RECORDS VERIFIED                 ║');
    console.log('║   Every Lineage record matches its on-chain anchor   ║');
  } else if (tamperMode && failed > 0) {
    console.log('║   🔴 TAMPER DETECTED — XRPL CAUGHT THE CHANGE       ║');
    console.log('║   The blockchain record is immutable.                ║');
    console.log('║   Supabase was modified but XRPL proved it.          ║');
  } else {
    console.log('║   ⚠️  INTEGRITY ISSUES DETECTED                     ║');
    console.log('║   Review tampered/errored records above.             ║');
  }

  console.log('╚══════════════════════════════════════════════════════╝');

  await client.disconnect();
  console.log('\n✅ Disconnected from XRPL Testnet.\n');
}

main().catch(err => {
  console.error('❌ Fatal:', err.message);
  process.exit(1);
});
