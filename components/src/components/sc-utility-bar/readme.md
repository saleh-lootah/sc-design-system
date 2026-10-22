# sc-utility-bar

Help and feedback for channel sites (decision U4, Standard CHR-05). Spec: `specs/sc-utility-bar.md`.

## Usage

```html
<sc-page channel="now" sync-document>
  …
  <div slot="footer">
    <sc-footer variant="grouped"><footer>…</footer></sc-footer>
    <sc-utility-bar happiness-href="/en/happiness" contact-href="tel:04…" services-href="/en/services" chat-href="/en/chat" accessibility-href="/en/accessibility"></sc-utility-bar>
  </div>
</sc-page>
```

- From 1024px it is docked to the bottom of the viewport and `sc-page` reserves its height; below, it is the footer's "Help and feedback" group, so place it straight after `sc-footer`.
- Five items when docked: Happiness Meter, Call 04, Services, Chat, Accessibility. The folded group is a 2 × 2 grid of text buttons and leaves Services out (the site's menu has it).
- Below 600px of viewport height (short windows, high zoom) the wide bar is static at the end of the page and nothing is reserved (R11).
- Without JavaScript (PERF-04): repeat the links as light-DOM children in `slot="fallback"` (a `<nav>` with an `<h2>` "Help and feedback" and a `<ul>` of `<a href>`). They show in the flow until the bar upgrades and are never shown after. See the spec.

<!-- Auto Generated Below -->


## Overview

The help and feedback bar of a channel site (decision U4, Standard CHR-05; component-
language B4 as amended by U4): the Happiness Meter, Call 04, Services, Chat and
Accessibility, each an icon with a visible label (labels never collapse to icons).

From 1024px it is a flat bar docked to the bottom of the viewport across the full width,
at `elevation-1`, with a 1px `outline-variant` edge along its top: 48px items with 12px of
block padding (Paper board ERV-0). It publishes its height
as `--sc-utility-bar-block-size` on `<html>`: `sc-page` pads its end by it and `sc.css`
sets `scroll-padding-block-end` from it, so the bar never covers content or the focused
element (WCAG 2.4.11). Below 1024px it folds into the footer: place it straight after
`sc-footer`, and it becomes an in-flow "Help and feedback" group, a 2 × 2 grid of outlined
text buttons (Services is left out there: the site's menu already carries it). It is
present when the page loads and does not animate.

At short viewport heights (below 600px, which also covers high zoom) the wide bar is not
docked: it keeps its row of items but sits static at the end of the page, and publishes no
height, so `sc-page` reserves nothing (decision R11; WCAG 2.4.11 and 1.4.10).

Without JavaScript (PERF-04): the bar renders in shadow DOM, so write the same links as
light-DOM children in `slot="fallback"` (a `<nav aria-label="Help and feedback">` with a
`<ul>` of `<a href>`). The browser shows them, in the flow at the end of the page, until the
bar upgrades; the upgraded bar has no `fallback` slot, so they are then neither shown nor
read.

## Properties

| Property            | Attribute            | Description                                                              | Type                  | Default     |
| ------------------- | -------------------- | ------------------------------------------------------------------------ | --------------------- | ----------- |
| `accessibilityHref` | `accessibility-href` | Accessibility options or the accessibility statement.                    | `string \| undefined` | `undefined` |
| `chatHref`          | `chat-href`          | The chat service.                                                        | `string \| undefined` | `undefined` |
| `contactHref`       | `contact-href`       | The call centre ("Call 04"): usually `tel:04…` or the contact page.      | `string \| undefined` | `undefined` |
| `contactNumber`     | `contact-number`     | The number shown after "Call", isolated left to right.                   | `string`              | `'04'`      |
| `happinessHref`     | `happiness-href`     | The Happiness Meter survey.                                              | `string \| undefined` | `undefined` |
| `servicesHref`      | `services-href`      | The channel's services page. Shown in the docked bar only (from 1024px). | `string \| undefined` | `undefined` |


## Slots

| Slot         | Description                                                                                                                                                                                  |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `"fallback"` | Never shown once upgraded: the links for pages without JavaScript (PERF-04), shown until the bar upgrades.  A `<nav>` labelled "Help and feedback". Items appear when their `*-href` is set. |


## Shadow Parts

| Part     | Description  |
| -------- | ------------ |
| `"bar"`  | The `<nav>`. |
| `"item"` | Each link.   |


----------------------------------------------


