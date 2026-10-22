# sc-environment-banner · specification (v2)

Status: new in v2 (v2-gov-banners). Rules: Standard **CHR-13**. Code: the `sc-environment-banner` block of `src/global/components.css` (in `sc.css`); tests in `src/components/sc-environment-banner`.

Marks any build that is not the live service (development, QA, user acceptance testing, staging, training), so nobody mistakes it for the real thing, takes a screenshot of it as if it were, or enters real details into it.

For a message to the public (planned maintenance, an outage) use `sc-announcement-bar` (CHR-09). For a message about one page or task use `sc-callout`.

## Encapsulation

**CSS only**: never registered, no JavaScript, no layout shift. The page writes the words.

```html
<sc-environment-banner>
  <section aria-label="Test version">
    <p><strong>QA</strong>This is a test version of Dubai Now. Don't enter real personal or payment details.</p>
  </section>
</sc-environment-banner>
```

Render it from the environment's configuration (a server template flag or a build variable), never from page code, and never in production. A build reference can follow the message: `Build <sc-ltr>2026.10.22-4f3c9a1</sc-ltr>`.

## Anatomy

| # | Part | Notes |
| --- | --- | --- |
| 1 | Band | Full bleed, `inverse-surface` with `inverse-on-surface` text, `label-medium`. A 4px top edge striped at 45° in `warning-container` and `inverse-surface` (6px stripes), so it never reads as live chrome or as an announcement tone. Padding 12 block; content capped at `container-max` with the grid margin. |
| 2 | Environment | The `<strong>`: a chip in `warning-container` / `on-warning-container`, Bold, 6px radius (`radius-chip`), 8 inline padding, 8 before the message. Name the environment as the team says it: "QA", "UAT", "Staging" / «التجهيز». |
| 3 | Message | Says it is not the live service and, where people might type real data, not to. Links are allowed and inherit the text colour, underlined. |

## Wording (EN / AR)

| Part | English | Arabic |
| --- | --- | --- |
| Region label | Test version | نسخة تجريبية |
| Message | This is a test version of {channel}. Don't enter real personal or payment details. | هذه نسخة تجريبية من {channel}. يُرجى عدم إدخال بيانات شخصية أو بيانات دفع حقيقية. |
| Build | Build {ref} | الإصدار {ref} |

## Behaviour

First on the page, before the official banner (after the skip link, which is hidden until focused). In the flow: not sticky or fixed (it would cover content, WCAG 2.4.11), not dismissible (a tester must never lose it), not a live region, no motion.

## Forced colours

The stripes give way to a solid `CanvasText` edge; the chip gets a 1px `CanvasText` outline.

## Budget

No JavaScript. About 0.25 KiB of `sc.css` (gzip).

## Tests

e2e (`sc-environment-banner.e2e.ts`): not registered; labelled region; `inverse-surface` band, `inverse-on-surface` text and the 4px striped edge; the warning chip and `label-medium` message; page margins at 375 and 1440 without horizontal scroll; mirroring in Arabic; static, with no controls; shows with JavaScript disabled; `describeAxe` in EN/AR × light/dark.
