# sc-empty-state

What a list, table or page shows when there is nothing in it.

## Usage

```html
<sc-empty-state icon="inbox" heading="You have no notifications" heading-level="2">
  When a service has news for you, it appears here.
</sc-empty-state>

<!-- The all-clear -->
<sc-empty-state variant="success" heading="You have no fines to pay">
  Nothing is due on your vehicles.
  <sc-button slot="action" variant="secondary">View paid fines</sc-button>
</sc-empty-state>
```

- Write the heading as a sentence ("You have no fines"), never "No data".
- An optional 48px icon in an 80px circle; one or two sentences; at most one action, usually a secondary button.
- `variant="success"` is the all-clear: a check on the success container. The words still say it.
- Aligned to the start in both languages. Without `heading-level` the heading is a paragraph at the title role (right inside a card or table).

Parts: `container`, `icon`, `heading`, `body`, `action`.

<!-- Auto Generated Below -->


## Overview

What a list, table or page shows when there is nothing in it: "You have no fines".

An optional 48px icon in an 80px circle, a heading written as a sentence (never "No
data"), one or two sentences in the default slot, and at most one action (usually an
`sc-button variant="secondary"`) in `slot="action"`. It aligns to the start edge in both
languages, so it scans with the content around it.

`variant="success"` is the all-clear: nothing is left to do ("You have no fines to pay").
The icon becomes a check in the success colour on a success container, and the words
still say it, so the meaning never rests on colour.

## Properties

| Property               | Attribute       | Description                                                                                                                              | Type                                                                                                                                                                                                                                               | Default     |
| ---------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `heading` _(required)_ | `heading`       | The heading, as a sentence: "You have no notifications".                                                                                 | `string`                                                                                                                                                                                                                                           | `undefined` |
| `headingLevel`         | `heading-level` | Renders the heading as `<h2>`–`<h4>`. Leave it unset to render a paragraph at the title role, for an empty state inside a card or table. | `2 \| 3 \| 4 \| undefined`                                                                                                                                                                                                                         | `undefined` |
| `icon`                 | `icon`          | An icon from the library (`inbox`, `search`, `check-circle` …). Leave unset for no icon; `success` defaults to `check-circle`.           | `"alert-circle" \| "arrow-forward" \| "check" \| "check-circle" \| "chevron-back" \| "chevron-forward" \| "close" \| "external" \| "hourglass" \| "inbox" \| "info" \| "pending" \| "schedule" \| "search" \| "spinner" \| "warning" \| undefined` | `undefined` |
| `variant`              | `variant`       | `default`: neutral. `success`: the all-clear, with a check on the success container.                                                     | `"default" \| "success"`                                                                                                                                                                                                                           | `'default'` |


## Slots

| Slot       | Description                                                                 |
| ---------- | --------------------------------------------------------------------------- |
|            | One or two sentences: what this means and what the user can do.             |
| `"action"` | Optional, a single action: `<sc-button slot="action" variant="secondary">`. |


## Shadow Parts

| Part          | Description                          |
| ------------- | ------------------------------------ |
| `"action"`    | The wrapper around the action slot.  |
| `"body"`      | The wrapper around the default slot. |
| `"container"` | The block.                           |
| `"heading"`   | The heading.                         |
| `"icon"`      | The icon circle (decorative).        |


----------------------------------------------


