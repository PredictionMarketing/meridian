-- ============================================
-- LINEAGE LAYER — Core Queries
-- Meridian Dynamics / AIOS
-- ============================================
-- The 4 query types that power lineage exploration:
--   1. Origin   — trace backward (what influenced this?)
--   2. Impact   — trace forward (what did this affect?)
--   3. Velocity — time-based propagation analysis
--   4. Implication — semantic similarity via pgvector
-- ============================================

-- ── 1. Origin Query ────────────────────────────────────────
-- "Show me everything that influenced this decision"
-- Recursive CTE traversing edges backward from a given node

create or replace function lineage_origin(
  target_node_id uuid,
  max_depth integer default 10
)
returns table (
  node_id     uuid,
  node_type   text,
  actor_name  text,
  department  text,
  auth_tier   text,
  confidence  numeric,
  source_tool text,
  summary     text,
  depth       integer,
  relationship text,
  created_at  timestamptz
) as $$
begin
  return query
  with recursive origin_chain as (
    -- Base: the target node
    select 
      n.id, n.node_type, n.actor_name, n.department,
      n.auth_tier, n.confidence, n.source_tool, n.summary,
      0 as depth, ''::text as relationship, n.created_at
    from provenance_nodes n
    where n.id = target_node_id
    
    union all
    
    -- Recursive: follow edges backward
    select
      pn.id, pn.node_type, pn.actor_name, pn.department,
      pn.auth_tier, pn.confidence, pn.source_tool, pn.summary,
      oc.depth + 1, pe.relationship, pn.created_at
    from origin_chain oc
    join provenance_edges pe on pe.to_node_id = oc.id
    join provenance_nodes pn on pn.id = pe.from_node_id
    where oc.depth < max_depth
  )
  select * from origin_chain
  order by depth asc, created_at asc;
end;
$$ language plpgsql;


-- ── 2. Impact Query ────────────────────────────────────────
-- "What did this decision affect downstream?"
-- Recursive CTE traversing edges forward from a given node

create or replace function lineage_impact(
  source_node_id uuid,
  max_depth integer default 10
)
returns table (
  node_id     uuid,
  node_type   text,
  actor_name  text,
  department  text,
  auth_tier   text,
  confidence  numeric,
  source_tool text,
  summary     text,
  depth       integer,
  relationship text,
  created_at  timestamptz
) as $$
begin
  return query
  with recursive impact_chain as (
    select 
      n.id, n.node_type, n.actor_name, n.department,
      n.auth_tier, n.confidence, n.source_tool, n.summary,
      0 as depth, ''::text as relationship, n.created_at
    from provenance_nodes n
    where n.id = source_node_id
    
    union all
    
    select
      pn.id, pn.node_type, pn.actor_name, pn.department,
      pn.auth_tier, pn.confidence, pn.source_tool, pn.summary,
      ic.depth + 1, pe.relationship, pn.created_at
    from impact_chain ic
    join provenance_edges pe on pe.from_node_id = ic.id
    join provenance_nodes pn on pn.id = pe.to_node_id
    where ic.depth < max_depth
  )
  select * from impact_chain
  order by depth asc, created_at asc;
end;
$$ language plpgsql;


-- ── 3. Velocity Query ──────────────────────────────────────
-- "How fast did this context propagate across departments?"
-- Returns cross-department edges with propagation timing

create or replace function lineage_velocity(
  target_node_id uuid,
  max_depth integer default 10
)
returns table (
  from_node_id   uuid,
  to_node_id     uuid,
  from_dept      text,
  to_dept        text,
  relationship   text,
  channel        text,
  propagation_ms integer,
  from_time      timestamptz,
  to_time        timestamptz
) as $$
begin
  return query
  with recursive velocity_chain as (
    select n.id, 0 as depth
    from provenance_nodes n
    where n.id = target_node_id
    
    union all
    
    select pe.to_node_id, vc.depth + 1
    from velocity_chain vc
    join provenance_edges pe on pe.from_node_id = vc.id
    where vc.depth < max_depth
  )
  select 
    pe.from_node_id,
    pe.to_node_id,
    pe.from_dept,
    pe.to_dept,
    pe.relationship,
    pe.channel,
    pe.propagation_ms,
    fn.created_at as from_time,
    tn.created_at as to_time
  from velocity_chain vc
  join provenance_edges pe on pe.from_node_id = vc.id
  join provenance_nodes fn on fn.id = pe.from_node_id
  join provenance_nodes tn on tn.id = pe.to_node_id
  where pe.cross_dept = true
  order by fn.created_at asc;
end;
$$ language plpgsql;


-- ── 4. Implication Query ───────────────────────────────────
-- "What else is semantically related to this decision?"
-- Uses pgvector cosine similarity

create or replace function lineage_implication(
  target_node_id uuid,
  match_count integer default 10,
  similarity_threshold numeric default 0.7
)
returns table (
  node_id      uuid,
  node_type    text,
  actor_name   text,
  department   text,
  summary      text,
  similarity   numeric,
  created_at   timestamptz
) as $$
declare
  target_embedding vector(1536);
begin
  -- Get the target node's embedding
  select n.embedding into target_embedding
  from provenance_nodes n
  where n.id = target_node_id;
  
  -- Return if no embedding
  if target_embedding is null then
    return;
  end if;
  
  return query
  select
    n.id,
    n.node_type,
    n.actor_name,
    n.department,
    n.summary,
    (1 - (n.embedding <=> target_embedding))::numeric as similarity,
    n.created_at
  from provenance_nodes n
  where n.id != target_node_id
    and n.embedding is not null
    and (1 - (n.embedding <=> target_embedding)) > similarity_threshold
  order by n.embedding <=> target_embedding
  limit match_count;
end;
$$ language plpgsql;
