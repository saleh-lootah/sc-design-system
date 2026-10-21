# Component conventions (v2)

The Shared Channels component library is a set of **web components built with StencilJS**, prefix `sc-`. One build works in plain HTML and in React, Angular, Vue or any other framework. Every component follows these rules; a component that breaks one is not finished.

Read with: `docs/v2/foundations.md` (token values), `docs/v2/component-language.md` (visual rules per component), `docs/v2/architecture.md` (delivery, budgets, tests), `docs/v2/decisions.md` (wins over all three), `docs/v2/migration.md`, and `CONTRIBUTING.md` (the long recipe). `sc-button` is the reference implementation: copy it.

## Building a v2 component: the recipe

1. Pick the encapsulation from `architecture.md` §3.1 (table below) and record it in `specs/<tag>.md`.
2. Copy `src/components/sc-button/` (light DOM) or keep your shadow component's skeleton; rename classes to `.sc-<tag>`, `.sc-<tag>__<part>`.
3. CSS: no `@import`; light DOM wraps everything in `@layer sc.components { … }`; colours are role tokens read through the role table below; type is `font: var(--sc-type-<role>); letter-spacing: var(--sc-type-<role>-tracking)`.
4. Use the shared helper classes (`focus-ring`, `visually-hidden`, `icon`, `icon-directional`, `spin`, `state-layer`, `ltr`, `sc-link`); never copy them.
5. Strings: `src/i18n/components/<tag>.ts` + `new LocaleController(this, strings)` from `i18n/controller`; nothing else from `i18n/`.
6. Light DOM: per-instance IDs, default slot only, forward `focus()`, and add a `<tag>:not(:defined)` size reservation to `src/global/components.css`.
7. Tests: spec + e2e (keyboard, names and states, EN/AR, light/dark, RTL, forms) + `describeAxe` + `<tag>.visual.e2e.ts`; run `npm run test:visual:update` once and commit the baselines.
8. Add your tag to `enforce` in `perf-budgets.json` and remove it from `V1_PENDING` in `scripts/check-literals.mjs`.
9. Rewrite the playground page (`src/www/pages/<tag>.html`) and the readme Usage for v2.
10. `npm run check`, `npm run test:visual` and `npm run check:budget` pass; over budget means a reason in the spec or a split.

## Stack and outputs

- StencilJS 4, TypeScript (strict). No runtime dependencies beyond Stencil. Icons are inline SVG in `src/icons/` on a 24px grid in `currentColor`.
- **`dist-custom-elements` is the primary build** (`import '@sc/components/dist/components/sc-button.js'` defines the tag). The lazy loader (`dist/sc-components/sc-components.esm.js`) is kept for plain HTML, CMS pages and the playground; its tags are grouped into a few bundles (`bundles` in `stencil.config.ts`) and nothing is hidden before hydration (`invisiblePrehydration: false`).
- No framework wrappers in v2.0 (React 19, Angular and Vue use custom elements directly).

## Encapsulation by family (architecture §3.1)

A component uses shadow DOM only when nothing outside it needs to reach inside: no ARIA ID references, no form participation, no native parent–child semantics, no implicit submission.

| Family | Mode |
| --- | --- |
| `sc-button`, form fields (`sc-text-input`, `sc-textarea`, `sc-select`, `sc-date-input`, `sc-search`, `sc-checkbox`, `sc-checkbox-group`, `sc-radio-group`, `sc-radio`, `sc-date-range` inputs) | **Light DOM** (`scoped: true`): native elements as children, real form controls (A2) |
| Lists and tables with native semantics (`sc-table`, `sc-summary-list`, `sc-summary-row`, accordion, timeline, notification list) | **Light DOM** |
| `sc-page`, `sc-card` | **Light DOM**, minimal JS |
| `sc-container`, `sc-grid`, `sc-ltr` | **CSS only** in `sc.css` (no JS, no registration) |
| Chrome and display (`sc-app-bar`, `sc-footer`, `sc-channel-hero`, `sc-callout`, `sc-status-tag`, `sc-channel-chip`, `sc-spinner`, `sc-step-progress`, `sc-service-card`, `sc-error-summary`, `sc-language-switch`, `sc-link`, `sc-back-link`, `sc-skip-link`, `sc-modal` and the new display components) | **Shadow DOM**, with `part`s; `delegatesFocus` where the host is the focus target. Never a form control inside |

## How styles reach a component

| Layer | What | Where it applies |
| --- | --- | --- |
| `sc.css` (the page links it once) | `@layer sc.reset, sc.tokens, sc.base, sc.components, sc.utilities`: tokens (`light-dark()` plus the A1 fallback), `@font-face`, body and native focus ring, light-DOM component support and `:not(:defined)` reservations, the helper classes | The document; custom properties inherit into every shadow root |
| `src/global/shadow.css` (Stencil `globalStyle`) | The helper classes only | Adopted by reference into every shadow root (parsed once), and copied into `sc.css` `@layer sc.utilities` |
| `<tag>.css` | The component's own rules | Shadow components: the shadow root. Light-DOM components: the document, inside `@layer sc.components` |

- **Never `@import`** in component CSS (`check:literals` fails). Shared things live in the helper sheet or `sc.css`; field styles shared by several light-DOM fields go in `src/global/components.css`.
- **Unlayered service CSS wins** over every `sc` layer, so light-DOM components keep single-class specificity, wrap state selectors in `:where()` where useful, and never use `!important` (except `.visually-hidden`).
- Do not put a `transition` or `transform` in a shared helper: a helper in `sc.utilities` would override the component's own list. Press feedback is written per component (below).

### Shared helper classes

| Class | Does |
| --- | --- |
| `focus-ring` | U1 ring on `:focus-visible`: `outline: var(--sc-size-focus-ring) solid var(--sc-color-focus-ring)`, offset `--sc-size-focus-offset`, `transition: none`; `Highlight` in forced colours |
| `visually-hidden` | Off screen, still read |
| `icon`, `icon-directional` | SVG sized by `--icon-size` (default 20px); mirrored under `:dir(rtl)` |
| `spin` | Spinner rotation; none under reduced motion |
| `state-layer` | `--sc-state-color` (default `currentColor`) at 8% on hover (fine pointers) and 12% pressed, painted over the element's own background; add `--sc-layer` to your transition list to fade it |
| `ltr` | `direction: ltr; unicode-bidi: isolate` (shadow-root equivalent of `sc-ltr`) |
| `sc-link` | A running-text link on a native `<a>` (A4) |

## Tokens and colour

- Components use **role tokens** only (`--sc-color-*`, `--sc-color-channel-*`), never palette tones, never a named channel, never a literal (`check:literals` fails on hex, `rgb()`, `hsl()` and raw font sizes). Every colour is OKLAB; nothing near DDS teal.
- `data-channel` on any element rebinds the channel roles for its subtree; `data-theme` forces light or dark for a subtree. Neither needs JS.
- Filled controls use explicit hover and pressed roles (`channel-action-hover`, `-pressed`); quiet controls use state layers or the roles below. Disabled: `disabled-container` and `on-disabled`.
- Control edges are 1.5px `outline` (`--sc-size-border-control`); `outline-variant` is for dividers only. Hovered edges and the sign-in edge use `outline-strong`.
- City indigo (`primary`) is only for what all channels share: the network strip and the UAE PASS / Dubai Pay hand-offs (U3).

### Role names: component-language.md to tokens

`component-language.md` uses some names that differ from the tokens. Always translate through this table (copied from `docs/v2/decisions.md`, which stays authoritative). **The main trap: component-language's "channel-container" (tone 95) is the token `channel-subtle`.**

| component-language.md role | Token to use | Note |
| --- | --- | --- |
| `surface` | `surface` (`surface-card` for cards) | |
| `surface-container-low` | `surface-container` | Neutral-96 |
| `surface-container-high` | `surface-container-high` | |
| `surface-disabled` / `on-surface-disabled` | `disabled-container` / `on-disabled` | |
| `on-surface` | `on-surface` | |
| `on-surface-variant`, `on-surface-muted` | `on-surface-variant` | Both are neutral-40 (D6) |
| `outline` | `outline` | The 1.5px control edge |
| `outline-strong` | `outline-strong` | **New token**, added by C0: neutral-10 in light, neutral-90 in dark. For hovered control edges, the sign-in edge and the plate chip |
| `outline-variant` (decorative connectors, popover edges) and `divider` | `outline-variant` | Neutral-90. Dividers, decorative connectors and popover edges. Never a control edge |
| `state-hover` | State layer: `on-surface` at `opacity-hover` (8%), pressed at 12% | |
| `inverse-surface` / `on-inverse-surface` | `inverse-surface` / `inverse-on-surface` | |
| `scrim`, `focus-ring` | `scrim`, `focus-ring` (the gap uses the surface behind it) | |
| `channel-action` / `on-channel-action` | `channel-action` / `channel-on-action` | |
| `channel-action-hover` / `-pressed` | `channel-action-hover` / `-pressed` | |
| **`channel-container` (channel-95)** | **`channel-subtle`** | Hero (Q-hero), current network tile, selected rows, unread rows, applied filter chips, the selection bar |
| **`channel-container-high` (channel-90)** | **`channel-container`** with `channel-on-container` | Mobile step halo, tags, secondary pressed, the bottom-nav indicator |
| `channel-outline` | `channel-outline` | **New token**, added by C0: channel-80 in light, channel-40 in dark. For the 1px edges on suggestion chips and outlined channel chips |
| `channel-accent` | `channel-action` | |
| `city-action` / `on-city-action` | `primary` / `on-primary` | U3 hand-offs, the network eyebrow |
| `city-container` / `city-container-high` | `primary-subtle` / `primary-container` | |
| `{tone}`, `on-{tone}`, `{tone}-container` | The same names | Error, success, warning, info |
| `{tone}-outline-variant` | `outline-variant` | |
| `shadow-2` (popovers, menus) / `shadow-3` (modals, sheets) | `elevation-2` | Sticky bars and the utility bar use `elevation-1` (U4) |

## Focus (U1)

- Every focusable element shows the neutral 3px ring 2px outside its edge on `:focus-visible`, following its radius: use the `focus-ring` class (native elements in the document get it from `sc.css` anyway). Never remove focus, never animate it.
- Inside a filled area (the indigo strip, a filled channel band, a toast) set `--sc-color-focus-ring` to that area's "on" colour on the area: `on-primary`, `channel-on-action`, `inverse-on-surface`.
- The ring must never be clipped (`overflow: clip` parents need padding) and never sit under a sticky header.

## Type roles

- One declaration per element: `font: var(--sc-type-<role>); letter-spacing: var(--sc-type-<role>-tracking);`. The custom properties are redefined under `[lang|="ar"]` (Arabic size, leading, Bold where English is Medium, tracking 0, the Arabic font first) and inherit through shadow roots, so a component never branches on script.
- Roles: `display-large|medium|small`, `headline-large|medium|small`, `title-large|medium|small`, `body-large|medium|small`, `label-large|medium|small` (foundations §3.2). Never a free size, never a line-height override.
- Page markup uses `.sc-type-<role>`, which follows `lang` too.
- Font: one family, `Dubai W23`, weights 400/500/700 (`--sc-font-weight-*`); `font-synthesis: none` is set on `body`.

## Language, direction and strings

- Arabic and English are equal. Text a component renders by itself comes from **its own** strings file, `src/i18n/components/<tag>.ts` (`defineStrings({ en, ar })`; the build fails on a missing Arabic key), read through `new LocaleController(this, strings)` from `src/i18n/controller.ts`. Never import `i18n/strings`, `i18n/locale` or `i18n/components/index`: they carry every component's text (legacy, v1 only). Every string can be overridden by a prop or the slot.
- The language is the closest `lang`; one shared `MutationObserver` re-renders components when it changes.
- Digits are Latin in both languages. Values that must stay left-to-right (plates, amounts, references, phone numbers) are isolated: `<sc-ltr>` in markup, `<bdi dir="ltr">` or `.ltr` inside a component.
- Logical properties only (`padding-inline-start`, `inset-inline-end`, `text-align: start`); never `left`/`right`. Directional icons get `icon-directional`; icons for time, media, real objects and logos never mirror.

## Motion

Values in `tokens/motion.json`, rules MOT-01 to MOT-15 (Standard 2.0 §8.7), from Emil Kowalski's skills.

- Hover and colour: `--sc-duration-fast` (120ms), `--sc-easing-hover`, inside `@media (hover: hover) and (pointer: fine)`.
- Press: pointer and touch only, never from the keyboard:

  ```css
  .sc-thing { transition: background-color var(--sc-duration-fast) var(--sc-easing-hover), transform var(--sc-duration-press) var(--sc-easing-enter); }
  .sc-thing:active:not(:focus-visible, :disabled, [aria-disabled='true']) { transform: scale(var(--sc-scale-press)); }
  ```

  The `focus-ring` helper sets `transition: none` while focused, so keyboard activation is instant (MOT-02).
- Entrances `--sc-duration-base` with `--sc-easing-enter`, from `scale(var(--sc-scale-enter))` and `opacity: 0`, never `scale(0)`; exits about 20% faster. Modals and sheets `--sc-duration-slow`. Name exact properties, never `transition: all`; only `transform` and `opacity` animate movement.
- Reduced motion: movement stops (`--sc-scale-press`, `--sc-scale-enter` become 1, `--sc-duration-spin` 0ms, `.spin` stops); opacity and colour keep their timing. Any other transform needs its own guard.

## Forms and accessibility

- Light-DOM controls are native: submission, Enter-to-submit and the default button, `FormData`, constraint validation, reset, `<fieldset disabled>`, autofill and `<label for>` all come from the browser. No `formAssociated`, no `ElementInternals`.
- IDs are generated per instance (`sc-<tag>-<n>`). Every field has a visible label; hint and error are linked with `aria-describedby`; an error sets `aria-invalid` and its message starts with a visually hidden "Error:" / "خطأ:".
- Interactive targets are at least 44×44px (`--sc-size-target-min`); primary buttons and fields are 56px (`--sc-size-control-primary`), secondary and compact ones 48px.
- Colour never carries meaning alone: status is an icon and words.
- Respect `prefers-reduced-motion` and `forced-colors` (transparent borders the system repaints; system colours for state).
- Avoid disabled buttons (A11Y-08).

## Events

Custom events use the `sc` prefix, bubble and are `composed`: `scChange`, `scInput`, `scDismiss`. Native events keep working wherever a native element sits underneath (light-DOM controls fire them directly).

## Testing requirements

| What | How | When |
| --- | --- | --- |
| Spec | `<tag>.spec.tsx` with `newSpecPage`: variants, props, classes, ARIA, Arabic strings | `npm run test:spec`, every push |
| e2e | `<tag>.e2e.ts` with `newScPage(html, { lang, theme, channel })` (links `sc.css` like a real page): keyboard, names and states, forms, RTL, type in EN and AR, colours against the tokens, re-render on `lang` change. One worker; no fixed sleeps for state | `npm run test:e2e` (all) / `test:e2e:v2` (rebuilt tags); CI on PRs |
| Axe | `describeAxe('<tag>', ALL_STATES)`: one test each for EN/AR × light/dark, WCAG 2.2 A and AA | inside e2e |
| Screenshots | `<tag>.visual.e2e.ts` with `expectScreenshot` for EN/AR × light/dark; baselines committed in `test/visual/<platform>/<tag>/` | `npm run test:visual`; `test:visual:update` to rewrite; CI on PRs (linux baselines come from the CI artefact) |
| Budget | `npm run check:budget` (`perf-budgets.json`): your tag in `enforce` | every hand-over; CI on PRs |

The 90-second test timeout is set in `src/test/setup.ts` (Stencil ignores `testing.testTimeout`).

## Budgets (architecture §3.7)

All gzip, per file, measured by `npm run measure:bundle`; components in the custom-elements build (the module and its import closure, excluding the runtime).

| What | Budget |
| --- | --- |
| Runtime core | 14 KiB |
| `sc.css` | 7 KiB |
| Shadow helper sheet | 1.5 KiB |
| Leaf component | 4 KiB (`sc-button` 5 KiB: see its spec) |
| Form field | 7 KiB |
| `sc-error-summary` / `sc-table` / `sc-date-range` | 6 / 12 / 16 KiB |
| Typical page JS (lazy) / its component CSS | 30 KiB / 3 KiB |
| Each font file | 32 KiB; a page's fonts 75 KiB English, 100 KiB Arabic |

## Files

```
src/components/<tag>/
  <tag>.tsx              component; JSDoc on every @Prop, @Event, slot and part
  <tag>.css              styles, tokens only, no @import
  <tag>.spec.tsx         unit tests
  <tag>.e2e.ts           browser tests and describeAxe
  <tag>.visual.e2e.ts    screenshots, EN/AR × light/dark
  readme.md              hand-written Usage above the generated API
src/i18n/components/<tag>.ts   the component's strings
src/www/pages/<tag>.html       playground page
specs/<tag>.md                 specification
test/visual/<platform>/<tag>/  screenshot baselines
```

## Fonts

`src/assets/fonts/dubai-w23-<weight>-<latin|arabic>.woff2` and `src/global/fonts.css` are generated by `npm run fonts` (`scripts/subset-fonts.mjs`, HarfBuzz `hb-subset` and a built-in WOFF2 encoder) from the Dubai W23 1.10 TTFs, checked by SHA-256. Dubai Font is © 2017 Dubai Executive Council, all rights reserved; the desktop TTFs are not committed, only the web subsets (as v1 committed its WOFF2 files), and every subset keeps the font's name records. Pages preload one file: the Regular subset of the page language.

## Content style in examples

Use real service content from the vehicle registration renewal journey. Sentence case. Verbs for buttons: "Continue", "Pay with Dubai Pay", "Save and finish later".
