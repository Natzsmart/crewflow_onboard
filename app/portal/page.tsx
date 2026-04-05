"use client";
import { useRouter } from "next/navigation";

export default function PortalPage() {
  const router = useRouter();
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
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:24, letterSpacing:4 }}>
            CREW<span style={{ color:"#f97316" }}>FLOW</span>
            <span style={{ fontSize:10, fontWeight:600, color:"#374151", letterSpacing:2, marginLeft:12 }}>SEAFARER PORTAL</span>
          </div>
          <a href="/login" style={{ fontSize:13, color:"#6b7280", textDecoration:"none", fontWeight:500 }}>Ops Login →</a>
        </nav>

        {/* HERO */}
        <div style={{ maxWidth:680, margin:"0 auto", padding:"80px 24px", textAlign:"center", animation:"fadeUp .6s ease both" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(249,115,22,0.12)", border:"1px solid rgba(249,115,22,0.3)", color:"#fb923c", fontSize:10, fontWeight:700, letterSpacing:3, padding:"5px 14px", borderRadius:4, marginBottom:24 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#f97316", animation:"pulse 1.5s infinite" }} />
            SEAFARER SELF-SERVICE PORTAL
          </div>
          <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(40px,7vw,72px)", lineHeight:.95, letterSpacing:2, marginBottom:20 }}>
            JOIN THE CREW<br /><span style={{ color:"#f97316" }}>POOL TODAY</span>
          </h1>
          <p style={{ fontSize:16, color:"#4b5563", lineHeight:1.75, marginBottom:40, maxWidth:480, margin:"0 auto 40px" }}>
            Register your profile once. Get matched to vessels automatically. Track your application status in real time.
          </p>

          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <button onClick={() => router.push("/portal/register")}
              style={{ background:"#f97316", color:"#fff", fontFamily:"'Outfit',sans-serif", fontSize:15, fontWeight:700, padding:"14px 32px", borderRadius:10, border:"none", cursor:"pointer", boxShadow:"0 8px 32px rgba(249,115,22,.4)" }}>
              ⚓ Register as Seafarer
            </button>
            <button onClick={() => router.push("/portal/status")}
              style={{ background:"rgba(255,255,255,0.06)", color:"#e2e8f0", fontFamily:"'Outfit',sans-serif", fontSize:15, fontWeight:500, padding:"14px 28px", borderRadius:10, border:"1px solid rgba(255,255,255,0.1)", cursor:"pointer" }}>
              Check My Status →
            </button>
          </div>
        </div>

        {/* FEATURES */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, maxWidth:900, margin:"0 auto", padding:"0 24px 80px" }}>
          {[
            { icon:"📋", title:"Register Once", desc:"Fill your profile with rank, certifications, and availability. We handle the rest." },
            { icon:"🤖", title:"AI-Powered Matching", desc:"Our AI scans open vacancies and matches you to the best opportunities automatically." },
            { icon:"📱", title:"Real-Time Updates", desc:"Get notified via Telegram or WhatsApp when you're shortlisted for a position." },
          ].map((f,i) => (
            <div key={i} style={{ background:"#111318", border:"1px solid rgba(255,255,255,0.05)", borderRadius:14, padding:24, textAlign:"center" }}>
              <div style={{ fontSize:32, marginBottom:12 }}>{f.icon}</div>
              <div style={{ fontWeight:700, color:"#e2e8f0", marginBottom:8 }}>{f.title}</div>
              <div style={{ fontSize:13, color:"#4b5563", lineHeight:1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div style={{ textAlign:"center", padding:"24px", borderTop:"1px solid rgba(255,255,255,0.05)", fontSize:12, color:"#374151" }}>
          © 2026 CrewFlow · Maritime Crew Management
        </div>
      </div>
    </>
  );
}
