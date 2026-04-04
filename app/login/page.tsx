"use client";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  async function handleLogin() {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.3} }
        body { background:#0d0e12; }
      `}</style>
      <div style={{ minHeight:"100vh", background:"#0d0e12", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Outfit',sans-serif", padding:24 }}>
        <div style={{ width:"100%", maxWidth:420, animation:"fadeUp .5s ease both" }}>
          <div style={{ textAlign:"center", marginBottom:40 }}>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:36, letterSpacing:6, color:"#fff" }}>
              CREW<span style={{ color:"#f97316" }}>FLOW</span>
            </div>
            <div style={{ fontSize:11, fontWeight:600, color:"#374151", letterSpacing:3, marginTop:4 }}>MARITIME CREW MANAGEMENT</div>
          </div>
          <div style={{ background:"#111318", border:"1px solid rgba(255,255,255,0.05)", borderRadius:16, padding:36 }}>
            <div style={{ marginBottom:28 }}>
              <div style={{ fontSize:20, fontWeight:700, color:"#e2e8f0", marginBottom:6 }}>Welcome back</div>
              <div style={{ fontSize:13, color:"#4b5563" }}>Sign in to your CrewFlow account</div>
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={{ display:"block", fontSize:11, fontWeight:600, color:"#6b7280", letterSpacing:1.5, marginBottom:8 }}>EMAIL</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key==="Enter" && handleLogin()} placeholder="ops@crewingagency.com"
                style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"12px 16px", fontFamily:"'Outfit',sans-serif", fontSize:14, color:"#e2e8f0", outline:"none" }} />
            </div>
            <div style={{ marginBottom:24 }}>
              <label style={{ display:"block", fontSize:11, fontWeight:600, color:"#6b7280", letterSpacing:1.5, marginBottom:8 }}>PASSWORD</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key==="Enter" && handleLogin()} placeholder="••••••••"
                style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"12px 16px", fontFamily:"'Outfit',sans-serif", fontSize:14, color:"#e2e8f0", outline:"none" }} />
            </div>
            {error && (
              <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#ef4444", marginBottom:16 }}>{error}</div>
            )}
            <button onClick={handleLogin} disabled={loading}
              style={{ width:"100%", background:loading?"#7c3a16":"#f97316", color:"#fff", fontFamily:"'Outfit',sans-serif", fontSize:15, fontWeight:700, padding:13, borderRadius:10, border:"none", cursor:loading?"not-allowed":"pointer", boxShadow:"0 4px 16px rgba(249,115,22,0.3)", transition:"all .2s" }}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
            <div style={{ textAlign:"center", marginTop:20, fontSize:13, color:"#4b5563" }}>
              Don't have an account?{" "}
              <a href="/signup" style={{ color:"#f97316", textDecoration:"none", fontWeight:600 }}>Sign up free</a>
            </div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginTop:16 }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e", animation:"pulse 2s infinite" }} />
              <span style={{ fontSize:11, color:"#374151", fontWeight:500 }}>All systems operational</span>
            </div>
          </div>
          <div style={{ textAlign:"center", marginTop:20, fontSize:12, color:"#374151" }}>© 2026 CrewFlow · Maritime Crew Management</div>
        </div>
      </div>
    </>
  );
}
