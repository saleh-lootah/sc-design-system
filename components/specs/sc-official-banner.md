# sc-official-banner · specification (v2)

Status: new in v2 (v2-gov-banners). Rules: Standard **CHR-12**; the pattern follows the US Web Design System's "official website" banner and Singapore's government masthead. Code: the `sc-official-banner` block of `src/global/components.css` (in `sc.css`); tests in `src/components/sc-official-banner`.

The first thing on every page, on channel sites and in transactions: it says the website is an official Government of Dubai website and explains how to check.

## Encapsulation

**CSS only** (like `sc-footer`): the tag is never registered. The disclosure is a native `<details>`, so it opens with Enter, Space or a click, exposes its expanded state, and works with scripting off (PERF-04). The page writes the words in the page language.

```html
<sc-official-banner>
  <section aria-label="Official website of the Government of Dubai">
    <details>
      <summary><span>An official website of the Government of Dubai</span> <span>How to check</span></summary>
      <div>
        <p class="sc-official-banner__domain"><strong>Official websites use <sc-ltr>.gov.ae</sc-ltr></strong>An address that ends in .gov.ae means the website belongs to a government organisation in the UAE.</p>
        <p class="sc-official-banner__https"><strong>Secure websites use <sc-ltr>HTTPS</sc-ltr></strong>A lock or https:// before the address means your connection is secure. Share personal or payment details only on official, secure websites.</p>
      </div>
    </details>
  </section>
</sc-official-banner>
```

The `<section>` makes it a labelled region, so no content sits outside a landmark. The last `<span>` in `<summary>` is the toggle; anything before it is the statement. The two classes choose the item icons; an item without one has no icon.

## Anatomy

| # | Part | Notes |
| --- | --- | --- |
| 1 | Band | Full bleed, `surface-container`, `on-surface` text, `label-small`. Content capped at `container-max` with the grid margin (20 / 32 / 48 / 80). |
| 2 | Emblem (optional) | An `<img>` or `<svg>` as the summary's first child, 20px tall. The library ships none: an emblem is used only under CHR-02 and OQ-30 (decision L1). |
| 3 | Statement | "An official website of the Government of Dubai" / «موقع إلكتروني رسمي لحكومة دبي». |
| 4 | Toggle | "How to check" / «طريقة التحقق», underlined 1px at 4px (5px Arabic), 2px on hover, with a 16px chevron (Material Symbols expand_more) that turns 180° when open. The whole `<summary>` row is the target: at least 44px tall (B2). It wraps under the statement on narrow screens. |
| 5 | Panel | Under a 1px `outline-variant` rule, padding 16 / 24, one column, two from 600px (gap 16 / 32). Each item: a 24px `on-surface` icon at inline-start, 12 before the text; a Bold `on-surface` heading; `body-small` text in `on-surface-variant`. |

## Wording (EN / AR)

| Part | English | Arabic |
| --- | --- | --- |
| Region label | Official website of the Government of Dubai | موقع رسمي لحكومة دبي |
| Statement | An official website of the Government of Dubai | موقع إلكتروني رسمي لحكومة دبي |
| Toggle | How to check | طريقة التحقق |
| Address heading | Official websites use .gov.ae | المواقع الرسمية تستخدم ‎.gov.ae |
| Address text | An address that ends in .gov.ae means the website belongs to a government organisation in the UAE. | العنوان الذي ينتهي بـ ‎.gov.ae يعني أن الموقع تابع لجهة حكومية في دولة الإمارات. |
| HTTPS heading | Secure websites use HTTPS | المواقع الآمنة تستخدم HTTPS |
| HTTPS text | A lock or https:// before the address means your connection is secure. Share personal or payment details only on official, secure websites. | يدل رمز القفل أو ‎https://‎ قبل العنوان على أن الاتصال آمن. يُرجى مشاركة البيانات الشخصية أو بيانات الدفع على المواقع الرسمية والآمنة فقط. |

Wrap `.gov.ae`, `HTTPS` and `https://` in `<sc-ltr>` in Arabic. The Arabic toggle and HTTPS text avoid gendered imperatives (CNT-11). The address wording is confirmed (decision R25): only official government websites can use `.gov.ae`.

## Placement

After `sc-skip-link` and `sc-environment-banner` (when present), before `sc-announcement-bar` and the header. In `sc-page`, inside the `header` slot wrapper, first.

## Motion

None. The panel appears at once (its height is never animated, MOT-11); the chevron turns without a transition.

## Forced colours

The rule and the icons use `CanvasText`; the summary keeps the system focus ring (`Highlight`).

## Budget

No JavaScript. About 0.45 KiB of `sc.css` (gzip), most of it the three icon masks.

## Tests

e2e (`sc-official-banner.e2e.ts`): not registered; labelled region on `surface-container`; closed by default with a 44px summary; only the toggle underlined, its 16px chevron turning when open; Enter and Space open and close it; open panel in two columns from 600px and one on phones, 24px icons, the 1px rule, no horizontal scroll; item colours; page margins at 375 / 700 / 1200 / 1440; mirroring in Arabic; works with JavaScript disabled (EN, AR); `hidden`; `describeAxe` closed and open in EN/AR × light/dark.
