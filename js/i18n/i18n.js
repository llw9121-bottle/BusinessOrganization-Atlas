import { defaultLanguage } from "./languages.js";
import { translations } from "./translations.js";

let currentLanguage = defaultLanguage;

// Translation sources are cached by node so switching languages never loses the
// original English text that keys the dictionary.
const translatedTextSources = new WeakMap();
const translatedAttributeSources = new WeakMap();

export function getLanguage() {
    return currentLanguage;
}

export function isSupportedLanguage(languageCode) {
    return Boolean(translations[languageCode]);
}

export function setLanguageCode(languageCode) {
    currentLanguage = isSupportedLanguage(languageCode) ? languageCode : defaultLanguage;
    return currentLanguage;
}

export function t(source) {
    if (!source) return source;
    return translations[currentLanguage]?.strings?.[source] ?? source;
}

export function applyStaticTranslations(root = document) {
    const scope = root.nodeType === Node.DOCUMENT_NODE ? root.body : root;
    if (!scope) return;
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
    const skipped = new Set(["SCRIPT", "STYLE", "NOSCRIPT"]);
    let node;
    while ((node = walker.nextNode())) {
        const parent = node.parentElement;
        if (!parent || skipped.has(parent.tagName) || parent.closest("[data-no-translate]")) continue;
        if (!node.nodeValue.trim()) continue;
        if (!translatedTextSources.has(node)) translatedTextSources.set(node, node.nodeValue);
        const source = translatedTextSources.get(node);
        const leading = source.match(/^\s*/)[0];
        const trailing = source.match(/\s*$/)[0];
        const core = source.trim();
        node.nodeValue = `${leading}${t(core)}${trailing}`;
    }

    const attributes = ["aria-label", "title"];
    scope.querySelectorAll("[aria-label], [title]").forEach((element) => {
        if (element.closest("[data-no-translate]")) return;
        let originals = translatedAttributeSources.get(element);
        if (!originals) {
            originals = new Map();
            translatedAttributeSources.set(element, originals);
        }
        attributes.forEach((attribute) => {
            if (!element.hasAttribute(attribute)) return;
            if (!originals.has(attribute)) originals.set(attribute, element.getAttribute(attribute));
            element.setAttribute(attribute, t(originals.get(attribute)));
        });
    });
}
