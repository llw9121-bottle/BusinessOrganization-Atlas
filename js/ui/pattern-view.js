import { businessModelPatterns } from "../data/patterns.js";
import { applyStaticTranslations, t } from "../i18n/i18n.js";
import { applyBridgePreset } from "./bridge-view.js";
import { showView } from "./navigation.js";

let activePattern = "unbundled";

function updatePattern(patternKey) {
    activePattern = patternKey;
    const pattern = businessModelPatterns[patternKey];
    document.getElementById("pattern-title").textContent = t(pattern.title);
    document.getElementById("pattern-summary").textContent = t(pattern.summary);
    document.getElementById("pattern-context").textContent = t(pattern.context);
    document.getElementById("pattern-challenge").textContent = t(pattern.challenge);
    document.getElementById("pattern-solution").textContent = t(pattern.solution);
    document.getElementById("pattern-org-lens").textContent = t(pattern.orgLens);
    document.getElementById("pattern-examples").textContent = t(pattern.examples);
    document.querySelectorAll("[data-pattern]").forEach((button) => {
        button.setAttribute("aria-current", String(button.dataset.pattern === patternKey));
    });
    applyStaticTranslations(document.getElementById("view-patterns"));
}

export function renderPatternView() {
    updatePattern(activePattern);
}

export function initPatternView() {
    document.querySelectorAll("[data-pattern]").forEach((button) => {
        button.addEventListener("click", () => updatePattern(button.dataset.pattern));
    });

    document.getElementById("pattern-bridge-action").addEventListener("click", () => {
        applyBridgePreset(businessModelPatterns[activePattern].bridgePreset);
        showView("bridge");
    });
}
