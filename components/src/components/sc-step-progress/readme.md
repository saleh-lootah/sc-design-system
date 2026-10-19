# sc-step-progress

Shows where the user is in a short journey: "Step 2 of 4", the current step's name and a segmented track. Use it for linear journeys of 2 to about 7 question pages. Don't use it for long or branching journeys, where the total isn't known.

## Usage

```html
<sc-step-progress current="2" total="4" label="Plate number"></sc-step-progress>
```

In D+ it sits in a glass capsule at the top of the page; the capsule is layout, not part of the component.

### Behaviour

- The text carries the meaning: "Step 2 of 4" / "الخطوة 2 من 4", with Latin digits in both languages. The track is decorative and hidden from assistive tech (`aria-hidden`).
- Done segments and half of the current one are filled with the channel action colour; upcoming segments use the control colour. The track fills from the inline start, so from the right in Arabic.
- `current` is clamped between 1 and `total`.
- Override the wording with `count-text`, keeping the `{current}` and `{total}` placeholders.

### Content

- Count only the question pages: not the start page, "Check your answers" or the confirmation.
- `label` is the current step's short name, matching the page's heading in spirit ("Plate number", "Pay").

### Styling hooks

Parts: `meta`, `label`, `count`, `track`.

<!-- Auto Generated Below -->


## Overview

Shows where the user is in a short journey: "Step 2 of 4", with the current step's
name and a segmented track.

The text carries the meaning; the track is decorative (`aria-hidden`). Done and
current segments use the channel action colour, upcoming ones the control colour;
the current segment is half filled. The track fills from the inline start,
so from the right in Arabic. Digits stay Latin in both languages.

## Properties

| Property    | Attribute    | Description                                                                                                                   | Type                  | Default     |
| ----------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `countText` | `count-text` | Overrides "Step {current} of {total}" (default from strings). Use `{current}` and `{total}` placeholders to keep the numbers. | `string \| undefined` | `undefined` |
| `current`   | `current`    | The current step, from 1. Clamped to `total`.                                                                                 | `number`              | `1`         |
| `label`     | `label`      | The current step's name, e.g. "Plate number". Shown at the start of the row.                                                  | `string \| undefined` | `undefined` |
| `total`     | `total`      | How many steps there are. Count only the question pages, not "Check your answers" or the confirmation.                        | `number`              | `1`         |


## Shadow Parts

| Part      | Description                                   |
| --------- | --------------------------------------------- |
| `"count"` | The "Step 2 of 4" text.                       |
| `"label"` | The current step's name.                      |
| `"meta"`  | The row with the step name and "Step 2 of 4". |
| `"track"` | The segmented track.                          |


----------------------------------------------


