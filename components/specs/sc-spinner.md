# sc-spinner · specification (v2)

Status: rebuilt for v2 by C4 (Wave 2b). Rules: `docs/v2/component-language.md` A21, MOT-04, MOT-15 and the spinner note in Standard 8.7. Code: `src/components/sc-spinner`.

A short inline wait. Inside a button use `sc-button loading`.

## Encapsulation

**Shadow DOM** (chrome and display).

## Anatomy

| # | Part | Notes |
| --- | --- | --- |
| 1 | Region | `role="status"` (polite), holding the icon and the label. |
| 2 | Icon (`icon`) | A 270° arc with round caps, 2.5px stroke, no track (Paper board, node 4RS-0) in `currentColor`. 24px (`size="l"`, default, per the Paper board) or 20px (`size="m"`, inline). Decorative. |
| 3 | Label (`label`) | "Loading" / "جارٍ التحميل" or `label`. `body-medium` in `on-surface`, 12px from the arc. Visually hidden unless `show-label`, or motion is reduced. |

## Motion

`.spin`: one turn per `--sc-duration-spin` (**600ms**, linear; the motion work made it faster than v1's 800ms, because a faster spinner reads as faster loading). Under reduced motion the token is 0ms, `.spin` stops and the label shows. It never mirrors.

## Changes from v1

- New `size` prop (`l` 24px, the default; `m` 20px).
- Visible label uses `body-medium` (v1: label-medium).
- Strings moved to `src/i18n/components/sc-spinner.ts` (`spinnerLoading`).

## Budget

Leaf, 4 KiB. Measured **2.3 KiB** gzip (incl. the inlined arc and the locale controller); CSS 0.4 KiB.

## Tests

Spec (status region, label, size, Arabic), e2e (sizes, `sc-spin` 0.6s linear, currentColor, hidden label, reduced motion, no mirroring, re-render on `lang`), `describeAxe`, visual.

The arc follows the board and component-language A21 (2.5px stroke, 270°, no track). It is not a Material Symbol: Material has no loading glyph.
