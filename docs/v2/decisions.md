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
| Q-standard | Stale motion notes in Standard 2.0 §8.7 | S1 updates them to the current tokens (`duration-slow` 300ms; exit easing is ease-out). |

## Architecture (F3) · decided by the coordinator

| # | Question | Decision |
| --- | --- | --- |
| A1 | Browser floor | The **last two major versions** of each evergreen browser. `light-dark()` is the primary mechanism, and the token build **also emits a `prefers-color-scheme` / `[data-theme]` fallback** so iOS 16 and Safari before 17.5 still get dark mode. It costs a few hundred bytes. |
| A2 | Light DOM (Stencil `scoped`) for form fields and `sc-button` | **Yes.** This fixes Enter-to-submit and makes `sc-button` usable as the default button (WCAG 3.2.2 and expected form behaviour). Losing `::part()` on these components is accepted and documented in the migration note. |
| A3 | Dubai W23 Light weight | **Dropped.** No role uses it. |
| A4 | Links in running text | **Add a CSS-only `.sc-link` class** beside the `sc-link` component. |
| A5 | CI scope | Lint, spec and the build run on every push. e2e, axe, screenshots, the budget check and runtime run on PRs to `v2` and `main`, and on pushes to `main`. |
