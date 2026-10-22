# sc-service-card · specification (v2)

Status: rebuilt for v2 by C5 (Wave 2b). Visual rules: `docs/v2/component-language.md` A23 and B10, direction E E1 ("Most used services"), read through the role table in `decisions.md`. Code: `src/components/sc-service-card`.

A link to a service: its title, the owning entity, an optional icon and an optional channel chip.

## Encapsulation

**Shadow DOM** with `delegatesFocus` (architecture §3.1, chrome and display): nothing outside reaches inside. Parts are exposed for each structural element.

## Anatomy

| # | Part | Notes |
| --- | --- | --- |
| 1 | Card (`card`) | `surface-card`, 1px `outline-variant` edge, radius 12, padding 24, no shadow. `min-block-size` 184 (E1 draws a fixed 184; content can grow it, especially in Arabic). |
| 2 | Icon tile (`icon`, optional) | B10: 40 × 40, radius 8, at inline-start with a 16 gap, top-aligned with the title. Fill `channel-subtle`, icon `channel-action`; with `tint`, `tint-<name>` and `on-tint-<name>`. Decorative (`aria-hidden`). |
| 3 | Title (`title`, `link`) | A heading (`heading-level`, default 3) containing the only link. `title-large`. The link's hit area grows to 44 × 44 with a transparent `::after`; it is never stretched over the card. |
| 4 | Entity (`entity`) | `body-medium` in `on-surface-variant`; the link's `aria-describedby`. |
| 5 | Arrow (`arrow`) | `arrow-forward`, 24px, `channel-action`, in a fixed slot at the top inline-end, centred on the title's first line. Decorative (`aria-hidden`), not a second link. Mirrors in Arabic. |
| 6 | Chip (optional) | Pinned to the bottom (24 or more below the text), so chips line up across a row. |

## States

| State | Rule |
| --- | --- |
| Default | As above |
| Hover over the card (fine pointers) | Edge `outline`; the title underlines 1px at 4px (5px Arabic). Colour over 120ms |
| Focus (the title link) | The U1 ring around the title, not the card (CMP-06) |
| Pressed | Title in `channel-action`. No scale (cards do not scale, §1.6) |
| Forced colours | Edge `CanvasText`, link `LinkText`, arrow `CanvasText`, icon tile outlined |

## Accessibility

One tab stop per card (plus a chip that is a link). The link name is the title only; the entity is its description. Heading navigation lists every service. v1 had no arrow because "nothing may look like a link"; v2 follows E1's decorative arrow, which is hidden from assistive technology and not a target.

## RTL and Arabic

The icon tile is at the right and the arrow at the left, pointing left. Titles are `title-large` Arabic (24/34); two-line titles are normal and the card grows.

## Motion

Edge colour over `duration-fast` with `easing-hover`, fine pointers only. No scale; the pressed title colour is the only press feedback. Visual feedback on press, activation on release (2.5.2, MOT-09): the press state is CSS `:active` only, nothing acts on `pointerdown`, `mousedown` or `touchstart`, and the action is the native `click` on release, so moving the pointer off before release cancels it.

## Code

```html
<sc-service-card href="/services/pay-dewa" entity="Dubai Electricity and Water Authority" tint="amber">
  <svg slot="icon" viewBox="0 0 24 24">…</svg>
  Pay a DEWA bill
  <sc-channel-chip slot="chip" channel="transport"></sc-channel-chip>
</sc-service-card>
```

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| href | string | – | Required |
| heading-level | 2–6 | 3 | Heading level of the title |
| entity | string | – | The owning entity, in full |
| tint | `blue` \| `violet` \| `rose` \| `orange` \| `amber` \| `green` | – | Decorative topic tint of the icon tile (new) |

Slots: default (title), `entity`, `icon` (new), `chip`. Parts: `card`, `icon` (new), `title`, `link`, `entity`, `arrow` (new). No events. **v1 to v2:** no breaking changes; the card is flat with a 1px edge (was elevation 1), radius 12, padding 24, min height 184, and the press scale is gone.

## Budget

3.2 KiB gzip closure (including the shared icon chunk); leaf budget 4 KiB.

## Tests

`sc-service-card.spec.tsx` (heading and link, decorative arrow, single link, heading levels, empty parts, icon tile and tint); `sc-service-card.e2e.ts` (tab order and Enter, ring around the title, title-only target, 44px target, names and description, box metrics, arrow position and mirroring, tint roles, fine-pointer-only hover, press-and-drag-off cancels (2.5.2), forced colours, `describeAxe`); `sc-service-card.visual.e2e.ts`.
