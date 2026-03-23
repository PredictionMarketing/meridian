# Slack Connector Setup — Meridian Dynamics

## Step 1: Create a Slack App

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Click **"Create New App"** → **"From scratch"**
3. App Name: `AIOS Lineage Tracker`
4. Workspace: Select your Meridian Dynamics workspace
5. Click "Create App"

## Step 2: Bot Token Scopes (Permissions)

Go to **"OAuth & Permissions"** in the sidebar:

Under **Bot Token Scopes**, add these:

| Scope | Why |
|-------|-----|
| `channels:history` | Read messages from public channels |
| `channels:read` | List public channels |
| `groups:history` | Read messages from private channels |
| `groups:read` | List private channels |
| `reactions:read` | Read emoji reactions |
| `users:read` | Get user info (names, emails) |
| `users:read.email` | Map emails to Meridian personas |

## Step 3: Install to Workspace

1. On the **"OAuth & Permissions"** page, click **"Install to Workspace"**
2. Review the permissions and click **"Allow"**
3. Copy the **Bot User OAuth Token** — starts with `xoxb-`

## Step 4: Get Signing Secret

1. Go to **"Basic Information"** in the sidebar
2. Under **"App Credentials"**, copy the **Signing Secret**

## Step 5: Add Bot to Channels

The bot needs to be **invited** to each channel it should read:

```
/invite @AIOS Lineage Tracker
```

Do this in every channel you want Lineage to track:
- `#general`
- `#engineering`
- `#product-ideas`
- `#finance`
- `#procurement`
- `#legal`
- `#compliance`
- `#sales`
- `#support`
- `#leadership`

## Step 6: Map Slack Users to Personas

After the bot is installed, run this to get Slack user IDs:

```bash
curl -H "Authorization: Bearer xoxb-YOUR-TOKEN" \
  https://slack.com/api/users.list | jq '.members[] | {id, name, real_name: .profile.real_name}'
```

Then update the persona map in your connector config:

```typescript
const personaMap = {
  'U_SLACK_ID_1': 'nadia_hassan',
  'U_SLACK_ID_2': 'ryan_obrien',
  'U_SLACK_ID_3': 'marcus_chen',
  // ... map each Slack user to their Meridian persona ID
};
```

## Step 7: Configure Environment

Add to `.env`:

```
SLACK_BOT_TOKEN=xoxb-your-bot-token-here
SLACK_SIGNING_SECRET=your-signing-secret-here
```

## Step 8: Test

```bash
npx ts-node scripts/test-slack.ts
```

This will:
1. Connect to Slack API
2. List all channels the bot can see
3. Pull recent messages
4. Record them as provenance nodes
5. Print node count

## Channels to Create

For the lifecycle walkthrough demo, create these channels:

| Channel | Department | Purpose |
|---------|-----------|---------|
| `#general` | All | Company-wide announcements |
| `#product-ideas` | Cross-dept | Where ideas originate (Phase 1) |
| `#engineering` | Engineering | Dev discussions |
| `#finance` | Finance | Budget, procurement |
| `#procurement` | Finance | Vendor and purchasing |
| `#legal` | Legal | Compliance, contracts |
| `#compliance` | Legal | Regulatory discussions |
| `#sales` | Sales | Pipeline, deals |
| `#support` | Support | Customer issues |
| `#leadership` | Cross-dept | Executive discussions |
| `#ai-implementations` | Cross-dept | AI project tracking (lifecycle) |

## What Gets Tracked

Every message becomes a provenance node with:
- **Identity**: Who sent it, their auth tier, confidence score
- **Classification**: Idea, approval, decision, risk flag, etc.
- **Context**: Channel, thread, reactions, reply count
- **Hash**: SHA-256 of message content for integrity

Thread replies create **edges** (replied_to relationship).
Reactions create **endorsement nodes** with edges back to the original message.
Cross-department reactions flag **cross_dept = true** on edges.
