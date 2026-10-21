# sc-container · specification (v2)

Status: rebuilt for v2 by C5 (Wave 2b). Visual rules: `docs/v2/component-language.md` A30–A32 and `foundations.md` §9 (LAY-01). Code: the `sc-container` block in `src/global/components.css`; tests in `src/components/sc-container/`.

Centres page content and applies the page grid's outer margins. It is a layout primitive: it has no behaviour and draws nothing.

## Encapsulation

**CSS only** (architecture §3.1). `sc-container` is never registered as a custom element. `sc.css` styles the tag in `@layer sc.components`, so it costs no JavaScript, has no shadow root, is never hidden waiting for hydration and causes no layout shift (v1's container was a CLS source). An element selector in the document does not reach into a shadow root, so a shadow component cannot use `sc-container` inside its own template: it repeats the margins itself (as `sc-channel-hero` does).

## Anatomy

| # | Part | Notes |
| --- | --- | --- |
| 1 | Host | `display: block`, `inline-size: 100%`, `max-inline-size: 1280px + 2 × margin`, centred with `margin-inline: auto`. The margin is padding on the host, so content sits in its content box. |

## Widths and margins

| Window | Margin | Token |
| --- | --- | --- |
| under 600px | 20 | `--sc-grid-compact-margin` |
| 600px | 32 | `--sc-grid-medium-margin` |
| 1024px | 48 | `--sc-grid-expanded-margin` |
| 1440px | 80 | `--sc-grid-wide-margin` |

- `width="page"` (default): content capped at `--sc-container-max` (1280).
- `width="reading"`: content capped at `--sc-container-reading` (680), kept at the **start** edge so it lines up with the page column above and below (LAY-01). The extra width goes into the end padding: `max(margin, min(100%, max + 2 × margin) − margin − reading)`.
- Media queries cannot read custom properties, so the breakpoints (600, 1024, 1440) are repeated from `tokens/layout.json`. The margins follow the window, not the parent.

## Accessibility

No semantics. It adds no landmark; use `<main>`, `<header>` and so on around or inside it.

## RTL and Arabic

Logical properties only. The reading column starts at the right in Arabic.

## Motion

None.

## Code

```html
<sc-container>
  <h2>Most used services</h2>
  <sc-grid span-medium="4" span-expanded="4">…</sc-grid>
</sc-container>
<sc-container width="reading">
  <h1>Check your answers before you pay</h1>
</sc-container>
```

| Attribute | Values | Default |
| --- | --- | --- |
| width | `page` \| `reading` | `page` |

No events, slots or parts. **v1 to v2:** markup unchanged; `::part(inner)`, the `width` property (attribute only now) and `componentOnReady()` are gone.

## Budget

0 bytes of JavaScript. Its CSS is part of `sc.css` (about 0.2 KiB gzip).

## Tests

`sc-container.e2e.ts`: not registered; the four margins; the 1280 cap and centring; the reading width at the start in English and Arabic and aligned with the page column on very wide screens; phone margins; `describeAxe` in EN/AR × light/dark.
