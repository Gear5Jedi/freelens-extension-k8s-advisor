import { Renderer } from "@freelensapp/extensions";
import React from "react";
import { PodAdvisorDashboard } from "./components/PodAdvisorDashboard";
import "./theme.css";

export function PodAdvisorIcon(props: Renderer.Component.IconProps) {
  return <Renderer.Component.Icon {...props} material="health_and_safety" tooltip="Pod Advisor" />;
}

export default class PodAdvisorExtensionRenderer extends Renderer.LensExtension {
  clusterPages = [
    {
      id: "pod-advisor",
      components: {
        Page: () => <PodAdvisorDashboard />,
      },
    },
  ];

  clusterPageMenus = [
    {
      id: "pod-advisor",
      title: "Pod Advisor",
      target: { pageId: "pod-advisor" },
      components: {
        Icon: PodAdvisorIcon,
      },
    },
  ];
}
