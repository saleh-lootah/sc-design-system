# sc-spinner

Shows that something is loading: inline, 20px, in the current text colour. Inside a button, use `sc-button loading` instead. For a whole page, prefer showing content as soon as you can.

## Usage

```html
<sc-spinner></sc-spinner>
<sc-spinner show-label label="Checking your plate number"></sc-spinner>
```

### Behaviour

- The label ("Loading" / "جارٍ التحميل" by default) sits in a polite `role="status"` region. It is visually hidden unless you set `show-label`.
- Under `prefers-reduced-motion` the icon stops spinning (the `--sc-duration-spin` token is `0ms`) and the label is always shown, so the state never depends on motion.
- It takes `currentColor`, so it matches the text around it. Put it in a channel-coloured container to use the channel action colour.

### Content

- Say what is loading when you can: "Checking your plate number", not just "Loading".
- If loading takes more than a few seconds, add text that says what is happening and what to do if it doesn't finish.

### Styling hooks

Parts: `icon`, `label`.

<!-- Auto Generated Below -->


## Overview

Shows that something is loading. Inline, 20px, in the current text colour.

The label ("Loading" by default) is visually hidden and sits in a polite status region.
Under `prefers-reduced-motion` the icon stops spinning and the label becomes visible,
so the state never depends on motion.

Inside a button, use `sc-button loading` instead.

## Properties

| Property    | Attribute    | Description                                                                                 | Type                  | Default     |
| ----------- | ------------ | ------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `label`     | `label`      | What is loading, e.g. "Checking your plate number". Defaults to "Loading" / "جارٍ التحميل". | `string \| undefined` | `undefined` |
| `showLabel` | `show-label` | Shows the label next to the spinner at all times, not only under reduced motion.            | `boolean`             | `false`     |


## Shadow Parts

| Part      | Description                  |
| --------- | ---------------------------- |
| `"icon"`  | The spinner `<svg>` wrapper. |
| `"label"` | The label text.              |


----------------------------------------------


