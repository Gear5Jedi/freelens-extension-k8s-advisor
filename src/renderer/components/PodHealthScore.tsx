import { Renderer } from "@freelensapp/extensions";
import React, { useEffect, useState } from "react";

interface PodHealthScoreProps {
  pod: Renderer.K8sApi.Pod;
  events: Renderer.K8sApi.KubeEvent[];
}

interface Deduction {
  label: string;
  points: number;
}

export function PodHealthScore({ pod, events }: PodHealthScoreProps) {
  const [score, setScore] = useState<number>(100);
  const [deductions, setDeductions] = useState<Deduction[]>([]);
  const [metricsChecked, setMetricsChecked] = useState(false);

  useEffect(() => {
    let currentScore = 100;
    const currentDeductions: Deduction[] = [];

    const containerStatuses = pod.getContainerStatuses() || [];
    
    // Check Restarts
    const totalRestarts = containerStatuses.reduce((acc, c) => acc + c.restartCount, 0);
    if (totalRestarts > 5) {
      currentScore -= 20;
      currentDeductions.push({ label: `High Restarts (${totalRestarts})`, points: 20 });
    }

    // Check OOMKilled
    const isOomKilled = containerStatuses.some(c => 
      (c.state?.terminated?.exitCode === 137) || 
      (c.lastState?.terminated?.exitCode === 137)
    );
    if (isOomKilled) {
      currentScore -= 30;
      currentDeductions.push({ label: "OOMKilled (Exit Code 137)", points: 30 });
    }

    // Check Probes
    const hasProbeFailures = events.some(e => e.message.includes("probe failed"));
    if (hasProbeFailures) {
      currentScore -= 15;
      currentDeductions.push({ label: "Probe Failures Detected", points: 15 });
    }

    // Check Pending Time
    const creationTime = new Date(pod.metadata.creationTimestamp).getTime();
    const now = Date.now();
    const isPending = pod.getStatusMessage() === "Pending";
    if (isPending && (now - creationTime > 2 * 60 * 1000)) {
      currentScore -= 20;
      currentDeductions.push({ label: "Pending for > 2m", points: 20 });
    }

    // Check Metrics (Async)
    async function checkMetrics() {
      try {
        const metrics = await Renderer.K8sApi.podsMetricsApi.list({ namespace: pod.getNs() });
        const myMetric = metrics.find(m => m.metadata.name === pod.getName());
        if (myMetric) {
          // If we had a robust way to compare limits vs usage, we'd do it here.
          // For now, if metrics exist, we just verify they don't exceed limits.
          // Due to complex parsing of CPU/Memory strings (e.g. "100m", "1Gi"),
          // we'll leave this as a placeholder for full metric parsing.
        }
      } catch (err) {
        // Ignore metrics error
      } finally {
        setScore(Math.max(0, currentScore));
        setDeductions(currentDeductions);
        setMetricsChecked(true);
      }
    }

    checkMetrics();
  }, [pod, events]);

  const scoreColor = score > 80 ? "var(--colorSuccess)" : score > 50 ? "var(--colorWarning)" : "var(--colorError)";
  const statusIcon = score > 80 ? "✓" : score > 50 ? "⚠️" : "✗";

  return (
    <div style={{ background: "var(--boxShadow)", padding: "16px", borderRadius: "8px", border: "1px solid var(--borderColor)", display: "flex", flexDirection: "column", gap: "12px" }}>
      <h3 style={{ margin: 0 }}>Pod Health Score</h3>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ fontSize: "2.5em", fontWeight: "bold", color: scoreColor }}>
          {score}/100 {statusIcon}
        </div>
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {score === 100 ? (
          <div style={{ color: "var(--colorSuccess)" }}>✓ Pod is completely healthy</div>
        ) : (
          deductions.map((d, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9em" }}>
              <span style={{ color: "var(--colorWarning)" }}>⚠ {d.label}</span>
              <span style={{ color: "var(--colorError)", fontWeight: "bold" }}>-{d.points}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
