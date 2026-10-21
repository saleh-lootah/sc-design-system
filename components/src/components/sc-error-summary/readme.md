# sc-error-summary

Lists every error on the page, at the top of `<main>`, after a submission. Each item links to its field.

## Usage

```html
<sc-error-summary>
  <a href="#plate-code">Enter the plate code</a>
  <a href="#plate-number">Enter the plate number using numbers only, like 12345</a>
</sc-error-summary>
```

or from JavaScript: `summary.errors = [{ href: '#plate-code', text: 'Enter the plate code' }]`.

- CMP-05: when it first has errors it moves focus to itself (`tabindex="-1"`); it is a `role="group"` named by its heading, and it has **no `role="alert"`**, so screen readers don't read it twice. Use `no-autofocus` only if you move focus yourself (`setFocus()`).
- The default heading is "There is a problem" / "توجد مشكلة" (W1). Start the page `<title>` with "Error: " / "خطأ: " while errors are shown.
- Link each item to the field's `id`. v2 fields are light DOM, so the `id` can be the native control or the field host (its `focus()` reaches the control).
- v2 look: `error-container` fill, a 2px `error` border, 8px corners, padding 18 block and 16 inline; the heading `title-medium`; links `body-medium` Bold in `error`, underlined, each at least 44 × 44.

Parts: `container`, `heading`, `list`.

<!-- Auto Generated Below -->


## Overview

Lists every error on the page, at the top of the main content, after a form is
submitted. Each item links to its field; following a link moves focus to the field.

Give it items either as links in the default slot (`<a href="#plate-number">…</a>`,
optionally inside a `<ul>`) or through the `errors` property. When it first has items
it moves focus to itself (`tabindex="-1"`), so keyboard and screen reader users hear
the heading and errors straight away. It has no `role="alert"`: moving focus already
announces it, and a live region on top can make screen readers read it twice (GOV.UK
practice). The focused box is a `role="group"` named by its heading (CMP-05).

v2: an `error-container` box with a 2px `error` border and an 8px radius; the heading in
`on-surface`, the links in `error`, Bold and underlined, each at least 44 × 44. Field
components are light DOM in v2, so a link's `#id` can name the native control or the
field host (whose `focus()` is forwarded to its control).

## Properties

| Property       | Attribute       | Description                                                                                                                                                                  | Type                              | Default     |
| -------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ----------- |
| `errors`       | --              | Errors to list, as `{ href, text }` objects. Set it as a property from JavaScript. When set (and not empty), it is used instead of the slotted links.                        | `ErrorSummaryItem[] \| undefined` | `undefined` |
| `heading`      | `heading`       | Overrides the heading text (default "There is a problem" / "توجد مشكلة").                                                                                                    | `string \| undefined`             | `undefined` |
| `headingLevel` | `heading-level` | The heading level. Use 2 when the summary sits under the page's `<h1>` (the usual case).                                                                                     | `2 \| 3 \| 4`                     | `2`         |
| `noAutofocus`  | `no-autofocus`  | Stops the summary from moving focus to itself when it first has errors. Only use it when you move focus yourself (call `setFocus()`); otherwise users won't hear the errors. | `boolean`                         | `false`     |


## Methods

### `setFocus() => Promise<void>`

Moves focus to the summary, e.g. after client-side validation updates `errors`.

#### Returns

Type: `Promise<void>`




## Slots

| Slot            | Description                                                                                                                                  |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
|                 | Error links: `<a href="#field-id">Message</a>`, one per error. They are read from the light DOM and rendered as a list inside the component. |
| `"description"` | Optional text under the heading, e.g. "Check the plate details".                                                                             |


## Shadow Parts

| Part          | Description                         |
| ------------- | ----------------------------------- |
| `"container"` | The focusable box with the border.  |
| `"heading"`   | The heading ("There is a problem"). |
| `"list"`      | The `<ul>` of error links.          |


----------------------------------------------


