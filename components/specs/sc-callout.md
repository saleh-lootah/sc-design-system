# sc-callout · specification (v2)

Status: rebuilt for v2 by C4 (Wave 2b). Visual rules: `docs/v2/component-language.md` A17, read through the role table in `docs/v2/decisions.md`. Code: `src/components/sc-callout`.

An important message in the content: something the user must know before they act, or the outcome of what they just did. Not for field errors (`sc-error-summary`) or the status of an item (`sc-status-tag`).

## Encapsulation

**Shadow DOM** (architecture §3.1, chrome and display). Nothing outside references inside it; slotted links and `<sc-ltr>` stay in light DOM and in the tab order.

## Anatomy

| # | Part | Notes |
| --- | --- | --- |
| 1 | Container (`container`) | Radius `radius-field` (8). Padding 16. Gap 12. Fill `{tone}-container`. A transparent 1px edge that forced colours repaint. |
| 2 | Accent | `border-inline-start` of `--sc-size-border-accent` (3px) in `{tone}`. component-language.md proposed 4px; the token and FND-16 say 3px. |
| 3 | Icon (`icon`) | 24px (`icon-l`; E's 22 snapped, ICN-03) in `{tone}`: info `info`, success `check-circle`, warning `warning`, error `alert-circle`. Decorative. |
| 4 | Heading (`heading`) | Optional. `title-small`, Bold, `on-surface`. A `<p>` unless `heading-level` (2–6). 4 above the content. |
| 5 | Content (`content`) | `body-medium`, `on-surface`. Slotted links: `channel-action`, underlined 1px at 4px. |
| 6 | Tone word | Visually hidden "Information:", "Success:", "Warning:", "Error:" / "معلومة:", "تم بنجاح:", "تنبيه:", "خطأ:", read first. Overridable with `tone-label`. |

## Tones

| Tone | Fill | Accent and icon | Text |
| --- | --- | --- | --- |
| `info` (default) | `info-container` | `info` | `on-surface` |
| `success` | `success-container` | `success` | `on-surface` |
| `warning` | `warning-container` | `warning` | `on-surface` |
| `error` | `error-container` | `error` | `on-surface` |

Dark: containers are tone 20, accents and icons tone 80, text white.

## Type

| Part | Role | English | Arabic |
| --- | --- | --- | --- |
| Heading | `title-small`, Bold | 17/22 | 19/28 |
| Content | `body-medium` | 16/24 | 18/28 |

## States, keyboard, motion

Not interactive itself; slotted links follow the page (U1 ring from `sc.css`). No motion. A callout inserted after load goes inside a `role="status"` wrapper (service-owned).

## RTL and Arabic

The accent and icon sit at inline-start, so on the right in Arabic. Icons do not mirror.

## Strings

`src/i18n/components/sc-callout.ts` (unchanged keys), read through `i18n/controller`.

## Changes from v1

- Look: tone-95 containers with a start accent bar replace v1's tinted pill-radius box; `info` is now blue (`info-container`) rather than a neutral fill.
- API, parts and slots unchanged.

## Budget

Leaf, 4 KiB. Measured: **4.0 KiB** gzip (custom-elements closure, including the shared icon set and locale controller); component CSS 0.6 KiB.

## Tests

- `sc-callout.spec.tsx`: tones, icons, fallback, heading levels, tone word and Arabic.
- `sc-callout.e2e.ts`: tone fills, container/accent/radius against the tokens (and the accent moving right in Arabic), tone words, tab order of slotted links, type in EN and AR, forced colours, every channel; `describeAxe` EN/AR × light/dark.
- `sc-callout.visual.e2e.ts`: all tones, EN/AR × light/dark.
