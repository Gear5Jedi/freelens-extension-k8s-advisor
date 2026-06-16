import { Renderer } from "@freelensapp/extensions";
import React from "react";

interface TimelineProps {
  pod: Renderer.K8sApi.Pod;
  events: Renderer.K8sApi.KubeEvent[];
}

export function Timeline({ pod, events }: TimelineProps) {
  // Combine pod creation time and events
  const timelineItems = [];
  
  timelineItems.push({
    timestamp: new Date(pod.metadata.creationTimestamp),
    message: "deploy started",
    type: "Normal",
    reason: ""
  });

  events.forEach(e => {
    timelineItems.push({
      timestamp: new Date(e.lastTimestamp || e.firstTimestamp || e.creationTimestamp || e.metadata?.creationTimestamp || Date.now()),
      message: e.message,
      type: e.type,
      reason: e.reason
    });
  });

  // Check current container statuses for restarts or image updates
  const containerStatuses = pod.getContainerStatuses() || [];
  containerStatuses.forEach(status => {
    if (status.state?.terminated) {
      timelineItems.push({
        timestamp: new Date(status.state.terminated.finishedAt),
        message: `Container ${status.name} terminated (Exit Code ${status.state.terminated.exitCode})`,
        type: "Warning",
        reason: status.state.terminated.reason
      });
    }
    if (status.restartCount > 0 && status.lastState?.terminated) {
       timelineItems.push({
        timestamp: new Date(status.lastState.terminated.finishedAt),
        message: `Container ${status.name} restarted (Exit Code ${status.lastState.terminated.exitCode})`,
        type: "Warning",
        reason: status.lastState.terminated.reason
      });
    }
  });

  timelineItems.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", background: "var(--boxShadow)", padding: "16px", borderRadius: "8px", border: "1px solid var(--borderColor)" }}>
      {timelineItems.length === 0 && <span>No timeline events found.</span>}
      {timelineItems.map((item, idx) => (
        <div key={idx} style={{ display: "flex", gap: "12px", alignItems: "baseline", borderBottom: idx < timelineItems.length - 1 ? "1px solid var(--borderColor)" : "none", paddingBottom: "8px" }}>
          <span style={{ color: "var(--textColorSecondary)", fontSize: "0.85em", minWidth: "45px" }}>
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span style={{ 
            color: item.type === "Warning" ? "var(--colorWarning)" : "var(--colorSuccess)",
            fontWeight: "bold",
            fontSize: "0.9em",
            minWidth: "120px"
          }}>
            {item.reason || "Normal"}
          </span>
          <span style={{ color: "var(--textColorPrimary)", fontSize: "0.9em", wordBreak: "break-word" }}>
            {item.message}
          </span>
        </div>
      ))}
    </div>
  );
}
