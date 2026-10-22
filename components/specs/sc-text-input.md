# sc-text-input · specification (v2)

Status: rebuilt for v2 by C3 (Wave 2b). Visual rules: `docs/v2/component-language.md` A7, read through the role table in `docs/v2/decisions.md`. Visual reference: direction E, E2 (question page, mobile, Arabic, with an error) and E0 (fields). Code: `src/components/sc-text-input`, with the shared field helpers `field.tsx`, `field.css` and `choice.css` in the same folder.

A single-line answer: a plate number, an Emirates ID number, an email address, a phone number. This spec also defines the **field anatomy every v2 field shares** (label, hint, error, error bar, box); the other field specs refer to it.

## Encapsulation

**Light DOM (Stencil `scoped`)**, decision A2 and architecture §3.1. The component renders a native `<label>`, `<input>`, hint and error as its own children:

- the input is a real form control: it submits under `name`, Enter submits the form through its default button, and validation, reset, autofill and `<fieldset disabled>` are the browser's own. No `formAssociated`, no `ElementInternals`.
- IDs are per instance (`sc-text-input-<n>-control`, `-label`, `-hint`, `-error`, `-prefix`, `-suffix`).
- `focus()` on the host is forwarded to the input (error-summary links).
- rich `slot="label|hint|error|prefix|suffix"` children are moved into place once, on load (only the default slot is relocated by Stencil).
- no `::part()`: the classes `.sc-field*` are the styling surface; styles sit in `@layer sc.components`.

`field.css` is listed first in each field's `styleUrls`, so every field tag carries a scoped copy (about 1.2 KiB gzip). It is not in `sc.css`: that file is at 6.4 of its 7 KiB budget and the copy is paid only on pages with fields.

## Anatomy (shared by every field)

| # | Part | Class | Notes |
| --- | --- | --- | --- |
| 1 | Field group | `.sc-field` | A `<div>` (a `<fieldset>` for groups). Grid, gap 8. |
| 2 | Error bar | `.sc-field--error` | 4px `error` at inline-start (`size-strip`), 16px before the content (E2). Mirrors in RTL. |
| 3 | Label | `.sc-field__label` | `<label for>` (a `<legend>` for groups). label-large, `on-surface`. As the page heading (`heading-level`), headline-medium inside `<hN>`. "(optional)" in `on-surface-variant`, regular weight. |
| 4 | Hint | `.sc-field__hint` | body-medium, `on-surface-variant`. In `aria-describedby`. |
| 5 | Error message | `.sc-field__error` | body-medium Bold, `error`; a 20px error icon, gap 6, centred on the first line; a visually hidden "Error:" / "خطأ:". In `aria-describedby`. Appears instantly. |
| 6 | Box | `.sc-field__frame` | 56 tall (`size-control-primary`), radius 8 (`radius-field`), 1.5px `outline` edge on `surface`. |
| 7 | Control | `.sc-field__control` | The native `<input>`, padding inline 16, body-large, `on-surface`. |
| 8 | Prefix / suffix | `.sc-field__affix` | A quiet segment inside the box: `surface-container`, a 1px `outline-variant` separator, padding inline 12, label-medium, `on-surface-variant`. |

## Widths

`width` = `2`, `3`, `4`, `5`, `10`, `20` characters (the box fits N+1 `ch` of body-large plus its padding) or `full` (default). Plate code `4`, plate number `10`, Emirates ID `20`. A prefix or suffix adds 4 characters.

## States

| State | Box | Text | Other |
| --- | --- | --- | --- |
| Default | `surface`, 1.5px `outline` | label `on-surface`, hint `on-surface-variant`, value `on-surface` | |
| Hover (fine pointers) | edge `outline-strong` | | colour over 120ms |
| Focus | U1 ring round the box: 3px `focus-ring`, 2px offset, on `:focus` (text fields always show focus); the edge stays | | no ring on the input itself |
| Error | 2px `error` edge (thickened inwards with an inset shadow, so the text doesn't move) | message and icon `error` | 4px bar, `aria-invalid="true"` |
| Disabled (avoid) | `disabled-container`, edge `on-disabled` | `on-disabled` (3.85:1) | native `disabled`, or a disabled fieldset |
| Read-only | `surface-container`, no edge | `on-surface` | focusable and submitted |
| Forced colours | edge `ButtonText`, 2px when in error, ring `Highlight`, disabled `GrayText` | | |

## Worst-case data (break-ui)

- A two-line hint or error grows the group, never the box (56 stays 56 in Arabic, where the value is 20/32).
- An Emirates ID typed with Arabic-Indic digits ("٧٨٤-۱۹۹۰-١٢٣") becomes "784-1990-123" as it is typed, with the caret where it was (LANG-21). Bidirectional control characters (U+200E, U+200F, U+202A–U+202E, U+2066–U+2069), which a code copied from an Arabic SMS often carries, are removed from pasted or typed text, with the caret kept on the same character (R9, amends LANG-21).
- A long Arabic label wraps; the error bar runs the full height of the group.

## Accessibility

- Name: the visible label (`<label for>`). Description: hint, then error, then prefix and suffix.
- `aria-invalid="true"` in the error state; the message starts with a visually hidden "Error:" / "خطأ:".
- `required` sets native `valueMissing` and shows nothing; the `error` prop never blocks submission.
- Enter submits the form through its default button (WCAG 3.2.2 expectation; v1 could not).

## RTL and Arabic

- The layout mirrors through logical properties; the error bar is on the right.
- `ltr` values (plates, phones, emails) are `dir="ltr"` but sit at the start (right) of the box, under the label (LANG-17).
- Type follows the closest `lang`: label 20/28 Bold, hint 18/28, value 20/32. No letter-spacing.
- Digits are Latin; Arabic-Indic digits are normalised as typed.

## Motion

The edge colour transitions over `duration-fast` (120ms) with `easing-hover` on fine pointers. The focus ring and the error appear instantly. Nothing moves.

## Code

```html
<sc-text-input name="plateNumber" label="Plate number" hint="Up to 5 digits, for example 12345"
  error="Enter numbers only, like 12345" value="48B13" width="10" inputmode="numeric" ltr></sc-text-input>
```

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| label, hint, error | string | – | Label, hint and error message |
| optional, required, disabled, readonly | boolean | false | |
| name, value | string | –, '' | Submitted natively |
| type | text \| email \| tel \| url \| search \| password | text | |
| width | full \| 2 \| 3 \| 4 \| 5 \| 10 \| 20 | full | |
| ltr | boolean | false | Left-to-right value |
| prefix-text, suffix-text | string | – | |
| inputmode, autocomplete, maxlength, minlength, pattern | | – | Passed to the input |
| heading-level | 1–6 | – | Label as the page heading |

| Event | Detail |
| --- | --- |
| `scInput` | `{ value }`, every keystroke (native `input` also bubbles) |
| `scChange` | `{ value }`, on commit (native `change` also bubbles) |

Slots (moved once): `label`, `hint`, `error`, `prefix`, `suffix`.

## Strings

`src/i18n/components/sc-field.ts` (`fieldErrorPrefix`, `fieldOptional`), merged into each field's strings by `withField()`.

## Budget

Form field budget 7 KiB gzip (custom-elements closure, excluding the runtime): **5.9 KiB**, of which the component and its CSS (1.3 KiB) are the module, plus the locale controller and icon chunks shared by every field. v1 was 9.5 KiB.

## Tests

- `sc-text-input.spec.tsx`: light DOM, IDs, hint and error wiring, Arabic strings, `ltr`, attributes, widths and affixes, heading, rich slots.
- `sc-text-input.e2e.ts`: per-instance IDs, accessible name and description, 56px box and 4px bar, type roles EN/AR, RTL, native submission and reset, Enter-to-submit, LANG-21 and pasted bidi controls (R9), native validation, focus forwarding and the U1 ring, disabled fieldset, rich slots, re-render on `lang`, forced colours, axe on every channel; `describeAxe` EN/AR × light/dark.
- `sc-text-input.visual.e2e.ts`: every state in EN/AR × light/dark.

## Paper board alignment (v2 file, page 07)

Changes made to match the boards (Field anatomy FQJ-0, Text input 1R9-0):
- The error bar sits 14px from the content in Arabic (16 in English), as E2.
- 10 between the label and the box when there is no hint (8 with one).
- Character widths follow E2: 4 characters 120px (plate code), 10 characters 200px (plate number); 2 → 93, 3 → 107, 5 → 133, 20 → 333.

Kept as built, for the coordinator: FQJ-0 says a legend uses title-medium, but the Checkbox (827-0) and Date input (AQR-0) boards use label-large for the legend; the code keeps label-large for every legend until the boards agree.
