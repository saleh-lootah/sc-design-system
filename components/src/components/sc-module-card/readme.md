# sc-module-card

A titled module on a signed-in home page ("At a glance"): an optional tinted icon, the title, a link at the end of the header, then the content. Specification: `specs/sc-module-card.md`.

## Usage

```html
<sc-module-card heading="Traffic fines" action-href="/fines" action-text="View fines" tint="amber" divided>
  <svg slot="icon" …></svg>
  <div><p>To pay</p><p class="sc-type-headline-medium"><sc-ltr>AED 600.00</sc-ltr></p></div>
  <p><sc-ltr>F-2026-118204</sc-ltr> · Speeding, 14 Oct 2026</p>
</sc-module-card>
```

<!-- Auto Generated Below -->


## Overview

A titled module on a signed-in home page ("At a glance"): Vehicles, Applications, Traffic
fines. A header row with an optional tinted icon, the title (a heading) and a standalone
link at the end ("Manage", "View all"), then the module's own content.

The card is not a link (CMP-06). The header link's accessible name includes the title
("View all, Applications"), so a page with several "View all" links still makes sense out
of context.

## Properties

| Property               | Attribute       | Description                                                                                                          | Type                                                                          | Default     |
| ---------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------- |
| `actionHref`           | `action-href`   | Where the header link goes ("Manage", "View all"). Without it (and without `slot="action"`) there is no header link. | `string \| undefined`                                                         | `undefined` |
| `actionText`           | `action-text`   | The header link's visible text, e.g. "Manage" or "View all". Its accessible name adds the title.                     | `string \| undefined`                                                         | `undefined` |
| `divided`              | `divided`       | Separates the top-level content blocks with 1px `outline-variant` rules, 20px apart.                                 | `boolean`                                                                     | `false`     |
| `heading` _(required)_ | `heading`       | The module's title, e.g. "Vehicles". Required.                                                                       | `string`                                                                      | `undefined` |
| `headingLevel`         | `heading-level` | The heading level of the title: 3 under an "At a glance" `h2` (default).                                             | `2 \| 3 \| 4 \| 5 \| 6`                                                       | `3`         |
| `tint`                 | `tint`          | The icon tile's decorative topic tint (foundations §2.7). Without it the tile takes the channel's container colour.  | `"amber" \| "blue" \| "green" \| "orange" \| "rose" \| "violet" \| undefined` | `undefined` |


## Slots

| Slot       | Description                                                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------- |
|            | The module content: rows, figures, a status tag, one action. With `divided`, the top-level children are separated by 1px rules. |
| `"action"` | A custom header link, used instead of `action-href` and `action-text`.                                                          |
| `"icon"`   | A decorative icon: an inline 24px `<svg>` in `currentColor`, in a 40px tile.                                                    |


## Shadow Parts

| Part       | Description                           |
| ---------- | ------------------------------------- |
| `"body"`   | The content.                          |
| `"card"`   | The surface.                          |
| `"header"` | The header row.                       |
| `"icon"`   | The 40px icon tile.                   |
| `"link"`   | The header link (from `action-href`). |
| `"title"`  | The heading.                          |


----------------------------------------------


