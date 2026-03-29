"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const SECTIONS = [
  {
    id:"documents", title:"Document Verification", color:"#f97316", bg:"rgba(249,115,22,0.08)", border:"rgba(249,115,22,0.2)",
    items:[
      { id:"passport",      label:"Valid Passport",                  required:true,  detail:"Min. 6 months validity beyond contract end" },
      { id:"seaman_book",   label:"Seaman's Book / CDC",             required:true,  detail:"Continuous Discharge Book — all pages intact" },
      { id:"coc",           label:"Certificate of Competency (CoC)", required:true,  detail:"Appropriate rank, endorsed for flag state" },
      { id:"stcw_basic",    label:"STCW Basic Safety Training",      required:true,  detail:"PSSR, Fire Fighting, First Aid, PSCRB" },
      { id:"stcw_advanced", label:"STCW Advanced Certificates",      required:false, detail:"ARPA, GMDSS, Tankerman, or role-specific" },
      { id:"flag_endorse",  label:"Flag State Endorsement",          required:true,  detail:"For vessels under non-national flag" },
      { id:"yellow_fever",  label:"Yellow Fever Certificate",        required:false, detail:"Required for certain trading areas" },
    ]
  },
  {
    id:"medical", title:"Pre-Joining Medical", color:"#0ea5e9", bg:"rgba(14,165,233,0.08)", border:"rgba(14,165,233,0.2)",
    items:[
      { id:"med_exam",      label:"Medical Fitness Examination",     required:true,  detail:"By approved maritime medical examiner" },
      { id:"eyesight",      label:"Eyesight & Colour Vision Test",   required:true,  detail:"Must meet STCW colour vision standards" },
      { id:"med_cert",      label:"ENG1 / PEME Medical Certificate", required:true,  detail:"Valid for the duration of contract" },
      { id:"drug_test",     label:"Drug & Alcohol Test",             required:true,  detail:"Pre-employment screening, zero tolerance" },
      { id:"fitness_decl",  label:"Fitness Declaration Form",        required:true,  detail:"Self-declared fitness signed by seafarer" },
      { id:"dental",        label:"Dental Clearance",                required:false, detail:"Recommended for voyages over 3 months" },
    ]
  },
  {
    id:"travel", title:"Travel & Visa", color:"#8b5cf6", bg:"rgba(139,92,246,0.08)", border:"rgba(139,92,246,0.2)",
    items:[
      { id:"flight",        label:"Flight Ticket Confirmed",         required:true,  detail:"Booked and sent — arrival before joining date" },
      { id:"visa",          label:"Visa / Entry Clearance",          required:true,  detail:"For port of embarkation and flag state" },
      { id:"hotel",         label:"Hotel / Transit Accommodation",   required:false, detail:"If overnight stop required before joining" },
      { id:"port_agent",    label:"Port Agent Contact Confirmed",    required:true,  detail:"Agent name, number, and meeting point sent" },
      { id:"travel_ins",    label:"Travel Insurance",                required:false, detail:"Covers transit period before P&I kicks in" },
      { id:"advance",       label:"Cash Advance (if applicable)",    required:false, detail:"Pre-voyage advance arranged and disbursed" },
    ]
  },
  {
    id:"joining", title:"Joining Instructions", color:"#22c55e", bg:"rgba(34,197,94,0.08)", border:"rgba(34,197,94,0.2)",
    items:[
      { id:"vessel_info",   label:"Vessel Details Sheet Sent",       required:true,  detail:"IMO number, flag, call sign, vessel type" },
      { id:"join_port",     label:"Embarkation Port Confirmed",      required:true,  detail:"Port, berth number, expected vessel arrival" },
      { id:"join_date",     label:"Joining Date & Time Communicated",required:true,  detail:"Exact date and time sent to seafarer and agent" },
      { id:"master_intro",  label:"Introduction to Master / CE",     required:false, detail:"Seafarer briefed on key contacts aboard" },
      { id:"induction",     label:"Induction Pack Issued",           required:true,  detail:"Company policies, SMS, emergency contacts" },
      { id:"psc",           label:"PSC Inspection Status Checked",   required:false, detail:"Vessel's recent port state control record" },
      { id:"wage_scale",    label:"Wage Scale / CBA Confirmed",      required:true,  detail:"Pay scale, allotment, and ITF/CBA info" },
    ]
  }
];

const STATUS_CFG = {
  pending:   { label:"Pending",   color:"#4b5563", bg:"rgba(75,85,99,0.1)",   border:"rgba(75,85,99,0.2)"   },
  in_review: { label:"In Review", color:"#eab308", bg:"rgba(234,179,8,0.1)",  border:"rgba(234,179,8,0.2)"  },
  approved:  { label:"Approved",  color:"#22c55e", bg:"rgba(34,197,94,0.1)",  border:"rgba(34,197,94,0.2)"  },
  rejected:  { label:"Rejected",  color:"#ef4444", bg:"rgba(239,68,68,0.1)",  border:"rgba(239,68,68,0.2)"  },
};

const SEAFARERS = [
  { id:"sf-001", name:"Ricardo Santos",      rank:"Chief Engineer", vessel:"MV Pacific Dawn",   joining:"2026-04-01" },
  { id:"sf-002", name:"Oleksandr Kovalenko", rank:"2nd Officer",    vessel:"MT Horizon",         joining:"2026-04-10" },
  { id:"sf-003", name:"Emmanuel Adeyemi",    rank:"Bosun",          vessel:"MV Nordic Carrier",  joining:"2026-05-01" },
  { id:"sf-004", name:"Rajesh Nair",         rank:"Electrician",    vessel:"OSV Pioneer",        joining:"2026-04-05" },
];

function daysTo(d: string) { return Math.ceil((new Date(d).getTime()-new Date().getTime())/86400000); }

function Ring({ pct, color, size=72, stroke=6 }: { pct:number; color:string; size?:number; stroke?:number }) {
  const r    = (size-stroke)/2;
  const circ = 2*Math.PI*r;
  return (
    <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={circ-(pct/100)*circ}
        strokeLinecap="round" style={{ transition:"stroke-dashoffset .8s ease" }} />
    </svg>
  );
}

export default function ChecklistPage() {
  const [sfId, setSfId]         = useState("sf-001");
  const [items, setItems]       = useState<Record<string,{status:string;notes:string}>>({});
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState<string|null>(null);
  const [openSec, setOpenSec]   = useState<string|null>(null);
  const [toast, setToast]       = useState("");

  const sf = SEAFARERS.find(s=>s.id===sfId);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("checklist_items").select("*").eq("seafarer_id", sfId);
    const map: Record<string,{status:string;notes:string}> = {};
    for (const row of data||[]) map[row.item_id] = { status:row.status, notes:row.notes||"" };
    setItems(map);
    setLoading(false);
  }

  useEffect(() => { load(); }, [sfId]);

  async function updateItem(itemId: string, section: string, status: string) {
    setSaving(itemId);
    setItems(p => ({ ...p, [itemId]: { ...p[itemId], status, notes:p[itemId]?.notes||"" } }));
    await supabase.from("checklist_items").upsert({ seafarer_id:sfId, item_id:itemId, section, status, notes:items[itemId]?.notes||"", updated_at:new Date().toISOString() }, { onConflict:"seafarer_id,item_id" });
    setSaving(null);
    setToast(`${status === "approved" ? "✓ Approved" : status === "rejected" ? "✗ Rejected" : "Updated"}`);
    setTimeout(() => setToast(""), 2000);
  }

  const allItems      = SECTIONS.flatMap(s=>s.items);
  const requiredItems = allItems.filter(i=>i.required);
  const approved      = (id: string) => items[id]?.status==="approved";
  const totalPct      = allItems.length ? Math.round((allItems.filter(i=>approved(i.id)).length/allItems.length)*100) : 0;
  const reqPct        = requiredItems.length ? Math.round((requiredItems.filter(i=>approved(i.id)).length/requiredItems.length)*100) : 0;
  const isCleared     = reqPct===100;
  const daysLeft      = daysTo(sf?.joining||"");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.3} }
        html,body { background:#0d0e12; }
        .page { font-family:'Outfit',sans-serif; background:#0d0e12; color:#e2e8f0; min-height:100vh; display:flex; }
        .btn { font-family:inherit; cursor:pointer; border:none; transition:all .15s; }
        .btn:hover { opacity:.88; transform:scale(.97); }
        .sbtn { font-family:inherit; cursor:pointer; transition:all .15s; border-radius:7px; font-size:11px; font-weight:600; padding:5px 11px; border:1px solid; }
        .sbtn:hover { transform:scale(.96); }
        .irow:hover { background:rgba(255,255,255,0.02) !important; }
        select,input { font-family:inherit; outline:none; }
      `}</style>

      <div className="page">
        {/* Sidebar */}
        <aside style={{ width:220, flexShrink:0, background:"#111318", borderRight:"1px solid rgba(255,255,255,0.05)", display:"flex", flexDirection:"column", position:"fixed", top:0, bottom:0, left:0, zIndex:200 }}>
          <a href="/" style={{ padding:"20px 22px 18px", borderBottom:"1px solid rgba(255,255,255,0.05)", textDecoration:"none", display:"block" }}>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, letterSpacing:4, color:"#fff" }}>CREW<span style={{color:"#f97316"}}>FLOW</span></div>
            <div style={{ fontSize:9, fontWeight:600, color:"#374151", letterSpacing:2, marginTop:2 }}>MARITIME CREW MANAGEMENT</div>
          </a>
          <nav style={{ flex:1, padding:"16px 12px" }}>
            {[
              { section:"OVERVIEW",   links:[{href:"/",label:"Dashboard",icon:"⊞"}] },
              { section:"MODULES",    links:[{href:"/relief",label:"Relief Planning",icon:"◷"},{href:"/pool",label:"Seafarer Pool",icon:"◎"},{href:"/vacancies",label:"Vacancies",icon:"▤"},{href:"/checklist",label:"Pre-Joining",icon:"✓"}] },
              { section:"AUTOMATION", links:[{href:"#",label:"n8n Workflows",icon:"⚡"},{href:"#",label:"Alert Logs",icon:"▦"}] },
            ].map(g => (
              <div key={g.section}>
                <div style={{ fontSize:9, fontWeight:700, color:"#374151", letterSpacing:"2.5px", padding:"0 10px", margin:"16px 0 6px" }}>{g.section}</div>
                {g.links.map(l => (
                  <a key={l.href + l.label} href={l.href} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 10px", borderRadius:8, fontSize:13, fontWeight:500, color:l.href==="/checklist"?"#f97316":"#6b7280", background:l.href==="/checklist"?"rgba(249,115,22,0.1)":"transparent", textDecoration:"none", marginBottom:2, transition:"all .15s" }}>
                    <span style={{ fontSize:14, width:18, textAlign:"center" }}>{l.icon}</span>{l.label}
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

        <div style={{ marginLeft:220, flex:1, minHeight:"100vh" }}>

          {/* Topbar */}
          <div style={{ background:"#111318", borderBottom:"1px solid rgba(255,255,255,0.05)", padding:"0 32px", height:56, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
            <div style={{ display:"flex", alignItems:"center", gap:16 }}>
              <span style={{ fontSize:14, fontWeight:700, color:"#e2e8f0" }}>Pre-Joining Checklist</span>
              <select value={sfId} onChange={e=>setSfId(e.target.value)}
                style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, padding:"5px 12px", fontSize:12, color:"#e2e8f0" }}>
                {SEAFARERS.map(s=><option key={s.id} value={s.id}>{s.name} — {s.rank}</option>)}
              </select>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ background:isCleared?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)", border:`1px solid ${isCleared?"rgba(34,197,94,0.3)":"rgba(239,68,68,0.3)"}`, borderRadius:8, padding:"5px 14px", fontSize:12, fontWeight:700, color:isCleared?"#22c55e":"#ef4444" }}>
                {isCleared?"✓ CLEARED TO JOIN":"⚠ NOT YET CLEARED"}
              </div>
            </div>
          </div>

          <div style={{ padding:"24px 28px" }}>

            {/* Hero card */}
            <div style={{ background:"#111318", border:"1px solid rgba(255,255,255,0.05)", borderRadius:16, padding:"24px 28px", marginBottom:22, display:"grid", gridTemplateColumns:"1fr auto", gap:24, alignItems:"center", animation:"fadeUp .4s ease" }}>
              <div>
                <div style={{ fontSize:10, fontWeight:700, color:"#374151", letterSpacing:2, marginBottom:8 }}>JOINING FILE</div>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:32, color:"#e2e8f0", letterSpacing:1, marginBottom:4 }}>{sf?.name}</div>
                <div style={{ fontSize:14, color:"#f97316", fontWeight:600, marginBottom:16 }}>{sf?.rank}</div>
                <div style={{ display:"flex", gap:24 }}>
                  <div><div style={{ fontSize:9, color:"#374151", fontWeight:700, letterSpacing:2 }}>VESSEL</div><div style={{ fontSize:13, color:"#e2e8f0", fontWeight:600, marginTop:2 }}>⚓ {sf?.vessel}</div></div>
                  <div><div style={{ fontSize:9, color:"#374151", fontWeight:700, letterSpacing:2 }}>JOINING</div><div style={{ fontSize:13, color:"#e2e8f0", fontWeight:600, marginTop:2 }}>{sf?.joining ? new Date(sf.joining).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}) : "—"}</div></div>
                  <div><div style={{ fontSize:9, color:"#374151", fontWeight:700, letterSpacing:2 }}>DAYS LEFT</div><div style={{ fontSize:13, fontWeight:700, color:daysLeft<=7?"#ef4444":daysLeft<=14?"#f97316":"#22c55e", marginTop:2 }}>{daysLeft}d</div></div>
                </div>
              </div>
              <div style={{ display:"flex", gap:20, alignItems:"center" }}>
                <div style={{ textAlign:"center" }}>
                  <div style={{ position:"relative", display:"inline-block" }}>
                    <Ring pct={reqPct} color={isCleared?"#22c55e":"#f97316"} size={80} stroke={7} />
                    <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <span style={{ fontSize:16, fontWeight:900, color:"#e2e8f0" }}>{reqPct}%</span>
                    </div>
                  </div>
                  <div style={{ fontSize:9, color:"#374151", fontWeight:700, letterSpacing:2, marginTop:6 }}>REQUIRED</div>
                </div>
                <div style={{ textAlign:"center" }}>
                  <div style={{ position:"relative", display:"inline-block" }}>
                    <Ring pct={totalPct} color="#3b82f6" size={80} stroke={7} />
                    <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <span style={{ fontSize:16, fontWeight:900, color:"#e2e8f0" }}>{totalPct}%</span>
                    </div>
                  </div>
                  <div style={{ fontSize:9, color:"#374151", fontWeight:700, letterSpacing:2, marginTop:6 }}>OVERALL</div>
                </div>
              </div>
            </div>

            {/* Section cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:22 }}>
              {SECTIONS.map((s,i) => {
                const done  = s.items.filter(item=>approved(item.id)).length;
                const pct   = Math.round((done/s.items.length)*100);
                return (
                  <div key={s.id} onClick={() => setOpenSec(openSec===s.id?null:s.id)}
                    style={{ background:openSec===s.id?s.bg:"#111318", border:`1px solid ${openSec===s.id?s.border:"rgba(255,255,255,0.05)"}`, borderRadius:12, padding:"16px 18px", cursor:"pointer", transition:"all .2s", animation:`fadeUp .4s ease ${i*.07}s both` }}>
                    <div style={{ fontSize:11, fontWeight:700, color:s.color, marginBottom:8 }}>{s.title}</div>
                    <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:36, color:s.color, lineHeight:1 }}>{done}<span style={{ fontSize:16, color:"#374151" }}>/{s.items.length}</span></div>
                    <div style={{ height:3, background:"rgba(255,255,255,0.05)", borderRadius:2, marginTop:10 }}>
                      <div style={{ height:"100%", width:`${pct}%`, background:pct===100?"#22c55e":s.color, borderRadius:2, transition:"width .8s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Checklist sections */}
            {loading ? (
              <div style={{ textAlign:"center", padding:"48px 0" }}>
                <div style={{ width:28, height:28, border:"2px solid rgba(255,255,255,0.06)", borderTopColor:"#f97316", borderRadius:"50%", animation:"spin .8s linear infinite", margin:"0 auto" }} />
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {SECTIONS.map(section => {
                  const isOpen = openSec===section.id || openSec===null;
                  const done   = section.items.filter(i=>approved(i.id)).length;
                  return (
                    <div key={section.id} style={{ background:"#111318", border:`1px solid ${openSec===section.id?section.border:"rgba(255,255,255,0.05)"}`, borderRadius:14, overflow:"hidden", animation:"fadeUp .4s ease" }}>
                      <div onClick={() => setOpenSec(openSec===section.id?null:section.id)}
                        style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 22px", cursor:"pointer", background:openSec===section.id?section.bg:"transparent" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                          <div style={{ width:36, height:36, borderRadius:10, background:section.bg, border:`1px solid ${section.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>
                            {section.id==="documents"?"📄":section.id==="medical"?"🏥":section.id==="travel"?"✈️":"⚓"}
                          </div>
                          <div>
                            <div style={{ fontSize:14, fontWeight:700, color:"#e2e8f0" }}>{section.title}</div>
                            <div style={{ fontSize:11, color:"#374151", marginTop:2 }}>{done} of {section.items.length} approved</div>
                          </div>
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                          <div style={{ position:"relative", display:"inline-block" }}>
                            <Ring pct={Math.round((done/section.items.length)*100)} color={done===section.items.length?"#22c55e":section.color} size={36} stroke={3} />
                            <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                              <span style={{ fontSize:9, fontWeight:800, color:"#e2e8f0" }}>{Math.round((done/section.items.length)*100)}%</span>
                            </div>
                          </div>
                          <span style={{ color:"#374151", transition:"transform .2s", display:"inline-block", transform:isOpen?"rotate(180deg)":"rotate(0)" }}>▾</span>
                        </div>
                      </div>

                      {isOpen && section.items.map((item,ii) => {
                        const state = items[item.id] || { status:"pending", notes:"" };
                        const cfg   = STATUS_CFG[state.status as keyof typeof STATUS_CFG] || STATUS_CFG.pending;
                        return (
                          <div key={item.id} className="irow"
                            style={{ padding:"14px 22px", borderTop:"1px solid rgba(255,255,255,0.03)", background:"transparent", display:"grid", gridTemplateColumns:"auto 1fr auto", gap:14, alignItems:"center", animation:`fadeUp .25s ease ${ii*.04}s both` }}>
                            <div style={{ width:10, height:10, borderRadius:"50%", background:cfg.color, flexShrink:0, boxShadow:state.status==="approved"?`0 0 0 3px rgba(34,197,94,0.15)`:undefined }} />
                            <div>
                              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                                <span style={{ fontSize:13, fontWeight:600, color:"#e2e8f0" }}>{item.label}</span>
                                {item.required && <span style={{ fontSize:9, fontWeight:700, color:"#ef4444", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", padding:"1px 6px", borderRadius:4 }}>REQ</span>}
                                {saving===item.id && <div style={{ width:12, height:12, border:"2px solid rgba(255,255,255,0.06)", borderTopColor:section.color, borderRadius:"50%", animation:"spin .6s linear infinite" }} />}
                              </div>
                              <div style={{ fontSize:11, color:"#374151" }}>{item.detail}</div>
                            </div>
                            <div style={{ display:"flex", gap:5 }}>
                              {Object.entries(STATUS_CFG).map(([s,c]) => (
                                <button key={s} className="sbtn" onClick={() => updateItem(item.id, section.id, s)}
                                  style={{ background:state.status===s?c.bg:"transparent", color:state.status===s?c.color:"#374151", borderColor:state.status===s?c.border:"rgba(255,255,255,0.06)", fontWeight:state.status===s?700:400 }}>
                                  {c.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom bar */}
            {!loading && (
              <div style={{ marginTop:20, background:"#111318", border:"1px solid rgba(255,255,255,0.05)", borderRadius:14, padding:"18px 24px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ display:"flex", gap:28 }}>
                  {[
                    { label:"Total Items",  val:allItems.length,                                             color:"#e2e8f0" },
                    { label:"Approved",     val:allItems.filter(i=>approved(i.id)).length,                  color:"#22c55e" },
                    { label:"In Review",    val:allItems.filter(i=>items[i.id]?.status==="in_review").length,color:"#eab308" },
                    { label:"Pending",      val:allItems.filter(i=>!items[i.id]||items[i.id]?.status==="pending").length, color:"#374151" },
                  ].map(s => (
                    <div key={s.label}>
                      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:32, color:s.color, lineHeight:1 }}>{s.val}</div>
                      <div style={{ fontSize:10, color:"#374151", fontWeight:600, marginTop:4 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <button className="btn"
                  style={{ background:isCleared?"linear-gradient(135deg,#16a34a,#22c55e)":"rgba(255,255,255,0.04)", color:isCleared?"#fff":"#374151", padding:"12px 28px", borderRadius:10, fontSize:13, fontWeight:700, border:isCleared?"none":"1px solid rgba(255,255,255,0.06)", boxShadow:isCleared?"0 4px 20px rgba(34,197,94,0.3)":undefined, cursor:isCleared?"pointer":"default" }}>
                  {isCleared ? "✓ Issue Join Clearance" : "Checklist Incomplete"}
                </button>
              </div>
            )}
          </div>
        </div>

        {toast && (
          <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", background:"#1a1d24", color:"#e2e8f0", padding:"11px 22px", borderRadius:10, fontSize:13, fontWeight:600, zIndex:999, borderLeft:"3px solid #f97316", whiteSpace:"nowrap" }}>
            {toast}
          </div>
        )}
      </div>
    </>
  );
}