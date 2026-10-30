import { showView } from "./navigation.js";

export function initAboutView() {
    document.querySelectorAll("[data-about-target]").forEach((button) => {
        button.addEventListener("click", () => showView(button.dataset.aboutTarget));
    });
}
