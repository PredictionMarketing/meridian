/**
 * XRPL Testnet Anchor Test — v2
 * 
 * Uses two wallets: sender + anchor vault.
 * Sends 1 drop from sender to vault with Lineage hash in Memo.
 * Self-payments cause temREDUNDANT — using separate addresses fixes this.
 * 
 * Run: node scripts/test-anchor.mjs
 */

import 'dotenv/config';
import { Client, Wallet } from 'xrpl';
import { createHash } from 'crypto';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// ── Supabase Helpers ───────────────────────────────────────

async function supabaseGet(table, query = '') {
  const res = await fetch(`${supabaseUrl}/rest/v1/${table}?${query}`, {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
    },
  });
  return res.json();
}

async function supabaseUpdate(table, id, data) {
  const res = await fetch(`${supabaseUrl}/rest/v1/${table}?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Supabase update failed: ${res.status} ${err}`);
  }
  return res.json();
}

// ── Main ───────────────────────────────────────────────────

async function main() {
  console.log('⛓️  AIOS → XRPL Testnet Anchoring');
  console.log('==================================\n');

  // Step 1: Read provenance nodes from Supabase
  console.log('📥 Step 1: Reading provenance nodes from Supabase...');
  const nodes = await supabaseGet('provenance_nodes', 'order=created_at.desc&limit=10');
  
  if (!nodes || nodes.length === 0) {
    console.log('❌ No provenance nodes found. Run the Slack pipeline first.');
    process.exit(1);
  }

  const unanchored = nodes.filter(n => !n.agl_tx_hash);
  console.log(`   Total nodes: ${nodes.length}`);
  console.log(`   Un-anchored: ${unanchored.length}`);

  if (unanchored.length === 0) {
    console.log('✅ All nodes already anchored!');
    const anchored = nodes.filter(n => n.agl_tx_hash);
    for (const n of anchored) {
      console.log(`   🔗 ${n.id.substring(0, 8)}... → TX: ${n.agl_tx_hash}`);
      console.log(`      https://testnet.xrpl.org/transactions/${n.agl_tx_hash}`);
    }
    process.exit(0);
  }

  // Step 2: Connect to XRPL testnet
  console.log('\n🌐 Step 2: Connecting to XRPL Testnet...');
  const client = new Client('wss://s.altnet.rippletest.net:51233');
  await client.connect();
  console.log('   ✅ Connected to XRPL Testnet');

  // Step 3: Setup two wallets (sender + anchor vault)
  console.log('\n💰 Step 3: Setting up wallets...');
  
  let sender, vault;

  // Sender wallet
  if (process.env.AGL_WALLET_SEED) {
    sender = Wallet.fromSeed(process.env.AGL_WALLET_SEED);
    console.log(`   Sender (restored): ${sender.address}`);
  } else {
    console.log('   Creating sender wallet from faucet...');
    const fund = await client.fundWallet();
    sender = fund.wallet;
    console.log(`   Sender (new): ${sender.address}`);
    console.log(`   ⚠️  Save to .env: AGL_WALLET_SEED=${sender.seed}`);
  }

  // Vault wallet
  if (process.env.AGL_VAULT_SEED) {
    vault = Wallet.fromSeed(process.env.AGL_VAULT_SEED);
    console.log(`   Vault  (restored): ${vault.address}`);
  } else {
    console.log('   Creating anchor vault wallet from faucet...');
    const fund = await client.fundWallet();
    vault = fund.wallet;
    console.log(`   Vault  (new): ${vault.address}`);
    console.log(`   ⚠️  Save to .env: AGL_VAULT_SEED=${vault.seed}`);
  }

  // Show balances
  try {
    const senderInfo = await client.request({ command: 'account_info', account: sender.address });
    const vaultInfo = await client.request({ command: 'account_info', account: vault.address });
    console.log(`   Sender balance: ${Number(senderInfo.result.account_data.Balance) / 1000000} XRP`);
    console.log(`   Vault balance:  ${Number(vaultInfo.result.account_data.Balance) / 1000000} XRP`);
  } catch(e) { /* first run */ }

  // Step 4: Anchor each un-anchored node
  console.log(`\n⛓️  Step 4: Anchoring ${unanchored.length} node(s)...\n`);

  for (const node of unanchored) {
    console.log(`   ── Node: ${node.id} ──`);
    console.log(`   Type:  ${node.node_type}`);
    console.log(`   Actor: ${node.actor_name}`);
    console.log(`   Hash:  ${node.content_hash?.substring(0, 16)}...`);

    // Build anchor payload
    const anchorPayload = {
      lineage_hash: node.content_hash,
      node_ids: [node.id],
      scenario_id: 'meridian_demo',
      anchor_type: 'lineage_commit',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      node_type: node.node_type,
      actor: node.actor_id,
      department: node.department,
    };

    const payloadJson = JSON.stringify(anchorPayload);
    const memoData = Buffer.from(payloadJson).toString('hex');
    const memoType = Buffer.from('agl/lineage_commit').toString('hex');
    const memoFormat = Buffer.from('application/json').toString('hex');

    const memoBytes = memoData.length / 2;
    console.log(`   Memo:  ${memoBytes} bytes`);

    if (memoBytes > 1024) {
      console.log(`   ⚠️  Too large, skipping`);
      continue;
    }

    console.log('   Submitting to XRPL Testnet...');

    try {
      // Send from sender → vault (NOT self-payment)
      const prepared = await client.autofill({
        TransactionType: 'Payment',
        Account: sender.address,
        Destination: vault.address,      // Different address = no temREDUNDANT
        Amount: '1',                     // 1 drop (0.000001 XRP)
        Memos: [{
          Memo: {
            MemoType: memoType,
            MemoData: memoData,
            MemoFormat: memoFormat,
          },
        }],
      });

      const signed = sender.sign(prepared);
      const result = await client.submitAndWait(signed.tx_blob);
      
      const txHash = result.result.hash;
      const ledgerIndex = result.result.ledger_index;

      console.log(`   ✅ ANCHORED ON-CHAIN!`);
      console.log(`   TX Hash:  ${txHash}`);
      console.log(`   Ledger:   ${ledgerIndex}`);
      console.log(`   Explorer: https://testnet.xrpl.org/transactions/${txHash}`);

      // Update Supabase
      console.log('   Updating Supabase...');
      await supabaseUpdate('provenance_nodes', node.id, {
        agl_tx_hash: txHash,
        agl_block: ledgerIndex,
        anchored_at: new Date().toISOString(),
      });
      console.log('   ✅ Supabase updated!\n');

    } catch (err) {
      console.log(`   ❌ Failed: ${err.message}\n`);
    }
  }

  // Step 5: Verification
  console.log('🔍 Step 5: Verification...');
  const updated = await supabaseGet('provenance_nodes', 'order=created_at.desc&limit=10');
  const anchored = updated.filter(n => n.agl_tx_hash);
  
  console.log(`   Anchored: ${anchored.length}/${updated.length} nodes`);
  for (const n of anchored) {
    console.log(`\n   🔗 Node: ${n.id}`);
    console.log(`      Type: ${n.node_type}`);
    console.log(`      TX:   ${n.agl_tx_hash}`);
    console.log(`      View: https://testnet.xrpl.org/transactions/${n.agl_tx_hash}`);
  }

  await client.disconnect();
  console.log('\n✅ Complete! Disconnected from XRPL Testnet.');
}

main().catch(err => {
  console.error('❌ Fatal:', err.message);
  process.exit(1);
});
