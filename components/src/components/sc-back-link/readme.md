# sc-back-link

The "Back" control: a 44px glass pill with a back chevron, at the start of `sc-app-bar` or above the question on a form page.

## Usage

```html
<!-- Preferred: the previous page has a URL, so it works without JavaScript. -->
<sc-back-link href="/renew/vehicle"></sc-back-link>

<!-- In a single-page app: a <button>; handle click in your router. -->
<sc-back-link id="back"></sc-back-link>
<script>document.getElementById('back').addEventListener('click', () => history.back());</script>
```

- Use it on every step of a journey except the first. It goes to the previous step, not the start of the service.
- With `href` it renders an `<a>`; without it, a `<button type="button">`. Prefer `href`: it keeps the browser's own behaviour (open in new tab, status bar URL).
- The label defaults to "Back" / "رجوع" in the page language. Override it with the default slot only when "Back" would be unclear: `<sc-back-link href="/vehicles">Back to my vehicles</sc-back-link>`.
- `appearance="glass"` (default) is for the app bar and channel washes. Use `appearance="plain"` inside a page body on a solid surface.

### Arabic

The chevron mirrors, so it points right, toward the start of the line, and sits on the right of the label.

### Accessibility

The accessible name is the label ("Back"). Keyboard: Tab to it, Enter follows the link; Space also activates the button form. It delegates focus, so `el.focus()` focuses the inner control. Under `prefers-reduced-transparency` the glass becomes a solid surface; in forced colours it gets a system-coloured border.

### Styling hooks

Parts: `control`, `label`, `icon`.

<!-- Auto Generated Below -->


## Overview

The "Back" control at the start of an app bar or above a question. A 44px glass pill with
a back chevron that mirrors in right-to-left.

Renders a native `<a>` when `href` is set (the previous page has a URL, which also works
without JavaScript), or a `<button type="button">` otherwise: listen for `click` and go
back in your router. It delegates focus to the inner control.

## Properties

| Property     | Attribute    | Description                                                                                                                                                            | Type                  | Default     |
| ------------ | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `appearance` | `appearance` | Surface. - `glass` (default): translucent pill with an edge and shadow, for app bars and washes. - `plain`: no fill, for use inside a page body under a solid surface. | `"glass" \| "plain"`  | `'glass'`   |
| `href`       | `href`       | The previous page. Without it the control is a `<button>`; handle its `click`.                                                                                         | `string \| undefined` | `undefined` |


## Slots

| Slot | Description                                                            |
| ---- | ---------------------------------------------------------------------- |
|      | Overrides the label. Defaults to "Back" / "رجوع" in the page language. |


## Shadow Parts

| Part        | Description                    |
| ----------- | ------------------------------ |
| `"control"` | The inner `<a>` or `<button>`. |
| `"icon"`    | The chevron wrapper.           |
| `"label"`   | The label wrapper.             |


----------------------------------------------


