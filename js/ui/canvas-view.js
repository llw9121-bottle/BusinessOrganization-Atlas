import { canvasBlocks } from "../data/canvas-blocks.js";
import { canvasConnections, searchExample } from "../data/learning.js";
import { escapeHtml } from "../core/html.js";
import { applyStaticTranslations, t } from "../i18n/i18n.js";

let activeCanvasBlock = "value";
let exampleActive = false;

function updateCanvasBlock(blockKey) {
    activeCanvasBlock = blockKey;
    const block = canvasBlocks[blockKey];
    const zoneKeys = {
        "Customer": "customer",
        "Offer": "offer",
        "Infrastructure": "infrastructure",
        "Financial viability": "financial"
    };
    document.getElementById("canvas-title").textContent = t(block.title);
    document.getElementById("canvas-definition").textContent = t(block.definition);
    document.getElementById("canvas-question").textContent = t(block.question);
    document.getElementById("canvas-org-lens").textContent = t(block.orgLens);
    document.getElementById("canvas-warning").textContent = t(block.warning);
    document.querySelectorAll("[data-canvas-block]").forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.canvasBlock === blockKey));
        button.classList.toggle("is-connected", canvasConnections[blockKey].related.includes(button.dataset.canvasBlock));
    });
    const connection = canvasConnections[blockKey];
    document.getElementById("canvas-connection-copy").textContent = t(connection.explanation);
    document.getElementById("canvas-connection-links").innerHTML = connection.related.map((key) =>
        `<button class="studio-button quiet" type="button" data-connected-block="${key}">${escapeHtml(t(canvasBlocks[key].title))} <span aria-hidden="true">↗</span></button>`
    ).join("");
    document.getElementById("canvas-example").hidden = !exampleActive;
    document.getElementById("canvas-example-copy").textContent = t(searchExample[blockKey]);
    document.querySelectorAll("[data-canvas-zone]").forEach((zone) => {
        zone.classList.toggle("is-active", zone.dataset.canvasZone === zoneKeys[block.zone]);
    });
    applyStaticTranslations(document.getElementById("view-canvas"));
}

export function renderCanvasView() {
    updateCanvasBlock(activeCanvasBlock);
}

export function setCanvasExample(active) {
    exampleActive = active;
    updateCanvasBlock(activeCanvasBlock);
}

export function initCanvasView() {
    document.getElementById("canvas-connection-links").addEventListener("click", (event) => {
        const button = event.target.closest("[data-connected-block]");
        if (button) {
            updateCanvasBlock(button.dataset.connectedBlock);
            document.querySelector(`[data-canvas-block="${activeCanvasBlock}"]`).focus();
        }
    });
    document.querySelectorAll("[data-canvas-block]").forEach((button) => {
        button.addEventListener("click", () => updateCanvasBlock(button.dataset.canvasBlock));
    });
}
