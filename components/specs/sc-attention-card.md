# sc-attention-card · specification (v2)

Status: new in v2, built by C5 (Wave 2b). Visual rules: `docs/v2/component-language.md` B12 and B10, the Dubai Now signed-in reference ("Needs your attention"), plus the coordinator's brief: a thin topic-tint top strip. Code: `src/components/sc-attention-card`.

One thing that is due: a bill to pay, a document to upload, a registration about to expire.

## Encapsulation

**Shadow DOM** (architecture §3.1). Everything the user reads or presses stays light DOM through slots, including the action button and the status tag.

## Anatomy

| # | Part | Notes |
| --- | --- | --- |
| 1 | Card (`card`) | `surface-card`, 1px `outline-variant` edge, radius 12, padding 20. Not a link. Fills its grid cell, so the actions in a row line up. |
| 2 | Strip | With `tint`: the card's top edge is 4px (`size-strip`) in `on-tint-<name>`, curving with the 12px corners. Decorative (COL-13). Without a tint there is no strip. |
| 3 | Top row | Icon tile (`icon`, 40 × 40, radius 8, `tint-<name>` / `on-tint-<name>`, or `channel-subtle` / `channel-action`) at inline-start; the status tag (`slot="status"`) at inline-end. |
| 4 | Title (`title`) | A heading (`heading-level`, default 3), `title-medium`. 16 below the top row. |
| 5 | Fact | `slot="fact"`, `title-small` in `on-surface`, 4 below the title. |
| 6 | Meta | `slot="meta"`, `body-small` in `on-surface-variant`, 4 below. Amounts and references isolated with `sc-ltr`; Dubai W23's digits are tabular by default (TYP-08). |
| 7 | Action | `slot="action"`: one `sc-button variant="secondary" size="m"`, pushed to the bottom, at least 24 below the meta line. |

## Accessibility

- Status is never colour alone (COL-07): the strip and icon tile are topic tints, not urgency; the status tag says "Not paid", "Expires in 21 days" in words.
- One action, labelled with the verb and the item ("Pay AED 412.60").
- Put the cards in a `<ul>`, most urgent first, under a heading with a count.
- component-language B12 proposed no coloured edge; the coordinator's brief asked for the thin strip. It is kept decorative and redundant-free (it never encodes status).

## RTL and Arabic

Mirrors: icon tile on the right, status on the left. Amounts and references stay isolated.

## Motion

None (the action button has its own).

## Code

```html
<ul class="due">
  <li>
    <sc-attention-card tint="amber">
      <svg slot="icon" …></svg>
      <sc-status-tag slot="status" tone="warning">Not paid</sc-status-tag>
      Electricity and water bill
      <span slot="fact">Due tomorrow, 21 Oct 2026</span>
      <span slot="meta"><sc-ltr>AED 412.60</sc-ltr> · DEWA account <sc-ltr>2004 1187</sc-ltr></span>
      <sc-button slot="action" variant="secondary" size="m" href="/pay/dewa">Pay <sc-ltr>AED 412.60</sc-ltr></sc-button>
    </sc-attention-card>
  </li>
</ul>
```

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| heading-level | 2–6 | 3 | Heading level of the title |
| tint | `blue` \| `violet` \| `rose` \| `orange` \| `amber` \| `green` | – | Decorative strip and icon-tile tint |

Slots: default (title), `icon`, `status`, `fact`, `meta`, `action`. Parts: `card`, `icon`, `title`. No events.

## Budget

2.0 KiB gzip closure; leaf budget 4 KiB.

## Tests

`sc-attention-card.spec.tsx` (heading, slot order, tint, empty parts, fallbacks); `sc-attention-card.e2e.ts` (strip only when tinted, headings and link names, actions aligned across a row, Arabic mirroring, `describeAxe`); `sc-attention-card.visual.e2e.ts`.
