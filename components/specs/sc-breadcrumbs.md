# sc-breadcrumbs · specification (v2, new)

Status: new in v2, built by C2 (Wave 2b). Visual rules: `docs/v2/component-language.md` B6; placement CHR-07. Paper reference for structure: v1 file, page p-B-0, HGQ-0. Code: `src/components/sc-breadcrumbs`.

Where the page sits in the channel's hierarchy, on channel pages outside a transaction, in the hero of inner pages. Never inside a journey (use `sc-back-link`).

## Encapsulation

**Shadow DOM** (no `delegatesFocus`: the host is never the focus target). The service writes the trail as plain children; the component reads them and renders its own `<nav><ol>` in the shadow root:

```html
<sc-breadcrumbs>
  <a href="/en">Home</a>
  <a href="/en/vehicles">Vehicles</a>
  <span>Renew your vehicle registration</span>
</sc-breadcrumbs>
```

Why: an `<ol>` must directly contain its `<li>`s, so slotting links into a shadow list would need one named slot per item and attributes written onto the service's elements. Reading the children instead keeps the service's markup untouched, makes the pre-upgrade and no-JavaScript state a plain row of links, and needs no slot gymnastics. Children are not slotted, so once upgraded they are neither shown nor in the accessibility tree. A `MutationObserver` on the host re-renders when they change (shared helper `src/utils/nav-items.ts`, also used by `sc-account-nav` and `sc-bottom-nav`). Trade-off: the rendered links are the component's own, so router click handlers attached to the children don't apply; SPA routers handle clicks by delegation or use full links.

Parts: `nav`, `list`, `link`, `current`.

## Anatomy

| # | Part | Notes |
| --- | --- | --- |
| 1 | Landmark | `<nav aria-label="Breadcrumb">` / "مسار التنقل" (overridable with `label`) |
| 2 | List | `<ol>`, inline, wrapping, gap 8 |
| 3 | Ancestor link | `on-surface`, underlined 1px at 4px (5px Arabic), 2px on hover; 10px block padding (40px tall in English, 44 in Arabic). An invisible `::after` centred on the link grows the hit area to at least 44 × 44 (A11Y-04) without moving the layout. The 44px of chevron and gaps between two links keeps neighbouring targets apart however short the labels, and wrapped rows are 4px apart so targets on neighbouring rows don't overlap either |
| 4 | Separator | `chevron-forward`, 20px, `on-surface-variant`, margin-inline 4, `aria-hidden`, mirrored in RTL |
| 5 | Current page | The last child, always. Plain text, Bold, no underline, `aria-current="page"`. A last child written as a link is still rendered as text |

## Type

`label-medium` (16/20 Medium EN, 18/24 Bold AR); the current page Bold.

## Compact screens

Below 600px only the parent item shows, as "Back to {parent}" / "رجوع إلى {parent}" with a mirrored back chevron; the `compact-label` prop overrides that text (`{parent}` is replaced by the parent's text). The single link has 12px of block padding, so it is at least 44px tall (board AP2-0). The full and compact texts are separate spans toggled by the media query, so the link's accessible name always matches what is shown.

## Links (R6, CMP-08)

Breadcrumb links are navigation links: R6 lets them underline on hover only, because their place in the trail and the chevrons identify them. They stay underlined at rest as well (1px; 2px on hover), the stricter choice, because the trail sits in the hero next to running text. The current page is never underlined.

## Keyboard and motion

Native links. They follow on release (the native `click`): pressing, sliding off and releasing does nothing (WCAG 2.5.2). Hover underline thickness over `duration-fast`; otherwise no motion.

## Before upgrade

`sc.css` lays the children out as a wrapping row in `label-medium` with a 44px minimum height.

## Strings

`src/i18n/components/sc-breadcrumbs.ts`: `breadcrumbsLabel`, `breadcrumbsBackTo`.

## Budget

Custom-elements closure 3,274 B gzip (4,224 B budget), its own CSS 629 B (with the 44px hit areas, v2-fixes-nav). The two chevrons are Material Symbols `chevron_right` and `chevron_left`, inlined from `src/icons/for/sc-breadcrumbs.tsx`.

## Tests

`sc-breadcrumbs.spec.tsx` (landmark, list, links, current page, a trailing link as text, separators, compact text, Arabic, label override, list wrapper), `sc-breadcrumbs.e2e.ts` (landmark and names in the accessibility tree; children hidden; colours, underline, type EN/AR; 44 × 44 hit areas EN/AR with no overlap, including one-letter labels and a wrapped trail; underline at rest, hover and focus; activation on release only; RTL order and mirrored chevrons; compact collapse and its accessible name; keyboard and ring; re-render on child change; `describeAxe`), `sc-breadcrumbs.visual.e2e.ts` (wide and compact).
