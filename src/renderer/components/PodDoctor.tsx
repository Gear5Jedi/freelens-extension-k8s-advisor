import { Renderer } from "@freelensapp/extensions";
import React from "react";
import { diagnosePod } from "../utils/troubleshooting";

interface PodDoctorProps {
  pod: Renderer.K8sApi.Pod;
  events: Renderer.K8sApi.KubeEvent[];
}

export function PodDoctor({ pod, events }: PodDoctorProps) {
  const diagnosis = diagnosePod(pod, events);
  
  const confidenceColor = 
    diagnosis.confidence === "High" ? "var(--colorSuccess)" : 
    diagnosis.confidence === "Medium" ? "var(--colorWarning)" : 
    "var(--colorError)";

  return (
    <div style={{ background: "var(--boxShadow)", padding: "16px", borderRadius: "8px", border: "1px solid var(--borderColor)", display: "flex", flexDirection: "column", gap: "16px" }}>
      
      {diagnosis.category !== "Healthy" && (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
           <span style={{ fontWeight: "bold", fontSize: "1.1em" }}>Category:</span>
           <span style={{ fontWeight: "bold", fontSize: "1.1em", color: "var(--colorWarning)" }}>{diagnosis.category} Problems</span>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontWeight: "bold" }}>Likely cause:</span>
        <span style={{ fontWeight: "bold" }}>{diagnosis.likelyCause}</span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontWeight: "bold" }}>Confidence:</span>
        <span style={{ 
          background: confidenceColor, 
          color: "white", 
          padding: "2px 8px", 
          borderRadius: "12px", 
          fontSize: "0.85em",
          fontWeight: "bold"
        }}>
          {diagnosis.confidence}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <span style={{ fontWeight: "bold" }}>Evidence:</span>
        <ul style={{ margin: 0, paddingLeft: "20px", color: "var(--textColorSecondary)" }}>
          {diagnosis.evidence.map((ev, idx) => (
            <li key={idx}>{ev}</li>
          ))}
        </ul>
      </div>

      {diagnosis.suggestedActions.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ fontWeight: "bold" }}>Suggested Actions:</span>
          <ul style={{ margin: 0, paddingLeft: "20px", color: "var(--textColorSecondary)" }}>
            {diagnosis.suggestedActions.map((action, idx) => (
              <li key={idx} style={{ whiteSpace: "pre-wrap", fontFamily: action.includes("\\n") || action.includes(":") ? "monospace" : "inherit" }}>
                {action}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
