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

- v2 renders a native `<select>` in light DOM (decision A2), styled like `sc-text-input` (56px, 8px radius, 1.5px `outline` edge) with a 26px `expand_more` chevron 16px from the inline end that points down in both directions.
- **Options are `<option>` and `<optgroup>` children, moved into the native select** on load: they are the real options, not copies. Options appended to the host later are moved in too; changing an option's text or attributes works directly on it.
- **Value:** `value` picks the option (and becomes what a form reset restores); otherwise `<option selected>`, else the first enabled option.
- **Required:** add a first option with `value=""` ("Select an inspection centre") and `required`; the select reports `valueMissing` natively until a real option is chosen.
- Label, hint, `optional`, `error`, rich slots and focus forwarding work as in `sc-text-input`. Native `change` and `input` bubble from the select; `scChange` carries `{ value }`.

<!-- Auto Generated Below -->


## Overview

One choice from a list too long for radios, such as the emirate that issued a plate.

v2 renders a native `<select>` in light DOM (Stencil `scoped`, decision A2), styled like
`sc-text-input` with an `expand_more` chevron. Write the options as `<option>` (and
`<optgroup>`) children: they are moved INTO the native select, so they are the real options
(no copies), and options added later are moved in too. The select submits, resets, validates
and follows `<fieldset disabled>` natively; `focus()` on the host reaches it.

## Properties

| Property       | Attribute       | Description                                                                                   | Type                                      | Default     |
| -------------- | --------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------- | ----------- |
| `autocomplete` | `autocomplete`  | Autofill hint, for example `country-name`.                                                    | `string \| undefined`                     | `undefined` |
| `disabled`     | `disabled`      | Disables the field. Avoid it.                                                                 | `boolean`                                 | `false`     |
| `error`        | `error`         | The error message. Setting it shows the error state.                                          | `string \| undefined`                     | `undefined` |
| `headingLevel` | `heading-level` | When set (1–6), the label is also the page heading at this level.                             | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| undefined` | `undefined` |
| `hint`         | `hint`          | Help text below the label.                                                                    | `string \| undefined`                     | `undefined` |
| `label`        | `label`         | The visible label: "Issuing authority".                                                       | `string \| undefined`                     | `undefined` |
| `name`         | `name`          | The name submitted with the form.                                                             | `string \| undefined`                     | `undefined` |
| `optional`     | `optional`      | Appends "(optional)" to the label.                                                            | `boolean`                                 | `false`     |
| `required`     | `required`      | Requires a choice. Make the first option a placeholder with `value=""` ("Select an emirate"). | `boolean`                                 | `false`     |
| `value`        | `value`         | The selected value. Defaults to the `<option selected>`, else the first option.               | `string \| undefined`                     | `undefined` |


## Events

| Event      | Description                                                                                            | Type                              |
| ---------- | ------------------------------------------------------------------------------------------------------ | --------------------------------- |
| `scChange` | Fires when the selection changes with `{ value }`. The native `change` and `input` events also bubble. | `CustomEvent<{ value: string; }>` |


## Slots

| Slot | Description                           |
| ---- | ------------------------------------- |
|      | `<option>` and `<optgroup>` elements. |


----------------------------------------------


