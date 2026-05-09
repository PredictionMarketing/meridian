out = r'C:\Users\Fran\.gemini\antigravity\scratch\meridian\meridian-demo.html'
with open(out, 'a', encoding='utf-8') as f:
    f.write('''
<!-- ====== SCENE 3: SOVEREIGN ENGINES ====== -->
<div class="scene" id="scene-3">
<div class="scene-wrap">
<div class="wrap-wide">
  <div class="wrap" style="padding:0">
  <div class="scene-header">
    <div class="scene-eyebrow">
      <span class="scene-num">SCENE 03 / 06</span>
      <div class="pulse"></div>
      <span class="badge badge-e">Live Telemetry</span>
    </div>
    <h2 class="scene-title">Sovereign Engine Telemetry</h2>
    <p class="scene-desc">Core is processing Marcus Reid&rsquo;s compliance query on Meridian&rsquo;s NVIDIA GB10 Grace Blackwell hardware. Seven specialized engines run on-premises. No data leaves the building. The command center shows every engine in real time.</p>
  </div>
  </div>

  <!-- Hardware badge -->
  <div style="display:flex;align-items:center;gap:16px;margin-bottom:32px;padding:16px 28px;background:linear-gradient(135deg,rgba(16,185,129,0.08),rgba(6,182,212,0.08));border:1px solid rgba(16,185,129,0.2);border-radius:12px">
    <div style="font-size:1.8rem">&#128421;</div>
    <div>
      <div style="font-family:var(--display);font-weight:700;font-size:1rem">NVIDIA GB10 Grace Blackwell</div>
      <div style="font-size:.8rem;color:var(--text3);margin-top:2px">192GB LPDDR5X &bull; Sovereign On-Premises Hardware &bull; Meridian Dynamics Data Center</div>
    </div>
    <div style="margin-left:auto;display:flex;gap:10px">
      <span class="badge badge-e"><span class="pulse" style="width:6px;height:6px;margin-right:2px"></span>Online</span>
      <span class="badge badge-c">9 Models Loaded</span>
    </div>
  </div>

  <!-- Engine grid -->
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:32px" id="engine-grid">

    <!-- Engine card template (filled by JS) -->
    <div class="card" style="padding:20px;border-color:rgba(244,63,94,0.4);box-shadow:0 0 20px rgba(244,63,94,0.2)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
        <div>
          <div style="font-family:var(--display);font-weight:700;font-size:1rem">Core</div>
          <div style="font-size:.7rem;color:var(--text3)">70B &bull; Llama &bull; :8001</div>
        </div>
        <span class="badge badge-r" style="font-size:.65rem">ACTIVE</span>
      </div>
      <div style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;font-size:.72rem;color:var(--text3);margin-bottom:5px"><span>VRAM</span><span id="core-vram-pct">87%</span></div>
        <div style="height:5px;background:var(--bg3);border-radius:3px;overflow:hidden"><div id="core-vram-bar" style="height:100%;width:87%;background:linear-gradient(90deg,var(--rose),var(--amber));border-radius:3px;transition:width .8s ease"></div></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div style="background:var(--bg2);border-radius:6px;padding:8px;text-align:center">
          <div style="font-family:var(--mono);font-size:.9rem;font-weight:600;color:var(--rose)" id="core-tps">248</div>
          <div style="font-size:.63rem;color:var(--text3);margin-top:2px">tok/sec</div>
        </div>
        <div style="background:var(--bg2);border-radius:6px;padding:8px;text-align:center">
          <div style="font-family:var(--mono);font-size:.9rem;font-weight:600;color:var(--rose)" id="core-lat">1842</div>
          <div style="font-size:.63rem;color:var(--text3);margin-top:2px">ms</div>
        </div>
      </div>
    </div>

    <div class="card" style="padding:20px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
        <div>
          <div style="font-family:var(--display);font-weight:700;font-size:1rem">Spark</div>
          <div style="font-size:.7rem;color:var(--text3)">1B &bull; Llama &bull; :8000</div>
        </div>
        <span class="badge badge-c">ROUTING</span>
      </div>
      <div style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;font-size:.72rem;color:var(--text3);margin-bottom:5px"><span>VRAM</span><span id="spark-vram-pct">23%</span></div>
        <div style="height:5px;background:var(--bg3);border-radius:3px;overflow:hidden"><div id="spark-vram-bar" style="height:100%;width:23%;background:linear-gradient(90deg,var(--emerald),var(--cyan));border-radius:3px;transition:width .8s ease"></div></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div style="background:var(--bg2);border-radius:6px;padding:8px;text-align:center">
          <div style="font-family:var(--mono);font-size:.9rem;font-weight:600;color:var(--cyan)" id="spark-tps">1240</div>
          <div style="font-size:.63rem;color:var(--text3);margin-top:2px">tok/sec</div>
        </div>
        <div style="background:var(--bg2);border-radius:6px;padding:8px;text-align:center">
          <div style="font-family:var(--mono);font-size:.9rem;font-weight:600;color:var(--cyan)" id="spark-lat">94</div>
          <div style="font-size:.63rem;color:var(--text3);margin-top:2px">ms</div>
        </div>
      </div>
    </div>

    <div class="card" style="padding:20px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
        <div>
          <div style="font-family:var(--display);font-weight:700;font-size:1rem">Rune</div>
          <div style="font-size:.7rem;color:var(--text3)">8B &bull; Llama &bull; :8004</div>
        </div>
        <span class="badge badge-e">IDLE</span>
      </div>
      <div style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;font-size:.72rem;color:var(--text3);margin-bottom:5px"><span>VRAM</span><span>8%</span></div>
        <div style="height:5px;background:var(--bg3);border-radius:3px;overflow:hidden"><div style="height:100%;width:8%;background:var(--emerald);border-radius:3px"></div></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div style="background:var(--bg2);border-radius:6px;padding:8px;text-align:center">
          <div style="font-family:var(--mono);font-size:.9rem;font-weight:600;color:var(--text3)">0</div>
          <div style="font-size:.63rem;color:var(--text3);margin-top:2px">tok/sec</div>
        </div>
        <div style="background:var(--bg2);border-radius:6px;padding:8px;text-align:center">
          <div style="font-family:var(--mono);font-size:.9rem;font-weight:600;color:var(--text3)">--</div>
          <div style="font-size:.63rem;color:var(--text3);margin-top:2px">ms</div>
        </div>
      </div>
    </div>

    <div class="card" style="padding:20px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
        <div>
          <div style="font-family:var(--display);font-weight:700;font-size:1rem">Drishti</div>
          <div style="font-size:.7rem;color:var(--text3)">3B &bull; Llama &bull; :8002</div>
        </div>
        <span class="badge badge-e">IDLE</span>
      </div>
      <div style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;font-size:.72rem;color:var(--text3);margin-bottom:5px"><span>VRAM</span><span>12%</span></div>
        <div style="height:5px;background:var(--bg3);border-radius:3px;overflow:hidden"><div style="height:100%;width:12%;background:var(--emerald);border-radius:3px"></div></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div style="background:var(--bg2);border-radius:6px;padding:8px;text-align:center">
          <div style="font-family:var(--mono);font-size:.9rem;font-weight:600;color:var(--text3)">0</div>
          <div style="font-size:.63rem;color:var(--text3);margin-top:2px">tok/sec</div>
        </div>
        <div style="background:var(--bg2);border-radius:6px;padding:8px;text-align:center">
          <div style="font-family:var(--mono);font-size:.9rem;font-weight:600;color:var(--text3)">--</div>
          <div style="font-size:.63rem;color:var(--text3);margin-top:2px">ms</div>
        </div>
      </div>
    </div>

    <div class="card" style="padding:20px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
        <div>
          <div style="font-family:var(--display);font-weight:700;font-size:1rem">Echo</div>
          <div style="font-size:.7rem;color:var(--text3)">1.5B &bull; Whisper &bull; :8003</div>
        </div>
        <span class="badge badge-e">IDLE</span>
      </div>
      <div style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;font-size:.72rem;color:var(--text3);margin-bottom:5px"><span>VRAM</span><span>5%</span></div>
        <div style="height:5px;background:var(--bg3);border-radius:3px;overflow:hidden"><div style="height:100%;width:5%;background:var(--emerald);border-radius:3px"></div></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div style="background:var(--bg2);border-radius:6px;padding:8px;text-align:center">
          <div style="font-family:var(--mono);font-size:.9rem;font-weight:600;color:var(--text3)">0</div>
          <div style="font-size:.63rem;color:var(--text3);margin-top:2px">tok/sec</div>
        </div>
        <div style="background:var(--bg2);border-radius:6px;padding:8px;text-align:center">
          <div style="font-family:var(--mono);font-size:.9rem;font-weight:600;color:var(--text3)">--</div>
          <div style="font-size:.63rem;color:var(--text3);margin-top:2px">ms</div>
        </div>
      </div>
    </div>

    <div class="card" style="padding:20px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
        <div>
          <div style="font-family:var(--display);font-weight:700;font-size:1rem">Prism</div>
          <div style="font-size:.7rem;color:var(--text3)">6.6B &bull; ComfyUI &bull; :8005</div>
        </div>
        <span class="badge badge-e">IDLE</span>
      </div>
      <div style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;font-size:.72rem;color:var(--text3);margin-bottom:5px"><span>VRAM</span><span>18%</span></div>
        <div style="height:5px;background:var(--bg3);border-radius:3px;overflow:hidden"><div style="height:100%;width:18%;background:var(--emerald);border-radius:3px"></div></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div style="background:var(--bg2);border-radius:6px;padding:8px;text-align:center">
          <div style="font-family:var(--mono);font-size:.9rem;font-weight:600;color:var(--text3)">0</div>
          <div style="font-size:.63rem;color:var(--text3);margin-top:2px">tok/sec</div>
        </div>
        <div style="background:var(--bg2);border-radius:6px;padding:8px;text-align:center">
          <div style="font-family:var(--mono);font-size:.9rem;font-weight:600;color:var(--text3)">--</div>
          <div style="font-size:.63rem;color:var(--text3);margin-top:2px">ms</div>
        </div>
      </div>
    </div>

    <div class="card" style="padding:20px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
        <div>
          <div style="font-family:var(--display);font-weight:700;font-size:1rem">Vaani</div>
          <div style="font-size:.7rem;color:var(--text3)">82M &bull; Kokoro &bull; :8006</div>
        </div>
        <span class="badge badge-e">IDLE</span>
      </div>
      <div style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;font-size:.72rem;color:var(--text3);margin-bottom:5px"><span>VRAM</span><span>3%</span></div>
        <div style="height:5px;background:var(--bg3);border-radius:3px;overflow:hidden"><div style="height:100%;width:3%;background:var(--emerald);border-radius:3px"></div></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div style="background:var(--bg2);border-radius:6px;padding:8px;text-align:center">
          <div style="font-family:var(--mono);font-size:.9rem;font-weight:600;color:var(--text3)">0</div>
          <div style="font-size:.63rem;color:var(--text3);margin-top:2px">tok/sec</div>
        </div>
        <div style="background:var(--bg2);border-radius:6px;padding:8px;text-align:center">
          <div style="font-family:var(--mono);font-size:.9rem;font-weight:600;color:var(--text3)">--</div>
          <div style="font-size:.63rem;color:var(--text3);margin-top:2px">ms</div>
        </div>
      </div>
    </div>

    <!-- Slot availability -->
    <div class="card" style="padding:20px;border-style:dashed;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;min-height:160px">
      <div style="font-size:1.5rem;color:var(--text3)">+</div>
      <div style="font-size:.8rem;font-weight:600;color:var(--text3)">2 slots available</div>
      <div style="font-size:.72rem;color:var(--text3);text-align:center">Hot-deploy any model via LoRA training pipeline</div>
    </div>

  </div><!-- /engine-grid -->

  <!-- Stats row -->
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:0">
    <div class="card card-accent" style="padding:16px 20px;display:flex;align-items:center;gap:14px">
      <div style="font-family:var(--mono);font-size:1.4rem;font-weight:700;color:var(--rose)" id="stat-infer">1,847</div>
      <div style="font-size:.75rem;color:var(--text2);line-height:1.4">Total inferences<br>today</div>
    </div>
    <div class="card card-accent" style="padding:16px 20px;display:flex;align-items:center;gap:14px">
      <div style="font-family:var(--mono);font-size:1.4rem;font-weight:700;color:var(--cyan)" id="stat-tps">1,488</div>
      <div style="font-size:.75rem;color:var(--text2);line-height:1.4">Combined<br>tokens/sec</div>
    </div>
    <div class="card card-accent" style="padding:16px 20px;display:flex;align-items:center;gap:14px">
      <div style="font-family:var(--mono);font-size:1.4rem;font-weight:700;color:var(--emerald)" id="stat-uptime">99.97%</div>
      <div style="font-size:.75rem;color:var(--text2);line-height:1.4">Uptime<br>30 days</div>
    </div>
    <div class="card card-accent" style="padding:16px 20px;display:flex;align-items:center;gap:14px">
      <div style="font-family:var(--mono);font-size:1.4rem;font-weight:700;color:var(--amber)">$0</div>
      <div style="font-size:.75rem;color:var(--text2);line-height:1.4">Cloud API<br>spend</div>
    </div>
  </div>

  <div class="wrap" style="padding:0">
  <div class="scene-footer">
    <button class="btn-ghost" onclick="goScene(2)">&larr; Back</button>
    <div class="scene-footer-info">Core has processed the query. Every token stayed on-prem. Next: the governance anchor.</div>
    <button class="btn" onclick="goScene(4)">Lineage Anchor &rarr;</button>
  </div>
  </div>
</div>
</div>
</div>

''')
print("Chunk 3 written.")
