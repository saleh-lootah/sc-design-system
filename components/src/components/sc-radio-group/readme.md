# sc-radio-group

One choice from a short list (about 7 options or fewer): who issued the plate, how to receive the registration card, "Yes" or "No". Use `sc-checkbox-group` when people can pick more than one, and `sc-select` for long lists.

## Usage

```html
<sc-radio-group name="delivery" label="How do you want to receive your registration card?" value="digital">
  <sc-radio value="digital" hint="In the Dubai Now app and your digital wallet">Digital card</sc-radio>
  <sc-radio value="courier" hint="AED 20, delivered in 2 working days">Courier delivery</sc-radio>
  <sc-radio value="centre">Collect from a customer service centre</sc-radio>
</sc-radio-group>
```

- **Legend:** `label` is the question. When it's the only question on the page, add `heading-level="1"` so the legend is the page heading (`<legend><h1>…</h1></legend>`).
- **Options:** one `sc-radio` per option, with `value`, an optional `hint`, `checked` for the initial choice (or `value` on the group) and `disabled` (avoid it; leave out options that don't apply).
- **Inline:** `inline` lays out two short options side by side ("Yes" / "No"). They wrap on narrow screens.
- **Error:** `error` on the group ("Select who issued the plate") shows the bar, the message with "Error:", and an error border on every radio; the group gets `aria-invalid`.
- 24px radios inside 44px targets: the whole label row is clickable.
- Order options alphabetically unless there's a reason not to (most common first, or a natural order). Don't pre-select an option people might skip over without reading.

### Structure (v2, light DOM)

Native radios only form a group (one Tab stop, arrow keys, "2 of 3") when they share a name in one tree. v2 gets that for free from light DOM (decision A2):

1. `sc-radio-group` renders a native `<fieldset role="radiogroup">` with the `<legend>`, hint and error (in the fieldset's `aria-describedby`), and moves its `sc-radio` children inside it.
2. Each `sc-radio` renders its own native `<input type="radio">`, `<label for>` and hint. The group passes down its `name` (or a generated one), the chosen value, the error state and `required`.
3. The browser does the rest: one Tab stop (the checked radio, or the first), Arrow keys move and select (and wrap; in Arabic too), Space selects, position in set, clicking the option text. No roving-tabindex script, and no manual slot assignment (v1 needed both a shadow root and `slot.assign()`).

Options added later are moved in too.

### Forms

The radios are native: the chosen value submits under `name`, `form.reset()` restores the initial choice, `disabled` disables the fieldset, and `required` is native `valueMissing` on every radio (`reportValidity()` focuses the first). `focus()` on the host lands on the chosen radio, or the first. Without `name` the radios share a generated name, which a form would submit: name the group inside a form. The native `change` bubbles from the radio; `scChange` carries `{ value }`.

<!-- Auto Generated Below -->


## Overview

One choice from a short list: "Who issued the plate?".

v2 renders a native `<fieldset>` (role `radiogroup`) with its `<legend>`, hint and error in
light DOM (Stencil `scoped`, decision A2), and moves the `sc-radio` children into it. Each
`sc-radio` renders a native radio with the group's `name`, so they form a real native radio
group: one Tab stop, arrow keys move and select, position in set, native submission,
reset and `required`. `disabled` disables the fieldset. `focus()` on the host reaches the
chosen radio, or the first.

Without a `name`, the radios share a generated one (`sc-radio-group-3`), which a form
would submit: give the group a `name` inside a form.

## Properties

| Property       | Attribute       | Description                                                                                        | Type                                      | Default     |
| -------------- | --------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------- | ----------- |
| `disabled`     | `disabled`      | Disables every option (through the fieldset). Avoid it.                                            | `boolean`                                 | `false`     |
| `error`        | `error`         | The error message. Setting it shows the error state: "Select who issued the plate".                | `string \| undefined`                     | `undefined` |
| `headingLevel` | `heading-level` | When set (1–6), the legend is also the page heading at this level (`<legend><h1>…</h1></legend>`). | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| undefined` | `undefined` |
| `hint`         | `hint`          | Help text below the legend.                                                                        | `string \| undefined`                     | `undefined` |
| `inline`       | `inline`        | Lays two short options side by side ("Yes" / "No"). They wrap on narrow screens.                   | `boolean`                                 | `false`     |
| `label`        | `label`         | The question, shown as the legend: "Who issued the plate?".                                        | `string \| undefined`                     | `undefined` |
| `name`         | `name`          | The name submitted with the form.                                                                  | `string \| undefined`                     | `undefined` |
| `optional`     | `optional`      | Appends "(optional)" to the legend.                                                                | `boolean`                                 | `false`     |
| `required`     | `required`      | Requires a choice (native `valueMissing` until one is made). Not shown visually.                   | `boolean`                                 | `false`     |
| `value`        | `value`         | The chosen value. Defaults to the `sc-radio` with `checked`.                                       | `string \| undefined`                     | `undefined` |


## Events

| Event      | Description                                                                                            | Type                              |
| ---------- | ------------------------------------------------------------------------------------------------------ | --------------------------------- |
| `scChange` | Fires when the choice changes with `{ value }`. The native `change` event also bubbles from the radio. | `CustomEvent<{ value: string; }>` |


## Slots

| Slot | Description                          |
| ---- | ------------------------------------ |
|      | `sc-radio` elements, one per option. |


----------------------------------------------


