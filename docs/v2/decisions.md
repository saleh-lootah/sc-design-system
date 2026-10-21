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
| D11 | Decorative tints | **Keep the six hues**, as tints only (tones 95 and 30). |
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
