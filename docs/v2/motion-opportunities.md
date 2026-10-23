# Motion opportunities (v2 audit, 23 October 2026)

An audit of the v2 `sc-` library and its documentation site for places that should move and do not, and for existing motion that breaks our rules. Method: Emil Kowalski's `find-animation-opportunities` gate (frequency, purpose, speed, function), read through our own rules, which win: MOT-01 to MOT-15 ([Design System reference §8](../standard/design-system-reference.md#motion), [Service Standard](../standard/service-standard.md#cmp-motion)), the tokens in `tokens/motion.json`, R16 and `components/CONVENTIONS.md`.

**Scope.** Every component in `components/src/components/`, the CSS-only components in `components/src/global/components.css` (`sc-footer`, `sc-breadcrumbs`, `sc-official-banner`, `sc-environment-banner`), and the documentation site (`components/src/site/site.css`, `site.js`, `scripts/build-site.mjs`).

**Summary.** The library already moves where it should: popovers, menus, sheets, the dialog, the selection bar, the month change, press feedback on buttons, chips, tiles and pagination cells, and colour on hover. Most of what is left should stay still. The audit found two small gaps worth filling (three, with the user's U1), six places where existing motion breaks a rule or did not run at all, and one question for the user.

## 1. Candidates

Frequency uses the MOT-01 tiers: *many* (many times in a session, or from the keyboard), *often* (tens of times), *occasional*, *rare*. Purposes are the MOT-03 list: spatial, state, feedback, jarring (preventing a jarring jump). MOT-03 has no "delight", so anything whose only purpose is delight is rejected.

### 1.1 Do

| # | Component and moment | Frequency | Purpose | Motion | RTL | Reduced motion | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D1 | `sc-official-banner`, opening and closing "How to check" (`components.css`, the `details` rules) | Rare: once, if ever, per visitor | State (the chevron says open or closed) and jarring (the explanation pushes the page down at once) | Pointer only, the same as `sc-accordion`: the chevron turns 180° with `transform` over `--sc-duration-fast` and `--sc-easing-standard`; the explanation fades in with `opacity` over `--sc-duration-fast` and `--sc-easing-enter`. Closing is instant (the native `details` hides the panel). Height never animates (MOT-11). From the keyboard (`summary:focus-visible`) both are instant (MOT-02) | The turn is vertical, so it does not mirror | The turn is dropped; the fade stays | **Do.** Two disclosures in the system now behave alike. About 0.1 KiB on `sc.css` |
| D2 | Documentation site: the requirement lookup button on the home page (`site.css`, `.lookup__button`) | Rare | Feedback | `:active` (pointer and touch only, `:not(:focus-visible)`): `scale(var(--sc-scale-press))` over `--sc-duration-press` with `--sc-easing-enter`, as `sc-button` does (MOT-09) | None needed | `--sc-scale-press` is 1, so no scale | **Do.** The site's only filled button without press feedback |

### 1.2 Don't

| # | Component and moment | Frequency | Why not |
| --- | --- | --- | --- |
| X1 | `sc-table` sort | Many, often from the keyboard | MOT-01 and MOT-02. Rows reorder instantly (already the case) |
| X2 | `sc-pagination` page change, `sc-step-progress` step change | Many | They change with the page. Motion on a page load delays reading and has no MOT-03 purpose |
| X3 | `sc-filter-chips`, removing an applied chip | Often, often from the keyboard | MOT-02; component-language B18 decides it disappears at once and focus moves on |
| X4 | Field errors and `sc-error-summary` appearing | Occasional, but usually from Enter (submit) | MOT-02: an Enter submit is a keyboard action. Component-language A7 says a field error never animates in, and A16 that the summary appears with the page |
| X5 | `sc-callout` inserted after load | Occasional | It is usually the result of a keyboard submit (MOT-02), and the jump it causes is a height change, which a fade would not hide and which we may not animate (MOT-11) |
| X6 | Accordion and official-banner height (`::details-content`, `interpolate-size`) | Occasional | MOT-11: height is a layout property |
| X7 | Hover lift or shadow on cards (`sc-card`, `sc-service-card`, `sc-module-card`, `sc-attention-card`) | Often | Tens of hovers a day: colour only (MOT-01). Cards and list rows do not scale (component-language §1.6) |
| X8 | `sc-bottom-nav`, `sc-account-nav`, `sc-site-header` current indicator sliding between items | Many (navigation) | MOT-01; the specs say the bar does not slide |
| X9 | Staggered entrance of tile or card grids (`sc-tile`, `sc-service-card` on a channel home) | Many: every visit to a home page | Arrives with the page; decoration on functional UI. Stagger has no MOT-03 purpose here |
| X10 | `sc-empty-state`, the confirmation page | Rare | Their only purpose would be delight, which MOT-03 does not allow; "Rarely: standard motion, no more" (MOT-01), and they arrive with a page load |
| X11 | `sc-environment-banner` stripes | Every page | MOT-14: no moving decoration |
| X12 | `sc-channel-chip` with `href` press scale | Occasional | It is a link, not a control: links never scale (A19 says "Motion: none") |
| X13 | Documentation site: the side menu groups, the mobile "Menu" and the "On this page" disclosures | Often (every page on a phone) | MOT-01: tens of times in a reading session. Their chevrons turn instantly, which is right |
| X14 | Documentation site: page-to-page transitions (View Transitions) | Many | MOT-01; navigation is the most frequent action on the site |
| X15 | Documentation site: search results updating as you type | Many, from the keyboard | MOT-02 |

### 1.3 Decided by the user

| # | Component and moment | Frequency | Purpose | Proposed motion | Why it needs a decision |
| --- | --- | --- | --- | --- | --- |
| U1 | Icon buttons without press scale: the `sc-modal` close button, the `sc-site-header` menu and close buttons, the `sc-announcement-bar` dismiss, the `sc-date-range` month arrows and sheet close; found while implementing it, the `sc-date-range` calendar button and the `sc-site-header` search link (also a 44px icon button) | Occasional (date-range arrows: often) | Feedback | `:active:not(:focus-visible)`: `scale(var(--sc-scale-press))` over `--sc-duration-press`, `--sc-easing-enter`, as `sc-button` (MOT-09). Reduced motion: none (the token is 1) | MOT-09 says every pressable element gives press feedback, and the state grammar lists "buttons", but the per-component specs gave these buttons the 12% state layer only. **Decided (user, 23 October 2026): do.** Implemented; the specs now follow MOT-09 |

## 2. Existing motion that breaks a rule

| # | Where | Rule | What happens | Fix |
| --- | --- | --- | --- | --- |
| B1 | `sc-channel-switcher` and `sc-account-menu` trigger chevrons (`sc-channel-switcher.css`, `.sc-channel-switcher__chevron`; `sc-account-menu.css`, `.chevron`) | MOT-02, MOT-15 | The panel opens instantly from the keyboard, but the chevron still turns over 120ms, because `.focus-ring`'s `transition: none` applies to the trigger, not to the icon inside it. Under reduced motion the chevron still rotates | `transition: none` on the chevron while the trigger is `:focus-visible`, and under reduced motion |
| B2 | `sc-table` selection bar (`sc-table.css`, `.selection-bar--open`) | MOT-15 | The reduced-motion rule sets the end state to `transform: none`, which it already was; the `@starting-style` 8px rise still plays | Under reduced motion, the starting style has no transform either |
| B3 | `sc-table` selection bar | MOT-02 | Selecting a row with Space shows the bar with the 200ms rise; clearing it from the keyboard fades it out | The bar is instant when the change came from a checkbox that is `:focus-visible` |
| B4 | `sc-table` loading skeleton (`sc-table.css`, `.sc-table__bar`) | Tokens only; MOT-04 | `animation: sc-table-pulse 1.2s ease-in-out infinite alternate`: a literal duration (which `check:literals` does not catch) and the built-in ease-in-out on constant motion | A new token, `--sc-duration-pulse` (1200ms, 0ms under reduced motion), and `linear`, as for the spinner. MOT-12 already allows keyframes for the skeleton pulse |
| B6 | `sc-table` selection bar and `sc-date-range` popover, sheet and scrim (`@starting-style` in scoped components) | MOT-03 (the documented motion did not happen) | Found while testing B2 and B3, by sampling the bar frame by frame in Helium. Their entrances never played: Stencil's scoped styles add the scope class to every selector except those inside `@starting-style`, so the open rule (two classes) outweighed the starting rule (one class) and the starting style equalled the end state. The bar and the popover appeared at full opacity in one frame; only the exits faded. `sc-modal` (shadow DOM) was not affected | Each starting selector repeats a class, so it matches the open rule's weight and wins by order. The convention is now in `components/CONVENTIONS.md`, and the new tests listen for `transitionrun`, so a silent entrance fails |
| B5 | `sc-checkbox` and `sc-radio` marks (`sc-text-input/choice.css`, `.sc-choice__mark`, `.sc-check__path`) | MOT-04 | The check drawing in and the dot growing in are entrances, but use `--sc-easing-hover` (`ease`), the curve for hover and colour | `--sc-easing-enter` for the mark's `opacity`, `transform` and `stroke-dashoffset`. The fill, border and halo are colour changes and keep `ease` |

**Kept as they are, noted for the record:**

- `sc-accordion` fades its answer with a keyframe animation, where MOT-12 prefers transitions. A closed `details` does not render its content, so there is nothing to retarget: reopening starts from transparent either way. A section that is open in the markup also fades in once on load (120ms); harmless.
- The checkbox check is drawn with `stroke-dashoffset`, a paint property, not `transform` or `opacity` (MOT-11). It is an 18px SVG path, it is how a check is drawn, and the spec asks for it. It is the only paint-property animation in the library; MOT-11 could name it as an exception.
- The `sc-table` scroll-edge shadows fade over 120ms when the table scrolls. It is a short opacity cue, the "short colour change" MOT-01 allows at that frequency.
- `sc-accordion`'s turn and fade use 120ms where component-language B15 says 150ms; the spec records why (`duration-fast` is the micro-interaction token).

## 3. Verdict

The library needs very little more motion; it is close to right. The highest-leverage work is the fixes in section 2: B1 to B3 break the two rules services are assessed on (MOT-02 and MOT-15), and B6 means three documented entrances never played. D1 is the only new motion in the library, and it reuses the accordion's existing pattern. U1 was a question of consistency; the user chose to follow MOT-09.

## 4. Outcome

Implemented on branch `v2-motion`: D1, D2 and the fixes B1 to B6, with e2e tests in `sc-official-banner`, `sc-channel-switcher`, `sc-account-menu`, `sc-table`, `sc-date-range`, `sc-checkbox` and `sc-radio-group`. One token was added: `duration.pulse` (1200ms, 0ms under reduced motion). The per-component motion table in the Design System reference and the specs of the six components are updated.

No budget was raised. Measured gzip, before and after: `sc.css` 10,806 to 10,874 B (budget 11,264); custom-elements closures `sc-table` 10,611 to 10,664 B, `sc-channel-switcher` 6,871 to 6,919 B, `sc-account-menu` 6,852 to 6,891 B, `sc-checkbox` and `sc-radio` +3 B each, all within their budgets. The documentation site's stylesheet grows by about 0.06 KiB (3,809 B built, budget 6 KiB).

U1 was approved by the user and is implemented, with e2e tests in `sc-modal`, `sc-site-header`, `sc-announcement-bar` and `sc-date-range`.
