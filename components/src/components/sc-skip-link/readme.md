# sc-skip-link

"Skip to main content" / "الانتقال إلى المحتوى الرئيسي": the first focusable element on every page. Spec: `specs/sc-skip-link.md`.

## Usage

```html
<body>
  <sc-skip-link></sc-skip-link>
  <sc-app-bar>…</sc-app-bar>
  <main id="main-content">…</main>
</body>
```

- Hidden until it has keyboard focus, then a 48px `inverse-surface` block 8px from the top and inline-start corner (top right in Arabic). It appears instantly.
- `href` defaults to `#main-content`, the id `sc-page` renders. Activating it moves focus to the target, so the next Tab continues from the main content.
- Not underlined at rest, underlined on hover: it is a navigation link identified by its place and text (R6).
- Override the label through the default slot only if the page has no `<main>` content to skip to by that name.

### Styling hooks

Part: `control`.

<!-- Auto Generated Below -->


## Overview

"Skip to main content": the first focusable element on every page. Hidden until it gets
keyboard focus, then shown at the top start corner. Activating it moves focus to the
target (adding `tabindex="-1"` for the moment it's needed), so the next Tab continues
from the main content in every browser.

Put it first inside `<body>`, before `sc-app-bar` or `sc-site-header`. v2 shows it as a
48px `inverse-surface` block, so it stands out over any hero or announcement colour.

## Properties

| Property | Attribute | Description                                                                                              | Type     | Default           |
| -------- | --------- | -------------------------------------------------------------------------------------------------------- | -------- | ----------------- |
| `href`   | `href`    | The fragment of the element to skip to, `<main id="main-content">` by default, the id `sc-page` renders. | `string` | `'#main-content'` |


## Slots

| Slot | Description                                                                               |
| ---- | ----------------------------------------------------------------------------------------- |
|      | Overrides the label. Defaults to "Skip to main content" / "الانتقال إلى المحتوى الرئيسي". |


## Shadow Parts

| Part        | Description      |
| ----------- | ---------------- |
| `"control"` | The inner `<a>`. |


----------------------------------------------


