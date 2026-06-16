import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { FileText, TerminalSquare, RotateCw, Edit3, Copy } from "lucide-react";

export function BottomPanels() {
  // Mock data for resource usage chart
  const resourceData = Array.from({ length: 24 }, (_, i) => ({
    time: `${i.toString().padStart(2, '0')}:00`,
    cpuUsage: Math.random() * 0.8 + 0.1,
    cpuLimit: 1.0,
    memUsage: Math.random() * 512 + 256,
    memLimit: 1024
  }));

  return (
    <div className="pa-grid pa-grid-bot" style={{ marginBottom: "24px" }}>
      
      {/* Resource Usage */}
      <div className="pa-panel">
        <div className="pa-header" style={{ marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <h3 style={{ margin: 0, fontSize: "1rem" }}>Resource Usage</h3>
            <span className="pa-pill pa-pill-info" style={{ fontSize: "0.6rem", padding: "2px 6px" }}>Demo Data</span>
          </div>
          <select className="pa-select" defaultValue="6h" style={{ padding: "4px 8px", fontSize: "0.8rem" }}>
            <option value="1h">Last 1 hour</option>
            <option value="6h">Last 6 hours</option>
            <option value="24h">Last 24 hours</option>
          </select>
        </div>
        
        <div style={{ display: "flex", gap: "24px", height: "150px" }}>
          {/* CPU Chart */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--pa-text-secondary)", marginBottom: "8px" }}>
              <span>CPU (cores)</span>
              <div style={{ display: "flex", gap: "12px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><div style={{ width: "12px", height: "3px", background: "var(--pa-primary)" }}></div> Usage</span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><div style={{ width: "12px", height: "2px", borderTop: "2px dashed var(--pa-text-muted)" }}></div> Limit</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={resourceData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--pa-border)" vertical={false} />
                  <XAxis dataKey="time" stroke="var(--pa-text-muted)" fontSize={10} tickLine={false} axisLine={false} minTickGap={30} />
                  <YAxis stroke="var(--pa-text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                  <Area type="monotone" dataKey="cpuLimit" stroke="var(--pa-text-muted)" strokeDasharray="3 3" fill="none" />
                  <Area type="monotone" dataKey="cpuUsage" stroke="var(--pa-primary)" fill="var(--pa-primary-glow)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Memory Chart */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--pa-text-secondary)", marginBottom: "8px" }}>
              <span>Memory (MiB)</span>
              <div style={{ display: "flex", gap: "12px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><div style={{ width: "12px", height: "3px", background: "var(--pa-warning)" }}></div> Usage</span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><div style={{ width: "12px", height: "2px", borderTop: "2px dashed var(--pa-text-muted)" }}></div> Limit</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={resourceData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--pa-border)" vertical={false} />
                  <XAxis dataKey="time" stroke="var(--pa-text-muted)" fontSize={10} tickLine={false} axisLine={false} minTickGap={30} />
                  <YAxis stroke="var(--pa-text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                  <Area type="monotone" dataKey="memLimit" stroke="var(--pa-text-muted)" strokeDasharray="3 3" fill="none" />
                  <Area type="monotone" dataKey="memUsage" stroke="var(--pa-warning)" fill="var(--pa-warning-glow)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="pa-panel">
        <h3 style={{ margin: "0 0 16px 0", fontSize: "1rem" }}>Quick Actions</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <button disabled className="pa-button" style={{ justifyContent: "flex-start", color: "var(--pa-text-muted)", opacity: 0.7, cursor: "not-allowed" }}>
            <FileText size={16} /> View Logs <span style={{fontSize: "0.7rem", marginLeft:"auto"}}>(Coming Soon)</span>
          </button>
          <button disabled className="pa-button" style={{ justifyContent: "flex-start", color: "var(--pa-text-muted)", opacity: 0.7, cursor: "not-allowed" }}>
            <TerminalSquare size={16} /> Describe Pod <span style={{fontSize: "0.7rem", marginLeft:"auto"}}>(Coming Soon)</span>
          </button>
          <button disabled className="pa-button" style={{ justifyContent: "flex-start", color: "var(--pa-text-muted)", opacity: 0.7, cursor: "not-allowed" }}>
            <TerminalSquare size={16} /> Exec Shell <span style={{fontSize: "0.7rem", marginLeft:"auto"}}>(Coming Soon)</span>
          </button>
          <button disabled className="pa-button" style={{ justifyContent: "flex-start", color: "var(--pa-text-muted)", opacity: 0.7, cursor: "not-allowed" }}>
            <RotateCw size={16} /> Restart Pod <span style={{fontSize: "0.7rem", marginLeft:"auto"}}>(Coming Soon)</span>
          </button>
          <button disabled className="pa-button" style={{ justifyContent: "flex-start", color: "var(--pa-text-muted)", opacity: 0.7, cursor: "not-allowed" }}>
            <Edit3 size={16} /> Edit Resources <span style={{fontSize: "0.7rem", marginLeft:"auto"}}>(Coming Soon)</span>
          </button>
          <button disabled className="pa-button" style={{ justifyContent: "flex-start", color: "var(--pa-text-muted)", opacity: 0.7, cursor: "not-allowed" }}>
            <Copy size={16} /> Copy Name <span style={{fontSize: "0.7rem", marginLeft:"auto"}}>(Coming Soon)</span>
          </button>
        </div>
      </div>

    </div>
  );
}
