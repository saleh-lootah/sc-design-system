# sc-bottom-nav · specification (v2, new)

Status: new in v2, built by C2 (Wave 2b). Visual rules: `docs/v2/component-language.md` B9, read through the role table (component-language's "channel-container-high" for the indicator is the token `channel-container`). Paper reference for structure: v1 file, page p-C-0, FQ1-0 (its floating glass capsule is not carried over). Code: `src/components/sc-bottom-nav`.

The primary navigation of signed-in channel pages on phones and tablets.

## Encapsulation

**Shadow DOM**, reading plain child links like `sc-breadcrumbs` (see its spec). Children: `<a href data-icon aria-current>`; three to five of them. Parts: `nav`, `item`, `indicator`.

## Anatomy

| # | Part | Notes |
| --- | --- | --- |
| 1 | Host | `position: fixed` to the bottom edge, full width, z-index 900. Shown below 1024px only (the header navigation takes over from 1024px, CHR-04) |
| 2 | Bar | `<nav aria-label="Main">` / "رئيسية": `surface` fill, 1px `outline-variant` top rule, padding for the bottom safe area. Flat, no shadow (U4's docked style) |
| 3 | Item | `<a>` in an equal share of the width, min 48 wide, min 64 tall, padding 4, gap 4; icon above label |
| 4 | Indicator | 56 × 32 pill behind the 24px icon |
| 5 | Label | `label-small` (14/18 Medium EN, 16/22 Bold AR); a long Arabic label wraps and the bar grows |

## States

| State | Rule |
| --- | --- |
| Default | Icon and label `on-surface-variant` |
| Current | Indicator `channel-container`, icon and label `channel-action`, label Bold, `aria-current="page"` |
| Pressed | Indicator `on-surface` at 12% |
| Focus | U1 ring drawn inside the item (offset −3px), so the screen edge never clips it |
| Forced colours | `LinkText`; current indicator `Highlight` |

Motion: the indicator crossfades its colour over `duration-fast`; it never slides.

## Page reservation

`sc.css` (`src/global/components.css`) reserves the bar's height below 1024px whenever an `sc-bottom-nav` is on the page and not `hidden`: `body { padding-block-end }` and `html { scroll-padding-block-end }` of 64 + 8 + the safe area (72px plus the inset), so the last content and the focused element are never covered (WCAG 2.4.11). Uses `:has()`, inside the browser floor (A1). Before upgrade the bar is hidden (it is fixed, so nothing shifts).

## RTL

The item order mirrors (the first destination is on the right).

## Strings

`src/i18n/components/sc-bottom-nav.ts`: `bottomNavLabel`.

## Budget

Custom-elements closure 3,848 B gzip (4 KiB budget), its own CSS 764 B.

## Tests

`sc-bottom-nav.spec.tsx` (landmark, items, indicator and label order, current, Arabic and label override), `sc-bottom-nav.e2e.ts` (docked, height, roles, equal widths; hidden from 1024px; page reservation; current indicator size and colours, label colours and type EN/AR; RTL order; ring inside the item and Enter; `describeAxe`), `sc-bottom-nav.visual.e2e.ts`.

## Open

- OQ-9's rule that the utility bar is hidden when the bottom nav is present belongs to `sc-utility-bar` (not built yet); this component does not hide it.
