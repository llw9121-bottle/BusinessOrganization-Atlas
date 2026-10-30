import { applyBridgePreset } from "./bridge-view.js";
import { showView } from "./navigation.js";

export function initCasesView() {
    document.querySelectorAll("[data-case-bridge]").forEach((button) => {
        button.addEventListener("click", () => {
            applyBridgePreset(button.dataset.caseBridge);
            showView("bridge");
        });
    });
}
