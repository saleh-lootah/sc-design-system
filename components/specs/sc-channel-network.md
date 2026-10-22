# sc-channel-network · specification (v2)

Status: new in v2, built by C1 (Wave 2b). Rules: component-language B21, Standard CHR-08, FND-25 and FND-26. Name approved in Q-names. Code: `src/components/sc-channel-network`.

## Encapsulation

**Light DOM (Stencil `scoped`)**: each tile sets its own `data-channel`, which only the document's channel rules can rebind (FND-26). Styles in `@layer sc.components`; the host is a container (`container-type: inline-size`) so the tile grid responds to its own width (LAY-02).

## Anatomy

| # | Part | Notes |
| --- | --- | --- |
| 1 | Navigation | `<nav aria-label="Government of Dubai channels">`. |
| 2 | Eyebrow | A 24 × 3 rule, gap 12, 24 above the tiles, and "One network · seven channels" (`eyebrow` overrides it) in `primary` (city indigo), label-small Bold; upper case and tracked 0.08em in English only. The number is a word in both languages. |
| 3 | Tiles | Seven `<li data-channel>`, 12 apart, equal widths: 7 per row from 960px of strip width, 4 from 560, 2 below. Each tile: 8px corners, padding 20/16, gap 6, `surface-container`, a 4px top rule in its own channel's `channel-action`, painted as a background band so the 8px corners clip it square (board FVO-0) rather than tapering it as a rounded border would; content 20 below it; name (title-small Bold) and descriptor (body-small, `on-surface-variant`). Hover underlines the name. |
| 4 | Current | Plain text, not a link (it would lead to this site), `aria-current="true"`, `channel-subtle` fill, name in `channel-action`, "You are here" in Medium. The current channel is `channel`, else the closest `data-channel`, else Dubai Now. |

## No current channel

`channel="none"` is for a page that belongs to no channel, such as the shared network's own pages or the design system's documentation. No tile is current: none says "You are here", none has `aria-current` or the `channel-subtle` fill, and every tile is a link when `links` gives one. Without the attribute nothing changes for channel pages.

Dubai Trade's rule uses `channel-action` like the others; E drew a lighter line (OQ-14, open).

## Strings

`networkLabel`, `networkEyebrow`, `networkHere`; names from `common.ts`, descriptors from `channels.ts`.

## Budget

4.5 KiB override. Measured 4.3 KiB: own module 1.7 KiB, plus locale and channel strings.

## Tests

Spec: nav, eyebrow and its override, seven tiles in order with `data-channel`, links in the page language, current tile as text, no current tile with `channel="none"` (also inside a `data-channel`), Dubai Now by default, inherited channel, Arabic. e2e: 4px rule bands in seven distinct channel colours matching tokens, current fill and name colour, city indigo eyebrow, English-only case and tracking, 7/2 columns and RTL order, no current tile and one fill with `channel="none"`; `describeAxe`, also with `channel="none"`. Visual: EN/AR × light/dark at 1440.
