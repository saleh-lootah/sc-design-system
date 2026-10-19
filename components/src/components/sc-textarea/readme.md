# sc-textarea

A longer answer that can run to several sentences: why a registration is being cancelled, a description of damage, a note for the inspector. For one line use `sc-text-input`.

## Usage

```html
<sc-textarea
  name="reason"
  label="Why are you cancelling the registration?"
  hint="For example, the vehicle was sold or exported"
  maxlength="200"
></sc-textarea>
```

Label, hint, `optional`, `error`, `required`, `heading-level`, form association and focus delegation work exactly as in `sc-text-input` (see its readme).

### Character count

Set `maxlength` to show a count under the box: "You have 120 characters remaining" / "يتبقى لديك 120 حرفًا".

- **Typing isn't cut off.** People can type past the limit (no native `maxlength`), then the count says "You have 6 characters too many" in the error colour, the box gets the error border and `aria-invalid`, and the field reports `tooLong`, so the form won't pass `checkValidity()`. Editing down is easier than finding out the end of your text was silently dropped.
- **Announced politely, after a pause.** The visible count changes on every keystroke but is hidden from screen readers. A separate polite live region (`aria-live="polite"`, `aria-atomic`) is updated once typing has paused for one second, so screen reader users hear the count when they stop, not on every key.
- **Described up front.** "You can enter up to 200 characters" is part of the textarea's description, so the limit is heard on focus.
- **Arabic plurals.** The Arabic count uses the right form for the number (حرف واحد، حرفان، 3 أحرف، 120 حرفًا، 100 حرف), chosen with `Intl.PluralRules('ar')`. Characters are counted as people see them, so an emoji counts as one.

Use a limit only when there is a real one (a system field length). Size the box with `rows` to fit a typical answer.

<!-- Auto Generated Below -->


## Overview

A longer answer, such as a reason or a description, with an optional character count.

Renders its own label, hint, error, native `<textarea>` and count in one shadow root.
The count is shown as you type, but announced to screen readers politely, once typing
pauses, never on every keystroke. Form-associated and delegates focus, like `sc-text-input`.

## Properties

| Property       | Attribute       | Description                                                                                                                                                                                                                          | Type                                      | Default     |
| -------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------- | ----------- |
| `autocomplete` | `autocomplete`  | Autofill hint.                                                                                                                                                                                                                       | `string \| undefined`                     | `undefined` |
| `disabled`     | `disabled`      | Disables the field. Avoid it.                                                                                                                                                                                                        | `boolean`                                 | `false`     |
| `error`        | `error`         | The error message. Setting it shows the error state (bar, border, icon, "Error:", `aria-invalid`).                                                                                                                                   | `string \| undefined`                     | `undefined` |
| `headingLevel` | `heading-level` | When set (1–6), the label is also the page heading at this level.                                                                                                                                                                    | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| undefined` | `undefined` |
| `hint`         | `hint`          | Help text below the label.                                                                                                                                                                                                           | `string \| undefined`                     | `undefined` |
| `label`        | `label`         | The visible label: "Why are you cancelling your registration?"                                                                                                                                                                       | `string \| undefined`                     | `undefined` |
| `maxlength`    | `maxlength`     | Shows a character count for this limit: "You have 120 characters remaining". People can type past it (the count then says how many to remove and the field reports `tooLong`), which is easier to fix than text that silently stops. | `number \| undefined`                     | `undefined` |
| `name`         | `name`          | The name submitted with the form.                                                                                                                                                                                                    | `string \| undefined`                     | `undefined` |
| `optional`     | `optional`      | Appends "(optional)" to the label.                                                                                                                                                                                                   | `boolean`                                 | `false`     |
| `readonly`     | `readonly`      | Makes the value read-only.                                                                                                                                                                                                           | `boolean`                                 | `false`     |
| `required`     | `required`      | Makes the field required for native validation (`valueMissing`).                                                                                                                                                                     | `boolean`                                 | `false`     |
| `rows`         | `rows`          | Visible height in lines.                                                                                                                                                                                                             | `number`                                  | `5`         |
| `value`        | `value`         | The value. Updated as the user types.                                                                                                                                                                                                | `string`                                  | `''`        |


## Events

| Event      | Description                                                                                           | Type                              |
| ---------- | ----------------------------------------------------------------------------------------------------- | --------------------------------- |
| `scChange` | Fires when the value is committed with `{ value }`. A native `change` is also dispatched on the host. | `CustomEvent<{ value: string; }>` |
| `scInput`  | Fires on every keystroke with `{ value }`.                                                            | `CustomEvent<{ value: string; }>` |


## Slots

| Slot      | Description                                      |
| --------- | ------------------------------------------------ |
| `"error"` | Rich error content, instead of the `error` prop. |
| `"hint"`  | Rich hint content, instead of the `hint` prop.   |
| `"label"` | Rich label content, instead of the `label` prop. |


## Shadow Parts

| Part        | Description                           |
| ----------- | ------------------------------------- |
| `"control"` | The native `<textarea>`.              |
| `"count"`   | The visible character count.          |
| `"error"`   | The error message.                    |
| `"field"`   | The field group (gets the error bar). |
| `"frame"`   | The bordered box around the textarea. |
| `"hint"`    | The hint.                             |
| `"label"`   | The `<label>`.                        |


----------------------------------------------


