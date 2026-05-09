out = r'C:\Users\Fran\.gemini\antigravity\scratch\meridian\meridian-demo.html'
TX = '2B711A34AEBE2D165D77F34C52613E5E90347BBCCCC0BA755FEB03ADB908CDB4'
WALLET = 'rL2N5DA8...z5g2y9'
LEDGER = '17,218,603'
EXPLORER = 'https://testnet.xrpl.org/transactions/' + TX

with open(out, 'a', encoding='utf-8') as f:
    f.write('''
<!-- ====== SCENE 4: XRPL LINEAGE ANCHOR ====== -->
<div class="scene" id="scene-4">
<div class="scene-wrap">
<div class="wrap">
  <div class="scene-header">
    <div class="scene-eyebrow">
      <span class="scene-num">SCENE 04 / 06</span>
      <div class="pulse pulse-c"></div>
      <span class="badge badge-c">Blockchain Governance</span>
    </div>
    <h2 class="scene-title">The Lineage Anchor Fires</h2>
    <p class="scene-desc">The moment Core completes the inference, the AGL-001 governance protocol fires asynchronously. A SHA-256 hash of the input, output, model ID, and timestamp is computed &mdash; and anchored permanently on the XRP Ledger. The overhead: 0.1ms for the hash. 2ms for the Postgres write. The blockchain receipt arrives in the background. Marcus Reid got his answer in 1,842ms. The audit trail cost him nothing extra.</p>
  </div>

  <!-- Main anchor visualization -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:32px;align-items:start">

    <!-- AGL-001 Protocol panel -->
    <div class="card card-accent glow-c" style="padding:28px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px">
        <div class="pulse pulse-c"></div>
        <span style="font-family:var(--display);font-weight:700;font-size:.95rem">AGL-001 Memo Protocol</span>
        <span class="badge badge-c" style="margin-left:auto">v1</span>
      </div>

      <!-- Hash computation -->
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:16px;margin-bottom:16px;font-family:var(--mono)">
        <div style="font-size:.7rem;color:var(--text3);margin-bottom:8px">GOVERNANCE HASH COMPUTATION</div>
        <div style="font-size:.75rem;color:var(--text2);line-height:1.8">
          SHA-256(<br>
          &nbsp;&nbsp;<span style="color:var(--indigo)">user_input</span> +<br>
          &nbsp;&nbsp;<span style="color:var(--rose)">model_output</span> +<br>
          &nbsp;&nbsp;<span style="color:var(--amber)">model_id</span>: "core-70b" +<br>
          &nbsp;&nbsp;<span style="color:var(--cyan)">timestamp</span>: "2026-05-09T09:14:23Z"<br>
          )
        </div>
        <div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border)">
          <div style="font-size:.65rem;color:var(--text3);margin-bottom:4px">= RESULT</div>
          <div style="font-size:.72rem;color:var(--cyan);word-break:break-all;letter-spacing:.05em" id="hash-display">computing...</div>
        </div>
      </div>

      <!-- Memo fields -->
      <div style="display:flex;flex-direction:column;gap:8px">
        <div style="font-size:.7rem;color:var(--text3);font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px">XRPL Payment Memo Fields</div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:var(--bg2);border-radius:6px;border:1px solid var(--border)">
          <span class="mono-sm" style="color:var(--text3)">MemoType</span>
          <span class="mono-sm" style="color:var(--indigo)">application/agl-v1</span>
        </div>
        <div style="padding:10px 12px;background:var(--bg2);border-radius:6px;border:1px solid var(--border);font-family:var(--mono);font-size:.72rem;line-height:1.8">
          <div><span style="color:var(--text3)">v:</span> <span style="color:var(--cyan)">"agl-v1"</span></div>
          <div><span style="color:var(--text3)">h:</span> <span style="color:var(--cyan)">"2b711a34..." <span style="color:var(--text3)">&larr; governance hash</span></span></div>
          <div><span style="color:var(--text3)">m:</span> <span style="color:var(--amber)">"core-70b"</span></div>
          <div><span style="color:var(--text3)">t:</span> <span style="color:var(--emerald)">"2026-05-09T09:14:23Z"</span></div>
          <div><span style="color:var(--text3)">ti:</span> <span style="color:var(--text2)">1842</span> &nbsp;<span style="color:var(--text3)">to:</span> <span style="color:var(--text2)">486</span> &nbsp;<span style="color:var(--text3)">l:</span> <span style="color:var(--text2)">1842ms</span></div>
          <div><span style="color:var(--text3)">k:</span> <span style="color:var(--indigo)">"orak-reid-plat"</span></div>
          <div><span style="color:var(--text3)">c:</span> <span style="color:var(--indigo)">"meridian-dynamics"</span></div>
        </div>
      </div>
    </div>

    <!-- XRPL anchor result -->
    <div style="display:flex;flex-direction:column;gap:20px">

      <!-- Anchor status -->
      <div class="card" style="padding:24px;border-color:rgba(6,182,212,0.4);box-shadow:var(--glow-c);position:relative;overflow:hidden">
        <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(6,182,212,0.08),transparent 60%);pointer-events:none"></div>
        <div style="position:relative;z-index:1">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
            <div class="pulse pulse-c"></div>
            <span style="font-family:var(--display);font-weight:700">XRPL Anchor Confirmed</span>
          </div>

          <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px">
            <div style="display:flex;justify-content:space-between;align-items:center;padding:9px 14px;background:var(--bg2);border-radius:8px">
              <span class="mono-sm" style="color:var(--text3)">Network</span>
              <span style="font-size:.83rem;font-weight:600">XRP Ledger Testnet</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;padding:9px 14px;background:var(--bg2);border-radius:8px">
              <span class="mono-sm" style="color:var(--text3)">Wallet</span>
              <span class="mono-sm" style="color:var(--indigo)">''' + WALLET + '''</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;padding:9px 14px;background:var(--bg2);border-radius:8px">
              <span class="mono-sm" style="color:var(--text3)">Ledger</span>
              <span class="mono-sm" style="color:var(--cyan)">#''' + LEDGER + '''</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;padding:9px 14px;background:var(--bg2);border-radius:8px">
              <span class="mono-sm" style="color:var(--text3)">Overhead</span>
              <span style="font-size:.83rem;color:var(--emerald);font-weight:600">&lt; 0.1ms sync &bull; async fire-and-forget</span>
            </div>
            <div style="display:flex;flex-direction:column;gap:6px;padding:12px 14px;background:rgba(6,182,212,0.06);border:1px solid rgba(6,182,212,0.25);border-radius:8px">
              <span class="mono-sm" style="color:var(--text3)">TX Hash</span>
              <span style="font-family:var(--mono);font-size:.72rem;color:var(--cyan);word-break:break-all;letter-spacing:.05em">''' + TX + '''</span>
            </div>
          </div>

          <a href="''' + EXPLORER + '''" target="_blank" rel="noopener" class="btn-cyan" style="width:100%;justify-content:center">
            Verify on XRPL Explorer &rarr;
          </a>
        </div>
      </div>

      <!-- The auditor statement -->
      <div style="padding:20px 24px;background:linear-gradient(135deg,rgba(16,185,129,0.06),rgba(6,182,212,0.06));border:1px solid rgba(16,185,129,0.2);border-radius:12px">
        <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--emerald);margin-bottom:10px">The Auditor Statement</div>
        <p style="font-size:.9rem;color:var(--text2);line-height:1.75;font-style:italic">
          &ldquo;An auditor, regulator, or enterprise risk committee can verify this transaction independently on the XRPL block explorer at any time. No intermediary. No trust required. No Meridian employee needs to provide anything.&rdquo;
        </p>
        <div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap">
          <span class="badge badge-e">EU AI Act Art. 13</span>
          <span class="badge badge-e">SOC 2 Type II</span>
          <span class="badge badge-c">GDPR Art. 22</span>
        </div>
      </div>

      <!-- Performance -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
        <div style="text-align:center;padding:14px;background:var(--card);border:1px solid var(--border);border-radius:10px">
          <div style="font-family:var(--mono);font-size:1.1rem;font-weight:700;color:var(--cyan)">0.1ms</div>
          <div style="font-size:.68rem;color:var(--text3);margin-top:4px">SHA-256 compute</div>
        </div>
        <div style="text-align:center;padding:14px;background:var(--card);border:1px solid var(--border);border-radius:10px">
          <div style="font-family:var(--mono);font-size:1.1rem;font-weight:700;color:var(--indigo)">2ms</div>
          <div style="font-size:.68rem;color:var(--text3);margin-top:4px">Postgres write</div>
        </div>
        <div style="text-align:center;padding:14px;background:var(--card);border:1px solid var(--border);border-radius:10px">
          <div style="font-family:var(--mono);font-size:1.1rem;font-weight:700;color:var(--emerald)">async</div>
          <div style="font-size:.68rem;color:var(--text3);margin-top:4px">XRPL receipt</div>
        </div>
      </div>

    </div>
  </div>

  <div class="scene-footer">
    <button class="btn-ghost" onclick="goScene(3)">&larr; Back</button>
    <div class="scene-footer-info">Every inference permanently anchored. Next: what this means for compliance.</div>
    <button class="btn" onclick="goScene(5)">Compliance Export &rarr;</button>
  </div>
</div>
</div>
</div>

''')
print("Chunk 4 written.")
