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

### Field behaviour (shared by every field)

- The component renders its own label, hint, error and `<input>` in one shadow root, because `for`, `aria-describedby` and `aria-labelledby` can't point across a shadow boundary. Don't put a separate `<label>` next to it.
- **Label:** always visible. Write it as the thing to enter ("Plate number") or as the question ("What is your plate number?"). Latin labels are label-m Medium; Arabic labels are label-m Bold.
- **Hint:** says what format to use, with a real example. It's linked with `aria-describedby`.
- **Optional:** `optional` appends "(optional)" / "(اختياري)". Required fields are not marked; ask only for what you need. `required` turns on native validation (`valueMissing`) but shows nothing.
- **Error:** set `error` to the message after the server (or your own validation) rejects the answer. The field gets a 3px error bar on its start side, a 2px error border on the box, the message with an icon and a visually hidden "Error:" / "خطأ:", and `aria-invalid="true"`. Also list the error in `sc-error-summary` at the top of the page, linking to the field's `id`. Say what to do, not what went wrong: "Enter numbers only, like 12345", not "Invalid plate number".
- **Rich content:** use the `label`, `hint` and `error` slots for links or emphasis.
- **Focus from an error summary:** the host delegates focus, so `document.getElementById('plate-number').focus()` lands in the input. Browsers don't move focus to a fragment target that isn't focusable itself, so the error summary must focus the target of its links (as GOV.UK's does).
- **Page heading:** when the field is the only question on the page, set `heading-level="1"`: the label becomes the page heading (`<h1><label>…</label></h1>`).

### Width

Match the box to the answer: `width="2"`, `"3"`, `"4"`, `"5"`, `"10"` or `"20"` characters, or `full` (default). A plate code is `4`, a plate number `10`, an Emirates ID `20`.

### Left-to-right values

Plates, phone numbers, emails, IBANs and references must stay left-to-right in Arabic. Add `ltr`: the input gets `dir="ltr"`, spellcheck and auto-capitalisation are off, and in an Arabic page the value still sits at the start (right) of the box, under the label. Don't put `dir="ltr"` on the host: that flips the label, hint and error too.

### Prefix and suffix

`prefix-text="AED"`, `suffix-text="km"` (or the `prefix`/`suffix` slots) show a quiet box inside the field. They're part of the input's description, so screen readers hear "Amount, AED". (The props aren't called `prefix`/`suffix` because `prefix` is a reserved DOM property.)

### Forms

Form-associated: submits `value` under `name`, resets to its initial `value`, follows `<fieldset disabled>`, and mirrors the inner input's native validity (`required`, `type="email"`, `pattern`, `minlength`, `maxlength`) so `form.checkValidity()`, `:invalid` and `reportValidity()` work, with the browser's bubble on the inner input. Native `input` events reach the host; `change` is re-dispatched on the host (native `change` isn't composed). `scInput` and `scChange` carry `{ value }`.

The `error` prop is presentation only: it never blocks submission, so a server-validated form can always be sent again.

### Content

Sentence case, no colon after the label, no placeholder text (it disappears as you type and fails contrast). Use the vehicle registration journey's words: "Plate number", "Plate code", "Issuing authority".

### Arabic

Strings come from the closest `lang`. Arabic uses the Arabic type scale with no letter-spacing; digits stay Latin. The error bar moves to the right.

<!-- Auto Generated Below -->


## Overview

A single-line answer, such as a plate number, an email address or a phone number.

Renders its own label, hint, error and native `<input>` in one shadow root, so the
label and `aria-describedby` work. The host is form-associated (it submits `value`
under `name`, resets, and reports validity from the inner input) and delegates focus,
so an error-summary link to the host's `id` focuses the input.

## Properties

| Property       | Attribute       | Description                                                                                                                                                                                                                                          | Type                                                                                               | Default     |
| -------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ----------- |
| `autocomplete` | `autocomplete`  | Autofill hint, for example `email`, `tel` or `off`.                                                                                                                                                                                                  | `string \| undefined`                                                                              | `undefined` |
| `disabled`     | `disabled`      | Disables the field. Avoid it: say why something can't be changed instead.                                                                                                                                                                            | `boolean`                                                                                          | `false`     |
| `error`        | `error`         | The error message. Setting it shows the error state: a 3px error bar on the start side, an error border on the input, the message with an icon and a visually hidden "Error:", and `aria-invalid`. Say what to do: "Enter numbers only, like 12345". | `string \| undefined`                                                                              | `undefined` |
| `headingLevel` | `heading-level` | When set (1–6), the label is also the page heading at this level (`<h1><label>…</label></h1>`).                                                                                                                                                      | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| undefined`                                                          | `undefined` |
| `hint`         | `hint`          | Help text below the label: "Up to 5 digits, for example 12345".                                                                                                                                                                                      | `string \| undefined`                                                                              | `undefined` |
| `inputmode`    | `inputmode`     | The virtual keyboard: `numeric` for digits, `email`, `tel`, …                                                                                                                                                                                        | `"decimal" \| "email" \| "none" \| "numeric" \| "search" \| "tel" \| "text" \| "url" \| undefined` | `undefined` |
| `label`        | `label`         | The visible label. Write it as the question or the thing to enter: "Plate number".                                                                                                                                                                   | `string \| undefined`                                                                              | `undefined` |
| `ltr`          | `ltr`           | Keeps the value left-to-right (plates, phone numbers, emails, references). In Arabic the value still sits at the start (right) of the box. Use this, not `dir` on the host, which would flip the label and hint too.                                 | `boolean`                                                                                          | `false`     |
| `maxlength`    | `maxlength`     | Maximum length for native validation (`tooLong`). Prefer telling people in the hint.                                                                                                                                                                 | `number \| undefined`                                                                              | `undefined` |
| `minlength`    | `minlength`     | Minimum length for native validation (`tooShort`).                                                                                                                                                                                                   | `number \| undefined`                                                                              | `undefined` |
| `name`         | `name`          | The name submitted with the form.                                                                                                                                                                                                                    | `string \| undefined`                                                                              | `undefined` |
| `optional`     | `optional`      | Appends "(optional)" to the label. Required fields are not marked.                                                                                                                                                                                   | `boolean`                                                                                          | `false`     |
| `pattern`      | `pattern`       | A regular expression the value must match (`patternMismatch`).                                                                                                                                                                                       | `string \| undefined`                                                                              | `undefined` |
| `prefixText`   | `prefix-text`   | Text before the value inside the box, such as "AED". (Named `prefixText` because `prefix` is a reserved DOM property.)                                                                                                                               | `string \| undefined`                                                                              | `undefined` |
| `readonly`     | `readonly`      | Makes the value read-only (still focusable and submitted).                                                                                                                                                                                           | `boolean`                                                                                          | `false`     |
| `required`     | `required`      | Makes the field required for native constraint validation (`valueMissing`). Not shown visually.                                                                                                                                                      | `boolean`                                                                                          | `false`     |
| `suffixText`   | `suffix-text`   | Text after the value inside the box, such as "km".                                                                                                                                                                                                   | `string \| undefined`                                                                              | `undefined` |
| `type`         | `type`          | The input type. Use `text` for numbers such as plate numbers, with `inputmode="numeric"`.                                                                                                                                                            | `"email" \| "password" \| "search" \| "tel" \| "text" \| "url"`                                    | `'text'`    |
| `value`        | `value`         | The value. Updated as the user types.                                                                                                                                                                                                                | `string`                                                                                           | `''`        |
| `width`        | `width`         | The width of the box: `full` (default) or the number of characters the answer needs (`2`, `3`, `4`, `5`, `10`, `20`). Matching the width to the answer helps people fill it in.                                                                      | `"10" \| "2" \| "20" \| "3" \| "4" \| "5" \| "full"`                                               | `'full'`    |


## Events

| Event      | Description                                                                                                                       | Type                              |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| `scChange` | Fires when the value is committed (blur after a change) with `{ value }`. A native `change` event is also dispatched on the host. | `CustomEvent<{ value: string; }>` |
| `scInput`  | Fires on every keystroke with `{ value }`. The native `input` event also reaches the host.                                        | `CustomEvent<{ value: string; }>` |


## Slots

| Slot       | Description                                                              |
| ---------- | ------------------------------------------------------------------------ |
| `"error"`  | Rich error content, instead of the `error` prop.                         |
| `"hint"`   | Rich hint content (for example with a link), instead of the `hint` prop. |
| `"label"`  | Rich label content, instead of the `label` prop.                         |
| `"prefix"` | Content before the value inside the box, instead of `prefix-text`.       |
| `"suffix"` | Content after the value inside the box, instead of `suffix-text`.        |


## Shadow Parts

| Part        | Description                                           |
| ----------- | ----------------------------------------------------- |
| `"control"` | The native `<input>`.                                 |
| `"error"`   | The error message.                                    |
| `"field"`   | The field group (gets the error bar).                 |
| `"frame"`   | The bordered box around the input, prefix and suffix. |
| `"hint"`    | The hint.                                             |
| `"label"`   | The `<label>`.                                        |
| `"prefix"`  | The prefix box.                                       |
| `"suffix"`  | The suffix box.                                       |


----------------------------------------------


