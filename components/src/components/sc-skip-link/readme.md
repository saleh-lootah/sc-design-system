# sc-skip-link

"Skip to main content" / "انتقل إلى المحتوى الرئيسي". Lets keyboard and switch users jump past the app bar and navigation.

## Usage

```html
<body>
  <sc-skip-link></sc-skip-link>
  <sc-app-bar>…</sc-app-bar>
  <main id="main">…</main>
</body>
```

- Put it first in `<body>`, on every page. It's hidden until it receives keyboard focus, then shown as a pill at the top start corner (top left in English, top right in Arabic).
- `href` defaults to `#main`. Point it at your `<main>` element's id if it differs.
- Activating it moves focus to the target. If the target isn't focusable, the component adds `tabindex="-1"` and removes it when focus leaves, so the next Tab continues from the main content in every browser.
- The label comes from strings in the page language. Override it with the default slot only if the target isn't the main content.

### Accessibility

It's a real link (`<a href="#main">`), so it works before JavaScript loads its focus handling. It's positioned absolutely: give it a positioned ancestor only if you want it somewhere other than the top of the page.

### Styling hooks

Part: `control`.

<!-- Auto Generated Below -->


## Overview

"Skip to main content": the first focusable element on every page. Hidden until it gets
keyboard focus, then shown at the top start corner. Activating it moves focus to the
target (adding `tabindex="-1"` for the moment it's needed), so the next Tab continues
from the main content in every browser.

Put it first inside `<body>`, before `sc-app-bar`.

## Properties

| Property | Attribute | Description                                                         | Type     | Default   |
| -------- | --------- | ------------------------------------------------------------------- | -------- | --------- |
| `href`   | `href`    | The fragment of the element to skip to, usually `<main id="main">`. | `string` | `'#main'` |


## Slots

| Slot | Description                                                                            |
| ---- | -------------------------------------------------------------------------------------- |
|      | Overrides the label. Defaults to "Skip to main content" / "انتقل إلى المحتوى الرئيسي". |


## Shadow Parts

| Part        | Description      |
| ----------- | ---------------- |
| `"control"` | The inner `<a>`. |


----------------------------------------------


