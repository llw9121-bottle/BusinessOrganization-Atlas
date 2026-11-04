import { stages } from "../data/stages.js";
import { routes } from "../data/routes.js";
import { applyStaticTranslations, t } from "../i18n/i18n.js";
import { escapeHtml } from "../core/html.js";

let activeStage = "birth";
let activeRoute = "personal-machine";

function updateStage(stageKey) {
    activeStage = stageKey;
    const stage = stages[stageKey];
    const stageNames = {
        birth: "Birth",
        youth: "Youth",
        maturity: "Maturity",
        midlife: "Midlife",
        renewal: "Renewal",
        demise: "Ending"
    };
    const stageNumber = String(Object.keys(stages).indexOf(stageKey) + 1).padStart(2, "0");
    document.getElementById("stage-number").textContent = `${t("Stage")} ${stageNumber} / ${t(stageNames[stageKey])}`;
    document.getElementById("stage-title").textContent = t(stage.title);
    document.getElementById("stage-summary").textContent = t(stage.summary);
    document.getElementById("stage-reading").textContent = t(stage.reading);
    document.getElementById("stage-warning").textContent = t(stage.warning);
    document.getElementById("stage-forms").innerHTML = stage.tags
        .map((tag) => `<span>${escapeHtml(t(tag))}</span>`)
        .join("");
    document.querySelectorAll("[data-stage]").forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.stage === stageKey));
    });
    applyStaticTranslations(document.getElementById("view-transitions"));
}

function updateRoute(routeKey) {
    activeRoute = routeKey;
    const route = routes[routeKey];
    document.getElementById("route-title").textContent = t(route.title);
    document.getElementById("route-summary").textContent = t(route.summary);
    document.getElementById("route-condition").textContent = t(route.condition);
    document.querySelectorAll("[data-route]").forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.route === routeKey));
    });
    applyStaticTranslations(document.getElementById("view-transitions"));
}

export function renderTransitionsView() {
    updateStage(activeStage);
    updateRoute(activeRoute);
}

export function initTransitionsView() {
    document.querySelectorAll("[data-stage]").forEach((button) => {
        button.addEventListener("click", () => updateStage(button.dataset.stage));
    });

    document.querySelectorAll("[data-route]").forEach((button) => {
        button.addEventListener("click", () => updateRoute(button.dataset.route));
    });
}
