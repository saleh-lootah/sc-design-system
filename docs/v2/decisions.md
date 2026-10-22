# v2 decisions

This file records the open questions raised in Wave 1 by `foundations.md` (D1–D15) and `component-language.md`.
- Entries marked **user** were decided by the user on 21 October 2026.
- Entries marked **coordinator** were decided from the user's standing preferences and the plan. The user can overturn any of them.

Where this file disagrees with `foundations.md` or `component-language.md`, this file wins.

## Decided by the user

| # | Question | Decision |
| --- | --- | --- |
| U1 | Focus ring colour | **Neutral.** It is neutral-10 in light mode and white in dark mode: 3px, with a 2px offset. Inside a filled area the ring takes that area's "on" colour. It is the same on every channel. This replaces Standard 2.0 A11Y-05, and S1 updates the standard. |
| U2 | Stepper completed steps | **Channel colour.** Completed and current markers use the channel action colour, and completed markers carry a check icon. Green stays reserved for genuine success messages. |
| U3 | UAE PASS and Dubai Pay buttons | **City indigo.** Shared government hand-offs (sign in with UAE PASS, pay with Dubai Pay) use `primary` (city indigo) on every channel, so they never look like a channel's own action. Provider artwork can come later if the brand owners require it. |
| U4 | Phase 1 bottom utility bar | **Kept, docked and flat.** It is a flat bar at elevation 1, fixed to the bottom edge, with a top hairline in outline-variant. The page reserves its height so nothing is covered. On mobile it folds into the footer. It is not a floating pill. |

## Decided by the coordinator

| # | Question | Decision |
| --- | --- | --- |
| D1 | City indigo tone | **Tone 30** (9.35:1 on white), as F1 proposed. |
| D2 | Secondary palette | **None.** The channels carry all the colour. |
| D3 | Neutral hue | **Re-hued toward indigo (275°).** This removes E's faint teal lean, in line with the standing ban on teal. |
| D4 | Dubai Trade action tone | **Tone 35**, as E drew it. Add a lighter accent role for Trade only if a component needs one. |
| D5 | Leading | **Tighter than E** (body 18/26 EN, 20/32 AR), following the user's standing preference for Dubai Font. |
| D6 | Secondary text | **Neutral-40** (6.46:1). |
| D7 | Dark-mode text | **Pure white.** |
| D8 | Visited links | **Not styled differently.** A visited link is not a task-progress signal on these sites. Revisit if research shows a need. |
| D9 | `light-dark()` | **Accepted** if F3 confirms the browser support target. Otherwise F3 specifies the fallback. |
| D10 | Info colour | **Shares Dubai Now's blue hue.** Info is always paired with an icon, so the two are never confused. |
| D11 | Decorative tints | **Keep the six hues**, as tints only (tones 95 and 40; the on-tint text was moved from 30 to 40 in the tokens). |
| D12 | Arabic weight | **Short Arabic UI text uses Bold** where English uses Medium. |
| D13 | Icons | **Material Symbols Outlined** as inline SVG, with Filled versions for status and selected states. |
| D14 | Focus ring | See U1. |
| D15 | Branch names | `v2-<area>`, since git won't create `v2/…` while a branch called `v2` exists. |
| Q-chips | Chip height | Chips are 32px tall, but the hit area grows to 44px with an invisible extension (the A11Y-04 pattern). Interactive suggestion chips are 40px with the same extension. |
| Q-footer | Footer Channels group | **Allowed.** The footer lists all seven channels, plus the required links. This relaxes v1's "not a sitemap" rule for this group only. |
| Q-headline | Type sizes where E0 and E1 disagree | The **E0 type section is canonical**. E1 is a page that may have been tuned. |
| Q-header | Header contents | Use the Dubai Now reference structure, which carries the Phase 1 precedent: Government of Dubai lockup at the start; nav; search; language; sign in (city indigo, per U3); channel logo and switcher at the end. Apply E1's visual style (flat white bar, current item underlined in the channel colour). |
| Q-hero | Hero | **Flat channel-subtle (tone 95).** No gradient wash. |
| Q-names | Component names | Keep v1 tag names where the role is unchanged. New components use the names in component-language.md part B. `sc-step-list` and `sc-channel-network` are approved. |
| Q-conformance | library-conformance.md | It is at `docs/library-conformance.md` on the `v2` branch. |
| Q-standard | Stale motion notes in Standard 2.0 §8.7 | S1 updates them to the current tokens (`duration-slow` is **280ms**, which is inside the 200–300ms rule; exit easing is ease-out). |

## Architecture (F3) · decided by the coordinator

| # | Question | Decision |
| --- | --- | --- |
| A1 | Browser floor | The **last two major versions** of each evergreen browser. `light-dark()` is the primary mechanism, and the token build **also emits a `prefers-color-scheme` / `[data-theme]` fallback** so iOS 16 and Safari before 17.5 still get dark mode. It costs a few hundred bytes. |
| A2 | Light DOM (Stencil `scoped`) for form fields and `sc-button` | **Yes.** This fixes Enter-to-submit and makes `sc-button` usable as the default button (WCAG 3.2.2 and expected form behaviour). Losing `::part()` on these components is accepted and documented in the migration note. |
| A3 | Dubai W23 Light weight | **Dropped.** No role uses it. |
| A4 | Links in running text | **Add a CSS-only `.sc-link` class** beside the `sc-link` component. |
| A5 | CI scope | Lint, spec and the build run on every push. e2e, axe, screenshots, the budget check and runtime run on PRs to `v2` and `main`, and on pushes to `main`. |

## Role names · component-language.md to tokens

`component-language.md` was written in parallel with the tokens and uses some different role names. **Components use the token names below (`--sc-color-…`).** Read every colour role in `component-language.md` through this table.

| component-language.md role | Token to use | Note |
| --- | --- | --- |
| `surface` | `surface` (`surface-card` for cards) | |
| `surface-container-low` | `surface-container` | Neutral-96 |
| `surface-container-high` | `surface-container-high` | |
| `surface-disabled` / `on-surface-disabled` | `disabled-container` / `on-disabled` | |
| `on-surface` | `on-surface` | |
| `on-surface-variant`, `on-surface-muted` | `on-surface-variant` | Both are neutral-40 (D6) |
| `outline` | `outline` | The 1.5px control edge |
| `outline-strong` | `outline-strong` | **New token**, added by C0: neutral-10 in light, neutral-90 in dark. For hovered control edges, the sign-in edge and the plate chip |
| `outline-variant` (decorative connectors, popover edges) and `divider` | `outline-variant` | Neutral-90. Dividers, decorative connectors and popover edges. Never a control edge |
| `state-hover` | State layer: `on-surface` at `opacity-hover` (8%), pressed at 12% | |
| `inverse-surface` / `on-inverse-surface` | `inverse-surface` / `inverse-on-surface` | |
| `scrim`, `focus-ring` | `scrim`, `focus-ring` (the gap uses the surface behind it) | |
| `channel-action` / `on-channel-action` | `channel-action` / `channel-on-action` | |
| `channel-action-hover` / `-pressed` | `channel-action-hover` / `-pressed` | |
| **`channel-container` (channel-95)** | **`channel-subtle`** | Hero (Q-hero), current network tile, selected rows, unread rows, applied filter chips, the selection bar |
| **`channel-container-high` (channel-90)** | **`channel-container`** with `channel-on-container` | Mobile step halo, tags, secondary pressed, the bottom-nav indicator |
| `channel-outline` | `channel-outline` | **New token**, added by C0: channel-80 in light, channel-40 in dark. For the 1px edges on suggestion chips and outlined channel chips |
| `channel-accent` | `channel-action` | |
| `city-action` / `on-city-action` | `primary` / `on-primary` | U3 hand-offs, the network eyebrow |
| `city-container` / `city-container-high` | `primary-subtle` / `primary-container` | |
| `{tone}`, `on-{tone}`, `{tone}-container` | The same names | Error, success, warning, info |
| `{tone}-outline-variant` | `outline-variant` | |
| `shadow-2` (popovers, menus) / `shadow-3` (modals, sheets) | `elevation-2` | Sticky bars and the utility bar use `elevation-1` (U4) |

## Government of Dubai lockup

| # | Decision |
| --- | --- |
| L1 | The official lockup comes from The Executive Council website and is stored **outside the repository**, at `/Users/saleh/Developer/Claude Workspace/sc-ux-standards/brand/government-of-dubai-lockup.svg` (see that folder's README). It is never committed to the public repo or published on GitHub Pages until the initiative has the usage manual or approval required by Law No. (1) of 2025. |
| L2 | The library ships **no logo**. `sc-site-header` takes the lockup through a `lockup` slot. Public playground pages use a neutral placeholder of the same proportions (680.84 × 274.11, emblem at the inline-end of the wordmark), labelled "Government of Dubai lockup". |
| L3 | Paper boards may place the real lockup, since the Paper files aren't public. Use it as supplied: no recolouring, mirroring, cropping or colour conversion. Its own fills are exempt from the OKLAB rule. The lockup is not mirrored in Arabic. |
| L4 | Still to get from the Executive Council: clear space, minimum size, the dark-background version and the link target. Until then: minimum height 40px in the header, clear space equal to the height of the wordmark's cap "G", and on dark surfaces the lockup sits on a white plate. |

## Wave 2b clarifications

| # | Decision |
| --- | --- |
| W1 | The `sc-error-summary` Arabic heading is **"توجد مشكلة"** ("There is a problem", GOV.UK wording), not "يوجد خطأ". |
| W2 | `--sc-duration-slow` is 280ms everywhere. Paper boards and specs quote 280ms. |
| W3 | `outline-strong` and `channel-outline` (per channel, with `-dark`) are now in the v2 Paper file. Replace any `--sc-palette-<ch>-80` stand-ins with `--sc-color-channel-<ch>-outline`. |
| W4 | Status tags in channel colour use `channel-subtle` (95) as the fill and `channel-action` as the text. Tags that need more weight (for example, on a subtle background) use `channel-container` (90). |

## UAE PASS button (supersedes U3 for UAE PASS)

| # | Decision |
| --- | --- |
| U3a | **UAE PASS has its own standard button specification, and we follow it exactly.** "Sign in with UAE PASS" (and any "confirm with UAE PASS") uses the official UAE PASS button: its colours, fingerprint mark, label in English and Arabic, sizes, variants and dark-mode treatment. It is a brand exception: we don't restyle it, recolour it to the channel or to city indigo, or swap in our own icon. The user is supplying the official component set (DubaiNow Next has an adapted version, exception X-07, which is not the source). Until the specification arrives, components and boards use a clearly labelled placeholder: black fill, white label "Sign in with UAE PASS", a fingerprint glyph, 56px tall. It is a separate `sc-uaepass-button` (or a `uaepass` variant of `sc-button` that can't be themed), with the exact geometry to be set from the kit. |
| U3b | **Dubai Pay and other shared hand-offs** keep U3: `sc-button` variant `handoff` in city indigo, unless Dubai Pay also has a mandated button. Ask before building one. |

## Wave 2b clarifications, continued

| # | Decision |
| --- | --- |
| W5 | Where `component-language.md` quotes a type size or leading that differs from the type role tokens (for example title-large 22/28, display-large 80/84, body-large 18/26), **the tokens win**. Components use type roles only. `component-language.md` sizes are indicative. |
| W6 | The life-event, category and favourite tile is **`sc-tile`**, not `sc-service-tile`. Paper board 09.07 is renamed in Wave 4 (Q4). |
| W7 | The `sc.css` budget is **9 KiB gzip** (raised from 7 KiB). The `:not(:defined)` pre-upgrade size reservations stay for every component, because CLS 0 on the typical page matters more than 2 KiB. |
| W8 | `sc-account-nav` has a **4.5 KiB** budget override. Its closure includes the shared locale controller and the destinations icon chunk, which every page pays for once. Its own module stays under 4 KiB. |
| W9 | **Interim**: the default leaf budget is 4,224 B (from 4,096), and `sc-button` is 5,248 B. Both went over because the shared icon chunk (`src/icons/index.tsx`, 1.1 KiB) grew with the feedback icons. The icon pass (Material Symbols, D13) must split icons so each component pays only for the ones it uses, then **restore the 4,096 B leaf budget and sc-button's 5,120 B**. |
| W10 | Budget overrides approved: **`sc-date-range` 21 KiB** (a full calendar, loaded only on pages that use it; its own module is 15.6 KiB) and **`sc-search` 8 KiB** (its closure includes `sc-button`). |
| W11 | Forms: the code is right and the boards on page p-8-0 get corrected in Wave 4. The **legend uses label-large** (the boards disagree with each other). **Applied filter chips are 32px**, with a 44px target (Q-chips). **sc-date-range keeps Clear and Apply.** **sc-textarea keeps "You have N characters remaining"**. The error bar is 4px, using `size-strip`. |
| W12 | **Cascade layer order.** Every light-DOM component stylesheet starts with the full order statement `@layer sc.reset, sc.tokens, sc.base, sc.components, sc.utilities;`. Stencil can insert a component's styles before `sc.css`, and without this the base focus outline outranks component rules. `check:literals` enforces it. |
| U5 | **Attention cards have no coloured top strip** (user, 22 October 2026). Topic colour appears only on the small icon tile. This supersedes the colour guidance's strip. |
| W13 | The typical page's **component CSS budget is 4 KiB** (from 3 KiB). It holds nine components' own layout, state, forced-colours and RTL rules, and the type roles are already shared. Typical page JS stays at 30 KiB. |
| W4a | Clarifies W4: `sc-status-tag tone="channel"` is a **non-status highlight** (for example "Life event"), with `channel-action` text on `channel-subtle`. It never carries a status. Status uses the semantic tones (neutral, info, success, warning, error). Labels about *another* channel use `sc-channel-chip`. |
| W14 | `sc-bottom-nav` has a **4.5 KiB** budget override: Outlined and Filled Material Symbols paths for 8 destinations. |
| W15 | **Process:** agents working in worktrees must **not use `git stash`**. The stash is shared across worktrees. Commit work in progress on your own branch instead. |

## Alignment report decisions (docs/v2/alignment-report.md §1)

| # | Item | Decision |
| --- | --- | --- |
| W16 | Attention card strip | Removed (U5, user). |
| W17 | Notification list rows | **Keep the code: the whole item is one link.** It gives a larger target and a single tab stop per item. The board (8J7-0) is corrected in Wave 4. |
| W18 | Bottom-nav budget | Approved, 4.5 KiB (W14). |
| W19 | Focus ring at a screen edge | **Accessibility wins: the ring is inset** wherever an outset ring would be clipped (bottom nav and other edge-docked bars). Correct the board (GG4-0). |
| W20 | Callout accent | **4px `size-strip`**, the same as the field error bar (W11), so the library has one start-bar width. `size-border-accent` (3px) stays only for outlines that need it. |
| W21 | Modal motion | **Centred dialog: 200ms enter, 160ms exit.** Bottom sheet: 280ms (`duration-slow`) enter, about 224ms exit. Both sit inside the 200–300ms modal and drawer rule, with exits about 20% faster. |
| W22 | Date input value | **Keep the code: centred tabular figures** in each part box (v1 behaviour). Correct the board. |
| W23 | Utility bar shadow | **No upward shadow.** The docked bar is flat with a 1px `outline-variant` top hairline (U4). No new token. |
| W24 | Arabic wording | **The code is right**: «مؤشر السعادة» (the official Happiness Meter name), «المحادثة», «المعلومات القانونية», and «عرض 1 إلى 20 من 1,284» (LANG-22A). Correct the boards. |
| W25 | Account menu items | **Keep the code**: profile, settings, "change who you act for" and sign out, with notifications as their own bell. Applications and payments live in `sc-account-nav`, so they aren't duplicated in the menu. |
| W26 | Tags the boards ask for (`sc-plate`, `sc-icon-tile`, general `sc-chip`) | **Build in Wave 3, when the Dubai Now reference needs them.** `sc-plate` (number plate) will be needed. |

## Standard review decisions (user, 22 October 2026)

| # | Decision |
| --- | --- |
| R1 | **Consultation draft.** The standard is issued as a draft for consultation with channel owners and entities. It becomes binding when an authority adopts it. The issuing authority stays an open question. |
| R2 | **Split into three documents:** (1) a short **Service Standard**, with only the assessed requirements, published in Arabic and English; (2) a **Design System reference**, covering tokens, components, motion and budgets, versioned with the library and not assessed; (3) an **Assurance handbook**, covering panels, evidence, templates and exceptions. |
| R3 | **Neutral public wording.** The public documents don't name or ban the Dubai Design System teal: they say channel colours are set centrally in the token files. The teal ban stays as an internal design-system rule (check:teal). The motion rules stay, and their source is credited in the bibliography of the Design System reference, not in the body. |
| R4 | **Marketing is allowed** on Visit Dubai and Invest in Dubai (and any channel whose purpose includes promotion), inside defined template slots, without changing fixed chrome or the behaviour of transactions. |
| R5 | **Kept as is:** entity logos stay banned (attribution is text only); the status vocabulary stays closed to the five tones; UAE PASS and Dubai Pay stay the only identity and payment routes. |

## Coordinator decisions from the review (review/0-summary.md, section B)

| # | Decision |
| --- | --- |
| R6 | **Links:** running-text links are always underlined. Navigation links (header nav, footer, breadcrumbs, cards, tiles, chips, skip link) may underline on hover only, provided another cue (position, a heading or an icon) identifies them as links. CMP-08 says this. |
| R7 | **Session timeout:** Escape means "stay signed in" (the safe default); the `alert` modal can't be dragged or dismissed by tapping the scrim; it has `aria-describedby`; the warning appears at least 2 minutes before expiry. |
| R8 | **Dismissed announcements** are remembered in `sessionStorage` only, before consent (PRV-12). |
| R9 | **Pasted input:** text and number fields strip bidi control characters (U+200E, U+200F, U+202A–U+202E, U+2066–U+2069) from pasted values. This amends LANG-21. |
| R10 | **Current-item cue:** current navigation items carry a non-weight cue (an indicator bar or underline) as well as Bold, because short Arabic text is already Bold. |
| R11 | **Utility bar at short heights:** below a viewport height of 600px (or at high zoom), the docked utility bar becomes static at the end of the page (WCAG 2.4.11 and 1.4.10). |

## Official Arabic channel names (user, 22 October 2026)

| # | Decision |
| --- | --- |
| R12 | **Official Arabic channel names:** دبي الآن (Dubai Now), مواصلات دبي (Dubai Transport), زوروا دبي (Visit Dubai), دبي للعدالة (Dubai Justice), دبي للبناء (Build in Dubai), استثمر في دبي (Invest in Dubai), دبي التجارية (Dubai Trade). They replace عدالة دبي and ابنِ في دبي, and close review item A7. `components/src/i18n/components/channel-names.ts` is the source; `sc-channel-chip` and `sc-step-list` copies must match it. |

## Coordinator decisions on the restructured standard (delegated by the user, 22 October 2026)

| # | Decision |
| --- | --- |
| R13 | **Service Standard length:** kept at about 1,550 lines. The journey patterns stay in it: they are what the critics valued most, and services are assessed on them. "The standard on a page", the must-pass list and the requirement index give readers the short route. |
| R14 | **Policy proposals stay proposals.** Scope by owner type (OQ-36), the transition deadlines (OQ-37), the assessment model, exception approvals, the 18-month support period and the entity sign-off limit (OQ-39) are published as questions for consultation, not settled policy. The issuing authority decides them after consultation. |
| R15 | **Arabic editions:** deferred for now (user, 22 October 2026). The Service Standard's Arabic edition is written before publication, so both are released on the same day (R2). The Design System reference and the Assurance handbook stay English-only for now, because their readers are delivery teams and assessors; their Arabic editions are reconsidered after consultation. |
| R16 | **Keyboard-opened sheets are instant:** the `sc-date-range` bottom sheet, like the popover (B10), appears without the slide when opened from the keyboard (MOT-02). Pointer and touch opening keep the motion. |
| R17 | **Showcase allowance:** a documentation-site page may exceed the page budgets by the approved overrides of the components it demonstrates (for example `sc-date-range`, `sc-table`). Service pages get no such allowance. |
| R18 | **Mixed-script font budget:** 110 KiB for pages that set text in both scripts (an Arabic page around an English document, or an English page with Arabic examples). Single-script budgets are unchanged (EN 75 KiB, AR 100 KiB). |
| R19 | **The `handoff` variant's examples use Dubai Pay (U3b).** "Sign in with UAE PASS" is never shown as a `handoff` button: it uses the official UAE PASS button (U3a) once the kit is supplied. |
| R20 | **Navigation budgets get 64 B of platform headroom (W14a):** `sc-account-nav` and `sc-bottom-nav` move from 4,608 B to 4,672 B. The Linux CI build of `sc-account-nav` measures 4,624 B against 4,595 B on macOS, with the same source. Budgets are enforced on CI. |
| R21 | **Site chrome allowance:** documentation-site pages may also use the approved overrides of the site chrome they carry (`sc-site-header` +3.5 KiB, `sc-footer` +2 KiB), on top of R17. Service pages get no new allowance. Finding for Wave 4: header, footer and breadcrumbs alone come to about 29 KiB of the 30 KiB page budget. |
| R22 | **Site showcase tooling:** on documentation-site component pages, `sc-channel-switcher` counts as showcase tooling under R17. On `/search/`, `sc-search` counts as the page's own component, with its approved 4 KiB override. Documentation site only; to be tightened once `sc-footer` and `sc-breadcrumbs` need no JavaScript. |
| R23 | **sc.css budget 10 KiB (amends W7):** `globalCssGzip` rises from 9 KiB to 10,240 B, because `sc-footer` and `sc-breadcrumbs` become CSS-only and the pre-upgrade reservations move into `sc.css`. That adds about 0.85 KiB of cached CSS and saves about 6 KiB of JavaScript on every page that has a footer and breadcrumbs. One stylesheet stays the rule; no separate chrome stylesheet. |

## Official banner and environment banner (user request, 22 October 2026)

| # | Decision |
| --- | --- |
| R24 | **Proposed, waiting for the user's approval.** `sc-official-banner` (CHR-12) and `sc-environment-banner` (CHR-13) are CSS only, like `sc-footer`: the official banner is a native `<details>`, so it works with scripting off and costs no JavaScript on any page. Their rules add about 0.7 KiB to `sc.css` (10.55 KiB measured), so `globalCssGzip` would rise from 10 KiB to 11 KiB (11,264 B), amending R23. The alternative, shadow-DOM components, would cost about 2 to 3 KiB of JavaScript on every page and show nothing without it. |
| R25 | **The address wording is open (OQ-40).** The banner's "Official websites use .gov.ae" is a placeholder until the initiative confirms which addresses it may name as official; some Dubai government entities use other `.ae` addresses. |

