# sc-status-tag

The status of an application, task or payment, in the words of the status vocabulary (Standard 9.6). Not interactive, and not announced when it changes.

## Usage

```html
<sc-status-tag tone="success">Paid</sc-status-tag>
<sc-status-tag tone="error">Action needed</sc-status-tag>
<sc-status-tag tone="warning">Expires in 15 days</sc-status-tag>
<sc-status-tag>In review</sc-status-tag>
```

| Tone | Icon | Use it for |
|---|---|---|
| `neutral` (default) | pending | Draft, Received, In review, Not approved, Withdrawn, Cancelled, Not started, In progress |
| `info` | hourglass | An informational state, where a service needs one. Standard 9.6 maps no status to it yet |
| `success` | check circle | Approved, Completed, Paid |
| `warning` | clock | Expires in {n} days |
| `error` | error | Action needed, Payment failed |

- v2 is a 32px chip with 6px corners: tone-40 words and icon on a tone-95 container, so status is never colour alone (A11Y-06). Neutral is neutral-40 on neutral-96.
- There is **no channel tone**: status never takes a channel's colour. v1's `tone="channel"` renders as `neutral`.
- Two or three words. Use the vocabulary, in both languages ("تم الدفع", "إجراء مطلوب").

Part: `tag`, `icon`.

<!-- Auto Generated Below -->


## Overview

The status of an application, task or payment, in the words of the status vocabulary
(Standard 9.6): "Paid", "Action needed", "In review", "Expires in 15 days".

v2: a 32px chip with a 6px radius, a tone icon and the words, tone-40 text on a tone-95
container (A11Y-06: never colour alone). It isn't interactive and isn't announced on
change (use `sc-callout` or a live region for that). There is no channel tone: status is
never in a channel's colour.

## Properties

| Property | Attribute | Description                                                                                                                                                                                                                                                                                                                                                                                                                         | Type                                                       | Default     |
| -------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ----------- |
| `tone`   | `tone`    | - `neutral`: a plain state ("Draft", "Received", "In review", "Not started"). - `info`: an informational state, where a service needs one (hourglass icon). - `success`: done ("Paid", "Approved", "Completed"). - `warning`: needs attention soon ("Expires in 15 days"). - `error`: blocked or waiting on the user ("Action needed", "Payment failed").  An unknown tone, including v1's removed `channel`, renders as `neutral`. | `"error" \| "info" \| "neutral" \| "success" \| "warning"` | `'neutral'` |


## Slots

| Slot | Description                                                         |
| ---- | ------------------------------------------------------------------- |
|      | The status words. Always required; keep them to two or three words. |


## Shadow Parts

| Part     | Description                 |
| -------- | --------------------------- |
| `"icon"` | The tone icon (decorative). |
| `"tag"`  | The chip.                   |


----------------------------------------------


