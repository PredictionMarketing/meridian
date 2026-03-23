# Meridian Dynamics — Full Demo Strategy

> **Goal:** A fully operational demo that walks an investor, enterprise CISO, or compliance officer through the complete AI governance lifecycle — from idea to deployment to audit — with real data flowing through real tools, all recorded immutably.

---

## 1. Demo Email Accounts

Create these email addresses at **meridiandynamics.dev** when ready to go fully live.
Start with 6 core accounts (Google Workspace @ ~$7/mo each), add more as needed.

### Priority 1 — Core Lifecycle Accounts (6)

| Account | Persona | Role | Department | Why Needed |
|---------|---------|------|------------|------------|
| `nadia.hassan@meridiandynamics.dev` | Nadia Hassan | Procurement Manager | Finance | **Idea originator** — starts the lifecycle |
| `diana.reeves@meridiandynamics.dev` | Diana Reeves | General Counsel | Legal | **Legal approver** — highest auth tier (Platinum) |
| `marcus.chen@meridiandynamics.dev` | Marcus Chen | VP Engineering | Engineering | **Spec approver** — assigns dev work |
| `jake.morrison@meridiandynamics.dev` | Jake Morrison | Senior Developer | Engineering | **Builder** — uses Cursor/Copilot, triggers vibe coding lineage |
| `catherine.park@meridiandynamics.dev` | Catherine Park | CFO | Finance | **Budget authority** — Platinum tier, signs off cost |
| `ryan.obrien@meridiandynamics.dev` | Ryan O'Brien | VP Finance | Finance | **Budget reviewer** — validates ROI before approval |

### Priority 2 — Cross-Department Demo (4)

| Account | Persona | Role | Department | Why Needed |
|---------|---------|------|------------|------------|
| `priya.sharma@meridiandynamics.dev` | Priya Sharma | Lead Architect | Engineering | Code reviewer — reviews Jake's AI-assisted code |
| `tom.nakamura@meridiandynamics.dev` | Tom Nakamura | Sr. Compliance Officer | Legal | Compliance attestation — SOX/SOC2 sign-off |
| `aisha.okonkwo@meridiandynamics.dev` | Aisha Okonkwo | QA Lead | Engineering | Quality gate — tests before deploy |
| `james.rodriguez@meridiandynamics.dev` | James Rodriguez | CRO | Sales | Business stakeholder — why this matters to revenue |

### Priority 3 — Extended Demo (4 more as needed)

| Account | Persona | Role | Department |
|---------|---------|------|------------|
| `michelle.torres@meridiandynamics.dev` | Michelle Torres | CHRO | People |
| `pat.henderson@meridiandynamics.dev` | Pat Henderson | VP Customer Success | Support |
| `laura.medina@meridiandynamics.dev` | Laura Medina | Contract Attorney | Legal |
| `ben.schwartz@meridiandynamics.dev` | Ben Schwartz | Data Privacy Analyst | Legal |

**Total cost: $42-98/mo depending on how many accounts are active**

---

## 2. Slack Channel Architecture

### Current

| Channel | Status | Bot |
|---------|--------|-----|
| `#all-aistandards` | ✅ Active | ✅ AIOS Tracker |
| `#social` | ✅ Exists | ❌ |
| `#new-channel` | ✅ Exists | ❌ |

### Target Channels for Demo

| Channel | Department | Lifecycle Purpose | Key Participants |
|---------|-----------|-------------------|------------------|
| `#product-ideas` | Cross-dept | **Phase 1:** Where ideas originate | Nadia, Marcus, James |
| `#engineering` | Engineering | **Phase 5-6:** Spec and build | Marcus, Priya, Jake, Aisha |
| `#finance` | Finance | **Phase 4:** Budget discussions | Catherine, Ryan, Nadia |
| `#legal` | Legal | **Phase 3:** Legal review | Diana, Tom, Laura |
| `#compliance` | Legal | **Phase 9:** Ongoing monitoring | Tom, Ben, Diana |
| `#ai-implementations` | Cross-dept | **All phases:** AI project tracking | All key personas |
| `#leadership` | Cross-dept | Executive escalations | Catherine, Marcus, Diana, James |
| `#deploy-alerts` | Engineering | **Phase 8:** Deployment signals | Jake, Priya, Aisha, Marcus |

---

## 3. The 5 Demo Scenarios (Detailed)

### Scenario 1: The Invoice Classifier Lifecycle (Full 9-Phase)

The signature demo. Walks through every phase of AI implementation from idea to production monitoring.

**Phase 1 — Idea Origin** (Slack `#product-ideas`)
```
Nadia Hassan: "What if we used AI to auto-classify incoming invoices?
Could save the procurement team 10 hours a week."

Ryan O'Brien reacts: 👍
Marcus Chen reacts: 🤔
Catherine Park replies: "Interesting. How much would this cost to build vs. buy?"
```
→ **Lineage:** `idea_origin` node, 3 endorsement edges, 1 reply edge

**Phase 2 — Feasibility Assessment** (Slack `#engineering`)
```
Marcus Chen: "Looked into invoice classification. Here's my assessment:
- Anthropic Claude can do this out of the box for simple invoices
- We'd need fine-tuning for our vendor-specific categories
- Estimate: 3 sprints (6 weeks) for MVP
- Risk: PII in invoices needs data handling review"

Priya Sharma replies: "Agree on the estimate. I'd add:
- We should test Claude vs GPT-4 for accuracy
- Need to define our accuracy threshold before build
- 95% accuracy or no-go"
```
→ **Lineage:** `feasibility_assessment` + `risk_flag` nodes, edges to idea_origin

**Phase 3 — Legal Review** (Slack `#legal`)
```
Diana Reeves: "I've reviewed the invoice classifier proposal. Key concerns:
1. PII data flows — invoices contain vendor SSNs, bank accounts
2. Need Data Processing Agreement with any LLM provider
3. Must NOT train on our invoice data
4. Recommend Claude — Anthropic has better data retention policies
APPROVED with conditions: no vendor data leaves our environment."

Tom Nakamura: "Adding to compliance tracker. Will need SOC2 evidence
showing data doesn't leave the perimeter."
```
→ **Lineage:** `legal_review` → `conditional_approval` nodes, Platinum-tier identity

**Phase 4 — Budget Approval** (Slack `#finance`, potentially email chain)
```
Catherine Park: "Budget approved for invoice classifier MVP.
$45K allocated — 3 sprints of Jake's time + Claude API costs ($200/mo est.)
Ryan, please set up the project code in NetSuite."

Ryan O'Brien: "Done. Project code MERID-AI-001 created.
Claire has the Amex for API charges."
```
→ **Lineage:** `budget_approval` node from Platinum-tier CFO, edge to legal_approval

**Phase 5 — Technical Specification** (GitHub issue/PR or Jira)
```
Marcus Chen creates spec:
- Input: Invoice PDF/image
- Processing: OCR → Claude API → Category + Confidence
- Output: Categorized invoice in NetSuite
- Accuracy target: 95%
- Rollback: Manual classification fallback
```
→ **Lineage:** `technical_spec` node, edges to feasibility + budget

**Phase 6 — Development** (GitHub commits + Cursor/Copilot)
```
Jake Morrison commits:
  feat: add invoice classifier service
  - Claude API integration (41% AI-generated code)
  - OCR pipeline for PDF extraction  
  - Category taxonomy (32 categories)
  - Confidence scoring
  
  Co-authored: Cursor AI
  AI Contribution: 41% of new lines
```
→ **Lineage:** `code_commit` nodes with `ai_contribution_pct: 0.41`

**Phase 7 — Code Review** (GitHub PR)
```
Priya Sharma reviews:
  "LGTM with one concern — the fallback logic needs a timeout.
  If Claude API is slow, we should fail to manual within 5 seconds."
  
  APPROVED
```
→ **Lineage:** `code_review` → `approval` edge

**Phase 8 — Deployment** (GitHub Actions / Slack `#deploy-alerts`)
```
Jake Morrison: "invoice-classifier v1.0.0 deployed to production"
Aisha Okonkwo: "E2E tests passing — 97.3% accuracy on test set"
```
→ **Lineage:** `deployment_notification` + `quality_gate` nodes

**Phase 9 — Monitoring** (Slack `#compliance`, ongoing)
```
Tom Nakamura: "Monthly compliance check — invoice classifier.
- Data residency: CONFIRMED in-environment
- Accuracy: 96.8% (above 95% threshold)
- PII incidents: 0
- Model drift: Within tolerance
COMPLIANT"
```
→ **Lineage:** `compliance_attestation` node, anchored on XRPL

### Scenario 2: Cross-Department Escalation

A support ticket reveals the invoice classifier miscategorized a vendor payment. Tracks from customer complaint → support → engineering → legal → resolution.

### Scenario 3: The Phantom Approval

An AI-generated contract clause was never reviewed by a human. The Lineage graph reveals the gap — no `legal_review` edge exists between the AI generation and the deployment. This is the "audit failure" demo.

### Scenario 4: Shadow Mode Comparison

Two support agents handle the same ticket type — one with AIOS-monitored AI, one without. Compare response quality, compliance, and auditability.

### Scenario 5: The Board Presentation

Catherine Park needs to tell the board: "Here's every AI system we have, who approved it, what data it touches, and what our liability exposure is." One-click compliance export.

---

## 4. Demo Day Walk-Through Script

**Duration:** 15-20 minutes

| Time | What You Show | What They See |
|------|---------------|---------------|
| 0:00 | "Meet Meridian Dynamics" | Demo company page — 250 people, 6 depts, 18 tools |
| 2:00 | "Nadia has an idea" | Live Slack message → auto-classified → provenance node created |
| 4:00 | "It crosses departments" | Lineage graph: Finance → Legal → Engineering. Cross-dept edges visible |
| 6:00 | "Jake builds it with AI help" | GitHub commits showing 41% AI contribution, Cursor attribution |
| 8:00 | "Every decision is anchored" | XRPL testnet explorer — hash visible, immutable, timestamped |
| 10:00 | "The phantom approval" | Gap in the graph — missing legal review. The audit catches it |
| 12:00 | "One-click compliance export" | PDF with full chain for SOX auditor |
| 14:00 | "Now try to alter a record" | Change something in Supabase → XRPL hash doesn't match → TAMPERED |
| 16:00 | "This is what AIOS does" | Full thesis: behavioral governance + identity + commerce |

---

## 5. XRPL Transition Plan — For Anwesh

### Where We Are (Track 1)

- XRPL **Testnet** — public shared network, free test XRP
- Anchoring via **Memo fields** on standard Payment transactions
- TypeScript SDK using `xrpl` npm package
- Two-wallet pattern: sender → vault (avoids self-payment redundancy)
- **Limitation:** 1KB Memo, no custom tx types, testnet resets, shared network

### Where We're Going (Track 2)

- **AGL Sidechain** — private XRPL-based network running modified `rippled`
- Custom transaction types: `LineageCommit`, `AgentIdentityCreate`, `ComplianceAttest`
- Our own validators, our own genesis ledger
- Federated bridge to XRPL mainnet (eventually)

### Transition Steps

```
PHASE A: CURRENT (Done)
├─ XRPL Testnet + Memo anchoring
├─ TypeScript SDK (packages/agl-sdk)
└─ Two-wallet pattern

PHASE B: SIDECHAIN PROTOTYPE (Anwesh)
├─ Clone github.com/XRPLF/rippled
├─ Build from source (Linux/Ubuntu 22.04)
│   ├─ Dependencies: CMake, GCC/Clang, Boost, Protobuf, OpenSSL
│   ├─ Build time: 30-60 min (first), 5-10 min (incremental)
│   └─ RAM: 16GB+ recommended
├─ Configure stand-alone mode (single validator, no network needed)
├─ Study existing Transactors:
│   ├─ src/ripple/app/tx/impl/Payment.cpp (simplest example)
│   ├─ src/ripple/protocol/TxFormats.h (tx type registration)
│   └─ src/ripple/protocol/SField.h (field definitions)
├─ Implement LineageCommit Transactor:
│   ├─ New tx type enum
│   ├─ Fields: ContentHash, CausalRef, NodeCount, Scenario
│   ├─ Validation: hash format, memo size limits
│   └─ Processing: store in ledger, emit metadata
├─ Create a genesis ledger with AGL-specific amendments
└─ Test: submit LineageCommit via rippled CLI

PHASE C: MULTI-NODE TESTNET (Anwesh + DevOps)
├─ Configure 3-5 validator nodes (Docker recommended)
├─ Set up UNL (Unique Node List) — validators trust each other
├─ RPCA consensus running (Ripple Protocol Consensus Algorithm)
├─ Implement AgentIdentityCreate and ComplianceAttest transactors
└─ Test: consensus across nodes, tx finality, ledger consistency

PHASE D: BRIDGE + SDK (Anwesh + G)
├─ TypeScript SDK updated to target AGL sidechain
├─ Switch packages/agl-sdk from Memo-based to native tx types
├─ API remains the same: anchor(payload) → result
├─ Federated sidechain bridge config (XLS-38d spec)
├─ Explorer for AGL (fork xrpl.org explorer or build custom)
└─ Migration: re-anchor existing Supabase nodes on AGL
```

### What Changes in the App Code

**Almost nothing.** The `anchor()` function in `packages/agl-sdk` currently creates a Payment+Memo. In Phase D, it creates a `LineageCommit` native transaction. The interface is the same:

```typescript
// Track 1 (current) → Track 2 (future)
// Same function signature, different transport

const result = await agl.anchor({
  lineage_hash: node.content_hash,
  node_ids: [node.id],
  anchor_type: 'lineage_commit',
  // ...
});
// Returns: { tx_hash, ledger_index, validated }
```

### Key Questions Anwesh Should Answer

1. **Build environment:** Can he build rippled on his machine? (Ubuntu 22.04 or WSL2)
2. **Transactor complexity:** How hard is adding a custom tx type to the RPCA pipeline?
3. **Genesis validator set:** Who runs the initial AGL validators? (Us + partners)
4. **Maintenance burden:** When Ripple updates rippled, how do we merge upstream changes?
5. **Performance profile:** RPCA is tested for payments (small, fast). AI governance records are larger and higher-frequency. Any concerns?

### Timeline Estimate

| Phase | Duration | Dependency |
|-------|----------|------------|
| A (current) | ✅ Done | — |
| B (stand-alone) | 4-6 weeks | Anwesh C++ availability |
| C (multi-node) | 2-4 weeks | Phase B complete |
| D (bridge + SDK) | 4-6 weeks | Phase C + XRPL bridge spec |

**Total to production AGL: 3-4 months from Phase B start**

---

## 6. Pre-Demo Checklist

### Already Done ✅
- [x] Supabase project created + Lineage schema deployed
- [x] Slack workspace created + bot installed + reading messages
- [x] XRPL testnet wallets funded + first anchor verified
- [x] Pipeline: Slack → Classify → Supabase → XRPL working

### Before First Demo
- [ ] Create 6 Priority 1 email accounts (`@meridiandynamics.dev`)
- [ ] Create full Slack channel set (8 channels)
- [ ] Seed Scenario 1 conversations across channels (all 9 phases)
- [ ] Build GitHub connector (code commit provenance)
- [ ] Build Lineage Explorer UI (interactive graph — the hero visual)
- [ ] Create compliance export (one-click PDF)
- [ ] Record demo video as backup

### Before Investor Demo
- [ ] All 10 email accounts active
- [ ] All 5 scenarios seeded and walkable
- [ ] AGL Phase B (stand-alone) running
- [ ] Tamper detection demo rehearsed
- [ ] Compliance export matches SOX/SOC2 format
