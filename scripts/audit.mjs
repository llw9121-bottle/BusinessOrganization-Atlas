import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const indexPath = resolve(projectRoot, "index.html");
const html = readFileSync(indexPath, "utf8");

const EXPECTED_STYLESHEETS = [
    "fonts", "tokens", "base", "layout", "atlas", "forms", "lab", "bridge", "canvas",
    "patterns", "design", "cases", "about", "transitions", "footer", "responsive", "overrides"
].map((name) => `styles/${name}.css`);

const EXPECTED_FONTS = [
    "inter", "noto-sans-sc", "noto-sans-sc-b", "noto-sans-jp", "noto-sans-jp-b",
    "noto-sans-jp-c", "noto-sans-jp-d", "noto-sans-kr", "noto-sans-kr-b",
    "archivo", "jetbrains-mono"
].map((name) => `assets/fonts/${name}.woff2`);

// --- Entry document -----------------------------------------------------
const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
assert.equal(scripts.length, 1, "Expected exactly one script element.");
const scriptAttributes = scripts[0][1];
assert.match(scriptAttributes, /\btype\s*=\s*["']module["']/i, "The application script must be a module.");
assert.match(scriptAttributes, /\bsrc\s*=\s*["']js\/app\.js["']/i, "The application entry must be js/app.js.");
assert.equal(scripts[0][2].trim(), "", "The application script must not be inline.");
assert.doesNotMatch(html, /<style\b/i, "Styles must live in external stylesheets.");
assert.doesNotMatch(html, /<[^>]+\son[a-z]+\s*=/i, "Inline event-handler attributes are not allowed.");
assert.doesNotMatch(html, /<[^>]+\sstyle\s*=/i, "Inline style attributes are not allowed.");
assert.match(html, /<meta\s+charset="utf-8">/i, "Expected a UTF-8 charset declaration.");
assert.match(html, /<meta\s+name="viewport"\s+content="[^"]*width=device-width/i, "Expected a responsive viewport.");
assert.match(html, /<meta\s+name="referrer"\s+content="no-referrer"/i, "Expected a no-referrer policy.");

const csp = html.match(/<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]*)"/i)?.[1];
assert.ok(csp, "Expected a Content-Security-Policy meta tag.");
assert.doesNotMatch(csp, /unsafe-inline|unsafe-eval/i, "CSP must not allow unsafe-inline or unsafe-eval.");

const directives = Object.fromEntries(
    csp.split(";").map((directive) => directive.trim()).filter(Boolean).map((directive) => {
        const [name, ...values] = directive.split(/\s+/);
        return [name, values.join(" ")];
    })
);
assert.equal(directives["default-src"], "'self'", "default-src must be 'self'.");
assert.equal(directives["script-src"], "'self'", "script-src must be 'self'.");
assert.equal(directives["style-src"], "'self'", "style-src must be 'self'.");
assert.equal(directives["font-src"], "'self'", "font-src must be 'self'.");
assert.equal(directives["img-src"], "'self' data:", "img-src must allow only self and data images.");
assert.equal(directives["connect-src"], "'none'", "connect-src must be 'none'.");
assert.equal(directives["object-src"], "'none'", "object-src must be 'none'.");
assert.equal(directives["base-uri"], "'none'", "base-uri must be 'none'.");
assert.equal(directives["form-action"], "'none'", "form-action must be 'none'.");

const stylesheetLinks = [...html.matchAll(/<link\s+rel="stylesheet"\s+href="([^"]+)"/g)].map((match) => match[1]);
assert.deepEqual(stylesheetLinks, EXPECTED_STYLESHEETS, "Stylesheets must load in source order.");
for (const stylesheet of stylesheetLinks) {
    assert.ok(existsSync(resolve(projectRoot, stylesheet)), `Missing stylesheet: ${stylesheet}`);
}
assert.match(html, /<link\s+rel="icon"\s+href="assets\/favicon\.svg"/, "Expected the local favicon.");

// --- Fonts and stylesheet assets ---------------------------------------
for (const fontPath of EXPECTED_FONTS) {
    const absolutePath = resolve(projectRoot, fontPath);
    assert.ok(existsSync(absolutePath), `Missing font: ${fontPath}`);
    const magic = readFileSync(absolutePath).subarray(0, 4).toString("ascii");
    assert.equal(magic, "wOF2", `${fontPath} must be a WOFF2 file.`);
}

for (const stylesheet of stylesheetLinks) {
    const absolutePath = resolve(projectRoot, stylesheet);
    const css = readFileSync(absolutePath, "utf8");
    for (const match of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) {
        const target = match[1];
        if (/^(?:data:|https?:|#)/i.test(target)) continue;
        const assetPath = resolve(dirname(absolutePath), target);
        assert.ok(existsSync(assetPath), `${stylesheet} references a missing asset: ${target}`);
    }
}


// --- JavaScript modules ------------------------------------------------
function listJavaScriptFiles(directory) {
    const files = [];
    for (const entry of readdirSync(directory)) {
        const absolutePath = join(directory, entry);
        if (statSync(absolutePath).isDirectory()) {
            files.push(...listJavaScriptFiles(absolutePath));
        } else if (extname(entry) === ".js") {
            files.push(absolutePath);
        }
    }
    return files;
}

const jsFiles = listJavaScriptFiles(resolve(projectRoot, "js"));
assert.ok(jsFiles.length > 0, "Expected JavaScript modules under js/.");

const prohibitedScriptPatterns = [
    [/\beval\s*\(/, "eval"],
    [/\bnew\s+Function\s*\(/, "new Function"],
    [/\bdocument\.write\s*\(/, "document.write"],
    [/\b(?:fetch|XMLHttpRequest|WebSocket|EventSource)\s*\(/, "network API"],
    [/\bnavigator\.sendBeacon\s*\(/, "sendBeacon"],
    [/\bwindow\.open\s*\(/, "window.open"],
    [/\b(?:importScripts|postMessage)\s*\(/, "cross-context messaging"],
    [/\b(?:indexedDB|document\.cookie)\b/, "persistent data API"]
];

const importPattern = /^\s*import\s+(?:[^'"]*?\s+from\s+)?["']([^"']+)["']/gm;
const graph = new Map();

for (const file of jsFiles) {
    const source = readFileSync(file, "utf8");
    const syntaxCheck = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
    assert.equal(syntaxCheck.status, 0, `Syntax error in ${relative(projectRoot, file)}:\n${syntaxCheck.stderr}`);

    for (const [pattern, label] of prohibitedScriptPatterns) {
        assert.doesNotMatch(source, pattern, `Unexpected ${label} usage in ${relative(projectRoot, file)}.`);
    }

    const dependencies = [];
    for (const match of source.matchAll(importPattern)) {
        const specifier = match[1];
        assert.ok(specifier.startsWith("."), `Bare import "${specifier}" in ${relative(projectRoot, file)}.`);
        const dependency = resolve(dirname(file), specifier);
        assert.ok(existsSync(dependency), `Missing import target ${specifier} in ${relative(projectRoot, file)}.`);
        dependencies.push(dependency);
    }
    graph.set(file, dependencies);
}

const visitState = new Map();
const importStack = [];
function visitModule(file) {
    const state = visitState.get(file);
    if (state === "done") return;
    if (state === "visiting") {
        const cycle = [...importStack.slice(importStack.indexOf(file)), file]
            .map((entry) => relative(projectRoot, entry))
            .join(" -> ");
        throw new Error(`Circular import detected: ${cycle}`);
    }
    visitState.set(file, "visiting");
    importStack.push(file);
    for (const dependency of graph.get(file) ?? []) visitModule(dependency);
    importStack.pop();
    visitState.set(file, "done");
}
for (const file of jsFiles) visitModule(file);


// --- Palette contrast --------------------------------------------------
const tokensCss = readFileSync(resolve(projectRoot, "styles/tokens.css"), "utf8");
const palette = Object.fromEntries(
    [...tokensCss.matchAll(/--([a-z-]+):\s*(#[0-9a-f]{6})\s*;/gi)].map((match) => [match[1], match[2]])
);

function relativeLuminance(hex) {
    const channels = hex.slice(1).match(/../g).map((channel) => {
        const value = Number.parseInt(channel, 16) / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(foreground, background) {
    const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background));
    const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background));
    return (lighter + 0.05) / (darker + 0.05);
}

for (const foreground of ["ink", "ink-soft", "muted", "accent", "accent-deep", "teal"]) {
    for (const background of ["paper", "paper-deep", "surface"]) {
        assert.ok(
            contrastRatio(palette[foreground], palette[background]) >= 4.5,
            `${foreground} must meet 4.5:1 contrast on ${background}.`
        );
    }
}

// --- Links and element IDs --------------------------------------------
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
assert.deepEqual([...new Set(duplicateIds)], [], "Element IDs must be unique.");
const idSet = new Set(ids);

const anchors = [...html.matchAll(/<a\b([^>]*)>/gi)].map((match) => match[1]);
for (const attributes of anchors) {
    assert.doesNotMatch(attributes, /\bhref\s*=\s*["']javascript:/i, "JavaScript URLs are not allowed.");

    const href = attributes.match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1];
    assert.ok(href, "Every anchor must have an href.");

    if (/^https?:/i.test(href)) {
        assert.match(href, /^https:/i, "External links must use HTTPS.");
        if (/\btarget\s*=\s*["']_blank["']/i.test(attributes)) {
            assert.match(attributes, /\brel\s*=\s*["'][^"']*noopener[^"']*["']/i, `${href} must use noopener.`);
            assert.match(attributes, /\brel\s*=\s*["'][^"']*noreferrer[^"']*["']/i, `${href} must use noreferrer.`);
        }
    } else if (href.startsWith("#")) {
        assert.ok(idSet.has(href.slice(1)), `Fragment target does not exist: ${href}`);
    } else {
        const localPath = resolve(projectRoot, decodeURIComponent(href.split(/[?#]/)[0]));
        assert.ok(existsSync(localPath), `Local link target does not exist: ${href}`);
    }
}

// Every DOM id referenced from JavaScript must exist in the markup.
for (const file of jsFiles) {
    const source = readFileSync(file, "utf8");
    const referencedIds = [
        ...[...source.matchAll(/getElementById\("([^"]+)"\)/g)].map((match) => match[1]),
        ...[...source.matchAll(/querySelector\("#([\w-]+)/g)].map((match) => match[1])
    ];
    for (const referencedId of referencedIds) {
        assert.ok(idSet.has(referencedId), `${relative(projectRoot, file)} references missing id "${referencedId}".`);
    }
}

// --- Data integrity ----------------------------------------------------
const dataUrl = (name) => pathToFileURL(resolve(projectRoot, "js/data", name)).href;
const { forms } = await import(dataUrl("forms.js"));
const { modelProfiles } = await import(dataUrl("model-profiles.js"));
const { diagrams } = await import(dataUrl("diagrams.js"));
const { forces, presets } = await import(dataUrl("forces.js"));
const { stages } = await import(dataUrl("stages.js"));
const { routes } = await import(dataUrl("routes.js"));
const { canvasBlocks } = await import(dataUrl("canvas-blocks.js"));
const { businessModelPatterns } = await import(dataUrl("patterns.js"));
const { designEpicenters } = await import(dataUrl("design-epicenters.js"));
const { bridgeGroups, bridgePresets, bridgeTensionRules } = await import(dataUrl("bridge.js"));
const { translations } = await import(pathToFileURL(resolve(projectRoot, "js/i18n/translations.js")).href);
const { studioTranslations } = await import(pathToFileURL(resolve(projectRoot, "js/i18n/studio-translations.js")).href);
const { formLearning, canvasConnections, searchExample, lessonNotes } = await import(dataUrl("learning.js"));

const formKeys = Object.keys(forms);
assert.deepEqual(Object.keys(formLearning), formKeys, "Every form needs a plain-language explanation and diagram caption.");
const learningSources = [];
for (const learning of Object.values(formLearning)) {
    assert.ok(learning.plain && learning.diagram, "Form learning text must be present.");
    learningSources.push(learning.plain, learning.diagram);
}
assert.deepEqual(Object.keys(searchExample).sort(), Object.keys(canvasBlocks).sort(), "The guided example must cover every Canvas block.");
assert.deepEqual(Object.keys(canvasConnections).sort(), Object.keys(canvasBlocks).sort(), "Every Canvas block must explain its connections.");
for (const [blockKey, connection] of Object.entries(canvasConnections)) {
    assert.ok(connection.explanation && connection.related.length > 0, `Canvas block ${blockKey} needs an explanation and related blocks.`);
    assert.equal(new Set(connection.related).size, connection.related.length, `Duplicate connection in ${blockKey}.`);
    for (const related of connection.related) {
        assert.ok(related in canvasBlocks && related !== blockKey, `Invalid Canvas connection ${blockKey}/${related}.`);
    }
    learningSources.push(connection.explanation);
}
learningSources.push(...Object.values(searchExample), ...Object.values(lessonNotes));
const studioKeys = Object.keys(studioTranslations.zh).sort();
for (const locale of ["zh", "ja", "ko", "es", "fr"]) {
    assert.deepEqual(Object.keys(studioTranslations[locale]).sort(), studioKeys, `Studio translation keys differ in ${locale}.`);
    for (const source of [...studioKeys, ...learningSources]) {
        assert.equal(typeof translations[locale].strings[source], "string", `Missing ${locale} learning translation: ${source}`);
        assert.ok(translations[locale].strings[source].trim(), `Empty ${locale} learning translation: ${source}`);
    }
}
assert.deepEqual(Object.keys(modelProfiles), formKeys, "Every form needs exactly one model profile.");
assert.deepEqual(Object.keys(diagrams), formKeys, "Every form needs exactly one structural diagram.");
for (const [formKey, form] of Object.entries(forms)) {
    assert.ok(form.diagram in diagrams, `Form ${formKey} references a missing diagram.`);
}

const forceKeys = Object.keys(forces);
for (const [forceKey, force] of Object.entries(forces)) {
    assert.ok(force.form in forms, `Force ${forceKey} references a missing form.`);
}
for (const [presetKey, preset] of Object.entries(presets)) {
    for (const forceKey of forceKeys) {
        assert.equal(typeof preset[forceKey], "number", `Preset ${presetKey} is missing ${forceKey}.`);
        assert.ok(preset[forceKey] >= 0 && preset[forceKey] <= 100, `Preset ${presetKey}.${forceKey} is out of range.`);
    }
}

const groupKeys = Object.keys(bridgeGroups);
assert.deepEqual(groupKeys, ["customer", "value", "economics", "boundary"], "Unexpected bridge group set.");
for (const [groupKey, group] of Object.entries(bridgeGroups)) {
    const optionKeys = Object.keys(group.options);
    assert.ok(optionKeys.length >= 2, `Bridge group ${groupKey} needs at least two options.`);
    for (const [optionKey, option] of Object.entries(group.options)) {
        assert.ok(option.label && option.insight, `Bridge option ${groupKey}/${optionKey} needs label and insight.`);
        for (const [formKey, score] of Object.entries(option.supports ?? {})) {
            assert.ok(formKey in forms, `Bridge option ${groupKey}/${optionKey} supports unknown form ${formKey}.`);
            assert.equal(typeof score, "number", `Bridge option ${groupKey}/${optionKey} score must be numeric.`);
        }
    }
}
const tensionIds = new Set(bridgeTensionRules.map((rule) => rule.id));
for (const [presetKey, preset] of Object.entries(bridgePresets)) {
    assert.ok(tensionIds.has(preset.tensionId), `Bridge preset ${presetKey} references a missing tension.`);
    for (const groupKey of groupKeys) {
        const optionKey = preset.selection[groupKey];
        assert.ok(optionKey in bridgeGroups[groupKey].options, `Bridge preset ${presetKey} has an invalid ${groupKey} option.`);
    }
}
for (const [patternKey, pattern] of Object.entries(businessModelPatterns)) {
    assert.ok(pattern.bridgePreset in bridgePresets, `Pattern ${patternKey} references a missing bridge preset.`);
}

assert.ok(Object.keys(stages).length > 0, "Expected at least one life-cycle stage.");
assert.ok(Object.keys(routes).length > 0, "Expected at least one transition route.");
for (const [blockKey, block] of Object.entries(canvasBlocks)) {
    assert.ok(block.zone && block.number, `Canvas block ${blockKey} is missing zone metadata.`);
}
assert.ok(Object.keys(designEpicenters).length > 0, "Expected at least one design epicenter.");

// --- Markup-to-data foreign keys --------------------------------------
const markupValues = (attribute) =>
    [...html.matchAll(new RegExp(`\\b${attribute}="([^"]+)"`, "g"))].map((match) => match[1]);

for (const formKey of markupValues("data-form")) {
    assert.ok(formKey in forms, `Unknown data-form value: ${formKey}`);
}
for (const formKey of markupValues("data-form-index")) {
    assert.ok(formKey in forms, `Unknown data-form-index value: ${formKey}`);
}
for (const forceKey of markupValues("data-force")) {
    assert.ok(forceKey in forces, `Unknown data-force value: ${forceKey}`);
}
for (const forceKey of markupValues("data-force-slider")) {
    assert.ok(forceKey in forces, `Unknown data-force-slider value: ${forceKey}`);
}
for (const forceKey of markupValues("data-force-control")) {
    assert.ok(forceKey in forces, `Unknown data-force-control value: ${forceKey}`);
}
for (const presetKey of markupValues("data-preset")) {
    assert.ok(presetKey in presets, `Unknown data-preset value: ${presetKey}`);
}
for (const blockKey of markupValues("data-canvas-block")) {
    assert.ok(blockKey in canvasBlocks, `Unknown data-canvas-block value: ${blockKey}`);
}
for (const patternKey of markupValues("data-pattern")) {
    assert.ok(patternKey in businessModelPatterns, `Unknown data-pattern value: ${patternKey}`);
}
for (const epicenterKey of markupValues("data-design-epicenter")) {
    assert.ok(epicenterKey in designEpicenters, `Unknown data-design-epicenter value: ${epicenterKey}`);
}
for (const stageKey of markupValues("data-stage")) {
    assert.ok(stageKey in stages, `Unknown data-stage value: ${stageKey}`);
}
for (const routeKey of markupValues("data-route")) {
    assert.ok(routeKey in routes, `Unknown data-route value: ${routeKey}`);
}
for (const presetKey of markupValues("data-bridge-preset")) {
    assert.ok(presetKey in bridgePresets, `Unknown data-bridge-preset value: ${presetKey}`);
}
for (const presetKey of markupValues("data-case-bridge")) {
    assert.ok(presetKey in bridgePresets, `Unknown data-case-bridge value: ${presetKey}`);
}
for (const viewName of markupValues("data-about-target")) {
    assert.ok(idSet.has(`view-${viewName}`), `Unknown data-about-target value: ${viewName}`);
}
for (const tag of html.matchAll(/<[^>]*\bdata-bridge-option="[^"]+"[^>]*>/g)) {
    const groupKey = tag[0].match(/\bdata-bridge-group="([^"]+)"/)?.[1];
    const optionKey = tag[0].match(/\bdata-bridge-option="([^"]+)"/)?.[1];
    assert.ok(groupKey, `Bridge option ${optionKey} is missing data-bridge-group.`);
    assert.ok(groupKey in bridgeGroups, `Unknown data-bridge-group value: ${groupKey}`);
    assert.ok(optionKey in bridgeGroups[groupKey].options, `Unknown bridge option: ${groupKey}/${optionKey}`);
}

// --- Locales and documentation ----------------------------------------
const expectedLocales = ["en", "zh", "ja", "ko", "es", "fr"];
for (const locale of expectedLocales) {
    assert.ok(translations[locale]?.strings, `Missing translation locale: ${locale}`);
}
assert.equal(Object.keys(translations.en.strings).length, 0, "English source strings need no translation table.");
const i18nSource = readFileSync(resolve(projectRoot, "js/i18n/i18n.js"), "utf8");
assert.match(i18nSource, /export function t\(source\)/, "Expected the t() helper.");

const readmeLanguages = ["README.md", "README.en.md", "README.ja.md", "README.ko.md", "README.es.md", "README.fr.md"];
for (const readme of readmeLanguages) {
    const readmePath = resolve(projectRoot, readme);
    assert.ok(existsSync(readmePath), `Missing README: ${readme}`);
    const content = readFileSync(readmePath, "utf8");
    for (const languageReadme of readmeLanguages) {
        if (languageReadme === readme) continue;
        assert.ok(content.includes(languageReadme), `${readme} must link to ${languageReadme}.`);
    }
    for (const match of content.matchAll(/\]\(([^)]+)\)/g)) {
        const target = match[1];
        if (/^(?:https?:|#|mailto:)/i.test(target)) continue;
        const localTarget = decodeURIComponent(target.split(/[?#]/)[0]);
        assert.ok(existsSync(resolve(projectRoot, localTarget)), `${readme} links to a missing file: ${target}`);
    }
}

console.log(
    `Audit passed: ${jsFiles.length} modules, ${ids.length} unique IDs, ${anchors.length} safe links, ` +
    `${EXPECTED_FONTS.length} WOFF2 fonts, ${groupKeys.length} bridge groups, no active-data APIs.`
);
