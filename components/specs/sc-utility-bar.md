# sc-utility-bar · specification (v2)

Status: new in v2, built by C1 (Wave 2b). Rules: decision **U4** and Standard **CHR-05**, which replace component-language B4's floating capsule; B4 for the items. Code: `src/components/sc-utility-bar`.

## Encapsulation

**Shadow DOM.** Self-contained links. It publishes its height to the document as a custom property.

## Anatomy

| # | Part | Notes |
| --- | --- | --- |
| 1 | Bar | `<nav>` labelled by its heading "Help and feedback". From 1024px: `position: fixed` to the bottom edge, full width, `surface`, `elevation-1`, a 1px `outline-variant` top edge, no radius (U4: docked and flat, not a pill). Safe-area padding at the bottom. |
| 2 | Heading | `<h2>` "Help and feedback": visually hidden when docked, shown below 1024px. |
| 3 | Items | Happiness Meter (`happiness-href`), Call with the number isolated LTR ("Call 04": `contact-href`, `contact-number`, default "04"), Services (`services-href`, docked only), Chat (`chat-href`), Accessibility (`accessibility-href`). Docked: a 20px icon and a visible label (labels never collapse to icons), label-medium, 48 tall, 16 inline padding, gap 8, radius 4, quiet with an 8% `on-surface` state layer, wrapping to a second row rather than hiding labels. |

Docked measurements (Paper board ERV-0): 12px block padding around the 48px items (73px with the hairline; the board's 72 counts the hairline inside), items 8 apart.

## Reserved space (WCAG 2.4.11)

When docked, the bar sets `--sc-utility-bar-block-size` on `<html>` to its measured height (ResizeObserver; removed below 1024px, when hidden or removed). `sc-page` pads its end by it, and `sc.css` sets `:root { scroll-padding-block-end }` from it, so the bar never covers the end of the page or the focused element.

## Short viewports (R11)

Below a viewport height of 600px (a short laptop window, a landscape tablet, or high zoom, since zoom shrinks the viewport in CSS pixels), the bar is never docked: from 1024px wide it keeps its row of icon items and the top hairline but is `position: static`, without the shadow, at the end of the page where it is placed (after the footer). It then publishes no height, so `sc-page` reserves nothing and `scroll-padding-block-end` is 0 (WCAG 2.4.11 and 1.4.10; review F-6). It re-docks when the viewport reaches 600px tall (the `matchMedia` query `(min-width: 1024px) and (min-height: 600px)` mirrors the CSS). Before upgrade, `sc.css` reserves the one-row height (48 + 2 × 12 + 1) in that range.

## Compact (below 1024px)

It folds into the footer: place it after `sc-footer` (in `sc-page`'s footer slot). It becomes an in-flow "Help and feedback" group, a 2 × 2 grid (gap 8) of outlined text buttons (size m, 48px, `channel-action` edge and text, no icons). Services is left out of the fold: the site's menu carries it (board ERV-0, B4's 2 × 2 grid).

## Without JavaScript (PERF-04)

The bar renders in shadow DOM, so without script it would show nothing. A service writes the same links as light-DOM children in `slot="fallback"`:

```html
<sc-utility-bar happiness-href="/en/happiness" contact-href="tel:04" chat-href="/en/chat" accessibility-href="/en/accessibility">
  <nav slot="fallback" aria-labelledby="help-fb"><h2 id="help-fb">Help and feedback</h2><ul>
    <li><a href="/en/happiness">Happiness Meter</a></li>
    <li><a href="tel:04">Call 04</a></li>
    <li><a href="/en/chat">Chat</a></li>
    <li><a href="/en/accessibility">Accessibility</a></li>
  </ul></nav>
</sc-utility-bar>
```

Until the bar is defined, `sc.css` shows it in the flow at the end of the page (never docked): a title-small heading and a wrapping row of underlined 44px links, with the grid margins and a 1px rule above. The upgraded shadow root has no `fallback` slot, so it is then neither shown nor read.

## Motion

None: present at load (CHR-05).

## Strings

`utilityLabel`, `utilityHappiness`, `utilityContact` ("Call" / "اتصل", followed by the number), `utilityServices`, `utilityChat`, `utilityAccessibility`.

## Budget

5 KiB override. Measured 4.5 KiB: own module 2.2 KiB, plus locale and icons.

## Tests

Spec: labelled nav, five labelled links, Services docked only, icons hidden, isolated number, items only with hrefs, Arabic. e2e: docked geometry and roles (fixed, full width, bottom, elevation-1, top edge, no radius), 12px padding, 48px items 8 apart, labels visible and 48px targets in Arabic at 1024px, published height and compact fold into a 2 × 2 grid without icons, cleanup on removal; `sc-page.e2e.ts` checks the reserved padding and that focus lands above the bar; static at 1280 × 560 and 1024 × 599 with its row kept, at the page end, and nothing reserved in `sc-page` or `scroll-padding`, re-docking at 600px tall (R11); fallback links visible, 44px and with hrefs with JavaScript disabled (EN and AR at 1280, EN at 390) and hidden once upgraded (PERF-04); `describeAxe`. Visual: compact group EN/AR × light/dark.

## Before upgrade

`sc.css` reserves 206px below 1024px (the folded group, measured in English; Arabic is taller), the one-row height from 1024px when the viewport is under 600px tall (static, R11), and nothing from 1024px otherwise, where the bar is fixed and takes no space.
