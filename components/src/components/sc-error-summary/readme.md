# sc-error-summary

Lists every error on the page after the user submits a form, so they can see all the problems at once and jump to each field. Use it with the field's own error message: the summary never replaces it. Don't use it for problems that aren't about the user's answers (a failed payment, a service that's down): use `sc-callout tone="error"` for those.

## Usage

```html
<main>
  <sc-error-summary>
    <a href="#plate-code">Enter the plate code</a>
    <a href="#plate-number">Enter the plate number using numbers only, like 12345</a>
  </sc-error-summary>
  <h1>What is your plate number?</h1>
  …
  <sc-text-input id="plate-number" label="Plate number" error="Enter the plate number using numbers only, like 12345"></sc-text-input>
</main>
```

Or from JavaScript, after client-side validation:

```js
const summary = document.querySelector('sc-error-summary');
summary.errors = [{ href: '#plate-number', text: 'Enter the plate number using numbers only, like 12345' }];
```

### Placement and behaviour

- Put it at the top of `<main>`, above the `<h1>`, and only when there are errors. With no items it hides itself.
- When it first has errors (on page load, or when `errors` goes from empty to filled) it moves focus to itself (`tabindex="-1"`, `role="alert"`), so screen readers read the heading and every error straight away. Don't move focus anywhere else on that page load. Use `no-autofocus` only if you move focus yourself with `setFocus()`.
- Add "Error: " to the start of the page `<title>` too.
- Following a link moves focus to the field and scrolls it into view, without changing the URL. It works with a plain `<input id>` and with field components (`sc-text-input`, `sc-date-input` …) that delegate focus to their inner control, and finds the target in the summary's own shadow root first, then in the document.
- Slotted links are read from the light DOM (directly, or inside a `<ul>`) and rendered as a list inside the component; the list updates when they change. The `errors` property wins when it is set and not empty.

### Content

- Each item is the same message as the one shown next to the field, in the same order as the fields on the page.
- Link to the field's `id`, not to the label. For a date, link to the first part with a problem.
- The heading is "There is a problem" / "يوجد خطأ". Change it (`heading`) only when a more specific heading helps, e.g. "Check your vehicle details". Use the `description` slot for one short sentence when the errors need context.
- In Arabic, keep plates and numbers left-to-right inside the message: `أدخل رقم اللوحة بالأرقام فقط، مثل <bdi dir="ltr">12345</bdi>`.

### Styling hooks

Parts: `container`, `heading`, `list`. The border and links use the error colour; the focus ring uses the channel action colour.

<!-- Auto Generated Below -->


## Overview

Lists every error on the page, at the top of the main content, after a form is
submitted. Each item links to its field; following a link moves focus to the field.

Give it items either as links in the default slot (`<a href="#plate-number">…</a>`,
optionally inside a `<ul>`) or through the `errors` property. When it first has items
it moves focus to itself (`tabindex="-1"`, `role="alert"`), so keyboard and screen
reader users hear the problem straight away.

## Properties

| Property       | Attribute       | Description                                                                                                                                                                  | Type                              | Default     |
| -------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ----------- |
| `errors`       | --              | Errors to list, as `{ href, text }` objects. Set it as a property from JavaScript. When set (and not empty), it is used instead of the slotted links.                        | `ErrorSummaryItem[] \| undefined` | `undefined` |
| `heading`      | `heading`       | Overrides the heading text (default "There is a problem" / "يوجد خطأ" from strings).                                                                                         | `string \| undefined`             | `undefined` |
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


