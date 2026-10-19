# sc-grid

The 4/8/12-column layout grid.

## Usage

```html
<!-- Three to a row on desktop, two on tablets, one on phones -->
<sc-grid span-medium="4" span-expanded="4">
  <sc-service-card …></sc-service-card>
  <sc-service-card …></sc-service-card>
  <sc-service-card …></sc-service-card>
</sc-grid>

<!-- Main column and sidebar -->
<sc-grid>
  <div style="--sc-grid-span: 8">…</div>
  <div style="--sc-grid-span: 4">…</div>
</sc-grid>
```

| Window | Columns | Gutter |
|---|---|---|
| under 600px | 4 | 16px |
| 600px | 8 | 20px |
| 1024px and up | 12 | 24px |

- Every child is a grid item. `span`, `span-medium` and `span-expanded` set how many columns each item spans; each falls back to the smaller breakpoint's value, and spans are capped at the columns available (so 8 is full width on a phone). Without them, items are full width.
- Override one item with the `--sc-grid-span` custom property. It inherits, so don't set it on an element that contains another `sc-grid`.
- Put the grid inside `sc-container` for the page margins.

### Breakpoints

Media queries can't read custom properties, so the breakpoint widths (600, 1024, 1440px from `tokens/layout.json`) are repeated in the CSS; columns and gutters are tokens.

### Arabic

Columns run right to left.

<!-- Auto Generated Below -->


## Overview

The layout grid: 4 columns on phones, 8 from 600px and 12 from 1024px, with gutters from
the layout tokens (16, 20, 24px). Each child is a grid item.

Item widths are set once for all children with `span`, `span-medium` and `span-expanded`
(each falls back to the smaller one, and is capped at the number of columns), or per
child with the `--sc-grid-span` custom property, e.g. `style="--sc-grid-span: 8"`.

Service cards three to a row on desktop, two on tablets and one on phones:
`<sc-grid span-medium="4" span-expanded="4">`.

## Properties

| Property       | Attribute       | Description                                                                  | Type                  | Default     |
| -------------- | --------------- | ---------------------------------------------------------------------------- | --------------------- | ----------- |
| `span`         | `span`          | Columns each item spans on phones (4 columns). Defaults to the full width.   | `number \| undefined` | `undefined` |
| `spanExpanded` | `span-expanded` | Columns each item spans from 1024px (12 columns). Defaults to `span-medium`. | `number \| undefined` | `undefined` |
| `spanMedium`   | `span-medium`   | Columns each item spans from 600px (8 columns). Defaults to `span`.          | `number \| undefined` | `undefined` |


## Slots

| Slot | Description |
| ---- | ----------- |
|      | Grid items. |


## Shadow Parts

| Part     | Description       |
| -------- | ----------------- |
| `"grid"` | The grid element. |


----------------------------------------------


