/**
 * Full End-to-End Pipeline Test
 * Slack message → Classify → Write Provenance Node to Supabase
 * 
 * Run: node scripts/test-pipeline.mjs
 */

import 'dotenv/config';
import { createHash } from 'crypto';

const slackToken = process.env.SLACK_BOT_TOKEN;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY;

// ── Slack API ──────────────────────────────────────────────

async function slackApi(method, params = {}) {
  const url = new URL(`https://slack.com/api/${method}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), {
    headers: { 'Authorization': `Bearer ${slackToken}` },
  });
  return res.json();
}

// ── Message Classification ─────────────────────────────────

function classifyMessage(text) {
  const lower = text.toLowerCase();
  if (lower.includes('what if') || lower.includes('idea') || lower.includes('proposal')) return 'idea_origin';
  if (lower.includes('approved') || lower.includes('lgtm')) return 'approval';
  if (lower.includes('let\'s do') || lower.includes('decided')) return 'decision';
  if (lower.includes('feasible') || lower.includes('estimate')) return 'feasibility_assessment';
  if (lower.includes('risk') || lower.includes('concern')) return 'risk_flag';
  if (lower.includes('deployed') || lower.includes('shipped')) return 'deployment_notification';
  return 'communication';
}

// ── Supabase Write ─────────────────────────────────────────

async function writeProvenanceNode(node) {
  const res = await fetch(`${supabaseUrl}/rest/v1/provenance_nodes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(node),
  });
  
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Supabase write failed: ${res.status} ${err}`);
  }
  return res.json();
}

// ── Persona Map ────────────────────────────────────────────
// Maps Slack user IDs to Meridian personas

const PERSONA_MAP = {
  'U0AN9UT6K0S': {
    actor_id: 'nadia_hassan', 
    actor_name: 'Nadia Hassan (via meridian-dynamics)',
    department: 'finance',
    auth_method: 'sso_mfa',
    auth_tier: 'silver',
    confidence: 0.85,
    device: 'MacBook Pro M3',
  },
  'U0ANNU3BB6D': {
    actor_id: 'catherine_park',
    actor_name: 'Catherine Park (via fran)',
    department: 'finance',
    auth_method: 'yubikey_biometric',
    auth_tier: 'platinum',
    confidence: 0.99,
    device: 'MacBook Pro M4 + YubiKey 5',
  },
};

// ── Main Pipeline ──────────────────────────────────────────

async function main() {
  console.log('🔗 AIOS Lineage Pipeline — End-to-End Test');
  console.log('=========================================\n');

  // Step 1: Read messages from Slack
  console.log('📥 Step 1: Reading messages from Slack...');
  
  const channels = await slackApi('conversations.list', { types: 'public_channel' });
  const botChannels = channels.channels.filter(c => c.is_member);
  
  if (botChannels.length === 0) {
    console.log('❌ Bot not in any channels. Invite it first.');
    process.exit(1);
  }

  let allMessages = [];
  for (const ch of botChannels) {
    const history = await slackApi('conversations.history', { channel: ch.id, limit: '20' });
    if (history.ok) {
      for (const msg of history.messages) {
        if (msg.user && msg.type === 'message' && !msg.subtype) {
          allMessages.push({ ...msg, channel_name: ch.name, channel_id: ch.id });
        }
      }
    }
  }
  
  console.log(`   Found ${allMessages.length} user message(s)\n`);

  if (allMessages.length === 0) {
    console.log('⚠️  No user messages found. Post a message in a channel where the bot is invited.');
    process.exit(0);
  }

  // Step 2: Classify each message
  console.log('🏷️  Step 2: Classifying messages...');
  for (const msg of allMessages) {
    const nodeType = classifyMessage(msg.text);
    msg._nodeType = nodeType;
    console.log(`   [${nodeType}] "${msg.text.substring(0, 60)}..."`);
  }

  // Step 3: Write provenance nodes to Supabase
  console.log('\n📝 Step 3: Writing provenance nodes to Supabase...');

  if (!supabaseUrl || !supabaseKey) {
    console.log('⚠️  Missing SUPABASE_URL or SUPABASE_ANON_KEY/SUPABASE_SERVICE_KEY in .env');
    console.log('   Showing what WOULD be written:\n');
    
    for (const msg of allMessages) {
      const persona = PERSONA_MAP[msg.user] || {
        actor_id: 'unknown_' + msg.user,
        actor_name: `Unknown User (${msg.user})`,
        department: 'engineering',
        auth_method: 'sso_mfa',
        auth_tier: 'silver',
        confidence: 0.85,
        device: 'Unknown',
      };
      
      const node = {
        node_type: msg._nodeType,
        source_tool: 'slack',
        source_ref: `${msg.channel_id}:${msg.ts}`,
        content_hash: createHash('sha256').update(msg.text + msg.ts).digest('hex'),
        summary: `${persona.actor_name} in #${msg.channel_name}: "${msg.text.substring(0, 120)}"`,
        ...persona,
        metadata: {
          channel_id: msg.channel_id,
          channel_name: msg.channel_name,
          slack_ts: msg.ts,
          text: msg.text,
        },
        tags: [`channel:${msg.channel_name}`, `dept:${persona.department}`, msg._nodeType],
      };

      console.log('   Node:', JSON.stringify(node, null, 2));
    }
    
    console.log('\n✅ Pipeline test complete (dry run — add Supabase keys to .env for real writes)');
    return;
  }

  // Real write
  let written = 0;
  for (const msg of allMessages) {
    const persona = PERSONA_MAP[msg.user] || {
      actor_id: 'unknown_' + msg.user,
      actor_name: `Unknown User (${msg.user})`,
      department: 'engineering',
      auth_method: 'sso_mfa',
      auth_tier: 'silver',
      confidence: 0.85,
      device: 'Unknown',
    };

    const node = {
      node_type: msg._nodeType,
      source_tool: 'slack',
      source_ref: `${msg.channel_id}:${msg.ts}`,
      content_hash: createHash('sha256').update(msg.text + msg.ts).digest('hex'),
      summary: `${persona.actor_name} in #${msg.channel_name}: "${msg.text.substring(0, 120)}"`,
      ...persona,
      metadata: {
        channel_id: msg.channel_id,
        channel_name: msg.channel_name,
        slack_ts: msg.ts,
        text: msg.text,
      },
      tags: [`channel:${msg.channel_name}`, `dept:${persona.department}`, msg._nodeType],
    };

    try {
      const result = await writeProvenanceNode(node);
      const saved = Array.isArray(result) ? result[0] : result;
      console.log(`   ✅ Node ${saved.id} — [${node.node_type}] ${node.summary.substring(0, 60)}...`);
      written++;
    } catch (err) {
      console.log(`   ❌ Failed: ${err.message}`);
    }
  }

  console.log(`\n🎉 Pipeline complete! ${written} provenance node(s) written to Supabase.`);
  console.log('   → View in Supabase: Table Editor → provenance_nodes');
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
