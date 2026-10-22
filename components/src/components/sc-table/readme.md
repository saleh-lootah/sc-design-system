# sc-table

A table compares rows of the same kind of thing across a few attributes: a person's fines, their payments, the status of their permit applications. Each row is one thing; each column is one attribute. For the details of one thing, use `sc-summary-list`. Never use a table for layout.

## Usage

```html
<sc-table caption="Your fines" selectable
  strings='{"tableSelectAll": "Select all fines on this page", "tableSelectRow": "Select fine {row}"}'
  selection-label="{count} fine selected|{count} fines selected">
  <table>
    <thead>
      <tr>
        <th scope="col" data-type="reference">Reference</th>
        <th scope="col" data-type="date" data-sort="date" aria-sort="descending">Date</th>
        <th scope="col">Offence</th>
        <th scope="col" data-type="status">Status</th>
        <th scope="col" data-type="amount" data-sort="amount">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr data-id="F-2026-118204">
        <th scope="row"><a href="/fines/F-2026-118204"><sc-ltr>F-2026-118204</sc-ltr></a></th>
        <td>14 Mar 2026</td>
        <td>Speeding: 21 to 30 km/h over the limit</td>
        <td><sc-status-tag tone="warning">Not paid</sc-status-tag></td>
        <td data-value="600">AED 600.00</td>
      </tr>
    </tbody>
  </table>
  <div slot="footer"><span>Showing 1–20 of 1,284 fines</span> …Previous / Next…</div>
  <sc-button slot="actions">Pay 2 fines</sc-button>
</sc-table>
```

- **Scoped, not shadowed.** The component styles and enhances your native `<table>`, so screen readers announce rows, columns and headers. Write `th scope="col"` headers and a `th scope="row"` as each row's first cell; it usually carries the row's link. Whole rows are never clickable.
- **Caption** is required: `caption` writes a native `<caption>`. Use `caption-hidden` when a heading straight above says the same thing.
- **Column types** go on the header cell as `data-type` and set alignment, wrapping and figures for the whole column: `text` (wraps, never truncated), `reference` (nowrap, tabular; wrap the value in `sc-ltr`), `date`, `amount` (end-aligned, nowrap: the column grows instead), `status` (an `sc-status-tag`), `action` (end-aligned). Digits are Latin in both languages.
- **Missing values:** leave the cell empty and the component writes a muted "None" (لا يوجد). Never a bare dash.
- **Sorting:** add `data-sort` (optionally with a column key, `data-sort="amount"`) to a header. It becomes a button; Enter or a click cycles ascending and descending, one column at a time, sets `aria-sort` and announces "Sorted by Amount, highest first". The component only emits `scSort` with `{ column, direction }`: sort the data in the service (usually on the server) and re-render the rows. Sorting is never animated.
- **Selection:** `selectable` adds a checkbox column at inline-start, identified by `tr[data-id]`, and a selection bar with the count, the total of the amount column (from `data-value`, or the cell text) and your `actions` slot. Label the checkboxes with `strings` ("Select fine {row}"). `selection-label` takes plural forms separated by `|` (English one|other; Arabic zero|one|two|few|many|other). `tr[data-selected]` preselects a row. `scSelectionChange` carries `{ ids }`.
- **States:** `loading` shows 5 skeleton rows at the real column widths (the header stays). With no rows, the `empty` slot replaces the table: a `title-s` sentence and an optional next step ("You have no fines"; never "No data"). Add `filtered` for "No results" after a filter, which keeps the header. Put an `sc-callout tone="error"` with a "Try again" button in the `error` slot when the data can't load. Counts in the footer follow plural rules: "Showing 1 fine", never "1–1 of 1".
- **Density:** `compact` (44px rows) is for staff tools with long lists.
- **Below 600px** (the component's own width), `responsive="stack"` (default, up to about 6 columns) turns rows into cards: the row header is the title, the status sits at top inline-end, other cells become label and value pairs, the amount is the last line in `title-medium` and the action a full-width link row. `responsive="scroll"` keeps the table in a horizontal scroll region (focusable, named by the caption) with the row header sticky at inline-start and a shadow on the side with more content. Scroll padding the width of the sticky column keeps a focused link or checkbox in a later column from scrolling under it (WCAG 2.4.11). A table wider than its container always scrolls rather than clipping.
- **Links in cells** get a target of at least 44 × 44 px (an invisible hit area around the text) without changing the row height.
- **Screen-reader context:** `class="sc-visually-hidden"` inside the table hides text visually: `View<span class="sc-visually-hidden"> fine F-2026-118204</span>`.
- **Arabic:** everything mirrors: the first column and the checkboxes are on the right, amounts and actions align left, and the sort glyph sits after the label. Rows grow with the Arabic leading; nothing is fixed-height.

<!-- Auto Generated Below -->


## Overview

A table compares rows of the same kind of thing across a few attributes: fines, payments,
permit applications. It styles and enhances a slotted native `<table>`; it never rebuilds
one out of divs, so screen readers announce rows, columns and headers.

The component is scoped (light DOM). Mark up the table as usual: `th scope="col"` in the
header, `th scope="row"` as each row's first cell, and give header cells a column type with
`data-type` (`text`, `reference`, `date`, `amount`, `status`, `action`) to set alignment,
wrapping and figures. The component then:
- writes the `caption` property into a native `<caption>` (the table's accessible name);
- turns `th[data-sort]` headers into sort buttons with `aria-sort`, and emits `scSort`
  (the service sorts the data, usually on the server);
- with `selectable`, adds a checkbox column (rows are identified by `tr[data-id]`) and a
  selection bar, and emits `scSelectionChange`;
- fills empty cells with a muted "None";
- below 600px, stacks rows as cards (`responsive="stack"`) or scrolls sideways (`"scroll"`).

Use `class="sc-visually-hidden"` inside the table for context only screen readers need
("View <span class="sc-visually-hidden">fine F-2026-118204</span>").

## Properties

| Property         | Attribute         | Description                                                                                                                                                                                                                                                           | Type                                     | Default     |
| ---------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ----------- |
| `caption`        | `caption`         | The table's accessible name, written into a native `<caption>`: "Your fines". Required unless the table already has a `<caption>`.                                                                                                                                    | `string \| undefined`                    | `undefined` |
| `captionHidden`  | `caption-hidden`  | Hides the caption visually (it is still announced). Use it when a heading straight above says the same thing.                                                                                                                                                         | `boolean`                                | `false`     |
| `density`        | `density`         | Row height: `default` (56) for the public, `compact` (44, body-s) for staff tools with long lists.                                                                                                                                                                    | `"compact" \| "default"`                 | `'default'` |
| `filtered`       | `filtered`        | The rows are the result of a filter: when there are none, the header stays (for "No fines from 1 to 31 March 2026").                                                                                                                                                  | `boolean`                                | `false`     |
| `loading`        | `loading`         | Shows 5 skeleton rows in place of the body. The header stays real.                                                                                                                                                                                                    | `boolean`                                | `false`     |
| `responsive`     | `responsive`      | Behaviour below 600px: `stack` turns each row into a card (up to about 6 columns); `scroll` keeps the table in a horizontal scroll region.                                                                                                                            | `"scroll" \| "stack"`                    | `'stack'`   |
| `selectable`     | `selectable`      | Adds a checkbox column at inline-start and a selection bar below the table. Rows are identified by `tr[data-id]`.                                                                                                                                                     | `boolean`                                | `false`     |
| `selectionLabel` | `selection-label` | The selection bar text, with `{count}`: "{count} fines selected". Plural forms are separated by `\|`: "{count} fine selected\|{count} fines selected" (Arabic: zero\|one\|two\|few\|many\|other). When the table has an amount column, the selected total follows it. | `string \| undefined`                    | `undefined` |
| `strings`        | `strings`         | Overrides the built-in English and Arabic strings, as JSON: `{"tableSelectRow": "Select fine {row}", "tableSelectAll": "Select all fines on this page"}`, or per language: `{"ar": {…}}`.                                                                             | `null \| string \| undefined \| unknown` | `undefined` |


## Events

| Event               | Description                                                                                                                                                   | Type                                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `scSelectionChange` | Fires when the selection changes, with `{ ids }` (the selected rows' `data-id`).                                                                              | `CustomEvent<{ ids: string[]; }>`                            |
| `scSort`            | Fires when a sortable header is activated, with `{ column, direction }`. `column` is the header's `data-sort` value, or its text. The service sorts the rows. | `CustomEvent<{ column: string; direction: SortDirection; }>` |


## Slots

| Slot        | Description                                                                                                      |
| ----------- | ---------------------------------------------------------------------------------------------------------------- |
|             | The native `<table>`.                                                                                            |
| `"actions"` | The selection bar's action: `<sc-button>Pay 2 fines</sc-button>`.                                                |
| `"empty"`   | Shown in place of the body when there are no rows: "You have no fines".                                          |
| `"error"`   | Shown in place of the body when the data could not load: an `sc-callout tone="error"` with a "Try again" button. |
| `"footer"`  | Count and pagination: "Showing 1–20 of 1,284 fines", Previous and Next.                                          |


----------------------------------------------


