# sc-announcement-bar · specification (v2)

Status: new in v2, built by C1 (Wave 2b). Rules: component-language B1. Code: `src/components/sc-announcement-bar`.

A site-wide announcement above the header (after the skip link): planned maintenance, an outage, a change people need to know about.

## Encapsulation

**Shadow DOM.** Self-contained display with its own link and button.

## Anatomy

| # | Part | Notes |
| --- | --- | --- |
| 1 | Region | `<section aria-label="Announcement">`, full bleed, the tone's container fill, a 1px `outline-variant` rule beneath, content capped at `container-max` with the grid margin. At least 48 tall. Present at load: **not** a live region or alert (F-012). |
| 2 | Icon | 20px, the tone colour: `warning` (default), `info`, `error`. |
| 3 | Message | Default slot, body-medium Medium, `on-surface`. The words carry the severity. |
| 4 | Link | `link-href` + `link-text`, body-medium Bold, underlined 1px at 4px (5px Arabic), 2px on hover. Wraps to its own line on narrow screens. |
| 5 | Dismiss | With `dismissible`: a 44 × 44 `<button>` named "Dismiss announcement" with a 20px close icon, state-layer hover. |

## Behaviour

Dismissing fires `scDismiss` (cancelable, `detail.id`) then hides the bar. With `announcement-id` the dismissal is stored in `localStorage` (`sc-announcement-dismissed:<id>`) and the bar starts hidden on later pages; storage errors are ignored. Focus moves to the next focusable element after the bar (`src/utils/focus.ts`; looks into shadow roots of hosts with no focusable light children; falls back to `<main>`). Method `dismiss()`.

## Motion

From a pointer: fades out over `duration-exit`, then hidden; the height is never animated (MOT-11). From the keyboard: instant.

## Strings

`announcementLabel`, `announcementDismiss`.

## Budget

5.5 KiB override. Measured 5.3 KiB: own module 2.6 KiB, plus locale, icons and motion chunks.

## Tests

Spec: region and label (no live role), tones and fallback, dismiss button, event and hide, prevented dismissal, Arabic. e2e: tone colours against tokens, 44px dismiss, keyboard dismissal (instant, focus to next), remembered dismissal, pointer fade with opacity only, mirroring; `describeAxe` for all three tones. Visual: three tones EN/AR × light/dark.
