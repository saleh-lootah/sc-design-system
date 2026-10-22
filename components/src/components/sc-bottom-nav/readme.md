# sc-bottom-nav

The primary navigation of signed-in channel pages on phones and tablets. Spec: `specs/sc-bottom-nav.md`.

## Usage

```html
<body>
  …
  <sc-bottom-nav>
    <a href="/en" data-icon="home" aria-current="page">Home</a>
    <a href="/en/services" data-icon="apps">Services</a>
    <a href="/en/account/activity" data-icon="history">Activity</a>
  </sc-bottom-nav>
</body>
```

- Three to five destinations, each an icon above a label. Docked flat to the bottom edge below 1024px and hidden from 1024px, where the header navigation takes over.
- `sc.css` reserves its height at the end of the page (`padding-block-end` on `body` and `scroll-padding-block-end`), so nothing is covered.
- The current destination (`aria-current="page"`) gets a 56 × 32 `channel-container` indicator with a 3px channel-action bar above it on the top rule, a Filled icon and a Bold label in the channel action colour. The bar is the cue that still works in Arabic, where every label is Bold (R10).
- When it is present, the utility bar folds into the footer.

### Styling hooks

Parts: `nav`, `item`, `indicator`.

<!-- Auto Generated Below -->


## Overview

The primary navigation of signed-in channel pages on phones and tablets: a flat bar
docked to the bottom edge with three to five destinations, each an icon above a label.
It shows below 1024px only (from 1024px the header navigation takes over), and `sc.css`
reserves its height at the end of the page, so it never covers content or the focused
element. When it is present, the utility bar folds into the footer.

Write the destinations as plain links:

  <sc-bottom-nav>
    <a href="/en" data-icon="home" aria-current="page">Home</a>
    <a href="/en/services" data-icon="apps">Services</a>
    <a href="/en/account/activity" data-icon="history">Activity</a>
  </sc-bottom-nav>

The current destination (`aria-current="page"`) gets a 56 × 32 channel-container
indicator behind its icon and a Bold label in the channel action colour. Items share the
width equally, each at least 48px wide and 64px tall.

## Properties

| Property | Attribute | Description                                      | Type                  | Default     |
| -------- | --------- | ------------------------------------------------ | --------------------- | ----------- |
| `label`  | `label`   | Overrides the landmark name ("Main" / "رئيسية"). | `string \| undefined` | `undefined` |


## Shadow Parts

| Part          | Description                     |
| ------------- | ------------------------------- |
| `"indicator"` | The pill behind each icon.      |
| `"item"`      | Each link.                      |
| `"nav"`       | The `<nav>` landmark (the bar). |


----------------------------------------------


