"use client";
import { useAuth } from "../lib/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Vacancy = {
  id: string;
  rank: string;
  vessel: string;
  vessel_type: string;
  flag: string;
  port: string;
  joining_date: string;
  deadline: string;
  salary_usd: number;
  contract_months: number;
  status: string;
  candidates: number;
  priority: string;
  owner: string;
  placed_name: string;
};

const STAGES     = ["open","screening","interviewing","placed"];
const STAGE_LABELS = { open:"Open", screening:"Screening", interviewing:"Interview", placed:"Placed" };
const STAGE_COLOR  = {
  open:         { color:"#60a5fa", bg:"rgba(96,165,250,0.1)",  border:"rgba(96,165,250,0.2)"  },
  screening:    { color:"#eab308", bg:"rgba(234,179,8,0.1)",   border:"rgba(234,179,8,0.2)"   },
  interviewing: { color:"#a78bfa", bg:"rgba(167,139,250,0.1)", border:"rgba(167,139,250,0.2)" },
  placed:       { color:"#22c55e", bg:"rgba(34,197,94,0.1)",   border:"rgba(34,197,94,0.2)"   },
};

function daysLeft(d: string) { return Math.ceil((new Date(d).getTime()-new Date().getTime())/86400000); }
function fmt(d: string) { return d ? new Date(d).toLocaleDateString("en-GB",{day:"2-digit",month:"short"}) : "—"; }

const SidebarNav = ({ active }: { active: string }) => (
  <aside style={{ width:220, flexShrink:0, background:"#111318", borderRight:"1px solid rgba(255,255,255,0.05)", display:"flex", flexDirection:"column", position:"fixed", top:0, bottom:0, left:0, zIndex:200 }}>
    <a href="/" style={{ padding:"20px 22px 18px", borderBottom:"1px solid rgba(255,255,255,0.05)", textDecoration:"none", display:"block" }}>
      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, letterSpacing:4, color:"#fff" }}>CREW<span style={{color:"#f97316"}}>FLOW</span></div>
      <div style={{ fontSize:9, fontWeight:600, color:"#374151", letterSpacing:2, marginTop:2 }}>MARITIME CREW MANAGEMENT</div>
    </a>
    <nav style={{ flex:1, padding:"16px 12px" }}>
      {[
        { section:"OVERVIEW",    links:[{ href:"/",          label:"Dashboard",      icon:"⊞" }] },
        { section:"MODULES",     links:[{ href:"/relief",    label:"Relief Planning", icon:"◷" },{ href:"/pool",      label:"Seafarer Pool",   icon:"◎" },{ href:"/vacancies", label:"Vacancies",       icon:"▤" },{ href:"/checklist", label:"Pre-Joining",     icon:"✓" }] },
        { section:"AUTOMATION",  links:[{ href:"#",          label:"n8n Workflows",  icon:"⚡" },{ href:"#",          label:"Alert Logs",      icon:"▦" }] },
      ].map(g => (
        <div key={g.section}>
          <div style={{ fontSize:9, fontWeight:700, color:"#374151", letterSpacing:"2.5px", padding:"0 10px", margin:"16px 0 6px" }}>{g.section}</div>
          {g.links.map(l => (
            <a key={l.href + l.label} href={l.href} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 10px", borderRadius:8, fontSize:13, fontWeight:500, color:l.href===active?"#f97316":"#6b7280", background:l.href===active?"rgba(249,115,22,0.1)":"transparent", textDecoration:"none", marginBottom:2, transition:"all .15s" }}>
              <span style={{ fontSize:14, width:18, textAlign:"center" }}>{l.icon}</span>{l.label}
            </a>
          ))}
        </div>
      ))}
    </nav>
    <div style={{ padding:"16px 12px", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:8, background:"rgba(34,197,94,0.06)", border:"1px solid rgba(34,197,94,0.12)" }}>
        <div style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e" }} />
        <div>
          <div style={{ fontSize:11, fontWeight:600, color:"#22c55e" }}>All Systems Live</div>
          <div style={{ fontSize:9, color:"#374151", marginTop:1 }}>Supabase · n8n · Vercel</div>
        </div>
      </div>
    </div>
  </aside>
);

export default function VacanciesPage() {
  const { checking } = useAuth();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState<Vacancy|null>(null);
  const [dragId, setDragId]       = useState<string|null>(null);
  const [dragOver, setDragOver]   = useState<string|null>(null);
  const [showAdd, setShowAdd]     = useState(false);
  const [toast, setToast]         = useState("");
  const [saving, setSaving]       = useState(false);
  const [view, setView]           = useState<"board"|"list">("board");
  const [form, setForm]           = useState({ rank:"", vessel:"", vessel_type:"", port:"", salary_usd:"", contract_months:"3", joining_date:"", deadline:"", owner:"", priority:"normal" });

  async function load() {
    const { data } = await supabase.from("vacancies").select("*").order("created_at", { ascending:false });
    setVacancies(data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    const ch = supabase.channel("vacancies-live")
      .on("postgres_changes", { event:"*", schema:"public", table:"vacancies" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  async function moveStage(id: string, status: string) {
    setVacancies(vs => vs.map(v => v.id===id ? {...v,status} : v));
    await supabase.from("vacancies").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    if (selected?.id === id) setSelected(s => s ? {...s, status} : s);
  }

  async function postVacancy() {
    if (!form.rank || !form.vessel) return;
    setSaving(true);
    await supabase.from("vacancies").insert({ ...form, salary_usd:parseInt(form.salary_usd)||0, contract_months:parseInt(form.contract_months)||3, candidates:0, status:"open" });
    setForm({ rank:"", vessel:"", vessel_type:"", port:"", salary_usd:"", contract_months:"3", joining_date:"", deadline:"", owner:"", priority:"normal" });
    setShowAdd(false);
    setSaving(false);
    setToast("Vacancy posted!");
    setTimeout(() => setToast(""), 3000);
  }

  const stats = {
    total:   vacancies.length,
    open:    vacancies.filter(v=>v.status!=="placed").length,
    placed:  vacancies.filter(v=>v.status==="placed").length,
    urgent:  vacancies.filter(v=>v.priority==="urgent"&&v.status!=="placed").length,
    pipeline: vacancies.filter(v=>v.status!=="placed").reduce((a,v)=>a+(v.salary_usd||0),0),
  };

  if (checking) return <div style={{ minHeight:"100vh", background:"#0d0e12", display:"flex", alignItems:"center", justifyContent:"center", color:"#f97316", fontFamily:"Bebas Neue", fontSize:24, letterSpacing:4 }}>LOADING...</div>;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        html,body { background:#0d0e12; }
        .page { font-family:'Outfit',sans-serif; background:#0d0e12; color:#e2e8f0; min-height:100vh; display:flex; }
        .btn { font-family:inherit; cursor:pointer; border:none; transition:all .15s; }
        .btn:hover { opacity:.88; transform:scale(.97); }
        input,select { font-family:inherit; outline:none; }
        input:focus,select:focus { border-color:#f97316 !important; }
        .rh { transition:background .15s; }
        .rh:hover { background:rgba(255,255,255,0.025) !important; }
        .col.over { background:rgba(249,115,22,0.04) !important; border-color:rgba(249,115,22,0.25) !important; }
        .vcard { transition:border-color .2s, transform .2s; }
        .vcard:hover { border-color:rgba(249,115,22,0.35) !important; transform:translateY(-2px); }
      `}</style>

      <div className="page">
        <SidebarNav active="/vacancies" />
        <div style={{ marginLeft:220, flex:1, minHeight:"100vh" }}>

          {/* Topbar */}
          <div style={{ background:"#111318", borderBottom:"1px solid rgba(255,255,255,0.05)", padding:"0 32px", height:56, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
            <div style={{ display:"flex", alignItems:"center", gap:16 }}>
              <span style={{ fontSize:14, fontWeight:700, color:"#e2e8f0" }}>Vacancy Pipeline</span>
              <div style={{ display:"flex", gap:4, background:"rgba(255,255,255,0.04)", borderRadius:8, padding:3 }}>
                {(["board","list"] as const).map(v => (
                  <button key={v} className="btn" onClick={() => setView(v)}
                    style={{ background:view===v?"#f97316":"transparent", color:view===v?"#fff":"#6b7280", padding:"4px 14px", borderRadius:6, fontSize:11, fontWeight:600, textTransform:"capitalize" }}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <button className="btn" onClick={() => setShowAdd(!showAdd)}
              style={{ background:"#f97316", color:"#fff", padding:"8px 18px", borderRadius:8, fontSize:12, fontWeight:700, boxShadow:"0 4px 12px rgba(249,115,22,.3)" }}>
              + Post Vacancy
            </button>
          </div>

          <div style={{ padding:"24px 28px" }}>

            {/* Add form */}
            {showAdd && (
              <div style={{ background:"#111318", border:"1px solid rgba(249,115,22,0.25)", borderRadius:14, padding:20, marginBottom:20, animation:"fadeUp .25s ease" }}>
                <div style={{ fontSize:10, fontWeight:700, color:"#f97316", letterSpacing:2, marginBottom:14 }}>POST NEW VACANCY</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr", gap:10, marginBottom:10 }}>
                  {[
                    { key:"rank",     ph:"Rank *",         type:"text"   },
                    { key:"vessel",   ph:"Vessel Name *",  type:"text"   },
                    { key:"port",     ph:"Port of Joining",type:"text"   },
                    { key:"salary_usd",ph:"Salary USD/mo", type:"number" },
                    { key:"owner",    ph:"Shipowner",      type:"text"   },
                  ].map(f => (
                    <input key={f.key} type={f.type} placeholder={f.ph} value={(form as any)[f.key]}
                      onChange={e => setForm(p=>({...p,[f.key]:e.target.value}))}
                      style={{ background:"#0d0e12", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, padding:"9px 13px", fontSize:13, color:"#e2e8f0" }} />
                  ))}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr auto", gap:10 }}>
                  <input type="date" value={form.joining_date} onChange={e=>setForm(p=>({...p,joining_date:e.target.value}))}
                    style={{ background:"#0d0e12", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, padding:"9px 13px", fontSize:13, color:"#e2e8f0" }} />
                  <input type="date" value={form.deadline} onChange={e=>setForm(p=>({...p,deadline:e.target.value}))}
                    style={{ background:"#0d0e12", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, padding:"9px 13px", fontSize:13, color:"#e2e8f0" }} />
                  <select value={form.vessel_type} onChange={e=>setForm(p=>({...p,vessel_type:e.target.value}))}
                    style={{ background:"#0d0e12", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, padding:"9px 13px", fontSize:13, color:"#e2e8f0" }}>
                    <option value="">Vessel Type</option>
                    {["Bulk Carrier","Container Ship","Tanker","General Cargo","Ro-Ro","Offshore"].map(t=><option key={t}>{t}</option>)}
                  </select>
                  <select value={form.priority} onChange={e=>setForm(p=>({...p,priority:e.target.value}))}
                    style={{ background:"#0d0e12", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, padding:"9px 13px", fontSize:13, color:"#e2e8f0" }}>
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                    <option value="low">Low</option>
                  </select>
                  <button className="btn" onClick={postVacancy} disabled={saving}
                    style={{ background:"#f97316", color:"#fff", borderRadius:8, padding:"0 22px", fontSize:12, fontWeight:700 }}>
                    {saving?"Posting...":"Post"}
                  </button>
                </div>
              </div>
            )}

            {/* Stats */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginBottom:22 }}>
              {[
                { label:"TOTAL",         val:stats.total,                                  color:"#e2e8f0" },
                { label:"OPEN",          val:stats.open,                                   color:"#60a5fa" },
                { label:"FILLED",        val:stats.placed,                                 color:"#22c55e" },
                { label:"URGENT",        val:stats.urgent,                                 color:"#ef4444" },
                { label:"PIPELINE/MO",   val:`$${Math.round(stats.pipeline/1000)}K`,       color:"#a78bfa" },
              ].map((s,i) => (
                <div key={s.label} style={{ background:"#111318", border:"1px solid rgba(255,255,255,0.05)", borderRadius:12, padding:"16px 18px", animation:`fadeUp .4s ease ${i*.06}s both` }}>
                  <div style={{ fontSize:9, fontWeight:700, color:"#374151", letterSpacing:2, marginBottom:8 }}>{s.label}</div>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:36, color:s.color, lineHeight:1 }}>{s.val}</div>
                </div>
              ))}
            </div>

            {/* BOARD */}
            {view==="board" && (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
                {STAGES.map(stage => {
                  const c     = STAGE_COLOR[stage as keyof typeof STAGE_COLOR];
                  const items = vacancies.filter(v=>v.status===stage);
                  const isOver= dragOver===stage;
                  return (
                    <div key={stage} className={`col ${isOver?"over":""}`}
                      onDragOver={e=>{e.preventDefault();setDragOver(stage);}}
                      onDragLeave={()=>setDragOver(null)}
                      onDrop={e=>{e.preventDefault();if(dragId)moveStage(dragId,stage);setDragOver(null);setDragId(null);}}
                      style={{ background:"#111318", border:"1px solid rgba(255,255,255,0.05)", borderRadius:14, padding:14, minHeight:400, transition:"all .15s" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                          <div style={{ width:7, height:7, borderRadius:"50%", background:c.color }} />
                          <span style={{ fontSize:11, fontWeight:700, color:c.color, letterSpacing:1 }}>{(STAGE_LABELS as any)[stage].toUpperCase()}</span>
                        </div>
                        <span style={{ fontSize:11, fontWeight:700, color:c.color, background:c.bg, border:`1px solid ${c.border}`, padding:"2px 9px", borderRadius:20 }}>{items.length}</span>
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                        {items.map(v => {
                          const d = daysLeft(v.deadline);
                          const dc = d<=3?"#ef4444":d<=7?"#f97316":"#4b5563";
                          return (
                            <div key={v.id} className="vcard"
                              draggable onDragStart={()=>setDragId(v.id)} onDragEnd={()=>setDragId(null)}
                              onClick={() => setSelected(selected?.id===v.id?null:v)}
                              style={{ background:selected?.id===v.id?"rgba(249,115,22,0.06)":"#0d0e12", border:`1px solid ${selected?.id===v.id?"rgba(249,115,22,0.3)":"rgba(255,255,255,0.04)"}`, borderRadius:10, padding:"14px 15px", cursor:"grab" }}>
                              {v.priority==="urgent" && <div style={{ fontSize:9, fontWeight:700, color:"#ef4444", letterSpacing:2, marginBottom:6 }}>● URGENT</div>}
                              <div style={{ fontSize:14, fontWeight:700, color:"#e2e8f0", marginBottom:2 }}>{v.rank}</div>
                              <div style={{ fontSize:11, color:"#f97316", fontWeight:600, marginBottom:6 }}>⚓ {v.vessel}</div>
                              <div style={{ fontSize:10, color:"#4b5563", marginBottom:10 }}>{v.vessel_type} · {v.port}</div>
                              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
                                <div>
                                  <div style={{ fontSize:15, fontWeight:800, color:"#e2e8f0" }}>${(v.salary_usd||0).toLocaleString()}<span style={{ fontSize:10, color:"#4b5563" }}>/mo</span></div>
                                  <div style={{ fontSize:10, color:"#4b5563", marginTop:2 }}>Join {fmt(v.joining_date)} · {v.contract_months}mo</div>
                                </div>
                                <div style={{ textAlign:"right" }}>
                                  <div style={{ fontSize:14, fontWeight:800, color:dc }}>{!v.deadline?"—":d<=0?"DUE":`${d}d`}</div>
                                  <div style={{ fontSize:9, color:"#374151" }}>deadline</div>
                                </div>
                              </div>
                              <div style={{ marginTop:10, paddingTop:10, borderTop:"1px solid rgba(255,255,255,0.04)", fontSize:10, color:"#4b5563" }}>
                                {v.candidates||0} candidate{v.candidates!==1?"s":""}
                                {v.placed_name && <span style={{ color:"#22c55e", marginLeft:8 }}>✓ {v.placed_name}</span>}
                              </div>
                            </div>
                          );
                        })}
                        {items.length===0 && (
                          <div style={{ textAlign:"center", padding:"32px 0", color:"#1f2937", fontSize:12, border:"1px dashed rgba(255,255,255,0.04)", borderRadius:8 }}>Drop here</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* LIST */}
            {view==="list" && (
              <div style={{ background:"#111318", border:"1px solid rgba(255,255,255,0.05)", borderRadius:14, overflow:"hidden" }}>
                <div style={{ display:"grid", gridTemplateColumns:"2fr 2fr 1.2fr 1fr 1fr 1fr 1fr", background:"rgba(255,255,255,0.02)", padding:"11px 20px", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                  {["RANK","VESSEL","STATUS","SALARY","CANDIDATES","DEADLINE","PRIORITY"].map(h=>(
                    <div key={h} style={{ fontSize:10, fontWeight:700, color:"#374151", letterSpacing:1.5 }}>{h}</div>
                  ))}
                </div>
                {loading ? (
                  <div style={{ textAlign:"center", padding:"40px 0" }}>
                    <div style={{ width:24, height:24, border:"2px solid rgba(255,255,255,0.06)", borderTopColor:"#f97316", borderRadius:"50%", animation:"spin .8s linear infinite", margin:"0 auto" }} />
                  </div>
                ) : vacancies.map((v,i) => {
                  const c = STAGE_COLOR[v.status as keyof typeof STAGE_COLOR]||STAGE_COLOR.open;
                  const d = daysLeft(v.deadline);
                  return (
                    <div key={v.id} className="rh" onClick={()=>setSelected(selected?.id===v.id?null:v)}
                      style={{ display:"grid", gridTemplateColumns:"2fr 2fr 1.2fr 1fr 1fr 1fr 1fr", padding:"13px 20px", borderBottom:"1px solid rgba(255,255,255,0.03)", background:"transparent", cursor:"pointer", animation:`fadeUp .3s ease ${i*.03}s both` }}>
                      <div style={{ fontWeight:600, fontSize:14, color:"#e2e8f0" }}>{v.rank}</div>
                      <div style={{ fontSize:12, color:"#6b7280" }}>{v.vessel}</div>
                      <div><span style={{ fontSize:10, fontWeight:700, color:c.color, background:c.bg, border:`1px solid ${c.border}`, padding:"3px 9px", borderRadius:20 }}>{v.status}</span></div>
                      <div style={{ fontSize:13, fontWeight:700, color:"#e2e8f0" }}>${(v.salary_usd||0).toLocaleString()}</div>
                      <div style={{ fontSize:13, color:"#6b7280" }}>{v.candidates||0}</div>
                      <div style={{ fontSize:13, fontWeight:700, color:d<=3?"#ef4444":d<=7?"#f97316":"#6b7280" }}>{!v.deadline?"—":d<=0?"OVERDUE":`${d}d`}</div>
                      <div style={{ fontSize:11, fontWeight:700, color:v.priority==="urgent"?"#ef4444":"#4b5563" }}>{(v.priority||"normal").toUpperCase()}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{ position:"fixed", right:0, top:0, bottom:0, width:300, background:"#111318", borderLeft:"1px solid rgba(255,255,255,0.07)", padding:24, overflowY:"auto", zIndex:300, boxShadow:"-12px 0 40px rgba(0,0,0,0.4)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <div style={{ fontSize:10, fontWeight:700, color:"#f97316", letterSpacing:2 }}>VACANCY DETAIL</div>
              <button className="btn" onClick={()=>setSelected(null)} style={{ background:"rgba(255,255,255,0.06)", color:"#9ca3af", width:28, height:28, borderRadius:7, fontSize:15, fontWeight:700 }}>×</button>
            </div>
            <div style={{ fontSize:20, fontWeight:800, color:"#e2e8f0", marginBottom:2 }}>{selected.rank}</div>
            <div style={{ fontSize:13, color:"#f97316", fontWeight:600, marginBottom:20 }}>⚓ {selected.vessel}</div>
            <div style={{ background:"rgba(249,115,22,0.08)", border:"1px solid rgba(249,115,22,0.15)", borderRadius:10, padding:"12px 14px", marginBottom:20 }}>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:28, color:"#f97316" }}>${(selected.salary_usd||0).toLocaleString()}<span style={{ fontSize:13, color:"#4b5563", fontFamily:"'Outfit',sans-serif" }}>/mo</span></div>
              <div style={{ fontSize:11, color:"#4b5563", marginTop:2 }}>{selected.contract_months} month contract</div>
            </div>
            {[
              { label:"Vessel Type",   val:selected.vessel_type||"—" },
              { label:"Port",          val:selected.port||"—" },
              { label:"Joining Date",  val:fmt(selected.joining_date) },
              { label:"Deadline",      val:fmt(selected.deadline) },
              { label:"Shipowner",     val:selected.owner||"—" },
              { label:"Candidates",    val:selected.candidates||0 },
              { label:"Priority",      val:(selected.priority||"normal").toUpperCase() },
            ].map(r => (
              <div key={r.label} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ fontSize:11, color:"#374151" }}>{r.label}</span>
                <span style={{ fontSize:12, fontWeight:600, color:"#e2e8f0" }}>{r.val}</span>
              </div>
            ))}
            <div style={{ marginTop:18 }}>
              <div style={{ fontSize:10, fontWeight:700, color:"#374151", letterSpacing:2, marginBottom:10 }}>MOVE STAGE</div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {STAGES.map(stage => {
                  const c = STAGE_COLOR[stage as keyof typeof STAGE_COLOR];
                  const active = selected.status===stage;
                  return (
                    <button key={stage} className="btn" onClick={()=>moveStage(selected.id,stage)}
                      style={{ background:active?c.bg:"rgba(255,255,255,0.03)", color:active?c.color:"#4b5563", border:`1px solid ${active?c.border:"rgba(255,255,255,0.06)"}`, padding:"9px 14px", borderRadius:8, fontSize:12, fontWeight:active?700:500, textAlign:"left" }}>
                      {active?"● ":""}{(STAGE_LABELS as any)[stage]}
                    </button>
                  );
                })}
              </div>
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