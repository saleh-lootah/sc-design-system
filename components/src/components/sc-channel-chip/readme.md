# sc-channel-chip

Points to another channel that also offers this service: "Also on Dubai Transport". Spec: `specs/sc-channel-chip.md`.

## Usage

```html
<sc-channel-chip channel="transport"></sc-channel-chip>
<sc-channel-chip channel="transport" href="/en/transport/renew"></sc-channel-chip>
<sc-channel-chip channel="visit" variant="outlined" label="On Visit Dubai"></sc-channel-chip>
```

- The chip sets `data-channel` on itself and shows that channel's colours: an 8px dot and the label in its action colour.
- `variant="subtle"` (default) on white cards; `variant="outlined"` (surface fill, 1px channel outline, Bold) on a channel tint.
- 32px tall with a 44px hit area when it is a link. A linked chip underlines on hover only: its shape and end chevron identify it as a link (R6). It follows on release, never on press. Never dismissable, never the main way forward.

### Styling hooks

Parts: `chip`, `dot`, `icon`.

<!-- Auto Generated Below -->


## Overview

Points to another channel that also offers this service: "Also on Dubai Transport".

The chip sets `data-channel` on itself, so it shows that channel's colours whatever
channel the page is in. This is the one component allowed to name a channel; other
channels' colours appear only as attribution like this. With `href` it is a link to the
service on that channel, with a 44px hit area that does not change the layout.
Channel chips are never dismissable.

## Properties

| Property               | Attribute | Description                                                                                                                                                                                                               | Type                                                                             | Default     |
| ---------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ----------- |
| `channel` _(required)_ | `channel` | The channel to point to: `now`, `transport`, `visit`, `justice`, `build`, `invest` or `trade`.                                                                                                                            | `"build" \| "invest" \| "justice" \| "now" \| "trade" \| "transport" \| "visit"` | `undefined` |
| `href`                 | `href`    | Makes the chip a link to the service on that channel.                                                                                                                                                                     | `string \| undefined`                                                            | `undefined` |
| `label`                | `label`   | Overrides the text (default "Also on {channel}" / "متوفر أيضًا في {channel}" from strings).                                                                                                                               | `string \| undefined`                                                            | `undefined` |
| `variant`              | `variant` | - `subtle` (default): the channel's subtle tint, for white cards. - `outlined`: a white chip with a 1px channel outline and a Bold label, for chips that   sit on a channel tint (life-event rows, "On Dubai Transport"). | `"outlined" \| "subtle"`                                                         | `'subtle'`  |


## Slots

| Slot | Description                                                                  |
| ---- | ---------------------------------------------------------------------------- |
|      | Optional custom text, used instead of "Also on {channel}". Name the channel. |


## Shadow Parts

| Part     | Description                                             |
| -------- | ------------------------------------------------------- |
| `"chip"` | The chip (`<a>` with `href`, otherwise `<span>`).       |
| `"dot"`  | The 8px channel dot.                                    |
| `"icon"` | The end chevron (links only; mirrors in right-to-left). |


----------------------------------------------


