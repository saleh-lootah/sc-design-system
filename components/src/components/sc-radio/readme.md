# sc-radio

One option of an `sc-radio-group`. Use it only inside a group.

## Usage

```html
<sc-radio-group name="issuer" label="Who issued the plate?">
  <sc-radio value="dubai">Dubai</sc-radio>
  <sc-radio value="other" hint="Abu Dhabi, Sharjah or another emirate">Another emirate</sc-radio>
</sc-radio-group>
```

- The content is the option's label: short, sentence case, no full stop. Use `<sc-ltr>` around values that must stay left-to-right.
- `hint` adds a line under the label, linked to the radio with `aria-describedby`.
- `checked` makes it the initial choice (the group's `value` wins if both are set). `disabled` is supported but avoid it.

v2 renders a native `<input type="radio">`, `<label>` and hint in light DOM (decision A2). The group passes down the shared `name`, the choice, the error state and `required`, so all the radios form one native group. Use it only inside `sc-radio-group`. The dot scales in from 0.5 over 120ms when chosen with a pointer, and appears at once from the keyboard.

<!-- Auto Generated Below -->


## Overview

One option in an `sc-radio-group`. Its content is the option's label.

v2 renders a native `<input type="radio">`, its `<label>` and hint in light DOM (Stencil
`scoped`, decision A2). Every radio in a group shares the group's `name` in one document
tree, so they form a real native radio group: one Tab stop, arrow keys move and select,
"2 of 3" is announced, and the form submits the chosen value. Use it only inside
`sc-radio-group`, which passes down the name, the chosen value and the error state.

## Properties

| Property             | Attribute  | Description                                                              | Type                  | Default     |
| -------------------- | ---------- | ------------------------------------------------------------------------ | --------------------- | ----------- |
| `checked`            | `checked`  | Chosen when the page loads (unless the group has a `value`).             | `boolean`             | `false`     |
| `disabled`           | `disabled` | Disables this option. Avoid it; remove options that don't apply instead. | `boolean`             | `false`     |
| `hint`               | `hint`     | Help text under this option's label.                                     | `string \| undefined` | `undefined` |
| `value` _(required)_ | `value`    | The value submitted when this option is chosen.                          | `string`              | `undefined` |


## Slots

| Slot | Description                                                          |
| ---- | -------------------------------------------------------------------- |
|      | The option label: "Dubai". Text, or text with `<sc-ltr>` for values. |


----------------------------------------------


