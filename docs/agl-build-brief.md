# AGL Build Brief — For Anwesh

> **Audience:** Anwesh (strong dev, no prior XRPL experience)
> **Goal:** Two parallel tracks for getting AGL functionality live. Track 1 starts this week.

---

## The Problem We're Solving

AIOS records provenance data in the Lineage Layer (Supabase). But Supabase is a database we control — we can edit, delete, or alter records. That's fine for internal use, but it destroys the "tamper-proof" claim.

**AGL (AIOS Governance Ledger) adds one thing: immutability.** When a critical decision happens (legal approval, compliance attestation, production deploy), we hash the relevant Lineage data and commit that hash to a blockchain. Now the record can't be altered without the hash mismatch being detectable.

The question: **how do we get this working without spending 6 months building a C++ fork first?**

Answer: two tracks, running in parallel.

---

## Track 1: XRPL Devnet — Working This Week

### What XRPL Already Gives Us

The XRP Ledger has public test networks with free test XRP:

| Network | URL | Purpose | Faucet |
|---------|-----|---------|--------|
| **Devnet** | `wss://s.devnet.rippletest.net:51233` | Experimental, may reset | [faucet.devnet.rippletest.net](https://faucet.devnet.rippletest.net) |
| **Testnet** | `wss://s.altnet.rippletest.net:51233` | Stable, longer-lived | [faucet.altnet.rippletest.net](https://faucet.altnet.rippletest.net) |

**Key feature we use: Memo fields.** Every XRPL transaction supports up to 1KB of arbitrary data in Memo fields. We send a self-payment (0 XRP, account to itself) with the Lineage hash in the Memo. The XRPL consensus network validates it, timestamps it, and makes it immutable.

### What We Anchor

```
┌──────────────────────────────────────────────────┐
│  LINEAGE LAYER (Supabase)                        │
│                                                  │
│  provenance_node → provenance_node → ...         │
│       │                                          │
│       ▼ (critical decision detected)             │
│  ┌─────────────────────────────────┐             │
│  │  Compute anchor payload:        │             │
│  │  - Merkle root of sub-graph     │             │
│  │  - Node IDs included            │             │
│  │  - Scenario ID                  │             │
│  │  - Timestamp                    │             │
│  │  = SHA-256 hash (32 bytes)      │             │
│  └──────────────┬──────────────────┘             │
│                 │                                 │
│                 ▼                                 │
│  ┌─────────────────────────────────┐             │
│  │  XRPL Transaction:              │             │
│  │  Type: Payment (self-payment)   │             │
│  │  Amount: 0 XRP (just drops)     │             │
│  │  Memo[0].type: "agl/lineage"   │             │
│  │  Memo[0].data: {hash, nodeIds} │             │
│  │  → Validated by XRPL consensus │             │
│  │  → Immutable tx hash returned  │             │
│  └──────────────┬──────────────────┘             │
│                 │                                 │
│                 ▼                                 │
│  provenance_node.agl_tx_hash = tx.hash           │
│  provenance_node.agl_block = tx.ledger_index     │
│  provenance_node.anchored_at = tx.close_time     │
└──────────────────────────────────────────────────┘
```

### The Code (TypeScript)

This is the actual anchoring service. Uses `xrpl` npm package:

```typescript
// packages/agl-sdk/src/anchor.service.ts

import { Client, Wallet, Payment } from 'xrpl';
import { createHash } from 'crypto';

interface AnchorPayload {
  lineage_hash: string;     // SHA-256 of the provenance sub-graph
  node_ids: string[];       // Which provenance nodes are covered
  scenario_id: string;      // Demo scenario reference
  anchor_type: string;      // 'lineage_commit' | 'compliance_attest' | 'incident_report'
  timestamp: string;
}

interface AnchorResult {
  tx_hash: string;
  ledger_index: number;
  close_time: string;
  validated: boolean;
}

export class AGLAnchorService {
  private client: Client;
  private wallet: Wallet;
  private network: 'devnet' | 'testnet';

  constructor(network: 'devnet' | 'testnet' = 'testnet') {
    this.network = network;
    const url = network === 'devnet'
      ? 'wss://s.devnet.rippletest.net:51233'
      : 'wss://s.altnet.rippletest.net:51233';
    this.client = new Client(url);
  }

  async connect(): Promise<void> {
    await this.client.connect();
  }

  async disconnect(): Promise<void> {
    await this.client.disconnect();
  }

  /**
   * Create or restore wallet.
   * For demo: generate from testnet faucet.
   * For production: restore from env seed.
   */
  async initWallet(seed?: string): Promise<string> {
    if (seed) {
      this.wallet = Wallet.fromSeed(seed);
    } else {
      // Fund from faucet (testnet/devnet only)
      const fund = await this.client.fundWallet();
      this.wallet = fund.wallet;
    }
    return this.wallet.address;
  }

  /**
   * Anchor a Lineage hash on XRPL.
   * Sends a self-payment with the hash in Memo fields.
   */
  async anchorLineageCommit(payload: AnchorPayload): Promise<AnchorResult> {
    // Encode payload as hex for Memo
    const memoData = Buffer.from(JSON.stringify(payload)).toString('hex');
    const memoType = Buffer.from('agl/lineage').toString('hex');
    const memoFormat = Buffer.from('application/json').toString('hex');

    const tx: Payment = {
      TransactionType: 'Payment',
      Account: this.wallet.address,
      Destination: this.wallet.address,   // Self-payment
      Amount: '1',                        // 1 drop (0.000001 XRP)
      Memos: [
        {
          Memo: {
            MemoType: memoType,
            MemoData: memoData,
            MemoFormat: memoFormat,
          },
        },
      ],
    };

    const result = await this.client.submitAndWait(tx, { wallet: this.wallet });

    return {
      tx_hash: result.result.hash,
      ledger_index: result.result.ledger_index as number,
      close_time: new Date().toISOString(),
      validated: result.result.validated === true,
    };
  }

  /**
   * Verify a previous anchor still exists and matches.
   */
  async verifyAnchor(txHash: string, expectedHash: string): Promise<{
    exists: boolean;
    matches: boolean;
    tampered: boolean;
  }> {
    try {
      const tx = await this.client.request({
        command: 'tx',
        transaction: txHash,
      });

      const memos = (tx.result as any).Memos;
      if (!memos || memos.length === 0) {
        return { exists: true, matches: false, tampered: true };
      }

      const memoData = Buffer.from(memos[0].Memo.MemoData, 'hex').toString();
      const payload = JSON.parse(memoData) as AnchorPayload;

      return {
        exists: true,
        matches: payload.lineage_hash === expectedHash,
        tampered: payload.lineage_hash !== expectedHash,
      };
    } catch {
      return { exists: false, matches: false, tampered: false };
    }
  }

  /**
   * Compute Merkle root from multiple provenance node hashes.
   */
  static computeMerkleRoot(contentHashes: string[]): string {
    if (contentHashes.length === 0) return '';
    if (contentHashes.length === 1) return contentHashes[0];

    const sorted = [...contentHashes].sort();
    let level = sorted;

    while (level.length > 1) {
      const nextLevel: string[] = [];
      for (let i = 0; i < level.length; i += 2) {
        const left = level[i];
        const right = i + 1 < level.length ? level[i + 1] : left;
        const combined = createHash('sha256')
          .update(left + right)
          .digest('hex');
        nextLevel.push(combined);
      }
      level = nextLevel;
    }

    return level[0];
  }
}
```

### Setup Steps (Anwesh does this)

```bash
# 1. In the meridian repo
cd packages/agl-sdk

# 2. Install XRPL
npm install xrpl

# 3. Get testnet funds
# Visit https://faucet.altnet.rippletest.net
# Or use client.fundWallet() in code — gives you 1000 test XRP

# 4. Run the anchor test
npx ts-node scripts/test-anchor.ts
# → Submits a LineageCommit to XRPL testnet
# → Returns tx hash
# → Verifies the anchor matches
```

### What This Proves (For Demos)

| Proof | How |
|-------|-----|
| "This decision was recorded immutably" | Show the XRPL tx hash on [testnet.xrpl.org](https://testnet.xrpl.org) |
| "It hasn't been altered" | Run verify — Merkle root matches |
| "It was recorded at this time" | XRPL ledger close_time (consensus-agreed) |
| "The full chain is intact" | Hash all Lineage nodes → compare to on-chain Merkle root |

### Limitations of Track 1

| Limitation | Impact | Solved in Track 2 |
|-----------|--------|-------------------|
| Using Memo fields (max 1KB) | Can only store hashes, not full data | Custom tx types hold more |
| Self-payments as tx type | Looks hacky on ledger explorer | Dedicated `LineageCommit` tx type |
| Testnet may reset | Anchors lost if network resets | Our own network, we control |
| No custom ledger objects | Can't query "show all LineageCommits" natively | Custom tx types + ledger objects |
| Shared network | Our data is on a public testnet | Private AGL network |

**Bottom line:** Track 1 gives us 90% of the demo proof with 5% of the effort. It's not production — but it's real blockchain anchoring, real immutability, real verification.

---

## Track 2: Fork rippled — The Real AGL

### What This Actually Means

"Fork rippled" means:
1. Clone the [XRPLF/rippled](https://github.com/XRPLF/rippled) repository
2. Add custom transaction types (C++)
3. Configure a private network (our own validators)
4. Run our own consensus — independent from XRPL mainnet

This is NOT a GitHub "fork" (just a copy). This is a **protocol fork** — a new network running modified XRPL code.

### The rippled Codebase

| Stat | Value |
|------|-------|
| Language | C++17 |
| Codebase size | ~500K+ lines |
| Build system | CMake |
| Primary OS | Linux (Ubuntu 22.04 recommended) |
| Build time | 30-60 min (first build), 5-10 min (incremental) |
| RAM required | 8GB+ for build, 16GB+ for running a node |

### Build Process

```bash
# 1. Clone
git clone https://github.com/XRPLF/rippled.git agl-rippled
cd agl-rippled

# 2. Dependencies (Ubuntu 22.04)
sudo apt-get update
sudo apt-get install -y git cmake pkg-config protobuf-compiler \
  libprotobuf-dev libssl-dev libboost-all-dev

# 3. Build
mkdir build && cd build
cmake .. -DCMAKE_BUILD_TYPE=Release
cmake --build . --parallel $(nproc)
# → Produces ./rippled binary

# 4. Test
./rippled --unittest
```

### What We Add (Custom Transaction Types)

We need to register new Transactors in the rippled source. Each one requires:

1. **Transaction type enum** — `src/ripple/protocol/TxFormats.h`
2. **Serialization fields** — `src/ripple/protocol/SField.h`
3. **Transactor class** — `src/ripple/app/tx/impl/YourTransactor.cpp`
4. **Registration** — wire into the transaction processing pipeline

#### The 3 Priority Transactors

**1. `LineageCommit`** — The core operation
```
Fields:
  - ContentHash (Blob)     — Merkle root of provenance sub-graph
  - CausalRef (Hash256)    — Previous LineageCommit tx hash (chain)
  - NodeCount (UInt32)     — Number of nodes in this commit
  - Scenario (Blob)        — Scenario identifier
  - Memo (standard)        — Additional context
```

**2. `AgentIdentityCreate`** — Register an AI agent on-chain
```
Fields:
  - AgentName (Blob)
  - AgentVersion (Blob)
  - Capabilities (Blob)    — JSON-encoded capability list
  - ClearanceTier (UInt8)  — T1-T5 clearance level
  - OwnerOrg (AccountID)   — Owning organization
```

**3. `ComplianceAttest`** — On-chain compliance verification
```
Fields:
  - StandardID (Blob)      — Which governance standard (e.g., "AIRS-001")
  - Status (UInt8)         — Pass/Fail/Partial
  - Evidence (Hash256)     — Hash of evidence document
  - AttesterID (AccountID) — Who attested
```

### Network Configuration

For a private AGL network, we need:

**Minimum:** 1 node in stand-alone mode (single validator, no consensus needed — good for dev)

**Demo-ready:** 3 nodes (minimum for real consensus)

**Production:** 5+ nodes (Byzantine fault tolerance requires 3f+1 where f=1)

#### Stand-Alone Mode (Start Here)

```ini
# rippled.cfg for stand-alone development

[server]
port_rpc_admin_local
port_ws_admin_local

[port_rpc_admin_local]
port = 5005
ip = 127.0.0.1
admin = 127.0.0.1
protocol = http

[port_ws_admin_local]
port = 6006
ip = 127.0.0.1
admin = 127.0.0.1
protocol = ws

[node_size]
small

[node_db]
type=NuDB
path=/var/lib/rippled/db/nudb
advisory_delete=0

[database_path]
/var/lib/rippled/db

[debug_logfile]
/var/log/rippled/debug.log

[sntp_servers]
time.windows.com
time.apple.com

# STAND-ALONE MODE — no validators needed
[rpc_startup]
{ "command": "log_level", "severity": "warning" }
```

Run with: `./rippled --conf=rippled.cfg -a` (the `-a` flag = stand-alone)

### Genesis Ledger

In stand-alone mode, rippled creates a default genesis ledger. For our custom AGL:

1. Pre-fund an AGL issuing account with test XRP
2. Set up a genesis `AgentIdentityCreate` for the AIOS platform agent
3. Anchor the 14 governance standards as genesis `StandardAnchor` transactions

### Bridge (Later)

Eventually, AGL connects to XRPL mainnet via the Federated Sidechain bridge. This enables:
- XRP settlement for agent economy transactions
- Cross-chain verification (mainnet users can verify AGL governance records)
- XAIG token issuance (if we go that route)

**This is Month 8+ work.** Not relevant now.

---

## Parallel Timeline

```
Week 1-4          Week 5-8          Week 9-12         Month 4+
─────────────────────────────────────────────────────────────
TRACK 1:
[Setup testnet]   [Integrate with   [Demo anchoring   [Keep running
 Fund wallet       Lineage Layer]    in lifecycle      alongside
 Test anchors]                       walkthrough]      Track 2]

TRACK 2:
[Clone rippled    [Study Transactor [Implement        [Stand-alone
 Build from        pipeline, add     LineageCommit     AGL testnet
 source]           custom fields]    + AgentIdentity]  running]
```

Track 1 lets us demo **now**. Track 2 is the real infrastructure. They run in parallel and Track 2 replaces Track 1 when ready.

---

## What Anwesh Needs to Get Started

### For Track 1 (JavaScript/TypeScript, this week):
- [ ] Node.js 20+
- [ ] `npm install xrpl` in the `packages/agl-sdk` directory
- [ ] XRPL testnet faucet funds (free, instant)
- [ ] Write the anchor service (template above)
- [ ] Integration test: Lineage node → hash → anchor → verify round-trip

### For Track 2 (C++, starts when ready):
- [ ] Linux dev environment (Ubuntu 22.04, or WSL2 on Windows)
- [ ] CMake, GCC/Clang, Boost, Protobuf, OpenSSL
- [ ] Clone `XRPLF/rippled`, build from source
- [ ] Read: `src/ripple/app/tx/impl/Payment.cpp` (simplest transactor)
- [ ] Read: `src/ripple/protocol/TxFormats.h` (how tx types register)
- [ ] First goal: add a `LineageCommit` transactor that accepts and stores a hash
