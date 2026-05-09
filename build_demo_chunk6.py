out = r'C:\Users\Fran\.gemini\antigravity\scratch\meridian\meridian-demo.html'
ACCESS_CODE = 'MERIDIAN2026'
with open(out, 'a', encoding='utf-8') as f:
    f.write('''
<!-- ====== ACCESS GATE ====== -->
<div id="gate" style="position:fixed;inset:0;z-index:9999;background:var(--bg);display:flex;align-items:center;justify-content:center;padding:24px">
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,rgba(99,102,241,0.12),transparent 60%);pointer-events:none"></div>
  <div class="card card-accent" style="max-width:440px;width:100%;padding:48px 40px;text-align:center;position:relative;z-index:1">
    <div style="font-family:var(--display);font-weight:800;font-size:1.1rem;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:6px">Meridian Dynamics</div>
    <div style="font-size:.75rem;color:var(--text3);letter-spacing:.08em;text-transform:uppercase;margin-bottom:32px">AI Governance Demo &bull; AI Standards, Inc.</div>
    <h3 style="font-family:var(--display);font-size:1.4rem;margin-bottom:10px">Restricted Access</h3>
    <p style="font-size:.9rem;color:var(--text2);margin-bottom:32px;line-height:1.65">This demonstration is shared selectively with qualified prospects. Enter your access code to continue.</p>
    <input id="gate-input" type="password" placeholder="Enter access code" style="width:100%;padding:14px 18px;background:var(--bg2);border:1px solid var(--border);border-radius:10px;color:var(--text);font-family:var(--font);font-size:1rem;outline:none;margin-bottom:12px;transition:border-color .2s" onkeydown="if(event.key==='Enter')checkGate()">
    <div id="gate-err" style="color:var(--rose);font-size:.82rem;margin-bottom:12px;min-height:20px"></div>
    <button class="btn" onclick="checkGate()" style="width:100%;justify-content:center">Access Demo &rarr;</button>
    <div style="margin-top:24px;font-size:.78rem;color:var(--text3)">Don&rsquo;t have an access code? <a href="mailto:fran@predictionmarketing.ai?subject=Meridian%20Demo%20Access" style="color:var(--indigo);text-decoration:none">Request one &rarr;</a></div>
  </div>
</div>

<script>
// ============================================================
// MERIDIAN DYNAMICS DEMO — JAVASCRIPT
// ============================================================

var ACCESS = 'MERIDIAN2026';
var currentScene = 0;
var telemetryInterval = null;
var hashInterval = null;

// --- GATE ---
function checkGate() {
  var v = document.getElementById('gate-input').value.trim().toUpperCase();
  if (v === ACCESS) {
    document.getElementById('gate').style.opacity = '0';
    document.getElementById('gate').style.transition = 'opacity .5s ease';
    setTimeout(function(){ document.getElementById('gate').style.display = 'none'; }, 500);
    startCounters();
  } else {
    var err = document.getElementById('gate-err');
    err.textContent = 'Incorrect access code. Contact fran@predictionmarketing.ai for access.';
    var inp = document.getElementById('gate-input');
    inp.style.borderColor = 'var(--rose)';
    setTimeout(function(){ inp.style.borderColor = 'var(--border)'; err.textContent = ''; }, 3000);
  }
}
document.getElementById('gate-input').addEventListener('focus', function(){ this.style.borderColor = 'var(--indigo)'; });
document.getElementById('gate-input').addEventListener('blur', function(){ this.style.borderColor = 'var(--border)'; });

// --- COUNTERS ---
function animCount(id, target, duration, prefix, suffix) {
  var el = document.getElementById(id);
  if (!el) return;
  prefix = prefix || ''; suffix = suffix || '';
  var start = 0; var step = target / (duration / 16);
  var t = setInterval(function(){
    start = Math.min(start + step, target);
    el.textContent = prefix + Math.floor(start).toLocaleString() + suffix;
    if (start >= target) clearInterval(t);
  }, 16);
}
function startCounters() {
  setTimeout(function(){
    animCount('s-employees', 340, 1200);
    animCount('s-agents', 24, 900);
    animCount('s-anchors', 1847, 1400);
    animCount('s-compliance', 100, 1000, '', '%');
  }, 300);
}

// --- DEMO START ---
function startDemo() {
  document.getElementById('hero').style.display = 'none';
  document.getElementById('scenes').style.display = 'block';
  document.getElementById('scene-nav').classList.add('visible');
  goScene(1);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- SCENE NAVIGATION ---
function goScene(n) {
  for (var i = 1; i <= 6; i++) {
    var sc = document.getElementById('scene-' + i);
    var sn = document.getElementById('sn-' + i);
    if (sc) sc.classList.remove('active');
    if (sn) {
      sn.classList.remove('active');
      if (i < n) sn.classList.add('done'); else sn.classList.remove('done');
    }
  }
  var target = document.getElementById('scene-' + n);
  var navTarget = document.getElementById('sn-' + n);
  if (target) { target.classList.add('active'); }
  if (navTarget) { navTarget.classList.add('active'); }
  currentScene = n;
  window.scrollTo({ top: 65, behavior: 'smooth' });
  if (n === 3) startTelemetry(); else stopTelemetry();
  if (n === 4) startHashReveal(); else stopHashReveal();
  if (n === 6) startNexusTick();
}

// --- TELEMETRY TICK (Scene 3) ---
function startTelemetry() {
  if (telemetryInterval) return;
  telemetryInterval = setInterval(function(){
    tickVal('core-tps', 248, 18);
    tickVal('core-lat', 1842, 80);
    tickPct('core-vram-pct', 'core-vram-bar', 87, 4);
    tickVal('spark-tps', 1240, 60);
    tickVal('spark-lat', 94, 8);
    tickPct('spark-vram-pct', 'spark-vram-bar', 23, 3);
    tickVal('stat-infer', 1847, 3);
    tickVal('stat-tps', 1488, 40);
  }, 1800);
}
function stopTelemetry() { if (telemetryInterval) { clearInterval(telemetryInterval); telemetryInterval = null; } }
function tickVal(id, base, range) {
  var el = document.getElementById(id);
  if (!el) return;
  var v = base + Math.floor((Math.random() - 0.5) * range * 2);
  el.textContent = v.toLocaleString();
}
function tickPct(labelId, barId, base, range) {
  var lbl = document.getElementById(labelId);
  var bar = document.getElementById(barId);
  if (!lbl || !bar) return;
  var v = Math.min(99, Math.max(10, base + Math.floor((Math.random() - 0.5) * range * 2)));
  lbl.textContent = v + '%';
  bar.style.width = v + '%';
}

// --- HASH REVEAL (Scene 4) ---
var FULL_HASH = '2b711a34aebe2d165d77f34c52613e5e90347bbcccc0ba755feb03adb908cdb4';
var hashIdx = 0;
function startHashReveal() {
  var el = document.getElementById('hash-display');
  if (!el) return;
  el.textContent = '';
  hashIdx = 0;
  hashInterval = setInterval(function(){
    if (hashIdx < FULL_HASH.length) {
      el.textContent = FULL_HASH.substring(0, hashIdx + 1);
      hashIdx++;
    } else {
      clearInterval(hashInterval);
      hashInterval = null;
      el.style.color = '#67e8f9';
    }
  }, 28);
}
function stopHashReveal() { if (hashInterval) { clearInterval(hashInterval); hashInterval = null; } }

// --- NEXUS TICK (Scene 6) ---
function startNexusTick() {
  setInterval(function(){
    var el = document.getElementById('nx-infer');
    var el2 = document.getElementById('nx-anchors');
    if (el) { var v = parseInt(el.textContent.replace(/,/g,'')) + Math.floor(Math.random()*3); el.textContent = v.toLocaleString(); }
    if (el2) { el2.textContent = el ? el.textContent : '1847'; }
  }, 2200);
}

// --- STYLE GATE INPUT ON LOAD ---
window.addEventListener('load', function(){
  var el = document.querySelector('#gate input');
  if (el) el.focus();
});
</script>
</body>
</html>
''')
print("Chunk 6 written. File complete.")
