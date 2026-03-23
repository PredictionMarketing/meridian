// ============================================
// LINEAGE LAYER — Core Service
// Meridian Dynamics / AIOS
// ============================================
// The core API for recording provenance nodes and edges.
// Every connector, every agent, every tool interaction
// flows through this service.

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';
import type { AuthTier } from '../../config/organization';

// ── Types ──────────────────────────────────────────────────

export interface ProvenanceNode {
  id?: string;
  node_type: string;
  source_tool: string;
  source_ref?: string;
  content_hash?: string;       // Auto-computed if not provided
  summary: string;
  actor_id: string;
  actor_name: string;
  department: string;
  auth_method: string;
  auth_tier: AuthTier;
  confidence: number;
  device?: string;
  metadata?: Record<string, unknown>;
  tags?: string[];
  scenario_id?: string;
  embedding?: number[];
  agl_tx_hash?: string;
  agl_block?: number;
  anchored_at?: string;
}

export interface ProvenanceEdge {
  id?: string;
  from_node_id: string;
  to_node_id: string;
  relationship: string;
  channel?: string;
  cross_dept?: boolean;
  from_dept?: string;
  to_dept?: string;
  metadata?: Record<string, unknown>;
  propagation_ms?: number;
}

export interface LineageQueryResult {
  node_id: string;
  node_type: string;
  actor_name: string;
  department: string;
  auth_tier: string;
  confidence: number;
  source_tool: string;
  summary: string;
  depth: number;
  relationship: string;
  created_at: string;
}

export interface VelocityResult {
  from_node_id: string;
  to_node_id: string;
  from_dept: string;
  to_dept: string;
  relationship: string;
  channel: string;
  propagation_ms: number;
  from_time: string;
  to_time: string;
}

export interface ImplicationResult {
  node_id: string;
  node_type: string;
  actor_name: string;
  department: string;
  summary: string;
  similarity: number;
  created_at: string;
}

// ── Lineage Service ────────────────────────────────────────

export class LineageService {
  private supabase: SupabaseClient;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // ── Node Operations ────────────────────────────────────

  /**
   * Record a provenance node. Every action = a node.
   * Content hash is auto-computed from summary + metadata.
   */
  async recordNode(node: ProvenanceNode): Promise<{ id: string } | null> {
    // Auto-compute content hash if not provided
    if (!node.content_hash) {
      const hashInput = JSON.stringify({
        summary: node.summary,
        actor_id: node.actor_id,
        source_tool: node.source_tool,
        metadata: node.metadata || {},
      });
      node.content_hash = createHash('sha256').update(hashInput).digest('hex');
    }

    const { data, error } = await this.supabase
      .from('provenance_nodes')
      .insert(node)
      .select('id')
      .single();

    if (error) {
      console.error('[Lineage] Failed to record node:', error.message);
      return null;
    }

    return data;
  }

  /**
   * Record a provenance edge. When data moves between nodes.
   * Auto-detects cross-department edges.
   */
  async recordEdge(edge: ProvenanceEdge): Promise<{ id: string } | null> {
    // Auto-detect cross-department if from/to dept provided
    if (edge.from_dept && edge.to_dept) {
      edge.cross_dept = edge.from_dept !== edge.to_dept;
    }

    // Auto-compute propagation time if both nodes exist
    if (!edge.propagation_ms) {
      const { data: fromNode } = await this.supabase
        .from('provenance_nodes')
        .select('created_at')
        .eq('id', edge.from_node_id)
        .single();

      const { data: toNode } = await this.supabase
        .from('provenance_nodes')
        .select('created_at')
        .eq('id', edge.to_node_id)
        .single();

      if (fromNode && toNode) {
        edge.propagation_ms = new Date(toNode.created_at).getTime() 
                            - new Date(fromNode.created_at).getTime();
      }
    }

    const { data, error } = await this.supabase
      .from('provenance_edges')
      .insert(edge)
      .select('id')
      .single();

    if (error) {
      console.error('[Lineage] Failed to record edge:', error.message);
      return null;
    }

    // Increment reference count on from_node
    await this.supabase.rpc('increment_reference_count', { 
      node_id: edge.from_node_id 
    }).catch(() => {}); // Non-critical

    return data;
  }

  /**
   * Record a node AND its edges in a single operation.
   * Common pattern: "This new node was influenced by these existing nodes."
   */
  async recordNodeWithEdges(
    node: ProvenanceNode,
    incomingEdges: Array<{ from_node_id: string; relationship: string; channel?: string }>,
  ): Promise<{ nodeId: string; edgeIds: string[] } | null> {
    const nodeResult = await this.recordNode(node);
    if (!nodeResult) return null;

    const edgeIds: string[] = [];
    for (const incoming of incomingEdges) {
      // Look up from_node department
      const { data: fromNode } = await this.supabase
        .from('provenance_nodes')
        .select('department')
        .eq('id', incoming.from_node_id)
        .single();

      const edgeResult = await this.recordEdge({
        from_node_id: incoming.from_node_id,
        to_node_id: nodeResult.id,
        relationship: incoming.relationship,
        channel: incoming.channel,
        from_dept: fromNode?.department,
        to_dept: node.department,
      });

      if (edgeResult) {
        edgeIds.push(edgeResult.id);
      }
    }

    return { nodeId: nodeResult.id, edgeIds };
  }

  // ── Query Operations ───────────────────────────────────

  /**
   * Origin query: "Show me everything that influenced this decision"
   */
  async queryOrigin(nodeId: string, maxDepth = 10): Promise<LineageQueryResult[]> {
    const { data, error } = await this.supabase
      .rpc('lineage_origin', { target_node_id: nodeId, max_depth: maxDepth });

    if (error) {
      console.error('[Lineage] Origin query failed:', error.message);
      return [];
    }
    return data || [];
  }

  /**
   * Impact query: "What did this decision affect downstream?"
   */
  async queryImpact(nodeId: string, maxDepth = 10): Promise<LineageQueryResult[]> {
    const { data, error } = await this.supabase
      .rpc('lineage_impact', { source_node_id: nodeId, max_depth: maxDepth });

    if (error) {
      console.error('[Lineage] Impact query failed:', error.message);
      return [];
    }
    return data || [];
  }

  /**
   * Velocity query: "How fast did context propagate across departments?"
   */
  async queryVelocity(nodeId: string, maxDepth = 10): Promise<VelocityResult[]> {
    const { data, error } = await this.supabase
      .rpc('lineage_velocity', { target_node_id: nodeId, max_depth: maxDepth });

    if (error) {
      console.error('[Lineage] Velocity query failed:', error.message);
      return [];
    }
    return data || [];
  }

  /**
   * Implication query: "What else is semantically related?"
   */
  async queryImplication(
    nodeId: string, 
    matchCount = 10, 
    threshold = 0.7
  ): Promise<ImplicationResult[]> {
    const { data, error } = await this.supabase
      .rpc('lineage_implication', { 
        target_node_id: nodeId, 
        match_count: matchCount,
        similarity_threshold: threshold 
      });

    if (error) {
      console.error('[Lineage] Implication query failed:', error.message);
      return [];
    }
    return data || [];
  }

  // ── AGL Anchoring ──────────────────────────────────────

  /**
   * Mark a node as anchored on AGL.
   * Called after LineageCommit transaction is confirmed.
   */
  async anchorNode(nodeId: string, txHash: string, blockNumber: number): Promise<boolean> {
    const { error } = await this.supabase
      .from('provenance_nodes')
      .update({
        agl_tx_hash: txHash,
        agl_block: blockNumber,
        anchored_at: new Date().toISOString(),
      })
      .eq('id', nodeId);

    if (error) {
      console.error('[Lineage] Anchor failed:', error.message);
      return false;
    }
    return true;
  }

  // ── Utility ────────────────────────────────────────────

  /**
   * Get a single node by ID with all its details.
   */
  async getNode(nodeId: string): Promise<ProvenanceNode | null> {
    const { data, error } = await this.supabase
      .from('provenance_nodes')
      .select('*')
      .eq('id', nodeId)
      .single();

    if (error) return null;
    return data;
  }

  /**
   * Get all edges connected to a node (both incoming and outgoing).
   */
  async getNodeEdges(nodeId: string): Promise<ProvenanceEdge[]> {
    const { data, error } = await this.supabase
      .from('provenance_edges')
      .select('*')
      .or(`from_node_id.eq.${nodeId},to_node_id.eq.${nodeId}`);

    if (error) return [];
    return data || [];
  }

  /**
   * Get nodes by scenario (for demo walkthrough).
   */
  async getScenarioNodes(scenarioId: string): Promise<ProvenanceNode[]> {
    const { data, error } = await this.supabase
      .from('provenance_nodes')
      .select('*')
      .eq('scenario_id', scenarioId)
      .order('created_at', { ascending: true });

    if (error) return [];
    return data || [];
  }

  /**
   * Compute content hash for integrity verification.
   */
  static computeHash(content: string): string {
    return createHash('sha256').update(content).digest('hex');
  }
}
