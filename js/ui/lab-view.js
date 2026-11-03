import { forces, presets } from "../data/forces.js";
import { forms } from "../data/forms.js";
import { formLearning } from "../data/learning.js";
import { applyStaticTranslations, getLanguage, t } from "../i18n/i18n.js";
import { localizedAnchors, localizedForceLabels } from "../i18n/localized-labels.js";
import { escapeHtml, structureSvg } from "../core/html.js";

const sliderKeys = Object.keys(forces);
let activePreset = "founding";

function lowerInitial(text) {
    return text ? text.charAt(0).toLocaleLowerCase() + text.slice(1) : text;
}

function updateLab(sourcePreset = null) {
    const language = getLanguage();
    const values = {};
    sliderKeys.forEach((key) => {
        const slider = document.querySelector(`[data-force-slider="${key}"]`);
        values[key] = Number(slider.value);
        document.getElementById(`value-${key}`).textContent = slider.value;
    });

    const dominantKey = sliderKeys.reduce((best, key) => values[key] > values[best] ? key : best, sliderKeys[0]);
    const force = forces[dominantKey];
    const form = forms[force.form];

    document.getElementById("lab-title").textContent = t(form.name);
    document.getElementById("mobile-lab-title").textContent = t(form.name);
    const forceDetail = language === "zh" ? t(force.description) : lowerInitial(t(force.description));
    const separator = language === "zh" || language === "ja" ? "：" : language === "fr" ? " : " : ": ";
    const spacer = language === "zh" || language === "ja" ? "" : " ";
    document.getElementById("lab-summary").textContent =
        `${t("The field currently leans toward")}${spacer}${localizedForceLabels[language][force.name] || t(force.name).toLocaleLowerCase()}${separator}${forceDetail}`;
    document.getElementById("lab-dominant").textContent = t(force.name);
    document.getElementById("lab-anchor").textContent = t(force.anchor);
    document.getElementById("mobile-lab-anchor").textContent =
        `${t("Balance with")}${language === "zh" || language === "ja" || language === "ko" ? "：" : " "}${localizedAnchors[language][force.anchor] || t(force.anchor).toLocaleLowerCase()}`;
    document.getElementById("lab-anchor-copy").innerHTML =
        `<strong>${escapeHtml(t("Containment"))}</strong><br>${escapeHtml(t(force.containment))}`;
    document.getElementById("lab-diagram").innerHTML =
        structureSvg(form.diagram, t(`${form.name} structural signature`), t(formLearning[force.form].diagram));

    document.querySelectorAll("[data-force-control]").forEach((control) => {
        control.classList.toggle("is-dominant", control.dataset.forceControl === dominantKey);
    });

    if (sourcePreset !== null) {
        activePreset = sourcePreset;
        document.querySelectorAll("[data-preset]").forEach((button) => {
            button.setAttribute("aria-pressed", String(button.dataset.preset === sourcePreset));
        });
    } else {
        activePreset = null;
        document.querySelectorAll("[data-preset]").forEach((button) => {
            button.setAttribute("aria-pressed", "false");
        });
    }
    applyStaticTranslations(document.getElementById("view-forces"));
}

export function renderLabView() {
    updateLab(activePreset);
}

export function loadPreset(key) {
    const preset = presets[key];
    sliderKeys.forEach((forceKey) => {
        document.querySelector(`[data-force-slider="${forceKey}"]`).value = preset[forceKey];
    });
    updateLab(key);
}

export function initLabView() {
    document.querySelectorAll("[data-preset]").forEach((button) => {
        button.addEventListener("click", () => loadPreset(button.dataset.preset));
    });

    document.querySelectorAll("[data-force-slider]").forEach((slider) => {
        slider.addEventListener("input", () => updateLab());
    });

    document.getElementById("lab-reset").addEventListener("click", () => loadPreset("founding"));
}
