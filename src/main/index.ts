import { Main } from "@freelensapp/extensions";

export default class PodAdvisorExtensionMain extends Main.LensExtension {
  onActivate() {
    console.log("Pod Advisor extension activated");
  }

  onDeactivate() {
    console.log("Pod Advisor extension deactivated");
  }
}
