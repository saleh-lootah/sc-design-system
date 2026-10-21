# sc-back-link

"Back" to the previous step, on every step of a journey except the first. Spec: `specs/sc-back-link.md`.

## Usage

```html
<sc-back-link href="/en/renew/vehicle"></sc-back-link>
<sc-back-link></sc-back-link> <!-- a button: handle click in your router -->
```

- Plain text and a 24px back arrow in `on-surface`, on a 44px target. The arrow mirrors in Arabic and stays at the start.
- Use `href` whenever the previous step has a URL, so it works without JavaScript.
- The label defaults to "Back" / "رجوع". Change it only to say where it goes: "Back to my vehicles".
- In `sc-app-bar` it sits in the start slot. Never use it to go to the start of the service.
- `appearance` is deprecated in v2 and ignored.

### Styling hooks

Parts: `control`, `label`, `icon`.

<!-- Auto Generated Below -->


## Overview

The "Back" control at the start of an app bar or above a question: plain text with a
24px back arrow that mirrors in right-to-left, on a 44px target (v2 drops v1's glass pill).

Renders a native `<a>` when `href` is set (the previous page has a URL, which also works
without JavaScript), or a `<button type="button">` otherwise: listen for `click` and go
back in your router. It delegates focus to the inner control.

## Properties

| Property     | Attribute    | Description                                                                                                                                                 | Type                  | Default     |
| ------------ | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `appearance` | `appearance` | Deprecated in v2 and ignored: the back link has one plain appearance on every surface. Kept so v1 markup (`appearance="glass"` or `"plain"`) still renders. | `string \| undefined` | `undefined` |
| `href`       | `href`       | The previous page. Without it the control is a `<button>`; handle its `click`.                                                                              | `string \| undefined` | `undefined` |


## Slots

| Slot | Description                                                            |
| ---- | ---------------------------------------------------------------------- |
|      | Overrides the label. Defaults to "Back" / "رجوع" in the page language. |


## Shadow Parts

| Part        | Description                    |
| ----------- | ------------------------------ |
| `"control"` | The inner `<a>` or `<button>`. |
| `"icon"`    | The arrow wrapper.             |
| `"label"`   | The label wrapper.             |


----------------------------------------------


