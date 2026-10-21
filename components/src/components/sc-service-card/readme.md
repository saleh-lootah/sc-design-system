# sc-service-card

A link to a service, as in "Most used services" on a channel home page. For a group of content that isn't a single link, use `sc-card`.

## Usage

```html
<h2>Most used services</h2>
<sc-grid span-medium="4" span-expanded="4">
  <sc-service-card href="/services/renew-registration" entity="Roads and Transport Authority">
    Renew vehicle registration
    <sc-channel-chip slot="chip" channel="transport"></sc-channel-chip>
  </sc-service-card>
  <sc-service-card href="/services/pay-bills" entity="Dubai Electricity and Water Authority">
    Pay water and electricity bills
  </sc-service-card>
</sc-grid>
```

- The title starts with a verb and names the task, not the department: "Renew vehicle registration", not "Vehicle licensing".
- `entity` is the owning government entity, written in full ("Roads and Transport Authority", not "RTA"). It is the link's accessible description.
- Set `heading-level` to fit the page outline: 3 under a "Most used services" `h2` (default).
- Put a `sc-channel-chip` in the `chip` slot when the service also lives on another channel. A chip that is a link is a separate link with its own target.

### Behaviour

Only the title is the link (CMP-06 in the standard): the card is not wrapped in an `<a>`, and the link's hit area is not stretched over the card. Screen readers hear a short link name ("Renew vehicle registration"), with the entity as its description, instead of the card's whole text. The heading contains the link, so heading navigation lists every service, and keyboard users meet one tab stop per card (plus a chip, if it is a link). The title's hit area is at least 44 × 44 px; the focus ring goes round the title. With a mouse or trackpad (`(hover: hover) and (pointer: fine)`) hovering the title underlines it; touch screens get no hover state. The forward arrow at the top end (E1) is decorative: it is hidden from assistive technology and is not a target. Add an icon with `slot="icon"` and a decorative topic `tint` if the page uses them. The card is flat (1px edge, 12px corners, no shadow), at least 184px tall; hovering the card strengthens its edge and underlines the title.

### Arabic

Entity names have official Arabic forms ("هيئة الطرق والمواصلات"); use them.

<!-- Auto Generated Below -->


## Overview

A link to a service: its title, the entity that owns it, an optional icon and an optional
channel chip, on a flat 12px card with a 1px edge (direction E, "Most used services").

Only the title is the link (CMP-06), so screen readers hear a short link name ("Renew
vehicle registration"), with the entity as its description. The card is not wrapped in an
`<a>` and the link's hit area is not stretched over the card: it is the title, grown to at
least 44 × 44. The forward arrow at the top end is decorative: it is not a second link and
is hidden from assistive technology. The title is a heading containing the link, so heading
navigation finds every service. A chip that is a link is a separate link.

## Properties

| Property            | Attribute       | Description                                                                                                                                                                                                                                             | Type                                                                          | Default     |
| ------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------- |
| `entity`            | `entity`        | The owning entity (attribution), e.g. "Roads and Transport Authority". Written out in full, not as an acronym.                                                                                                                                          | `string \| undefined`                                                         | `undefined` |
| `headingLevel`      | `heading-level` | The heading level of the title. Pick the level that fits the page outline (3 under a "Most used services" `h2`).                                                                                                                                        | `2 \| 3 \| 4 \| 5 \| 6`                                                       | `3`         |
| `href` _(required)_ | `href`          | Where the service starts. Required.                                                                                                                                                                                                                     | `string`                                                                      | `undefined` |
| `tint`              | `tint`          | Colours the icon tile with a decorative topic tint (foundations §2.7) instead of the channel container: `blue` transport, `violet` residency, `rose` family, `orange` housing, `amber` bills, `green` health. Decorative only. Ignored without an icon. | `"amber" \| "blue" \| "green" \| "orange" \| "rose" \| "violet" \| undefined` | `undefined` |


## Slots

| Slot       | Description                                                                                                                                                  |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|            | The service title, e.g. "Renew vehicle registration". Text only.                                                                                             |
| `"chip"`   | An optional `sc-channel-chip` ("Also on Dubai Transport").                                                                                                   |
| `"entity"` | The owning entity, when it needs markup. Otherwise use the `entity` prop.                                                                                    |
| `"icon"`   | An optional decorative icon: an inline 24px `<svg>` in `currentColor`. It sits in a 40px tile at the start, in the channel's container colour or the `tint`. |


## Shadow Parts

| Part       | Description                   |
| ---------- | ----------------------------- |
| `"arrow"`  | The decorative forward arrow. |
| `"card"`   | The surface.                  |
| `"entity"` | The entity line.              |
| `"icon"`   | The 40px icon tile.           |
| `"link"`   | The `<a>` inside the heading. |
| `"title"`  | The heading.                  |


----------------------------------------------


