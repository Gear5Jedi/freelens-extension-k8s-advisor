import { Renderer } from "@freelensapp/extensions";
import React, { useEffect, useState } from "react";

interface WhatChangedProps {
  pod: Renderer.K8sApi.Pod;
}

export function WhatChanged({ pod }: WhatChangedProps) {
  const [changes, setChanges] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      try {
        const foundChanges: string[] = [];
        const ownerRefs = pod.getOwnerRefs();
        const rsOwner = ownerRefs.find(r => r.kind === "ReplicaSet");

        if (rsOwner) {
          const rsList = await Renderer.K8sApi.replicaSetApi.list({ namespace: pod.getNs() });
          
          const currentRS = rsList.find(rs => rs.getName() === rsOwner.name);
          if (currentRS) {
            const deployOwner = currentRS.getOwnerRefs().find(r => r.kind === "Deployment");
            if (deployOwner) {
              // Find all RS for this Deployment
              const siblingRS = rsList.filter(rs => 
                rs.getOwnerRefs().some(r => r.name === deployOwner.name)
              ).sort((a, b) => 
                new Date(b.metadata.creationTimestamp).getTime() - new Date(a.metadata.creationTimestamp).getTime()
              );

              // siblingRS[0] is typically the current/latest.
              // siblingRS[1] is the previous one.
              if (siblingRS.length >= 2) {
                const latest = siblingRS[0];
                const prev = siblingRS[1];
                
                foundChanges.push(`Deployment rollout: ${Math.round((Date.now() - new Date(latest.metadata.creationTimestamp).getTime()) / 60000)} mins ago`);

                // Compare images
                const latestContainers = latest.spec.template.spec.containers || [];
                const prevContainers = prev.spec.template.spec.containers || [];
                
                latestContainers.forEach(lc => {
                  const pc = prevContainers.find(c => c.name === lc.name);
                  if (pc && pc.image !== lc.image) {
                    foundChanges.push(`Image changed (${lc.name}):\n${pc.image} → ${lc.image}`);
                  }
                });
                
                // Compare ConfigMap annotations if any
                const latestAnnotations = latest.spec.template.metadata?.annotations || {};
                const prevAnnotations = prev.spec.template.metadata?.annotations || {};
                
                Object.keys(latestAnnotations).forEach(key => {
                  if (key.includes("checksum") || key.includes("config")) {
                    if (latestAnnotations[key] !== prevAnnotations[key]) {
                      foundChanges.push(`ConfigMap/Secret updated (Detected via annotation hash change)`);
                    }
                  }
                });
                
                // Note scaling if we can infer it, but RS replicas often fluctuate during rollout.
              }
            }
          }
        }
        
        // Node change detection? We can't easily know previous pod's node unless we track it or it's a StatefulSet. 
        // For now, if no changes found:
        if (foundChanges.length === 0) {
          foundChanges.push("No significant recent deployment changes detected.");
        }
        
        setChanges(foundChanges);
      } catch (err) {
        console.error("Failed to fetch what changed:", err);
        setChanges(["Failed to analyze history."]);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [pod]);

  return (
    <div style={{ background: "var(--boxShadow)", padding: "16px", borderRadius: "8px", border: "1px solid var(--borderColor)", display: "flex", flexDirection: "column", gap: "12px" }}>
      <h3 style={{ margin: 0 }}>What Changed Recently?</h3>
      {loading ? (
        <span style={{ color: "var(--textColorSecondary)" }}>Analyzing history...</span>
      ) : (
        <ul style={{ margin: 0, paddingLeft: "20px", color: "var(--textColorPrimary)", display: "flex", flexDirection: "column", gap: "8px" }}>
          {changes.map((c, i) => (
            <li key={i} style={{ whiteSpace: "pre-wrap" }}>{c}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
