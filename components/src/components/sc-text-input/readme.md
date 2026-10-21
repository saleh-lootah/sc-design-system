# sc-text-input

A single-line answer: a plate number, an Emirates ID number, an email address, a phone number. For a longer answer use `sc-textarea`; for a choice from a list use `sc-radio-group` (up to about 7 options) or `sc-select`; for a date use `sc-date-input`.

## Usage

```html
<sc-text-input
  id="plate-number"
  name="plateNumber"
  label="Plate number"
  hint="Up to 5 digits, for example 12345"
  width="10"
  inputmode="numeric"
  ltr
></sc-text-input>
```

### Field behaviour (shared by every v2 field)

- **Light DOM (decision A2).** The component renders a native `<label>`, `<input>`, hint and error as its own children, with per-instance IDs (`sc-text-input-3-control`). Don't add a separate `<label>`. There is no `::part()`; if you must restyle, use `.sc-field`, `.sc-field__label`, `.sc-field__hint`, `.sc-field__error`, `.sc-field__frame` and `.sc-field__control` (your unlayered CSS wins over `@layer sc.components`).
- **Label:** always visible, label-large Bold in both scripts. Write it as the thing to enter ("Plate number") or as the question ("What is your plate number?").
- **Hint:** the format with a real example, linked with `aria-describedby`.
- **Optional:** `optional` appends "(optional)" / "(اختياري)". Required fields are not marked. `required` turns on native validation (`valueMissing`) but shows nothing.
- **Error:** set `error` after your validation rejects the answer. The group gets a 4px error bar at inline-start, the box a 2px error edge, and the message an icon and a visually hidden "Error:" / "خطأ:"; the input gets `aria-invalid="true"`. List the error in `sc-error-summary` too, linking to the field's `id`. Say what to do: "Enter numbers only, like 12345".
- **Rich content:** a child with `slot="label"`, `slot="hint"`, `slot="error"`, `slot="prefix"` or `slot="suffix"` is moved into place once, when the component loads. Frameworks that own children (React) must render it once and not re-render it.
- **Focus from an error summary:** `focus()` on the host is forwarded to the input, so `document.getElementById('plate-number').focus()` lands in it.
- **Page heading:** with one question on the page, set `heading-level="1"`: `<h1><label>…</label></h1>`.

### Width

`width="2"`, `"3"`, `"4"`, `"5"`, `"10"` or `"20"` characters, or `full` (default). A plate code is `4`, a plate number `10`, an Emirates ID `20`.

### Left-to-right values

Plates, phone numbers, emails, IBANs and references: add `ltr`. The input gets `dir="ltr"` with spellcheck and auto-capitalisation off, and in Arabic the value still sits at the start (right) of the box. Don't put `dir` on the host.

### Prefix and suffix

`prefix-text="AED"`, `suffix-text="km"`: a quiet segment inside the box, part of the input's description ("Amount, AED").

### Forms

The input is native: it submits under `name`, **Enter submits the form through its default button** (the first `<sc-button type="submit">`), `form.reset()` restores the initial `value`, `<fieldset disabled>` disables it, and `required`, `type="email"`, `pattern`, `minlength` and `maxlength` drive the browser's own validation (`input.matches(':invalid')`, `reportValidity()`). Native `input` and `change` bubble from the input; `scInput` and `scChange` carry `{ value }`. Digits typed in Arabic-Indic forms become Latin digits as they are typed (LANG-21).

The `error` prop is presentation only: it never blocks submission.

### Content

Sentence case, no colon after the label, no placeholder text. Use the journey's words: "Plate number", "Plate code", "Issuing authority".

### Arabic

Strings follow the closest `lang`; the Arabic type scale applies with no letter-spacing; digits stay Latin; the error bar moves to the right. The box stays 56px.

<!-- Auto Generated Below -->


## Overview

A single-line answer, such as a plate number, an email address or a phone number.

v2 renders its label, hint, error and a native `<input>` in light DOM (Stencil `scoped`,
decision A2). The input is a real form control: it submits under `name`, Enter submits the
form through its default button, and validation, reset, autofill and `<fieldset disabled>`
are native. `focus()` on the host reaches the input, so an error-summary link to the host's
`id` works. Styles: the classes `.sc-field`, `.sc-field__label`, `.sc-field__frame`,
`.sc-field__control` (no `::part()`).

Rich content: a child element with `slot="label"`, `slot="hint"`, `slot="error"`,
`slot="prefix"` or `slot="suffix"` is moved into place once, when the component loads.

## Properties

| Property       | Attribute       | Description                                                                                                                                                                                                                                       | Type                                                                                               | Default     |
| -------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ----------- |
| `autocomplete` | `autocomplete`  | Autofill hint, for example `email`, `tel` or `off`.                                                                                                                                                                                               | `string \| undefined`                                                                              | `undefined` |
| `disabled`     | `disabled`      | Disables the field. Avoid it: say why something can't be changed instead.                                                                                                                                                                         | `boolean`                                                                                          | `false`     |
| `error`        | `error`         | The error message. Setting it shows the error state: a 4px error bar at inline-start, a 2px error edge on the box, the message with an icon and a visually hidden "Error:", and `aria-invalid`. Say what to do: "Enter numbers only, like 12345". | `string \| undefined`                                                                              | `undefined` |
| `headingLevel` | `heading-level` | When set (1–6), the label is also the page heading at this level (`<h1><label>…</label></h1>`).                                                                                                                                                   | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| undefined`                                                          | `undefined` |
| `hint`         | `hint`          | Help text below the label: "Up to 5 digits, for example 12345".                                                                                                                                                                                   | `string \| undefined`                                                                              | `undefined` |
| `inputmode`    | `inputmode`     | The virtual keyboard: `numeric` for digits, `email`, `tel`, …                                                                                                                                                                                     | `"decimal" \| "email" \| "none" \| "numeric" \| "search" \| "tel" \| "text" \| "url" \| undefined` | `undefined` |
| `label`        | `label`         | The visible label. Write it as the question or the thing to enter: "Plate number".                                                                                                                                                                | `string \| undefined`                                                                              | `undefined` |
| `ltr`          | `ltr`           | Keeps the value left-to-right (plates, phone numbers, emails, references). In Arabic the value still sits at the start (right) of the box. Use this, not `dir` on the host.                                                                       | `boolean`                                                                                          | `false`     |
| `maxlength`    | `maxlength`     | Maximum length for native validation (`tooLong`). Prefer telling people in the hint.                                                                                                                                                              | `number \| undefined`                                                                              | `undefined` |
| `minlength`    | `minlength`     | Minimum length for native validation (`tooShort`).                                                                                                                                                                                                | `number \| undefined`                                                                              | `undefined` |
| `name`         | `name`          | The name submitted with the form.                                                                                                                                                                                                                 | `string \| undefined`                                                                              | `undefined` |
| `optional`     | `optional`      | Appends "(optional)" to the label. Required fields are not marked.                                                                                                                                                                                | `boolean`                                                                                          | `false`     |
| `pattern`      | `pattern`       | A regular expression the value must match (`patternMismatch`).                                                                                                                                                                                    | `string \| undefined`                                                                              | `undefined` |
| `prefixText`   | `prefix-text`   | Text before the value inside the box, such as "AED".                                                                                                                                                                                              | `string \| undefined`                                                                              | `undefined` |
| `readonly`     | `readonly`      | Makes the value read-only (still focusable and submitted).                                                                                                                                                                                        | `boolean`                                                                                          | `false`     |
| `required`     | `required`      | Makes the field required for native constraint validation (`valueMissing`). Not shown visually.                                                                                                                                                   | `boolean`                                                                                          | `false`     |
| `suffixText`   | `suffix-text`   | Text after the value inside the box, such as "km".                                                                                                                                                                                                | `string \| undefined`                                                                              | `undefined` |
| `type`         | `type`          | The input type. Use `text` for numbers such as plate numbers, with `inputmode="numeric"`.                                                                                                                                                         | `"email" \| "password" \| "search" \| "tel" \| "text" \| "url"`                                    | `'text'`    |
| `value`        | `value`         | The value. Updated as the user types.                                                                                                                                                                                                             | `string`                                                                                           | `''`        |
| `width`        | `width`         | The width of the box: `full` (default) or the number of characters the answer needs (`2`, `3`, `4`, `5`, `10`, `20`). Matching the width to the answer helps people fill it in.                                                                   | `"10" \| "2" \| "20" \| "3" \| "4" \| "5" \| "full"`                                               | `'full'`    |


## Events

| Event      | Description                                                                                                                      | Type                              |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| `scChange` | Fires when the value is committed (blur after a change) with `{ value }`. The native `change` event also bubbles from the input. | `CustomEvent<{ value: string; }>` |
| `scInput`  | Fires on every keystroke with `{ value }`. The native `input` event also bubbles from the input.                                 | `CustomEvent<{ value: string; }>` |


----------------------------------------------


