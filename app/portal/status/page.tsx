"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function StatusPage() {
  const [email, setEmail]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [seafarer, setSeafarer] = useState<any>(null);
  const [error, setError]       = useState("");
  const [searched, setSearched] = useState(false);

  async function checkStatus() {
    if (!email) { setError("Please enter your email"); return; }
    setLoading(true);
    setError("");
    setSeafarer(null);
    const { data } = await supabase.from("seafarers").select("*").eq("email", email).single();
    if (!data) { setError("No profile found with that email. Please register first."); }
    else { setSeafarer(data); }
    setSearched(true);
    setLoading(false);
  }

  const STATUS_COLOR: any = {
    unassigned: { color:"#6b7280", bg:"rgba(107,114,128,0.1)", label:"In Pool" },
    shortlisted: { color:"#f97316", bg:"rgba(249,115,22,0.1)", label:"Shortlisted" },
    confirmed:  { color:"#22c55e", bg:"rgba(34,197,94,0.1)",  label:"Confirmed" },
    complete:   { color:"#3b82f6", bg:"rgba(59,130,246,0.1)", label:"Placed" },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.3} }
        body { background:#0d0e12; }
      `}</style>
      <div style={{ minHeight:"100vh", background:"#0d0e12", fontFamily:"'Outfit',sans-serif", color:"#e2e8f0" }}>

        {/* NAV */}
        <nav style={{ padding:"0 40px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid rgba(255,255,255,0.05)", background:"#111318" }}>
          <a href="/portal" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:24, letterSpacing:4, textDecoration:"none", color:"#fff" }}>
            CREW<span style={{ color:"#f97316" }}>FLOW</span>
          </a>
          <a href="/portal/register" style={{ fontSize:13, color:"#f97316", textDecoration:"none", fontWeight:600 }}>⚓ Register →</a>
        </nav>

        <div style={{ maxWidth:520, margin:"0 auto", padding:"48px 24px", animation:"fadeUp .5s ease both" }}>
          <div style={{ marginBottom:32, textAlign:"center" }}>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:32, letterSpacing:2, marginBottom:8 }}>
              CHECK YOUR <span style={{ color:"#f97316" }}>STATUS</span>
            </div>
            <div style={{ fontSize:13, color:"#4b5563" }}>Enter your email to see your application status</div>
          </div>

          <div style={{ background:"#111318", border:"1px solid rgba(255,255,255,0.05)", borderRadius:16, padding:32, marginBottom:20 }}>
            <label style={{ display:"block", fontSize:11, fontWeight:600, color:"#6b7280", letterSpacing:1.5, marginBottom:8 }}>YOUR EMAIL ADDRESS</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key==="Enter" && checkStatus()}
              placeholder="your@email.com"
              style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"12px 16px", fontFamily:"'Outfit',sans-serif", fontSize:14, color:"#e2e8f0", outline:"none", marginBottom:16 }} />
            {error && <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#ef4444", marginBottom:16 }}>{error}</div>}
            <button onClick={checkStatus} disabled={loading}
              style={{ width:"100%", background:loading?"#7c3a16":"#f97316", color:"#fff", fontFamily:"'Outfit',sans-serif", fontSize:14, fontWeight:700, padding:13, borderRadius:10, border:"none", cursor:loading?"not-allowed":"pointer", boxShadow:"0 4px 16px rgba(249,115,22,0.3)" }}>
              {loading ? "Searching..." : "Check My Status →"}
            </button>
          </div>

          {seafarer && (
            <div style={{ background:"#111318", border:"1px solid rgba(255,255,255,0.05)", borderRadius:16, padding:32, animation:"fadeUp .4s ease both" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
                <div>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:24, letterSpacing:1 }}>{seafarer.full_name}</div>
                  <div style={{ fontSize:13, color:"#f97316", fontWeight:600, marginTop:2 }}>{seafarer.rank}</div>
                  <div style={{ fontSize:12, color:"#4b5563", marginTop:2 }}>{seafarer.nationality}</div>
                </div>
                <div>
                  {(() => {
                    const s = STATUS_COLOR[seafarer.relief_status] || STATUS_COLOR.unassigned;
                    return (
                      <div style={{ background:s.bg, color:s.color, fontSize:11, fontWeight:700, padding:"5px 12px", borderRadius:20, letterSpacing:1 }}>
                        {s.label}
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div style={{ borderTop:"1px solid rgba(255,255,255,0.05)", paddingTop:20 }}>
                {[
                  { label:"Experience",     val: seafarer.experience_years ? `${seafarer.experience_years} years` : "—" },
                  { label:"Available From", val: seafarer.available_from ? new Date(seafarer.available_from).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}) : "Immediately" },
                  { label:"Availability",   val: seafarer.is_available ? "✅ Available" : "⏳ On Assignment" },
                  { label:"Member Since",   val: new Date(seafarer.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}) },
                ].map(r => (
                  <div key={r.label} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                    <span style={{ fontSize:12, color:"#374151", fontWeight:500 }}>{r.label}</span>
                    <span style={{ fontSize:13, fontWeight:600, color:"#e2e8f0" }}>{r.val}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop:20, background:"rgba(249,115,22,0.06)", border:"1px solid rgba(249,115,22,0.15)", borderRadius:10, padding:"12px 16px", fontSize:13, color:"#6b7280", lineHeight:1.6 }}>
                💡 Your profile is active in the CrewFlow pool. You'll be contacted via email or WhatsApp when matched to a vacancy.
              </div>
            </div>
          )}

          {searched && !seafarer && !error && (
            <div style={{ textAlign:"center", padding:32 }}>
              <div style={{ fontSize:32, marginBottom:12 }}>🔍</div>
              <div style={{ fontSize:14, color:"#4b5563" }}>No profile found. <a href="/portal/register" style={{ color:"#f97316", textDecoration:"none", fontWeight:600 }}>Register here →</a></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
