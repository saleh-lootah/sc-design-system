# Fact check: Shared Channels User Experience Standard 2.0

Reviewed: `docs/shared-channels-ux-standard.md` (2,157 lines, version 2.0, draft dated 22 October 2026). Review date: 21 October 2026. Line numbers refer to that file.

## Summary

The standard is accurate on almost all of its numbers. I checked over 120 internal claims against the token files, `perf-budgets.json`, the component specs and the component source, mostly with scripts. Every token name it uses exists in the generated CSS. Every `sc-` tag it names either exists or is marked planned. Every requirement identifier it cites is defined, and every in-page anchor resolves. All 30 type-scale entries match the tokens to the pixel. All system and channel colour roles match in light and dark. All size, space, radius, layout, motion and budget values match.

The problems are of four kinds:

1. **Stale statements about the library.** The "Known gaps" paragraph describes two Arabic strings that have since been fixed. The motion table describes `sc-date-range` behaviour that the component does not have: a keyboard-instant popover, and a scrim timed to `--sc-duration-base`. The icon rule describes optical sizing that the icon manifest does not use.
2. **One external attribution is wrong.** CMP-05 says that dropping `role="alert"` from the error summary "follows GOV.UK Design System practice". GOV.UK's error summary does carry `role="alert"`, on an inner element.
3. **Imprecise WCAG and legal wording.** The 2.5.8 inline exception is misdescribed. The Law No. (1) of 2025 requirement is put more broadly than the law's text.
4. **Open questions that can now be answered.** OQ-1 (WCAG 2.2 dates), OQ-2 (WCAG2ICT location) and part of OQ-10 (dirham symbol in Unicode) can be closed.

Counts: **6 Wrong, 13 Imprecise, 3 Unverified** (22 findings).

## Findings

| # | Severity | Line | Claim (quote ≤ 15 words) | What's actually true + source | Fix |
| --- | --- | --- | --- | --- | --- |
| 1 | Wrong | 1067 | "Two default Arabic strings use the imperative … `sc-utility-bar` ("اتصل") and the sign-in hint" | Both have been fixed. The utility bar's call item is now "الاتصال" (`components/src/i18n/components/sc-utility-bar.ts`, `utilityContact`). The header hint is now "تسجيل الدخول يتيح عرض مهامك ومدفوعاتك والخدمات المحفوظة." (`sc-site-header.ts`, `headerSignInHint`). No source file contains "اتصل" or "سجّل". | Delete the "Known gaps" paragraph, or replace it with "None known". |
| 2 | Wrong | 1038 | "The summary MUST NOT also carry `role="alert"` … This follows GOV.UK Design System practice." | GOV.UK Frontend's error summary moves focus to the summary and also keeps `<div role="alert">` as a child, to avoid a race with the focusing script (`govuk-frontend/packages/govuk-frontend/src/govuk/components/error-summary/template.njk`, main branch). The rule itself is defensible: a W3C WAI-IG thread from August 2023 reports duplicate announcements from alert plus focus. But it departs from GOV.UK rather than following it. | Replace the sentence with: "GOV.UK Frontend keeps an inner `role="alert"`; this standard drops it because focus already causes the announcement." |
| 3 | Wrong | 764 | "`sc-date-range` bottom sheet … the scrim fades in over `--sc-duration-base`" | The scrim fades in over `--sc-duration-slow` (280ms), in step with the sheet, and out over `duration-slow × 0.8`. Sources: `components/specs/sc-date-range.md` §Motion "Sheet open" ("The scrim fades in with it over 280ms"), and `sc-date-range.css` (the `::backdrop` transitions use `--sc-duration-slow`). | Change it to "the scrim fades with it over `--sc-duration-slow`". |
| 4 | Wrong | 763 | "`sc-date-range` popover … opened from the keyboard, it appears instantly" | The spec's Motion table has no keyboard-open row for the popover. The component CSS has no keyboard branch for `:popover-open`. OQ-28 (line 1976) lists this exact behaviour as still to be confirmed. The motion table states it as current behaviour, which contradicts OQ-28. | Change it to "keyboard-instant opening is not yet implemented ([OQ-28](#open-questions))", or fix the component first. |
| 5 | Wrong | 676 | "Material Symbols, Outlined style (weight 400, grade 0, optical size matched to the rendered size" | The manifest uses one optical size, 24, for every icon at every rendered size. `components/src/icons/icons.json` `$comment` reads "Outlined, weight 400, grade 0, optical size 24". | Change it to "optical size 24". If matching is the intent, record it as a planned change. |
| 6 | Wrong | 194 | "The components take them from one file (`src/i18n/components/channel-names.ts`)" | Three files define the seven names: `channel-names.ts`, `sc-channel-chip.ts` (`channelChip*`) and `sc-step-list.ts` (`stepListChannel*`). The values are identical today, but the "one file" guarantee does not hold for the chip and the step list. The app bar, switcher, footer and network strip do use `channel-names.ts`, through `common.ts` and `channels.ts`. | Either make the chip and step list import `channel-names.ts`, or limit the sentence to the four components named. |
| 7 | Imprecise | 384 | "Links inside running text are assessed against WCAG 2.5.8 (24 × 24 px or enough spacing)" | SC 2.5.8 has an Inline exception: a target in a sentence or block of text is exempt, not held to 24 × 24 or spacing (W3C, *Understanding SC 2.5.8 Target Size (Minimum)*). | Change it to "Links inside running text fall under WCAG 2.5.8's inline exception and are not held to a minimum size". |
| 8 | Imprecise | 245, 1226, 1977 | "the usage manual or approval that Law No. (1) of 2025 requires" | The law exists and governs the emblems of Dubai and the Government of Dubai (Dubai Legislation Portal; Dubai Media Office, 5 February 2025). Article 7 requires use under a manual prepared by the General Secretariat of the Executive Council and approved by the Chairman of the Executive Council. Article 6(b) requires the Chairman's special authorisation only for non-government entities and for government entities run on a commercial basis. The law does not say in so many words that a government entity needs an approval before publishing. | Change it to "the usage manual required by Article 7 of Law No. (1) of 2025, and any authorisation under Article 6(b) if it applies". Change "artwork from The Executive Council" to "artwork as set out in the manual of the General Secretariat of the Executive Council". |
| 9 | Unverified | 194 | "These are the official Arabic channel names." | Verified for three channels: دبي الآن, استثمر في دبي and زوروا دبي (Dubai Media Office, Arabic release, 11 May 2025). The same release calls the transport channel "قناة التنقل المشتركة" (Shared Mobility Channel) and the trade channel "القناة الموحدة للخدمات اللوجستية والتجارة". It does not name the justice or construction channels. I found no official source for مواصلات دبي, عدالة دبي, ابنِ في دبي or دبي التجارية. A DP World post uses "دبي التجارية" informally. | Mark the four unverified names as working names, and add an open question for channel owners to confirm them, or add the confirming source. |
| 10 | Imprecise | 1955 | "the date of the original Recommendation (believed to be 5 October 2023) … to be checked" | Both dates can be confirmed. WCAG 2.2 became a W3C Recommendation on 5 October 2023 (W3C WAI news, 2023-10-05). The current edition is dated 12 December 2024 (https://www.w3.org/TR/2024/REC-WCAG22-20241212/). | Close OQ-1, and cite "W3C Recommendation, 12 December 2024 (first published 5 October 2023)" in Appendix E. |
| 11 | Imprecise | 1956, 2125 | "The current URL and title of the W3C guidance … (WCAG2ICT)." | This can be confirmed. The title is *Guidance on Applying WCAG 2 to Non-Web Information and Communications Technologies (WCAG2ICT)*, a W3C Group Note at https://www.w3.org/TR/wcag2ict-22/. It was first published as a Note on 8 October 2024 (W3C WAI news); later editions are dated 21 August 2025 and 11 December 2025 (w3.org/TR listings). | Close OQ-2 and put the URL in Appendix E. |
| 12 | Imprecise | 1964 | "The official status of the new dirham symbol, its Unicode support" | The Central Bank of the UAE introduced the symbol in March 2025. Secondary sources report that it is encoded as U+20C3 in Unicode 18.0, released September 2026 (Wikipedia, "Emirati dirham sign"; The National, 22 September 2026). I did not confirm the code point on unicode.org. Whether services must use the symbol is still open. | Narrow OQ-10 to "whether services must use it, and font and keyboard support". Add the code point once it is confirmed on unicode.org. |
| 13 | Imprecise | 1792 | "Component CSS parsed on a typical page \| 4 KiB gzip" | `perf-budgets.json` holds 4096, but its own comment marks it "PROPOSED (v2-perf, pending approval): 4 KiB, from 3 KiB". `docs/v2/architecture.md` §3 and §3.7 still say 3 KiB. Two of the recorded overrides at line 1784 are also flagged as unapproved: `sc-bottom-nav` 4.5 KiB ("needs approval", `$navComment`) and `sc-date-range` 21 KiB ("Needs the coordinator's sign-off", spec §Budget). | Either approve these and update `architecture.md`, or mark the three values "(proposed)" in the standard. |
| 14 | Imprecise | 582 | "`data-theme` … on any element forces that theme for its subtree (a dark footer…works)" | This holds with `light-dark()`. In the fallback for older engines, channel roles follow the page theme, or a `data-theme` set on the same element as `data-channel`, not one on an ancestor (`docs/v2/migration.md` line 71; `dist/css/tokens.css`, the A1 fallback block). | Add: "In browsers without `light-dark()`, channel roles follow `data-theme` only when it is on the same element as `data-channel`." |
| 15 | Imprecise | 1801 | "Fonts SHOULD load as one family (`Dubai W23`)" | Arabic contexts put a second family name first, "Dubai W23 Arabic" (the same Arabic files), and the language switch uses a third, "Dubai W23 Name" (`tokens/typography.json` `font.family.arabic`; `components/src/global/fonts.css`). The goal, one set of files, holds, but "one family" does not. | Change it to "one set of files under the family `Dubai W23`, with `Dubai W23 Arabic` (the same Arabic files) put first under `lang="ar"`". |
| 16 | Imprecise | 612 | "`title-small` \| Navigation items, the back link…" | Main navigation in `sc-site-header` is set in `label-large` at Medium weight (Bold in Arabic), not `title-small` (`components/specs/sc-site-header.md` part 3). `sc-account-nav` uses `label-medium` below 600px. | Change it to "Navigation items in side and bottom navigation". Alternatively, align the header with the table. |
| 17 | Imprecise | 637 | "`--sc-size-stepper-marker` \| 28px \| Stepper markers" | The full stepper uses 28px markers. The compact stepper uses 24px markers, a size with no token (`components/specs/sc-step-progress.md` lines 18 and 26). | Change it to "Stepper markers (full layout); the compact layout uses 24px". Alternatively, add a token for it. |
| 18 | Imprecise | 620, 1241 | "Only the three display roles carry tracking, and only in English." | The statement is true of the type role tokens. However, the channel network eyebrow ("One network · seven channels") is upper case and tracked 0.08em in English (`components/specs/sc-channel-network.md` part 2). That conflicts with this line and with CNT-07 ("sentence case for every heading, label…"). | Either record the eyebrow as an exception in both places, or set it in sentence case with no tracking. |
| 19 | Imprecise | 1966 | "commonly 70 characters per segment with UCS-2 encoding" | 70 UCS-2 characters fit in a single-part SMS. Once a message is split, each segment carries 67, because of the concatenation header (Twilio, *What is the SMS character limit*; Namirial SMS encoding docs). | Change it to "70 characters for a single SMS, 67 per segment once concatenated". |
| 20 | Imprecise | 7 | "Date \| 22 October 2026" | This review is dated 21 October 2026, so the draft carries tomorrow's date. | Confirm the intended date, or use the date of the last edit. |
| 21 | Unverified | 1059 | "the UAE PASS button specification sets … colours, fingerprint mark, English and Arabic labels, sizes, variants and dark-mode treatment" | I did not verify what the UAE PASS kit specifies. OQ-3 already treats it as unknown. | Change it to "as the UAE PASS button guidelines set it ([OQ-3](#open-questions))", without listing contents until the kit has been seen. |
| 22 | Unverified | 1232 | "the Happiness Meter / "مؤشر السعادة"" | The Happiness Meter is real and Dubai-run (Smart Dubai, *Happiness Meter*; ITU U4SSC case study). I did not find an official page that shows the Arabic wording. | Confirm with Digital Dubai and record it in the glossary (CNT-15). |

### Source inconsistencies found along the way (not errors in the standard)

- `docs/v2/foundations.md` line 68 and D9 (line 776) say "There is no fallback for older engines". The token build does emit one (`dist/css/tokens.css`, the A1 fallback block). `decisions.md` A1, `migration.md` and the standard (lines 413 and 582) all describe that fallback. `foundations.md` is the stale one.
- `docs/v2/architecture.md` §3 gives the global stylesheet budget as ≤ 7 KiB. `perf-budgets.json` (`globalCssGzip`) and the standard both give 9 KiB. The JSON is authoritative, as the standard says, but `architecture.md` should be brought into line.

## Claims verified as correct

**WCAG and accessibility**

- Appendix A lists 55 criteria (31 A + 24 AA), every number, name and level as in WCAG 2.2. All 55 Understanding links return HTTP 200. 4.1.1 Parsing is obsolete and removed in 2.2. 2.4.8 is AAA.
- 2.2.1: at least 20 seconds to extend, at least ten times; security is not an exception. 2.2.2: more than five seconds. 2.3.1: three flashes in a second. 1.4.10 reflow at 320 CSS px. 1.4.12, all four values. 2.5.7 dragging. 2.4.11 focus not obscured, AA. 3.2.6 Consistent Help, A. 3.3.7 Redundant Entry, A. 3.3.8 Accessible Authentication (Minimum), AA. 1.3.5 and `autocomplete`.
- PLAT-09: 44 pt (iOS) and 48 dp (Android) minimum targets.
- The Core Web Vitals thresholds: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1, at the 75th percentile.

**Browser and CSS**

- `light-dark()` needs Chrome and Edge 123, Firefox 120 and Safari 17.5 (Baseline 2024; caniuse, MDN). It works because `tokens.css` sets `color-scheme: light dark` on the root.
- The token build does emit a `prefers-color-scheme` / `[data-theme]` fallback under `@supports not (color: light-dark(...))`.
- The cascade layers are `sc.reset, sc.tokens, sc.base, sc.components, sc.utilities` (`migration.md` §1). The example `@layer base, sc, components, utilities;` matches migration.md.

**Unicode and Arabic**

- The code points are right: U+2066 LEFT-TO-RIGHT ISOLATE, U+2069 POP DIRECTIONAL ISOLATE, U+200E and U+200F (the directional marks) and U+0640 TATWEEL.
- LANG-22A is correct under UAX #9: "1–20" in a right-to-left paragraph displays as "20–1", because rule N1 treats the numbers as R for the neutral dash.
- The Arabic plural categories (zero, one, two, few, many, other) and the examples يومان, 3 أيام, 15 يومًا and 100 يوم are correct.
- The Arabic comma, semicolon and question mark are right. Arabic SMS is UCS-2.

**UAE and Dubai**

- The Emirates ID is 15 digits starting 784, written 784-YYYY-NNNNNNN-C.
- A UAE IBAN is 23 characters: AE, 2 check digits, a 3-digit bank code and a 16-digit account number. The example AE07 0331 2345 6789 0123 456 is the standard published example (Wise; CBUAE IBAN page).
- A Makani number is 10 digits, usually written as two groups of five.
- The +971 4 landline format and the +971 50 mobile format are correct. Dubai time is GST, UTC+4, with no daylight saving.
- Law No. (1) of 2025 exists and regulates the emblems of Dubai and the Government of Dubai. It replaces Law No. (17) of 2023.
- The Shared Digital Channels initiative has seven channels and was launched in May 2025.
- The English names Dubai Now, Invest in Dubai and Visit Dubai are verified, with their Arabic forms.
- OQ-12's figure of 70 UCS-2 characters for a single SMS is correct.

**GOV.UK and bibliography**

- These URLs all return HTTP 200: the GOV.UK "Naming your service" page, the Service Standard, the Design System, web.dev Vitals, designtokens.org, UAX #9, the ARIA APG, RFC 2119 and stenciljs.com.
- github.com/emilkowalski/skills contains `emil-design-eng`, `animate`, `review-animations`, `animation-performance`, `apple-design` and `mobile-native`.
- Material Symbols is licensed under Apache 2.0.

**Internal: colour**

- The system roles in the table (lines 534 to 554) match `tokens/color.json` and `tokens/color.dark.json` in both themes, including the scrim (50% and 64%) and the focus ring (`neutral-10` and `neutral-100`).
- The channel roles match: tone 40 for actions (35 for Trade), hover and pressed 5 and 10 tones darker, container 90/30, on-container 30/90, subtle 95/20, and `channel-on-action` `neutral-100`/`neutral-10`.
- The tints are tone 95 and 40 in light, and 20 and 80 in dark.
- `check:teal` uses hue 160° to 215° and chroma above 0.015 (`scripts/check-teal.mjs`).
- `check:no-hex` scans the CSS and Tailwind outputs.
- The iOS and Android outputs carry the OKLAB source in comments.
- Channel action contrast is identical across hues: 6.46:1 on white for six channels, and 7.78:1 for Trade at tone 35.
- The control outline is at least 3:1 on every surface (3.89:1 at worst, dark on `surface-container-high`).
- The disabled pair is 3.85:1 in light and 4.15:1 in dark.
- `check:contrast` passes 392 pairs.
- `--sc-opacity-hover` is 8% and `--sc-opacity-pressed` is 12%.

**Internal: type**

- All 15 roles in English and Arabic match the tokens in size, leading in px (computed from the ratios), weight and tracking. Display tracking is −0.02, −0.015 and −0.01em, and every Arabic role has 0 tracking.
- The FND-13 leading ranges are correct.
- The English minimum is 14px and the Arabic minimum is 16px.
- The weights are 400, 500 and 700, and `font-synthesis: none` is set.
- The digits are tabular (`foundations.md` TYP-08).

**Internal: space, size, shape and layout**

- The spacing scale has 17 steps.
- All 16 size tokens match, including `border-control` 1.5px, `strip` 4px and `measure` 680px.
- The radii are 4, 6, 8, 12, none and full.
- The breakpoints are 0, 600, 1024 and 1440. The columns, gutters and margins match. The container is 1280px wide and the reading container 680px.

**Internal: motion**

- The durations are 0, 120, 150, 200, 160, 280 and 600ms. All five easing curves are right.
- `--sc-scale-press` is 0.97 and `--sc-scale-enter` is 0.96.
- Under reduced motion, spin becomes 0ms and both scales become 1.
- The modal's 200/160ms (dialog) and 280/224ms (sheet) timings match the spec.
- The flick threshold of 0.11 px/ms matches.
- The table selection bar rises 8px over 200ms and leaves over 160ms.
- The date-range month change has a 12px shift.
- The switcher and account menu are keyboard-instant.
- The notification list's fade is pointer-only.

**Internal: budgets**

- The core is 14 KiB, `sc.css` 9 KiB, shadow helpers 1.5 KiB, a component 4 KiB and a form field 7 KiB.
- Every recorded override at line 1784 matches `perf-budgets.json`, including `sc-breadcrumbs` at 4,224 B.
- Each font file is 32 KiB or less. The actual subsets are 21 to 30 KB.
- Page fonts are 75 and 100 KiB. Page JS is 30 KiB.
- Total transfer is 115 and 140 KiB, content visible in 1.2 s or less, CLS 0 (0.005 or less measured), TBT 0 ms, longest task under 50 ms, and 10 requests or fewer (`architecture.md` §3.7).
- The Slow 4G profile is 1.6 Mbps, 750 Kbps and 150 ms (`measure-runtime.mjs`).
- `check:budget` measures fonts in Helium.
- `sc-preload.html` is generated by the build.

**Internal: components**

- Every `sc-` tag cited exists in `components/src/components/` or is marked planned.
- These props and values match the source:
  - `sc-button` variants: primary, secondary, tertiary, destructive and handoff.
  - `sc-button`: `href`, `loading` and `icon="arrow-forward"`.
  - `sc-link`: `standalone` and `external`.
  - `sc-text-input`: `ltr`, `width` (full, 2, 3, 4, 5, 10 and 20), `prefix-text`, `inputmode` and `heading-level`.
  - `sc-date-input`: `autocomplete`.
  - `sc-summary-row`: `action-href`.
  - `sc-footer`: the `simple` and `grouped` variants, and the help, accessibility, privacy, cookies and terms links.
  - `sc-page`: `channel` and `sync-document`.
  - `sc-app-bar`: `sticky`.
  - `sc-modal`: `alert` and `countdown`.
  - `sc-table`: `density="compact"` (44px rows).
  - `sc-status-tag` tones, including `channel`.
  - `sc-callout` tones.
  - `sc-empty-state`: `variant="success"`.
  - `sc-card`: `outlined` and `filled`.
- `sc-error-summary` takes `tabindex="-1"`, has `role="group"` and no alert.
- The skip link targets `#main-content`, which is the `<main>` that `sc-page` renders.
- These strings match:
  - "There is a problem" / "توجد مشكلة"
  - "Unread:" / "غير مقروء:"
  - "Choose a channel:"
  - "Government of Dubai channels" and "You are here"
  - "Announcement"
  - "Help and feedback" / "المساعدة والملاحظات"
  - "Helpful information" and "Legal" in both languages
  - "Not provided" / "لم يتم تقديمه"
  - "(optional)" / "(اختياري)"
  - "Showing {from} to {to} of {total}" / "عرض … إلى … من"
  - "Also on" / "متوفر أيضًا في"
  - "On" / "على"
  - "Skip to main content" / "الانتقال إلى المحتوى الرئيسي"
- `Intl.PluralRules('ar')` is used in `sc-textarea` and `sc-table`.
- Chrome geometry matches the specs:
  - The app bar has a 4px rule and a 1px rule.
  - The header has a 3px current bar, a compact layout below 1024px, and a menu that opens with focus on its close button.
  - The lockup is 40px tall.
  - The UAE PASS placeholder is black, 56px tall and the same everywhere.
  - Dismiss buttons are 44px.
  - The bottom nav has three to five items and an inset ring.
  - The account nav scrolls sideways below 600px.
  - The modal becomes a sheet below 600px.
  - Breadcrumbs collapse to "Back to {parent}" below 600px.
  - The network tiles have a 4px top rule.
  - The stepper shows a check, a halo and `aria-current="step"`.
  - The calendar puts Monday in the rightmost column in Arabic.
- The icon mirror flags match the table, including `help` and `logout`, which mirror.
- Every referenced requirement ID, OQ number and in-page anchor resolves. OQ numbers are not reused.
- The referenced files exist: `MOBILE.md`, `CONVENTIONS.md`, `CONTRIBUTING.md`, `COMPONENTS.md`, `docs/ux-standard-review.md`, `docs/ux-standard-changes.md`, `scripts/generate-palettes.mjs`, `src/icons/icons.json`, the `dist/ios` and `dist/android` token files, and `dist/tailwind/theme.css`.
- Version 1.0 was dated 19 October 2026 (`ux-standard-review.md`).
