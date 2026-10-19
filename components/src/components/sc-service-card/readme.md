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
- Put a `sc-channel-chip` in the `chip` slot when the service also lives on another channel. A chip that is a link stays clickable on its own; a plain chip passes clicks to the card.

### Behaviour

Only the title is the link: the card is not wrapped in an `<a>`. Screen readers hear a short link name ("Renew vehicle registration"), with the entity as its description, instead of the card's whole text. The heading contains the link, so heading navigation lists every service. The link's hit area is stretched over the card with `::after { inset: 0 }`, so a click anywhere (except a chip link) follows it, and keyboard users meet one tab stop per card. The focus ring wraps the card. With a mouse or trackpad (`(hover: hover) and (pointer: fine)`) hovering deepens the shadow, underlines the title and fills the chevron with the channel colour; touch screens get no hover state.

### Arabic

The chevron mirrors and sits on the left. Entity names have official Arabic forms ("هيئة الطرق والمواصلات"); use them.

<!-- Auto Generated Below -->


## Overview

A link to a service: its title, the entity that owns it, an optional channel chip and an
end chevron.

Only the title is the link, so screen readers hear a short link name ("Renew vehicle
registration"), not the whole card's text. The card is not wrapped in an `<a>`: the
title link's hit area is stretched over the card with a pseudo-element (`::after`,
`inset: 0`), so the whole card is still clickable and the focus ring wraps the card.
The title is a heading containing the link, so heading navigation finds every service.
The owning entity is the link's description. A chip that is itself a link stays
clickable on its own.

## Properties

| Property            | Attribute       | Description                                                                                                      | Type                    | Default     |
| ------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------- | ----------- |
| `entity`            | `entity`        | The owning entity (attribution), e.g. "Roads and Transport Authority". Written out in full, not as an acronym.   | `string \| undefined`   | `undefined` |
| `headingLevel`      | `heading-level` | The heading level of the title. Pick the level that fits the page outline (3 under a "Most used services" `h2`). | `2 \| 3 \| 4 \| 5 \| 6` | `3`         |
| `href` _(required)_ | `href`          | Where the service starts. Required.                                                                              | `string`                | `undefined` |


## Slots

| Slot       | Description                                                               |
| ---------- | ------------------------------------------------------------------------- |
|            | The service title, e.g. "Renew vehicle registration". Text only.          |
| `"chip"`   | An optional `sc-channel-chip` ("Also on Dubai Transport").                |
| `"entity"` | The owning entity, when it needs markup. Otherwise use the `entity` prop. |


## Shadow Parts

| Part        | Description                     |
| ----------- | ------------------------------- |
| `"card"`    | The surface.                    |
| `"chevron"` | The end chevron and its circle. |
| `"entity"`  | The entity line.                |
| `"link"`    | The `<a>` inside the heading.   |
| `"title"`   | The heading.                    |


----------------------------------------------


