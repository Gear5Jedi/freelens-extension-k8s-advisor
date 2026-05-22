import { Renderer } from "@freelensapp/extensions";
import React, { useEffect, useState } from "react";

interface DependencyHealthProps {
  pod: Renderer.K8sApi.Pod;
}

interface Dependency {
  name: string;
  status: "Healthy" | "Unhealthy" | "Unknown";
}

export function DependencyHealth({ pod }: DependencyHealthProps) {
  const [dependencies, setDependencies] = useState<Dependency[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkDependencies() {
      setLoading(true);
      try {
        const foundDeps: Dependency[] = [];
        
        // 1. Extract all environment variable values from all containers
        const envValues = new Set<string>();
        const containers = pod.spec.containers || [];
        containers.forEach(c => {
          if (c.env) {
            c.env.forEach(e => {
              if (e.value) envValues.add(e.value.toLowerCase());
            });
          }
        });

        // 2. Fetch all Services in the namespace
        const services = await Renderer.K8sApi.serviceApi.list({ namespace: pod.getNs() });
        
        // 3. Find services that are referenced in env vars
        const referencedServices = services.filter(svc => {
          const svcName = svc.getName().toLowerCase();
          return Array.from(envValues).some(val => val.includes(svcName));
        });

        // 4. Check Endpoints for each referenced service
        for (const svc of referencedServices) {
          try {
            const ep = await Renderer.K8sApi.endpointApi.get({ name: svc.getName(), namespace: pod.getNs() });
            
            // Check if there are ready addresses
            const hasReadyAddresses = ep.subsets?.some((subset: any) => subset.addresses && subset.addresses.length > 0);
            
            foundDeps.push({
              name: svc.getName(),
              status: hasReadyAddresses ? "Healthy" : "Unhealthy"
            });
          } catch (err) {
            foundDeps.push({
              name: svc.getName(),
              status: "Unknown"
            });
          }
        }
        
        setDependencies(foundDeps);
      } catch (err) {
        console.error("Failed to check dependencies:", err);
      } finally {
        setLoading(false);
      }
    }

    checkDependencies();
  }, [pod]);

  return (
    <div style={{ background: "var(--boxShadow)", padding: "16px", borderRadius: "8px", border: "1px solid var(--borderColor)", display: "flex", flexDirection: "column", gap: "12px" }}>
      <h3 style={{ margin: 0 }}>Dependency Health (Passive Check)</h3>
      {loading ? (
        <span style={{ color: "var(--textColorSecondary)" }}>Scanning environment for dependencies...</span>
      ) : dependencies.length === 0 ? (
        <span style={{ color: "var(--textColorSecondary)" }}>No internal service dependencies detected in environment variables.</span>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {dependencies.map((dep, idx) => (
            <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px", background: "var(--mainBackground)", borderRadius: "4px" }}>
              <span style={{ fontWeight: "bold" }}>{dep.name}</span>
              {dep.status === "Healthy" && <span style={{ color: "var(--colorSuccess)" }}>✓ Reachable</span>}
              {dep.status === "Unhealthy" && <span style={{ color: "var(--colorError)" }}>❌ No Ready Endpoints</span>}
              {dep.status === "Unknown" && <span style={{ color: "var(--colorWarning)" }}>⚠️ Unknown</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
