import { Renderer } from "@freelensapp/extensions";
import React, { useEffect, useState } from "react";
import { Timeline } from "./Timeline";
import { PodDoctor } from "./PodDoctor";
import { PodHealthScore } from "./PodHealthScore";
import { WhatChanged } from "./WhatChanged";
import { DependencyHealth } from "./DependencyHealth";

interface PodAdvisorPanelProps {
  pod: Renderer.K8sApi.Pod;
}

export function PodAdvisorPanel({ pod }: PodAdvisorPanelProps) {
  const [events, setEvents] = useState<Renderer.K8sApi.KubeEvent[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const podEvents = await Renderer.K8sApi.eventApi.list({ namespace: pod.getNs() });
        // Filter events specific to this Pod
        const filteredEvents = podEvents.filter(
          (e) => e.involvedObject.uid === pod.getId()
        );
        // Sort events by timestamp ascending
        filteredEvents.sort((a, b) => {
          const timeA = new Date(a.creationTimestamp).getTime();
          const timeB = new Date(b.creationTimestamp).getTime();
          return timeA - timeB;
        });
        setEvents(filteredEvents);
      } catch (err) {
        console.error("Failed to fetch events for Pod:", err);
      }
    }

    fetchEvents();
  }, [pod]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <PodHealthScore pod={pod} events={events} />
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        <WhatChanged pod={pod} />
        <DependencyHealth pod={pod} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        <div>
          <h3 style={{ marginBottom: "12px" }}>"Why Is My Pod Restarting?" Timeline</h3>
          <Timeline pod={pod} events={events} />
        </div>
        <div>
          <h3 style={{ marginBottom: "12px" }}>Intelligent Describe</h3>
          <PodDoctor pod={pod} events={events} />
        </div>
      </div>
    </div>
  );
}
