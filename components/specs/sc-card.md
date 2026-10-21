# sc-card · specification (v2)

Status: rebuilt for v2 by C5 (Wave 2b). Visual rules: `docs/v2/component-language.md` A22, read through the role table in `docs/v2/decisions.md`. Code: `src/components/sc-card`.

A surface that groups related content: a life event and its steps, one section of "Check your answers", a totals card. Cards are never links (CMP-06, DDS F-035): the link goes on a heading or button inside.

## Encapsulation

**Light DOM (Stencil `scoped`)**, architecture §3.1. The host is the surface and the content stays its direct children, so `aria-labelledby` on the host points at the author's own heading with an ordinary id. Styles sit in `@layer sc.components`; a service's unlayered CSS wins. `sc.css` gives `sc-card:not(:defined)` `display: block` before upgrade.

## Anatomy

| # | Part | Notes |
| --- | --- | --- |
| 1 | Surface (host, `.sc-card`) | Radius `radius-card` (12). 1px `outline-variant` edge. No shadow (ELV-01). Padding 24 (`l`) or 16 (`m`). |
| 2 | Content | The default slot. The first child's top margin and the last child's bottom margin are removed. |

## Variants

| Variant | Fill | Edge | Use |
| --- | --- | --- | --- |
| `outlined` (default) | `surface-card` | 1px `outline-variant` | Groups on a page or on a `surface-container` band |
| `filled` | `surface-container` (dark: `surface-container-high`, board 09.02) | none (transparent, repainted in forced colours) | A totals card (E3), a quiet group inside an outlined area |

## States

Not interactive. Forced colours: the edge becomes `CanvasText`, also on `filled`.

## Accessibility

- `landmark="section"` gives the host `role="region"`; `landmark="article"` gives `role="article"`. Either is named by the first `h1`–`h6` inside (an id is generated when missing, `sc-card-heading-<n>`) or by `label`. A heading added later is picked up.
- Without `landmark` the card has no role.

## RTL and Arabic

Symmetrical. Padding does not change in Arabic.

## Motion

None.

## Code

```html
<sc-card landmark="section">
  <h2>My tasks</h2>
  <p>Your vehicle registration expires in 15 days.</p>
</sc-card>
<sc-card variant="filled">…totals…</sc-card>
```

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| landmark | `"section"` \| `"article"` | – | Makes the card a named landmark |
| padding | `"m"` \| `"l"` | `"l"` | 16 or 24 |
| variant | `"outlined"` \| `"filled"` | `"outlined"` | New in v2 |
| label | string | – | Names the landmark when there is no heading |

No events. Slot: default. **v1 to v2:** the shadow root and `::part(surface)` are gone (style `.sc-card`); elevation 1 is replaced by the 1px edge; radius 20 → 12; `variant` is new.

## Budget

1.1 KiB gzip (custom-elements closure, excluding the runtime); leaf budget 4 KiB.

## Tests

`sc-card.spec.tsx` (light DOM, classes, defaults, landmarks, label); `sc-card.e2e.ts` (content stays light DOM, landmarks in the accessibility tree, radius/edge/padding/no shadow against the tokens, filled fill, dark mode (including the filled step-up), child margins, late heading, forced colours, `describeAxe`); `sc-card.visual.e2e.ts` (EN/AR × light/dark).
