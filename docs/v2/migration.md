# Migrating from v1 to v2

For service teams and for the Wave 2 family agents. v2 keeps the tag names and most attributes; what changes is the look, the stylesheet, the tokens, the fonts and, for form controls and the button, the DOM. There is **no compatibility layer**: a v1 token name that v2 removed resolves to nothing.

Sources: `foundations.md` §12 (full token map), `architecture.md` §4, `decisions.md` (A1–A5, U1–U4 and the role-name table).

## 1. What a page links

| | v1 | v2 |
| --- | --- | --- |
| Stylesheet | `dist/sc-components/sc-components.css` (tokens, fonts, body) | **`dist/sc-components/sc.css`**: tokens, fonts, base, light-DOM component styles and helpers, in cascade layers |
| Script | `dist/sc-components/sc-components.esm.js` | the same (lazy loader), or per-tag imports from `dist/components/` (the primary build for applications) |
| Fonts | 4 full files, 63–64 KiB each, as 4 families | 6 subset files, 21–30 KiB each, one family `Dubai W23` |

`sc-components.css` still exists, but in v2 it holds only the shared helpers that Stencil adopts into shadow roots. A page that links only that file gets no tokens. Link `sc.css` instead:

```html
<html lang="en" dir="ltr" data-channel="transport">
<head>
  <link rel="preload" as="font" type="font/woff2" crossorigin href="/sc/assets/fonts/dubai-w23-400-latin.woff2">
  <link rel="stylesheet" href="/sc/sc.css">
  <script type="module" src="/sc/sc-components.esm.js"></script>
</head>
```

Preload one file only: the Regular subset of the page language (`dubai-w23-400-arabic.woff2` on an Arabic page). The `@font-face` rules and the metric-matched fallback do the rest.

### Cascade layers

`sc.css` declares `@layer sc.reset, sc.tokens, sc.base, sc.components, sc.utilities`. Your own CSS, written without a layer, beats all of them: no `!important`, no specificity games. A layered framework (Tailwind v4) orders itself around them, for example `@layer base, sc, components, utilities;` before both stylesheets.

## 2. Tokens

The full map is `foundations.md` §12. The changes most services hit:

| v1 | v2 |
| --- | --- |
| `--sc-color-canvas` | `--sc-color-surface` (pages are white) |
| `--sc-color-surface` | `--sc-color-surface-card` (same name now means the page) |
| `--sc-color-ink`, `--sc-color-ink-strong` | `--sc-color-on-surface` |
| `--sc-color-muted` | `--sc-color-on-surface-variant` |
| `--sc-color-rule` / `--sc-color-control` | `--sc-color-outline-variant` (dividers only) / `--sc-color-outline` (control edges) |
| `--sc-color-on-action` | `--sc-color-channel-on-action` |
| `--sc-channel-action`, `-hover`, `-pressed`, `-subtle` | `--sc-color-channel-action`, `-action-hover`, `-action-pressed`, `-subtle` |
| `--sc-channel-ink`, wash, glass, `fill-quiet`, `fill-selected`, `link-visited` | removed: see §12.1 (`channel-on-container`, `channel-subtle`, state layers, `channel-container`) |
| `--sc-channel-<channel>-<role>` | removed: set `data-channel="<channel>"` on the element |
| `--sc-text-latin-<role>`, `--sc-leading-*`, `--sc-tracking-*`, `.sc-type-ar-*` | `--sc-type-<role>` (one `font` shorthand), plus `--sc-type-<role>-size`, `-leading`, `-tracking`, `-weight`, `-family`; the script follows `lang` |
| v1 role names (`heading-xl`, `body-m`, `label-m`, `title-s` …) | Material roles (`headline-large`, `body-large`, `label-large`, `title-small` …): see §12.2 |
| `--sc-font-family-regular`, `-medium`, `-bold`, `-light` | `--sc-font-family` (follows `lang`) with `--sc-font-weight-regular`, `-medium`, `-bold`. Light is gone (A3) |
| `--sc-radius-pill`, `-s`, `-panel`, `-sheet` | `--sc-radius-full` (restricted), `-control` 4, `-field` 8, `-card` 12, `-chip` 6 |
| `--sc-size-control-l` (54) / `-m` (44) | `--sc-size-control-primary` (56) / `-secondary` (48) |
| `--sc-elevation-1` (cards) | none: cards are flat with an `outline-variant` edge |

New in v2: the city indigo `primary` family, `inverse-*`, `surface-container-high`, `disabled-container`, `on-disabled`, `focus-ring`, `scrim`, `outline-strong` (hovered control edges, the sign-in edge, the plate chip; 3:1 or more), `channel-container`, `channel-on-container`, `channel-outline` (1px chip edges, decorative), `info-*`, the six decorative tints, `--sc-opacity-hover` (8%) and `--sc-opacity-pressed` (12%).

Type in your own markup:

```css
.lede { font: var(--sc-type-body-large); letter-spacing: var(--sc-type-body-large-tracking); }
```

or the class `.sc-type-body-large`, which also follows `lang`.

### Dark mode and older browsers (A1)

Colour tokens use `light-dark()`: the theme follows the system, and `data-theme="light|dark"` on any element forces it for that subtree. Browsers without `light-dark()` (iOS 16, Safari before 17.5) get a generated fallback in the same file: system roles follow the system setting and `data-theme` on any element; channel roles follow the page theme, or a `data-theme` set on the same element as `data-channel`.

### Focus (U1)

The focus ring is neutral (neutral-10 in light, white in dark), 3px, 2px offset, on every channel, replacing v1's channel-coloured ring. Inside a filled area, set the area's "on" colour for its subtree:

```html
<div class="network-strip" style="--sc-color-focus-ring: var(--sc-color-on-primary)">…</div>
```

`sc.css` gives every native focusable element this ring through `:where(:focus-visible)` (zero specificity).

### Links in running text (A4)

`<a class="sc-link" href="…">` styles a native link in running text: channel action, underlined 1px at 4px (5px in Arabic), 2px on hover, the U1 ring wrapping across lines. Keep `sc-link` for standalone links.

## 3. Components

### Form controls and the button: light DOM (A2)

`sc-button` now (and the fields when C2 rebuilds them) render their native elements in light DOM:

| | v1 | v2 |
| --- | --- | --- |
| DOM | a shadow root with the control inside | the native `<button>`/`<a>` (fields: `<label>`, `<input>`, hint, error) as children of the host |
| Enter in a field | never submitted the form | submits, through the first `type="submit"` `sc-button` (the default button) |
| `event.submitter` | `null` | the native button, with its `name` and `value` |
| `::part(control)`, `::part(label)`, `::part(icon)` | supported | **gone**. Use `.sc-button`, `.sc-button__label`, `.sc-button__icon`, or better, no override |
| `el.shadowRoot.querySelector(…)` in services or tests | worked | `el.querySelector('.sc-button')` |
| `form.elements` | listed the host | lists the native control |
| `focus()`, `click()` on the host | delegated | forwarded to the native control |
| IDs | fixed inside the shadow root (`control`, `hint`, `error`) | per instance (`sc-<tag>-<n>`); `<label for>` and `aria-describedby` from your markup can point at them |

React and other frameworks that own children: render the label as a stable child and do not re-render it after upgrade; Stencil moves it into the native control.

### `sc-button` API

| | v1 | v2 |
| --- | --- | --- |
| `variant` | `primary`, `secondary` (tinted fill), `tertiary`, `destructive` | the same names (secondary is now **outlined**, tertiary **link-style**), plus **`handoff`** for UAE PASS and Dubai Pay (city indigo on every channel, U3) |
| `size` | `l` 54px (default), `m` 44px | unset = the variant's own height (56 for primary, destructive, handoff; 48 for secondary, tertiary); `l` 56, `m` 48, `xl` 64 (hero search) |
| `type`, `href`, `disabled`, `loading`, `loading-text`, `full-width`, `icon`, `icon-position`, `slot="icon"` | | unchanged |
| `name`, `value`, `form` | not supported | new: passed to the native button |
| Shape | pill | 4px corners |

### Layout primitives and the rest

`sc-container`, `sc-grid` and `sc-ltr` become CSS-only in Wave 2b (C4): the markup stays, `componentOnReady()` and `::part(inner)` / `::part(grid)` go. Shadow components (app bar, footer, hero, callout, status tag, chips, spinner, stepper, service card, error summary, links) keep their shadow roots; renamed parts are listed in their specs. Until each family agent rebuilds them, v1 components render against v2 tokens and look broken. That is expected.

## 4. Fonts

| | v1 | v2 |
| --- | --- | --- |
| Families | `'Dubai W23 Regular'`, `'Dubai W23 Medium'`, `'Dubai W23 Bold'`, `'Dubai W23 Light'` | **`'Dubai W23'`** with `font-weight` 400, 500, 700 (`'Dubai W23 Arabic'` is the same files, put first under `lang="ar"`) |
| Files | `DubaiW23-<Weight>.woff2`, full character set | `dubai-w23-<weight>-latin.woff2` and `-arabic.woff2`, loaded per character range |
| An English page | 189 KiB | about 62 KiB (three Latin weights) |
| An Arabic page | 189 KiB | about 59 KiB (Arabic Regular and Bold), plus a Latin file only where Latin letters appear |

Services that named a weight family directly (`font-family: 'Dubai W23 Bold'`) must switch to `font-family: var(--sc-font-family); font-weight: var(--sc-font-weight-bold)`, or a type role. The subsets keep Dubai's default tabular lining digits; the fraction, ordinal, superscript and old-style alternates are not included.

## 5. Strings (component authors)

Each component imports its own strings file and the v2 controller, never the merged dictionary:

```tsx
import { LocaleController } from '../../i18n/controller';
import strings from '../../i18n/components/sc-thing';
private locale = new LocaleController(this, strings);
```

`i18n/locale.ts`, `i18n/strings.ts` and `i18n/components/index.ts` remain only for v1 components and are deleted when the last one migrates (end of Wave 2b).

## Site chrome (C1, Wave 2b)

### `sc-app-bar` and the new `sc-site-header`

v1's `sc-app-bar` did two jobs. v2 keeps the tag name for the **transaction app bar** (component-language A4: back, channel name, language; a 4px channel rule; flat) and adds **`sc-site-header`** for channel pages (Standard CHR-01 to CHR-04), as component-language B2 and decision Q-names propose.

| v1 | v2 |
| --- | --- |
| `<sc-app-bar>` with back, title, language | unchanged markup; flat bar, 4px channel rule, title defaults to the channel name |
| `<sc-app-bar align="start" shape="floating">` with nav and sign in (desktop header) | **deprecated**: still renders (flat), but move to `<sc-site-header>` with `slot="lockup"`, `slot="nav"` links, `slot="language"`, `sign-in-href` or `slot="signin"`, `slot="account"`, `slot="switcher"` |
| `shape="floating"`, the glass and its reduced-transparency fallback | ignored / gone |
| sign in as `<sc-button slot="end">` | the UAE PASS button in `slot="signin"` (decision U3a); until the kit arrives `sign-in-href` renders a marked black placeholder. Not `sc-button`, not city indigo |

### `sc-footer`

| v1 | v2 |
| --- | --- |
| one row of links | `variant="simple"` (default, the same row) or `variant="grouped"` (brand, Channels, Helpful information, Legal; CHR-06) |
| `help-href`, `accessibility-href`, `privacy-href`, `terms-href`, default slot, `slot="meta"`, parts | unchanged |
| — | new: `variant`, `channel`, `links`, `about-href`, `cookies-href`, `sitemap-href`, `updated`, `slot="brand"` |
| labels "Accessibility", "Privacy", "Terms" | "Accessibility statement", "Privacy and cookies" (or "Privacy" + "Cookies" with `cookies-href`), "Terms of use". Replace an extra `<a>Cookies</a>` with `cookies-href` |
| `sc-container` inside | gone; the footer sets its own margins |

### `sc-page`

Props and slots unchanged. New: the sticky-header scroll padding also follows `sc-site-header[sticky]`, and the page pads its end by a docked `sc-utility-bar` (`--sc-utility-bar-block-size`). The background is `surface`.

### New tags

`sc-site-header`, `sc-channel-switcher` (light DOM; component-language B2a), `sc-account-menu`, `sc-announcement-bar`, `sc-utility-bar` (U4), `sc-channel-network`. Channel links for the switcher, the grouped footer and the network strip are one `links` JSON (`{"now":"https://…/{lang}/", …}`); `{lang}` becomes `en` or `ar`.

### Strings

Channel names in the switcher, footer, network strip and app bar come from `src/i18n/components/common.ts` (Standard 3.1) through `channelStrings()` in `src/i18n/components/channels.ts`, which also holds the one-line descriptors.
