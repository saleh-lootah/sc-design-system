# sc-announcement-bar

A site-wide announcement above the header (after the skip link). Spec: `specs/sc-announcement-bar.md`.

## Usage

```html
<sc-announcement-bar dismissible announcement-id="maintenance-2026-10-25"
  link-href="/en/status" link-text="See affected services">
  Planned maintenance on Saturday 25 October. Payment services will be unavailable from 2am to 6am (Dubai time).
</sc-announcement-bar>
```

- `tone`: `warning` (default), `info` or `error`. Say the severity in the words too.
- It is a labelled region present at load, not an alert. Change `announcement-id` when the message changes. The dismissal is kept in `sessionStorage` for the visit only (R8), never `localStorage`.
- A link inside the message is running text and is always underlined (R6).
- `dismiss-label` overrides the dismiss button's name ("Dismiss announcement" / "إغلاق الإعلان").

<!-- Auto Generated Below -->


## Overview

A site-wide announcement above the header: planned maintenance, a service outage, a change
people need to know about (component-language B1). One message, one optional link, and an
optional dismiss button.

A labelled region ("Announcement" / "إعلان"), present when the page loads. It is not a
live region and not an alert. The text carries the severity in words ("Planned
maintenance…"); the tone's icon and container repeat it.

Dismissing it fires `scDismiss` (cancelable) and hides it. With `announcement-id`, the
dismissal is remembered for the browser session (`sessionStorage`, decision R8), so the same
announcement does not come back on later pages of the visit.
Focus moves to the next focusable element after it. From a pointer it fades out over
`duration-exit`; from the keyboard it goes at once. Its height is never animated (MOT-11).

## Properties

| Property         | Attribute         | Description                                                                                                                                                                                                                       | Type                             | Default     |
| ---------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ----------- |
| `announcementId` | `announcement-id` | Remembers a dismissal for this browser session (`sessionStorage`, never `localStorage`: decision R8, PRV-12) under this id, so the announcement stays hidden on later pages of the visit. Change the id when the message changes. | `string \| undefined`            | `undefined` |
| `dismissLabel`   | `dismiss-label`   | Overrides the dismiss button's name, "Dismiss announcement" (in the page language).                                                                                                                                               | `string \| undefined`            | `undefined` |
| `dismissible`    | `dismissible`     | Shows the dismiss button.                                                                                                                                                                                                         | `boolean`                        | `false`     |
| `linkHref`       | `link-href`       | A link with more detail ("See affected services"). Shown with `link-text`.                                                                                                                                                        | `string \| undefined`            | `undefined` |
| `linkText`       | `link-text`       | The link's text.                                                                                                                                                                                                                  | `string \| undefined`            | `undefined` |
| `tone`           | `tone`            | `warning` (maintenance; default), `info`, or `error` (a service is down).                                                                                                                                                         | `"error" \| "info" \| "warning"` | `'warning'` |


## Events

| Event       | Description                                                     | Type                                         |
| ----------- | --------------------------------------------------------------- | -------------------------------------------- |
| `scDismiss` | Fired before the bar hides. Call `preventDefault()` to keep it. | `CustomEvent<{ id?: string \| undefined; }>` |


## Methods

### `dismiss() => Promise<void>`

Dismisses the announcement, as the dismiss button does from the keyboard.

#### Returns

Type: `Promise<void>`




## Slots

| Slot | Description                              |
| ---- | ---------------------------------------- |
|      | The message. Text, in the page language. |


## Shadow Parts

| Part        | Description         |
| ----------- | ------------------- |
| `"bar"`     | The region.         |
| `"dismiss"` | The dismiss button. |
| `"link"`    | The link.           |


----------------------------------------------


