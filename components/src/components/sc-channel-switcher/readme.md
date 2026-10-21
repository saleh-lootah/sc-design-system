# sc-channel-switcher

The channel's logo and the channel switcher (Standard CHR-03), for `sc-site-header`'s `slot="switcher"`. Spec: `specs/sc-channel-switcher.md`.

## Usage

```html
<sc-channel-switcher slot="switcher"
  links='{"now":"https://now.example/{lang}/","transport":"https://transport.example/{lang}/","visit":"…","justice":"…","build":"…","invest":"…","trade":"…"}'>
</sc-channel-switcher>
```

- Give all seven links; `{lang}` becomes `en` or `ar`. A channel without a link is listed as text.
- The current channel comes from `channel` or the closest `data-channel`.
- Put the channel's own logo (24px, `alt=""`) inside to replace the swatch (10px, in the channel colour) the trigger shows without one.
- Light DOM: each item sets its own `data-channel`, so its swatch is that channel's colour.

<!-- Auto Generated Below -->


## Overview

The channel's logo and the channel switcher, at the inline-end of `sc-site-header`
(Standard CHR-01, CHR-03; component-language B2a).

A disclosure, not an ARIA menu: a `<button aria-expanded>` named "Choose a channel: Dubai
Now" opens a non-modal panel listing all seven channels as links, in the Standard 3.1
order, each with its name, a one-line descriptor in the page language and a swatch in
that channel's own colour. Every item carries its own `data-channel` (FND-26), so the
swatch is that channel's `channel-action`; that is why the component renders into light
DOM (Stencil `scoped`): the document's channel rules must reach the items. The current
channel carries a check and `aria-current="true"`.

Escape and a press outside close the panel; Escape returns focus to the button; the panel
closes when focus leaves it. From a pointer it grows from the trigger's corner over
`duration-base`; from the keyboard it appears instantly (MOT-02). Below 1024px the trigger
shrinks to the logo and chevron and keeps its accessible name (CHR-04).

## Properties

| Property  | Attribute | Description                                                                                                                                                                                                                                                                                      | Type                                                                                                    | Default     |
| --------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- | ----------- |
| `channel` | `channel` | The current channel. Defaults to the closest `data-channel` (as set by `sc-page`).                                                                                                                                                                                                               | `"build" \| "invest" \| "justice" \| "now" \| "trade" \| "transport" \| "visit" \| undefined`           | `undefined` |
| `links`   | `links`   | Each channel's home page, as an object or a JSON attribute: `links='{"now":"https://…/{lang}/","transport":"https://…/{lang}/"}'`. `{lang}` becomes `en` or `ar`, so each link leads to that channel's home in the current language. Give all seven; a channel without a link is listed as text. | `"build" \| "invest" \| "justice" \| "now" \| "trade" \| "transport" \| "visit" \| string \| undefined` | `undefined` |


## Methods

### `close() => Promise<void>`

Closes the panel.

#### Returns

Type: `Promise<void>`



### `open() => Promise<void>`

Opens the panel (as from the keyboard: no animation).

#### Returns

Type: `Promise<void>`




## Slots

| Slot | Description                                                                                                                                                     |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|      | Optional: the channel's own logo (an `<svg>` or `<img alt="">`, 24px). Without it the trigger shows the current channel's swatch (10px, in its channel colour). |


----------------------------------------------


