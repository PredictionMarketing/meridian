out = r'C:\Users\Fran\.gemini\antigravity\scratch\meridian\meridian-demo.html'
with open(out, 'w', encoding='utf-8') as f:
    f.write('''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Meridian Dynamics | AI Governance in Action | AI Standards, Inc.</title>
<meta name="description" content="See what enterprise AI governance looks like on Day 1. Sovereign intelligence, blockchain-anchored audit trails, zero compliance gaps.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
:root {
  --bg: #0a0e17;
  --bg2: #0f1523;
  --bg3: #141c2e;
  --card: rgba(255,255,255,0.04);
  --card-h: rgba(255,255,255,0.07);
  --border: rgba(255,255,255,0.08);
  --border-h: rgba(255,255,255,0.16);
  --text: #f1f5f9;
  --text2: #94a3b8;
  --text3: #64748b;
  --indigo: #6366f1;
  --cyan: #06b6d4;
  --emerald: #10b981;
  --amber: #f59e0b;
  --rose: #f43f5e;
  --grad: linear-gradient(135deg,#6366f1,#06b6d4);
  --grad-hero: linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#06b6d4 100%);
  --glow-i: 0 0 28px rgba(99,102,241,0.4);
  --glow-c: 0 0 28px rgba(6,182,212,0.4);
  --glow-e: 0 0 28px rgba(16,185,129,0.4);
  --font: 'Inter',-apple-system,sans-serif;
  --display: 'Outfit',sans-serif;
  --mono: 'JetBrains Mono','Courier New',monospace;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:var(--font);background:var(--bg);color:var(--text);line-height:1.6;overflow-x:hidden}
h1,h2,h3,h4{font-family:var(--display);font-weight:700;line-height:1.2}
h1{font-size:clamp(2.4rem,5vw,3.8rem)}
h2{font-size:clamp(1.6rem,3vw,2.2rem)}
h3{font-size:clamp(1.1rem,2vw,1.4rem)}
.wrap{max-width:1200px;margin:0 auto;padding:0 28px}
.wrap-wide{max-width:1400px;margin:0 auto;padding:0 28px}

/* GLASS CARD */
.card{background:var(--card);border:1px solid var(--border);border-radius:16px;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);transition:border-color .3s,box-shadow .3s}
.card:hover{border-color:var(--border-h)}
.card-accent{border-color:rgba(99,102,241,0.35);background:linear-gradient(135deg,rgba(99,102,241,0.07),rgba(6,182,212,0.07))}
.glow-i{box-shadow:var(--glow-i)}
.glow-c{box-shadow:var(--glow-c)}
.glow-e{box-shadow:var(--glow-e)}

/* GRADIENT TEXT */
.gt{background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.gt-hero{background:var(--grad-hero);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}

/* BUTTONS */
.btn{display:inline-flex;align-items:center;gap:8px;padding:14px 32px;background:var(--grad);color:#fff;font-family:var(--font);font-size:1rem;font-weight:600;border:none;border-radius:50px;cursor:pointer;transition:transform .2s,box-shadow .2s;text-decoration:none}
.btn:hover{transform:translateY(-2px);box-shadow:var(--glow-i)}
.btn:active{transform:translateY(0)}
.btn-ghost{display:inline-flex;align-items:center;gap:8px;padding:12px 24px;background:transparent;color:var(--text2);font-family:var(--font);font-size:.9rem;font-weight:500;border:1px solid var(--border);border-radius:50px;cursor:pointer;transition:border-color .2s,color .2s;text-decoration:none}
.btn-ghost:hover{border-color:var(--border-h);color:var(--text)}
.btn-cyan{display:inline-flex;align-items:center;gap:8px;padding:10px 22px;background:rgba(6,182,212,0.12);color:var(--cyan);font-family:var(--font);font-size:.875rem;font-weight:600;border:1px solid rgba(6,182,212,0.3);border-radius:50px;cursor:pointer;transition:background .2s,box-shadow .2s;text-decoration:none}
.btn-cyan:hover{background:rgba(6,182,212,0.2);box-shadow:var(--glow-c)}

/* BADGES */
.badge{display:inline-flex;align-items:center;gap:5px;padding:3px 11px;font-size:.7rem;font-weight:700;border-radius:50px;letter-spacing:.06em;text-transform:uppercase}
.badge-i{background:rgba(99,102,241,0.15);color:#a5b4fc;border:1px solid rgba(99,102,241,0.3)}
.badge-c{background:rgba(6,182,212,0.15);color:#67e8f9;border:1px solid rgba(6,182,212,0.3)}
.badge-e{background:rgba(16,185,129,0.15);color:#6ee7b7;border:1px solid rgba(16,185,129,0.3)}
.badge-a{background:rgba(245,158,11,0.15);color:#fcd34d;border:1px solid rgba(245,158,11,0.3)}
.badge-r{background:rgba(244,63,94,0.15);color:#fda4af;border:1px solid rgba(244,63,94,0.3)}

/* PULSE DOT */
.pulse{width:8px;height:8px;border-radius:50%;background:var(--emerald);position:relative;display:inline-block;flex-shrink:0}
.pulse::after{content:'';position:absolute;inset:-3px;border-radius:50%;background:rgba(16,185,129,0.4);animation:pulse 2s ease-out infinite}
.pulse-a{background:var(--amber)}
.pulse-a::after{background:rgba(245,158,11,0.4)}
.pulse-c{background:var(--cyan)}
.pulse-c::after{background:rgba(6,182,212,0.4)}
@keyframes pulse{0%{transform:scale(1);opacity:.8}70%{transform:scale(2.2);opacity:0}100%{transform:scale(1);opacity:0}}

/* MONO TEXT */
.mono{font-family:var(--mono);font-size:.85rem;color:var(--text2)}
.mono-sm{font-family:var(--mono);font-size:.75rem}
.mono-lg{font-family:var(--mono);font-size:1rem;font-weight:500}

/* NAV */
#topnav{position:fixed;top:0;left:0;right:0;z-index:100;padding:16px 28px;display:flex;align-items:center;justify-content:space-between;background:rgba(10,14,23,0.85);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom:1px solid var(--border)}
.nav-logo{font-family:var(--display);font-weight:800;font-size:1.1rem;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.nav-tag{font-size:.75rem;color:var(--text3);margin-top:1px}
.nav-cta{font-size:.85rem}

/* HERO */
#hero{min-height:100vh;display:flex;align-items:center;padding:120px 0 80px;position:relative;overflow:hidden}
#hero::before{content:'';position:absolute;top:-200px;left:50%;transform:translateX(-50%);width:900px;height:900px;background:radial-gradient(ellipse,rgba(99,102,241,0.12) 0%,rgba(6,182,212,0.06) 40%,transparent 70%);pointer-events:none}
#hero::after{content:'';position:absolute;bottom:-100px;right:-100px;width:500px;height:500px;background:radial-gradient(ellipse,rgba(6,182,212,0.08) 0%,transparent 60%);pointer-events:none}
.hero-inner{position:relative;z-index:1}
.hero-eyebrow{display:flex;align-items:center;gap:10px;margin-bottom:24px}
.hero-eyebrow-line{height:1px;width:48px;background:var(--grad)}
.hero-eyebrow-text{font-size:.8rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--text3)}
.hero-title{margin-bottom:12px}
.hero-company{display:block;font-size:clamp(1rem,2vw,1.2rem);font-weight:400;color:var(--text2);font-family:var(--font);margin-bottom:8px}
.hero-tagline{font-size:clamp(1rem,1.8vw,1.2rem);color:var(--text2);max-width:680px;margin:20px 0 48px;line-height:1.7}
.hero-tagline strong{color:var(--text);font-weight:600}

/* STATS GRID */
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-bottom:56px;max-width:860px}
@media(max-width:700px){.stats-grid{grid-template-columns:repeat(2,1fr)}}
.stat-card{padding:24px 20px;text-align:center;border-radius:16px;background:var(--card);border:1px solid var(--border);position:relative;overflow:hidden}
.stat-card::before{content:'';position:absolute;inset:0;background:var(--gradient-card);opacity:0}
.stat-num{font-family:var(--display);font-size:2rem;font-weight:800;display:block;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.stat-label{font-size:.75rem;font-weight:500;color:var(--text3);letter-spacing:.05em;text-transform:uppercase;margin-top:4px;display:block}
.stat-pre{font-size:.65rem;color:var(--amber);font-weight:600;letter-spacing:.08em;text-transform:uppercase;background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.2);border-radius:50px;padding:2px 8px;margin-top:6px;display:inline-block}
.stat-post{font-size:.65rem;color:var(--emerald);font-weight:600;letter-spacing:.08em;text-transform:uppercase;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);border-radius:50px;padding:2px 8px;margin-top:6px;display:inline-block}

/* HERO BTNS */
.hero-actions{display:flex;align-items:center;gap:16px;flex-wrap:wrap}

/* SCENE WRAPPER */
.scene{display:none;animation:fadeUp .4s ease both}
.scene.active{display:block}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}

/* SCENE NAV */
#scene-nav{position:sticky;top:65px;z-index:90;background:rgba(10,14,23,0.9);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom:1px solid var(--border);padding:0;display:none}
#scene-nav.visible{display:block}
.snav-inner{display:flex;align-items:center;overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none}
.snav-inner::-webkit-scrollbar{display:none}
.snav-step{flex:1;min-width:120px;padding:14px 12px;display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;border-bottom:2px solid transparent;transition:border-color .2s,background .2s;position:relative;white-space:nowrap}
.snav-step:hover{background:var(--card)}
.snav-step.active{border-bottom-color:var(--indigo)}
.snav-step.done{border-bottom-color:var(--emerald)}
.snav-num{width:22px;height:22px;border-radius:50%;background:var(--bg3);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:700;font-family:var(--display);color:var(--text3);transition:all .2s}
.snav-step.active .snav-num{background:var(--indigo);border-color:var(--indigo);color:#fff;box-shadow:0 0 12px rgba(99,102,241,0.5)}
.snav-step.done .snav-num{background:var(--emerald);border-color:var(--emerald);color:#fff}
.snav-label{font-size:.7rem;font-weight:600;color:var(--text3);letter-spacing:.04em;text-align:center}
.snav-step.active .snav-label{color:var(--text2)}
.snav-step.done .snav-label{color:var(--emerald)}

/* SCENE LAYOUT */
.scene-wrap{padding:60px 0 80px}
.scene-header{margin-bottom:48px}
.scene-eyebrow{display:flex;align-items:center;gap:12px;margin-bottom:16px}
.scene-num{font-family:var(--mono);font-size:.8rem;color:var(--text3)}
.scene-title{margin-bottom:12px}
.scene-desc{font-size:1.05rem;color:var(--text2);max-width:680px;line-height:1.75}

/* SCENE FOOTER */
.scene-footer{display:flex;align-items:center;justify-content:space-between;margin-top:56px;padding-top:32px;border-top:1px solid var(--border)}
.scene-footer-info{font-size:.85rem;color:var(--text3)}

/* DIVIDER */
.divider{height:1px;background:linear-gradient(90deg,transparent,var(--border),transparent);margin:20px 0}

/* SCROLLBAR */
::-webkit-scrollbar{width:6px;height:6px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:var(--bg3);border-radius:3px}
::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,0.15)}
</style>
</head>
<body>

<!-- TOP NAV -->
<nav id="topnav">
  <div>
    <div class="nav-logo">Meridian Dynamics</div>
    <div class="nav-tag">Powered by AIOS &mdash; AI Standards, Inc.</div>
  </div>
  <a href="#cta" class="btn nav-cta">Book Assessment &rarr;</a>
</nav>

<!-- HERO -->
<section id="hero">
  <div class="wrap hero-inner">
    <div class="hero-eyebrow">
      <div class="hero-eyebrow-line"></div>
      <span class="hero-eyebrow-text">Enterprise AI Governance Demo</span>
    </div>
    <span class="hero-company">Meridian Dynamics &mdash; $85M ARR &bull; 340 employees &bull; 6 departments</span>
    <h1 class="hero-title">
      <span class="gt-hero">AI that existed<br>before governance did.</span>
    </h1>
    <p class="hero-tagline">
      Multiple disconnected AI systems. No audit trail. No compliance posture.<br>
      <strong>This is what Day 1 of AIOS looks like.</strong>
    </p>
    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-num" id="s-employees">0</span>
        <span class="stat-label">Employees</span>
        <span class="stat-pre">Pre-AIOS</span>
      </div>
      <div class="stat-card">
        <span class="stat-num" id="s-agents">0</span>
        <span class="stat-label">AI Agents Deployed</span>
        <span class="stat-post">AIOS Governed</span>
      </div>
      <div class="stat-card">
        <span class="stat-num" id="s-anchors">0</span>
        <span class="stat-label">Inference Records Anchored</span>
        <span class="stat-post">XRPL Verified</span>
      </div>
      <div class="stat-card">
        <span class="stat-num" id="s-compliance">0%</span>
        <span class="stat-label">EU AI Act Compliance</span>
        <span class="stat-post">Auto-Generated</span>
      </div>
    </div>
    <div class="hero-actions">
      <button class="btn" onclick="startDemo()">Begin the Demo &rarr;</button>
      <a href="#cta" class="btn-ghost">Talk to AI Standards &darr;</a>
    </div>
  </div>
</section>

<!-- SCENE NAV -->
<div id="scene-nav">
  <div class="wrap snav-inner">
    <div class="snav-step" id="sn-1" onclick="goScene(1)">
      <div class="snav-num">1</div>
      <div class="snav-label">Signal Detection</div>
    </div>
    <div class="snav-step" id="sn-2" onclick="goScene(2)">
      <div class="snav-num">2</div>
      <div class="snav-label">ORAK Gateway</div>
    </div>
    <div class="snav-step" id="sn-3" onclick="goScene(3)">
      <div class="snav-num">3</div>
      <div class="snav-label">Sovereign Engines</div>
    </div>
    <div class="snav-step" id="sn-4" onclick="goScene(4)">
      <div class="snav-num">4</div>
      <div class="snav-label">Lineage Anchor</div>
    </div>
    <div class="snav-step" id="sn-5" onclick="goScene(5)">
      <div class="snav-num">5</div>
      <div class="snav-label">Compliance Export</div>
    </div>
    <div class="snav-step" id="sn-6" onclick="goScene(6)">
      <div class="snav-num">6</div>
      <div class="snav-label">Nexus Command</div>
    </div>
  </div>
</div>

''')
print("Chunk 1 written.")
