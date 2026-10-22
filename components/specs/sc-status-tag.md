# sc-status-tag · specification (v2)

Status: rebuilt for v2 by C4 (Wave 2b). Visual rules: `docs/v2/component-language.md` A18 (direction E chips, artboard 38V-0), read through `docs/v2/decisions.md`; vocabulary from Standard 9.6. Code: `src/components/sc-status-tag`.

The status of an application, task or payment. Not interactive and not a live region.

## Encapsulation

**Shadow DOM** (chrome and display). Self-contained; the words are slotted.

## Anatomy

| # | Part | Notes |
| --- | --- | --- |
| 1 | Chip (`tag`) | Min height 32 (`size-chip`), radius 6 (`radius-chip`), padding 4 by 12, gap 6. A transparent 1px edge for forced colours. |
| 2 | Icon (`icon`) | 16px (`icon-s`), decorative. |
| 3 | Label | The slotted words, `label-small` (Medium 14/18 EN, Bold 16/22 AR, so the Arabic chip is about 34 tall). Wraps rather than truncates. |

## Tones

Tone-40 text and icon on a tone-95 container (E: "Text 40 on 95 container, all above 5.6:1").

| Tone | Fill | Text and icon | Icon |
| --- | --- | --- | --- |
| `neutral` (default) | `surface-container` (neutral-96) | `on-surface-variant` (neutral-40) | pending |
| `info` | `info-container` | `info` | hourglass |
| `success` | `success-container` | `success` | check circle |
| `warning` | `warning-container` | `warning` | clock (`schedule`) |
| `error` | `error-container` | `error` | error |
| `channel` | `channel-subtle` (channel-95) | `channel-action` | info |

Dark: tone 80 on tone 20. The `channel` tone follows decision W4 and the Paper board (sc-status-tag): `channel-action` on `channel-subtle`, rebinding with `data-channel`. It is a highlight ("Life event"), not a status; the semantic tones never change with the channel. decisions.md wins over library-conformance 9.6, which had deprecated it.

## RTL

The icon sits at inline-start. Icons never mirror.

## Changes from v1

- Shape: 6px chip with an icon replaces v1's pill with a dot (A11Y-06: a dot is only for channel attribution).
- New tone `info`. `tone="channel"` stays (W4), now `channel-action` on `channel-subtle` with an info icon.
- Part `dot` is replaced by part `icon`.

## Before upgrade (v2-lib-gaps)

`sc.css` draws the 32px chip on the host while it is undefined: padding, room for the 16px icon, the transparent 1px edge, the tone fill and text, label-small. The host is now `inline-flex` (it was `inline-block`, whose line strut made the chip 34px tall in Arabic), so the upgraded tag is the same 32px in both languages and nothing shifts.

## Budget

Leaf, 4 KiB. Measured **2.2 KiB** gzip; CSS 0.4 KiB.

## Tests

Spec (tones including `channel`, icons, fallbacks), e2e (32px / 6px / 16px icon, every tone's colours against the tokens, semantic tones independent of the channel and the channel tone following it, accessible text, label-small in EN and AR, icon at the start in Arabic, forced colours), `describeAxe`, visual (all tones EN/AR × light/dark).
