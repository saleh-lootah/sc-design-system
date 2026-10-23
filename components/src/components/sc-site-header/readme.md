# sc-site-header

The header of channel pages outside a transaction (Standard CHR-01 to CHR-04). Transaction pages use `sc-app-bar`. Spec: `specs/sc-site-header.md`.

## Usage

```html
<sc-site-header sign-in-href="/en/sign-in" search-href="/en/search">
  <a slot="lockup" href="/en/"><img src="/brand/government-of-dubai.svg" alt="Government of Dubai" height="40"></a>
  <a slot="nav" href="/en/" aria-current="page">Home</a>
  <a slot="nav" href="/en/services">Services</a>
  <a slot="nav" href="/en/life-events">Life events</a>
  <a slot="nav" href="/en/help">Help and contact</a>
  <sc-language-switch slot="language" appearance="plain" href="/ar/"></sc-language-switch>
  <sc-channel-switcher slot="switcher" links='{"now":"https://…/{lang}/", …}'></sc-channel-switcher>
</sc-site-header>
```

- The lockup is the brand owner's artwork, used as supplied (decisions L1–L4); the library ships none.
- Navigation links are direct children with `slot="nav"`; mark the current one `aria-current="page"`.
- Sign in is the official UAE PASS button (decision U3a). Put it in `slot="signin"` when the kit is available; until then `sign-in-href` renders a marked black placeholder. Never use `sc-button` for it.
- Signed in: add `<sc-account-menu slot="account">`; it replaces sign in.
- Below 1024px (or when the row does not fit) navigation, search and sign in move into a modal menu.
- Optional: `<a slot="name" href="/en/">Dubai Now</a>` for the site's name or wordmark after the lockup.
- Optional: `<sc-search slot="search" label="Search Dubai Now" label-hidden action="/en/search"></sc-search>` puts a search field in the row (320px, shrinking to 160px) and at the top of the menu. Without it, `search-href` gives a search icon link.
- Before it upgrades, and without JavaScript, `sc.css` shows the lockup, name and navigation links as a plain row.

<!-- Auto Generated Below -->


## Overview

The header of channel pages outside a transaction (Standard CHR-01 to CHR-04;
component-language B2). Transaction pages use `sc-app-bar`.

From the inline-start edge: the Government of Dubai lockup (`slot="lockup"`), an optional
site name or wordmark (`slot="name"`), the main navigation (`slot="nav"`), search (an
`sc-search` in `slot="search"`, else a search link to `search-href`), the language switch
(`slot="language"`), sign in with UAE PASS
(`slot="signin"`) or the account menu once signed in (`slot="account"`), and the
channel's logo and switcher (`slot="switcher"`, an `sc-channel-switcher`). Sign in is the
official UAE PASS button (decision U3a), never a themed `sc-button`: until the official kit
arrives the header renders a marked placeholder (black, white label, fingerprint glyph,
56px) that `slot="signin"` replaces. The order
mirrors in Arabic. A flat `surface` bar, 80px tall, with a 1px `outline-variant` rule.

Below 1024px the row keeps the menu button, the lockup, the name, the language switch and the
channel switcher (64px). Navigation, search and sign in (or the account menu) move into
the mobile menu: a modal `<dialog>` labelled "Menu", with focus on its close button when
it opens, Escape closing it and returning focus to the menu button, and the page behind
it inert. The same slotted elements move; nothing is duplicated.

Before it upgrades, and without JavaScript, `sc.css` lays the light-DOM children out as one
plain row (PERF-04, B1): the lockup, the name and the navigation links (the current one
underlined in the channel colour, R10), 44px targets. With JavaScript the host keeps its
final height meanwhile, so nothing moves when it upgrades.

The host is a `<header>` banner landmark. It is not fixed by default; with `sticky`,
`sc-page` keeps `scroll-padding-top` clear of it (A11Y-05, F-009).

## Properties

| Property     | Attribute      | Description                                                                                                                                                                                                                                                                                                                                   | Type                        | Default     |
| ------------ | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | ----------- |
| `fullFrom`   | `full-from`    | For a row that only fits wider than 1024px (five long items, as on the documentation site): the width from which the full row is used, `1280` or `1440`. Below it the header is compact from the first paint, before and after it upgrades, instead of measuring the row and switching (sc.css lays out the light-DOM children the same way). | `1280 \| 1440 \| undefined` | `undefined` |
| `searchHref` | `search-href`  | The search page. Adds a search button (an icon link named "Search") when there is no `slot="search"` child.                                                                                                                                                                                                                                   | `string \| undefined`       | `undefined` |
| `signInHref` | `sign-in-href` | Where the UAE PASS placeholder button leads. The placeholder shows when this is set and there is neither a `slot="signin"` nor a `slot="account"` child.                                                                                                                                                                                      | `string \| undefined`       | `undefined` |
| `signInText` | `sign-in-text` | Overrides the placeholder's "Sign in with UAE PASS" (in the page language).                                                                                                                                                                                                                                                                   | `string \| undefined`       | `undefined` |
| `sticky`     | `sticky`       | Keeps the header at the top while the page scrolls. `sc-page` then sets `scroll-padding-top`.                                                                                                                                                                                                                                                 | `boolean`                   | `false`     |


## Methods

### `closeMenu(pointer?: boolean) => Promise<void>`

Closes the mobile menu and returns focus to the menu button.

#### Parameters

| Name      | Type      | Description |
| --------- | --------- | ----------- |
| `pointer` | `boolean` |             |

#### Returns

Type: `Promise<void>`



### `openMenu() => Promise<void>`

Opens the mobile menu (compact layout only).

#### Returns

Type: `Promise<void>`




## Slots

| Slot         | Description                                                                                                                                                                                                                                |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `"account"`  | `<sc-account-menu>` once the user is signed in. It replaces sign in.                                                                                                                                                                       |
| `"language"` | `<sc-language-switch>`.                                                                                                                                                                                                                    |
| `"lockup"`   | The Government of Dubai lockup, as supplied (decision L1–L4): an `<img>` or `<svg>` with the text alternative "Government of Dubai" / "حكومة دبي", 40px tall, usually inside an `<a href>` to the channel home. The library ships no logo. |
| `"name"`     | Optional: the site's name or wordmark, after the lockup (text, an `<img>` or an `<svg>` with a text alternative, usually inside an `<a href>` to the site home). Never the Government of Dubai lockup, which goes in `slot="lockup"`.      |
| `"nav"`      | The main navigation: `<a href>` elements, direct children of the header, four or five of them. Mark the current one with `aria-current="page"`.                                                                                            |
| `"search"`   | Optional: an `<sc-search>` (with `label-hidden`), inline in the row on wide screens and at the top of the mobile menu on compact ones. Without it, `search-href` gives a search link.                                                      |
| `"signin"`   | The official UAE PASS sign-in button, when available (U3a). Replaces the built-in placeholder; it moves into the mobile menu on compact screens.                                                                                           |
| `"switcher"` | `<sc-channel-switcher>`, the channel's logo and the channel switcher.                                                                                                                                                                      |


## Shadow Parts

| Part       | Description                 |
| ---------- | --------------------------- |
| `"bar"`    | The header row.             |
| `"menu"`   | The mobile menu `<dialog>`. |
| `"signin"` |                             |


----------------------------------------------


