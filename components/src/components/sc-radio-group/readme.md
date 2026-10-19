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

### How it stays accessible across shadow roots

ARIA can't point across shadow boundaries, and native radios only form a group (one Tab stop, arrow keys, "2 of 3") when they share a tree and a name. So the group, not each option, renders the controls:

1. `sc-radio-group` renders, in **its own shadow root**, a `<fieldset role="radiogroup" aria-labelledby="label">` with the `<legend id="label">`, the hint and error (both in the fieldset's `aria-describedby`), and **one native `<input type="radio" name="choice">` per `sc-radio`**, each with its own `<label for>` and option hint (`aria-describedby`).
2. Each `sc-radio` element is slotted into its option's `<label>` with **manual slot assignment** (`slotAssignment: 'manual'`, `slot.assign()`), so it doesn't need (or get) a `slot` attribute. Its content is the radio's accessible name: the accessibility tree and label activation follow the flattened tree.
3. Because every radio is native and in one tree with one name, the browser provides everything: one Tab stop (the checked radio, or the first), Arrow keys move **and select** (and wrap), Space selects, position in set is announced, and clicking the option text selects it. No roving-tabindex script.

`sc-radio` itself only holds data and the label content; it reflects `value`, `hint`, `checked` and `disabled` to attributes, and the group watches them (and added or removed options) with a `MutationObserver`.

This is tested in `sc-radio-group.e2e.ts` against Chromium's accessibility tree (radiogroup name and description, radio names from slotted content, option hint descriptions), with the keyboard (Tab in, ArrowDown/ArrowUp select, Tab out, Shift+Tab back to the checked radio, the same in Arabic), and with axe in English and Arabic, light and dark, on every channel.

### Forms

Form-associated: submits the chosen value under `name`, resets to the initial choice, follows `<fieldset disabled>`, and with `required` reports `valueMissing` (anchored to the first radio, which `reportValidity()` focuses). The host delegates focus, so an error summary that focuses `#issuer` lands on the first radio. `change` is re-dispatched on the host and `scChange` carries `{ value }`.

<!-- Auto Generated Below -->


## Overview

One choice from a short list: "Who issued the plate?".

A `<fieldset>` with a `<legend>` (exposed as `role="radiogroup"`, labelled by the legend
and described by the hint and error), and one native `<input type="radio">` per
`sc-radio` child, all inside this element's shadow root. Each `sc-radio` is slotted into
its option's `<label>` (manual slot assignment), so its content names the radio while the
radios themselves stay in one tree: native arrow keys, one Tab stop, position in set.

Form-associated: submits the chosen value under `name`, resets, and reports
`valueMissing` when `required`. Delegates focus, so an error-summary link to the host's
`id` focuses the first radio.

## Properties

| Property       | Attribute       | Description                                                                                                                                              | Type                                      | Default     |
| -------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ----------- |
| `disabled`     | `disabled`      | Disables every option. Avoid it.                                                                                                                         | `boolean`                                 | `false`     |
| `error`        | `error`         | The error message. Setting it shows the error state: "Select who issued the plate".                                                                      | `string \| undefined`                     | `undefined` |
| `headingLevel` | `heading-level` | When set (1–6), the legend is also the page heading at this level (`<legend><h1>…</h1></legend>`). Use it when the question is the only one on the page. | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| undefined` | `undefined` |
| `hint`         | `hint`          | Help text below the legend.                                                                                                                              | `string \| undefined`                     | `undefined` |
| `inline`       | `inline`        | Lays two short options side by side ("Yes" / "No"). They wrap on narrow screens.                                                                         | `boolean`                                 | `false`     |
| `label`        | `label`         | The question, shown as the legend: "Who issued the plate?".                                                                                              | `string \| undefined`                     | `undefined` |
| `name`         | `name`          | The name submitted with the form.                                                                                                                        | `string \| undefined`                     | `undefined` |
| `optional`     | `optional`      | Appends "(optional)" to the legend.                                                                                                                      | `boolean`                                 | `false`     |
| `required`     | `required`      | Requires a choice (`valueMissing` until one is made). Not shown visually.                                                                                | `boolean`                                 | `false`     |
| `value`        | `value`         | The chosen value. Defaults to the `sc-radio` with `checked`.                                                                                             | `string \| undefined`                     | `undefined` |


## Events

| Event      | Description                                                                                       | Type                              |
| ---------- | ------------------------------------------------------------------------------------------------- | --------------------------------- |
| `scChange` | Fires when the choice changes with `{ value }`. A native `change` is also dispatched on the host. | `CustomEvent<{ value: string; }>` |


## Slots

| Slot      | Description                                       |
| --------- | ------------------------------------------------- |
|           | `sc-radio` elements, one per option.              |
| `"error"` | Rich error content, instead of the `error` prop.  |
| `"hint"`  | Rich hint content, instead of the `hint` prop.    |
| `"label"` | Rich legend content, instead of the `label` prop. |


## Shadow Parts

| Part             | Description                            |
| ---------------- | -------------------------------------- |
| `"error"`        | The error message.                     |
| `"field"`        | The `<fieldset>` (gets the error bar). |
| `"hint"`         | The hint.                              |
| `"label"`        | The `<legend>`.                        |
| `"option"`       | One option row.                        |
| `"option-hint"`  | An option's hint.                      |
| `"option-label"` | An option's `<label>`.                 |
| `"options"`      | The wrapper around the options.        |
| `"radio"`        | A native `<input type="radio">`.       |


----------------------------------------------


