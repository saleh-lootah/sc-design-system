# sc-select

One choice from a list that's too long for radios, such as the issuing authority of a plate or an inspection centre. Use `sc-radio-group` when there are about 7 options or fewer: radios show every option without opening anything. Avoid selects for answers people know by heart (like a country); a text input with autocomplete is often easier.

## Usage

```html
<sc-select name="emirate" label="Issuing authority" value="dubai">
  <option value="dubai">Dubai</option>
  <option value="abu-dhabi">Abu Dhabi</option>
  <option value="sharjah">Sharjah</option>
</sc-select>
```

- A native `<select>` inside the shadow root, styled like `sc-text-input` (54px, field radius, 1.5px control border) with a chevron at the end that points down in both directions.
- **Options are light-DOM `<option>` and `<optgroup>` children.** A native select can't render slotted options, so the component copies them into its inner select and keeps them in sync (a `MutationObserver` watches additions, removals, text and `value`/`label`/`disabled`/`selected`). Changing an option's text, for example when the page switches language, updates the list.
- **Value:** `value` picks the option; otherwise `<option selected>`, else the first option.
- **Required:** add a first option with `value=""` ("Select an inspection centre") and `required`; the field reports `valueMissing` until a real option is chosen. Don't add an empty first option to a select that already has a sensible default.
- Label, hint, `optional`, `error`, form association and focus delegation work as in `sc-text-input`. `change` is re-dispatched on the host and `scChange` carries `{ value }`.

<!-- Auto Generated Below -->


## Overview

One choice from a list too long for radios, such as the emirate that issued a plate.

A native `<select>` inside the shadow root, styled like `sc-text-input`, with a chevron.
Write the options as light-DOM `<option>` (and `<optgroup>`) children: they are copied
into the inner select and kept in sync when they change. Form-associated and delegates focus.

## Properties

| Property       | Attribute       | Description                                                                                   | Type                                      | Default     |
| -------------- | --------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------- | ----------- |
| `autocomplete` | `autocomplete`  | Autofill hint, for example `country-name`.                                                    | `string \| undefined`                     | `undefined` |
| `disabled`     | `disabled`      | Disables the field. Avoid it.                                                                 | `boolean`                                 | `false`     |
| `error`        | `error`         | The error message. Setting it shows the error state.                                          | `string \| undefined`                     | `undefined` |
| `headingLevel` | `heading-level` | When set (1–6), the label is also the page heading at this level.                             | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| undefined` | `undefined` |
| `hint`         | `hint`          | Help text below the label.                                                                    | `string \| undefined`                     | `undefined` |
| `label`        | `label`         | The visible label: "Issuing emirate".                                                         | `string \| undefined`                     | `undefined` |
| `name`         | `name`          | The name submitted with the form.                                                             | `string \| undefined`                     | `undefined` |
| `optional`     | `optional`      | Appends "(optional)" to the label.                                                            | `boolean`                                 | `false`     |
| `required`     | `required`      | Requires a choice. Make the first option a placeholder with `value=""` ("Select an emirate"). | `boolean`                                 | `false`     |
| `value`        | `value`         | The selected value. Defaults to the `<option selected>`, else the first option.               | `string \| undefined`                     | `undefined` |


## Events

| Event      | Description                                                                                             | Type                              |
| ---------- | ------------------------------------------------------------------------------------------------------- | --------------------------------- |
| `scChange` | Fires when the selection changes with `{ value }`. A native `change` (and `input`) also reach the host. | `CustomEvent<{ value: string; }>` |


## Slots

| Slot      | Description                                      |
| --------- | ------------------------------------------------ |
| `"error"` | Rich error content, instead of the `error` prop. |
| `"hint"`  | Rich hint content, instead of the `hint` prop.   |
| `"label"` | Rich label content, instead of the `label` prop. |


## Shadow Parts

| Part        | Description                           |
| ----------- | ------------------------------------- |
| `"control"` | The native `<select>`.                |
| `"error"`   | The error message.                    |
| `"field"`   | The field group (gets the error bar). |
| `"frame"`   | The bordered box around the select.   |
| `"hint"`    | The hint.                             |
| `"label"`   | The `<label>`.                        |


----------------------------------------------


