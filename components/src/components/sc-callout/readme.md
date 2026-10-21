# sc-callout

An important message inside the page content: something the user must know before they act, or the result of what they just did. If the message is about errors in the user's answers, use `sc-error-summary` and field errors instead. If it's the status of a task or payment in a list, use `sc-status-tag`.

## Usage

```html
<sc-callout tone="warning">
  If your payment is interrupted, don't pay again. Check the payment status in My tasks first.
</sc-callout>

<sc-callout tone="success" heading="Registration renewed" heading-level="2">
  Your vehicle registration is valid until 18 October 2027.
</sc-callout>
```

### Which tone

| Tone | Use it for | Example |
|---|---|---|
| `info` (default) | Guidance the user needs. | "You'll need your plate number and Emirates ID number." |
| `success` | Something worked. | "We've sent the receipt to your email." |
| `warning` | Something the user must know to avoid a problem. | "If your payment is interrupted, don't pay again…" |
| `error` | Something went wrong that isn't about their answers. | "Your payment didn't go through. No money has been taken." |

v2: a tone-95 container with 8px corners, a tone-40 accent bar at inline-start (3px, `--sc-size-border-accent`) and icon, and the text in `on-surface`. Links inside keep the channel link colour. Each tone has its own fill, its own icon and a visually hidden word read before the message ("Warning:" / "تنبيه:"), so the meaning never relies on colour. Override the word with `tone-label` if a different one fits better.

### Content

- One callout per section at most; if everything is highlighted, nothing is.
- Lead with what the user should do or know. Short sentences, sentence case. Write the Arabic, don't translate word for word.
- `heading` is optional bold text. It is a plain paragraph by default; set `heading-level` (2–6) only when the heading belongs in the page outline. Use the `heading` slot for rich content.
- Inline links and `<sc-ltr>` for amounts and references are fine in the message.
- It isn't a live region. If you insert one after the page loads (for example after a payment check), wrap it in an element with `role="status"` or move focus to it.

### Styling hooks

Parts: `container`, `icon`, `heading`, `content`.

<!-- Auto Generated Below -->


## Overview

An important message that sits in the page content: something the user must know
before they act ("If your payment is interrupted, don't pay again…"), or the outcome
of what they just did.

v2: a tone-95 container with an 8px radius, a tone-coloured accent bar at inline-start,
a 24px tone icon and the content in `on-surface`. Each tone also has a visually hidden
word ("Warning:"), so the meaning never relies on colour or the icon alone. Links inside
keep the channel link colour.

## Properties

| Property       | Attribute       | Description                                                                                                                                                                                                                                                           | Type                                          | Default     |
| -------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ----------- |
| `heading`      | `heading`       | Optional short heading in bold above the message.                                                                                                                                                                                                                     | `string \| undefined`                         | `undefined` |
| `headingLevel` | `heading-level` | Renders the heading as `<h2>`–`<h6>`. Leave it unset to render the heading as plain bold text, which is right for most callouts inside a form.                                                                                                                        | `2 \| 3 \| 4 \| 5 \| 6 \| undefined`          | `undefined` |
| `tone`         | `tone`          | What kind of message it is. - `info`: guidance and reassurance (info blue). - `success`: something worked ("Payment received"). - `warning`: something the user must know to avoid a problem. - `error`: something went wrong and the user can't continue as planned. | `"error" \| "info" \| "success" \| "warning"` | `'info'`    |
| `toneLabel`    | `tone-label`    | Overrides the visually hidden tone word read before the message (default from strings, e.g. "Warning:").                                                                                                                                                              | `string \| undefined`                         | `undefined` |


## Slots

| Slot        | Description                                                                         |
| ----------- | ----------------------------------------------------------------------------------- |
|             | The message. Plain text or inline content (links, `<sc-ltr>`); paragraphs are fine. |
| `"heading"` | Optional rich heading, used instead of the `heading` prop.                          |


## Shadow Parts

| Part          | Description                          |
| ------------- | ------------------------------------ |
| `"container"` | The box.                             |
| `"content"`   | The wrapper around the default slot. |
| `"heading"`   | The heading.                         |
| `"icon"`      | The icon wrapper.                    |


----------------------------------------------


