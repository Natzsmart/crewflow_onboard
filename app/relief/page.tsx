"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Seafarer = {
  id: string;
  full_name: string;
  rank: string;
  sign_off_date: string;
  relief_status: string;
  urgency_level: string;
  email: string;
  whatsapp: string;
  telegram_id: string;
};

function daysUntil(d: string) {
  return Math.ceil((new Date(d).getTime() - new Date().getTime()) / 86400000);
}
function fmt(d: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" });
}
const URGENCY = {
  overdue:  { color:"#ef4444", bg:"rgba(239,68,68,0.1)",   border:"rgba(239,68,68,0.2)"  },
  critical: { color:"#f97316", bg:"rgba(249,115,22,0.1)",  border:"rgba(249,115,22,0.2)" },
  high:     { color:"#eab308", bg:"rgba(234,179,8,0.1)",   border:"rgba(234,179,8,0.2)"  },
  medium:   { color:"#3b82f6", bg:"rgba(59,130,246,0.1)",  border:"rgba(59,130,246,0.2)" },
  on_track: { color:"#22c55e", bg:"rgba(34,197,94,0.1)",   border:"rgba(34,197,94,0.2)"  },
};

export default function ReliefPage() {
  const [crew, setCrew]         = useState<Seafarer[]>([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState<Seafarer | null>(null);
  const [alerting, setAlerting] = useState<string | null>(null);
  const [toast, setToast]       = useState("");
  const [showAdd, setShowAdd]   = useState(false);
  const [filter, setFilter]     = useState("all");
  const [form, setForm]         = useState({ full_name:"", rank:"", sign_off_date:"", email:"", whatsapp:"", telegram_id:"" });
  const [saving, setSaving]     = useState(false);

  async function load() {
    const { data } = await supabase
      .from("seafarers")
      .select("*")
      .neq("relief_status", "complete")
      .order("sign_off_date", { ascending: true });
    setCrew(data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    const ch = supabase.channel("relief-live")
      .on("postgres_changes", { event:"*", schema:"public", table:"seafarers" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  async function sendAlert(s: Seafarer) {
    setAlerting(s.id);
    const days = daysUntil(s.sign_off_date);
    const msg  = `🚨 *CrewFlow Alert*\n\n*${s.full_name}* (${s.rank})\nSign-off: ${fmt(s.sign_off_date)}\nDays left: *${days <= 0 ? "OVERDUE" : days}*\n\nAction required in CrewFlow.`;
    try {
      await fetch(`https://api.telegram.org/bot${process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ chat_id: process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID, text: msg, parse_mode:"Markdown" })
      });
      await supabase.from("relief_alerts").insert({ seafarer_id:s.id, trigger_type:"manual", recipient_type:"manager", channels:["telegram"], status:"sent" });
      setToast(`✓ Alert sent for ${s.full_name}`);
    } catch { setToast("Failed to send alert"); }
    setAlerting(null);
    setTimeout(() => setToast(""), 3000);
  }

  async function addSeafarer() {
    if (!form.full_name || !form.rank || !form.sign_off_date) return;
    setSaving(true);
    await supabase.from("seafarers").insert({ ...form, relief_status:"unassigned", urgency_level:"on_track", is_available:false });
    setForm({ full_name:"", rank:"", sign_off_date:"", email:"", whatsapp:"", telegram_id:"" });
    setShowAdd(false);
    setSaving(false);
    load();
  }

  const filtered = filter === "all" ? crew : crew.filter(s => s.urgency_level === filter);
  const stats = {
    total:    crew.length,
    overdue:  crew.filter(s => s.urgency_level === "overdue").length,
    critical: crew.filter(s => s.urgency_level === "critical").length,
    high:     crew.filter(s => s.urgency_level === "high").length,
    ontrack:  crew.filter(s => s.urgency_level === "on_track").length,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        html,body { background:#0d0e12; }
        .page { font-family:'Outfit',sans-serif; background:#0d0e12; color:#e2e8f0; min-height:100vh; display:flex; }
        .btn { font-family:inherit; cursor:pointer; border:none; transition:all .15s; }
        .btn:hover { opacity:.88; transform:scale(.97); }
        input,select { font-family:inherit; outline:none; transition:border-color .15s; }
        input:focus,select:focus { border-color:#f97316 !important; box-shadow:0 0 0 3px rgba(249,115,22,.08); }
        .row-hover { transition:background .15s; }
        .row-hover:hover { background:rgba(255,255,255,0.025) !important; }

        /* SIDEBAR */
        .sidebar {
          width:220px; flex-shrink:0;
          background:#111318; border-right:1px solid rgba(255,255,255,0.05);
          display:flex; flex-direction:column;
          position:fixed; top:0; bottom:0; left:0; z-index:200;
        }
        .sidebar-brand { padding:20px 22px 18px; border-bottom:1px solid rgba(255,255,255,0.05); text-decoration:none; display:block; }
        .sidebar-logo { font-family:'Bebas Neue',sans-serif; font-size:22px; letter-spacing:4px; color:#fff; }
        .sidebar-logo span { color:#f97316; }
        .sidebar-tagline { font-size:9px; font-weight:600; color:#374151; letter-spacing:2px; margin-top:2px; }
        .sidebar-nav { flex:1; padding:16px 12px; overflow-y:auto; }
        .sidebar-section { font-size:9px; font-weight:700; color:#374151; letter-spacing:2.5px; padding:0 10px; margin:16px 0 6px; }
        .sidebar-link {
          display:flex; align-items:center; gap:10px;
          padding:9px 10px; border-radius:8px;
          font-size:13px; font-weight:500; color:#6b7280;
          text-decoration:none; transition:all .15s; margin-bottom:2px;
        }
        .sidebar-link:hover { background:rgba(255,255,255,0.04); color:#e2e8f0; }
        .sidebar-link.active { background:rgba(249,115,22,0.1); color:#f97316; }
        .sidebar-bottom { padding:16px 12px; border-top:1px solid rgba(255,255,255,0.05); }
        .sidebar-status { display:flex; align-items:center; gap:8px; padding:8px 10px; border-radius:8px; background:rgba(34,197,94,0.06); border:1px solid rgba(34,197,94,0.12); }
        .sidebar-dot { width:6px; height:6px; border-radius:50%; background:#22c55e; animation:pulse 2s infinite; }

        /* MAIN */
        .main { margin-left:220px; flex:1; min-height:100vh; }
        .topbar { background:#111318; border-bottom:1px solid rgba(255,255,255,0.05); padding:0 32px; height:56px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:100; }
      `}</style>

      <div className="page">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <a href="/" className="sidebar-brand">
            <div className="sidebar-logo">CREW<span>FLOW</span></div>
            <div className="sidebar-tagline">MARITIME CREW MANAGEMENT</div>
          </a>
          <nav className="sidebar-nav">
            <div className="sidebar-section">OVERVIEW</div>
            <a href="/" className="sidebar-link">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
              Dashboard
            </a>
            <div className="sidebar-section">MODULES</div>
            <a href="/relief" className="sidebar-link active">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6v6l4 2"/></svg>
              Relief Planning
            </a>
            <a href="/pool" className="sidebar-link">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Seafarer Pool
            </a>
            <a href="/vacancies" className="sidebar-link">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              Vacancies
            </a>
            <a href="/checklist" className="sidebar-link">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              Pre-Joining
            </a>
            <div className="sidebar-section">AUTOMATION</div>
            <a href="#" className="sidebar-link">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              n8n Workflows
            </a>
            <a href="#" className="sidebar-link">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              Alert Logs
            </a>
          </nav>
          <div className="sidebar-bottom">
            <div className="sidebar-status">
              <div className="sidebar-dot" />
              <div>
                <div style={{ fontSize:11, fontWeight:600, color:"#22c55e" }}>All Systems Live</div>
                <div style={{ fontSize:9, color:"#374151", marginTop:1 }}>Supabase · n8n · Vercel</div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div className="main">

          {/* Top bar */}
          <div className="topbar">
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:14, fontWeight:700, color:"#e2e8f0" }}>Relief Planning</span>
              <span style={{ fontSize:11, color:"#374151" }}>/ Contract Tracking & Alerts</span>
            </div>
            <button className="btn" onClick={() => setShowAdd(!showAdd)}
              style={{ background:"#f97316", color:"#fff", padding:"8px 18px", borderRadius:8, fontSize:12, fontWeight:700, boxShadow:"0 4px 12px rgba(249,115,22,.3)" }}>
              + Add Seafarer
            </button>
          </div>

          <div style={{ padding:"24px 28px" }}>

            {/* Add form */}
            {showAdd && (
              <div style={{ background:"#111318", border:"1px solid rgba(249,115,22,0.25)", borderRadius:14, padding:20, marginBottom:20, animation:"fadeUp .25s ease" }}>
                <div style={{ fontSize:10, fontWeight:700, color:"#f97316", letterSpacing:2, marginBottom:14 }}>NEW SEAFARER</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:10 }}>
                  {[
                    { key:"full_name",     ph:"Full Name *",        type:"text" },
                    { key:"rank",          ph:"Rank *",             type:"text" },
                    { key:"sign_off_date", ph:"Sign-Off Date *",    type:"date" },
                    { key:"email",         ph:"Email",              type:"email" },
                    { key:"whatsapp",      ph:"WhatsApp (+234...)", type:"text" },
                    { key:"telegram_id",   ph:"Telegram ID",        type:"text" },
                  ].map(f => (
                    <input key={f.key} type={f.type} placeholder={f.ph} value={(form as any)[f.key]}
                      onChange={e => setForm(p => ({...p,[f.key]:e.target.value}))}
                      style={{ background:"#0d0e12", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, padding:"9px 13px", fontSize:13, color:"#e2e8f0" }} />
                  ))}
                </div>
                <button className="btn" onClick={addSeafarer} disabled={saving}
                  style={{ background:"#f97316", color:"#fff", padding:"9px 22px", borderRadius:8, fontSize:12, fontWeight:700 }}>
                  {saving ? "Saving..." : "Save Seafarer"}
                </button>
              </div>
            )}

            {/* Stats */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginBottom:22 }}>
              {[
                { label:"TOTAL CREW",     val:stats.total,    color:"#e2e8f0" },
                { label:"OVERDUE",        val:stats.overdue,  color:"#ef4444" },
                { label:"CRITICAL ≤7D",   val:stats.critical, color:"#f97316" },
                { label:"HIGH ≤14D",      val:stats.high,     color:"#eab308" },
                { label:"ON TRACK",       val:stats.ontrack,  color:"#22c55e" },
              ].map((s,i) => (
                <div key={s.label} style={{ background:"#111318", border:"1px solid rgba(255,255,255,0.05)", borderRadius:12, padding:"16px 18px", animation:`fadeUp .4s ease ${i*.06}s both` }}>
                  <div style={{ fontSize:9, fontWeight:700, color:"#374151", letterSpacing:2, marginBottom:8 }}>{s.label}</div>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:40, color:s.color, lineHeight:1 }}>{s.val}</div>
                </div>
              ))}
            </div>

            {/* Filter tabs */}
            <div style={{ display:"flex", gap:6, marginBottom:16 }}>
              {["all","overdue","critical","high","medium","on_track"].map(f => (
                <button key={f} className="btn" onClick={() => setFilter(f)}
                  style={{ background: filter===f ? "#f97316" : "rgba(255,255,255,0.04)", color: filter===f ? "#fff" : "#6b7280", border: `1px solid ${filter===f ? "#f97316" : "rgba(255,255,255,0.06)"}`, padding:"5px 14px", borderRadius:20, fontSize:11, fontWeight:600, textTransform:"capitalize" }}>
                  {f.replace("_"," ")}
                </button>
              ))}
            </div>

            {/* Table */}
            <div style={{ background:"#111318", border:"1px solid rgba(255,255,255,0.05)", borderRadius:14, overflow:"hidden" }}>
              <div style={{ display:"grid", gridTemplateColumns:"2fr 1.5fr 1fr 1fr 1.2fr 1fr", background:"rgba(255,255,255,0.02)", padding:"11px 20px", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                {["SEAFARER","RANK","SIGN-OFF","DAYS LEFT","STATUS","ACTION"].map(h => (
                  <div key={h} style={{ fontSize:10, fontWeight:700, color:"#374151", letterSpacing:1.5 }}>{h}</div>
                ))}
              </div>

              {loading && (
                <div style={{ textAlign:"center", padding:"48px 0" }}>
                  <div style={{ width:28, height:28, border:"2px solid rgba(255,255,255,0.06)", borderTopColor:"#f97316", borderRadius:"50%", animation:"spin .8s linear infinite", margin:"0 auto" }} />
                </div>
              )}

              {!loading && filtered.length === 0 && (
                <div style={{ textAlign:"center", padding:"52px 0", color:"#374151", fontSize:14 }}>
                  No crew members found. Add one to get started.
                </div>
              )}

              {!loading && filtered.map((s, i) => {
                const days = daysUntil(s.sign_off_date);
                const u    = URGENCY[(s.urgency_level as keyof typeof URGENCY)] || URGENCY.on_track;
                return (
                  <div key={s.id} className="row-hover"
                    onClick={() => setSelected(selected?.id === s.id ? null : s)}
                    style={{ display:"grid", gridTemplateColumns:"2fr 1.5fr 1fr 1fr 1.2fr 1fr", padding:"13px 20px", borderBottom:"1px solid rgba(255,255,255,0.03)", cursor:"pointer", background:"transparent", animation:`fadeUp .3s ease ${i*.04}s both` }}>
                    <div style={{ fontWeight:600, fontSize:14, color:"#e2e8f0" }}>{s.full_name}</div>
                    <div style={{ fontSize:13, color:"#6b7280", fontWeight:500, alignSelf:"center" }}>{s.rank}</div>
                    <div style={{ fontSize:13, color:"#9ca3af", alignSelf:"center" }}>{fmt(s.sign_off_date)}</div>
                    <div style={{ fontSize:15, fontWeight:800, color:u.color, alignSelf:"center" }}>
                      {days <= 0 ? "OVERDUE" : `${days}d`}
                    </div>
                    <div style={{ alignSelf:"center" }}>
                      <span style={{ fontSize:10, fontWeight:700, color:u.color, background:u.bg, border:`1px solid ${u.border}`, padding:"3px 10px", borderRadius:20 }}>
                        {(s.urgency_level || "on_track").replace("_"," ").toUpperCase()}
                      </span>
                    </div>
                    <div style={{ alignSelf:"center" }}>
                      <button className="btn" onClick={e => { e.stopPropagation(); sendAlert(s); }}
                        disabled={alerting === s.id}
                        style={{ background: alerting===s.id ? "rgba(249,115,22,0.1)" : "#f97316", color: alerting===s.id ? "#f97316" : "#fff", border: alerting===s.id ? "1px solid rgba(249,115,22,0.3)" : "none", padding:"6px 14px", borderRadius:7, fontSize:11, fontWeight:700 }}>
                        {alerting===s.id ? "Sending..." : "Alert"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* DETAIL PANEL */}
        {selected && (
          <div style={{ position:"fixed", right:0, top:0, bottom:0, width:300, background:"#111318", borderLeft:"1px solid rgba(255,255,255,0.07)", padding:24, overflowY:"auto", animation:"slideIn .22s ease", zIndex:300, boxShadow:"-12px 0 40px rgba(0,0,0,0.4)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
              <div style={{ fontSize:10, fontWeight:700, color:"#f97316", letterSpacing:2 }}>SEAFARER DETAIL</div>
              <button className="btn" onClick={() => setSelected(null)}
                style={{ background:"rgba(255,255,255,0.06)", color:"#9ca3af", width:28, height:28, borderRadius:7, fontSize:15, fontWeight:700 }}>×</button>
            </div>
            <div style={{ fontSize:20, fontWeight:800, color:"#e2e8f0", marginBottom:4 }}>{selected.full_name}</div>
            <div style={{ fontSize:13, color:"#f97316", fontWeight:600, marginBottom:24 }}>{selected.rank}</div>

            {[
              { label:"Sign-Off Date",  val:fmt(selected.sign_off_date) },
              { label:"Days Remaining", val:daysUntil(selected.sign_off_date) <= 0 ? "OVERDUE" : `${daysUntil(selected.sign_off_date)} days` },
              { label:"Relief Status",  val:selected.relief_status || "unassigned" },
              { label:"Urgency Level",  val:(selected.urgency_level||"on_track").replace("_"," ") },
              { label:"Email",          val:selected.email || "—" },
              { label:"WhatsApp",       val:selected.whatsapp || "—" },
              { label:"Telegram",       val:selected.telegram_id || "—" },
            ].map(r => (
              <div key={r.label} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ fontSize:11, color:"#374151", fontWeight:500 }}>{r.label}</span>
                <span style={{ fontSize:12, fontWeight:600, color:"#e2e8f0" }}>{r.val}</span>
              </div>
            ))}

            <button className="btn" onClick={() => sendAlert(selected)} disabled={alerting === selected.id}
              style={{ width:"100%", marginTop:22, background:"#f97316", color:"#fff", padding:"12px", borderRadius:10, fontSize:13, fontWeight:700, boxShadow:"0 4px 16px rgba(249,115,22,.3)" }}>
              {alerting===selected.id ? "Sending..." : "Send Telegram Alert"}
            </button>
          </div>
        )}

        {/* TOAST */}
        {toast && (
          <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", background:"#1a1d24", color:"#e2e8f0", padding:"11px 22px", borderRadius:10, fontSize:13, fontWeight:600, zIndex:999, borderLeft:"3px solid #f97316", whiteSpace:"nowrap", boxShadow:"0 8px 32px rgba(0,0,0,0.4)" }}>
            {toast}
          </div>
        )}
      </div>
    </>
  );
}