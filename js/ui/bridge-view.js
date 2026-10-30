import { forms } from "../data/forms.js";
import { modelProfiles } from "../data/model-profiles.js";
import { bridgeGroups, bridgePresets, bridgeTensionRules } from "../data/bridge.js";
import { applyStaticTranslations, t } from "../i18n/i18n.js";
import { escapeHtml, structureSvg } from "../core/html.js";

const bridgeGroupOrder = ["customer", "value", "economics", "boundary"];
const bridgeMatchForms = ["personal", "programmed", "professional", "project", "divisional", "community"];

let activeBridgePreset = "multi_sided";
const bridgeSelection = {
    customer: "multi_sided",
    value: "access_network",
    economics: "free_subsidy",
    boundary: "open"
};

function matchingBridgePreset() {
    return Object.entries(bridgePresets).find(([, preset]) =>
        bridgeGroupOrder.every((group) => bridgeSelection[group] === preset.selection[group])
    )?.[0] ?? null;
}

function selectedBridgeOption(group) {
    return bridgeGroups[group].options[bridgeSelection[group]];
}

function calculateBridgeMatches() {
    const scores = Object.fromEntries(bridgeMatchForms.map((formKey) => [formKey, 0]));
    bridgeGroupOrder.forEach((group) => {
        const supports = selectedBridgeOption(group).supports || {};
        Object.entries(supports).forEach(([formKey, value]) => {
            if (scores[formKey] !== undefined) scores[formKey] += value;
        });
    });
    const ordered = Object.entries(scores)
        .sort((a, b) => b[1] - a[1] || bridgeMatchForms.indexOf(a[0]) - bridgeMatchForms.indexOf(b[0]))
        .map(([formKey, value]) => ({ formKey, value }));
    return {
        primary: ordered[0].formKey,
        adjacent: ordered[1].formKey,
        spread: ordered[0].value - ordered[1].value
    };
}

function matchedBridgeTensions(presetKey, primary) {
    const matches = [];
    if (presetKey) {
        const presetTension = bridgeTensionRules.find((rule) => rule.id === bridgePresets[presetKey].tensionId);
        if (presetTension) matches.push(presetTension);
    }
    bridgeTensionRules.forEach((rule) => {
        const matched = Object.entries(rule.when).every(([group, accepted]) => accepted.includes(bridgeSelection[group]));
        if (matched && !matches.some((existing) => existing.id === rule.id)) matches.push(rule);
    });
    if (!matches.length) {
        const profile = modelProfiles[primary];
        return [{
            id: `profile-${primary}`,
            title: "Current model tension",
            body: profile.tension,
            response: profile.response,
            whatIf: profile.whatIf
        }];
    }
    return matches.slice(0, 2);
}

export function updateBridge() {
    activeBridgePreset = matchingBridgePreset();
    document.querySelectorAll("[data-bridge-preset]").forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.bridgePreset === activeBridgePreset));
    });
    document.querySelectorAll("[data-bridge-option]").forEach((button) => {
        button.setAttribute(
            "aria-pressed",
            String(bridgeSelection[button.dataset.bridgeGroup] === button.dataset.bridgeOption)
        );
    });

    const calculated = calculateBridgeMatches();
    const preset = activeBridgePreset ? bridgePresets[activeBridgePreset] : null;
    const primary = preset?.primary ?? calculated.primary;
    const adjacent = preset?.adjacent ?? calculated.adjacent;
    const primaryForm = forms[primary];
    const adjacentForm = forms[adjacent];
    const profile = modelProfiles[primary];
    const strainsPrimary = bridgeGroupOrder.some((group) =>
        (selectedBridgeOption(group).strains || []).includes(primary)
    );
    const fitState = preset?.fitState ||
        (strainsPrimary ? "Needs a bridge" : calculated.spread <= 2 ? "Hybrid opportunity" : "Natural fit");
    const tensions = matchedBridgeTensions(activeBridgePreset, primary);

    document.getElementById("bridge-primary").textContent = t(primaryForm.name);
    document.getElementById("bridge-adjacent").textContent = t(adjacentForm.name);
    document.getElementById("bridge-dominant").textContent = t(primaryForm.dominant);
    document.getElementById("bridge-anchor").textContent = t(primaryForm.anchor);
    document.getElementById("bridge-fit-state").textContent = t(fitState);
    document.getElementById("bridge-fit-summary").textContent = t(preset?.summary || profile.fit);
    document.getElementById("bridge-diagram").innerHTML =
        structureSvg(primaryForm.diagram, t(`${primaryForm.name} structural signature`));
    document.getElementById("bridge-live-primary").textContent = t(primaryForm.name);
    document.getElementById("bridge-live-adjacent").textContent = `${t("with")} ${t(adjacentForm.name)}`;

    const linkParts = [
        ["customer", "bridge-link-customer"],
        ["value", "bridge-link-value"],
        ["economics", "bridge-link-economics"],
        ["boundary", "bridge-link-boundary"]
    ];
    linkParts.forEach(([group, id]) => {
        const option = selectedBridgeOption(group);
        document.getElementById(`${id}-label`).textContent = t(option.label);
        document.getElementById(id).textContent = t(option.insight);
    });

    document.getElementById("bridge-tension-list").innerHTML = tensions.map((tension) => `
        <article class="bridge-tension">
          <h3>${escapeHtml(t(tension.title))}</h3>
          <p>${escapeHtml(t(tension.body))}</p>
          <p class="response"><strong>${escapeHtml(t("Organization design response"))}:</strong> ${escapeHtml(t(tension.response))}</p>
        </article>
      `).join("");
    document.getElementById("bridge-experiment").textContent = t(tensions[0].response);
    document.getElementById("bridge-whatif-text").textContent =
        t(tensions[0].whatIf || profile.whatIf);
    document.getElementById("bridge-announcement").textContent =
        `${t(primaryForm.name)} ${t("with")} ${t(adjacentForm.name)}. ${t(fitState)}. ${t(tensions[0].title)}.`;
    applyStaticTranslations(document.getElementById("view-bridge"));
}

export function applyBridgePreset(presetKey) {
    const preset = bridgePresets[presetKey];
    Object.assign(bridgeSelection, preset.selection);
    activeBridgePreset = presetKey;
    updateBridge();
}

export function applyBridgeSelection(selection) {
    Object.assign(bridgeSelection, selection);
    activeBridgePreset = matchingBridgePreset();
    updateBridge();
}

export function initBridgeView() {
    document.querySelectorAll("[data-bridge-option]").forEach((button) => {
        button.addEventListener("click", () => {
            bridgeSelection[button.dataset.bridgeGroup] = button.dataset.bridgeOption;
            updateBridge();
        });
    });

    document.querySelectorAll("[data-bridge-preset]").forEach((button) => {
        button.addEventListener("click", () => {
            applyBridgePreset(button.dataset.bridgePreset);
        });
    });

    document.getElementById("bridge-reset").addEventListener("click", () => {
        applyBridgePreset("multi_sided");
    });
}
