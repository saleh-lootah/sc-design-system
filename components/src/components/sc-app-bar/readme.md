# sc-app-bar

The transaction app bar: the bar at the top of every step of a journey (component-language A4). Channel pages outside a transaction use `sc-site-header`. Spec: `specs/sc-app-bar.md`.

## Usage

```html
<sc-app-bar sticky>
  <sc-back-link slot="start" href="/en/renew-vehicle-registration/vehicle"></sc-back-link>
  <sc-language-switch slot="end" href="/ar/renew-vehicle-registration/plate"></sc-language-switch>
</sc-app-bar>
```

- The title is the current channel's name in the page language; `<span slot="title">` overrides it.
- `align="start"` and `shape="floating"` (v1's desktop header) are deprecated: use `sc-site-header`.

<!-- Auto Generated Below -->


## Overview

The transaction app bar (component-language A4; Standard TPL-01, LANG-04): the bar at the
top of every step of a journey (E2–E4). Channel pages outside a transaction use
`sc-site-header` instead.

A 4px rule in `channel-action` along the top; a start slot (the back link), the title (a
10px channel swatch and the channel name, centred) and an end slot (the language switch),
with fixed 96px side slots so the title stays centred; a 1px `outline-variant` rule
beneath. 60px tall on `surface`. Flat: no glass, no shadow.

The host is a `banner` landmark unless `landmark` is false. It is not fixed by default;
with `sticky`, `sc-page sync-document` sets `scroll-padding-top` so focus never slides
under it (WCAG 2.4.11).

## Properties

| Property   | Attribute  | Description                                                                                                                                                                                        | Type                  | Default    |
| ---------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ---------- |
| `align`    | `align`    | `center` (default): the journey bar, title in the middle. `start`: deprecated (v1's desktop header): the title at the start and the default slot after it. Use `sc-site-header` for channel pages. | `"center" \| "start"` | `'center'` |
| `landmark` | `landmark` | Makes the host a `banner` landmark. Set it to false when the page already has a banner, or when the bar sits inside a dialog.                                                                      | `boolean`             | `true`     |
| `shape`    | `shape`    | Deprecated and ignored: v2 has no floating glass capsule (ELV-04).                                                                                                                                 | `"bar" \| "floating"` | `'bar'`    |
| `sticky`   | `sticky`   | Keeps the bar at the top of the viewport while the page scrolls (`position: sticky`).                                                                                                              | `boolean`             | `false`    |


## Slots

| Slot      | Description                                                                                     |
| --------- | ----------------------------------------------------------------------------------------------- |
|           | Deprecated (v1 desktop header, `align="start"`): content after the title. Use `sc-site-header`. |
| `"end"`   | Usually `<sc-language-switch>`.                                                                 |
| `"start"` | Usually `<sc-back-link>`.                                                                       |
| `"title"` | The channel name. Defaults to the channel's name in the page language.                          |


## Shadow Parts

| Part        | Description               |
| ----------- | ------------------------- |
| `"bar"`     | The bar.                  |
| `"content"` | The default slot wrapper. |
| `"end"`     | The end slot wrapper.     |
| `"start"`   | The start slot wrapper.   |
| `"title"`   | The title wrapper.        |


----------------------------------------------


