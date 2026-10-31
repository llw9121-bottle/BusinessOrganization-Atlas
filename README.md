# Business × Organization Atlas

**English** · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md)

An interactive atlas that connects **business-model choices** with **organizational forms, forces, and
transitions**. It is an interpretive field guide to Henry Mintzberg's *Understanding Organizations...
Finally!* (Berrett-Koehler, 2023), not a replacement for the book.

It is built for founders, operators, consultants, and students who want to ask better questions about
why an organization works the way it does — and what would have to change for a different model to fit.

- **No account, no backend, no analytics.** Every calculation runs in your browser.
- **Six languages.** English, 简体中文, 日本語, 한국어, Español, and Français switch instantly.
- **No build step and no dependencies.** Plain HTML, CSS, and native ES modules.

The interface combines an editorial reading experience with an interactive learning studio: a guided
Google Search example, connected Canvas blocks, saved-versus-current Bridge scenarios, and two-form
comparisons. Scenario and lesson state last only for the current page visit; they are not persisted.

## Take the tour

The atlas has ten sections. The first one, Bridge, opens by default.

| Section | What you can do |
| --- | --- |
| **01 Bridge** | Choose four business-model moves and see which organizational form they favor, where they strain, and what counterweight keeps them healthy. |
| **02 Canvas** | Walk through the nine business-model blocks with an organizational lens. |
| **03 Patterns** | Explore five recurring model patterns: unbundled, long tail, multi-sided, free, and open. |
| **04 Design** | Start from a design epicenter, then follow the moves and questions that connect model to organization. |
| **05 Cases** | Read real-company examples and jump straight into the matching Bridge scenario. |
| **06 Atlas** | Place the four fundamental forms on a diamond map and inspect the three secondary forms. |
| **07 Forms** | Read deep profiles of all seven forms: coordination engine, power pattern, conditions, risk, and examples. |
| **08 Forces** | Raise the seven forces with sliders; the studio names the form they favor and the counterweight that contains it. |
| **09 Change** | Follow life-cycle stages and common transition routes. |
| **10 About** | Read the source, scope, and method behind the interpretation. |

## Quick start

You need **Node.js 18+** or **Python 3** — only to serve static files. There is nothing to install or build.

```bash
# Recommended: built-in dependency-free Node server
npm start
```

```bash
# Alternative: Python's static server
python -m http.server 8765 --bind 127.0.0.1
```

Open <http://127.0.0.1:8765/>. To stop the server, press `Ctrl+C`.

**Why a local server?** The application uses native ES modules. Browsers block module imports from
`file://` pages for security reasons, so opening `index.html` by double-clicking will show an empty or
broken page. Serving it over HTTP fixes that without changing the code.

If port 8765 is already in use:

```bash
PORT=9000 npm start
```

On Windows PowerShell: `$env:PORT=9000; npm start`.

## Project structure

```text
index.html                  Semantic markup and the single entry point
package.json                Scripts only; no runtime dependencies
styles/                     One stylesheet per layer or view
  fonts.css                 @font-face declarations for nine local WOFF2 files
  tokens.css                Colour, spacing, and typography variables
  base.css                  Reset and document defaults; headings wrap naturally
  layout.css                Header, navigation, language picker, view shell
  atlas.css ... overrides.css  View-level styles, in source order
assets/fonts/               Inter, Noto Sans SC/JP/KR subsets plus licence text
js/
  app.js                    Composition root: init, language control, hash routing
  core/html.js              HTML escaping and diagram rendering
  i18n/                     Language metadata, translations, t(), localized labels
  data/                     Pure data: forms, forces, stages, routes, bridge rules...
  ui/                       One module per view; owns its state and rendering
scripts/
  serve.mjs                 Dependency-free local static server
  audit.mjs                 Structural, security, accessibility, and data audit
```

## How it is built

The modules form a one-way dependency chain:

```text
data  ->  i18n  ->  ui  ->  app.js
```

- **`js/data/`** modules are leaves. They export plain objects and import nothing, so they are easy to
  test, diff, and reuse.
- **`js/i18n/`** owns the current language. Translation keys are the exact English source strings used in
  the markup and data, so English never needs a lookup table and missing translations fall back safely.
- **`js/ui/`** contains one module per view. Each module owns its own state and exports `renderXView()`
  and `initXView()`. Cross-view actions go through a narrow API: for example, other views call
  `applyBridgePreset()` rather than mutating bridge state directly.
- **`js/app.js`** is the composition root. It wires modules together, renders in a fixed order, manages
  the language selector, and handles `#bridge`, `#atlas`, and other deep links.

A few implementation notes:

- CSS files are linked in their original cascade order. `responsive.css` and `overrides.css` must stay
  last.
- The language preference is the only value stored in `localStorage`
  (`organization-atlas-language`). Read and write failures are handled.
- Navigation uses `history.replaceState`, so switching tabs does not flood browser history.
- Headings wrap naturally across languages and viewport sizes. Reduced-motion preferences disable
  interface transitions and smooth scrolling.
- `js/data/learning.js` holds diagram captions, Canvas connections, and the guided example. The new
  learning vocabulary is translated in `js/i18n/studio-translations.js`; the audit checks all five locales.

## Common tasks

**Change copy or domain data.** Edit the relevant file in `js/data/` or the text in `index.html`. The
data files are plain objects, so no build step is involved.

**Add or correct a translation.** Find the English source string (the translation key) and add it to the
matching locale in `js/i18n/translations.js`. For a one-off addition, follow the existing
`Object.assign(translations.<locale>.strings, { ... })` pattern at the bottom of that file.

**Add a language.** Add an entry to `js/i18n/languages.js`, add or assign a `translations.<locale>`
object, and add an `<option>` to `#language-select` in `index.html`.

**Add a form or a force.** Update the matching data module, add the corresponding markup controls, and
extend the bridge and model-profile data. Run the audit afterwards; it checks foreign keys across all
of these files.

## Quality checks

```bash
npm run audit
```

The audit is dependency-free and verifies:

- Every JavaScript module parses, imports only relative paths, and the import graph is acyclic.
- The page has exactly one external module script, no inline scripts or styles, and no inline event
  handlers or `style` attributes.
- The Content Security Policy is deny-by-default and contains no `unsafe-inline` or `unsafe-eval`.
- Stylesheets load in the expected order, and every CSS `url()` target and WOFF2 font exists and is valid.
- Element IDs are unique; every fragment, local link, and external HTTPS link is safe; external links use
  `noopener noreferrer`.
- Every DOM ID referenced from JavaScript exists in the markup.
- Data foreign keys are consistent: forms, profiles, diagrams, forces, presets, bridge groups, bridge
  presets, tension rules, patterns, stages, routes, canvas blocks, and design epicenters.
- The main text palette meets WCAG AA contrast (4.5:1) on all three background colours.
- All six README language versions are present.

## Safety and privacy

- The page makes **no network requests** and has no backend, analytics, cookies, forms, iframes, or
  user-content ingestion.
- The only persisted value is the selected language in `localStorage`.
- External case and licence links open only after an explicit click and use
  `rel="noopener noreferrer"`.
- Dynamic HTML templates escape translated text. Structural SVG bodies remain trusted static source data.
- The CSP blocks remote resources and all data connections. When serving publicly, add a
  response-header CSP and `frame-ancestors 'none'` at the web server or CDN.

## Fonts and licences

The page bundles local WOFF2 subsets of **Inter** and **Noto Sans SC / JP / KR**. These fonts are
licensed under the SIL Open Font License 1.1. Full attribution and licence text:

- [`assets/fonts/FONT-LICENSES.txt`](assets/fonts/FONT-LICENSES.txt)

No font is loaded from a third-party server.

## Source and scope

This interface condenses chapters 2–21 of Henry Mintzberg, *Understanding Organizations...Finally!:
Structure in Sevens* (Berrett-Koehler, 2023). It is an independent, interpretive overview. It does not
reproduce the book, and it is not a validated diagnostic instrument. Treat every result as a hypothesis
to test against real work, incentives, power, history, and customer evidence.

## Browser support

Current versions of Chrome, Edge, Firefox, and Safari. The app needs ES modules,
`localStorage`, and modern CSS; it works offline once loaded.
