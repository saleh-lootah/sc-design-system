# sc-date-range · specification

Status: rebuilt for v2 by C3 (Wave 2b). Behaviour as designed for v1 (below); visual rules: `docs/v2/component-language.md` A15, read through the role table in `docs/v2/decisions.md`. Code: `src/components/sc-date-range`.

## v2 · encapsulation and changes

**Light DOM (Stencil `scoped`)**, decision A2 and architecture §3.1 ("`sc-date-range` (its inputs)"). The fieldset, the two native segments, the calendar button, the popover (`popover="manual"`, top layer) and the bottom sheet (`<dialog>`, `showModal()`) are children of the host. Every class is prefixed `.sc-date-range__` because the picker sits in the page's DOM. IDs are per instance (`sc-date-range-<n>-start`, `-end`, `-hint`, `-error`, `-title`, `-month-<y>-<m>`).

- **Form:** two hidden inputs submit `name-start` and `name-end`; the first problem is a native validity error (`setCustomValidity`) on the segment it concerns; `invalid` (captured on the host) shows the component's own message. No `ElementInternals`.
- **Events:** the segments' native `change` is stopped; the host dispatches one native `change` (and `scChange`) per committed range.
- **Strings:** its own `sc-date-range.ts`, with the per-instance `strings` overrides in `overrides.ts` beside it (no dependency on `sc-table`).

| v2 visual change | Value |
| --- | --- |
| Field frame | 56 tall (`size-control-primary`), radius 8, 1.5px `outline`; the From/To captions are label-small in `on-surface-variant`, the values body-large with no block padding (two lines fit 56). The arrow is 24px, 12 from each value; the calendar button is 6 from the inline-end edge |
| Focus | U1 ring (neutral `focus-ring`, 3px), inset on the focused segment since the two segments share one frame; outside every other control |
| Popover | `surface`, radius 12 (`radius-card`), 1px `outline-variant`, `elevation-2`, padding 20 |
| Day cells | 44px circles (`size-target-min`), numbers title-small (17/22 EN); band 44 high in `channel-subtle` (component-language "channel-container"); preview band `surface-container`; today a 1.5px `outline` ring; ends `channel-action` / `channel-on-action`; unavailable `on-disabled` (3.85:1), no opacity |
| Presets | B18 filter toggles: 40 tall with a 44 target, pill, 1.5px `outline`, 12 apart; on: `channel-action` with an 18px check 8 from the label |
| Sheet | top radius 12, a 36 × 4 grabber in `outline-variant`, title-medium heading, `scrim` backdrop, slides on `easing-drawer` over `duration-slow` (280ms), exits 20% faster |
| Month title | title-medium; weekday heads label-small `on-surface-variant` |

The rest of this document is the v1 behaviour specification, which v2 keeps.

`sc-date-range` lets someone choose a start and an end date that relate to a calendar. Examples:
- filtering payments or fines between two dates
- the dates of a hotel stay on Visit Dubai
- how long a permit should last

For a single date people already know, such as a date of birth or a policy start date, use `sc-date-input`. People type those faster than they find them in a calendar.

## Anatomy

### Field (closed)

| # | Part | Notes |
| --- | --- | --- |
| 1 | Legend | `label-m`; the fieldset legend, as in `sc-date-input` |
| 2 | Hint | `hint` role, `muted`. Example: "For example, 21 9 2026". Error text sits between the hint and the field. |
| 3 | Field frame | 54 high (`control`), `radius-field` (14), 1px `control` border on `surface`. It holds two segments separated by an arrow glyph: → in LTR, ← in RTL. |
| 4 | Start and End segments | Each is a native text input that accepts typed dates (`inputmode="numeric"`, at least 16px). A small `caption-s` muted label sits above each value ("From" / "To" · "من" / "إلى"). On blur the value is formatted ("21 Sep 2026"). Empty segments show "Start date" / "End date" in `muted`. |
| 5 | Calendar button | 44×44 target at inline-end, with a calendar icon in `ink`. Its label is "Choose dates", or "Choose dates, 21 September to 9 October 2026" when a range is set. It opens the picker. |

### Picker (open)

On medium and wider screens the picker is a popover anchored below the field.

- **Container:** `surface`, `radius-panel` (24), elevation 3, padding `space-20`.
  - It is aligned to the field's inline-start edge, 8px below it.
  - It flips above the field when there is no room below.
- **Presets (optional):** a column at inline-start, 168 wide, holding quiet list buttons with `label-m`:
  - Today
  - Last 7 days
  - Last 30 days
  - This month
  - Last month
  - This year
  - The selected preset has a `fill-selected` pill and `ink-strong` text.
  - The list is configurable: a booking calendar uses "This weekend" and "Next 7 nights" instead.
- **Months:**
  - Two months side by side when there are at least 720px; otherwise one.
  - Month heading: `title-s`, `ink-strong` ("September 2026" · "سبتمبر 2026"), with previous and next icon buttons (36 circles, `fill-quiet`, chevrons). Each button is a 44 × 44 target (A11Y-04) with the 36 circle drawn inside it, so the extra target is invisible and doesn't meet the month title or a neighbour.
  - Previous sits above the first month at inline-start, and next above the last month at inline-end.
- **Weekday row:** `caption` in `muted`; the week starts on Monday, the UAE working week.
  - English: Mo Tu We Th Fr Sa Su.
  - Arabic: single letters ن ث ر خ ج س ح, each with its full name as the accessible name.
- **Day grid:**
  - 7 columns of 44, with 40px day circles. Each row is 44 high, so every day is a 44 × 44 target (A11Y-04).
  - There are always 6 rows, so the height never jumps between months.
  - Days outside the month are blank; they are not greyed numbers.
- **Footer** (above a hairline `rule`):
  - At inline-start, a summary in `body-s` `muted`: "21 Sep – 9 Oct 2026 · 19 days".
  - At inline-end, two buttons: "Clear" (tertiary) and "Apply" (primary, in the channel colour).

On phones (compact, below 600px) the picker is a bottom sheet. See "Responsive".

## Day cell states

| State | Treatment |
| --- | --- |
| Default | `body-s` medium, `ink`, tabular figures |
| Today | 1.5px `control` ring around the 40 circle. Its accessible name ends with ", today". |
| Hover (fine pointer only) | `fill-quiet` circle |
| Focus-visible | 2px focus ring in channel action, offset 2 |
| Range start / end | Channel `action` circle, `on-action` text, medium weight |
| In range | Channel `subtle` band, 40 high, joining the start and end circles. The band is rounded (`radius-pill`) where it meets a row edge or a month boundary, so a range across rows reads as one strip. |
| Preview (start chosen, pointer over a later day) | The same band in `fill-quiet`, with no circle at the hovered day |
| Single-day range | Start equals end: one circle, no band |
| Disabled (outside `min`/`max`, or beyond `max-days`) | `muted` at 45% opacity, `aria-disabled`; it does not react to hover |

In dark mode the same roles use their `-dark` tokens: `action-dark`, `subtle-dark` and `fill-quiet-dark`.

## Behaviour

**Choosing dates**
- The first click sets the start. The second click sets the end.
- Clicking a day before the start makes it the new start.
- Clicking any day after a complete range starts a new range.
- With `max-days`, days past the limit are disabled once a start is set. The footer then says: "You can choose up to 90 days".

**Applying**
- Apply writes the dates to both segments, closes the picker, returns focus to the calendar button and emits `scChange`.
- Escape, or a click outside, closes without changing the field.

**Typing**
- People can always type instead of using the calendar. The segments accept "21/9/2026", "21 9 2026" or "21-09-2026".
- If the typed end date is before the start date, the error is shown on blur. The fields are never silently swapped.

**Presets**
- A preset applies immediately and highlights its days.
- It does not close the picker, so people can see what it chose.

**Year boundary**
- When start and end fall in different years, the summary shows both years: "28 Dec 2026 – 3 Jan 2027".
- Same year: "21 Sep – 9 Oct 2026".
- Same month: "1 – 31 Oct 2026".
- In Arabic the range is written with words, never a dash, which would display reversed between two numbers (LANG-22A): "من 1 إلى 31 أكتوبر 2026"، "من 21 سبتمبر إلى 9 أكتوبر 2026".

## Responsive

**Compact (below 600px): bottom sheet**
- **Sheet:** `surface`, top corners `radius-sheet` (28), with a grabber. It is 92% of the viewport height and sits over a `doc-scrim` backdrop.
- **Header:** the title "Choose dates" (`title-m`) and a close button.
- **Pinned summary row:** two tappable chips, "From 21 Sep" and "To 9 Oct". Tapping a chip says which end the next tap sets.
- **Presets:** a horizontal row of `fill-quiet` chips. It scrolls; in RTL it starts at the right.
- **Months:** a vertical continuous list. The weekday row is pinned under the header, outside the scroll area, so it can't cover a day (WCAG 2.4.11). The scroll area has `overscroll-behavior: contain` and `scroll-padding-block: space-8`, so a day focused from the keyboard scrolls fully into view with its focus ring. The list is centred on the focused month when the sheet opens and stays put while focus moves, so moving through months never drops focus; it re-centres only when focus or a preset leaves it.
- **Footer:** pinned below the scroll area (it can't cover a day either), holding a full-width primary "Apply" and a quiet "Clear" above it. Padding-bottom is `space-16` plus the safe-area inset.
- **Day cells:** 44×44 on phones. At 320 CSS px (WCAG 1.4.10) the sheet doesn't scroll sideways: the calendar's inline padding (weekday row and month list) shrinks from `space-20` to fit seven 44px columns, `clamp(space-4, (100cqi − 7 × 44px) / 2, space-20)`, which is 6px each side at 320px. Wider than 348px nothing changes.
  - Why: A11Y-04 asks for 44px, and WCAG 2.5.8's 24px minimum is only the floor. Keeping 44 × 44 targets that don't overlap meets both with no recorded exception; a narrower margin at the very smallest width costs less than smaller targets or a list fallback. The header, chips and presets keep `space-20`.
  - Below 316px (zoom beyond 400%, or a narrower device) the columns narrow to fit and the day button takes the column width (`min(44px, 100%)`), still 44 tall and never overlapping. That is the A11Y-04 exception, and only there.

**Medium and wider:** the popover described above, with one or two months.

## Errors

The error shows in the same way as on other fields: a 3px `error` bar at inline-start (as on `sc-date-input`), and the message in `error` with an icon. The field border turns `error`, but only on the part named by `error-parts`.

| Situation | Message (EN) | Message (AR) |
| --- | --- | --- |
| Start missing | Enter a start date | يُرجى إدخال تاريخ البداية |
| End missing | Enter an end date | يُرجى إدخال تاريخ النهاية |
| End before start | The end date must be the same as or after the start date | يجب أن يكون تاريخ النهاية في يوم البداية أو بعده |
| Beyond max | The end date must be today or earlier | يجب أن يكون تاريخ النهاية اليوم أو قبله |
| Too long | Choose a range of 90 days or fewer | يُرجى اختيار مدة لا تزيد على 90 يومًا |
| Not a real date | The start date must be a real date | يجب أن يكون تاريخ البداية تاريخًا صحيحًا |

## Worst-case data (break-ui)

- **Year boundary:** 28 Dec 2026 – 3 Jan 2027.
- **Single day:** "9 Oct 2026 · 1 day". It says "1 day", never "1 days".
- **Long range:** 1 Jan – 31 Dec 2026, 365 days. The summary is still one line.
- **Six-week month:** August 2026, which starts on a Saturday. It needs all 6 rows, and the grid height doesn't change.
- **Range across a month boundary:** in two-month view the band continues from one month into the next. In the phone list it continues across month headings.
- **Max boundary:** `max` = today (19 Oct 2026) for payment filters. Every later day is disabled, and the next-month button is disabled once it would show only disabled days.
- **Long Arabic month names:** "ديسمبر 2026" plus the previous/next buttons still fit in the 7×44 width.
- **Leap day:** 29 Feb 2028.
- **Empty:** both segments show placeholders. Apply is disabled until both ends are set; the button says what is missing: "Choose a start date", then "Choose an end date".

## Accessibility

**Structure**
- Fieldset with a legend. The two inputs are labelled "Start date" and "End date", and each is described by the hint.
- The calendar button has `aria-haspopup="dialog"` and `aria-expanded`.

**Picker**
- The popover is a non-modal `role="dialog"`; the phone sheet is modal.
- Each month is a `role="grid"`, labelled by its heading. Days are buttons.
- A day's accessible name is the full date: "Monday 21 September 2026", with ", today" and ", unavailable" added where they apply.
- Days in the range carry `aria-selected="true"`; today carries `aria-current="date"`.

**Live region (polite)**
- After choosing a start: "Start date 21 September 2026. Now choose an end date."
- After choosing an end: "21 September to 9 October 2026, 19 days."

**Keyboard** (follows the ARIA APG date picker)

| Key | Action |
| --- | --- |
| Arrow keys | Move one day. They move visually, so in RTL Left goes to the next day. |
| Up / Down | Move one week |
| Home / End | Start / end of the week (logical) |
| Page Up / Page Down | Previous / next month |
| Shift + Page Up / Page Down | Previous / next year |
| Enter / Space | Choose the focused day |
| Esc | Close and return focus to the calendar button |

- When the picker opens, focus goes to the start date, or to today if nothing is set.

**Contrast and forced colours**
- Range-end circles: `on-action` on `action` passes 4.5:1 in every channel.
- In-range text: `ink` on `subtle` passes in every channel, light and dark.
- In forced colours, ends use `Highlight` / `HighlightText` and the band uses a 1px `CanvasText` outline.

## RTL and Arabic

- **Mirroring:** the whole component mirrors through logical properties.
  - The start segment is on the right and the calendar button on the left.
  - The arrow between segments points left (←).
  - Monday is the rightmost column.
  - The previous-month button is on the right with a chevron pointing right.
  - Presets sit on the right side of the popover.
  - The band runs right to left.
- **Content:** month and weekday names are Arabic ("سبتمبر 2026", "من" / "إلى"). Digits stay Latin, following the system rule.
- **Typed input:** each segment's text is LTR-isolated, so "21/9/2026" reads correctly.
- **Calendar system:** Gregorian only for now. Hijri display is an open question for the product owners.

## Motion

Applies the emil-design-eng and mobile-native rules.

| Element | Motion |
| --- | --- |
| Popover open | Opacity 0 → 1 and scale 0.96 (`scale.enter`) → 1, from `transform-origin` at the field's top inline-start corner (the trigger). 200ms, `easing.enter`. Never from scale 0. |
| Popover open from the keyboard | Instant (MOT-02, OQ-28): Enter or Space on the calendar button (a click with `detail` 0) adds `sc-date-range__picker--instant`, which sets every transition to `duration.instant`; a later close by Escape is instant too. Pointer opening and `open()` keep the motion. Alt+Arrow Down isn't supported. |
| Sheet open from the keyboard | Instant too (R16): the same class on the sheet sets the sheet's and the scrim's transitions to `duration.instant`, so it appears with no slide; a later close by Escape is instant. Pointer and touch opening keep the slide. |
| Popover close | Opacity only, 160ms (`duration.exit`), `easing.exit`. About 20% faster than the entrance. |
| Sheet open | translateY(100%) → 0, 280ms (`duration.slow`), `easing.drawer` (`cubic-bezier(0.32, 0.72, 0, 1)`). The scrim fades in with it over 280ms, `easing.enter`. |
| Sheet close | Can be dragged down: a velocity flick over 0.11 px/ms dismisses it. Otherwise back down over 224ms (`duration.slow` × 0.8), `easing.drawer`; the scrim fades out with it. |
| Month change by pointer | The grid crossfades with a 12px shift in the direction of travel, 200ms. `easing.enter`. The shift is mirrored in RTL. |
| Month change by keyboard | Instant. Keyboard actions are never animated. |
| Day press (pointer) | scale(0.97) (`scale.press`) on `:active`, 150ms (`duration.press`), `easing.enter` |
| Range band | Not animated; it follows the pointer instantly |
| Reduced motion | No scale or translate; opacity fades only |

The popover, sheet and scrim entrances are `@starting-style` transitions. In this scoped component each starting selector repeats a class (`.sc-date-range__picker.sc-date-range__picker--popover:popover-open`), because Stencil does not add the scope class inside `@starting-style`; without it the open rule wins and nothing transitions (until 23 October 2026 the entrances did not play). The e2e tests listen for `transitionrun`.

## Budget (v2)

`perf-budgets.json` gives `sc-date-range` **21 KiB gzip** instead of 16 KiB: the custom-elements closure counts in full `sc-button` (3.2 KiB with its strings), the icon set (0.8) and the locale controller (0.9), which a page with any button pays once. Measured: closure 20.2 KiB (after the review fixes B2, B4, B5 and B10); the component's own cost (module with its CSS, field helpers, strings, digits) 15.6 KiB, inside the original 16 KiB. v1 was 22.2 KiB. Needs the coordinator's sign-off.

## Code

```html
<sc-date-range
  name="payments"
  label="Show payments between"
  hint="For example, 21 9 2026"
  start="2026-09-21"
  end="2026-10-09"
  max="2026-10-19"
  max-days="365"
  presets
></sc-date-range>
```

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| label | string | – | Legend |
| hint | string | – | Example in the typed order |
| error | string | – | Error message |
| error-parts | "start" \| "end" \| "both" | "both" | Which segment the error marks |
| start, end | ISO date | '' | The range. Each is empty until it is a real date. |
| min, max | ISO date | – | Days outside these are unavailable |
| min-days, max-days | number | – | Length limits, counted inclusively |
| presets | boolean \| JSON | false | true = the default list; JSON = a custom list of `{label, start, end}` |
| months | 1 \| 2 \| "auto" | "auto" | Months shown in the popover |
| name | string | – | Submits `name-start` and `name-end` as ISO dates |
| optional, required | boolean | false | As on the other fields |
| strings | JSON | – | Overrides the built-in EN/AR strings |

| Event | Detail |
| --- | --- |
| `scChange` | `{ start, end }` |
| `scOpen` / `scClose` | – |

Methods: `open()`, `close()`, `setFocus()`.

Tokens used: `easing.drawer`, `easing.exit` (strong ease-out since the motion audit, `docs/motion-audit.md`), `duration.exit`, `scale.enter`, `scale.press`.

## Paper board alignment (v2)

Board AQS-0 changes: the arrow is 24px; the segment value is body-large (18/26 EN, 20/32 AR) with no block padding so two lines fit 56; presets are a wrapping row of 40px chips, 12 apart, above the months in the popover; months are 32 apart; the footer summary is body-medium. Kept as built, for the coordinator: the board's footer has Cancel (tertiary) and Apply; the code keeps v1's Clear and Apply (Escape and a click outside already cancel), as the board also says behaviour is unchanged from v1.

Verification pass (board AQS-0): the arrow now sits 12 from each value (it was 8 before it and 16 after), the calendar button 6 from the frame's end (was 4), day numbers are title-small (17/22, as the board and component-language A15; they were label-medium 16/20), the preset check is 8 from its label (was 6), the footer buttons are 12 apart (were 8), and in the sheet the presets are 12 apart (were 8), the grabber is 36 × 4 in `outline-variant` (was 40 × 4 in `outline`) and the heading is title-medium (was title-large). Still different from the board, kept: the previous and next month buttons keep v1's 36px `surface-container` circle (the board draws bare chevrons); the From/To captions are label-small (the board uses the body-small size at 16px leading, which is not a role); the sheet's From/To chips stay 56 tall with 16 padding (the board draws them 6 × 12 with a 2px edge) and its footer keeps 8 between the stacked buttons (board 4); the footer buttons are `sc-button` size `m` (label-medium, padding 16), where the board draws label-large with 20 and 28 padding.
