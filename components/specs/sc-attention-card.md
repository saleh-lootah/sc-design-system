# sc-attention-card · specification (v2)

Status: new in v2, built by C5 (Wave 2b). Visual rules: `docs/v2/component-language.md` B12 and B10, Paper board 09.08, the Dubai Now signed-in reference ("Needs your attention"). Code: `src/components/sc-attention-card`.

One thing that is due: a bill to pay, a document to upload, a registration about to expire.

## Encapsulation

**Shadow DOM** (architecture §3.1). Everything the user reads or presses stays light DOM through slots, including the action button and the status tag.

## Anatomy

| # | Part | Notes |
| --- | --- | --- |
| 1 | Card (`card`) | `surface-card`, 1px `outline-variant` edge, radius 12, padding 20. No coloured edge (board 09.08, B12). Not a link. Fills its grid cell, so the actions in a row line up. |
| 2 | Top row | Icon tile (`icon`, 40 × 40, radius 8) at inline-start, the status tag (`slot="status"`) at inline-end, top-aligned. The tile takes the status tag's tone: `{tone}-container` with `on-{tone}-container` for `error`, `warning`, `info` and `success` (B10); a `tint` replaces it with `tint-<name>` / `on-tint-<name>`; otherwise `channel-subtle` / `channel-action`. The tone is read from the slotted `sc-status-tag` (or one inside the slotted element) and followed when it changes. |
| 3 | Title (`title`) | A heading (`heading-level`, default 3), `title-medium`. 16 below the top row. |
| 4 | Fact | `slot="fact"`, `body-medium` in `on-surface`, 4 below the title (board 09.08). |
| 5 | Meta | `slot="meta"`, `body-small` in `on-surface-variant`, 4 below. Amounts and references isolated with `sc-ltr`; Dubai W23's digits are tabular by default (TYP-08). |
| 6 | Action | `slot="action"`: one `sc-button variant="secondary" size="m" full-width` (48 tall, the card's full width), pushed to the bottom, at least 24 below the meta line. |

## Accessibility

- Status is never colour alone (COL-07): the icon tile only repeats the status tag's tone, and the tag says "Not paid", "Expires in 21 days" in words.
- One action, labelled with the verb and the item ("Pay AED 412.60").
- Put the cards in a `<ul>`, most urgent first, under a heading with a count.
- The Wave 2b topic-tint top strip was removed to match board 09.08 and B12 ("no coloured edge").

## RTL and Arabic

Mirrors: icon tile on the right, status on the left. Amounts and references stay isolated.

## Motion

None (the action button has its own: visual feedback on press, activation on release, 2.5.2). The card adds no press handlers, so moving the pointer off the action before release cancels it.

## Code

```html
<ul class="due">
  <li>
    <sc-attention-card>
      <svg slot="icon" …></svg>
      <sc-status-tag slot="status" tone="warning">Not paid</sc-status-tag>
      Electricity and water bill
      <span slot="fact">Due tomorrow, 21 Oct 2026</span>
      <span slot="meta"><sc-ltr>AED 412.60</sc-ltr> · DEWA account <sc-ltr>2004 1187</sc-ltr></span>
      <sc-button slot="action" variant="secondary" size="m" full-width href="/pay/dewa">Pay <sc-ltr>AED 412.60</sc-ltr></sc-button>
    </sc-attention-card>
  </li>
</ul>
```

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| heading-level | 2–6 | 3 | Heading level of the title |
| tint | `blue` \| `violet` \| `rose` \| `orange` \| `amber` \| `green` | – | Decorative icon-tile tint, used instead of the status tone |

Slots: default (title), `icon`, `status`, `fact`, `meta`, `action`. Parts: `card`, `icon`, `title`. No events.

## Differences from board 09.08 (kept in code)

| Board | Code | Why |
| --- | --- | --- |
| `title` and `fact` as properties | Default slot (title) and `slot="fact"` | The board's API is proposed; slots keep rich text and isolation (`sc-ltr`) possible |
| No `tint` | Optional `tint` | Kept as an opt-in decorative alternative; without it the tile follows the status tone as the board shows |
| Title Bold `title-medium`, fact `body-medium` Medium | `title-medium` (Bold); `body-medium` (Regular) | W5: type roles only, the token's weight wins |

## Budget

2.0 KiB gzip closure; leaf budget 4 KiB.

## Tests

`sc-attention-card.spec.tsx` (heading, slot order, tint, empty parts, fallbacks); `sc-attention-card.e2e.ts` (no coloured edge, tile tint and status tone, tone changes, fact type and full-width action, headings and link names, actions aligned across a row, Arabic mirroring, press-and-drag-off on the action cancels (2.5.2), `describeAxe`); `sc-attention-card.visual.e2e.ts`.
