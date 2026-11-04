---
name: Business × Organization Atlas
description: An interactive explainer that scores which of Mintzberg's organizational forms fits a business model, drawn as structural engineering.
colors:
  paper: "#e7eaee"
  paper-deep: "#dbe0e6"
  surface: "#f5f6f8"
  ink: "#16181d"
  ink-soft: "#3c434c"
  muted: "#535b65"
  line: "#c3cad3"
  line-strong: "#8d98a6"
  accent: "#b02a1e"
  accent-deep: "#8c2016"
  accent-soft: "#f4e3df"
  teal: "#1f5c8a"
  gold: "#8a5a00"
  dark: "#12181f"
  light: "#ffffff"
typography:
  display:
    fontFamily: "Archivo, 'Noto Sans SC', sans-serif"
    fontSize: "clamp(2.65rem, 5.6vw, 5.25rem)"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "-0.05em"
  headline:
    fontFamily: "Archivo, 'Noto Sans SC', sans-serif"
    fontSize: "clamp(2rem, 3.6vw, 3.25rem)"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Archivo, 'Noto Sans SC', sans-serif"
    fontSize: "clamp(1.25rem, 2vw, 1.75rem)"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, 'Noto Sans SC', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'JetBrains Mono', 'Noto Sans SC', monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "0.08em"
  fallback:
    cjk:
      - "Noto Sans SC"
      - "Noto Sans SC B"
      - "Noto Sans JP"
      - "Noto Sans JP B"
      - "Noto Sans JP C"
      - "Noto Sans JP D"
      - "Noto Sans KR"
      - "Noto Sans KR B"
rounded:
  sm: "2px"
  md: "4px"
  lg: "8px"
spacing:
  space-1: "4px"
  space-2: "8px"
  space-3: "12px"
  space-4: "16px"
  space-5: "24px"
  space-6: "32px"
  space-7: "48px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.light}"
    rounded: "{rounded.md}"
    padding: "0.65rem 1.1rem"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0.65rem 1.1rem"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.accent-deep}"
    rounded: "{rounded.md}"
  chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
  nav-button:
    textColor: "{colors.ink-soft}"
    typography: "{typography.label}"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
  brand-seal:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.light}"
    rounded: "{rounded.md}"
    size: "42px"
---

# Design System: Business × Organization Atlas

## Overview

**Creative North Star: "Structural Engineering · Mechanics Language"**

The interface is a drafting table, not a marketing page. Every screen is built from cool drafting paper, near-black drafting ink, hairline rules, and line-weight depth; soft shadows are absent. Two accents carry all meaning: signal red (`#b02a1e`) for load and tension, structural steel blue (`#1f5c8a`) for members, fit, and balance. Labels and data are set in a true monospace (JetBrains Mono) so they read as engineering callouts; headings are set in a serif display (Archivo) so they read as load-bearing frames. Corners are near-square, with a 4px radius as the nominal corner and 8px as the ceiling.

The system's density is high but legible: one page holds ten views and two interactive instruments, so hierarchy is carried by line weight, rule placement, and the mono/serif split rather than by color or size alone. Motion is short (160–220ms) and functional; `prefers-reduced-motion` collapses all of it.

### World

The whole system is one metaphor: structural engineering · mechanics language.

- business model → **loads** (the four Bridge choices: customers, value, funding, boundary)
- organizational form → **frame** (the seven Mintzberg forms)
- Bridge → **selection** (matching loads to frames)
- coordination forces → **stresses** (the seven pulls on a form)
- fit → **equilibrium** (the ranked result settling into signal red)

**Key Characteristics:**

- Drafting paper + hairline rules + line-weight depth, no soft shadows.
- Dual accents only: signal red (load/tension) and steel blue (member/fit).
- True monospace for labels and data; serif display for headings; Inter for body.
- Near-square corners; a 4px radius is the nominal corner.
- Tabular numerals throughout; CJK fallbacks behind every Latin face.
- Content density with engineering annotation instead of decoration.

## Colors

A cool, desaturated drafting palette: three light backgrounds, three inks, two hairlines, and three semantic accents. All six audited foregrounds hold ≥4.5:1 on all three backgrounds.

### Primary

- **Signal Red** (`#b02a1e`): load, tension, and the settled equilibrium. The primary accent appears on the brand seal, the selected nav underline, primary buttons, dominant vectors, load arrows, and the primary frame in the Bridge diagram. Rarity is the point.
- **Deep Signal Red** (`#8c2016`): accent text and pressed states on light surfaces; the readable red for labels, links, and primary ranks.
- **Red Wash** (`#f4e3df`): the accent's tinted background; selected chips, hover wash, hints, and primary-frame emphasis.

### Secondary

- **Structural Steel Blue** (`#1f5c8a`): members, fit, and balance. Used for the reaction member and adjacent frame in the Bridge diagram, the anchor vector in the Forces diagram, containment/anchor copy, and the transition timeline rail.

### Tertiary

- **Amber** (`#8a5a00`): warning and degraded state; one segment of the transition stage rail. Rare and semantic.

### Neutral

- **Drafting Paper** (`#e7eaee`): the page background and diagram ground, with a faint 28px grid.
- **Deep Paper** (`#dbe0e6`): tinted zones, score tracks, and raised washes between rules.
- **Panel Surface** (`#f5f6f8`): cards, chips, inputs, and result panels sitting on the paper.
- **Drafting Ink** (`#16181d`): primary text; near-black, never pure black.
- **Soft Ink** (`#3c434c`): secondary body copy and summaries.
- **Muted Ink** (`#535b65`): labels, captions, and tertiary text.
- **Hairline Rule** (`#c3cad3`): the default 1px divider and border.
- **Strong Rule** (`#8d98a6`): the emphasized 1px border, masthead rule, and diagram guides.
- **Blueprint Dark** (`#12181f`): dark result/hero panels; light text and steel-blue structure live on it.
- **White** (`#ffffff`): inverted text and the brand seal glyph.

### Named Rules

**The Two-Accent Rule.** Signal red and steel blue are the only hues with semantic weight. Any new color must carry meaning; decoration never gets a new hue.

**The Rarity Rule.** Signal red is used on ≤10% of any screen; its scarcity is what makes equilibrium land.

## Typography

**Display Font:** Archivo (with `Noto Sans SC`/`JP`/`KR` fallback) — headings, h1/h2/h3, and the serif-voice summaries and quotes.
**Body Font:** Inter (with `Noto Sans SC`/`JP`/`KR` fallback) — body copy, UI controls, and inputs.
**Label/Mono Font:** JetBrains Mono (with `Noto Sans SC`/`JP`/`KR` fallback) — micro-labels, data, ranks, values, and diagram captions.

**CJK Fallback Fonts:** `Noto Sans SC`, `Noto Sans SC B`, `Noto Sans JP`, `Noto Sans JP B`, `Noto Sans JP C`, `Noto Sans JP D`, `Noto Sans KR`, `Noto Sans KR B` — self-hosted, one per script, behind every Latin face.

**Character:** Archivo's structural letterforms read as frames carrying load; JetBrains Mono's tabular, technical letterforms read as drafting annotation. The pairing is the system's primary hierarchy device.

### Hierarchy

- **Display** (400, `clamp(2.65rem, 5.6vw, 5.25rem)`, 1.12, `-0.05em`): the h1; hero and section titles.
- **Headline** (400, `clamp(2rem, 3.6vw, 3.25rem)`, 1.12, `-0.04em`): the h2; view headers and result titles.
- **Title** (400, `clamp(1.25rem, 2vw, 1.75rem)`, 1.12, `-0.02em`): the h3; sub-headers and tension titles.
- **Body** (400, 1rem/16px, 1.5): the default; body copy, `max-width` 58–75ch where set.
- **Label** (500, 0.75rem/12px, 1.25, `0.08em`, uppercase): micro-labels, data, values, and diagram captions.

The numeric scale steps, smallest to largest: **micro** 0.75rem (12px) → **caption** 0.8125rem (13px) → **ui** 0.875rem (14px) → **body-sm/body-md** 0.9375rem (15px) → **body** 1rem (16px) → **lead** 1.0625rem (17px) → **lead-lg** 1.125rem (18px) → **section** 1.25rem (20px). Tabular numerals (`font-variant-numeric: tabular-nums`) are set globally.

### Named Rules

**The 11px Floor Rule.** No text drops below 11px; micro-labels floor at 12px (`--type-micro`) and body copy at 16px (`--type-body`). The 11px value exists only for in-SVG diagram captions and ranks.

**The Mono-Annotation Rule.** Labels, data, ranks, and values are JetBrains Mono uppercase with 0.08em tracking; prose headings and summaries are Archivo serif. The two voices never merge: a heading is never a mono tag, a data value is never a serif.

## Layout

The shell is `width: min(calc(100% - clamp(2rem, 6vw, 6rem)), 1320px)` centered, with a `1320px` content ceiling (`--content`). The spacing rhythm is a 4px base: `--space-1` 4px, `--space-2` 8px, `--space-3` 12px, `--space-4` 16px, `--space-5` 24px, `--space-6` 32px, `--space-7` 48px. Two-column instrument layouts (Bridge, Forces) split roughly 1fr/1fr and 1.15fr/0.7fr; they collapse to a single column at 900px, and result panels turn from sticky to static. The masthead is sticky with a hairline-strong bottom rule; the draft grid is drawn in CSS (`repeating-linear-gradient` 28px squares at `rgba(18,24,31,0.03)`), not an image asset. Breakpoints: 1240px (nav collapses to dropdown), 1100px (three-column model mirror reflows), 900px (single-column stack), 680px (mobile), 620px (compact nav and type).

## Elevation & Depth

The system is flat at rest. Depth is conveyed by **line weight**, not soft shadow: hairline rules for structure, strong 1px rules for emphasis, and 1–2px hard line-weight offsets for lift.

### Shadow Vocabulary

- **Flat** (`none`): the default for all surfaces.
- **Inset** (`box-shadow: 0 1px 0 rgba(18, 24, 31, 0.05)`): a 1px hard bottom offset on cards and result panels.
- **Lift** (`box-shadow: 0 2px 0 rgba(18, 24, 31, 0.06), 0 0 0 1px var(--line)`): a 2px hard offset plus a 1px ring on elevated/sticky panels.
- **Ring** (`box-shadow: 0 0 0 4px var(--accent-soft)`): a solid spread ring on selected dots, not a blur.

### Named Rules

**The No-Soft-Shadow Rule.** No blurred shadows. Every elevation state is a hard 1–2px offset or a solid ring; blur radius is always 0.

## Shapes

The form language is near-square drafting geometry. The corner scale is **2px / 4px / 8px** (`--radius-sm` / `--radius` / `--radius-lg`); 4px is nominal, 8px is the ceiling, and there are no pills. Edges are hairlines: 1px `--line` by default, 1px `--line-strong` when emphasized. Heavy accent emphasis is a **3px top rule** (Bridge result, Forces result, route detail, model mirror) or a **1px full ring** (selected controls), never a thick colored side border. The brand mark is a 42px square "seal" (signal-red fill, ink hairline, `B×O` in mono).

## Components

### Buttons

- **Shape:** near-square, `--radius` (4px), hairline `--line-strong` border, `min-height: 44px`, `padding: 0.65rem 1.1rem`.
- **Primary:** signal-red fill (`--accent`), white text, red border; hover deepens to `--accent-deep`.
- **Secondary:** surface fill (`--surface`), ink text; hover washes to `--accent-soft` with red border and deep-red text.
- **Quiet:** transparent fill, deep-red text; hover washes to `--accent-soft`.
- **Hover / Focus:** 160ms background/color/border transition; focus is a 2px signal-red outline with 3px offset.

### Chips

- **Style:** surface fill (`--surface`), ink text, hairline-strong border, `--radius-sm` (2px), `min-height: 44px`.
- **State:** selected sets a red ring (`inset 0 0 0 1px var(--accent)` or `0 0 0 1px`), deep-red text, and red-wash background; hover is a red wash.

### Inputs / Fields

- **Style:** surface fill, hairline-strong border, `--radius-sm` (2px); the range slider uses `accent-color: var(--accent)`.
- **Focus:** 2px signal-red outline, 3px offset.
- **Language select:** surface fill, `min-height: 38px`, square (0 radius) in the masthead.

### Navigation

- **Style:** transparent buttons, `--ink-soft` text, 0.75rem mono section index (`01`–`10`) in signal red.
- **Selected:** full ink text with a 2px signal-red underline (the `::after` bar).
- **Mobile:** collapses to a two-column dropdown surface panel with a hairline-strong border and lift shadow.

### Cards / Containers

- **Corner Style:** `--radius` (4px).
- **Background:** `--surface` on paper; dark `--dark` for result/hero heads.
- **Shadow Strategy:** flat or 1px inset; elevated panels use the lift ring.
- **Border:** 1px `--line` (or `--line-strong` when emphasized); no colored side borders.
- **Internal Padding:** `--space-4`/`--space-5` (16–24px).

### Brand Seal

A 42px square signal-red seal (`--accent`), 1px ink border, 4px radius, `B×O` in JetBrains Mono white. It is the system's single fixed logo mark.

### Signature Component: Structure-Resolution Diagram (Bridge)

The primary signature move, in `js/ui/bridge-view.js` (`structureResolutionSvg`) and rendered into `#bridge-structure-diagram`. A 400×220 SVG: four load arrows (`load-arrow`, signal red, 1.5px) enter from the left and terminate at a vertical steel-blue **reaction member** (`reaction-member`, `#1f5c8a`, 2.5px) studded with `reaction-node` dots. The member distributes to **three ranked frame slots** via `support-link` paths. Each slot (`frame-slot`) holds a `slot-frame` rect (surface fill, hairline-strong stroke, 4px radius), a mono rank numeral, a scaled form glyph (`frame-glyph` from `js/data/diagrams.js`), and a `score-track`/`score-fill` bar. State classes recolor by rank: `is-primary` = signal red, `is-adjacent` = steel blue, `is-candidate` = strong rule gray. The primary slot is the equilibrium; the SVG is rebuilt live as the four Bridge choices change.

### Signature Component: Force Vector Field (Forces)

The secondary move, in `js/ui/lab-view.js` (`forceVectorSvg`) and rendered into `#lab-force-diagram`. A 240×240 SVG: a dashed `force-gauge` ring, seven `force-vector` spokes radiating from a `force-center` dot, each spoke's length proportional to its slider value. The dominant force is signal red (`is-dominant`, 2.5px), the anchor force steel blue (`is-anchor`, 2px), the rest strong-rule gray (1px). A dashed `force-lean` line (deep red) shows the vector resultant. Rebuilt live on every slider input.

### Signature Component: Structural Signature Glyphs

Each of the seven organizational forms has a tiny schematic in `js/data/diagrams.js`, rendered via `structureSvg()` in `js/core/html.js`. The glyphs use a fixed vocabulary — `guide` (strong-rule solid), `guide-soft` (dashed), `mark-fill` (signal red), `mark-soft` (deep-paper fill + strong stroke), `accent-line` (red) — so the same strokes describe seven different structures (hub, chain, professional, mutual-adjustment, divisional, community, political).

## Do's and Don'ts

### Do:

- **Do** use the 6-hex drafting palette only: `#e7eaee`, `#dbe0e6`, `#f5f6f8`, `#16181d`, `#3c434c`, `#535b65`, plus `#c3cad3`/`#8d98a6` hairlines and the three semantic accents `#b02a1e`/`#8c2016`/`#1f5c8a`/`#8a5a00`.
- **Do** convey depth with hairlines and 1–2px hard line-weight offsets, never a blurred shadow.
- **Do** keep corners at 4px nominal (2px small, 8px maximum).
- **Do** set labels, data, ranks, and values in JetBrains Mono uppercase with 0.08em tracking.
- **Do** put accent emphasis on a 3px top rule or a 1px full ring.
- **Do** keep tabular numerals on all data.
- **Do** respect the 11px floor and the 12px micro / 16px body defaults.

### Don't:

- **Don't** use soft or blurred shadows; blur radius is always 0.
- **Don't** round past 8px or use pill shapes.
- **Don't** add a colored left/right border thicker than 1px; accent weight lives on top edges and full rings.
- **Don't** hardcode secrets, inline styles, or inline scripts; the CSP is default-deny and the site makes no network calls.
- **Don't** introduce a new hue without a semantic meaning.
- **Don't** set a data value in serif or a prose heading in mono.
