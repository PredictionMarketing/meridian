// ============================================
// Slack Connector — Meridian Dynamics
// ============================================
// Reads messages, threads, reactions, and channel activity
// from the Meridian Dynamics Slack workspace and records
// each as a provenance node in the Lineage Layer.
//
// This is the #1 priority connector because Slack captures:
// - Idea origins (Phase 1 of lifecycle)
// - Cross-department endorsements
// - Decision discussions
// - Informal approvals

import { BaseConnector, ConnectorConfig } from './base-connector';
import { LineageService, ProvenanceNode } from '../../lineage/src/lineage.service';
import { getPersona, PERSONAS, Persona } from '../../../config/organization';
import { createHash } from 'crypto';

// ── Slack API Types ────────────────────────────────────────

interface SlackMessage {
  type: string;
  ts: string;                  // Slack timestamp (unique message ID)
  user: string;                // Slack user ID
  text: string;
  thread_ts?: string;          // If in a thread
  channel: string;
  reactions?: SlackReaction[];
  reply_count?: number;
  reply_users_count?: number;
}

interface SlackReaction {
  name: string;                // emoji name
  count: number;
  users: string[];             // Slack user IDs who reacted
}

interface SlackChannel {
  id: string;
  name: string;
  topic?: { value: string };
  purpose?: { value: string };
  num_members: number;
}

interface SlackUser {
  id: string;
  name: string;
  real_name: string;
  profile: {
    email?: string;
    display_name?: string;
  };
}

// ── Slack → Persona Mapping ────────────────────────────────
// Maps Slack user IDs to Meridian personas.
// This gets populated when we set up the workspace.

export interface SlackPersonaMap {
  [slackUserId: string]: string;  // Slack ID → persona ID
}

// ── Slack Connector ────────────────────────────────────────

export class SlackConnector extends BaseConnector {
  private botToken: string;
  private signingSecret: string;
  private personaMap: SlackPersonaMap;
  private channelDeptMap: Record<string, string>;  // channel name → department

  constructor(
    config: ConnectorConfig,
    lineage: LineageService,
    personaMap: SlackPersonaMap,
    channelDeptMap?: Record<string, string>,
  ) {
    super(config, lineage);
    this.botToken = config.credentials.bot_token;
    this.signingSecret = config.credentials.signing_secret;
    this.personaMap = personaMap;

    // Default channel → department mapping for Meridian
    this.channelDeptMap = channelDeptMap || {
      'general': 'engineering',
      'engineering': 'engineering',
      'product-ideas': 'engineering',
      'legal': 'legal',
      'compliance': 'legal',
      'finance': 'finance',
      'procurement': 'finance',
      'people-ops': 'people',
      'recruiting': 'people',
      'sales': 'sales',
      'revenue-ops': 'sales',
      'support': 'support',
      'customer-success': 'support',
      'leadership': 'finance',     // cross-dept, default to finance
      'announcements': 'engineering',
    };
  }

  // ── Slack API Helpers ──────────────────────────────────

  private async slackApi(method: string, params: Record<string, string> = {}): Promise<any> {
    const url = new URL(`https://slack.com/api/${method}`);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${this.botToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data = await response.json();
    if (!data.ok) {
      throw new Error(`Slack API ${method} failed: ${data.error}`);
    }
    return data;
  }

  // ── Connection Test ────────────────────────────────────

  async testConnection(): Promise<boolean> {
    try {
      const result = await this.slackApi('auth.test');
      console.log(`[Slack] Connected as: ${result.user} in ${result.team}`);
      this.status.connected = true;
      return true;
    } catch (error) {
      console.error(`[Slack] Connection failed:`, error);
      this.status.connected = false;
      this.status.lastError = String(error);
      return false;
    }
  }

  // ── Sync (Pull Messages → Lineage Nodes) ──────────────

  async sync(): Promise<{ nodesCreated: number; edgesCreated: number }> {
    let nodesCreated = 0;
    let edgesCreated = 0;

    // Get all channels
    const channels = await this.getChannels();
    console.log(`[Slack] Found ${channels.length} channels`);

    for (const channel of channels) {
      const result = await this.syncChannel(channel);
      nodesCreated += result.nodesCreated;
      edgesCreated += result.edgesCreated;
    }

    this.status.lastSync = new Date();
    console.log(`[Slack] Sync complete: ${nodesCreated} nodes, ${edgesCreated} edges`);
    return { nodesCreated, edgesCreated };
  }

  // ── Channel Sync ───────────────────────────────────────

  private async syncChannel(
    channel: SlackChannel,
  ): Promise<{ nodesCreated: number; edgesCreated: number }> {
    let nodesCreated = 0;
    let edgesCreated = 0;

    const department = this.channelDeptMap[channel.name] || 'engineering';

    // Get recent messages (last 100)
    const data = await this.slackApi('conversations.history', {
      channel: channel.id,
      limit: '100',
    });

    const messages: SlackMessage[] = data.messages || [];
    console.log(`[Slack] #${channel.name}: ${messages.length} messages`);

    // Track parent nodes for threading edges
    const messageNodeMap = new Map<string, string>(); // slack_ts → lineage node ID

    for (const msg of messages) {
      if (!msg.user || msg.type !== 'message') continue;

      const persona = this.resolvePersona(msg.user);
      if (!persona) continue;

      // Determine node type based on channel and content
      const nodeType = this.classifyMessage(msg, channel.name);

      // Record the provenance node
      const node = await this.recordNode({
        node_type: nodeType,
        source_ref: `${channel.id}:${msg.ts}`,
        summary: this.summarizeMessage(msg, channel.name, persona.name),
        content_hash: createHash('sha256')
          .update(msg.text + msg.ts)
          .digest('hex'),
        ...this.buildIdentityContext(persona),
        metadata: {
          channel_id: channel.id,
          channel_name: channel.name,
          slack_ts: msg.ts,
          thread_ts: msg.thread_ts,
          text: msg.text,
          reply_count: msg.reply_count || 0,
          has_reactions: !!(msg.reactions && msg.reactions.length > 0),
          reaction_count: msg.reactions
            ? msg.reactions.reduce((sum, r) => sum + r.count, 0)
            : 0,
        },
        tags: [
          `channel:${channel.name}`,
          `dept:${department}`,
          nodeType,
          ...(msg.thread_ts ? ['threaded'] : []),
          ...(msg.reactions && msg.reactions.length > 0 ? ['has_reactions'] : []),
        ],
      });

      if (node) {
        nodesCreated++;
        messageNodeMap.set(msg.ts, node.id);

        // If this is a thread reply, create edge to parent
        if (msg.thread_ts && msg.thread_ts !== msg.ts) {
          const parentNodeId = messageNodeMap.get(msg.thread_ts);
          if (parentNodeId) {
            const parentPersona = this.resolvePersonaFromNodeId(parentNodeId);
            const edge = await this.recordEdge({
              from_node_id: parentNodeId,
              to_node_id: node.id,
              relationship: 'replied_to',
              channel: 'slack',
              from_dept: department,
              to_dept: department,
            });
            if (edge) edgesCreated++;
          }
        }

        // Record reactions as endorsement edges
        if (msg.reactions) {
          for (const reaction of msg.reactions) {
            for (const reactorUserId of reaction.users) {
              const reactor = this.resolvePersona(reactorUserId);
              if (!reactor) continue;

              // Create a lightweight endorsement node
              const endorseNode = await this.recordNode({
                node_type: this.classifyReaction(reaction.name),
                source_ref: `${channel.id}:${msg.ts}:reaction:${reaction.name}`,
                summary: `${reactor.name} reacted with :${reaction.name}: to ${persona.name}'s message in #${channel.name}`,
                content_hash: createHash('sha256')
                  .update(`${reactorUserId}:${reaction.name}:${msg.ts}`)
                  .digest('hex'),
                ...this.buildIdentityContext(reactor),
                metadata: {
                  reaction: reaction.name,
                  original_message_ts: msg.ts,
                  channel_name: channel.name,
                },
                tags: [`reaction:${reaction.name}`, `channel:${channel.name}`],
              });

              if (endorseNode) {
                nodesCreated++;
                // Edge: message → endorsed_by → reaction
                const edge = await this.recordEdge({
                  from_node_id: node.id,
                  to_node_id: endorseNode.id,
                  relationship: 'endorsed_by',
                  channel: 'slack',
                  from_dept: persona.department,
                  to_dept: reactor.department,
                });
                if (edge) edgesCreated++;
              }
            }
          }
        }
      }
    }

    return { nodesCreated, edgesCreated };
  }

  // ── Message Classification ─────────────────────────────

  private classifyMessage(msg: SlackMessage, channelName: string): string {
    const text = msg.text.toLowerCase();

    // Check for decision/approval signals
    if (text.includes('approved') || text.includes('approve') || text.includes('lgtm')) {
      return 'approval';
    }
    if (text.includes('let\'s do') || text.includes('decided') || text.includes('go ahead')) {
      return 'decision';
    }
    if (text.includes('idea:') || text.includes('what if') || text.includes('proposal')) {
      return 'idea_origin';
    }
    if (text.includes('feasible') || text.includes('estimate') || text.includes('sprint')) {
      return 'feasibility_assessment';
    }
    if (text.includes('risk') || text.includes('concern') || text.includes('careful')) {
      return 'risk_flag';
    }
    if (text.includes('deployed') || text.includes('shipped') || text.includes('released')) {
      return 'deployment_notification';
    }

    // Default by channel
    if (channelName === 'product-ideas') return 'idea_origin';
    if (channelName === 'compliance') return 'compliance_discussion';

    return 'communication';
  }

  private classifyReaction(reactionName: string): string {
    // Map emoji reactions to Lineage significance
    const approvalReactions = ['white_check_mark', '+1', 'thumbsup', 'heavy_check_mark', 'ok', 'approved'];
    const flagReactions = ['warning', 'rotating_light', 'exclamation', 'question'];
    const celebrationReactions = ['tada', 'rocket', 'star', 'fire', 'sparkles'];

    if (approvalReactions.includes(reactionName)) return 'endorsement';
    if (flagReactions.includes(reactionName)) return 'flag';
    if (celebrationReactions.includes(reactionName)) return 'celebration';
    return 'reaction';
  }

  // ── Persona Resolution ────────────────────────────────

  private resolvePersona(slackUserId: string): Persona | undefined {
    const personaId = this.personaMap[slackUserId];
    if (!personaId) return undefined;
    return getPersona(personaId);
  }

  private resolvePersonaFromNodeId(_nodeId: string): Persona | undefined {
    // Would need to look up the node — placeholder for now
    return undefined;
  }

  // ── Summary Generation ────────────────────────────────

  private summarizeMessage(msg: SlackMessage, channelName: string, actorName: string): string {
    const truncated = msg.text.length > 120
      ? msg.text.substring(0, 120) + '...'
      : msg.text;
    
    const threadLabel = msg.thread_ts && msg.thread_ts !== msg.ts
      ? ' (thread reply)'
      : '';

    return `${actorName} in #${channelName}${threadLabel}: "${truncated}"`;
  }

  // ── Channel Listing ───────────────────────────────────

  private async getChannels(): Promise<SlackChannel[]> {
    const data = await this.slackApi('conversations.list', {
      types: 'public_channel,private_channel',
      limit: '200',
    });
    return data.channels || [];
  }

  // ── Webhook Setup (for real-time) ─────────────────────

  async setupWebhook(webhookUrl: string): Promise<boolean> {
    // For real-time: Slack Events API subscription
    // This requires a public URL endpoint that Slack can POST to.
    // For demo: we'll use the sync() pull method instead.
    console.log(`[Slack] Webhook setup requires Slack App Events subscription.`);
    console.log(`[Slack] Configure in: https://api.slack.com/apps → Event Subscriptions`);
    console.log(`[Slack] Request URL: ${webhookUrl}/api/slack/events`);
    return true;
  }
}

// ── Factory Function ───────────────────────────────────────

export function createSlackConnector(
  lineage: LineageService,
  botToken: string,
  signingSecret: string,
  personaMap: SlackPersonaMap,
): SlackConnector {
  return new SlackConnector(
    {
      toolId: 'slack',
      toolName: 'Slack',
      apiBaseUrl: 'https://slack.com/api',
      authType: 'bearer',
      credentials: {
        bot_token: botToken,
        signing_secret: signingSecret,
      },
      syncFrequency: 'realtime',
      lineageLevel: 'full',
      webhookEnabled: false,
    },
    lineage,
    personaMap,
  );
}
