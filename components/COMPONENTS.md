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
