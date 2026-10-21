# sc-back-link · specification (v2)

Status: rebuilt for v2 by C2 (Wave 2b). Visual rules: `docs/v2/component-language.md` A3. Code: `src/components/sc-back-link`.

"Back" to the previous step, on every step of a journey except the first.

## Encapsulation

**Shadow DOM** with `delegatesFocus` (architecture §3.1). A native `<a href>` when the previous step has a URL, otherwise a `<button type="button">` whose `click` the service handles. Parts: `control`, `label`, `icon`.

## Anatomy

| # | Part | Notes |
| --- | --- | --- |
| 1 | Control | `<a>` or `<button>`, min 44 × 44, no fill, no border, radius 4 (for the ring), padding-inline 4, gap 6 |
| 2 | Icon | `arrow-back`, 24px (`size-icon-l`), at inline-start, mirrored in RTL |
| 3 | Label | Default slot, defaults to "Back" / "رجوع" |

## Type and colour

`label-medium` (16/20 Medium EN, 18/24 Bold AR). Icon and text `on-surface`.

| State | Rule |
| --- | --- |
| Hover (fine pointers) | Label underlined 1px at 4px (5px Arabic) |
| Pressed | Text `on-surface-variant` |
| Focus-visible | U1 ring |
| Forced colours | `ButtonText` (button) / `LinkText` (link) |

## Keyboard

Native: Enter follows the link; Enter and Space activate the button.

## Motion

Colour only, `duration-fast`. No press scale (it is a text control).

## RTL

The arrow mirrors (it points right in Arabic) and stays at the start (the right).

## Strings

`src/i18n/components/sc-back-link.ts`: `backLinkLabel`.

## API changes from v1

- The glass pill is gone: plain text and a 24px `arrow-back` icon (v1: a 44px glass pill with a chevron).
- `appearance` (`glass` | `plain`) is deprecated and ignored; the attribute is still accepted so v1 markup renders.
- Type `label-medium` (v1 `label-m`).

## Budget

Custom-elements closure 2,683 B gzip (4 KiB budget), its own CSS 517 B. The arrow comes from `src/icons/nav.tsx`, not the shared icon set.

## Tests

`sc-back-link.spec.tsx` (link and button, default label and arrow order, Arabic, deprecated `appearance`), `sc-back-link.e2e.ts` (44px target, no fill, on-surface, 24px icon, type EN/AR, hover underline, keyboard and ring, button Enter/Space, accessible name EN/AR, RTL mirroring; `describeAxe`, axe with focus on every channel), `sc-back-link.visual.e2e.ts`.
