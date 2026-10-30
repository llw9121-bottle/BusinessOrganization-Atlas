const oneLineHeadlines = Array.from(document.querySelectorAll("h1, h2"));

oneLineHeadlines.forEach((heading) => {
    heading.classList.add("fit-one-line");
    heading.querySelectorAll(":scope > br").forEach((breakElement) => {
        breakElement.replaceWith(document.createTextNode(" "));
    });
});

let oneLineFitFrame = 0;

function fitOneLineHeadlines() {
    oneLineFitFrame = 0;
    const viewportScale = window.innerWidth <= 620 ? 0.72 : 1;

    oneLineHeadlines.forEach((heading) => {
        heading.classList.remove("is-single-line");
        heading.style.removeProperty("font-size");

        const parent = heading.parentElement;
        if (!parent || !parent.getClientRects().length) return;

        const minimumSize = (heading.tagName === "H1" ? 30 : 28) * viewportScale;
        const priorityScale = viewportScale;
        const availableWidth = heading.getBoundingClientRect().width - 1;
        if (!availableWidth) return;

        heading.classList.add("is-single-line");

        const naturalWidth = heading.scrollWidth;
        if (!naturalWidth) return;

        const currentSize = Number.parseFloat(getComputedStyle(heading).fontSize);
        const requiredSize = currentSize * priorityScale * Math.min(1, availableWidth / naturalWidth);

        if (requiredSize < minimumSize) {
            heading.classList.remove("is-single-line");
            return;
        }

        heading.style.fontSize = `${Math.floor(requiredSize * 100) / 100}px`;
    });
}

export function scheduleOneLineFit() {
    if (oneLineFitFrame) cancelAnimationFrame(oneLineFitFrame);
    oneLineFitFrame = requestAnimationFrame(fitOneLineHeadlines);
}

const headlineResizeObserver = typeof ResizeObserver === "function"
    ? new ResizeObserver(scheduleOneLineFit)
    : null;
oneLineHeadlines.forEach((heading) => headlineResizeObserver?.observe(heading.parentElement));
window.addEventListener("resize", scheduleOneLineFit);
