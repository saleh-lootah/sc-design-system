# sc-channel-chip · specification (v2)

Status: rebuilt for v2 by C2 (Wave 2b). Visual rules: `docs/v2/component-language.md` A19 and decision Q-chips, read through the role table (component-language's "channel-container" is the token `channel-subtle`). Code: `src/components/sc-channel-chip`.

Points to another channel that also offers the service: "Also on Dubai Transport". The one component allowed to name a channel; other channels' colours appear only as attribution like this.

## Encapsulation

**Shadow DOM** with `delegatesFocus` (architecture §3.1). The chip sets `data-channel` on its host, which rebinds the channel roles for its subtree; custom properties inherit into the shadow root. Parts: `chip`, `dot`, `icon`.

## Anatomy

| # | Part | Notes |
| --- | --- | --- |
| 1 | Chip | `<span>`, or `<a>` with `href`. Min height 32 (`size-chip`, Q-chips; board 8ZA-0 draws 30), padding-inline 10 from the edge (subtle: 9 plus its transparent 1px edge; outlined: 10 inside its 1px edge, as the board), gap 8 (6 outlined), radius 6 (`radius-chip`) |
| 2 | Dot | 8px circle in the channel's `channel-action` |
| 3 | Label | Default slot, defaults to "Also on {channel}" / "متوفر أيضًا في {channel}" |
| 4 | Chevron | Links only, 16px, 8 after the label and 6 from the end edge, mirrored in RTL |
| 5 | Hit area | Links only: `::after` grows the target to 44px without moving the layout |

## Variants

| Variant | Fill | Edge | Label | Use |
| --- | --- | --- | --- | --- |
| `subtle` (default) | `channel-subtle` | none (transparent 1px for forced colours) | `label-small` Medium in `channel-action` | white cards |
| `outlined` | `surface` | 1px `channel-outline` | `label-small` Bold in `channel-action` | on a channel tint |

`label-small`: 14/18 EN, 16/22 Bold AR. Hover (links, fine pointers): the label underlines 1px at 3px (5px in Arabic). Focus: U1 ring. Forced colours: `CanvasText` / `LinkText` edge, `CanvasText` dot. Never dismissable.

## Motion

None (A19). v1's press scale and hover tint are dropped.

## Strings

`src/i18n/components/sc-channel-chip.ts`: `channelChipAlsoOn` and the seven channel names. v1 read them from `common.ts`; v2 components import only their own file.

## API changes from v1

- New `variant` prop: `subtle` (default, as v1) or `outlined`.
- Shape: 6px corners, 32px tall (v1: a 28px pill).
- Colours: `channel-subtle` fill and `channel-action` text (v1: `--sc-channel-subtle` and `--sc-channel-ink`, removed).
- No hover fill and no press scale.

## Budget

Custom-elements closure 3,966 B gzip (4 KiB budget), its own CSS 678 B.

## Tests

`sc-channel-chip.spec.tsx` (seven channels and names, link, `data-channel` updates, Arabic and label override, variants), `sc-channel-chip.e2e.ts` (each channel's colours whatever the page channel; size, radius, type and the named channel's roles; outlined roles; theme; link focus, ring, Enter and 44px hit area; not focusable without href; Arabic and mirrored chevron; `describeAxe` EN/AR × light/dark), `sc-channel-chip.visual.e2e.ts`.
