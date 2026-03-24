/**
 * XRPL Sidechain Demo — Scenario Runner
 * 
 * Generates realistic multi-step Lineage chains for Meridian Dynamics,
 * writes provenance nodes + edges to Supabase, and anchors critical
 * decisions on XRPL Testnet.
 * 
 * Run: node scripts/demo-scenarios.mjs
 * 
 * Scenarios:
 *   1   — The Invoice AI Idea (Signature Demo)
 *   1a  — Shadow AI Detection (The Legal Brief)
 *   2   — Compliance Drift Detection
 *   3   — The Audit Failure
 *   4   — AI Agent Deployment
 */

import 'dotenv/config';
import { Client, Wallet } from 'xrpl';
import { createHash } from 'crypto';

// ── Config ─────────────────────────────────────────────────

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY;
const XRPL_URL = 'wss://s.altnet.rippletest.net:51233';

// ── Personas (from config/organization.ts) ─────────────────

const PERSONAS = {
  // Finance
  catherine_park:  { name: 'Catherine Park',  role: 'CFO',                    dept: 'finance',     tier: 'platinum', confidence: 0.99, device: 'MacBook Pro M4 + YubiKey 5', auth: 'yubikey_biometric' },
  ryan_obrien:     { name: "Ryan O'Brien",    role: 'VP Finance',             dept: 'finance',     tier: 'gold',     confidence: 0.95, device: 'MacBook Pro M4',             auth: 'biometric_touchid' },
  nadia_hassan:    { name: 'Nadia Hassan',    role: 'Procurement Manager',    dept: 'finance',     tier: 'silver',   confidence: 0.85, device: 'MacBook Pro M3',             auth: 'sso_mfa' },
  derek_williams:  { name: 'Derek Williams',  role: 'AP/AR Coordinator',      dept: 'finance',     tier: 'bronze',   confidence: 0.72, device: 'Dell Latitude 5540',         auth: 'password_mfa' },
  // Legal
  diana_reyes:     { name: 'Diana Reyes',     role: 'General Counsel',        dept: 'legal',       tier: 'platinum', confidence: 0.99, device: 'MacBook Pro M4 + YubiKey 5', auth: 'yubikey_biometric' },
  tom_nakamura:    { name: 'Tom Nakamura',    role: 'Sr. Compliance Officer', dept: 'legal',       tier: 'gold',     confidence: 0.95, device: 'MacBook Pro M4',             auth: 'biometric_touchid' },
  laura_medina:    { name: 'Laura Medina',    role: 'Contract Attorney',      dept: 'legal',       tier: 'gold',     confidence: 0.95, device: 'MacBook Pro M4',             auth: 'biometric_touchid' },
  jessica_torres:  { name: 'Jessica Torres',  role: 'Legal Paralegal',        dept: 'legal',       tier: 'bronze',   confidence: 0.72, device: 'Dell Latitude 5540',         auth: 'password_mfa' },
  // Engineering
  marcus_chen:     { name: 'Marcus Chen',     role: 'VP Engineering',         dept: 'engineering', tier: 'gold',     confidence: 0.95, device: 'MacBook Pro M4',             auth: 'biometric_touchid' },
  priya_sharma:    { name: 'Priya Sharma',    role: 'Lead AI Engineer',       dept: 'engineering', tier: 'gold',     confidence: 0.95, device: 'MacBook Pro M4',             auth: 'biometric_touchid' },
  alex_rivera:     { name: 'Alex Rivera',     role: 'Full-Stack Developer',   dept: 'engineering', tier: 'silver',   confidence: 0.85, device: 'MacBook Pro M3',             auth: 'sso_mfa' },
  sam_kim:         { name: 'Sam Kim',         role: 'DevOps Engineer',        dept: 'engineering', tier: 'silver',   confidence: 0.85, device: 'MacBook Pro M3',             auth: 'sso_mfa' },
  // People
  rachel_foster:   { name: 'Rachel Foster',   role: 'CHRO',                   dept: 'people',      tier: 'gold',     confidence: 0.95, device: 'MacBook Pro M4',             auth: 'biometric_touchid' },
  // Support
  maya_johnson:    { name: 'Maya Johnson',    role: 'VP Customer Success',    dept: 'support',     tier: 'gold',     confidence: 0.95, device: 'MacBook Pro M4',             auth: 'biometric_touchid' },
  // AIOS Agents (approved AI)
  aios_doc_agent:  { name: 'AIOS Doc Summarizer v2', role: 'AI Agent',       dept: 'engineering', tier: 'gold',     confidence: 1.00, device: 'AIOS Cloud (Claude Sonnet)', auth: 'agent_identity' },
};

// ── Supabase Helpers ───────────────────────────────────────

async function supabasePost(table, data) {
  const res = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
    method: 'POST',
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
    throw new Error(`Supabase POST ${table} failed: ${res.status} ${err}`);
  }
  const result = await res.json();
  return Array.isArray(result) ? result[0] : result;
}

// ── XRPL Anchoring ─────────────────────────────────────────

let xrplClient = null;
let senderWallet = null;
let vaultWallet = null;

async function initXRPL() {
  xrplClient = new Client(XRPL_URL);
  await xrplClient.connect();
  console.log('   ✅ Connected to XRPL Testnet');

  if (process.env.AGL_WALLET_SEED) {
    senderWallet = Wallet.fromSeed(process.env.AGL_WALLET_SEED);
    console.log(`   Sender: ${senderWallet.address}`);
  } else {
    const fund = await xrplClient.fundWallet();
    senderWallet = fund.wallet;
    console.log(`   Sender (new): ${senderWallet.address}`);
    console.log(`   ⚠️  Save: AGL_WALLET_SEED=${senderWallet.seed}`);
  }

  if (process.env.AGL_VAULT_SEED) {
    vaultWallet = Wallet.fromSeed(process.env.AGL_VAULT_SEED);
    console.log(`   Vault:  ${vaultWallet.address}`);
  } else {
    const fund = await xrplClient.fundWallet();
    vaultWallet = fund.wallet;
    console.log(`   Vault (new):  ${vaultWallet.address}`);
    console.log(`   ⚠️  Save: AGL_VAULT_SEED=${vaultWallet.seed}`);
  }
}

async function anchorOnXRPL(payload) {
  const payloadJson = JSON.stringify(payload);
  const memoData = Buffer.from(payloadJson).toString('hex');
  const memoType = Buffer.from(`agl/${payload.anchor_type}`).toString('hex');
  const memoFormat = Buffer.from('application/json').toString('hex');

  if (memoData.length / 2 > 1024) {
    console.log(`      ⚠️ Memo too large (${memoData.length / 2}B), trimming node_ids`);
    payload.node_ids = payload.node_ids.slice(0, 1);
    return anchorOnXRPL(payload);
  }

  const prepared = await xrplClient.autofill({
    TransactionType: 'Payment',
    Account: senderWallet.address,
    Destination: vaultWallet.address,
    Amount: '1',
    Memos: [{ Memo: { MemoType: memoType, MemoData: memoData, MemoFormat: memoFormat } }],
  });

  const signed = senderWallet.sign(prepared);
  const result = await xrplClient.submitAndWait(signed.tx_blob);

  return {
    tx_hash: result.result.hash,
    ledger_index: result.result.ledger_index,
    explorer_url: `https://testnet.xrpl.org/transactions/${result.result.hash}`,
  };
}

// ── Node & Edge Builders ───────────────────────────────────

function hashContent(content) {
  return createHash('sha256').update(content).digest('hex');
}

function makeNode(personaId, type, summary, content, scenarioId, extra = {}) {
  const p = PERSONAS[personaId];
  if (!p) throw new Error(`Unknown persona: ${personaId}`);
  return {
    node_type: type,
    source_tool: extra.source_tool || 'slack',
    source_ref: `demo:${scenarioId}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`,
    content_hash: hashContent(content),
    summary,
    actor_id: personaId,
    actor_name: p.name,
    department: p.dept,
    auth_method: p.auth,
    auth_tier: p.tier,
    confidence: extra.confidence_override || p.confidence,
    device: p.device,
    metadata: {
      scenario_id: scenarioId,
      scenario_name: extra.scenario_name || scenarioId,
      content_preview: content.substring(0, 200),
      ...extra.metadata,
    },
    tags: [
      `scenario:${scenarioId}`,
      `dept:${p.dept}`,
      type,
      ...(extra.tags || []),
    ],
  };
}

function makeEdge(fromId, toId, relationship, channel = 'slack') {
  return { from_node_id: fromId, to_node_id: toId, relationship, channel };
}

// ── Print Helpers ──────────────────────────────────────────

function printNode(node, savedId) {
  const tierEmoji = { platinum: '🔒', gold: '🟡', silver: '🟢', bronze: '🔵' };
  console.log(`      ${tierEmoji[node.auth_tier] || '⚪'} [${node.node_type}] ${node.summary.substring(0, 80)}`);
  console.log(`        Actor: ${node.actor_name} (${node.auth_tier}) | ID: ${savedId.substring(0, 8)}...`);
}

function printAnchor(result) {
  console.log(`      ⛓️  TX: ${result.tx_hash}`);
  console.log(`         ${result.explorer_url}`);
}

// ════════════════════════════════════════════════════════════
// SCENARIO 1: The Invoice AI Idea
// ════════════════════════════════════════════════════════════

async function scenario1() {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║  SCENARIO 1: The Invoice AI Idea                ║');
  console.log('║  Finance → Legal → Engineering → Deploy          ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  const SID = 'scenario_1_invoice_ai';
  const nodes = [];

  // Node 1: Nadia has the idea
  console.log('   📥 Phase 1: Idea Origin');
  const n1 = makeNode('nadia_hassan', 'idea_origin',
    'Nadia Hassan in #finance: "What if we used AI to auto-classify incoming invoices by department, urgency, and approval routing?"',
    'Hey team — I just spent 3 hours manually sorting 47 invoices. What if we used AI to auto-classify incoming invoices? It could tag department, urgency level, and route to the right approver automatically. We process about 2,000 invoices/month and I bet we lose 15-20 hours on manual classification.',
    SID, { scenario_name: 'The Invoice AI Idea' }
  );
  const saved1 = await supabasePost('provenance_nodes', n1);
  nodes.push(saved1);
  printNode(n1, saved1.id);

  // Node 2: Ryan endorses
  console.log('\n   👍 Phase 1b: Endorsement');
  const n2 = makeNode('ryan_obrien', 'endorsement',
    "Ryan O'Brien endorsed Nadia's invoice AI proposal — \"This could save us 180+ hours/year\"",
    "Great idea Nadia. At 2000 invoices/month and ~2 min per classification, that's 66+ hours/month we're burning. If AI gets 90% accuracy, we save 180+ hours/year minimum. Let me get Engineering's take on feasibility.",
    SID, { scenario_name: 'The Invoice AI Idea' }
  );
  const saved2 = await supabasePost('provenance_nodes', n2);
  nodes.push(saved2);
  printNode(n2, saved2.id);
  await supabasePost('provenance_edges', makeEdge(saved1.id, saved2.id, 'endorsed_by'));

  // Node 3: Marcus does feasibility
  console.log('\n   🔍 Phase 2: Feasibility Assessment');
  const n3 = makeNode('marcus_chen', 'feasibility_assessment',
    'Marcus Chen: Feasibility approved — 2-sprint build using existing Claude pipeline, $400/mo inference cost',
    "Reviewed the proposal. Very feasible. We can use our existing Claude pipeline with a fine-tuned classifier. Estimated build: 2 sprints (4 weeks). Inference cost: ~$400/month at 2000 invoices. Accuracy target: 92%+ based on similar classification tasks. Recommending Priya as lead. One consideration: we'll need Legal to review the data handling since invoices contain vendor PII.",
    SID, { scenario_name: 'The Invoice AI Idea' }
  );
  const saved3 = await supabasePost('provenance_nodes', n3);
  nodes.push(saved3);
  printNode(n3, saved3.id);
  await supabasePost('provenance_edges', makeEdge(saved2.id, saved3.id, 'developed_from'));

  // Node 4: Legal review (Diana)
  console.log('\n   ⚖️ Phase 3: Legal Review');
  const n4 = makeNode('diana_reyes', 'approval',
    'Diana Reyes: Legal approved with conditions — vendor PII must be hashed before AI processing, 90-day data retention policy',
    "Reviewed the invoice AI proposal from a regulatory standpoint. Approved with two conditions: (1) All vendor PII (names, tax IDs, bank details) must be SHA-256 hashed before reaching the AI classifier — the model should work on anonymized features only. (2) Raw invoice data retention capped at 90 days per our data lifecycle policy DLR-001. Standard liability framework ILF-001 applies. No GDPR issues since this is B2B vendor data, not consumer PII.",
    SID, { scenario_name: 'The Invoice AI Idea', source_tool: 'docusign' }
  );
  const saved4 = await supabasePost('provenance_nodes', n4);
  nodes.push(saved4);
  printNode(n4, saved4.id);
  await supabasePost('provenance_edges', makeEdge(saved3.id, saved4.id, 'approved_by'));

  // Anchor legal approval on XRPL
  console.log('\n   ⛓️  Anchoring legal approval on XRPL...');
  const anchor1 = await anchorOnXRPL({
    lineage_hash: saved4.content_hash,
    node_ids: [saved4.id],
    scenario_id: SID,
    anchor_type: 'lineage_commit',
    node_type: 'approval',
    actor: 'diana_reyes',
    department: 'legal',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
  printAnchor(anchor1);

  // PATCH the node with anchor data
  const patchRes = await fetch(`${supabaseUrl}/rest/v1/provenance_nodes?id=eq.${saved4.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` },
    body: JSON.stringify({ agl_tx_hash: anchor1.tx_hash, agl_block: anchor1.ledger_index, anchored_at: new Date().toISOString() }),
  });

  // Node 5: Budget approval (Catherine)
  console.log('\n   💰 Phase 4: Budget Approval');
  const n5 = makeNode('catherine_park', 'approval',
    'Catherine Park (CFO): Budget approved — $18K initial build + $4.8K annual inference, projected ROI 340% in Year 1',
    "Budget approved. Numbers: $18K build cost (2 sprints × $9K sprint rate), $400/mo inference = $4.8K/year. Projected savings: 180 hours/year × $45/hr loaded rate = $8,100 direct labor savings. Plus reduced mis-routing (estimated 12% error rate currently) saves another ~$14K in delayed payments and vendor relationship costs. ROI: 340% Year 1. This is a clear go.",
    SID, { scenario_name: 'The Invoice AI Idea', source_tool: 'netsuite' }
  );
  const saved5 = await supabasePost('provenance_nodes', n5);
  nodes.push(saved5);
  printNode(n5, saved5.id);
  await supabasePost('provenance_edges', makeEdge(saved4.id, saved5.id, 'approved_by'));

  // Anchor budget approval on XRPL
  console.log('\n   ⛓️  Anchoring budget approval on XRPL...');
  const anchor2 = await anchorOnXRPL({
    lineage_hash: saved5.content_hash,
    node_ids: [saved5.id],
    scenario_id: SID,
    anchor_type: 'lineage_commit',
    node_type: 'approval',
    actor: 'catherine_park',
    department: 'finance',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
  printAnchor(anchor2);
  await fetch(`${supabaseUrl}/rest/v1/provenance_nodes?id=eq.${saved5.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` },
    body: JSON.stringify({ agl_tx_hash: anchor2.tx_hash, agl_block: anchor2.ledger_index, anchored_at: new Date().toISOString() }),
  });

  // Node 6: Development
  console.log('\n   🔧 Phase 5-7: Development');
  const n6 = makeNode('priya_sharma', 'code_commit',
    'Priya Sharma: Invoice classifier deployed to staging — 94.2% accuracy on test set (2,847 invoices)',
    "Invoice classifier v1.0 deployed to staging. Architecture: Claude Haiku for classification (fast, cheap) with Sonnet fallback for ambiguous cases. Test results on 2,847 historical invoices: 94.2% accuracy overall, 97.1% on department routing, 89.3% on urgency (will improve with fine-tuning). PII hashing pipeline confirmed working per Legal's requirements. PR #247 ready for review.",
    SID, { scenario_name: 'The Invoice AI Idea', source_tool: 'github' }
  );
  const saved6 = await supabasePost('provenance_nodes', n6);
  nodes.push(saved6);
  printNode(n6, saved6.id);
  await supabasePost('provenance_edges', makeEdge(saved5.id, saved6.id, 'developed_from'));

  // Node 7: Production deploy
  console.log('\n   🚀 Phase 8: Deployment');
  const n7 = makeNode('sam_kim', 'deployment_notification',
    'Sam Kim: Invoice AI classifier deployed to production — monitoring active, rollback ready',
    "Invoice AI classifier v1.0 deployed to production. Monitoring: Datadog dashboard live, alert thresholds set (accuracy < 90%, latency > 2s, error rate > 1%). Rollback: one-click via CI/CD pipeline, last known good: v0.9.8 (manual routing). First 24h metrics will determine if we proceed to full automation or keep human-in-loop for high-value invoices (>$50K).",
    SID, { scenario_name: 'The Invoice AI Idea', source_tool: 'github' }
  );
  const saved7 = await supabasePost('provenance_nodes', n7);
  nodes.push(saved7);
  printNode(n7, saved7.id);
  await supabasePost('provenance_edges', makeEdge(saved6.id, saved7.id, 'deployed_from'));

  // Anchor deployment on XRPL
  console.log('\n   ⛓️  Anchoring deployment on XRPL...');
  const deployHash = hashContent(nodes.map(n => n.content_hash).join(''));
  const anchor3 = await anchorOnXRPL({
    lineage_hash: deployHash,
    node_ids: nodes.map(n => n.id),
    scenario_id: SID,
    anchor_type: 'lineage_commit',
    node_type: 'deployment_notification',
    actor: 'sam_kim',
    department: 'engineering',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
  printAnchor(anchor3);
  await fetch(`${supabaseUrl}/rest/v1/provenance_nodes?id=eq.${saved7.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` },
    body: JSON.stringify({ agl_tx_hash: anchor3.tx_hash, agl_block: anchor3.ledger_index, anchored_at: new Date().toISOString() }),
  });

  console.log(`\n   ✅ Scenario 1 complete — ${nodes.length} nodes, 3 XRPL anchors`);
  return nodes;
}


// ════════════════════════════════════════════════════════════
// SCENARIO 1a: Shadow AI Detection — The Legal Brief
// ════════════════════════════════════════════════════════════

async function scenario1a(scenario1Nodes) {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║  SCENARIO 1a: 🔴 Shadow AI Detection             ║');
  console.log('║  Jessica Torres uses ChatGPT for a legal brief   ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  const SID = 'scenario_1a_shadow_ai';
  const nodes = [];

  // Get the legal review node from scenario 1 (node index 2 = Marcus feasibility, which routes to legal)
  const routeFromId = scenario1Nodes?.[2]?.id || 'unknown';

  // Node 1: Jessica receives the proposal
  console.log('   📥 Step 1: Jessica receives the proposal');
  const n1 = makeNode('jessica_torres', 'communication',
    'Jessica Torres receives invoice AI proposal — tasked with preparing brief for Diana Reyes',
    "Jessica, can you prepare a summary brief of this invoice AI proposal for Diana? She needs it for the compliance review meeting at 3pm. The full proposal is attached — 12 pages covering the AI classifier, data handling, PII concerns, and budget projections.",
    SID, { scenario_name: 'Shadow AI Detection — The Legal Brief', source_tool: 'outlook' }
  );
  const saved1 = await supabasePost('provenance_nodes', n1);
  nodes.push(saved1);
  printNode(n1, saved1.id);
  if (routeFromId !== 'unknown') {
    await supabasePost('provenance_edges', makeEdge(routeFromId, saved1.id, 'routed_to'));
  }

  // Node 2: Jessica's "brief" — flagged as shadow AI
  console.log('\n   🔴 Step 2: Jessica submits LLM-generated brief (FLAGGED)');
  const shadowContent = `EXECUTIVE SUMMARY: INVOICE AI CLASSIFICATION PROPOSAL

The proposed AI-driven invoice classification system represents a strategically sound investment with demonstrable ROI potential. Leveraging natural language processing (NLP) and machine learning classification algorithms, the system would automate the categorization of approximately 2,000 monthly invoices across department routing, urgency assessment, and approval workflow optimization.

KEY REGULATORY CONSIDERATIONS:
• GDPR Article 22: The automated processing of vendor data may trigger obligations under the right to meaningful human intervention, particularly where classification decisions impact payment timing.
• SOX Section 302: Financial controls implications require that AI-driven routing decisions maintain adequate audit trails for quarterly certification by the CFO.
• Data Protection Impact Assessment (DPIA): Recommended prior to deployment given the systematic processing of vendor financial data at scale.

RISK ASSESSMENT: LOW-MODERATE
The proposal adequately addresses PII handling through SHA-256 hashing. The 90-day retention policy aligns with our DLR-001 standard. Primary residual risk: model drift over time may degrade classification accuracy below the 92% threshold, necessitating ongoing monitoring and periodic retraining protocols.

RECOMMENDATION: Proceed with implementation subject to the conditions outlined herein.`;

  const n2 = makeNode('jessica_torres', 'content_creation',
    '🔴 Jessica Torres submitted a polished legal brief 47 seconds after receiving a 12-page proposal — SHADOW AI ALERT',
    shadowContent,
    SID, {
      scenario_name: 'Shadow AI Detection — The Legal Brief',
      source_tool: 'sharepoint',
      confidence_override: 0.35,  // Tainted content — confidence dropped
      tags: ['shadow_ai_alert', 'llm_detected', 'quarantined'],
      metadata: {
        alert_type: 'shadow_ai_usage',
        detection_signals: {
          response_time: { value_seconds: 47, baseline_minutes: 45, deviation: '99.8%' },
          style_similarity: { cosine: 0.34, baseline: 0.85, verdict: 'MISMATCH' },
          content_expansion: { injected_refs: ['GDPR Art. 22', 'SOX § 302', 'DPIA'], source_present: false },
          llm_fingerprint: { hedge_phrases: 3, enumeration_score: 0.92, confidence: 0.89 },
        },
        composite_risk_score: 0.94,
        action_taken: 'quarantined',
        original_hash_preserved: true,
      },
    }
  );
  const saved2 = await supabasePost('provenance_nodes', n2);
  nodes.push(saved2);
  printNode(n2, saved2.id);
  await supabasePost('provenance_edges', makeEdge(saved1.id, saved2.id, 'created_by'));

  // Node 3: Alert escalation to Diana
  console.log('\n   🚨 Step 3: Alert escalates to Diana Reyes (General Counsel)');
  const n3 = makeNode('diana_reyes', 'risk_flag',
    'Diana Reyes notified: Shadow AI usage detected — Jessica Torres brief quarantined, original proposal preserved',
    "SHADOW AI ALERT — Automated Detection\n\nDetected: Unauthorized LLM usage by Jessica Torres (Legal Paralegal, Bronze tier)\nContent: Legal brief for invoice AI proposal\nRisk Score: 0.94 (Critical)\nSignals: Response time anomaly (47s vs 45min baseline), style deviation (cosine 0.34), content injection (GDPR Art. 22, SOX §302 — not in source), LLM fingerprint match (89% confidence).\n\nAction: Brief quarantined from Lineage chain. Original proposal preserved with clean hash. Jessica Torres flagged for AI usage policy training (non-punitive per EAP-001 §4.2).\n\nNote: This is a training opportunity, not a disciplinary event. The employee may not have been aware of the AI usage policy. Schedule 1:1 with Rachel Foster (HR) and provide the AIOS AI Acceptable Use training module.",
    SID, {
      scenario_name: 'Shadow AI Detection — The Legal Brief',
      source_tool: 'aios_alert',
      tags: ['shadow_ai_alert', 'escalation', 'non_punitive'],
    }
  );
  const saved3 = await supabasePost('provenance_nodes', n3);
  nodes.push(saved3);
  printNode(n3, saved3.id);
  await supabasePost('provenance_edges', makeEdge(saved2.id, saved3.id, 'escalated_to'));

  // Anchor the shadow AI alert on XRPL — immutable proof of detection
  console.log('\n   ⛓️  Anchoring shadow AI alert on XRPL (immutable proof)...');
  const anchor = await anchorOnXRPL({
    lineage_hash: hashContent(saved2.content_hash + saved3.content_hash),
    node_ids: [saved2.id, saved3.id],
    scenario_id: SID,
    anchor_type: 'incident_report',
    incident_type: 'shadow_ai_usage',
    actor: 'jessica_torres',
    department: 'legal',
    risk_score: 0.94,
    action: 'quarantined',
    non_punitive: true,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
  printAnchor(anchor);

  // Update alert node with anchor
  await fetch(`${supabaseUrl}/rest/v1/provenance_nodes?id=eq.${saved3.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` },
    body: JSON.stringify({ agl_tx_hash: anchor.tx_hash, agl_block: anchor.ledger_index, anchored_at: new Date().toISOString() }),
  });

  // Node 4: HR training scheduled (non-punitive resolution)
  console.log('\n   📋 Step 4: Non-punitive resolution — training scheduled');
  const n4 = makeNode('rachel_foster', 'communication',
    'Rachel Foster: AI usage training scheduled for Jessica Torres — non-punitive, educational per EAP-001',
    "Training session scheduled with Jessica Torres for Tuesday 10am. This is explicitly non-punitive per our Employee AI Protocols (EAP-001 §4.2). Focus areas: (1) Why all AI interactions must go through approved AIOS agents, (2) How the Lineage Layer detects shadow AI usage, (3) How to request AI assistance through proper channels, (4) The approved tool list and how to submit new tool requests. Jessica's work quality is excellent — this is about process, not performance.",
    SID, {
      scenario_name: 'Shadow AI Detection — The Legal Brief',
      source_tool: 'slack',
      tags: ['non_punitive', 'training', 'eap_001'],
    }
  );
  const saved4 = await supabasePost('provenance_nodes', n4);
  nodes.push(saved4);
  printNode(n4, saved4.id);
  await supabasePost('provenance_edges', makeEdge(saved3.id, saved4.id, 'resolved_by'));

  console.log(`\n   ✅ Scenario 1a complete — ${nodes.length} nodes, 1 XRPL anchor (incident_report)`);
  console.log('   🔴 Shadow AI detected → quarantined → anchored → non-punitive resolution');
  return nodes;
}


// ════════════════════════════════════════════════════════════
// SCENARIO 2: Compliance Drift Detection
// ════════════════════════════════════════════════════════════

async function scenario2() {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║  SCENARIO 2: Compliance Drift Detection          ║');
  console.log('║  Legal → Engineering → Ops                       ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  const SID = 'scenario_2_compliance_drift';
  const nodes = [];

  // Node 1: Tom detects EU AI Act drift
  console.log('   🔍 Phase 1: Drift Detection');
  const n1 = makeNode('tom_nakamura', 'risk_flag',
    'Tom Nakamura: EU AI Act compliance drift detected — Article 14 human oversight requirements not met by Invoice Classifier v1.0',
    "Compliance scan flagged: Our Invoice Classifier v1.0 (deployed in Scenario 1) may not meet EU AI Act Article 14 requirements for human oversight in automated decision-making. Specifically: (1) No human review step for invoices auto-routed to 'urgent' queue, (2) No override mechanism for classifications the user disagrees with, (3) Accuracy reporting not surfaced to end users. Risk level: MEDIUM. Recommend Engineering add a human-in-the-loop confirmation for high-value invoices (>$10K) and a feedback mechanism for all classifications.",
    SID, { scenario_name: 'Compliance Drift Detection', source_tool: 'onetrust' }
  );
  const saved1 = await supabasePost('provenance_nodes', n1);
  nodes.push(saved1);
  printNode(n1, saved1.id);

  // Node 2: Marcus assigns remediation
  console.log('\n   🔧 Phase 2: Remediation Assignment');
  const n2 = makeNode('marcus_chen', 'decision',
    'Marcus Chen: Remediation sprint assigned — Priya to add human-in-loop and feedback UI, 1-sprint estimate',
    "Confirmed the compliance gap. Assigning a remediation sprint to Priya: (1) Add human confirmation step for invoices >$10K, (2) Add 'Flag incorrect classification' button on every auto-classified invoice, (3) Surface accuracy metrics in a monthly compliance report for Tom's review. Estimate: 1 sprint. This is a CRM-001 change — behavioral change notice required before deployment.",
    SID, { scenario_name: 'Compliance Drift Detection' }
  );
  const saved2 = await supabasePost('provenance_nodes', n2);
  nodes.push(saved2);
  printNode(n2, saved2.id);
  await supabasePost('provenance_edges', makeEdge(saved1.id, saved2.id, 'remediated_by'));

  // Node 3: Fix deployed
  console.log('\n   ✅ Phase 3: Fix Deployed');
  const n3 = makeNode('priya_sharma', 'deployment_notification',
    'Priya Sharma: Invoice Classifier v1.1 deployed — human-in-loop for >$10K, feedback UI, accuracy dashboard',
    "Invoice Classifier v1.1 deployed. Changes: (1) Human confirmation required for invoices >$10K — auto-classified but held for manual approval, (2) 'Report incorrect classification' button added — feeds back to retraining pipeline, (3) Monthly compliance dashboard live at /reports/classification-accuracy. EU AI Act Article 14 requirements now satisfied. CRM-001 change notice issued.",
    SID, { scenario_name: 'Compliance Drift Detection', source_tool: 'github' }
  );
  const saved3 = await supabasePost('provenance_nodes', n3);
  nodes.push(saved3);
  printNode(n3, saved3.id);
  await supabasePost('provenance_edges', makeEdge(saved2.id, saved3.id, 'developed_from'));

  // Node 4: Compliance verified
  console.log('\n   ✅ Phase 4: Compliance Verified');
  const n4 = makeNode('tom_nakamura', 'compliance_verification',
    'Tom Nakamura: EU AI Act compliance verified — Article 14 human oversight requirements now met',
    "Re-scanned Invoice Classifier v1.1 against EU AI Act compliance matrix. All Article 14 requirements now satisfied: (1) Human oversight present for high-value decisions ✅, (2) User-accessible override mechanism ✅, (3) Accuracy reporting and transparency ✅. Closing compliance drift ticket. Next scheduled scan: 30 days.",
    SID, { scenario_name: 'Compliance Drift Detection', source_tool: 'onetrust' }
  );
  const saved4 = await supabasePost('provenance_nodes', n4);
  nodes.push(saved4);
  printNode(n4, saved4.id);
  await supabasePost('provenance_edges', makeEdge(saved3.id, saved4.id, 'verified_by'));

  // Anchor compliance attestation on XRPL
  console.log('\n   ⛓️  Anchoring compliance attestation on XRPL...');
  const anchor = await anchorOnXRPL({
    lineage_hash: hashContent(nodes.map(n => n.content_hash).join('')),
    node_ids: nodes.map(n => n.id),
    scenario_id: SID,
    anchor_type: 'compliance_attest',
    standard: 'EU_AI_ACT_ART14',
    status: 'PASS',
    actor: 'tom_nakamura',
    department: 'legal',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
  printAnchor(anchor);
  await fetch(`${supabaseUrl}/rest/v1/provenance_nodes?id=eq.${saved4.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` },
    body: JSON.stringify({ agl_tx_hash: anchor.tx_hash, agl_block: anchor.ledger_index, anchored_at: new Date().toISOString() }),
  });

  console.log(`\n   ✅ Scenario 2 complete — ${nodes.length} nodes, 1 XRPL anchor (compliance_attest)`);
  return nodes;
}


// ════════════════════════════════════════════════════════════
// SCENARIO 3: The Audit Failure
// ════════════════════════════════════════════════════════════

async function scenario3() {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║  SCENARIO 3: The Audit Failure                   ║');
  console.log('║  Finance → Legal → Investigation → Resolution    ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  const SID = 'scenario_3_audit_failure';
  const nodes = [];

  // Node 1: Derek discovers duplicate payment
  console.log('   🚨 Phase 1: Incident Detection');
  const n1 = makeNode('derek_williams', 'risk_flag',
    'Derek Williams: Duplicate payment detected — Vendor #4472 paid $23,400 twice for the same invoice in October',
    "Found a duplicate payment during monthly reconciliation. Vendor #4472 (TechFlow Solutions) was paid $23,400 on Oct 3 (ACH #88291) and again $23,400 on Oct 17 (ACH #88347) for the same invoice INV-TF-2026-0891. The second payment was auto-approved through the invoice routing system. Total overpayment: $23,400. Flagging to Ryan and Catherine immediately.",
    SID, { scenario_name: 'The Audit Failure', source_tool: 'netsuite' }
  );
  const saved1 = await supabasePost('provenance_nodes', n1);
  nodes.push(saved1);
  printNode(n1, saved1.id);

  // Node 2: Catherine opens AIRS investigation
  console.log('\n   🔍 Phase 2: Investigation (AIRS-001)');
  const n2 = makeNode('catherine_park', 'decision',
    'Catherine Park: AIRS-001 Tier 2 incident opened — duplicate payment investigation, Lineage forensics requested',
    "Opening a Tier 2 incident per AIRS-001 (AI Incident Response Standard). The duplicate payment bypassed our duplicate detection logic — this is a system failure, not a human error. Requesting Lineage forensics: pull the full provenance chain for both payments. I want to know: (1) Who submitted the second invoice? (2) Did the AI classifier process both? (3) Why didn't the duplicate check catch it? (4) Was the vendor's invoice legitimately submitted twice? Recovery: contacting TechFlow Solutions for $23,400 refund.",
    SID, { scenario_name: 'The Audit Failure', source_tool: 'netsuite' }
  );
  const saved2 = await supabasePost('provenance_nodes', n2);
  nodes.push(saved2);
  printNode(n2, saved2.id);
  await supabasePost('provenance_edges', makeEdge(saved1.id, saved2.id, 'escalated_to'));

  // Node 3: Root cause found
  console.log('\n   🔬 Phase 3: Root Cause Analysis');
  const n3 = makeNode('priya_sharma', 'feasibility_assessment',
    'Priya Sharma: Root cause identified — Invoice Classifier treated reformatted PDF as new invoice, missing content-based dedup',
    "Root cause: The vendor resubmitted the same invoice as a reformatted PDF (different filename, different layout, same data). Our classifier hashed the PDF bytes (different hash = different document) instead of hashing the extracted content (same hash = duplicate). The duplicate detection was checking file hash, not semantic content. Fix: implement content-based deduplication — extract key fields (vendor ID, amount, date, invoice number) and hash those. Estimated fix: 1 day.",
    SID, { scenario_name: 'The Audit Failure', source_tool: 'github' }
  );
  const saved3 = await supabasePost('provenance_nodes', n3);
  nodes.push(saved3);
  printNode(n3, saved3.id);
  await supabasePost('provenance_edges', makeEdge(saved2.id, saved3.id, 'investigated_by'));

  // Node 4: Resolution
  console.log('\n   ✅ Phase 4: Resolution');
  const n4 = makeNode('catherine_park', 'decision',
    'Catherine Park: Incident resolved — content-based dedup deployed, $23,400 refund received, AIRS-001 report filed',
    "Incident closed. Resolution: (1) Content-based deduplication deployed — extracts key invoice fields and hashes those instead of raw PDF bytes, (2) $23,400 refund received from TechFlow Solutions on Oct 28, (3) Retroactive scan of all October invoices found no other duplicates, (4) AIRS-001 Tier 2 incident report filed with full Lineage chain attached. Root cause: classifier design flaw (file-hash vs content-hash). Systemic fix confirmed working.",
    SID, { scenario_name: 'The Audit Failure', source_tool: 'netsuite' }
  );
  const saved4 = await supabasePost('provenance_nodes', n4);
  nodes.push(saved4);
  printNode(n4, saved4.id);
  await supabasePost('provenance_edges', makeEdge(saved3.id, saved4.id, 'resolved_by'));

  // Anchor incident report on XRPL
  console.log('\n   ⛓️  Anchoring incident report on XRPL...');
  const anchor = await anchorOnXRPL({
    lineage_hash: hashContent(nodes.map(n => n.content_hash).join('')),
    node_ids: nodes.map(n => n.id),
    scenario_id: SID,
    anchor_type: 'incident_report',
    incident_tier: 2,
    standard: 'AIRS-001',
    resolution: 'content_based_dedup_deployed',
    financial_impact: 23400,
    recovered: true,
    actor: 'catherine_park',
    department: 'finance',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
  printAnchor(anchor);
  await fetch(`${supabaseUrl}/rest/v1/provenance_nodes?id=eq.${saved4.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` },
    body: JSON.stringify({ agl_tx_hash: anchor.tx_hash, agl_block: anchor.ledger_index, anchored_at: new Date().toISOString() }),
  });

  console.log(`\n   ✅ Scenario 3 complete — ${nodes.length} nodes, 1 XRPL anchor (incident_report)`);
  return nodes;
}


// ════════════════════════════════════════════════════════════
// SCENARIO 4: AI Agent Deployment
// ════════════════════════════════════════════════════════════

async function scenario4() {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║  SCENARIO 4: AI Agent Deployment                 ║');
  console.log('║  Eng → Legal → HR → Deploy → Monitor             ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  const SID = 'scenario_4_agent_deploy';
  const nodes = [];

  // Node 1: Marcus proposes new agent
  console.log('   📋 Phase 1: Agent Proposal');
  const n1 = makeNode('marcus_chen', 'idea_origin',
    'Marcus Chen: Proposing AI agent for automated code review — Claude Sonnet, L3 clearance, engineering dept only',
    "Proposing a new AI agent: Automated Code Review Agent. Model: Claude Sonnet (latest). Purpose: Review all PRs for security vulnerabilities, code style violations, and performance anti-patterns before human review. Proposed clearance: L3 (can read code repos, cannot write/deploy). Scope: Engineering department only. Expected impact: reduce human review time by 40%, catch security issues earlier. Need Legal sign-off on data handling (agent sees proprietary code) and HR sign-off on workforce impact assessment.",
    SID, { scenario_name: 'AI Agent Deployment' }
  );
  const saved1 = await supabasePost('provenance_nodes', n1);
  nodes.push(saved1);
  printNode(n1, saved1.id);

  // Node 2: Legal reviews agent
  console.log('\n   ⚖️ Phase 2: Legal Review');
  const n2 = makeNode('laura_medina', 'approval',
    'Laura Medina: Agent approved with conditions — no external data egress, code stays in-network, quarterly audit',
    "Reviewed the Code Review Agent proposal. Approved with conditions: (1) Agent must run in our infrastructure — no code sent to external APIs (AIOS on-prem deployment required per SOV-001), (2) Agent's .oraya identity passport must be L3 with read-only access — cannot push code, merge PRs, or access production secrets, (3) Quarterly audit of agent decisions per MGP-001 Model Governance Protocol, (4) Employee disclosure required per EAP-001 §3.1 — all engineers must be informed the agent is reviewing their code.",
    SID, { scenario_name: 'AI Agent Deployment', source_tool: 'ironclad' }
  );
  const saved2 = await supabasePost('provenance_nodes', n2);
  nodes.push(saved2);
  printNode(n2, saved2.id);
  await supabasePost('provenance_edges', makeEdge(saved1.id, saved2.id, 'approved_by'));

  // Node 3: HR workforce assessment
  console.log('\n   👥 Phase 3: Workforce Impact Assessment');
  const n3 = makeNode('rachel_foster', 'approval',
    'Rachel Foster: Workforce assessment complete — agent augments, does not replace. No displacement per HDS-001',
    "Workforce impact assessment complete for Code Review Agent. Finding: AUGMENTATION, not displacement. The agent handles first-pass review (security patterns, style checks) while senior engineers focus on architecture, logic, and mentoring. No reduction in engineering headcount. Aligns with Human Displacement Solutions standard HDS-001 Track 2 (Augmentation). All engineers informed via team meeting. No objections. Approved.",
    SID, { scenario_name: 'AI Agent Deployment', source_tool: 'slack' }
  );
  const saved3 = await supabasePost('provenance_nodes', n3);
  nodes.push(saved3);
  printNode(n3, saved3.id);
  await supabasePost('provenance_edges', makeEdge(saved2.id, saved3.id, 'approved_by'));

  // Node 4: Agent identity registered
  console.log('\n   🤖 Phase 4: Agent Identity Registration');
  const n4 = makeNode('priya_sharma', 'code_commit',
    'Priya Sharma: Code Review Agent registered — .oraya passport issued, L3 clearance, agent ID: cr_agent_v1',
    "Code Review Agent deployed and registered. Agent Identity: cr_agent_v1. .oraya passport: issued with L3 clearance (read-only code access, engineering dept only). Model: Claude Sonnet 4. Deployment: AIOS on-prem (Linode GPU instance). Monitoring: All agent decisions logged to Lineage Layer with full input/output provenance. Pre-Crime Monitor threshold: standard. First 100 reviews will be human-verified to calibrate accuracy baseline.",
    SID, { scenario_name: 'AI Agent Deployment', source_tool: 'github' }
  );
  const saved4 = await supabasePost('provenance_nodes', n4);
  nodes.push(saved4);
  printNode(n4, saved4.id);
  await supabasePost('provenance_edges', makeEdge(saved3.id, saved4.id, 'developed_from'));

  // Anchor agent identity on XRPL
  console.log('\n   ⛓️  Anchoring agent identity on XRPL...');
  const anchor1 = await anchorOnXRPL({
    lineage_hash: hashContent(saved4.content_hash),
    node_ids: [saved4.id],
    scenario_id: SID,
    anchor_type: 'agent_identity',
    agent_id: 'cr_agent_v1',
    clearance: 'L3',
    model: 'claude-sonnet-4',
    department: 'engineering',
    actor: 'priya_sharma',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
  printAnchor(anchor1);
  await fetch(`${supabaseUrl}/rest/v1/provenance_nodes?id=eq.${saved4.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` },
    body: JSON.stringify({ agl_tx_hash: anchor1.tx_hash, agl_block: anchor1.ledger_index, anchored_at: new Date().toISOString() }),
  });

  // Node 5: Agent's first review (approved AI — contrast with shadow AI)
  console.log('\n   🤖 Phase 5: Agent First Review (Approved AI — Full Lineage)');
  const n5 = makeNode('aios_doc_agent', 'ai_generation',
    'AIOS Code Review Agent: First automated review completed — 3 security findings, 7 style issues, full Lineage recorded',
    "Automated Code Review — PR #312 (auth-middleware refactor)\nAgent: cr_agent_v1 | Model: Claude Sonnet 4 | Clearance: L3\n\nFindings:\n🔴 SECURITY (3): SQL injection risk in query builder (L47), hardcoded API key in test fixture (L203), missing input validation on user_id param (L89)\n🟡 STYLE (7): Inconsistent error handling pattern, unused import (line 12), missing JSDoc on 3 exported functions, variable naming convention violations\n🟢 PERFORMANCE (0): No issues detected\n\nRecommendation: Block merge until security findings resolved. Style issues are non-blocking.\n\nNote: This review has FULL Lineage provenance — input (PR diff), model (Claude Sonnet 4), output (findings), and agent identity (cr_agent_v1, L3). Compare to Scenario 1a where Jessica's ChatGPT usage had NO provenance chain.",
    SID, { scenario_name: 'AI Agent Deployment', source_tool: 'aios_agent',
      tags: ['approved_ai', 'full_provenance', 'agent_review'],
      metadata: {
        agent_id: 'cr_agent_v1',
        model: 'claude-sonnet-4',
        clearance: 'L3',
        pr_number: 312,
        findings: { security: 3, style: 7, performance: 0 },
      },
    }
  );
  const saved5 = await supabasePost('provenance_nodes', n5);
  nodes.push(saved5);
  printNode(n5, saved5.id);
  await supabasePost('provenance_edges', makeEdge(saved4.id, saved5.id, 'generated_by'));

  console.log(`\n   ✅ Scenario 4 complete — ${nodes.length} nodes, 1 XRPL anchor (agent_identity)`);
  console.log('   🤖 Approved AI contrast: full Lineage chain vs. shadow AI gap');
  return nodes;
}


// ════════════════════════════════════════════════════════════
// MAIN — Run All Scenarios
// ════════════════════════════════════════════════════════════

async function main() {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║   AIOS × XRPL · Meridian Dynamics Demo Runner       ║');
  console.log('║   Lineage → Supabase → XRPL Testnet Anchoring       ║');
  console.log('╠══════════════════════════════════════════════════════╣');
  console.log(`║   Supabase: ${supabaseUrl ? '✅ Connected' : '❌ Missing'}                              ║`);
  console.log('╚══════════════════════════════════════════════════════╝\n');

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env');
    process.exit(1);
  }

  // Initialize XRPL
  console.log('🌐 Initializing XRPL Testnet connection...');
  await initXRPL();

  // Run scenarios
  const s1Nodes = await scenario1();
  const s1aNodes = await scenario1a(s1Nodes);
  const s2Nodes = await scenario2();
  const s3Nodes = await scenario3();
  const s4Nodes = await scenario4();

  // Summary
  const totalNodes = s1Nodes.length + s1aNodes.length + s2Nodes.length + s3Nodes.length + s4Nodes.length;
  console.log('\n');
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║   DEMO RUN COMPLETE                                  ║');
  console.log('╠══════════════════════════════════════════════════════╣');
  console.log(`║   Total Provenance Nodes:  ${String(totalNodes).padEnd(3)}                        ║`);
  console.log(`║   Scenario 1 (Invoice AI): ${s1Nodes.length} nodes                        ║`);
  console.log(`║   Scenario 1a (Shadow AI): ${s1aNodes.length} nodes  🔴                     ║`);
  console.log(`║   Scenario 2 (Compliance): ${s2Nodes.length} nodes                        ║`);
  console.log(`║   Scenario 3 (Audit):      ${s3Nodes.length} nodes                        ║`);
  console.log(`║   Scenario 4 (Agent):      ${s4Nodes.length} nodes                        ║`);
  console.log('║                                                      ║');
  console.log('║   XRPL Anchors: ~8 transactions on testnet           ║');
  console.log('║   All verifiable at testnet.xrpl.org                 ║');
  console.log('╚══════════════════════════════════════════════════════╝');

  await xrplClient.disconnect();
  console.log('\n✅ Disconnected from XRPL Testnet. Demo data ready.\n');
}

main().catch(err => {
  console.error('❌ Fatal:', err.message);
  console.error(err.stack);
  process.exit(1);
});
