// ============================================
// AIOS Connector — Base Class
// Meridian Dynamics
// ============================================
// Every tool connector extends this base class.
// It provides: Lineage integration, identity context,
// sync scheduling, and connection management.

import { LineageService, ProvenanceNode, ProvenanceEdge } from '../../lineage/src/lineage.service';
import type { Persona, AuthTier } from '../../../config/organization';

// ── Types ──────────────────────────────────────────────────

export type SyncFrequency = 'realtime' | 'hourly' | 'daily' | 'manual';
export type LineageLevel = 'full' | 'summary' | 'hash_only';

export interface ConnectorConfig {
  toolId: string;
  toolName: string;
  apiBaseUrl: string;
  authType: 'oauth2' | 'api_key' | 'bearer' | 'basic';
  credentials: Record<string, string>;
  syncFrequency: SyncFrequency;
  lineageLevel: LineageLevel;
  webhookEnabled: boolean;
}

export interface ConnectorStatus {
  connected: boolean;
  lastSync: Date | null;
  lastError: string | null;
  nodesRecorded: number;
  edgesRecorded: number;
}

// ── Base Connector ─────────────────────────────────────────

export abstract class BaseConnector {
  protected config: ConnectorConfig;
  protected lineage: LineageService;
  protected status: ConnectorStatus;

  constructor(config: ConnectorConfig, lineage: LineageService) {
    this.config = config;
    this.lineage = lineage;
    this.status = {
      connected: false,
      lastSync: null,
      lastError: null,
      nodesRecorded: 0,
      edgesRecorded: 0,
    };
  }

  // ── Abstract Methods (each connector implements) ───────

  /** Test the connection to the external tool */
  abstract testConnection(): Promise<boolean>;

  /** Pull data from the tool and create provenance nodes */
  abstract sync(): Promise<{ nodesCreated: number; edgesCreated: number }>;

  /** Set up webhook listeners for real-time events */
  abstract setupWebhook?(webhookUrl: string): Promise<boolean>;

  // ── Lineage Helpers ────────────────────────────────────

  /**
   * Record a provenance node from this connector's tool.
   * Automatically fills source_tool from config.
   */
  protected async recordNode(
    nodeData: Omit<ProvenanceNode, 'source_tool'>,
  ): Promise<{ id: string } | null> {
    const node: ProvenanceNode = {
      ...nodeData,
      source_tool: this.config.toolId,
    };

    const result = await this.lineage.recordNode(node);
    if (result) {
      this.status.nodesRecorded++;
    }
    return result;
  }

  /**
   * Record a provenance edge from this connector.
   */
  protected async recordEdge(edgeData: ProvenanceEdge): Promise<{ id: string } | null> {
    const result = await this.lineage.recordEdge(edgeData);
    if (result) {
      this.status.edgesRecorded++;
    }
    return result;
  }

  /**
   * Build identity context for a node from a Persona.
   */
  protected buildIdentityContext(persona: Persona): Pick<ProvenanceNode,
    'actor_id' | 'actor_name' | 'department' | 'auth_method' | 'auth_tier' | 'confidence' | 'device'
  > {
    return {
      actor_id: persona.id,
      actor_name: persona.name,
      department: persona.department,
      auth_method: persona.authMethod,
      auth_tier: persona.authTier,
      confidence: persona.confidenceScore,
      device: persona.device,
    };
  }

  // ── Status ─────────────────────────────────────────────

  getStatus(): ConnectorStatus {
    return { ...this.status };
  }

  getToolId(): string {
    return this.config.toolId;
  }

  getToolName(): string {
    return this.config.toolName;
  }
}
