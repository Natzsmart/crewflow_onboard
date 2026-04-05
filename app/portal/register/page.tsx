"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";

const RANKS = ["Captain","Chief Officer","2nd Officer","3rd Officer","Chief Engineer","2nd Engineer","3rd Engineer","4th Engineer","Bosun","AB Seaman","Electrician","Cook","Motorman"];
const NATIONALITIES = ["Nigerian","Ghanaian","South African","Kenyan","Filipino","Indian","Ukrainian","Russian","Polish","Croatian"];

export default function RegisterPage() {
  const [step, setStep]         = useState(1);
  const [saving, setSaving]     = useState(false);
  const [done, setDone]         = useState(false);
  const [error, setError]       = useState("");
  const [form, setForm]         = useState({
    full_name:"", rank:"", nationality:"", age:"", experience_years:"",
    email:"", whatsapp:"", telegram_id:"",
    available_from:"", notes:""
  });

  function update(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function submit() {
    if (!form.full_name || !form.rank || !form.email) {
      setError("Full name, rank and email are required");
      return;
    }
    setSaving(true);
    setError("");
    const { error } = await supabase.from("seafarers").insert({
      full_name: form.full_name,
      rank: form.rank,
      nationality: form.nationality || null,
      age: form.age ? parseInt(form.age) : null,
      experience_years: form.experience_years ? parseInt(form.experience_years) : 0,
      email: form.email,
      whatsapp: form.whatsapp || null,
      telegram_id: form.telegram_id || null,
      available_from: form.available_from || null,
      notes: form.notes || null,
      is_available: true,
      relief_status: "unassigned",
      urgency_level: "on_track",
      total_voyages: 0,
    });
    if (error) { setError(error.message); setSaving(false); }
    else { setDone(true); }
  }

  const inputStyle = { width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"12px 16px", fontFamily:"'Outfit',sans-serif", fontSize:14, color:"#e2e8f0", outline:"none" };
  const labelStyle = { display:"block" as const, fontSize:11, fontWeight:600 as const, color:"#6b7280", letterSpacing:1.5, marginBottom:8 };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        body { background:#0d0e12; }
        select option { background:#1a1d24; color:#e2e8f0; }
      `}</style>
      <div style={{ minHeight:"100vh", background:"#0d0e12", fontFamily:"'Outfit',sans-serif", color:"#e2e8f0" }}>

        {/* NAV */}
        <nav style={{ padding:"0 40px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid rgba(255,255,255,0.05)", background:"#111318" }}>
          <a href="/portal" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:24, letterSpacing:4, textDecoration:"none", color:"#fff" }}>
            CREW<span style={{ color:"#f97316" }}>FLOW</span>
          </a>
          <a href="/portal/status" style={{ fontSize:13, color:"#6b7280", textDecoration:"none" }}>Check Status →</a>
        </nav>

        <div style={{ maxWidth:560, margin:"0 auto", padding:"48px 24px", animation:"fadeUp .5s ease both" }}>
          {done ? (
            <div style={{ background:"#111318", border:"1px solid rgba(34,197,94,0.2)", borderRadius:16, padding:40, textAlign:"center" }}>
              <div style={{ fontSize:48, marginBottom:16 }}>🎉</div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:32, color:"#22c55e", marginBottom:12 }}>REGISTRATION COMPLETE!</div>
              <p style={{ fontSize:14, color:"#4b5563", lineHeight:1.7, marginBottom:24 }}>
                Welcome to the CrewFlow pool, <strong style={{ color:"#e2e8f0" }}>{form.full_name}</strong>!<br />
                Our team will review your profile and match you to available vacancies.
              </p>
              <div style={{ background:"rgba(249,115,22,0.06)", border:"1px solid rgba(249,115,22,0.15)", borderRadius:10, padding:"12px 16px", fontSize:13, color:"#6b7280", marginBottom:24 }}>
                💡 Save your email <strong style={{ color:"#e2e8f0" }}>{form.email}</strong> to check your status anytime.
              </div>
              <a href="/portal/status" style={{ display:"inline-block", background:"#f97316", color:"#fff", fontFamily:"'Outfit',sans-serif", fontSize:14, fontWeight:700, padding:"12px 28px", borderRadius:10, textDecoration:"none" }}>
                Check My Status →
              </a>
            </div>
          ) : (
            <>
              <div style={{ marginBottom:32 }}>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:32, letterSpacing:2, marginBottom:8 }}>
                  SEAFARER <span style={{ color:"#f97316" }}>REGISTRATION</span>
                </div>
                <div style={{ fontSize:13, color:"#4b5563" }}>Join the crew pool and get matched to vessels automatically</div>

                {/* Progress */}
                <div style={{ display:"flex", gap:8, marginTop:20 }}>
                  {[1,2].map(s => (
                    <div key={s} style={{ flex:1, height:3, borderRadius:2, background: s<=step?"#f97316":"rgba(255,255,255,0.08)", transition:"background .3s" }} />
                  ))}
                </div>
                <div style={{ fontSize:11, color:"#374151", marginTop:6 }}>Step {step} of 2 — {step===1?"Personal Details":"Contact & Availability"}</div>
              </div>

              <div style={{ background:"#111318", border:"1px solid rgba(255,255,255,0.05)", borderRadius:16, padding:32 }}>
                {step === 1 ? (
                  <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                    <div>
                      <label style={labelStyle}>FULL NAME *</label>
                      <input value={form.full_name} onChange={e => update("full_name", e.target.value)} placeholder="e.g. Emmanuel Osei" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>RANK *</label>
                      <select value={form.rank} onChange={e => update("rank", e.target.value)} style={inputStyle}>
                        <option value="">-- Select your rank --</option>
                        {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>NATIONALITY</label>
                      <select value={form.nationality} onChange={e => update("nationality", e.target.value)} style={inputStyle}>
                        <option value="">-- Select nationality --</option>
                        {NATIONALITIES.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                      <div>
                        <label style={labelStyle}>AGE</label>
                        <input type="number" value={form.age} onChange={e => update("age", e.target.value)} placeholder="e.g. 35" style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>YEARS EXPERIENCE</label>
                        <input type="number" value={form.experience_years} onChange={e => update("experience_years", e.target.value)} placeholder="e.g. 10" style={inputStyle} />
                      </div>
                    </div>
                    <button onClick={() => { if (!form.full_name || !form.rank) { setError("Full name and rank are required"); return; } setError(""); setStep(2); }}
                      style={{ background:"#f97316", color:"#fff", fontFamily:"'Outfit',sans-serif", fontSize:14, fontWeight:700, padding:13, borderRadius:10, border:"none", cursor:"pointer", marginTop:8 }}>
                      Next → Contact Details
                    </button>
                  </div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                    <div>
                      <label style={labelStyle}>EMAIL ADDRESS *</label>
                      <input type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="your@email.com" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>WHATSAPP NUMBER</label>
                      <input value={form.whatsapp} onChange={e => update("whatsapp", e.target.value)} placeholder="+234 800 000 0000" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>TELEGRAM USERNAME</label>
                      <input value={form.telegram_id} onChange={e => update("telegram_id", e.target.value)} placeholder="@username" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>AVAILABLE FROM</label>
                      <input type="date" value={form.available_from} onChange={e => update("available_from", e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>ADDITIONAL NOTES</label>
                      <textarea value={form.notes} onChange={e => update("notes", e.target.value)} placeholder="Certifications, vessel preferences, special skills..." rows={3}
                        style={{ ...inputStyle, resize:"none" as const }} />
                    </div>
                    {error && <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#ef4444" }}>{error}</div>}
                    <div style={{ display:"flex", gap:10 }}>
                      <button onClick={() => setStep(1)}
                        style={{ flex:1, background:"rgba(255,255,255,0.06)", color:"#6b7280", fontFamily:"'Outfit',sans-serif", fontSize:14, fontWeight:600, padding:13, borderRadius:10, border:"1px solid rgba(255,255,255,0.08)", cursor:"pointer" }}>
                        ← Back
                      </button>
                      <button onClick={submit} disabled={saving}
                        style={{ flex:2, background:saving?"#7c3a16":"#f97316", color:"#fff", fontFamily:"'Outfit',sans-serif", fontSize:14, fontWeight:700, padding:13, borderRadius:10, border:"none", cursor:saving?"not-allowed":"pointer", boxShadow:"0 4px 16px rgba(249,115,22,0.3)" }}>
                        {saving ? "Submitting..." : "⚓ Complete Registration"}
                      </button>
                    </div>
                  </div>
                )}
                {error && step===1 && <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#ef4444", marginTop:12 }}>{error}</div>}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
