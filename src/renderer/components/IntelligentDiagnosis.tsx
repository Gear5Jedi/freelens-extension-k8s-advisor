import { Renderer } from "@freelensapp/extensions";
import React from "react";
import { Sparkles, Info } from "lucide-react";
import { diagnosePod } from "../utils/troubleshooting";

interface IntelligentDiagnosisProps {
  pod: Renderer.K8sApi.Pod;
  events: Renderer.K8sApi.KubeEvent[];
}

export function IntelligentDiagnosis({ pod, events }: IntelligentDiagnosisProps) {
  const diagnosis = diagnosePod(pod, events);
  
  const isHealthy = diagnosis.category === "Healthy";
  const confidenceColor = 
    diagnosis.confidence === "High" ? "var(--pa-success)" : 
    diagnosis.confidence === "Medium" ? "var(--pa-warning)" : 
    "var(--pa-error)";
  
  const confidenceBlocks = diagnosis.confidence === "High" ? 5 : diagnosis.confidence === "Medium" ? 3 : 1;

  return (
    <div className="pa-panel" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
        <Sparkles size={18} color="var(--pa-success)" />
        <h3 style={{ margin: 0, fontSize: "1rem" }}>Intelligent Diagnosis</h3>
      </div>
      
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Sparkles size={14} color="var(--pa-warning)" />
            <span style={{ fontWeight: "bold", color: "var(--pa-text-primary)" }}>Likely cause:</span>
          </div>
          <span style={{ color: "var(--pa-text-secondary)", fontSize: "0.9rem", lineHeight: "1.4" }}>
            {diagnosis.likelyCause}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontWeight: "bold", color: "var(--pa-text-primary)" }}>Confidence:</span>
          <div style={{ display: "flex", gap: "2px" }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{ width: "8px", height: "12px", backgroundColor: i < confidenceBlocks ? confidenceColor : "var(--pa-border)", borderRadius: "2px" }} />
            ))}
          </div>
          <span style={{ color: confidenceColor, fontWeight: "bold", fontSize: "0.9rem", marginLeft: "4px" }}>{diagnosis.confidence}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ fontWeight: "bold", color: "var(--pa-text-primary)" }}>Evidence:</span>
          <ul style={{ margin: 0, paddingLeft: "20px", color: "var(--pa-text-secondary)", fontSize: "0.9rem" }}>
            {diagnosis.evidence.map((ev, idx) => (
              <li key={idx}>{ev}</li>
            ))}
          </ul>
        </div>

        {diagnosis.suggestedActions.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Info size={14} color="var(--pa-info)" />
              <span style={{ fontWeight: "bold", color: "var(--pa-text-primary)" }}>Recommendation:</span>
            </div>
            <div style={{ color: "var(--pa-text-secondary)", fontSize: "0.9rem", whiteSpace: "pre-wrap", background: "rgba(0,0,0,0.2)", padding: "8px", borderRadius: "4px", border: "1px solid var(--pa-border)" }}>
              {diagnosis.suggestedActions.join('\n\n')}
            </div>
          </div>
        )}
      </div>

      <button className="pa-button" style={{ width: "100%", justifyContent: "center", marginTop: "16px" }}>
        View full analysis
      </button>
    </div>
  );
}
