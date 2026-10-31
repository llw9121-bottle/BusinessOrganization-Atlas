import { lessonNotes } from "../data/learning.js";
import { t } from "../i18n/i18n.js";
import { applyBridgePreset } from "./bridge-view.js";
import { setCanvasExample } from "./canvas-view.js";
import { compareForms, inspectForm } from "./form-detail.js";
import { loadPreset } from "./lab-view.js";
import { showView } from "./navigation.js";

let exampleActive = false;
let currentView = "bridge";

function openLearningView(view) {
    showView(view);
    const heading = exampleActive && view === "bridge"
        ? document.querySelector("#bridge-workspace h2")
        : document.querySelector(`#view-${view} h1, #view-${view} h2`);
    heading?.setAttribute("tabindex", "-1");
    heading?.focus({ preventScroll: true });
    if (exampleActive && view === "bridge") {
        document.getElementById("bridge-workspace").scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    }
}

export function renderLearningView() {
    document.getElementById("lesson-bar").hidden = !exampleActive;
    document.getElementById("lesson-note").textContent = t(lessonNotes[currentView] || lessonNotes.other);
    document.querySelectorAll("[data-lesson-step]").forEach((button) => {
        if (button.dataset.lessonStep === currentView) button.setAttribute("aria-current", "step");
        else button.removeAttribute("aria-current");
    });
}

export function initLearningView() {
    document.querySelectorAll("[data-start-example]").forEach((button) => {
        button.addEventListener("click", () => {
            applyBridgePreset("free");
            inspectForm("programmed");
            compareForms("programmed", "project");
            loadPreset("scaling");
            exampleActive = true;
            setCanvasExample(true);
            openLearningView("canvas");
        });
    });
    document.querySelectorAll("[data-learn-target], [data-lesson-step]").forEach((button) => {
        button.addEventListener("click", () => {
            const view = button.dataset.learnTarget || button.dataset.lessonStep;
            if (view === "forms") document.getElementById("form-comparison").open = true;
            openLearningView(view);
        });
    });
    document.getElementById("lesson-close").addEventListener("click", () => {
        exampleActive = false;
        setCanvasExample(false);
        renderLearningView();
        const selectedTab = document.querySelector('.nav-button[aria-selected="true"]');
        // The compact menu may hide the selected tab; use its visible toggle.
        if (selectedTab?.getClientRects().length) selectedTab.focus();
        else document.getElementById("nav-toggle").focus();
    });
    document.addEventListener("atlas:view-change", (event) => {
        currentView = event.detail;
        renderLearningView();
    });
    document.addEventListener("atlas:inspect-form", (event) => {
        inspectForm(event.detail);
        openLearningView("forms");
    });
}
