# sc-spinner · specification (v2)

Status: rebuilt for v2 by C4 (Wave 2b). Rules: `docs/v2/component-language.md` A21, MOT-04, MOT-15 and the spinner note in Standard 8.7. Code: `src/components/sc-spinner`.

A short inline wait. Inside a button use `sc-button loading`.

## Encapsulation

**Shadow DOM** (chrome and display).

## Anatomy

| # | Part | Notes |
| --- | --- | --- |
| 1 | Region | `role="status"` (polite), holding the icon and the label. |
| 2 | Icon (`icon`) | The shared `Spinner` icon (a faint track and an arc, 2px stroke) in `currentColor`. 20px (`size="m"`, default) or 24px (`size="l"`). Decorative. |
| 3 | Label (`label`) | "Loading" / "جارٍ التحميل" or `label`. `body-medium`. Visually hidden unless `show-label`, or motion is reduced. |

## Motion

`.spin`: one turn per `--sc-duration-spin` (**600ms**, linear; the motion work made it faster than v1's 800ms, because a faster spinner reads as faster loading). Under reduced motion the token is 0ms, `.spin` stops and the label shows. It never mirrors.

## Changes from v1

- New `size` prop (`m` 20px, `l` 24px).
- Visible label uses `body-medium` (v1: label-medium).
- Strings moved to `src/i18n/components/sc-spinner.ts` (`spinnerLoading`).

## Budget

Leaf, 4 KiB. Measured **3.2 KiB** gzip (incl. the shared icon set and locale controller); CSS 0.4 KiB.

## Tests

Spec (status region, label, size, Arabic), e2e (sizes, `sc-spin` 0.6s linear, currentColor, hidden label, reduced motion, no mirroring, re-render on `lang`), `describeAxe`, visual.

The component-language proposals of a 2.5px stroke and a 270° arc are not taken: the spinner uses the shared icon (FND-21, icons come from the set).
