# sc-pagination · specification (v2, new)

Status: new in v2, built by C2 (Wave 2b). Visual rules: `docs/v2/component-language.md` B7; LANG-20, LANG-22A, LANG-23. Paper reference for structure: v1 file, page p-B-0, L5T-0. Code: `src/components/sc-pagination`.

Moves between the pages of a long list: search results, payments, fines. In `sc-table`, it goes in the `footer` slot.

## Encapsulation

**Shadow DOM**. Everything is rendered from properties; nothing outside references inside it. Parts: `count`, `nav`, `list`.

## API

| Prop | Default | Notes |
| --- | --- | --- |
| `page` | 1 | Current page, clamped to 1…pages |
| `total-pages` | from `total-items` / `page-size` | |
| `total-items` | – | Shows the results count |
| `page-size` | 20 | |
| `href-template` | – | `"?page={page}"`. Pages are links (they work without JavaScript); without it they are buttons |
| `item-label` | results / نتيجة | Plural template in the page language: `one|other` (EN), `zero|one|two|few|many|other` (AR) |
| `label` | "Pagination" / "ترقيم الصفحات" | Landmark name |

Event `scPageChange` (`{ page }`, bubbles, composed, cancelable): fires on every activation; `preventDefault()` stops a link from navigating.

## Anatomy

| # | Part | Notes |
| --- | --- | --- |
| 1 | Count | `<p>`, `body-medium`, `on-surface-variant`, 12 above the nav. "Showing 121 to 140 of 1,284 fines" (a word for the range in both languages, as board BUV-0) / "عرض 121 إلى 140 من 1,284 مخالفة"; one item: "Showing 1 of 1 fine" |
| 2 | Landmark | `<nav aria-label>`; left out when there is only one page |
| 3 | Previous | `chevron-back` (20px) and "Previous", `channel-action`, underlined, 44 tall, padding-inline 12, gap 6, `rel="prev"`. Left out on the first page (not disabled) |
| 4 | Numbers | 44 × 44 cells, radius 4, gap 4, `aria-label="Page 3"`. First, last, current ±1; a gap of one page shows the page, a longer gap an ellipsis |
| 5 | Current | `channel-action` fill, `channel-on-action` text, Bold, `aria-current="page"` |
| 6 | Next | As Previous, mirrored order, `rel="next"`; left out on the last page |
| 7 | Page of | Below 600px, numbers give way to "Page 7 of 65" / "الصفحة 7 من 65" in Bold; Previous sits at the start edge and Next at the end edge (no inline padding), the page between them (board BUV-0) |

## Type and numbers

`label-large` with the `label-medium` weight (18/22 Medium EN, 20/28 Bold AR); current Bold. Digits are Latin, with a comma for thousands, in both languages (LANG-20, LANG-22). Arabic ranges use "إلى", never a dash (LANG-22A). The noun follows `Intl.PluralRules` (LANG-23).

## States

Number hover: the `.state-layer` helper (8% `on-surface`); pressed 12% and scale 0.97 over `duration-press` (pointer only, MOT-09). Previous/Next hover: underline 2px. Focus: U1 ring. Forced colours: `LinkText`/`ButtonText`, current `Highlight`.

## RTL

Logical properties only (avoiding `dda-pagination`'s physical borders): Previous is on the right and its chevron points right.

## Strings

`src/i18n/components/sc-pagination.ts`.

## Budget

Custom-elements closure 3,854 B gzip (4 KiB budget), its own CSS 815 B. The two chevrons are Material Symbols `chevron_left` and `chevron_right`, inlined from `src/icons/for/sc-pagination.tsx`.

## Tests

`sc-pagination.spec.tsx` (page windows, current page, links and `rel`, buttons, landmark and page count, EN count and singular, Arabic count with a word and plural forms, clamping), `sc-pagination.e2e.ts` (cell size and radius, current colours and weight, Previous/Next styling, type EN/AR, count, RTL order and chevron, keyboard, `scPageChange` and `preventDefault`, buttons with Space, compact view, pointer press scale; `describeAxe`), `sc-pagination.visual.e2e.ts` (wide and compact).
