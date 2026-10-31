import { diagrams } from "../data/diagrams.js";

export function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;"
    })[character]);
}

export function structureSvg(key, label, caption = "") {
    const safeLabel = escapeHtml(label);
    return `<svg class="structure-svg" viewBox="0 0 400 270" role="img" aria-label="${safeLabel}">` +
        `<title>${safeLabel}</title>${diagrams[key]}</svg>` +
        (caption ? `<p class="diagram-reading">${escapeHtml(caption)}</p>` : "");
}
