# Shared Channels UX Standard: changes from 1.0 to 2.0

This log maps each item in the review of version 1.0 (`ux-standard-review.md`) to where version 2.0 (`shared-channels-ux-standard.md`, 19 October 2026) resolves it. Section numbers refer to version 2.0. "Open" means the standard does not assert the fact and lists it as an open question (OQ) instead.

Summary: 53 of the 56 findings are resolved in the text. 3 are resolved in the text but depend on confirmations that only owners or counsel can give, so their substance stays open: finding 20 (legal instruments), finding 40 (brand styling) and finding 41 (provider button wording). All 23 decision contradictions and all 28 GOV.UK gaps are addressed; the keep list (review section 5) is carried over as noted below.

## Findings

| # | Resolution | Where |
| --- | --- | --- |
| 1 | Resolved. shadcn/ui, React, Radix, Base UI and Sonner removed. The library is described as StencilJS web components with the `sc-` prefix, framework-agnostic, no runtime dependency, wrappers later. Every pattern names real `sc-` components | 0.4, 10.1, 10.2, 13 |
| 2 | Resolved. Channel theming contract: one `data-channel` per page, channel roles only, entities get attribution text only and supply no colours, fonts, radii or header logos | 3.2 (SVC-01 to SVC-03), 8.1 |
| 3 | Resolved. Hex palette deleted. Colours given by token name with OKLAB values; OKLAB-only and no-teal rules are MUSTs, with `check:no-hex`, `check:teal`, `check:contrast` | 8.1 (FND-03 to FND-05) |
| 4 | Resolved. Dubai Font only; separate Latin and Arabic scales from `typography.json` with sizes, leading and weights; tight leading; 1.4.12 tested instead of a 1.6 minimum; no entity font choice | 8.2 (FND-10 to FND-13), 5.7 |
| 5 | Resolved. Focus ring from `CONVENTIONS.md` (3px channel action, 2px surface offset, `:focus-visible`), 3:1 contrast requirement, forced-colours fallback. Pipeline coverage of the ring is OQ-26 | 6.2 (A11Y-05) |
| 6 | Resolved. Light and dark themes both required, with the same checks | 8.1 (FND-08, FND-09), 6.2 (A11Y-07) |
| 7 | Resolved. Latin-digit output rule in both languages, isolation, and input normalisation | 5.5 (LANG-20 to LANG-23), 5.4 |
| 8 | Resolved. Platform chapter from `MOBILE.md`: Flutter and React Native named, kits and Dart/TS tokens marked as later phase, interim rules and parity checklist | 7 (PLAT-01 to PLAT-12), OQ-17 |
| 9 | Resolved. MUST/SHOULD/MAY defined once; requirements rewritten as testable statements with identifiers; hedging words removed (remaining uses of "approved" and "verified" describe real states, such as an approved application) | 0.3, throughout |
| 10 | Resolved. Every chapter ends with "How we check"; evidence per assessment phase and met / not met outcomes | Each chapter, 17.2 |
| 11 | Resolved. Boilerplate component specs dropped. The standard indexes components with when to use and when not to use, and points to each component readme as the specification (API, states, Arabic behaviour) | 10.2 |
| 12 | Resolved. Each topic has one home; other sections link to it. Session timeout in 13.10, check answers in 11.4 and 13.11, UAE PASS in 13.4, Dubai Pay in 13.12, language switching in 5.2, catalogue record in 3.4 and Appendix B | 0.3, throughout |
| 13 | Resolved. One bilingual status vocabulary for applications, tasks, payments and refunds, each mapped to an `sc-status-tag` tone and a business state | 9.6 |
| 14 | Resolved. Language switch labelled with the other language's own name; the wrong example removed | 5.2 (LANG-05) |
| 15 | Resolved. The repeated disclaimer removed; Arabic review is a release requirement recorded once per release | 9.3 (CNT-16) |
| 16 | Resolved. Arabic content style: plain MSA, no dialect, gender-neutral address (verbal nouns, "يُرجى" + verbal noun, "يمكنك", passives), punctuation, transliteration, glossary ownership. Examples rewritten to follow it | 9.3, 9.5 |
| 17 | Resolved. Arabic typography: Arabic roles, no letter-spacing, 16px minimum, no italics, no justification or tatweel, no text-transform, mixed-script rule, diacritics, reading width | 5.7 (LANG-25 to LANG-33) |
| 18 | Resolved. One chapter for direction, bidi (`sc-ltr`, `<bdi>`, U+2066–U+2069), numerals and a mirror / do-not-mirror table covering icons, chevrons, media controls, numerals and charts | 5.3 to 5.6 |
| 19 | Resolved. Drafting artefacts, defensive UK framing and SC-004 removed; authority stated once; normal bibliography | 0.1, Appendix E |
| 20 | Partly open. Legal chapter states what every service needs regardless (LEG-01 to LEG-04) and uses "people of determination". The instruments themselves are not named as applying until counsel confirms them | 4, OQ-5 to OQ-9 |
| 21 | Resolved. 12-point service standard; assessments at alpha, beta and live; panel make-up including Arabic content and accessibility specialists; met / not met; reassessment; report template | 2, 17.2, Appendix D |
| 22 | Resolved. Component index rebuilt from the `sc-` library (all 33 tags), plus a prioritised backlog of planned components | 10.2, 10.4 |
| 23 | Resolved. Invented "Custom Government …" names removed; each pattern names real components or planned ones from the backlog | 13, 10.4 |
| 24 | Resolved. GOV.UK-correct rule stated (focus, no `role="alert"`); component change noted as in progress | 10.3 (CMP-05) |
| 25 | Resolved. Decision: title link only, no whole-card or stretched link; fees and eligibility moved to the service detail page; component change noted as in progress | 10.3 (CMP-06), 11.2 |
| 26 | Resolved. One target-size rule: 44 × 44 minimum, 54px primary controls, inline links under WCAG 2.5.8, `sc-table` compact as the only other exception | 6.2 (A11Y-04) |
| 27 | Resolved. One status box; rules are normative; open decisions in chapter 19 | 0.1, 19 |
| 28 | Resolved. Bilingual style guide (dates, times, time zone, calendar, money, phone, numbers, references, links, buttons) and error message templates | 9.4, 9.5 |
| 29 | Resolved. "Ask users for" chapter: names, Emirates ID, passport, nationality, date of birth, email, phone, address, Makani, plate, trade licence, IBAN, amount, verification code, card (Dubai Pay only), sex, equality information | 12 |
| 30 | Resolved. Page templates: shell and title, service detail, question, check answers, confirmation, task list, error pages, cookies, privacy and accessibility pages | 11 |
| 31 | Resolved. Cookie rules: off by default, equal-weight accept and reject, nothing before consent, cookies page, stored choice; `sc-cookie-banner` planned; legal basis is OQ-27 | 14.4, 10.4 |
| 32 | Resolved. Support matrix with browsers, screen readers in Arabic and English, contrast themes, zoom and text scaling | 6.4 |
| 33 | Resolved. Foundations chapter documenting every token group with rules and build checks | 8 |
| 34 | Resolved. References to non-existent artefacts removed; this Markdown file named as canonical. Whether the artefacts exist elsewhere is OQ-15 | 0.1, OQ-15 |
| 35 | Resolved. SC-028, SC-094 and the schema example merged into one record rule and one appendix | 3.4 (SVC-10), Appendix B |
| 36 | Resolved. Bibliography rebuilt, one entry per source | Appendix E |
| 37 | Resolved. 2.4.8 Location noted as AAA and outside the baseline | Appendix A |
| 38 | Resolved. Heading reads "WCAG 2.2 register" | Appendix A |
| 39 | Resolved. UK spelling throughout; W3C criterion names kept as published | Throughout, Appendix A |
| 40 | Partly open. "UAE PASS" and "Dubai Pay" used consistently; official styling to be confirmed | OQ-3, OQ-4 |
| 41 | Partly open. Authored button copy removed; the provider's own button assets and wording are required, and the Arabic name is to be confirmed | 13.4 (ID-02), OQ-3 |
| 42 | Resolved. Example rewritten as a matched, gender-neutral pair: "Who are you acting for?" / "نيابةً عمّن يُقدَّم هذا الطلب؟" | 13.5 |
| 43 | Resolved. Token naming described from the build outputs (`--sc-*` CSS, Tailwind, Swift, Kotlin, Paper) | 8, 0.4 |
| 44 | Resolved. Radius rule removed; radius tokens documented | 8.3 (FND-16) |
| 45 | Resolved. Replaced with `--sc-color-rule` and `--sc-color-control` and their OKLAB values | 8.1 (FND-07) |
| 46 | Resolved. Examples are labelled and shown in English and Arabic together (tables or "Example: EN / AR") | Throughout |
| 47 | Resolved. Core Web Vitals are a release gate with real-user monitoring as the source; native budgets deferred to the kits phase | 15 (PERF-02, PERF-07), OQ-19 |
| 48 | Resolved. Every round includes Arabic and English users and people with access needs; named groups across alpha and beta; recruitment route is OQ-14 | 16 (RES-02) |
| 49 | Resolved. Gregorian by default; Hijri is a service decision to confirm | 9.4, OQ-11 |
| 50 | Resolved. Dubai time (GST, UTC+4, no daylight saving) for all times and deadlines | 9.4 |
| 51 | Resolved. Toast not planned; outcomes use `sc-callout` or the planned notification banner | 10.4 |
| 52 | Resolved. Contents grouped into four parts and appendices | Contents |
| 53 | Resolved. One rule: no service goes live with incomplete translation; the "translation unavailable" variant removed | 5.1 (LANG-02) |
| 54 | Resolved. The language control is a link to the equivalent page, never a button or menu | 5.2 (LANG-05) |
| 55 | Resolved in text, scope open. Staff tools are in scope when delivered through Shared Channels, with compact density; per-channel scope is OQ-13 | 0.2, OQ-13 |
| 56 | Resolved. Bilingual accessibility statement template | 6.6, Appendix C |

## Decision contradictions (review section 3A)

| # | Resolution |
| --- | --- |
| C1–C7 | shadcn/ui, React and Sonner removed; `sc-` library described (0.4, 10.1); toast not planned (10.4); framework wrappers mentioned as a later step (10.1) |
| C8–C10 | Entity theming replaced by channel theming; entities attribution only (3.2) |
| C11–C12 | Hex values and the teal-band greens deleted; OKLAB tokens and `check:teal` (8.1) |
| C13–C15 | Dubai Font only, token leading and the two scales (8.2) |
| C16 | Latin-digit output rule (5.5) |
| C17 | Phasing from `MOBILE.md` (7.1) |
| C18 | Dark mode supported (8.1) |
| C19 | Focus ring per conventions (6.2) |
| C20 | `--sc-*` naming from the build (0.4, 8) |
| C21 | Radius tokens (8.3) |
| C22 | Error summary: rule kept, component change in progress (10.3) |
| C23 | Service card: title link only, component change in progress (10.3) |

## GOV.UK gaps (review section 4)

| # | Gap | Where |
| --- | --- | --- |
| 1 | Principles | 1 |
| 2 | Service standard | 2 |
| 3 | Assessment process | 17.2, Appendix D |
| 4 | Research with users with access needs | 16 |
| 5 | Content design and style guide | 9 |
| 6 | Arabic plain-language rules | 9.3 |
| 7 | Foundations | 8 |
| 8 | Page templates | 11 |
| 9 | "Ask users for" | 12 |
| 10 | Question pages | 11.3, 13.6 |
| 11 | Start pages | 11.2 |
| 12 | Check answers | 11.4, 13.11 |
| 13 | Confirmation pages | 11.5, 13.13; `sc-panel` planned |
| 14 | Task lists | 11.6, 9.6; `sc-task-list` planned |
| 15 | Error handling and error pages | 9.5, 11.7, 13.18 |
| 16 | Cookies and consent | 14.4 |
| 17 | Timeouts | 13.10; values are OQ-18 |
| 18 | Offline and poor connectivity in apps | 13.18 (FAIL-04) |
| 19 | Sign in, save and return, account area, shared devices | 13.4, 13.9, 13.14, 14.3 (PRV-11) |
| 20 | Language switching, URLs, `hreflang`, user text | 5.2 |
| 21 | Arabic typography and bidi | 5.4, 5.7 |
| 22 | Supported browsers and assistive technology | 6.4 |
| 23 | Accessibility statement template | Appendix C |
| 24 | Performance and native budgets | 15; native budgets OQ-19 |
| 25 | Notifications, sender, Arabic SMS, link safety | 13.15; SMS segment length OQ-12 |
| 26 | Contribution model | 18.1 |
| 27 | Versioning, changelog, deprecation | 18.2 |
| 28 | Channel-specific guidance and cross-listing | 3.1, 3.4 (SVC-13) |

## Keep list (review section 5)

Carried over and rewritten to the new rules: channel and ownership model (3.1); canonical record and no duplicate transactions (3.4); catalogue schema (Appendix B); task-led naming (3.3); fee and timing honesty (9.4, SVC-15); parity as a release defect and state kept on switching (5.1, 5.2); do-not-mirror rules (5.6); no flags (LANG-05); honest accessibility statement (6.6, A11Y-03); WCAG 2.2 register (Appendix A, as a table); timing rules (13.10); identity rules (13.4); representation (13.5); payment integrity (13.12); "received" vs "complete" (TPL-16, CNT-19); upload rules (13.7); add another (13.8); save and resume (13.9); address rules (12.3); quick exit (13.19); professional tables (13.20); cross-channel continuation (13.21); failure taxonomy (13.18); recovery-state tables (13); network profile and Core Web Vitals (15); governance roles (17.1); exception management (17.3); outcome measures (17.5); "Change" links name their question and "Completed" means saved and valid (TPL-10, 9.6); Dubai time zone made global (9.4).

## Items to verify (review section 7)

None is asserted. Items 1–16 are OQ-1 to OQ-16. New open questions found while rewriting are OQ-17 to OQ-28, including the motion token changes required by the new motion rules (OQ-22 to OQ-25 and OQ-28).

## Other changes in 2.0

- Motion rules rewritten from Emil Kowalski's skills (8.7), with the token conflicts (`easing.exit` is ease-in; spinner speed; reduced-motion durations; missing ease-in-out token) listed as OQ-22 to OQ-25.
- Known component gaps recorded: imperative Arabic default strings in `sc-skip-link` and `sc-date-range`, the `sc-skip-link` default target versus `sc-page`'s `main-content`, and the missing visited-link token (10.3, OQ-20).

## v2: design system v2 (21 October 2026)

The "Native" visual direction is retired and the design system is rebuilt as v2, "Dubai Design System, evolved" (`docs/v2/plan.md`). This revision of Standard 2.0 brings the standard in line with v2. It follows `docs/v2/decisions.md`, `docs/v2/foundations.md`, `docs/v2/component-language.md` and `docs/v2/architecture.md`; where they disagree, `decisions.md` wins. The behaviour rules of 2.0 are unchanged. Colours are named only by token.

In the standard, a changed requirement is marked "(changed in v2)" and a new one "(new in v2)". No requirement ID was removed or renamed. Requirements whose meaning is unchanged keep their ID and carry no mark, even where a token name in them was updated.

### By chapter

| Chapter | Change |
| --- | --- |
| Header, 0.1, 0.4 | Date updated. 0.1 says the foundations follow v2. 0.4 adds `docs/v2/foundations.md` as the source of every value; the token example is now `--sc-color-on-surface` |
| 3.2 | SVC-01 and SVC-03 name every component that may show another channel's colour (chip, channel switcher, footer Channels group, network strip), each through `data-channel` on itself |
| 5.6, 5.7 | The icon rows of the mirroring table point to the icon mirroring table in 8.6. LANG-25 uses the v2 type properties, which follow `lang`. LANG-27 names the v2 roles |
| 6.2, 6.4 | A11Y-04: 56px primary and 48px secondary controls, and the 44px target extension for smaller controls. A11Y-05: the neutral focus ring (U1). A11Y-06: status is an icon and words, a dot only for channel attribution. A11Y-07: the reduced-transparency rule is gone, because nothing is translucent. 6.4 states the library's browser floor (A1) |
| 7.1 | Web uses the library stylesheet `sc.css` |
| 8 | Rewritten to v2: tonal colour system (city indigo primary, seven channel signatures, neutral and semantic ramps, the role tokens by their real names, state layers, decorative tints); Dubai W23 in three weights on the 15-role Material-style scale, Arabic one step larger, body 18/26 and 20/32; sizes 56, 48 and 44; radii 4, 6, 8 and 12; flat, outline-first elevation in three levels; Material Symbols Outlined with its mirroring table; a new 8.8 for how the focus ring is built. Motion keeps MOT-01 to MOT-15 and the duration rule of thumb; the stale token notes are removed |
| 10 | CMP-02 (one `sc.css`), CMP-04 (light DOM fields and button) and the new CMP-07 (Enter submits). 10.2 updates `sc-button`, `sc-link`, `sc-app-bar`, `sc-step-progress`, `sc-channel-hero` and `sc-footer`. 10.3 adds links (CMP-08, with `.sc-link`), the stepper (CMP-09) and shared hand-offs (CMP-10), and drops the visited-link gap. 10.4 replaces `sc-header-navigation` with `sc-site-header`, renames `sc-dialog` to `sc-modal`, and adds `sc-account-menu`, `sc-utility-bar` and `sc-channel-network` |
| 11 | TPL-01 allows `sc-site-header` on channel pages. New 11.9 "Channel-site chrome" (CHR-01 to CHR-08), with checks |
| 13 | ID-02 and the sign-in and payment component lists use the city indigo hand-off (U3) |
| 15 | New design system budgets (PERF-08 to PERF-11) from `architecture.md`, as SHOULD requirements, with checks |
| 19 | Seven answered questions removed; OQ-3 and OQ-4 narrowed; OQ-30 added |

### Decisions applied

| Decision | Where |
| --- | --- |
| U1 neutral focus ring | A11Y-05, 8.8, system roles table |
| U2 stepper in channel colour, check on completed steps | CMP-09 |
| U3 UAE PASS and Dubai Pay in city indigo (superseded for UAE PASS by U3a: see the second update below) | FND-25, CMP-10, CHR-01, ID-02, 13.12 |
| U4 docked, flat utility bar | CHR-05 |
| Q-header header structure | CHR-01, CHR-02, CHR-03 |
| Q-footer Channels group allowed | CHR-06 |
| Q-hero flat channel-subtle hero | CHR-07 |
| Q-chips 32px chips with a 44px target | A11Y-04, FND-15 |
| Q-standard stale motion notes | 8.7 |
| A1 browser floor | 6.4, FND-08 |
| A2 light DOM fields and `sc-button` | CMP-04, CMP-07 |
| A3 no Light weight | 8.2, FND-12 |
| A4 `.sc-link` | CMP-08 |
| D1, D3, D4, D5, D8, D11, D12, D13 | 8.1, 8.2, 8.6, CMP-08 |

### Requirement IDs

| | IDs |
| --- | --- |
| Added | FND-24, FND-25, FND-26, FND-27, FND-28, FND-29; CMP-07, CMP-08, CMP-09, CMP-10; CHR-01 to CHR-08 (new prefix); PERF-08, PERF-09, PERF-10, PERF-11 |
| Changed in meaning | SVC-01, SVC-03, LANG-25, A11Y-04, A11Y-05, A11Y-06, A11Y-07, FND-07, FND-08, FND-11, FND-12, FND-13, FND-15, FND-16, FND-19, FND-20, FND-21, MOT-05, CMP-02, CMP-04, TPL-01, ID-02 |
| Text updated, meaning unchanged | FND-05 (example pair), FND-22 (cross-reference), LANG-27 (role names), MOT-06 to MOT-09 and MOT-15 (token names and values; caveats removed) |
| Removed or renamed | None |

### Open questions

| Question | Outcome |
| --- | --- |
| OQ-20 visited-link token | Answered and removed: visited links are not styled differently (D8, CMP-08) |
| OQ-22 `easing.exit` was ease-in | Answered and removed: `--sc-easing-exit` is now the strong ease-out curve (MOT-05) |
| OQ-23 easing tokens | Answered and removed: `--sc-easing-enter` is the reference ease-out and `--sc-easing-standard` the reference ease-in-out (MOT-04) |
| OQ-24 reduced motion zeroed every duration | Answered and removed: only the spin and scale tokens change under reduced motion (MOT-15) |
| OQ-25 spinner speed | Answered and removed: `--sc-duration-spin` is 600ms |
| OQ-26 focus ring in `check:contrast` | Answered and removed: the ring is neutral and `check:contrast` measures it against every surface, container and channel band (A11Y-05) |
| OQ-29 duration tokens | Answered and removed: `--sc-duration-slow` is 280ms and `--sc-duration-exit` 160ms (MOT-06, MOT-07) |
| OQ-3, OQ-4 | Narrowed: the hand-off colour is decided (U3); whether the providers require their own button assets stays open |
| OQ-30 | New: the approved Government of Dubai lockup (CHR-02) |

Numbers of removed questions are not reused.

### Second update: the built library (22 October 2026)

This update brings the standard in line with the v2 library as built and with every decision recorded after the first update: U3a, U3b, L1 to L4, U5, W1 to W26 and W4a (`docs/v2/decisions.md`). The sources are `decisions.md`, `components/specs/*.md`, `components/perf-budgets.json`, `docs/v2/architecture.md`, `docs/v2/migration.md` and `docs/v2/alignment-report.md`. The same marking rules apply. Requirements first added in v2 keep the "(new in v2)" mark when their text changes; they are listed below as revised.

#### By chapter

| Chapter | Change |
| --- | --- |
| Header, 0.4 | Date. Components are specified in `components/specs/<tag>.md`, with the API in each readme |
| 3.1, 3.2 | The official Arabic channel names are checked against the library's single source (`channel-names.ts`); every occurrence in the standard matches. SVC-01 names `sc-channel-switcher`, `sc-channel-network` and the other-channel rows of `sc-step-list` |
| 4 | Names Law No. (1) of 2025 only as the reason the lockup is not yet published, without interpreting it |
| 5.2, 5.6 | LANG-04 places the language switch in `sc-site-header` on channel pages. LANG-05: a single-page app keeps the link and may cancel it to switch in place (library conformance issue 5). The lockup and the UAE PASS button are added to "does not mirror" |
| 6.2 | A11Y-04: a link alone in a table cell is a standalone target (conformance issue 8). A11Y-05: the focus ring is drawn inside the element wherever an outside ring would be clipped (W19). A11Y-06: the unread dot of `sc-notification-list`, always with a fill, Bold text and a hidden word |
| 8.1, 8.3, 8.6 | FND-25: city indigo is no longer used for UAE PASS (U3a). FND-26 adds `sc-step-list` rows. FND-15: `--sc-size-strip` (4px) is the one start-bar width, for fields in error and callouts; `--sc-size-border-accent` (3px) is for 3px accents only (W11, W20). FND-21: icons are generated per component from the Material Symbols manifest |
| 8.7, 8.8 | MOT-06 and MOT-07: a centred dialog enters over 200ms and leaves over 160ms; sheets and drawers use `--sc-duration-slow` (280ms) and leave over about 224ms (W2, W21). The component table adds `sc-modal` and `sc-notification-list`, and the channel switcher's scale is `--sc-scale-enter`. 8.8 describes the inset ring |
| 9.3, 9.4 | CNT-11: official names, such as the channel names, are kept as they are (conformance issue 3). The date-range rule gives the Arabic compact form in words, consistent with LANG-22A (conformance issue 4) |
| 10 | 10.1 and CMP-02: specifications in `specs/`; a service that uses cascade layers declares its order so its overrides come after the library's `sc` layer. 10.2 rebuilt from the library: a new "Site chrome" family and every new tag (`sc-breadcrumbs`, `sc-pagination`, `sc-site-header`, `sc-channel-switcher`, `sc-account-menu`, `sc-account-nav`, `sc-bottom-nav`, `sc-announcement-bar`, `sc-utility-bar`, `sc-channel-network`, `sc-filter-chips`, `sc-step-list`, `sc-timeline`, `sc-notification-list`, `sc-empty-state`, `sc-modal`, `sc-tile`, `sc-attention-card`, `sc-module-card`, `sc-accordion`). 10.3: the error summary heading (W1); `sc-service-card` now follows CMP-06; CMP-10 is for Dubai Pay and other hand-offs only (U3b); new CMP-11 for the official UAE PASS button (U3a) and CMP-12 for status tag tones (W4a). The fixed v1 gaps are removed and three current gaps recorded. 10.4 drops the components now built and adds `sc-uaepass-button`, `sc-plate`, `sc-chip` and `sc-icon-tile` (W26) |
| 11 | The shell example uses `cookies-href`. CHR-01: UAE PASS sign in, current item colour, no wrapping. CHR-02: lockup per L1 to L4. CHR-04: the compact row keeps the lockup. CHR-05: no upward shadow (W23) and the Arabic names (W24). CHR-06: group names, with "المعلومات القانونية" (W24). CHR-08: the current tile is text. New CHR-09 (announcements) and CHR-10 (signed-in navigation). Checks updated |
| 13 | Components lines for 13.1, 13.4, 13.10 (`sc-modal alert countdown` replaces the planned timeout component), 13.12, 13.14 and 13.15. ID-02 uses the official UAE PASS button |
| 15 | PERF-08 and PERF-09 match `perf-budgets.json`: `sc.css` 9 KiB (W7), page component CSS 4 KiB (W13), the overrides (W8, W10, W14), `sc-date-range` 21 KiB. PERF-10: subsets by script, the language-name faces, and the preload snippet. PERF-11: `sc-preload.html`. The check measures the fonts a browser actually downloads |
| 19 | OQ-3 is now the UAE PASS button kit; OQ-30 the lockup's usage manual or approval |
| Appendix E | Specs, budgets and the v2 documents |

#### Decisions applied

| Decision | Where |
| --- | --- |
| U3a UAE PASS official button | FND-25, CMP-11, CHR-01, ID-02, 13.4, 10.4, OQ-3 |
| U3b Dubai Pay and other hand-offs in city indigo | CMP-10, 13.12 |
| L1 to L4 Government of Dubai lockup | 4, 5.6, CHR-02, CHR-04, OQ-30 |
| U5 and W16 attention card without a strip | 10.2 |
| W1 error summary heading | 10.3 |
| W2 and W21 modal timing | MOT-06, MOT-07, 8.7 table, 10.3 known gaps |
| W4 and W4a channel tone as a highlight | CMP-12, 10.2 |
| W6 `sc-tile` | 10.2, 13.1 |
| W7, W8, W10, W13, W14, W18 budgets | PERF-08, PERF-09 |
| W11 and W20 one 4px start bar | FND-15, 10.3 known gaps |
| W12 cascade layer order | Not added: it binds the library's own stylesheets. Services get the related rule for their own layers in CMP-02 |
| W17 whole-item notification links | 10.2, 13.15 |
| W19 inset focus ring at an edge | A11Y-05, 8.8, CHR-10 |
| W23 no upward shadow | CHR-05 |
| W24 Arabic wording | CHR-05, CHR-06, LANG-22A example unchanged |
| W25 account menu items | 10.2 |
| W26 tags for later | 10.4 |
| A2 Enter submits | CMP-07, unchanged |

#### Requirement IDs

| | IDs |
| --- | --- |
| Added | CMP-11, CMP-12, CHR-09, CHR-10 |
| Changed in meaning, newly marked | LANG-04, LANG-05, CNT-11, MOT-06 |
| Revised again (already marked) | A11Y-04, A11Y-05, A11Y-06, FND-15, FND-21, CMP-02, ID-02 |
| Revised, new in v2 | FND-25, FND-26, CMP-10, CHR-01, CHR-02, CHR-04, CHR-05, CHR-06, CHR-08, PERF-08, PERF-09, PERF-10, PERF-11 |
| Text updated, meaning unchanged | SVC-01 (component names), MOT-07 (dialog example), CMP-06 bullets |
| Removed or renamed | None |

#### Open questions

| Question | Outcome |
| --- | --- |
| OQ-3 | Changed: whether to use the provider's button is decided (U3a); what remains is the official kit itself |
| OQ-30 | Changed: the artwork is in hand (L1); what remains is the usage manual or approval, with clear space, minimum size, dark version and link target (L4) |
| OQ-4 | Unchanged: whether Dubai Pay mandates its own button (U3b) |
| Others | None answered by these decisions. OQ-28 stays open: no test yet shows the `sc-date-range` popover opening instantly from the keyboard |

Numbers of removed questions are not reused.

#### Not reconciled

- `sc-callout` draws a 3px start bar, its spec and readme say 3px, and `COMPONENTS.md` describes the callout's accent as 3px; W20 sets 4px. The standard follows W20 and lists the gap in 10.3.
- `sc-modal` (code and spec) animates the centred dialog over 280ms in and 224ms out; W21 sets 200ms and 160ms. The standard follows W21 and lists the gap in 10.3.
- `sc-utility-bar` ("اتصل") and the `sc-site-header` menu hint ("سجّل الدخول …") use imperatives, against CNT-11. Listed in 10.3.
- `components/COMPONENTS.md` (v2 StatusTag entry: "no channel tone") and `docs/library-conformance.md` 9.6 ("deprecated") still contradict W4a, as the alignment report notes.
- `docs/v2/foundations.md` (the city indigo row of the system roles table and COL-11) still lists UAE PASS sign-in as a city indigo use, against U3a. `components/COMPONENTS.md` still gives `sc-attention-card` a top strip (against U5) and pagination as "1–20" (against LANG-22A). These files were outside this update.
