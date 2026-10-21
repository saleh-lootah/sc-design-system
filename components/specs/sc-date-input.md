# sc-date-input · specification (v2)

Status: rebuilt for v2 by C3 (Wave 2b). Visual rules: `docs/v2/component-language.md` A14. Shared field anatomy, states and accessibility: `specs/sc-text-input.md`. Code: `src/components/sc-date-input`.

A date people know (a date of birth, the date on a document): Day, Month and Year boxes. For a date chosen against a calendar, use `sc-date-range`.

## Encapsulation

**Light DOM (Stencil `scoped`)**, decision A2. A native `<fieldset role="group">` and `<legend>`, three native text inputs named `name-day`, `name-month`, `name-year`, and a hidden input carrying the ISO date under `name`. Per-instance IDs; `focus()` forwarded to Day. Validity is native (`setCustomValidity` on the box concerned). v1 was form-associated with `ElementInternals`.

## Anatomy

| # | Part | Class | Notes |
| --- | --- | --- | --- |
| 1 | Fieldset, legend, hint, error, bar | `.sc-field*` | As `sc-text-input` |
| 2 | Row | `.sc-date-input__parts` | Day, Month, Year; gap 16; wraps |
| 3 | Part label | `.sc-date-input__part-label` | label-medium, `on-surface`; 8 above its box. "Day / Month / Year", "يوم / شهر / سنة" |
| 4 | Box | `.sc-field__frame--chars` | 56 tall, radius 8, 1.5px `outline`; Day and Month 4 characters wide, Year 6 |
| 5 | Control | `.sc-date-input__control` | Centred, tabular figures, `inputmode="numeric"` |

## States

As `sc-text-input`. `error-parts` (space-separated `day month year`) puts the 2px `error` edge and `aria-invalid` only on the named boxes; without it an error marks all three.

## Worst-case data (break-ui)

- 31 April or 29 February 2026: the value is empty and the first box gets "The date must be a real date".
- Arabic-Indic digits ("٢٧ / ۳ / ١٩٩٠") become "27 / 3 / 1990" as they are typed (LANG-21).
- A two-digit year is not a real date (the year box needs 4 digits).

## Accessibility

A group named by the legend, described by hint and error; each box named by its part label. Required and impossible dates are native validity errors, so `reportValidity()` focuses the right box.

## RTL and Arabic

The row runs right to left: Day on the right. Digits stay Latin. The bar is on the right.

## Motion

None.

## Code

```html
<sc-date-input name="policyStart" label="When does your insurance policy start?" hint="For example, 27 3 2026" error="The date your policy starts must include a year" error-parts="year"></sc-date-input>
```

Properties: `label`, `hint`, `error`, `error-parts`, `optional`, `name`, `value` (ISO), `required`, `disabled`, `autocomplete` (`bday` → `bday-day` …), `heading-level`. Events `scInput` and `scChange` with `{ value, day, month, year }`; the native `change` bubbles from each box. Form data: `name` = ISO (empty until real), `name-day`, `name-month`, `name-year` = what was typed.

## Strings

`sc-date-input.ts` (part labels and the two validity messages) plus `sc-field.ts`.

## Budget

Form field, 7 KiB gzip; measured in the C3 report.

## Tests

`sc-date-input.spec.tsx`, `sc-date-input.e2e.ts` (group and part names, ISO and parts submitted, LANG-21, native validity, reset, RTL order and labels, host focus and error-parts, axe on every channel, `describeAxe`), `sc-date-input.visual.e2e.ts`.
