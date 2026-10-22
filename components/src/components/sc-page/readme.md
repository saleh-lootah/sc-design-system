# sc-page

The page shell: header, one `<main id="main-content">` and footer, with the page's language, direction and channel. Spec: `specs/sc-page.md`.

## Usage

```html
<sc-page lang="en" channel="now" sync-document>
  <div slot="header">
    <sc-skip-link></sc-skip-link>
    <sc-announcement-bar>…</sc-announcement-bar>
    <sc-site-header …>…</sc-site-header>
  </div>
  …
  <div slot="footer">
    <sc-footer variant="grouped"><footer>…</footer></sc-footer>
    <sc-utility-bar …></sc-utility-bar>
  </div>
</sc-page>
```

- The skip link's default `href` (`#main-content`) is `<main>`.
- `sync-document` copies `lang`, `dir` and `data-channel` to `<html>` and keeps focus clear of a sticky header.
- The end of the page is padded by a docked `sc-utility-bar`'s height.

<!-- Auto Generated Below -->


## Overview

The page shell (Standard TPL-01, 11.1 and 11.9): the header, one `<main>` and the footer,
with the page's language, direction and channel on its root.

- Set `lang` on `sc-page` as on any element; the page sets `dir` to match (`rtl` for
  Arabic) and re-applies it when `lang` changes.
- `channel` sets `data-channel`, which themes every component inside.
- `<main>` is rendered in light DOM (the component is scoped, not shadowed) with
  `id="main-content"` and `tabindex="-1"`, so the skip link (`sc-skip-link`, whose default
  `href` is `#main-content`) can reach it and move focus into it. The header slot gives
  the banner landmark, the footer slot the contentinfo landmark.
- With `sync-document` it also sets `lang`, `dir` and `data-channel` on `<html>`, and,
  with a sticky `sc-app-bar` or `sc-site-header` in the header, `scroll-padding-block-start`
  on `<html>` to the bar's height plus `--sc-space-8`, so focused elements are never
  hidden under it (WCAG 2.4.11).
- It reserves the height of a docked `sc-utility-bar` (`padding-block-end` from
  `--sc-utility-bar-block-size`, which the bar publishes), so the bar never covers the end
  of the page; `sc.css` sets the matching `scroll-padding-block-end` (CHR-05).

## Properties

| Property       | Attribute       | Description                                                                                                                                                                                                                                                             | Type                                                                                          | Default          |
| -------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ---------------- |
| `channel`      | `channel`       | The channel this page belongs to. Sets `data-channel` on the page root.                                                                                                                                                                                                 | `"build" \| "invest" \| "justice" \| "now" \| "trade" \| "transport" \| "visit" \| undefined` | `undefined`      |
| `mainId`       | `main-id`       | The id of `<main>`, the skip link's target.                                                                                                                                                                                                                             | `string`                                                                                      | `'main-content'` |
| `syncDocument` | `sync-document` | Also sets `lang`, `dir` and `data-channel` on `<html>`. Use it when `sc-page` is the whole page, so browsers and screen readers get the page language from the document root. With a sticky header, it also keeps `scroll-padding-block-start` on `<html>` clear of it. | `boolean`                                                                                     | `false`          |


## Slots

| Slot       | Description                                                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------- |
|            | The page content. It's wrapped in `<main>`.                                                                                     |
| `"footer"` | `sc-footer`, then `sc-utility-bar` on channel sites. Wrap several in one `<div slot="footer">`.                                 |
| `"header"` | The skip link, then the announcement bar if any, then `sc-app-bar` or `sc-site-header`. Wrap them in one `<div slot="header">`. |


----------------------------------------------


