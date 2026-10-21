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

## v2: CSS only

`sc-grid` is not a registered custom element in v2 (architecture §3.1). `sc.css` styles the tag and its children directly, with one rule per `span`, `span-medium` and `span-expanded` value (1 to 12). The markup is unchanged; `::part(grid)` and `componentOnReady()` are gone, and the attributes are read only as attributes (setting `grid.spanMedium = 4` from script does nothing; use `setAttribute`).

| Attribute | Values | Default |
| --- | --- | --- |
| `span` | 1 to 12: columns per item on phones (4 columns) | full width |
| `span-medium` | 1 to 12: from 600px (8 columns) | `span` |
| `span-expanded` | 1 to 12: from 1024px (12 columns) | `span-medium` |

A child can set its own width with `style="--sc-grid-span: 8"`. Spans are capped at the columns available.
