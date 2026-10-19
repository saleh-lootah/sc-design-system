# sc-status-tag

The status of a task, application or payment, usually in a list or next to a heading: "Paid", "Action needed", "In review", "Expires in 15 days". For a message the user must read, use `sc-callout`.

## Usage

```html
<sc-status-tag tone="error">Action needed</sc-status-tag>
<sc-status-tag tone="success">Paid</sc-status-tag>
<sc-status-tag tone="warning">Expires in 15 days</sc-status-tag>
<sc-status-tag>In review</sc-status-tag>
<sc-status-tag tone="channel">New</sc-status-tag>
```

### Which tone

| Tone | Use it for |
|---|---|
| `neutral` (default) | A plain state with nothing to do yet: "Draft", "In review". |
| `success` | Done: "Paid", "Renewed". |
| `warning` | Needs attention soon: "Expires in 15 days". |
| `error` | Blocked or failed: "Action needed", "Payment failed". |
| `channel` | Highlights something in the current channel's colours: "New". Use sparingly. |

### Content

- Always write the status in words; the colour and dot only support them. Two or three words, sentence case, no full stop.
- Use the same words for the same status everywhere in a service.
- Digits stay Latin in Arabic ("ينتهي خلال 15 يومًا").
- Not interactive and not announced on change. If the status changes while the user is on the page, also announce it (for example with a `role="status"` region).

### Styling hooks

Parts: `tag`, `dot`.

<!-- Auto Generated Below -->


## Overview

The status of a task, application or payment: "Paid", "Action needed", "In review",
"Expires in 15 days". A pill with a status dot and the status words.

The words carry the meaning; the colour and the dot only support them. It isn't
interactive and isn't announced on change (use `sc-callout` or a live region for that).

## Properties

| Property | Attribute | Description                                                                                                                                                                                                                                                                                                                | Type                                                          | Default     |
| -------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ----------- |
| `tone`   | `tone`    | - `neutral`: no action needed yet, or a plain state ("Draft", "In review"). - `success`: done ("Paid", "Renewed"). - `warning`: needs attention soon ("Expires in 15 days"). - `error`: blocked or failed ("Action needed", "Payment failed"). - `channel`: highlights something in the current channel's colours ("New"). | `"channel" \| "error" \| "neutral" \| "success" \| "warning"` | `'neutral'` |


## Slots

| Slot | Description                                                         |
| ---- | ------------------------------------------------------------------- |
|      | The status words. Always required; keep them to two or three words. |


## Shadow Parts

| Part    | Description     |
| ------- | --------------- |
| `"dot"` | The status dot. |
| `"tag"` | The pill.       |


----------------------------------------------


