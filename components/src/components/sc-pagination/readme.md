# sc-pagination

Moves between the pages of a long list: search results, payments, fines. Spec: `specs/sc-pagination.md`.

## Usage

```html
<sc-pagination page="7" total-items="1284" item-label="fine|fines" href-template="/en/fines?page={page}"></sc-pagination>
```

```html
<!-- Arabic page: six plural forms (zero|one|two|few|many|other) -->
<sc-pagination page="1" total-items="1284" item-label="مخالفة|مخالفة|مخالفتين|مخالفات|مخالفة|مخالفة" href-template="/ar/fines?page={page}"></sc-pagination>
```

- `total-items` shows the count: "Showing 121 to 140 of 1,284 fines" / "عرض 121 إلى 140 من 1,284 مخالفة". Ranges always use a word, never a dash (LANG-22A in Arabic; the same in English). Digits are Latin, with a comma for thousands.
- Set `total-pages` directly, or let it follow from `total-items` and `page-size` (20).
- With `href-template` the pages are links and work without JavaScript. Without it they are buttons. Either way `scPageChange` fires with `{ page }`; `preventDefault()` stays on the page.
- Previous is left out on the first page and Next on the last. Below 600px: Previous, "Page 7 of 65", Next.
- Inside `sc-table`, put it in the `footer` slot.

### Styling hooks

Parts: `count`, `nav`, `list`.

<!-- Auto Generated Below -->


## Overview

Moves between the pages of a long list: search results, payments, fines. Inside
`sc-table`, put it in the table's `footer` slot.

Renders, in its shadow root, an optional results count ("Showing 1 to 20 of 1,284 fines";
in Arabic "عرض 1 إلى 20 من 1,284 مخالفة", with a word for the range, never a dash), then
`<nav aria-label="Pagination">` with Previous, the page numbers and Next. Previous is
left out on the first page and Next on the last (not disabled). The current page carries
`aria-current="page"`. Below 600px the numbers give way to "Page 2 of 13".

Pages are links when `href-template` is set ("?page={page}"), so the list works without
JavaScript; otherwise they are buttons. Every activation fires `scPageChange`; call
`preventDefault()` on it to stay on the page and load the new page yourself.

## Properties

| Property       | Attribute       | Description                                                                                                                                                                                                                                             | Type                  | Default     |
| -------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `hrefTemplate` | `href-template` | The URL of a page, with `{page}` where its number goes: `"?page={page}"`. Without it the pages are buttons and you handle `scPageChange`.                                                                                                               | `string \| undefined` | `undefined` |
| `itemLabel`    | `item-label`    | What is being counted, as a plural template in the page language: `"fine\|fines"` in English, the six Arabic forms `"zero\|one\|two\|few\|many\|other"` in Arabic (`"مخالفة\|مخالفة\|مخالفتين\|مخالفات\|مخالفة\|مخالفة"`). Defaults to results / نتيجة. | `string \| undefined` | `undefined` |
| `label`        | `label`         | Overrides the landmark name ("Pagination" / "ترقيم الصفحات").                                                                                                                                                                                           | `string \| undefined` | `undefined` |
| `page`         | `page`          | The current page, from 1.                                                                                                                                                                                                                               | `number`              | `1`         |
| `pageSize`     | `page-size`     | Items per page, for the results count and `total-pages`.                                                                                                                                                                                                | `number`              | `20`        |
| `totalItems`   | `total-items`   | The number of items across every page. Shows the results count when set.                                                                                                                                                                                | `number \| undefined` | `undefined` |
| `totalPages`   | `total-pages`   | The number of pages. Leave it out to work it out from `total-items` and `page-size`.                                                                                                                                                                    | `number \| undefined` | `undefined` |


## Events

| Event          | Description                                                                               | Type                                  |
| -------------- | ----------------------------------------------------------------------------------------- | ------------------------------------- |
| `scPageChange` | Fires when a page is chosen. Cancelable: `preventDefault()` stops a link from navigating. | `CustomEvent<PaginationChangeDetail>` |


## Shadow Parts

| Part      | Description             |
| --------- | ----------------------- |
| `"count"` | The results count line. |
| `"list"`  | The `<ul>` of controls. |
| `"nav"`   | The `<nav>` landmark.   |


----------------------------------------------


