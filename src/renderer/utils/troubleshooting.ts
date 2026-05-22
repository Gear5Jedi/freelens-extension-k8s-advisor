import { Renderer } from "@freelensapp/extensions";

export interface Diagnosis {
  category: "Runtime" | "Scheduling" | "Network/Storage" | "Healthy" | "Unknown";
  likelyCause: string;
  confidence: "High" | "Medium" | "Low";
  evidence: string[];
  suggestedActions: string[];
}

export function diagnosePod(pod: Renderer.K8sApi.Pod, events: Renderer.K8sApi.KubeEvent[]): Diagnosis {
  // 1. Healthy Check
  const containerStatuses = pod.getContainerStatuses() || [];
  if (pod.getStatusMessage() === "Running" && containerStatuses.every(c => c.ready)) {
    return {
      category: "Healthy",
      likelyCause: "Pod is healthy",
      confidence: "High",
      evidence: ["All containers are ready", "Pod status is Running"],
      suggestedActions: []
    };
  }

  // 2. Container Statuses (Runtime / Network / Storage)
  for (const status of containerStatuses) {
    if (status.state?.waiting) {
      const reason = status.state.waiting.reason;
      if (reason === "CrashLoopBackOff") {
        return {
          category: "Runtime",
          likelyCause: "CrashLoopBackOff",
          confidence: "High",
          evidence: [
            `Container ${status.name} is in CrashLoopBackOff`,
            `Previous exit code: ${status.lastState?.terminated?.exitCode || "Unknown"}`
          ],
          suggestedActions: [
            "Check application logs for fatal exceptions",
            "Verify configuration and environment variables"
          ]
        };
      }
      if (reason === "ImagePullBackOff" || reason === "ErrImagePull") {
        return {
          category: "Network/Storage",
          likelyCause: "ImagePullBackOff",
          confidence: "High",
          evidence: [`Container ${status.name} failed to pull image ${status.image}`],
          suggestedActions: [
            "Check if image tag exists in registry",
            "Verify ImagePullSecrets",
            "Check node network connectivity to registry"
          ]
        };
      }
      if (reason === "CreateContainerConfigError") {
        return {
          category: "Runtime",
          likelyCause: "Missing ConfigMap or Secret",
          confidence: "High",
          evidence: [`Container ${status.name} failed to create config`],
          suggestedActions: [
            "Verify all referenced ConfigMaps and Secrets exist in the namespace"
          ]
        };
      }
    }
    
    if (status.state?.terminated || status.lastState?.terminated) {
      const termState = status.state?.terminated || status.lastState?.terminated;
      if (termState?.exitCode === 137) {
        return {
          category: "Runtime",
          likelyCause: "OOMKilled",
          confidence: "High",
          evidence: [
            `Exit Code: 137`,
            `Killed by kernel OOM. Memory limit reached.`
          ],
          suggestedActions: [
            `Increase limit:\nresources:\n  limits:\n    memory: (higher value)`
          ]
        };
      }
    }
  }

  // 3. Event Analysis (Scheduling / Network)
  for (const event of events) {
    if (event.reason === "FailedScheduling") {
      return {
        category: "Scheduling",
        likelyCause: "FailedScheduling",
        confidence: "High",
        evidence: [event.message],
        suggestedActions: [
          "Check Node resources (CPU/Memory)",
          "Check Node selectors, affinities, and taints",
          "Provision more nodes"
        ]
      };
    }
    if (event.reason === "FailedMount") {
      return {
        category: "Network/Storage",
        likelyCause: "FailedMount",
        confidence: "High",
        evidence: [event.message],
        suggestedActions: [
          "Check if PVC is bound",
          "Check if underlying storage class/provisioner is healthy",
          "Verify secrets/configmaps mounted exist"
        ]
      };
    }
    if (event.message.includes("probe failed")) {
      return {
        category: "Runtime",
        likelyCause: "Probe Failure",
        confidence: "Medium",
        evidence: [event.message],
        suggestedActions: [
          "Check if application is deadlocked or overloaded",
          "Increase probe timeout or initialDelaySeconds",
          "Check dependent services (DB, Redis, etc.)"
        ]
      }
    }
  }

  return {
    category: "Unknown",
    likelyCause: "Unknown",
    confidence: "Low",
    evidence: ["No definitive patterns matched"],
    suggestedActions: [
      "Review Pod Events manually",
      "Review Application Logs"
    ]
  };
}
