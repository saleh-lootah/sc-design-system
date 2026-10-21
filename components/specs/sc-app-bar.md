# sc-app-bar · specification (v2)

Status: rebuilt for v2 by C1 (Wave 2b) as the **transaction app bar** (component-language A4). The channel-site header is the new `sc-site-header`; see its spec for the naming decision. Code: `src/components/sc-app-bar`.

## Encapsulation

**Shadow DOM** (architecture §3.1): slotted back link and language switch; nothing referenced across.

## Anatomy

A 4px `channel-action` rule along the top; then a 60px bar on `surface` with fixed 96px start and end slots (`slot="start"`: `sc-back-link`; `slot="end"`: `sc-language-switch`) and the centred title: a 10 × 10 swatch (3px radius, `channel-action`) and the channel name (title-small Bold), from `slot="title"` or, by default, the current channel's official name in the page language; a 1px `outline-variant` rule beneath. Safe-area padding. No glass, no shadow (ELV-04). Arabic: back on the right, language on the left; the bar grows if the name wraps.

## API changes from v1

- `align="start"` (v1's desktop header) is **deprecated**: it still lays out title, default-slot content and end controls in a row, flat. Use `sc-site-header`.
- `shape="floating"` is **deprecated and ignored** (no glass capsule).
- `sticky`, `landmark`, the slots and parts are unchanged. New: the title defaults to the channel name.
- The `reduced-transparency` fallback is gone (nothing is translucent).

## Budget

4.5 KiB override. Measured 4.1 KiB: own module 1.8 KiB, plus locale and the channel names.

## Tests

Spec: banner, parts, swatch hidden, default title in Arabic, `landmark`, deprecated `align`. e2e: 60 + 4 + 1px, rules and colours against tokens, no shadow or blur, Bold title, centred title with 96px slots, mirroring, Arabic default title, sticky; `describeAxe`. Visual: EN/AR × light/dark at 390px.
