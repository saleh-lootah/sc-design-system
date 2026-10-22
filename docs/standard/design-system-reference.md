# Shared Channels Design System reference

| | |
| --- | --- |
| Covers | Design system 2.x: the tokens and the `sc-` component library |
| Status | Reference. Versioned with the library. Not assessed directly |
| Date | 22 October 2026 |
| Owner | Shared Channels design system team |
| Read with | [Shared Channels Service Standard](service-standard.md) and [Assurance handbook](assurance-handbook.md) |

This reference holds the values, components and engineering rules of the Shared Channels design system: tokens and colour roles, the type scale, sizes, motion, icons, the component index and the library's budgets.

Services are not assessed against this document. They are assessed against the [Service Standard](service-standard.md), which sets the outcomes ("focus is always visible", "status never relies on colour alone", "Arabic text is never smaller than 16px") and tells services to use the shared design system ([CMP-01](service-standard.md#cmp)). The design system meets those outcomes in the ways described here. A service that uses the tokens and components as documented gets them for free; a service that builds its own element must reach the same outcome.

Rules here carry identifiers so that the design system team, component builders and reviewers can refer to them. They bind the design system and anyone who builds a component for it. Where a value here and the token files disagree, the token files are authoritative.

<a id="contents"></a>

## Contents

1. [Tokens and outputs](#tokens)
2. [Colour](#colour)
3. [Typography](#typography)
4. [Spacing, sizes and shape](#spacing)
5. [Layout and grid](#layout)
6. [Elevation](#elevation)
7. [Icons and imagery](#icons)
8. [Motion](#motion)
9. [Focus](#focus)
10. [Components](#components)
11. [Site chrome](#chrome)
12. [Budgets](#budgets)
13. [Library conventions](#conventions)
14. [Bibliography and acknowledgements](#bibliography)

---

<a id="tokens"></a>

## 1. Tokens and outputs

The foundations are design tokens in the W3C Design Tokens (DTCG) format. One build generates every platform output from them and runs the checks described in this reference.

| Output | Path in the design system repository | Used by |
| --- | --- | --- |
| Token source | `tokens/*.json` | The design system team only |
| CSS custom properties (`--sc-*`) | `dist/css/tokens.css`, included in `sc.css` | Websites, mobile web, hybrid apps and WebView screens |
| Tailwind theme | `dist/tailwind/theme.css` | Tailwind projects |
| Swift and Kotlin | `dist/ios/SCTokens.swift`, `dist/android/SCTokens.kt` | Native SwiftUI and Jetpack Compose screens |
| Full specification with every value and measured contrast pair | `docs/v2/foundations.md` | Designers and component builders |

Generated files are never edited by hand ([FND-01](service-standard.md#cmp)). The library's own code is checked for colour literals and raw font sizes by `npm run check:literals`; services run an equivalent check ([FND-02](service-standard.md#cmp)).

Colours are named by token in this reference, never by value. Palette tones are written as `<palette>-<tone>` (for example `neutral-40`), which is the token `--sc-palette-<palette>-<tone>`.

---

<a id="colour"></a>

## 2. Colour

**How the system works.** Every palette is a ramp of tones from 0 (black) to 100 (white). Contrast between two tones is the same whatever their hues, so every channel's tone 40 passes on white by the same margin. One generator builds every palette from a seed and writes the role tokens as aliases into the palettes, for light and dark. Channel colours are set centrally in the token files; no service or entity chooses or adds a colour.

| Palette | What it carries |
| --- | --- |
| City indigo (`indigo`) | The shared primary: what every channel has in common. The `primary` role is `indigo-30` in light mode |
| Seven channel signatures (`now`, `transport`, `visit`, `justice`, `build`, `invest`, `trade`) | Each channel's actions, containers and tints. Tone 40 for actions with white text (Dubai Trade uses tone 35), tone 90 for containers, tone 95 for subtle bands, tone 80 for actions in dark mode with `neutral-10` text |
| Neutral | Surfaces, text and edges. A grey with a trace of indigo |
| Semantic (`error`, `success`, `warning`, `info`) | Status: tone 40 for text and icons on a tone 95 container |
| Decorative tints (six hues) | Topic tiles only ([FND-27](#tints)) |

**Rules**

- **FND-03.** Every colour is defined in OKLAB. The token source uses the DTCG colour object with `"colorSpace": "oklab"`; the CSS and Tailwind outputs use `oklab()` values. Only the iOS and Android outputs convert to sRGB, because those platforms need numeric sRGB components; each converted value carries its OKLAB source in a comment. The build fails if the CSS or Tailwind output contains a hexadecimal colour. Official third-party artwork (the Government of Dubai lockup, the UAE PASS button and Dubai Pay assets) keeps its own colours and is outside this rule.
- **FND-04.** The palette is fixed centrally. The token build checks every colour against the palette's hue rules, and illustrations and images are reviewed against the same rules by eye. A new colour is added only by the design system team, through the generator.
- **FND-05.** Contrast is checked in the token pipeline, not assumed. `check:contrast` recomputes WCAG contrast for every pair the colours were designed for, in light and dark, for every channel: text at least 4.5:1; control boundaries, focus indicators and meaningful graphics at least 3:1. The pairs include the focus ring drawn inside an element against `channel-container`, `channel-subtle` and `primary-container`. A service that pairs colours in a way the tokens were not designed for (for example `on-surface-variant` text on `channel-container`) measures that pair itself and records the result.
- **FND-07.** `outline-variant` is for dividers and card edges only and is never the only boundary of an interactive control. Field and choice-control boundaries use `outline` at `--sc-size-border-control` (1.5px), which passes 3:1 on every surface. Outlined buttons use `channel-action` for their edge.
- **FND-25.** City indigo (`--sc-color-primary` and its family) is used only for what all channels share: the network eyebrow of the channel network strip, links in that shared network chrome, and the Dubai Pay and other shared hand-off buttons ([CMP-10](service-standard.md#cmp)). It is never used for UAE PASS, whose button follows its own guidelines ([CMP-11](service-standard.md#cmp)). A channel's own actions use the channel roles.

**System roles.** Components use these roles. The contrast of every pair is in `docs/v2/foundations.md` sections 2.4 and 2.8.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--sc-color-surface` | `neutral-100` | `neutral-10` | Page background |
| `--sc-color-surface-card` | `neutral-100` | `neutral-12` | Cards, fields and list groups |
| `--sc-color-surface-container` | `neutral-96` | `neutral-17` | Bands, panels, table headers, totals rows |
| `--sc-color-surface-container-high` | `neutral-94` | `neutral-22` | A container inside a container; skeletons; dialogs and sheets in dark mode ([FND-20](#elevation)) |
| `--sc-color-on-surface` | `neutral-10` | `neutral-100` | Primary text and icons |
| `--sc-color-on-surface-variant` | `neutral-40` | `neutral-80` | Secondary text: hints, captions, metadata |
| `--sc-color-outline` | `neutral-40` | `neutral-60` | Field and choice-control boundaries, and inactive markers |
| `--sc-color-outline-strong` | `neutral-10` | `neutral-90` | Hovered control edges |
| `--sc-color-outline-variant` | `neutral-90` | `neutral-24` | Dividers, card edges and the hairline on docked bars ([FND-07](#colour)) |
| `--sc-color-inverse-surface`, `--sc-color-inverse-on-surface` | `neutral-20`, `neutral-96` | `neutral-90`, `neutral-10` | Tooltips |
| `--sc-color-disabled-container`, `--sc-color-on-disabled` | `neutral-94`, `neutral-50` | `neutral-20`, `neutral-60` | A disabled control, still at least 3:1 ([A11Y-08](service-standard.md#a11y-beyond)) |
| `--sc-color-focus-ring` | `neutral-10` | `neutral-100` | The focus ring ([9](#focus)) |
| `--sc-color-primary`, `-hover`, `-pressed` | `indigo-30`, `-25`, `-20` | `indigo-80`, `-75`, `-70` | City indigo fills ([FND-25](#colour)) |
| `--sc-color-on-primary` | `neutral-100` | `neutral-10` | Text and icons on city indigo |
| `--sc-color-primary-container`, `--sc-color-on-primary-container` | `indigo-90`, `indigo-30` | `indigo-30`, `indigo-90` | A selected or emphasised indigo container |
| `--sc-color-primary-subtle` | `indigo-95` | `indigo-20` | A quiet indigo band |
| `--sc-color-<status>` | `<status>-40` | `<status>-80` | Status text, icons and error edges, for `error`, `success`, `warning` and `info` |
| `--sc-color-on-<status>` | `neutral-100` | `neutral-10` | Text on a status fill |
| `--sc-color-<status>-container`, `--sc-color-on-<status>-container` | `<status>-95`, `<status>-30` | `<status>-20`, `<status>-90` | Callout and status chip backgrounds, and strong text on them |
| `--sc-color-error-hover`, `--sc-color-error-pressed` | `error-35`, `error-30` | `error-75`, `error-70` | Destructive fills |
| `--sc-color-scrim` | Black at 50% | Black at 64% | Behind modal dialogs and sheets |
| `--sc-color-shadow` | Black | Black | Base shadow colour; each elevation level sets its own opacity |

Hover and pressed states on quiet controls (outlined and text buttons, rows, chips) are state layers: the content colour mixed in OKLAB at `--sc-opacity-hover` (8%) or `--sc-opacity-pressed` (12%). Filled controls use their explicit `-hover` and `-pressed` roles instead, so their text contrast is checked directly.

**Channel roles.** A page sets its channel once ([SVC-01](service-standard.md#svc-theme)). The same roles take the same tones in every channel:

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--sc-color-channel-action` | Tone 40 (Dubai Trade: 35) | Tone 80 | Filled and outlined buttons, links, selected states, the current step and navigation indicator |
| `--sc-color-channel-action-hover` | Action tone minus 5 | Tone 75 | Filled action on pointer hover |
| `--sc-color-channel-action-pressed` | Action tone minus 10 | Tone 70 | Filled action while pressed |
| `--sc-color-channel-container` | Tone 90 | Tone 30 | The bottom navigation indicator, the halo of the current step in the compact stepper, secondary pressed states |
| `--sc-color-channel-on-container` | Tone 30 | Tone 90 | Text and icons on `channel-container` |
| `--sc-color-channel-subtle` | Tone 95 | Tone 20 | The hero band, the current account navigation item, selected and unread rows, applied filter chips, the halo of the current step in the full stepper, channel-tone tags |
| `--sc-color-channel-outline` | Tone 80 | Tone 40 | The 1px edge of suggestion chips and outlined channel chips |
| `--sc-color-channel-on-action` | `neutral-100` | `neutral-10` | Text and icons on any channel action fill, the same in every channel |

Text on `channel-subtle` is `on-surface` or `on-surface-variant`, or `channel-action` for links and eyebrows.

- **FND-24.** Components use colour roles (`--sc-color-*`), never palette tones. The `--sc-palette-*` properties exist for documentation and tooling only.
- **FND-26.** To show another channel's colour inside a page (the channel switcher, a channel chip, a tile of the channel network strip, an `sc-step-list` row on another channel), the element sets `data-channel` on itself so the channel roles are rebound for its subtree. Another channel's values are never written into code.

<a id="tints"></a>

**Decorative tints.** Six tints (`blue`, `violet`, `rose`, `orange`, `amber`, `green`) colour category icon tiles, favourite-service tiles and topic accents. The tile is `--sc-color-tint-<name>` (tone 95; tone 20 in dark mode) and the icon and any short text on it are `--sc-color-on-tint-<name>` (tone 40; tone 80 in dark mode).

- **FND-27.** Tints are decorative. They never mark actions, links, status or selection, and a tinted tile always carries a text label. Several tints share a hue family with a channel or a status, which is acceptable only because tints never sit where those colours carry meaning.

<a id="dark-mode"></a>

**Light and dark themes**

- **FND-08.** Each colour role holds both values in one `light-dark()` function, so `tokens.css` follows the system setting, and `data-theme="dark"` or `data-theme="light"` on an element forces that theme for its subtree (a dark footer on a light page works). For browsers without `light-dark()`, the token build also emits a `prefers-color-scheme` and `[data-theme]` fallback; in that fallback, channel roles follow `data-theme` only when it is on the same element as `data-channel`. Code never branches on the theme. Whether a service must offer both themes is set by the Service Standard ([FND-09](service-standard.md#cmp)).

**Charts and data visualisation.** There is no chart palette in the tokens yet ([OQ-21](service-standard.md#open-questions)). Until there is, charts use `on-surface`, `on-surface-variant`, `outline` and `channel-action`, label every series directly, distinguish series by pattern or shape as well as colour, and come with a text summary or data table.

---

<a id="typography"></a>

## 3. Typography

Shared Channels uses **Dubai Font** for both scripts, in three weights: Regular (400), Medium (500) and Bold (700). The font stack falls back to a metric-matched local face, then `system-ui` and `sans-serif`. How the font files load is in [PERF-10](#budgets).

- **FND-11.** Text is set with a type role, never a free size: on the web the `.sc-type-<role>` classes in page markup, and the `--sc-type-<role>-*` properties (family, weight, size, leading and tracking) inside components. Each property follows the nearest `lang`, so one class or property serves both scripts and components never branch on script. This is how the library meets [LANG-25](service-standard.md#lang-type).
- **FND-12.** Only the Regular, Medium and Bold weights are used. Where English uses Medium for short interface text (navigation, chips, metadata), Arabic uses Bold. Because short Arabic text is already Bold, a current or selected state never relies on a change of weight alone ([A11Y-06](service-standard.md#a11y-beyond)).
- **FND-13.** Leading is deliberately tight, because Dubai Font's tall vertical metrics make loose leading look airy. The table gives the exact values. Services do not override leading; the text spacing test ([A11Y-10](service-standard.md#a11y-testing)) confirms that content survives users' own overrides. Text containers use a minimum height, never a fixed height, so text spacing overrides do not clip.
- **FND-29.** Page and section headings use the headline roles. The display roles are for heroes only: the `<h1>` inside `sc-channel-hero` uses a display role.

The scale has 15 roles in five groups. Arabic runs about one step larger, with taller leading, and is never letter-spaced ([LANG-26](service-standard.md#lang-type)). Sizes and leading are in CSS px.

| Role | Use | English: size / leading, weight, tracking | Arabic: size / leading, weight |
| --- | --- | --- | --- |
| `display-large` | Home hero, from 1024px | 80 / 84, Bold, −0.02em | 88 / 108, Bold |
| `display-medium` | Channel hero, from 1024px | 57 / 62, Bold, −0.015em | 64 / 80, Bold |
| `display-small` | Heroes below 1024px | 45 / 50, Bold, −0.01em | 50 / 64, Bold |
| `headline-large` | Page heading (`h1`) | 32 / 38, Bold | 36 / 48, Bold |
| `headline-medium` | Section heading (`h2`); a field that is the page heading | 28 / 34, Bold | 32 / 44, Bold |
| `headline-small` | Subsection heading (`h3`); totals and amounts | 24 / 30, Bold | 28 / 38, Bold |
| `title-large` | Card and panel titles | 22 / 28, Bold | 24 / 34, Bold |
| `title-medium` | Row titles, emphasised values | 18 / 24, Bold | 20 / 30, Bold |
| `title-small` | Navigation items in side and bottom navigation, summary-list values, step names | 17 / 22, Medium | 19 / 28, Bold |
| `body-large` | Body text, the default for running text | 18 / 26, Regular | 20 / 32, Regular |
| `body-medium` | Hints, secondary text, table cells | 16 / 24, Regular | 18 / 28, Regular |
| `body-small` | Captions and fine print | 14 / 20, Regular | 16 / 24, Regular |
| `label-large` | Buttons, field labels, question group legends, main navigation in the site header (at Medium weight in English) | 18 / 22, Bold | 20 / 28, Bold |
| `label-medium` | Chips, tabs, 48px buttons, error messages | 16 / 20, Medium | 18 / 24, Bold |
| `label-small` | Metadata labels, step counters, badges | 14 / 18, Medium | 16 / 22, Bold |

Only the three display roles carry tracking, and only in English. Every Arabic role has 0 tracking. The English minimum size is 14px ([FND-28](service-standard.md#cmp)) and the Arabic minimum is 16px ([LANG-27](service-standard.md#lang-type)).

**Digits.** Digits are Latin in both languages ([LANG-20](service-standard.md#lang-numerals)). Dubai Font's digits are tabular by default, so amount columns align without `font-variant-numeric`.

---

<a id="spacing"></a>

## 4. Spacing, sizes and shape

- **FND-14.** Spacing uses the spacing scale (`--sc-space-<n>`, in px): 0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 128.
- **FND-15.** Sizes use the size tokens:

| Token | Value | Use |
| --- | --- | --- |
| `--sc-size-control-primary` | 56px | Primary buttons and text fields: everything in a question page's main flow |
| `--sc-size-control-secondary` | 48px | Secondary and compact buttons, compact fields, controls in tables and headers |
| `--sc-size-target-min` | 44px | The minimum interactive target ([A11Y-04](service-standard.md#a11y-beyond)) |
| `--sc-size-chip` | 32px | The visual height of chips; the target extends to 44px |
| `--sc-size-stepper-marker` | 28px | Stepper markers in the full layout. The compact stepper uses 24px markers |
| `--sc-size-icon-s`, `-m`, `-l` | 16, 20, 24px | Icons ([7](#icons)) |
| `--sc-size-focus-ring`, `--sc-size-focus-offset` | 3px, 2px | Focus ring ([9](#focus)) |
| `--sc-size-border-hairline` | 1px | Dividers, card edges and the top edge of docked bars |
| `--sc-size-border-control` | 1.5px | Control edges |
| `--sc-size-border-strong` | 2px | Error and selected edges; stepper connectors |
| `--sc-size-border-accent` | 3px | The bar under the current item of the header navigation and beside the current item of the account navigation |
| `--sc-size-strip` | 4px | The one start-bar width: the bar on the start side of a field in error and of a callout. Also the channel rule along the top of `sc-app-bar` and the top rule of each channel network tile |
| `--sc-size-measure` | 680px | An alias of `--sc-container-reading`, the maximum width of running text |

- **FND-16.** Corner radii use the radius tokens: `--sc-radius-control` 4px (buttons, checkboxes, segmented controls), `--sc-radius-chip` 6px (status chips: `sc-status-tag` and `sc-channel-chip`), `--sc-radius-field` 8px (text inputs, selects, textareas, callouts), `--sc-radius-card` 12px (cards, list groups, panels, popovers, dialogs and the top corners of bottom sheets) and `--sc-radius-none` (tables and full-bleed bands). `--sc-radius-full` is only for shapes whose roundness carries meaning: radio buttons, stepper markers, avatars, switch thumbs, suggestion and filter chips, preset toggles, count badges, the navigation indicator and calendar day cells. Buttons and fields are never pills.

---

<a id="layout"></a>

## 5. Layout and grid

| Breakpoint | From | Columns | Gutter | Outer margin |
| --- | --- | --- | --- | --- |
| compact | 0 | 4 | 16px | 20px |
| medium | 600px | 8 | 20px | 32px |
| expanded | 1024px | 12 | 24px | 48px |
| wide | 1440px | 12 | 24px | 80px |

- **FND-17.** Pages use `sc-page`, `sc-container` and `sc-grid`, or the same tokens on native. Content is capped at `--sc-container-max` (1280px). Question pages, check answers pages and running text use `sc-container width="reading"` (680px), aligned to the start edge.
- **FND-18.** Layouts respond to available width, not device type. Components that change layout (for example `sc-summary-list`, `sc-table`) respond to their own width.

---

<a id="elevation"></a>

## 6. Elevation

Surfaces are flat and outline-first. A shadow means "this floats over the page", and nothing else.

- **FND-19.** Shadows use three elevation levels: `--sc-elevation-0` (everything in the page flow, cards included), `--sc-elevation-1` (sticky top bars once content scrolls under them) and `--sc-elevation-2` (popovers, menus, dialogs and sheets). Bars docked to the bottom edge (`sc-utility-bar`, `sc-bottom-nav`) are flat, with a 1px `outline-variant` hairline along their top edge and no shadow. Cards are separated by a 1px `outline-variant` edge or by sitting on `surface-container`, never by a shadow.
- **FND-20.** Surfaces are opaque: no glass, backdrop blur or gradients. In dark mode, where shadows barely show, overlays also take a 1px `outline-variant` edge, and dialogs and sheets use `surface-container-high` so they step up from the page. Modal dialogs and sheets sit over `scrim`.

---

<a id="icons"></a>

## 7. Icons and imagery

- **FND-21.** Icons are **Material Symbols, Outlined style** (weight 400, grade 0, optical size 24; Apache 2.0 licence), listed in one manifest (`components/src/icons/icons.json`) and generated into each component, so a component carries only the icons it uses. They are inline SVG on a 24px grid, drawn in `currentColor`, never an icon font. The Filled style is used for two things only: status icons, and the selected state of navigation and tab icons, so that selection changes shape as well as colour. Sizes are 16px in chips and beside small text, 20px beside body text and inside fields, and 24px in buttons and standalone. A new icon is requested from the design system team, not drawn locally.
- **LANG-24.** A new icon is classified as directional or not when it is added to the icon set. Directional icons use the `icon-directional` class (or `data-directional` on a slotted SVG) so they mirror.

**Which icons mirror in Arabic.** An icon mirrors when it shows direction along the reading line. The rest of the mirroring rules are in the Service Standard ([LANG mirroring](service-standard.md#lang-mirroring)).

| Mirrors | Does not mirror |
| --- | --- |
| Back and forward arrows, and chevrons used for navigation or disclosure (`arrow_back`, `arrow_forward`, `chevron_left`, `chevron_right`, `navigate_next`) | Check marks, close, plus and minus |
| "Open in new" and external-link arrows | Search, lock, home, person, calendar, mail, phone |
| Send, reply, undo, redo, log in and log out | Clocks, timers, `schedule` and `history` (time runs clockwise in both scripts) |
| List and text-alignment icons with a ragged edge; indent and outdent | Media playback (play, pause, fast-forward follow tape direction, not reading direction) |
| `help`, because Arabic writes the question mark mirrored (؟) | Status icons (error, warning, info, check circle) |
| Progress and stepper direction | Logos, brand marks, and Latin text or numbers inside icons |

---

<a id="motion"></a>

## 8. Motion

Motion in a government service has one job: to help people see what changed. It is never decoration on a task someone is trying to finish, and most changes do not animate at all. The motion tokens in `tokens/motion.json` set the timings, so services do not choose their own.

Three motion rules are outcomes that services are assessed on, and they are in the Service Standard: actions started from the keyboard happen instantly ([MOT-02](service-standard.md#cmp-motion)), nothing flashes or moves for long without a pause control ([MOT-14](service-standard.md#cmp-motion)), and reduced motion is respected ([MOT-15](service-standard.md#cmp-motion)). The rules below are how the design system meets them.

**Should it animate at all?**

- **MOT-01.** Decide by frequency first:

| How often a person triggers it | Decision | Examples |
| --- | --- | --- |
| Many times in a session, or from the keyboard | No animation | Sorting a table, keyboard month changes in a calendar, moving between fields, opening a menu with the keyboard |
| Often (tens of times) | None, or a short colour change only | Row and button hover, list navigation |
| Occasionally | Standard motion | A popover, a bottom sheet, a dialog, a selection bar appearing |
| Rarely | Standard motion; no more | The confirmation page |

- **MOT-03.** Every animation has a stated purpose: keeping spatial relationships clear (a sheet comes from and returns to the bottom edge), showing a change of state, giving feedback on a press, or preventing a jarring jump. "It looks good" is not a purpose.

**Easing and duration**

- **MOT-04.** Elements entering or leaving use a strong ease-out curve. Elements moving or changing shape on screen use a strong ease-in-out curve. Colour changes on hover use `ease`. Constant motion (a spinner) is linear. Ease-in is not used for interface motion: it delays the moment the user is watching.

| Purpose | Curve | Token |
| --- | --- | --- |
| Enter | Strong ease-out, `cubic-bezier(0.23, 1, 0.32, 1)` | `--sc-easing-enter` |
| Exit | The same strong ease-out | `--sc-easing-exit` |
| Movement on screen | Strong ease-in-out, `cubic-bezier(0.77, 0, 0.175, 1)` | `--sc-easing-standard` |
| Hover and colour changes | `ease`, `cubic-bezier(0.25, 0.1, 0.25, 1)` | `--sc-easing-hover` |
| Bottom sheets and drawers | `cubic-bezier(0.32, 0.72, 0, 1)` | `--sc-easing-drawer` |

- **MOT-05.** Exits use `--sc-easing-exit`, an ease-out curve, with the exit durations in [MOT-07](#motion), or an opacity fade.
- **MOT-06.** Interface motion stays under 300ms. The bands below apply to entrances; exits are shorter ([MOT-07](#motion)).

| Element | Entrance duration |
| --- | --- |
| Micro-interactions: press feedback, hover, toggles | 100–150ms |
| Standard interface: tooltips, popovers, menus, selects | 150–250ms |
| Modals, dialogs, drawers and bottom sheets | 200–300ms |

  Larger elements animate more slowly than smaller ones, and an element that travels further takes longer. The duration tokens are `--sc-duration-fast` (120ms) for hover and colour, `--sc-duration-press` (150ms) for press feedback, `--sc-duration-base` (200ms) for standard entrances and for centred dialogs, and `--sc-duration-slow` (280ms) for bottom sheets and drawers only, which travel from the screen edge. `--sc-duration-instant` (0ms) is for keyboard-initiated actions.
- **MOT-07.** Exits are about 20% faster than entrances, not more: a popover that enters over `--sc-duration-base` leaves over `--sc-duration-exit` (160ms), by opacity only; a centred dialog enters over 200ms and leaves over 160ms; and a sheet enters over 280ms and leaves over `calc(var(--sc-duration-slow) * 0.8)`, which is 224ms. An exit that is much faster than its entrance reads as a cut.

**Physical behaviour**

- **MOT-08.** Nothing animates from `scale(0)`. Popovers and menus enter from `scale(0.96)` (`--sc-scale-enter`) with opacity 0, with `transform-origin` at the corner of the trigger they belong to (a logical corner, so it moves to the right in Arabic). Modals and dialogs are not anchored to a trigger: they stay centred.
- **MOT-09.** Pressable elements give visual feedback on press: `scale(0.97)` (`--sc-scale-press`) on `:active`, over `--sc-duration-press` (150ms). The action itself fires on release (the up event, or the native `click`), so moving the pointer off the target before release cancels it (WCAG 2.5.2).
- **MOT-10.** Bottom sheets follow the finger one to one while dragged, and close on a downward flick (release velocity above 0.11 px/ms) as well as on a long drag. Dragging is never the only way to close: every sheet has a close button (WCAG 2.5.7). Sheets do not bounce unless the user's own gesture carried momentum. A sheet that holds an `alert` dialog (the session timeout warning) cannot be dragged closed or dismissed from the scrim ([TIME-02](service-standard.md#pat-timeout)).

**Implementation**

- **MOT-11.** Only `transform` and `opacity` animate movement and appearance. Hover and state colour changes may transition colour properties. Layout properties (`width`, `height`, `margin`, `padding`, `top`, `left`) are never animated, and `transition: all` is not used.
- **MOT-12.** Anything that can be interrupted (a popover opened and closed quickly, a selection bar, a toggle) uses CSS transitions, which retarget from the current state, not keyframe animations, which restart. Keyframes are for constant motion only (the spinner, the skeleton pulse).
- **MOT-13.** Hover motion is gated behind `@media (hover: hover) and (pointer: fine)`, so it does not stick after a tap on touch screens.

**Reduced motion.** Under `prefers-reduced-motion: reduce` the tokens set `--sc-duration-spin` to 0ms and `--sc-scale-press` and `--sc-scale-enter` to 1, while the other durations keep their values, so short opacity fades stay ([MOT-15](service-standard.md#cmp-motion)).

**Spinner.** The spinner turns at constant (linear) speed, one rotation per `--sc-duration-spin` (600ms). A faster rotation reads as faster loading.

**How the rules apply to current components**

| Component and moment | Motion |
| --- | --- |
| `sc-table` sort | None; rows reorder instantly |
| `sc-table` row hover | Background colour over `--sc-duration-fast`, `ease`, fine pointers only |
| `sc-table` selection bar | Enters with opacity and an 8px rise over `--sc-duration-base`; leaves with opacity over `--sc-duration-exit` |
| `sc-date-range` popover | Enters with opacity and `scale(0.96)` to 1 from the field's top inline-start corner over `--sc-duration-base`; leaves with opacity over `--sc-duration-exit` |
| `sc-date-range` bottom sheet | Slides up over `--sc-duration-slow` with `--sc-easing-drawer`; the scrim fades with it over `--sc-duration-slow`, and out over `calc(var(--sc-duration-slow) * 0.8)` |
| `sc-date-range` month change | Pointer: crossfade with a 12px shift in the direction of travel (mirrored in Arabic) over `--sc-duration-base`. Keyboard: instant |
| Channel switcher and account menu ([11](#chrome)) | Pointer: opacity and `scale(--sc-scale-enter)` from the trigger's corner over `--sc-duration-base`; leaves with opacity over `--sc-duration-exit`. Keyboard: instant |
| `sc-modal` centred dialog | Enters with opacity and `scale(--sc-scale-enter)` from its own centre over `--sc-duration-base` (200ms); leaves over `--sc-duration-exit` (160ms); the scrim fades with it. Opened from the keyboard: instant |
| `sc-modal` bottom sheet (below 600px) | Slides up over `--sc-duration-slow` (280ms) with `--sc-easing-drawer`; leaves over 224ms, from wherever a drag left it |
| `sc-notification-list` "mark all as read" | The unread fill fades over `--sc-duration-base` when a pointer started it; instant from the keyboard |

The source of these motion rules is credited in the [bibliography](#bibliography).

---

<a id="focus"></a>

## 9. Focus

The requirements are [A11Y-05 and A11Y-15](service-standard.md#a11y-beyond). The ring is built from one role and two sizes, the same in every channel:

```css
:focus-visible {
  outline: var(--sc-size-focus-ring) solid var(--sc-color-focus-ring);
  outline-offset: var(--sc-size-focus-offset);
}
```

- `outline` follows the element's radius and survives forced-colours mode, where it uses the system `Highlight` colour. The 2px offset leaves the background showing between the control and the ring.
- Inside a filled region the region sets `--sc-color-focus-ring` to its own "on" colour for its subtree: `--sc-color-on-primary` on a city indigo fill such as a hand-off button, `--sc-color-channel-on-action` on a filled channel band and `--sc-color-inverse-on-surface` in a tooltip. These are pairs that `check:contrast` already measures.
- Where the outside ring would be clipped, the component draws the same ring inside its edge with a negative `outline-offset`: `sc-bottom-nav` items, full-height navigation links in `sc-site-header` and `sc-notification-list` rows do this. An inset ring that stays whole is better than an outside ring that is cut off.
- Sticky or fixed regions inside components (a sticky table column, the weekday row and footer of a date sheet) reserve their size in their scroll container with `scroll-padding`, so they never cover the focused element.
- The ring shows on `:focus-visible` only. The one exception is `sc-skip-link`, which shows the ring whenever it is focused, because it is visible only while focused.
- Focus is never animated ([MOT-02](service-standard.md#cmp-motion)).

---

<a id="components"></a>

## 10. Components

<a id="library"></a>

### 10.1 The component library

The Shared Channels component library is a set of web components built with StencilJS, with the tag prefix `sc-`. One build works in plain HTML and JavaScript and in any framework. The components have no runtime dependency other than Stencil. Generated wrappers for React, Angular and Vue are planned; they will wrap the same components.

Each component's specification (`components/specs/<tag>.md`) sets its anatomy, behaviour, states, Arabic behaviour, budget and tests, and its readme (`components/src/components/<tag>/readme.md`) lists its properties, events, slots and parts. Native teams implement against these specifications ([PLAT-05](service-standard.md#plat-native)).

**Loading the library ([CMP-02](service-standard.md#cmp)).** Load `sc.css` (the tokens, type roles and shared styles) once per page with a `<link>` in `<head>`, never through `@import`. Set `lang`, `dir`, `data-channel` and, optionally, `data-theme` on an ancestor, normally through `sc-page`. A service's own unlayered CSS overrides the library's cascade layers without `!important`. A service that puts its own CSS in cascade layers declares its layer order before both stylesheets, so that the layers holding its overrides come after the library's `sc` layer, for example `@layer base, sc, components, utilities;`. Every light-DOM component stylesheet starts with the library's full order: `@layer sc.reset, sc.tokens, sc.base, sc.components, sc.utilities;`.

**Light DOM and shadow DOM ([CMP-04](service-standard.md#cmp)).** Field components and `sc-button` render native elements into the page (light DOM): each field renders its own `<label>`, control, hint and error and links them, so a service's own `aria-describedby`, error summary links and `form.elements` reach the control by its ID. These components have no `::part()` styling hooks; their documented classes take that role. Other components use shadow DOM. ID references between page markup and a shadow component's internals do not work in the supported browsers: to describe a field, use the field's `hint` or a plain element in the page, not a callout or a status tag.

<a id="component-index"></a>

### 10.2 Component index

| Family | Component | Use it for | Do not use it for |
| --- | --- | --- | --- |
| Actions and navigation | `sc-button` | Starting an action: "Continue", "Pay with Dubai Pay". One `primary` per page or section; `secondary` (outlined), `tertiary` (link-style) and `destructive` variants; `handoff` (city indigo) for Dubai Pay and other shared hand-offs ([CMP-10](service-standard.md#cmp)); `loading` state; `href` for a "Start now" call to action | Going somewhere else: use `sc-link`. Signing in with UAE PASS ([CMP-11](service-standard.md#cmp)) |
| | `sc-link` | Going somewhere: `standalone` (with an arrow and a 44px target) or `external` (new tab, with hidden "(opens in new tab)"). For links in running text, the `.sc-link` class on a native `<a>` ([CMP-08](service-standard.md#cmp)) | Actions that submit, save or delete |
| | `sc-back-link` | "Back" to the previous step, on every step except the first | Going to the start of the service |
| | `sc-breadcrumbs` | Where a channel page sits in the channel's hierarchy, in the hero of inner pages. The current page is text with `aria-current="page"`; below 600px, one "Back to {parent}" link | Pages inside a journey: use `sc-back-link` |
| | `sc-pagination` | Pages of a long list outside or inside `sc-table` (in its `footer` slot): "Showing 1 to 20 of 1,284 fines" / «عرض 1 إلى 20 من 1,284 مخالفة» ([LANG-22A](service-standard.md#lang-numerals)) | Moving between question pages |
| | `sc-language-switch` | Switching to the same page in the other language ([LANG-04](service-standard.md#lang-switching)) | Choosing between more than two languages |
| | `sc-skip-link` | "Skip to main content" / «الانتقال إلى المحتوى الرئيسي», first in the page; it targets `#main-content`, the `<main>` that `sc-page` renders | – |
| Site chrome ([11](#chrome)) | `sc-app-bar` | The top bar of transaction pages: a 4px channel rule, the back link, the channel's official name and the language switch | Channel pages outside a transaction: use `sc-site-header`. The page heading: that is the `<h1>` |
| | `sc-site-header` | The header of channel pages outside a transaction: the lockup slot, main navigation, search, language, sign in with UAE PASS or the account menu, and the channel switcher; a compact row with a modal menu below 1024px | Transaction pages |
| | `sc-channel-switcher` | The channel's logo and the disclosure that lists the seven channels, in the header's `switcher` slot | Labelling content about another channel: use `sc-channel-chip` |
| | `sc-account-menu` | The signed-in state in `sc-site-header`: notifications with the unread count, and a disclosure with profile, settings, "change who you act for" and sign out | Applications and payments: they are in `sc-account-nav` |
| | `sc-account-nav` | The side navigation of the signed-in account area, with count badges, the current item and sign out | Navigation outside the account area |
| | `sc-bottom-nav` | The signed-in primary navigation below 1024px, docked flat to the bottom edge | Signed-out pages; transaction pages |
| | `sc-announcement-bar` | A site-wide announcement above the header: planned maintenance, an outage, a change people need to know about; `info`, `warning` or `error`; optionally dismissible | A message about one page or one person's task: use `sc-callout` |
| | `sc-utility-bar` | The docked help and feedback bar on channel sites | Transaction pages; navigation |
| | `sc-footer` | `simple` on transaction pages: help and contact, accessibility, privacy, cookies and terms links. `grouped` on channel sites, with the Channels group | – |
| | `sc-channel-network` | The channel network strip on channel home pages | Choosing a channel from the header: use `sc-channel-switcher` |
| Form fields | `sc-text-input` | One line: plate number, Emirates ID number, email, phone, amount (`prefix-text="AED"`) | Long answers: use `sc-textarea` |
| | `sc-textarea` | Several sentences, with an optional character count | One-line answers |
| | `sc-radio-group`, `sc-radio` | One choice from about seven options or fewer | Several choices: use `sc-checkbox-group` |
| | `sc-checkbox-group`, `sc-checkbox` | Several choices, or one statement to confirm | One choice |
| | `sc-select` | One choice from a long list | Up to about seven options: use radios |
| | `sc-date-input` | A date people know: date of birth, policy start date | Choosing dates from a calendar |
| | `sc-date-range` | A start and end date related to a calendar: filtering payments, the nights of a stay. Clear and Apply buttons | One known date |
| | `sc-search` | Searching a channel or a list of services | Filtering a table |
| | `sc-filter-chips` | The filters applied to a list of results, as removable 32px chips (44px targets) beside the result count, with "Clear all filters". Removal is instant, focus moves to the next chip, and the new count is announced | Choosing filters: that is a form (planned `sc-filter`) |
| Feedback and status | `sc-error-summary` | Listing every error at the top of the page after a submission ([CMP-05](service-standard.md#cmp)) | Problems not caused by the user's answers: use `sc-callout tone="error"` |
| | `sc-callout` | An important message in the content: `info`, `success`, `warning` or `error`; at most one per section | Field errors; the status of an item in a list |
| | `sc-status-tag` | The status of an application, task or payment, from the status vocabulary, in a semantic tone ([CMP-12](service-standard.md#cmp)) | Messages the user must read; labels about another channel |
| | `sc-channel-chip` | Pointing to another channel that offers the service: "Also on Dubai Transport" / «متوفر أيضًا في مواصلات دبي» | The main way forward |
| | `sc-step-progress` | The stepper: "Step 2 of 4" in a linear journey of 2 to about 7 question pages ([CMP-09](service-standard.md#cmp)) | Long or branching journeys where the total is not known |
| | `sc-step-list` | A life event as an ordered list of services, which may span channels: a row on another channel takes that channel's colour and an "On Dubai Transport" / «على مواصلات دبي» chip | The steps of one transaction: use `sc-step-progress` |
| | `sc-timeline` | The status history of an application; the latest entry is current | Steps still to come |
| | `sc-notification-list` | Notifications in the account area, grouped by day. Each notification is one link; unread ones have a fill, a dot, a Bold title and a hidden "Unread:" / «غير مقروء:» | Something the user must act on now: use `sc-attention-card` |
| | `sc-empty-state` | An empty list or a search with no results: an icon, a heading, one sentence and one action; `variant="success"` for an all-clear | Errors: use `sc-callout tone="error"` |
| | `sc-modal` | A short secondary task, as a centred dialog from 600px and a bottom sheet below; with `alert` and `countdown`, the session timeout warning | Anything a full page can do; content people need beside the page |
| | `sc-spinner` | A short inline wait, with a label saying what is loading | A button's own loading state: use `sc-button loading` |
| Content and layout | `sc-page` | The page frame: header, `<main id="main-content">` and footer, with language, direction and channel set once; it reserves space for a sticky header, the utility bar and the bottom navigation | – |
| | `sc-container` | Page margins; `width="reading"` for question pages and running text (CSS only) | – |
| | `sc-grid` | 4, 8 and 12-column layouts (CSS only) | Tabular data: use `sc-table` |
| | `sc-card` | Grouping related content on a flat surface: `outlined` (default) or `filled` for totals | A link to a service: use `sc-service-card` |
| | `sc-service-card` | A link to a service in a listing: the title is the only link ([CMP-06](service-standard.md#cmp)) | Content that is not a single link |
| | `sc-tile` | One link to a life event, a category or a favourite service: a tinted icon tile, a title and an optional count ("14 services") | A service with its owning entity: use `sc-service-card` |
| | `sc-attention-card` | One thing that is due (a bill, a document, an expiring registration): an icon tile in the status tag's tone, the tag, a heading, a fact, a meta line and one action. It has no coloured edge and is not a link | Items with nothing to do |
| | `sc-module-card` | A titled module on a signed-in page, with a header link named with the title ("View all, Applications") and its content | A single link: use `sc-tile` or `sc-service-card` |
| | `sc-accordion` | Sections that open and close, for frequently asked questions and long guidance, built on native `<details>` | Questions in a journey; content everyone needs |
| | `sc-channel-hero` | The top of a channel's home or section page: a flat band with the heading and search ([CHR-07](service-standard.md#tpl-chrome)) | Question pages |
| | `sc-summary-list`, `sc-summary-row` | Check your answers; the details of one thing | Comparing several things: use `sc-table` |
| | `sc-table` | Comparing rows of the same kind of thing: fines, payments, applications; sorting, selection, `compact` density (44px rows) for staff tools | Layout; the details of one thing |
| | `sc-ltr` | Isolating left-to-right values in page markup ([LANG-15](service-standard.md#lang-bidi)) | Whole sentences in another language |

<a id="component-detail"></a>

### 10.3 How components meet the Service Standard

The Service Standard sets the rule. This is how the component meets it.

| Rule | Component behaviour |
| --- | --- |
| Error summary ([CMP-05](service-standard.md#cmp)) | `sc-error-summary` takes focus (`tabindex="-1"`) and is a `role="group"` named by its heading, "There is a problem" / «توجد مشكلة», with no `role="alert"`. Each item links to the field's `id`; the field components delegate focus so the link lands in the control |
| Service card ([CMP-06](service-standard.md#cmp)) | The title link's target grows to 44 × 44 without covering the card, and the arrow at its top end is decorative, not a second link |
| Links ([CMP-08](service-standard.md#cmp)) | Running-text links (`.sc-link`, `sc-link`) are underlined in `channel-action` (or `primary` in the shared network chrome) in every state, with the underline thickening on hover. Navigation links in the header, footer, breadcrumbs, cards, tiles, chips and the skip link may underline on hover only; the footer and breadcrumbs use `on-surface` |
| Stepper ([CMP-09](service-standard.md#cmp)) | Completed markers: `channel-action` fill with a check. Current: `channel-action` fill, an inner dot, a halo (`channel-subtle` in the full layout, `channel-container` in the compact layout, `outline-variant` in dark mode) and `aria-current="step"`. Upcoming: `surface` fill with a 2px `outline` edge |
| Shared hand-offs ([CMP-10](service-standard.md#cmp)) | `sc-button variant="handoff"`: `primary` fill with `on-primary` text, the same on every channel |
| UAE PASS ([CMP-11](service-standard.md#cmp)) | Until the official UAE PASS button is in the library, `sc-site-header` renders a placeholder in its `signin` slot: a black button labelled "Sign in with UAE PASS" with a fingerprint glyph, 56px tall, the same on every channel and in both themes. It is never an `sc-button` and never city indigo. The placeholder is for prototypes and demonstration pages ([OQ-3](service-standard.md#open-questions)) |
| Status tags ([CMP-12](service-standard.md#cmp)) | Tones `neutral`, `info`, `success`, `warning` and `error`. The `channel` tone (`channel-action` text on `channel-subtle`) is a highlight such as "Life event", never a status |
| Session timeout ([TIME-02](service-standard.md#pat-timeout)) | `sc-modal alert countdown`: no close button; no scrim or drag dismissal; Escape keeps the user signed in; the body and countdown are referenced by `aria-describedby`; the time left is text, announced politely on opening, at each whole minute and at 30 and 10 seconds, never every second; nothing is submitted at zero |
| Pasted values ([LANG-21](service-standard.md#lang-numerals)) | Text and number fields remove bidirectional control characters (U+200E, U+200F, U+202A to U+202E, U+2066 to U+2069) from pasted values before validation |
| Announcements ([CHR-09](service-standard.md#tpl-chrome)) | A dismissal is remembered in session storage only |

<a id="backlog"></a>

### 10.4 Planned components

These components do not exist yet. Tag names are proposed. Until a component exists, the interim approach in the last column meets the Service Standard and needs no exception ([CMP-03](service-standard.md#cmp)).

| Planned component | Needed for | Priority | Until it exists |
| --- | --- | --- | --- |
| `sc-uaepass-button` | Sign in with UAE PASS anywhere in a journey, built from the official kit | High | The provider's official asset |
| `sc-file-upload` | Upload documents | High | Native `<input type="file">` with a visible label, following the upload pattern ([UP-01 to UP-06](service-standard.md#pat-upload)) |
| `sc-combobox` | Nationality, area, business activity and other long lists people type into | High | `sc-select` with the full list |
| `sc-notification-banner` | Page-level messages, including the result of an action on the next page | High | `sc-callout` at the top of `<main>`. Site-wide interruptions use `sc-announcement-bar` |
| `sc-panel` | The confirmation panel with the reference number | High | `sc-card` with a heading and the reference in `sc-ltr` |
| `sc-task-list` | Task list pages | High | A list of links with `sc-status-tag` |
| `sc-details` | Help text revealed on request; toggletips | High | Native `<details>` and `<summary>` |
| `sc-cookie-banner` | Cookie consent | High | A service-built banner meeting [PRV-12 to PRV-16](service-standard.md#prv-cookies) |
| `sc-plate` | Showing a vehicle plate as a plate | Medium | Page markup with the plate in `sc-ltr` |
| `sc-filter` | Choosing filters for service search results | Medium | A form with checkboxes and a submit button, with `sc-filter-chips` for the filters applied |
| `sc-exit-page` | Quick exit for sensitive services | Medium | A service-built link meeting [EXIT-01 to EXIT-04](service-standard.md#pat-quick-exit) |
| `sc-warning-text`, `sc-inset-text` | Legal warnings and quoted information | Medium | `sc-callout` |
| `sc-phase-banner` | Showing that a service is in beta | Medium | `sc-callout tone="info"` under the app bar |
| `sc-chip` (suggestion and toggle), `sc-icon-tile` | Suggestion and toggle chips outside the hero; a standalone tinted icon tile | Low | The hero's suggestion chips; the icon slots of `sc-tile` and `sc-service-card` |
| `sc-tabs` | Closely related views | Low | Separate pages |
| `sc-progress-bar`, skeleton | Long processes with measurable progress | Low | `sc-spinner` with a label |

Not planned: toasts. Outcomes are shown in the page with `sc-callout` or `sc-notification-banner`, where they persist and can be found again. Inputs for phone numbers, amounts, Emirates ID numbers, plates and one-time codes are configurations of `sc-text-input`, not new components.

Whether Dubai Pay needs its own button component depends on whether it mandates one ([OQ-4](service-standard.md#open-questions)).

---

<a id="chrome"></a>

## 11. Site chrome

The Service Standard sets what channel-site chrome must contain and how it must behave ([CHR-01 to CHR-11](service-standard.md#tpl-chrome)). These are the design values the components use.

| Part | Design values |
| --- | --- |
| Site header (`sc-site-header`) | Flat `surface` bar with a 1px `outline-variant` rule beneath it. Main navigation in `label-large` (Medium in English, Bold in Arabic). The current item is `channel-action`, Bold, with a 3px `channel-action` bar at its block end and `aria-current="page"`. A compact row with a modal menu below 1024px, and whenever the full row does not fit |
| Government of Dubai lockup | Taken through the header's `lockup` slot; the library ships no logo. Public demonstration pages use a neutral placeholder of the same proportions, labelled "Government of Dubai lockup". Until the usage manual sets them ([OQ-30](service-standard.md#open-questions)), the interim values are: at least 40px tall in the header, clear space on every side equal to the height of the wordmark's capital "G", and a white plate on dark surfaces |
| Channel switcher (`sc-channel-switcher`) | A disclosure listing the seven channels with a swatch in each channel's own colour ([FND-26](#colour)); the current channel has a check |
| App bar (`sc-app-bar`) | 60px bar with a 4px channel rule along its top and a 1px rule beneath; no glass and no shadow; the channel name as its title when the `title` slot is empty |
| Utility bar (`sc-utility-bar`) | From 1024px: docked to the bottom edge across the full width, flat, with a 1px `outline-variant` hairline along its top and no shadow ([FND-19](#elevation)). Items have a 20px icon and a visible label in `label-medium`, 48px tall, wrapping to a second row rather than hiding labels. It publishes its height so the page can reserve it. It becomes static at the end of the page below a viewport height of 600px. Below 1024px it folds into the footer as a 2 × 2 grid of outlined buttons |
| Footer (`sc-footer`) | On `surface`, never on a dark band. Links in `on-surface`. In the Channels group the current channel is Bold, carries a 3px start bar in `channel-action` as its non-weight cue, and has `aria-current="true"` |
| Hero (`sc-channel-hero`) | A flat `channel-subtle` band: no gradient, wash, shadow or image behind text |
| Channel network strip (`sc-channel-network`) | City indigo network eyebrow; each tile has a 4px top rule in its own channel's colour |
| Bottom navigation (`sc-bottom-nav`) | Three to five items, flat and docked to the bottom edge; the current item has a Filled icon and a 56 × 32 indicator in `channel-container`; inset focus ring |
| Account navigation (`sc-account-nav`) | A side list; the current item is `channel-subtle` with a 3px `channel-action` bar; it becomes a row that scrolls sideways below 600px |

---

<a id="budgets"></a>

## 12. Budgets

The library's budgets sit inside the Service Standard's page budgets ([PERF-02 and PERF-03](service-standard.md#perf)), so the library leaves most of a page's budget to the service. The reasoning and measurements are in `docs/v2/architecture.md`. `components/perf-budgets.json` is authoritative where it and this section disagree.

- **PERF-08.** Each release of the library stays within these size budgets, measured gzip level 9 per file as the browser downloads it (fonts by file size). `npm run check:budget` checks them in CI. For components in the budget file's enforce list (currently every shipped component) the budget is a release gate; for any other component it is reported. A component over budget records its reason in its specification, or is split.

| Budget | Limit |
| --- | --- |
| Runtime core | 14 KiB |
| Library stylesheet (`sc.css`: tokens, fonts, type roles, shared styles, light DOM component styles) | 9 KiB |
| Helper styles shared into shadow roots | 1.5 KiB |
| Component (its module and the files it imports, excluding the core) | 4 KiB |
| Form fields (`sc-text-input`, `sc-textarea`, `sc-select`, `sc-checkbox`, `sc-checkbox-group`, `sc-radio-group`, `sc-date-input`) | 7 KiB each |
| Recorded overrides | `sc-breadcrumbs` 4,224 B; `sc-account-nav`, `sc-app-bar`, `sc-bottom-nav` and `sc-channel-network` 4.5 KiB; `sc-button` and `sc-utility-bar` 5 KiB; `sc-announcement-bar` 5.5 KiB; `sc-error-summary` and `sc-footer` 6 KiB; `sc-modal` and `sc-account-menu` 7 KiB; `sc-site-header` 7.5 KiB; `sc-search` and `sc-channel-switcher` 8 KiB; `sc-table` 12 KiB; `sc-date-range` 21 KiB |
| Each font file | 32 KiB |

- **PERF-09.** A page built with the library meets these limits for the library's share of it, on a Slow 4G profile (1.6 Mbps down, 750 Kbps up, 150 ms round trip) with the CPU slowed four times:

| Budget | Limit |
| --- | --- |
| Library JavaScript on a typical page (including loader and core) | 30 KiB gzip |
| Component CSS parsed on a typical page | 4 KiB gzip |
| Fonts downloaded | 75 KiB on an English page, 100 KiB on an Arabic page |
| Total transferred by the library | 115 KiB in English, 140 KiB in Arabic |
| All `sc-` content visible | 1.2 s or less |
| Cumulative Layout Shift from the library | 0 (0.005 or less measured) |
| Total blocking time | 0 ms |
| Longest task | Under 50 ms |
| Requests, with the lazy loader | 10 or fewer |

- **PERF-10.** Fonts load as one set of files under the family `Dubai W23`, with `Dubai W23 Arabic` (the same Arabic files) put first under `lang="ar"`, a real `font-weight` per face (400, 500 and 700) and `font-synthesis: none`. They are subset by script: a Latin and an Arabic file for each weight, declared with `unicode-range`, so a page downloads only the scripts and weights it shows (an Arabic page takes even its spaces, digits and punctuation from the Arabic files). The language switch's name of the other language ("العربية" on an English page, "English" on an Arabic page) is set in its own small face (`Dubai W23 Name`), so one word never pulls in the other script's whole file. Only the Regular file of the page's language is preloaded, before the stylesheet, and every face uses `font-display: swap` with a metric-matched fallback face, so the swap does not move text:

```html
<link rel="preload" as="font" type="font/woff2" crossorigin href="/sc/assets/fonts/dubai-w23-400-latin.woff2">
<link rel="stylesheet" href="/sc/sc.css">
```

  On an Arabic page the preloaded file is `dubai-w23-400-arabic.woff2`. No other weight is preloaded: on Slow 4G, several preloads compete with the stylesheet and scripts.
- **PERF-11.** The library stylesheet is the only render-blocking resource the library adds. Applications import only the components they use from the custom elements build, so their bundler can merge them; plain HTML pages use the lazy loader and include the `sc-preload.html` that each build generates, which preloads the runtime core and the page-shell bundle. Before a component upgrades, its final size is reserved, so nothing is hidden and nothing shifts.

**Evidence.** With each library release the design system team publishes the `check:budget` result and the runtime report (Slow 4G, CPU ×4). `check:budget` loads the typical page in English and in Arabic in a real Chromium-based browser and counts the font files it actually downloads, so the font budgets measure real downloads, not the files on disk.

---

<a id="conventions"></a>

## 13. Library conventions

- **Conventions.** Every component follows `components/CONVENTIONS.md`: visible labels; hints and errors linked with `aria-describedby`; `aria-invalid` and a visually hidden "Error:" prefix; form association; focus delegation; keyboard support; forced-colours styles; logical properties only; strings in both languages; and tests (axe in English and Arabic, light and dark; keyboard; form behaviour). A service that builds its own element meets the same conventions and passes the same tests ([CMP-03](service-standard.md#cmp)).
- **Contributing.** New components follow the recipe in `components/CONTRIBUTING.md`. The steps are in the Service Standard ([contributing](service-standard.md#contributing)).
- **Mobile.** `MOBILE.md` sets what each kind of mobile team uses, and when. Native teams implement against `components/specs/<tag>.md` and each component's readme ([PLAT-05](service-standard.md#plat-native)).

<a id="platforms"></a>

| How it is built | What the team uses | Status |
| --- | --- | --- |
| Website and mobile web | `sc-` web components and the library stylesheet (`sc.css`) | Available now |
| Hybrid app or WebView screen | `sc-` web components, exactly as on the web | Available now |
| Native SwiftUI or Jetpack Compose screens and modules | Generated tokens (`dist/ios/SCTokens.swift`, `dist/android/SCTokens.kt`) and the component specifications | Tokens available now |
| Flutter | Generated Dart tokens and a Flutter widget kit | Planned |
| React Native | Generated TypeScript tokens with a theme hook, and a React Native component kit | Planned |
- **Versioning.** The tokens and the library are versioned separately from the Service Standard, with semantic versioning ([ASR-07 to ASR-10](service-standard.md#contributing)). Each release has a changelog; a breaking change includes migration guidance (`docs/v2/migration.md` for design system 2).
- **Support floor.** The library supports the last two major versions of each evergreen browser in the Service Standard's support matrix ([A11Y support matrix](service-standard.md#a11y-support)). Dark mode in older engines that some users still have is covered by the token build's fallback ([FND-08](#dark-mode)).

---

<a id="bibliography"></a>

## 14. Bibliography and acknowledgements

- W3C Design Tokens Community Group. *Design Tokens Format*. https://www.designtokens.org/
- Google. *Material Symbols* (Apache 2.0). https://fonts.google.com/icons
- StencilJS. https://stenciljs.com/
- W3C. *ARIA Authoring Practices Guide*. https://www.w3.org/WAI/ARIA/apg/

**Acknowledgements.** The motion guidance in [section 8](#motion) draws on Emil Kowalski's published design engineering notes on animation (https://github.com/emilkowalski/skills). The design system team adapted them; any errors are ours.
