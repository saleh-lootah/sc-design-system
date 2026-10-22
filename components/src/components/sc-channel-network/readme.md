# sc-channel-network

"One network · seven channels" (Standard CHR-08): at the end of every channel home page, before the footer. Spec: `specs/sc-channel-network.md`.

## Usage

```html
<sc-channel-network links='{"now":"https://…/{lang}/", "transport":"…", …}'>
  <nav slot="fallback" aria-label="Government of Dubai channels"><ul>
    <li><span aria-current="true">Dubai Now</span></li>
    <li><a href="https://…/en/" hreflang="en">Dubai Transport</a></li>
    …
  </ul></nav>
</sc-channel-network>
```

- The `slot="fallback"` list is for visitors without JavaScript (PERF-04): `sc.css` shows it until the strip upgrades, then it is hidden. Before upgrade the host reserves the strip's height for its width.
- The eyebrow is set as written: sentence case (CNT-07).

- The current channel (from `channel` or the closest `data-channel`) says "You are here" and is not a link.
- `eyebrow` replaces "One network · seven channels" if a page needs other wording.
- The page places it after the last content band, before the footer, with 72 above and 80 below (component-language 3.7); the strip itself has no outer padding.

<!-- Auto Generated Below -->


## Overview

The channel network strip (component-language B21, Standard CHR-08): "One network · seven
channels" and a tile for each of the seven channels, in the Standard 3.1 order, at the end
of every channel home page, before the footer.

City indigo marks it as shared (the eyebrow and its rule). Each tile carries its own
channel's colour only as attribution: a 4px top rule in that channel's `channel-action`.
Each tile sets its own `data-channel` (FND-26), which is why the strip renders into light
DOM (Stencil `scoped`). The current channel's tile is filled with its `channel-subtle`,
says "You are here", carries `aria-current="true"` and is not a link (it would lead to
this site). `channel="none"` is for a page that belongs to no channel (the network's own
site, the design system's documentation): no tile is current and every tile is a link.

A `<nav>` labelled "Government of Dubai channels" with a list of links. Seven tiles in a
row from 960px of the strip's own width, four from 560px, two below. The eyebrow is set in
sentence case as written (CNT-07).

Without JavaScript (PERF-04, B1): the strip renders from its props, so write the same links
as light-DOM children in `slot="fallback"` (a `<nav aria-label>` with a `<ul>` of
`<a href>`, the current channel as text with `aria-current="true"`). `sc.css` shows them as
a row of 44px links until the strip upgrades, and hides them once it has rendered.
Before it upgrades the host also reserves the strip's measured height for its width.

## Properties

| Property  | Attribute | Description                                                                                                                                           | Type                                                                                                    | Default     |
| --------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ----------- |
| `channel` | `channel` | The current channel. Defaults to the closest `data-channel` (else Dubai Now). `none`: the page belongs to no channel, so no tile says "You are here". | `"build" \| "invest" \| "justice" \| "none" \| "now" \| "trade" \| "transport" \| "visit" \| undefined` | `undefined` |
| `eyebrow` | `eyebrow` | Replaces the eyebrow, "One network · seven channels" in the page language.                                                                            | `string \| undefined`                                                                                   | `undefined` |
| `links`   | `links`   | Each channel's home page (as `sc-channel-switcher` `links`; `{lang}` becomes `en` or `ar`).                                                           | `"build" \| "invest" \| "justice" \| "now" \| "trade" \| "transport" \| "visit" \| string \| undefined` | `undefined` |


## Slots

| Slot         | Description                                                                |
| ------------ | -------------------------------------------------------------------------- |
| `"fallback"` | Never shown once upgraded: the channel links for pages without JavaScript. |


----------------------------------------------


