---
name: shared-channels-design-system
description: How to build with the Dubai Shared Channels design system (v2, direction E "Dubai Design System, evolved"), the sc- StencilJS web components, the --sc-* design tokens, and the rules that come with them (OKLAB colour, channel theming, Dubai Font, Arabic and RTL parity, WCAG 2.2 AA). Use this skill whenever the work touches this design system in any way, even if the user doesn't name it - building or reviewing a service page, form or journey for Dubai Now, Dubai Transport, Visit Dubai, Dubai Justice, Build in Dubai, Invest in Dubai or Dubai Trade; writing markup with sc- tags; writing CSS, Tailwind, SwiftUI or Compose against the tokens; designing screens in Paper or Figma for the Shared Channels standard; adding, changing or reviewing an sc- component; or editing the token files. Also use it when someone asks which component, token, colour, type role or spacing value to use here.
---

# Shared Channels design system (v2)

This repository (`design-system/` in the Shared Channels workspace) holds the tokens, the `sc-` web component library and the written standard for Dubai's seven government channels. The rules below exist because the system is assessed: services are checked against accessibility, Arabic parity and channel theming, and the build fails on several of them. Follow them and the work passes; skip them and someone has to redo it.

## First, check which version you are on

The library has two generations, and they look nothing alike.

- **v2** (direction E, "Dubai Design System, evolved") is the current direction. It is on `main`, the `v2` integration branch and the `v2-*` branches cut from them. The "Native" look was retired on 21 October 2026.
- **v1** ("Native": glass bars, pill buttons, gradient washes) survives only on older branches cut before v2 landed.

Check for the v2 docs, not the branch name: run `test -f docs/v2/decisions.md` from the repo root. If the file is there, everything here applies. If it isn't, the branch predates v2: tell the user the work would be built on the retired v1 look and ask whether to move to `main` or a v2 branch before going on. Don't build new v1 work unless they say so.

## Where the answers are (and which one wins)

Read only what the task needs. When sources disagree, the higher one wins:

1. `docs/v2/decisions.md`: decisions by the user (U-, R-) and the coordinator (D-, W-, A-). **Wins over everything else.** Its role-name table maps the names used in `component-language.md` to real token names.
2. `components/specs/<tag>.md` and the hand-written **Usage** section of `components/src/components/<tag>/readme.md`: the API, states and content rules of one component. Read these before using a component you haven't used in this session.
3. `docs/v2/foundations.md`: token values, colour roles, the type scale, shape, spacing, sizing, elevation, focus, layout, icons and motion.
4. `docs/v2/component-language.md`: the visual rules per component. Its colour names and type sizes are indicative: translate colours through the decisions table, and use the type role tokens.
5. `components/CONVENTIONS.md` (binding for component code) and `components/CONTRIBUTING.md` (the step-by-step recipe for adding a component).
6. `docs/v2/migration.md`: what changed from v1, and how a page links the library.
7. The standard itself: `docs/standard/service-standard.md` (assessed requirements, such as LANG-, A11Y-, CMP-, MOT- IDs), `design-system-reference.md` and `assurance-handbook.md`.

For quick lookups, use the two reference files bundled with this skill:

- `references/components.md`: every `sc-` tag, what it is for, what to use instead, and how it is built (light DOM, shadow DOM or CSS only).
- `references/tokens.md`: token names by category, the role-name traps, and the type roles.

## The rules that are never broken

These hold for every task: markup, CSS, native code, Paper or Figma boards, and docs.

- **Every colour is OKLAB**, for example `oklab(0.4874 -0.03 -0.153)`. No hex, `rgb()` or `hsl()` in source, CSS or boards. Better still, don't write colour values at all: use role tokens (`var(--sc-color-on-surface)`). Only the generated iOS and Android outputs convert to sRGB.
- **No teal.** Nothing in OKLCH hue 160–215 with chroma above 0.015 (`npm run check:hue-band`). The Dubai Design System's teal (#006A67 and its ramp) and anything that reads like it is banned. City indigo replaced it. In public-facing documents, don't name or ban the teal: say channel colours are set centrally in the token files (R3).
- **The channel is the theme.** Set `data-channel="now|transport|visit|justice|build|invest|trade"` once (on `<html>`, or through `sc-page`'s `channel`). Never hard-code a channel's colours and never use a named-channel token. To show another channel (an attribution chip), set `data-channel` on that element. Entities (RTA, DEWA, Dubai Police) appear only as attribution text: never as a colour, and never as a logo.
- **Roles, not tones.** Use `--sc-color-<role>` and `--sc-color-channel-<role>`. `--sc-palette-*` tones are for documentation only.
- **Type comes from roles.** Set type with `font: var(--sc-type-<role>); letter-spacing: var(--sc-type-<role>-tracking);` or the `.sc-type-<role>` class. Never use a free font size and never override line-height. Dubai Font (`Dubai W23`) is the only typeface. The roles follow `lang`, so Arabic text gets its larger scale, Bold weight and zero tracking with no extra work.
- **Arabic and English are equal.** Every string exists in both. Use logical properties only (`margin-inline-start`, `inset-inline-end`, `text-align: start`), never `left` or `right`. Directional icons mirror; icons for time, media, status and logos don't. Arabic is never letter-spaced, italic, upper-cased or smaller than 16px.
- **Digits are Latin (0–9) in both languages.** Format with `ar-AE-u-nu-latn`, never plain `ar-AE`. Isolate plates, amounts, references and phone numbers so they keep their order in Arabic: `<sc-ltr>` in markup, `<bdi dir="ltr">` or `.ltr` inside a component.
- **Accessibility is a floor, not a goal: WCAG 2.2 AA.**
  - Targets are at least 44×44px. Primary buttons and fields are 56px.
  - Control edges are 1.5px `outline`. `outline-variant` is for dividers and card edges only, never the only edge of a control.
  - The focus ring is neutral, 3px with a 2px offset, and is never removed, animated or clipped (U1).
  - Colour never carries meaning alone: status is an icon plus words.
  - Avoid disabled buttons. Leave the button enabled and show an error instead.
- **Flat surfaces.** No glass, blur or gradients, and no shadows on things in the page flow. Cards get a 1px `outline-variant` edge. `elevation-2` is only for things that float: popovers, menus, dialogs and sheets. The radii are 4 (controls), 6 (status chips), 8 (fields and callouts) and 12 (cards). Buttons are never pills.
- **Motion** follows `tokens/motion.json` and the MOT- rules (distilled from Emil Kowalski's skills):
  - Never animate anything opened from the keyboard.
  - Use ease-out for entering and leaving, never ease-in.
  - Micro-interactions take 100–150ms, standard UI 150–250ms, modals and drawers 200–300ms. Exits are about 20% faster than entrances.
  - Animate only `transform` and `opacity`. Never start from `scale(0)`.
  - Hover effects only run under `(hover: hover) and (pointer: fine)`.
  - Reduced motion keeps opacity changes and drops movement.
- **Shared government hand-offs.** "Pay with Dubai Pay" is `sc-button variant="handoff"` (city indigo on every channel). "Sign in with UAE PASS" uses the official UAE PASS button, never `handoff` and never restyled (U3a). Until the official kit arrives, use the labelled black placeholder.
- **Government of Dubai lockup.** The library ships no logo. The lockup goes into `sc-site-header`'s `lockup` slot. The real SVG lives outside the repository, in the workspace's `brand/` folder: never commit it, publish it or copy it into the repo (L1–L4). Public pages use a neutral placeholder of the same proportions.

## Building a page or service with the components

1. Link the library the v2 way: `sc.css` once, the lazy loader (or per-tag imports from `dist/components/` in an app), the contents of the generated `sc-preload.html`, and a preload for one font file only: the Regular subset of the page language. `docs/v2/migration.md` §1 has the exact `<head>`.
2. Set `lang`, `dir` and the channel once. With `sc-page`, `sync-document` copies them to `<html>`:

   ```html
   <sc-page lang="en" channel="transport" sync-document>
     <div slot="header">
       <sc-skip-link></sc-skip-link>
       <sc-site-header …><!-- lockup slot, nav, search, language, sign in --></sc-site-header>
     </div>
     <!-- <main id="main-content"> … -->
     <div slot="footer">
       <sc-footer variant="grouped"><footer>…</footer></sc-footer>
     </div>
   </sc-page>
   ```

   Transaction pages (question pages, check answers, pay) use `sc-app-bar` with `sc-back-link` and `sc-language-switch` instead of the site header.
3. Pick components from `references/components.md`, then read the component's spec or readme Usage for its API before writing markup. If no component fits, say so rather than inventing a look. Several common needs are CSS-only patterns with no JavaScript: `sc-footer`, `sc-breadcrumbs`, `sc-container`, `sc-grid`, `sc-ltr`, `sc-official-banner` and `sc-environment-banner`.
4. Use the established patterns:
   - **One question per page.** The question is the `h1`: set `heading-level="1"` on the field, or use the legend for a group.
   - **Errors** appear in two places: `error="…"` on each field, and an `sc-error-summary` at the top of the page whose links point at the field `id`s. While errors are shown, the page `<title>` starts with "Error: " / "خطأ: ".
   - **Check your answers** uses `sc-summary-list`. To compare rows of the same kind of thing, use `sc-table`. To show the details of one thing, use `sc-summary-list`.
   - **One primary button per page.** Use `type="submit"` on it: v2 fields and buttons are native light-DOM controls, so Enter submits, and reset, autofill and validation all come from the browser.
5. Content style:
   - Write in sentence case.
   - Buttons start with a verb that says what happens: "Continue", "Pay with Dubai Pay", "Save and finish later". Never "Submit", "OK" or "Click here".
   - Fields have no placeholder text and no colon after the label. Required fields are not marked; optional ones say "(optional)".
   - Error messages say what to do: "Enter the plate number using numbers only, like 12345".
   - For example content, use the vehicle registration renewal journey.
   - Write the Arabic yourself, or flag it for a translator; don't machine-translate it silently. Use the official Arabic channel names (R12), whose source is `components/src/i18n/components/channel-names.ts`.
6. Your own CSS, written without a layer, already beats `sc.css`'s cascade layers. Override with single classes (`.sc-field__control`, `.sc-button__label`). Never use `!important`, and never use `::part()` on light-DOM components: it doesn't exist there.

## Styling your own UI with the tokens (web, Tailwind, native)

- **Web:** use the `--sc-*` custom properties from `sc.css` (generated from `dist/css/tokens.css`). Dark mode is already handled: the colour tokens use `light-dark()`, and `data-theme="light|dark"` forces a mode on any subtree. Don't write a separate dark palette.
- **Tailwind v4:** import `dist/tailwind/theme.css` after `tailwindcss`. Its default colours and breakpoints are removed, and 1 spacing unit is 1px (`p-16` is 16px). Order the layers with `@layer base, sc, components, utilities;`.
- **SwiftUI and Jetpack Compose:** use `dist/ios/SCTokens.swift` and `dist/android/SCTokens.kt`, plus the component specs for behaviour.
- **Flutter and React Native:** their token outputs and component kits are a later stage (`MOBILE.md`). Say so rather than hand-copying values.
- **Paper:** load `dist/paper/tokens.paper.json` with `create_tokens`. Dark colours have a `-dark` suffix, and Arabic type has an `-ar` suffix. The Paper files are:
  - **v2 work:** "Shared Channels · Design System v2" (`01M5FAK60B6FTGZP1QCRDF9VXK`). Only this file is edited.
  - **Read-only:** direction E (`01M5A0E3KTNXQ1262CTCJDXCMP`) and v1 (`01M5A6FZR8XR1M22Y7T8CDWGTP`).

If a value you need has no token, don't invent one. Say what is missing and propose adding it to `tokens/` (colour goes in `tokens/source/color.source.json`; everything else in `tokens/*.json` is generated from it or edited by hand as `foundations.md` §1.1 says).

## Changing a component or the tokens

This is contributor work. Read `components/CONVENTIONS.md` and `components/CONTRIBUTING.md` in full first, and copy `sc-button` as the reference implementation. In short:

- Choose the encapsulation by family: form fields and `sc-button` use light DOM (`scoped`); lists and tables with native semantics also use light DOM; display and chrome use shadow DOM with `part`s; layout primitives are CSS only.
- Each light-DOM stylesheet starts with `@layer sc.reset, sc.tokens, sc.base, sc.components, sc.utilities;`. Component CSS never uses `@import` or literal values.
- Strings go in `src/i18n/components/<tag>.ts` and are read through `new LocaleController(this, strings)`.
- Tests cover spec, e2e (keyboard, names and states, English and Arabic, light and dark, RTL, forms), `describeAxe`, and screenshots. Each component also has a budget in `perf-budgets.json`.
- Run headless browser work in Helium (`/Applications/Helium.app/Contents/MacOS/Helium`), never Chrome.

For tokens: edit only `tokens/source/color.source.json` for colour, then run `npm run build` in `design-system/`. The build regenerates the palettes and the outputs, then runs the contrast, hue-band and no-hex checks, and stops on the first failure. Never edit `dist/`, `palette.json`, `color.json` or `color.dark.json` by hand.

## Checks before you hand work over

Run the checks that apply. If you can't run them, say so, and don't claim they pass.

| Where | Command | Catches |
|---|---|---|
| `design-system/` | `npm run build` | Contrast for every role pair (light and dark, every channel), the teal band, hex in the outputs |
| `design-system/components/` | `npm run check` | Literal colours and font sizes, `@import`, the layer order, the build, spec and e2e tests |
| `design-system/components/` | `npm run check:budget`, `npm run test:visual` | Bundle budgets, screenshot baselines |
| `design-system/components/` | `npm run check:site`, `npm run check:site-a11y` | Documentation site links, anchors and budgets; axe, CLS, target size and reflow in Helium |

For pages and boards that have no automated check, review them by hand:

- English and Arabic, both in light and dark mode, on at least two channels.
- Keyboard only: the focus is visible and nothing is clipped.
- 400% zoom and reflow.
- Forced-colours mode.

## Git habits in this repository

- Work on a `v2-<area>` branch cut from `v2` (or `main`), in its own worktree.
- Commit work in progress instead of using `git stash`: the stash is shared across worktrees (W15).
- Never push and never merge into `v2` or `main` yourself. The coordinator and the user do that.
- End commit messages with the co-author line the session gives you.
