import { forms } from "../data/forms.js";
import { formLearning } from "../data/learning.js";
import { modelProfiles } from "../data/model-profiles.js";
import { bridgeGroups, bridgePresets, bridgeTensionRules } from "../data/bridge.js";
import { applyStaticTranslations, t } from "../i18n/i18n.js";
import { escapeHtml, structureSvg } from "../core/html.js";
import { diagrams } from "../data/diagrams.js";

const bridgeGroupOrder = ["customer", "value", "economics", "boundary"];
const bridgeMatchForms = ["personal", "programmed", "professional", "project", "divisional", "community"];
const groupLabels = { customer: "Who do you serve?", value: "What must you excel at?", economics: "How is the work funded?", boundary: "Where does the work happen?" };
let currentResult = null;
let savedScenario = null;
let pendingChange = null;

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

function structureResolutionSvg(ranked, maxScore) {
    const loadYs = [40, 72, 104, 136];
    const slotYs = [36, 92, 148];
    const slotH = 48;
    const centers = slotYs.map((y) => y + slotH / 2);
    const stateOf = (index) => (index === 0 ? "is-primary" : index === 1 ? "is-adjacent" : "is-candidate");

    const loads = loadYs
        .map((y) => `<path class="load-arrow" d="M14 ${y} H92 M92 ${y} L84 ${y - 4} M92 ${y} L84 ${y + 4}"/>`)
        .join("");
    const memberNodes = loadYs.map((y) => `<circle class="reaction-node" cx="106" cy="${y}" r="2.5"/>`).join("");
    const links = ranked
        .map((item, index) => `<path class="support-link ${stateOf(index)}" d="M106 ${centers[index]} H150"/>`)
        .join("");
    const slots = ranked
        .map((item, index) => {
            const { formKey, value } = item;
            const slotY = slotYs[index];
            const barW = Math.max(8, Math.round(130 * value / maxScore));
            return `<g class="frame-slot ${stateOf(index)}">` +
                `<rect class="slot-frame" x="150" y="${slotY}" width="238" height="${slotH}" rx="4"/>` +
                `<text class="rank" x="166" y="${slotY + 26}" text-anchor="middle">${index + 1}</text>` +
                `<g class="frame-glyph" transform="translate(180, ${slotY + 6}) scale(0.14)">${diagrams[formKey]}</g>` +
                `<rect class="score-track" x="252" y="${slotY + 20}" width="130" height="4"/>` +
                `<rect class="score-fill" x="252" y="${slotY + 20}" width="${barW}" height="4"/>` +
                `</g>`;
        })
        .join("");

    return `<svg class="structure-resolution" viewBox="0 0 400 220" role="img" aria-label="Structural resolution">` +
        `<title>Structural resolution</title>` +
        `<path class="reaction-member" d="M106 40 V172"/>` +
        memberNodes +
        loads +
        links +
        slots +
        `</svg>`;
}

function renderStructureResolution(primary, adjacent) {
    const container = document.getElementById("bridge-structure-diagram");
    if (!container) return;
    const scores = Object.fromEntries(bridgeMatchForms.map((formKey) => [formKey, 0]));
    bridgeGroupOrder.forEach((group) => {
        Object.entries(selectedBridgeOption(group).supports || {}).forEach(([formKey, value]) => {
            if (scores[formKey] !== undefined) scores[formKey] += value;
        });
    });
    const rest = bridgeMatchForms
        .filter((formKey) => formKey !== primary && formKey !== adjacent)
        .sort((a, b) => scores[b] - scores[a]);
    const ranked = [primary, adjacent, ...rest].slice(0, 3).map((formKey) => ({ formKey, value: scores[formKey] }));
    const maxScore = Math.max(1, ...ranked.map((item) => item.value));
    container.innerHTML = structureResolutionSvg(ranked, maxScore);
}

function renderScenarioComparison() {
    const panel = document.getElementById("scenario-comparison");
    panel.hidden = !savedScenario;
    document.getElementById("bridge-clear").hidden = !savedScenario;
    if (!savedScenario || !currentResult) return;
    const changes = bridgeGroupOrder.filter((group) => savedScenario.selection[group] !== bridgeSelection[group]);
    panel.innerHTML = `<h3>${escapeHtml(t("Your comparison"))}</h3><div class="scenario-pair">
        <div><span class="studio-label">${escapeHtml(t("Saved scenario"))}</span><strong>${escapeHtml(t(forms[savedScenario.primary].name))}</strong><small>${escapeHtml(t(forms[savedScenario.adjacent].name))}</small></div>
        <div><span class="studio-label">${escapeHtml(t("Current scenario"))}</span><strong>${escapeHtml(t(forms[currentResult.primary].name))}</strong><small>${escapeHtml(t(forms[currentResult.adjacent].name))}</small></div></div>
        ${changes.length ? `<dl>${changes.map((group) => `<div><dt>${escapeHtml(t(groupLabels[group]))}</dt><dd><span>${escapeHtml(t(bridgeGroups[group].options[savedScenario.selection[group]].label))}</span> <span aria-hidden="true">→</span> <strong>${escapeHtml(t(selectedBridgeOption(group).label))}</strong><p>${escapeHtml(t(selectedBridgeOption(group).insight))}</p></dd></div>`).join("")}</dl><p>${escapeHtml(t(savedScenario.primary === currentResult.primary ? "The main form stays the same. The coordination needs and trade-offs can still change." : "The main form has changed. Compare the coordination needs before treating this as a structural recommendation."))}</p>` : `<p>${escapeHtml(t("Saved. Change one choice to see what follows."))}</p>`}`;
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
        (strainsPrimary ? "Needs a combination" : calculated.spread <= 2 ? "Hybrid opportunity" : "Natural fit");
    const tensions = matchedBridgeTensions(activeBridgePreset, primary);
    const previousResult = currentResult;
    currentResult = { primary, adjacent };
    const change = pendingChange;
    pendingChange = null;

    document.getElementById("bridge-plain").textContent = t(formLearning[primary].plain);
    document.getElementById("bridge-primary").textContent = t(primaryForm.name);
    document.getElementById("bridge-adjacent").textContent = t(adjacentForm.name);
    document.getElementById("bridge-dominant").textContent = t(primaryForm.dominant);
    document.getElementById("bridge-anchor").textContent = t(primaryForm.anchor);
    document.getElementById("bridge-fit-state").textContent = t(fitState);
    document.getElementById("bridge-fit-summary").textContent = t(preset?.summary || profile.fit);
    document.getElementById("bridge-diagram").innerHTML =
        structureSvg(primaryForm.diagram, t(`${primaryForm.name} structural signature`));
    document.getElementById("bridge-diagram-reading").textContent = t(formLearning[primary].diagram);
    renderStructureResolution(primary, adjacent);
    document.getElementById("bridge-live-primary").textContent = t(primaryForm.name);
    document.getElementById("bridge-live-adjacent").textContent = `${t("Pairs with")} ${t(adjacentForm.name)}`;

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
        `${t(primaryForm.name)} ${t("Pairs with")} ${t(adjacentForm.name)}. ${t(fitState)}. ${t(tensions[0].title)}.`;
    renderScenarioComparison();
    showChangeFeedback(change, previousResult);
    applyStaticTranslations(document.getElementById("view-bridge"));
}

// Only user-initiated option clicks pass a change; language switches re-render without one, so feedback clears.
function showChangeFeedback(change, previousResult) {
    const notes = document.querySelectorAll(".bridge-change-note");
    const announcement = document.getElementById("bridge-announcement");
    document.querySelectorAll(".bridge-impact").forEach((element) => { element.hidden = true; });
    notes.forEach((note) => { note.hidden = true; });
    if (!change || !previousResult) return;

    const primaryChanged = previousResult.primary !== currentResult.primary;
    const message = primaryChanged
        ? `${t("Result changed")}: ${t(forms[previousResult.primary].name)} → ${t(forms[currentResult.primary].name)}`
        : t("Same result, but the reasons and risks below were updated");
    notes.forEach((note) => {
        note.textContent = message;
        note.hidden = false;
    });
    announcement.textContent = `${message}. ${announcement.textContent}`;

    const impact = document.getElementById(`bridge-impact-${change.group}`);
    impact.textContent = `${t("Effect of this choice")}: ${t(selectedBridgeOption(change.group).insight)}`;
    impact.hidden = false;

    const target = document.getElementById(primaryChanged ? "bridge-primary" : "bridge-tension-list");
    target.classList.remove("is-updated");
    void target.offsetWidth;
    target.classList.add("is-updated");
    window.setTimeout(() => target.classList.remove("is-updated"), 1400);
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
    document.getElementById("bridge-save").addEventListener("click", () => {
        savedScenario = { selection: { ...bridgeSelection }, ...currentResult };
        renderScenarioComparison();
    });
    document.getElementById("bridge-clear").addEventListener("click", () => {
        savedScenario = null;
        renderScenarioComparison();
        document.getElementById("bridge-save").focus();
    });
    document.getElementById("bridge-open-form").addEventListener("click", () => {
        document.dispatchEvent(new CustomEvent("atlas:inspect-form", { detail: currentResult.primary }));
    });
    document.querySelectorAll("[data-bridge-option]").forEach((button) => {
        button.addEventListener("click", () => {
            bridgeSelection[button.dataset.bridgeGroup] = button.dataset.bridgeOption;
            pendingChange = { group: button.dataset.bridgeGroup };
            document.getElementById("bridge-hint").hidden = true;
            updateBridge();
        });
    });

    document.querySelectorAll("[data-bridge-preset]").forEach((button) => {
        button.addEventListener("click", () => {
            document.getElementById("bridge-hint").hidden = true;
            applyBridgePreset(button.dataset.bridgePreset);
        });
    });

    document.getElementById("bridge-reset").addEventListener("click", () => {
        applyBridgePreset("multi_sided");
    });
}
