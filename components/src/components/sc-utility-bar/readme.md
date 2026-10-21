# sc-utility-bar

Help and feedback for channel sites (decision U4, Standard CHR-05). Spec: `specs/sc-utility-bar.md`.

## Usage

```html
<sc-page channel="now" sync-document>
  …
  <div slot="footer">
    <sc-footer variant="grouped" …></sc-footer>
    <sc-utility-bar happiness-href="/en/happiness" contact-href="tel:04…" chat-href="/en/chat" accessibility-href="/en/accessibility"></sc-utility-bar>
  </div>
</sc-page>
```

- From 1024px it is docked to the bottom of the viewport and `sc-page` reserves its height; below, it is the footer's "Help and feedback" group, so place it straight after `sc-footer`.

<!-- Auto Generated Below -->


## Overview

The help and feedback bar of a channel site (decision U4, Standard CHR-05; component-
language B4 as amended by U4): the Happiness Meter, contact and complaints (04), chat and
accessibility options, each an icon with a visible label (labels never collapse to icons).

From 1024px it is a flat bar docked to the bottom of the viewport across the full width,
at `elevation-1`, with a 1px `outline-variant` edge along its top. It publishes its height
as `--sc-utility-bar-block-size` on `<html>`: `sc-page` pads its end by it and `sc.css`
sets `scroll-padding-block-end` from it, so the bar never covers content or the focused
element (WCAG 2.4.11). Below 1024px it folds into the footer: place it straight after
`sc-footer`, and it becomes an in-flow "Help and feedback" group, a 2 × 2 grid of outlined
buttons. It is present when the page loads and does not animate.

A `<nav>` labelled "Help and feedback". Items appear when their `*-href` is set.

## Properties

| Property            | Attribute            | Description                                                              | Type                  | Default     |
| ------------------- | -------------------- | ------------------------------------------------------------------------ | --------------------- | ----------- |
| `accessibilityHref` | `accessibility-href` | Accessibility options or the accessibility statement.                    | `string \| undefined` | `undefined` |
| `chatHref`          | `chat-href`          | The chat service.                                                        | `string \| undefined` | `undefined` |
| `contactHref`       | `contact-href`       | Contact and complaints: usually `tel:04…` or the contact page.           | `string \| undefined` | `undefined` |
| `contactNumber`     | `contact-number`     | The number shown after "Contact and complaints", isolated left to right. | `string`              | `'04'`      |
| `happinessHref`     | `happiness-href`     | The Happiness Meter survey.                                              | `string \| undefined` | `undefined` |


## Shadow Parts

| Part     | Description  |
| -------- | ------------ |
| `"bar"`  | The `<nav>`. |
| `"item"` | Each link.   |


----------------------------------------------


