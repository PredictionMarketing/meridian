/**
 * Quick Slack Connection Test
 * Tests: auth, channel listing, user listing
 * Run: node scripts/test-slack.mjs
 */

import 'dotenv/config';

const token = process.env.SLACK_BOT_TOKEN;
if (!token) {
  console.error('❌ Missing SLACK_BOT_TOKEN in .env');
  process.exit(1);
}

async function slackApi(method, params = {}) {
  const url = new URL(`https://slack.com/api/${method}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return res.json();
}

async function main() {
  console.log('🔌 Testing Slack Connection...\n');

  // 1. Auth test
  const auth = await slackApi('auth.test');
  if (!auth.ok) {
    console.error('❌ Auth failed:', auth.error);
    process.exit(1);
  }
  console.log(`✅ Connected as: ${auth.user}`);
  console.log(`   Team: ${auth.team}`);
  console.log(`   Team ID: ${auth.team_id}`);
  console.log(`   Bot ID: ${auth.bot_id}\n`);

  // 2. List channels
  const channels = await slackApi('conversations.list', { types: 'public_channel', limit: '50' });
  if (channels.ok) {
    console.log(`📢 Channels (${channels.channels.length}):`);
    for (const ch of channels.channels) {
      const botIn = ch.is_member ? '✅' : '❌';
      console.log(`   ${botIn} #${ch.name} (${ch.num_members} members)`);
    }
  } else {
    console.log(`⚠️  Channels: ${channels.error}`);
  }

  // 3. List users
  console.log('');
  const users = await slackApi('users.list');
  if (users.ok) {
    const realUsers = users.members.filter(u => !u.is_bot && !u.deleted && u.id !== 'USLACKBOT');
    console.log(`👥 Users (${realUsers.length}):`);
    for (const u of realUsers) {
      console.log(`   ${u.id}: ${u.real_name || u.name} (${u.profile?.email || 'no email'})`);
    }
    
    const bots = users.members.filter(u => u.is_bot && !u.deleted);
    console.log(`\n🤖 Bots (${bots.length}):`);
    for (const b of bots) {
      console.log(`   ${b.id}: ${b.real_name || b.name}`);
    }
  } else {
    console.log(`⚠️  Users: ${users.error}`);
  }

  // 4. Try reading messages from first channel bot is in
  console.log('');
  if (channels.ok) {
    const botChannels = channels.channels.filter(c => c.is_member);
    if (botChannels.length > 0) {
      const ch = botChannels[0];
      const history = await slackApi('conversations.history', { channel: ch.id, limit: '5' });
      if (history.ok) {
        console.log(`💬 Recent messages in #${ch.name} (${history.messages.length}):`);
        for (const msg of history.messages) {
          const preview = (msg.text || '').substring(0, 80);
          console.log(`   [${msg.user || 'system'}] ${preview}`);
        }
      } else {
        console.log(`⚠️  History for #${ch.name}: ${history.error}`);
      }
    } else {
      console.log('⚠️  Bot is not a member of any channels yet.');
      console.log('   → Invite it with: /invite @AIOS Lineage Tracker');
    }
  }

  console.log('\n✅ Slack connection test complete!');
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
