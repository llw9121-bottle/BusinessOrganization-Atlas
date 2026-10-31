import { t } from "../i18n/i18n.js";

const navButtons = Array.from(document.querySelectorAll(".nav-button"));
const views = Array.from(document.querySelectorAll(".view"));
const primaryNav = document.getElementById("primary-nav");
const navToggle = document.getElementById("nav-toggle");
const navToggleLabel = document.getElementById("nav-toggle-label");

export function refreshNavigationLabel() {
    const navIsOpen = navToggle.getAttribute("aria-expanded") === "true";
    const label = t(navIsOpen ? "Close navigation" : "Open navigation");
    navToggle.setAttribute("aria-label", label);
    navToggleLabel.textContent = label;
}

function setNavigationOpen(open, returnFocus = false) {
    primaryNav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    refreshNavigationLabel();
    if (open) {
        const activeButton = navButtons.find((button) => button.getAttribute("aria-selected") === "true");
        activeButton?.focus();
    } else if (returnFocus && navToggle.offsetParent !== null) {
        navToggle.focus();
    }
}

export function closeNavigation(returnFocus = false) {
    if (primaryNav.classList.contains("is-open")) {
        setNavigationOpen(false, returnFocus);
    }
}

export function showView(viewName, updateHash = true, keepNavigationOpen = false) {
    navButtons.forEach((button) => {
        const active = button.dataset.view === viewName;
        button.setAttribute("aria-selected", String(active));
        button.tabIndex = active ? 0 : -1;
    });
    views.forEach((view) => {
        view.hidden = view.id !== `view-${viewName}`;
    });
    if (updateHash && history.replaceState) {
        history.replaceState(null, "", `#${viewName}`);
    }
    if (!keepNavigationOpen) closeNavigation(primaryNav.classList.contains("is-open"));
    document.dispatchEvent(new CustomEvent("atlas:view-change", { detail: viewName }));
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
}

export function initNavigation() {
    navToggle.addEventListener("click", () => {
        const open = navToggle.getAttribute("aria-expanded") !== "true";
        setNavigationOpen(open);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeNavigation(true);
    });

    document.addEventListener("click", (event) => {
        if (!primaryNav.classList.contains("is-open")) return;
        if (!primaryNav.contains(event.target) && !navToggle.contains(event.target)) {
            closeNavigation(false);
        }
    });

    const desktopNavigation = window.matchMedia("(min-width: 1001px)");
    desktopNavigation.addEventListener("change", (event) => {
        if (event.matches) closeNavigation(false);
    });

    navButtons.forEach((button, index) => {
        button.addEventListener("click", () => showView(button.dataset.view));
        button.addEventListener("keydown", (event) => {
            if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
            event.preventDefault();
            const direction = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
            const nextIndex = event.key === "Home" ? 0 :
                event.key === "End" ? navButtons.length - 1 :
                    (index + direction + navButtons.length) % navButtons.length;
            const nextButton = navButtons[nextIndex];
            showView(nextButton.dataset.view, true, true);
            nextButton.focus();
        });
    });
}
