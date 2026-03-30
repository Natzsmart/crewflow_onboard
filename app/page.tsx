// "use client";
// import { useEffect, useState } from "react";
// import { supabase } from "./lib/supabase";

// export default function Home() {
//   const [status, setStatus] = useState("Checking connection...");
//   const [connected, setConnected] = useState(false);

//   useEffect(() => {
//     async function test() {
//       const { data, error } = await supabase.from("vessels").select("count");
//       if (error) {
//         setStatus("❌ Connection failed: " + error.message);
//       } else {
//         setStatus("✅ Supabase connected successfully!");
//         setConnected(true);
//       }
//     }
//     test();
//   }, []);

//   return (
//     <div style={{
//       minHeight: "100vh",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       flexDirection: "column",
//       gap: 20,
//       background: "#fffbf5",
//       fontFamily: "sans-serif"
//     }}>
//       <div style={{
//         width: 60, height: 60,
//         background: "linear-gradient(135deg, #f97316, #ea580c)",
//         borderRadius: 16,
//         display: "flex", alignItems: "center",
//         justifyContent: "center",
//         fontSize: 30
//       }}>⚓</div>

//       <h1 style={{ fontSize: 32, fontWeight: 900, color: "#1a1a1a", margin: 0 }}>
//         CrewFlow
//       </h1>
//       <p style={{ color: "#6b7280", margin: 0 }}>Maritime Crew Management Platform</p>

//       <div style={{
//         background: connected ? "#f0fdf4" : "#fff",
//         border: `2px solid ${connected ? "#22c55e" : "#fde8cc"}`,
//         borderRadius: 12,
//         padding: "16px 28px",
//         fontSize: 15,
//         fontWeight: 600,
//         color: connected ? "#15803d" : "#92400e"
//       }}>
//         {status}
//       </div>

//       {connected && (
//         <p style={{ color: "#9ca3af", fontSize: 13 }}>
//           Database is live. Ready to build.
//         </p>
//       )}
//     </div>
//   );
// }


// "use client";
// import { useEffect, useState } from "react";
// import { supabase } from "./lib/supabase";

// export default function Home() {
//   const [stats, setStats] = useState({
//     seafarers: 0, vacancies: 0, placements: 0, alerts: 0
//   });

//   useEffect(() => {
//     async function loadStats() {
//       const [s, v, p, a] = await Promise.all([
//         supabase.from("seafarers").select("count").single(),
//         supabase.from("vacancies").select("count").single(),
//         supabase.from("placements").select("count").single(),
//         supabase.from("relief_alerts").select("count").single(),
//       ]);
//       setStats({
//         seafarers: s.data?.count || 0,
//         vacancies: v.data?.count || 0,
//         placements: p.data?.count || 0,
//         alerts: a.data?.count || 0,
//       });
//     }
//     loadStats();
//   }, []);

//   return (
//     <div style={{ padding: "48px 36px", maxWidth: 900, margin: "0 auto" }}>
//       <div style={{ marginBottom: 40 }}>
//         <div style={{ fontSize: 11, fontWeight: 700, color: "#f97316", letterSpacing: 3, marginBottom: 8 }}>
//           WELCOME TO
//         </div>
//         <h1 style={{ fontSize: 42, fontWeight: 900, color: "#1a1a1a", margin: 0, letterSpacing: "-1px" }}>
//           CrewFlow
//         </h1>
//         <p style={{ color: "#6b7280", fontSize: 15, marginTop: 8 }}>
//           Maritime Crew Management Platform — all modules live and connected.
//         </p>
//       </div>

//       {/* Stats */}
//       <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 40 }}>
//         {[
//           { label: "Seafarers", value: stats.seafarers, icon: "👤", href: "/pool" },
//           { label: "Vacancies", value: stats.vacancies, icon: "📋", href: "/vacancies" },
//           { label: "Placements", value: stats.placements, icon: "✅", href: "/vacancies" },
//           { label: "Alerts Sent", value: stats.alerts, icon: "🔔", href: "/relief" },
//         ].map(s => (
//           <a key={s.label} href={s.href} style={{ textDecoration: "none" }}>
//             <div style={{
//               background: "#fff",
//               border: "1.5px solid #fde8cc",
//               borderRadius: 14,
//               padding: "20px",
//               cursor: "pointer",
//               transition: "all .2s"
//             }}>
//               <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
//               <div style={{ fontSize: 32, fontWeight: 900, color: "#f97316" }}>{s.value}</div>
//               <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, marginTop: 4 }}>{s.label}</div>
//             </div>
//           </a>
//         ))}
//       </div>

//       {/* Module links */}
//       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
//         {[
//           { href: "/relief", icon: "🔔", title: "Relief Planning", desc: "Track crew contracts and automate relief alerts" },
//           { href: "/pool", icon: "👤", title: "Seafarer Pool", desc: "Manage available seafarers and certifications" },
//           { href: "/vacancies", icon: "📋", title: "Vacancy Pipeline", desc: "Post vacancies and track placements" },
//           { href: "/checklist", icon: "✅", title: "Pre-Joining Checklist", desc: "Verify documents before seafarers join vessel" },
//         ].map(m => (
//           <a key={m.href} href={m.href} style={{ textDecoration: "none" }}>
//             <div style={{
//               background: "#fff",
//               border: "1.5px solid #fde8cc",
//               borderRadius: 14,
//               padding: "22px 24px",
//               cursor: "pointer"
//             }}>
//               <div style={{ fontSize: 28, marginBottom: 10 }}>{m.icon}</div>
//               <div style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>{m.title}</div>
//               <div style={{ fontSize: 13, color: "#6b7280" }}>{m.desc}</div>
//               <div style={{ marginTop: 14, fontSize: 12, fontWeight: 700, color: "#f97316" }}>Open →</div>
//             </div>
//           </a>
//         ))}
//       </div>
//     </div>
//   );
// }



// "use client";
// import { useEffect, useState } from "react";
// import { supabase } from "./lib/supabase";

// function AnimatedNumber({ target }: { target: number }) {
//   const [n, setN] = useState(0);
//   useEffect(() => {
//     if (target === 0) return;
//     let cur = 0;
//     const step = target / 40;
//     const t = setInterval(() => {
//       cur += step;
//       if (cur >= target) { setN(target); clearInterval(t); }
//       else setN(Math.floor(cur));
//     }, 20);
//     return () => clearInterval(t);
//   }, [target]);
//   return <>{n}</>;
// }

// export default function Home() {
//   const [stats, setStats] = useState({ seafarers: 0, vacancies: 0, placements: 0, alerts: 0 });
//   const [time, setTime] = useState("");
//   const [date, setDate] = useState("");

//   useEffect(() => {
//     async function load() {
//       const [s, v, p, a] = await Promise.all([
//         supabase.from("seafarers").select("count").single(),
//         supabase.from("vacancies").select("count").single(),
//         supabase.from("placements").select("count").single(),
//         supabase.from("relief_alerts").select("count").single(),
//       ]);
//       setStats({
//         seafarers: s.data?.count || 0,
//         vacancies: v.data?.count || 0,
//         placements: p.data?.count || 0,
//         alerts: a.data?.count || 0,
//       });
//     }
//     load();

//     const tick = () => {
//       const now = new Date();
//       setTime(now.toLocaleTimeString("en-GB", { timeZone: "Africa/Lagos", hour: "2-digit", minute: "2-digit", second: "2-digit" }));
//       setDate(now.toLocaleDateString("en-GB", { timeZone: "Africa/Lagos", weekday: "long", day: "numeric", month: "long", year: "numeric" }));
//     };
//     tick();
//     const t = setInterval(tick, 1000);
//     return () => clearInterval(t);
//   }, []);

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700;800&display=swap');

//         * { box-sizing: border-box; margin: 0; padding: 0; }

//         @keyframes fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
//         @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
//         @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.3} }
//         @keyframes kenburns { from{transform:scale(1)} to{transform:scale(1.06)} }
//         @keyframes slideR   { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }

//         .cf-root {
//           font-family: 'Outfit', sans-serif;
//           background: #080808;
//           color: #fff;
//           min-height: 100vh;
//         }

//         /* ── TOP NAV ── */
//         .cf-nav {
//           position: fixed;
//           top: 0; left: 0; right: 0;
//           z-index: 200;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           padding: 0 48px;
//           height: 68px;
//           background: rgba(8,8,8,0.7);
//           backdrop-filter: blur(20px);
//           border-bottom: 1px solid rgba(255,255,255,0.06);
//         }
//         .cf-nav-brand {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           text-decoration: none;
//         }
//         .cf-nav-logo {
//           font-family: 'Bebas Neue', sans-serif;
//           font-size: 26px;
//           letter-spacing: 3px;
//           color: #fff;
//           line-height: 1;
//         }
//         .cf-nav-logo span { color: #f97316; }
//         .cf-nav-tagline {
//           font-size: 10px;
//           font-weight: 500;
//           color: #4b5563;
//           letter-spacing: 2px;
//           text-transform: uppercase;
//           border-left: 1px solid #1f2937;
//           padding-left: 12px;
//           margin-left: 4px;
//         }
//         .cf-nav-links {
//           display: flex;
//           gap: 2px;
//           align-items: center;
//         }
//         .cf-nav-link {
//           font-size: 13px;
//           font-weight: 500;
//           color: #6b7280;
//           text-decoration: none;
//           padding: 7px 16px;
//           border-radius: 8px;
//           transition: all .15s;
//           letter-spacing: .3px;
//         }
//         .cf-nav-link:hover { color: #fff; background: rgba(255,255,255,0.06); }
//         .cf-nav-status {
//           display: flex;
//           align-items: center;
//           gap: 7px;
//           font-size: 11px;
//           font-weight: 600;
//           color: #22c55e;
//           background: rgba(34,197,94,0.08);
//           border: 1px solid rgba(34,197,94,0.2);
//           padding: 5px 14px;
//           border-radius: 20px;
//         }
//         .cf-nav-status-dot {
//           width: 6px; height: 6px;
//           border-radius: 50%;
//           background: #22c55e;
//           animation: pulse 2s infinite;
//         }

//         /* ── HERO ── */
//         .cf-hero {
//           position: relative;
//           height: 100vh;
//           min-height: 680px;
//           display: flex;
//           align-items: flex-end;
//           overflow: hidden;
//         }
//         .cf-hero-img {
//           position: absolute;
//           inset: 0;
//           background-image: url('https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=1800&q=80');
//           background-size: cover;
//           background-position: center 30%;
//           animation: kenburns 20s ease-in-out infinite alternate;
//         }
//         .cf-hero-overlay {
//           position: absolute;
//           inset: 0;
//           background: linear-gradient(
//             to bottom,
//             rgba(8,8,8,0.3) 0%,
//             rgba(8,8,8,0.1) 30%,
//             rgba(8,8,8,0.6) 60%,
//             rgba(8,8,8,0.95) 100%
//           );
//         }
//         .cf-hero-content {
//           position: relative;
//           z-index: 10;
//           padding: 0 56px 72px;
//           max-width: 820px;
//           animation: fadeUp .8s ease .3s both;
//         }
//         .cf-hero-badge {
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           background: rgba(249,115,22,0.15);
//           border: 1px solid rgba(249,115,22,0.35);
//           color: #fb923c;
//           font-size: 11px;
//           font-weight: 700;
//           letter-spacing: 3px;
//           padding: 6px 16px;
//           border-radius: 4px;
//           margin-bottom: 28px;
//         }
//         .cf-hero-title {
//           font-family: 'Bebas Neue', sans-serif;
//           font-size: clamp(56px, 8vw, 96px);
//           line-height: .95;
//           letter-spacing: 2px;
//           color: #fff;
//           margin-bottom: 24px;
//         }
//         .cf-hero-title span { color: #f97316; }
//         .cf-hero-sub {
//           font-size: 16px;
//           font-weight: 400;
//           color: rgba(255,255,255,0.55);
//           line-height: 1.7;
//           max-width: 480px;
//           margin-bottom: 40px;
//         }
//         .cf-hero-cta {
//           display: flex;
//           gap: 14px;
//           align-items: center;
//         }
//         .cf-btn-primary {
//           background: #f97316;
//           color: #fff;
//           font-family: 'Outfit', sans-serif;
//           font-size: 14px;
//           font-weight: 700;
//           padding: 13px 28px;
//           border-radius: 10px;
//           border: none;
//           cursor: pointer;
//           text-decoration: none;
//           letter-spacing: .5px;
//           transition: all .2s;
//           box-shadow: 0 8px 32px rgba(249,115,22,0.4);
//         }
//         .cf-btn-primary:hover { background: #ea580c; transform: translateY(-1px); }
//         .cf-btn-ghost {
//           color: rgba(255,255,255,0.6);
//           font-family: 'Outfit', sans-serif;
//           font-size: 14px;
//           font-weight: 500;
//           padding: 13px 24px;
//           border-radius: 10px;
//           border: 1px solid rgba(255,255,255,0.12);
//           cursor: pointer;
//           text-decoration: none;
//           transition: all .2s;
//           background: transparent;
//         }
//         .cf-btn-ghost:hover { border-color: rgba(255,255,255,0.3); color: #fff; }

//         /* ── STATS TICKER ── */
//         .cf-stats {
//           display: grid;
//           grid-template-columns: repeat(4,1fr);
//           border-top: 1px solid #151515;
//           border-bottom: 1px solid #151515;
//         }
//         .cf-stat {
//           padding: 32px 40px;
//           border-right: 1px solid #151515;
//           position: relative;
//           overflow: hidden;
//           animation: fadeUp .5s ease var(--d) both;
//         }
//         .cf-stat:last-child { border-right: none; }
//         .cf-stat::before {
//           content: '';
//           position: absolute;
//           bottom: 0; left: 0; right: 0;
//           height: 2px;
//           background: linear-gradient(90deg, #f97316, transparent);
//           transform: scaleX(0);
//           transform-origin: left;
//           transition: transform .4s ease;
//         }
//         .cf-stat:hover::before { transform: scaleX(1); }
//         .cf-stat-num {
//           font-family: 'Bebas Neue', sans-serif;
//           font-size: 52px;
//           color: #fff;
//           line-height: 1;
//           letter-spacing: 1px;
//         }
//         .cf-stat-unit {
//           font-size: 16px;
//           color: #f97316;
//           margin-left: 4px;
//         }
//         .cf-stat-label {
//           font-size: 11px;
//           font-weight: 600;
//           color: #374151;
//           letter-spacing: 2.5px;
//           text-transform: uppercase;
//           margin-top: 6px;
//         }
//         .cf-stat-trend {
//           font-size: 11px;
//           color: #22c55e;
//           font-weight: 600;
//           margin-top: 8px;
//         }

//         /* ── TIME BAR ── */
//         .cf-timebar {
//           background: #0d0d0d;
//           border-bottom: 1px solid #151515;
//           padding: 14px 56px;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           animation: fadeIn .5s ease .5s both;
//         }
//         .cf-timebar-time {
//           font-family: 'Bebas Neue', sans-serif;
//           font-size: 28px;
//           color: #f97316;
//           letter-spacing: 3px;
//         }
//         .cf-timebar-date {
//           font-size: 12px;
//           color: #374151;
//           font-weight: 500;
//           letter-spacing: 1px;
//         }
//         .cf-timebar-tag {
//           font-size: 10px;
//           font-weight: 700;
//           letter-spacing: 2px;
//           color: #374151;
//           background: #111;
//           border: 1px solid #1f1f1f;
//           padding: 4px 12px;
//           border-radius: 4px;
//         }

//         /* ── MODULES ── */
//         .cf-modules-header {
//           padding: 56px 56px 28px;
//           display: flex;
//           align-items: flex-end;
//           justify-content: space-between;
//         }
//         .cf-modules-title {
//           font-family: 'Bebas Neue', sans-serif;
//           font-size: 36px;
//           letter-spacing: 2px;
//           color: #fff;
//         }
//         .cf-modules-sub {
//           font-size: 13px;
//           color: #374151;
//           font-weight: 500;
//           margin-top: 4px;
//         }

//         .cf-modules-grid {
//           padding: 0 56px 72px;
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 14px;
//         }

//         .cf-module {
//           position: relative;
//           border-radius: 16px;
//           overflow: hidden;
//           text-decoration: none;
//           color: #fff;
//           display: block;
//           border: 1px solid #1a1a1a;
//           transition: border-color .25s, transform .25s;
//           animation: fadeUp .5s ease var(--d) both;
//           background: #0f0f0f;
//         }
//         .cf-module:hover {
//           border-color: rgba(249,115,22,0.4);
//           transform: translateY(-3px);
//         }
//         .cf-module-img {
//           width: 100%;
//           height: 180px;
//           object-fit: cover;
//           display: block;
//           filter: brightness(0.6) saturate(0.8);
//           transition: filter .4s, transform .4s;
//         }
//         .cf-module:hover .cf-module-img {
//           filter: brightness(0.75) saturate(1);
//           transform: scale(1.03);
//         }
//         .cf-module-img-wrap {
//           overflow: hidden;
//           position: relative;
//         }
//         .cf-module-img-wrap::after {
//           content: '';
//           position: absolute;
//           inset: 0;
//           background: linear-gradient(to bottom, transparent 40%, #0f0f0f 100%);
//         }
//         .cf-module-body {
//           padding: 24px 28px 28px;
//         }
//         .cf-module-tag {
//           font-size: 10px;
//           font-weight: 700;
//           letter-spacing: 2.5px;
//           color: #f97316;
//           margin-bottom: 10px;
//           display: block;
//         }
//         .cf-module-title {
//           font-family: 'Bebas Neue', sans-serif;
//           font-size: 26px;
//           letter-spacing: 1px;
//           color: #fff;
//           margin-bottom: 8px;
//           line-height: 1;
//         }
//         .cf-module-desc {
//           font-size: 13px;
//           color: #4b5563;
//           line-height: 1.65;
//           margin-bottom: 20px;
//         }
//         .cf-module-footer {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//         }
//         .cf-module-stat {
//           font-size: 11px;
//           color: #374151;
//           font-weight: 500;
//         }
//         .cf-module-arrow {
//           width: 32px; height: 32px;
//           border-radius: 8px;
//           background: rgba(249,115,22,0.1);
//           border: 1px solid rgba(249,115,22,0.2);
//           display: flex; align-items: center; justify-content: center;
//           font-size: 14px;
//           color: #f97316;
//           transition: all .2s;
//         }
//         .cf-module:hover .cf-module-arrow {
//           background: #f97316;
//           color: #fff;
//           transform: translateX(3px);
//         }

//         /* ── FOOTER ── */
//         .cf-footer {
//           border-top: 1px solid #111;
//           padding: 20px 56px;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//         }
//         .cf-footer-left {
//           font-family: 'Bebas Neue', sans-serif;
//           font-size: 18px;
//           letter-spacing: 3px;
//           color: #1f2937;
//         }
//         .cf-footer-left span { color: #f97316; }
//         .cf-footer-right {
//           font-size: 11px;
//           color: #1f2937;
//           font-weight: 500;
//           letter-spacing: 1px;
//         }
//       `}</style>

//       <div className="cf-root">

//         {/* ── NAV ── */}
//         <nav className="cf-nav">
//           <a href="/" className="cf-nav-brand">
//             <div className="cf-nav-logo">CREW<span>FLOW</span></div>
//             <div className="cf-nav-tagline">Crew Management System</div>
//           </a>
//           <div className="cf-nav-links">
//             {[
//               { href: "/relief",    label: "Relief Planning" },
//               { href: "/pool",      label: "Seafarer Pool" },
//               { href: "/vacancies", label: "Vacancies" },
//               { href: "/checklist", label: "Checklist" },
//             ].map(l => (
//               <a key={l.href} href={l.href} className="cf-nav-link">{l.label}</a>
//             ))}
//           </div>
//           <div className="cf-nav-status">
//             <div className="cf-nav-status-dot" />
//             All Systems Live
//           </div>
//         </nav>

//         {/* ── HERO ── */}
//         <div className="cf-hero">
//           <div className="cf-hero-img" />
//           <div className="cf-hero-overlay" />
//           <div className="cf-hero-content">
//             <div className="cf-hero-badge">
//               <div style={{ width:6, height:6, borderRadius:"50%", background:"#f97316", animation:"pulse 1.5s infinite" }} />
//               MARITIME CREW MANAGEMENT SYSTEM
//             </div>
//             <h1 className="cf-hero-title">
//               CREW<span>FLOW</span><br />
//               OPERATIONS
//             </h1>
//             <p className="cf-hero-sub">
//               The complete platform for managing seafarer contracts, relief cycles,
//               vacancy pipelines, and pre-joining compliance — all in one place.
//             </p>
//             <div className="cf-hero-cta">
//               <a href="/relief" className="cf-btn-primary">Open Relief Dashboard</a>
//               <a href="/pool" className="cf-btn-ghost">View Seafarer Pool</a>
//             </div>
//           </div>
//         </div>

//         {/* ── TIME BAR ── */}
//         <div className="cf-timebar">
//           <div>
//             <div className="cf-timebar-time">{time || "00:00:00"}</div>
//             <div className="cf-timebar-date">WAT · {date}</div>
//           </div>
//           <div className="cf-timebar-tag">WEST AFRICA TIME · UTC+1</div>
//         </div>

//         {/* ── STATS ── */}
//         <div className="cf-stats">
//           {[
//             { num: stats.seafarers, label: "Active Seafarers",  trend: "In database",    d: ".25s" },
//             { num: stats.vacancies, label: "Open Vacancies",    trend: "Across vessels",  d: ".3s"  },
//             { num: stats.placements,label: "Placements Made",   trend: "This cycle",      d: ".35s" },
//             { num: stats.alerts,    label: "Alerts Dispatched", trend: "Via automation",  d: ".4s"  },
//           ].map(s => (
//             <div key={s.label} className="cf-stat" style={{ "--d": s.d } as any}>
//               <div className="cf-stat-num">
//                 <AnimatedNumber target={s.num} />
//               </div>
//               <div className="cf-stat-label">{s.label}</div>
//               <div className="cf-stat-trend">↑ {s.trend}</div>
//             </div>
//           ))}
//         </div>

//         {/* ── MODULES ── */}
//         <div className="cf-modules-header">
//           <div>
//             <div className="cf-modules-title">PLATFORM MODULES</div>
//             <div className="cf-modules-sub">Four integrated modules — one complete crew management system</div>
//           </div>
//         </div>

//         <div className="cf-modules-grid">
//           {[
//             {
//               href: "/relief",
//               img: "https://images.unsplash.com/photo-1570127651392-58a3fd559e77?w=800&q=70",
//               tag: "AUTOMATED · REAL-TIME",
//               title: "RELIEF PLANNING",
//               desc: "Track every seafarer contract end date. Automated 28, 14, 7-day alerts fire to Telegram, WhatsApp, and email before anyone misses a sign-off.",
//               stat: `${stats.seafarers} seafarers tracked`,
//               d: ".3s"
//             },
//             {
//               href: "/pool",
//               img: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&q=70",
//               tag: "AI-POWERED MATCHING",
//               title: "SEAFARER POOL",
//               desc: "Your complete roster of available crew. Track certifications, rank, experience, and vessel type. AI suggests the best relief candidates automatically.",
//               stat: `${stats.seafarers} crew registered`,
//               d: ".35s"
//             },
//             {
//               href: "/vacancies",
//               img: "https://images.unsplash.com/photo-1504309092620-4d0ec726efa4?w=800&q=70",
//               tag: "LIVE PIPELINE",
//               title: "VACANCY PIPELINE",
//               desc: "Drag-and-drop kanban board for every open position. Post vacancies, shortlist candidates, confirm placements — all tracked with live data.",
//               stat: `${stats.vacancies} open positions`,
//               d: ".4s"
//             },
//             {
//               href: "/checklist",
//               img: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=800&q=70",
//               tag: "COMPLIANCE · DOCUMENTS",
//               title: "PRE-JOINING CHECKLIST",
//               desc: "26-item compliance checklist covering documents, medical fitness, travel arrangements, and vessel joining instructions before every deployment.",
//               stat: "26 compliance checkpoints",
//               d: ".45s"
//             },
//           ].map(m => (
//             <a key={m.href} href={m.href} className="cf-module" style={{ "--d": m.d } as any}>
//               <div className="cf-module-img-wrap">
//                 <img src={m.img} alt={m.title} className="cf-module-img" />
//               </div>
//               <div className="cf-module-body">
//                 <span className="cf-module-tag">{m.tag}</span>
//                 <div className="cf-module-title">{m.title}</div>
//                 <div className="cf-module-desc">{m.desc}</div>
//                 <div className="cf-module-footer">
//                   <span className="cf-module-stat">{m.stat}</span>
//                   <div className="cf-module-arrow">→</div>
//                 </div>
//               </div>
//             </a>
//           ))}
//         </div>

//         {/* ── FOOTER ── */}
//         <div className="cf-footer">
//           <div className="cf-footer-left">CREW<span>FLOW</span></div>
//           <div className="cf-footer-right">v1.0 · MARITIME CREW MANAGEMENT SYSTEM · POWERED BY SUPABASE + n8n</div>
//         </div>

//       </div>
//     </>
//   );
// }




// "use client";
// import { useEffect, useState, useCallback } from "react";
// import { supabase } from "./lib/supabase";

// // ─── Animated counter ────────────────────────────────────────────────────────
// function AnimatedNumber({ target }: { target: number }) {
//   const [n, setN] = useState(0);
//   useEffect(() => {
//     if (target === 0) return;
//     let cur = 0;
//     const step = target / 40;
//     const t = setInterval(() => {
//       cur += step;
//       if (cur >= target) { setN(target); clearInterval(t); }
//       else setN(Math.floor(cur));
//     }, 20);
//     return () => clearInterval(t);
//   }, [target]);
//   return <>{n}</>;
// }

// // ─── Image slideshow per module card ─────────────────────────────────────────
// function Slideshow({ images }: { images: string[] }) {
//   const [idx, setIdx] = useState(0);
//   const [fade, setFade] = useState(true);

//   useEffect(() => {
//     const t = setInterval(() => {
//       setFade(false);
//       setTimeout(() => {
//         setIdx(i => (i + 1) % images.length);
//         setFade(true);
//       }, 400);
//     }, 3500);
//     return () => clearInterval(t);
//   }, [images.length]);

//   return (
//     <div style={{ position: "relative", width: "100%", height: 200, overflow: "hidden" }}>
//       <img
//         src={images[idx]}
//         alt=""
//         style={{
//           width: "100%",
//           height: "100%",
//           objectFit: "cover",
//           display: "block",
//           filter: "brightness(0.55) saturate(0.85)",
//           opacity: fade ? 1 : 0,
//           transition: "opacity 0.4s ease, transform 6s ease",
//           transform: fade ? "scale(1.04)" : "scale(1)",
//         }}
//       />
//       {/* Gradient overlay */}
//       <div style={{
//         position: "absolute", inset: 0,
//         background: "linear-gradient(to bottom, transparent 30%, #0f0f0f 100%)"
//       }} />
//       {/* Dot indicators */}
//       <div style={{
//         position: "absolute", bottom: 12, left: 0, right: 0,
//         display: "flex", justifyContent: "center", gap: 5, zIndex: 2
//       }}>
//         {images.map((_, i) => (
//           <div key={i} style={{
//             width: i === idx ? 18 : 5,
//             height: 5,
//             borderRadius: 3,
//             background: i === idx ? "#f97316" : "rgba(255,255,255,0.3)",
//             transition: "all 0.3s ease",
//           }} />
//         ))}
//       </div>
//     </div>
//   );
// }

// // ─── Module images ────────────────────────────────────────────────────────────
// const MODULE_IMAGES = {
//   relief: [
//     "https://images.unsplash.com/photo-1570127651392-58a3fd559e77?w=600&q=60", // crew on deck working
//     "https://images.unsplash.com/photo-1548438294-1ad5d5f4f063?w=600&q=60",   // ship leaving port
//     "https://images.unsplash.com/photo-1473621038790-b778b4750efe?w=600&q=60", // vessel at sea horizon
//   ],
//   pool: [
//      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&q=60",   // crew member working
//     "https://images.unsplash.com/photo-1541802645635-11f2286a7482?w=600&q=60", // engineer on ship
//     "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=60", // maritime team briefing
//  ],
//   vacancies: [
//     "https://images.unsplash.com/photo-1504309092620-4d0ec726efa4?w=600&q=60", // port containers aerial
//     "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=600&q=60", // cargo port cranes
//     "https://images.unsplash.com/photo-1526958097901-5e6d742d3371?w=600&q=60", // ship in port loading
//   ],
//   checklist: [
//     "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=600&q=60", // person reviewing documents
//     "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=60", // checklist clipboard maritime
//     "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=60", // captain uniform portrait
//   ],
// };

// // ─── Main component ───────────────────────────────────────────────────────────
// export default function Home() {
//   const [stats, setStats] = useState({ seafarers: 0, vacancies: 0, placements: 0, alerts: 0 });
//   const [time, setTime] = useState("");
//   const [date, setDate] = useState("");
//   const [heroIdx, setHeroIdx] = useState(0);
//   const [heroFade, setHeroFade] = useState(true);

//   const HERO_IMAGES = [
//   "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=1400&q=65",
//   "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=1400&q=65", // offshore platform sunset
//   "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1400&q=65", // container ship open sea
//   "https://images.unsplash.com/photo-1519214605650-76519d3f6ef0?w=1400&q=65", // ship bridge navigation
//   ];

//   useEffect(() => {
//     // Load stats
//     async function load() {
//       const [s, v, p, a] = await Promise.all([
//         supabase.from("seafarers").select("count").single(),
//         supabase.from("vacancies").select("count").single(),
//         supabase.from("placements").select("count").single(),
//         supabase.from("relief_alerts").select("count").single(),
//       ]);
//       setStats({
//         seafarers: s.data?.count || 0,
//         vacancies: v.data?.count || 0,
//         placements: p.data?.count || 0,
//         alerts: a.data?.count || 0,
//       });
//     }
//     load();

//     // Clock
//     const tick = () => {
//       const now = new Date();
//       setTime(now.toLocaleTimeString("en-GB", { timeZone: "Africa/Lagos", hour: "2-digit", minute: "2-digit", second: "2-digit" }));
//       setDate(now.toLocaleDateString("en-GB", { timeZone: "Africa/Lagos", weekday: "long", day: "numeric", month: "long", year: "numeric" }));
//     };
//     tick();
//     const clock = setInterval(tick, 1000);

//     // Hero slideshow
//     const hero = setInterval(() => {
//       setHeroFade(false);
//       setTimeout(() => {
//         setHeroIdx(i => (i + 1) % HERO_IMAGES.length);
//         setHeroFade(true);
//       }, 600);
//     }, 5000);

//     return () => { clearInterval(clock); clearInterval(hero); };
//   }, []);

//   // Preload all images for speed
//   useEffect(() => {
//     const allImgs = [
//       ...HERO_IMAGES,
//       ...Object.values(MODULE_IMAGES).flat()
//     ];
//     allImgs.forEach(src => {
//       const img = new Image();
//       img.src = src;
//     });
//   }, []);

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700;800&display=swap');
//         * { box-sizing: border-box; margin: 0; padding: 0; }

//         @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
//         @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.3} }
//         @keyframes fadeIn { from{opacity:0} to{opacity:1} }

//         body { background: #080808; }

//         .cf-root {
//           font-family: 'Outfit', sans-serif;
//           background: #080808;
//           color: #fff;
//           min-height: 100vh;
//         }

//         /* NAV */
//         .cf-nav {
//           position: fixed; top:0; left:0; right:0; z-index:200;
//           display:flex; align-items:center; justify-content:space-between;
//           padding: 0 48px; height: 64px;
//           background: rgba(8,8,8,0.85);
//           backdrop-filter: blur(24px);
//           border-bottom: 1px solid rgba(255,255,255,0.05);
//         }
//         .cf-logo {
//           font-family: 'Bebas Neue', sans-serif;
//           font-size: 24px; letter-spacing: 4px; color: #fff;
//           text-decoration: none; display:flex; align-items:center; gap:10px;
//         }
//         .cf-logo span { color: #f97316; }
//         .cf-logo-sep {
//           width:1px; height:28px; background:#1f2937; margin: 0 4px;
//         }
//         .cf-logo-tag {
//           font-family: 'Outfit', sans-serif;
//           font-size:10px; font-weight:600; color:#374151;
//           letter-spacing:2px; text-transform:uppercase;
//         }
//         .cf-nav-links { display:flex; gap:2px; }
//         .cf-nav-link {
//           font-size:13px; font-weight:500; color:#6b7280;
//           text-decoration:none; padding:7px 15px; border-radius:8px;
//           transition:all .15s;
//         }
//         .cf-nav-link:hover { color:#fff; background:rgba(255,255,255,0.05); }
//         .cf-live {
//           display:flex; align-items:center; gap:7px;
//           font-size:11px; font-weight:700; color:#22c55e;
//           background:rgba(34,197,94,0.08); border:1px solid rgba(34,197,94,0.2);
//           padding:5px 14px; border-radius:20px;
//         }
//         .cf-live-dot {
//           width:6px; height:6px; border-radius:50%;
//           background:#22c55e; animation:pulse 2s infinite;
//         }

//         /* HERO */
//         .cf-hero {
//           position:relative; height:100vh; min-height:640px;
//           display:flex; align-items:flex-end; overflow:hidden;
//           padding-top:64px;
//         }
//         .cf-hero-img {
//           position:absolute; inset:0;
//           background-size:cover; background-position:center 35%;
//           transition:opacity 0.6s ease;
//         }
//         .cf-hero-overlay {
//           position:absolute; inset:0;
//           background:linear-gradient(to bottom,
//             rgba(8,8,8,0.2) 0%,
//             rgba(8,8,8,0.05) 25%,
//             rgba(8,8,8,0.55) 60%,
//             rgba(8,8,8,0.97) 100%);
//         }
//         .cf-hero-content {
//           position:relative; z-index:10;
//           padding: 0 56px 68px; max-width:800px;
//           animation: fadeUp .7s ease .2s both;
//         }
//         .cf-badge {
//           display:inline-flex; align-items:center; gap:8px;
//           background:rgba(249,115,22,0.12); border:1px solid rgba(249,115,22,0.3);
//           color:#fb923c; font-size:10px; font-weight:700; letter-spacing:3px;
//           padding:5px 14px; border-radius:4px; margin-bottom:24px;
//         }
//         .cf-hero-h1 {
//           font-family:'Bebas Neue',sans-serif;
//           font-size:clamp(52px,7.5vw,90px);
//           line-height:.95; letter-spacing:2px; margin-bottom:20px;
//         }
//         .cf-hero-h1 span { color:#f97316; }
//         .cf-hero-p {
//           font-size:15px; color:rgba(255,255,255,0.5);
//           line-height:1.75; max-width:460px; margin-bottom:36px;
//         }
//         .cf-hero-btns { display:flex; gap:12px; }
//         .cf-btn-o {
//           background:#f97316; color:#fff;
//           font-family:'Outfit',sans-serif; font-size:14px; font-weight:700;
//           padding:12px 26px; border-radius:10px; border:none;
//           cursor:pointer; text-decoration:none;
//           box-shadow:0 6px 24px rgba(249,115,22,0.35);
//           transition:all .2s;
//         }
//         .cf-btn-o:hover { background:#ea580c; transform:translateY(-1px); }
//         .cf-btn-g {
//           background:transparent; color:rgba(255,255,255,0.55);
//           font-family:'Outfit',sans-serif; font-size:14px; font-weight:500;
//           padding:12px 22px; border-radius:10px;
//           border:1px solid rgba(255,255,255,0.1);
//           cursor:pointer; text-decoration:none; transition:all .2s;
//         }
//         .cf-btn-g:hover { border-color:rgba(255,255,255,0.25); color:#fff; }

//         /* TIMEBAR */
//         .cf-timebar {
//           background:#0c0c0c; border-bottom:1px solid #111;
//           padding:14px 56px;
//           display:flex; align-items:center; justify-content:space-between;
//         }
//         .cf-time {
//           font-family:'Bebas Neue',sans-serif;
//           font-size:26px; color:#f97316; letter-spacing:3px;
//         }
//         .cf-date { font-size:11px; color:#374151; font-weight:500; letter-spacing:1px; margin-top:2px; }
//         .cf-tz {
//           font-size:10px; font-weight:700; letter-spacing:2px;
//           color:#1f2937; background:#111; border:1px solid #1a1a1a;
//           padding:4px 12px; border-radius:4px;
//         }

//         /* STATS */
//         .cf-stats {
//           display:grid; grid-template-columns:repeat(4,1fr);
//           border-bottom:1px solid #111;
//         }
//         .cf-stat {
//           padding:28px 40px; border-right:1px solid #111;
//           position:relative; overflow:hidden;
//           transition:background .2s;
//         }
//         .cf-stat:last-child { border-right:none; }
//         .cf-stat:hover { background:#0d0d0d; }
//         .cf-stat::after {
//           content:''; position:absolute; bottom:0; left:0; right:0;
//           height:2px; background:linear-gradient(90deg,#f97316,transparent);
//           transform:scaleX(0); transform-origin:left; transition:transform .4s;
//         }
//         .cf-stat:hover::after { transform:scaleX(1); }
//         .cf-stat-n {
//           font-family:'Bebas Neue',sans-serif;
//           font-size:48px; color:#fff; line-height:1; letter-spacing:-1px;
//         }
//         .cf-stat-l {
//           font-size:10px; font-weight:700; color:#374151;
//           letter-spacing:2.5px; text-transform:uppercase; margin-top:6px;
//         }
//         .cf-stat-t { font-size:11px; color:#22c55e; font-weight:600; margin-top:6px; }

//         /* MODULES */
//         .cf-mhead {
//           padding:48px 56px 24px;
//           display:flex; align-items:flex-end; justify-content:space-between;
//         }
//         .cf-mtitle {
//           font-family:'Bebas Neue',sans-serif;
//           font-size:32px; letter-spacing:2px;
//         }
//         .cf-msub { font-size:12px; color:#374151; font-weight:500; margin-top:4px; }
//         .cf-mgrid {
//           padding:0 56px 64px;
//           display:grid; grid-template-columns:1fr 1fr; gap:14px;
//         }
//         .cf-mcard {
//           background:#0f0f0f; border:1px solid #1a1a1a;
//           border-radius:16px; overflow:hidden;
//           text-decoration:none; color:#fff; display:block;
//           transition:border-color .25s, transform .25s;
//           animation:fadeUp .5s ease var(--d) both;
//         }
//         .cf-mcard:hover { border-color:rgba(249,115,22,0.4); transform:translateY(-3px); }
//         .cf-mbody { padding:22px 26px 26px; }
//         .cf-mtag {
//           font-size:10px; font-weight:700; letter-spacing:2.5px;
//           color:#f97316; display:block; margin-bottom:8px;
//         }
//         .cf-mname {
//           font-family:'Bebas Neue',sans-serif;
//           font-size:24px; letter-spacing:1px; margin-bottom:8px; line-height:1;
//         }
//         .cf-mdesc { font-size:12px; color:#4b5563; line-height:1.65; margin-bottom:18px; }
//         .cf-mfooter { display:flex; align-items:center; justify-content:space-between; }
//         .cf-mstat { font-size:11px; color:#374151; font-weight:500; }
//         .cf-marrow {
//           width:30px; height:30px; border-radius:8px;
//           background:rgba(249,115,22,0.08); border:1px solid rgba(249,115,22,0.15);
//           display:flex; align-items:center; justify-content:center;
//           font-size:13px; color:#f97316; transition:all .2s;
//         }
//         .cf-mcard:hover .cf-marrow { background:#f97316; color:#fff; transform:translateX(2px); }

//         /* FOOTER */
//         .cf-foot {
//           border-top:1px solid #111; padding:18px 56px;
//           display:flex; align-items:center; justify-content:space-between;
//         }
//         .cf-foot-l {
//           font-family:'Bebas Neue',sans-serif;
//           font-size:16px; letter-spacing:3px; color:#1f2937;
//         }
//         .cf-foot-l span { color:#f97316; }
//         .cf-foot-r { font-size:10px; color:#1f2937; font-weight:500; letter-spacing:1px; }
//       `}</style>

//       <div className="cf-root">

//         {/* NAV */}
//         <nav className="cf-nav">
//           <a href="/" className="cf-logo">
//             CREW<span>FLOW</span>
//             <div className="cf-logo-sep" />
//             <div className="cf-logo-tag">Crew Management</div>
//           </a>
//           <div className="cf-nav-links">
//             {[
//               ["/relief",    "Relief Planning"],
//               ["/pool",      "Seafarer Pool"],
//               ["/vacancies", "Vacancies"],
//               ["/checklist", "Checklist"],
//             ].map(([href, label]) => (
//               <a key={href} href={href} className="cf-nav-link">{label}</a>
//             ))}
//           </div>
//           <div className="cf-live">
//             <div className="cf-live-dot" />
//             Systems Live
//           </div>
//         </nav>

//         {/* HERO */}
//         <div className="cf-hero">
//           <div
//             className="cf-hero-img"
//             style={{
//               backgroundImage: `url(${HERO_IMAGES[heroIdx]})`,
//               opacity: heroFade ? 1 : 0,
//             }}
//           />
//           <div className="cf-hero-overlay" />
//           <div className="cf-hero-content">
//             <div className="cf-badge">
//               <div style={{ width:6,height:6,borderRadius:"50%",background:"#f97316",animation:"pulse 1.5s infinite" }} />
//               MARITIME CREW MANAGEMENT SYSTEM
//             </div>
//             <h1 className="cf-hero-h1">
//               MANAGING<br />
//               YOUR <span>CREW</span><br />
//               SMARTER.
//             </h1>
//             <p className="cf-hero-p">
//               The complete platform for seafarer relief planning, crew deployment,
//               vacancy management, and pre-joining compliance — built for the maritime industry.
//             </p>
//             <div className="cf-hero-btns">
//               <a href="/relief" className="cf-btn-o">Open Operations Center</a>
//               <a href="/pool"   className="cf-btn-g">View Seafarer Pool →</a>
//             </div>
//           </div>
//         </div>

//         {/* TIMEBAR */}
//         <div className="cf-timebar">
//           <div>
//             <div className="cf-time">{time || "00:00:00"}</div>
//             <div className="cf-date">WAT · {date}</div>
//           </div>
//           <div className="cf-tz">WEST AFRICA TIME · UTC +1</div>
//         </div>

//         {/* STATS */}
//         <div className="cf-stats">
//           {[
//             { n: stats.seafarers, l: "Active Seafarers",   t: "In database" },
//             { n: stats.vacancies, l: "Open Vacancies",     t: "Across vessels" },
//             { n: stats.placements,l: "Placements Made",    t: "This cycle" },
//             { n: stats.alerts,    l: "Alerts Dispatched",  t: "Via automation" },
//           ].map((s, i) => (
//             <div key={s.l} className="cf-stat" style={{ "--d": `${.25 + i*.05}s` } as any}>
//               <div className="cf-stat-n"><AnimatedNumber target={s.n} /></div>
//               <div className="cf-stat-l">{s.l}</div>
//               <div className="cf-stat-t">↑ {s.t}</div>
//             </div>
//           ))}
//         </div>

//         {/* MODULES */}
//         <div className="cf-mhead">
//           <div>
//             <div className="cf-mtitle">PLATFORM MODULES</div>
//             <div className="cf-msub">Four integrated modules — one complete crew management system</div>
//           </div>
//         </div>

//         <div className="cf-mgrid">
//           {[
//             {
//               href: "/relief",
//               images: MODULE_IMAGES.relief,
//               tag: "AUTOMATED · REAL-TIME",
//               name: "RELIEF PLANNING",
//               desc: "Track every seafarer contract. Automated 28, 14, 7-day alerts fire to Telegram before anyone misses a sign-off deadline.",
//               stat: `${stats.seafarers} seafarers tracked`,
//               d: ".3s"
//             },
//             {
//               href: "/pool",
//               images: MODULE_IMAGES.pool,
//               tag: "AI-POWERED MATCHING",
//               name: "SEAFARER POOL",
//               desc: "Your complete available crew roster. Track certifications, rank, and vessel type. AI matches the best relief candidates.",
//               stat: `${stats.seafarers} crew registered`,
//               d: ".35s"
//             },
//             {
//               href: "/vacancies",
//               images: MODULE_IMAGES.vacancies,
//               tag: "LIVE KANBAN PIPELINE",
//               name: "VACANCY PIPELINE",
//               desc: "Drag-and-drop board for every open position. Post, shortlist, confirm placements — all tracked with live Supabase data.",
//               stat: `${stats.vacancies} open positions`,
//               d: ".4s"
//             },
//             {
//               href: "/checklist",
//               images: MODULE_IMAGES.checklist,
//               tag: "COMPLIANCE · DOCUMENTS",
//               name: "PRE-JOINING CHECKLIST",
//               desc: "26-item checklist covering documents, medical fitness, travel, and vessel instructions before every deployment.",
//               stat: "26 compliance checkpoints",
//               d: ".45s"
//             },
//           ].map(m => (
//             <a key={m.href} href={m.href} className="cf-mcard" style={{ "--d": m.d } as any}>
//               <Slideshow images={m.images} />
//               <div className="cf-mbody">
//                 <span className="cf-mtag">{m.tag}</span>
//                 <div className="cf-mname">{m.name}</div>
//                 <div className="cf-mdesc">{m.desc}</div>
//                 <div className="cf-mfooter">
//                   <span className="cf-mstat">{m.stat}</span>
//                   <div className="cf-marrow">→</div>
//                 </div>
//               </div>
//             </a>
//           ))}
//         </div>

//         {/* FOOTER */}
//         <div className="cf-foot">
//           <div className="cf-foot-l">CREW<span>FLOW</span></div>
//           <div className="cf-foot-r">V1.0 · MARITIME CREW MANAGEMENT · SUPABASE + N8N + VERCEL</div>
//         </div>

//       </div>
//     </>
//   );
// }



// "use client";
// import { useEffect, useState } from "react";
// import { supabase } from "./lib/supabase";

// function AnimatedNumber({ target }: { target: number }) {
//   const [n, setN] = useState(0);
//   useEffect(() => {
//     if (target === 0) return;
//     let cur = 0;
//     const step = target / 40;
//     const t = setInterval(() => {
//       cur += step;
//       if (cur >= target) { setN(target); clearInterval(t); }
//       else setN(Math.floor(cur));
//     }, 20);
//     return () => clearInterval(t);
//   }, [target]);
//   return <>{n}</>;
// }

// function Slideshow({ images }: { images: string[] }) {
//   const [idx, setIdx] = useState(0);
//   const [fade, setFade] = useState(true);
//   useEffect(() => {
//     const t = setInterval(() => {
//       setFade(false);
//       setTimeout(() => { setIdx(i => (i + 1) % images.length); setFade(true); }, 400);
//     }, 3500);
//     return () => clearInterval(t);
//   }, [images.length]);
//   return (
//     <div style={{ position:"relative", width:"100%", height:160, overflow:"hidden", borderRadius:"12px 12px 0 0" }}>
//       <img src={images[idx]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", opacity: fade ? 1 : 0, transition:"opacity 0.4s ease", filter:"brightness(0.45) saturate(0.7)" }} />
//       <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 40%, #111318 100%)" }} />
//       <div style={{ position:"absolute", bottom:10, left:0, right:0, display:"flex", justifyContent:"center", gap:5 }}>
//         {images.map((_,i) => (
//           <div key={i} style={{ width: i===idx ? 16 : 4, height:4, borderRadius:2, background: i===idx ? "#f97316" : "rgba(255,255,255,0.2)", transition:"all .3s" }} />
//         ))}
//       </div>
//     </div>
//   );
// }

// const MODULE_IMAGES = {
//   relief: [
//     "https://images.unsplash.com/photo-2vPGGOU-wLA?w=600&q=60",
//     "https://images.unsplash.com/photo-1548438294-1ad5d5f4f063?w=600&q=60",
//     "https://images.unsplash.com/photo-1473621038790-b778b4750efe?w=600&q=60",
//   ],
//   pool: [
//     "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&q=60",
//     "https://images.unsplash.com/photo-1541802645635-11f2286a7482?w=600&q=60",
//     "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=60",
//   ],
//   vacancies: [
//     "https://images.unsplash.com/photo-1504309092620-4d0ec726efa4?w=600&q=60",
//     "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=600&q=60",
//     "https://images.unsplash.com/photo-1526958097901-5e6d742d3371?w=600&q=60",
//   ],
//   checklist: [
//     "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=600&q=60",
//     "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=60",
//     "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=60",
//   ],
// };

// export default function Home() {
//   const [stats, setStats] = useState({ seafarers:0, vacancies:0, placements:0, alerts:0 });
//   const [time, setTime] = useState("");
//   const [date, setDate] = useState("");
//   const [heroIdx, setHeroIdx] = useState(0);
//   const [heroFade, setHeroFade] = useState(true);

//   const HERO_IMAGES = [
//     "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=1400&q=70",
//     "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=1600&q=70",
//     "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1600&q=70",
//     "https://images.unsplash.com/photo-1519214605650-76519d3f6ef0?w=1600&q=70",
//   ];

//   useEffect(() => {
//     async function load() {
//       const [s,v,p,a] = await Promise.all([
//         supabase.from("seafarers").select("count").single(),
//         supabase.from("vacancies").select("count").single(),
//         supabase.from("placements").select("count").single(),
//         supabase.from("relief_alerts").select("count").single(),
//       ]);
//       setStats({ seafarers:s.data?.count||0, vacancies:v.data?.count||0, placements:p.data?.count||0, alerts:a.data?.count||0 });
//     }
//     load();
//     const tick = () => {
//       const n = new Date();
//       setTime(n.toLocaleTimeString("en-GB",{timeZone:"Africa/Lagos",hour:"2-digit",minute:"2-digit",second:"2-digit"}));
//       setDate(n.toLocaleDateString("en-GB",{timeZone:"Africa/Lagos",weekday:"long",day:"numeric",month:"long",year:"numeric"}));
//     };
//     tick();
//     const clock = setInterval(tick, 1000);
//     const hero = setInterval(() => {
//       setHeroFade(false);
//       setTimeout(() => { setHeroIdx(i => (i+1) % HERO_IMAGES.length); setHeroFade(true); }, 500);
//     }, 5000);
//     // Preload
//     [...HERO_IMAGES, ...Object.values(MODULE_IMAGES).flat()].forEach(src => { const img = new Image(); img.src = src; });
//     return () => { clearInterval(clock); clearInterval(hero); };
//   }, []);

//   const MODULES = [
//     { href:"/relief",    images:MODULE_IMAGES.relief,    tag:"AUTOMATED",    name:"Relief Planning",       desc:"Automated contract tracking. 28, 14, 7-day alerts fire to Telegram before sign-off deadlines.", stat:`${stats.seafarers} tracked` },
//     { href:"/pool",      images:MODULE_IMAGES.pool,      tag:"AI-POWERED",   name:"Seafarer Pool",         desc:"Full crew roster with cert tracking, availability, and AI-powered candidate matching.", stat:`${stats.seafarers} registered` },
//     { href:"/vacancies", images:MODULE_IMAGES.vacancies, tag:"LIVE DATA",    name:"Vacancy Pipeline",      desc:"Kanban board for every open position. Post, shortlist, confirm — all in real time.", stat:`${stats.vacancies} open` },
//     { href:"/checklist", images:MODULE_IMAGES.checklist, tag:"COMPLIANCE",   name:"Pre-Joining Checklist", desc:"26-point checklist covering documents, medical, travel, and vessel instructions.", stat:"26 checkpoints" },
//   ];

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700;800&display=swap');
//         *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
//         @keyframes fadeUp  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
//         @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
//         @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.3} }
//         html,body { background:#0d0e12; }

//         .page { font-family:'Outfit',sans-serif; background:#0d0e12; color:#e2e8f0; min-height:100vh; }

//         /* ── SIDEBAR ── */
//         .sidebar {
//           position:fixed; left:0; top:0; bottom:0; width:220px;
//           background:#111318;
//           border-right:1px solid rgba(255,255,255,0.05);
//           display:flex; flex-direction:column;
//           z-index:200; padding:0;
//         }
//         .sidebar-brand {
//           padding:20px 22px 18px;
//           border-bottom:1px solid rgba(255,255,255,0.05);
//           text-decoration:none;
//         }
//         .sidebar-logo {
//           font-family:'Bebas Neue',sans-serif;
//           font-size:22px; letter-spacing:4px; color:#fff;
//         }
//         .sidebar-logo span { color:#f97316; }
//         .sidebar-tagline {
//           font-size:9px; font-weight:600; color:#374151;
//           letter-spacing:2px; margin-top:2px;
//         }
//         .sidebar-nav { flex:1; padding:16px 12px; overflow-y:auto; }
//         .sidebar-section {
//           font-size:9px; font-weight:700; color:#374151;
//           letter-spacing:2.5px; padding:0 10px; margin:16px 0 6px;
//         }
//         .sidebar-link {
//           display:flex; align-items:center; gap:10px;
//           padding:9px 10px; border-radius:8px;
//           font-size:13px; font-weight:500; color:#6b7280;
//           text-decoration:none; transition:all .15s; margin-bottom:2px;
//         }
//         .sidebar-link:hover { background:rgba(255,255,255,0.04); color:#e2e8f0; }
//         .sidebar-link.active { background:rgba(249,115,22,0.1); color:#f97316; }
//         .sidebar-link-icon { font-size:15px; width:20px; text-align:center; }
//         .sidebar-bottom {
//           padding:16px 12px;
//           border-top:1px solid rgba(255,255,255,0.05);
//         }
//         .sidebar-status {
//           display:flex; align-items:center; gap:8px;
//           padding:8px 10px; border-radius:8px;
//           background:rgba(34,197,94,0.06);
//           border:1px solid rgba(34,197,94,0.12);
//         }
//         .sidebar-status-dot {
//           width:6px; height:6px; border-radius:50%;
//           background:#22c55e; animation:pulse 2s infinite;
//         }
//         .sidebar-status-text { font-size:11px; font-weight:600; color:#22c55e; }

//         /* ── MAIN ── */
//         .main { margin-left:220px; min-height:100vh; }

//         /* ── TOP BAR ── */
//         .topbar {
//           background:#111318;
//           border-bottom:1px solid rgba(255,255,255,0.05);
//           padding:0 32px; height:56px;
//           display:flex; align-items:center; justify-content:space-between;
//           position:sticky; top:0; z-index:100;
//         }
//         .topbar-title { font-size:14px; font-weight:700; color:#e2e8f0; }
//         .topbar-right { display:flex; align-items:center; gap:16px; }
//         .topbar-time {
//           font-family:'Bebas Neue',sans-serif;
//           font-size:18px; color:#f97316; letter-spacing:2px;
//         }
//         .topbar-date { font-size:10px; color:#374151; font-weight:500; }

//         /* ── HERO BANNER ── */
//         .hero {
//           position:relative; height:340px; overflow:hidden;
//           margin:24px 28px 0; border-radius:16px;
//         }
//         .hero-img {
//           position:absolute; inset:0;
//           background-size:cover; background-position:center 30%;
//           transition:opacity .6s ease;
//         }
//         .hero-overlay {
//           position:absolute; inset:0;
//           background:linear-gradient(135deg, rgba(13,14,18,0.85) 0%, rgba(13,14,18,0.3) 60%, rgba(13,14,18,0.75) 100%);
//         }
//         .hero-content {
//           position:relative; z-index:10;
//           padding:40px 44px; height:100%;
//           display:flex; flex-direction:column; justify-content:flex-end;
//         }
//         .hero-badge {
//           display:inline-flex; align-items:center; gap:7px;
//           background:rgba(249,115,22,0.15); border:1px solid rgba(249,115,22,0.3);
//           color:#fb923c; font-size:9px; font-weight:700; letter-spacing:3px;
//           padding:4px 12px; border-radius:4px; margin-bottom:16px; width:fit-content;
//         }
//         .hero-h1 {
//           font-family:'Bebas Neue',sans-serif;
//           font-size:52px; line-height:.95; letter-spacing:2px; margin-bottom:12px;
//         }
//         .hero-h1 span { color:#f97316; }
//         .hero-p { font-size:13px; color:rgba(255,255,255,0.45); max-width:400px; line-height:1.65; margin-bottom:24px; }
//         .hero-btns { display:flex; gap:10px; }
//         .btn-primary {
//           background:#f97316; color:#fff;
//           font-family:'Outfit',sans-serif; font-size:12px; font-weight:700;
//           padding:9px 20px; border-radius:8px; border:none; cursor:pointer;
//           text-decoration:none; transition:all .2s;
//           box-shadow:0 4px 16px rgba(249,115,22,0.35);
//         }
//         .btn-primary:hover { background:#ea580c; transform:translateY(-1px); }
//         .btn-ghost {
//           background:rgba(255,255,255,0.06); color:rgba(255,255,255,0.5);
//           font-family:'Outfit',sans-serif; font-size:12px; font-weight:500;
//           padding:9px 18px; border-radius:8px;
//           border:1px solid rgba(255,255,255,0.1);
//           cursor:pointer; text-decoration:none; transition:all .2s;
//         }
//         .btn-ghost:hover { background:rgba(255,255,255,0.09); color:#fff; }

//         /* Hero dots */
//         .hero-dots {
//           position:absolute; bottom:16px; right:20px;
//           display:flex; gap:5px; z-index:10;
//         }

//         /* ── STATS ── */
//         .stats {
//           display:grid; grid-template-columns:repeat(4,1fr);
//           gap:14px; padding:20px 28px;
//         }
//         .stat-card {
//           background:#111318; border:1px solid rgba(255,255,255,0.05);
//           border-radius:12px; padding:18px 20px;
//           transition:border-color .2s; cursor:default;
//           animation:fadeUp .4s ease var(--d) both;
//         }
//         .stat-card:hover { border-color:rgba(249,115,22,0.25); }
//         .stat-label { font-size:10px; font-weight:600; color:#374151; letter-spacing:2px; margin-bottom:10px; }
//         .stat-num {
//           font-family:'Bebas Neue',sans-serif;
//           font-size:42px; color:#e2e8f0; line-height:1; letter-spacing:-1px;
//         }
//         .stat-sub { font-size:10px; color:#22c55e; font-weight:600; margin-top:6px; }
//         .stat-bar { height:2px; background:#1a1d24; border-radius:1px; margin-top:12px; }
//         .stat-bar-fill { height:100%; background:linear-gradient(90deg,#f97316,#fb923c); border-radius:1px; transition:width 1s ease; }

//         /* ── MODULES ── */
//         .modules-header { padding:8px 28px 16px; display:flex; align-items:center; justify-content:space-between; }
//         .modules-title { font-family:'Bebas Neue',sans-serif; font-size:22px; letter-spacing:2px; color:#e2e8f0; }
//         .modules-sub { font-size:11px; color:#374151; margin-top:2px; }
//         .modules-grid {
//           display:grid; grid-template-columns:1fr 1fr;
//           gap:14px; padding:0 28px 32px;
//         }
//         .module-card {
//           background:#111318; border:1px solid rgba(255,255,255,0.05);
//           border-radius:14px; overflow:hidden;
//           text-decoration:none; color:#e2e8f0; display:block;
//           transition:border-color .25s, transform .25s;
//           animation:fadeUp .5s ease var(--d) both;
//         }
//         .module-card:hover { border-color:rgba(249,115,22,0.35); transform:translateY(-2px); }
//         .module-body { padding:18px 20px 22px; }
//         .module-tag { font-size:9px; font-weight:700; letter-spacing:2.5px; color:#f97316; display:block; margin-bottom:8px; }
//         .module-name { font-family:'Bebas Neue',sans-serif; font-size:22px; letter-spacing:1px; margin-bottom:6px; line-height:1; }
//         .module-desc { font-size:12px; color:#4b5563; line-height:1.6; margin-bottom:14px; }
//         .module-footer { display:flex; align-items:center; justify-content:space-between; }
//         .module-stat { font-size:10px; color:#374151; font-weight:500; }
//         .module-arrow {
//           width:26px; height:26px; border-radius:7px;
//           background:rgba(249,115,22,0.08); border:1px solid rgba(249,115,22,0.15);
//           display:flex; align-items:center; justify-content:center;
//           font-size:12px; color:#f97316; transition:all .2s;
//         }
//         .module-card:hover .module-arrow { background:#f97316; color:#fff; transform:translateX(2px); }
//       `}</style>

//       <div className="page">

//         {/* ── SIDEBAR ── */}
//         {/* <aside className="sidebar">
//           <a href="/" className="sidebar-brand">
//             <div className="sidebar-logo">CREW<span>FLOW</span></div>
//             <div className="sidebar-tagline">MARITIME CREW MANAGEMENT</div>
//           </a>

//           <nav className="sidebar-nav">
//             <div className="sidebar-section">OVERVIEW</div>
//             <a href="/" className="sidebar-link active">
//               <span className="sidebar-link-icon">⊞</span> Dashboard
//             </a>

//             <div className="sidebar-section">MODULES</div>
//             <a href="/relief" className="sidebar-link">
//               <span className="sidebar-link-icon">🔔</span> Relief Planning
//             </a>
//             <a href="/pool" className="sidebar-link">
//               <span className="sidebar-link-icon">👥</span> Seafarer Pool
//             </a>
//             <a href="/vacancies" className="sidebar-link">
//               <span className="sidebar-link-icon">📋</span> Vacancies
//             </a>
//             <a href="/checklist" className="sidebar-link">
//               <span className="sidebar-link-icon">✅</span> Pre-Joining
//             </a>

//             <div className="sidebar-section">AUTOMATION</div>
//             <a href="#" className="sidebar-link">
//               <span className="sidebar-link-icon">⚡</span> n8n Workflows
//             </a>
//             <a href="#" className="sidebar-link">
//               <span className="sidebar-link-icon">📊</span> Alert Logs
//             </a>
//           </nav>

//           <div className="sidebar-bottom">
//             <div className="sidebar-status">
//               <div className="sidebar-status-dot" />
//               <div>
//                 <div className="sidebar-status-text">All Systems Live</div>
//                 <div style={{ fontSize:9, color:"#374151", marginTop:1 }}>Supabase · n8n · Vercel</div>
//               </div>
//             </div>
//           </div>
//         </aside> */}

//         {/* // Replace the entire <aside className="sidebar"> block with this: */}
//         <aside className="sidebar">
//           <a href="/" className="sidebar-brand">
//             <div className="sidebar-logo">CREW<span>FLOW</span></div>
//             <div className="sidebar-tagline">MARITIME CREW MANAGEMENT</div>
//           </a>

//           <nav className="sidebar-nav">
//             <div className="sidebar-section">OVERVIEW</div>
//             <a href="/" className="sidebar-link active">
//               <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
//               Dashboard
//             </a>

//             <div className="sidebar-section">MODULES</div>
//             <a href="/relief" className="sidebar-link">
//               <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="M12 6v6l4 2" /></svg>
//               Relief Planning
//             </a>
//             <a href="/pool" className="sidebar-link">
//               <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
//               Seafarer Pool
//             </a>
//             <a href="/vacancies" className="sidebar-link">
//               <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
//               Vacancies
//             </a>
//             <a href="/checklist" className="sidebar-link">
//               <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
//               Pre-Joining
//             </a>

//             <div className="sidebar-section">AUTOMATION</div>
//             <a href="#" className="sidebar-link">
//               <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
//               n8n Workflows
//             </a>
//             <a href="#" className="sidebar-link">
//               <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
//               Alert Logs
//             </a>
//           </nav>

//           <div className="sidebar-bottom">
//             <div className="sidebar-status">
//               <div className="sidebar-status-dot" />
//               <div>
//                 <div className="sidebar-status-text">All Systems Live</div>
//                 <div style={{ fontSize: 9, color: "#374151", marginTop: 1 }}>Supabase · n8n · Vercel</div>
//               </div>
//             </div>
//           </div>
//         </aside>

//         {/* ── MAIN ── */}
//         <div className="main">

//           {/* Top bar */}
//           <div className="topbar">
//             <div className="topbar-title">Operations Overview</div>
//             <div className="topbar-right">
//               <div style={{ textAlign:"right" }}>
//                 <div className="topbar-time">{time || "00:00:00"}</div>
//                 <div className="topbar-date">WAT · {date}</div>
//               </div>
//             </div>
//           </div>

//           {/* Hero */}
//           <div className="hero">
//             <div className="hero-img" style={{ backgroundImage:`url(${HERO_IMAGES[heroIdx]})`, opacity:heroFade?1:0 }} />
//             <div className="hero-overlay" />
//             <div className="hero-content">
//               <div className="hero-badge">
//                 <div style={{ width:5,height:5,borderRadius:"50%",background:"#f97316",animation:"pulse 1.5s infinite" }} />
//                 MARITIME CREW MANAGEMENT SYSTEM
//               </div>
//               <h1 className="hero-h1">MANAGING YOUR<br /><span>CREW</span> SMARTER.</h1>
//               <p className="hero-p">Complete crew lifecycle management — relief planning, seafarer deployment, vacancy tracking, and pre-joining compliance.</p>
//               <div className="hero-btns">
//                 <a href="/relief" className="btn-primary">Open Relief Dashboard</a>
//                 <a href="/pool" className="btn-ghost">Seafarer Pool →</a>
//               </div>
//             </div>
//             {/* Hero image dots */}
//             <div className="hero-dots">
//               {HERO_IMAGES.map((_,i) => (
//                 <div key={i} style={{ width:i===heroIdx?16:4, height:4, borderRadius:2, background:i===heroIdx?"#f97316":"rgba(255,255,255,0.2)", transition:"all .3s" }} />
//               ))}
//             </div>
//           </div>

//           {/* Stats */}
//           <div className="stats">
//             {[
//               { label:"ACTIVE SEAFARERS", n:stats.seafarers,  sub:"In database",    d:".2s" },
//               { label:"OPEN VACANCIES",   n:stats.vacancies,  sub:"Across vessels", d:".25s" },
//               { label:"PLACEMENTS MADE",  n:stats.placements, sub:"This cycle",     d:".3s" },
//               { label:"ALERTS SENT",      n:stats.alerts,     sub:"Via automation", d:".35s" },
//             ].map(s => (
//               <div key={s.label} className="stat-card" style={{ "--d":s.d } as any}>
//                 <div className="stat-label">{s.label}</div>
//                 <div className="stat-num"><AnimatedNumber target={s.n} /></div>
//                 <div className="stat-sub">↑ {s.sub}</div>
//                 <div className="stat-bar">
//                   <div className="stat-bar-fill" style={{ width:`${Math.min(s.n*8,100)}%` }} />
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Modules */}
//           <div className="modules-header">
//             <div>
//               <div className="modules-title">PLATFORM MODULES</div>
//               <div className="modules-sub">Four integrated modules — one complete crew management system</div>
//             </div>
//           </div>

//           <div className="modules-grid">
//             {MODULES.map((m,i) => (
//               <a key={m.href} href={m.href} className="module-card" style={{ "--d":`${.3+i*.07}s` } as any}>
//                 <Slideshow images={m.images} />
//                 <div className="module-body">
//                   <span className="module-tag">{m.tag}</span>
//                   <div className="module-name">{m.name}</div>
//                   <div className="module-desc">{m.desc}</div>
//                   <div className="module-footer">
//                     <span className="module-stat">{m.stat}</span>
//                     <div className="module-arrow">→</div>
//                   </div>
//                 </div>
//               </a>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }




"use client";
import { useState, useEffect, useRef } from "react";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
}

function AnimSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} style={{ opacity:inView?1:0, transform:inView?"translateY(0)":"translateY(28px)", transition:`opacity .7s ease ${delay}s, transform .7s ease ${delay}s` }}>
      {children}
    </div>
  );
}

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [n, setN] = useState(0);
  const { ref, inView } = useInView();
  useEffect(() => {
    if (!inView) return;
    let cur = 0;
    const t = setInterval(() => {
      cur += target / 50;
      if (cur >= target) { setN(target); clearInterval(t); }
      else setN(Math.floor(cur));
    }, 24);
    return () => clearInterval(t);
  }, [inView, target]);
  return <span ref={ref as any}>{n.toLocaleString()}{suffix}</span>;
}

const FEATURES = [
  { title:"Relief Planning Automation",       tag:"AUTOMATED",  desc:"Automated 28, 14, and 7-day alerts fire before every contract end date. Alerts go to Telegram, WhatsApp, and email simultaneously." },
  { title:"Seafarer Pool Management",         tag:"AI-POWERED", desc:"Your complete crew roster in one place. Track certifications, rank, and availability. AI-powered matching suggests the best relief candidates." },
  { title:"Vacancy & Placement Pipeline",     tag:"LIVE DATA",  desc:"Drag-and-drop kanban board for every open position. Track candidates from application to confirmed placement in real time." },
  { title:"Pre-Joining Compliance Checklist", tag:"COMPLIANCE", desc:"26-point checklist covering document verification, medical fitness, travel arrangements, and joining instructions." },
  { title:"MLC 2006 Compliance Built In",     tag:"MLC 2006",   desc:"Track rest hours, contract limits, certificate validity, and medical fitness — all aligned to Maritime Labour Convention requirements." },
  { title:"Telegram & WhatsApp Alerts",       tag:"INSTANT",    desc:"Instant notifications to your ops channel and directly to seafarers. Real-time alerts that reach people wherever they are." },
];

const PROBLEMS = [
  { icon:"📋", text:"Tracking crew contracts in spreadsheets" },
  { icon:"⏰", text:"Missing relief deadlines at the last minute" },
  { icon:"📱", text:"Chasing seafarers via WhatsApp groups" },
  { icon:"📁", text:"Document checklists scattered across emails" },
  { icon:"🔍", text:"No visibility on who is available for relief" },
  { icon:"⚠️", text:"MLC 2006 compliance done manually" },
];

const PLANS = [
  { name:"Starter",      price:"Free",  period:"",       highlight:false, features:["Up to 20 seafarers","Relief planning dashboard","Pre-joining checklist","In-app notifications","Email support"], cta:"Get Started Free" },
  { name:"Professional", price:"$100",   period:"/month", highlight:true,  features:["Unlimited seafarers","Everything in Starter","Telegram + WhatsApp alerts","n8n automation workflows","AI candidate matching","Priority support"], cta:"Start Free Trial" },
  { name:"Enterprise",   price:"Custom",period:"",       highlight:false, features:["Everything in Professional","Custom integrations","Dedicated onboarding","Multi-agency management","SLA guarantee","Dedicated account manager"], cta:"Contact Us" },
];

const TESTIMONIALS = [
  { name:"Capt. Emmanuel Osei",  role:"Operations Manager",     company:"Atlantic Crewing Ltd, Ghana",      text:"CrewFlow cut our relief planning time by 70%. We used to run everything on WhatsApp and spreadsheets. Now the system alerts us automatically and we never miss a sign-off." },
  { name:"Mrs. Funke Adeyemi",   role:"Crewing Superintendent", company:"Gulf Maritime Services, Nigeria",  text:"The pre-joining checklist alone saved us from two compliance incidents. Our MLC audit went perfectly because everything was tracked and documented in one place." },
  { name:"Mr. Chidi Okafor",     role:"Fleet Manager",          company:"West Africa Shipping Co.",         text:"The Telegram alerts are a game changer. I get notified 28 days before every sign-off without lifting a finger. Our relief candidates are always ready on time." },
];

export default function LandingPage() {
  const [dark, setDark]           = useState(true);
  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [company, setCompany]     = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [heroImg, setHeroImg]     = useState(0);
  const [heroFade, setHeroFade]   = useState(true);

  const HERO_IMGS = [
    "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=1600&q=70",
    "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1600&q=70",
    "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=1600&q=70",
  ];

  useEffect(() => {
    const t = setInterval(() => {
      setHeroFade(false);
      setTimeout(() => { setHeroImg(i => (i+1) % HERO_IMGS.length); setHeroFade(true); }, 500);
    }, 5000);
    HERO_IMGS.forEach(src => { const img = new Image(); img.src = src; });
    return () => clearInterval(t);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  // ── Theme tokens ────────────────────────────────────────────────────────
  const t = {
    bg:          dark ? "#0a0a0a"                        : "#f8f9fa",
    bg2:         dark ? "#080808"                        : "#ffffff",
    bg3:         dark ? "#111318"                        : "#ffffff",
    border:      dark ? "rgba(255,255,255,0.05)"         : "rgba(0,0,0,0.08)",
    borderHover: dark ? "rgba(249,115,22,0.35)"          : "rgba(249,115,22,0.5)",
    text:        dark ? "#e2e8f0"                        : "#0f172a",
    textMuted:   dark ? "#4b5563"                        : "#64748b",
    textFaint:   dark ? "#374151"                        : "#94a3b8",
    navBg:       dark ? "rgba(10,10,10,0.85)"            : "rgba(255,255,255,0.9)",
    cardBg:      dark ? "#111318"                        : "#ffffff",
    inputBg:     dark ? "rgba(255,255,255,0.06)"         : "rgba(0,0,0,0.04)",
    inputBorder: dark ? "rgba(255,255,255,0.1)"          : "rgba(0,0,0,0.12)",
    statBg:      dark ? "#111318"                        : "#f1f5f9",
    problemBg:   dark ? "#111318"                        : "#f8fafc",
    shadow:      dark ? "none"                           : "0 2px 16px rgba(0,0,0,0.06)",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes toggleSlide { from{transform:translateX(0)} to{transform:translateX(22px)} }

        .land { font-family:'Outfit',sans-serif; min-height:100vh; transition:background .3s,color .3s; }
        .nav-link-item { font-size:13px; font-weight:500; text-decoration:none; padding:7px 16px; border-radius:8px; transition:all .15s; }
        .feature-card { border-radius:16px; padding:28px; transition:border-color .25s,transform .25s,box-shadow .25s; }
        .feature-card:hover { transform:translateY(-3px); }
        .pricing-card { border-radius:20px; padding:32px; transition:border-color .2s; position:relative; overflow:hidden; }
        .testimonial-card { border-radius:16px; padding:28px; transition:border-color .2s; }
        .problem-item { display:flex; align-items:center; gap:14px; padding:14px 18px; border-radius:10px; font-size:13px; font-weight:500; transition:all .15s; }
        .stat-item { padding:36px 40px; text-align:center; position:relative; overflow:hidden; transition:background .2s; }
        .stat-item::after { content:''; position:absolute; bottom:0; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,#f97316,transparent); transform:scaleX(0); transition:transform .4s; }
        .stat-item:hover::after { transform:scaleX(1); }
        .shimmer-text {
          background:linear-gradient(90deg,#f97316,#fb923c,#fed7aa,#fb923c,#f97316);
          background-size:200% auto;
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          animation:shimmer 3s linear infinite;
        }

        /* TOGGLE */
        .toggle-wrap { display:flex; align-items:center; gap:8px; cursor:pointer; padding:6px 12px; border-radius:20px; transition:background .15s; }
        .toggle-track { width:44px; height:24px; border-radius:12px; position:relative; transition:background .3s; flex-shrink:0; }
        .toggle-thumb { position:absolute; top:3px; left:3px; width:18px; height:18px; border-radius:50%; background:#fff; transition:transform .3s cubic-bezier(.4,0,.2,1); box-shadow:0 2px 4px rgba(0,0,0,0.2); }

        @media (max-width:768px) {
          .features-grid { grid-template-columns:1fr !important; }
          .testimonials-grid { grid-template-columns:1fr !important; }
          .pricing-grid { grid-template-columns:1fr !important; }
          .problem-grid { grid-template-columns:1fr !important; }
          .pipeline-steps { grid-template-columns:1fr 1fr !important; }
          .stats-bar { grid-template-columns:1fr 1fr !important; }
          .footer-grid { grid-template-columns:1fr !important; }
          .hero-content { padding:0 24px !important; }
          .section-pad { padding:64px 24px !important; }
          .nav-wrap { padding:0 24px !important; }
          .nav-links-desktop { display:none !important; }
        }
      `}</style>

      <div className="land" style={{ background:t.bg, color:t.text }}>

        {/* ── NAV ── */}
        <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:200, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 60px", height:68, background:t.navBg, backdropFilter:"blur(20px)", borderBottom:`1px solid ${t.border}`, transition:"all .3s" }} className="nav-wrap">
          <a href="/landing" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:26, letterSpacing:4, color:t.text, textDecoration:"none" }}>
            CREW<span style={{ color:"#f97316" }}>FLOW</span>
          </a>

          <div style={{ display:"flex", alignItems:"center", gap:4 }} className="nav-links-desktop">
            {[["#features","Features"],["#how-it-works","How It Works"],["#pricing","Pricing"],["#testimonials","Testimonials"],["#contact","Contact"]].map(([href,label]) => (
              <a key={href} href={href} className="nav-link-item" style={{ color:t.textMuted }}>
                {label}
              </a>
            ))}
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            {/* Dark/Light Toggle */}
            <div className="toggle-wrap" onClick={() => setDark(!dark)} style={{ background: dark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.06)" }} title={dark?"Switch to Light Mode":"Switch to Dark Mode"}>
              <span style={{ fontSize:14 }}>{dark ? "🌙" : "☀️"}</span>
              <div className="toggle-track" style={{ background:dark?"#374151":"#f97316" }}>
                <div className="toggle-thumb" style={{ transform:dark?"translateX(0)":"translateX(20px)" }} />
              </div>
              <span style={{ fontSize:11, fontWeight:600, color:t.textMuted, minWidth:32 }}>{dark?"Dark":"Light"}</span>
            </div>

            <a href="/relief" style={{ fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:700, color:"#fff", background:"#f97316", padding:"8px 20px", borderRadius:9, textDecoration:"none", boxShadow:"0 4px 14px rgba(249,115,22,.35)", transition:"all .2s" }}>
              Get Started Free
            </a>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section style={{ position:"relative", height:"100vh", minHeight:700, display:"flex", alignItems:"center", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, backgroundImage:`url(${HERO_IMGS[heroImg]})`, backgroundSize:"cover", backgroundPosition:"center 30%", opacity:heroFade?1:0, transition:"opacity .6s ease" }} />
          <div style={{ position:"absolute", inset:0, background:dark?"linear-gradient(105deg,rgba(10,10,10,0.96) 0%,rgba(10,10,10,0.7) 45%,rgba(10,10,10,0.88) 100%)":"linear-gradient(105deg,rgba(248,249,250,0.96) 0%,rgba(248,249,250,0.75) 45%,rgba(248,249,250,0.9) 100%)" }} />
          <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(${dark?"rgba(249,115,22,0.03)":"rgba(249,115,22,0.04)"} 1px,transparent 1px),linear-gradient(90deg,${dark?"rgba(249,115,22,0.03)":"rgba(249,115,22,0.04)"} 1px,transparent 1px)`, backgroundSize:"60px 60px", pointerEvents:"none" }} />

          <div style={{ position:"relative", zIndex:10, padding:"0 60px", maxWidth:740, animation:"fadeUp .8s ease .2s both" }} className="hero-content">
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(249,115,22,0.12)", border:"1px solid rgba(249,115,22,0.3)", color:"#fb923c", fontSize:10, fontWeight:700, letterSpacing:3, padding:"5px 14px", borderRadius:4, marginBottom:28 }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:"#f97316", animation:"pulse 1.5s infinite" }} />
              MARITIME CREW MANAGEMENT SYSTEM
            </div>
            <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(56px,7vw,96px)", lineHeight:.95, letterSpacing:2, marginBottom:24, color:t.text }}>
              STOP LOSING<br />CREW TO<br />
              <span className="shimmer-text">POOR PLANNING.</span>
            </h1>
            <p style={{ fontSize:17, color:t.textMuted, lineHeight:1.75, maxWidth:520, marginBottom:40, fontWeight:400 }}>
              CrewFlow automates your entire crew management cycle — from contract tracking and relief alerts to vacancy placement and pre-joining compliance. Built for maritime agencies of all sizes.
            </p>
            <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:48 }}>
              <a href="#contact" style={{ background:"linear-gradient(135deg,#f97316,#ea580c)", color:"#fff", fontFamily:"'Outfit',sans-serif", fontSize:15, fontWeight:700, padding:"14px 32px", borderRadius:10, border:"none", cursor:"pointer", textDecoration:"none", boxShadow:"0 8px 32px rgba(249,115,22,.4)", transition:"all .2s" }}>
                Start Free — No Credit Card
              </a>
              <a href="#how-it-works" style={{ background:"transparent", color:t.textMuted, fontFamily:"'Outfit',sans-serif", fontSize:15, fontWeight:500, padding:"14px 28px", borderRadius:10, border:`1px solid ${dark?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.15)"}`, cursor:"pointer", textDecoration:"none", transition:"all .2s" }}>
                See How It Works ↓
              </a>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:20, flexWrap:"wrap" }}>
              {["MLC 2006 Compliant","Free to start","Setup in 30 minutes"].map(item => (
                <div key={item} style={{ display:"flex", alignItems:"center", gap:7, fontSize:12, color:t.textFaint, fontWeight:500 }}>
                  <div style={{ width:5, height:5, borderRadius:"50%", background:"#22c55e" }} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Hero image dots */}
          <div style={{ position:"absolute", bottom:24, right:60, display:"flex", gap:6, zIndex:10 }}>
            {HERO_IMGS.map((_,i) => (
              <div key={i} style={{ width:i===heroImg?16:4, height:4, borderRadius:2, background:i===heroImg?"#f97316":"rgba(255,255,255,0.2)", transition:"all .3s" }} />
            ))}
          </div>
        </section>

        {/* ── STATS BAR ── */}
        <div style={{ background:t.statBg, borderTop:`1px solid ${t.border}`, borderBottom:`1px solid ${t.border}`, display:"grid", gridTemplateColumns:"repeat(4,1fr)" }} className="stats-bar">
          {[
            { n:500, s:"+",  label:"Seafarers Managed"    },
            { n:98,  s:"%",  label:"On-Time Relief Rate"  },
            { n:70,  s:"%",  label:"Less Admin Work"      },
            { n:24,  s:"/7", label:"Automated Monitoring" },
          ].map((s,i) => (
            <AnimSection key={s.label} delay={i*.08}>
              <div className="stat-item" style={{ borderRight:i<3?`1px solid ${t.border}`:"none" }}>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:54, color:t.text, lineHeight:1, letterSpacing:"-1px" }}>
                  <Counter target={s.n} /><span style={{ color:"#f97316" }}>{s.s}</span>
                </div>
                <div style={{ fontSize:11, fontWeight:600, color:t.textFaint, letterSpacing:2, marginTop:6, textTransform:"uppercase" }}>{s.label}</div>
              </div>
            </AnimSection>
          ))}
        </div>

        {/* ── PROBLEM SECTION ── */}
        <section id="problem" style={{ padding:"100px 60px", background:t.bg }} className="section-pad">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"center" }} className="problem-grid">
            <AnimSection>
              <div>
                <div style={{ fontSize:10, fontWeight:700, color:"#f97316", letterSpacing:3, marginBottom:12 }}>THE PROBLEM</div>
                <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(36px,4vw,54px)", letterSpacing:2, lineHeight:1.05, marginBottom:16, color:t.text }}>
                  Maritime crew management is still running on <span style={{ color:"#f97316" }}>WhatsApp and Excel.</span>
                </h2>
                <p style={{ fontSize:15, color:t.textMuted, lineHeight:1.7, marginBottom:28 }}>Most crewing agencies manage their entire crew lifecycle through spreadsheets and WhatsApp groups. This leads to missed sign-offs, compliance failures, and last-minute chaos.</p>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {PROBLEMS.map((p,i) => (
                    <AnimSection key={p.text} delay={i*.06}>
                      <div className="problem-item" style={{ background:t.problemBg, border:`1px solid ${t.border}`, color:t.textMuted, boxShadow:t.shadow }}>
                        <span style={{ fontSize:18 }}>{p.icon}</span>{p.text}
                      </div>
                    </AnimSection>
                  ))}
                </div>
              </div>
            </AnimSection>
            <AnimSection delay={0.2}>
              <div style={{ background:t.cardBg, border:`1px solid rgba(249,115,22,0.2)`, borderRadius:20, padding:36, position:"relative", overflow:"hidden", boxShadow:t.shadow }}>
                <div style={{ position:"absolute", top:-60, right:-60, width:200, height:200, background:"radial-gradient(circle,rgba(249,115,22,0.1) 0%,transparent 70%)", pointerEvents:"none" }} />
                <div style={{ fontSize:11, fontWeight:700, color:"#f97316", letterSpacing:2, marginBottom:20 }}>THE CREWFLOW DIFFERENCE</div>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:36, color:t.text, lineHeight:1.05, marginBottom:16 }}>ONE PLATFORM.<br />EVERYTHING CONNECTED.</div>
                <p style={{ fontSize:13, color:t.textMuted, lineHeight:1.7, marginBottom:24 }}>CrewFlow replaces your spreadsheets, WhatsApp groups, and email chains with a single intelligent platform.</p>
                {["Automated relief alerts — never miss a sign-off","Real-time crew availability — always know who is ready","Digital compliance records — MLC 2006 built in","Multi-channel alerts — Telegram, WhatsApp, Email"].map((item,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:12, marginBottom:12 }}>
                    <div style={{ width:18, height:18, borderRadius:"50%", background:"rgba(34,197,94,0.15)", border:"1px solid rgba(34,197,94,0.3)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                      <span style={{ fontSize:9, color:"#22c55e" }}>✓</span>
                    </div>
                    <span style={{ fontSize:13, color:t.textMuted, lineHeight:1.6 }}>{item}</span>
                  </div>
                ))}
              </div>
            </AnimSection>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" style={{ padding:"100px 60px", background:t.bg2 }} className="section-pad">
          <AnimSection>
            <div style={{ textAlign:"center", marginBottom:56 }}>
              <div style={{ fontSize:10, fontWeight:700, color:"#f97316", letterSpacing:3, marginBottom:12 }}>HOW IT WORKS</div>
              <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(36px,4vw,54px)", letterSpacing:2, lineHeight:1.05, color:t.text }}>
                From Onboarding to <span style={{ color:"#f97316" }}>Sign-Off in 4 Steps</span>
              </h2>
            </div>
          </AnimSection>
          <AnimSection delay={0.2}>
            <div style={{ background:t.cardBg, border:`1px solid ${t.border}`, borderRadius:20, padding:40, position:"relative", overflow:"hidden", boxShadow:t.shadow }}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:0, position:"relative" }} className="pipeline-steps">
                {[
                  { color:"#f97316", border:"rgba(249,115,22,0.3)", icon:"👤", label:"Add Seafarer",    sub:"Enter crew details, rank, contract dates"          },
                  { color:"#3b82f6", border:"rgba(59,130,246,0.3)",  icon:"⚡", label:"Auto Monitoring",sub:"System tracks days to sign-off in real time"       },
                  { color:"#8b5cf6", border:"rgba(139,92,246,0.3)",  icon:"🔔", label:"Alert Triggered",sub:"28, 14, 7-day alerts fire to Telegram & WhatsApp"  },
                  { color:"#22c55e", border:"rgba(34,197,94,0.3)",   icon:"✅", label:"Relief Confirmed",sub:"Candidate selected, pre-joining checklist started" },
                ].map((step,i) => (
                  <div key={i} style={{ textAlign:"center", padding:"24px 16px", position:"relative" }}>
                    {i < 3 && <div style={{ position:"absolute", right:-12, top:"50%", transform:"translateY(-50%)", fontSize:20, color:t.textFaint, zIndex:1 }}>→</div>}
                    <div style={{ width:52, height:52, borderRadius:"50%", border:`2px solid ${step.border}`, background:step.border, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px", fontSize:22 }}>{step.icon}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:t.text, marginBottom:4 }}>{step.label}</div>
                    <div style={{ fontSize:11, color:t.textFaint }}>{step.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </AnimSection>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" style={{ padding:"100px 60px", background:t.bg }} className="section-pad">
          <AnimSection>
            <div style={{ marginBottom:56 }}>
              <div style={{ fontSize:10, fontWeight:700, color:"#f97316", letterSpacing:3, marginBottom:12 }}>PLATFORM FEATURES</div>
              <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(36px,4vw,54px)", letterSpacing:2, lineHeight:1.05, marginBottom:16, color:t.text }}>
                Everything Your Agency <span style={{ color:"#f97316" }}>Needs to Run Smarter</span>
              </h2>
              <p style={{ fontSize:15, color:t.textMuted, lineHeight:1.7, maxWidth:520 }}>Six powerful modules working together to replace your entire crew management stack.</p>
            </div>
          </AnimSection>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }} className="features-grid">
            {FEATURES.map((f,i) => (
              <AnimSection key={f.title} delay={i*.07}>
                <div className="feature-card" style={{ background:t.cardBg, border:`1px solid ${t.border}`, boxShadow:t.shadow }}>
                  <div style={{ width:48, height:48, borderRadius:12, background:"rgba(249,115,22,0.1)", border:"1px solid rgba(249,115,22,0.2)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:18 }}>
                    <svg width="22" height="22" fill="none" stroke="#f97316" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6v6l4 2"/></svg>
                  </div>
                  <span style={{ fontSize:9, fontWeight:700, letterSpacing:"2.5px", color:"#f97316", display:"block", marginBottom:8 }}>{f.tag}</span>
                  <div style={{ fontSize:15, fontWeight:700, color:t.text, marginBottom:10, lineHeight:1.3 }}>{f.title}</div>
                  <div style={{ fontSize:13, color:t.textMuted, lineHeight:1.65 }}>{f.desc}</div>
                </div>
              </AnimSection>
            ))}
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section id="testimonials" style={{ padding:"100px 60px", background:t.bg2 }} className="section-pad">
          <AnimSection>
            <div style={{ textAlign:"center", marginBottom:56 }}>
              <div style={{ fontSize:10, fontWeight:700, color:"#f97316", letterSpacing:3, marginBottom:12 }}>TESTIMONIALS</div>
              <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(36px,4vw,54px)", letterSpacing:2, lineHeight:1.05, color:t.text }}>
                Trusted by Maritime <span style={{ color:"#f97316" }}>Professionals Across Africa</span>
              </h2>
            </div>
          </AnimSection>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }} className="testimonials-grid">
            {TESTIMONIALS.map((tm,i) => (
              <AnimSection key={tm.name} delay={i*.1}>
                <div className="testimonial-card" style={{ background:t.cardBg, border:`1px solid ${t.border}`, boxShadow:t.shadow }}>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:48, color:"#f97316", lineHeight:.8, marginBottom:8 }}>"</div>
                  <p style={{ fontSize:14, color:t.textMuted, lineHeight:1.75, marginBottom:24, fontStyle:"italic" }}>{tm.text}</p>
                  <div style={{ fontSize:14, fontWeight:700, color:t.text }}>{tm.name}</div>
                  <div style={{ fontSize:11, color:t.textFaint, marginTop:3 }}>{tm.role}</div>
                  <div style={{ fontSize:11, color:"#f97316", marginTop:2, fontWeight:600 }}>{tm.company}</div>
                </div>
              </AnimSection>
            ))}
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="pricing" style={{ padding:"100px 60px", background:t.bg }} className="section-pad">
          <AnimSection>
            <div style={{ textAlign:"center", marginBottom:56 }}>
              <div style={{ fontSize:10, fontWeight:700, color:"#f97316", letterSpacing:3, marginBottom:12 }}>PRICING</div>
              <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(36px,4vw,54px)", letterSpacing:2, lineHeight:1.05, color:t.text }}>
                Simple Pricing for <span style={{ color:"#f97316" }}>Every Agency</span>
              </h2>
              <p style={{ fontSize:15, color:t.textMuted, margin:"12px auto 0", maxWidth:400 }}>Start free. Upgrade when you need more. No hidden fees.</p>
            </div>
          </AnimSection>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }} className="pricing-grid">
            {PLANS.map((plan,i) => (
              <AnimSection key={plan.name} delay={i*.1}>
                <div className="pricing-card" style={{
                  background: plan.highlight ? (dark?"linear-gradient(135deg,rgba(249,115,22,0.08) 0%,#111318 60%)":"linear-gradient(135deg,rgba(249,115,22,0.06) 0%,#fff 60%)") : t.cardBg,
                  border:`1px solid ${plan.highlight?"rgba(249,115,22,0.4)":t.border}`,
                  boxShadow: plan.highlight?"0 8px 40px rgba(249,115,22,0.15)":t.shadow
                }}>
                  {plan.highlight && <div style={{ position:"absolute", top:20, right:20, background:"#f97316", color:"#fff", fontSize:9, fontWeight:700, letterSpacing:2, padding:"3px 10px", borderRadius:20 }}>MOST POPULAR</div>}
                  <div style={{ fontSize:12, fontWeight:700, color:t.textFaint, letterSpacing:2, marginBottom:16 }}>{plan.name.toUpperCase()}</div>
                  <div>
                    <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:52, color:t.text, lineHeight:1, letterSpacing:"-1px" }}>{plan.price}</span>
                    <span style={{ fontSize:14, color:t.textFaint, fontWeight:500, marginLeft:4 }}>{plan.period}</span>
                  </div>
                  <ul style={{ listStyle:"none", margin:"20px 0 24px" }}>
                    {plan.features.map(f => (
                      <li key={f} style={{ display:"flex", alignItems:"center", gap:10, fontSize:13, color:t.textMuted, marginBottom:10 }}>
                        <div style={{ width:16, height:16, borderRadius:"50%", background:"rgba(34,197,94,0.15)", border:"1px solid rgba(34,197,94,0.3)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:9, color:"#22c55e" }}>✓</div>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior:"smooth" })}
                    style={{ width:"100%", fontFamily:"'Outfit',sans-serif", fontSize:14, fontWeight:700, padding:13, borderRadius:10, border:"none", cursor:"pointer", transition:"all .2s", background:plan.highlight?"#f97316":dark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.06)", color:plan.highlight?"#fff":t.textMuted, boxShadow:plan.highlight?"0 4px 16px rgba(249,115,22,.3)":"none" }}>
                    {plan.cta}
                  </button>
                </div>
              </AnimSection>
            ))}
          </div>
        </section>

        {/* ── CTA / CONTACT ── */}
        <section id="contact" style={{ padding:"100px 60px", background:dark?"linear-gradient(135deg,#111318 0%,rgba(249,115,22,0.06) 50%,#111318 100%)":"linear-gradient(135deg,#f1f5f9 0%,rgba(249,115,22,0.05) 50%,#f1f5f9 100%)", borderTop:`1px solid ${t.border}`, textAlign:"center", position:"relative", overflow:"hidden" }} className="section-pad">
          <div style={{ position:"absolute", top:-100, left:"50%", transform:"translateX(-50%)", width:600, height:300, background:"radial-gradient(ellipse,rgba(249,115,22,0.08) 0%,transparent 70%)", pointerEvents:"none" }} />
          <AnimSection>
            <div style={{ fontSize:10, fontWeight:700, color:"#f97316", letterSpacing:3, marginBottom:12 }}>GET STARTED TODAY</div>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(36px,5vw,64px)", letterSpacing:2, lineHeight:1.05, marginBottom:16, color:t.text }}>
              Ready to Modernise Your <span style={{ color:"#f97316" }}>Crew Management?</span>
            </h2>
            <p style={{ fontSize:15, color:t.textMuted, maxWidth:480, margin:"0 auto", lineHeight:1.7 }}>
              Join maritime agencies already using CrewFlow. Free to start, no credit card required.
            </p>
          </AnimSection>

          {!submitted ? (
            <AnimSection delay={0.2}>
              <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12, maxWidth:480, margin:"40px auto 0" }}>
                {[
                  { ph:"Your full name",            val:name,    fn:(v:string) => setName(v),    type:"text"  },
                  { ph:"Your company / agency name",val:company, fn:(v:string) => setCompany(v), type:"text"  },
                  { ph:"Work email address *",      val:email,   fn:(v:string) => setEmail(v),   type:"email" },
                ].map(f => (
                  <input key={f.ph} type={f.type} placeholder={f.ph} value={f.val} onChange={e => f.fn(e.target.value)} required={f.type==="email"}
                    style={{ width:"100%", background:t.inputBg, border:`1px solid ${t.inputBorder}`, borderRadius:10, padding:"13px 18px", fontFamily:"'Outfit',sans-serif", fontSize:14, color:t.text, outline:"none", transition:"border-color .15s" }} />
                ))}
                <button type="submit" style={{ width:"100%", background:"linear-gradient(135deg,#f97316,#ea580c)", color:"#fff", fontFamily:"'Outfit',sans-serif", fontSize:15, fontWeight:700, padding:14, borderRadius:10, border:"none", cursor:"pointer", boxShadow:"0 8px 32px rgba(249,115,22,.4)", transition:"all .2s" }}>
                  Get Started Free →
                </button>
                <p style={{ fontSize:11, color:t.textFaint }}>No credit card required · Setup in 30 minutes · MLC 2006 compliant</p>
              </form>
            </AnimSection>
          ) : (
            <AnimSection delay={0.1}>
              <div style={{ marginTop:40, background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.3)", borderRadius:16, padding:"32px 40px", maxWidth:480, margin:"40px auto 0", textAlign:"center" }}>
                <div style={{ fontSize:40, marginBottom:12 }}>🎉</div>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:28, color:"#22c55e", marginBottom:8 }}>YOU'RE ON THE LIST!</div>
                <p style={{ fontSize:14, color:t.textMuted, lineHeight:1.7 }}>
                  Thanks {name || ""}! We'll be in touch at <strong style={{ color:t.text }}>{email}</strong> within 24 hours.
                </p>
                <a href="/relief" style={{ display:"inline-block", marginTop:20, background:"#f97316", color:"#fff", fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:700, padding:"10px 24px", borderRadius:8, textDecoration:"none" }}>
                  Explore the Dashboard →
                </a>
              </div>
            </AnimSection>
          )}
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ background:t.bg2, borderTop:`1px solid ${t.border}`, padding:60 }}>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:48, marginBottom:48 }} className="footer-grid">
            <div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:26, letterSpacing:4, color:t.text, marginBottom:14 }}>
                CREW<span style={{ color:"#f97316" }}>FLOW</span>
              </div>
              <p style={{ fontSize:13, color:t.textFaint, lineHeight:1.7, maxWidth:280, marginBottom:20 }}>The modern crew management platform built for maritime agencies and shipping companies worldwide.</p>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {["MLC 2006 Compliant","Supabase Powered","n8n Automated"].map(tag => (
                  <span key={tag} style={{ fontSize:9, fontWeight:700, color:t.textFaint, background:dark?"rgba(255,255,255,0.03)":"rgba(0,0,0,0.04)", border:`1px solid ${t.border}`, padding:"3px 10px", borderRadius:4, letterSpacing:1 }}>{tag}</span>
                ))}
              </div>
            </div>
            {[
              { title:"PLATFORM",  links:[["Relief Planning","/relief"],["Seafarer Pool","/pool"],["Vacancy Pipeline","/vacancies"],["Pre-Joining Checklist","/checklist"]] },
              { title:"COMPANY",   links:[["About CrewFlow","#"],["Pricing","#pricing"],["Contact Us","#contact"],["Privacy Policy","#"]] },
              { title:"INTEGRATIONS", links:[["Supabase","#"],["n8n Automation","#"],["Telegram Bot","#"],["WhatsApp API","#"]] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize:10, fontWeight:700, color:t.textFaint, letterSpacing:"2.5px", marginBottom:16 }}>{col.title}</div>
                {col.links.map(([label,href]) => (
                  <a key={label} href={href} style={{ display:"block", fontSize:13, color:t.textMuted, textDecoration:"none", marginBottom:10, transition:"color .15s" }}
                    onMouseEnter={e => (e.currentTarget.style.color="#f97316")}
                    onMouseLeave={e => (e.currentTarget.style.color=t.textMuted)}>
                    {label}
                  </a>
                ))}
              </div>
            ))}
          </div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:28, borderTop:`1px solid ${t.border}`, flexWrap:"wrap", gap:12 }}>
            <div style={{ fontSize:12, color:t.textFaint }}>© 2026 CrewFlow. Built for the maritime industry.</div>
            <div style={{ display:"flex", alignItems:"center", gap:16 }}>
              {/* Footer toggle */}
              <div className="toggle-wrap" onClick={() => setDark(!dark)} style={{ background:dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.04)" }}>
                <span style={{ fontSize:13 }}>{dark?"🌙":"☀️"}</span>
                <div className="toggle-track" style={{ background:dark?"#374151":"#f97316" }}>
                  <div className="toggle-thumb" style={{ transform:dark?"translateX(0)":"translateX(20px)" }} />
                </div>
                <span style={{ fontSize:11, fontWeight:600, color:t.textFaint }}>{dark?"Dark":"Light"}</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:7, fontSize:11, color:"#22c55e" }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e", animation:"pulse 2s infinite" }} />
                All systems operational
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}