# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Founders, operators, and managers sizing up how their business should be organized; consultants and students learning Mintzberg's organizational forms. They arrive wanting to move from "what business am I in" to "which organizational form fits", without reading the whole framework first.

## Product Purpose

An interactive, self-contained explainer of Henry Mintzberg's organizational forms. It turns the framework into two hands-on instruments — a business-model bridge that scores which form fits, and a force-slider lab that shows which coordination pull dominates — so a visitor reaches a concrete, explained recommendation instead of a taxonomy page.

## Positioning

It connects the business model to the organizational form through a live scoring bridge: four business choices (customers, value, funding, boundary) act as inputs, and the tool resolves them into a ranked fit with the reasoning shown. A competing static article cannot truthfully copy the "choices in → form out" mechanism.

## Operating Context

Visitors explore ten views in one page: Bridge (the scoring instrument), Canvas, Patterns, Design epicenters, Cases, Atlas, Forms, Forces (the slider lab), Transitions, and About. The Cases view holds five real-world examples (IBM/Kyndryl, Amazon Marketplace, Apple App Store, Google, Procter & Gamble), each linking to an official source and a preloaded bridge preset.

## Capabilities and Constraints

- Six languages: English, 简体中文, 日本語, 한국어, Español, Français.
- Seven organizational forms (six core plus a political-arena boundary form) and seven coordination forces.
- No build step, no runtime dependencies, no network APIs; plain static HTML/CSS and native ES modules.
- Strict Content-Security-Policy (default-deny), self-hosted WOFF2 fonts, WCAG AA contrast.
- A dependency-free audit script (`scripts/audit.mjs`) enforces stylesheet order, the font inventory, token contrast, and the absence of inline styles/scripts and network calls.

## Brand Commitments

The product is "Business × Organization Atlas". Content is grounded in Mintzberg's framework and is explanatory rather than promotional; case studies are labeled as concise interpretations, not endorsements.

## Evidence on Hand

- Mintzberg's organizational-forms framework as the source of truth.
- Five interpretive case studies in `index.html` (`#view-cases`) with official source links.
- The scoring data (`js/data/bridge.js`, `js/data/forces.js`, `js/data/forms.js`) and structural diagrams (`js/data/diagrams.js`).
- No proprietary customer testimonials, benchmarks, or pricing exist; future work must not fabricate them.

## Product Principles

- The visitor should reach a concrete, explained conclusion, not a wall of theory.
- Every recommendation must show its reasoning and its trade-offs.
- The content is factual and grounded; claims stay tied to sources and are labeled.
- The product stays dependency-free and works offline from static files.

## Accessibility & Inclusion

WCAG AA contrast across six languages, keyboard-navigable tabs and controls, and language-aware typography (CJK fallbacks behind the Latin display and monospace faces).
