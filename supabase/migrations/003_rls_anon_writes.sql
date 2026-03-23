-- ============================================
-- LINEAGE LAYER — RLS Fix for Anon Writes
-- Run this in Supabase SQL Editor
-- ============================================

-- Allow anon and authenticated users to INSERT nodes
-- (For demo purposes — production would use service_role only)
create policy "Allow anon insert nodes"
  on provenance_nodes for insert
  with check (true);

create policy "Allow anon insert edges"
  on provenance_edges for insert
  with check (true);

-- Also allow anon update (for AGL anchoring)
create policy "Allow anon update nodes"
  on provenance_nodes for update
  using (true);
