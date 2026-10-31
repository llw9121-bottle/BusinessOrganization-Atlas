import { defaultLanguage, languageMeta } from "./i18n/languages.js";
import { applyStaticTranslations, setLanguageCode, t } from "./i18n/i18n.js";
import { initNavigation, refreshNavigationLabel, showView } from "./ui/navigation.js";
import { initAtlasView, renderAtlasView } from "./ui/atlas-view.js";
import { initFormDetail, renderFormDetail } from "./ui/form-detail.js";
import { initBridgeView, updateBridge } from "./ui/bridge-view.js";
import { initCanvasView, renderCanvasView } from "./ui/canvas-view.js";
import { initPatternView, renderPatternView } from "./ui/pattern-view.js";
import { initDesignView, renderDesignView } from "./ui/design-view.js";
import { initLabView, renderLabView } from "./ui/lab-view.js";
import { initTransitionsView, renderTransitionsView } from "./ui/transitions-view.js";
import { initCasesView } from "./ui/cases-view.js";
import { initAboutView } from "./ui/about-view.js";
import { initLearningView, renderLearningView } from "./ui/learning-view.js";

const VIEW_NAMES = [
    "bridge", "canvas", "patterns", "design", "cases",
    "atlas", "forms", "forces", "transitions", "about"
];
const LANGUAGE_STORAGE_KEY = "organization-atlas-language";

function renderLocalizedState() {
    renderAtlasView();
    renderFormDetail();
    updateBridge();
    renderCanvasView();
    renderPatternView();
    renderDesignView();
    renderLabView();
    renderTransitionsView();
    renderLearningView();
}

function applyLanguage(languageCode, persist = true) {
    const activeLanguage = setLanguageCode(languageCode);
    const select = document.getElementById("language-select");
    select.value = activeLanguage;
    select.setAttribute("aria-label", t("Language"));
    refreshNavigationLabel();
    document.documentElement.lang = languageMeta[activeLanguage].htmlLang;
    document.title = t("Business × Organization Atlas");
    applyStaticTranslations(document);
    renderLocalizedState();
    applyStaticTranslations(document);
    if (persist) {
        try {
            localStorage.setItem(LANGUAGE_STORAGE_KEY, activeLanguage);
        } catch (error) {
            // Local storage may be unavailable in some sandboxed previews.
        }
    }
}

function currentViewFromHash() {
    const candidate = location.hash.replace("#", "");
    return VIEW_NAMES.includes(candidate) ? candidate : null;
}

function init() {
    initNavigation();
    initAtlasView();
    initFormDetail();
    initBridgeView();
    initCanvasView();
    initPatternView();
    initDesignView();
    initLabView();
    initTransitionsView();
    initCasesView();
    initAboutView();
    initLearningView();

    document.getElementById("language-select").addEventListener("change", (event) => {
        applyLanguage(event.target.value);
    });

    showView(currentViewFromHash() ?? "bridge", false);

    window.addEventListener("hashchange", () => {
        const nextView = currentViewFromHash();
        if (nextView) showView(nextView, false);
    });

    let savedLanguage = defaultLanguage;
    try {
        savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) || defaultLanguage;
    } catch (error) {
        savedLanguage = defaultLanguage;
    }
    applyLanguage(savedLanguage, false);
}

init();
