import { canvasBlocks } from "../data/canvas-blocks.js";
import { applyStaticTranslations, t } from "../i18n/i18n.js";

let activeCanvasBlock = "value";

function updateCanvasBlock(blockKey) {
    activeCanvasBlock = blockKey;
    const block = canvasBlocks[blockKey];
    const zoneKeys = {
        "Customer": "customer",
        "Offer": "offer",
        "Infrastructure": "infrastructure",
        "Financial viability": "financial"
    };
    document.getElementById("canvas-zone-label").textContent =
        `${t(block.zone)} · ${t("Block")} ${block.number}`;
    document.getElementById("canvas-title").textContent = t(block.title);
    document.getElementById("canvas-definition").textContent = t(block.definition);
    document.getElementById("canvas-question").textContent = t(block.question);
    document.getElementById("canvas-org-lens").textContent = t(block.orgLens);
    document.getElementById("canvas-warning").textContent = t(block.warning);
    document.querySelectorAll("[data-canvas-block]").forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.canvasBlock === blockKey));
    });
    document.querySelectorAll("[data-canvas-zone]").forEach((zone) => {
        zone.classList.toggle("is-active", zone.dataset.canvasZone === zoneKeys[block.zone]);
    });
    applyStaticTranslations(document.getElementById("view-canvas"));
}

export function renderCanvasView() {
    updateCanvasBlock(activeCanvasBlock);
}

export function initCanvasView() {
    document.querySelectorAll("[data-canvas-block]").forEach((button) => {
        button.addEventListener("click", () => updateCanvasBlock(button.dataset.canvasBlock));
    });
}
