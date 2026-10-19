# sc-channel-chip

Points to another channel that also offers this service: "Also on Dubai Transport". It is the one component that names a channel: it sets `data-channel` on itself, so it always shows that channel's subtle and ink colours, whatever channel the page is in.

## Usage

```html
<!-- A label -->
<sc-channel-chip channel="transport"></sc-channel-chip>

<!-- A link to the service on that channel -->
<sc-channel-chip channel="transport" href="https://transport.dubai.gov.ae/renew"></sc-channel-chip>
```

`channel` is one of `now`, `transport`, `visit`, `justice`, `build`, `invest`, `trade`.

### Content

- The text comes from strings: "Also on {channel}" / "متوفر أيضًا في {channel}", with the channel's own name. Override it with `label` or the default slot only when the chip says something more specific ("Pay fines on Dubai Justice"), and always name the channel.
- Use it on service cards and service start pages, never as the main way forward.

### Link

With `href` it renders an `<a>` with an end chevron (mirrored in Arabic). The pill stays compact (about 30px) but its hit area grows to 44px without moving the layout; leave a little space above and below it. Without `href` it isn't focusable.

### Styling hooks

Parts: `chip`, `dot`, `icon` (links only).

<!-- Auto Generated Below -->


## Overview

Points to another channel that also offers this service: "Also on Dubai Transport".

The chip sets `data-channel` on itself, so it shows that channel's subtle and ink
colours whatever channel the page is in. This is the one component allowed to name
a channel. With `href` it is a link to the service on that channel.

## Properties

| Property               | Attribute | Description                                                                                    | Type                                                                             | Default     |
| ---------------------- | --------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ----------- |
| `channel` _(required)_ | `channel` | The channel to point to: `now`, `transport`, `visit`, `justice`, `build`, `invest` or `trade`. | `"build" \| "invest" \| "justice" \| "now" \| "trade" \| "transport" \| "visit"` | `undefined` |
| `href`                 | `href`    | Makes the chip a link to the service on that channel.                                          | `string \| undefined`                                                            | `undefined` |
| `label`                | `label`   | Overrides the text (default "Also on {channel}" / "متوفر أيضًا في {channel}" from strings).    | `string \| undefined`                                                            | `undefined` |


## Slots

| Slot | Description                                                                  |
| ---- | ---------------------------------------------------------------------------- |
|      | Optional custom text, used instead of "Also on {channel}". Name the channel. |


## Shadow Parts

| Part     | Description                                             |
| -------- | ------------------------------------------------------- |
| `"chip"` | The pill (`<a>` with `href`, otherwise `<span>`).       |
| `"dot"`  | The channel dot.                                        |
| `"icon"` | The end chevron (links only; mirrors in right-to-left). |


----------------------------------------------


