# sc-account-nav · specification (v2, new)

Status: new in v2, built by C2 (Wave 2b). Visual rules: `docs/v2/component-language.md` B8, read through the role table (component-language's "channel-container" for the current item is the token `channel-subtle`). Paper reference for structure: v1 file, page p-C-0, KNF-0 / L5S-0. Code: `src/components/sc-account-nav`.

The side navigation of the signed-in account area.

## Encapsulation

**Shadow DOM**, reading plain child links like `sc-breadcrumbs` (see its spec for the reasoning). Children:

| Attribute on a child `<a>` | Effect |
| --- | --- |
| `href` | Required; non-links are ignored |
| `aria-current="page"` | The current item |
| `data-icon` | `description`, `credit-card`, `notifications`, `person`, `history`, `home`, `apps`, `logout` (`src/icons/destinations.tsx`) |
| `data-count` | A positive whole number: the count badge |
| `data-count-label` | The visually hidden text read after the label; default "{count} new" / "{count} جديدة" |
| `data-sign-out` | Puts the item after the divider |
| `lang` | Passed on to the rendered link |

Parts: `nav`, `item`, `badge`.

## Anatomy

| # | Part | Notes |
| --- | --- | --- |
| 1 | Landmark | `<nav aria-label="Account">` / "الحساب" (overridable with `label`) |
| 2 | List | `<ul>`, column, gap 4 |
| 3 | Item | `<a>`, min 48 tall, padding 8 × 12, gap 12, radius 4, 24px icon in `on-surface-variant`, label `on-surface` |
| 4 | Badge | Pill, min 24 × 24, padding-inline 8, `channel-action` fill, `channel-on-action` text, `label-small` Bold; `aria-hidden`, with visually hidden text inside the link ("Notifications 3 unread") |
| 5 | Divider and Sign out | A second `<ul>` with a 1px `outline-variant` top rule, 12 above and below; the `logout` icon mirrors |

## Type and states

Items: `label-large` with the `label-medium` weight (18/22 Medium EN, 20/28 Bold AR, D12). Current: Bold.

| State | Rule |
| --- | --- |
| Hover | `.state-layer` (8% `on-surface`); pressed 12% |
| Current | `channel-subtle` fill, a 3px `channel-action` bar at inline-start (`size-border-accent`), icon `channel-action`, Bold, `aria-current="page"` |
| Focus | U1 ring |
| Forced colours | `LinkText` items; the current item gets a `LinkText` border (transparent otherwise) and bar |

Motion: colour only, `duration-fast`.

## Compact screens

Below 600px (proposed in B8): one row of 44px items that scrolls sideways, from the right in Arabic; the current bar moves to the bottom edge; the divider becomes an inline-start rule before Sign out. The scroll box has 6px of padding so focus rings are never clipped.

## RTL

The bar and icons sit on the right; the `logout` icon mirrors.

## Before upgrade

`sc.css` lays the links out as a 48px column in `label-large`, indented to where the labels will sit.

## Strings

`src/i18n/components/sc-account-nav.ts`: `accountNavLabel`, `accountNavCount`.

## Budget

Custom-elements closure 4,080 B gzip (4 KiB budget: 16 B of room), its own CSS 799 B. Shared chunks: the locale controller (0.9 KiB), the destination icons (0.7 KiB, shared with `sc-bottom-nav`) and the nav-items reader (0.5 KiB, shared with `sc-breadcrumbs` and `sc-bottom-nav`). Any addition needs a trim or a budget override.

## Tests

`sc-account-nav.spec.tsx` (landmark, lists, current, icons and mirroring, badge and hidden text, default and Arabic count text, non-links ignored), `sc-account-nav.e2e.ts` (item size, icon size, type and colours EN/AR; current fill, bar, icon and weight; RTL bar and icons; accessible name with the count; badge roles and size; keyboard and ring; compact row; re-render on change; `describeAxe`), `sc-account-nav.visual.e2e.ts`.
