"use client";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

export default function Home() {
  const [status, setStatus] = useState("Checking connection...");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    async function test() {
      const { data, error } = await supabase.from("vessels").select("count");
      if (error) {
        setStatus("❌ Connection failed: " + error.message);
      } else {
        setStatus("✅ Supabase connected successfully!");
        setConnected(true);
      }
    }
    test();
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 20,
      background: "#fffbf5",
      fontFamily: "sans-serif"
    }}>
      <div style={{
        width: 60, height: 60,
        background: "linear-gradient(135deg, #f97316, #ea580c)",
        borderRadius: 16,
        display: "flex", alignItems: "center",
        justifyContent: "center",
        fontSize: 30
      }}>⚓</div>

      <h1 style={{ fontSize: 32, fontWeight: 900, color: "#1a1a1a", margin: 0 }}>
        CrewFlow
      </h1>
      <p style={{ color: "#6b7280", margin: 0 }}>Maritime Crew Management Platform</p>

      <div style={{
        background: connected ? "#f0fdf4" : "#fff",
        border: `2px solid ${connected ? "#22c55e" : "#fde8cc"}`,
        borderRadius: 12,
        padding: "16px 28px",
        fontSize: 15,
        fontWeight: 600,
        color: connected ? "#15803d" : "#92400e"
      }}>
        {status}
      </div>

      {connected && (
        <p style={{ color: "#9ca3af", fontSize: 13 }}>
          Database is live. Ready to build.
        </p>
      )}
    </div>
  );
}