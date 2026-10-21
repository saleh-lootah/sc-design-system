# Code against Paper: alignment report

Branch `v2-align`, 21 October 2026. Every v2 component was rendered in Helium (EN and AR, light and dark) and compared with its board in the Paper file "Shared Channels · Design System v2". The boards were read with get_jsx and get_computed_styles. Where the two disagreed, the rule was: decisions.md first, then the token values (W5), then the board. Where the board itself looked wrong, the code was kept; that case is listed below with the node, for you to decide. Paper was not edited.

## Decisions for you

These are the places where a choice, not a correction, is needed.

1. **sc-attention-card lost its 4px top strip.** The board (E7U-0, usage ECS-0) and component-language B12 say "no coloured card edge". The old spec credited it to a coordinator brief that decisions.md doesn't record. Restore it if you want it.
2. **sc-notification-list:** the board and B17 draw a row that is *not* a link: a 40px tone icon tile, the title in on-surface, and a separate action link in a 112px column (8J7-0, 8JE-0). The code makes the whole item a link, with the title in channel-action, following the earlier brief and migration.md. Changing it is an API change.
3. **sc-bottom-nav budget:** proposed 4.5 KiB, the same as sc-account-nav (W8). It needs an Outlined and a Filled Material path for each of its eight destinations (ICN-02).
4. **sc-bottom-nav focus ring:** the board (GG4-0) draws it 2px outside the item. The code keeps an inset ring so the screen edge never clips it, as CONVENTIONS requires. Which rule wins at a screen edge?
5. **sc-status-tag `tone="channel"`:** restored per W4 (board 46X-0). `docs/library-conformance.md` §9.6 and `COMPONENTS.md` line 166 still call it deprecated; they need editing.
6. **sc-callout accent:** the board uses a 4px bar (`--sc-size-strip`, 2YZ-0). The code keeps the 3px `--sc-size-border-accent`, whose stated purpose is "the start bar of an error field group or callout". Forms use 4px `size-strip` (W11). Should callouts follow?
7. **sc-modal motion:** the board (BYR-0) says enter 200ms, exit 160ms. CONVENTIONS and W2 say modals use `duration-slow` (280ms). Motion was left as it is.
8. **sc-date-input value alignment:** the board (BCE-0) puts the value at inline-start with 16 padding. The spec deliberately centres it with tabular figures (from v1).
9. **sc-utility-bar shadow:** the board casts `0 -1px 3px` upward (EYQ-0). The only token, `elevation-1`, casts downward and barely shows under a bottom bar. An upward elevation token would be needed.
10. **Arabic wording on boards:** the utility bar says "مقياس السعادة" and "الدردشة"; the code says "مؤشر السعادة" (the official Happiness Meter name) and "المحادثة". The footer's Legal heading is "قانوني" on the board and "المعلومات القانونية" in the code. The pagination count is "من أصل 1,284" on the board and "من 1,284" in the code, which is LANG-22A wording.
11. **sc-account-menu items:** the board and B3 list Applications, Payments, Notifications (with a badge in the panel) and Profile and settings. The code has Profile, Settings and "Change who you act for", with notifications as a separate bell. Matching the board changes the API.
12. **New tags that boards ask for:** `sc-plate` (09.09 ENS-0 and B13), `sc-icon` / `sc-icon-tile` (empty-state and service-card snippets), and a general `sc-chip` with suggestion and toggle modes (AQQ-0, marked proposed).

## Fixes made

Each item gives the board value matched. The specs, readmes, playground pages, tests and baselines were updated with them.

### Actions and navigation (page p-7-0)

- **sc-button:** no change; it matches.
- **sc-link:** external icon 20px with a 6 gap, centred, also inline (was 1em, 0.25em).
- **sc-back-link:** padding-inline 4 at the arrow side and 6 at the end (55M-0).
- **sc-skip-link:** the focused block is not underlined (6E8-0).
- **sc-language-switch:** no change.
- **sc-channel-chip:**
  - padding 10 to the content (was 13)
  - the link chevron sits 8 after the label and 6 from the edge
  - the hover underline offset is 3
- **sc-breadcrumbs:**
  - new `compact-label` prop
  - the compact link is at least 44 tall
- **sc-pagination:**
  - "Showing 61 to 80 of 1,284" (a word, not a dash)
  - compact "Page 4 of 13" is Bold
  - compact Previous and Next sit at the edges
- **sc-account-nav:**
  - the current label is channel-action
  - items are 2 apart
  - the divider has 8 above and below
  - compact items use label-medium
- **sc-bottom-nav:**
  - the indicator is 6 below the rule and the label 2 below the indicator, top-aligned
  - a one-line Arabic label fits the 64px bar
- **sc-site-header (CTM-0):**
  - from 1440px: 56 from the lockup to the navigation, 36 between items, 24 between end controls (40/32/16 kept at 1024–1439, where the board's gaps overflow)
  - the sign-in label is label-medium Bold in the row
  - the mobile-menu hint is start-aligned
- **sc-channel-switcher (inside CTM-0):**
  - a 10px swatch with radius 3 replaces the ring mark
  - trigger padding 16 / 12
  - items padded 10 × 12, with no gap between name and descriptor
  - caption padded 8 × 12
- **sc-account-menu (EAC-0):**
  - initials are channel-action on channel-container
  - trigger padding 6 / 12
  - the name is label-medium Bold
  - item icons are on-surface-variant
  - the divider has 4px around it
- **sc-announcement-bar (DVZ-0):**
  - a one-line bar is 48 tall
  - the icon and dismiss button are centred on the first line
  - the link is in the message type, 12 after the message
  - new `dismiss-label` prop
- **sc-utility-bar (ERV-0, U4):**
  - block padding 12, 48px items
  - new Services item (`services-href`)
  - the call item reads "Call 04" / "اتصل 04"
  - the folded group has a gap of 8 and text-only buttons
- **sc-footer (F66-0):**
  - simple variant: top padding 32, meta in body-medium, the board's link order
  - compact grouped variant: top padding 32
  - the brand name is headline-small
- **sc-channel-network (FVO-0):**
  - the 4px top rule is a background band, clipped square
  - new `eyebrow` prop
- **sc-app-bar:** matches its specimen on the back-link board (54G-0); no change.

### Feedback and status (page p-9-0)

- **sc-callout:**
  - the message is body-medium Medium
  - the link underline offset is 3
- **sc-error-summary:**
  - padding 18 / 16
  - links are body-medium Bold
- **sc-status-tag:** `tone="channel"` is back (W4).
- **sc-spinner:**
  - default 24px
  - the label is 12 from the arc and on-surface
  - a 270° arc with a 2.5px stroke and no track (4RS-0)
- **sc-step-progress:**
  - 14 from the markers to the text, 2 from the state line to the name
  - the name has 8 at its end
  - the state line is Regular (Medium when current)
  - the compact meta row gap is 12
  - the dark halo is outline-variant
- **sc-step-list:**
  - the entity line is body-medium in on-surface-variant (it was unstyled: a Stencil scoper bug with comma lists in `:not()`)
  - rows are 90 tall
- **sc-notification-list:**
  - the body is body-medium (also hit by the scoper bug)
  - title-to-body gap 2
  - the time is start-aligned in its column
  - the compact column gap is 12
- **sc-empty-state:**
  - new `slot="icon"`
  - heading levels go up to 6
  - the dark icon circle is surface-container-high
  - the body is at most 520 wide
- **sc-timeline:**
  - the time is 6 below the tag and the description 2 below the time
  - the connector runs from 4 below the dot
- **sc-modal:**
  - the panel is surface (light) and surface-container-high (dark), behind `@supports`
  - the close button is 44 × 44, radius 4, in the corner
  - dialog actions are 16 apart
  - sheet spacing per BY7-0

### Content and layout (page p-A-0)

- **sc-page, sc-container, sc-grid, sc-ltr:** they match.
  - The two failing sc-page e2e tests were assertions about sc-search that the forms merge had grafted onto the wrong fixture. The tests were wrong, not sc-page.
- **sc-card:**
  - restored after my W12 commit broke its stylesheet
  - the filled card is surface-container-high in dark mode
- **sc-service-card:** it matches.
- **sc-channel-hero (CEY-0):**
  - top padding 88 at 1440px
  - one block gap of 20, 24 or 32
  - the eyebrow is title-medium
  - "Popular now" is in on-surface
  - the chip fill is surface-card
- **sc-summary-list (6D4-0):**
  - row padding 14 block and 16 inline
  - in the columns layout, a 200px key column
  - the total is headline-small
  - dark-mode card and total colours
- **sc-table (8Z9-0):**
  - the header row is 48 tall and cells have 14 block padding
  - row-header links are channel-action and underlined
  - the selection-bar type is split into count and total
  - stacked cards show key and value on one line
- **sc-accordion (F2F-0):**
  - the answer is body-medium
  - answer blocks are 8 apart and keep clear of the chevron
  - 2 between the title and the summary line
  - no chevron turn under reduced motion
- **sc-tile (D0T-0):**
  - the title is 16 below the icon tile
  - pressing adds a 12% on-surface layer
- **sc-attention-card (DTO-0):**
  - the strip is removed (see decision 1)
  - the icon tile follows the slotted status tag's tone
  - the fact is body-medium
  - the action is full width
- **sc-module-card (EJN-0):**
  - new `slot="footer"`
  - narrow headers wrap instead of splitting Arabic words

### Forms (page p-8-0, verification after the forms agent's own pass)

- **sc-date-range:**
  - the arrow is 12 from each value
  - the calendar button is 6 from the edge
  - day numbers are title-small
  - the preset check sits 8 from its label
  - footer buttons are 12 apart
  - in the sheet: presets 12 apart, the grabber 36 × 4 in outline-variant, the heading title-medium
- **Everything else** matches. The W11 items were left as they are.
- **Playground pages:** labels on `sc-checkbox`, `sc-radio` and `sc-button` were empty, because `data-ar` on the host broke slot relocation.

### Across the library

- **W12:**
  - Every light-DOM stylesheet starts with `@layer sc.reset, sc.tokens, sc.base, sc.components, sc.utilities;`.
  - `check:literals` enforces it, and it also fails on a stray `*/`, which is how my first pass broke four stylesheets.
- **Icons (D13):**
  - Every icon is now Material Symbols, Outlined, weight 400, optical size 24, from `src/icons/icons.json`. Filled is used for status icons and the current navigation item.
  - Mirroring follows the foundations table.
  - `npm run icons` generates one module per component (`src/icons/for/<tag>.tsx`), and the bundler inlines it, so no shared icon chunk grows (W9).
  - The default leaf budget is back to 4,096 B and sc-button's to 5,120 B, and both pass. sc-step-progress no longer needs its 5 KiB override.
  - Trade-off: each component carries its own copy of the small SVG wrapper, so the typical page grew by about 1.6 KB. It already failed its 30 KB budget; that work belongs to the performance agent.
  - The checkbox tick stays a stroke, because it is drawn in with stroke-dashoffset.

## Board against code, kept in code (W5 type sizes and proposed APIs)

These follow decisions.md, the tokens or architecture §3.1. They are listed so the boards can be corrected in Wave 4.

- **Type sizes quoted on boards that don't match the type-role tokens (W5).**
  - Places:
    - back-link 556-0
    - link 4F1-0
    - skip-link
    - language-switch
    - pagination CQX-0
    - account-nav GAM-0
    - bottom-nav GH6-0
    - step-list
    - summary-list 7I7-0
    - table 98J-0, 990-0
    - hero CPB-0, CPL-0
    - tile D9N-0
    - attention card DWX-0
    - module card ENQ-0
    - date-range DDS-0
    - search CEZ-0
    - utility bar F07–F0F
    - announcement bar DZ6-0
    - site header DAU-0
  - Where the board draws Arabic in Medium, the code uses Bold (D12): breadcrumbs BHK-0, bottom nav.
- **Fills the role table maps from "channel-container" to `channel-subtle`.**
  - Places: chip 8ZA-0, service card 4Q1-0, tile D9K-0, module card ENM-0, service-card chip 4QB-0.
  - The step-list chip edge uses `channel-outline`, not the `palette-…-80` stand-in (W3).
- **Chips are 32px tall (Q-chips) where boards draw 30.**
- **The board shows an inset focus ring where U1 says outside:**
  - account-nav G9R-0
  - accordion F67-0
- **Light-DOM or child-element APIs proposed on boards, against architecture §3.1 or the code's existing API.**
  - sc-step-list: `sc-step`, 7W1-0
  - sc-notification-list: `sc-notification`, 8SH-0
  - sc-timeline: `sc-timeline-item`, ANR-0
  - sc-accordion: `sc-accordion-section`, FG9-0
  - sc-breadcrumbs: BJ0-0
  - sc-footer: FK9-0
  - sc-site-header: DVN-0
  - sc-pagination: `show-count`, CSP-0
  - sc-account-nav: `sign-out-href`, GD1-0
  - sc-bottom-nav: `search-href`, GIX-0
  - sc-step-progress: `variant`, 67O-0
  - sc-channel-network: `current`, G74-0
  - sc-utility-bar: `fold-at`, F5U-0
  - card part: 2UW-0
  - hero API: D03-0
  - attention card: EDS-0
  - module card: F1L-0
- **Boards that contradict themselves.**
  - The button's 48px secondary and tertiary specimens versus its anatomy table (27B-0).
  - Header lockup-to-nav: 48 in the drawing, 56 in the table (CX5-0 / DLY-0).
  - Breadcrumb separator: 8 versus 8 plus 4 (ATE-0 / AV5-0).
  - Account-nav dark note versus its specimen (GC2-0).
- **Off-scale values snapped to the space scale (foundations §4).**
  - Step-list padding 28 (7J3-0).
  - Gaps of 10 in the header and menu (CY1-0, EKT-0).
- **The 44px target rule.**
  - Error-summary link gap (3JJ-0).
  - Footer link spacing (FCK-0).
- **Compact margins of 16 on boards, 20 in foundations.**
  - Places: header, announcement bar.
- **The UAE PASS placeholder.**
  - The button is 56 tall (U3a), not 48 (CXW-0).
  - Its fingerprint glyph differs from the board's; the official kit replaces both.
