import { Renderer } from "@freelensapp/extensions";
import React from "react";
import { formatDistanceToNow } from "util"; // not easily available here, we'll format date manually

interface PodEventTimelineProps {
  pod: Renderer.K8sApi.Pod;
  events: Renderer.K8sApi.KubeEvent[];
}

interface TimelineItem {
  time: string;
  type: "Deployment" | "Container" | "Image" | "Warning" | "Normal";
  message: string;
  isError?: boolean;
}

export function PodEventTimeline({ pod, events }: PodEventTimelineProps) {
  
  const timelineItems: TimelineItem[] = [];

  // Add creation event
  const createdTime = new Date(pod.metadata.creationTimestamp);
  timelineItems.push({
    time: createdTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    type: "Deployment",
    message: "Deployment rollout started",
    isError: false
  });

  // Events from K8s
  events.forEach(e => {
    const time = new Date(e.creationTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let type: TimelineItem["type"] = "Normal";
    let isError = e.type === "Warning";
    
    if (e.message.includes("image")) type = "Image";
    else if (e.message.includes("container")) type = "Container";

    timelineItems.push({ time, type, message: e.message, isError });
  });

  // Sort chronological
  // Since we don't have full timestamps mapped here easily in the display format,
  // we'll just reverse the events list which was already chronological, 
  // or rather we should just display them as-is (they come in chronological from parent)

  return (
    <div className="pa-panel" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <h3 style={{ margin: "0 0 20px 0", fontSize: "1rem" }}>"Why Is My Pod Restarting?" Timeline</h3>
      
      <div style={{ flex: 1, overflowY: "auto", paddingRight: "10px" }}>
        {timelineItems.length === 0 && <div style={{ color: "var(--pa-text-muted)" }}>No events found.</div>}
        {timelineItems.map((item, idx) => (
          <div key={idx} className="pa-timeline-item">
            <div className="pa-timeline-line"></div>
            
            <div style={{ minWidth: "40px", fontSize: "0.8rem", color: "var(--pa-text-secondary)" }}>
              {item.time}
            </div>
            
            <div className="pa-timeline-dot" style={{ backgroundColor: item.isError ? "var(--pa-warning)" : "var(--pa-success)" }}></div>
            
            <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: "-2px" }}>
              <div>
                {item.isError && <span style={{ color: "var(--pa-warning)", fontWeight: "bold", marginRight: "8px" }}>Warning</span>}
                {!item.isError && <span style={{ color: "var(--pa-success)", fontWeight: "bold", marginRight: "8px" }}>Normal</span>}
                <span style={{ fontSize: "0.9rem", color: "var(--pa-text-primary)" }}>{item.message}</span>
              </div>
              
              <div className={`pa-pill ${item.type === 'Deployment' ? 'pa-pill-info' : ''}`} style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid var(--pa-border)", color: "var(--pa-text-secondary)" }}>
                {item.type}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="pa-button" style={{ width: "100%", justifyContent: "center", marginTop: "16px" }}>
        View full timeline
      </button>
    </div>
  );
}
