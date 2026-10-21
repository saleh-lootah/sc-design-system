# sc-channel-switcher · specification (v2)

Status: new in v2, built by C1 (Wave 2b). Rules: component-language B2a, Standard CHR-03, CHR-04 and FND-26. Code: `src/components/sc-channel-switcher`. Used in `sc-site-header`'s `slot="switcher"`.

The channel's logo and the channel switcher: a real button that discloses a labelled list of all seven channels.

## Encapsulation

**Light DOM (Stencil `scoped`).** Every item carries its own `data-channel` so its swatch is that channel's `channel-action` (FND-26). The channel roles are defined in the document stylesheet under `[data-channel]`, which does not reach into shadow roots, so the items must live in the document. Styles are in `@layer sc.components`. Per-instance IDs (`sc-channel-switcher-<n>`).

## Anatomy

| # | Part | Notes |
| --- | --- | --- |
| 1 | Trigger | `<button type="button" aria-expanded aria-controls>`. 48px, padding 16 at the start and 12 at the end (8 compact), 4px corners, 1.5px `outline` edge (`outline-strong` on hover and while open). Accessible name "Choose a channel: Dubai Now" (a visually hidden prefix). |
| 2 | Logo | 24px. The default slot takes the channel's own logo; without one, the current channel's swatch: 10px, radius 3, `channel-action` (B2a). |
| 3 | Name | label-large Bold. Visually hidden below 1024px (CHR-04); it stays in the name. |
| 4 | Chevron | 20px `expand-more`, rotates while open. |
| 5 | Panel | Non-modal, 360 wide (never wider than the viewport minus 32), 12px corners, 1px `outline-variant` edge, `elevation-2`, padding 8; aligned to the trigger's inline-end edge, 8 below it. |
| 6 | Caption | "Choose a channel", label-small, `on-surface-variant`, padded 8 by 12; labels the list. |
| 7 | Items | Seven, in the Standard 3.1 order, each `<li data-channel>` with a link: 12px swatch (radius 3), name (title-small Bold) directly over the descriptor (body-small, `on-surface-variant`), at least 56 tall, padded 10 by 12, 8px corners. Current: `surface-container` fill, a check, `aria-current="true"`. A channel with no link is listed as text. |

## Behaviour

Disclosure, not an ARIA menu (shared with `sc-account-menu`, `src/utils/disclosure.ts`): the button toggles; Tab moves through the links; Escape closes and returns focus to the button (and is consumed, so the mobile menu around it stays open); a press outside closes; focus leaving closes. Methods `open()`, `close()`.

Links: `links` (object or JSON) maps each channel to its home URL; `{lang}` becomes `en` or `ar`, so each link leads to that channel's home in the current language (CHR-03), with `hreflang`.

## Motion

From a pointer the panel grows from the trigger's block-end, inline-end corner: opacity and `scale(--sc-scale-enter)` over `duration-base`, `easing-enter`; it fades out over `duration-exit`. From the keyboard both are instant. Reduced motion: opacity only.

## Strings

Own: `src/i18n/components/sc-channel-switcher.ts` (`switcherPrefix`, `switcherCaption`). Channel names: the official ones in `common.ts` (`channelNow` …); descriptors in `channels.ts`, merged by `channelStrings()`.

## Budget

8 KiB override. Measured closure 7.7 KiB gzip: own module 3.0 KiB (CSS 1.4 KiB), plus shared chunks (locale 0.9, channel strings 1.0, icons 1.1, disclosure and motion 1.2, channel helpers 0.4).

## Tests

Spec: name, panel, seven items in order with `data-channel`, links in the page language, current item, inherited channel, missing links as text, slotted logo, methods, Arabic. e2e: keyboard open (instant), Tab through, Escape and focus return, focus leaving, pointer animation and outside press, seven distinct swatches matching each channel's token, 48px trigger, the 10px swatch mark and trigger padding, panel alignment in both directions, compact shrink keeping the name, axe open; `describeAxe`. Visual: open panel EN/AR × light/dark.
