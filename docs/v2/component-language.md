# Shared Channels Design System v2 · component language

Status: Wave 1 deliverable F2, 21 October 2026. Draft for the coordinator and the user.

This document turns direction E ("Dubai Design System, evolved") into per-component visual rules for the v2 `sc-` library. The five component agents (C1–C5) build from it, together with `foundations.md` (F1, tokens) and `architecture.md` (F3, build).

**Sources read:**

- Direction E in Paper (file `01M5A0E3KTNXQ1262CTCJDXCMP`, page "E · Dubai Design System"):
  - E0, the overview, including its components section (buttons, fields and chips, stepper)
  - E1, the Dubai Now home page, desktop, English
  - E2, the question page with an error, mobile, Arabic
  - E3, check your answers, mobile, English, dark
  - E4, the Dubai Pay review page, mobile, English

  All values were taken from `get_jsx` and computed styles, never from screenshots.
- The Dubai Design System repository, read for anatomy only:
  - `packages/stencil/src/components/dda-*`
  - `docs/a11y/findings.md`, `manual-review.md`, `component-matrix.md` and `contrast-decision.md`

  The DDS fault IDs (F-0xx) cited below come from `findings.md`.
- The v1 library:
  - `components/COMPONENTS.md`, `CONVENTIONS.md` and every `readme.md`
  - `components/specs/sc-table.md` and `components/specs/sc-date-range.md`
  - Standard 2.0, chapters 5, 6, 8.7, 10, 11 and 13
- The Dubai Now reference pages (Paper file `01M5A6FZR8XR1M22Y7T8CDWGTP`, pages 10 and 11): the notes "Public · pattern candidates", "Signed in · pattern candidates" and "Shared chrome". These are for the page inventory and the new components. Their look is v1 and is not carried over.

The brief also named `docs/library-conformance.md`. It does not exist in the repository. The conformance content I used is the "How we check" sections of the Standard and `CONVENTIONS.md`.

**How to read this document:**

- Colours are named as roles, such as `channel-action`, `outline` or `surface-container-low`, never as raw values. F1 owns the values. Appendix A lists every role used here, with the tonal step that direction E used for it, so F1 can reconcile names.
- Where a value is quoted in px, it comes from direction E unless marked "proposed". "Proposed" means E does not show the case and this document decides it.
- Wherever English and Arabic sizes differ, both are given as "EN / AR".

---

## 1. The language in one page

### 1.1 What changes from v1 Native

| Aspect | v1 Native (retired) | v2, direction E |
| --- | --- | --- |
| Material | Glass app bars (72% white with a blur), a floating glass capsule header, soft shadows on cards (elevation 1–3) | Flat. Surfaces are opaque. Cards have a 1px `divider` edge and no shadow. Elevation is used only for things that float over the page: popovers, menus, the utility bar and modals |
| Radius | Pill buttons (radius 22), fields 14, cards 20–24, sheets 28 | Controls 4, fields and message boxes 8, cards and containers 12, status chips 6. Pills only for suggestion and filter chips, avatars and step markers |
| Control edges | A 1.5px `control` border at about 55.8% lightness | A 1.5px `outline` border (neutral-40), which passes 3:1. DDS used 1px neutral-90 at 1.29:1. An error border is 2px |
| Control size | Primary 54px, medium 44px | Primary 56px, medium 44px. Hero search 64px |
| Type weights | Latin labels in Medium, Arabic labels in Bold, light hierarchy | Bold for buttons, field labels, titles and headings in both scripts. Medium for navigation, links, chips and summary values. Regular for body text, hints, supporting text and field values |
| Body size | 17px EN, 19px AR | 18px EN, 20px AR (body-l 18/30 and 20/34) |
| Density | Generous, rounded, airy | Denser and more architectural: square corners, ruled lists, fixed-width columns, 1px dividers between rows |
| Channel colour | Action, ink, subtle and a two-stop wash gradient per channel | Tonal palettes: tone 40 for actions with white text, 90 and 95 for containers and tints, 80 for actions in dark mode (with neutral-10 text) and for light outlines. No gradients |
| Shared colour | None: every surface was channel-tinted | City indigo, the shared primary, carries what all channels share: the channel network strip, the "one network" eyebrow and the hand-offs (subject to OQ-4) |
| Status | A dot and words | An icon and words on a tone-95 container (6px radius, 32px tall). Channel attribution chips keep an 8px dot |
| Progress | A segmented 8px track | The DDS stepper: 24px markers on mobile and 28px on desktop, a check on completed steps, a halo on the current step, a solid connector behind and a dashed connector ahead |

### 1.2 Where colour goes

- **Channel action (tone 40; 80 in dark mode):**
  - the primary button fill
  - the secondary button border and text
  - link text and underline
  - the current navigation indicator (a 3px bar)
  - the current step marker and the completed connectors
  - the 4px top rule of the mobile app bar
  - the 10px channel swatch beside the channel name
  - the hero eyebrow
  - the search button
- **Channel containers:**
  - 95: the hero background, the current channel's tile in the network strip, and the step halo on desktop
  - 90: the step halo on mobile, and tag fills such as "Life event"
  - 80: the 1px outline on suggestion chips and on channel chips that sit on a tint
- **Neutrals carry everything else:**
  - text in neutral-10, secondary text in neutral-30, and supporting text, hints and inactive icons in neutral-40
  - control edges in neutral-40
  - dividers and card edges in neutral-90 (never a control edge)
  - section bands in neutral-96
  - surfaces in neutral-100
- **City indigo (the shared primary):**
  - the "One network · seven channels" eyebrow and its 24 × 3px rule
  - shared-network elements
  - E0's documentation chrome
- **Other channels' colours appear only as attribution:**
  - the channel chip ("Also on Dubai Transport")
  - the steps of a life event that belong to another channel (the row takes that channel's 95 tint, a 40 marker and an "On Dubai Transport" chip)
  - the 4px top rule of each tile in the network strip
- **Entity colours do not exist.** Entities appear only as attribution text ("Roads and Transport Authority").
- **Semantic colours** (error, success, warning, info): tone 40 for text and icons, on a tone-95 container. Completed steps use success-40 (see OQ-3).

### 1.3 Shape and line

- **Radius:**
  - 4px for buttons, the sign-in control, pagination cells and checkboxes
  - 6px for status and channel chips
  - 8px for fields, the error summary, callouts, network tiles, the payment-button frame and selection bars
  - 12px for cards, summary-list containers, tables, popovers and modals
  - full (pill) for suggestion and filter chips, avatars, step markers, radios and calendar days
- **Line weights:**
  - 1px for dividers and card edges
  - 1.5px for control edges and the secondary button
  - 2px for error borders, the error summary border, checkbox and radio edges, step-marker edges and step connectors
  - 3px for the current navigation indicator and the focus ring
  - 4px for the error bar on a field (see OQ-2), the callout accent, the mobile app bar's channel rule and the network tile's top rule

### 1.4 Type

- Dubai Font is one family for both scripts. It uses Material roles, as in DDS.
- Arabic runs one step larger, with taller leading:
  - body-l is 18/30 in English and 20/34 in Arabic
  - headline-l is 32/40 and 36/52
  - display-s is 45/52 and 50/68
- Arabic is never letter-spaced, never set in italic, never transformed to upper case and never smaller than 16px.
- Large Latin display type is tracked at −0.02em. The English eyebrow in upper case is tracked at +0.06 to +0.08em. Neither applies to Arabic.
- Appendix B lists every type role this document uses, with the EN and AR sizes E shows.

### 1.5 Elevation

| Level | Use | Treatment |
| --- | --- | --- |
| 0 | Everything that sits in the page: cards, lists, tables, chips, the header, the footer, the hero | No shadow. Edges come from `divider` or from a fill change |
| 2 | Things that float over content: the account menu, the channel switcher, the date picker popover, the utility bar | `shadow-2` (proposed: a 1px `outline-variant` edge plus one soft shadow) |
| 3 | Modal dialogs and bottom sheets, over a `scrim` | `shadow-3` (proposed) |

### 1.6 States: the shared grammar

Every interactive component uses the same state grammar. The component sections below give only what differs from it.

| State | Rule |
| --- | --- |
| Default | As specified per component |
| Hover (fine pointers only, MOT-13) | Filled controls go to `channel-action-hover`. Outlined and text controls take a tint (`channel-container` or `state-hover`, which is neutral-96). Links thicken their underline from 1px to 2px. Transitions are colour only, over 120ms with `ease` |
| Pressed | Filled controls go to `channel-action-pressed`. Small pressables (buttons, chips, tiles, pagination cells) scale to 0.97 over 100ms (MOT-09). Cards and list rows do not scale |
| Focus-visible | A 3px `focus-ring` with a 2px `focus-ring-offset` gap (the surface colour), outside the control's edge and following its radius. In E0 the ring is neutral-10, not the channel colour; see OQ-1. Under forced colours it is `Highlight`. The ring must never be clipped (`overflow: clip` parents need padding) and must never sit under a sticky header (DDS F-009) |
| Disabled | Discouraged (A11Y-08). Where it is supported: text and edge in `on-surface-disabled` and fill in `surface-disabled`, as F1 proposes, and still at least 3:1 for the label so people can read why. Not focusable. DDS failed this with muted text at 3.18:1 |
| Error | `error` (tone 40) for the border (2px), the message and the icon. A 4px `error` bar at inline-start of the field group. A visually hidden "Error:" / "خطأ:" |
| Selected / current | Fill or indicator in `channel-action`, plus a non-colour cue (a check, bold weight, a 3px bar or an inner dot), plus `aria-current`, `aria-selected`, `aria-pressed` or `aria-checked` as appropriate. DDS marked current items with a CSS class only (F-027) |

### 1.7 Do and don't

**Do:**

- Use 56px primary buttons with a 4px radius and a Bold label.
- Give fields an 8px radius and a 1.5px `outline` edge.
- Give cards a 12px radius, a 1px `divider` edge and no shadow.
- Put channel colour on actions, current indicators and the hero container. Keep body text neutral.
- Show status with an icon and words on a tone-95 container.
- Set Arabic one step larger, with taller leading and no tracking.
- Use fixed-width slots (the side slots of the app bar, the change column, trailing chevrons) so repeated rows align.
- Use flat tints (95 and 90) for emphasis.

**Don't:**

- Use glass, blur, gradients or shadows on in-page surfaces.
- Use neutral-90 (or any colour below 3:1) for a control edge.
- Use DDS teal, or anything near it.
- Use a channel colour for paragraph text, or a semantic colour for decoration.
- Show status by colour alone, or a current item by colour alone.
- Make a whole card a link, or nest a link inside a link.
- Use `left` or `right` in CSS, or `text-align: right` (E4 uses `textAlign: right` on summary values; build it as `end`).
- Animate layout properties.
- Animate anything opened from the keyboard.

---

## 2. Component rules

Every section uses the same headings:

- Anatomy
- Sizes
- Type
- Colour by state
- RTL
- Arabic sizing
- Motion
- The DDS fault to avoid

"Shared grammar" refers to section 1.6. Values not marked "proposed" are from E.

### Part A · the 33 existing components

---

### A1 · `sc-button`

**Anatomy:** the container (`<button>`, or `<a>` with `href`), the label, an optional icon at start or end, and an optional spinner in the loading state.

**Sizes:**

| Size | Height | Padding inline | Gap | Icon | Radius |
| --- | --- | --- | --- | --- | --- |
| `l` (default) | 56 | 24 | 10 | 22 | 4 |
| `m` | 44 | 16 (proposed) | 8 | 20 | 4 |
| `xl` (hero search only) | 64 | 36 | 10 | 22 | 4 |

- `full-width` stretches the button to its container. E2–E4 use it on mobile.
- The secondary variant has a 1.5px border inside the box (`box-sizing: border-box`), so the height stays at 56.

**Type:** label-l Bold, 18/22 EN and 20/24 AR. Size `m` uses label-m Bold, 16/20 EN and 18/22 AR (proposed).

**Colour by state:**

| Variant | Default | Hover | Pressed | Disabled |
| --- | --- | --- | --- | --- |
| `primary` | Fill `channel-action`, text `on-channel-action` | `channel-action-hover` | `channel-action-pressed` and scale 0.97 | Shared grammar |
| `secondary` (outlined) | Fill `surface`, 1.5px `channel-action` border, text `channel-action` | Fill `channel-container` | Fill `channel-container-high` | Shared grammar |
| `tertiary` (text) | No fill. Text `channel-action`, Medium, underlined 1px at a 4px offset (5px in AR) | Underline 2px | Fill `channel-container` | Shared grammar |
| `destructive` | Fill `error`, text `on-error` | `error-hover` | `error-pressed` | Shared grammar |
| `inverse` (new, proposed) | Fill `inverse-surface`, text `on-inverse-surface`. For the Dubai Pay and UAE PASS placeholders in E4 until provider assets are approved | Shared grammar | Shared grammar | Shared grammar |

- Focus-visible uses the shared ring. On a filled button the 2px offset in the surface colour separates the ring from the fill (E0 "Focus" sample).
- Loading keeps the width and swaps the icon for a 20px spinner in `currentColor`. It sets `aria-busy` and keeps "Loading" visually hidden, as in v1.

**RTL:** the `arrow-forward` icon mirrors (E0 "Arabic primary · arrow mirrored"; E2 renders `arrow_back` at the end of "متابعة"). The icon stays at inline-end.

**Arabic sizing:** label 20/24. The height stays 56. Padding is unchanged.

**Motion:** colour over 120ms with `ease` (fine pointers). Press scale 0.97 over 100ms. The spinner rotates linearly. Under reduced motion there is no scale and the spinner is static with its label.

**DDS fault to avoid:**

- F-019, F-020 and F-021: focus "restored" with a malformed `outline` shorthand, or no visible focus at all. The ring must be drawn with `outline` or `box-shadow` from the role tokens and tested in every channel, in both themes.
- F-031: a "disabled" look without the property.

---

### A2 · `sc-link`

**Anatomy:**

- Inline: the text with an underline.
- `standalone`: the text plus an end icon (`arrow-forward` 20px in E1 "All 412 services"), on its own 44px row.
- `external`: the text plus an external icon and visually hidden "(opens in new tab)".

**Sizes:**

- The underline is 1px with a 4px offset (5px for Arabic text).
- The icon gap is 6.
- A standalone link has a 44px minimum target height.

**Type:**

- Inline links inherit the surrounding size and weight.
- Standalone links are label-l Bold, 18/22 EN and 20/24 AR (E1).
- Links in the footer and in the change column are Medium (E1, E3).

**Colour by state:**

| State | Rule |
| --- | --- |
| Default | Text and underline in `channel-action` |
| Inside an error summary | `error` |
| Inside the footer | `on-surface` (E1) |
| Hover | Underline 2px |
| Visited | No distinct colour in E. OQ-20 stays open; see OQ-16 |
| Focus | The shared ring, wrapping with the text across lines (`box-decoration-break: clone`) |

**RTL:** the standalone arrow and the external icon mirror.

**Arabic sizing:** standalone 20/24; the underline offset is 5px so it clears the descenders.

**Motion:** underline thickness over 120ms, fine pointers only.

**DDS fault to avoid:** F-019 and F-021 (focus not visible on link-buttons). Never style a link as a button by removing its underline, except in navigation contexts listed in this document.

---

### A3 · `sc-back-link`

**Anatomy:** an `arrow-back` icon (24px) and the label "Back" / "رجوع". In E the v1 glass pill is dropped: the back link is plain text with an icon.

**Sizes:**

- The target is at least 44px tall.
- The gap is 6.
- In `sc-app-bar` it sits in a fixed 96px start slot.

**Type:** label-m Medium, 17/22 EN and 18/22 AR (E2–E4).

**Colour by state:**

| State | Rule |
| --- | --- |
| Default | Icon and text in `on-surface` |
| Hover | Underline 1px at a 4px offset, in `on-surface` |
| Pressed | Text in `on-surface-variant` |
| Focus | The shared ring |

**RTL:** the arrow mirrors (E2 renders `arrow_forward` at inline-start of "رجوع").

**Arabic sizing:** 18/22.

**Motion:** none beyond the hover colour.

**DDS fault to avoid:** none specific. Keep the `<a>` and `<button>` split, which was right in v1.

---

### A4 · `sc-app-bar` (the transaction app bar)

This is the journey bar in E2–E4. The channel-site header is a separate new component, `sc-site-header` (B2).

**Anatomy:**

- a 4px top rule in `channel-action`
- a start slot (back link)
- the title (a 10px channel swatch and the channel name)
- an end slot (language switch)
- a 1px bottom `divider`

**Sizes:**

- Height 60 (plus the safe area on mobile).
- Padding inline 16.
- The start and end slots are fixed at 96px each, so the title stays centred.
- The swatch is 10 × 10 with a 3px radius.
- The gap between the swatch and the name is 8.

**Type:** the title is title-s Bold, 17/22 EN and 18/22 AR.

**Colour:**

- `surface` background
- the top rule in `channel-action`
- the bottom rule in `divider`
- the title in `on-surface`
- the swatch in `channel-action`

In dark mode the rule and swatch take `channel-action` at tone 80 (E3).

**States:** none of its own. `sticky` keeps the bar at the top. Under `sticky`, the page sets `scroll-padding-top` to the bar's height plus 8px, so focused elements are never hidden (WCAG 2.4.11).

**RTL:** the slots follow the direction: back on the right and the language switch on the left in Arabic (E2).

**Arabic sizing:** the title is 18/22. The height stays 60. If the Arabic channel name wraps, the bar grows; it never truncates.

**Motion:** none. There is no glass, so no reduced-transparency fallback is needed.

**DDS fault to avoid:** F-009, a fixed header with no `scroll-padding`, so focus slid under it.

---

### A5 · `sc-language-switch`

**Anatomy:** a link labelled with the other language's own name. There are two appearances:

- `inline` (app bar): an underlined text link (E2–E4)
- `header` (site header): a `language` (globe) icon of 20px plus the label, not underlined (E1)

**Sizes:** a 44px minimum target. The icon gap is 6.

**Type:**

- In the app bar: label-m Medium, 17/22.
- In the site header: label-l Medium, 18/22.
- The label always uses its own script's type role: an Arabic name is set at the Arabic size even on an English page. Keep the v1 rule.

**Colour by state:**

| Appearance | Default | Hover | Focus |
| --- | --- | --- | --- |
| `inline` | `channel-action`, underlined 1px at a 4px offset | Underline 2px | Shared ring |
| `header` | `on-surface` | Underline 1px at a 4px offset | Shared ring |

**RTL:** it sits at the end slot. The globe icon does not mirror.

**Arabic sizing:** see Type.

**Motion:** none.

**DDS fault to avoid:** none in DDS. LANG-05 still applies: no flags, and never a menu.

---

### A6 · `sc-skip-link`

**Anatomy:** a link that is visually hidden until it is focused, then shown at top inline-start.

**Sizes (proposed):**

- 48px tall
- padding inline 20
- radius 4
- 8px from the top and inline-start edges

**Type:** label-l Bold, 18/22 EN and 20/24 AR.

**Colour:**

- `inverse-surface` fill and `on-inverse-surface` text (proposed: it must be visible over any hero or announcement colour)
- the shared focus ring outside it

**RTL:** top right in Arabic.

**Arabic sizing:** 20/24.

**Motion:** none. It appears instantly on focus (MOT-02).

**DDS fault to avoid:** DDS has no skip link. Fix the v1 known gap: the default `href` must match `sc-page`'s `main-content`. Rewrite the Arabic default to the verbal noun "الانتقال إلى المحتوى الرئيسي".

---

### A7 · `sc-text-input`

**Anatomy:**

- an optional field group with an error bar at inline-start
- the label
- the hint
- the error message (icon and text)
- the control box
- an optional prefix or suffix inside the box

**Sizes:**

| Part | Value |
| --- | --- |
| Control height | 56 |
| Control radius | 8 |
| Control border | 1.5px `outline` (default); 2px `error` (error) |
| Control padding inline | 16 |
| Gap from label to hint to error to control | 8 (10 when there is no hint, E2) |
| Error bar | 4px `error` at inline-start, with a 14px (AR) or 16px (EN) gap before the content (E2 uses 4px and 14px; E0 uses 3px and 16px; see OQ-2) |
| Error icon | 20px, gap 6, top-aligned with the first line of the message |
| Prefix and suffix | A quiet segment inside the box: `surface-container-low` fill, a 1px `divider` separator, padding inline 12 (proposed) |

- Widths stay as in v1: `2`, `3`, `4`, `5`, `10`, `20` characters or `full`.
- E2 uses 120px for a plate code and 200px for a plate number. Those map to widths 4 and 10 at 20px type.

**Type:**

| Part | Role | EN | AR |
| --- | --- | --- | --- |
| Label | label-l Bold | 18/22 | 20/24 |
| Hint | body-m Regular | 16/20 | 18/30 |
| Error message | body-m Bold | 16/20 | 18/30 |
| Value | body-l Regular | 18/22 | 20/24 |

**Colour by state:**

| State | Box | Text | Other |
| --- | --- | --- | --- |
| Default | `surface` fill, `outline` border | Label `on-surface`, hint `on-surface-muted`, value `on-surface` | |
| Hover | Border `outline-strong` (proposed) | | |
| Focus | The shared focus ring around the box (on `:focus`; text fields always show focus); the border stays | | |
| Error | 2px `error` border | Message and icon in `error` | 4px `error` bar at inline-start of the group; `aria-invalid`; hidden "Error:" |
| Disabled | `surface-disabled` fill, `outline` border at reduced emphasis | `on-surface-disabled`, at least 3:1 | |
| Read-only (proposed) | `surface-container-low` fill, no border | `on-surface` | |

**RTL:**

- The error bar moves to the right.
- `ltr` values (plate, phone, email) read left to right but stay aligned at inline-start, under the label (LANG-17).
- The prefix and suffix follow the direction.

**Arabic sizing:** see Type. The box height stays 56. A hint or error that wraps to two lines grows the group, never the box.

**Motion:** the border colour transitions over 120ms. The error appears instantly; it never animates in.

**DDS faults to avoid:**

- F-016: the error was not linked with `aria-describedby` and there was no `aria-invalid`.
- F-018: no `autocomplete`.
- The DDS 1px neutral-90 border at 1.29:1.
- F-021: no focus indicator.
- F-025: duplicate IDs across instances. Generate IDs per instance.

---

### A8 · `sc-textarea`

**Anatomy:** as `sc-text-input`, plus a character count line under the box.

**Sizes:**

- Box radius 8, 1.5px `outline`.
- Padding 12 block and 16 inline.
- Minimum height 3 rows; `rows` sets it.
- Resize is vertical only.
- The count sits 8 below the box.

**Type:** the value is body-l Regular, 18/30 EN and 20/34 AR (multi-line text uses body leading). The count is body-m, 16/20 EN and 18/30 AR.

**Colour by state:**

- As `sc-text-input`.
- The count is `on-surface-muted`.
- Over the limit, the count is `error` Bold and the box border is 2px `error`.

**RTL:** the count aligns to inline-start.

**Arabic sizing:** as above.

**Motion:** none. The live count announces after a 1 second pause, as in v1.

**DDS fault to avoid:** F-015, a rich-editor mode that dropped the label association. v2 has no rich-text mode.

---

### A9 · `sc-select`

**Anatomy:** label, hint, error, and a native `<select>` box with an `expand-more` chevron (26px) at inline-end (E2).

**Sizes:**

- Height 56, radius 8, 1.5px `outline`.
- Padding inline 16 at the start and 52 at the end (26px chevron plus 16 plus 10).
- The chevron sits 16 from the inline-end edge.

**Type:** as `sc-text-input`. The value is 18/22 EN and 20/24 AR.

**Colour by state:**

- As `sc-text-input`.
- The chevron is `on-surface` (E2 uses neutral-10, not muted).

**RTL:** the chevron moves to the left. It points down in both directions and does not mirror.

**Arabic sizing:** as above.

**Motion:** none. The native picker is used.

**DDS fault to avoid:** F-014, a custom listbox with no ARIA. v2 keeps the native `<select>`.

---

### A10 · `sc-radio-group` and A11 · `sc-radio`

**Anatomy:**

- A `<fieldset>`, and a `<legend>` (which may be the `<h1>`).
- The hint and error.
- The options. Each option is a 24px radio, its label and an optional option hint.

**Sizes:**

| Part | Value |
| --- | --- |
| Radio | 24 × 24 circle, 2px `outline` edge (proposed: matches E's 2px step markers; 1.5px reads thin on a circle) |
| Checked dot | 12px `channel-action` dot; the edge also turns `channel-action` |
| Option row | At least 48px tall (proposed; the target is at least 44), gap from radio to label 12 |
| Option hint | 4 below the label, indented to the label |
| Space between options | 8 |
| Inline layout | Gap 24 between the two options |
| Error bar | As in `sc-text-input` |

**Type:**

- The legend is label-l Bold, 18/22 EN and 20/24 AR, or the page heading role when it is the `<h1>`.
- The option label is body-l Regular, 18/24 EN and 20/30 AR (proposed).
- The option hint is body-m, 16/20 EN and 18/30 AR, in `on-surface-muted`.

**Colour by state:**

| State | Rule |
| --- | --- |
| Default | Edge `outline`, fill `surface` |
| Hover | A 40px `state-hover` circle behind the radio (proposed, the Material state layer) |
| Checked | Edge and dot in `channel-action` |
| Focus | The shared ring around the 24px circle |
| Error | 2px `error` edge on every radio, the group bar and the message |
| Disabled | Shared grammar, at least 3:1 for the label |

**RTL:** the radio sits on the right of its label, and the error bar is on the right.

**Arabic sizing:** label 20/30 and hint 18/30. The radio stays 24.

**Motion:** the dot scales from 0.5 to 1 with opacity over 120ms with `ease`, pointer only. It is instant from the keyboard (MOT-02). Never scale from 0 (MOT-08).

**DDS faults to avoid:**

- DDS radio API errors (component matrix, "FAIL²", ghost props).
- F-028, a hard-coded label in the DDS toggle. Keep the v1 architecture: native radios in one shadow tree.

---

### A12 · `sc-checkbox-group` and A13 · `sc-checkbox`

**Anatomy:** as the radio group. The control is a 24px box.

**Sizes:**

- The box is 24 × 24, radius 4, with a 2px `outline` edge (proposed).
- The check icon is 18px.
- The indeterminate bar is 12 × 2.
- Rows, gaps and the error bar are as the radio group.

**Type:** as the radio group.

**Colour by state:**

| State | Rule |
| --- | --- |
| Default | Edge `outline`, fill `surface` |
| Hover | A 40px `state-hover` circle behind the box |
| Checked or indeterminate | Fill `channel-action`, check or bar in `on-channel-action` |
| Focus | The shared ring around the box |
| Error | 2px `error` edge |
| Disabled | Shared grammar |

**RTL:** the box sits on the right of its label. The check is a symbol and does not mirror.

**Arabic sizing:** as the radio group.

**Motion:** the check draws over 120ms (stroke-dashoffset), pointer only. It is instant from the keyboard.

**DDS faults to avoid:**

- F-029: documented attributes that do not exist.
- F-016: no `aria-describedby`.
- Keep the v1 rule: each checkbox is native in its own shadow root and the group renders the fieldset.

---

### A14 · `sc-date-input`

**Anatomy:** a fieldset and legend, the hint and error, and three labelled boxes for Day, Month and Year (يوم / شهر / سنة).

**Sizes:**

- Each box is 56 tall, radius 8, with a 1.5px `outline` edge.
- Widths (proposed): Day and Month at 4 characters (about 72px); Year at 6 characters (about 100px).
- The gap between boxes is 16.
- Each part label sits 8 above its box.

**Type:**

- The legend is as `sc-text-input`'s label.
- The part labels are label-m Medium, 16/20 EN and 18/22 AR.
- Values are 18/22 EN and 20/24 AR.

**Colour by state:**

- As `sc-text-input`.
- `error-parts` puts the 2px `error` edge only on the named boxes.

**RTL:** the boxes run Day, Month, Year from the right. Digits stay Latin.

**Arabic sizing:** as above.

**Motion:** none.

**DDS fault to avoid:** F-016 (error not described), and F-025 (shared IDs between generated parts).

---

### A15 · `sc-date-range`

**Anatomy:** keep the v1 spec (`specs/sc-date-range.md`) for behaviour. These are the visual changes for v2:

- **Field frame:**
  - 56 tall, radius 8, a 1.5px `outline` edge
  - two segments, each with a caption label (From / To · من / إلى) in `on-surface-muted` above its value
  - an arrow glyph between the segments
  - a 44px calendar icon button at inline-end, with no fill and an icon in `on-surface`
- **Popover:**
  - a `surface` panel, radius 12, a 1px `outline-variant` edge, `shadow-2`, padding 20
  - aligned to the field's inline-start, 8 below it
- **Day cells:** 44px circles.

  | State | Treatment |
  | --- | --- |
  | Today | A 1.5px `outline` ring |
  | Start and end | `channel-action` fill with `on-channel-action` text |
  | In range | A `channel-container` band, 44px tall, rounded where it meets a row edge |
  | Disabled | `on-surface-disabled` text (proposed), never below 3:1 against the surface. Keep "unavailable" in the accessible name |
  | Hover | `state-hover` |
  | Focus | The shared ring |

- **Presets:** filter chips (B18), 40px tall and pill-shaped.
- **Bottom sheet below 600px:** see `sc-modal` (B19). Top radius 12, a grabber, over the `scrim`.
- **Footer:** an Apply button (primary, size `m`) and a Cancel button (tertiary).

**Type:**

- The segment value is 18/22 EN and 20/24 AR.
- The caption is 14/18 EN and 16/20 AR.
- The month title is title-m Bold, 19/24 EN and 20/28 AR.
- Weekday heads are label-s Medium, 15/18 EN and 16/22 AR, in `on-surface-muted`.
- Day numbers are 17/22 EN and 18/22 AR.

**RTL:** everything mirrors, as in the v1 spec: From on the right, the arrow pointing left, Monday in the rightmost column.

**Arabic sizing:** day cells stay 44, and Arabic weekday names may wrap to two letters' width. Keep the short Arabic forms as in v1.

**Motion:** unchanged from Standard 8.7:

- The popover enters with opacity and `scale(0.96)` from the field's top inline-start corner over 200ms, and exits with opacity over 160ms.
- The sheet slides up over 300ms with the drawer easing and exits over 240ms.
- Opened from the keyboard, it appears instantly.

**DDS fault to avoid:**

- F-024: a dropdown with no Escape, no outside click and no focus return. Apply, Escape and an outside click all return focus to the calendar button.
- F-025: duplicate IDs.

---

### A16 · `sc-error-summary`

**Anatomy:** the container, the heading ("There is a problem" / "يوجد خطأ"), an optional description, and a list of links (no bullets). Placement and structure are in section 3.3.

**Sizes:**

- Radius 8.
- A 2px `error` border on all sides (E2).
- Padding 18 block and 16 inline.
- The gap from heading to list is 6. The gap between items is 8 (proposed).

**Type:**

- The heading is title-m Bold, 18/24 EN (proposed) and 20/30 AR (E2).
- The links are body-l Bold, 16/24 EN (proposed) and 18/30 AR (E2), underlined 1px at a 5px offset.

**Colour by state:**

| State | Rule |
| --- | --- |
| Container | Fill `error-container`, border `error` |
| Heading | `on-surface` |
| Links | `error` |
| Link hover | Underline 2px |
| Focus on the container (programmatic) | The shared ring outside the 2px border |
| Focus on a link | The shared ring |

**RTL:** text aligns to the right. Plates and numbers inside messages are isolated in `<bdi dir="ltr">`.

**Arabic sizing:** see Type.

**Motion:** none. It appears with the page, and focus moves to it.

**DDS fault to avoid:** F-012 (no role on alerts). In v2 apply CMP-05 instead: `tabindex="-1"` and focus, **without** `role="alert"`, so it is not announced twice. This corrects v1.

---

### A17 · `sc-callout`

**Anatomy:** the container, a 4px accent at inline-start, an icon, an optional heading, and the content.

**Sizes:**

- Radius 8 and padding 16.
- The icon is 22px with a gap of 12 (E4).
- The accent is a 4px `border-inline-start`.
- A heading sits 4 above the content.

**Type:**

- The content is body-m Medium, 17/27 EN (E4) and 19/30 AR (proposed).
- The heading is title-s Bold, 18/24 EN and 20/28 AR.

**Colour by tone:**

| Tone | Fill | Accent and icon | Text |
| --- | --- | --- | --- |
| `info` | `info-container` | `info` | `on-surface` |
| `success` | `success-container` | `success` | `on-surface` |
| `warning` | `warning-container` | `warning` | `on-surface` |
| `error` | `error-container` | `error` | `on-surface` |

- Icons: info `info`, success `check-circle`, warning `warning`, error `error`.
- The hidden tone word ("Warning:" / "تنبيه:") stays.
- Links inside take `channel-action` (proposed; links stay recognisable as links in every tone).

**RTL:** the accent and icon move to the right.

**Arabic sizing:** see Type.

**Motion:** none. A callout inserted after load sits in a `role="status"` wrapper, as in v1.

**DDS fault to avoid:** F-012, an alert with no role. The tone also must never rely on the fill colour alone.

---

### A18 · `sc-status-tag`

**Anatomy:** the container, a 16px tone icon, and the label.

**Sizes:** height 32, radius 6, padding inline 12, gap 6.

**Type:** label-s Medium, 15/18 EN and 16/22 AR. The Arabic tag grows to about 34px tall.

**Colour by tone:**

| Tone | Fill | Icon and text | Icon (E0) |
| --- | --- | --- | --- |
| `neutral` | `surface-container-low` | `on-surface-variant` | `schedule` or `info` (proposed) |
| `info` (new) | `info-container` | `info` | `hourglass-empty` ("In review") |
| `success` | `success-container` | `success` | `check-circle` |
| `warning` | `warning-container` | `warning` | `schedule` ("Expires in 15 days") |
| `error` | `error-container` | `error` | `error` ("Action needed") |
| `channel` | `channel-container` | `channel-action` | `info` (proposed) |

- Every text-on-fill pair must pass 4.5:1. E0 measured the semantic pairs at 5.6:1 or above.
- The tag is not interactive.

**RTL:** the icon sits at inline-start. Icons do not mirror (they are symbols).

**Arabic sizing:** 16/22. Plurals follow the number ("ينتهي خلال 15 يومًا").

**Motion:** none.

**DDS fault to avoid:** status shown by colour only. DDS chips had only a coloured border (the `dda-chip` success, warning and primary borders).

---

### A19 · `sc-channel-chip`

**Anatomy:** an 8px dot in the named channel's `channel-action`, then the label ("Also on Dubai Transport"). As a link it adds an end chevron.

**Sizes:** height 30, radius 6, padding inline 10, gap 8 (6 for the outlined variant). A link chip has a 44px hit area that does not change the layout.

**Type:**

- `subtle`: label-s Medium, 14/18 EN and 16/22 AR.
- `outlined`: Bold, 14/18.

**Colour:** the chip sets `data-channel` on itself and reads that channel's roles.

| Variant | Fill | Edge | Dot and text | Use |
| --- | --- | --- | --- | --- |
| `subtle` (default) | Its `channel-container` | None | Its `channel-action` | On white cards (E1 service cards) |
| `outlined` | `surface` | 1px of its `channel-outline` | Its `channel-action` | On a channel tint (E1 life-event rows, "On Dubai Transport") |

- Hover (link only): the label underlines.
- Focus: the shared ring.

**RTL:** the dot sits at inline-start and the chevron mirrors.

**Arabic sizing:** 16/22, so the chip is about 32 tall.

**Motion:** none.

**DDS fault to avoid:** F-003, a dismiss control on a span. Channel chips are never dismissable.

---

### A20 · `sc-step-progress` (becomes the E stepper)

This is E's signature component. v1's segmented track is replaced.

**Anatomy:**

- **Compact** (mobile, E2–E4):
  - a meta row: the current step name at inline-start and "Step 2 of 4" at inline-end
  - a marker row: one marker per step, with connectors between them
  - padding 4 around the marker row, so the halo is not clipped
- **Full** (desktop, E0): one column per step, each with:
  - its marker
  - a connector to the next step
  - a state line ("Step 1 · Done")
  - the step name

**Sizes:**

| Part | Compact | Full |
| --- | --- | --- |
| Marker | 24 | 28 |
| Check icon (done) | 16 | 18 |
| Inner dot (current) | 8 | 10 |
| Halo (current) | 4px `channel-container-high` | 5px `channel-container` |
| Connector | 2px, gap 6 to the markers | 2px, gap 8 |
| Gap from markers to text | 12 (meta row above) | 14 |
| Upcoming edge | 2px `outline` | 2px `outline` |

**Type:**

- In the compact meta row, the step name is title-s Bold, 17/22 EN and 18/22 AR, and the count is body-m Regular, 16/20 EN and 17/22 AR, in `on-surface-muted`.
- In the full form, the state line is label-s, 14/18 EN and 16/20 AR, and the step name is title-s Bold, 17/22 EN and 19/26 AR.
- An upcoming step name is Medium in `on-surface-variant`.

**Colour by state:**

| Step | Marker | Connector after it | Text |
| --- | --- | --- | --- |
| Done | `success` fill and an `on-success` check (OQ-3) | Solid `channel-action` | State line `on-surface-muted`, name `on-surface` |
| Current | `channel-action` fill, an `on-channel-action` inner dot, a halo | Dashed `outline` | State line `channel-action` Medium, name `on-surface` Bold |
| Upcoming | `surface` fill, a 2px `outline` edge | Dashed `outline` | State line `on-surface-muted`, name `on-surface-variant` Medium |

In dark mode (E3):

- done is the dark `success` (tone 80) with a neutral-10 check
- current is `channel-action` (80) with a neutral-10 dot and a halo in `divider`
- upcoming has an `outline` edge

**Semantics:**

- Compact: the text carries the meaning, and the marker row is `aria-hidden` (as in v1).
- Full: an `<ol>` with one `<li>` per step. The current step has `aria-current="step"`. Each step has a visually hidden state ("Completed", "Current step", "Not started").

**RTL:** steps run from the right. Connectors join in reading order through the DOM, so there is no reversing (LANG-14). The check does not mirror.

**Arabic sizing:** see Type. Markers do not change size.

**Motion:** none. The stepper changes with the page.

**DDS faults to avoid:**

- F-027: the current step was marked by class only, with no `aria-current`.
- F-036: an off-by-one default made the second step current. `current` is 1-based and clamped, as in v1.
- F-034: prop-name casing.
- F-047: unguarded `JSON.parse` on a `steps` prop. Take step names from child elements or a validated property.

---

### A21 · `sc-spinner`

**Anatomy:** a circular arc and a label (hidden by default).

**Sizes:** 20px (inline) or 24px. The stroke is 2.5px (proposed). The arc is 270°.

**Type:** a visible label uses body-m, 16/20 EN and 18/30 AR.

**Colour:** `currentColor`.

**RTL:** it does not mirror (MOT, 5.6).

**Arabic sizing:** label only.

**Motion:** a linear rotation (OQ-25: review the speed). Under reduced motion it is static and the label shows.

**DDS fault to avoid:** F-013 and F-050, a progress role with no name. The spinner's `role="status"` region carries the label.

---

### A22 · `sc-card`

**Anatomy:** the surface and its slotted content.

**Sizes:** radius 12. A 1px `divider` edge. Padding `l` is 24 and `m` is 16. There is no shadow.

**Variants:**

| Variant | Fill | Edge | Use |
| --- | --- | --- | --- |
| `outlined` (default) | `surface` | 1px `divider` | Groups on a white page or on a neutral-96 band (E1 cards, the E4 summary) |
| `filled` (new) | `surface-container-low` (dark: `surface-container-high`) | None | A totals card (E3), a quiet group inside an outlined area |

**Type:** inherits.

**States:** a card is not interactive. Under forced colours the edge becomes 1px `CanvasText`.

**RTL:** symmetrical.

**Arabic sizing:** padding unchanged.

**Motion:** none.

**DDS fault to avoid:** `dda-ui-card`'s link event that never fires (F-035) and its card-as-link. Cards are never links.

---

### A23 · `sc-service-card`

**Anatomy:**

- an optional icon slot (B10)
- the title (a heading containing the link)
- the owning entity (attribution text)
- an `arrow-forward` icon at inline-end top, 24px, in a fixed slot, decorative
- an optional channel chip at the bottom

**Sizes:**

- Radius 12, a 1px `divider` edge, padding 24.
- The gap from title to entity is 4.
- The gap from the top block to the chip is 24 or more (the content pushes the chip to the bottom).
- E1 fixes the height at 184. Build it as `min-height: 184px` (proposed) and let content grow, especially in Arabic.
- The icon slot is 40 × 40 at inline-start, with a gap of 16 (B10).

**Type:**

- The title is title-l Bold, 20/28 EN and 22/32 AR (proposed).
- The entity is body-m Regular, 16/20 EN and 18/28 AR.

**Colour by state:**

| State | Rule |
| --- | --- |
| Default | `surface` fill, `divider` edge, title `on-surface`, entity `on-surface-muted`, arrow `channel-action` |
| Hover (over the card) | Edge `outline` (proposed); the title underlines 1px in `on-surface` |
| Focus (on the title link) | The shared ring around the title link, not the card (CMP-06). The arrow stays decorative |
| Pressed | Title in `channel-action` (proposed). No scale |

**RTL:** the arrow mirrors and sits at top left.

**Arabic sizing:** the title is 22/32. Two-line titles are normal, so the card grows.

**Motion:** colours over 120ms, fine pointers only.

**DDS fault to avoid:** F-035, and the stretched-link pattern. CMP-06 requires a title-only link, which corrects v1's stretched link.

---

### A24 · `sc-channel-hero`

**Anatomy:**

- an optional breadcrumb slot (B6)
- the eyebrow
- the heading (`<h1>`)
- an optional lede
- the default slot (search and "Popular now")

**Sizes (E1, desktop at 1440):**

- Padding top 88, bottom 80 and inline 80 (the container margin).
- The gap between blocks is 32.
- The search row is at most 880 wide.
- On compact screens (proposed): padding top 32, bottom 40, inline 20, gap 20.

**Type:**

- The eyebrow is title-m Medium, 20/24 EN and 22/30 AR, in `channel-action`.
- The heading is display-l Bold, 80/88 EN with −0.02em tracking (E1) and 84/100 AR with no tracking (proposed). On compact screens it is headline-l, 32/40 EN and 36/52 AR.
- The lede is body-l, 19/30 EN and 20/34 AR, in `on-surface-variant`.

**Colour:**

- A flat `channel-container` (95) fill. The v1 gradient wash is retired (OQ-10).
- The heading is `on-surface`.
- In dark mode the fill is the dark `channel-container` (F1).
- Under forced colours the fill is `Canvas` with a 1px rule beneath.

**RTL:** the content aligns right and the search mirrors.

**Arabic sizing:** see Type.

**Motion:** none.

**DDS fault to avoid:** F-026, a banner slider with no controls and no CSS. The hero never carries a carousel or autoplaying media.

---

### A25 · `sc-search`

**Anatomy:**

- `<form role="search">` with a label (visible or visually hidden)
- the field box, holding a search icon at inline-start and a native `<input type="search">`
- a separate primary button

In E the field and button are siblings with a 12px gap, not one pill.

**Sizes:**

| Size | Field height | Field padding | Icon | Button |
| --- | --- | --- | --- | --- |
| `l` (hero) | 64 | 20, gap 12 | 26 | 64 tall, padding 36 |
| `m` (default) | 56 | 16, gap 12 | 24 | 56 tall, padding 24 |

The field has radius 8 and a 1.5px `outline` edge. The button has radius 4.

**Type:** the input and placeholder are 19/24 EN at `l` (E1), 18/22 EN at `m`, and 20/24 AR. The button is label-l Bold.

**Colour by state:**

| State | Rule |
| --- | --- |
| Default | Field fill `surface`, edge `outline`. Icon and placeholder `on-surface-muted` (at least 4.5:1). Typed text `on-surface`. Button as primary |
| Hover | Field edge `outline-strong` |
| Focus | The shared ring around the field box. The button has its own ring |
| Error (empty submission, if used) | As `sc-text-input` |

**RTL:** icon on the right and button on the left.

**Arabic sizing:** see Type.

**Motion:** none.

**DDS fault to avoid:**

- F-017: the label pointed at the clear button.
- F-025: a hard-coded `id="search"` that collided across instances.

---

### A26 · `sc-summary-list` and A27 · `sc-summary-row`

**Anatomy:** a container card with `<dl>` rows. Each row has a key, a value, and an optional action ("Change" with hidden key text). There are three layouts:

| Layout | Source | Structure |
| --- | --- | --- |
| `stacked` | E3, mobile | The key sits above the value. The action is in a fixed 64px column at inline-end, vertically centred |
| `columns` | v1 desktop, kept | Key, value and action columns from 600px; action column 96px |
| `pairs` | E4, payment summary | The key is in a fixed 104px column; the value is end-aligned. No actions |

The `variant="total"` row (E4) has a `surface-container-low` fill and Bold key and value. The last row's corners follow the container.

**Sizes:**

- The container has radius 12 and a 1px `divider` edge.
- Rows are padded 14 block and 16 inline, with 1px `divider` rules between them.
- In stacked rows the gap from key to value is 2. In pair rows the gap is 16.
- Between groups, a section heading sits 12 above its list.

**Type:**

- The key is body-m Regular, 16/20 EN and 18/26 AR, in `on-surface-muted`.
- The value is body-l Medium, 18/22 EN in stacked rows (E3), 17/22 EN in pair rows (E4), and 20/28 AR.
- The action is label-m Medium, 17/22 EN and 18/24 AR, underlined in `channel-action`.
- A total row is Bold: the key 17/22, the value 20/24 EN and 22/28 AR.

**Colour:**

- The container is `surface` (dark: `surface-container-low`, E3).
- Rules are `divider`.
- Key, value and action are as above.
- The action follows link states.

**RTL:**

- The key is on the right and the action on the left.
- Pair values align to `end`. E4 used `right`; never use that.
- Values in LTR scripts are isolated.

**Arabic sizing:** see Type. The key column in pair rows widens to 120 (proposed), because Arabic keys run longer.

**Motion:** none.

**DDS fault to avoid:** DDS has no summary list. Keep v1's rule that one component renders the whole `<dl>`.

---

### A28 · `sc-table`

**Anatomy:** keep the v1 spec (`specs/sc-table.md`). These are the visual changes for v2:

- **Container:** radius 12, a 1px `divider` edge, no shadow, `overflow: clip`. Pad the inside by the focus-ring width so rings are not clipped.
- **Header row:**
  - fill `surface-container-low`
  - text label-m Bold, 16/20 EN and 18/24 AR, in `on-surface`
  - a 1px `divider` below
- **Body rows:** at least 56 tall (`compact` is 44), with 1px `divider` rules. Cells are padded 16 inline and 14 block.
- **Sortable header:**
  - a button that fills the cell
  - the sort glyph is 20px in `on-surface-muted`, and in `on-surface` when it is the active sort
  - hover is `state-hover`
- **Row hover** (fine pointers, rows with a link): `state-hover`.
- **Selected row:** a `channel-container` fill and a checked checkbox (A13).
- **Totals row:** title-s Bold, with a 1px `outline` rule above (E3's totals divider uses `outline`, not `divider`).
- **Selection bar:**
  - radius 8, a `channel-container` fill, padding 12 by 16
  - the count is Bold in `on-surface`
  - the total is Medium
  - it holds the actions slot
- **Stack mode (below 600px):** each row becomes a card (radius 12, a 1px `divider` edge, padding 16) with key and value pairs, as `sc-summary-list` `pairs`.
- **Skeleton:** `surface-container-low` bars, radius 4.
- **Empty and error:** use `sc-empty-state` (B14) and `sc-callout tone="error"`.

**Type:** cells are body-m Regular, 16/22 EN and 18/28 AR. References and amounts use tabular figures.

**RTL:** full mirroring, as in v1. Amounts align `end`, which is left in Arabic.

**Arabic sizing:** rows grow with the leading. Nothing is fixed-height.

**Motion:**

- Row hover changes colour over 120ms.
- The selection bar enters with opacity and an 8px rise over 200ms, and exits with opacity over 160ms.
- Sorting has no motion.

**DDS fault to avoid:** DDS ships only `table.css`, styled divs with no semantics. Keep the native `<table>`, `scope` and `caption`.

---

### A29 · `sc-footer` (extended with groups; see B5)

The v1 single-row footer becomes the `simple` variant (E1). The grouped variant with a Channels group is specified in B5.

**Anatomy (`simple`):** a 1px `divider` top rule, a row of links, and the meta text at inline-end.

**Sizes:**

- Padding top 32, bottom 40, inline 80 (desktop) or 20 (compact).
- The gap between links is 32.
- On compact screens the links stack as 44px rows.

**Type:**

- Links are label-m Medium, 16/20 EN and 18/24 AR, in `on-surface`, underlined 1px at a 4px offset.
- The meta text is body-m, 16/20 EN and 18/24 AR, in `on-surface-muted`.

**States:** link states (hover 2px underline, the shared focus ring).

**RTL:** links start on the right and the meta text sits on the left.

**Arabic sizing:** as above.

**Motion:** none.

**DDS faults to avoid:**

- F-005: shadow DOM with an empty stylesheet, which rendered the footer unstyled.
- F-049: camelCase props.

---

### A30 · `sc-page`, A31 · `sc-container` and A32 · `sc-grid`

These are layout only.

**Container:** margins of 20, 32, 48 and 80px at 0, 600, 1024 and 1440px (E1 uses 80; E2–E4 use 20). The maximum width is 1280. `width="reading"` caps at 680.

**Grid:** 4, 8 or 12 columns, with gutters of 16, 20 or 24. E1 uses a 24px gap between cards and 12px between network tiles; the network strip sets its own gap.

**Section bands (new in E):**

- A full-bleed band in `surface-container-low` (neutral-96), for example "Most used services".
- Desktop padding is 80 on all sides, with a 32 gap between the band heading and the content. On compact screens it is 40 by 20 (proposed).
- Bands alternate with `surface`. Two bands of the same colour must not sit next to each other.

**`sc-page`:** sets `lang`, `dir`, `data-channel` and `data-theme`, as in v1. It sets `scroll-padding-top` from the sticky header and `scroll-padding-bottom` from the utility bar or bottom nav (B4 and B9).

**RTL:** columns run from the right.

**Arabic sizing:** none.

**Motion:** none.

**DDS fault to avoid:** F-005 and F-006. Layout styles must reach the components (an architecture point for F3).

---

### A33 · `sc-ltr`

There are no visual rules. It isolates its content. In E the Unicode isolates in E2's phone number (U+2066 and U+2069) show the plain-text form.

---

### Part B · new components from the Dubai Now work

The names follow "Signed in · pattern candidates". Where the brief named a component without a tag, the name here is proposed (OQ-19).

---

### B1 · `sc-announcement-bar`

**Anatomy:** a full-bleed band above the header. It holds a tone icon, the message, one link, and a dismiss button.

**Sizes (proposed; the v1 reference supplies the structure):**

- At least 48 tall.
- Padding 12 block, with the container margin inline.
- The icon is 20px, with a gap of 12.
- The dismiss button is 44 × 44 with a 20px `close` icon.
- On compact screens the link wraps to its own line under the message.

**Type:** the message is body-m Medium, 16/22 EN and 18/28 AR. The link is the same, underlined.

**Colour by tone:**

| Tone | Fill | Icon | Text |
| --- | --- | --- | --- |
| `warning` (default; maintenance) | `warning-container` | `warning` | `on-surface` |
| `info` | `info-container` | `info` | `on-surface` |
| `error` (service down) | `error-container` | `error` | `on-surface` |

- There is a 1px rule beneath in the tone's `outline-variant` (proposed).
- The dismiss button has no fill, its icon in `on-surface`, a `state-hover` hover and the shared focus ring.
- The text carries the severity in words ("Planned maintenance…").

**Semantics:**

- A `<section aria-label="Announcement">` (proposed), present when the page loads. It is not a live region.
- The dismiss button is named "Dismiss announcement" / "إغلاق الإعلان".
- The dismissal persists per announcement ID. Focus then moves to the next focusable element at the top of the page.

**RTL:** the icon is on the right and the dismiss button on the left.

**Arabic sizing:** 18/28. It wraps to more lines rather than truncating.

**Motion:** on dismiss, the bar fades out over 160ms and is then removed without animating its height (MOT-11). From the keyboard, it is removed instantly.

**DDS fault to avoid:**

- F-012: an alert with no role. Here it is deliberately a labelled region, not an alert, because it is present at load.
- F-003: the dismiss control was a span. Here it is a `<button>`.

---

### B2 · `sc-site-header` (the channel-site header)

This is used on channel pages outside transactions (E1). It contains the channel switcher (B2a) and the mobile menu (B2b). Signed in, the sign-in control is replaced by `sc-account-menu` (B3).

**Anatomy (desktop):**

- **Inline-start:**
  - the channel mark (a 36 × 36 tile, radius 10, `channel-action` fill, with the channel glyph in `on-channel-action`)
  - the channel name
  - the primary navigation (four or five links)
- **Inline-end:**
  - search (an icon button, or a link to search)
  - the language switch (`header` appearance)
  - the sign-in control or the account menu
  - the channel switcher
- **Below:** a 1px `divider` rule.

The reference adds the Government of Dubai mark at inline-start (OQ-13).

**Sizes:**

- Height 80.
- Padding inline 80 (the container margin).
- The gap from the brand to the navigation is 56. The gap between navigation items is 36. The gap between end controls is 24.
- The brand mark-to-name gap is 12.
- **Navigation item:** a full-height link. The current item has a 3px `channel-action` bottom bar, with 3px of top padding to balance it.
- **Sign-in control** (E1): 48 tall, padding 20, radius 4, a 1.5px `outline-strong` edge, a `fingerprint` icon of 20px, gap 8 (OQ-4).

**Compact (below 1024, proposed from the reference):**

- 64 tall.
- From inline-start: a menu button (44 × 44, `menu` icon), the channel mark and name, the language switch, then the channel switcher, which shrinks to the swatch and a chevron.
- Sign-in and search move into the mobile menu.

**Type:**

- The channel name is headline-s Bold, 24/30 EN and 26/34 AR.
- Navigation items are label-l Medium, 18/22 EN and 20/24 AR. The current item is Bold.
- The sign-in label is label-m Bold, 16/20 EN and 18/22 AR.

**Colour by state:**

| Element | Default | Hover | Current | Focus |
| --- | --- | --- | --- | --- |
| Navigation item | `on-surface` | Underline 1px at a 4px offset | `channel-action` Bold, a 3px `channel-action` bar, `aria-current="page"` | Shared ring, inset 4px from the bar |
| Sign-in | Edge `outline-strong`, text `on-surface` | Fill `state-hover` | | Shared ring |
| Header | Fill `surface`, `divider` rule | | | |

**Semantics:**

- The header is a `<header>` (the banner landmark).
- The navigation is a `<nav aria-label="Main">` / "رئيسية".
- The header is not fixed by default. If it is made sticky, `scroll-padding-top` applies (F-009).

**RTL:** the brand is on the right and the end controls on the left. The current bar does not move.

**Arabic sizing:** navigation items are 20/24. If five items do not fit at 1024–1279, the last item moves into a "More" disclosure (proposed) rather than wrapping.

**Motion:** the navigation hover is colour only. The bar does not slide between items.

**DDS faults to avoid:**

- F-009: a fixed header hid focus.
- F-044: `onClick` on a div wrapping the hamburger button.
- The DDS header's axe failure (component matrix ¹²) and its missing `aria-expanded`.

#### B2a · Channel switcher (part of `sc-site-header`, or `sc-channel-switcher`)

**Anatomy:**

- The trigger is a `<button aria-expanded>` with:
  - the current channel's 10px swatch (radius 3, its `channel-action`)
  - the name, label-l Bold
  - an `expand-more` icon of 20px
  - a visually hidden prefix, "Choose a channel:"
- The panel (non-modal) holds:
  - a caption heading, "Choose a channel" / "اختيار القناة"
  - a list of seven links, each with its swatch, name and descriptor

**Sizes:**

- The trigger is 48 tall, padding 16, radius 4, with a 1.5px `outline` edge (proposed: it is a control, so it needs an `outline` edge).
- The panel is 360 wide, radius 12, with a 1px `outline-variant` edge, `shadow-2` and padding 8. It is aligned to the trigger's inline-end edge, 8 below it.
- Each item is at least 56 tall, padded 10 by 12, with radius 8.
- Each item has a 12px swatch, a gap of 12, and a 20px `check` icon at inline-end for the current channel.

**Type:**

- The caption is label-s Medium, 15/18 EN and 16/22 AR, in `on-surface-muted`.
- The item name is title-s Bold, 17/22 EN and 19/26 AR.
- The descriptor is body-s, 15/20 EN and 16/24 AR, in `on-surface-muted`.

**Colour:**

- Each swatch is that channel's `channel-action`. Name the colours as attribution; they are not themes.
- The current item has a `surface-container-low` fill, a check and `aria-current="true"`.
- Hover is `state-hover`. Focus is the shared ring, inset.

**Behaviour:**

- It is a disclosure, not an ARIA menu.
- Escape closes it and returns focus to the trigger.
- An outside click closes it.
- Tab moves through the links and out of the panel, and the panel closes when focus leaves.

**RTL:** the panel aligns to the trigger's inline-end edge, which is left in Arabic.

**Motion:**

- From a pointer, the panel enters with opacity and `scale(0.97)` from the trigger's block-end, inline-end corner over 200ms (MOT-08), and exits with opacity over 160ms.
- From the keyboard, it is instant.

**DDS fault to avoid:**

- F-024: no Escape, no outside click, no focus return.
- The live sites' switcher was mislabelled and not reachable by keyboard (the "Shared chrome" note).

#### B2b · Mobile menu (part of `sc-site-header`)

**Anatomy:**

- A modal panel opened by the menu button.
- It is a full-screen sheet under a header row. The header row holds a close button (44 × 44), the title "Menu" / "القائمة" and the language switch.
- Then, in order:
  - the search field (`sc-search` size `m`)
  - the navigation list (56px rows with a chevron, divided by 1px `divider` rules)
  - a footer area with the primary sign-in button (full width, 56) and a supporting sentence

**Sizes:** padding inline 16. Navigation rows are 56 tall, label-l Bold, with a 24px chevron in `on-surface-muted`.

**Colour:**

- The panel is `surface`. A current row has a 3px `channel-action` inline-start bar and `aria-current="page"`.
- The supporting sentence is body-s in `on-surface-muted`.

**Behaviour:**

- `<dialog>` with `showModal()`, labelled by its title.
- Focus goes to the close button on open.
- Escape closes it, and focus returns to the menu button.
- The page behind is inert.

**RTL:** the close button is on the right and chevrons point left.

**Motion:**

- From a pointer, the panel enters with opacity and an 8px block-start shift over 200ms, and exits with opacity over 160ms.
- From the keyboard, it is instant.
- Under reduced motion, opacity only.

**DDS fault to avoid:** F-044 (hamburger semantics) and the missing `aria-expanded`.

---

### B3 · `sc-account-menu`

**Anatomy:**

- The trigger is a `<button aria-expanded>` with:
  - an avatar (32px circle, initials)
  - the user's name (hidden below 1280, proposed; the accessible name stays)
  - an `expand-more` chevron of 20px
- The panel is a disclosure. It holds:
  - the user's name and "Acting for: …" (the represented context)
  - links to Applications, Payments, Notifications and Profile and settings
  - a divider
  - a "Sign out" button

**Sizes:**

- The trigger occupies the sign-in control's frame: 48 tall, padding 6 at the start and 12 at the end, radius 4, with a 1.5px `outline` edge.
- The avatar is 32, a pill.
- The panel is as the channel switcher's (B2a), 320 wide.
- Items are 48 tall with a 24px icon, a gap of 12 and radius 8.

**Type:**

- The avatar initials are label-s Bold, 14/18 EN. They do not appear in Arabic script: initials come from the name as written.
- The name is label-m Medium, 16/20 EN and 18/22 AR.
- Items are label-l Medium, 18/22 EN and 20/24 AR.

**Colour:**

- The avatar has a `channel-container-high` fill with `channel-action` initials.
- Items are `on-surface`. Hover is `state-hover`. Sign out is `on-surface` with a `logout` icon (proposed: not `error`, because signing out is not destructive).
- An unread count on Notifications uses the badge in B8.

**Behaviour, RTL and motion:** as the channel switcher (B2a).

**DDS fault to avoid:** F-002, an avatar dropdown trigger on a div. Also F-025, duplicate IDs in the mapped items.

---

### B4 · `sc-utility-bar`

**Anatomy:** a bar fixed at the bottom of the viewport on desktop. It holds five labelled buttons or links: Happiness Meter, Call 04, Services, Chat and Accessibility. On compact screens it folds into the footer as "Help and feedback" (a 2 × 2 grid of secondary buttons, size `m`), as in the reference.

**Sizes (proposed):**

- A floating capsule, radius 12, with a 1px `outline-variant` edge and `shadow-2`, centred, 16 from the bottom edge.
- Items are 48 tall, padded 16 inline, with a 20px icon and a gap of 8.

**Type:** items are label-m Medium, 16/20 EN and 18/22 AR.

**Colour:**

- The capsule is `surface`. Items are `on-surface`.
- Hover is `state-hover`. Focus is the shared ring.

**Behaviour:**

- `<nav aria-label="Help and feedback">`.
- The page reserves the bar's height plus 32 as `padding-bottom`, and sets `scroll-padding-bottom` to the same, so nothing is covered and focus is never hidden (WCAG 2.4.11).

**RTL:** the item order mirrors. Icons do not mirror (phone, chat).

**Arabic sizing:** 18/22. If the bar exceeds 90% of the viewport width, labels collapse to icons with tooltips. Proposed: rather than icon-only, wrap to two rows. Never hide the labels (OQ-9).

**Motion:** none. It is present on load.

**DDS faults to avoid:**

- F-006: the sticky footer's styles never applied.
- Manual review Q2: a fixed footer hid the focused element.

---

### B5 · `sc-footer` with the Channels group (grouped variant)

**Anatomy:**

- **Upper region**, a grid of four groups:
  - **Brand:** the channel mark and name, a one-sentence description, and app badges
  - **Channels:** all seven channels, as links
  - **Helpful information:** about, help and contact, accessibility statement, sitemap
  - **Legal:** privacy and cookies, terms
- **Lower region**, after a 1px `divider`: "Government of Dubai · Last updated {date}" at inline-start and "{Channel} is run by the Government of Dubai" at inline-end.

**Sizes:**

- The footer has a top `divider` rule. Padding top 56 and bottom 40, with the container margin inline.
- Group columns on the 12-column grid: brand 4, Channels 4 (two inner columns), Helpful information 2, Legal 2.
- Group headings sit 16 above their lists. List items are 36 apart on desktop. On compact screens each link is a 44px row.
- App badges follow the providers' asset rules: about 40 tall, radius 8, `inverse-surface`.

**Type:**

- Group headings are title-s Bold, 16/20 EN and 18/24 AR, as `<h2>` elements.
- Links are label-m Medium, 16/20 EN and 18/24 AR, underlined (E1).
- The description is body-m, 16/24 EN and 18/28 AR, in `on-surface-variant`.
- The meta text is body-s in `on-surface-muted`.

**Colour:**

- The footer is `surface`.
- Links are `on-surface`. In the Channels group, the current channel has `aria-current="true"` and is Bold (proposed: no swatch, because the footer stays neutral).

**RTL:** the groups mirror.

**Arabic sizing:** as above.

**Motion:** none.

**DDS fault to avoid:** F-005 (an unstyled shadow footer) and F-049 (prop casing). Also OQ-8: the v1 spec said "not a sitemap", and the mandate asks for a Channels group.

---

### B6 · `sc-breadcrumbs`

**Anatomy:** `<nav aria-label="Breadcrumb">` / "مسار التنقل", then an `<ol>` of links. A `chevron-forward` separator (20px, `aria-hidden`, mirrored) sits between items. The current page is the last item. It is not a link and carries `aria-current="page"`.

**Sizes:**

- Items are inline with a gap of 8, and each separator has 4 of margin.
- The row sits 24 above the hero heading.
- The link target is at least 24 by 24 (WCAG 2.5.8), so add 10px of block padding.

**Type:** label-m Medium, 16/20 EN and 18/24 AR. The current item is Bold (proposed).

**Colour:**

- Links are `on-surface`, underlined 1px at a 4px offset; hover is 2px.
- The current item is `on-surface` with no underline.
- Separators are `on-surface-muted`.

**Compact screens:** collapse to a single "Back to {parent}" link with a `chevron-back` icon, as GOV.UK does (proposed).

**RTL:** the chevrons mirror, so they point left.

**Arabic sizing:** 18/24.

**Motion:** none.

**DDS fault to avoid:** F-027, current marked by class only. Avoid the gaps of 4 and 10 from `dda-breadcrumb`: they give targets under 24px.

---

### B7 · `sc-pagination`

**Anatomy:** `<nav aria-label="Pagination">` holding a Previous link (a `chevron-back` icon and "Previous"), the page numbers, ellipses, and a Next link. A results count may sit above ("Showing 1 to 20 of 1,284 services"; LANG-22A in Arabic).

**Sizes:**

- Number cells are 44 × 44, radius 4, with a gap of 4.
- Previous and Next are 44 tall, padded 12 inline, with a 20px icon and a gap of 6.
- On compact screens only Previous, "Page 2 of 13" and Next show (proposed).

**Type:** label-l Medium, 18/22 EN and 20/24 AR. The current page is Bold.

**Colour by state:**

| Element | Default | Hover | Current | Focus |
| --- | --- | --- | --- | --- |
| Number | `on-surface`, no fill | `state-hover` fill | `channel-action` fill, `on-channel-action` text, `aria-current="page"` | Shared ring |
| Previous and Next | `channel-action` text, underlined | Underline 2px | | Shared ring |
| Unavailable (first or last page) | Omitted, not disabled (proposed) | | | |

**RTL:** Previous is on the right and its chevron points right. Next is on the left.

**Arabic sizing:** 20/24. Cells stay 44.

**Motion:** press scale 0.97 on number cells. No page-change animation.

**DDS faults to avoid:**

- F-027: no `aria-current`.
- F-022: targets under the minimum.
- `dda-pagination.css` uses physical `border-left` and `border-right` with asymmetric radii, which break in RTL. Use logical properties only.

---

### B8 · `sc-account-nav`

**Anatomy:** a `<nav aria-label="Account">` holding a vertical list (Applications, Payments, Notifications, Profile and settings), then a `divider`, then "Sign out". Each item has a 24px icon, a label, and an optional count badge.

**Sizes:**

- Items are at least 48 tall, padded 12 inline, with radius 4, a 24px icon and a gap of 12.
- The column is 3 of 12 on desktop. On compact screens it becomes a horizontal scroller of 44px items above the content (proposed), or it lives in the account menu.
- The count badge is a pill at least 24 wide and 24 tall, padded 8 inline.

**Type:** items are label-l Medium, 18/22 EN and 20/24 AR. The current item is Bold. The badge is label-s Bold, 14/18 EN and 16/20 AR.

**Colour by state:**

| State | Rule |
| --- | --- |
| Default | `on-surface`, icon `on-surface-muted` |
| Hover | `state-hover` fill |
| Current | `channel-container` fill, a 3px `channel-action` bar at inline-start, `channel-action` icon and Bold label, `aria-current="page"` |
| Focus | The shared ring |
| Badge | `channel-action` fill, `on-channel-action` text, with hidden text "3 unread" |

**RTL:** the bar and icons move to the right. The sign-out icon mirrors (it is directional).

**Arabic sizing:** 20/24.

**Motion:** colour only.

**DDS fault to avoid:** F-027, current marked by class only. Also the side-navigation CSS in `packages/dom/css` has no semantics.

---

### B9 · `sc-bottom-nav`

**Anatomy:** a bar fixed at the bottom on compact screens, when signed in. It holds three to five destinations (Home, Services, Activity, and so on), each an icon above a label. Search may be a separate trailing button.

**Sizes (proposed):**

- 64 tall plus the bottom safe area.
- A `surface` fill with a 1px `divider` top rule. It is flat; v1's floating glass capsule is not carried over.
- Each item fills an equal share and is at least 48 wide.
- The icon is 24.
- The current item has an active indicator pill 56 × 32 behind its icon.

**Type:** label-s Medium, 14/18 EN and 16/20 AR. The current item is Bold.

**Colour by state:**

| State | Rule |
| --- | --- |
| Default | Icon and label `on-surface-muted` |
| Current | A `channel-container-high` indicator, icon and label in `channel-action`, `aria-current="page"` |
| Pressed | Indicator `state-hover` |
| Focus | The shared ring around the item |

**Behaviour:** `<nav aria-label="Main">`. The page reserves the bar's height (`padding-bottom` and `scroll-padding-bottom`). The utility bar is not shown when the bottom nav is present (OQ-9).

**RTL:** the item order mirrors.

**Arabic sizing:** labels at 16/20 must fit. A long Arabic label wraps to two lines; the bar grows to 72.

**Motion:** the indicator crossfades its colour over 120ms. It does not slide.

**DDS fault to avoid:** F-027 (current by class) and F-006 (fixed bars with no styles).

---

### B10 · Service card icon slot (`sc-service-card` `slot="icon"`)

**Anatomy:** a 40 × 40 tile holding a 24px icon. It is decorative (`aria-hidden`).

**Sizes:** radius 8 and a gap of 16 to the text. It top-aligns with the title.

**Colour (proposed):**

- A `channel-container` fill with the icon in `channel-action`.
- For an attention card or notification, the tile may take the status tone's container and tone, but status words must still be present elsewhere.

**RTL:** the tile sits at inline-start. Icons mirror only if they are directional.

**Arabic sizing:** none.

**Motion:** none.

**DDS fault to avoid:** F-048, where icon or text was decided by guessing from the string. Icons are explicit slots.

---

### B11 · `sc-service-tile` (favourite services)

**Anatomy:** a compact single-link tile with a 40px icon tile (B10) and a label. The whole tile is one link, because the label is the tile's only content and the link's name. This does not conflict with CMP-06.

**Sizes (proposed):**

- At least 112 tall, padding 16, radius 12, with a 1px `divider` edge.
- The icon sits above the label, with a gap of 16.
- In a 6-up grid at 1440, 3-up at 600 and 2-up on compact screens.

**Type:** title-s Bold, 17/22 EN and 19/26 AR.

**Colour by state:**

| State | Rule |
| --- | --- |
| Default | `surface`, `divider` edge, label `on-surface` |
| Hover | Edge `outline`, label underlined |
| Pressed | Scale 0.97 |
| Focus | The shared ring around the tile |

**RTL:** content aligns right.

**Arabic sizing:** 19/26. Up to three lines.

**Motion:** press scale 0.97 over 100ms. Hover is colour only.

**DDS fault to avoid:** F-035, an event that never fires on a card link.

---

### B12 · `sc-attention-card` ("Needs your attention")

**Anatomy:**

- A top row with the icon tile (B10) at inline-start and a status tag (A18) at inline-end.
- The title (a heading).
- The key fact ("Due tomorrow, 21 Oct 2026").
- A meta line (amount and reference, isolated).
- One action button (secondary, size `m`) whose label names the action and the item ("Pay AED 412.60").

**Sizes (proposed):**

- Radius 12, a 1px `divider` edge, padding 20.
- The gap from the top row to the title is 16. The title-to-fact gap is 4. The fact-to-meta gap is 4. The action sits at least 24 below the meta line, pushed to the bottom.
- Up to four in a row on desktop, and one column on compact screens.

**Type:**

- The title is title-m Bold, 19/24 EN and 20/28 AR.
- The fact is body-m Medium, 16/20 EN and 18/26 AR, in `on-surface`.
- The meta is body-s, 15/20 EN and 16/24 AR, in `on-surface-muted`.

**Colour:**

- The card is neutral. The status tag carries the tone.
- There is no coloured edge (proposed; v1 used a tone-coloured top rule, which is redundant with the tag).

**Semantics:** a list (`<ul>`) of cards, ordered most urgent first, under a section heading with a count ("4 things, most urgent first").

**RTL:** mirrors. Amounts and references are isolated.

**Arabic sizing:** as above. Cards grow.

**Motion:** none.

**DDS fault to avoid:** status shown by colour only, the DDS chip faults.

---

### B13 · `sc-module-card` (channel modules: Vehicles, Applications, Traffic fines)

**Anatomy:**

- A header row: the icon tile, the title (a heading), and a standalone link at inline-end ("Manage", "View all").
- A body of module content, divided internally by 1px `divider` rules.
- An optional footer action.
- A plate chip variant for vehicle plates: an outlined box with the plate isolated in `<bdi dir="ltr">`.

**Sizes (proposed):**

- Radius 12, a 1px `divider` edge, padding 24.
- The header gap is 12. Body blocks are 20 apart, with rules between them.
- The plate chip is 36 tall, padded 12 inline, radius 4, with a 1.5px `outline-strong` edge.
- Up to three in a row.

**Type:**

- The title is title-l Bold, 20/28 EN and 22/32 AR.
- The header link is label-m Bold, as `sc-link standalone`.
- A large figure (balance, amount due) uses headline-m Bold, 30/38 EN and 32/44 AR, with tabular figures.
- The plate chip is title-s Bold, 17/22.

**Colour:** neutral card. Links are `channel-action`. Status uses `sc-status-tag`. The plate chip has `on-surface` text and an `outline-strong` edge.

**RTL:** mirrors. The plate always reads left to right.

**Arabic sizing:** as above.

**Motion:** none.

**DDS fault to avoid:** `dda-progressbar` with no name (F-013, F-050), if a module shows progress. Use the stepper text ("Step 2 of 4") or a named `<progress>`.

---

### B14 · `sc-empty-state`

**Anatomy:**

- an optional 48px icon in an 80px `surface-container-low` circle
- the title (a heading, or a paragraph at title role)
- one or two sentences
- an optional single action (a secondary button)

**Sizes (proposed):**

- Aligned to start, never centred (Arabic and English parity; it scans with the content).
- Padding 32. The icon-to-title gap is 20. The title-to-body gap is 8. The body-to-action gap is 24.
- Inside a card or table, there is no extra edge.

**Type:**

- The title is title-m Bold, 19/24 EN and 20/28 AR. Write the sentence ("You have no fines"), never "No data".
- The body is body-l, 18/30 EN and 20/34 AR, in `on-surface-variant`.

**Colour:** neutral. The icon is `on-surface-muted`.

**RTL:** aligns right.

**Arabic sizing:** as above.

**Motion:** none.

**DDS fault to avoid:** none in DDS.

---

### B15 · `sc-accordion`

**Anatomy:**

- An optional "Show all sections" / "Hide all sections" button.
- Sections. Each has a heading containing a `<button aria-expanded aria-controls>` with the title, an optional summary line, and an `expand-more` chevron (24px) at inline-end.
- A region with the content.
- 1px `divider` rules between sections and above the first.

**Sizes:**

- The section header button is at least 56 tall, padded 16 block, with no inline padding (it aligns with the text column).
- The chevron sits in a fixed 24px slot at inline-end, with a gap of 16.
- Content has 8 of top padding and 24 of bottom padding.

**Type:**

- The title is title-m Bold, 19/24 EN and 20/28 AR.
- The summary is body-m, 16/20 EN and 18/26 AR, in `on-surface-muted`.
- The "Show all" button is label-m Medium in `channel-action`.

**Colour by state:**

| State | Rule |
| --- | --- |
| Default | Title `on-surface`, chevron `on-surface` |
| Hover | Title underlined 1px |
| Expanded | Chevron rotated 180°, `aria-expanded="true"` |
| Focus | The shared ring around the header button, inset 0, full width |

**RTL:** the chevron moves to the left. The rotation is vertical, so it does not mirror.

**Arabic sizing:** as above.

**Motion:**

- The chevron rotates over 150ms with the in-out curve, pointer only.
- The content appears with an opacity fade of 150ms and no height animation (MOT-11).
- From the keyboard, both are instant.
- Native `<details>` and `<summary>` are acceptable if the visuals match (proposed: prefer them for zero-JS resilience).

**DDS fault to avoid:** F-001, a div header that could not be reached or opened by keyboard, with no `aria-expanded`. Also F-010, if tabs are ever added: implement the full WAI tabs pattern or don't ship tabs.

---

### B16 · `sc-timeline` (application history)

**Anatomy:** an `<ol>`, newest first. Each entry has:

- a marker (12px dot)
- a vertical connector (2px)
- a status tag
- the date and time (`<time>`)
- a description line

**Sizes (proposed):**

- The marker column is fixed at 24 wide. The dot is centred and its top aligns with the tag.
- The connector runs between dots.
- Entries are 20 apart, with a 1px `divider` rule between them when the timeline sits in a card.

**Type:**

- The date and time are body-s, 15/20 EN and 16/24 AR, in `on-surface-muted`. Digits are Latin.
- The description is body-m, 16/24 EN and 18/28 AR.

**Colour:**

- The newest dot takes its status tone (`error`, `warning`, `success` or `info`). Earlier dots are `outline`.
- The connector is `outline-variant`.
- The status words are always in the tag.

**RTL:** the marker column moves to the right.

**Arabic sizing:** as above.

**Motion:** none.

**DDS fault to avoid:** F-027. The vertical stepper used class-only state and a physical `border-right` (`dda-vertical-stepper.css`). Use logical borders and words.

---

### B17 · `sc-notification-list`

**Anatomy:** groups ("Today", "Earlier") with day headings. Each group is a container with rows. Each row has:

- an unread dot (8px, in a fixed 16 column) and a visually hidden "Unread"
- the icon tile (B10)
- the title (Bold)
- the body line
- the time, in a fixed column
- one action link, in a fixed column at inline-end

**Sizes (proposed):**

- The container has radius 12 and a 1px `divider` edge, with 1px `divider` rules between rows.
- Rows are padded 20 block and 24 inline, with a gap of 16.
- The time column is 96. The action column is 112.
- On compact screens the time and action wrap under the body.

**Type:**

- The title is title-s Bold, 18/22 EN and 20/26 AR.
- The body is body-m, 16/22 EN and 18/28 AR.
- The time is body-s in `on-surface-muted`.
- The action is label-m Medium, as a link.

**Colour:**

- An unread row has a `channel-container` fill and a `channel-action` dot.
- A read row is `surface` with no dot, and its title is Medium rather than Bold.
- The day headings are title-s Bold in `on-surface`.
- "Mark all as read" is a secondary button, size `m`.

**Semantics:** the row is not a link. The action link names the item ("Pay bill", with hidden text "for DEWA, due tomorrow"), per CMP-06 thinking. The count of unread items appears in the page lede.

**RTL:** the columns mirror.

**Arabic sizing:** as above.

**Motion:** "Mark all as read" removes the fills with a colour transition over 200ms. From the keyboard, it is instant.

**DDS fault to avoid:** unread shown by colour only. Here there is a dot, bold weight and hidden text.

---

### B18 · Filter and suggestion chips (`sc-chip`, `sc-filter-chips`)

There are three kinds:

| Kind | Element | Use |
| --- | --- | --- |
| Suggestion | `<a>` | "Popular now" links in the hero (E1) |
| Filter toggle | `<button aria-pressed>` | Quick filters, date range presets |
| Applied filter | `<button>` named "Remove filter: Transport and vehicles" | The removable chips beside a result count |

**Sizes:**

- 40 tall (E1), pill radius, padded 16 inline.
- The applied filter adds a 20px `close` icon at inline-end, with a gap of 8. The check icon on a pressed toggle is 18px.
- The gap between chips is 12.
- The target is at least 44: add 2px of transparent hit area above and below (OQ-6).

**Type:** label-m Medium, 17/22 EN and 18/24 AR.

**Colour by state:**

| Kind and state | Fill | Edge | Text |
| --- | --- | --- | --- |
| Suggestion, default | `surface` | 1px `channel-outline` | `channel-action` |
| Suggestion, hover | `channel-container` | 1px `channel-outline` | `channel-action` |
| Toggle, off | `surface` | 1.5px `outline` (it is a control) | `on-surface` |
| Toggle, on | `channel-action` | none | `on-channel-action`, plus a check icon |
| Applied filter | `channel-container` | none | `channel-action` and the close icon |

All kinds take the shared focus ring and a press scale of 0.97.

**RTL:** chips flow from the right, and the close and check icons sit at inline-end and inline-start.

**Arabic sizing:** 18/24. The chips stay 40 tall.

**Motion:**

- The toggle's fill changes colour over 120ms.
- An applied chip, once removed, disappears instantly, and focus moves to the next chip or to the results heading.

**DDS faults to avoid:**

- F-003: a dismiss span not operable by keyboard.
- `dda-chip`'s 26px height.
- F-048: the "fo" icon heuristic in segmented tabs.

---

### B19 · `sc-modal` (dialog and bottom sheet)

**Anatomy:** native `<dialog>` opened with `showModal()`. It holds:

- the title (a heading, which labels the dialog)
- the body
- an action row (primary first, then secondary or tertiary)
- a close button (44 × 44) at top inline-end

On compact screens the same component renders as a bottom sheet, with a grabber at the top.

**Sizes:**

- **Dialog:** at most 560 wide, radius 12, padding 32 (24 on medium), with `shadow-3` over the `scrim`. The title-to-body gap is 12 and the body-to-actions gap is 32.
- **Sheet:**
  - full width, at most 92% of the viewport height
  - top corners radius 12 (proposed, the top of E's radius scale; v1 used 28; OQ-11)
  - padding 24 by 20, plus the safe area
  - a grabber of 32 × 4 in `outline-variant`, 8 from the top
- **Actions:** on compact screens they are full width and stacked, primary first.

**Type:**

- The title is headline-s Bold, 24/30 EN and 26/36 AR.
- The body is body-l, 18/30 EN and 20/34 AR.

**Colour:**

- The panel is `surface` (dark: `surface-container-high`).
- The scrim is `scrim`.
- The close icon is `on-surface`, with a `state-hover` hover.

**Behaviour:**

- On open, focus goes to the title (`tabindex="-1"`) or to the first control.
- Escape and the close button close it. A scrim click closes it, except for an `alertdialog`.
- Focus returns to the trigger.
- The session timeout uses `role="alertdialog"` with no scrim dismissal.
- Dragging is never the only way to close a sheet (MOT-10, WCAG 2.5.7).

**RTL:** the close button moves to the left. Actions keep primary first in reading order.

**Arabic sizing:** as above.

**Motion:**

- The dialog enters with opacity and `scale(0.97)` from the centre over 200ms, and exits with opacity over 160ms.
- The sheet slides up over 300ms with the drawer easing and exits over 240ms. Drag follows the finger, and a flick above about 0.11 px/ms closes it.
- The scrim fades over 200ms.
- Under reduced motion, opacity only.
- From the keyboard, it opens instantly.

**DDS fault to avoid:** F-024 (no Escape, no focus return) and F-011 (hover-only overlays). DDS ships no modal.

---

### B20 · `sc-step-list` (the life-event list on E1; proposed name)

**Anatomy:**

- A container with an `<ol>` of steps.
- Each row has:
  - a marker column: a 32px numbered circle, with 2px connectors above and below
  - text: the service title (a link) and the owning entity
  - a fixed 200px trailing slot: an optional channel chip (outlined variant) and a 24px chevron
- Rows that belong to another channel take that channel's colours (see Colour).

**Sizes:**

- The container has radius 12, a 1px `divider` edge, and padding 12 block.
- Rows are padded 28 inline, with a gap of 20.
- The marker column is 32 wide. The connector stub above the marker is 18 tall and 2 wide.
- The text block has 20 of block padding and a gap of 2.

**Type:**

- The number is label-s Bold, 15/18 EN and 16/20 AR.
- The title is title-m Bold, 19/24 EN and 20/28 AR.
- The entity is body-m, 16/20 EN and 18/26 AR, in `on-surface-muted`.

**Colour:**

| Row | Background | Marker | Connector |
| --- | --- | --- | --- |
| Own channel | `surface` | `surface` fill, a 1.5px `channel-action` edge, number in `channel-action` | `outline-variant` |
| Other channel (attribution) | That channel's `channel-container` | That channel's `channel-action` fill, with the number in `on-channel-action` | That channel's `channel-action` |

- The other-channel row also has an outlined channel chip ("On Dubai Transport").
- The chevron is `on-surface-muted`.
- On hover the title underlines.

**Semantics:**

- The title is the link. The row is not a link.
- The chevron is decorative.
- The number is the list position. Do not duplicate it in text.

**RTL:** the marker column moves to the right and the chevron points left.

**Arabic sizing:** as above.

**Motion:** none.

**DDS fault to avoid:** F-027 and F-036, the stepper faults, if a "done" state is ever added.

---

### B21 · `sc-channel-network` (the channel network strip on E1; proposed name)

**Anatomy:**

- An eyebrow: a 24 × 3 rule, then "One network · seven channels" (upper case in English only).
- A row of seven tiles. Each tile has a 4px top rule in that channel's `channel-action`, the channel name, and a descriptor.
- The current channel's tile reads "You are here".

**Sizes:**

- The eyebrow gap is 12. The strip sits 24 below the eyebrow.
- Tiles are 12 apart and have equal widths.
- Each tile has radius 8, padding 20 block and 16 inline, and a gap of 6.
- On compact screens the strip becomes a two-column grid, or a horizontal scroller with a visible edge cue (proposed: the grid, because scrollers hide channels).

**Type:**

- The eyebrow is label-s Bold, 15/18, tracked 0.08em in English. In Arabic it is 16/20, not tracked and not in upper case.
- The name is title-s Bold, 17/22 EN and 19/26 AR.
- The descriptor is body-s, 15/18 EN and 16/22 AR.

**Colour:**

- The eyebrow and its rule are `city-action` (city indigo).
- Tiles have a `surface-container-low` fill, the name in `on-surface` and the descriptor in `on-surface-muted`.
- The current tile has a `channel-container` fill (the current channel), the name in `channel-action` and "You are here" in Medium `on-surface-variant`.
- Each tile's top rule is its own channel's accent. E uses a lighter `trade-line` for Dubai Trade, because trade-40 is close to neutral (OQ-14).

**Semantics:**

- `<nav aria-label="Government of Dubai channels">` with a list of links.
- The current tile is a link with `aria-current="true"`, or plain text (proposed: text, because it links to the current site).
- On hover the name underlines. Focus is the shared ring.

**RTL:** tiles run from the right.

**Arabic sizing:** as above.

**Motion:** none.

**DDS fault to avoid:** none in DDS. The colour rule is ours: no DDS teal in any accent.

---

### Part C · compositions noted, not separate components yet

These came up in the Dubai Now work. Build them from the parts above, and promote them only if two channels need them.

| Composition | Built from |
| --- | --- |
| Briefing | A sentence of inline links in the page lede |
| Totals card | `sc-card variant="filled"` with `sc-summary-list` `pairs` and a total row (E3) |
| Application row | An `sc-table` row, or an `sc-card` with a status tag |
| Representation switcher | The account menu's "Acting for", plus a page that lists contexts |
| Help strip | A 1px `divider` top rule, padding-top 24, a title-m heading and a body-l paragraph in `on-surface-variant`, with the phone number isolated (E2) |

---

## 3. Page-level patterns from E1–E4

### 3.1 Header

- **Transaction pages** (E2–E4) use `sc-app-bar` (A4):
  - 60 tall, with the 4px channel rule at the top
  - back at start, the channel swatch and name in the centre, the language at end
  - fixed 96px side slots
  - no navigation and no sign-in
- **Channel pages** (E1) use `sc-site-header` (B2):
  - 80 tall
  - the brand mark and name, the main navigation with a 3px current bar, then the language switch, sign-in or account menu, and channel switcher at inline-end
  - a 1px `divider` below
- Neither header is glass. Neither is fixed by default.
- The skip link comes first, then the announcement bar (B1) if there is one, then the header.

### 3.2 Hero (E1)

- A full-bleed flat `channel-container` band holds, in order:
  - breadcrumbs (on inner pages)
  - the eyebrow in `channel-action`
  - a display-l `<h1>` ("What do you need to do?")
  - `sc-search` at size `l` (a 64px field and a 64px button, 880 wide)
  - a "Popular now" row: a label in `on-surface-variant`, then suggestion chips
- Services follow straight after the hero, with nothing in between ("Public · pattern candidates").
- The life-event block comes next:
  - on the left: a 420-wide intro with a "Life event" tag (a 32px chip in `channel-container-high` with a `home` icon), a headline-l title, a body-l lede and a primary button
  - on the right: the `sc-step-list`
  - the two columns are 80 apart
- "Most used services" follows in a `surface-container-low` band, with service cards in a 3-up grid and a gap of 24, and a standalone link "All 412 services" at the band heading's inline-end.

### 3.3 Question page and error summary placement (E2)

The order inside a reading-width column (padding inline 20 on mobile, gap 28 between blocks) is:

1. the app bar (the back link inside it)
2. the stepper, compact form: the step name and "Step 2 of 4", then the markers
3. **the error summary**, only when there are errors: after the stepper and before the `<h1>`. Focus moves to it when the page loads (CMP-05)
4. the `<h1>` question, headline-m (32/48 AR, 30/38 EN on mobile; 32/40 EN on desktop), with an optional body-l explanation in `on-surface-variant` 10 below
5. the fields, each with a 4px error bar at inline-start when it is in error
6. the actions: a full-width primary button ("Continue" / "متابعة"), with "Save and finish later" 20 below as a tertiary (underlined text) button, centred on mobile (OQ-5)
7. the help strip: a 1px `divider`, a "Need help?" heading, and a contact sentence with the phone number isolated

The page `<title>` starts with "Error: " / "خطأ: " while errors are shown (TPL-02).

### 3.4 Check answers (E3)

- The stepper, then an `<h1>` that says what happens next ("Check your answers before you pay", headline-m).
- One `sc-summary-list` per section, each under a title-m Bold section heading ("Vehicle", "Renewal"), in the `stacked` layout on mobile.
- The "Change" action is in a 64px end column, only on rows the user can change. Rows without an action keep the empty column.
- The totals card follows (`sc-card filled`):
  - fee lines in body-m, with the label in `on-surface-muted` and the amount in Medium
  - a 1px `outline` rule
  - "Total" in Bold and the amount at headline-s Bold, 26/32
  - amounts isolated
- The declaration is one body-m sentence in `on-surface-muted` ("By continuing, you confirm these details are correct.").
- The primary button says what it does: "Continue to payment" with a forward arrow.
- **Dark mode** (E3 is dark):
  - the page is `surface`
  - summary containers are `surface-container-low` with `divider` rules
  - the totals card is `surface-container-high`
  - actions are `channel-action` at tone 80 with neutral-10 text
  - completed step markers are `success` at tone 80

### 3.5 Payment review (E4)

The page shows, in order:

1. The stepper, at its last step.
2. An `<h1>` naming the amount: "Pay AED 420.00" (headline-l on mobile, 36/44), with the amount isolated.
3. `sc-summary-list` in the `pairs` layout: Paying for, Plate, Payment reference, and a total row "Amount" (PAY-01). The reference is isolated and copyable.
4. One body-l paragraph saying where the user goes and that they will come back (XCH-01).
5. The payment button: the approved Dubai Pay asset when available. E4 shows a placeholder `inverse` button with a lock icon. Its dashed frame is design annotation only and is not built.
6. "Cancel and go back" as a full-width secondary button.
7. A warning callout: "If your payment is interrupted, don't pay again. Check the payment status in My tasks first."

No other primary action appears on the page.

### 3.6 Footer

- **Transaction pages and simple sites:** the `simple` footer (A29). It is a single row of underlined neutral links (Help and contact, Accessibility, Privacy, Terms, plus Cookies) and the meta text, with a 1px `divider` above.
- **Channel sites:** the grouped footer with the Channels group (B5), and on mobile the utility bar folded in as "Help and feedback".
- The footer is always on `surface`. It is not a dark band.

### 3.7 Channel network strip (E1)

- It sits after the last content band and before the footer, on `surface`, with 72 of top padding and 80 of bottom padding.
- City indigo marks it as shared. Each tile's 4px top rule is that channel's own accent, used as attribution.
- The current channel's tile is filled with its `channel-container` and says "You are here".
- It appears on every channel home page, in the same place and with the same order of channels (Now, Transport, Visit, Justice, Build, Invest, Trade).

---

## 4. Open questions for the user

1. **Focus ring colour.**
   - E0 shows a 3px **neutral-10** ring with a 2px white offset.
   - Standard A11Y-05 and v1 use **channel-action**.
   - I recommend the neutral ring (role `focus-ring`; neutral-100 or neutral-90 in dark mode). It is one colour that clears 3:1 against every channel fill and container, and it cannot blend into a channel-filled button.
   - This changes A11Y-05, which is S1's chapter. Approve?
2. **Width of the field error bar.** E0 draws 3px, and E2 draws 4px, which matches the callout accent. I specified 4px. Confirm.
3. **Colour of completed steps.**
   - E paints done markers in success green, with channel-coloured connectors.
   - The alternative is channel-action, with the check carrying the meaning.
   - Green adds a fourth colour to every journey header, and "done" is not a status outcome. Keep green?
4. **City indigo on hand-offs.**
   - The plan says city indigo carries the sign-in and Dubai Pay hand-offs.
   - E1 draws "Sign in with UAE PASS" as a neutral outlined button. E4 draws "Pay with Dubai Pay" as a neutral-10 filled placeholder.
   - Which applies: provider assets only (OQ-3 and OQ-4 in the Standard), city indigo, or neutral?
5. **Secondary action on mobile question pages.** E0 shows "Save and finish later" as an outlined secondary button. E2 shows it as an underlined text button under a full-width primary. I specified tertiary on compact screens and secondary on wider screens. Confirm, or pick one everywhere (TPL-08 says "secondary button").
6. **Chip height.**
   - E1's suggestion chips are 40px.
   - A11Y-04 requires 44 × 44 for standalone targets.
   - I specified a 40px visual with an invisible 44px hit area. The alternative is to make chips 44px.
7. **Service card.**
   - E1's cards have an arrow and a fixed 184px height.
   - CMP-06 makes the title the only link, so the arrow is decorative, and I made the height a minimum.
   - Is a decorative arrow acceptable, given that it suggests the whole card is clickable?
8. **Footer Channels group.** v1's `sc-footer` says "not a sitemap". The mandate and the reference add a four-group footer with all seven channels. Approve the grouped variant as the channel-site default?
9. **Utility bar in E.**
   - A floating fixed bar needs `shadow-2`, against "elevation minimal".
   - It also competes with the bottom nav on mobile, which the reference resolves by folding it into the footer.
   - Keep it on desktop as specified, dock it full width without a shadow, or drop it for a footer group on every size?
10. **Hero wash.** E replaces v1's two-stop gradient with a flat channel-95 band. Confirm that the gradient (and the `wash-start` and `wash-end` tokens) is retired.
11. **Sheet and modal radius.** E's radius scale tops out at 12. v1 sheets used 28. I specified 12. Confirm.
12. **Type scale reconciliation.**
    - E0's specimen gives headline-l 32/40.
    - E1 uses 40/48 for the life-event heading and 36/44 for section headings.
    - E4 uses 36/44 for the mobile `<h1>`.
    - F1 needs one scale. I mapped these in Appendix B; please confirm which sizes are canonical.
13. **Header contents.**
    - E1's desktop header has no Government of Dubai mark and no channel switcher.
    - The Dubai Now reference (Phase 1 order) has both: the government mark at inline-start and the channel switcher at inline-end.
    - I specified the combined layout (B2). Confirm the order.
14. **Dubai Trade accent.**
    - E draws Trade's network rule in a lighter `trade-line`, because trade-40 reads as grey next to the neutrals.
    - Should every channel get an `accent` role for rules and swatches, separate from `channel-action`, or only Trade?
15. **Status tag: icon or dot.** E0's status chips use icons. E1's channel chips use dots. I kept icons for status and dots for channel attribution. Confirm.
16. **Visited links (Standard OQ-20).** E shows no visited state. Keep none, or add a `link-visited` role?
17. **Language switch on the signed-in mobile bar.** The reference dropped it for width. LANG-04 requires it in the same place on every page. I recommend restoring it, so the site header's compact row holds the menu, brand, language and channel swatch.
18. **Dark-mode current-step halo.** E3 uses the dark `divider` colour, which is barely visible. It is decorative, but should it be the dark `channel-container` instead?
19. **Component names.**
    - Keep `sc-step-progress` for the E stepper, or rename it `sc-stepper`?
    - Is `sc-site-header`, beside `sc-app-bar`, acceptable?
    - Are `sc-step-list` and `sc-channel-network` acceptable for the two E1 inventions?
    - Should filter chips be `sc-chip` with a `kind` property, or three tags?
20. **State colours: tones or layers.**
    - I referred to `channel-action-hover` and `channel-action-pressed` as roles.
    - F1 can generate them as tones (for example 35 and 30) or as Material-style state layers via `color-mix(in oklab, …)`.
    - Tones give predictable contrast and no runtime cost. I recommend tones.
21. **`docs/library-conformance.md`** was named as a source but does not exist. Is there a newer file, or should a conformance checklist for v2 be written in Wave 4?

---

## Appendix A · Colour roles used in this document

The "E source" column gives the tonal step direction E used, so F1 can reconcile names. Light values are first; dark values follow in brackets where E3 or E0 showed them.

### Neutral and surface

| Role | E source | Used for |
| --- | --- | --- |
| `surface` | neutral-100 (dark: e-d-surface, about neutral-10) | Page, cards, header, footer, fields |
| `surface-container-low` | neutral-96 (dark: e-d-surface-low) | Section bands, the filled card, table header, total rows, network tiles, prefix and suffix, avatar placeholder |
| `surface-container-high` | (dark: e-d-surface-high) | The dark totals card, the dark modal panel |
| `surface-disabled` | proposed | Disabled field fill |
| `on-surface` | neutral-10 (dark: e-d-ink, neutral-100) | Primary text, icons, the chevrons in fields |
| `on-surface-variant` | neutral-30 | Secondary body text: lede, help text, "Popular now", upcoming step names |
| `on-surface-muted` | neutral-40 (dark: e-d-muted) | Hints, supporting text, entity names, keys, metadata, placeholders, inactive icons |
| `on-surface-disabled` | proposed (at least 3:1) | Disabled labels, unavailable calendar days |
| `outline` | neutral-40 (dark: e-d-border) | 1.5px control edges, 2px radio and checkbox edges, upcoming step markers, dashed connectors, the totals rule, today's ring |
| `outline-strong` | neutral-10 | Hovered control edges, the sign-in control edge, the plate chip |
| `outline-variant` | neutral-80 | Decorative connectors (step list, timeline), popover edges, the sheet grabber |
| `divider` | neutral-90 (dark: e-d-rule) | 1px rules and card edges. Never a control edge |
| `state-hover` | neutral-96 (proposed) | Hover fills on neutral controls, rows and cells |
| `inverse-surface` / `on-inverse-surface` | neutral-10 / neutral-100 | Skip link, the payment placeholder button, app badges |
| `scrim` | proposed (neutral-10 at about 40%) | Behind modals and sheets |
| `focus-ring` / `focus-ring-offset` | neutral-10 / neutral-100 (E0); see OQ-1 | The 3px ring and 2px gap |

### Channel (set by `data-channel`)

| Role | E source | Used for |
| --- | --- | --- |
| `channel-action` | channel-40 (dark: channel-80) | Primary fill, secondary edge and text, links, the current navigation bar, the current step, the app bar rule, the swatch, the hero eyebrow, selected states, the unread dot |
| `on-channel-action` | neutral-100 (dark: neutral-10) | Text and icons on `channel-action` |
| `channel-action-hover` / `channel-action-pressed` | proposed, about tones 35 and 30 (dark: about 85 and 90), see OQ-20 | Hover and pressed fills |
| `channel-container` | channel-95 | Hero, current network tile, desktop step halo, secondary hover, applied filter chips, selected rows, unread notifications, the selection bar, other-channel step rows, icon tiles |
| `channel-container-high` | channel-90 | Mobile step halo, "Life event" tag, secondary pressed, avatar, bottom-nav indicator |
| `channel-outline` | channel-80 | 1px edges on suggestion chips and outlined channel chips |
| `channel-accent` | channel-40, or `trade-line` for Trade (OQ-14) | 4px network-tile rules, swatches |

### City (shared primary, city indigo)

| Role | E source | Used for |
| --- | --- | --- |
| `city-action` | primary-40 | The network eyebrow and rule, shared hand-offs (OQ-4) |
| `on-city-action` | neutral-100 | Text on city fills |
| `city-container` / `city-container-high` / `city-outline` | primary-95 / 90 / 80 | Reserved for shared-network surfaces. Not yet used on E1–E4 |

### Semantic (each of error, success, warning and info)

| Role | E source | Used for |
| --- | --- | --- |
| `{tone}` | {tone}-40 (dark: about 80: e-d-error, e-d-success) | Text, icons, the 2px error border, callout accents, timeline dots, done step markers |
| `on-{tone}` | neutral-100 (dark: neutral-10) | Text on a `{tone}` fill: destructive buttons, done markers |
| `{tone}-container` | {tone}-95 | Status tags, callouts, the error summary, the announcement bar |
| `{tone}-outline-variant` | proposed | The 1px rule under the announcement bar |
| `error-hover` / `error-pressed` | proposed | Destructive button states |

### Elevation (shadows in OKLAB)

| Role | Used for |
| --- | --- |
| `shadow-2` | Popovers, menus, the utility bar |
| `shadow-3` | Modals and sheets |

## Appendix B · Type roles used in this document

Values are line height over font size, EN / AR, in px. Values marked (E) are measured in E. All others are proposed by stepping Arabic one size up with taller leading.

| Role | Weight | EN | AR | Seen in |
| --- | --- | --- | --- | --- |
| display-l | Bold, −0.02em in EN | 80/88 (E) | 84/100 | E1 hero `<h1>` |
| display-s | Bold | 45/52 (E0) | 50/68 (E0) | Specimen |
| headline-l | Bold | 32/40 (E0); 36/44 (E1 sections, E4 mobile `<h1>`); 40/48 (E1 life event) | 36/52 (E0) | OQ-12 |
| headline-m | Bold | 30/38 (E3 mobile `<h1>`) | 32/48 (E2 mobile `<h1>`) | Question and check pages on mobile |
| headline-s | Bold | 24/30 (E1 brand); 26/32 (E3 total amount) | 26/36 | Modal titles, header brand, totals |
| title-l | Bold | 20/28 (E1 card title) | 22/32 | Service and module card titles |
| title-m | Bold, or Medium for the eyebrow | 19/24 (E1 step list); 20/24 (E1 eyebrow, E3 section headings) | 20/28 to 22/30 | Section headings, accordion, attention card |
| title-s | Bold | 17/22 (E2–E4 app bar, network tiles) | 18/22 to 19/26 | App bar title, tiles, notification titles |
| body-l | Regular, or Medium for summary values | 18/30 (E0); 19/30 (E1 lede); 18/22 for single-line values | 20/34 (E0, E2) | Body text, field values |
| body-m | Regular, Medium or Bold | 16/20 (hints, entity text); 17/27 (E4 callout) | 18/26 to 18/30 (E2 hint and error) | Hints, errors, supporting text |
| body-s | Regular | 15/18 to 15/20 | 16/22 to 16/24 | Metadata, descriptors |
| label-l | Bold for buttons, Medium for navigation | 18/22 (E) | 20/24 (E) | Buttons, field labels, navigation |
| label-m | Medium | 16/20 to 17/22 (E) | 18/22 to 18/24 | Links in the app bar and footer, the change action, chips |
| label-s | Medium or Bold | 14/18 to 15/18 (E) | 16/20 to 16/22 | Status tags, channel chips, step state lines, the eyebrow |

**Floors:**

- Arabic is never below 16px (LANG-27).
- English UI text is never below 14px in v2. E's smallest is 14.
