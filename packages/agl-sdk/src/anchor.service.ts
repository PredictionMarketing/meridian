// ============================================
// AGL Anchor Service — Track 1
// XRPL Testnet Anchoring via Memo Fields
// ============================================
// Uses standard XRPL Payment transactions with Memo fields
// to anchor Lineage hashes on the XRPL testnet.
// This is the "working this week" solution while the
// real AGL C++ fork (Track 2) is developed.

import { Client, Wallet, Payment, xrpToDrops } from 'xrpl';
import { createHash } from 'crypto';

// ── Types ──────────────────────────────────────────────────

export interface AnchorPayload {
  lineage_hash: string;       // SHA-256 Merkle root of provenance sub-graph
  node_ids: string[];         // Which provenance node IDs are covered
  scenario_id?: string;       // Demo scenario reference
  anchor_type: AnchorType;    // What kind of anchoring
  timestamp: string;          // ISO timestamp
  version: string;            // Schema version
}

export type AnchorType = 
  | 'lineage_commit'          // Standard provenance anchoring
  | 'compliance_attest'       // Governance standard verification
  | 'incident_report'         // AIRS incident recording
  | 'agent_identity'          // Agent registration
  | 'standard_anchor';        // Governance doc version stamp

export interface AnchorResult {
  tx_hash: string;            // XRPL transaction hash
  ledger_index: number;       // Ledger sequence number
  close_time: string;         // ISO timestamp from ledger
  validated: boolean;         // Whether tx was validated by consensus
  network: string;            // 'devnet' | 'testnet'
  explorer_url: string;       // Link to view on XRPL explorer
}

export interface VerifyResult {
  exists: boolean;            // Transaction found on ledger
  matches: boolean;           // Stored hash matches expected
  tampered: boolean;          // Mismatch detected
  payload?: AnchorPayload;    // The decoded payload (if exists)
}

// ── AGL Anchor Service ────────────────────────────────────

export class AGLAnchorService {
  private client: Client;
  private wallet: Wallet | null = null;
  private network: 'devnet' | 'testnet';
  private connected = false;

  constructor(network: 'devnet' | 'testnet' = 'testnet') {
    this.network = network;
    const url = network === 'devnet'
      ? 'wss://s.devnet.rippletest.net:51233'
      : 'wss://s.altnet.rippletest.net:51233';
    this.client = new Client(url);
  }

  // ── Connection ─────────────────────────────────────────

  async connect(): Promise<void> {
    if (!this.connected) {
      await this.client.connect();
      this.connected = true;
      console.log(`[AGL] Connected to XRPL ${this.network}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.connected) {
      await this.client.disconnect();
      this.connected = false;
      console.log(`[AGL] Disconnected from XRPL ${this.network}`);
    }
  }

  /**
   * Initialize wallet — either from saved seed or faucet.
   * Store the seed in .env for persistence across sessions.
   */
  async initWallet(seed?: string): Promise<{ address: string; seed: string }> {
    if (seed) {
      this.wallet = Wallet.fromSeed(seed);
      console.log(`[AGL] Wallet restored: ${this.wallet.address}`);
    } else {
      // Fund from testnet faucet — free test XRP
      const fund = await this.client.fundWallet();
      this.wallet = fund.wallet;
      console.log(`[AGL] New wallet funded: ${this.wallet.address}`);
      console.log(`[AGL] Balance: ${fund.balance} XRP`);
      console.log(`[AGL] ⚠️  Save this seed to .env: ${this.wallet.seed}`);
    }
    return { address: this.wallet.address, seed: this.wallet.seed! };
  }

  // ── Anchoring ──────────────────────────────────────────

  /**
   * Anchor a Lineage hash on XRPL.
   * Self-payment (1 drop) with hash in Memo fields.
   */
  async anchor(payload: AnchorPayload): Promise<AnchorResult> {
    if (!this.wallet) throw new Error('[AGL] Wallet not initialized');

    // Encode payload as hex for XRPL Memo
    const payloadJson = JSON.stringify(payload);
    const memoData = Buffer.from(payloadJson).toString('hex');
    const memoType = Buffer.from(`agl/${payload.anchor_type}`).toString('hex');
    const memoFormat = Buffer.from('application/json').toString('hex');

    // Ensure memo doesn't exceed 1KB limit
    if (memoData.length > 2048) { // hex doubles size
      throw new Error(`[AGL] Memo payload too large: ${memoData.length / 2} bytes (max 1024)`);
    }

    const tx: Payment = {
      TransactionType: 'Payment',
      Account: this.wallet.address,
      Destination: this.wallet.address,   // Self-payment
      Amount: '1',                        // 1 drop = 0.000001 XRP
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

    console.log(`[AGL] Submitting ${payload.anchor_type} to ${this.network}...`);
    const result = await this.client.submitAndWait(tx, { wallet: this.wallet });

    const txHash = result.result.hash;
    const ledgerIndex = result.result.ledger_index as number;
    const explorerBase = this.network === 'devnet'
      ? 'https://devnet.xrpl.org'
      : 'https://testnet.xrpl.org';

    console.log(`[AGL] ✅ Anchored: ${txHash}`);
    console.log(`[AGL]    Ledger: ${ledgerIndex}`);
    console.log(`[AGL]    Explorer: ${explorerBase}/transactions/${txHash}`);

    return {
      tx_hash: txHash,
      ledger_index: ledgerIndex,
      close_time: new Date().toISOString(),
      validated: result.result.validated === true,
      network: this.network,
      explorer_url: `${explorerBase}/transactions/${txHash}`,
    };
  }

  // ── Verification ───────────────────────────────────────

  /**
   * Verify a previous anchor: does it exist and does the hash match?
   * This is the "tamper detection" function.
   */
  async verify(txHash: string, expectedHash: string): Promise<VerifyResult> {
    try {
      const response = await this.client.request({
        command: 'tx',
        transaction: txHash,
      });

      const tx = response.result as any;
      const memos = tx.Memos;

      if (!memos || memos.length === 0) {
        return { exists: true, matches: false, tampered: true };
      }

      const memoData = Buffer.from(memos[0].Memo.MemoData, 'hex').toString();
      const payload = JSON.parse(memoData) as AnchorPayload;

      const matches = payload.lineage_hash === expectedHash;

      return {
        exists: true,
        matches,
        tampered: !matches,
        payload,
      };
    } catch (error) {
      return { exists: false, matches: false, tampered: false };
    }
  }

  // ── Merkle Root ────────────────────────────────────────

  /**
   * Compute Merkle root from multiple content hashes.
   * Used to create a single hash representing a sub-graph of provenance nodes.
   */
  static computeMerkleRoot(contentHashes: string[]): string {
    if (contentHashes.length === 0) return '';
    if (contentHashes.length === 1) return contentHashes[0];

    // Sort for deterministic ordering
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

  /**
   * Compute SHA-256 hash of content.
   */
  static hash(content: string): string {
    return createHash('sha256').update(content).digest('hex');
  }
}
