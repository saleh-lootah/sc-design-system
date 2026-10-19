# sc-table · specification

Status: designed in Paper (page 09 · Components · Content and layout). Not yet built in Stencil.

A table compares rows of the same kind of thing across a few attributes: a person's fines, their payments, the status of their permit applications, a list of court hearings. Each row is one thing; each column is one attribute.

Use `sc-summary-list` for the details of one thing. Never use a table for layout.

## Anatomy

| # | Part | Notes |
| --- | --- | --- |
| 1 | Caption | `title-s` in `ink-strong`. Required, so the table has an accessible name. It can be visually hidden when a heading straight above says the same thing (`caption-hidden`). |
| 2 | Header row | `label-s` in `muted`, medium weight, single line. There is no fill. A hairline `rule` sits under it. A sortable header is a button with a sort glyph at inline-end. |
| 3 | Body row | Minimum height 56 (compact: 44). Padding-block `space-16` (compact: `space-12`); padding-inline `space-16`. The first and last cells add `space-8` toward the card edge. A hairline `rule` sits between rows. There is no zebra striping and there are no vertical rules. |
| 4 | Row header | The first cell is `th scope="row"`, `title-s` in `ink-strong`. It usually carries the row's link ("F-2026-118204" opens that fine). |
| 5 | Totals row (optional) | `tfoot` row. `title-s`, with a 1px `control` rule above it. |
| 6 | Footer (optional) | Count plus pagination, for example "Showing 1–20 of 1,284 fines". Previous and Next are small secondary buttons. |
| 7 | Container | `surface` card, `radius-card` (20), elevation 1. `overflow: clip`, so the rules meet the rounded corners cleanly. |

## Column types

Each type sets the column's alignment, wrapping and figures. A column's header cell takes the same alignment as its cells.

| Type | Alignment | Wrapping | Figures | Example (EN · AR) |
| --- | --- | --- | --- | --- |
| text | start | Wraps to at most 3 lines. Never truncated. | proportional | Speeding: 21 to 30 km/h over the limit · تجاوز السرعة المحددة بـ 21 إلى 30 كم/س |
| reference | start | nowrap | tabular, in an LTR isolate | F-2026-118204 (identical in AR) |
| date | start | nowrap | tabular | 14 Mar 2026 · 14 مارس 2026 |
| amount | end | nowrap; the column grows instead | tabular | AED 1,250.00 · 1,250.00 درهم |
| status | start | nowrap; uses `sc-status-tag` | – | Unpaid · غير مدفوعة |
| action | end | nowrap | – | View · عرض (with visually hidden context: "View fine F-2026-118204") |

Rules:
- Digits are Latin in both languages: amounts, dates, references and counts.
- Amounts are never truncated or abbreviated.
- A missing optional value shows "None" in `muted`. Never show an empty cell or a bare dash.

## Behaviours

- **Sorting:** optional, per column (`th[data-sort]`). Click or Enter on the header button cycles through ascending and descending. Only one column is sorted at a time.
  - The sorted header is `ink-strong` with an arrow glyph. Unsorted sortable headers show a faint double chevron at 40% opacity.
  - The component only emits `scSort`; the service sorts the data (usually on the server), so large datasets work.
- **Selection:** optional (`selectable`). This is for "select fines to pay".
  - A checkbox column is added at inline-start. The header checkbox selects every row on the page and shows indeterminate when only some are selected.
  - A selected row gets the `fill-selected` background.
  - A selection bar appears below the table: "2 fines selected · AED 1,700.00" plus a primary action, "Pay 2 fines".
- **Row hover:** `fill-quiet` background. It applies only under `@media (hover: hover) and (pointer: fine)`.
- **Whole rows are not clickable.** The link lives in the row header, so the target is explicit and keyboard users reach it with one Tab.
- **Density:** `default` is for the public. `compact` (row 44, `body-s`) is for staff tools with long lists.

## Responsive

The table is used as-is from `--breakpoint-medium` (600px) up. Below 600px, the `responsive` property chooses one of two behaviours:

- **`stack`** (default; best for up to 6 columns). Each row becomes a card on `surface` with `radius-card`, spaced `space-12` apart.
  - The row header becomes the card title (`title-s`).
  - The status tag sits at top inline-end.
  - The other cells become label and value pairs (`label-s` muted / `body-s` ink), as in a summary list.
  - The amount is the last line, end-aligned, in `title-m`.
  - The action becomes a full-width link row at the bottom.
- **`scroll`** (for genuinely wide comparisons).
  - The table keeps its layout inside a horizontal scroll region with `role="region"`, `tabindex="0"` and `aria-labelledby` pointing at the caption.
  - The row header column is sticky at inline-start.
  - An 8px shadow edge (`doc-shadow-10` fading to transparent) shows on whichever side has more content. In RTL it starts on the left.
  - `overscroll-behavior-x: contain`.

## States

| State | What shows |
| --- | --- |
| Loading | 5 skeleton rows that match the real column widths: text bars at 60–80%, amount bars at 40% end-aligned, a pill for status. `fill-quiet` bars at `radius-xs`. Opacity pulses 0.55 → 1 over 1.2s ease-in-out alternate. Under reduced motion the bars are static at 0.75. The header row stays real. |
| Empty | The header is hidden. A body message spans every column: a `title-s` sentence ("You have no fines") plus an optional `body-s` next step. It never says "No data". |
| No results | After a filter: "No fines from 1 to 31 March 2026" plus a "Clear dates" link. |
| Error | `sc-callout tone="error"` in place of the body: "We could not load your fines. Try again in a few minutes.", with a secondary "Try again" button. Never show a raw error. |
| One row | Counts use plural rules: "1 fine", not "1 fines". The footer shows "Showing 1 fine", without "1–1 of 1". |

## Worst-case data (break-ui)

The board shows a "Demo / Worst case" pair. The worst-case fixture mixes these values across rows, as real data does:

- **Long text:** "Exceeding the maximum speed limit by more than 60 km/h on Sheikh Mohammed bin Zayed Road" wraps to 2 lines, and the row grows. The Arabic equivalent wraps in the same way.
- **Huge amount:** "AED 1,234,567.50" stays nowrap; the amount column widens and the text column gives way.
- **Long status:** "Waiting for court decision" stays nowrap; the tag never wraps.
- **Minimal row:** reference "F-1", amount "AED 0.50".
- **Missing optional value:** "None" in muted.
- **1,284 rows:** paginated at 20; footer "Showing 1–20 of 1,284 fines".
- **Mixed bidi:** an Arabic description with a Latin plate number "Dubai A 12345" inside, isolated.

## Accessibility

- Native `<table>` semantics, so screen readers announce rows, columns and headers. The component is scoped (light DOM): it styles a slotted native table and never rebuilds one out of divs.
- `<caption>` is required. Headers use `th scope="col"`; the first cell of each row is `th scope="row"`.
- Sortable headers contain a `<button>`, and the `th` carries `aria-sort`. After a sort, a polite live region announces: "Sorted by Amount, highest first".
- Keyboard: Tab reaches the sort buttons, links, checkboxes and the scroll region, in reading order. There is no arrow-key grid navigation; this is a static table, not a data grid.
- The header checkbox is labelled "Select all fines on this page". Each row checkbox is labelled with its row header: "Select fine F-2026-118204".
- Contrast: header `muted` on `surface` is 6.1:1, body `ink` is 16.2:1, and status tags reuse the existing contrast-checked tones.
- Forced colours: rules become `CanvasText` at 1px, and the selected row gets `Highlight` with an outline.

## RTL and Arabic

The table mirrors entirely through logical properties:
- The first column is on the right; start-aligned cells align right, and amount and action cells align left.
- The sort glyph sits after the label (to its left).
- The checkbox column is on the right.
- The sticky column and the scroll start position are on the right.
- Previous is on the right, with a chevron pointing right.

Arabic type uses the Arabic scale: `label-s` AR 16/21, `body-s` AR 18/28, `title-s` AR 19/25. Rows grow with that leading; nothing is fixed-height.

Digits stay Latin. References and plates are wrapped in `sc-ltr`.

## Motion

Applies the emil-design-eng rules.

- **Sorting:** rows reorder instantly. Sorting is repeated and often keyboard-triggered, so it is not animated.
- **Row hover:** `background-color` over 120ms (`duration.fast`), ease.
- **Selection bar:** enters with opacity 0 → 1 and translateY 8px → 0 over 200ms, using `easing.enter`. It exits with opacity only over 120ms.
- **Skeleton:** opacity pulse only.
- **Reduced motion:** no translate; opacity changes stay.

## Code

```html
<sc-table caption="Your fines" responsive="stack" selectable>
  <table>
    <thead>
      <tr>
        <th scope="col">Reference</th>
        <th scope="col" data-type="date" data-sort aria-sort="descending">Date</th>
        <th scope="col">Offence</th>
        <th scope="col" data-type="status">Status</th>
        <th scope="col" data-type="amount" data-sort>Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr data-id="F-2026-118204">
        <th scope="row"><a href="/fines/F-2026-118204">F-2026-118204</a></th>
        <td>14 Mar 2026</td>
        <td>Speeding: 21 to 30 km/h over the limit</td>
        <td><sc-status-tag tone="warning">Unpaid</sc-status-tag></td>
        <td>AED 600.00</td>
      </tr>
    </tbody>
  </table>
  <div slot="footer">…</div>
</sc-table>
```

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| caption | string | – | Accessible name; rendered as the native `<caption>` |
| caption-hidden | boolean | false | Hides the caption visually; it is still announced |
| density | "default" \| "compact" | "default" | Row height 56 or 44 |
| responsive | "stack" \| "scroll" | "stack" | Behaviour below 600px |
| selectable | boolean | false | Adds the checkbox column and the selection bar |
| selection-label | string | – | Selection bar text template, e.g. "{count} fines selected" |
| loading | boolean | false | Shows the skeleton rows |
| strings | JSON | – | Overrides the built-in EN/AR strings |

| Event | Detail |
| --- | --- |
| `scSort` | `{ column, direction: "ascending" \| "descending" }` |
| `scSelectionChange` | `{ ids: string[] }` |

Slots: default (the native table), `footer`, `empty`, `actions` (selection bar actions).
