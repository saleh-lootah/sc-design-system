# sc-page

The frame of every page: header, `<main>` and footer, with the page's language, direction and channel set once on its root.

## Usage

```html
<sc-page lang="ar" channel="transport" sync-document>
  <div slot="header">
    <sc-skip-link></sc-skip-link>
    <sc-app-bar>…</sc-app-bar>
  </div>
  <sc-channel-hero>…</sc-channel-hero>
  <sc-container>…</sc-container>
  <sc-footer slot="footer" help-href="/help" accessibility-href="/accessibility" privacy-href="/privacy" terms-href="/terms"></sc-footer>
</sc-page>
```

- Set `lang` on `sc-page` like on any element. The page sets `dir` to match (`rtl` for Arabic) and updates it when `lang` changes, so every component inside picks up the language.
- `channel` sets `data-channel`, which themes everything inside.
- Use `sync-document` when `sc-page` is the whole page, so `<html>` also gets the language, direction and channel (browsers and screen readers read the page language from the root).
- Content goes in the default slot and is wrapped in `<main id="main-content" tabindex="-1">`. Point the skip link at `#main-content` (change it with `main-id`).

### Why it is scoped, not shadowed

A skip link can only reach an element in light DOM: `#main-content` inside a shadow root is invisible to fragment navigation. So `sc-page` uses Stencil's scoped mode and renders `<main>` as a real child.

## Container and grid

- `sc-container` sets the page margins (20, 32, 48, 80px at 0, 600, 1024, 1440px) and caps content at 1280px; `width="reading"` caps it at 680px for question pages.
- `sc-grid` gives 4, 8 or 12 columns with 16, 20 or 24px gutters.

<!-- Auto Generated Below -->


## Overview

The page frame: header, `<main>` and footer, with the page's language, direction and
channel on its root.

- Set `lang` on `sc-page` as on any element; the page sets `dir` to match (`rtl` for
  Arabic) and re-applies it when `lang` changes.
- `channel` sets `data-channel`, which themes every component inside.
- `<main>` is rendered in light DOM (the component is scoped, not shadowed) with
  `id="main-content"` and `tabindex="-1"`, so a skip link (`<a href="#main-content">`)
  anywhere on the page can reach it and move focus into it.

## Properties

| Property       | Attribute       | Description                                                                                                                                                                   | Type                                                                                          | Default          |
| -------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ---------------- |
| `channel`      | `channel`       | The channel this page belongs to. Sets `data-channel` on the page root.                                                                                                       | `"build" \| "invest" \| "justice" \| "now" \| "trade" \| "transport" \| "visit" \| undefined` | `undefined`      |
| `mainId`       | `main-id`       | The id of `<main>`, the skip link's target.                                                                                                                                   | `string`                                                                                      | `'main-content'` |
| `syncDocument` | `sync-document` | Also sets `lang`, `dir` and `data-channel` on `<html>`. Use it when `sc-page` is the whole page, so browsers and screen readers get the page language from the document root. | `boolean`                                                                                     | `false`          |


## Slots

| Slot       | Description                                 |
| ---------- | ------------------------------------------- |
|            | The page content. It's wrapped in `<main>`. |
| `"footer"` | `sc-footer`.                                |
| `"header"` | The skip link, then the app bar.            |


----------------------------------------------


