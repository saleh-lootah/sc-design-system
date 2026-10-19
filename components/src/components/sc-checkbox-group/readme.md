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

### How it stays accessible across shadow roots

Unlike radios, checkboxes don't need to share a tree: each one is independent (its own Tab stop, Space toggles it). So each `sc-checkbox` keeps its own native `<input type="checkbox">`, `<label>` and hint in **its own shadow root**, which also lets it work on its own. The group renders the `<fieldset>`, `<legend>`, hint and error in its shadow root and slots the checkboxes inside the fieldset. The accessibility tree follows the flattened tree, so screen readers find the checkboxes inside the group named by the legend and described by the hint and error. The group passes its error and disabled state down to each box.

Tested in `sc-checkbox-group.e2e.ts` against Chromium's accessibility tree (group name and description, checkbox names inside the group), with the keyboard (Tab to each box, Space toggles) and axe in English and Arabic, light and dark.

### Forms

Each checked box submits its own `value` under the group's `name` (or its own `name`), so the form data is `documents=insurance&documents=fines`, as with native checkboxes. Reset restores each box. The group is form-associated only to report `valueMissing` when `required` and nothing is checked. `scGroupChange` carries `{ value: string[] }`, the checked values.

<!-- Auto Generated Below -->


## Overview

Several choices from a short list: "Which documents do you have?".

A `<fieldset>` with a `<legend>`, hint and error in this element's shadow root, with the
`sc-checkbox` children slotted inside it. Each checkbox keeps its own native input, label
and hint in its own shadow root (so `sc-checkbox` also works on its own); the fieldset
groups them in the accessibility tree, which follows the flattened tree. The group's
hint and error describe the fieldset, and in the error state every box gets
`aria-invalid` and an error border.

Each checked box submits its own value under the group's `name` (or its own). The group is
form-associated only to report `valueMissing` when `required` and nothing is checked.

## Properties

| Property       | Attribute       | Description                                                                            | Type                                      | Default     |
| -------------- | --------------- | -------------------------------------------------------------------------------------- | ----------------------------------------- | ----------- |
| `disabled`     | `disabled`      | Disables every checkbox. Avoid it.                                                     | `boolean`                                 | `false`     |
| `error`        | `error`         | The error message. Setting it shows the error state on the group and every box.        | `string \| undefined`                     | `undefined` |
| `headingLevel` | `heading-level` | When set (1–6), the legend is also the page heading at this level.                     | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| undefined` | `undefined` |
| `hint`         | `hint`          | Help text below the legend: "Select all that apply".                                   | `string \| undefined`                     | `undefined` |
| `inline`       | `inline`        | Lays short options side by side. They wrap on narrow screens.                          | `boolean`                                 | `false`     |
| `label`        | `label`         | The question, shown as the legend: "Which documents do you have?".                     | `string \| undefined`                     | `undefined` |
| `name`         | `name`          | The name each checked box submits its value under (unless the box has its own `name`). | `string \| undefined`                     | `undefined` |
| `optional`     | `optional`      | Appends "(optional)" to the legend.                                                    | `boolean`                                 | `false`     |
| `required`     | `required`      | Requires at least one box to be checked (`valueMissing`). Not shown visually.          | `boolean`                                 | `false`     |


## Events

| Event           | Description                                                                                 | Type                                |
| --------------- | ------------------------------------------------------------------------------------------- | ----------------------------------- |
| `scGroupChange` | Fires when any box is toggled, with the values of all checked boxes: `{ value: string[] }`. | `CustomEvent<{ value: string[]; }>` |


## Slots

| Slot      | Description                                       |
| --------- | ------------------------------------------------- |
|           | `sc-checkbox` elements, one per option.           |
| `"error"` | Rich error content, instead of the `error` prop.  |
| `"hint"`  | Rich hint content, instead of the `hint` prop.    |
| `"label"` | Rich legend content, instead of the `label` prop. |


## Shadow Parts

| Part        | Description                            |
| ----------- | -------------------------------------- |
| `"error"`   | The error message.                     |
| `"field"`   | The `<fieldset>` (gets the error bar). |
| `"hint"`    | The hint.                              |
| `"label"`   | The `<legend>`.                        |
| `"options"` | The wrapper around the checkboxes.     |


----------------------------------------------


