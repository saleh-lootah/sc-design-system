# sc-page · specification (v2)

Status: rebuilt for v2 by C1 (Wave 2b). Rules: Standard TPL-01, 11.1, 11.9, CHR-05; component-language A30. Code: `src/components/sc-page`.

## Encapsulation

**Light DOM (Stencil `scoped`)**, minimal JS, as v1 (architecture §3.1): `<main>` must be in the document so the skip link and `aria-*` references reach it. It keeps v1's named slots `header` and `footer` (a deliberate exception to "default slot only", kept for API compatibility; both are usually a single `<div>` wrapper, which takes no box: `display: contents`).

## Behaviour

- `<main id="main-content" tabindex="-1">` around the default slot: the target of `sc-skip-link`'s default `href` (fixes v1's known gap), focusable programmatically with no ring.
- Landmarks: the header slot holds the banner (`sc-site-header` or `sc-app-bar`), the footer slot the contentinfo (`sc-footer`). One `<main>`.
- `dir` always follows the language (its own `lang` or the closest ancestor's), re-applied when `lang` changes anywhere above it. `channel` sets `data-channel`.
- `sync-document` copies `lang`, `dir` and `data-channel` to `<html>`, and keeps `scroll-padding-block-start` on `<html>` at a sticky `sc-app-bar` **or `sc-site-header`** height + 8px; it restores what was there when removed.
- Reserves a docked `sc-utility-bar`: `padding-block-end: var(--sc-utility-bar-block-size, 0px)`.
- Column layout with the footer at the bottom of short pages; `surface` background.

## API changes from v1

None to props or slots. The sticky-header padding now also follows `sc-site-header[sticky]`; the end padding for the utility bar is new; the background is `surface` (v1's `canvas` token is gone). It no longer imports the legacy dictionary.

## Budget

Leaf budget (4 KiB). Measured 3.0 KiB.

## Tests

Spec: light DOM, dir and channel, unknown channel, inherited language, `sync-document` on and off. e2e: order and landmarks (one banner, main, contentinfo), skip link to main and the next Tab, dir follows lang, channel theming, `sync-document`, utility bar reservation (padding, scroll padding, focus lands above the bar, nothing reserved below 1024px), sticky header padding for both headers and focus clear of them, restoring `<html>`, strings follow the page language; `describeAxe` on a full channel page. Visual: header, content and grouped footer EN/AR × light/dark.
