"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/useAuth";

function AnimatedNumber({ target }: { target: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let cur = 0;
    const step = target / 40;
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { setN(target); clearInterval(t); }
      else setN(Math.floor(cur));
    }, 20);
    return () => clearInterval(t);
  }, [target]);
  return <>{n}</>;
}

function Slideshow({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);
  useEffect(() => {
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => { setIdx(i => (i + 1) % images.length); setFade(true); }, 400);
    }, 3500);
    return () => clearInterval(t);
  }, [images.length]);
  return (
    <div style={{ position:"relative", width:"100%", height:160, overflow:"hidden", borderRadius:"12px 12px 0 0" }}>
      <img src={images[idx]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", opacity: fade ? 1 : 0, transition:"opacity 0.4s ease", filter:"brightness(0.45) saturate(0.7)" }} />
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 40%, #111318 100%)" }} />
      <div style={{ position:"absolute", bottom:10, left:0, right:0, display:"flex", justifyContent:"center", gap:5 }}>
        {images.map((_,i) => (
          <div key={i} style={{ width: i===idx ? 16 : 4, height:4, borderRadius:2, background: i===idx ? "#f97316" : "rgba(255,255,255,0.2)", transition:"all .3s" }} />
        ))}
      </div>
    </div>
  );
}

const MODULE_IMAGES = {
  relief: [
    "https://images.unsplash.com/photo-1504309092620-4d0ec726efa4?w=600&q=60",
    "https://images.unsplash.com/photo-1548438294-1ad5d5f4f063?w=600&q=60",
    "https://images.unsplash.com/photo-1473621038790-b778b4750efe?w=600&q=60",
  ],
  pool: [
    "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&q=60",
    "https://images.unsplash.com/photo-1541802645635-11f2286a7482?w=600&q=60",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=60",
  ],
  vacancies: [
    "https://images.unsplash.com/photo-1504309092620-4d0ec726efa4?w=600&q=60",
    "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=600&q=60",
    "https://images.unsplash.com/photo-1526958097901-5e6d742d3371?w=600&q=60",
  ],
  checklist: [
    "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=600&q=60",
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=60",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=60",
  ],
};

export default function Home() {
  const { checking } = useAuth();
  const [stats, setStats] = useState({ seafarers:0, vacancies:0, placements:0, alerts:0 });
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [heroIdx, setHeroIdx] = useState(0);
  const [heroFade, setHeroFade] = useState(true);

  const HERO_IMAGES = [
    "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=1400&q=70",
    "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=1600&q=70",
    "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1600&q=70",
    "https://images.unsplash.com/photo-1519214605650-76519d3f6ef0?w=1600&q=70",
  ];

  useEffect(() => {
    async function load() {
      const [s,v,p,a] = await Promise.all([
        supabase.from("seafarers").select("count").single(),
        supabase.from("vacancies").select("count").single(),
        supabase.from("placements").select("count").single(),
        supabase.from("relief_alerts").select("count").single(),
      ]);
      setStats({ seafarers:s.data?.count||0, vacancies:v.data?.count||0, placements:p.data?.count||0, alerts:a.data?.count||0 });
    }
    load();
    const tick = () => {
      const n = new Date();
      setTime(n.toLocaleTimeString("en-GB",{timeZone:"Africa/Lagos",hour:"2-digit",minute:"2-digit",second:"2-digit"}));
      setDate(n.toLocaleDateString("en-GB",{timeZone:"Africa/Lagos",weekday:"long",day:"numeric",month:"long",year:"numeric"}));
    };
    tick();
    const clock = setInterval(tick, 1000);
    const hero = setInterval(() => {
      setHeroFade(false);
      setTimeout(() => { setHeroIdx(i => (i+1) % HERO_IMAGES.length); setHeroFade(true); }, 500);
    }, 5000);
    // Preload
    [...HERO_IMAGES, ...Object.values(MODULE_IMAGES).flat()].forEach(src => { const img = new Image(); img.src = src; });
    return () => { clearInterval(clock); clearInterval(hero); };
  }, []);

  const MODULES = [
    { href:"/relief",    images:MODULE_IMAGES.relief,    tag:"AUTOMATED",    name:"Relief Planning",       desc:"Automated contract tracking. 28, 14, 7-day alerts fire to Telegram before sign-off deadlines.", stat:`${stats.seafarers} tracked` },
    { href:"/pool",      images:MODULE_IMAGES.pool,      tag:"AI-POWERED",   name:"Seafarer Pool",         desc:"Full crew roster with cert tracking, availability, and AI-powered candidate matching.", stat:`${stats.seafarers} registered` },
    { href:"/vacancies", images:MODULE_IMAGES.vacancies, tag:"LIVE DATA",    name:"Vacancy Pipeline",      desc:"Kanban board for every open position. Post, shortlist, confirm — all in real time.", stat:`${stats.vacancies} open` },
    { href:"/checklist", images:MODULE_IMAGES.checklist, tag:"COMPLIANCE",   name:"Pre-Joining Checklist", desc:"26-point checklist covering documents, medical, travel, and vessel instructions.", stat:"26 checkpoints" },
  ];

  if (checking) return <div style={{ minHeight:"100vh", background:"#0d0e12", display:"flex", alignItems:"center", justifyContent:"center", color:"#f97316", fontFamily:"Bebas Neue", fontSize:24, letterSpacing:4 }}>LOADING...</div>;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.3} }
        html,body { background:#0d0e12; }

        .page { font-family:'Outfit',sans-serif; background:#0d0e12; color:#e2e8f0; min-height:100vh; }

        /* ── SIDEBAR ── */
        .sidebar {
          position:fixed; left:0; top:0; bottom:0; width:220px;
          background:#111318;
          border-right:1px solid rgba(255,255,255,0.05);
          display:flex; flex-direction:column;
          z-index:200; padding:0;
        }
        .sidebar-brand {
          padding:20px 22px 18px;
          border-bottom:1px solid rgba(255,255,255,0.05);
          text-decoration:none;
        }
        .sidebar-logo {
          font-family:'Bebas Neue',sans-serif;
          font-size:22px; letter-spacing:4px; color:#fff;
        }
        .sidebar-logo span { color:#f97316; }
        .sidebar-tagline {
          font-size:9px; font-weight:600; color:#374151;
          letter-spacing:2px; margin-top:2px;
        }
        .sidebar-nav { flex:1; padding:16px 12px; overflow-y:auto; }
        .sidebar-section {
          font-size:9px; font-weight:700; color:#374151;
          letter-spacing:2.5px; padding:0 10px; margin:16px 0 6px;
        }
        .sidebar-link {
          display:flex; align-items:center; gap:10px;
          padding:9px 10px; border-radius:8px;
          font-size:13px; font-weight:500; color:#6b7280;
          text-decoration:none; transition:all .15s; margin-bottom:2px;
        }
        .sidebar-link:hover { background:rgba(255,255,255,0.04); color:#e2e8f0; }
        .sidebar-link.active { background:rgba(249,115,22,0.1); color:#f97316; }
        .sidebar-link-icon { font-size:15px; width:20px; text-align:center; }
        .sidebar-bottom {
          padding:16px 12px;
          border-top:1px solid rgba(255,255,255,0.05);
        }
        .sidebar-status {
          display:flex; align-items:center; gap:8px;
          padding:8px 10px; border-radius:8px;
          background:rgba(34,197,94,0.06);
          border:1px solid rgba(34,197,94,0.12);
        }
        .sidebar-status-dot {
          width:6px; height:6px; border-radius:50%;
          background:#22c55e; animation:pulse 2s infinite;
        }
        .sidebar-status-text { font-size:11px; font-weight:600; color:#22c55e; }

        /* ── MAIN ── */
        .main { margin-left:220px; min-height:100vh; }

        /* ── TOP BAR ── */
        .topbar {
          background:#111318;
          border-bottom:1px solid rgba(255,255,255,0.05);
          padding:0 32px; height:56px;
          display:flex; align-items:center; justify-content:space-between;
          position:sticky; top:0; z-index:100;
        }
        .topbar-title { font-size:14px; font-weight:700; color:#e2e8f0; }
        .topbar-right { display:flex; align-items:center; gap:16px; }
        .topbar-time {
          font-family:'Bebas Neue',sans-serif;
          font-size:18px; color:#f97316; letter-spacing:2px;
        }
        .topbar-date { font-size:10px; color:#374151; font-weight:500; }

        /* ── HERO BANNER ── */
        .hero {
          position:relative; height:340px; overflow:hidden;
          margin:24px 28px 0; border-radius:16px;
        }
        .hero-img {
          position:absolute; inset:0;
          background-size:cover; background-position:center 30%;
          transition:opacity .6s ease;
        }
        .hero-overlay {
          position:absolute; inset:0;
          background:linear-gradient(135deg, rgba(13,14,18,0.85) 0%, rgba(13,14,18,0.3) 60%, rgba(13,14,18,0.75) 100%);
        }
        .hero-content {
          position:relative; z-index:10;
          padding:40px 44px; height:100%;
          display:flex; flex-direction:column; justify-content:flex-end;
        }
        .hero-badge {
          display:inline-flex; align-items:center; gap:7px;
          background:rgba(249,115,22,0.15); border:1px solid rgba(249,115,22,0.3);
          color:#fb923c; font-size:9px; font-weight:700; letter-spacing:3px;
          padding:4px 12px; border-radius:4px; margin-bottom:16px; width:fit-content;
        }
        .hero-h1 {
          font-family:'Bebas Neue',sans-serif;
          font-size:52px; line-height:.95; letter-spacing:2px; margin-bottom:12px;
        }
        .hero-h1 span { color:#f97316; }
        .hero-p { font-size:13px; color:rgba(255,255,255,0.45); max-width:400px; line-height:1.65; margin-bottom:24px; }
        .hero-btns { display:flex; gap:10px; }
        .btn-primary {
          background:#f97316; color:#fff;
          font-family:'Outfit',sans-serif; font-size:12px; font-weight:700;
          padding:9px 20px; border-radius:8px; border:none; cursor:pointer;
          text-decoration:none; transition:all .2s;
          box-shadow:0 4px 16px rgba(249,115,22,0.35);
        }
        .btn-primary:hover { background:#ea580c; transform:translateY(-1px); }
        .btn-ghost {
          background:rgba(255,255,255,0.06); color:rgba(255,255,255,0.5);
          font-family:'Outfit',sans-serif; font-size:12px; font-weight:500;
          padding:9px 18px; border-radius:8px;
          border:1px solid rgba(255,255,255,0.1);
          cursor:pointer; text-decoration:none; transition:all .2s;
        }
        .btn-ghost:hover { background:rgba(255,255,255,0.09); color:#fff; }

        /* Hero dots */
        .hero-dots {
          position:absolute; bottom:16px; right:20px;
          display:flex; gap:5px; z-index:10;
        }

        /* ── STATS ── */
        .stats {
          display:grid; grid-template-columns:repeat(4,1fr);
          gap:14px; padding:20px 28px;
        }
        .stat-card {
          background:#111318; border:1px solid rgba(255,255,255,0.05);
          border-radius:12px; padding:18px 20px;
          transition:border-color .2s; cursor:default;
          animation:fadeUp .4s ease var(--d) both;
        }
        .stat-card:hover { border-color:rgba(249,115,22,0.25); }
        .stat-label { font-size:10px; font-weight:600; color:#374151; letter-spacing:2px; margin-bottom:10px; }
        .stat-num {
          font-family:'Bebas Neue',sans-serif;
          font-size:42px; color:#e2e8f0; line-height:1; letter-spacing:-1px;
        }
        .stat-sub { font-size:10px; color:#22c55e; font-weight:600; margin-top:6px; }
        .stat-bar { height:2px; background:#1a1d24; border-radius:1px; margin-top:12px; }
        .stat-bar-fill { height:100%; background:linear-gradient(90deg,#f97316,#fb923c); border-radius:1px; transition:width 1s ease; }

        /* ── MODULES ── */
        .modules-header { padding:8px 28px 16px; display:flex; align-items:center; justify-content:space-between; }
        .modules-title { font-family:'Bebas Neue',sans-serif; font-size:22px; letter-spacing:2px; color:#e2e8f0; }
        .modules-sub { font-size:11px; color:#374151; margin-top:2px; }
        .modules-grid {
          display:grid; grid-template-columns:1fr 1fr;
          gap:14px; padding:0 28px 32px;
        }
        .module-card {
          background:#111318; border:1px solid rgba(255,255,255,0.05);
          border-radius:14px; overflow:hidden;
          text-decoration:none; color:#e2e8f0; display:block;
          transition:border-color .25s, transform .25s;
          animation:fadeUp .5s ease var(--d) both;
        }
        .module-card:hover { border-color:rgba(249,115,22,0.35); transform:translateY(-2px); }
        .module-body { padding:18px 20px 22px; }
        .module-tag { font-size:9px; font-weight:700; letter-spacing:2.5px; color:#f97316; display:block; margin-bottom:8px; }
        .module-name { font-family:'Bebas Neue',sans-serif; font-size:22px; letter-spacing:1px; margin-bottom:6px; line-height:1; }
        .module-desc { font-size:12px; color:#4b5563; line-height:1.6; margin-bottom:14px; }
        .module-footer { display:flex; align-items:center; justify-content:space-between; }
        .module-stat { font-size:10px; color:#374151; font-weight:500; }
        .module-arrow {
          width:26px; height:26px; border-radius:7px;
          background:rgba(249,115,22,0.08); border:1px solid rgba(249,115,22,0.15);
          display:flex; align-items:center; justify-content:center;
          font-size:12px; color:#f97316; transition:all .2s;
        }
        .module-card:hover .module-arrow { background:#f97316; color:#fff; transform:translateX(2px); }
      `}</style>

      <div className="page">

        {/* ── SIDEBAR ── */}
        {/* <aside className="sidebar">
          <a href="/" className="sidebar-brand">
            <div className="sidebar-logo">CREW<span>FLOW</span></div>
            <div className="sidebar-tagline">MARITIME CREW MANAGEMENT</div>
          </a>

          <nav className="sidebar-nav">
            <div className="sidebar-section">OVERVIEW</div>
            <a href="/" className="sidebar-link active">
              <span className="sidebar-link-icon">⊞</span> Dashboard
            </a>

            <div className="sidebar-section">MODULES</div>
            <a href="/relief" className="sidebar-link">
              <span className="sidebar-link-icon">🔔</span> Relief Planning
            </a>
            <a href="/pool" className="sidebar-link">
              <span className="sidebar-link-icon">👥</span> Seafarer Pool
            </a>
            <a href="/vacancies" className="sidebar-link">
              <span className="sidebar-link-icon">📋</span> Vacancies
            </a>
            <a href="/checklist" className="sidebar-link">
              <span className="sidebar-link-icon">✅</span> Pre-Joining
            </a>

            <div className="sidebar-section">AUTOMATION</div>
            <a href="#" className="sidebar-link">
              <span className="sidebar-link-icon">⚡</span> n8n Workflows
            </a>
            <a href="#" className="sidebar-link">
              <span className="sidebar-link-icon">📊</span> Alert Logs
            </a>
          </nav>

          <div className="sidebar-bottom">
            <button onClick={async () => { const { supabase } = await import("../lib/supabase"); await supabase.auth.signOut(); window.location.href = "/login"; }}
              style={{ width:"100%", background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.15)", borderRadius:8, padding:"8px 12px", color:"#ef4444", fontSize:12, fontWeight:600, cursor:"pointer", marginBottom:10, fontFamily:"Outfit,sans-serif", transition:"all .2s" }}>
              Sign Out
            </button>
            <div className="sidebar-status">
              <div className="sidebar-status-dot" />
              <div>
                <div className="sidebar-status-text">All Systems Live</div>
                <div style={{ fontSize:9, color:"#374151", marginTop:1 }}>Supabase · n8n · Vercel</div>
              </div>
            </div>
          </div>
        </aside> */}

        {/* // Replace the entire <aside className="sidebar"> block with this: */}
        <aside className="sidebar">
          <a href="/" className="sidebar-brand">
            <div className="sidebar-logo">CREW<span>FLOW</span></div>
            <div className="sidebar-tagline">MARITIME CREW MANAGEMENT</div>
          </a>

          <nav className="sidebar-nav">
            <div className="sidebar-section">OVERVIEW</div>
            <a href="/dashboard" className="sidebar-link active">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
              Dashboard
            </a>

            <div className="sidebar-section">MODULES</div>
            <a href="/relief" className="sidebar-link">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="M12 6v6l4 2" /></svg>
              Relief Planning
            </a>
            <a href="/pool" className="sidebar-link">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              Seafarer Pool
            </a>
            <a href="/vacancies" className="sidebar-link">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
              Vacancies
            </a>
            <a href="/checklist" className="sidebar-link">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
              Pre-Joining
            </a>

            <div className="sidebar-section">AUTOMATION</div>
            <a href="#" className="sidebar-link">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
              n8n Workflows
            </a>
            <a href="#" className="sidebar-link">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
              Alert Logs
            </a>
          </nav>

          <div className="sidebar-bottom">
            <button onClick={async () => { const { supabase } = await import("../lib/supabase"); await supabase.auth.signOut(); window.location.href = "/login"; }}
              style={{ width:"100%", background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.15)", borderRadius:8, padding:"8px 12px", color:"#ef4444", fontSize:12, fontWeight:600, cursor:"pointer", marginBottom:10, fontFamily:"Outfit,sans-serif", transition:"all .2s" }}>
              Sign Out
            </button>
            <div className="sidebar-status">
              <div className="sidebar-status-dot" />
              <div>
                <div className="sidebar-status-text">All Systems Live</div>
                <div style={{ fontSize: 9, color: "#374151", marginTop: 1 }}>Supabase · n8n · Vercel</div>
              </div>
            </div>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="main">

          {/* Top bar */}
          <div className="topbar">
            <div className="topbar-title">Operations Overview</div>
            <div className="topbar-right">
              <div style={{ textAlign:"right" }}>
                <div className="topbar-time">{time || "00:00:00"}</div>
                <div className="topbar-date">WAT · {date}</div>
              </div>
            </div>
          </div>

          {/* Hero */}
          <div className="hero">
            <div className="hero-img" style={{ backgroundImage:`url(${HERO_IMAGES[heroIdx]})`, opacity:heroFade?1:0 }} />
            <div className="hero-overlay" />
            <div className="hero-content">
              <div className="hero-badge">
                <div style={{ width:5,height:5,borderRadius:"50%",background:"#f97316",animation:"pulse 1.5s infinite" }} />
                MARITIME CREW MANAGEMENT SYSTEM
              </div>
              <h1 className="hero-h1">MANAGING YOUR<br /><span>CREW</span> SMARTER.</h1>
              <p className="hero-p">Complete crew lifecycle management — relief planning, seafarer deployment, vacancy tracking, and pre-joining compliance.</p>
              <div className="hero-btns">
                <a href="/relief" className="btn-primary">Open Relief Dashboard</a>
                <a href="/pool" className="btn-ghost">Seafarer Pool →</a>
              </div>
            </div>
            {/* Hero image dots */}
            <div className="hero-dots">
              {HERO_IMAGES.map((_,i) => (
                <div key={i} style={{ width:i===heroIdx?16:4, height:4, borderRadius:2, background:i===heroIdx?"#f97316":"rgba(255,255,255,0.2)", transition:"all .3s" }} />
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="stats">
            {[
              { label:"ACTIVE SEAFARERS", n:stats.seafarers,  sub:"In database",    d:".2s" },
              { label:"OPEN VACANCIES",   n:stats.vacancies,  sub:"Across vessels", d:".25s" },
              { label:"PLACEMENTS MADE",  n:stats.placements, sub:"This cycle",     d:".3s" },
              { label:"ALERTS SENT",      n:stats.alerts,     sub:"Via automation", d:".35s" },
            ].map(s => (
              <div key={s.label} className="stat-card" style={{ "--d":s.d } as any}>
                <div className="stat-label">{s.label}</div>
                <div className="stat-num"><AnimatedNumber target={s.n} /></div>
                <div className="stat-sub">↑ {s.sub}</div>
                <div className="stat-bar">
                  <div className="stat-bar-fill" style={{ width:`${Math.min(s.n*8,100)}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Modules */}
          <div className="modules-header">
            <div>
              <div className="modules-title">PLATFORM MODULES</div>
              <div className="modules-sub">Four integrated modules — one complete crew management system</div>
            </div>
          </div>

          <div className="modules-grid">
            {MODULES.map((m,i) => (
              <a key={m.href} href={m.href} className="module-card" style={{ "--d":`${.3+i*.07}s` } as any}>
                <Slideshow images={m.images} />
                <div className="module-body">
                  <span className="module-tag">{m.tag}</span>
                  <div className="module-name">{m.name}</div>
                  <div className="module-desc">{m.desc}</div>
                  <div className="module-footer">
                    <span className="module-stat">{m.stat}</span>
                    <div className="module-arrow">→</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}