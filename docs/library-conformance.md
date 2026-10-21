# Component library conformance with Standard 2.0

| | |
| --- | --- |
| Standard | [Shared Channels UX Standard 2.0](shared-channels-ux-standard.md), draft of 19 October 2026 (commit 545a84a) |
| Library | `components/` (`sc-` web components), branch `feat/standard-2-conformance` |
| Date | 19 October 2026 |

This file lists every requirement in the standard that the component library itself must meet, as opposed to the services that use it, and records how the library stands against each one. Requirements that only a service can meet (naming, journeys, legal review, content it writes) are left out unless the library provides a default that the service relies on.

How it was checked: the standard was read in full; every component's Arabic strings in `src/i18n/components/*.ts` were read against CNT-11 and chapter 9; component CSS was searched for physical properties, letter-spacing, italics, justification and `text-transform`; and every playground page was opened in Helium in English and Arabic with a script that measured every focusable element inside every shadow root (results below each row as evidence).

**Status** values:

- **done**: changed on this branch.
- **met**: the library already conformed; no change.
- **open**: needs a decision or a new component; the reason is given. Nothing was invented.
- **motion session**: a motion requirement, owned by the session on branch `feat/motion-emil`.

## Conformance table

### Chapter 5. Arabic and English

| Requirement | Component | Current behaviour | Change | Status |
| --- | --- | --- | --- | --- |
| LANG-02 | all | Every string a component renders exists in both languages; `defineStrings` fails the build when an Arabic key is missing. | None. | met |
| LANG-04, LANG-05 | `sc-language-switch` | Renders `<a href hreflang lang>` labelled with the other language's own name, no flag, no menu, when `href` is set. Without `href` it renders a `<button lang>` that fires `scSwitch`. | The link is the only documented mode: single-page apps keep `href`, call `preventDefault()` on `scSwitch` and switch in place (readme example and playground updated). The button mode is deprecated (ASR-09): it still works, logs one console warning per page, and goes in the next major version. | done (v1). **v2:** reinstated as a non-status highlight (decision W4): `tone="channel"` renders `channel-action` on `channel-subtle` for labels such as "Life event", and is documented as never carrying a status. |
| LANG-12 | `sc-page` | `sync-document` sets `lang` and `dir` on `<html>`. | None. | met |
| LANG-13 | all | Logical properties only; a search of all component CSS finds no `left`/`right` layout. | None. | met |
| LANG-14 | all | No `row-reverse` and no CSS reordering for direction. | None. | met |
| LANG-15 | `sc-ltr`, components that show LTR values | `sc-ltr` isolates values in markup; components use `<bdi dir="ltr">` or `dir="auto"` on value inputs. | None. | met |
| LANG-17 | `sc-text-input` | `ltr` keeps the value left to right and at the start of the field. | None. | met |
| LANG-18 | `sc-summary-row`, `sc-table` | Values are slotted page content; the service sets `dir="auto"` on free text it shows back. | None. Service-owned. | met |
| LANG-20 | all strings | All digits Latin. | New test in `strings.spec.ts` fails if any Arabic string contains an Arabic-Indic digit. | done |
| LANG-21 | `sc-text-input`, `sc-textarea`, `sc-search`, `sc-date-input`, `sc-date-range` | Only `sc-date-range` parsed Arabic-Indic digits, and only when committing a typed date; the field kept showing what was typed. `sc-text-input`, `sc-date-input`, `sc-textarea` and `sc-search` passed them through to validation and the form. | New `src/i18n/digits.ts` (`toLatinDigits`, `normaliseDigits`). All five components replace Arabic-Indic (U+0660–0669) and Eastern Arabic-Indic (U+06F0–06F9) digits with Latin digits on every input event, keep the caret where it was, and submit and validate the Latin value. No other character changes (Arabic separators ٬ ٫ are left as typed). Unit tests for the helper; e2e tests for `sc-text-input` (an Emirates ID typed in mixed digits) and `sc-date-input`. `sc-textarea` is included because the rule says "inputs"; normalising digits in prose is not translation (LANG-09). | done |
| LANG-22 | `sc-table` | Amount formatting is the service's; `sc-table` sorts by `data-sort-value`. | None. | met |
| LANG-22A | `sc-date-range` | The picker summary joined the two dates with `dateRangeRangeSep` (" – ") in both languages. For a range inside one month the Arabic read "1 – 31 أكتوبر 2026", which displays as "31 – 1". | `dateRangeRangeSep` replaced by `dateRangeSummary`: "{start} – {end}" in English, "من {start} إلى {end}" in Arabic, so every Arabic summary uses words ("من 21 سبتمبر إلى 9 أكتوبر 2026 · 19 يومًا"). New test that no Arabic string has a dash between two numbers or placeholders. Spec updated. | done |
| LANG-23 | `sc-textarea`, `sc-table`, `sc-date-range` | Plural forms via `Intl.PluralRules('ar')` with all six categories. | None. | met |
| LANG-24, mirroring table (5.6) | icons, `sc-back-link`, `sc-link`, `sc-channel-chip`, `sc-service-card`, `sc-date-range`, `sc-step-progress` | Directional icons use `icon-directional` and mirror; `sc-select`'s chevron is rotated, not mirrored; `sc-step-progress` fills from the right (e2e); the date-range arrow points left and Monday is the rightmost column in Arabic. | None. | met |
| LANG-25 | all | Type through the generated mixins, which switch to the Arabic roles on `:host(:lang(ar))`. `sc-language-switch` sets its other-language label from the tokens directly. | None. | met |
| LANG-26 | all | Every Arabic tracking value is 0 in the mixins and in `sc-language-switch`. | None. | met |
| LANG-27 | all | Arabic roles are all 16px or more (tokens). Components set text only through roles. | None. | met |
| LANG-28 | global styles | No italic faces are loaded and `body` sets `font-synthesis: none`, so nothing can be slanted. | None. | met |
| LANG-29, LANG-30 | all | No `text-align: justify`, no tatweel, no `text-transform` in any component. | None. | met |
| LANG-31 | all | One family for both scripts. | None. | met |

### Chapter 6. Accessibility

| Requirement | Component | Current behaviour | Change | Status |
| --- | --- | --- | --- | --- |
| A11Y-04 | `sc-service-card` | The title link's hit area covered the whole card (see CMP-06). | The title link is now `inline-block` with a transparent `::after` that grows its target to at least 44 × 44 without moving the text. e2e test measures it. | done |
| A11Y-04 | `sc-error-summary` | Each error link was 25–29px tall (measured), with 4px between links. | Links are at least 44 × 44 (`min-block-size` and `min-inline-size: --sc-size-target-min`); the list gap is removed so rows touch rather than overlap. | done |
| A11Y-04 | `sc-footer` | Links were 44px tall but "Terms" was 35px wide and "Privacy" 42px (measured). | `min-inline-size: --sc-size-target-min` on the footer's own links and slotted links. | done |
| A11Y-04 | `sc-date-range` | Popover day cells were 40px wide (44px rows). Each typed segment's input was 24–29px tall inside its 54px segment; clicking the "From"/"To" label did nothing. | Columns are 44px; the 40px day circle keeps its look and gets a 44 × 44 target through `::after`. A click anywhere in a segment focuses its input. The two-month area of the popover grows by 56px. Spec updated. | done |
| A11Y-04 | `sc-channel-chip` | Link chips are about 28px tall (measured box) but already grow their hit area to 44px with `::after`. | None. | met |
| A11Y-04 | `sc-radio`, `sc-checkbox`, `sc-table` checkboxes, buttons, fields, app bar, back link, language switch, search, select | 24px boxes sit inside 44px label targets; everything else measured at 44px or more. | None. | met |
| A11Y-04 | `sc-table` | Links that a service puts in body cells were 25–32px tall (measured), inside 44px (compact) or 56px rows. | Decision: cell links are standalone targets. Links in `tbody` cells get a transparent `::after` that grows the target to at least 44 × 44. The link stays inline, so row height does not change (e2e test compares the row with and without the rule, in both densities). | done |
| A11Y-04 | `sc-link` | Inline links take the sentence's size (assessed against 2.5.8, as the standard allows); `standalone` links are 44px. | None. | met |
| A11Y-05 | all except `sc-date-range` days | Shared `.focus-ring`: 3px `--sc-channel-action`, 2px offset painted in `--sc-color-surface`, `:focus-visible` only, `Highlight` in forced colours. | None. | met |
| A11Y-05 | `sc-date-range` | Day buttons drew a 2px ring with a 2px offset and no surface-coloured offset. The "today" ring used a raw `1.5px`. | Day buttons use the shared ring tokens (3px, 2px surface offset, raised above neighbouring days, `Highlight` with no shadow in forced colours); "today" uses `--sc-size-border-control`. | done |
| A11Y-05 | `sc-page`, `sc-app-bar` (sticky) | Nothing stopped a sticky app bar covering focused content. A sticky bar inside `<div slot="header">` (the standard's page shell in 11.1) did not stick at all: it stuck only within its wrapper. | With `sync-document`, `sc-page` sets `scroll-padding-block-start` on `<html>` to the sticky bar's height plus `--sc-space-8`, kept current with a ResizeObserver and removed (restoring any earlier value) when the bar goes, stops being sticky or the page is removed. A `<div slot="header">` wrapper gets `display: contents`, so the bar sticks to the whole page. e2e tests: padding value, a focused link scrolls clear of the bar, clean-up, the wrapped bar stays at the top. Without `sync-document`, services set the padding themselves (readme). | done |
| A11Y-06 | `sc-status-tag`, `sc-callout`, fields | Status has words and a dot or icon; callouts have a hidden tone word. | None. | met |
| A11Y-07 | glass components | `sc-app-bar`, `sc-back-link` and `sc-language-switch` become solid surface under `prefers-reduced-transparency`; every component has forced-colours styles (directly or through `field.css`/`choice.css`). | None. | met |
| A11Y-07, MOT-15 | all | Reduced motion. | See the motion rows. | motion session |
| A11Y-08 | `sc-button` | `disabled` exists; the readme says not to use it for validation. | None. | met |
| A11Y-09 | all | Every component's e2e suite runs axe in English and Arabic, light and dark. | New and changed tests keep this. | met |

### Chapter 8. Visual foundations

| Requirement | Component | Current behaviour | Change | Status |
| --- | --- | --- | --- | --- |
| FND-02 | all | `npm run check:literals` passes. | Still passes after these changes. | met |
| FND-11, FND-15 | `sc-date-range` | A raw `1.5px` border width for "today". | Token `--sc-size-border-control`. The 40px day circle and 12px month shift stay as component values (no token exists). | done |
| FND-20 | glass components | See A11Y-07. | None. | met |
| FND-21 | `sc-date-range` | Draws its own calendar icon (`sc-date-range/calendar-icon.tsx`) because `src/icons` is owner-only; the standard says icons come from the shared set and are not drawn locally. | None. Adding `calendar` to `src/icons/` is for the icon set's owner. | open |
| OQ-26 | token pipeline | `check:contrast` checked `--sc-channel-action` against `--sc-color-surface` (3:1) only. | `scripts/check-contrast.mjs` also checks action against `canvas` and `grouped` (3:1), for every channel in light and dark, covering both sides of the focus ring. All pass; the tightest margin is unchanged (1.037×, light). | done |
| OQ-20 | tokens, `sc-link` | Visited links used `--sc-channel-ink`; there was no visited-link token. | New channel role `link-visited` (`--sc-channel-link-visited`, also in Tailwind, Swift, Kotlin and Paper outputs), set to each channel's ink in light and dark. `sc-link` uses it. `check:contrast` checks it at 4.5:1 on surface, canvas and grouped. Choosing a distinct visited colour stays open: it must pass 4.5:1 everywhere and stay out of the teal hue range (FND-04). | done |

### Chapter 9. Content design

| Requirement | Component | Current behaviour | Change | Status |
| --- | --- | --- | --- | --- |
| CNT-11 | `sc-skip-link` | Default label "انتقل إلى المحتوى الرئيسي" (imperative). | "الانتقال إلى المحتوى الرئيسي". | done |
| CNT-11, CNT-18 | `sc-date-range` | Imperatives: "اختر التاريخين" (button), "اختر تاريخ البداية/النهاية" (prompts), "اختر الآن تاريخ النهاية" (announcement), "أدخل تاريخ البداية/النهاية", "اختر مدة لا تزيد/تقل على…" (errors). | Verbal nouns for the button ("اختيار التاريخين"), "يُرجى" with a verbal noun for prompts, the announcement and errors ("يُرجى إدخال تاريخ البداية", "يُرجى اختيار مدة لا تزيد على {days}"). Spec table updated. | done |
| CNT-11, CNT-18 | `sc-date-input` | "أدخل التاريخ", "أدخل تاريخًا صحيحًا"; English "Enter a real date" did not follow the "Not a real date" template. | "يُرجى إدخال التاريخ"; "The date must be a real date" / "يجب أن يكون التاريخ تاريخًا صحيحًا". | done |
| CNT-11 | `sc-radio-group` | "اختر أحد الخيارات". | "يُرجى اختيار أحد الخيارات". | done |
| CNT-11, CNT-18 | `sc-checkbox-group`, `sc-checkbox` | "اختر خيارًا واحدًا على الأقل", "حدّد هذا المربع للمتابعة". | "يُرجى اختيار خيار واحد على الأقل", "يُرجى تحديد هذا المربع للمتابعة". | done |
| CNT-11 | all strings | No automated guard. | New test in `strings.spec.ts` fails on an Arabic imperative or gender-marked second-person verb from a list of common ones (channel names excepted, see Issues). | done |
| CNT-11 | playground pages, readmes, tests | About 80 imperative or gender-marked forms in example content and notes: "أدخل…", "اختر…", "ادفع المخالفات", "ابدأ الآن", "راجع إجاباتك", "ماذا تريد أن تفعل؟", "كيف تريد…", "لماذا تلغي…", "حاول مرة أخرى", "لا تدفع مرة أخرى", "تأكد", "تحتاج إلى"… | Rewritten with verbal nouns, "يُرجى", "يمكنك", "يلزمك" or impersonal forms across 25 playground pages and the affected readmes, specs and tests ("البدء الآن", "دفع المخالفات", "مراجعة الإجابات", "بماذا يمكننا مساعدتك؟", "يُرجى المحاولة مرة أخرى"). | done |
| CNT-17 | `sc-error-summary` | Default heading "يوجد خطأ" ("There is an error") while English says "There is a problem"; CNT-17 avoids "error occurred". | "توجد مشكلة", matching the English and the standard's own "توجد مشكلة في الخدمة". | done |
| CNT-12, 9.6 | `sc-status-tag`, playground, `sc-table` readme and spec | Tones match 9.6. Examples used words outside the vocabulary: "مدفوع" for Paid (vocabulary: "تم الدفع"), "مطلوب إجراء" (vocabulary: "إجراء مطلوب"), "Unpaid / غير مدفوعة" (vocabulary: "Not paid / بانتظار الدفع"), "مدفوعة", "Renewed", "فشل الدفع" (vocabulary: "تعذّر الدفع"). | Examples now use the vocabulary. The `sc-status-tag` readme lists the whole 9.6 vocabulary with Arabic and tone. | done |
| 9.6 | `sc-status-tag` | Had a fifth tone, `channel`, shown with "New / جديد", which is not a status in 9.6. | `tone="channel"` is deprecated (ASR-09): it still renders, logs one console warning per page, and goes in the next major version. Removed from the readme examples and the playground's seven-channel section; the playground keeps one cell labelled "deprecated". A "New" highlight, if research shows a need, is a separate badge for the backlog. | done |
| CNT-13 | all strings | Arabic comma and question mark used; no full stops on labels or buttons. | None. | met |
| CNT-16 | all strings | Arabic strings, including the rewrites on this branch, have not been reviewed by a qualified Arabic content designer. | None. Review needed before release. | open |

### Chapter 10. Components

| Requirement | Component | Current behaviour | Change | Status |
| --- | --- | --- | --- | --- |
| CMP-04 | field components | Label, hint and error in the shadow root, linked inside it. | None. | met |
| CMP-05 | `sc-error-summary` | Already moves focus to itself with `tabindex="-1"` and has no `role="alert"` (merged in `fix/a11y-error-summary-service-card`). | None. | met |
| CMP-06 | `sc-service-card` | Only the title was the link and the card was not wrapped in `<a>`, but the link's hit area was stretched over the whole card (`::after { inset: 0 }`), plain chips passed clicks to it, and the focus ring wrapped the card. | The link is the title only: no stretched area, its own focus ring, 44 × 44 target, hover underlines the title and fills the chevron (fine pointers only), a chip link is a separate link and a plain chip is just text. Readme, playground and e2e tests updated. | done |
| CMP-06 | `sc-service-card` | The end chevron and the card shadow suggested a clickable card. | Card hover shadow removed (first commit) and the end chevron removed, so nothing on the card looks like a link except the title. The `chevron` part is gone (breaking for anyone styling `::part(chevron)`; the library is 0.x). Readme, COMPONENTS.md and playground updated. | done |
| 10.3 known gaps | `sc-skip-link`, `sc-page` | `sc-skip-link` defaulted to `#main`; `sc-page` renders `<main id="main-content">`. | Default `href` is now `#main-content`. Readme, playground and tests updated. Pages that relied on the old default and have `<main id="main">` must set `href="#main"` or rename the id (this is a behaviour change worth a minor-version note). | done |
| TPL-13 | `sc-summary-row` | An empty row rendered an empty value. | A row with no slotted content and no `value` shows "Not provided" / "لم يتم تقديمه" (new string `summaryRowNotProvided`). Spec test; readmes updated. | done |
| TPL-02, Q-04 | `sc-error-summary` | The page title prefix "Error: " is set by the service. | None. Service-owned. | met |
| Q-02 | field components | `optional` adds "(optional)" / "(اختياري)" on every field and group. | None. | met |
| 10.4 | planned components | `sc-file-upload`, `sc-combobox`, `sc-notification-banner`, `sc-panel`, `sc-task-list`, `sc-details`, `sc-cookie-banner`, `sc-timeout-warning` and the rest do not exist. | None. New components need the contribution process (18.1). | open |

### Motion (chapter 8.7)

Not changed on this branch. Owned by the session on `feat/motion-emil`.

| Requirement | Component | Current behaviour (on main) | Status |
| --- | --- | --- | --- |
| MOT-04, MOT-05, OQ-22, OQ-23 | tokens; `sc-service-card`, `sc-date-range`, `sc-error-summary` and others | Colour transitions and on-screen movement use `--sc-easing-standard`; `--sc-easing-exit` is ease-in. | motion session |
| MOT-06, MOT-07, OQ-29 | tokens, `sc-date-range` sheet | `--sc-duration-slow` is 320ms; exits use 120ms. | motion session |
| MOT-13 | `sc-error-summary`, others | Some hover styles are gated by `(hover: hover)` only, without `(pointer: fine)`. | motion session |
| MOT-15, OQ-24 | tokens | Reduced motion sets every duration to 0ms. | motion session |
| OQ-25 | tokens, `sc-spinner` | Spinner rotation speed. | motion session |
| OQ-28, MOT-02 | `sc-date-range` | Popover opened from the keyboard must appear instantly. | motion session |
| MOT-09 | `sc-date-range` day buttons | The new focus-ring rule adds no transition; whether `:focus-visible` should also set `transition: none` is for the motion pass. | motion session |

## Issues in the standard

These are errors or gaps in `docs/shared-channels-ux-standard.md` found while checking the library. The standard was not edited.

1. **10.3 is out of date on the error summary.** It says `sc-error-summary` "currently sets both `tabindex="-1"` and `role="alert"`". On main (merged in `fix/a11y-error-summary-service-card`) it already moves focus without `role="alert"`, so CMP-05 is met and the paragraph and its workaround can go.
2. **10.3 will be out of date once this branch merges.** The service-card stretch, the imperative Arabic strings and the skip link's `#main` default are fixed here; the "Known gaps" list and the "Set `href="#main-content"`" workaround can go.
3. **Channel names and CNT-11.** "استثمر في دبي" and "ابنِ في دبي" (3.1) are imperatives, and "ابنِ" carries a diacritic (LANG-32). They are fixed proper names, which CNT-14 implies are kept as they are, but CNT-11 has no exception for proper names. A sentence saying channel and brand names are exempt would stop reviewers (and the new string test) flagging them.
4. **Date ranges in 9.4 and LANG-22A disagree in Arabic.** 9.4 allows an en dash in compact summaries ("21 Sep – 9 Oct 2026") and gives no Arabic compact form. In Arabic a same-month range ("1 – 31 أكتوبر") is a dash between two numbers, which LANG-22A forbids. The style guide should say that Arabic compact summaries use words too ("من 1 إلى 31 أكتوبر 2026").
5. **LANG-05 says the switch is "never a button"**, while LANG-08 describes single-page apps switching language without a page load. The library now keeps the link and lets the app cancel it and switch in place; the standard should say that this is the intended single-page pattern.
6. **10.2 lists a `channel` tone for `sc-status-tag`.** In v2 this is kept as a non-status highlight (W4), not a status. 10.2 should say so.
7. **FND-21's icon list lacks a calendar icon**, which `sc-date-range` needs and today draws locally.
8. **A11Y-04 does not say whether a link inside a table cell is "standalone".** The library now treats it as standalone (44 × 44 without changing row height); A11Y-04 should say so.
9. **The page shell in 11.1 wraps a sticky `sc-app-bar` in `<div slot="header">`**, where it could not stick. Fixed in `sc-page` (the wrapper now has `display: contents`); the standard can keep its example.

## Checks run

On branch `feat/standard-2-conformance`, in Helium:

- `npm run build` (repo root): tokens built, `check:contrast`, `check:teal`, `check:no-hex` pass.
- `components/`: `npm run build`, `npm run check:literals` and `npm test` (spec and e2e) pass.
- Every playground page renders in English and Arabic with no console errors, and no Arabic-Indic digits appear in any rendered page.
