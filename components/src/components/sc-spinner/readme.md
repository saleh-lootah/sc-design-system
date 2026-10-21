# sc-spinner

A short inline wait, with a label saying what is loading. Inside a button, use `sc-button loading` instead.

## Usage

```html
<sc-spinner label="Checking your plate number"></sc-spinner>
<sc-spinner show-label label="Checking your plate number"></sc-spinner>
<sc-spinner size="l"></sc-spinner>
```

- 20px (`size="m"`, inline with body text) or 24px (`size="l"`), in `currentColor`.
- One turn per `--sc-duration-spin` (600ms, linear): a faster spinner makes loading feel faster.
- The label sits in a polite `role="status"` region and is visually hidden unless `show-label` is set. Under reduced motion the arc stops and the label shows. It never mirrors.

Parts: `icon`, `label`.

<!-- Auto Generated Below -->


## Overview

Shows that something is loading: a short inline wait, with a label saying what.

v2: 20px (`size="m"`, inline) or 24px (`size="l"`), in `currentColor`, turning once per
`--sc-duration-spin` (600ms, linear: a faster spinner makes loading feel faster). The label
("Loading" by default) sits in a polite `role="status"` region and is visually hidden.
Under `prefers-reduced-motion` the arc stops and the label shows, so the state never
depends on motion (MOT-15). It never mirrors.

Inside a button, use `sc-button loading` instead.

## Properties

| Property    | Attribute    | Description                                                                                 | Type                  | Default     |
| ----------- | ------------ | ------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `label`     | `label`      | What is loading, e.g. "Checking your plate number". Defaults to "Loading" / "جارٍ التحميل". | `string \| undefined` | `undefined` |
| `showLabel` | `show-label` | Shows the label next to the spinner at all times, not only under reduced motion.            | `boolean`             | `false`     |
| `size`      | `size`       | `m` 20px, inline with body text (default); `l` 24px, standalone.                            | `"l" \| "m"`          | `'m'`       |


## Shadow Parts

| Part      | Description                  |
| --------- | ---------------------------- |
| `"icon"`  | The spinner `<svg>` wrapper. |
| `"label"` | The label text.              |


----------------------------------------------


