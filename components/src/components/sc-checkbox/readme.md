# sc-checkbox

A checkbox: an option in `sc-checkbox-group`, or one box on its own for a single statement people must confirm, such as "I confirm the vehicle details are correct".

## Usage

```html
<sc-checkbox name="confirm" value="yes" required>I confirm the vehicle details are correct</sc-checkbox>
```

- The content is the label. Keep it short; put detail in `hint` (or a `slot="hint"` child, moved into place once).
- 24px box inside a 44px target: the whole label row is clickable. Space toggles it. The tick is a symbol, so it never mirrors in Arabic.
- **On its own:** `error` shows the error bar, the message with "Error:" and `aria-invalid`. `required` reports `valueMissing` until it's checked.
- **In a group:** the group shows the error and passes it down; the box submits its `value` under the group's `name` unless it has its own `name`.
- v2 renders a native `<input type="checkbox">` in light DOM (decision A2): it submits `value` (default `on`) when checked, resets to its initial `checked`, follows `<fieldset disabled>`, and `required` is native `valueMissing`. The native `change` bubbles; `scChange` carries `{ checked, value }`.
- The check draws over 120ms when toggled with a pointer and appears at once from the keyboard (MOT-02).

<!-- Auto Generated Below -->


## Overview

A checkbox: one of several choices in an `sc-checkbox-group`, or on its own for a single
statement ("I confirm the vehicle details are correct").

v2 renders a native `<input type="checkbox">`, its `<label>` (the default slot) and hint in
light DOM (Stencil `scoped`, decision A2). Space toggles it; clicking the label or the 44px
target around the box toggles it. When checked it submits `value` under its `name`, or under
the group's `name` inside `sc-checkbox-group`. On its own it can show an error and use
native `required`; inside a group the group shows the error and marks every box invalid.

## Properties

| Property   | Attribute  | Description                                                                                                | Type                  | Default     |
| ---------- | ---------- | ---------------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `checked`  | `checked`  | Whether the box is checked. Updated when the user toggles it.                                              | `boolean`             | `false`     |
| `disabled` | `disabled` | Disables the checkbox. Avoid it.                                                                           | `boolean`             | `false`     |
| `error`    | `error`    | The error message, for a checkbox on its own. Inside a group, set `error` on the group.                    | `string \| undefined` | `undefined` |
| `hint`     | `hint`     | Help text under the label.                                                                                 | `string \| undefined` | `undefined` |
| `name`     | `name`     | The name submitted with the form. Inside `sc-checkbox-group`, defaults to the group's `name`.              | `string \| undefined` | `undefined` |
| `required` | `required` | On its own: must be checked to submit (native `valueMissing`). Inside a group, use the group's `required`. | `boolean`             | `false`     |
| `value`    | `value`    | The value submitted when checked.                                                                          | `string`              | `'on'`      |


## Events

| Event      | Description                                                                                      | Type                                                |
| ---------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------- |
| `scChange` | Fires when the box is toggled with `{ checked, value }`. The native `change` event also bubbles. | `CustomEvent<{ checked: boolean; value: string; }>` |


## Slots

| Slot | Description                                                                 |
| ---- | --------------------------------------------------------------------------- |
|      | The label: "Valid insurance policy". Keep it short; put detail in the hint. |


----------------------------------------------


