# sc-breadcrumbs · specification (v2, new)

Status: new in v2, built by C2 (Wave 2b); **CSS only since v2-lib-gaps**. Visual rules: `docs/v2/component-language.md` B6; placement CHR-07. Paper reference for structure: v1 file, page p-B-0, HGQ-0. Code: the `sc-breadcrumbs` block of `src/global/components.css` (in `sc.css`); tests in `src/components/sc-breadcrumbs`.

Where the page sits in the channel's hierarchy, on channel pages outside a transaction, in the hero of inner pages. Never inside a journey (use `sc-back-link`).

## Encapsulation

**CSS only** (architecture §3.1, like `sc-container`): the tag is never registered. The page writes a named `<nav>` with an `<ol>` of links, the current page last as text with `aria-current="page"`; `sc.css` styles them. No JavaScript, no upgrade, no reservation, and it works with scripting off (PERF-04). The links are the page's own, so router click handlers on them work.

```html
<sc-breadcrumbs>
  <nav aria-label="Breadcrumb">
    <ol>
      <li><a href="/en">Home</a></li>
      <li><a href="/en/vehicles">Vehicles</a></li>
      <li aria-current="page">Renew your vehicle registration</li>
    </ol>
  </nav>
</sc-breadcrumbs>
```

The landmark name is the page's: "Breadcrumb" / "مسار التنقل".

## Anatomy

| # | Part | Notes |
| --- | --- | --- |
| 1 | Landmark | `<nav aria-label="Breadcrumb">` / "مسار التنقل", written by the page |
| 2 | List | `<ol>`, inline, wrapping, gap 8 |
| 3 | Ancestor link | `on-surface`, underlined 1px at 4px (5px Arabic), 2px on hover; 10px block padding (40px tall in English, 44 in Arabic). An invisible `::after` centred on the link grows the hit area to at least 44 × 44 (A11Y-04) without moving the layout. The 44px of chevron and gaps between two links keeps neighbouring targets apart however short the labels, and wrapped rows are 4px apart so targets on neighbouring rows don't overlap either |
| 4 | Separator | Material Symbols `chevron_right` as a CSS mask on each item's `::before` after the first, 20px, `on-surface-variant`, margin-inline 4, never read, mirrored in RTL |
| 5 | Current page | The last item: plain text, Bold, no underline, `aria-current="page"` on the `<li>` |

## Type

`label-medium` (16/20 Medium EN, 18/24 Bold AR); the current page Bold.

## Compact screens

Below 600px only the parent item (the second from last) shows, as "Back to {parent}" / "رجوع إلى {parent}" with a back chevron (the separator turned round; mirrored in Arabic). The words come from a `::before` on the link with `content: var(--sc-breadcrumbs-back, "Back to ")` (Arabic `"رجوع إلى "` under `:lang(ar)`), so the link's accessible name is what it shows; set `--sc-breadcrumbs-back` to change them. The single link has 12px of block padding, so it is at least 44px tall (board AP2-0), and its hit area reaches over the chevron.

## Links (R6, CMP-08)

Breadcrumb links are navigation links: R6 lets them underline on hover only, because their place in the trail and the chevrons identify them. They stay underlined at rest as well (1px; 2px on hover), the stricter choice, because the trail sits in the hero next to running text. The current page is never underlined.

## Keyboard and motion

Native links. They follow on release (the native `click`): pressing, sliding off and releasing does nothing (WCAG 2.5.2). Hover underline thickness over `duration-fast`; otherwise no motion.

## Before upgrade

Nothing to wait for: the trail is at its final size at first paint.

## Strings

None: the page writes the text. Standard wording: "Breadcrumb" / "مسار التنقل" for the landmark; the compact prefix is in `sc.css` (above).

## Budget

No JavaScript. Its rules are part of `sc.css` (about 0.4 KiB gzip, most of it the chevron).

## Tests

`sc-breadcrumbs.e2e.ts`: landmark, links and current page in the accessibility tree, not registered; colours, underline, type EN/AR, the separator colour and none before the first item; RTL order and mirrored chevrons; the compact collapse in EN and AR, its accessible name, 44px and the chevron's direction; `--sc-breadcrumbs-back` and a two-item trail; the same with JavaScript disabled; keyboard and ring; 44 × 44 hit areas EN/AR with no overlap, including one-letter labels and a wrapped trail; underline at rest, hover and focus; activation on release only; `describeAxe`. `sc-breadcrumbs.visual.e2e.ts` (wide and compact).
