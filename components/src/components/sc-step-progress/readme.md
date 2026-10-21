# sc-step-progress

The stepper: where the user is in a short linear journey of 2 to about 7 question pages (NAV-02). Don't use it for branching journeys whose length isn't known.

## Usage

```html
<!-- Full from 600px wide, compact below -->
<sc-step-progress current="2">
  <span>Vehicle</span><span>Plate number</span><span>Check answers</span><span>Pay</span>
</sc-step-progress>

<!-- Compact only, no step names -->
<sc-step-progress current="2" total="4" label="Plate number"></sc-step-progress>
```

- Completed and current steps take the channel action colour; completed ones carry a check, the current one an inner dot and a halo (the channel tint in light mode, the divider in dark mode). Green is never used (U2, CMP-09).
- `layout`: `auto` (default; full when step names are given and the component is at least 600px wide), `compact` or `full`.
- Step names come from the host's child elements (read as text, never shown themselves) or the `steps` property. `current` is 1-based and clamped.
- Full layout: an `<ol>` with `aria-current="step"` on the current step and every state in words ("Step 1 · Done", a hidden "Not started"). Compact: the meta row ("Step 2 of 4") carries the meaning; the markers are hidden.
- Steps run from the right in Arabic; digits stay Latin.

Parts: `meta`, `label`, `count`, `track`, `list`.

<!-- Auto Generated Below -->


## Overview

The stepper: where the user is in a short linear journey (NAV-02, CMP-09). Direction E's
signature component, replacing v1's segmented track.

Completed and current markers take the channel action colour (decision U2); completed
markers carry a check, the current one an inner dot and a halo, upcoming ones a 2px
`outline` edge. Green is never used: it is reserved for genuine success messages.

Two layouts:
- **compact** (phones; E2–E4): a meta row ("Plate number" … "Step 2 of 4") that carries
  the meaning, over a decorative (`aria-hidden`) row of 24px markers.
- **full** (E0): an `<ol>` with one column per step: a 28px marker, a connector to the next
  step (solid behind, dashed ahead), a state line ("Step 1 · Done") and the step name. The
  current step has `aria-current="step"`, and every step says its state in words.

`layout="auto"` (the default) shows the full stepper when step names are given and the
component is at least 600px wide (a container query), and the compact one otherwise.

Step names come from the `steps` property or from the host's child elements, one per step
(`<span>Vehicle</span><span>Plate number</span>…`): they are read as text and are not
rendered themselves. `current` is 1-based and clamped (DDS F-036). Steps run from the
right in Arabic; digits stay Latin.

## Properties

| Property    | Attribute    | Description                                                                                                    | Type                            | Default     |
| ----------- | ------------ | -------------------------------------------------------------------------------------------------------------- | ------------------------------- | ----------- |
| `countText` | `count-text` | Overrides "Step {current} of {total}". Use the `{current}` and `{total}` placeholders.                         | `string \| undefined`           | `undefined` |
| `current`   | `current`    | The current step, from 1. Clamped to 1…total.                                                                  | `number`                        | `1`         |
| `label`     | `label`      | The current step's name in the compact row, e.g. "Plate number". Defaults to the current step's name.          | `string \| undefined`           | `undefined` |
| `layout`    | `layout`     | `auto` (default): full from 600px wide when step names are given, else compact. `compact` or `full` force one. | `"auto" \| "compact" \| "full"` | `'auto'`    |
| `steps`     | --           | The step names, in order, set as a property from JavaScript. Used instead of child elements.                   | `string[] \| undefined`         | `undefined` |
| `total`     | `total`      | How many steps there are. Count only the question pages. Ignored when step names are given.                    | `number`                        | `1`         |


## Shadow Parts

| Part      | Description                                           |
| --------- | ----------------------------------------------------- |
| `"count"` | The "Step 2 of 4" text.                               |
| `"label"` | The current step's name in the compact row.           |
| `"list"`  | The full layout's `<ol>`.                             |
| `"meta"`  | The compact row with the step name and "Step 2 of 4". |
| `"track"` | The compact marker row (decorative).                  |


----------------------------------------------


