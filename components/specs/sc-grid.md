# sc-grid · specification (v2)

Status: rebuilt for v2 by C5 (Wave 2b). Visual rules: `docs/v2/component-language.md` A30–A32 and `foundations.md` §9. Code: the `sc-grid` block in `src/global/components.css`; tests in `src/components/sc-grid/`.

The page's column grid: 4 columns on phones, 8 from 600px and 12 from 1024px. Every child is a grid item.

## Encapsulation

**CSS only** (architecture §3.1). Not registered. `sc.css` styles the tag and its children in `@layer sc.components`: one rule per `span`, `span-medium` and `span-expanded` value (1 to 12, 36 rules) sets a private custom property, and the item width is `span min(var(--sc-grid-span, <span>), <columns>)`. The private properties reset to `initial` on every `sc-grid`, so a nested grid never inherits its parent's spans.

## Anatomy

| # | Part | Notes |
| --- | --- | --- |
| 1 | Host | `display: grid`, `repeat(<columns>, minmax(0, 1fr))`, gap = gutter. |
| 2 | Items | Every child; `min-inline-size: 0` so long content cannot widen a column. |

| Window | Columns | Gutter |
| --- | --- | --- |
| under 600px | 4 | 16 |
| 600px | 8 | 20 |
| 1024px | 12 | 24 |
| 1440px | 12 | 24 |

## Behaviours

- `span` (phones), `span-medium` (from 600px), `span-expanded` (from 1024px). Each falls back to the smaller one, then to full width. Spans are capped at the columns available, so `span-expanded="8"` is full width on a phone.
- One item can override with `style="--sc-grid-span: 8"`. It inherits, so do not set it on an element that contains another grid.
- The attributes are read only as attributes: setting `grid.spanMedium` from script does nothing (v1 had a property).

## Accessibility

No semantics. Use a list (`<ul>`) inside or around it when the items are a list.

## RTL and Arabic

Columns run from the right in Arabic (grid follows `direction`).

## Motion

None.

## Code

```html
<sc-grid span-medium="4" span-expanded="4">
  <sc-service-card …></sc-service-card>
</sc-grid>
```

| Attribute | Values | Default |
| --- | --- | --- |
| span | 1–12 | full width |
| span-medium | 1–12 | `span` |
| span-expanded | 1–12 | `span-medium` |

**v1 to v2:** markup unchanged; `::part(grid)`, the properties and `componentOnReady()` are gone.

## Budget

0 bytes of JavaScript. About 0.4 KiB gzip of `sc.css` (most of it the 36 span rules).

## Tests

`sc-grid.e2e.ts`: not registered; columns and gutters at four widths; three-up, two-up, one-up cards; fallbacks and capping; no leak into a nested grid; `--sc-grid-span`; right-to-left order; `describeAxe`.
