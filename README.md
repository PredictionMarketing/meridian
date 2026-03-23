# 🏢 Meridian Dynamics

**AIOS Proof-of-Concept Demo Company**

A fully simulated enterprise environment for proving every AIOS capability end-to-end. Real tools, real accounts, real lineage tracking, real governance.

## What Is This?

Meridian Dynamics is a fictional mid-market B2B SaaS company ($85M ARR, 340 employees, 6 departments) designed to mirror Fortune 500 complexity at manageable scale. Every tool has a real account. Every persona generates real provenance nodes. Every AI decision is tracked through the Lineage Layer and anchored on AGL.

**Documentation:** [wwai-woad.vercel.app/demo-company.html](https://wwai-woad.vercel.app/demo-company.html)

## Architecture

```
packages/
├── lineage/         # Lineage Layer — provenance nodes, edges, queries, decay
├── connectors/      # Tool connectors — Slack, GitHub, Okta, DocuSign, etc.
├── router/          # LLM Router — query classification + model routing
├── compliance/      # Governance standards enforcement + audit export
├── agents/          # AIOS agent framework — identity, precrime, department
├── dashboard/       # Web UI — Lineage Explorer, Identity Map, Compliance
└── agl-sdk/         # AGL TypeScript SDK — submit transactions to AGL testnet

config/
├── organization.ts  # Meridian org structure: departments, personas, auth tiers
├── tools.ts         # Tool registry: endpoints, auth, sync config
└── scenarios.ts     # Demo scenarios: lifecycle walkthrough, contract review, etc.

supabase/
└── migrations/      # Versioned database migrations

demo/
├── seed/            # Seed data for demo runs
└── scenarios/       # Executable demo scripts
```

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your Supabase and connector credentials

# Run database migrations
npm run db:migrate

# Start development
npm run dev
```

## The Company

| Department | People | Key Personas | Tools |
|-----------|--------|-------------|-------|
| Engineering | 62 | Marcus Chen (VP), Priya Sharma (Architect), Jake Morrison (Dev) | GitHub, Jira, Cursor, Copilot |
| Legal | 12 | Diana Reeves (GC), Tom Nakamura (Compliance) | DocuSign, Ironclad |
| Finance | 28 | Catherine Park (CFO), Ryan O'Brien (VP), Nadia Hassan (Procurement) | NetSuite, Stripe |
| People | 18 | Michelle Torres (CHRO), Sonia Gupta (Analytics) | BambooHR, Greenhouse |
| Sales | 85 | James Rodriguez (CRO), Tanya Ivanova (VP Enterprise) | Salesforce, Gong |
| Support | 45 | Pat Henderson (VP CS), Mei Lin (Head Support) | Zendesk, Intercom |

## Identity Confidence Tiers

| Tier | Auth Method | Confidence | Personas |
|------|------------|-----------|----------|
| 🔒 Platinum | YubiKey + Biometric | 0.99 | Diana (GC), Catherine (CFO) |
| 🟡 Gold | Biometric (Touch ID) | 0.95 | Marcus, Priya, Tom, Ryan, James |
| 🟢 Silver | SSO + MFA | 0.85 | Jake, Aisha, Nadia, most staff |
| 🔵 Bronze | Password + MFA | 0.70 | Contractors, temp accounts |

## Supabase

- **Project:** meridian
- **Project ID:** raexhwpxgnouffrtnnuz
- **Domain:** meridiandynamics.dev

## License

Private — AI Standards, Inc.
