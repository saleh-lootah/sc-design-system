# sc-footer

The page footer: help and contact, accessibility, privacy, terms and "Government of Dubai".

## Usage

```html
<sc-footer help-href="/help" accessibility-href="/accessibility" privacy-href="/privacy" terms-href="/terms">
  <a href="/cookies">Cookies</a>
</sc-footer>
```

- The four standard links appear when their `*-href` is set; their text comes from strings in the page language ("Help and contact" / "المساعدة والتواصل", and so on). Every channel should set all four.
- Extra links go in the default slot as plain `<a href>` elements. Each gets its own list item (the footer sets their `slot` attribute). Keep the list short.
- `slot="meta"` replaces "Government of Dubai" at the end.
- Use one footer per page, in `sc-page`'s `footer` slot.

### Semantics

A `<footer>` (the `contentinfo` landmark when it isn't inside `<main>`), a visually hidden "Support links" heading and a `<ul>` of links. Links are at least 44px tall.

### Arabic

The order mirrors: links start at the right and the meta text sits at the left.

<!-- Auto Generated Below -->


## Overview

The page footer: help and contact, accessibility, privacy and terms links, and
"Government of Dubai". Renders a `<footer>` (the page's `contentinfo` landmark) with a
list of links under a visually hidden "Support links" heading.

The four standard links appear when their `*-href` is set, with text from strings in the
page language. Extra links go in the default slot as plain `<a>` elements; each gets its
own list item (the footer sets their `slot` attribute).

## Properties

| Property            | Attribute            | Description                  | Type                  | Default     |
| ------------------- | -------------------- | ---------------------------- | --------------------- | ----------- |
| `accessibilityHref` | `accessibility-href` | The accessibility statement. | `string \| undefined` | `undefined` |
| `helpHref`          | `help-href`          | The help and contact page.   | `string \| undefined` | `undefined` |
| `privacyHref`       | `privacy-href`       | The privacy notice.          | `string \| undefined` | `undefined` |
| `termsHref`         | `terms-href`         | The terms and conditions.    | `string \| undefined` | `undefined` |


## Slots

| Slot     | Description                                                          |
| -------- | -------------------------------------------------------------------- |
|          | Extra links, as `<a href>` elements, listed after the standard ones. |
| `"meta"` | Replaces "Government of Dubai" at the end of the footer.             |


## Shadow Parts

| Part       | Description          |
| ---------- | -------------------- |
| `"footer"` | The `<footer>`.      |
| `"link"`   | Each standard link.  |
| `"list"`   | The `<ul>` of links. |
| `"meta"`   | The end text.        |


----------------------------------------------


