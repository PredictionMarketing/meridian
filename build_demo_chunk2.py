out = r'C:\Users\Fran\.gemini\antigravity\scratch\meridian\meridian-demo.html'
with open(out, 'a', encoding='utf-8') as f:
    f.write('''
<!-- ============================================================
     SCENE CONTAINER
     ============================================================ -->
<main id="scenes" style="display:none">

<!-- ====== SCENE 1: SIGNAL DETECTION ====== -->
<div class="scene" id="scene-1">
<div class="scene-wrap">
<div class="wrap">
  <div class="scene-header">
    <div class="scene-eyebrow">
      <span class="scene-num">SCENE 01 / 06</span>
      <div class="pulse pulse-c"></div>
      <span class="badge badge-i">Oracle Client</span>
    </div>
    <h2 class="scene-title">The Signal is Detected</h2>
    <p class="scene-desc">Marcus Reid, CISO at Meridian Dynamics, reviews upcoming regulatory obligations. His Oracle client &mdash; running as a background process on his workstation &mdash; detects a high-importance research signal and queues an autonomous investigation. No prompt required.</p>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;align-items:start">

    <!-- Oracle Client Mockup -->
    <div class="card card-accent" style="padding:0;overflow:hidden">
      <div style="background:var(--bg2);padding:12px 16px;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--border)">
        <div class="pulse pulse-c"></div>
        <span style="font-family:var(--display);font-weight:700;font-size:.9rem">Oracle</span>
        <span class="badge badge-c" style="margin-left:auto">Platinum</span>
      </div>
      <div style="padding:8px 0;background:var(--bg2);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px;padding:10px 16px">
        <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;font-family:var(--display);font-weight:700;font-size:.8rem;color:#fff;flex-shrink:0">MR</div>
        <div>
          <div style="font-weight:600;font-size:.9rem">Marcus Reid</div>
          <div style="font-size:.72rem;color:var(--text3)">CISO &bull; Meridian Dynamics</div>
        </div>
      </div>
      <div style="padding:20px 16px;display:flex;flex-direction:column;gap:14px;min-height:300px">
        <!-- User message -->
        <div style="align-self:flex-end;max-width:85%">
          <div style="background:linear-gradient(135deg,rgba(99,102,241,0.25),rgba(6,182,212,0.2));border:1px solid rgba(99,102,241,0.25);border-radius:14px 14px 4px 14px;padding:12px 16px;font-size:.88rem;line-height:1.6">
            Our Q3 regulatory audit is in 8 weeks. Legal is asking for AI governance documentation &mdash; inference logs, model IDs, data handling. I have nothing to give them right now.
          </div>
          <div style="font-size:.68rem;color:var(--text3);text-align:right;margin-top:4px">09:14 AM</div>
        </div>
        <!-- Oracle response -->
        <div style="align-self:flex-start;max-width:90%">
          <div style="background:var(--card);border:1px solid var(--border);border-radius:14px 14px 14px 4px;padding:12px 16px;font-size:.88rem;line-height:1.6;color:var(--text2)">
            Understood. I have detected a high-priority compliance research signal. Autonomous investigation queued across 3 parallel tracks: regulatory requirements mapping, existing system audit readiness, and EU AI Act Article 13-15 coverage gaps.
            <div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">
              <span class="badge badge-a" style="margin-right:6px">&#9679; Processing</span>
              <span style="font-size:.75rem;color:var(--text3)">Research pipeline initiated</span>
            </div>
          </div>
          <div style="font-size:.68rem;color:var(--text3);margin-top:4px">09:14 AM &bull; Oracle &bull; Anthropic Production</div>
        </div>
      </div>
    </div>

    <!-- Signal Detection Panel -->
    <div style="display:flex;flex-direction:column;gap:20px">
      <div class="card glow-c" style="padding:24px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:18px">
          <div class="pulse pulse-c"></div>
          <span style="font-size:.8rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--cyan)">Signal Detected</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px">
          <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:var(--bg2);border-radius:8px;border:1px solid var(--border)">
            <span class="mono-sm" style="color:var(--text3)">topic</span>
            <span style="font-size:.85rem;font-weight:600;color:var(--text)">Q3 regulatory audit &mdash; AI governance</span>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:var(--bg2);border-radius:8px;border:1px solid var(--border)">
            <span class="mono-sm" style="color:var(--text3)">category</span>
            <span class="badge badge-r">Compliance / Risk</span>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:var(--bg2);border-radius:8px;border:1px solid var(--border)">
            <span class="mono-sm" style="color:var(--text3)">importance</span>
            <div style="display:flex;align-items:center;gap:10px">
              <div style="height:6px;width:80px;background:var(--bg3);border-radius:3px;overflow:hidden"><div style="height:100%;width:92%;background:linear-gradient(90deg,var(--amber),var(--rose));border-radius:3px"></div></div>
              <span class="mono-sm" style="color:var(--amber);font-weight:600">0.92</span>
            </div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:var(--bg2);border-radius:8px;border:1px solid var(--border)">
            <span class="mono-sm" style="color:var(--text3)">agent_id</span>
            <span class="mono-sm" style="color:var(--indigo)">oracle-platinum-reid</span>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:var(--bg2);border-radius:8px;border:1px solid var(--border)">
            <span class="mono-sm" style="color:var(--text3)">status</span>
            <span class="badge badge-a">&#9679; Queued &rarr; ORAK</span>
          </div>
        </div>
      </div>

      <div class="card" style="padding:20px">
        <div style="font-size:.8rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--text3);margin-bottom:12px">Research Queue</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          <div style="display:flex;align-items:center;gap:10px;font-size:.82rem">
            <div class="pulse pulse-a"></div>
            <span style="color:var(--amber);font-weight:600">[0.92]</span>
            <span style="color:var(--text2)">EU AI Act Art 13-15 coverage gap analysis</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;font-size:.82rem">
            <div class="pulse pulse-a"></div>
            <span style="color:var(--amber);font-weight:600">[0.87]</span>
            <span style="color:var(--text2)">Inference log audit readiness assessment</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;font-size:.82rem">
            <div class="pulse"></div>
            <span style="color:var(--emerald);font-weight:600">[0.74]</span>
            <span style="color:var(--text2)">Regulatory timeline &mdash; Q3 2026 deadlines</span>
          </div>
        </div>
      </div>

      <div style="font-size:.8rem;color:var(--text3);line-height:1.6;padding:0 4px">
        Oracle detected the compliance signal from a natural conversation. No manual tagging. No prompt engineering. The research pipeline activates autonomously.
      </div>
    </div>

  </div><!-- /grid -->

  <div class="scene-footer">
    <div class="scene-footer-info">The research task is queued. Next: watch it enter the ORAK gateway.</div>
    <button class="btn" onclick="goScene(2)">ORAK Gateway &rarr;</button>
  </div>
</div>
</div>
</div>

<!-- ====== SCENE 2: ORAK GATEWAY ====== -->
<div class="scene" id="scene-2">
<div class="scene-wrap">
<div class="wrap">
  <div class="scene-header">
    <div class="scene-eyebrow">
      <span class="scene-num">SCENE 02 / 06</span>
      <div class="pulse pulse-a"></div>
      <span class="badge badge-a">Routing</span>
    </div>
    <h2 class="scene-title">The ORAK Gateway Routes the Query</h2>
    <p class="scene-desc">ORAK (Oraya Authenticated Key) is the API gateway for all inference on Meridian&rsquo;s sovereign stack. Every request is authenticated, classified, and routed. The query enters Spark &mdash; a 1B parameter classifier running at port 8000. Confidence falls below threshold. Core is invoked automatically.</p>
  </div>

  <!-- Routing Diagram -->
  <div class="card card-accent" style="padding:40px 32px;margin-bottom:32px;position:relative;overflow:hidden">
    <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 30% 50%,rgba(99,102,241,0.06),transparent 60%);pointer-events:none"></div>

    <div style="display:flex;align-items:center;justify-content:space-between;gap:0;position:relative;z-index:1">

      <!-- Oracle Client -->
      <div style="text-align:center;flex:0 0 140px">
        <div class="card" style="padding:18px 12px;border-color:rgba(99,102,241,0.4);box-shadow:var(--glow-i)">
          <div style="font-size:1.4rem;margin-bottom:8px">&#128196;</div>
          <div style="font-weight:700;font-size:.85rem;font-family:var(--display)">Oracle</div>
          <div style="font-size:.7rem;color:var(--text3);margin-top:3px">Reid&rsquo;s Client</div>
          <div style="margin-top:10px"><span class="badge badge-i">Request</span></div>
        </div>
      </div>

      <!-- Arrow 1 -->
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px">
        <div style="height:2px;width:100%;background:linear-gradient(90deg,var(--indigo),var(--amber));position:relative">
          <div style="position:absolute;right:-5px;top:-4px;color:var(--amber);font-size:.7rem">&#9654;</div>
        </div>
        <span class="mono-sm" style="color:var(--text3)">Bearer orak-***</span>
      </div>

      <!-- ORAK Gateway -->
      <div style="text-align:center;flex:0 0 140px">
        <div class="card" style="padding:18px 12px;border-color:rgba(245,158,11,0.4);box-shadow:var(--glow-a,0 0 28px rgba(245,158,11,0.3))">
          <div style="font-size:1.4rem;margin-bottom:8px">&#128274;</div>
          <div style="font-weight:700;font-size:.85rem;font-family:var(--display)">ORAK</div>
          <div style="font-size:.7rem;color:var(--text3);margin-top:3px">API Gateway</div>
          <div style="margin-top:10px"><span class="badge badge-a">Auth + Route</span></div>
        </div>
      </div>

      <!-- Arrow 2 -->
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px">
        <div style="height:2px;width:100%;background:linear-gradient(90deg,var(--amber),var(--cyan));position:relative">
          <div style="position:absolute;right:-5px;top:-4px;color:var(--cyan);font-size:.7rem">&#9654;</div>
        </div>
        <span class="mono-sm" style="color:var(--text3)">classify intent</span>
      </div>

      <!-- Spark -->
      <div style="text-align:center;flex:0 0 140px">
        <div class="card" style="padding:18px 12px;border-color:rgba(6,182,212,0.35)">
          <div style="font-size:1.4rem;margin-bottom:8px">&#9889;</div>
          <div style="font-weight:700;font-size:.85rem;font-family:var(--display)">Spark</div>
          <div style="font-size:.7rem;color:var(--text3);margin-top:3px">1B &bull; port 8000</div>
          <div style="margin-top:10px"><span class="badge badge-c">Classifier</span></div>
        </div>
      </div>

    </div>

    <!-- Escalation row -->
    <div style="display:flex;justify-content:flex-end;margin-top:16px;margin-right:0;padding-right:70px;position:relative;z-index:1">
      <div style="display:flex;flex-direction:column;align-items:center;gap:0;margin-top:-4px">
        <div style="height:32px;width:2px;background:linear-gradient(180deg,var(--cyan),var(--amber))"></div>
        <div style="padding:8px 16px;background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:8px;text-align:center;margin:0">
          <div style="font-family:var(--mono);font-size:.72rem;color:var(--amber);font-weight:600">confidence: 0.61</div>
          <div style="font-family:var(--mono);font-size:.65rem;color:var(--text3)">threshold: 0.75 &mdash; ESCALATE</div>
        </div>
        <div style="height:32px;width:2px;background:linear-gradient(180deg,var(--amber),var(--rose))"></div>
      </div>
    </div>

    <!-- Core row -->
    <div style="display:flex;justify-content:flex-end;position:relative;z-index:1">
      <div style="text-align:center;flex:0 0 140px">
        <div class="card" style="padding:18px 12px;border-color:rgba(244,63,94,0.35);box-shadow:0 0 28px rgba(244,63,94,0.25)">
          <div style="font-size:1.4rem;margin-bottom:8px">&#129504;</div>
          <div style="font-weight:700;font-size:.85rem;font-family:var(--display)">Core</div>
          <div style="font-size:.7rem;color:var(--text3);margin-top:3px">70B &bull; port 8001</div>
          <div style="margin-top:10px"><span class="badge badge-r">Deep Reason</span></div>
        </div>
      </div>
    </div>

  </div><!-- /diagram card -->

  <!-- Why it matters -->
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px">
    <div class="card" style="padding:20px">
      <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--indigo);margin-bottom:10px">ORAK Key System</div>
      <p style="font-size:.85rem;color:var(--text2);line-height:1.65">Every key prefixed <span class="mono-sm" style="color:var(--cyan)">orak-</span> is bcrypt-hashed. Plaintext never stored after creation. Per-key rate limits, engine access lists, client binding. Usage logged on every call.</p>
    </div>
    <div class="card" style="padding:20px">
      <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--amber);margin-bottom:10px">Escalation Logic</div>
      <p style="font-size:.85rem;color:var(--text2);line-height:1.65">Spark handles 80% of queries at 1B scale. When confidence falls below 0.75, Core (70B) is invoked invisibly. The user sees one response. Cost is managed automatically.</p>
    </div>
    <div class="card" style="padding:20px">
      <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--emerald);margin-bottom:10px">Sovereign by Design</div>
      <p style="font-size:.85rem;color:var(--text2);line-height:1.65">No request exits Meridian&rsquo;s hardware boundary. ORAK routes between on-premises engines only. AWS, Azure, and Google cloud APIs never see this data.</p>
    </div>
  </div>

  <div class="scene-footer">
    <button class="btn-ghost" onclick="goScene(1)">&larr; Back</button>
    <div class="scene-footer-info">Query routed. Core is processing. Next: the sovereign engine telemetry.</div>
    <button class="btn" onclick="goScene(3)">Sovereign Engines &rarr;</button>
  </div>
</div>
</div>
</div>

''')
print("Chunk 2 written.")
