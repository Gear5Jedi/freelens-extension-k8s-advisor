import { Renderer } from "@freelensapp/extensions";
import React from "react";
import { AlertTriangle, ShieldAlert, Activity } from "lucide-react";

interface TopIssuesProps {
  deductions: { label: string; points: number }[];
  changes: string[];
}

export function TopIssues({ deductions, changes }: TopIssuesProps) {
  return (
    <div className="pa-panel" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <h3 style={{ margin: "0 0 20px 0", fontSize: "1rem" }}>Top Issues Detected</h3>
      
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px", overflowY: "auto" }}>
        {deductions.map((d, i) => {
          let severity = d.points >= 30 ? "High" : d.points >= 15 ? "Medium" : "Low";
          let Icon = d.points >= 30 ? ShieldAlert : AlertTriangle;
          let colorVar = d.points >= 30 ? "var(--pa-error)" : d.points >= 15 ? "var(--pa-warning)" : "var(--pa-info)";
          let bgVar = d.points >= 30 ? "var(--pa-error-glow)" : d.points >= 15 ? "var(--pa-warning-glow)" : "rgba(59, 130, 246, 0.2)";
          
          return (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", backgroundColor: bgVar, border: `1px solid ${colorVar}`, borderRadius: "8px" }}>
              <div style={{ display: "flex", gap: "12px" }}>
                <Icon size={16} color={colorVar} style={{ marginTop: "2px" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontWeight: "bold", fontSize: "0.9rem", color: "var(--pa-text-primary)" }}>{d.label}</span>
                  <span style={{ fontSize: "0.8rem", color: "var(--pa-text-secondary)" }}>Issue flagged causing -{d.points} health score penalty.</span>
                </div>
              </div>
              <div className={`pa-pill ${severity === 'High' ? 'pa-pill-error' : severity === 'Medium' ? 'pa-pill-warning' : 'pa-pill-info'}`}>
                {severity}
              </div>
            </div>
          );
        })}

        {changes.map((c, i) => (
          <div key={`change-${i}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", backgroundColor: "rgba(59, 130, 246, 0.1)", border: `1px solid rgba(59, 130, 246, 0.3)`, borderRadius: "8px" }}>
            <div style={{ display: "flex", gap: "12px" }}>
              <Activity size={16} color="var(--pa-info)" style={{ marginTop: "2px" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontWeight: "bold", fontSize: "0.9rem", color: "var(--pa-text-primary)" }}>Deployment Rollout</span>
                <span style={{ fontSize: "0.8rem", color: "var(--pa-text-secondary)" }}>{c}</span>
              </div>
            </div>
            <div className="pa-pill pa-pill-info">
              Low
            </div>
          </div>
        ))}

        {deductions.length === 0 && changes.length === 0 && (
          <div style={{ color: "var(--pa-text-muted)" }}>No issues detected.</div>
        )}
      </div>

      <button className="pa-button" style={{ width: "100%", justifyContent: "center", marginTop: "16px" }}>
        View all issues
      </button>
    </div>
  );
}
