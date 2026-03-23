-- ============================================
-- LINEAGE LAYER — Schema Migration 001
-- Meridian Dynamics / AIOS
-- ============================================
-- Creates the core provenance tracking tables:
--   provenance_nodes  — every action, decision, or data point
--   provenance_edges  — relationships between nodes
-- ============================================

-- Enable pgvector for semantic search
create extension if not exists vector;

-- ── Provenance Nodes ───────────────────────────────────────
-- Every action across every tool creates a node.
-- Nodes carry: identity context, content hash, source tool,
-- confidence score, department, and embedding vector.

create table if not exists provenance_nodes (
  id              uuid primary key default gen_random_uuid(),
  
  -- What happened
  node_type       text not null,           -- 'human_idea', 'ai_decision', 'code_commit', 'approval', 'deployment', etc.
  source_tool     text not null,           -- 'slack', 'github', 'okta', 'jira', 'cursor', etc.
  source_ref      text,                    -- tool-specific reference (message_ts, commit_sha, ticket_id)
  content_hash    text not null,           -- SHA-256 of the content for integrity verification
  summary         text,                    -- Human-readable summary of what happened
  
  -- Who did it
  actor_id        text not null,           -- persona ID from organization.ts (e.g., 'nadia_hassan')
  actor_name      text not null,           -- Human-readable name
  department      text not null,           -- Department ID
  auth_method     text not null,           -- 'yubikey_biometric', 'biometric_touchid', 'sso_mfa', 'password_mfa'
  auth_tier       text not null,           -- 'platinum', 'gold', 'silver', 'bronze'
  confidence      numeric(4,2) not null,   -- Identity confidence score 0.00-1.00
  device          text,                    -- Device identifier
  
  -- Context
  metadata        jsonb default '{}',      -- Tool-specific metadata (flexible)
  tags            text[] default '{}',     -- Searchable tags
  scenario_id     text,                    -- Links to demo scenario (e.g., 'invoice_classifier_lifecycle')
  
  -- Semantic search
  embedding       vector(1536),            -- pgvector embedding for implication queries
  
  -- Anchoring
  agl_tx_hash     text,                    -- AGL transaction hash (null until anchored)
  agl_block       integer,                 -- AGL block number
  anchored_at     timestamptz,             -- When anchored on-chain
  
  -- Decay
  decay_score     numeric(4,3) default 1.000,  -- Freshness score, decays over time
  last_referenced timestamptz,             -- Last time another node referenced this
  reference_count integer default 0,       -- How many times referenced (boosts decay)
  
  -- Timestamps
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ── Provenance Edges ───────────────────────────────────────
-- When data moves between nodes (people, tools, departments),
-- an edge records the relationship.

create table if not exists provenance_edges (
  id              uuid primary key default gen_random_uuid(),
  
  -- The connection
  from_node_id    uuid not null references provenance_nodes(id),
  to_node_id      uuid not null references provenance_nodes(id),
  relationship    text not null,           -- 'escalated_by', 'approved_by', 'informed_by', 'triggered', 'influenced', etc.
  
  -- Context
  channel         text,                    -- How the handoff happened: 'slack', 'email', 'jira', 'zoom', 'in_person'
  cross_dept      boolean default false,   -- True if edge crosses department boundary
  from_dept       text,                    -- Source department
  to_dept         text,                    -- Target department
  metadata        jsonb default '{}',      -- Edge-specific metadata
  
  -- Velocity tracking
  propagation_ms  integer,                 -- How long between from_node and to_node creation
  
  -- Timestamps
  created_at      timestamptz default now()
);

-- ── Indexes ────────────────────────────────────────────────

-- Node lookups
create index idx_nodes_actor on provenance_nodes(actor_id);
create index idx_nodes_department on provenance_nodes(department);
create index idx_nodes_source_tool on provenance_nodes(source_tool);
create index idx_nodes_node_type on provenance_nodes(node_type);
create index idx_nodes_scenario on provenance_nodes(scenario_id);
create index idx_nodes_created on provenance_nodes(created_at desc);
create index idx_nodes_agl on provenance_nodes(agl_tx_hash) where agl_tx_hash is not null;
create index idx_nodes_tags on provenance_nodes using gin(tags);
create index idx_nodes_metadata on provenance_nodes using gin(metadata);

-- Edge traversals
create index idx_edges_from on provenance_edges(from_node_id);
create index idx_edges_to on provenance_edges(to_node_id);
create index idx_edges_relationship on provenance_edges(relationship);
create index idx_edges_cross_dept on provenance_edges(cross_dept) where cross_dept = true;

-- Semantic search (IVFFlat for pgvector)
-- Run AFTER inserting initial data:
-- create index idx_nodes_embedding on provenance_nodes using ivfflat (embedding vector_cosine_ops) with (lists = 50);

-- ── Row Level Security ─────────────────────────────────────

alter table provenance_nodes enable row level security;
alter table provenance_edges enable row level security;

-- Service role can do everything
create policy "Service role full access on nodes"
  on provenance_nodes for all
  using (auth.role() = 'service_role');

create policy "Service role full access on edges"
  on provenance_edges for all
  using (auth.role() = 'service_role');

-- Anon/authenticated can read (for dashboard)
create policy "Authenticated read nodes"
  on provenance_nodes for select
  using (auth.role() = 'authenticated' or auth.role() = 'anon');

create policy "Authenticated read edges"
  on provenance_edges for select
  using (auth.role() = 'authenticated' or auth.role() = 'anon');

-- ── Updated_at Trigger ─────────────────────────────────────

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger provenance_nodes_updated_at
  before update on provenance_nodes
  for each row execute function update_updated_at();
