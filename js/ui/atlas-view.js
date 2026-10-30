import { forms } from "../data/forms.js";
import { applyStaticTranslations, t } from "../i18n/i18n.js";
import { structureSvg } from "../core/html.js";
import { loadPreset } from "./lab-view.js";
import { showView } from "./navigation.js";

let activeAtlasForm = "personal";

function updateInspector(formKey) {
    activeAtlasForm = formKey;
    const form = forms[formKey];
    document.getElementById("inspector-number").textContent = `${form.number} · ${t(form.name)}`;
    document.getElementById("inspector-title").textContent = t(form.name);
    document.getElementById("inspector-archetype").textContent = `${t(form.archetype)} · ${t(form.dominant)}`;
    document.getElementById("inspector-diagram").innerHTML = structureSvg(form.diagram, t(`${form.name} structural signature`));
    document.getElementById("inspector-copy").textContent = t(form.summary);
    document.getElementById("inspector-coordination").textContent = t(form.coordination);
    document.getElementById("inspector-power").textContent = t(form.power);
    document.getElementById("inspector-conditions").textContent = t(form.conditions);
    document.getElementById("inspector-risk").textContent = t(form.risk);

    document.querySelectorAll("[data-form]").forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.form === formKey));
    });
    applyStaticTranslations(document.getElementById("view-atlas"));
}

export function renderAtlasView() {
    updateInspector(activeAtlasForm);
}

export function initAtlasView() {
    document.querySelectorAll("[data-form]").forEach((button) => {
        button.addEventListener("click", () => updateInspector(button.dataset.form));
    });

    document.querySelectorAll(".force-chip").forEach((button) => {
        button.addEventListener("click", () => {
            const forceKey = button.dataset.force;
            loadPreset(forceKey === "consolidation" ? "founding" :
                forceKey === "efficiency" ? "scaling" :
                    forceKey === "proficiency" ? "expertise" :
                        forceKey === "collaboration" ? "innovation" :
                            forceKey === "separation" ? "diversify" :
                                forceKey === "culture" ? "mission" : "conflict");
            showView("forces");
        });
    });
}
