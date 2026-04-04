"use client";
import { useAuth } from "../lib/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Seafarer = {
  id: string;
  full_name: string;
  rank: string;
  nationality: string;
  experience_years: number;
  vessel_types: string[];
  overall_rating: number;
  is_available: boolean;
  available_from: string;
  email: string;
  whatsapp: string;
  notes: string;
  total_voyages: number;
};

const RANKS = ["Captain","Chief Officer","2nd Officer","3rd Officer","Chief Engineer","2nd Engineer","3rd Engineer","4th Engineer","Bosun","AB Seaman","Electrician","Cook","Motorman"];
const VESSEL_TYPES = ["Bulk Carrier","Container Ship","Tanker","General Cargo","Ro-Ro","Offshore","LNG Carrier"];

function stars(r: number) {
  return "★".repeat(Math.round(r||0)) + "☆".repeat(5-Math.round(r||0));
}

export default function PoolPage() {
  const { checking } = useAuth();
  const [pool, setPool]         = useState<Seafarer[]>([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState<Seafarer|null>(null);
  const [search, setSearch]     = useState("");
  const [rankF, setRankF]       = useState("All");
  const [availF, setAvailF]     = useState("all");
  const [showAdd, setShowAdd]   = useState(false);
  const [toast, setToast]       = useState("");
  const [saving, setSaving]     = useState(false);
  const [showAI, setShowAI]     = useState(false);
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [selVacancy, setSelVacancy] = useState("");
  const [aiResults, setAiResults] = useState<any[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [form, setForm]         = useState({ full_name:"", rank:"", nationality:"", experience_years:"", available_from:"", email:"", whatsapp:"", notes:"" });

  async function load() {
    const { data } = await supabase.from("seafarers").select("*").order("overall_rating", { ascending:false });
    setPool(data || []);
    setLoading(false);
    const { data: vdata } = await supabase.from("vacancies").select("*").neq("status","placed");
    setVacancies(vdata || []);
  }

  useEffect(() => {
    load();
    const ch = supabase.channel("pool-live")
      .on("postgres_changes", { event:"*", schema:"public", table:"seafarers" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  async function addSeafarer() {
    if (!form.full_name || !form.rank) return;
    setSaving(true);
    await supabase.from("seafarers").insert({ ...form, experience_years: parseInt(form.experience_years)||0, is_available:true, relief_status:"unassigned", urgency_level:"on_track" });
    setForm({ full_name:"", rank:"", nationality:"", experience_years:"", available_from:"", email:"", whatsapp:"", notes:"" });
    setShowAdd(false);
    setSaving(false);
    load();
  }

  async function toggleAvailability(s: Seafarer) {
    await supabase.from("seafarers").update({ is_available: !s.is_available }).eq("id", s.id);
    setToast(`${s.full_name} marked as ${!s.is_available ? "available" : "on leave"}`);
    setTimeout(() => setToast(""), 3000);
    load();
  }

  async function runAIMatch() {
    if (!selVacancy) return;
    setAiLoading(true);
    setAiResults([]);
    const vacancy = vacancies.find(v => v.id === selVacancy);
    try {
      const res = await fetch("/api/ai/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vacancy, seafarers: pool })
      });
      const data = await res.json();
      setAiResults(data.matches || []);
    } catch(e) {
      setToast("AI matching failed. Try again.");
    }
    setAiLoading(false);
  }

  const filtered = pool.filter(s => {
    const matchSearch = s.full_name?.toLowerCase().includes(search.toLowerCase()) || s.rank?.toLowerCase().includes(search.toLowerCase()) || s.nationality?.toLowerCase().includes(search.toLowerCase());
    const matchRank   = rankF === "All" || s.rank === rankF;
    const matchAvail  = availF === "all" || (availF === "available" ? s.is_available : !s.is_available);
    return matchSearch && matchRank && matchAvail;
  });

  const stats = {
    total:     pool.length,
    available: pool.filter(s => s.is_available).length,
    onLeave:   pool.filter(s => !s.is_available).length,
    avgRating: pool.length ? (pool.reduce((a,s) => a+(s.overall_rating||0),0)/pool.length).toFixed(1) : "0.0",
  };

  const SIDEBAR = (active: string) => (
    <aside style={{ width:220, flexShrink:0, background:"#111318", borderRight:"1px solid rgba(255,255,255,0.05)", display:"flex", flexDirection:"column", position:"fixed", top:0, bottom:0, left:0, zIndex:200 }}>
      <a href="/dashboard" style={{ padding:"20px 22px 18px", borderBottom:"1px solid rgba(255,255,255,0.05)", textDecoration:"none", display:"block" }}>
        <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, letterSpacing:4, color:"#fff" }}>CREW<span style={{ color:"#f97316" }}>FLOW</span></div>
        <div style={{ fontSize:9, fontWeight:600, color:"#374151", letterSpacing:2, marginTop:2 }}>MARITIME CREW MANAGEMENT</div>
      </a>
      <nav style={{ flex:1, padding:"16px 12px", overflowY:"auto" }}>
        {[
          { section:"OVERVIEW", links:[{ href:"/dashboard", label:"Dashboard", icon:<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> }] },
          { section:"MODULES", links:[
            { href:"/relief",    label:"Relief Planning", icon:<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> },
            { href:"/pool",      label:"Seafarer Pool",   icon:<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
            { href:"/vacancies", label:"Vacancies",       icon:<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
            { href:"/checklist", label:"Pre-Joining",     icon:<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
          ]},
          { section:"AUTOMATION", links:[
            { href:"#", label:"n8n Workflows", icon:<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
            { href:"#", label:"Alert Logs",    icon:<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
          ]},
        ].map(group => (
          <div key={group.section}>
            <div style={{ fontSize:9, fontWeight:700, color:"#374151", letterSpacing:"2.5px", padding:"0 10px", margin:"16px 0 6px" }}>{group.section}</div>
            {group.links.map(l => (
              <a key={l.href + l.label} href={l.href} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 10px", borderRadius:8, fontSize:13, fontWeight:500, color: l.href===active?"#f97316":"#6b7280", background: l.href===active?"rgba(249,115,22,0.1)":"transparent", textDecoration:"none", marginBottom:2, transition:"all .15s" }}>
                {l.icon}{l.label}
              </a>
            ))}
          </div>
        ))}
      </nav>
      <div style={{ padding:"16px 12px", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:8, background:"rgba(34,197,94,0.06)", border:"1px solid rgba(34,197,94,0.12)" }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e", animation:"pulse 2s infinite" }} />
          <div>
            <div style={{ fontSize:11, fontWeight:600, color:"#22c55e" }}>All Systems Live</div>
            <div style={{ fontSize:9, color:"#374151", marginTop:1 }}>Supabase · n8n · Vercel</div>
          </div>
        </div>
      </div>
    </aside>
  );

  if (checking) return <div style={{ minHeight:"100vh", background:"#0d0e12", display:"flex", alignItems:"center", justifyContent:"center", color:"#f97316", fontFamily:"Bebas Neue", fontSize:24, letterSpacing:4 }}>LOADING...</div>;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        @keyframes slideIn{ from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        html,body { background:#0d0e12; }
        .page { font-family:'Outfit',sans-serif; background:#0d0e12; color:#e2e8f0; min-height:100vh; display:flex; }
        .btn { font-family:inherit; cursor:pointer; border:none; transition:all .15s; }
        .btn:hover { opacity:.88; transform:scale(.97); }
        input,select,textarea { font-family:inherit; outline:none; }
        input:focus,select:focus { border-color:#f97316 !important; }
        .rh:hover { background:rgba(255,255,255,0.025) !important; }
      `}</style>

      <div className="page">
        {SIDEBAR("/pool")}
        <div style={{ marginLeft:220, flex:1, minHeight:"100vh" }}>

          {/* Topbar */}
          <div style={{ background:"#111318", borderBottom:"1px solid rgba(255,255,255,0.05)", padding:"0 32px", height:56, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:14, fontWeight:700, color:"#e2e8f0" }}>Seafarer Pool</span>
              <span style={{ fontSize:11, color:"#374151" }}>/ Available Crew Roster</span>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setShowAI(true)}
                style={{ background:"rgba(249,115,22,0.1)", color:"#f97316", border:"1px solid rgba(249,115,22,0.3)", padding:"8px 18px", borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer" }}>
                🤖 AI Match
              </button>
              <button className="btn" onClick={() => setShowAdd(!showAdd)}
                style={{ background:"#f97316", color:"#fff", padding:"8px 18px", borderRadius:8, fontSize:12, fontWeight:700, boxShadow:"0 4px 12px rgba(249,115,22,.3)" }}>
                + Add Seafarer
              </button>
            </div>
          </div>

          <div style={{ padding:"24px 28px" }}>

            {/* Add form */}
            {showAdd && (
              <div style={{ background:"#111318", border:"1px solid rgba(249,115,22,0.25)", borderRadius:14, padding:20, marginBottom:20, animation:"fadeUp .25s ease" }}>
                <div style={{ fontSize:10, fontWeight:700, color:"#f97316", letterSpacing:2, marginBottom:14 }}>ADD TO POOL</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:10, marginBottom:10 }}>
                  {[
                    { key:"full_name",        ph:"Full Name *",     type:"text"   },
                    { key:"nationality",      ph:"Nationality",     type:"text"   },
                    { key:"experience_years", ph:"Years Experience",type:"number" },
                    { key:"available_from",   ph:"Available From",  type:"date"   },
                    { key:"email",            ph:"Email",           type:"email"  },
                    { key:"whatsapp",         ph:"WhatsApp",        type:"text"   },
                  ].map(f => (
                    <input key={f.key} type={f.type} placeholder={f.ph} value={(form as any)[f.key]}
                      onChange={e => setForm(p => ({...p,[f.key]:e.target.value}))}
                      style={{ background:"#0d0e12", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, padding:"9px 13px", fontSize:13, color:"#e2e8f0" }} />
                  ))}
                  <select value={form.rank} onChange={e => setForm(p=>({...p,rank:e.target.value}))}
                    style={{ background:"#0d0e12", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, padding:"9px 13px", fontSize:13, color:"#e2e8f0" }}>
                    <option value="">Select Rank *</option>
                    {RANKS.map(r => <option key={r}>{r}</option>)}
                  </select>
                  <textarea placeholder="Notes..." value={form.notes} onChange={e => setForm(p=>({...p,notes:e.target.value}))} rows={1}
                    style={{ background:"#0d0e12", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, padding:"9px 13px", fontSize:13, color:"#e2e8f0", resize:"none" }} />
                </div>
                <button className="btn" onClick={addSeafarer} disabled={saving}
                  style={{ background:"#f97316", color:"#fff", padding:"9px 22px", borderRadius:8, fontSize:12, fontWeight:700 }}>
                  {saving ? "Saving..." : "Add to Pool"}
                </button>
              </div>
            )}

            {/* Stats */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:22 }}>
              {[
                { label:"TOTAL IN POOL",  val:stats.total,          color:"#e2e8f0" },
                { label:"AVAILABLE",      val:stats.available,      color:"#22c55e" },
                { label:"ON LEAVE",       val:stats.onLeave,        color:"#f97316" },
                { label:"AVG RATING",     val:`${stats.avgRating}★`, color:"#eab308" },
              ].map((s,i) => (
                <div key={s.label} style={{ background:"#111318", border:"1px solid rgba(255,255,255,0.05)", borderRadius:12, padding:"16px 18px", animation:`fadeUp .4s ease ${i*.06}s both` }}>
                  <div style={{ fontSize:9, fontWeight:700, color:"#374151", letterSpacing:2, marginBottom:8 }}>{s.label}</div>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:40, color:s.color, lineHeight:1 }}>{s.val}</div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div style={{ display:"flex", gap:10, marginBottom:16, alignItems:"center" }}>
              <input placeholder="Search name, rank, nationality..." value={search} onChange={e=>setSearch(e.target.value)}
                style={{ background:"#111318", border:"1px solid rgba(255,255,255,0.07)", borderRadius:8, padding:"8px 14px", fontSize:13, color:"#e2e8f0", width:280 }} />
              <select value={rankF} onChange={e=>setRankF(e.target.value)}
                style={{ background:"#111318", border:"1px solid rgba(255,255,255,0.07)", borderRadius:8, padding:"8px 14px", fontSize:13, color:"#e2e8f0" }}>
                <option>All</option>
                {RANKS.map(r => <option key={r}>{r}</option>)}
              </select>
              {["all","available","on leave"].map(f => (
                <button key={f} className="btn" onClick={() => setAvailF(f)}
                  style={{ background:availF===f?"#f97316":"rgba(255,255,255,0.04)", color:availF===f?"#fff":"#6b7280", border:`1px solid ${availF===f?"#f97316":"rgba(255,255,255,0.06)"}`, padding:"7px 16px", borderRadius:20, fontSize:11, fontWeight:600, textTransform:"capitalize" }}>
                  {f}
                </button>
              ))}
            </div>

            {/* Grid */}
            {loading ? (
              <div style={{ textAlign:"center", padding:"60px 0" }}>
                <div style={{ width:28, height:28, border:"2px solid rgba(255,255,255,0.06)", borderTopColor:"#f97316", borderRadius:"50%", animation:"spin .8s linear infinite", margin:"0 auto" }} />
              </div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
                {filtered.length === 0 && (
                  <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"52px 0", color:"#374151", fontSize:14 }}>
                    No seafarers found. Add one to the pool.
                  </div>
                )}
                {filtered.map((s,i) => (
                  <div key={s.id} className="rh" onClick={() => setSelected(selected?.id===s.id?null:s)}
                    style={{ background:"#111318", border:`1px solid ${selected?.id===s.id?"rgba(249,115,22,0.4)":"rgba(255,255,255,0.05)"}`, borderRadius:14, padding:"18px 20px", cursor:"pointer", transition:"all .2s", animation:`fadeUp .4s ease ${i*.05}s both` }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                      <div>
                        <div style={{ fontSize:15, fontWeight:700, color:"#e2e8f0", marginBottom:3 }}>{s.full_name}</div>
                        <div style={{ fontSize:12, color:"#f97316", fontWeight:600 }}>{s.rank}</div>
                      </div>
                      <div style={{ width:8, height:8, borderRadius:"50%", background:s.is_available?"#22c55e":"#f97316", marginTop:4 }} />
                    </div>
                    <div style={{ fontSize:11, color:"#6b7280", marginBottom:10 }}>
                      {s.nationality || "—"} · {s.experience_years || 0}yr exp · {s.total_voyages || 0} voyages
                    </div>
                    {s.overall_rating > 0 && (
                      <div style={{ fontSize:12, color:"#eab308", marginBottom:10 }}>{stars(s.overall_rating)} {s.overall_rating}/5</div>
                    )}
                    <div style={{ display:"flex", gap:6 }}>
                      <span style={{ fontSize:10, fontWeight:700, color:s.is_available?"#22c55e":"#f97316", background:s.is_available?"rgba(34,197,94,0.1)":"rgba(249,115,22,0.1)", border:`1px solid ${s.is_available?"rgba(34,197,94,0.2)":"rgba(249,115,22,0.2)"}`, padding:"2px 9px", borderRadius:20 }}>
                        {s.is_available ? "Available" : "On Leave"}
                      </span>
                      {s.available_from && (
                        <span style={{ fontSize:10, color:"#374151", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.06)", padding:"2px 9px", borderRadius:20 }}>
                          From {new Date(s.available_from).toLocaleDateString("en-GB",{day:"2-digit",month:"short"})}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{ position:"fixed", right:0, top:0, bottom:0, width:300, background:"#111318", borderLeft:"1px solid rgba(255,255,255,0.07)", padding:24, overflowY:"auto", animation:"slideIn .22s ease", zIndex:300, boxShadow:"-12px 0 40px rgba(0,0,0,0.4)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
              <div style={{ fontSize:10, fontWeight:700, color:"#f97316", letterSpacing:2 }}>SEAFARER PROFILE</div>
              <button className="btn" onClick={() => setSelected(null)}
                style={{ background:"rgba(255,255,255,0.06)", color:"#9ca3af", width:28, height:28, borderRadius:7, fontSize:15, fontWeight:700 }}>×</button>
            </div>
            <div style={{ fontSize:20, fontWeight:800, color:"#e2e8f0", marginBottom:4 }}>{selected.full_name}</div>
            <div style={{ fontSize:13, color:"#f97316", fontWeight:600, marginBottom:20 }}>{selected.rank}</div>
            {[
              { label:"Nationality",    val:selected.nationality||"—" },
              { label:"Experience",     val:`${selected.experience_years||0} years` },
              { label:"Total Voyages",  val:selected.total_voyages||0 },
              { label:"Rating",         val:selected.overall_rating ? `${selected.overall_rating}/5` : "Not rated" },
              { label:"Status",         val:selected.is_available?"Available":"On Leave" },
              { label:"Available From", val:selected.available_from ? new Date(selected.available_from).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}) : "—" },
              { label:"Email",          val:selected.email||"—" },
              { label:"WhatsApp",       val:selected.whatsapp||"—" },
            ].map(r => (
              <div key={r.label} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ fontSize:11, color:"#374151", fontWeight:500 }}>{r.label}</span>
                <span style={{ fontSize:12, fontWeight:600, color:"#e2e8f0" }}>{r.val}</span>
              </div>
            ))}
            {selected.notes && (
              <div style={{ marginTop:16, background:"rgba(255,255,255,0.03)", borderRadius:8, padding:"10px 12px", fontSize:12, color:"#6b7280", lineHeight:1.6 }}>
                {selected.notes}
              </div>
            )}
            <button className="btn" onClick={() => toggleAvailability(selected)}
              style={{ width:"100%", marginTop:20, background: selected.is_available?"rgba(249,115,22,0.1)":"rgba(34,197,94,0.1)", color:selected.is_available?"#f97316":"#22c55e", border:`1px solid ${selected.is_available?"rgba(249,115,22,0.3)":"rgba(34,197,94,0.3)"}`, padding:"11px", borderRadius:10, fontSize:13, fontWeight:700 }}>
              {selected.is_available ? "Mark as On Leave" : "Mark as Available"}
            </button>
          </div>
        )}

        {/* AI MATCH MODAL */}
        {showAI && (
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
            <div style={{ background:"#111318", border:"1px solid rgba(249,115,22,0.2)", borderRadius:16, padding:32, width:"100%", maxWidth:520 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
                <div>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, letterSpacing:2, color:"#f97316" }}>🤖 AI CREW MATCHING</div>
                  <div style={{ fontSize:12, color:"#4b5563", marginTop:2 }}>Select a vacancy to find the best candidates</div>
                </div>
                <button onClick={() => { setShowAI(false); setAiResults([]); setSelVacancy(""); }}
                  style={{ background:"rgba(255,255,255,0.05)", border:"none", color:"#6b7280", fontSize:18, cursor:"pointer", borderRadius:8, width:32, height:32 }}>✕</button>
              </div>

              <select value={selVacancy} onChange={e => setSelVacancy(e.target.value)}
                style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"12px 16px", fontFamily:"'Outfit',sans-serif", fontSize:14, color:"#e2e8f0", outline:"none", marginBottom:16 }}>
                <option value="">-- Select a vacancy --</option>
                {vacancies.map(v => (
                  <option key={v.id} value={v.id}>{v.vessel} — {v.rank}</option>
                ))}
              </select>

              <button onClick={runAIMatch} disabled={!selVacancy || aiLoading}
                style={{ width:"100%", background: !selVacancy||aiLoading?"#7c3a16":"#f97316", color:"#fff", fontFamily:"'Outfit',sans-serif", fontSize:14, fontWeight:700, padding:12, borderRadius:10, border:"none", cursor: !selVacancy||aiLoading?"not-allowed":"pointer", marginBottom:20, boxShadow:"0 4px 16px rgba(249,115,22,0.3)" }}>
                {aiLoading ? "🤖 Analysing pool..." : "Find Best Matches →"}
              </button>

              {aiResults.length > 0 && (
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:"#374151", letterSpacing:2, marginBottom:12 }}>TOP CANDIDATES</div>
                  {aiResults.map((r, i) => (
                    <div key={i} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"14px 16px", marginBottom:10 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                        <div style={{ fontSize:14, fontWeight:700, color:"#e2e8f0" }}>
                          {i===0?"🥇":i===1?"🥈":"🥉"} {r.name}
                        </div>
                        <div style={{ background: i===0?"rgba(249,115,22,0.15)":"rgba(255,255,255,0.06)", border:`1px solid ${i===0?"rgba(249,115,22,0.3)":"rgba(255,255,255,0.1)"}`, borderRadius:20, padding:"3px 10px", fontSize:12, fontWeight:700, color: i===0?"#f97316":"#6b7280" }}>
                          {r.score}/100
                        </div>
                      </div>
                      <div style={{ fontSize:12, color:"#4b5563", lineHeight:1.6 }}>{r.reason}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {toast && (
          <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", background:"#1a1d24", color:"#e2e8f0", padding:"11px 22px", borderRadius:10, fontSize:13, fontWeight:600, zIndex:999, borderLeft:"3px solid #f97316", whiteSpace:"nowrap" }}>
            {toast}
          </div>
        )}
      </div>
    </>
  );
}