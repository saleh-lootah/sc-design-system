# sc-step-list

A life event as an ordered list of services, possibly across channels ("Moving home" on the Dubai Now home page, direction E1).

## Usage

```html
<sc-step-list>
  <ol>
    <li><a href="/tenancy">Register your tenancy contract</a><span>Dubai Land Department</span></li>
    <li><a href="/dewa">Connect water and electricity</a><span>DEWA</span></li>
    <li data-channel="transport"><a href="https://transport.example/address">Update the address on your vehicle</a><span>RTA</span></li>
  </ol>
</sc-step-list>
```

- Light DOM: you write the native `<ol>`; the list position is the number screen readers announce. The component adds a numbered marker (hidden from screen readers), a decorative chevron and, for another channel's row, the chip.
- A row whose `data-channel` differs from the page's channel is attribution: it takes that channel's `channel-subtle` tint, a filled marker, connectors in that channel's colour to neighbouring rows of the same channel, and an outlined chip "On Dubai Transport" / "على مواصلات دبي".
- The title is the only link; the row is not a link. Entities are attribution text, never colour.
- Frameworks that render the list (React) should not re-render the nodes the component adds (`.sc-step-list__marker`, `.sc-step-list__end`).
- Under 600px wide the chip moves under the entity.

<!-- Auto Generated Below -->


## Overview

A life event as an ordered list of services, possibly across channels (direction E1,
"Moving home"). Light DOM: you write the native `<ol>`, so the list position is the number
screen readers announce.

```html
<sc-step-list>
  <ol>
    <li><a href="/tenancy">Register your tenancy contract</a><span>Dubai Land Department</span></li>
    <li data-channel="transport"><a href="https://transport…/address">Update the address on your vehicle</a><span>RTA</span></li>
  </ol>
</sc-step-list>
```

Each row has a 32px numbered marker joined by 2px connectors, the service title (the
link; the row is not a link), the owning entity, and a fixed trailing slot with a
decorative chevron. A row whose `data-channel` differs from the page's channel belongs to
another channel: it takes that channel's `channel-subtle` tint and filled marker, joins
neighbouring rows of the same channel with that channel's colour, and gets an outlined
attribution chip, "On Dubai Transport", which is read as text. The component adds the
marker, chip and chevron to each `<li>` (frameworks that own the list should not
re-render those nodes). The marker column moves to the right in Arabic and the chevron
points left.

## Slots

| Slot | Description                                                              |
| ---- | ------------------------------------------------------------------------ |
|      | An `<ol>` of `<li>`, each with a link (`<a>`) and the entity (`<span>`). |


----------------------------------------------


