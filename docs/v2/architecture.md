# Shared Channels Design System v2 · architecture and performance

Agent F3, Wave 1. Branch `v2-architecture`, cut from `v2` on 21 October 2026.

This document decides how the v2 `sc-` Stencil library is built: whether each component uses
shadow DOM, scoped styles or plain CSS, how shared styles and tokens reach components, how fonts
load, what the build ships, the budgets, and how it is tested. Every decision is backed by a
measurement of v1, taken with the scripts in `components/scripts/`, which Wave 4 (Q3) and CI
run again.

`foundations.md` (F1) owns token values and `component-language.md` (F2) owns the visual rules.
This document owns delivery: how those values and rules get to the page.

---

## 1. Summary

### What v1 costs a typical page

The typical page is the Dubai Now home in miniature: the page shell, skip link, app bar with
language switch, hero with search, a grid of six service cards, and the footer. It has 15 `sc-`
instances of 10 tags, and 18 elements once `sc-search` renders its `sc-button`. All sizes are
gzip unless stated.

| What | v1 measured | v2 budget |
|---|---|---|
| JS on the page (lazy build, including the nested `sc-button`) | 46.4 KiB, in 16 scripts | **≤ 30 KiB** |
| Stencil runtime core | 15.5 KiB | ≤ 14 KiB |
| Global stylesheet (tokens, `@font-face`, body) | 4.1 KiB | ≤ 9 KiB (W7), which now also holds the shared helpers, type roles and layout primitives |
| Component CSS parsed on the page | 4.3 KiB | ≤ 4 KiB (W13) |
| Fonts downloaded | 188.7 KiB: 3 full weights at 63–64 KiB each | **≤ 75 KiB in English, ≤ 100 KiB in Arabic** |
| Total transferred | 239.5 KiB, 79% of it fonts | ≤ 115 KiB in English, ≤ 140 KiB in Arabic |
| All `sc-` content visible, Slow 4G with CPU ×4 | 1.89 s (lazy); 1.24 s (custom elements) | ≤ 1.2 s |
| CLS | 0.000–0.025 (lazy); up to 0.045 (custom elements, no bundler) | **0** (measured ≤ 0.005) |
| Total blocking time at CPU ×4 | 0 ms (lazy); 41–48 ms (custom elements) | 0 ms |

### Decisions

1. **Encapsulation by component family, not one rule for everything:**
   - **Layout primitives become CSS only, with no JS:** `sc-container`, `sc-grid` and `sc-ltr`.
     The tag names and attributes stay the same.
   - **Form controls and the button render native elements in light DOM** (Stencil `scoped`).
     This was measured: in v1, pressing Enter in any `sc-` field never submits the form, and
     `sc-button` can't act as a form's default button (§2.5).
   - **Content with native list or table semantics uses light DOM:** `sc-table`,
     `sc-summary-list` and the planned list-like components.
   - **Chrome and display components keep shadow DOM.** That covers the app bar, footer, hero,
     callout, status tag, chip, spinner, step progress, service card, error summary and links.
2. **Shared styles are one constructable stylesheet adopted by every shadow root.** Stencil
   4.45 already does this for `globalStyle` (`extras.addGlobalStyleToComponents`, default
   `'client'`). It was measured: every v1 shadow root adopts the same global `CSSStyleSheet`.
   v2 puts the focus ring, visually-hidden and icon helpers there, once, instead of
   `@import`ing `shared.css` into 26 component stylesheets.
3. **Type roles become inherited custom properties, not per-component CSS.**
   - One `font` shorthand token per role, such as `--sc-type-body-m`, switches to the Arabic
     scale under `[lang|="ar"]`. A component writes one declaration.
   - This removes 78 copied type-role blocks, which carry 54.8 KiB of raw CSS inside the JS.
4. **Tokens are delivered in one document stylesheet, ordered by cascade layers:**
   - Custom properties only.
   - Channel switching through `[data-channel]` and theme switching through `color-scheme`
     plus `light-dark()`, with no JS.
   - `@layer sc.reset, sc.tokens, sc.base, sc.components, sc.utilities`, so any unlayered
     service CSS wins predictably.
5. **Fonts:**
   - One family, `Dubai W23`, with a real `font-weight` for each face.
   - Split into Latin and Arabic subsets with `unicode-range`. The Latin subset is about
     23 KiB per weight; the Arabic subset with ASCII digits and punctuation is about 32 KiB.
   - The Light weight is dropped (no role uses it).
   - The page language's Regular face is preloaded.
   - A metric-matched fallback face, so the font swap doesn't move layout.
6. **Output targets:**
   - `dist-custom-elements` is the primary build for applications.
   - The lazy loader is kept for plain HTML pages and the playground. Its bundles are grouped
     so a page makes about 4 requests instead of 16.
   - No framework wrappers in v2.0.
7. **Budgets are enforced in CI** by `npm run check:budget` (`perf-budgets.json`). v1 fails 32
   of them on purpose.
8. **Testing:**
   - e2e runs on one worker. In v1 it measured 306 of 306 passing in 204 s, against 3
     failures at 3 workers.
   - Axe moves to its own tests, one per language and theme.
   - A visual regression matrix covers EN/AR × light/dark, and the bundle and runtime checks
     run in CI.

Five points need the user's decision. They are listed in §6.

---

## 2. Audit of v1 (measured)

### 2.1 Method

The scripts are re-runnable and have no dependencies beyond the repository's devDependencies:

```sh
# at the repo root
npm run build                                # tokens
# in components/
npm ci && npm run build
npm run measure:bundle                       # node scripts/measure-bundle.mjs  (add --json for data)
npm run measure:runtime                      # node scripts/measure-runtime.mjs (add --cpu 4 --net slow4g)
npm run check:budget                         # exits 1 if perf-budgets.json is exceeded
```

- **`measure-bundle.mjs`** reads the build output on disk.
  - It reports the lazy build, the custom-elements build and the www playground.
  - For each component it reports the entry chunk plus its static-import closure, excluding
    the shared core.
  - It also extracts the CSS text each component carries in its JS, the duplication of
    shared CSS, `tokens.css`, the fonts (parsed straight from the WOFF2: glyphs, code points,
    Latin and Arabic coverage, vertical metrics) and the typical page in both builds.
  - Sizes are raw, gzip -9 and brotli q11, each file compressed on its own as the browser
    downloads it.
- **`measure-runtime.mjs`** serves `components/` with gzip and loads
  `test/perf/typical-page.html` in headless Helium.
  - Each run starts with a fresh browser context and the cache disabled. Results are medians
    of 5 runs.
  - It covers four variants: the lazy loader and plain-ESM custom elements, each in English
    and Arabic.
  - It records FCP, LCP, the time until every `sc-` element (including those in shadow roots)
    is defined and rendered, CLS with shift sources, long tasks and TBT, CDP script, style and
    layout time, shadow roots, adopted sheets, rules, requests by type and loaded fonts.
  - The viewport is 412×915, a phone.
- The machine was shared with other agents' builds while measuring. Absolute timings are
  indicative. The comparisons between variants were taken back to back and hold.

### 2.2 Bundles

**Lazy build (`dist/sc-components`):**

| | Raw / gzip / brotli (KiB) |
|---|---|
| Loader `sc-components.esm.js` | 6.0 / 2.0 / 1.7 |
| Runtime core | 61.3 / 15.5 / 13.5 |
| Global stylesheet | 31.8 / 4.1 / 3.3 |
| Everything (41 JS files) | 382.0 / 109.9 / 95.4 |

Per component, JS including its CSS and excluding the core (gzip KiB):

| Component | gzip | Component | gzip |
|---|---|---|---|
| sc-container | 0.5 | sc-skip-link | 5.6 |
| sc-grid | 0.7 | sc-page | 5.6 |
| sc-card | 1.2 | sc-step-progress | 5.6 |
| sc-status-tag | 1.5 | sc-language-switch | 5.9 |
| sc-channel-hero | 1.8 | sc-footer | 6.1 |
| sc-app-bar | 2.1 | sc-spinner | 6.2 |
| sc-service-card | 2.1 | sc-summary-list | 6.4 |
| sc-summary-row | 4.7 | sc-link | 6.7 |
| sc-back-link | 6.8 | sc-channel-chip | 6.8 |
| sc-error-summary | 6.8 | sc-callout | 7.1 |
| sc-search | 7.3 | sc-button | 7.9 |
| sc-checkbox-group | 9.5 | sc-select | 9.6 |
| sc-checkbox | 9.7 | sc-text-input | 9.7 |
| sc-textarea | 9.8 | sc-date-input | 10.0 |
| sc-radio-group | 10.1 | sc-table | 13.0 |
| sc-date-range | 19.1 | | |

Findings:

- **The i18n chunk is the largest shared cost.**
  - `p-BuUN7_ul.js` is 12.6 KiB raw and 4.2 KiB gzip. It holds the English and Arabic strings
    for every component.
  - Any component with a string loads it. That is why a link or a spinner costs 6–7 KiB:
    about 2 KiB of component and 4.2 KiB of every other component's strings.
  - The per-component string files already exist (`src/i18n/components/*.ts`), but they are
    re-exported through one index, so they bundle together.
- **The waterfall is nested.**
  - `sc-search` renders `<sc-button>`, which is lazy-loaded after `sc-search` hydrates. That
    adds one more round trip.
  - The lazy page fetches: loader, then core, then 10 entries, then 3 shared chunks, then the
    `sc-button` entry. That is five sequential steps.
- **The custom-elements build is the same size per module.** As one concatenated bundle the
  typical page is 31.3 KiB gzip against 38.8 KiB for the lazy files, and better compression
  inside one file accounts for the difference.
- **The www playground** ships 111.7 KiB gzip of library JS (all components) and 63.9 KiB of
  playground shell.

### 2.3 CSS: what is duplicated and how it is delivered

**Component CSS in v1 is source CSS with `@import`s that Stencil inlines into each component's
JS.** It was measured on the built output:

| Shared source | Copies in built component CSS | Bytes |
|---|---|---|
| `styles/shared.css` (focus ring, visually-hidden, icon, spin), minified to 842 B | 26 of 33 stylesheets | 21.4 KiB of copies |
| Type-role blocks (`styles/type/*.css`: `:host` vars, `:host(:lang(ar))` vars, `.type-*` class) | 78 copies | 54.8 KiB raw |
| `field.css` (4.7 KiB source) + `choice.css` (4.3 KiB source) | every field, checkbox and radio component | 4.7–9.0 KiB source each |

- All component CSS together is 195.9 KiB raw, 16.4 KiB gzip.
- In the source, the share of a component's CSS that isn't its own:
  - 92–100% for the simple fields: text input, textarea, select, date input, checkbox,
    checkbox group, radio group
  - 60–72% for the hero, service card, callout, search, footer, spinner and step progress
  - 19% for `sc-table`, which is mostly its own CSS
- **Per instance, nothing is duplicated.**
  - Stencil creates one `CSSStyleSheet` per tag and adopts it into every instance's shadow
    root.
  - Measured on the typical page: 17 shadow roots, 34 adoptions, 11 unique sheets, 300 rules
    in shadow sheets. No root adopts the same sheet twice.
  - The duplication is therefore **across tags**: in the bytes shipped (each tag's JS carries
    its own copy of the helpers) and in parse time (each tag's sheet is parsed separately).
- **The global stylesheet is already adopted into every shadow root.**
  - Each of the 17 roots adopts two sheets: the tag's own, and the global
    `sc-components.css` (59 rules, starting with the `:root` token block).
  - This is Stencil's `extras.addGlobalStyleToComponents: 'client'` default.
  - In v1 it is wasted: inside a shadow root, `:root`, `body` and `@font-face` rules don't
    apply.
  - It is also the mechanism v2 uses on purpose (§3.2). Shared helpers placed there are
    parsed once and shared by reference, with no custom code and no `@import`.
- **Tokens:**
  - `design-system/dist/css/tokens.css` is 37.8 KiB raw and 6.0 KiB gzip, with 487
    custom-property declarations. It is `@import`ed into `src/global/sc.css`, so it arrives
    inlined in the one global stylesheet (31.8 KiB raw, 4.1 KiB gzip once minified).
  - Dark mode is written twice: once under `@media (prefers-color-scheme: dark)
    :root:not([data-theme="light"])` and again under `:root[data-theme="dark"]`, about 85
    declarations each.
  - Channels are `[data-channel="…"]` blocks of 8 aliases each. That is already pure CSS and
    already good.
- **Type in the document** is a set of `.sc-type-*` and `.sc-type-ar-*` classes in tokens.css.
- **Stencil handles `@layer`.** Tested on 4.45.2:
  - `@layer sc.components { … }` in a `scoped` component's CSS is kept, with its selectors
    scoped inside the layer.
  - `@import '…' layer(name)` is inlined as `@layer name { … }`.
  - So cascade layers need no workaround.

### 2.4 Fonts

| File | Bytes | Glyphs | Code points | Latin | Arabic |
|---|---|---|---|---|---|
| DubaiW23-Regular.woff2 | 64,056 | 710 | 553 | 262 | 235 |
| DubaiW23-Medium.woff2 | 63,880 | 710 | 553 | 262 | 235 |
| DubaiW23-Bold.woff2 | 64,440 | 710 | 553 | 262 | 235 |
| DubaiW23-Light.woff2 | 63,020 | 710 | 553 | 262 | 235 |

- **The `@font-face` setup:**
  - 4 faces, each declared as its own family (`'Dubai W23 Regular'`, `'Dubai W23 Bold'`…).
  - `font-display: swap`.
  - No `unicode-range`, no preload and no subsetting.
- **What the typical page loads:** Regular, Medium and Bold, 188.7 KiB, which is 79% of all
  bytes. **No type role uses Light.** It ships in the package but is never requested.
- **When the fonts are found:** because text renders inside shadow roots after hydration,
  Medium isn't requested until about 160 ms, after the components (probe on the unthrottled
  run).
- **Subsetting:** estimated with HarfBuzz `hb-subset` from the same font's TTF, then brotli in
  font mode. The ratio was calibrated against the real WOFF2 files and is within 1%.

  | Subset (per weight) | Approx. WOFF2 |
  |---|---|
  | Latin (U+0000–00FF and general punctuation, €, ™, arrows, minus) | 22.3–23.2 KiB |
  | Arabic only (U+0600–06FF, 0750–077F, 08A0–08FF, FB50–FDFF, FE70–FEFC, ZWNJ, ZWJ) | 26.2–26.7 KiB |
  | Arabic + ASCII digits and punctuation (Latin digits in Arabic, per the plan) | 31.5–32.0 KiB |

- **Vertical metrics, for a metric-matched fallback:** unitsPerEm 1000, hhea ascender 1129,
  descender −559, lineGap 0. OS/2 winAscent and winDescent are the same.
- **Shift sources:** layout shifts with source `#text`, meaning font swap reflow, appear in
  every runtime variant.

### 2.5 Accessibility architecture: where shadow DOM hurts

These were measured in headless Helium against the v1 lazy build, together with what the v1
code documents. The implicit-submission probe types into the first field, presses Enter, and
counts `submit` events. Its cases are:

- (a) one `sc-text-input` + `sc-button`
- (b) one native input + `sc-button`
- (c) one `sc-text-input` + native button
- (d) one native input + native button
- (e) two native inputs + `sc-button`
- (f) two native inputs + native button
- (g) two `sc-text-input` + `sc-button`

Only b, d and f submit. b submits only because of the single-field rule. Q1 repeats this on
v2.

| Issue | v1 behaviour | Evidence |
|---|---|---|
| Enter in a field doesn't submit the form (implicit submission) | `<sc-text-input>` + native `<button type=submit>`: Enter → **no submit**. Two `<sc-text-input>` + `<sc-button type=submit>`: **no submit**. Native inputs + native button: submits. | probe matrix a–g |
| `sc-button` can't be the form's default button | Two native inputs + `<sc-button type=submit>`: Enter → **no submit**. With a native submit button: submits. | probe e vs f |
| ARIA ID references can't cross a shadow boundary | Every field renders its label, hint and error inside its own root (CMP-04). Services can't add their own `<label for>` or `aria-describedby` pointing at the control. | `field.tsx` header |
| A description list can't span roots | `sc-summary-list` re-renders the whole `<dl>` in its own shadow root from data on `sc-summary-row` children (an internal `sc-summary-row-update` component and events). | `sc-summary-list.tsx` |
| Native table semantics | `sc-table` is already `scoped` (light DOM) to keep `<table>`, `th scope` and `caption`. | `sc-table.tsx` |
| Radio group semantics | `sc-radio-group` renders the native radios in its own root and slots each `sc-radio` into a label with manual slot assignment, so arrow keys and position-in-set work. That works, but it is the most complex code in the library. | `sc-radio-group.tsx` |
| Form participation | 8 components use `formAssociated` + ElementInternals and mirror value, validity (`mirrorValidity`) and change events by hand. | `field.tsx`, components |
| Autofill and password managers | Not measurable headless. Chromium autofills inputs in shadow roots inconsistently, and Safari historically doesn't offer AutoFill there. This is a risk for WCAG 1.3.5 (identify input purpose) on iPhone, which is the majority device in the UAE. | to verify on device in Wave 4 (Q1) |

Shadow DOM is not the problem where a component is self-contained and nothing outside it
needs to reference its parts: the app bar, footer, hero, callout, status tag, chips, spinner,
step progress, service card and error summary. Their headings, links and landmarks appear in
the accessibility tree normally, and the error summary's `href="#host-id"` focus
(`delegatesFocus`) works.

### 2.6 Hydration, FOUC and layout shift

Medians of 5 cold runs, typical page.

| Variant | FCP | All `sc-` ready | Load | CLS (max) | TBT | Script / style / layout | Requests |
|---|---|---|---|---|---|---|---|
| Unthrottled, lazy EN | 48 ms | 102 ms | 38 ms | 0.025 | 0 | 9 / 3 / 13 ms | 20 |
| Unthrottled, lazy AR | 48 ms | 428 ms* | 49 ms | 0.017 | 0 | 10 / 3 / 33 ms | 20 |
| Unthrottled, CE EN | 40 ms | 52 ms | 64 ms | 0.026 | 0 | 10 / 2 / 12 ms | 20 |
| Unthrottled, CE AR | 60 ms | 46 ms | 66 ms | 0.017 | 0 | 10 / 2 / 22 ms | 20 |
| Slow 4G + CPU ×4, lazy EN | 652 ms | **1,895 ms** | 1,556 ms | 0.001 | 0 | 50 / 15 / 54 ms | 20 |
| Slow 4G + CPU ×4, lazy AR | 656 ms | **1,883 ms** | 1,543 ms | 0.000 | 0 | 45 / 16 / 72 ms | 20 |
| Slow 4G + CPU ×4, CE EN | 692 ms | 1,243 ms | 1,915 ms | **0.045** | 41 ms | 55 / 10 / 81 ms | 20 |
| Slow 4G + CPU ×4, CE AR | 720 ms | 1,244 ms | 1,909 ms | 0.003 | 48 ms | 53 / 9 / 114 ms | 20 |

\* A single noisy variant on a shared machine. The other three unthrottled variants are under
110 ms.

- **The lazy loader hides every registered tag** (`visibility: hidden` until the `hydrated`
  class is added). CLS stays near zero, but on Slow 4G the content is invisible until 1.9 s:
  FCP paints only the background and unregistered text. This is a FOUC-avoidance cost, not
  layout stability.
- **The custom-elements build without a bundler shows content earlier** (ready at 1.24 s),
  but nothing is hidden. Hosts lay out with their light-DOM content first and resize on
  upgrade. CLS reached 0.045 in English, with sources `sc-container` and `#text`.
- **Arabic layout time is 1.4–2× English** (33 vs 13 ms unthrottled; 114 vs 81 ms
  throttled). This comes from Arabic shaping. It isn't a budget problem, but Q3 should track
  it.
- **Main-thread cost is small:** script 45–55 ms at CPU ×4. The page's cost is **bytes and
  round trips**, especially fonts. It isn't script execution.
- **Element count:** 18 `sc-` elements and 17 shadow roots for a modest page. A results page
  with 20 service cards would have about 40 shadow roots. That is still cheap per root, because
  sheets are shared by reference.

### 2.7 Tests and CI

| Suite | Tests | Time | Result |
|---|---|---|---|
| Spec (`stencil test --spec`) | 182 in 31 files | 2.5 s | all pass |
| e2e, 3 workers (the `npm test` default) | 306 in 31 files | 163.5 s | **3 failed** |
| e2e, 1 worker | 306 | 204.4 s | **all pass** |

- **Coverage from spec tests only:** 65.3% statements, 46.0% branches, 67.6% functions and
  68.3% lines. The weakest components:
  - `sc-date-range` 33%
  - `sc-skip-link` 42%
  - `sc-page` 43%
  - `sc-radio-group` 57%
  - `sc-button` 58%
  - `i18n/digits.ts` 26%

  e2e tests cover these better, but no combined figure exists.
- **The three failures at 3 workers** are the familiar timeouts:
  - The first test of the two slowest suites timed out at 45 s:
    - `sc-service-card` axe in 4 contexts; the suite took 94 s
    - `sc-text-input` naming; the suite took 69 s
  - `sc-textarea`'s debounced-announcement test failed on a timing assertion.

  All three pass on one worker.
- **The 90 s `testing.testTimeout` in `stencil.config.ts` isn't applied.** Jest reports 45 s.
  Axe in 4 contexts inside one `it` is the slowest pattern in the suite.
- **What CI runs:** `.github/workflows/pages.yml` runs the token checks, `check:literals`, the
  build and spec tests, then publishes the playground. It runs **no e2e, no axe, no visual
  checks and no size checks**. The only other workflow is a secret scan.

---

## 3. Decisions for v2

### 3.1 Encapsulation per component family

The rule: a component uses **shadow DOM only when nothing outside it needs to reach inside**,
whether for ARIA references, form participation, native parent–child semantics or implicit
submission. Otherwise it renders native elements into light DOM with Stencil `scoped` styles.
Anything that needs no behaviour is **CSS only**: the tag is styled in the global stylesheet
and never registered.

| Family | Components | Mode | Why (measured or documented) |
|---|---|---|---|
| Layout primitives | `sc-container`, `sc-grid`, `sc-ltr` | **CSS only** (unregistered element styled by tag and attribute selectors in `@layer sc.components`) | They have no behaviour. Today they cost JS, a shadow root and, in the lazy build, visibility hidden until hydrated. `sc-container` was a CLS source. `sc-grid` spans become `sc-grid[span-medium="4"]` rules (36 rules). `sc-ltr` is `direction: ltr; unicode-bidi: isolate`, which equals `<bdi dir=ltr>`. |
| Page shell | `sc-page` | **Scoped** (light DOM), with minimal JS | It must wrap content in `<main>` and set `lang`, `dir` and channel. Already scoped in v1. |
| Card | `sc-card` | **Scoped** | Landmark role and label wiring. Consumers' headings stay in light DOM, so `aria-labelledby` works with ordinary IDs. |
| Form fields | `sc-text-input`, `sc-textarea`, `sc-select`, `sc-date-input`, `sc-search`, `sc-checkbox`, `sc-checkbox-group`, `sc-radio-group`, `sc-radio`, `sc-date-range` (its inputs) | **Scoped**: the component renders the native `<label>`, `<input>`, hint and error into light DOM from props | Enter-to-submit works natively (probe a–g). No ElementInternals mirroring, so less JS. Service `<label for>`, `aria-describedby` and error-summary links can target the real control ID. Native constraint validation and `FormData`. Lowest autofill risk. The radio group no longer needs manual slot assignment, because native radios share a `name` in one tree. |
| Actions | `sc-button` | **Scoped**: renders a native `<button>` or `<a>` in light DOM | It must be able to be the form's default button (probe e). Native `type=submit`, `form=`, `formaction` and `disabled` all work with no ElementInternals. |
| Links | `sc-link`, `sc-back-link`, `sc-skip-link` | **Shadow** (`delegatesFocus`) | Self-contained. Nothing references inside them. In-page fragments resolve in the document. A CSS-only class for inline links in running text is recommended alongside (see §6). |
| Lists and tables with native semantics | `sc-table`, `sc-summary-list` + `sc-summary-row`, and the planned accordion, timeline and notification list | **Scoped** | `<table>`, `<dl>` and `<ol>` must directly contain their parts. v1's summary list copies row data into a shadow `<dl>` through an internal `sc-summary-row-update` element. In light DOM the rows are the real `<div><dt><dd>` groups. |
| Chrome and display | `sc-app-bar`, `sc-footer`, `sc-channel-hero`, `sc-callout`, `sc-status-tag`, `sc-channel-chip`, `sc-spinner`, `sc-step-progress`, `sc-service-card`, `sc-error-summary`, `sc-language-switch`, new `sc-modal`, attention card, module card, tile, empty state, filter chips | **Shadow** | Visual encapsulation is the point. Nothing crosses the boundary. `::part()` is the styling escape hatch. `sc-modal` uses a native `<dialog>` in its own root with `showModal()` for the top layer and inert background. |

Rules for scoped (light DOM) components:

- **Styles go in `@layer sc.components`**, so a service's unlayered CSS always wins. Selectors
  stay at single-class specificity, with `:where()` around state selectors, so overrides never
  need `!important`.
- **The default slot is the only slot.** Rich content uses props or a named child element that
  the component reads; for example, a field's rich label is a `<span slot="label">` child that
  the component moves into its `<label>` once. This keeps Stencil's scoped slot relocation to
  the one case it handles well. Frameworks that own children (React) must not re-render
  relocated nodes. This is documented per component.
- **IDs are generated per instance** (`sc-<tag>-<n>`), never fixed strings: in light DOM they
  share the document.
- **Before upgrade, the host reserves its final size** through
  `sc-text-input:not(:defined) { display: block; min-block-size: var(--sc-size-field-block) }`
  and similar rules in the global stylesheet, so CLS stays 0 without hiding anything.

Shadow components:

- They expose `part`s for each structural element (as v1 does). They use `delegatesFocus` when
  the host is the thing a link or `focus()` should land on.
- They never put a form control in the shadow root.

### 3.2 Shared styles: one adopted sheet

- **`src/global/shadow.css` becomes Stencil's `globalStyle`.** Stencil turns it into one
  constructable stylesheet and adopts it into every shadow root. This is the existing
  `addGlobalStyleToComponents: 'client'` behaviour, measured in §2.3. It holds only what shadow
  roots need:
  - the focus ring (3px ring with a 2px surface-coloured offset, `:focus-visible` only, the
    forced-colours variant)
  - `.visually-hidden`
  - `.icon` and `.icon-directional`
  - `@keyframes sc-spin` with its reduced-motion guard
  - a minimal reset (`:host { box-sizing: border-box }` and inherited `*` box-sizing)

  The target is 1.5 KiB raw. It contains no tokens, no `@font-face` and no `body` rule, because
  those never apply inside a shadow root.
- **The document gets the same helpers through the document stylesheet** (below), so scoped
  components use identical class names.
- **Component CSS never `@import`s shared files.** `check:literals` gains a rule that fails on
  `@import` in `src/components/**.css`. The field styles that v1 shared through `field.css` move
  into the document stylesheet's `@layer sc.components`, since fields are now light DOM. They
  are delivered once per page, not once per field tag.
- **Expected result:**
  - The 21.4 KiB of `shared.css` copies and the 54.8 KiB of type-role copies go.
  - Total component CSS falls from 195.9 KiB raw / 16.4 KiB gzip to under 100 KiB raw /
    10 KiB gzip across the library.
  - The typical page's component CSS falls from 4.3 KiB to 4 KiB or less (W13).

### 3.3 Type roles without duplication

- **Each role is one `font` shorthand custom property plus a tracking property,** generated by
  `scripts/gen-type-css.mjs` (kept, retargeted) into the document stylesheet:

  ```css
  @layer sc.tokens {
    :root, [lang|="en"] {
      --sc-type-body-m: var(--sc-font-weight-regular) var(--sc-text-latin-body-m) / var(--sc-leading-latin-body-m) var(--sc-font-family);
      --sc-tracking-body-m: var(--sc-tracking-latin-body-m);
    }
    [lang|="ar"] {
      --sc-type-body-m: var(--sc-font-weight-regular) var(--sc-text-arabic-body-m) / var(--sc-leading-arabic-body-m) var(--sc-font-family);
      --sc-tracking-body-m: 0;
    }
  }
  ```

  Inside any root, a component writes
  `font: var(--sc-type-body-m); letter-spacing: var(--sc-tracking-body-m);`.
- **Custom properties inherit through shadow boundaries,** so the language switch follows the
  nearest `lang` attribute, including an Arabic block inside an English page. It costs one rule
  per language, not a rule per element.
- **`.sc-type-*` classes stay in the document** for services' own markup and become one
  declaration each.
- This needs one family name (§3.5). With weights as separate families, as in v1, the
  shorthand can't express a role.

### 3.4 Tokens, theming and cascade layers

- **One document stylesheet, `sc.css`.** It is built by concatenation in a post-build step and
  is the only `<link>` a page needs:

  ```css
  @layer sc.reset, sc.tokens, sc.base, sc.components, sc.utilities;
  @layer sc.tokens { /* tokens.css: :root custom properties, [data-channel] blocks, type roles */ }
  @layer sc.base   { /* @font-face is not layered (it can't be); body, :focus-visible for native elements */ }
  @layer sc.components { /* CSS-only primitives, scoped component styles, :not(:defined) size reservations */ }
  @layer sc.utilities  { /* .sc-type-*, .visually-hidden, .focus-ring */ }
  ```

  - **Services write unlayered CSS and win** over every `sc` layer without specificity games.
    Tailwind v4 or any layered framework can be ordered by declaring
    `@layer base, sc, components, utilities` before both.
  - `tokens.css` stays the F1 artefact (`design-system/dist/css/tokens.css`), so non-component
    consumers keep it.
- **Theme switching with no JS and no duplicated blocks:**
  - Colour tokens use `light-dark(<light>, <dark>)`, with `:root { color-scheme: light dark }`,
    `[data-theme="light"] { color-scheme: light }` and `[data-theme="dark"] { color-scheme: dark }`.
  - This replaces v1's two copies of the dark block. It removes about 85 declarations and
    about 1.5 KiB gzip, and a forced theme can apply to any subtree, not only `:root`.
  - Browser floor: Chromium 123, Safari 17.5, Firefox 120 (see §6).
- **Channel switching stays as `[data-channel="…"]` blocks** that alias
  `--sc-channel-*` to that channel's tonal roles. It applies anywhere in the tree, not only on
  `:root`, so a shared-network strip can show city indigo inside a channel page. Entities never
  get a block; they get attribution only, per the plan.
- **Budget:** the whole document stylesheet ≤ 9 KiB gzip (W7), including tokens, all type roles,
  helpers, CSS-only primitives and the light-DOM component styles.
- **Delivery:** `<link rel="stylesheet">` in `<head>`, never `@import`. It is render-blocking by
  design, because it holds the tokens.

### 3.5 Fonts

1. **One family: `font-family: 'Dubai W23'`, with faces at `font-weight` 400, 500 and 700.**
   - Keep `font-synthesis: none`, so no fake bold is drawn.
   - **Drop Light.** No role uses it. F1 confirms in `foundations.md`. This saves 63 KiB of the
     package and closes a weight nobody tested.
2. **Two subsets per weight, declared with `unicode-range`:**
   - **Latin:** U+0000–00FF, 0131, 0152–0153, 02BB–02BC, 02C6, 02DA, 02DC, 0304, 0308, 0329,
     2000–206F, 20AC, 2122, 2191, 2193, 2212, 2215, FEFF, FFFD. About 23 KiB.
   - **Arabic:** U+0600–06FF, 0750–077F, 0870–088E, 0890–0891, 0898–08E1, 08E3–08FF, 200C–200E,
     2010–2011, 204F, 2E41, FB50–FDFF, FE70–FE74, FE76–FEFC.
     - Declare the Arabic face **after** Latin, and include ASCII digits and punctuation in its
       file (about 32 KiB) but **not** in its `unicode-range`.
     - The browser then downloads only the Arabic file for Arabic text and the Latin file for
       Latin text. Mixed-script pages fetch both, which is correct.
   - English page with three weights: about 69 KiB, against 189 KiB (−63%). Arabic page: about
     80 KiB of Arabic files plus Latin only where Latin letters appear.
   - Subsetting is a build step: `scripts/subset-fonts.mjs` calls HarfBuzz `hb-subset` and a
     WOFF2 encoder. The source TTFs and the exact ranges are checked in. Generated WOFF2 files
     are build output.
3. **Preload one file:** the Regular subset for the page's language,
   `<link rel="preload" as="font" type="font/woff2" crossorigin href=".../dubai-w23-400-latin.woff2">`.
   - Not every weight: on Slow 4G, preloading three files competes with CSS and JS.
   - The `sc-page` docs and the templates carry the snippet for both languages.
4. **`font-display: swap` with a metric-matched fallback face,** so the swap doesn't move text:

   ```css
   @font-face { font-family: 'Dubai W23 Fallback'; src: local('Arial'), local('Helvetica'), local('Tahoma');
     ascent-override: 112.9%; descent-override: 55.9%; line-gap-override: 0%; size-adjust: <measured>; }
   ```

   - The ascent and descent values come from Dubai's hhea metrics (1129 / 559 on a 1000 UPM
     em).
   - `size-adjust` is measured per script by C1 in Wave 2. It is the ratio of average advance
     widths over a sample of Latin and of Arabic text, rendered in Helium, against Arial (Latin)
     and Tahoma or Geeza Pro (Arabic).
   - `--sc-font-family` becomes `'Dubai W23', 'Dubai W23 Fallback', system-ui, sans-serif`.
5. **Budget:** each WOFF2 file ≤ 32 KiB. Fonts on a page ≤ 75 KiB in English and ≤ 100 KiB in
   Arabic. Font-swap CLS is 0.

### 3.6 Output targets and loading

- **Primary build: `dist-custom-elements`** (`customElementsExportBehavior:
  'auto-define-custom-elements'`, as v1).
  - Applications and the R3 reference site import only the tags they use, and their bundler
    tree-shakes and merges them into their own chunks.
  - Measured: content ready 35% sooner than the lazy loader on Slow 4G (1.24 s against
    1.89 s), and 31.3 KiB against 38.8 KiB for the same tags.
  - The CLS this build showed in v1 (0.045) is removed by the light-DOM-first rendering and the
    `:not(:defined)` size reservations in §3.1, and by the font fallback in §3.5.
- **Secondary build: the lazy loader (`dist`),** for plain HTML pages, CMS pages and the
  playground. Three changes:
  - **`bundles` in `stencil.config.ts`** group components that appear together:
    - chrome: `sc-skip-link`, `sc-app-bar`, `sc-language-switch`, `sc-footer`, `sc-page`
    - content: `sc-channel-hero`, `sc-service-card`, `sc-callout`, `sc-status-tag`,
      `sc-channel-chip`
    - forms: the fields, `sc-button`, `sc-error-summary`
    - one bundle each for `sc-table` and `sc-date-range`

    The typical page drops from 16 scripts to about 5. The nested `sc-button` waterfall step
    disappears, because `sc-search` renders a native `<button>` in v2 anyway.
  - **`<link rel="modulepreload">`** for the core is emitted in the documented page snippet.
  - **Set `invisiblePrehydration: false`** (a top-level Stencil config option) and rely on the
    size reservations instead. Content is visible from first paint, so text in light DOM paints
    at FCP rather than at hydration. `hydratedFlag` stays for styling hooks.
- **Strings are split per component.** Each component imports its own
  `i18n/components/<tag>.ts` directly, never through `i18n/components/index.ts`.
  `check:literals` enforces it. That takes a leaf component from 6–7 KiB to about 2 KiB.
- **No framework wrappers in v2.0.**
  - React 19 supports custom elements natively, with properties and events.
  - Angular uses `CUSTOM_ELEMENTS_SCHEMA`; Vue uses `isCustomElement`.
  - If a React 18 service appears, add `@stencil/react-output-target` then. It is additive and
    changes no component.
- **SSR / hydrate script: not in v2.0.** Declarative shadow DOM SSR would remove the
  remaining pre-upgrade gap for shadow components. That is a Wave 3 option for the reference
  site (R3), not a library requirement.
- **Runtime core:** the core shrinks as features go unused, because Stencil tree-shakes its
  runtime by build conditionals. Expect savings from fewer shadow components with
  `delegatesFocus`, from no `formAssociated` and from no manual slot assignment. Don't enable
  `experimentalSlotFixes` unless a scoped component proves it needs them. Target ≤ 14 KiB gzip;
  C1 measures it with `check:budget`.

### 3.7 Budgets

Enforced in CI by `npm run check:budget`, which reads `components/perf-budgets.json`. All
figures are gzip -9, per file.

| Budget | Limit | v1 |
|---|---|---|
| Runtime core | 14 KiB | 15.5 KiB ✗ |
| Document stylesheet (`sc.css`) | 9 KiB | 4.1 KiB (tokens only) |
| Leaf component (JS + its CSS + its strings, excluding core) | **4 KiB** | 0.3–7.9 KiB (14 of 23 fail) |
| Form field | 7 KiB | 9.5–10.1 KiB ✗ |
| `sc-error-summary` | 6 KiB | 6.8 KiB ✗ |
| `sc-table` | 12 KiB | 13.0 KiB ✗ |
| `sc-date-range` | 16 KiB | 19.1 KiB ✗ |
| Typical page JS (lazy, including loader and core) | **30 KiB** | 38.8 KiB static + 7.9 KiB nested = 46.4 KiB transferred ✗ |
| Typical page component CSS | 4 KiB | 4.3 KiB ✗ |
| Each font file | 32 KiB | 63–64 KiB ✗ |

Runtime budgets, checked by Q3 with `npm run measure:runtime -- --cpu 4 --net slow4g`:

| Budget | Limit | v1 (lazy / CE) |
|---|---|---|
| All `sc-` content visible | ≤ 1.2 s | 1.89 s / 1.24 s |
| CLS, every variant, every run | 0 (≤ 0.005 measured) | 0.001 / 0.045 |
| TBT at CPU ×4 | 0 ms | 0 / 41–48 ms |
| Longest task at CPU ×4 | < 50 ms | 0 / 91–98 ms |
| Fonts transferred | ≤ 75 KiB EN, ≤ 100 KiB AR | 188.7 KiB |
| Requests (lazy) | ≤ 10 | 20 |
| Nothing render-blocking except `sc.css` | yes | yes |

### 3.8 Testing and CI

- **Spec tests:**
  - Keep Stencil spec tests for render output, props and events.
  - Light-DOM components make most assertions plain DOM queries.
  - Target 80% statements and 70% branches (spec + e2e combined, using `--coverage` on both).
  - `sc-date-range`, `sc-page`, `sc-skip-link` and `digits.ts` come first.
- **e2e:**
  - **Run on one worker** (`--max-workers=1`). Measured: 306 of 306 in 204 s, against 3
    failures in 163 s at 3 workers. 40 s is a fair price for zero flakes. CI shards by file
    across jobs (`--shard=1/3` …) if time matters, each job single-worker.
  - **Fix the timeout config:** set `testTimeout` where Jest honours it (Jest `testTimeout`
    through Stencil's `testing` config, or `jest.setTimeout` in a setup file). Measured: the
    effective limit is 45 s, not the configured 90 s.
  - **Timing-dependent tests** (debounced announcements) use fake timers or `waitForFunction`
    on the observable state, never fixed sleeps. v1 has 129 `setTimeout`, `waitForTimeout` or
    `waitForChanges` calls in e2e files, and Wave 2 reviews each.
- **Axe:**
  - **One test per context** (EN/AR × light/dark), so a slow context can't time out the
    others.
  - **A separate CI job runs axe over every playground page**, built and served statically, in
    all four contexts. These are the pages Q1 reviews, and the job is independent of the
    component suites.
  - WCAG 2.2 A and AA tags, as v1.
- **Visual regression:**
  - New `npm run test:visual` takes Puppeteer and Helium screenshots of each playground page in
    EN/AR × light/dark at 412 px and 1280 px, plus forced colours on the light pages.
  - It compares them with baselines checked into `components/test/visual/` using a pixel
    threshold.
  - Baselines are updated only by an explicit `--update`.
  - Run headless with fonts installed from the package, not the system, so the baselines are
    portable.
- **Size and runtime in CI:**
  - `npm run check:budget` runs after the build on every push and PR, and fails the job.
  - `measure:runtime --runs 5 --cpu 4 --net slow4g --json` uploads its JSON as an artefact.
    It warns on a regression above 10% against `main` and fails above the absolute budgets.
- **The CI job order:**
  1. tokens build and checks
  2. `check:literals` (now also no `@import` in component CSS, and no `i18n/components/index`
     imports)
  3. build
  4. spec
  5. budget
  6. e2e (one worker, sharded)
  7. axe on playground pages
  8. visual
  9. runtime (artefact)
  10. publish

  It uses Helium on the reference machine and the Chromium that Puppeteer downloads on CI
  (`SC_BROWSER`).

---

## 4. Migration note: what changes from v1

| Area | v1 | v2 | Kept identical? |
|---|---|---|---|
| Tag names | `sc-*` | same | **Yes** for every current tag. `sc-summary-row-update` (internal) is removed. |
| Attributes and props | as documented | same names and types | **Yes** where the component still exists in the same role. F2 may add props, and visual props may change values, for example `appearance`. |
| `sc-container`, `sc-grid`, `sc-ltr` | registered components | CSS only | Markup **yes**. `componentOnReady()`, `::part(inner)` and `::part(grid)` **no** (there's no shadow root). |
| Fields | shadow root, `::part(control)`, form-associated host | light DOM, native control is a child | Markup and props **yes**. `::part()` selectors **no**; use classes `.sc-field__control` etc. `el.shadowRoot` queries in services or tests **no**. `form.elements` now lists the native control, not the host. Fixed IDs `control`, `hint` and `error` become per-instance. |
| `sc-button` | shadow root + ElementInternals | light DOM `<button>` or `<a>` | Markup **yes**. `::part()` **no**. Enter-to-submit now works. |
| `sc-summary-list` / `sc-summary-row` | shadow `<dl>` rebuilt from row data | rows render their own `<div><dt><dd>` in light DOM | Markup **yes**. Events used internally are gone. |
| Shadow components | `::part()` names | same where the anatomy is the same | Mostly **yes**. F2 lists any renamed parts. |
| Stylesheet | `dist/sc-components/sc-components.css` (tokens + fonts + body) | `dist/sc.css` (layers, tokens, type roles, helpers, primitives, light-DOM component styles) | **No**: a new file name. The old path is kept as a copy for one release. |
| Tokens | `--sc-*` custom properties | same names, plus `--sc-type-<role>` and `--sc-tracking-<role>` | Mostly **yes**. F1 owns renames. `--sc-font-family-regular`, `-medium` and `-bold` collapse to `--sc-font-family` + weights. |
| Font families | `'Dubai W23 Regular'` etc. | `'Dubai W23'` with weights | **No**, for services that named a family directly. |
| Dark mode | `prefers-color-scheme`, `data-theme` on `:root` | same attributes, also on any subtree | **Yes**. |
| Channels | `data-channel` | same | **Yes**. |
| Script tags | `sc-components.esm.js` | same | **Yes**. |
| Bundler imports | `@sc/components/dist/components/sc-*.js` | same, minus the CSS-only tags | **Yes**, except the three primitives, which need no import. |
| Shadow helper classes in component CSS (`.type-*`, `@import shared.css`) | per component | global adopted sheet and `font: var(--sc-type-*)` | Internal only. |

---

## 5. Instructions for Wave 2 (C1–C5)

1. Read §3.1 and pick each component's mode from the table. A component missing from the
   table follows the rule at the top of §3.1. Record the choice in the component's spec.
2. In component CSS:
   - No `@import`.
   - Type uses `font: var(--sc-type-<role>)` with `letter-spacing: var(--sc-tracking-<role>)`.
   - Focus uses `.focus-ring` (shadow) or the same class from `sc.css` (scoped).
3. Light-DOM components:
   - Styles in `@layer sc.components`.
   - Per-instance IDs.
   - Only the default slot.
   - A `:not(:defined)` size reservation added to `sc.css`.
4. Strings: import `../../i18n/components/<tag>` only.
5. Run `npm run check:budget` before handing back. A component over budget comes with a reason
   in its spec, or is split.
6. Run the runtime script on your family's playground page in Arabic and English.

C1 also owns these, because they are cross-cutting:
- `src/global/shadow.css`
- the `sc.css` concatenation step
- `scripts/subset-fonts.mjs` and the fallback-face `size-adjust` measurement
- the `bundles` config
- the CI workflow changes (§3.8)

---

## 6. Needs the user's decision

1. **Browser floor:**
   - `light-dark()` needs Safari 17.5, Chromium 123 and Firefox 120 (all 2024).
   - `oklab()` (already required by the plan) needs Safari 15.4.
   - Form-associated custom elements (only for remaining shadow components, if any) need
     Safari 16.4.
   - Recommendation: **the last two major versions of Safari, iOS Safari, Chrome, Edge and
     Firefox, and Samsung Internet 25+.** If iOS 16 must be supported, tokens fall back to the
     v1 two-block dark mode, and the build can generate either.
2. **Light DOM for form fields and the button.** This is the largest API-visible change:
   `::part()` on fields and the button goes away. The evidence is the measured Enter-to-submit
   failure, plus the ID-reference, native-validation and autofill arguments. The alternative is
   to keep shadow roots and add keydown handlers that call `form.requestSubmit()`. That handles
   Enter in a field, but it still can't make a custom element the form's default submitter, and
   it keeps the ElementInternals mirroring. Recommendation: **light DOM**.
3. **Dropping the Light weight** of Dubai W23, which no role uses.
4. **Inline links:** keep `sc-link` as a shadow component for standalone links, and add a
   CSS-only `.sc-link` class on a native `<a>` for links in running text? Shadow links inside
   paragraphs make text selection and find-in-page highlight awkward.
5. **CI cost:** serial e2e (+40 s) plus visual and runtime jobs bring the pipeline to about
   10 minutes. Is that acceptable, or should visual and runtime run only on PRs to `v2` and
   `main`?
