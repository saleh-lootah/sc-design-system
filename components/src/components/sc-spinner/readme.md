# sc-spinner

A short inline wait, with a label saying what is loading. Inside a button, use `sc-button loading` instead.

## Usage

```html
<sc-spinner label="Checking your plate number"></sc-spinner>
<sc-spinner show-label label="Checking your plate number"></sc-spinner>
<sc-spinner size="m"></sc-spinner>
```

- 24px (`size="l"`, the default) or 20px (`size="m"`, inline with body text), in `currentColor`. A visible label is `body-medium` in `on-surface`, 12px from the arc.
- One turn per `--sc-duration-spin` (600ms, linear): a faster spinner makes loading feel faster.
- The label sits in a polite `role="status"` region and is visually hidden unless `show-label` is set. Under reduced motion the arc stops and the label shows. It never mirrors.

Parts: `icon`, `label`.

<!-- Auto Generated Below -->


## Overview

Shows that something is loading: a short inline wait, with a label saying what.

v2: 24px (`size="l"`, the default) or 20px (`size="m"`, inline with body text), in
`currentColor`, turning once per `--sc-duration-spin` (600ms, linear: a faster spinner
makes loading feel faster). The label ("Loading" by default) sits in a polite
`role="status"` region, 12px from the arc in `on-surface`, and is visually hidden.
Under `prefers-reduced-motion` the arc stops and the label shows, so the state never
depends on motion (MOT-15). It never mirrors.

Inside a button, use `sc-button loading` instead.

## Properties

| Property    | Attribute    | Description                                                                                 | Type                  | Default     |
| ----------- | ------------ | ------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `label`     | `label`      | What is loading, e.g. "Checking your plate number". Defaults to "Loading" / "جارٍ التحميل". | `string \| undefined` | `undefined` |
| `showLabel` | `show-label` | Shows the label next to the spinner at all times, not only under reduced motion.            | `boolean`             | `false`     |
| `size`      | `size`       | `l` 24px, standalone (default); `m` 20px, inline with body text.                            | `"l" \| "m"`          | `'l'`       |


## Shadow Parts

| Part      | Description                  |
| --------- | ---------------------------- |
| `"icon"`  | The spinner `<svg>` wrapper. |
| `"label"` | The label text.              |


----------------------------------------------


