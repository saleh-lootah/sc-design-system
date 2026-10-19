# sc-date-input

A date people know: a date of birth, the start date on an insurance policy, the date a vehicle was exported. Don't use it for a date people need to pick from a calendar (an appointment): that needs a date picker.

## Usage

```html
<sc-date-input
  name="insuranceStart"
  label="When does your insurance policy start?"
  hint="For example, 27 3 2026"
></sc-date-input>
```

- Three labelled boxes, Day, Month and Year (يوم / شهر / سنة), in a `<fieldset>` with the question as the `<legend>`. Each box uses the numeric keyboard (`inputmode="numeric"`).
- **In Arabic** the boxes run right to left: Day on the right, Year on the left. Digits stay Latin.
- **Hint:** give an example in the order of the boxes: "For example, 27 3 2026".
- **Error on one part:** set `error` and `error-parts` to the boxes it's about, for example `error-parts="year"` with "The date your policy starts must include a year". Only those boxes get the error border and `aria-invalid`. Without `error-parts`, the error highlights all three.
- **Date of birth:** `autocomplete="bday"` sets `bday-day`, `bday-month`, `bday-year` on the boxes.
- `optional`, `heading-level` and `disabled` work as in the other fields.

### Value and forms

- `value` is an ISO date (`2026-03-27`). It's empty while the boxes don't make a real date (31 April, a 2-digit year). Setting `value` fills the boxes.
- The form gets the ISO date under `name`, plus the raw parts as `name-day`, `name-month` and `name-year`, so the server can validate and re-display exactly what was typed.
- Validity: `valueMissing` when `required` and every box is empty; `badInput` ("Enter a real date") when something is typed but it isn't a real date. Reset restores the initial `value`.
- `scInput` and `scChange` carry `{ value, day, month, year }`. The host delegates focus to the Day box, so an error summary can focus the field by its `id`.

<!-- Auto Generated Below -->


## Overview

A date people know, such as a date of birth or the date on a document: Day, Month and
Year boxes (يوم / شهر / سنة) with the numeric keyboard.

A `<fieldset>` and `<legend>` with the hint and error, and three labelled native inputs,
in one shadow root. In Arabic the boxes run right to left (Day on the right). An error can
highlight one part with `error-parts="year"`.

Form-associated: submits the date as an ISO string (`2026-03-07`, or empty while it isn't
a real date) under `name`, plus the raw parts as `name-day`, `name-month` and `name-year`
so a server can re-display what was typed. Reports `valueMissing` and `badInput`.
Delegates focus to the first box.

## Properties

| Property       | Attribute       | Description                                                                                                                                                              | Type                                      | Default     |
| -------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------- | ----------- |
| `autocomplete` | `autocomplete`  | Set to `bday` for a date of birth, so browsers can fill it (`bday-day`, `bday-month`, `bday-year`).                                                                      | `string \| undefined`                     | `undefined` |
| `disabled`     | `disabled`      | Disables the boxes. Avoid it.                                                                                                                                            | `boolean`                                 | `false`     |
| `error`        | `error`         | The error message. Setting it shows the error state.                                                                                                                     | `string \| undefined`                     | `undefined` |
| `errorParts`   | `error-parts`   | Which boxes the error is about, space-separated: `"day"`, `"month year"`. Only those get the error border and `aria-invalid`. When empty, an error highlights all three. | `string \| undefined`                     | `undefined` |
| `headingLevel` | `heading-level` | When set (1–6), the legend is also the page heading at this level.                                                                                                       | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| undefined` | `undefined` |
| `hint`         | `hint`          | Help text below the legend: "For example, 27 3 2026".                                                                                                                    | `string \| undefined`                     | `undefined` |
| `label`        | `label`         | The question, shown as the legend: "When does your insurance start?".                                                                                                    | `string \| undefined`                     | `undefined` |
| `name`         | `name`          | The name submitted with the form (with `-day`, `-month`, `-year` for the parts).                                                                                         | `string \| undefined`                     | `undefined` |
| `optional`     | `optional`      | Appends "(optional)" to the legend.                                                                                                                                      | `boolean`                                 | `false`     |
| `required`     | `required`      | Requires a date (`valueMissing` while every box is empty).                                                                                                               | `boolean`                                 | `false`     |
| `value`        | `value`         | The date as an ISO string (`YYYY-MM-DD`). Empty while the boxes don't make a real date.                                                                                  | `string`                                  | `''`        |


## Events

| Event      | Description                                                                                                         | Type                                      |
| ---------- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `scChange` | Fires when a box is committed with `{ value, day, month, year }`. A native `change` is also dispatched on the host. | `CustomEvent<{ value: string; } & Parts>` |
| `scInput`  | Fires on every keystroke with `{ value, day, month, year }`.                                                        | `CustomEvent<{ value: string; } & Parts>` |


## Slots

| Slot      | Description                                       |
| --------- | ------------------------------------------------- |
| `"error"` | Rich error content, instead of the `error` prop.  |
| `"hint"`  | Rich hint content, instead of the `hint` prop.    |
| `"label"` | Rich legend content, instead of the `label` prop. |


## Shadow Parts

| Part           | Description                            |
| -------------- | -------------------------------------- |
| `"control"`    | A native `<input>`.                    |
| `"error"`      | The error message.                     |
| `"field"`      | The `<fieldset>` (gets the error bar). |
| `"frame"`      | The bordered box around an input.      |
| `"hint"`       | The hint.                              |
| `"label"`      | The `<legend>`.                        |
| `"part-label"` | The label above a box.                 |
| `"parts"`      | The row of boxes.                      |


----------------------------------------------


