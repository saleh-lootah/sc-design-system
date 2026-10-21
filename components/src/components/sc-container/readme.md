# sc-container

Centres content and sets the page's outer margins from the layout tokens.

## Usage

```html
<sc-container>
  <h2>Most used services</h2>
  <sc-grid span-medium="4" span-expanded="4">…</sc-grid>
</sc-container>

<sc-container width="reading">
  <h1>Check your answers before you pay</h1>
  <sc-summary-list>…</sc-summary-list>
</sc-container>
```

| Window | Margin | Token |
|---|---|---|
| under 600px | 20px | `--sc-grid-compact-margin` |
| 600px | 32px | `--sc-grid-medium-margin` |
| 1024px | 48px | `--sc-grid-expanded-margin` |
| 1440px | 80px | `--sc-grid-wide-margin` |

- Content is capped at `--sc-container-max` (1280px) and centred beyond that.
- `width="reading"` caps the column at `--sc-container-reading` (680px) and keeps it at the start edge, aligned with headings and back links. Use it for question pages, "Check your answers" and running text.
- Full-bleed sections (a hero, a coloured band) go outside the container and put one inside.

### Breakpoints

Media queries can't read custom properties, so the breakpoint widths (600, 1024, 1440px from `tokens/layout.json`) are repeated in the CSS with a comment; the margins themselves are tokens. Margins follow the window, not the parent.

### Arabic

The reading column starts at the right.

## v2: CSS only

`sc-container` is not a registered custom element in v2 (architecture §3.1). `sc.css` styles the tag directly (`@layer sc.components`), so it needs no JS, has no shadow root and never waits for hydration. The markup is unchanged; `::part(inner)` and `componentOnReady()` are gone. It works in page markup only: an element selector in the document does not reach into another component's shadow root.

| Attribute | Values | Default |
| --- | --- | --- |
| `width` | `page` (1280px cap), `reading` (680px cap, kept at the start edge) | `page` |
