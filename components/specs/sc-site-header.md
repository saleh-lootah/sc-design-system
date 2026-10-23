# sc-site-header · specification (v2)

Status: new in v2, built by C1 (Wave 2b). Visual rules: `docs/v2/component-language.md` B2 and B2b, Standard CHR-01 to CHR-04, decisions Q-header (structure from the Dubai Now reference, look from E1), U3a (UAE PASS) and L1–L4 (the lockup), read through the decisions role table. Code: `src/components/sc-site-header`.

The header of channel pages outside a transaction: a channel's home, topic and section pages, search results and the signed-in account area. Transaction pages use `sc-app-bar`.

## Naming decision

v1 had one tag, `sc-app-bar`, for both the journey bar and the desktop channel header (`align="start" shape="floating"`). v2 splits them, as component-language B2 and decision Q-names say: **`sc-site-header` is a new tag** for the channel-site header, and **`sc-app-bar` keeps its name and its role as the transaction app bar** (A4). The v1 desktop-header use of `sc-app-bar` is deprecated (it still renders, flat) and listed in `docs/v2/migration.md`.

## Encapsulation

**Shadow DOM.** Nothing outside reaches inside: the navigation links, lockup, language switch, account menu and channel switcher are the service's own elements, slotted in. The header styles the slotted navigation links with `::slotted(a)`. The mobile menu is a `<dialog>` in the shadow root. The channel switcher is a separate light-DOM tag (`sc-channel-switcher`), because its items must take other channels' colours from the document (FND-26).

## Anatomy

| # | Part | Notes |
| --- | --- | --- |
| 1 | Bar | `<header>` (banner landmark), `surface`, a 1px `outline-variant` rule beneath. 80px tall (64 compact). Content capped at `container-max` (1280) with the grid margin inline (20/32/48/80). |
| 2 | Lockup | `slot="lockup"`: the Government of Dubai lockup as supplied (L1–L4), 40px tall, usually in an `<a>` to the channel home. The library ships no logo; public demos use a neutral placeholder of the same proportions (680.84 × 274.11) labelled "Government of Dubai lockup". |
| 2a | Site name | `slot="name"` (v2-lib-gaps): the site's name or wordmark after the lockup, in both layouts: text (title-medium Bold, title-small compact), an `<img>` or an `<svg>` with a text alternative, usually in an `<a>` to the site home. Never the Government of Dubai lockup, which has its own slot. |
| 3 | Main navigation | `<nav aria-label="Main">` around `slot="nav"`: direct `<a>` children. Full-height links, 36px apart and 56 from the lockup from 1440px (B2, board CTM-0); 32 and 40 from 1024 to 1439, where the content is at most 1184 and the board's gaps overflow a four-item English row. label-large Medium (Bold in Arabic, D12). The current item (`aria-current="page"`) is `channel-action`, Bold, with a 3px `channel-action` bar at block-end. The bar is the non-weight cue R10 asks for: in Arabic every item is already Bold, so the bar (and the inline-start bar in the menu) marks the current item in both languages. Nav links underline on hover only: their place in the header identifies them as links (R6). |
| 4 | Search | `slot="search"` (v2-lib-gaps): an `sc-search` (with `label-hidden`), inline in the end controls, 320px wide and shrinking to 160px when the row is tight (the navigation never shrinks for it; when even 160px does not fit, the header takes its compact layout: beside the name, four or five items and the UAE PASS button that is the case at 1280px), and the first thing in the mobile menu. Otherwise, with `search-href`: a 44 × 44 icon link named "Search" (a 56px row in the menu). The end controls (search, language, sign in or account, switcher) are 24 apart from 1440px, 16 from 1024 to 1439, 8 in the compact row. |
| 5 | Language | `slot="language"`: `sc-language-switch` (`header` appearance). |
| 6 | Sign in | U3a: the official UAE PASS button in `slot="signin"`. Until the kit arrives, with `sign-in-href` the header renders a marked placeholder (`data-placeholder="uaepass"`): black fill, white label "Sign in with UAE PASS" (label-medium Bold in the row, label-large in the menu, as B2 and the board), a fingerprint glyph, 56px, the same on every channel and in dark mode. It is never an `sc-button` and never city indigo. |
| 7 | Account | `slot="account"`: `sc-account-menu`. When present it replaces sign in. |
| 8 | Channel logo and switcher | `slot="switcher"`: `sc-channel-switcher`. |
| 9 | Menu button (compact) | 44 × 44, `menu` icon, named "Menu", `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`. |
| 10 | Mobile menu (compact) | A full-screen modal `<dialog>` labelled by its title "Menu": a 64px head row (close button, title, the language switch), then search as a 56px row, the navigation as 56px rows with a chevron and 1px rules (current row: 3px `channel-action` bar at inline-start), then sign in (full width) with "Sign in to see your tasks, payments and saved services." (body-small, start-aligned), or the account menu. |

## Layout

- Full row: lockup, navigation, then at inline-end search, language, sign in or account, switcher. Mirrors in Arabic.
- **Compact below 1024px (CHR-04):** menu button, lockup, then language and the switcher (which shrinks to its logo). Navigation, search, sign in and the account menu move into the menu. The same slotted elements move (the slot elements are re-rendered inside the dialog); nothing is duplicated.
- **Overflow fallback (new, beyond B2):** at 1024px and wider, if the full row does not fit (five long items, or Arabic with the long UAE PASS placeholder label at 1024–1279), the header uses the compact row and its menu instead of wrapping or clipping, until it is wider than where it overflowed. component-language B2 proposed a "More" disclosure for this; the fallback is simpler and always correct. Measured: in Arabic with four items, the signed-out row (placeholder label) does not fit in 1280px, so Arabic signed-out pages use the compact row. Re-check when the official UAE PASS kit sets the label and width.

## Behaviour

- Menu: the button opens the dialog with `showModal()` (the page behind is inert), focus goes to the close button. Escape (the dialog's cancel) closes it instantly; the close button closes it; a click on a navigation link closes it. Focus returns to the menu button. Widening past the compact breakpoint closes it.
- Not fixed by default. `sticky` makes it `position: sticky`; `sc-page sync-document` then keeps `scroll-padding-block-start` clear of it (A11Y-05, F-009).
- Methods: `openMenu()`, `closeMenu()`.

## Motion

Menu from a pointer: opacity and an 8px rise over `duration-base` with `easing-enter`; close button from a pointer: opacity over `duration-exit`. From the keyboard: instant (MOT-02). Under reduced motion: opacity only. Navigation hover is colour and underline only; the current bar does not slide. The 44px icon buttons (search, the menu button and the menu's close button) press to `scale(--sc-scale-press)` on `:active` over `duration-press` with `easing-enter`, pointer and touch only (MOT-09); none from the keyboard (MOT-02) or under reduced motion (the token is 1). Approved by the user, 23 October 2026.

## Accessibility

- One banner landmark; one `<nav>` named "Main" / "رئيسية" (the same name in the menu, where only one is rendered at a time).
- Every target is at least 44px. Focus: the U1 ring; on full-height navigation links it sits 4px inside the link, clear of the bar.
- Forced colours: rules `CanvasText`, current bars `Highlight`, the placeholder gets a `LinkText` edge.

## Strings

`src/i18n/components/sc-site-header.ts`: `headerNav`, `headerSearch`, `headerSignIn`, `headerSignInHint`, `headerMenu`, `headerOpenMenu`, `headerCloseMenu`. The Arabic placeholder label is ours until the UAE PASS kit gives the official one.

## Budget

7.5 KiB override (`perf-budgets.json`). Measured closure 7.3 KiB gzip: own module 4.4 KiB (CSS 1.6 KiB), plus shared chunks a channel page pays once (locale controller 0.9, chrome icons 1.1, motion 0.6).

## Tests

- `sc-site-header.spec.tsx`: order of parts, UAE PASS placeholder (not `sc-button`), `slot="signin"`, account replaces sign in, dialog labelling, Arabic strings.
- `sc-site-header.e2e.ts`: order and mirroring, 80px flat bar and rule, banner and "Main", current item (3px bar, Bold, `aria-current`), the bar as the non-weight cue in EN and AR (R10), row spacing (56/36/24 at 1440), 44px targets, placeholder identical across channel and theme, account, Tab order, compact row (64px, no overflow at 390px), keyboard open (focus, modal, inert, Escape, focus return, no animation), close button and link close, pointer animation, current row bar in Arabic, overflow fallback at 1024px Arabic, sticky, axe with the menu open; `describeAxe` EN/AR × light/dark.
- `sc-site-header.visual.e2e.ts`: signed in and signed out at 1440px, EN/AR × light/dark.

## Open

- The official UAE PASS button (U3a): geometry, Arabic label, dark-mode treatment. Swap through `slot="signin"`; delete the placeholder then.
- The lockup's link target, clear space and dark version (L4).

## Before upgrade

`sc.css` lays out the light-DOM children of `sc-site-header:not(:defined)` as one plain row (PERF-04, B1, v2-lib-gaps): the lockup, the name and the navigation links (label-large, 44px targets, the current one Bold in `channel-action` with its 3px bar), with the grid margins and the 1px rule. That is what a visitor without JavaScript gets: the links wrap onto more rows on narrow screens, and the `sc-search` field, which needs JavaScript, is hidden. With scripting on, the host holds 81px (65px below 1024px) and clips the row (`max-block-size`, `overflow: hidden`), so CLS stays 0 while it loads. The search page stays reachable without JavaScript only through a link the page writes (for example in the navigation): `search-href` is an attribute and renders nothing until the header upgrades. It sets its own container margins and cap; it never nests `sc-container`.
