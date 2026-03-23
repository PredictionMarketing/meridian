# AIOS Lineage Infrastructure — Technical Record

> **Status:** Track 1 Live  
> **Date:** March 23, 2026  
> **Repo:** [PredictionMarketing/meridian](https://github.com/PredictionMarketing/meridian)  
> **Supabase:** meridian (raexhwpxgnouffrtnnuz)  
> **XRPL Testnet:** Wallet active, first anchor verified

---

## 1. What Exists Right Now

### Working Pipeline (End-to-End)

```
Slack Message → Auto-Classify → Map to Persona → Content Hash →
  Write Provenance Node (Supabase) → Anchor on XRPL Testnet → 
    Verify on Public Explorer
```

### Proven Transaction

| Field | Value |
|-------|-------|
| Provenance Node ID | `d24537b6-8d8b-4c10-97be-af81afd12284` |
| Type | `idea_origin` |
| Actor | Nadia Hassan (Procurement Manager, Finance) |
| Message | *"What if we used AI to auto-classify incoming invoices?"* |
| Identity Confidence | 0.85 (Silver tier, SSO+MFA) |
| Content Hash | `877ae877b3f7a026852d6e9e537a0b90...` |
| XRPL TX | `2B711A34AEBE2D165D77F34C52613E5E90347BBCCCC0BA755FEB03ADB908CDB4` |
| Ledger | `15925565` |
| Explorer | [testnet.xrpl.org →](https://testnet.xrpl.org/transactions/2B711A34AEBE2D165D77F34C52613E5E90347BBCCCC0BA755FEB03ADB908CDB4) |

### Architecture Stack

```
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 1: DATA SOURCES (Real Tools)                             │
│  ✅ Slack (AI Standards workspace, Meridian user)               │
│  🔲 GitHub (PredictionMarketing/meridian — code provenance)     │
│  🔲 Okta (30-day dev trial — identity confidence)               │
│  🔲 DocuSign / Ironclad (contract lifecycle)                    │
│  🔲 Google Workspace (email chains, doc collaboration)          │
├─────────────────────────────────────────────────────────────────┤
│  LAYER 2: CONNECTORS (TypeScript)                               │
│  ✅ Slack Connector (auto-classify, reaction tracking)          │
│  ✅ Base Connector (abstract class, identity context)           │
│  🔲 GitHub Connector (commits, PRs, reviews, CI)               │
│  🔲 Okta Connector (auth events, session, MFA)                 │
├─────────────────────────────────────────────────────────────────┤
│  LAYER 3: LINEAGE LAYER (Supabase PostgreSQL)                   │
│  ✅ provenance_nodes (live, first node written)                 │
│  ✅ provenance_edges (live, schema deployed)                    │
│  ✅ pgvector (embedding column ready)                           │
│  ✅ 4 query functions (origin, impact, velocity, implication)   │
│  ✅ RLS policies (anon writes for demo, service_role for prod)  │
├─────────────────────────────────────────────────────────────────┤
│  LAYER 4: AGL — BLOCKCHAIN ANCHORING                            │
│  ✅ Track 1: XRPL Testnet (Memo-based anchoring, LIVE)         │
│  🔲 Track 2: rippled Fork (custom tx types, C++)               │
│  ✅ Sender wallet: rJNi8Zthob9KzJKAxq4jhBjzKZ3YfgzANS         │
│  ✅ Vault wallet: rnVhGEUFTyuZ6eEfJ4bVg2gdYcVxXzSiuW          │
├─────────────────────────────────────────────────────────────────┤
│  LAYER 5: PRESENTATION                                          │
│  🔲 Lineage Explorer UI (D3.js interactive graph)              │
│  🔲 Compliance Export (PDF generation)                          │
│  🔲 Demo Dashboard (live metrics)                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. XRPL Wallets & Credentials

| Asset | Value | Stored In |
|-------|-------|-----------|
| Sender Address | `rJNi8Zthob9KzJKAxq4jhBjzKZ3YfgzANS` | .env `AGL_WALLET_SEED` |
| Vault Address | `rnVhGEUFTyuZ6eEfJ4bVg2gdYcVxXzSiuW` | .env `AGL_VAULT_SEED` |
| Sender Balance | 100 XRP (testnet) | — |
| Vault Balance | 100 XRP (testnet) | — |
| Supabase Project | `raexhwpxgnouffrtnnuz` | .env `SUPABASE_URL` |
| Slack Bot Token | `xoxb-...` | .env `SLACK_BOT_TOKEN` |
| Slack Signing Secret | `27aa...` | .env `SLACK_SIGNING_SECRET` |

> **⚠️ Testnet wallets** may reset when XRPL resets the testnet. Seeds allow re-creation from the faucet. Production wallets would be on the AGL sidechain.

---

## 3. Lineage Schema (Supabase)

### provenance_nodes

| Column | Type | Purpose |
|--------|------|---------|
| id | uuid (PK) | Unique node ID |
| node_type | text | `idea_origin`, `approval`, `decision`, `code_commit`, etc. |
| source_tool | text | `slack`, `github`, `okta`, etc. |
| source_ref | text | Tool-specific reference (channel:ts, commit SHA) |
| content_hash | text | SHA-256 of source content |
| summary | text | Human-readable one-liner |
| actor_id | text | Persona ID from org config |
| actor_name | text | Display name |
| department | text | `engineering`, `legal`, `finance`, etc. |
| auth_method | text | `yubikey_biometric`, `sso_mfa`, etc. |
| auth_tier | text | `platinum`, `gold`, `silver`, `bronze` |
| confidence | float | 0.00 – 1.00 identity confidence |
| device | text | Device description |
| agl_tx_hash | text | XRPL transaction hash (after anchoring) |
| agl_block | int | XRPL ledger index |
| anchored_at | timestamptz | When anchored |
| metadata | jsonb | Tool-specific structured data |
| tags | text[] | Classification tags |
| embedding | vector(1536) | pgvector semantic embedding |
| decay_score | float | Half-life freshness (0.0 – 1.0) |

### provenance_edges

| Column | Type | Purpose |
|--------|------|---------|
| id | uuid (PK) | Edge ID |
| from_node_id | uuid (FK) | Source node |
| to_node_id | uuid (FK) | Target node |
| relationship | text | `replied_to`, `endorsed_by`, `approved_by`, `developed_from` |
| channel | text | Communication channel |
| from_dept / to_dept | text | Cross-department detection |
| metadata | jsonb | Edge-specific data |

---

## 4. Message Classification Engine

The Slack connector auto-classifies messages based on semantic patterns:

| Pattern | Classification | Lifecycle Phase |
|---------|---------------|-----------------|
| "what if", "idea", "proposal" | `idea_origin` | Phase 1: Idea |
| "approved", "lgtm" | `approval` | Phase 4: Budget |
| "let's do", "decided" | `decision` | Phase 3: Legal |
| "feasible", "estimate", "sprint" | `feasibility_assessment` | Phase 2: Feasibility |
| "risk", "concern", "careful" | `risk_flag` | Phase 3: Legal |
| "deployed", "shipped", "released" | `deployment_notification` | Phase 8: Deploy |
| 👍 ✅ reactions | `endorsement` | Cross-cutting |
| ⚠️ ❗ reactions | `flag` | Cross-cutting |

---

## 5. Anchoring Protocol

### Track 1 (Current): XRPL Testnet Memo

```
Sender → Vault Payment (1 drop)
  Memo.Type:   "agl/lineage_commit"
  Memo.Format: "application/json"
  Memo.Data: {
    lineage_hash: "<SHA-256 of node content>",
    node_ids:     ["<provenance node UUID>"],
    anchor_type:  "lineage_commit",
    node_type:    "<classification>",
    actor:        "<persona_id>",
    department:   "<dept>",
    timestamp:    "<ISO-8601>",
    version:      "1.0.0"
  }
```

**Cost per anchor:** 12 drops (0.000012 XRP) transaction fee  
**Capacity:** ~8,333 anchors per XRP  
**Current balance:** 200 XRP testnet = ~16M test anchors

---

## 6. Repository Structure

```
PredictionMarketing/meridian/
├── config/
│   ├── organization.ts       ← 24 personas, 6 departments
│   ├── tools.ts              ← 12 tools, API specs
│   └── index.ts              ← Barrel exports
├── packages/
│   ├── lineage/
│   │   ├── src/lineage.service.ts  ← Core provenance API
│   │   └── src/index.ts
│   ├── connectors/
│   │   ├── src/base-connector.ts   ← Abstract connector
│   │   ├── src/slack.connector.ts  ← Slack (LIVE)
│   │   └── src/index.ts
│   └── agl-sdk/
│       ├── src/anchor.service.ts   ← XRPL anchoring
│       └── src/index.ts
├── supabase/migrations/
│   ├── 001_lineage_schema.sql      ← Core tables
│   ├── 002_lineage_queries.sql     ← 4 query functions
│   └── 003_rls_anon_writes.sql     ← Demo RLS policies
├── scripts/
│   ├── test-slack.mjs              ← Slack connection test
│   ├── test-pipeline.mjs           ← E2E pipeline test
│   └── test-anchor.mjs             ← XRPL anchor test
├── docs/
│   ├── agl-build-brief.md          ← Two-track AGL for Anwesh
│   └── slack-setup.md              ← Slack App guide
├── .env                            ← Credentials (gitignored)
├── .env.example                    ← Template
├── package.json                    ← npm workspaces
├── tsconfig.json                   ← TypeScript config
└── README.md                       ← Project overview
```

---

## 7. What Was Proved Today

1. **Slack → Supabase** — Real messages from a real Slack workspace are captured, classified, and stored as provenance nodes with full identity attribution
2. **Supabase → XRPL** — Provenance hashes are anchored on a public blockchain, verifiable by anyone with the TX hash
3. **Identity Confidence** — Every node carries `auth_tier`, `confidence_score`, `auth_method`, and `device`
4. **Content Integrity** — SHA-256 hash of the original content ensures tamper detection
5. **Auto-Classification** — Messages are semantically classified (`idea_origin`, `approval`, `decision`, etc.) matching the 9-phase lifecycle
