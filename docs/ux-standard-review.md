# Review of the Shared Channels UX Standard (Proposed Standard 1.0)

Reviewed document: `Shared Channels UX Standard.md` (4,588 lines, dated 19 October 2026). The copy in `Reference Docs/` is byte-identical. All line numbers below refer to this file.

Reviewed against: the decisions made since the draft (StencilJS `sc-` components, channel theming, OKLAB colour, no DDS teal, Dubai Font with tight leading, Latin digits, deferred Flutter and React Native kits, DTCG tokens), the current design system (`design-system/README.md`, `MOBILE.md`, `components/CONVENTIONS.md`, `components/COMPONENTS.md`, `components/specs/sc-table.md`, `components/specs/sc-date-range.md`, `tokens/*.json`), and GOV.UK Service Manual and Design System rigour.

Review date: 19 October 2026. The standard itself was not changed.

---

## 1. Summary verdict

The draft has a sound skeleton and a lot of careful thinking about service behaviour. It is strong on transaction integrity, recovery states, WCAG 2.2 accuracy and the honest limits of conformance claims. But it cannot be adopted as it stands. It is built on a technical and visual foundation the initiative has since rejected: shadcn/ui and React (51 mentions), entity-level theming, hex colours (including two greens inside the banned teal hue band) and a GOV.UK-style 1.6 line-height and yellow focus ring. These run through the standards, the theme contract, all 36 component specs and all 26 patterns. Beyond these contradictions, the document reads as an exhaustive but generic checklist rather than a usable standard. Requirements are hedged ("approved" appears 67 times, "appropriate" 28 times, "verified" 40 times), and the same rules are restated three times in the standards, components and patterns. The 36 component specs are mostly boilerplate with no API, sizes, tokens or examples. Arabic is treated with good intent but no depth: there is no Arabic typography, content style, grammatical-gender or numeral output rule, and one Arabic example says the opposite of its English pair. Foundations (colour, type, space, layout, icons, motion, dark mode), content design, "ask users for" patterns and a real service assessment process are missing. The rebuild should keep the patterns' behavioural rules, the transaction and recovery rules, the canonical service model, the governance roles and the WCAG register. It should replace the foundation, theme and component chapters entirely, and restructure the whole into a shorter standard backed by the living design system.

### Scorecard

| Area | Rating (1–5) | Reason |
| --- | --- | --- |
| Alignment with current decisions | 1 | Built on shadcn/ui, entity theming, hex colours, 1.6 leading and a GOV.UK focus style; Dubai Font, OKLAB, channel theming and Latin-digit rules are absent |
| Requirement rigour and testability | 2 | Every rule has an ID and MUST/SHOULD, but much of the wording is hedged and the acceptance evidence is often sample-based ("at least one") or not checkable |
| Coverage against GOV.UK | 3 | Journey patterns are broad, but there are no foundations, content style guide, "ask users for" patterns, page templates or service assessment method |
| Accessibility accuracy | 4 | The WCAG 2.2 register is accurate and complete (55 A/AA criteria, 4.1.1 correctly dropped); minor mapping slips |
| Arabic and RTL treatment | 2 | Parity intent is strong, but there are no Arabic typography, content, gender, numeral output or icon-mirroring rules, and one Arabic example is wrong |
| UAE context accuracy | 2 | Avoids invented claims, but over-hedges; no reference to the actual UAE and Dubai legal, accessibility or digital-government framework |
| Component library | 1 | Wrong technology; boilerplate states; no API, anatomy sizes or visuals; 15 specified components do not exist and 8 existing ones are unspecified |
| Pattern library | 4 | The best part of the document: concrete flows, mandatory rules and recovery states, especially for payment, identity, upload and save-and-return |
| Governance and assurance | 3 | Clear roles, gates and exception management; no assessment panel, scoring, report template or assessor guidance |
| Usability of the document | 2 | 86 flat sections, triple duplication, ~4,600 lines; no "when to use / when not to use", no examples or code; hard to use day to day |
| Tone and presentation | 2 | Plain and careful in places, but full of AI-drafting artefacts ("in this conversation", "user-requested") and defensive UK disclaimers; mixed US and UK spelling |

---

## 2. Findings (worst first)

Severity: **Blocker** stops adoption; **Major** needs to be fixed in the rebuild; **Minor** is a quality or accuracy fix.

| # | Severity | Section + line | Finding | Recommended fix |
| --- | --- | --- | --- | --- |
| 1 | Blocker | Cover 7; How to use 114, 120; S01 165; S09 516–556; Theme 828–892; Component index 900–939; every component "Foundation" line (e.g. 949, 1052); every pattern "Components:" line (2906–4002); Governance 4013; Sources 4562–4572, 4588 | The whole design-system layer assumes shadcn/ui (51 mentions) on React ("production React components", 4588), including Radix/Base UI choice (832), Sonner (939) and the shadcn registry. This contradicts the StencilJS `sc-` web component decision. | Remove shadcn/ui throughout. Rewrite S09 as "Shared component library" based on `CONVENTIONS.md`: StencilJS web components, `sc-` prefix, Shadow DOM, form-associated fields, framework-agnostic and usable from vanilla JS. Replace each "Foundation" line with the `sc-` tag. |
| 2 | Blocker | S09 518, 526, 530, 546–547; Theme 830–843; Sources 4562 | Theming is defined per government entity ("Entity brands may vary through approved semantic tokens", 518; "Entities may theme", 838–843). This contradicts the decision that the channel is the theme and entities get attribution only. | Replace with a channel theming contract: one `data-channel` per page or screen from the seven channels, channel roles (`--sc-channel-action`, `-ink`, `-subtle`, and so on), and entity attribution as text only (as in `sc-service-card`). State plainly that entities MUST NOT supply colours, fonts, logos in the header or radii. |
| 3 | Blocker | Theme 857, 871–890 | Colours are specified in hex. Two of them, `#00553a` (Green hover, 881) and `#00452f` (Green active, 882), measure OKLCH hue ≈ 164°, inside the banned teal band (hue 160–215, chroma > 0.015) used by `check:teal`. | Delete the reference palette and its table. Point to `tokens/color.json` and `color.dark.json` (OKLAB, DTCG) and the build checks (`check:contrast`, `check:teal`, `check:no-hex`). State the OKLAB-only and no-teal rules as MUSTs. |
| 4 | Blocker | Theme 842, 848, 854 | Typography contradicts the decisions: "1.6 minimum body line-height" (854), body "18px English and 20px Arabic" (842), and entities may choose "Latin and Arabic body font families" or an "alternative typeface" (842, 848). Dubai Font is never named. Tokens set Latin body at 19/17/15px with about 1.4× leading and Arabic body at 20/19/18px with about 1.5–1.56×. | Add a typography foundation: Dubai Font (Dubai W23) only, separate Latin and Arabic scales from `tokens/typography.json`, tight leading (Latin display about 1.0–1.05×, headings about 1.15×, body about 1.4×; Arabic body 1.5–1.6×), and no letter-spacing on Arabic. Remove the font choice for entities. Check 1.4.12 text-spacing overrides instead of mandating 1.6. |
| 5 | Major | Theme 857 | "Focus is a locked yellow-and-black dual indicator" copies GOV.UK. It conflicts with `CONVENTIONS.md` (3px `--sc-channel-action` ring with a 2px surface-coloured offset, `:focus-visible` only). | Adopt the CONVENTIONS focus ring as the rule, with a measurable contrast requirement (3:1 against adjacent colours in every channel and in light and dark), and a forced-colours fallback. |
| 6 | Major | Theme 849 | "No dark theme is supplied in this release." Tokens ship `color.dark.json`, CSS dark mode (`data-theme`) and dark contrast checks. | Add dark mode as a supported mode with the same contrast evidence; remove the sentence. |
| 7 | Major | S06 402 (and absent elsewhere) | There is no numeral output rule. SC-036 only says to accept Arabic-Indic and Western digits on input. The decision (and `CONVENTIONS.md`) is Latin digits for amounts, plates, references and phone numbers in Arabic. | Add a MUST: in Arabic, amounts, plates, references, phone numbers, dates and counts use Latin digits (0–9) inside an LTR isolate (`sc-ltr` or `<bdi dir="ltr">`). Keep the input rule: accept Arabic-Indic digits and normalise them. |
| 8 | Major | S08 472–510; Theme 834 | Native parity is required now ("native apps must reproduce the behavioural and accessibility contracts", 834), but Flutter and React Native are never named, and the deferral of `sc_flutter` and `@sc/react-native` is not reflected. | Add a platform section based on `MOBILE.md`: which platforms are in scope in which phase, what native teams use today (tokens and specs), and the conformance checklist that a native component must pass. Mark native kits as a later phase. |
| 9 | Major | Throughout; e.g. SC-058 570, SC-080 718, SC-084 754, SC-087 766, P20 3719 | Requirements are hedged until they cannot be tested: "approved" (67), "verified" (40), "appropriate" (28), "where relevant", "where supported", "proposed" (21). For example, "Apply least privilege … appropriate to risk" (750) or "Provide consistently located assistance" (754) give a reviewer nothing to check. | Rewrite each rule as a single pass/fail statement with: how to test it, the evidence artefact, who checks it and at which gate. Move caveats to one "status and authority" box at the start. |
| 10 | Major | Acceptance evidence blocks, e.g. 182–183, 226–227, 319, 508, 599–600 | The acceptance evidence is often a thin sample ("at least one research round", 319; "one small real phone and one low-cost Android device", 508; "at least one tested failure", 227). It does not tie to the rule's full scope. | Define evidence per rule and per gate. Use the GOV.UK assessment approach: evidence the team presents, questions the panel asks, and "met / not met" criteria. |
| 11 | Major | All 36 component "States" blocks (e.g. 970–973, 1021–1024, 1076–1079); boilerplate repeated 31 times | Component specs are templated text. "Default, hover, focus-visible and pressed … Disabled or unavailable with reason; loading …" is pasted into 31 components, including ones where it makes no sense (text field "pressed", 1078; footer, 2020). There is no API, no sizes, no token use, no visuals, no "when not to use", no code. | Rebuild component pages to the `COMPONENTS.md` and `specs/sc-table.md` standard: purpose, when to use, when not to use, anatomy with sizes and tokens, props, slots, events, states that apply, content rules (EN and AR), accessibility, RTL, tests, examples and code. |
| 12 | Major | S10 590 / C35 2730–2776 / P13 3393–3430; S10 586 / C15 1681–1727 / P14 3436–3474; S11 608–646 / C30 2459–2506 / P04 2998–3036; S12 652–690 / C31 2512–2561 / P15 3480–3518; S06 390 / C18 1841–1885 / P06 3085–3123; S05 345 / 361 / 367 | The same rules appear in a standard, a component and a pattern, worded slightly differently each time (session timeout, check answers, UAE Pass, Dubai Pay, language switching, catalogue record). This makes the document about three times longer than it needs to be and invites drift. | Give each topic one home. Standards state the outcome and link to the pattern; patterns hold the behaviour; components hold the UI contract. Never restate. |
| 13 | Major | SC-072 666; C13 1576, 1585–1591; C16 1748–1752; C34 2699; P17 3583; P25 3929 | There is no single status vocabulary. "Action needed" (1576) vs "Action required" (1752, 3583); "Completed" (1750) vs "Complete" (3929, 2699); the payment states (666) and application states (3583) are separate lists; no Arabic terms are fixed. | Publish one canonical bilingual status vocabulary table (application, task, payment, refund), each term mapped to a `sc-status-tag` tone, with definitions and the business state it maps to. |
| 14 | Major | P06 3117, 3119 | The language-switch example is wrong. English: "Change the language to English"; Arabic: "تغيير اللغة إلى العربية" ("Change the language to Arabic"). This is in the pattern that is about language parity. | Fix the pair and have every Arabic example reviewed by a qualified Arabic content designer before publication. Per `COMPONENTS.md`, the switch label is the other language's own name ("العربية" / "English"). |
| 15 | Major | All patterns, e.g. 2904, 2947, 3034; 26 occurrences | "Example copy requires owning-entity and Arabic editorial review" is attached to every Arabic example. In effect, the document admits its Arabic is unreviewed. | Have the Arabic reviewed once and remove the disclaimer. Where content needs entity sign-off, say so in the governance section, not 26 times. |
| 16 | Major | Absent; Arabic examples 3163, 3470, 3646, 3954, 3998 | No Arabic content guidance: no decision on Modern Standard Arabic vs Gulf register, no rule on grammatical gender of address (the examples use the masculine imperative: "أدخل", "راجع", "أكمل", "حدد", "تود"), no Arabic plain-language or reading-level guidance, no transliteration rules, no Arabic punctuation rules. | Add an Arabic content style guide: register (MSA, plain), gender-inclusive address strategy (for example, imperative avoided in favour of verbal nouns such as "إدخال" / "مراجعة", or a stated default), plurals and dual, punctuation (، ؛ ؟), transliteration, terminology glossary ownership. |
| 17 | Major | Absent; only 534, 842, 848, 1618 | No Arabic typography rules: no minimum sizes, no "never letter-space Arabic", no rule against faux italics or uppercase transforms (only "never force uppercase", 1618), no line length, no justification or kashida rule, no mixed-script baseline or size matching. | Add an Arabic typography section aligned with `tokens/typography.json` and the CONVENTIONS type rules (`:host(:lang(ar))` switches scale; letter-spacing 0). |
| 18 | Major | Scattered: 394, 398, 987, 1038, 1093, 1146, 1461, 1723, 1777, 1932, 1983, 2190, 2611 | Bidi and mirroring rules are scattered over about 15 places and use different mechanisms (`dir=auto`, `bdi`, "isolate", "logical properties") with no single reference. There is no icon mirroring list and no reference to `sc-ltr`. | Create one "Arabic and right-to-left" chapter: direction setting, logical properties only, isolation rules (with `sc-ltr`), a mirror / do-not-mirror icon table (matching CONVENTIONS: directional icons flip; time, media, real objects and logos never flip), digit rules and test steps. Components then link to it. |
| 19 | Major | 112, 114, 122, 518, 4558, 4562–4568, 169 | The text is full of AI-drafting artefacts and defensive framing: "user-requested" (518), "The later project instruction" (114), "Primary project direction in this conversation" (4562), "user amendments", "Supplied GOV.UK reference" (122), "Official page opened 19 October 2026" (4565–4568), "UK law and UK branding are not adopted by this guide" (112), and SC-004 listing UK things not to copy (169). This is not consultancy grade. | Remove all provenance-of-drafting language. State the authority for the standard once (issuing body, version, status). Credit GOV.UK and W3C as references in a normal bibliography. Drop SC-004. |
| 20 | Major | S07 424–466; S14 740–778; channel table 137–143 | No grounding in the UAE and Dubai framework. The document never names the issuing or relevant bodies (Digital Dubai, TDRA), the UAE Design System, the data-protection position, or disability rights law. It uses "disabled people" (201) instead of the UAE term "people of determination". | Add a short "Legal and policy context" section, written with legal counsel, that lists the instruments that apply and what they require of a service. Adopt local terminology ("people of determination"), keeping WCAG wording where quoting it. Mark every item verified by counsel. See section 7. |
| 21 | Major | Governance 4008–4073 | No real service assessment process. There are gates with artefact lists and loose exit criteria ("Proceed when research supports comprehension", 4038), but no assessment panel make-up, no criteria to assess against, no scoring (met / not met), no report template, no reassessment rules and no guidance for assessors. | Add a Shared Channels service standard (a small number of numbered points, as in GOV.UK's 14) and an assessment chapter: when assessments happen, panel roles (including an Arabic content specialist and an accessibility specialist), evidence per point, outcome rules and a report template. |
| 22 | Major | Component index 902–939 | Component set mismatch. 15 specified components don't exist in the library, and 8 library components are unspecified (see section 3, table B). | Rebuild the index from the `sc-` library; mark planned components as "backlog" with priority. Do not specify components the team will not build this phase. |
| 23 | Major | Pattern "Components:" lines, e.g. 2906, 2949, 2992, 3036, 3079 | Each pattern names one or two "Custom Government …" components (for example "Custom Government Service Search and Service Result", "Custom Government Bilingual Journey State", "Custom Government Submission Guard"). About 50 such names appear; none is specified anywhere. | Map each pattern to real `sc-` components and to named page templates. Drop invented names or add them to the component backlog with an owner. |
| 24 | Major | C11 1490, 1501 | The error summary spec says to focus the summary and avoid the alert role. `COMPONENTS.md` specifies `sc-error-summary` with both `tabIndex=-1` focus and `role="alert"`, which double-announces in some screen readers. | Keep the draft's rule (focus, no alert role), which matches GOV.UK practice, and change `sc-error-summary`. Record the decision in both places. |
| 25 | Major | C14 1632–1652; P02 2927 | The service card spec requires eligibility, fee, time and a primary next step, and forbids a whole-card link. `sc-service-card` has title, entity attribution, optional channel chip and chevron, and the whole card is the link. | Decide which model is right (a list card that links to the service detail page is reasonable). Then align spec and component; move fees and eligibility to the service detail template. |
| 26 | Major | SC-042 446; Theme 835; C01 978; C05 1190; C26 2283 | Target size is inconsistent: "proposed default touch target" with "compact-control alternatives" (446) vs "minimum" (835, 978). CONVENTIONS makes 44×44 a minimum and primary controls 54px tall. | One rule: 44×44 CSS px minimum for every standalone target; 54px for primary buttons and fields; inline links assessed against WCAG 2.5.8 (24px or spacing). The staff "compact" table density (`sc-table`) is the only documented exception. |
| 27 | Major | 112, 116, 153, 157, 698, 4070 | The document's status is unclear and repeated: "proposed", "candidate", binding "only when adopted", budgets "requiring ratification". A delivery team cannot tell what they must do today. | Put status, version, authority and effective date in one box. Write rules as normative. List open decisions in an appendix, not inside rules. |
| 28 | Major | S04 305 (only rule) | No content design standard or style guide. Only SC-023 covers style. There are no rules for dates, times and time zones, numbers, currency (AED format and placement, the new dirham symbol), phone format (+971), capitalisation, button verbs, error message templates, or an A to Z. | Add a bilingual content style guide (English and Arabic side by side), with error message templates per input type. |
| 29 | Major | Absent (P08 3173–3211 is partial) | No "ask users for" patterns. Only names and contact are touched. Missing: Emirates ID number, passport number, nationality, date of birth, phone with country code, email, IBAN or bank details, vehicle plate, trade licence number, Makani number or address, sex or gender, equality information. | Add an "Ask users for" section with field formats, validation, error messages (EN and AR), autocomplete tokens and LTR handling per item. |
| 30 | Major | Absent (P02, P07, P16, P21 partial) | No page templates: service detail or start page, question page, check answers page, confirmation page, and error pages (page not found, problem with the service, service unavailable). P21 mentions a 404 in one sentence (3762). | Add page templates with layout, required content blocks, title format and `sc-page` usage. |
| 31 | Major | SC-086 762; P26 3964–4002 | Cookies and consent are generic. There is no cookie banner component, no default (non-essential off until chosen), no cookie page, no consent record and no rule for analytics before consent. | Add a cookie banner component and a cookies page pattern; set non-essential off by default, an equal-weight reject, and no tracking before consent. Have legal confirm the basis. |
| 32 | Major | S07 438–466; Theme 863 | No supported browser and assistive technology matrix. "Representative screen readers" (863) is not testable, and Arabic voices are not mentioned. | Publish a support matrix: browsers and versions, JAWS / NVDA with Arabic, VoiceOver macOS and iOS with Arabic, TalkBack with Arabic, Windows high contrast, zoom levels. |
| 33 | Major | Absent | No foundations chapter: colour, typography, spacing, grid and breakpoints, iconography, imagery, elevation, motion, dark mode, channel signatures. The design system tokens exist but the standard does not reference them. | Add a foundations chapter that documents each token group from `tokens/*.json`, with usage rules and build checks. |
| 34 | Major | 125, 4576–4588 | The document refers to companion artefacts (`theme.css` and `theme.schema.json`, `service-catalogue.schema.json`, `wcag-2.2-assessment.csv`, `wcag-component-pattern-map.csv`, `specification.json`, `handbook.html`, templates). None exist in the workspace. It also names three editions (Paper, HTML, PDF) without saying which one is canonical. | Remove references to artefacts that don't exist or create them. Name one canonical source (the published site or repository) and treat other formats as generated. |
| 35 | Minor | S05 359 | SC-094 sits out of numeric order inside S05 (after SC-031). It duplicates SC-028 (345) and the schema example (367). | Merge the three into one catalogue-record rule with the schema in an appendix. Renumber. |
| 36 | Minor | Sources 4563/4573, 4564/4574, 4569–4572; S13 734 | Reference list duplicates (LOCAL-GOVUK and S-LOCAL-GOVUK; LOCAL-WCAG and S-LOCAL-WCAG). The S-SHADCN entries are never cited. PROPOSAL is cited (734) but not defined. | Rebuild the bibliography with one entry per source and check that every citation resolves. |
| 37 | Minor | C19 1936 | Breadcrumb maps to WCAG 2.4.8 Location, which is Level AAA and outside the 55-criterion register. | Mark it AAA or remove it. |
| 38 | Minor | 85, 98, 4098 | Heading reads "WCAG 2 2 assessment register" (the dot is missing). | "WCAG 2.2 assessment register". |
| 39 | Minor | 173, 530, 546, 590, 732, 798, 802; 836, 1862, 2557, 2665, 2720, 2822 | US spellings mixed with UK: "behavior", "localize/localized". | Use UK English throughout ("behaviour", "localise"), except quoted WCAG titles such as "Use of Color". |
| 40 | Minor | 35 occurrences, e.g. 9, 608, 2459 | "UAE Pass" is used throughout. The brand is styled "UAE PASS" by its owner; "Dubai Pay" may be styled "DubaiPay". | Confirm the official brand styling (see section 7) and apply it consistently in EN and AR. |
| 41 | Minor | P04 3030–3032 | English "Continue with UAE Pass"; Arabic "المتابعة باستخدام الهوية الرقمية" ("Continue using the digital identity") omits the brand name. The provider prescribes its own button labels. | Use the provider's approved Arabic and English button assets and wording, not authored copy. |
| 42 | Minor | P05 3073–3075 | "Who are you acting for?" vs "نيابةً عن من تتقدم بالطلب؟" ("On behalf of whom are you applying?"): the meaning shifts from acting to applying, and "عن من" should be "عمّن". | Correct to a matched pair after Arabic review. |
| 43 | Minor | Theme 892 | "Paper token names use a --color-sc- prefix" conflicts with the token build (`--sc-*` in CSS; Paper output generated from DTCG). | Describe the actual naming from `build-tokens.mjs` outputs. |
| 44 | Minor | Theme 843 | "Base corner radius 0–12 CSS px" conflicts with radius tokens (field 14, card 20, panel 24, sheet 28, pill buttons). | Remove; document radii in the foundations chapter. |
| 45 | Minor | Theme 857 | "Decorative --border (#D1D5DB)" measures 1.47:1 on white and "--input (#6B778C)" hex values are shadcn variable names. | Replace with token names (`control`, `rule`) and OKLAB values from `color.json`. |
| 46 | Minor | Patterns, e.g. 2900–2902, 2943–2945 | Example strings float without a label or context ("Renew a trade licence" then the Arabic line). In a rendered page they look like stray text. | Present examples in a labelled bilingual example block (EN and AR side by side) or as a component screenshot. |
| 47 | Minor | S13 702, 706 | SC-076 is a MUST but phrased as a "target". There is no native app budget (cold start, app size, offline). | Make the web budget a release gate with a stated measurement source. Add native budgets when the kits phase starts. |
| 48 | Minor | S02 201, 209 | Research rules have no floor for people with access needs per round and no local recruitment guidance (Arabic-first participants, people of determination, low digital confidence, domestic workers, visitors). | Add a minimum (for example, every round includes participants with access needs and Arabic-first users) and point to the UAE recruitment route. |
| 49 | Minor | C09 1387 | Calendar system is left open ("agree Gregorian/local calendar requirements with the service"). No Hijri rule. | Decide: Gregorian by default; Hijri shown alongside only where a service's legal basis requires it (verify for Justice). |
| 50 | Minor | SC-023 305; P19 3665 | Time zone rules appear only for appointments. | Make it global: show Dubai time (Gulf Standard Time, UTC+4, no daylight saving) on all deadlines and times, in both languages. |
| 51 | Minor | C36 2782–2826 | A toast component is specified, then restricted so heavily it is barely usable. GOV.UK avoids toasts. | Drop from the core library or move to backlog; use `sc-callout` for outcomes. |
| 52 | Minor | Contents 15–102 | The table of contents is a flat list of 86 items with no grouping. | Group into parts (standard, foundations, components, patterns, assurance, appendices). |
| 53 | Minor | P06 3104 vs C18 1856 and SC-032 386 | P06 says not to expose a language choice for an incomplete translation. C18 has an "unavailable-translation explanation" variant. SC-032 treats missing translation as a release defect. These three conflict. | One rule: no service goes live with incomplete translation (SC-032). Remove the other two cases. |
| 54 | Minor | C18 1845 vs P06 3123 | The language control is "semantic navigation + links" in C18 but "Button or semantic links" in P06. | It is a link to the equivalent page (as `sc-language-switch` does). State that once. |
| 55 | Minor | Channel table 139 | Dubai Justice is described as serving "judges". It isn't clear whether internal staff tools are in scope. | State scope: public and professional-facing interfaces only, or include staff tools with the compact density. |
| 56 | Minor | SC-044 454 | An accessibility statement is required but there is no template or required headings. | Provide a bilingual accessibility statement template. |

Counts: 4 Blocker, 30 Major, 22 Minor (56 findings).

---

## 3. Contradictions with current decisions

### A. Decision contradictions

| # | Decision | Line | Quote | Fix |
| --- | --- | --- | --- | --- |
| C1 | StencilJS `sc-` web components | 7 | "shadcn/ui white label foundation" | "Shared Channels web components (`sc-`)" |
| C2 | StencilJS | 114 | "The later project instruction establishes shadcn/ui as the white-label component foundation." | Delete; state the StencilJS decision once in the status box |
| C3 | StencilJS | 518 | "Use shadcn/ui as the user-requested white-label web component foundation" | Rewrite S09 around `CONVENTIONS.md` |
| C4 | StencilJS | 832 | "chosen primitive base (Base UI or Radix), dependency lockfile, icon library, framework" | Replace with: `sc-` library version, tokens version, framework wrapper used (if any) |
| C5 | StencilJS | 900 | "Use the named shadcn primitives where available" | "Use the named `sc-` component" |
| C6 | StencilJS | 939 | "C36 · Supplementary toast · Sonner" | Drop or move to backlog |
| C7 | StencilJS, framework-agnostic | 4588 | "It does not include production React components" | Refer to the `sc-` package and its React/Angular/Vue wrappers (later) |
| C8 | Channel is the theme | 526 | "Allow approved overrides for brand colours, typography families, logo assets, corner radii" | Channels select a signature from tokens; entities never theme |
| C9 | Channel is the theme | 546 | "An entity changes primary brand and font tokens" | Replace with a channel example (`data-channel="transport"`) |
| C10 | Channel is the theme | 838–843 | "Entities may theme … Brand primary/hover/active colours … body font families … Base corner radius 0–12" | Replace with "Entities get attribution only" |
| C11 | OKLAB only | 857, 871–890 | "#D1D5DB", "#6B778C", reference palette table in hex | Remove; reference OKLAB tokens |
| C12 | No DDS teal | 881, 882 | "Green hover … #00553a", "Green active … #00452f" (OKLCH hue ≈ 164°) | Delete; tokens pass `check:teal` |
| C13 | Dubai Font, tight leading | 854 | "1.6 minimum body line-height" | Latin body about 1.4×, Arabic body 1.5–1.6× |
| C14 | Dubai Font | 842, 848 | "Latin and Arabic body font families …", "Alternative typeface requires …" | Dubai Font only |
| C15 | Separate Latin and Arabic scales | 842 | "body sizes may increase from 18px English and 20px Arabic" | Use token scales (Latin body-l 19, body-m 17; Arabic body-l 20, body-m 19) |
| C16 | Latin digits in Arabic | 402 | "Accept Arabic-Indic and Western digits … normalise for processing" (no output rule) | Add the Latin-digit output rule |
| C17 | Mobile: Flutter and RN, kits deferred | 834 | "native apps must reproduce the behavioural and accessibility contracts through platform-native accessible controls" | Add phasing from `MOBILE.md` |
| C18 | Dark mode in tokens | 849 | "No dark theme is supplied in this release." | Dark mode supported |
| C19 | Focus ring per CONVENTIONS | 857 | "Focus is a locked yellow-and-black dual indicator." | 3px channel-action ring, 2px offset |
| C20 | Tokens are DTCG, `--sc-*` | 892 | "Paper token names use a --color-sc- prefix … code uses native shadcn variable names such as --primary" | Describe `--sc-*` outputs |
| C21 | Radius tokens | 843 | "Base corner radius 0–12 CSS px" | Radius tokens (14 / 20 / 24 / 28 / pill) |
| C22 | Current `sc-error-summary` | 1501 | "avoid double announcements from unnecessary alert role" | Keep the rule; change the component (it uses `role="alert"`) |
| C23 | Current `sc-service-card` | 1651, 2927 | "avoid nested interactive whole-card links"; "Cards MUST use one clear title link" | Align with the component's whole-card link, or change the component |

### B. Component index against the `sc-` library

| Draft component | `sc-` equivalent | Status |
| --- | --- | --- |
| C01 Action button | `sc-button` | Exists |
| C02 Text link | `sc-link` | Exists |
| C03 Text field | `sc-text-input` | Exists |
| C04 Long text | `sc-textarea` | Exists (character count included) |
| C05 Checkbox group | `sc-checkbox-group`, `sc-checkbox` | Exists |
| C06 Radio group | `sc-radio-group`, `sc-radio` | Exists |
| C07 Select | `sc-select` | Exists (native select, as the draft prefers) |
| C08 Searchable combobox | none | Missing (needed for nationality, area, activity lists) |
| C09 Date entry | `sc-date-input`; calendar variant is `sc-date-range` | Exists; single-date calendar picker not covered |
| C10 Document upload | none | Missing (high priority) |
| C11 Error summary | `sc-error-summary` | Exists (alert-role conflict, C22) |
| C12 Information and warning banner | `sc-callout` | Partial: no page-level notification banner or service-interruption variant |
| C13 Status tag | `sc-status-tag` | Exists |
| C14 Service card | `sc-service-card` | Exists, different anatomy (C23) |
| C15 Review summary list | `sc-summary-list`, `sc-summary-row` | Exists |
| C16 Application task list | none | Missing |
| C17 Channel header and navigation | `sc-app-bar` (+ `sc-channel-hero`) | Partial: no main navigation, mobile menu or account state |
| C18 Language navigation | `sc-language-switch` | Exists |
| C19 Breadcrumb | none | Missing |
| C20 Skip and back navigation | `sc-skip-link`, `sc-back-link` | Exists |
| C21 Footer | `sc-footer` | Exists |
| C22 Modal dialog and drawer | none | Missing (bottom sheet radius token exists) |
| C23 Destructive confirmation | none | Missing (could be a confirmation page pattern rather than a dialog) |
| C24 Accordion and disclosure | none | Missing ("details" is needed for help text) |
| C25 Tabs | none | Missing |
| C26 Pagination | none (prev/next in `sc-table` footer) | Missing as standalone |
| C27 Data table | `sc-table` | Exists (spec in `specs/sc-table.md`) |
| C28 Empty state | none | Missing |
| C29 Loading and progress | `sc-spinner` | Partial: no progress bar or skeleton |
| C30 UAE PASS handoff | none | Missing (MOBILE.md asks whether to wrap the provider modules) |
| C31 Dubai Pay amount and handoff | none | Missing |
| C32 Address and location | none | Missing |
| C33 Service search and filters | `sc-search` | Partial: no filters |
| C34 Completion and receipt panel | none | Missing (GOV.UK "panel" equivalent) |
| C35 Session timeout warning | none | Missing |
| C36 Supplementary toast | none | Missing; recommend not building |

Library components the draft does not specify: `sc-channel-chip` (cross-channel listing, which directly supports SC-014), `sc-channel-hero`, `sc-card`, `sc-page`, `sc-container`, `sc-grid` (page shell and layout), `sc-ltr` (bidi isolation), `sc-step-progress` ("Step 2 of 4"; P25 asks for real step progress but names no component), and `sc-date-range`.

Missing from both (GOV.UK and local needs): phase banner, cookie banner, notification banner, inset text, warning text, details, exit-this-page control (P22 has no component), verification code (OTP) input, phone number with country code, amount input with AED, Emirates ID and plate inputs (could be `sc-text-input` presets).

---

## 4. Gaps against GOV.UK

1. **Design principles.** GOV.UK has 10 principles. Add 6–10 Shared Channels principles (for example, "Arabic and English are equals", "One service, many front doors", "Never leave someone unsure if they've paid").
2. **Service standard.** Add a numbered service standard (about 10–14 points) that assessments test against. The current 94 SC rules are too granular for this role.
3. **Service assessment process.** Panel make-up, timing (alpha, beta, live), evidence per point, met / not met outcomes, report template, reassessment and appeal routes.
4. **Research with users with access needs.** Recruitment routes in the UAE, consent in Arabic and English, paying participants, assistive technology in Arabic, minimum inclusion per round, people of determination.
5. **Content design and style guide (English and Arabic).** Voice and tone, plain language, reading level, A to Z, dates, times, numbers, money, phone numbers, capitalisation, links, buttons, error message templates.
6. **Arabic plain-language rules.** Register, gender of address, sentence length, avoiding legalistic Arabic, transliteration, glossary ownership.
7. **Foundations.** Colour (OKLAB, channels, dark mode), typography (Dubai Font, two scales), spacing, layout and grid, icons, imagery, motion, elevation.
8. **Page templates.** Start / service detail page, question page, check answers, confirmation, task list page, error pages (404, 500, service unavailable), cookie page, accessibility statement page.
9. **"Ask users for" patterns.** Names, Emirates ID, passport, nationality, dates of birth, addresses (Makani, emirate, area), email, phone, bank details (IBAN), plate numbers, trade licence numbers, sex or gender, equality information, payment card (handed to Dubai Pay).
10. **Question pages.** Covered partly by P07 (3129–3167); add page layout, heading-as-label rule, one-thing-per-page guidance with examples.
11. **Start pages.** P02 (2912–2949) covers the logic; add the template and what goes "before you start".
12. **Check answers.** P14 (3436–3474) is good; add a template using `sc-summary-list`.
13. **Confirmation pages.** P16 (3524–3562) is good; add the panel component and wording rules (received vs approved).
14. **Task lists.** C16 and P25 exist; build the component and add a template.
15. **Error handling.** Validation (P07) is covered; add error message templates per field type in both languages and the page-level error pages.
16. **Cookies and consent.** Cookie banner component, cookies page, defaults, consent storage. See finding 31.
17. **Timeouts and session handling.** C35 and P13 are good on WCAG 2.2.1; add the recommended timeout values and the UAE PASS session relationship once verified.
18. **Offline and poor connectivity on mobile.** P21 covers web; add app behaviour (queued actions, offline indicators) for the native phase.
19. **Sign in and save-and-return.** P04 and P12 cover them; add account area pattern ("Your applications"), signing out, and shared-device guidance.
20. **Multi-language switching rules.** S06 and P06 are good; consolidate into one rule set, including URL structure (`/ar/`, `/en/`), `hreflang`, and what happens to user-entered text.
21. **Arabic typography and bidi.** See findings 16–18.
22. **Supported browsers and assistive technology.** See finding 32.
23. **Accessibility statement template.** See finding 56.
24. **Performance and native budgets.** Native budgets for the kits phase.
25. **Notifications (email, SMS, push).** P18 covers preferences; add templates for message content, sender names, bilingual SMS length (Arabic SMS uses UCS-2, 70 characters per segment), and link safety.
26. **Contribution model.** SC-091 (800–802) states the rule; add the process (proposal, research, review, publish) as GOV.UK's "Community" pages do.
27. **Versioning and changelog.** SC-090 (796–798) states the rule; add a published changelog and deprecation policy for `sc-` components and tokens.
28. **Channel-specific guidance.** How each of the seven channels applies the standard (signature colour, hero, audiences), and cross-channel listing with `sc-channel-chip`.

---

## 5. Keep list (carry into the rebuild)

| Material | Lines | Why keep |
| --- | --- | --- |
| Channel and ownership model: entity owns the service, channel makes it findable | 131–145 | Matches the channel-theming decision and frames cross-listing well |
| Canonical service record, one ID across channels, no duplicate transactions | SC-012 to SC-017, 241–261 | Core to the seven-channel model; testable |
| Catalogue schema fields | 361, 367 | Good basis for a schema appendix (merge with SC-028) |
| Task-led service naming, bilingual titles created together | SC-018 to SC-024, 283–309 | Strong, practical, GOV.UK-grade |
| Fee and timing honesty ("free", "varies", "not yet confirmed"; form time vs processing time) | SC-027, SC-029, 339–349 | Distinctive and user-protective |
| Language parity as a release defect; switch keeps state | SC-032, SC-033, 384–390 | Exactly the "equals" principle |
| Do not mirror logos, maps, photos, media controls or ordered identifiers | SC-035, 396–398 | Correct; fold into the RTL chapter |
| No flags for languages; each language in its own script | C18, 1860 | Correct and often missed |
| Honest accessibility statement; no conformance claims from components or automated scores | SC-044, 452–454; 836 | Mature stance |
| WCAG 2.2 register: 55 A/AA criteria with summaries, checks and links; 4.1.1 excluded | 4098–4550 | Accurate (checked); keep as an appendix |
| Timing rules: 20 seconds, ten extensions, "security is not an automatic exception" | C35 2751–2753; P13 3408; 4296 | Accurate and often misunderstood |
| Identity rules: defer sign-in, preserve return, authentication is not authority | SC-064 to SC-069, 612–634; P04 3009 | Strong; keep in the UAE PASS pattern |
| Representation and acting for others | P05, 3042–3079 | Important for Justice, Build, Invest, Trade; well thought through |
| Payment integrity: server-side verification, idempotency, never offer a fresh charge while unknown, payment ≠ approval | SC-070 to SC-075, 656–678; P15 3486–3505 | Excellent; carry nearly verbatim |
| Confirmation wording: "received" vs "complete" | C34 2699; P16 3539 | Keep in the content guide |
| Document upload rules: native picker, transfer vs accepted vs approved, keep good files on failure | P10, 3265–3286; C10 1440–1442 | Strong and testable |
| Add another / repeating items | P11, 3305–3343 | Good; carry into patterns |
| Save and resume: never show "Saved" before the server confirms; resume re-establishes identity | P12, 3364–3368 | Strong |
| Address: no mandatory postcode, maps never the only way, non-drag pointer alternative | P09, 3232–3236 | Correct and locally relevant |
| Quick exit, honest about its limits | P22, 3788–3826 | Good; keep for sensitive services |
| Professional data tables and bulk actions | P23, 3832–3870 | Complements `sc-table`; keep |
| Cross-channel continuation rules | P24, 3876–3914 | Central to the initiative |
| Failure taxonomy (validation, access, missing page, outage, uncertain transaction) | P21, 3748 | Good framing for error pages |
| Recovery-state tables in every pattern | e.g. 2889–2893, 3501–3505 | A distinctive strength; keep the format |
| Constrained network profile and Core Web Vitals thresholds | SC-076, SC-078, 702–710 | Accurate and reproducible |
| Governance roles table | 4010–4020 | Clear accountability; keep |
| Exception management (owner, expiry, 90 days, severity by effect on people) | SC-092, 806; 4067–4073 | Mature; keep |
| Outcome measures table | 4081–4092 | Good basis for a performance chapter |
| Component rule: Change links name their question; Completed means persisted and valid | C15 1714; C16 1757 | Small, precise rules worth keeping |
| Asia/Dubai time zone on appointments | P19 3665 | Keep and make global |

---

## 6. Recommended restructure

Target length: a standard of about 1,000–1,500 lines, with components and patterns as linked pages (one page each) in the design system site. Every rule appears once.

| # | New section | Contents | Source in draft | Action |
| --- | --- | --- | --- | --- |
| 0 | Status and authority | Issuing body, version, effective date, how to read MUST/SHOULD, open decisions | 1–11, 108–125, S01 151–185 | Rewrite (shorter; no drafting artefacts) |
| 1 | Principles | 6–10 Shared Channels design principles | none | New |
| 2 | Service standard | 10–14 numbered points that assessments test | S02, S10–S15 condensed | New (draws on existing rules) |
| 3 | Channels and services | Seven channels, audiences, canonical service record, naming, cross-listing | 131–145, S03, S04, S05 | Keep and merge |
| 4 | Legal and policy context | UAE and Dubai instruments, data protection position, accessibility law, provider contracts | none (fragments in S14) | New (with legal counsel) |
| 5 | Arabic and English | Parity, switching rules, URLs, content parity, RTL, bidi, digits, icon mirroring, Arabic typography | S06, scattered RTL lines, C18, P06 | Rewrite into one chapter |
| 6 | Accessibility | WCAG 2.2 AA baseline, support matrix, testing method, statement template | S07 | Rewrite (add matrix and template) |
| 7 | Platforms | Web, Flutter, React Native, native modules, WebView; phasing per `MOBILE.md`; WCAG2ICT | S08 | Rewrite |
| 8 | Foundations | Colour (OKLAB, channels, dark), type (Dubai Font, two scales), space, layout, radius, elevation, motion, icons, imagery | Theme contract 828–892 | Drop draft content; new from tokens |
| 9 | Content design | Voice, style guide EN and AR, A to Z, error message templates, status vocabulary | S04 SC-023, status lists | New |
| 10 | Components | Index of `sc-` components, each a linked page in the COMPONENTS.md format; backlog list | 898–2826 | Drop draft specs; rebuild from library; keep a handful of precise rules |
| 11 | Page templates | Service detail, question, check answers, confirmation, task list, error pages, cookies, accessibility statement | P02, P07, P14, P16, P21 fragments | New |
| 12 | Patterns: ask users for | Names, IDs, nationality, dates, addresses, contact, bank details, plates, licences | P08, P09 | New, keeping P08/P09 rules |
| 13 | Patterns: journeys | Find, understand and start, eligibility, sign in (UAE PASS), act for others, questions and errors, upload, add another, save and return, timeout, check answers, pay (Dubai Pay), confirmation, tracking, notifications, appointments, help, failures, quick exit, data tables, cross-channel | P01–P26 | Keep (trim duplication with S-rules; real `sc-` components) |
| 14 | Privacy, security and consent | Data minimisation, question protocol, cookies, consent, assisted service safeguards | S10 SC-057, S14, P26 | Rewrite |
| 15 | Performance and resilience | Budgets, constrained testing, progressive enhancement, availability | S13 | Keep, tighten |
| 16 | Assurance | Roles, assessments, gates, exceptions, measures | S15, 4008–4092 | Keep and extend (panel, scoring, report template) |
| 17 | Contributing and versioning | Contribution process, changelog, deprecation | SC-090, SC-091 | Rewrite |
| A | Appendix: WCAG 2.2 register | 55 criteria | 4098–4550 | Keep |
| B | Appendix: catalogue schema | Fields and status | 361, 367 | Keep |
| C | Appendix: bibliography | One entry per source | 4556–4574 | Rewrite |
| — | Handoff contents list | — | 4576–4588 | Drop |
| — | SC-004 (UK things not to copy) | — | 167–169 | Drop |

---

## 7. Items to verify

These could not be confirmed from the workspace and should be checked with the owners or counsel before the rebuild relies on them.

1. **WCAG 2.2 edition date.** Line 4566 says the published edition is dated 12 December 2024. I believe W3C republished WCAG 2.2 with corrections on that date (original Recommendation 5 October 2023). Verify.
2. **WCAG2ICT URL.** Line 4567 cites `https://www.w3.org/TR/wcag2ict-22/`. Verify that this is the current Group Note URL and title.
3. **UAE PASS brand styling and button assets.** The draft writes "UAE Pass" 35 times. Verify the official styling (believed to be "UAE PASS"), the approved Arabic name ("الهوية الرقمية" is used at 3032), and the provider's mandated button labels and assets.
4. **Dubai Pay brand styling.** Verify "Dubai Pay" vs "DubaiPay", and the owner's integration guidelines (status callbacks, refund states, supported methods). SC-072 and P15 assume statuses (pending, unknown, refunded) that must match the real integration.
5. **Data protection position.** The draft cites no law. Verify which instruments apply to these channels: Federal Decree-Law No. 45 of 2021 (PDPL) and its scope for government entities; Dubai Law No. 26 of 2015 (Dubai Data Law) and related policies; any Digital Dubai data-sharing or privacy policy; DIFC and ADGM rules where relevant.
6. **Accessibility law and policy.** Verify the applicable instruments: Federal Law No. 29 of 2006 (rights of people of determination) as amended; Dubai Law No. 2 of 2014 (rights of people of determination in Dubai); any Digital Dubai or TDRA web accessibility policy or mandated WCAG level; the Dubai Universal Design Code.
7. **TDRA and the UAE Design System.** Verify whether federal design-system or digital-experience guidelines apply to Dubai channels, and whether the Shared Channels standard must reference or align with them.
8. **Information security baseline.** Verify whether the Dubai Electronic Security Center (DESC) Information Security Regulation or UAE IA standards apply, so S14 can reference them instead of generic wording.
9. **Terminology.** Confirm the use of "people of determination" in official Dubai government content, and any approved Arabic glossary (for example, for service, application, fee, entity).
10. **New dirham symbol.** The Central Bank of the UAE introduced a new dirham symbol in 2025. Verify its official status, Unicode support and whether services must use it in place of "AED" / "درهم".
11. **Calendar.** Verify whether any service (Justice in particular) must show Hijri dates.
12. **Arabic SMS segment length.** Verify the operator limits for Arabic SMS (UCS-2, commonly 70 characters per segment) before setting notification rules.
13. **Channel scope and audiences.** The channel table (137–143) is labelled "a proposed starting taxonomy". Verify audiences and categories with each channel owner, and whether staff-facing tools (for example, judges in Dubai Justice) are in scope.
14. **Issuing authority.** Line 153 refers to "the designated Dubai authority". Confirm the body that will adopt and own the standard.
15. **Companion artefacts.** Confirm whether `theme.schema.json`, `service-catalogue.schema.json`, the WCAG CSVs, `specification.json` and `handbook.html` (4578–4586) exist anywhere outside this workspace; none were found here.
16. **GOV.UK naming page.** Line 4565 cites the GOV.UK Service Manual "Naming your service" page. The page exists; keep the citation only if it is still current at publication.

Checked and confirmed (no action needed): the 55 A/AA criteria and their levels in the register (including 3.2.6 and 3.3.7 at Level A, and 2.4.11, 2.5.7, 2.5.8 and 3.3.8 at AA); 31 AAA criteria, 86 in total, with 4.1.1 obsolete; the 2.2.1 timing values; the 1.4.10, 1.4.12 and 2.5.8 values; the Core Web Vitals thresholds (LCP 2.5 s, INP 200 ms, CLS 0.1); the throttling profile (1.6 Mbps / 750 Kbps / 150 ms); all 18 contrast ratios in the reference palette table (recomputed, all match); Asia/Dubai as the time zone.
