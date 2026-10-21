# sc-utility-bar · specification (v2)

Status: new in v2, built by C1 (Wave 2b). Rules: decision **U4** and Standard **CHR-05**, which replace component-language B4's floating capsule; B4 for the items. Code: `src/components/sc-utility-bar`.

## Encapsulation

**Shadow DOM.** Self-contained links. It publishes its height to the document as a custom property.

## Anatomy

| # | Part | Notes |
| --- | --- | --- |
| 1 | Bar | `<nav>` labelled by its heading "Help and feedback". From 1024px: `position: fixed` to the bottom edge, full width, `surface`, `elevation-1`, a 1px `outline-variant` top edge, no radius (U4: docked and flat, not a pill). Safe-area padding at the bottom. |
| 2 | Heading | `<h2>` "Help and feedback": visually hidden when docked, shown below 1024px. |
| 3 | Items | Happiness Meter (`happiness-href`), Contact and complaints with the number isolated LTR (`contact-href`, `contact-number`, default "04"), Chat (`chat-href`), Accessibility (`accessibility-href`). Icon + visible label always (labels never collapse to icons), label-medium, at least 44 tall. Docked: quiet items with a state layer, wrapping to a second row rather than hiding labels. |

## Reserved space (WCAG 2.4.11)

When docked, the bar sets `--sc-utility-bar-block-size` on `<html>` to its measured height (ResizeObserver; removed below 1024px, when hidden or removed). `sc-page` pads its end by it, and `sc.css` sets `:root { scroll-padding-block-end }` from it, so the bar never covers the end of the page or the focused element.

## Compact (below 1024px)

It folds into the footer: place it after `sc-footer` (in `sc-page`'s footer slot). It becomes an in-flow "Help and feedback" group, a 2 × 2 grid of outlined buttons (size m, 48px, `channel-action` edge and text).

## Motion

None: present at load (CHR-05).

## Strings

`utilityLabel`, `utilityHappiness`, `utilityContact`, `utilityChat`, `utilityAccessibility`.

## Budget

5 KiB override. Measured 4.5 KiB: own module 2.2 KiB, plus locale and icons.

## Tests

Spec: labelled nav, four labelled links, icons hidden, isolated number, items only with hrefs, Arabic. e2e: docked geometry and roles (fixed, full width, bottom, elevation-1, top edge, no radius), labels visible and 44px targets in Arabic at 1024px, published height and compact fold into a 2 × 2 grid, cleanup on removal; `sc-page.e2e.ts` checks the reserved padding and that focus lands above the bar; `describeAxe`. Visual: compact group EN/AR × light/dark.

## Before upgrade

`sc.css` reserves 210px below 1024px (the folded group, measured in English; Arabic is taller), and nothing from 1024px, where the bar is fixed and takes no space.
