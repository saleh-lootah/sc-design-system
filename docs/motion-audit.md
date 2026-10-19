# Motion audit

Every animation and transition in the Shared Channels design system, checked against Emil Kowalski's skills ([github.com/emilkowalski/skills](https://github.com/emilkowalski/skills), commit `2d22863`): the `improve-animations` method (survey, prioritised audit, fixes), judged by `emil-design-eng`, `animate`, `review-animations/STANDARDS.md` and `animation-performance`. The rules that came out of it are in [components/CONVENTIONS.md](../components/CONVENTIONS.md#motion).

Scope: `tokens/motion.json`, `scripts/build-tokens.mjs` and every component in `components/src` on `main`. `sc-table` and `sc-date-range` are on another branch and were not changed here; see "Not covered".

## Survey

- **Stack.** StencilJS web components, plain CSS in shadow roots. No motion library, no JS-driven animation (`sc-error-summary` scrolls with `scrollIntoView({ block: 'center' })`, which is instant).
- **Where motion lives.** Tokens in `tokens/motion.json` become `--sc-duration-*` and `--sc-easing-*` in `dist/css/tokens.css` and Tailwind's `--ease-*` / `--duration-*`. One keyframe animation (`sc-spin` in `src/styles/shared.css`). Everything else is colour transitions on hover and press.
- **Personality.** Government services used by every resident: crisp and quiet, no bounce, no decorative motion.
- **Frequency.** Buttons, links, fields, checkboxes and service cards are hit tens of times a session (hover, press). The spinner appears during every submit. Nothing is opened from a keyboard shortcut.

## Findings, by leverage

| # | Severity | Category | Location | Finding | Fix |
| --- | --- | --- | --- | --- | --- |
| 1 | HIGH | Easing | `tokens/motion.json` `easing.exit` | Ease-in `[0.3, 0, 1, 1]`: starts slow at the moment the user is watching | Strong ease-out, paired with `duration.fast` |
| 2 | HIGH | Easing | `easing.enter`, `easing.standard` | Weak curves (`[0, 0, 0, 1]`, `[0.2, 0, 0, 1]`) | Strong custom curves from STANDARDS |
| 3 | HIGH | Accessibility | `scripts/build-tokens.mjs` reduced-motion block | Every duration became 0ms, removing colour and opacity feedback too | Only movement stops: `spin` 0ms, `scale.*` 1 |
| 4 | HIGH | Physicality | `sc-button`, `sc-service-card`, `sc-channel-chip`, `sc-back-link`, `sc-language-switch` | No press feedback beyond a colour change | `scale(0.97)` on pointer `:active`, 160ms ease-out |
| 5 | MEDIUM | Purpose | the same controls and `choice.css` | Space on a focused control ran the same transitions as a click | `transition: none` on `:focus-visible`; press scale skips `:focus-visible` |
| 6 | MEDIUM | Performance | `sc-service-card.css` | Hover animated `box-shadow`, repainting the card every frame | Two shadow-only pseudo-elements crossfade `opacity` |
| 7 | MEDIUM | Interruptibility | `sc-back-link.css`, `sc-language-switch.css` | The tint was a `linear-gradient` layer, which can't interpolate: the declared `background-color` transition never ran | Tint moved to a `::before` whose `background-color` transitions |
| 8 | MEDIUM | Accessibility | every `@media (hover: hover)`; `sc-footer`, `sc-summary-list` ungated | Hover could stick after a tap on hybrid devices | `@media (hover: hover) and (pointer: fine)` everywhere |
| 9 | MEDIUM | Easing | every component transition | Hover and colour changes used `easing.standard` | New `easing.hover` (`ease`) |
| 10 | LOW | Perceived speed | `duration.spin` | 800ms per turn | 600ms |
| 11 | LOW | Cohesion | `tokens/motion.json` | No token for press duration or scale, so each component would hand-type 160ms and 0.97 | `duration.press`, `scale.press`, `scale.enter` |

Already right, left alone: the spinner uses keyframes with `linear` (constant motion, the one place keyframes belong) and stops under reduced motion with its label shown; field focus rings and error states appear instantly; text links change colour only and don't scale; the drawer curve `[0.32, 0.72, 0, 1]` matches STANDARDS.

## Before and after

| Before | After | Why |
| --- | --- | --- |
| `easing.exit: cubic-bezier(0.3, 0, 1, 1)` | `cubic-bezier(0.23, 1, 0.32, 1)` with `duration.fast` | Never ease-in on UI; exits are quick ease-out and faster than entrances |
| `easing.enter: cubic-bezier(0, 0, 0, 1)` | `cubic-bezier(0.23, 1, 0.32, 1)` | Entering uses a strong ease-out; built-in-strength curves lack punch |
| `easing.standard: cubic-bezier(0.2, 0, 0, 1)` | `cubic-bezier(0.77, 0, 0.175, 1)` | Moving or morphing on screen uses a strong ease-in-out |
| No hover curve; colour changes used `standard` | `easing.hover: cubic-bezier(0.25, 0.1, 0.25, 1)` (`ease`) on every colour transition | Hover and colour changes use `ease` |
| `easing.drawer: cubic-bezier(0.32, 0.72, 0, 1)` | Unchanged | It is the iOS-like drawer curve in STANDARDS |
| `duration.spin: 800ms` | `600ms` | A faster spinner makes loading feel faster |
| `duration.slow: 320ms`, no stated use | `320ms`, modals, drawers and sheets only | UI stays under 300ms; modals and drawers may take 200–500ms |
| No press duration | `duration.press: 160ms` | Press feedback is `transform 160ms ease-out` |
| `@media (prefers-reduced-motion: reduce) { every --sc-duration-*: 0ms }` | Only `--sc-duration-spin: 0ms`, `--sc-scale-press: 1`, `--sc-scale-enter: 1` | Reduced motion means fewer and gentler animations, not zero: keep opacity and colour, drop movement |
| Tailwind `--default-transition-timing-function: var(--sc-easing-standard)` | `var(--sc-easing-enter)` | The default easing is ease-out |
| `sc-button` `.control:active` colour only | `.control:active:not(:focus-visible, :disabled, [aria-disabled='true'], .is-loading) { transform: scale(var(--sc-scale-press)); }` | Buttons must feel responsive to press |
| `sc-button` `transition: background-color, color` (standard) | `background-color 120ms ease, color 120ms ease, transform 160ms ease-out`; `transition: none` on `:focus-visible` | Exact properties; keyboard-initiated actions don't animate |
| `sc-service-card` `transition: box-shadow` to `elevation-3` on hover | `::before` (`elevation-1`) and `::after` (`elevation-3`) crossfade `opacity` | Animate composited properties; a shadow repaints every frame |
| `sc-service-card` no press feedback | `.card:active:not(:has(.link:focus-visible)) { transform: scale(var(--sc-scale-press)); }` | Cards are pressable; keyboard activation stays instant |
| `sc-channel-chip` link: colour on `:active` | Adds `scale(var(--sc-scale-press))` on pointer press | Chips are pressable |
| `sc-back-link`, `sc-language-switch`: `background: linear-gradient(var(--_tint)…)` with a `background-color` transition that never fired | Tint on `.control::before` with `background-color 120ms ease`; press scale | A gradient can't interpolate; the hover change now actually transitions |
| `choice.css` fill and tick fade on Space | `.box:focus-visible, .box:focus-visible + .mark { transition: none; }` | Never animate keyboard-initiated actions |
| `@media (hover: hover)` | `@media (hover: hover) and (pointer: fine)` | Touch fires false hovers on tap |
| `sc-footer`, `sc-summary-list` `.link:hover` outside any media query | Wrapped in `@media (hover: hover) and (pointer: fine)` | Same |

## Missed opportunities (not done)

- **Error summary arrival.** `sc-error-summary` appears and takes focus after a failed submit. It is keyboard- and submit-initiated, so it stays instant: correct as it is.
- **Popovers and dropdowns.** None exist on `main` yet. When they do, they enter with `opacity: 0; transform: scale(var(--sc-scale-enter))` → `1`, `--sc-duration-base` and `--sc-easing-enter`, scale from the trigger, and leave with `--sc-duration-fast` and `--sc-easing-exit`.

## Not covered

`sc-table` and `sc-date-range` are being built on `feat/sc-table-date-range` and were not touched. When that branch merges on top of this one:

- `tokens/motion.json` will conflict where both branches add `easing.drawer`; keep this branch's version (same value, new description).
- Their transitions that use `ease` for hover should move to `var(--sc-easing-hover)`, and colour transitions that use `--sc-easing-standard` should too (`standard` is now a strong ease-in-out for movement).
- Their reduced-motion guards already drop transforms, which is what the new token behaviour expects; durations no longer become 0ms globally, so any movement without its own guard will now run.
- Day cells should take the press scale; the skeleton pulse (1.2s ease-in-out alternate) is constant motion and is fine, static under reduced motion.
- `components/specs/sc-date-range.md` line 239 flags `easing.exit` as ease-in; that is now fixed.
