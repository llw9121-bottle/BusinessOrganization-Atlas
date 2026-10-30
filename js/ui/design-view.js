import { designEpicenters } from "../data/design-epicenters.js";
import { applyStaticTranslations, t } from "../i18n/i18n.js";

let activeDesignEpicenter = "customer";

function updateDesignEpicenter(epicenterKey) {
    activeDesignEpicenter = epicenterKey;
    const epicenter = designEpicenters[epicenterKey];
    document.getElementById("design-epicenter-label").textContent = t(epicenter.label);
    document.getElementById("design-epicenter-title").textContent = t(epicenter.title);
    document.getElementById("design-epicenter-summary").textContent = t(epicenter.summary);
    document.getElementById("design-epicenter-move").textContent = t(epicenter.move);
    document.getElementById("design-epicenter-org").textContent = t(epicenter.org);
    document.getElementById("design-epicenter-question").textContent = t(epicenter.question);
    document.querySelectorAll("[data-design-epicenter]").forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.designEpicenter === epicenterKey));
    });
    applyStaticTranslations(document.getElementById("view-design"));
}

export function renderDesignView() {
    updateDesignEpicenter(activeDesignEpicenter);
}

export function initDesignView() {
    document.querySelectorAll("[data-design-epicenter]").forEach((button) => {
        button.addEventListener("click", () => updateDesignEpicenter(button.dataset.designEpicenter));
    });
}
