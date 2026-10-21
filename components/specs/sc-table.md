# sc-table · specification (v2)

Status: designed in Paper (v1 page 09) and built in Stencil (`src/components/sc-table`); rebuilt for v2 by C5 (Wave 2b) to `docs/v2/component-language.md` A28, read through the role table in `docs/v2/decisions.md`. Behaviour, accessibility and API are unchanged from v1.

A table compares rows of the same kind of thing across a few attributes: a person's fines, their payments, the status of their permit applications, a list of court hearings. Each row is one thing; each column is one attribute.

Use `sc-summary-list` for the details of one thing. Never use a table for layout.

## Encapsulation

**Light DOM (Stencil `scoped`)**, architecture §3.1: a `<table>` must directly contain its parts, so the component styles and enhances the author's native table and never rebuilds one. All styles sit in `@layer sc.components`, so a service's unlayered CSS wins without `!important`. Strings come from `src/i18n/components/sc-table.ts` through the v2 `LocaleController`; per-table overrides use `strings-override.ts`, which carries no dictionary (`overrides.ts` remains only as the v1 wrapper `sc-date-range` still imports). The named slots (`footer`, `empty`, `error`, `actions`) are kept from v1 for API compatibility, an exception to the "default slot only" rule for scoped components; they are tested.

## Anatomy

| # | Part | Notes |
| --- | --- | --- |
| 1 | Caption | `title-small` in `on-surface`. Required, so the table has an accessible name. It can be visually hidden when a heading straight above says the same thing (`caption-hidden`). |
| 2 | Header row | `label-medium` in `on-surface` (Bold in Arabic), single line, 48 tall (14 block padding), on a `surface-container` fill. A 1px `outline-variant` rule sits under it. A sortable header is a button with a sort glyph at inline-end. |
| 3 | Body row | Minimum height 56 (compact: 44). Padding-block 14 (board 09.05; compact: `space-12`); padding-inline `space-16`. The first and last cells add `space-8` toward the card edge. A 1px `outline-variant` rule sits between rows. There is no zebra striping and there are no vertical rules. |
| 4 | Row header | The first cell is `th scope="row"`, `title-small` in `on-surface`. It usually carries the row's link, in `channel-action`, underlined ("F-2026-118204" opens that fine). |
| 5 | Totals row (optional) | `tfoot` row. `title-small`, with a 1px `outline` rule above it (E3). |
| 6 | Footer (optional) | 12 block padding, a 1px `outline-variant` rule above, `body-medium` in `on-surface-variant`. Count plus pagination, for example "Showing 1–20 of 1,284 fines". Previous and Next are small secondary buttons. |
| 7 | Container | `surface-card`, `radius-card` (12), a 1px `outline-variant` edge, no shadow. `overflow: clip`, so the rules meet the rounded corners cleanly. |

## Column types

Each type sets the column's alignment, wrapping and figures. A column's header cell takes the same alignment as its cells.

| Type | Alignment | Wrapping | Figures | Example (EN · AR) |
| --- | --- | --- | --- | --- |
| text | start | Wraps to at most 3 lines. Never truncated. | proportional | Speeding: 21 to 30 km/h over the limit · تجاوز السرعة المحددة بـ 21 إلى 30 كم/س |
| reference | start | nowrap | tabular, in an LTR isolate | F-2026-118204 (identical in AR) |
| date | start | nowrap | tabular | 14 Mar 2026 · 14 مارس 2026 |
| amount | end | nowrap; the column grows instead | tabular | AED 1,250.00 · 1,250.00 درهم |
| status | start | nowrap; uses `sc-status-tag` | – | Not paid · بانتظار الدفع |
| action | end | nowrap | – | View · عرض (with visually hidden context: "View fine F-2026-118204") |

Rules:
- Digits are Latin in both languages: amounts, dates, references and counts.
- In Arabic, write a numeric range with a word, not a dash: "عرض 1 إلى 20 من 1,284 مخالفة". The dash is direction-neutral, so in right-to-left text "1–20" displays as "20–1".
- Amounts are never truncated or abbreviated.
- A missing optional value shows "None" in `on-surface-variant`. Never show an empty cell or a bare dash.

## Behaviours

- **Sorting:** optional, per column (`th[data-sort]`). Click or Enter on the header button cycles through ascending and descending. Only one column is sorted at a time.
  - The sort glyph is 20px: `on-surface` with an arrow on the sorted header; a double chevron in `on-surface-variant` at 60% on unsorted sortable headers. Hover on the header button is the `on-surface` state layer (8%).
  - The component only emits `scSort`; the service sorts the data (usually on the server), so large datasets work.
- **Selection:** optional (`selectable`). This is for "select fines to pay".
  - A checkbox column is added at inline-start. The header checkbox selects every row on the page and shows indeterminate when only some are selected.
  - A selected row gets the `channel-subtle` background (the role table's "selected rows"); in stacked mode the card also gets a 2px `channel-action` inset edge. The checkbox is 24px with a 2px `outline` edge and 4px corners, filled `channel-action` when checked.
  - A selection bar appears below the table: radius 8, `channel-subtle` fill, padding 12 by 16, the count in `label-large` (Bold) and the total in `label-medium` (Medium), 16 apart ("2 fines selected", "AED 1,700.00"; the live region reads them joined with " · "), plus a primary action, "Pay 2 fines".
- **Row hover:** the `on-surface` state layer (8%). It applies only under `@media (hover: hover) and (pointer: fine)`.
- **Whole rows are not clickable.** The link lives in the row header, so the target is explicit and keyboard users reach it with one Tab.
- **Density:** `default` is for the public. `compact` (row 44, `body-small`) is for staff tools with long lists.

## Responsive

The table is used as-is from `--breakpoint-medium` (600px) up. Below 600px, the `responsive` property chooses one of two behaviours:

- **`stack`** (default; best for up to 6 columns). Each row becomes a card on `surface-card` with `radius-card` (12), a 1px `outline-variant` edge and padding 16, spaced `space-12` apart.
  - The row header becomes the card title (`title-small`).
  - The status tag sits at top inline-end.
  - The other cells become key and value pairs on one line, as `sc-summary-list` `pairs` (board 09.05): the key in a fixed 104px start column (120 in Arabic), `body-medium` in `on-surface-variant`; the value `body-medium`, end-aligned.
  - The amount is the last line, after a 1px `outline-variant` rule and 12 of space, with its key, the value end-aligned in `title-medium`.
  - The action becomes a full-width link row at the bottom.
- **`scroll`** (for genuinely wide comparisons).
  - The table keeps its layout inside a horizontal scroll region with `role="region"`, `tabindex="0"` and `aria-labelledby` pointing at the caption.
  - The row header column is sticky at inline-start.
  - An 8px shadow edge (`doc-shadow-10` fading to transparent) shows on whichever side has more content. In RTL it starts on the left.
  - `overscroll-behavior-x: contain`.

## States

| State | What shows |
| --- | --- |
| Loading | 5 skeleton rows that match the real column widths: text bars at 60–80%, amount bars at 40% end-aligned, a pill for status. `surface-container-high` bars at `radius-control`. Opacity pulses 0.55 → 1 over 1.2s ease-in-out alternate. Under reduced motion the bars are static at 0.75. The header row stays real. |
| Empty | The header is hidden. A body message spans every column: a `title-small` sentence ("You have no fines") plus an optional `body-medium` next step. It never says "No data". |
| No results | After a filter: "No fines from 1 to 31 March 2026" plus a "Clear dates" link. |
| Error | `sc-callout tone="error"` in place of the body: "We could not load your fines. Try again in a few minutes.", with a secondary "Try again" button. Never show a raw error. |
| One row | Counts use plural rules: "1 fine", not "1 fines". The footer shows "Showing 1 fine", without "1–1 of 1". |

## Worst-case data (break-ui)

The board shows a "Demo / Worst case" pair. The worst-case fixture mixes these values across rows, as real data does:

- **Long text:** "Exceeding the maximum speed limit by more than 60 km/h on Sheikh Mohammed bin Zayed Road" wraps to 2 lines, and the row grows. The Arabic equivalent wraps in the same way.
- **Huge amount:** "AED 1,234,567.50" stays nowrap; the amount column widens and the text column gives way.
- **Long status:** "Waiting for court decision" stays nowrap; the tag never wraps.
- **Minimal row:** reference "F-1", amount "AED 0.50".
- **Missing optional value:** "None" in `on-surface-variant`.
- **1,284 rows:** paginated at 20; footer "Showing 1–20 of 1,284 fines".
- **Mixed bidi:** an Arabic description with a Latin plate number "Dubai A 12345" inside, isolated.

## Accessibility

- Native `<table>` semantics, so screen readers announce rows, columns and headers. The component is scoped (light DOM): it styles a slotted native table and never rebuilds one out of divs.
- `<caption>` is required. Headers use `th scope="col"`; the first cell of each row is `th scope="row"`.
- Sortable headers contain a `<button>`, and the `th` carries `aria-sort`. After a sort, a polite live region announces: "Sorted by Amount, highest first".
- Keyboard: Tab reaches the sort buttons, links, checkboxes and the scroll region, in reading order. There is no arrow-key grid navigation; this is a static table, not a data grid.
- The header checkbox is labelled "Select all fines on this page". Each row checkbox is labelled with its row header: "Select fine F-2026-118204".
- Contrast: header `on-surface` on `surface-container` 15.51:1; body `on-surface` on `surface-card` 17.14:1; `on-surface-variant` 6.46:1; links `channel-action` on `channel-subtle` (a selected row) 5.70:1 at the lowest.
- Focus: the U1 neutral ring (3px, 2px offset) on links, sort buttons and checkboxes; the scroll region's ring is inset.
- Links are underlined 1px at 4px (5px Arabic), 2px on hover (COL-08).
- Forced colours: rules become `CanvasText` at 1px, and the selected row gets `Highlight` with an outline.

## RTL and Arabic

The table mirrors entirely through logical properties:
- The first column is on the right; start-aligned cells align right, and amount and action cells align left.
- The sort glyph sits after the label (to its left).
- The checkbox column is on the right.
- The sticky column and the scroll start position are on the right.
- Previous is on the right, with a chevron pointing right.

Arabic type uses the Arabic scale through the type roles: `label-medium` AR 18/24 Bold, `body-medium` AR 18/28, `title-small` AR 19/28 Bold. Rows grow with that leading; nothing is fixed-height.

Digits stay Latin; Dubai W23's digits are tabular by default (TYP-08), so amounts align without `tabular-nums`. References and plates are wrapped in `sc-ltr`.

## Motion

Applies the emil-design-eng rules.

- **Sorting:** rows reorder instantly. Sorting is repeated and often keyboard-triggered, so it is not animated.
- **Row hover:** `background-color` over 120ms (`duration.fast`), `easing.hover` (ease).
- **Selection bar:** enters with opacity 0 → 1 and translateY 8px → 0 over 200ms, using `easing.enter`. It exits with opacity only over 160ms (`duration.exit`, about 20% faster than the entrance), using `easing.exit`.
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
        <td><sc-status-tag tone="warning">Not paid</sc-status-tag></td>
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

**v1 to v2:** no API changes. The look follows v2 (flat 12px container with a 1px edge, filled header, `channel-subtle` selection, underlined links, neutral focus ring, Arabic ranges written with a word in the examples). Styles moved into `@layer sc.components`.

## Board differences kept in code (board 09.05)

| Board | Code | Why |
| --- | --- | --- |
| Header and totals text drawn Bold in English | `label-medium` and `title-small` (Medium in English, Bold in Arabic) | W5: type roles only; no Bold English role at those sizes |
| Row-header link drawn `body-medium` at Medium | `title-small` | This spec's anatomy (row header `title-small`); no role is body-medium Medium |
| Cells 16 apart and 16 from the card edge (flex mock) | 16 inline padding per cell (32 between columns), 24 at the card edges | This spec and A28 ("cells padded 16 inline", first and last add 8) |
| Caption drawn as a heading above the container | The native `<caption>` inside the card | The caption is the table's accessible name and part of the native table |
| End-aligned header: sort glyph before the label | Glyph after the label in every column | This spec ("end-aligned headers keep it there too") |

## Budget

`perf-budgets.json` gives `sc-table` 12 KiB gzip. Measured: 10.3 KiB (custom-elements closure, excluding the runtime), of which 3.6 KiB is its CSS. v1 was 13.0 KiB.

## Tests

`sc-table.spec.tsx` and `sc-table.e2e.ts` (the v1 regression suite, all passing on v2: native semantics, keyboard order, sorting with announcements, selection with Space and the bar's total, Arabic mirroring, string re-labelling, stacked and scroll modes, 44px link targets, axe per context and per state) plus the v2 checks: container and header against the tokens, `channel-subtle` selection and the U1 ring, underlined links and the Arabic scale, and `@layer` overridability; `describeAxe` on the loading, empty, no-results, error and compact states. `sc-table.visual.e2e.ts`: desktop and stacked, EN/AR × light/dark.
