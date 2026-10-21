# sc-skip-link · specification (v2)

Status: rebuilt for v2 by C2 (Wave 2b). Visual rules: `docs/v2/component-language.md` A6. Code: `src/components/sc-skip-link`.

"Skip to main content" / "الانتقال إلى المحتوى الرئيسي": the first focusable element on every page.

## Encapsulation

**Shadow DOM** with `delegatesFocus` (architecture §3.1). The fragment target resolves in the document. Part: `control`.

## Anatomy and behaviour

- Off screen (the visually hidden technique) until it has focus; then absolutely placed 8px from the top and inline-start edges (top right in Arabic), z-index 1000.
- 48px tall (`size-control-secondary`), padding-inline 20, radius 4, a transparent 1.5px border that forced colours repaint.
- Activating it moves focus to the target: `tabindex="-1"` is added only for the moment it is needed and removed on blur, so the next Tab continues from the main content in every browser (unchanged from v1).
- `href` defaults to `#main-content`, the id `sc-page` renders (fixes the v1 known gap noted in Standard §10.3).

## Type and colour

`label-large` (18/22 Bold EN, 20/28 Bold AR). Fill `inverse-surface`, text `inverse-on-surface`, not underlined (it is a solid block, not running text; Paper board sc-skip-link), so it stands out over any hero or announcement colour. The U1 ring shows whenever it is focused, including by script or pointer, because it is only ever visible while focused. Forced colours: `Canvas`, `LinkText`, `Highlight` ring.

## Motion

None: it appears instantly (MOT-02).

## Strings

`src/i18n/components/sc-skip-link.ts`: `skipLinkLabel`, using the verbal noun required by CNT-11. Overridable through the default slot.

## API changes from v1

- Look: a 48px `inverse-surface` block with 4px corners (v1: a channel-coloured pill on surface with elevation 3).
- No other change. `href` already defaulted to `#main-content`.

## Budget

Custom-elements closure 2,383 B gzip (4 KiB budget), its own CSS 505 B.

## Tests

`sc-skip-link.spec.tsx`, `sc-skip-link.e2e.ts` (hidden until focused; 48px, 8px from the corner, radius, inverse roles, type, U1 ring; default href; ring on script focus; Enter moves focus and the next Tab continues; Arabic label, top right and Arabic size; `describeAxe` and axe while focused in EN/AR × light/dark), `sc-skip-link.visual.e2e.ts`.
