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

`sc-radio` doesn't render a radio itself: the group renders a native radio for each option in its own shadow root and slots this element into that radio's `<label>`, so all the radios form one native group. See `sc-radio-group` for why.

<!-- Auto Generated Below -->


## Overview

One option in an `sc-radio-group`. Its content is the option's label.

`sc-radio` holds data and label content only. The parent `sc-radio-group` renders the
native `<input type="radio">` for every option inside its own shadow root and slots
this element into that option's `<label>`, so all the radios share one tree: they form a
real native radio group (one Tab stop, arrow keys move and select, "2 of 3" announced).
Use it only inside `sc-radio-group`.

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


