# sc-app-bar

The top bar of every mobile screen and desktop page: translucent glass with a back link at the start, the channel name in bold, and the language switch at the end.

## Usage

Mobile (a step in a journey):

```html
<sc-app-bar sticky>
  <sc-back-link slot="start" href="/renew/vehicle"></sc-back-link>
  <span slot="title">Dubai Transport</span>
  <sc-language-switch slot="end" href="/ar/renew/plate"></sc-language-switch>
</sc-app-bar>
```

Desktop (a channel home page):

```html
<sc-app-bar align="start" shape="floating" sticky>
  <svg slot="title" aria-hidden="true">…</svg>
  <span slot="title">Dubai Now</span>
  <nav aria-label="Main">…</nav>
  <sc-language-switch slot="end" appearance="plain" href="/ar/"></sc-language-switch>
  <sc-button slot="end" size="m" href="/sign-in">Sign in with UAE PASS</sc-button>
</sc-app-bar>
```

### Options

| Prop | Values | Use |
|---|---|---|
| `align` | `center` (default), `start` | `center` is the mobile bar: start, title in the middle, end. `start` is the desktop header: title at the start, the default slot (navigation) next to it, end controls at the far end. |
| `shape` | `bar` (default), `floating` | `bar` runs edge to edge with a hairline at the bottom and respects the safe area. `floating` is the inset glass capsule used on desktop. |
| `sticky` | boolean | Keeps the bar at the top while the page scrolls; content passes under the glass. |
| `landmark` | boolean, default `true` | The host is a `banner` landmark. Set `landmark="false"` when the page already has one, or inside a dialog. |

### Content

- `title` is the channel name ("Dubai Transport" / "مواصلات دبي"), not the page question: the question is the page's `<h1>`. Keep it short; it truncates nothing, so long service names wrap.
- `start` holds `sc-back-link` on every step except the first. `end` holds `sc-language-switch`, and on desktop the sign-in button.
- Controls in the start and end slots are at least 44px tall. Equal start and end columns keep the mobile title centred whatever the controls' widths.

### Arabic

Start and end follow the direction: in Arabic the back link is on the right and the language switch on the left.

### Glass, reduced transparency and forced colours

The bar uses `--sc-color-glass` with a backdrop blur, a `--sc-color-glass-edge` hairline and elevation 2. Under `prefers-reduced-transparency: reduce` it becomes a solid `--sc-color-surface`; in forced colours it uses `Canvas` and a `CanvasText` border.

### Styling hooks

Parts: `bar`, `start`, `title`, `content`, `end`.

<!-- Auto Generated Below -->


## Overview

The top bar of every mobile screen and desktop page: a translucent glass bar with a
start control (usually `sc-back-link`), the channel name, and an end control (usually
`sc-language-switch`).

- `align="center"` (default) is the mobile bar: start, title in the middle, end.
- `align="start"` is the desktop header: title (with a mark) at the start, then the
  default slot (primary navigation), and the end slot pushed to the end.
- `shape="floating"` turns the bar into the inset glass capsule used on desktop.

The glass becomes a solid surface under `prefers-reduced-transparency: reduce` and in
forced colours. The host is a `banner` landmark unless `landmark` is false.

## Properties

| Property   | Attribute  | Description                                                                                                                                                              | Type                  | Default    |
| ---------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- | ---------- |
| `align`    | `align`    | `center`: mobile layout with the title in the middle. `start`: desktop layout with the title at the start.                                                               | `"center" \| "start"` | `'center'` |
| `landmark` | `landmark` | Makes the host a `banner` landmark. Set it to false when the page already has a banner (for example a site header around the bar), or when the bar sits inside a dialog. | `boolean`             | `true`     |
| `shape`    | `shape`    | `bar`: edge to edge with a hairline at the bottom. `floating`: an inset glass capsule (desktop).                                                                         | `"bar" \| "floating"` | `'bar'`    |
| `sticky`   | `sticky`   | Keeps the bar at the top of the viewport while the page scrolls (`position: sticky`).                                                                                    | `boolean`             | `false`    |


## Slots

| Slot      | Description                                                                  |
| --------- | ---------------------------------------------------------------------------- |
|           | Extra content after the title, such as primary navigation (`align="start"`). |
| `"end"`   | Trailing controls, usually `<sc-language-switch>` and a sign-in button.      |
| `"start"` | Leading control, usually `<sc-back-link>`. Controls are at least 44px.       |
| `"title"` | The channel or service name, shown bold. Text, optionally with a logo mark.  |


## Shadow Parts

| Part        | Description               |
| ----------- | ------------------------- |
| `"bar"`     | The glass bar.            |
| `"content"` | The default slot wrapper. |
| `"end"`     | The end slot wrapper.     |
| `"start"`   | The start slot wrapper.   |
| `"title"`   | The title wrapper.        |


----------------------------------------------


