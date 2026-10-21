# Core components (Phase 3)

The first 24 components, in four families, plus the components added after Phase 3 (DateRange, Table). Each entry gives the purpose, the API and the states to build. Visual reference: Paper file `01M5A0E3KTNXQ1262CTCJDXCMP`, page "D+ · Native · Dubai Font", and the foundation boards in Paper file `01M5A6FZR8XR1M22Y7T8CDWGTP`. Follow `CONVENTIONS.md` for everything. All components are Stencil web components with the `sc-` prefix.

---

## Family 1 · Actions and navigation

**Button** (`sc-button`): starts an action.
- `variant`: `primary` (channel action fill, on-action text, pill, 54px), `secondary` (channel subtle fill, channel action text), `tertiary` (no fill, channel action text, underline on hover), `destructive` (error fill).
- `size`: `l` (54px, default) or `m` (44px).
- Props: `icon` and `iconPosition` (`start` | `end`; an end arrow flips in RTL), `loading` (spinner plus visually hidden "Loading", keeps its width, `aria-busy`, ignores clicks), `fullWidth`, `href` (renders a link styled as a button), `type` (`button` | `submit` | `reset`; submit works with the surrounding form).
- Disabled buttons are discouraged; support `disabled` but document why to avoid it.

**Link** (`sc-link`): goes somewhere.
- Inline link: underlined, channel action colour, visited state.
- `external`: adds an icon plus visually hidden "(opens in new tab)" from strings, with `target="_blank" rel="noopener noreferrer"`.
- `standalone`: for a link that sits on its own, with an end chevron that flips in RTL.

**BackLink** (`sc-back-link`): the "Back" control. A glass pill with a chevron that flips in RTL. Text comes from strings. Renders as `<a>` with `href`, or as `<button>` with `onClick`.

**AppBar** (`sc-app-bar`): the mobile and desktop top bar.
- Glass background (`--sc-color-glass`, glass-edge, elevation 2).
- Slots: `start` (usually BackLink), `title` (channel name, bold), `end` (usually LanguageSwitch).
- `sticky`, and a `reduced-transparency` fallback that uses a solid surface under `@media (prefers-reduced-transparency: reduce)`.

**LanguageSwitch** (`sc-language-switch`): a link to the same page in the other language.
- The label is the other language's own name ("العربية" or "English") with the right `lang` attribute.
- Props: `href`, or `onSwitch`.

**SkipLink** (`sc-skip-link`): "Skip to main content" ("الانتقال إلى المحتوى الرئيسي"). Visible on focus only.

---

## Family 2 · Form fields

**Field behaviour**: every field component (`sc-text-input`, `sc-textarea`, `sc-select`, `sc-radio-group`, `sc-checkbox-group`, `sc-date-input`, `sc-date-range`) renders its own label, hint and error inside its shadow root. Props: `label`, `hint`, `error`, `optional`, `name`, `value`, `required`; slots `hint` and `error` for rich content.
- It generates IDs and wires `aria-describedby` to the hint and the error.
- Label weight follows the type role (Latin label-m Medium, Arabic label-m Bold).
- `optional` appends "(optional)". Required fields are not marked.
- `error` shows the message with an error icon and the visually hidden "Error:" prefix, a 3px error-coloured bar on the start side of the field group, and an error-coloured control border.

**TextInput** (`sc-text-input`): a single-line value.
- 54px tall, `--sc-radius-field`, a 1.5px `--sc-color-control` border, surface fill.
- `width`: `full` or a character width (`2`, `4`, `5`, `10`, `20`).
- Props: `prefix` and `suffix` (e.g. "AED"), `inputMode`, `autoComplete`.
- Values that must stay left-to-right, like plates, emails and phone numbers, take `dir="ltr"` and stay aligned to the start of the field in Arabic.

**Textarea** (`sc-textarea`): a longer answer, with an optional character count ("You have 120 characters remaining" / "يتبقى لديك 120 حرفًا"). The count is announced politely and updated after a pause, not on every keystroke.

**Select** (`sc-select`): a native `<select>` inside the shadow root, options passed as slotted `<option>` elements, styled like TextInput, with a chevron.

**RadioGroup** (`sc-radio-group` with `sc-radio`): one choice.
- A `<fieldset>` and `<legend>`; the legend can be the page heading.
- Large 24px radios inside 44px targets. Items can have a hint.
- `inline` layout for two short options.
- Arrow-key behaviour is native.

**CheckboxGroup** (`sc-checkbox-group` with `sc-checkbox`): several choices, with the same structure as RadioGroup. `sc-checkbox` also works on its own.

**DateInput** (`sc-date-input`): Day, Month and Year fields (يوم / شهر / سنة).
- In Arabic the same fields appear in right-to-left order.
- Numeric input mode. An error can highlight a single part of the date.

**DateRange** (`sc-date-range`): a start and an end date that relate to a calendar (filtering payments between two dates, a hotel stay, how long a permit lasts). For a single date people know, use DateInput. Spec: `specs/sc-date-range.md`.
- One 54px frame with two typed segments (From / To · من / إلى), an arrow between them and a calendar button at inline-end. Typed "21/9/2026", "21 9 2026" or "21-09-2026" is formatted on blur ("21 Sep 2026").
- The picker is a non-modal popover (one or two months, 6 weeks, Monday first, optional presets) on medium and wider screens, and a modal bottom sheet below 600px. Apply writes both dates; Escape or a click outside closes without changes.
- `min`, `max`, `min-days`, `max-days` disable days; `presets` is `true` for the default list or a JSON list. Errors use `error` and `error-parts` (`start`, `end`, `both`); impossible ranges are reported on blur and never swapped.
- Keyboard follows the ARIA APG date picker; arrows move visually, so in Arabic Left is the next day.
- Submits `name-start` and `name-end` as ISO dates. Events `scChange` (`{ start, end }`), `scOpen`, `scClose`; methods `open()`, `close()`, `setFocus()`.
- Motion: the popover scales 0.96 → 1 from the field's top inline-start corner over 200ms and exits with opacity over 120ms; the sheet slides up over 320ms with the `easing.drawer` token (`[0.32, 0.72, 0, 1]`).

---

## Family 3 · Feedback and status

**ErrorSummary** (`sc-error-summary`): lists every error at the top of the page.
- Title from strings ("There is a problem").
- Each item links to its field's `id`.
- Moves focus to itself when it mounts, with `tabIndex={-1}` and `role="alert"`.
- Error-coloured border, start-side accent, surface fill, radius-card.

**Callout** (`sc-callout`): an important message.
- `tone`: `info` (neutral fill with an ink icon), `success`, `warning` or `error` (each on its own surface token with a matching icon).
- Optional `title`. Content goes in the default slot.
- Never relies on colour alone.

**StatusTag** (`sc-status-tag`): the status of a task or payment, e.g. "Paid", "Action needed", "In review", "Expires in 15 days".
- `tone`: `neutral`, `success`, `warning`, `error`, `channel`.
- Pill, label-s type, a status dot, and status words always included.

**ChannelChip** (`sc-channel-chip`): points to another channel ("Also on Dubai Transport").
- Takes a `channel` prop and sets `data-channel` on itself, so it shows that channel's subtle and ink colours.
- Optionally a link.

**StepProgress** (`sc-step-progress`): "Step 2 of 4".
- `current`, `total`, and an optional `label` (the current step's name).
- A segmented 8px track: done and current segments in channel action, upcoming in control.
- In RTL it fills from the right.
- Text from strings; visually it is decorative, and the text carries the meaning.

**Spinner** (`sc-spinner`): inline, 20px, uses `currentColor`, honours reduced motion with a static icon and a label.

---

## Family 4 · Content and layout

**Card** (`sc-card`): a surface container. Surface fill, `--sc-radius-card`, elevation 1. Optional `landmark` (`section` | `article`), `padding` of `m` (16) or `l` (24).

**SummaryList** (`sc-summary-list` with `sc-summary-row`): the "Check your answers" pattern.
- Rows of key, value and an optional action (e.g. "Change" plus a visually hidden key).
- A fixed-width action column so rows align.
- On narrow screens, key and value stack.
- Uses `<dl>`.

**ServiceCard** (`sc-service-card`): a link to a service.
- Contents: title, owning entity (attribution text) and an optional ChannelChip. No end chevron: only the title is a link (CMP-06).
- The whole card is the link target. The heading level is a prop.

**ChannelHero** (`sc-channel-hero`): the top wash of a channel page.
- A gradient from channel wash-start to wash-end (in OKLAB interpolation).
- Holds an eyebrow, H1 and lede.
- A default slot for search.

**SearchField** (`sc-search`): a pill search box.
- Search icon, a visible or visually hidden label, a submit button (primary).
- Uses `role="search"` on the form.

**PageShell** (`sc-page`, with `sc-container` and `sc-grid`): the page frame.
- Container max 1280 with margins per breakpoint from the layout tokens.
- A Grid with 4, 8 or 12 columns and gutters per breakpoint.
- A reading-width wrapper at 680px.
- Sets `lang`, `dir` and `data-channel` at the root.

**Footer** (`sc-footer`): help and contact, accessibility, privacy, terms, and "Government of Dubai". Uses `<footer>` and a list of links.

**Table** (`sc-table`): compares rows of the same kind of thing (fines, payments, permit applications) across a few attributes. Scoped (light DOM): it styles and enhances a slotted native `<table>`, never a div grid. For the details of one thing, use SummaryList. Spec: `specs/sc-table.md`.
- `caption` writes a native `<caption>` (required; `caption-hidden` hides it visually). Column types on the header cell, `data-type`: `text`, `reference`, `date`, `amount`, `status`, `action`, set alignment, wrapping and tabular figures. Empty cells read "None" (لا يوجد).
- Sorting: `th[data-sort]` becomes a button with `aria-sort`; the component emits `scSort` (`{ column, direction }`) and announces the order; the service sorts the data.
- Selection: `selectable` adds a labelled checkbox column (rows by `tr[data-id]`) with an indeterminate header checkbox, a `fill-selected` row and a selection bar with the count, the amount total and the `actions` slot; emits `scSelectionChange` (`{ ids }`).
- States: `loading` (5 skeleton rows), `empty` slot (header hidden), `filtered` (no results, header kept), `error` slot (an `sc-callout tone="error"`), `density="compact"` (44px rows).
- Below 600px: `responsive="stack"` (rows become cards) or `"scroll"` (a named scroll region with a sticky row header and an edge shadow).
- Mirrors fully in Arabic through logical properties; digits stay Latin.

## Form fields in v2 (C3)

Every form field is **light DOM** (decision A2): `sc-text-input`, `sc-textarea`, `sc-select`, `sc-checkbox`, `sc-checkbox-group`, `sc-radio`, `sc-radio-group`, `sc-date-input`, `sc-date-range`, `sc-search` and the new `sc-filter-chips` render native controls with per-instance IDs, so Enter submits the form through its default button and validation, reset, autofill and `<fieldset disabled>` are native. The "inside its shadow root" notes above are v1. Rich `slot="label|hint|error"` children are moved into place once. See `docs/v2/migration.md` §6 and each `specs/<tag>.md`.

**FilterChips** (`sc-filter-chips`, new): the filters applied to a list of results, as removable 32px chips (44px targets) beside the result count, with "Clear all filters". Removal is instant, focus moves to the next chip or the results heading, and count changes are announced politely. Spec: `specs/sc-filter-chips.md`.
---

## v2 · Site chrome (C1, Wave 2b)

The v2 specs in `specs/` supersede the Phase 3 entries above for these tags.

- **AppBar** (`sc-app-bar`): the transaction app bar (A4). See `specs/sc-app-bar.md`.
- **SiteHeader** (`sc-site-header`, new): the channel-site header (CHR-01 to CHR-04), with the lockup slot, main navigation, search, language, UAE PASS sign in (U3a) or the account menu, the channel switcher, and the compact row with a modal menu. See `specs/sc-site-header.md`.
- **ChannelSwitcher** (`sc-channel-switcher`, new, light DOM): the channel's logo and a disclosure listing the seven channels (CHR-03). See `specs/sc-channel-switcher.md`.
- **AccountMenu** (`sc-account-menu`, new): notifications with the unread count and the account disclosure. See `specs/sc-account-menu.md`.
- **AnnouncementBar** (`sc-announcement-bar`, new): a site-wide labelled region above the header, `info`, `warning` or `error`, dismissible. See `specs/sc-announcement-bar.md`.
- **UtilityBar** (`sc-utility-bar`, new): help and feedback, docked flat at the bottom from 1024px, folded into the footer below (U4, CHR-05). See `specs/sc-utility-bar.md`.
- **Footer** (`sc-footer`): `simple` and `grouped` with the Channels group (CHR-06). See `specs/sc-footer.md`.
- **ChannelNetwork** (`sc-channel-network`, new, light DOM): "One network · seven channels" (CHR-08). See `specs/sc-channel-network.md`.
- **PageShell** (`sc-page`): `main-content`, landmarks, `sync-document`, sticky-header and utility-bar reservations. See `specs/sc-page.md`.

---

## v2 · Actions and navigation (C2, Wave 2b)

The entries above describe v1. For `sc-link`, `sc-back-link`, `sc-skip-link`, `sc-language-switch` and `sc-channel-chip`, the v2 specs in `specs/<tag>.md` replace them. New in this family:

**Breadcrumbs** (`sc-breadcrumbs`): where the page sits in the channel's hierarchy, outside transactions. Plain child links, then the current page as text (never a link, `aria-current="page"`). Chevrons mirror in RTL; below 600px one "Back to {parent}" link. Spec: `specs/sc-breadcrumbs.md`.

**Pagination** (`sc-pagination`): pages of a long list. `page`, `total-pages` or `total-items` with `page-size`, `href-template`, `item-label` (plural template); event `scPageChange`. "Showing 1–20 of 1,284 fines" / "عرض 1 إلى 20 من 1,284 مخالفة". Previous and Next mirror. Spec: `specs/sc-pagination.md`.

**AccountNav** (`sc-account-nav`): the signed-in side navigation, with icons, count badges, the current item and Sign out after a divider. Spec: `specs/sc-account-nav.md`.

**BottomNav** (`sc-bottom-nav`): the signed-in primary navigation below 1024px, docked flat to the bottom edge, 44px+ targets, current indicator in `channel-container`. Spec: `specs/sc-bottom-nav.md`.
## v2 · Feedback and status (Wave 2b, C4)

Rebuilt to direction E (`docs/v2/component-language.md`); full specs in `specs/<tag>.md`.

**Callout** (`sc-callout`, shadow): tone-95 container, 3px tone accent at inline-start, 24px tone icon, hidden tone word. Tones `info`, `success`, `warning`, `error`.

**ErrorSummary** (`sc-error-summary`, shadow): error-container box with a 2px error border; takes focus, `role="group"` named by its heading, no `role="alert"` (CMP-05). "There is a problem" / "توجد مشكلة".

**StatusTag** (`sc-status-tag`, shadow): 32px chip, 6px radius, icon plus words, tone-40 on tone-95. Tones `neutral`, `info`, `success`, `warning`, `error`; no channel tone.

**Spinner** (`sc-spinner`, shadow): 20 or 24px, `currentColor`, 600ms per turn, label in a status region.

**StepProgress** (`sc-step-progress`, shadow): the E stepper. 28px markers (24 compact), channel-coloured done (with a check) and current (with a halo), never green. Full `<ol>` from 600px when step names are given; compact "Step 2 of 4" below.

**StepList** (`sc-step-list`, light DOM, new): the E1 life-event list. Numbered markers, connectors, other-channel rows in that channel's subtle with an "On Dubai Transport" chip.

**Timeline** (`sc-timeline`, light DOM, new): application status history; the latest entry is current and takes its tag's tone.

**NotificationList** (`sc-notification-list`, light DOM, new): grouped by day; each item a link; unread with fill, dot, Bold and hidden words; `markAllRead()`.

**EmptyState** (`sc-empty-state`, shadow, new): icon, sentence heading, body, one action; `variant="success"` for the all-clear.

**Modal** (`sc-modal`, shadow, new): native `<dialog>`; focus to the heading, Escape, scrim, focus return; `alert` for the session timeout with a sensibly announced `countdown`; a bottom sheet under 600px on the drawer curve.
### v2 · content and layout (C5, Wave 2b)

These entries replace the v1 descriptions of the same tags above. Specs: `specs/<tag>.md`.

**Container, Grid, LTR** (`sc-container`, `sc-grid`, `sc-ltr`): CSS only in v2. Not registered; `sc.css` styles the tags (`@layer sc.components`). Markup unchanged; `::part()` and the properties are gone.

**Card** (`sc-card`): light DOM. Flat: 12px corners, 1px `outline-variant` edge, no shadow. `variant` `outlined` (default) or `filled` (`surface-container`, totals cards). `landmark`, `padding`, `label` as v1.

**ServiceCard** (`sc-service-card`): shadow. Flat 12px card, 24 padding, at least 184 tall; the title (`title-large`) is the only link; a decorative forward arrow at the top end; optional `slot="icon"` in a 40px tile with an optional decorative `tint`; chip pinned to the bottom.

**ChannelHero** (`sc-channel-hero`): shadow. A flat `channel-subtle` band (Q-hero, no gradient); eyebrow, display heading (`size` `large` or `medium`), lede, search, and `slot="popular"` suggestion chips (40px capsules on 44px targets) after a "Popular now" label; optional breadcrumbs.

**SummaryList** (`sc-summary-list` with `sc-summary-row`): light DOM; one valid `<dl>` with each row inside its value `<dd>`. `layout` `auto`, `stacked` (E3), `columns` or `pairs` (E4, values end-aligned); `variant="total"` on a row.

**Table** (`sc-table`): v1 behaviour and API; v2 look (flat 12px container, `surface-container` header, `channel-subtle` selection, underlined links, U1 ring) in `@layer sc.components`.

**Tile** (`sc-tile`, new): shadow. One link: a tinted 40px icon tile, a `title-small` title and an optional plural-aware count ("14 services", "خدمتان"). Life events, categories, favourite services.

**AttentionCard** (`sc-attention-card`, new): shadow. A due item: a thin topic-tint top strip, icon tile, `slot="status"` tag, heading, fact, meta (amounts isolated) and one `slot="action"` button. Not a link.

**ModuleCard** (`sc-module-card`, new): shadow. A titled module: tinted icon, `heading`, a header link (`action-href`, `action-text`, named with the title), content slot, optional `divided` rules.

**Accordion** (`sc-accordion`, new): light DOM over native `<details>`/`<summary>`. Ruled sections, 56px `title-medium` summaries, a 24px chevron at inline-end that turns over (pointer only), optional `show-all` toggle.
