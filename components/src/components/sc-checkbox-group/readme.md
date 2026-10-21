# sc-checkbox-group

Several choices from a short list: "Which documents do you have?", "Send reminders by". Use `sc-radio-group` when only one answer is allowed. For a single yes/no statement ("I confirm the vehicle details are correct") use one `sc-checkbox` on its own.

## Usage

```html
<sc-checkbox-group name="documents" label="Which documents do you have?" hint="Select all that apply">
  <sc-checkbox value="insurance">Valid insurance policy</sc-checkbox>
  <sc-checkbox value="inspection" hint="From a centre approved by RTA">Technical inspection certificate</sc-checkbox>
  <sc-checkbox value="fines">Receipt for paid fines</sc-checkbox>
</sc-checkbox-group>
```

- Legend, hint, `optional`, `error`, `inline`, `heading-level` and `disabled` work as in `sc-radio-group`.
- Say "Select all that apply" in the hint. Order options logically; don't pre-check options for people.
- **Error:** set `error` on the group. The group shows the bar and message; every box gets the error border and `aria-invalid`. The boxes' own `error` is ignored inside a group.

### Structure (v2, light DOM)

The group renders a native `<fieldset>`, `<legend>`, hint and error in light DOM (decision A2) and moves its `sc-checkbox` children inside the fieldset, so they are grouped and named by the legend natively. Each `sc-checkbox` renders its own native `<input type="checkbox">`, `<label>` and hint, so it also works on its own. `disabled` disables the fieldset, and with it every box. The group passes its `name` and error state to each box. Boxes appended later are moved in too.

### Forms

Each checked box submits its own `value` under the group's `name` (or its own `name`): `documents=insurance&documents=fines`, as native checkboxes do. Reset restores each box. With `required`, the first enabled box carries a native validity error ("Select at least one option") until one is checked, so `checkValidity()` and `reportValidity()` work. The native `change` bubbles from each box; `scGroupChange` carries `{ value: string[] }`.

<!-- Auto Generated Below -->


## Overview

Several choices from a short list: "Which documents do you have?".

v2 renders a native `<fieldset>` with its `<legend>`, hint and error in light DOM (Stencil
`scoped`, decision A2), and moves the `sc-checkbox` children into it, so they are grouped
and named by the legend natively. Each checked box submits its own value under the group's
`name`. `disabled` disables the fieldset (and so every box). With `required`, the first box
carries a native validity error until one is checked.

## Properties

| Property       | Attribute       | Description                                                                            | Type                                      | Default     |
| -------------- | --------------- | -------------------------------------------------------------------------------------- | ----------------------------------------- | ----------- |
| `disabled`     | `disabled`      | Disables every checkbox (through the fieldset). Avoid it.                              | `boolean`                                 | `false`     |
| `error`        | `error`         | The error message. Setting it shows the error state on the group and every box.        | `string \| undefined`                     | `undefined` |
| `headingLevel` | `heading-level` | When set (1–6), the legend is also the page heading at this level.                     | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| undefined` | `undefined` |
| `hint`         | `hint`          | Help text below the legend: "Select all that apply".                                   | `string \| undefined`                     | `undefined` |
| `inline`       | `inline`        | Lays short options side by side. They wrap on narrow screens.                          | `boolean`                                 | `false`     |
| `label`        | `label`         | The question, shown as the legend: "Which documents do you have?".                     | `string \| undefined`                     | `undefined` |
| `name`         | `name`          | The name each checked box submits its value under (unless the box has its own `name`). | `string \| undefined`                     | `undefined` |
| `optional`     | `optional`      | Appends "(optional)" to the legend.                                                    | `boolean`                                 | `false`     |
| `required`     | `required`      | Requires at least one box to be checked. Not shown visually.                           | `boolean`                                 | `false`     |


## Events

| Event           | Description                                                                                 | Type                                |
| --------------- | ------------------------------------------------------------------------------------------- | ----------------------------------- |
| `scGroupChange` | Fires when any box is toggled, with the values of all checked boxes: `{ value: string[] }`. | `CustomEvent<{ value: string[]; }>` |


## Slots

| Slot | Description                             |
| ---- | --------------------------------------- |
|      | `sc-checkbox` elements, one per option. |


----------------------------------------------


