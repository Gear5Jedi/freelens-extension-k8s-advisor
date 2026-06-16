import { Renderer } from "@freelensapp/extensions";
import React, { useMemo } from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { AlertTriangle, Info, RefreshCw, Cpu, MemoryStick, CheckCircle } from "lucide-react";

interface TopWidgetsProps {
  score: number;
  deductions: { label: string; points: number }[];
  containerStatuses: any[];
}

export function TopWidgets({ score, deductions, containerStatuses }: TopWidgetsProps) {
  const isHealthy = score > 80;
  const scoreColor = isHealthy ? "var(--pa-success)" : score > 50 ? "var(--pa-warning)" : "var(--pa-error)";
  const statusText = isHealthy ? "Healthy" : score > 50 ? "Degraded" : "Unhealthy";

  // Mock data for sparklines since we only get current points from metrics API usually
  const sparklineData = Array.from({ length: 20 }, () => ({
    value: Math.random() * 100
  }));

  const totalRestarts = containerStatuses.reduce((acc, c) => acc + c.restartCount, 0);
  const readyCount = containerStatuses.filter(c => c.ready).length;
  const totalCount = containerStatuses.length;

  return (
    <div className="pa-grid pa-grid-top" style={{ marginBottom: "24px" }}>
      {/* Health Score Gauge */}
      <div className="pa-panel" style={{ display: "flex", flexDirection: "column", gap: "12px", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <h3 style={{ margin: 0, fontSize: "1rem" }}>Pod Health Score</h3>
          <Info size={14} color="var(--pa-text-muted)" />
        </div>
        
        <div style={{ display: "flex", gap: "24px", alignItems: "center", marginTop: "8px" }}>
          {/* Simple SVG Gauge */}
          <div style={{ position: "relative", width: "120px", height: "60px", overflow: "hidden" }}>
            <svg viewBox="0 0 100 50" style={{ width: "100%", height: "100%" }}>
              <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="var(--pa-border)" strokeWidth="12" strokeLinecap="round" />
              <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke={scoreColor} strokeWidth="12" strokeLinecap="round" strokeDasharray={`${(score / 100) * 125} 125`} />
            </svg>
            <div style={{ position: "absolute", bottom: "0", width: "100%", textAlign: "center" }}>
              <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "var(--pa-text-primary)", lineHeight: "1" }}>{score}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--pa-text-muted)" }}>/100</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
            <div style={{ color: scoreColor, fontWeight: "bold", marginBottom: "4px" }}>{statusText}</div>
            {deductions.slice(0, 2).map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem" }}>
                <AlertTriangle size={12} color="var(--pa-warning)" />
                <span style={{ color: "var(--pa-text-secondary)" }}>{d.label}</span>
              </div>
            ))}
            {deductions.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", marginTop: "4px" }}>
                <Info size={12} color="var(--pa-info)" />
                <span style={{ color: "var(--pa-info)" }}>{deductions.length} Recommendation{deductions.length > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Restarts */}
      <div className="pa-panel" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--pa-text-secondary)", fontSize: "0.9rem" }}>
          <RefreshCw size={16} />
          <span>Restarts</span>
        </div>
        <div style={{ fontSize: "1.8rem", fontWeight: "bold" }}>{totalRestarts}</div>
        <div style={{ fontSize: "0.8rem", color: "var(--pa-text-muted)", marginBottom: "8px" }}>Last 24h</div>
        <div style={{ height: "40px", width: "100%", marginLeft: "-10px", marginBottom: "-10px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <Area type="monotone" dataKey="value" stroke="var(--pa-error)" fill="var(--pa-error-glow)" strokeWidth={2} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CPU Usage */}
      <div className="pa-panel" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--pa-text-secondary)", fontSize: "0.9rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Cpu size={16} />
            <span>CPU Usage</span>
          </div>
          <span className="pa-pill pa-pill-info" style={{ fontSize: "0.6rem", padding: "2px 6px" }}>Demo Data</span>
        </div>
        <div style={{ fontSize: "1.8rem", fontWeight: "bold", marginTop: "8px" }}>
          412m <span style={{ fontSize: "1rem", color: "var(--pa-warning)" }}>(82%)</span>
        </div>
        <div style={{ height: "40px", width: "100%", marginLeft: "-10px", marginBottom: "-10px", marginTop: "auto" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <Area type="monotone" dataKey="value" stroke="var(--pa-primary)" fill="var(--pa-primary-glow)" strokeWidth={2} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Memory Usage */}
      <div className="pa-panel" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--pa-text-secondary)", fontSize: "0.9rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <MemoryStick size={16} />
            <span>Memory Usage</span>
          </div>
          <span className="pa-pill pa-pill-info" style={{ fontSize: "0.6rem", padding: "2px 6px" }}>Demo Data</span>
        </div>
        <div style={{ fontSize: "1.8rem", fontWeight: "bold", marginTop: "8px" }}>
          768Mi <span style={{ fontSize: "1rem", color: "var(--pa-error)" }}>(96%)</span>
        </div>
        <div style={{ height: "40px", width: "100%", marginLeft: "-10px", marginBottom: "-10px", marginTop: "auto" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <Area type="monotone" dataKey="value" stroke="var(--pa-warning)" fill="var(--pa-warning-glow)" strokeWidth={2} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ready */}
      <div className="pa-panel" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--pa-text-secondary)", fontSize: "0.9rem" }}>
          <CheckCircle size={16} />
          <span>Ready</span>
        </div>
        <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: readyCount === totalCount ? "var(--pa-success)" : "var(--pa-warning)" }}>
          {readyCount}/{totalCount}
        </div>
        <div style={{ fontSize: "0.8rem", color: "var(--pa-text-muted)", marginBottom: "8px" }}>Containers</div>
        <div style={{ height: "40px", width: "100%", marginLeft: "-10px", marginBottom: "-10px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <Area type="monotone" dataKey="value" stroke="var(--pa-success)" fill="var(--pa-success-glow)" strokeWidth={2} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
