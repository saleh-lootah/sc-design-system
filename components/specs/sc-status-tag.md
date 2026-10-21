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

Dark: tone 80 on tone 20. **No channel tone** (library-conformance 9.6; status is never in a channel's colour). Decision W4 describes channel-coloured tags (`channel-subtle` fill, `channel-action` text); that is for non-status tags and is not a tone of this component (see the report).

## RTL

The icon sits at inline-start. Icons never mirror.

## Changes from v1

- Shape: 6px chip with an icon replaces v1's pill with a dot (A11Y-06: a dot is only for channel attribution).
- New tone `info`. **`tone="channel"` is removed**: it now renders as `neutral` (it was deprecated in v1).
- Part `dot` is replaced by part `icon`.

## Budget

Leaf, 4 KiB. Measured **2.2 KiB** gzip; CSS 0.4 KiB.

## Tests

Spec (tones, icons, fallbacks including `channel`), e2e (32px / 6px / 16px icon, every tone's colours against the tokens, channel-independence, accessible text, label-small in EN and AR, icon at the start in Arabic, forced colours), `describeAxe`, visual (all tones EN/AR × light/dark).
