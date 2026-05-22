import { Renderer } from "@freelensapp/extensions";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Shield, RefreshCw, Share2, FileText } from "lucide-react";

import { TopWidgets } from "./TopWidgets";
import { TopIssues } from "./TopIssues";
import { PodEventTimeline } from "./PodEventTimeline";
import { IntelligentDiagnosis } from "./IntelligentDiagnosis";
import { BottomPanels } from "./BottomPanels";

export const PodAdvisorDashboard = observer(() => {
  const [namespaces, setNamespaces] = useState<string[]>([]);
  const [selectedNamespace, setSelectedNamespace] = useState<string>("default");
  
  const [pods, setPods] = useState<Renderer.K8sApi.Pod[]>([]);
  const [selectedPodId, setSelectedPodId] = useState<string>("");
  const [events, setEvents] = useState<Renderer.K8sApi.KubeEvent[]>([]);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const podList = await Renderer.K8sApi.podsApi.list();
        setPods(podList);
        
        const nss = Array.from(new Set(podList.map(p => p.getNs()))).sort();
        setNamespaces(nss);
        
        if (nss.length > 0 && !nss.includes(selectedNamespace)) {
          setSelectedNamespace(nss[0]);
        }
      } catch (err) {
        console.error("Failed to load pods", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredPods = pods.filter(p => p.getNs() === selectedNamespace);
  const selectedPod = pods.find(p => p.getId() === selectedPodId);

  useEffect(() => {
    async function fetchEvents() {
      if (selectedPod) {
        try {
          const podEvents = await Renderer.K8sApi.eventApi.list({ namespace: selectedPod.getNs() });
          const filteredEvents = podEvents.filter(e => e.involvedObject.uid === selectedPod.getId());
          filteredEvents.sort((a, b) => new Date(a.creationTimestamp).getTime() - new Date(b.creationTimestamp).getTime());
          setEvents(filteredEvents);
        } catch (err) {
          console.error("Failed to fetch events", err);
        }
      } else {
        setEvents([]);
      }
    }
    fetchEvents();
  }, [selectedPod]);

  // Mock scoring & deductions for rendering since full logic lives in components but we need them for TopWidgets
  let score = 100;
  let deductions: any[] = [];
  let changes: string[] = [];
  
  if (selectedPod) {
    const statuses = selectedPod.getContainerStatuses() || [];
    const totalRestarts = statuses.reduce((acc, c) => acc + c.restartCount, 0);
    if (totalRestarts > 5) {
      score -= 20;
      deductions.push({ label: `High Restarts (${totalRestarts})`, points: 20 });
    }
    const isOom = statuses.some(c => c.state?.terminated?.exitCode === 137 || c.lastState?.terminated?.exitCode === 137);
    if (isOom) {
      score -= 30;
      deductions.push({ label: "OOMKilled (Exit Code 137)", points: 30 });
    }
    // Mock changes
    changes = ["Pod was restarted due to a rollout 191 mins ago."];
  }

  const tabs = ["Overview", "Timeline", "Metrics", "Logs", "Events", "Resources", "Network", "YAML"];

  return (
    <div className="pa-dashboard">
      {/* Header */}
      <div className="pa-header">
        <div>
          <div className="pa-title">
            <Shield size={24} color="var(--pa-primary)" />
            Pod Advisor
          </div>
          <p className="pa-subtitle">Troubleshoot pod issues faster with insights, timelines and recommendations.</p>
        </div>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <span style={{ color: "var(--pa-text-secondary)", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px" }}>
            Last updated: {new Date().toLocaleTimeString()} <RefreshCw size={14} />
          </span>
          <button className="pa-button"><Share2 size={16} /> Share</button>
        </div>
      </div>

      {/* Selectors & Badges */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
        <div style={{ display: "flex", gap: "16px", alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "0.85rem", color: "var(--pa-text-secondary)" }}>Namespace</label>
            <select className="pa-select" style={{ minWidth: "200px" }} value={selectedNamespace} onChange={e => { setSelectedNamespace(e.target.value); setSelectedPodId(""); }}>
              {namespaces.map(ns => <option key={ns} value={ns}>{ns}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "0.85rem", color: "var(--pa-text-secondary)" }}>Pod</label>
            <select className="pa-select" style={{ minWidth: "400px" }} value={selectedPodId} onChange={e => setSelectedPodId(e.target.value)}>
              <option value="">-- Select a Pod --</option>
              {filteredPods.map(p => <option key={p.getId()} value={p.getId()}>{p.getName()}</option>)}
            </select>
          </div>
          
          {selectedPod && (
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginLeft: "16px", paddingBottom: "8px" }}>
              <div className="pa-pill pa-pill-success">{selectedPod.getStatusMessage()}</div>
              <span style={{ fontSize: "0.9rem", color: "var(--pa-text-secondary)" }}>Age: {selectedPod.getAge(true, false)}</span>
              <span style={{ fontSize: "0.9rem", color: "var(--pa-text-secondary)" }}>Node: {selectedPod.getNodeName()}</span>
            </div>
          )}
        </div>
        {selectedPod && (
          <button className="pa-button pa-button-primary"><FileText size={16} /> Logs</button>
        )}
      </div>

      {/* Tabs */}
      <div className="pa-tabs">
        {tabs.map(tab => (
          <div key={tab} className={`pa-tab ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
            {tab}
          </div>
        ))}
      </div>

      {/* Content */}
      {!selectedPod ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--pa-text-muted)" }}>
          Please select a Pod to view its analysis.
        </div>
      ) : activeTab === "Overview" ? (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <TopWidgets score={score} deductions={deductions} containerStatuses={selectedPod.getContainerStatuses() || []} />
          
          <div className="pa-grid pa-grid-mid" style={{ marginBottom: "24px" }}>
            <PodEventTimeline pod={selectedPod} events={events} />
            <TopIssues deductions={deductions} changes={changes} />
            <IntelligentDiagnosis pod={selectedPod} events={events} />
          </div>

          <BottomPanels />
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--pa-text-muted)" }}>
          {activeTab} view is coming soon.
        </div>
      )}
    </div>
  );
});
