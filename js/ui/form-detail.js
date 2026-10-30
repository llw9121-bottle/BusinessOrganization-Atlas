import { forms } from "../data/forms.js";
import { modelProfiles } from "../data/model-profiles.js";
import { applyStaticTranslations, getLanguage, t } from "../i18n/i18n.js";
import { structureSvg } from "../core/html.js";
import { applyBridgeSelection } from "./bridge-view.js";
import { showView } from "./navigation.js";

let activeFormDetail = "personal";

function updateFormDetail(formKey) {
    activeFormDetail = formKey;
    const form = forms[formKey];
    const language = getLanguage();
    document.getElementById("detail-number").textContent = `${t("Form")} ${form.number} / ${t(form.archetype)}`;
    const chapterNumber = form.chapter.replace(/\D/g, "");
    document.querySelector("#view-forms .detail-topline span:last-child").textContent =
        language === "zh" ? `第 ${chapterNumber} 章` :
            language === "ja" ? `第${chapterNumber}章` :
                language === "ko" ? `${chapterNumber}장` :
                    `${t("Chapter")} ${chapterNumber}`;
    document.getElementById("detail-title").textContent = t(form.name);
    document.getElementById("detail-lead").textContent = t(form.summary);
    document.getElementById("detail-diagram").innerHTML = structureSvg(form.diagram, t(`${form.name} structural signature`));
    document.getElementById("detail-dominant").textContent = t(form.dominant);
    document.getElementById("detail-anchor").textContent = t(form.anchor);
    document.getElementById("detail-balance").textContent = t(form.balance);
    document.getElementById("detail-coordination").textContent = t(form.coordination);
    document.getElementById("detail-power").textContent = t(form.power);
    document.getElementById("detail-conditions").textContent = t(form.conditions);
    document.getElementById("detail-risk").textContent = t(form.risk);
    document.getElementById("detail-examples").textContent = t(form.examples);
    document.getElementById("detail-remember").textContent = t(form.remember);
    const profile = modelProfiles[formKey];
    document.getElementById("mirror-customer").textContent = t(profile.customer);
    document.getElementById("mirror-value").textContent = t(profile.value);
    document.getElementById("mirror-activity").textContent = t(profile.activity);
    document.getElementById("mirror-economics").textContent = t(profile.economics);
    document.getElementById("mirror-boundary").textContent = t(profile.boundary);
    document.getElementById("mirror-tension").textContent = t(profile.tension);

    document.querySelectorAll("[data-form-index]").forEach((button) => {
        button.setAttribute("aria-current", String(button.dataset.formIndex === formKey));
    });
    applyStaticTranslations(document.getElementById("view-forms"));
}

export function renderFormDetail() {
    updateFormDetail(activeFormDetail);
}

export function initFormDetail() {
    document.querySelectorAll("[data-form-index]").forEach((button) => {
        button.addEventListener("click", () => updateFormDetail(button.dataset.formIndex));
    });

    document.getElementById("mirror-explore").addEventListener("click", () => {
        const profile = modelProfiles[activeFormDetail];
        applyBridgeSelection(profile.selection);
        showView("bridge");
    });
}
