# Shared Channels User Experience Standard

| | |
| --- | --- |
| Version | 2.0 |
| Status | Draft for review |
| Date | 22 October 2026 (updated to the built design system v2 library) |
| Replaces | Proposed Standard 1.0 (19 October 2026) |
| Owner | Shared Channels design system team, on behalf of the issuing authority (see [OQ-14](#open-questions)) |

This standard sets out how Dubai government services are designed, built and assessed across the seven Shared Channels. It applies to every service a channel lists, in Arabic and English, on the web and in the channel apps.

<a id="contents"></a>

## Contents

**Part 1. The standard**

0. [About this standard](#about)
1. [Principles](#principles)
2. [Service standard](#service-standard)
3. [Channels and services](#channels)
4. [Legal and policy context](#legal)

**Part 2. Foundations**

5. [Arabic and English](#arabic-english)
6. [Accessibility](#accessibility)
7. [Platforms](#platforms)
8. [Visual foundations](#foundations)
9. [Content design](#content)

**Part 3. Components, templates and patterns**

10. [Components](#components)
11. [Page templates](#templates)
12. [Ask users for](#ask)
13. [Journey patterns](#patterns)

**Part 4. Operating the service**

14. [Privacy, security and consent](#privacy)
15. [Performance and resilience](#performance)
16. [User research](#research)
17. [Assurance](#assurance)
18. [Contributing and versioning](#contributing)
19. [Open questions](#open-questions)

**Appendices**

- [A. WCAG 2.2 register](#appendix-wcag)
- [B. Catalogue record](#appendix-catalogue)
- [C. Accessibility statement template](#appendix-statement)
- [D. Assessment report template](#appendix-report)
- [E. Bibliography](#appendix-bibliography)

---

<a id="about"></a>

## 0. About this standard

<a id="status"></a>

### 0.1 Status and authority

This is version 2.0, a draft for review. It is not yet binding. It becomes binding on the date the issuing authority adopts it; the issuing authority is still to be confirmed ([OQ-14](#open-questions)). Until then, delivery teams use it as the target they will be assessed against.

Version 2.0 is a rewrite. It keeps the service behaviour rules of version 1.0 and replaces its technical foundation: the component library is now the Shared Channels web component library (`sc-`), theming is by channel, and every colour is defined in OKLAB. Its visual foundations follow design system v2 ([8](#foundations)).

The canonical source is this Markdown file in the design system repository (`design-system/docs/shared-channels-ux-standard.md`). Any HTML, PDF or Paper edition is generated from it or must match it. Where an edition disagrees, this file wins.

<a id="scope"></a>

### 0.2 Scope

The standard applies to:

- every public-facing and professional-facing service listed on a Shared Channel, whichever entity owns it
- websites, mobile web, hybrid apps and WebView screens, and the native channel apps
- everything a user meets during the service: identity and payment handoffs, uploaded documents, confirmation messages, emails, SMS and push notifications, and assisted routes

Staff-only tools (for example, case management screens used by court staff) are in scope when a channel delivers them through Shared Channels. They use the same rules, with the compact table density described in [10.2](#component-index). Whether staff tools are in scope for each channel is to be confirmed with channel owners ([OQ-13](#open-questions)).

<a id="keywords"></a>

### 0.3 How to read the requirements

Requirement keywords are used in their [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119) sense:

| Keyword | Meaning |
| --- | --- |
| MUST, MUST NOT | An absolute requirement. A service that does not meet it fails assessment against the point it belongs to, unless an [exception](#exceptions) is in force. |
| SHOULD, SHOULD NOT | The expected approach. A team may depart from it only with a recorded reason, which the assessment panel reviews. |
| MAY | Optional. |

Each requirement has an identifier (for example **LANG-04**) so that teams, suppliers and assessors can refer to it in tickets, contracts and reports. Each rule appears once; other sections link to it.

Every chapter ends with **How we check**: the evidence a service team shows and what an assessment panel does to confirm it.

<a id="relationship"></a>

### 0.4 How this standard relates to the design system

The standard says what a service must achieve. The design system supplies the means:

| Layer | Source | What it holds |
| --- | --- | --- |
| Tokens | `design-system/tokens/*.json` (W3C Design Tokens format) | Colour, type, space, radius, size, elevation, motion, layout |
| Foundations | `design-system/docs/v2/foundations.md` | Every token value, how the palettes are generated, and the measured contrast of every colour pair |
| Components | `design-system/components/` (StencilJS web components, `sc-` prefix) | Each component's anatomy, behaviour, states, Arabic behaviour, budget and tests in `components/specs/<tag>.md`, and its API in its `readme.md` |
| Conventions | `design-system/components/CONVENTIONS.md` | Rules every component follows |
| Mobile | `design-system/MOBILE.md` | What each kind of mobile team uses, and when |

When this standard names a token, it uses the CSS custom property name (for example `--sc-color-on-surface`). When it names a component, it uses the tag (for example `sc-button`). A component marked **planned** does not exist yet.

The standard adapts the approach of the GOV.UK Service Manual and GOV.UK Design System to Dubai. It does not adopt UK law, UK branding or UK platforms.

### How we check

- The service's assessment report names the standard version it was assessed against.
- Each exception the service relies on is recorded in the exception register with its requirement identifiers.

---

<a id="principles"></a>

## 1. Principles

These principles explain the rules that follow. When a rule does not cover a situation, use the principle.

1. **Start with the task, not the entity.** People come to do something: renew a vehicle registration, pay a fine, apply for a building permit. Name and structure services around that task, not around the government structure behind it.
2. **Arabic and English are equals.** Neither language is a translation of the other. Both get the same content, the same quality and the same care in typography and wording.
3. **One service, many front doors.** A service can appear on several channels. It is still one service, with one record, one set of facts and one transaction.
4. **Never leave someone unsure whether it worked.** After a submission or a payment, people must know exactly what happened, what did not happen and what to do next.
5. **Design for everyone.** Include people of determination, older people, people with low digital confidence, visitors and people on low-cost phones from the start, not as an afterthought.
6. **Ask once, reuse safely.** Do not ask for information the government already holds or the user has already given in the same journey, unless there is a recorded reason.
7. **Be honest about what we know.** Show fees, timings and statuses only when they are confirmed. Say "varies" or "we are checking" when that is the truth.
8. **Shared by default.** Use the shared components, patterns and tokens. When they do not meet a need, improve them for everyone rather than building a local copy.

### How we check

Principles are not assessed on their own. The panel uses them to judge situations that no requirement covers, and records in the report which principle it applied.

---

<a id="service-standard"></a>

## 2. Service standard

A service is assessed against these 12 points at each phase (see [17.2](#assessments)). Each point lists the chapters that hold its detailed requirements. The panel records each point as **met** or **not met**.

| # | Point | The team shows that it… | Detailed in |
| --- | --- | --- | --- |
| 1 | Understand users and their needs | Has researched the people who use the service, in Arabic and English, including people of determination and people who need help | [16](#research) |
| 2 | Solve a whole problem | Has mapped the whole journey, across channels and entities, from finding the service to receiving the outcome, and named an owner for each handoff | [3](#channels), [13.21](#pat-cross-channel) |
| 3 | Make the service simple to use | Uses task-led names, one thing per page where it helps, the shared templates and plain language | [9](#content), [11](#templates), [13](#patterns) |
| 4 | Treat Arabic and English as equals | Ships both languages together with equal content, typography and behaviour | [5](#arabic-english), [9.3](#arabic-style) |
| 5 | Make sure everyone can use the service | Meets WCAG 2.2 AA across the whole journey and offers assisted routes | [6](#accessibility), [13.17](#pat-help) |
| 6 | Use the shared system | Uses `sc-` components, generated tokens and the channel theme, and contributes improvements back | [8](#foundations), [10](#components), [18](#contributing) |
| 7 | Be findable from every relevant channel | Has one canonical service record that every channel listing resolves to | [3.4](#service-record) |
| 8 | Handle identity and payment safely | Uses UAE PASS and Dubai Pay through the providers' official integrations, never shows success before the server confirms it, and prevents duplicate transactions | [13.4](#pat-sign-in), [13.12](#pat-pay) |
| 9 | Protect privacy and security | Collects only what it needs, explains why, and secures what it holds | [14](#privacy) |
| 10 | Work on every device and connection | Meets the performance budgets and works on the supported browsers, assistive technologies and app platforms | [6.4](#support-matrix), [7](#platforms), [15](#performance) |
| 11 | Have accountable owners and a capable team | Has a named service owner and access to user research, design, Arabic and English content design, accessibility and engineering skills | [17.1](#roles) |
| 12 | Measure, operate and improve | Measures the outcomes in [17.5](#measures), runs support and incident processes, and improves the service from what it learns | [15](#performance), [17.5](#measures) |

### How we check

The panel assesses each point against the evidence listed in [17.2](#assessments) and the "How we check" sections of the chapters it links to, and records it in the report ([Appendix D](#appendix-report)).

---

<a id="channels"></a>

## 3. Channels and services

<a id="seven-channels"></a>

### 3.1 The seven channels

An entity owns a service and is accountable for its outcome. A channel makes services findable and hosts the journey. The channel names are fixed; the audiences and categories below are the working taxonomy and are to be confirmed with each channel owner ([OQ-13](#open-questions)).

| Channel | Arabic name | `data-channel` | Main audiences | Example services |
| --- | --- | --- | --- | --- |
| Dubai Now | دبي الآن | `now` | Residents and citizens | Pay water and electricity bills; get a good conduct certificate |
| Dubai Transport | مواصلات دبي | `transport` | Drivers, vehicle owners, transport operators | Renew vehicle registration; pay a traffic fine |
| Visit Dubai | زوروا دبي | `visit` | Visitors and event organisers | Get a permit to hold an event |
| Dubai Justice | عدالة دبي | `justice` | Parties to cases, lawyers, legal professionals | Check a court case status; pay a court fee |
| Build in Dubai | ابنِ في دبي | `build` | Developers, consultants, contractors | Apply for a building permit; book a building inspection |
| Invest in Dubai | استثمر في دبي | `invest` | Founders, investors, company representatives | Apply for a trade licence; renew a trade licence |
| Dubai Trade | دبي التجارية | `trade` | Importers, exporters, logistics companies | Submit a customs declaration |

These are the official Arabic channel names. The components take them from one file (`src/i18n/components/channel-names.ts`), so the app bar, channel switcher, footer and network strip always agree with this table. Use them as they are; do not translate channel names afresh.

<a id="channel-theme"></a>

### 3.2 The channel is the theme

- **SVC-01** (changed in v2). Every page and app screen MUST set exactly one channel, the channel the user is in, through `data-channel` (on the web, `sc-page channel="…"` sets it on the page root). Components read the channel roles defined in [8.1](#colour); none of them names a channel, except those that point to other channels: `sc-channel-chip`, the channel switcher (`sc-channel-switcher`), the footer's Channels group, the channel network strip (`sc-channel-network`, [11.9](#tpl-chrome)) and the rows of `sc-step-list` that belong to another channel.
- **SVC-02.** Government entities MUST NOT supply or override colours, fonts, radii, logos in the header, or any other token. An entity appears only as attribution text, written in full in both languages (for example "Roads and Transport Authority" / "هيئة الطرق والمواصلات"), as `sc-service-card` shows it.
- **SVC-03** (changed in v2). A page MUST NOT mix channel themes. The only exceptions are the components named in SVC-01, which show another channel's colours to point to that channel, by setting `data-channel` on themselves ([FND-26](#colour)).

<a id="naming"></a>

### 3.3 Naming services

- **SVC-04.** A service name MUST describe the task as a verb and an object, in the words users search for: "Renew vehicle registration", "Pay a traffic fine", "Apply for a building permit".
- **SVC-05.** A service name MUST NOT be an entity name, a programme or campaign name, a system name or an internal code. Formal names and codes are stored as search synonyms.
- **SVC-06.** Different user intentions with different journeys (apply, renew, check status) MUST have separate names and records. Related tasks are grouped on a topic page.
- **SVC-07.** The Arabic and English names MUST be written together, by Arabic and English content designers, and MUST describe the same action, scope and outcome. Arabic names use a verbal noun: "تجديد ترخيص المركبة", "دفع مخالفة مرورية", "التقدّم بطلب رخصة بناء".
- **SVC-08.** The English name SHOULD be 65 characters or fewer.
- **SVC-09.** Names MUST be tested with users before launch (search-term analysis and a comprehension test), and former names, common misspellings and transliterations MUST be kept as synonyms.

| Avoid | Use | Arabic |
| --- | --- | --- |
| Commercial licensing renewal services portal | Renew a trade licence | تجديد الرخصة التجارية |
| CMS case enquiry | Check a court case status | الاستعلام عن حالة قضية |
| Vehicle licensing | Renew vehicle registration | تجديد ترخيص المركبة |

<a id="service-record"></a>

### 3.4 One canonical service record

- **SVC-10.** Each service MUST have one canonical record ([Appendix B](#appendix-catalogue)) with one stable identifier, one accountable service owner, one owning entity and one canonical start URL per platform.
- **SVC-11.** A service listed on more than one channel MUST resolve to the same record, the same facts (fees, eligibility, documents, timings) and the same transaction. Channels MUST NOT create duplicate transactions or channel-specific fees.
- **SVC-12.** Classification MUST be stored separately from the name: primary and secondary categories, audiences, life or business events, synonyms, owning entity and the channels that list it.
- **SVC-13.** When a service appears in more than one channel, the decision about where it is primary MUST be recorded by the content and taxonomy lead. Secondary listings use `sc-channel-chip` to point to the other channel ("Also on Dubai Transport" / "متوفر أيضًا في مواصلات دبي").
- **SVC-14.** Taxonomy changes MUST be made centrally with redirects. A retired service identifier MUST resolve to its replacement or to a page that explains what replaced it.
- **SVC-15.** Fees, eligibility, documents and timings MUST come from the record and MUST be confirmed by the service owner before publication. Where a value is not confirmed, the page says so ([9.4](#style-guide), "Fees and timings").

### How we check

- The catalogue rejects a record without an identifier or owner; the team shows the validation result.
- The panel opens the service from each channel that lists it and from search, and confirms that each route reaches the same record revision and transaction.
- The panel checks the service's pages for a single `data-channel` and for entity branding (logos, colours, fonts); any entity styling is a fail against SVC-02.
- The team shows its naming research: search terms, comprehension findings and the synonym list.

---

<a id="legal"></a>

## 4. Legal and policy context

This chapter will list the UAE and Dubai legal instruments and policies that apply to Shared Channels services, and what each requires of a service. It will be written with legal counsel. Until counsel has confirmed them, the standard does not interpret any law. It names one instrument, Law No. (1) of 2025, only because the initiative must have the usage manual or approval that law requires before it publishes the Government of Dubai lockup ([CHR-02](#tpl-chrome)). The items to confirm are [OQ-5 to OQ-9](#open-questions): data protection, the rights of people of determination and any mandated accessibility level, federal design and digital-experience guidelines, the information security baseline and official terminology.

Whatever the instruments turn out to be, every service needs the following. These requirements stand on their own:

- **LEG-01.** Each service MUST have a privacy notice ([14.2](#privacy-notice)), an accessibility statement ([6.6](#statement)) and terms of use, in Arabic and English, linked from `sc-footer`.
- **LEG-02.** Each service MUST have a record of legal review covering its data flows, retention, consent basis and any sector rules, signed by the entity's legal or privacy owner before the beta assessment.
- **LEG-03.** UAE PASS and Dubai Pay integrations MUST follow the provider's current integration terms, brand rules and button assets. This standard does not replace them.
- **LEG-04.** The standard uses "people of determination" (أصحاب الهمم) for disabled people, and keeps WCAG's own wording when quoting WCAG. Confirmation of official terminology is [OQ-9](#open-questions).

### How we check

- The team shows the signed legal review record (LEG-02) at the beta assessment.
- The panel follows the footer links in both languages and confirms the three documents exist and match.

---

<a id="arabic-english"></a>

## 5. Arabic and English

This chapter holds every rule about language parity, switching, direction, bidirectional text, numerals, mirroring and Arabic typography. Other chapters link here instead of repeating them. Arabic content style is in [9.3](#arabic-style).

<a id="parity"></a>

### 5.1 Parity

- **LANG-01.** Every service MUST launch in Arabic and English at the same time, with the same eligibility, fees, warnings, documents, actions, error messages, status meanings, privacy information and support routes in both.
- **LANG-02.** A service MUST NOT go live with any part of its content, including assistive text (visually hidden labels, live-region announcements, `aria-label` values), file errors, receipts and notifications, missing in either language. A missing translation is a release defect, not a variant: there is no "translation unavailable" state.
- **LANG-03.** Arabic and English content MUST be written by content designers working in each language, from the same source facts. Machine translation MAY be used as a draft only; a person who writes the language professionally reviews and owns the result.

<a id="switching"></a>

### 5.2 Switching language

- **LANG-04** (changed in v2). Every page and screen MUST offer the language switch in the same place for its kind of page: the end slot of `sc-app-bar` on transaction pages, and among the end controls of `sc-site-header` on channel pages ([CHR-01](#tpl-chrome)), on the left in Arabic and on the right in English. On the web it is `sc-language-switch`.
- **LANG-05** (changed in v2). The switch is a link to the same page in the other language, labelled with that language's own name in its own script: "العربية" on an English page and "English" on an Arabic page, with the matching `lang` and `hreflang`. It MUST NOT use flags. It is never a button that opens a menu. A single-page app keeps the link and MAY cancel its navigation to switch in place ([LANG-08](#switching)).
- **LANG-06.** Switching MUST keep the user on the equivalent page or step. It MUST keep everything the user has entered, uploaded files, selected options, filters, the represented person or organisation, any error messages (re-rendered in the new language) and any transaction in progress. It MUST NOT submit anything.
- **LANG-07.** Web URLs MUST carry the language as the first path segment, with the rest of the path identical: `/en/renew-vehicle-registration/plate` and `/ar/renew-vehicle-registration/plate`. Each page MUST declare its alternate with `<link rel="alternate" hreflang="ar|en" href="…">`.
- **LANG-08.** After a full page load in the new language, focus starts at the top of the page as for any page load. When a single-page app switches without a page load, focus MUST move to the page `<h1>`.
- **LANG-09.** Text the user typed (names, addresses, descriptions) MUST NOT be translated or transliterated when the language changes.
- **LANG-10.** Handoffs to UAE PASS, Dubai Pay and other channels MUST request the user's current language where the provider supports it, and MUST restore it on return.
- **LANG-11.** In native apps, the app MUST start in the device language when it is Arabic or English, and MUST offer an in-app switch that follows LANG-06.

<a id="direction"></a>

### 5.3 Direction and layout

- **LANG-12.** Every page MUST set `lang` and `dir` on the root element: `lang="ar" dir="rtl"` or `lang="en" dir="ltr"`. On the web, `sc-page` with `sync-document` sets both on `<html>`. A passage in the other language sets its own `lang` (and `dir` if it is longer than a word or two).
- **LANG-13.** Layout MUST use logical properties only (`margin-inline-start`, `padding-inline-end`, `inset-inline-start`, `text-align: start`). Code MUST NOT use `left` or `right` for layout. The `sc-` components already follow this; service code must too.
- **LANG-14.** DOM order MUST follow the reading order. Direction comes from `dir`; it MUST NOT be faked by reversing the DOM, using `flex-direction: row-reverse` for language, or reordering with CSS.

<a id="bidi"></a>

### 5.4 Bidirectional text

Arabic text often contains left-to-right runs: plates, amounts, references, phone numbers, emails, URLs, file names and Latin names. Without isolation, the bidirectional algorithm can move their punctuation and reorder their parts.

- **LANG-15.** Every left-to-right value inside Arabic text MUST be isolated:
  - in page markup, wrap it in `sc-ltr`: `رقم اللوحة <sc-ltr>Dubai A 12345</sc-ltr> مسجل باسمك.`
  - inside a component's shadow root, use `<bdi dir="ltr">…</bdi>`
  - in plain text that cannot carry markup (SMS, push notifications, email subjects, PDF text, native string resources), use the Unicode isolates U+2066 LEFT-TO-RIGHT ISOLATE before the value and U+2069 POP DIRECTIONAL ISOLATE after it
- **LANG-16.** Isolation is for values, not sentences. A whole sentence in the other language sets `lang` and `dir` on its element instead.
- **LANG-17.** Fields that take left-to-right values (plate, Emirates ID number, phone, email, IBAN, reference) MUST use `sc-text-input ltr`. The value reads left to right but stays aligned to the start of the field, under the label. Do not put `dir="ltr"` on the field host: that flips its label, hint and error.
- **LANG-18.** Free text that the user writes (names, descriptions) MUST use `dir="auto"` wherever it is displayed back, so an English name on an Arabic page and an Arabic name on an English page both read correctly.
- **LANG-19.** Directional marks (U+200E, U+200F) MUST NOT be used as a substitute for isolates.

<a id="numerals"></a>

### 5.5 Numerals

- **LANG-20.** Digits MUST be Latin (0 1 2 3 4 5 6 7 8 9) in both languages, for amounts, plates, references, dates, times, counts, phone numbers and every other number. Arabic-Indic digits (٠ ١ ٢ ٣ …) MUST NOT be output.
- **LANG-21.** Inputs MUST accept Arabic-Indic and Eastern Arabic-Indic digits, normalise them to Latin digits before validation and storage, and show the normalised value back. Normalisation MUST NOT change any other character of an identifier.
- **LANG-22.** Number formatting is the same in both languages: comma for thousands and full stop for decimals ("1,250.00"). Formatting rules for money, dates and phone numbers are in [9.4](#style-guide).
- **LANG-22A.** In Arabic, a range of numbers MUST be written with a word, not a dash: "عرض 1 إلى 20 من 1,284 مخالفة", not "1–20". A dash is direction-neutral, so in right-to-left text "1–20" displays as "20–1".
- **LANG-23.** Arabic plural forms MUST follow the number, using the language's plural categories (zero, one, two, few, many, other): "يوم واحد", "يومان", "3 أيام", "15 يومًا", "100 يوم". On the web, use `Intl.PluralRules('ar')`, as `sc-textarea` and `sc-table` do.

<a id="mirroring"></a>

### 5.6 What mirrors and what does not

In Arabic the layout mirrors. Some things keep their direction because their meaning does not depend on reading direction.

| Mirrors in Arabic | Does not mirror |
| --- | --- |
| Page layout, grid column order, app bar (back link on the right, language switch on the left) | Digits and numbers, and the order of their parts (plates, references, phone numbers, IBANs, dates inside an isolate) |
| Directional icons, as listed in [8.6](#icons) (the `sc-` icon set mirrors them automatically) | The icons listed as not mirroring in [8.6](#icons), and the spinner |
| Back and forward controls, pagination (Previous on the right), disclosure chevrons | Media playback controls (play, pause, skip, the progress bar of a video or audio player) |
| Progress that represents journey order: the stepper (`sc-step-progress`) runs from the right | Clocks, timers and anything that depicts clockwise time |
| Form layout: error bar on the right of a field, radio and checkbox on the right of their label | Logos, brand marks, the Government of Dubai lockup ([CHR-02](#tpl-chrome)), the UAE PASS button and Dubai Pay assets |
| Tables: first column on the right, amounts aligned left | Photographs, maps and illustrations of real scenes |
| The arrow between "From" and "To" in `sc-date-range` (points left), and the calendar (Monday in the rightmost column) | Charts: axes keep their orientation (time runs from left to right, values rise upwards); titles, legends and labels are in Arabic and the legend follows the reading direction |
| Horizontal scroll regions start on the right | Code, URLs and email addresses |

- **LANG-24.** A new icon MUST be classified as directional or not when it is added to the icon set; directional icons use the `icon-directional` class (or `data-directional` on a slotted SVG) so they mirror.

<a id="arabic-type"></a>

### 5.7 Arabic typography

The Arabic type scale is in [8.2](#typography). These rules apply to all Arabic text.

- **LANG-25** (changed in v2). Arabic text MUST use the Arabic values of the type roles. The `--sc-type-<role>-*` properties and the `.sc-type-<role>` classes switch to them under `lang="ar"` and back under `lang="en"`, so text takes the right scale from its nearest `lang` ([FND-11](#typography)). Arabic text MUST NOT be set with English values.
- **LANG-26.** Arabic MUST NOT be letter-spaced. Letter-spacing breaks the joins between letters. All Arabic tracking tokens are 0.
- **LANG-27.** Arabic text MUST NOT be smaller than 16px (`body-small` and `label-small`, the smallest roles, are 16px in Arabic).
- **LANG-28.** Arabic MUST NOT use italic or oblique styles, real or synthesised. Emphasise with the Bold weight or with wording.
- **LANG-29.** Arabic text MUST be aligned to the start and MUST NOT be justified. Tatweel (kashida, U+0640) MUST NOT be used to stretch words.
- **LANG-30.** `text-transform` MUST NOT be applied to text that may contain Arabic.
- **LANG-31.** A Latin word or value inside Arabic text MUST stay in the surrounding Arabic size and the same font. Dubai Font covers both scripts, so no font or size switch is needed.
- **LANG-32.** Arabic SHOULD be written without diacritics (tashkīl). Add them only where a word would otherwise be misread, and never to mark the grammatical gender of the reader ([9.3](#arabic-style)).
- **LANG-33.** Running text in either language MUST NOT exceed the reading width (`--sc-container-reading`, 680px).

### How we check

- The team demonstrates the main journey in both languages, switching language once on a question page with an error showing and once on the check answers page. The panel confirms answers, errors and the step are kept (LANG-06).
- The panel inspects `<html lang dir>`, the `hreflang` alternates and the language switch markup on three pages.
- The panel searches the page source and rendered text for Arabic-Indic digits and for CSS `left`/`right` in service code (automated check in the team's pipeline, shown as evidence).
- The panel reads a confirmation page with a plate, an amount and a reference in Arabic with a screen reader and copies the reference into a text field to confirm it is intact (LANG-15).
- The team's Arabic content designer signs off the Arabic content and typography (LANG-03).

---

<a id="accessibility"></a>

## 6. Accessibility

<a id="baseline"></a>

### 6.1 Baseline

- **A11Y-01.** Every web page and every process MUST meet WCAG 2.2 Level AA, which includes every Level A criterion. The 55 criteria and how to check each are in [Appendix A](#appendix-wcag). Native apps meet the same criteria as interpreted for non-web software by WCAG2ICT ([7.4](#native-parity)).
- **A11Y-02.** Conformance is assessed on complete processes, not sample pages: signed-in views, both languages, light and dark themes, every error and recovery state, and third-party steps such as UAE PASS and Dubai Pay that are part of the journey.
- **A11Y-03.** No team may claim conformance because the service uses `sc-` components, because an automated tool reports no issues, or because a sample of pages passed. Components help a service conform; they do not make it conform.

<a id="beyond-wcag"></a>

### 6.2 Shared Channels rules that go beyond WCAG

These are deliberate design decisions, stricter than WCAG AA.

- **A11Y-04. Target size** (changed in v2). Every standalone interactive target MUST be at least 44 × 44 CSS px (`--sc-size-target-min`). Primary buttons and form fields are 56px tall (`--sc-size-control-primary`) and secondary controls 48px (`--sc-size-control-secondary`). A control drawn smaller than 44px (a 32px chip, a 28px stepper marker that is a link, an inline icon button) MUST extend its target to 44 × 44 with padding or a pseudo-element, without overlapping another target. Links inside running text are assessed against WCAG 2.5.8 (24 × 24 px or enough spacing) instead; a link alone in a table cell is a standalone target. The only other exception is the compact density of `sc-table` (44px rows) in staff tools.
- **A11Y-05. Focus indicator** (changed in v2). Focus MUST show the shared focus ring on `:focus-visible` only: a 3px ring (`--sc-size-focus-ring`) drawn 2px outside the element's edge (`--sc-size-focus-offset`), following its radius, in `--sc-color-focus-ring`. The ring is neutral, not the channel colour, and the same on every channel: `neutral-10` in light mode and white in dark mode. Inside a filled area the ring takes that area's "on" colour ([8.8](#focus)). Where a ring drawn outside the element would be clipped (an item in a bar docked to a screen edge, such as `sc-bottom-nav`; a full-height link in the header; a row inside a container that clips), the same ring MUST be drawn inside the element's edge instead: an inset ring that stays whole wins over the 2px outside offset. In forced-colours mode it uses the system `Highlight` colour. The ring MUST have at least 3:1 contrast against the colours next to it, in light and dark (WCAG 1.4.11); `check:contrast` measures it against every surface, container and channel band. Focus MUST NOT be hidden by sticky headers, app bars, the utility bar or cookie banners (WCAG 2.4.11), and SHOULD NOT be partly hidden either.
- **A11Y-06. Colour is never the only signal** (changed in v2). Status always has words and an icon as well as colour (`sc-status-tag`, `sc-callout` and field errors do this). A current or selected item also changes shape or weight (a check, a bar, Bold text, a Filled icon). A dot is used only for channel attribution and, together with a fill, Bold text and a hidden "Unread:" word, for unread notifications; never for status.
- **A11Y-07. User preferences** (changed in v2). Services MUST respect `prefers-reduced-motion` ([8.7](#motion)) and `forced-colors` (every control stays visible in Windows contrast themes, with borders that exist only as fills given a transparent border so they show), and MUST support `prefers-color-scheme` in both themes ([8.1](#colour)). There is no translucency to reduce ([FND-20](#elevation)).
- **A11Y-08. No disabled buttons for validation.** Buttons MUST stay enabled while a form is incomplete; the service explains what is missing when the user tries to continue ([13.6](#pat-questions)).

<a id="testing"></a>

### 6.3 Testing method

- **A11Y-09.** Each release MUST pass automated checks (axe, in English and Arabic, light and dark) on every page template it uses. The `sc-` component tests already do this for components.
- **A11Y-10.** Each release that changes a journey MUST also be tested by hand: keyboard only; screen readers from the support matrix in both languages; 200% text resize; 400% zoom and reflow at 320 CSS px; text spacing overrides (WCAG 1.4.12); forced colours; and reduced motion.
- **A11Y-11.** Before the beta assessment, the service MUST be tested by people of determination using their own assistive technology, in Arabic and in English ([16](#research)), and evaluated against every criterion in Appendix A by an accessibility specialist who did not build it.

<a id="support-matrix"></a>

### 6.4 Supported browsers and assistive technology

Services MUST work on, and are tested with, the combinations below. The matrix is reviewed every six months against channel analytics.

| Platform | Browser or app | Assistive technology (tested in Arabic and English) |
| --- | --- | --- |
| Windows | Edge, Chrome, Firefox (latest two major versions) | NVDA with Firefox or Chrome; JAWS with Chrome or Edge; Windows contrast themes; Windows Magnifier |
| macOS | Safari, Chrome (latest two major versions) | VoiceOver with Safari; Zoom |
| iOS and iPadOS | Safari (latest two major iOS versions); the channel apps | VoiceOver; Dynamic Type at the largest accessibility size; Switch Control |
| Android | Chrome, Samsung Internet (latest two major versions); the channel apps | TalkBack; font size and display size at maximum; Switch Access |

Screen readers are tested with an Arabic voice installed and the page or app language set to Arabic, so that language switching between Arabic and Latin runs is heard as users hear it.

The `sc-` library supports the same floor: the last two major versions of each browser above. Dark mode uses `light-dark()`, and the token build adds a `prefers-color-scheme` and `[data-theme]` fallback so iOS 16 and Safari before 17.5 still get it ([FND-08](#dark-mode)).

<a id="a11y-design"></a>

### 6.5 Accessible design in every component

The component conventions (`CONVENTIONS.md`) hold the detailed rules each component meets: visible labels, hints and errors linked with `aria-describedby`, `aria-invalid` and a visually hidden "Error:" prefix, form association, focus delegation, keyboard support and forced-colours styles. A service that uses a component as documented inherits these. A service that builds its own interface element MUST meet the same conventions and pass the same tests.

<a id="statement"></a>

### 6.6 Accessibility statement

- **A11Y-12.** Each service MUST publish an accessibility statement in Arabic and English, linked from `sc-footer` (`accessibility-href`), using the template in [Appendix C](#appendix-statement).
- **A11Y-13.** The statement MUST be honest: it lists every known failure against Appendix A, what users can do instead, and when it will be fixed. It MUST NOT claim full conformance while known failures exist.
- **A11Y-14.** The statement MUST be reviewed at least every 12 months and after every major change, and show the date of the last review.

### How we check

- The team shows axe results per template (A11Y-09), the manual test record against the support matrix (A11Y-10) and the Appendix A register with a Pass, Fail or Not applicable result and evidence for each criterion (A11Y-11).
- The panel tests one full journey with a keyboard and with a screen reader in Arabic, and checks in two channels and both themes that the focus ring is the same neutral ring, is never covered, and is never clipped at a screen edge (A11Y-05).
- The panel compares the accessibility statement with the register; any known failure missing from the statement fails A11Y-13.

---

<a id="platforms"></a>

## 7. Platforms

<a id="platform-model"></a>

### 7.1 What each platform uses

The channel apps are built with Flutter and React Native. Web components cannot run inside either, so each will get its own component kit that implements the same specifications. The kits are a later phase.

| How it is built | What the team uses | Status |
| --- | --- | --- |
| Website and mobile web | `sc-` web components and the library stylesheet (`sc.css`) | Available (Phase 3 components) |
| Hybrid app or WebView screen | `sc-` web components, exactly as on the web | Available (Phase 3 components) |
| Native SwiftUI or Jetpack Compose screens and modules | Generated tokens (`dist/ios/SCTokens.swift`, `dist/android/SCTokens.kt`) and the component specifications | Tokens available |
| Flutter | Generated Dart tokens and the `sc_flutter` widget kit | Later phase |
| React Native | Generated TypeScript tokens with a `useScTheme()` hook, and the `@sc/react-native` component kit | Later phase |

Which channels use Flutter and which use React Native, the framework versions to support, and whether the kits wrap shared UAE PASS and Dubai Pay modules are open questions ([OQ-17](#open-questions)).

<a id="platform-rules"></a>

### 7.2 Rules for every platform

- **PLAT-01.** Where web and native versions of a service exist, the team MUST publish which tasks each supports. A critical task that is not available on one platform MUST offer a working route on another, with the user's progress kept.
- **PLAT-02.** Responsive web MUST keep every task, piece of content, error and help route at every width from 320 CSS px, in both orientations. Required content MUST NOT depend on hover.
- **PLAT-03.** Service context and safe draft state MUST survive app links, returning from a browser, moving the app to the background and back, and permission prompts. An app link opened without the app installed MUST lead to a working web page, not an error.
- **PLAT-04.** A native screen MAY follow platform navigation conventions (for example a native back gesture or a bottom sheet) where research shows they help, as long as the task names, status vocabulary, content and outcomes are the same as on the web.

<a id="before-kits"></a>

### 7.3 Native teams before the kits exist

- **PLAT-05.** Native teams MUST implement against the component specifications (`COMPONENTS.md`, `specs/*.md` and each component readme), not against screenshots.
- **PLAT-06.** SwiftUI and Compose code MUST use the generated tokens. Flutter and React Native teams have no generated token output yet: a team that must ship before it exists MUST take values from the token source files, record the token version it copied, and record this as an [exception](#exceptions) that expires when the generated output is published.

<a id="native-parity"></a>

### 7.4 Parity requirements for native components

A native component, whether built by a service team today or in a kit later, is finished when it passes the same conformance checklist as its web component:

- **PLAT-07.** Same tokens: colour, type roles (Latin and Arabic scales), spacing, radii, elevation and motion, generated from the same source.
- **PLAT-08.** Same behaviour and content: states, validation and error behaviour, wording in both languages and status vocabulary, as defined in the component's specification.
- **PLAT-09.** Same accessibility outcomes, using the platform's own accessibility layer (Flutter `Semantics`, React Native accessibility props, UIKit and SwiftUI accessibility, Compose semantics): names, roles, values and states exposed; tested with VoiceOver and TalkBack; text scales with Dynamic Type and Android font size; targets at least 44 × 44 points (iOS) or 48 × 48 dp (Android, the platform's own guidance).
- **PLAT-10.** Same Arabic behaviour: right-to-left layout through the framework's own support (Flutter `Directionality`, React Native `I18nManager`), mirroring as in [5.6](#mirroring), Latin digits, isolated left-to-right values and the Arabic type scale.
- **PLAT-11.** Same theming: one channel per screen, set once and read by every component, in light and dark.
- **PLAT-12.** Native apps MUST NOT embed web components in a WebView to imitate native controls; a WebView is acceptable for a whole hybrid screen ([7.1](#platform-model)).

### How we check

- The team shows its platform capability matrix (PLAT-01) and, for native apps, the conformance checklist results for each component it built.
- The panel tests the main journey in the app with VoiceOver and TalkBack in Arabic, with the largest text size, and by backgrounding the app during a UAE PASS handoff.
- For Flutter and React Native, the panel checks the exception register for PLAT-06 and the recorded token version.

---

<a id="foundations"></a>

## 8. Visual foundations

The visual foundations are design tokens in `design-system/tokens/*.json`, written in the W3C Design Tokens (DTCG) format. The build (`npm run build` in `design-system/`) generates every platform output from them and runs the checks below. The visual language is design system v2, "Dubai Design System, evolved": a tonal colour system, flat surfaces, small radii and Dubai Font on a Material-style type scale. The full specification, with every value and every measured contrast pair, is `design-system/docs/v2/foundations.md`. This chapter states the rules. Where a value here and the token files disagree, the token files are authoritative.

Colours are named by token in this chapter, never by value. Palette tones are written as `<palette>-<tone>` (for example `neutral-40`), which is the token `--sc-palette-<palette>-<tone>`.

- **FND-01.** Services MUST take every colour, font, size, space, radius, shadow, duration and easing from the tokens: `--sc-*` custom properties from `dist/css/tokens.css` on the web, the Tailwind theme (`dist/tailwind/theme.css`) in Tailwind projects, and the generated Swift and Kotlin files on native. Generated files MUST NOT be edited by hand.
- **FND-02.** Service code MUST NOT contain colour literals (hex, `rgb()`, `hsl()`) or raw font sizes. The `sc-` library enforces this with `npm run check:literals`; services SHOULD run an equivalent check.

<a id="colour"></a>

### 8.1 Colour

**How the system works.** Every palette is a ramp of tones from 0 (black) to 100 (white). Contrast between two tones is the same whatever their hues, so every channel's tone 40 passes on white by the same margin. The generator (`scripts/generate-palettes.mjs`) builds every palette from one seed and writes the role tokens as aliases into the palettes, for light and dark.

| Palette | What it carries |
| --- | --- |
| City indigo (`indigo`) | The shared primary: what every channel has in common. The `primary` role is `indigo-30` in light mode |
| Seven channel signatures (`now`, `transport`, `visit`, `justice`, `build`, `invest`, `trade`) | Each channel's actions, containers and tints. Tone 40 for actions with white text (Dubai Trade uses tone 35), tone 90 for containers, tone 95 for subtle bands, tone 80 for actions in dark mode with `neutral-10` text |
| Neutral | Surfaces, text and edges. A grey with a trace of indigo, never of teal |
| Semantic (`error`, `success`, `warning`, `info`) | Status: tone 40 for text and icons on a tone 95 container |
| Decorative tints (six hues) | Topic tiles only ([FND-27](#colour)) |

**Rules**

- **FND-03.** Every colour is defined in OKLAB. The token source uses the DTCG colour object with `"colorSpace": "oklab"`; the CSS and Tailwind outputs use `oklab()` values. Only the iOS and Android outputs convert to sRGB, because those platforms require numeric sRGB components; each converted value carries its OKLAB source in a comment. The build's `check:no-hex` fails if the CSS or Tailwind output contains a hex colour.
- **FND-04.** The Dubai Design System teal and anything that resembles it MUST NOT be used anywhere in a Shared Channels service, including illustrations and charts. The build's `check:teal` fails on any colour in OKLCH hue 160° to 215° with chroma above 0.015. Images and illustrations MUST be reviewed against the same rule by eye.
- **FND-05.** Contrast is checked in the token pipeline, not assumed. `check:contrast` recomputes WCAG contrast for every pair the colours were designed for, in light and dark, for every channel: text at least 4.5:1; control boundaries, focus indicators and meaningful graphics at least 3:1. A service that pairs colours in a way the tokens were not designed for (for example `--sc-color-on-surface-variant` text on `--sc-color-channel-container`) MUST measure that pair itself and record the result.
- **FND-06.** Colour MUST NOT be the only way to convey meaning ([A11Y-06](#beyond-wcag)).
- **FND-07** (changed in v2). `--sc-color-outline-variant` is for dividers and card edges only and MUST NOT be the only boundary of an interactive control. Control boundaries use `--sc-color-outline` at `--sc-size-border-control` (1.5px), which passes 3:1 on every surface.
- **FND-24** (new in v2). Components and service code MUST use colour roles (`--sc-color-*`), never palette tones. The `--sc-palette-*` properties exist for documentation and tooling only.
- **FND-25** (new in v2). City indigo (`--sc-color-primary` and its family) MUST be used only for what all channels share: the "One network · seven channels" eyebrow of the channel network strip, links in that shared network chrome, and the Dubai Pay and other shared hand-off buttons ([CMP-10](#component-decisions)). It MUST NOT be used for UAE PASS, whose button follows its own specification ([CMP-11](#component-decisions)). A channel's own actions use the channel roles.
- **FND-26** (new in v2). To show another channel's colour inside a page (the channel switcher, a channel chip, a tile of the channel network strip, an `sc-step-list` row on another channel), the element MUST set `data-channel` on itself so the channel roles are rebound for its subtree. Another channel's values MUST NOT be written into service code.

**System roles.** Components use these roles. Light and dark values, and the contrast of every pair, are in `foundations.md` sections 2.4 and 2.8.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--sc-color-surface` | `neutral-100` | `neutral-10` | Page background |
| `--sc-color-surface-card` | `neutral-100` | `neutral-12` | Cards, fields, list groups, dialogs and sheets |
| `--sc-color-surface-container` | `neutral-96` | `neutral-17` | Bands, panels, table headers, totals rows |
| `--sc-color-surface-container-high` | `neutral-94` | `neutral-22` | A container inside a container; skeletons |
| `--sc-color-on-surface` | `neutral-10` | `neutral-100` | Primary text and icons |
| `--sc-color-on-surface-variant` | `neutral-40` | `neutral-80` | Secondary text: hints, captions, metadata |
| `--sc-color-outline` | `neutral-40` | `neutral-60` | Control boundaries and inactive markers |
| `--sc-color-outline-variant` | `neutral-90` | `neutral-24` | Dividers and card edges only ([FND-07](#colour)) |
| `--sc-color-inverse-surface`, `--sc-color-inverse-on-surface` | `neutral-20`, `neutral-96` | `neutral-90`, `neutral-10` | Tooltips |
| `--sc-color-disabled-container`, `--sc-color-on-disabled` | `neutral-94`, `neutral-50` | `neutral-20`, `neutral-60` | A disabled control, still at least 3:1 ([A11Y-08](#beyond-wcag) discourages disabling) |
| `--sc-color-focus-ring` | `neutral-10` | `neutral-100` | The focus ring ([8.8](#focus)) |
| `--sc-color-primary`, `-hover`, `-pressed` | `indigo-30`, `-25`, `-20` | `indigo-80`, `-75`, `-70` | City indigo fills ([FND-25](#colour)) |
| `--sc-color-on-primary` | `neutral-100` | `neutral-10` | Text and icons on city indigo |
| `--sc-color-primary-container`, `--sc-color-on-primary-container` | `indigo-90`, `indigo-30` | `indigo-30`, `indigo-90` | A selected or emphasised indigo container |
| `--sc-color-primary-subtle` | `indigo-95` | `indigo-20` | A quiet indigo band |
| `--sc-color-<status>` | `<status>-40` | `<status>-80` | Status text, icons and error edges, for `error`, `success`, `warning` and `info` |
| `--sc-color-on-<status>` | `neutral-100` | `neutral-10` | Text on a status fill |
| `--sc-color-<status>-container`, `--sc-color-on-<status>-container` | `<status>-95`, `<status>-30` | `<status>-20`, `<status>-90` | Callout and status chip backgrounds, and strong text on them |
| `--sc-color-error-hover`, `--sc-color-error-pressed` | `error-35`, `error-30` | `error-75`, `error-70` | Destructive fills |
| `--sc-color-scrim` | Black at 50% | Black at 64% | Behind modal dialogs and sheets |
| `--sc-color-shadow` | Black | Black | Base shadow colour; each elevation level sets its own opacity |

Hover and pressed states on quiet controls (outlined and text buttons, rows, chips) are state layers: the content colour mixed in OKLAB at `--sc-opacity-hover` (8%) or `--sc-opacity-pressed` (12%). Filled controls use their explicit `-hover` and `-pressed` roles instead, so their text contrast is checked directly.

**Channel roles.** A page sets its channel with `data-channel` ([SVC-01](#channel-theme)). The same roles take the same tones in every channel:

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--sc-color-channel-action` | Tone 40 (Dubai Trade: 35) | Tone 80 | Filled and outlined buttons, links, selected states, the current step and navigation indicator |
| `--sc-color-channel-action-hover` | Action tone minus 5 | Tone 75 | Filled action on pointer hover |
| `--sc-color-channel-action-pressed` | Action tone minus 10 | Tone 70 | Filled action while pressed |
| `--sc-color-channel-container` | Tone 90 | Tone 30 | A selected navigation item; an emphasised container |
| `--sc-color-channel-on-container` | Tone 30 | Tone 90 | Text and icons on `channel-container` |
| `--sc-color-channel-subtle` | Tone 95 | Tone 20 | The hero band, tinted rows, the halo of the current step |
| `--sc-color-channel-on-action` | `neutral-100` | `neutral-10` | Text and icons on any channel action fill, the same in every channel |

Text on `channel-subtle` is `on-surface` or `on-surface-variant`, or `channel-action` for links and eyebrows.

<a id="tints"></a>

**Decorative tints.** Six tints (`blue`, `violet`, `rose`, `orange`, `amber`, `green`) colour category icon tiles, favourite-service tiles and topic accents. The tile is `--sc-color-tint-<name>` (tone 95; tone 20 in dark mode) and the icon and any short text on it are `--sc-color-on-tint-<name>` (tone 40; tone 80 in dark mode).

- **FND-27** (new in v2). Tints are decorative. They MUST NOT mark actions, links, status or selection, and a tinted tile MUST always carry a text label. Several tints share a hue family with a channel or a status, which is acceptable only because tints never sit where those colours carry meaning.

<a id="dark-mode"></a>

**Light and dark themes**

- **FND-08** (changed in v2). Every service MUST support both themes. Each colour role holds both values in one `light-dark()` function, so `tokens.css` follows the system setting, and `data-theme="dark"` or `data-theme="light"` on any element forces that theme for its subtree (a dark footer on a light page works). For browsers without `light-dark()`, the token build also emits a `prefers-color-scheme` and `[data-theme]` fallback ([6.4](#support-matrix)). Code never branches on the theme.
- **FND-09.** Both themes MUST pass the same contrast checks and the same assessment. Images and illustrations MUST be legible on both canvases.

**Charts and data visualisation.** There is no chart palette in the tokens yet ([OQ-21](#open-questions)). Until there is, charts MUST use `--sc-color-on-surface`, `--sc-color-on-surface-variant`, `--sc-color-outline` and `--sc-color-channel-action`, label every series directly, and distinguish series by pattern or shape as well as colour.

<a id="typography"></a>

### 8.2 Typography

Shared Channels uses **Dubai Font** (family Dubai W23) for both scripts, in three weights: Regular (400), Medium (500) and Bold (700). The font stack falls back to a metric-matched local face, then `system-ui` and `sans-serif`. How the font files load is in [PERF-10](#performance).

- **FND-10.** Services MUST use Dubai Font only. No entity, channel or service may introduce another typeface.
- **FND-11** (changed in v2). Text MUST be set with a type role, never a free size: on the web the `.sc-type-<role>` classes in page markup, and the `--sc-type-<role>-*` properties (family, weight, size, leading and tracking) inside components. Each property follows the nearest `lang`, so one class or property serves both scripts and components never branch on script.
- **FND-12** (changed in v2). Only the Regular, Medium and Bold weights are used. Where English uses Medium for short interface text (navigation, chips, metadata), Arabic uses Bold.
- **FND-13** (changed in v2). Leading is deliberately tight, because Dubai Font's tall vertical metrics make loose leading look airy. English display roles use about 1.05–1.11× the font size, headings about 1.19–1.25× and body text 1.43–1.5×; Arabic headings about 1.33–1.38× and Arabic body text 1.5–1.6×. Services MUST NOT override leading; the WCAG 1.4.12 text spacing test ([A11Y-10](#testing)) confirms that content survives users' own overrides.
- **FND-28** (new in v2). English text MUST NOT be set smaller than 14px (`body-small`, `label-small`). The Arabic minimum of 16px is [LANG-27](#arabic-type).
- **FND-29** (new in v2). Page and section headings MUST use the headline roles. The display roles are for heroes only.

The scale is Material-style: 15 roles in five groups. Arabic runs about one step larger, with taller leading, and is never letter-spaced ([LANG-26](#arabic-type)). Body text is 18/26 in English and 20/32 in Arabic. Sizes and leading are in CSS px.

| Role | Use | English: size / leading, weight, tracking | Arabic: size / leading, weight |
| --- | --- | --- | --- |
| `display-large` | Home hero, from 1024px | 80 / 84, Bold, −0.02em | 88 / 108, Bold |
| `display-medium` | Channel hero, from 1024px | 57 / 62, Bold, −0.015em | 64 / 80, Bold |
| `display-small` | Heroes below 1024px | 45 / 50, Bold, −0.01em | 50 / 64, Bold |
| `headline-large` | Page heading (`h1`) | 32 / 38, Bold | 36 / 48, Bold |
| `headline-medium` | Section heading (`h2`) | 28 / 34, Bold | 32 / 44, Bold |
| `headline-small` | Subsection heading (`h3`); totals and amounts | 24 / 30, Bold | 28 / 38, Bold |
| `title-large` | Card and panel titles | 22 / 28, Bold | 24 / 34, Bold |
| `title-medium` | Row titles, question group legends, emphasised values | 18 / 24, Bold | 20 / 30, Bold |
| `title-small` | Navigation items, the back link, summary-list values, step names | 17 / 22, Medium | 19 / 28, Bold |
| `body-large` | Body text, the default for running text | 18 / 26, Regular | 20 / 32, Regular |
| `body-medium` | Hints, secondary text, table cells | 16 / 24, Regular | 18 / 28, Regular |
| `body-small` | Captions and fine print | 14 / 20, Regular | 16 / 24, Regular |
| `label-large` | Buttons and field labels | 18 / 22, Bold | 20 / 28, Bold |
| `label-medium` | Chips, tabs, 48px buttons, error messages | 16 / 20, Medium | 18 / 24, Bold |
| `label-small` | Metadata labels, step counters, badges | 14 / 18, Medium | 16 / 22, Bold |

Only the three display roles carry tracking, and only in English. Every Arabic role has 0 tracking.

**Digits.** Digits are Latin in both languages ([LANG-20](#numerals)). Dubai Font's digits are tabular by default, so amount columns align without `font-variant-numeric`.

<a id="spacing"></a>

### 8.3 Spacing, sizes and shape

- **FND-14.** Spacing MUST use the spacing scale (`--sc-space-<n>`, in px): 0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 128.
- **FND-15** (changed in v2). Sizes MUST use the size tokens:

| Token | Value | Use |
| --- | --- | --- |
| `--sc-size-control-primary` | 56px | Primary buttons and text fields: everything in a question page's main flow |
| `--sc-size-control-secondary` | 48px | Secondary and compact buttons, compact fields, controls in tables and headers |
| `--sc-size-target-min` | 44px | The minimum interactive target ([A11Y-04](#beyond-wcag)) |
| `--sc-size-chip` | 32px | The visual height of chips; the target extends to 44px |
| `--sc-size-stepper-marker` | 28px | Stepper markers |
| `--sc-size-icon-s`, `-m`, `-l` | 16, 20, 24px | Icons ([8.6](#icons)) |
| `--sc-size-focus-ring`, `--sc-size-focus-offset` | 3px, 2px | Focus ring ([8.8](#focus)) |
| `--sc-size-border-hairline` | 1px | Dividers and card edges |
| `--sc-size-border-control` | 1.5px | Control edges |
| `--sc-size-border-strong` | 2px | Error and selected edges; stepper connectors |
| `--sc-size-border-accent` | 3px | Accents that need a 3px line: the bar under the current item of the header navigation and beside the current item of the account navigation |
| `--sc-size-strip` | 4px | The one start-bar width: the bar on the start side of a field in error and of a callout. Also the channel rule along the top of `sc-app-bar` and the top rule of each channel network tile |
| `--sc-size-measure` | 680px | Maximum width of running text |

- **FND-16** (changed in v2). Corner radii MUST use the radius tokens: `--sc-radius-control` 4px (buttons, checkboxes, segmented controls, tags), `--sc-radius-chip` 6px (status chips), `--sc-radius-field` 8px (text inputs, selects, textareas, callouts), `--sc-radius-card` 12px (cards, list groups, panels, popovers, dialogs and the top corners of bottom sheets) and `--sc-radius-none` (tables and full-bleed bands). `--sc-radius-full` is only for shapes whose roundness carries meaning: radio buttons, stepper markers, avatars, switch thumbs and suggestion chips. Buttons and fields MUST NOT be pills.

<a id="layout"></a>

### 8.4 Layout and grid

| Breakpoint | From | Columns | Gutter | Outer margin |
| --- | --- | --- | --- | --- |
| compact | 0 | 4 | 16px | 20px |
| medium | 600px | 8 | 20px | 32px |
| expanded | 1024px | 12 | 24px | 48px |
| wide | 1440px | 12 | 24px | 80px |

- **FND-17.** Pages MUST use `sc-page`, `sc-container` and `sc-grid`, or the same tokens on native. Content is capped at `--sc-container-max` (1280px). Question pages, check answers pages and running text use `sc-container width="reading"` (680px), aligned to the start edge.
- **FND-18.** Layouts MUST respond to available width, not device type. Components that change layout (for example `sc-summary-list`, `sc-table`) respond to their own width.

<a id="elevation"></a>

### 8.5 Elevation

Surfaces are flat and outline-first. A shadow means "this floats over the page", and nothing else.

- **FND-19** (changed in v2). Shadows MUST use the three elevation levels: `--sc-elevation-0` (everything in the page flow, cards included), `--sc-elevation-1` (bars docked to an edge, and sticky bars once content scrolls under them) and `--sc-elevation-2` (popovers, menus, dialogs and sheets). Cards are separated by a 1px `--sc-color-outline-variant` edge or by sitting on `--sc-color-surface-container`, never by a shadow.
- **FND-20** (changed in v2). Surfaces MUST be opaque: no glass, backdrop blur or gradients. In dark mode, where shadows barely show, overlays also take a 1px `--sc-color-outline-variant` edge, and dialogs and sheets use `--sc-color-surface-container` so they step up from the page. Modal dialogs and sheets sit over `--sc-color-scrim`.

<a id="icons"></a>

### 8.6 Icons and imagery

- **FND-21** (changed in v2). Icons are **Material Symbols, Outlined style** (weight 400, grade 0, optical size matched to the rendered size; Apache 2.0 licence), listed in one manifest (`src/icons/icons.json`) and generated into each component, so a component carries only the icons it uses. They are inline SVG on a 24px grid, drawn in `currentColor`, never an icon font. The Filled style is used for two things only: status icons, and the selected state of navigation and tab icons, so that selection changes shape as well as colour. Sizes are 16px in chips and beside small text, 20px beside body text and inside fields, and 24px in buttons and standalone. A new icon is requested from the design system team, not drawn locally.
- **FND-22.** Icons are always decorative (`aria-hidden`): the words next to them carry the meaning. An icon-only control MUST have an accessible name. Mirroring follows the table below.
- **FND-23.** Images MUST NOT contain text. Photographs show real Dubai settings and people, are relevant to the task and have a text alternative unless decorative ([WCAG 1.1.1](#appendix-wcag)).

**Which icons mirror in Arabic.** An icon mirrors when it shows direction along the reading line. Each icon in the set records whether it mirrors ([LANG-24](#mirroring)). The rest of the mirroring rules are in [5.6](#mirroring).

| Mirrors | Does not mirror |
| --- | --- |
| Back and forward arrows, and chevrons used for navigation or disclosure (`arrow_back`, `arrow_forward`, `chevron_left`, `chevron_right`, `navigate_next`) | Check marks, close, plus and minus |
| "Open in new" and external-link arrows | Search, lock, home, person, calendar, mail, phone |
| Send, reply, undo, redo, log in and log out | Clocks, timers, `schedule` and `history` (time runs clockwise in both scripts) |
| List and text-alignment icons with a ragged edge; indent and outdent | Media playback (play, pause, fast-forward follow tape direction, not reading direction) |
| `help`, because Arabic writes the question mark mirrored (؟) | Status icons (error, warning, info, check circle) |
| Progress and stepper direction | Logos, brand marks, and Latin text or numbers inside icons |

<a id="motion"></a>

### 8.7 Motion

The motion rules are distilled from Emil Kowalski's design engineering skills ([github.com/emilkowalski/skills](https://github.com/emilkowalski/skills): `emil-design-eng`, `animate`, `review-animations`, `animation-performance`, `apple-design` and `mobile-native`). The motion tokens in `tokens/motion.json` implement them.

Motion in a government service has one job: to help people understand what changed. It is never decoration on a task someone is trying to finish.

**Should it animate at all?**

- **MOT-01.** Decide by frequency first:

| How often a person triggers it | Decision | Examples |
| --- | --- | --- |
| Many times in a session, or from the keyboard | No animation | Sorting a table, keyboard month changes in a calendar, moving between fields, opening a menu with the keyboard |
| Often (tens of times) | None, or a short colour change only | Row and button hover, list navigation |
| Occasionally | Standard motion | A popover, a bottom sheet, a dialog, a selection bar appearing |
| Rarely | Standard motion; no more | The confirmation page |

- **MOT-02.** Actions started from the keyboard MUST NOT animate. They happen instantly.
- **MOT-03.** Every animation MUST have a stated purpose: keeping spatial relationships clear (a sheet comes from and returns to the bottom edge), showing a change of state, giving feedback on a press, or preventing a jarring jump. "It looks good" is not a purpose.

**Easing and duration**

- **MOT-04.** Elements entering or leaving MUST use a strong ease-out curve. Elements moving or changing shape on screen MUST use a strong ease-in-out curve. Colour changes on hover use `ease`. Constant motion (a spinner) is linear. Ease-in MUST NOT be used for interface motion: it delays the moment the user is watching.

| Purpose | Curve | Token |
| --- | --- | --- |
| Enter | Strong ease-out, `cubic-bezier(0.23, 1, 0.32, 1)` | `--sc-easing-enter` |
| Exit | The same strong ease-out | `--sc-easing-exit` |
| Movement on screen | Strong ease-in-out, `cubic-bezier(0.77, 0, 0.175, 1)` | `--sc-easing-standard` |
| Hover and colour changes | `ease`, `cubic-bezier(0.25, 0.1, 0.25, 1)` | `--sc-easing-hover` |
| Bottom sheets and drawers | `cubic-bezier(0.32, 0.72, 0, 1)` | `--sc-easing-drawer` |

- **MOT-05** (changed in v2). Exits MUST use `--sc-easing-exit`, which is an ease-out curve, with the exit durations in [MOT-07](#motion), or an opacity fade.
- **MOT-06** (changed in v2). Interface motion SHOULD stay under 300ms. Use this table as the rule of thumb:

| Element | Duration |
| --- | --- |
| Micro-interactions: press feedback, hover, toggles | 100–150ms |
| Standard interface: tooltips, popovers, menus, selects | 150–250ms |
| Modals, dialogs, drawers and bottom sheets | 200–300ms |

  Larger elements animate more slowly than smaller ones, and duration grows with distance: an element that travels further takes longer. Use the duration tokens: `--sc-duration-fast` (120ms) for hover and colour, `--sc-duration-press` (150ms) for press feedback, `--sc-duration-base` (200ms) for standard entrances and for centred dialogs, and `--sc-duration-slow` (280ms) for bottom sheets and drawers only, which travel from the screen edge. `--sc-duration-instant` (0ms) is for keyboard-initiated actions.
- **MOT-07.** Exits SHOULD be about 20% faster than entrances, not more: a popover that enters over `--sc-duration-base` leaves over `--sc-duration-exit` (160ms), by opacity only; a centred dialog enters over 200ms and leaves over 160ms; and a sheet enters over 280ms and leaves over `calc(var(--sc-duration-slow) * 0.8)`, about 224ms. An exit that is much faster than its entrance reads as a cut.

**Physical behaviour**

- **MOT-08.** Nothing animates from `scale(0)`. Popovers and menus enter from `scale(0.95)`–`scale(0.97)` with opacity 0 (`--sc-scale-enter` is 0.96), with `transform-origin` at the corner of the trigger they belong to (a logical corner, so it moves to the right in Arabic). Modals and dialogs are not anchored to a trigger: they stay centred.
- **MOT-09.** Pressable elements SHOULD respond on press, not on release: a `scale(0.97)` (`--sc-scale-press`, within 0.95–0.98) on `:active`, over 100–160ms.
- **MOT-10.** Bottom sheets follow the finger one to one while dragged, and close on a downward flick (release velocity above about 0.11 px/ms) as well as on a long drag. Dragging is never the only way to close: every sheet has a close button (WCAG 2.5.7). Sheets do not bounce unless the user's own gesture carried momentum.

**Implementation**

- **MOT-11.** Only `transform` and `opacity` animate movement and appearance. Hover and state colour changes MAY transition colour properties. Layout properties (`width`, `height`, `margin`, `padding`, `top`, `left`) MUST NOT be animated, and `transition: all` MUST NOT be used.
- **MOT-12.** Anything that can be interrupted (a popover opened and closed quickly, a selection bar, a toggle) MUST use CSS transitions, which retarget from the current state, not keyframe animations, which restart. Keyframes are for constant motion only (the spinner, the skeleton pulse).
- **MOT-13.** Hover motion MUST be gated behind `@media (hover: hover) and (pointer: fine)`, so it does not stick after a tap on touch screens.
- **MOT-14.** Motion MUST NOT block interaction. Content that moves, blinks or scrolls for more than five seconds needs a pause control (WCAG 2.2.2), and nothing flashes more than three times a second (WCAG 2.3.1). Parallax and autoplaying background video are not used.

**Reduced motion**

- **MOT-15.** Under `prefers-reduced-motion: reduce`, movement goes (no translate, scale or spring) and short opacity fades stay, because they help people notice what changed. The spinner stops turning and its label is shown. The tokens do this: under reduced motion `--sc-duration-spin` becomes 0ms and `--sc-scale-press` and `--sc-scale-enter` become 1, while the other durations keep their values.

**Spinner.** The spinner turns at constant (linear) speed, one rotation per `--sc-duration-spin` (600ms). A faster rotation reads as faster loading.

**How the rules apply to current components**

| Component and moment | Motion |
| --- | --- |
| `sc-table` sort | None; rows reorder instantly |
| `sc-table` row hover | Background colour over `--sc-duration-fast`, `ease`, fine pointers only |
| `sc-table` selection bar | Enters with opacity and an 8px rise over `--sc-duration-base`; leaves with opacity over `--sc-duration-exit` |
| `sc-date-range` popover | Enters with opacity and `scale(0.96)` to 1 from the field's top inline-start corner over `--sc-duration-base`; leaves with opacity over `--sc-duration-exit`; opened from the keyboard, it appears instantly |
| `sc-date-range` bottom sheet | Slides up over `--sc-duration-slow` with `--sc-easing-drawer`; the scrim fades in over `--sc-duration-base` |
| `sc-date-range` month change | Pointer: crossfade with a 12px shift in the direction of travel (mirrored in Arabic) over `--sc-duration-base`. Keyboard: instant |
| Channel switcher and account menu ([11.9](#tpl-chrome)) | Pointer: opacity and `scale(--sc-scale-enter)` from the trigger's corner over `--sc-duration-base`; leaves with opacity over `--sc-duration-exit`. Keyboard: instant |
| `sc-modal` centred dialog | Enters with opacity and `scale(--sc-scale-enter)` from its own centre over `--sc-duration-base` (200ms); leaves over `--sc-duration-exit` (160ms); the scrim fades with it. Opened from the keyboard: instant |
| `sc-modal` bottom sheet (below 600px) | Slides up over `--sc-duration-slow` (280ms) with `--sc-easing-drawer`; leaves over about 224ms, from wherever a drag left it |
| `sc-notification-list` "mark all as read" | The unread fill fades over `--sc-duration-base` when a pointer started it; instant from the keyboard |

<a id="focus"></a>

### 8.8 Focus

The requirement is [A11Y-05](#beyond-wcag). It is built from one role and two sizes, the same in every channel:

```css
:focus-visible {
  outline: var(--sc-size-focus-ring) solid var(--sc-color-focus-ring);
  outline-offset: var(--sc-size-focus-offset);
}
```

`outline` follows the element's radius and survives forced-colours mode, and the 2px offset leaves the background showing between the control and the ring. Inside a filled region the region sets `--sc-color-focus-ring` to its own "on" colour for its subtree: `--sc-color-on-primary` on the city indigo strip, `--sc-color-channel-on-action` on a filled channel band and `--sc-color-inverse-on-surface` in a tooltip. These are pairs that `check:contrast` already measures. Where the outside ring would be clipped ([A11Y-05](#beyond-wcag)), the component draws the same ring inside its edge with a negative `outline-offset`: `sc-bottom-nav` items, full-height navigation links in `sc-site-header` and `sc-notification-list` rows do this. Focus is never animated ([MOT-02](#motion)).

### How we check

- The token build passes `check:contrast`, `check:teal` and `check:no-hex`; the team shows the output for the token version it uses.
- The service pipeline runs a literal check (FND-02); the panel reviews its result, and searches service code for `--sc-palette-*` and for another channel's values (FND-24, FND-26).
- The panel switches `data-theme` and the system theme, and checks two templates in each.
- The panel checks that city indigo appears only where FND-25 allows it, and that tinted tiles carry labels (FND-27).
- The panel inspects control edges, radii and shadows on two templates: control edges use `outline`, buttons are not pills, and cards have no shadow (FND-07, FND-16, FND-19, FND-20).
- The panel reviews the service's own animations against MOT-01 to MOT-15: it triggers each one with the keyboard and with the pointer, with reduced motion on and off, and slows animations down in the browser's animation inspector to check curves, origins and exit speed.

---

<a id="content"></a>

## 9. Content design

<a id="voice"></a>

### 9.1 Voice

Shared Channels content is plain, direct and calm. It speaks to one person about their task. It does not promote the government, the entity or the channel.

- **CNT-01.** Content MUST say what the user needs to do and what will happen, in the order they need it. Put the most important information first.
- **CNT-02.** Content MUST NOT use marketing language ("world-class", "seamless", "smart"), slogans or exclamation marks.
- **CNT-03.** Content MUST be honest about uncertainty: say "We are checking your payment", "The fee depends on the size of the building" or "We have not confirmed this date yet" instead of guessing.

<a id="plain-english"></a>

### 9.2 Plain English

- **CNT-04.** Write in UK English, in the active voice, addressing the user as "you" and the service as "we".
- **CNT-05.** Sentences SHOULD be 25 words or fewer. Paragraphs SHOULD be 3 sentences or fewer.
- **CNT-06.** Use the words users use. Explain a legal or technical term the first time it appears, or replace it.
- **CNT-07.** Use sentence case for every heading, label, button and link. Capitalise only proper nouns.
- **CNT-08.** Do not use acronyms without spelling them out first, except "UAE", "UAE PASS", "AED" and "PDF".

<a id="arabic-style"></a>

### 9.3 Arabic content style

- **CNT-09. Register.** Arabic content MUST be written in plain Modern Standard Arabic: short sentences, common words, no legal or bureaucratic formulas where a plain phrase exists. It MUST NOT use a dialect, including Gulf dialect, in service content.
- **CNT-10. Written, not translated.** Arabic content is written for Arabic readers from the same facts as the English. Sentence order, structure and length may differ from the English; meaning, facts and actions MUST NOT.
- **CNT-11. Addressing the reader without assuming gender** (changed in v2). Arabic marks gender in verbs, so content MUST be written so that it reads correctly for every reader. Official names are not content and are kept as they are ([CNT-14](#arabic-style)), even where they contain an imperative or a diacritic, as the channel names "استثمر في دبي" and "ابنِ في دبي" do ([3.1](#seven-channels)):
  - Buttons, links, labels and headings use a verbal noun (masdar), not an imperative: "متابعة" (Continue), "دفع الرسوم" (Pay the fee), "حفظ والمتابعة لاحقًا" (Save and finish later), "إرفاق المستندات" (Upload documents).
  - Instructions and error messages use "يُرجى" with a verbal noun: "يُرجى إدخال رقم اللوحة" (Enter the plate number).
  - Sentences use forms that are not marked for gender in unvocalised text: "يمكنك…" (you can), the possessive suffix "ـك" ("طلبك", "رقم لوحتك") and passive or impersonal constructions ("تم استلام طلبك").
  - Second-person verbs that are marked for gender ("تريد" / "تريدين") and imperatives ("أدخل" / "أدخلي") MUST NOT be used. Diacritics MUST NOT be added to fix the reader's gender.
  - Content MUST NOT infer a person's gender from their name.
- **CNT-12. Numbers and agreement.** Numbers use Latin digits ([LANG-20](#numerals)). Nouns after numbers follow Arabic rules for dual and plural ([LANG-23](#numerals)). Status words and adjectives agree with the noun they describe; the status vocabulary in [9.6](#status-vocabulary) fixes the form for each.
- **CNT-13. Punctuation.** Use the Arabic comma (،), semicolon (؛) and question mark (؟). The full stop and colon are the same characters as in English. Use guillemets (« ») for quotations. Do not put a full stop at the end of a button, label or heading.
- **CNT-14. Transliteration.** Names of people are shown as the person or their verified record wrote them, never transliterated by the service. Brand and product names keep their official Arabic form where one exists ("هيئة الطرق والمواصلات"); where none exists, they stay in Latin script inside an isolate.
- **CNT-15. Glossary.** Each channel's Arabic and English terms MUST come from the shared glossary, owned by the bilingual content and taxonomy lead ([17.1](#roles)). A new term is added to the glossary before it is used.
- **CNT-16. Review.** Every Arabic string, including component strings and notifications, MUST be reviewed by a qualified Arabic content designer before release. Review is recorded once per release, not repeated as a disclaimer on the page.

| English | Arabic | Note |
| --- | --- | --- |
| Continue | متابعة | Verbal noun, not "تابع" |
| Enter the plate number | يُرجى إدخال رقم اللوحة | "يُرجى" with a verbal noun |
| You can pay now or later | يمكنك الدفع الآن أو لاحقًا | "يمكنك" is not marked for gender |
| We have received your application | تم استلام طلبك | Passive form |
| Check your answers before you submit | مراجعة الإجابات قبل إرسال الطلب | Heading as a verbal noun |

<a id="style-guide"></a>

### 9.4 Style guide

| Topic | English | Arabic | Rule |
| --- | --- | --- | --- |
| Dates | 14 March 2026 | 14 مارس 2026 | Day, month name, year. No ordinals ("14th"), no weekday unless it matters. Abbreviate the month ("14 Mar 2026") only in tables and narrow summaries. Numeric dates ("14/03/2026") only in input hints and typed values |
| Date ranges | 21 September to 9 October 2026 | من 21 سبتمبر إلى 9 أكتوبر 2026 | Use "to" in sentences. An en dash ("21 Sep – 9 Oct 2026") is for compact English summaries only. Arabic compact summaries also use words ("من 1 إلى 31 أكتوبر 2026"), because a dash between numbers reverses in right-to-left text ([LANG-22A](#numerals)) |
| Times | 9:30am, 2pm, midday | 9:30 صباحًا، 2 مساءً، 12 ظهرًا | 12-hour clock in both languages |
| Time zone | 2pm (Dubai time) | 2 مساءً (بتوقيت دبي) | All times are Dubai time (Gulf Standard Time, UTC+4, no daylight saving). Say "Dubai time" next to every deadline and appointment |
| Calendar | Gregorian | الميلادي | Gregorian by default. Showing a Hijri date alongside is a service-specific decision ([OQ-11](#open-questions)) |
| Money | AED 1,250.00 | 1,250.00 درهم | English puts "AED" before the amount; Arabic puts "درهم" after it. Always two decimals for amounts due, paid or refunded. Never abbreviate an amount ("1.2k"). Whether to use the new dirham symbol is [OQ-10](#open-questions) |
| Free services | Free | مجانًا | Never "AED 0.00" |
| Fees and timings | The fee depends on… / We have not confirmed this yet | تعتمد الرسوم على… / لم يتم تأكيد ذلك بعد | Distinguish "Free", "varies" and "not confirmed". Separate the time it takes to fill in the form from the time the entity takes to decide |
| Phone numbers | +971 4 123 4567, +971 50 123 4567 | the same, isolated | International format with spaces. Inside Arabic, isolate the whole number so "+" stays at the start ([LANG-15](#bidi)) |
| Numbers | 1,284 fines; 3 days | 1,284 مخالفة؛ 3 أيام | Digits for all numbers, including one to nine |
| References | F-2026-118204 | F-2026-118204 | Exactly as issued; isolated in Arabic |
| Links | Check your traffic fines | الاستعلام عن المخالفات المرورية | Say where the link goes. Never "click here", "more" or a bare URL |
| Buttons | Continue; Pay with Dubai Pay; Save and finish later | متابعة؛ الدفع عبر Dubai Pay؛ حفظ والمتابعة لاحقًا | Start with the action. Not "Submit", "OK" or "Yes". No full stop |
| Headings | What is your plate number? | ما رقم لوحة المركبة؟ | A question page's heading is the question |
| File references | Insurance certificate (PDF, 240 KB) | شهادة التأمين (PDF، 240 KB) | Give the format and size for downloads |

The Arabic rendering of "Pay with Dubai Pay" depends on the provider's official Arabic name and button wording ([OQ-4](#open-questions)).

<a id="error-messages"></a>

### 9.5 Error messages

- **CNT-17.** An error message MUST say what to do, in the words of the field label, and MUST be the same in the error summary and next to the field. It MUST NOT blame the user or use "invalid", "error occurred" or a system code.
- **CNT-18.** Error messages MUST be written for each situation below. Replace the words in braces with the field's own words.

| Situation | English template | Arabic template |
| --- | --- | --- |
| Required field empty | Enter {the thing} | يُرجى إدخال {الشيء} |
| Required choice not made | Select {the thing} | يُرجى اختيار {الشيء} |
| Wrong format | Enter {the thing} in the correct format, like {example} | يُرجى إدخال {الشيء} بالصيغة الصحيحة، مثل {مثال} |
| Too long | {The thing} must be {n} characters or fewer | يجب ألا يزيد {الشيء} على {n} حرفًا |
| Too short | {The thing} must be {n} characters or more | يجب ألا يقل {الشيء} عن {n} حرفًا |
| Number out of range | {The thing} must be between {min} and {max} | يجب أن يكون {الشيء} بين {min} و{max} |
| Not a real date | {The date} must be a real date | يجب أن يكون {التاريخ} تاريخًا صحيحًا |
| Date missing a part | {The date} must include a {day, month or year} | يجب أن يتضمن {التاريخ} {اليوم أو الشهر أو السنة} |
| Date must be in the past | {The date} must be in the past | يجب أن يكون {التاريخ} في الماضي |
| Date must be in the future | {The date} must be in the future | يجب أن يكون {التاريخ} في المستقبل |
| End before start | The end date must be the same as or after the start date | يجب أن يكون تاريخ النهاية في يوم البداية أو بعده |
| File too large | The selected file must be smaller than {size} | يجب أن يكون حجم الملف المحدد أقل من {size} |
| Wrong file type | The selected file must be a {formats} | يجب أن يكون الملف المحدد بصيغة {formats} |
| File empty or unreadable | The selected file is empty / could not be read. Choose another file | الملف المحدد فارغ / تعذّرت قراءته. يُرجى اختيار ملف آخر |
| Checkbox confirmation not ticked | Confirm that {the statement} | يُرجى تأكيد {العبارة} |

Example: "Enter the plate number using numbers only, like 12345" / "يُرجى إدخال رقم اللوحة بالأرقام فقط، مثل 12345" (with the example isolated).

The Arabic plural after `{n}` follows [LANG-23](#numerals); the template shows the form for 11 and above.

<a id="status-vocabulary"></a>

### 9.6 Status vocabulary

These are the only status words a service may show for applications, tasks, payments and refunds. Each maps to one business state and one `sc-status-tag` tone. Services MUST use them in tags, lists, tracking pages, notifications and staff tools alike.

**Applications**

| Status | Arabic | Tone | Business state |
| --- | --- | --- | --- |
| Draft | مسودة | `neutral` | Started, saved, not submitted |
| Received | تم الاستلام | `neutral` | Submitted and confirmed by the server; not yet being reviewed |
| In review | قيد المراجعة | `neutral` | The entity is reviewing it |
| Action needed | إجراء مطلوب | `error` | The entity is waiting for the user to do something |
| Approved | تمت الموافقة | `success` | The entity has decided in the user's favour |
| Not approved | لم تتم الموافقة | `neutral` | The entity has decided against the application; reasons and the review route are shown with it |
| Completed | مكتمل | `success` | The outcome has been delivered (for example, the registration is renewed) |
| Withdrawn | تم السحب | `neutral` | The user withdrew it |
| Cancelled | تم الإلغاء | `neutral` | The entity cancelled it; the reason is shown with it |
| Expires in {n} days | ينتهي خلال {n} يومًا | `warning` | A licence, registration or permit is due for renewal |

**Tasks in a task list** (the Arabic agrees with "مهمة")

| Status | Arabic | Tone | Meaning |
| --- | --- | --- | --- |
| Not started | لم تبدأ | `neutral` | Available, nothing saved |
| In progress | قيد التنفيذ | `neutral` | Some answers saved |
| Completed | مكتملة | `success` | Every answer saved on the server and valid; not merely visited |
| Cannot start yet | غير متاحة بعد | `neutral` | Depends on another task, which is named next to it |

**Payments and refunds**

| Status | Arabic | Tone | Business state |
| --- | --- | --- | --- |
| Not paid | بانتظار الدفع | `warning` | Payment due, not started |
| Checking payment | جارٍ التحقق من الدفع | `neutral` | Outcome not yet known; do not take payment again |
| Paid | تم الدفع | `success` | Confirmed by Dubai Pay through the server |
| Payment failed | تعذّر الدفع | `error` | Confirmed failed; no money taken |
| Payment cancelled | تم إلغاء الدفع | `neutral` | The user cancelled at the payment step; no money taken |
| Refund requested | تم طلب الاسترداد | `neutral` | Refund requested, not yet approved |
| Refund in progress | الاسترداد قيد التنفيذ | `neutral` | Refund approved, money not yet returned |
| Refunded | تم الاسترداد | `success` | Money returned |

The payment states must match the states the Dubai Pay integration actually reports ([OQ-4](#open-questions)).

- **CNT-19.** "Paid" MUST NOT be shown as, or imply, "Approved". "Received" MUST NOT be shown as, or imply, "Completed".

### How we check

- The team shows the content review record for both languages (CNT-16) and the glossary entries it added (CNT-15).
- The panel reads the main journey in each language, checks five error messages against the templates, and checks every status shown against [9.6](#status-vocabulary).
- The panel searches the Arabic content for imperative verbs and gender-marked second-person verbs (CNT-11).

---

<a id="components"></a>

## 10. Components

<a id="library"></a>

### 10.1 The component library

The Shared Channels component library is a set of web components built with StencilJS, with the tag prefix `sc-`. One build works in plain HTML and JavaScript and in any framework. The components have no runtime dependency other than Stencil, and no dependency on React or any other framework. Generated wrappers for React, Angular and Vue are a later step; they wrap the same components.

Each component's specification (`components/specs/<tag>.md`) sets its anatomy, behaviour, states, Arabic behaviour and budget, and its `readme.md` lists its properties, events, slots and parts. This chapter does not repeat them.

- **CMP-01.** Where an `sc-` component exists for a need, services MUST use it. They MUST NOT rebuild it, copy its code into a local version or restyle it beyond its documented parts.
- **CMP-02** (changed in v2). Services MUST load the library stylesheet (`sc.css`, which holds the tokens, type roles and shared styles) once per page, with a `<link>` in `<head>` and never through `@import`, and set `lang`, `dir`, `data-channel` and (optionally) `data-theme` on an ancestor, normally through `sc-page`. They MUST NOT set colours on individual components. A service's own unlayered CSS overrides the library's cascade layers without `!important`. A service that puts its own CSS in cascade layers (a layered framework, for example) MUST declare its layer order before both stylesheets, so that the layers holding its overrides come after the library's `sc` layer (for example `@layer base, sc, components, utilities;`, `docs/v2/migration.md` §1).
- **CMP-03.** A service that needs something the library does not have MUST first check the backlog ([10.4](#backlog)) and talk to the design system team ([18](#contributing)). Anything built locally in the meantime MUST follow `CONVENTIONS.md` and pass the same tests, and is recorded as an [exception](#exceptions).
- **CMP-04** (changed in v2). Field components and `sc-button` render native elements into the page (light DOM): each field renders its own `<label>`, control, hint and error and links them. Services MUST NOT add a separate `<label>` next to an `sc-` field. Because the control is a real element in the page, a service's own `aria-describedby`, error summary links and `form.elements` reach it by its ID. These components have no `::part()` styling hooks; their documented classes take that role.
- **CMP-07** (new in v2). Forms built with `sc-` fields and `sc-button` MUST submit when the user presses Enter in a single-line field, through the form's default (first submit) button, as native forms do. Services MUST NOT block implicit submission. Choosing an option still never submits ([Q-05](#pat-questions)).

<a id="component-index"></a>

### 10.2 Component index

| Family | Component | Use it for | Do not use it for |
| --- | --- | --- | --- |
| Actions and navigation | `sc-button` | Starting an action: "Continue", "Pay with Dubai Pay". One `primary` per page or section; `secondary` (outlined), `tertiary` (link-style) and `destructive` variants; `handoff` (city indigo) for Dubai Pay and other shared hand-offs ([CMP-10](#component-decisions)); `loading` state; `href` for a "Start now" call to action | Going somewhere else: use `sc-link`. Signing in with UAE PASS ([CMP-11](#component-decisions)) |
| | `sc-link` | Going somewhere: `standalone` (with an arrow and a 44px target) or `external` (new tab, with hidden "(opens in new tab)"). For links in running text, the `.sc-link` class on a native `<a>` ([CMP-08](#component-decisions)) | Actions that submit, save or delete |
| | `sc-back-link` | "Back" to the previous step, on every step except the first | Going to the start of the service |
| | `sc-breadcrumbs` | Where a channel page sits in the channel's hierarchy, in the hero of inner pages ([CHR-07](#tpl-chrome)). The current page is text with `aria-current="page"`; below 600px, one "Back to {parent}" link | Pages inside a journey: use `sc-back-link` |
| | `sc-pagination` | Pages of a long list outside or inside `sc-table` (in its `footer` slot): "Showing 1 to 20 of 1,284 fines" / "عرض 1 إلى 20 من 1,284 مخالفة" ([LANG-22A](#numerals)) | Moving between question pages |
| | `sc-language-switch` | Switching to the same page in the other language ([5.2](#switching)) | Choosing between more than two languages |
| | `sc-skip-link` | "Skip to main content" / "الانتقال إلى المحتوى الرئيسي", first in the page; it targets `#main-content`, the `<main>` that `sc-page` renders | – |
| Site chrome ([11.9](#tpl-chrome)) | `sc-app-bar` | The top bar of transaction pages: a 4px channel rule, the back link, the channel's official name and the language switch | Channel pages outside a transaction: use `sc-site-header`; the page heading: that is the `<h1>` |
| | `sc-site-header` | The header of channel pages outside a transaction: the lockup slot, main navigation, search, language, sign in with UAE PASS or the account menu, and the channel switcher; a compact row with a modal menu below 1024px ([CHR-01](#tpl-chrome) to [CHR-04](#tpl-chrome)) | Transaction pages |
| | `sc-channel-switcher` | The channel's logo and the disclosure that lists the seven channels, in the header's `switcher` slot ([CHR-03](#tpl-chrome)) | Labelling content about another channel: use `sc-channel-chip` |
| | `sc-account-menu` | The signed-in state in `sc-site-header`: notifications with the unread count, and a disclosure with profile, settings, "change who you act for" and sign out | Applications and payments: they are in `sc-account-nav` |
| | `sc-account-nav` | The side navigation of the signed-in account area, with count badges, the current item and sign out ([CHR-10](#tpl-chrome)) | Navigation outside the account area |
| | `sc-bottom-nav` | The signed-in primary navigation below 1024px, docked flat to the bottom edge ([CHR-10](#tpl-chrome)) | Signed-out pages; transaction pages |
| | `sc-announcement-bar` | A site-wide announcement above the header: planned maintenance, an outage, a change people need to know about; `info`, `warning` or `error`; optionally dismissible ([CHR-09](#tpl-chrome)) | A message about one page or one person's task: use `sc-callout` |
| | `sc-utility-bar` | The docked help and feedback bar on channel sites ([CHR-05](#tpl-chrome)) | Transaction pages; navigation |
| | `sc-footer` | `simple` on transaction pages: help and contact, accessibility, privacy, cookies and terms links. `grouped` on channel sites, with the Channels group ([CHR-06](#tpl-chrome)) | – |
| | `sc-channel-network` | The channel network strip on channel home pages ([CHR-08](#tpl-chrome)) | Choosing a channel from the header: use `sc-channel-switcher` |
| Form fields | `sc-text-input` | One line: plate number, Emirates ID number, email, phone, amount (`prefix-text="AED"`) | Long answers: use `sc-textarea` |
| | `sc-textarea` | Several sentences, with an optional character count | One-line answers |
| | `sc-radio-group`, `sc-radio` | One choice from about seven options or fewer | Several choices: use `sc-checkbox-group` |
| | `sc-checkbox-group`, `sc-checkbox` | Several choices, or one statement to confirm | One choice |
| | `sc-select` | One choice from a long list | Up to about seven options: use radios |
| | `sc-date-input` | A date people know: date of birth, policy start date | Choosing dates from a calendar |
| | `sc-date-range` | A start and end date related to a calendar: filtering payments, the nights of a stay | One known date |
| | `sc-search` | Searching a channel or a list of services | Filtering a table |
| | `sc-filter-chips` | The filters applied to a list of results, as removable chips beside the result count, with "Clear all filters". Removal is instant, focus moves to the next chip, and the new count is announced | Choosing filters: that is a form (planned `sc-filter`) |
| Feedback and status | `sc-error-summary` | Listing every error at the top of the page after a submission ([CMP-05](#component-decisions)) | Problems not caused by the user's answers: use `sc-callout tone="error"` |
| | `sc-callout` | An important message in the content: `info`, `success`, `warning` or `error`; at most one per section | Field errors; the status of an item in a list |
| | `sc-status-tag` | The status of an application, task or payment, from [9.6](#status-vocabulary), in a semantic tone ([CMP-12](#component-decisions)) | Messages the user must read; labels about another channel |
| | `sc-channel-chip` | Pointing to another channel that offers the service: "Also on Dubai Transport" / "متوفر أيضًا في مواصلات دبي" | The main way forward |
| | `sc-step-progress` | The stepper: "Step 2 of 4" in a linear journey of 2 to about 7 question pages ([CMP-09](#component-decisions)) | Long or branching journeys where the total is not known |
| | `sc-step-list` | A life event as an ordered list of services, which may span channels: a row on another channel takes that channel's colour and an "On Dubai Transport" / "على مواصلات دبي" chip | The steps of one transaction: use `sc-step-progress` |
| | `sc-timeline` | The status history of an application; the latest entry is current ([13.14](#pat-track)) | Steps still to come |
| | `sc-notification-list` | Notifications in the account area, grouped by day. Each notification is one link; unread ones have a fill, a dot, a Bold title and a hidden "Unread:" / "غير مقروء:" | Something the user must act on now: use `sc-attention-card` |
| | `sc-empty-state` | An empty list or a search with no results: an icon, a heading, one sentence and one action; `variant="success"` for an all-clear | Errors: use `sc-callout tone="error"` |
| | `sc-modal` | A short secondary task, as a centred dialog from 600px and a bottom sheet below; with `alert` and `countdown`, the session timeout warning ([13.10](#pat-timeout)) | Anything a full page can do; content people need beside the page |
| | `sc-spinner` | A short inline wait, with a label saying what is loading | A button's own loading state: use `sc-button loading` |
| Content and layout | `sc-page` | The page frame: header, `<main id="main-content">` and footer, with language, direction and channel set once; it reserves space for a sticky header, the utility bar and the bottom navigation | – |
| | `sc-container` | Page margins; `width="reading"` for question pages and running text (CSS only) | – |
| | `sc-grid` | 4, 8 and 12-column layouts (CSS only) | Tabular data: use `sc-table` |
| | `sc-card` | Grouping related content on a flat surface: `outlined` (default) or `filled` for totals | A link to a service: use `sc-service-card` |
| | `sc-service-card` | A link to a service in a listing: the title is the only link ([CMP-06](#component-decisions)) | Content that is not a single link |
| | `sc-tile` | One link to a life event, a category or a favourite service: a tinted icon tile, a title and an optional count ("14 services") | A service with its owning entity: use `sc-service-card` |
| | `sc-attention-card` | One thing that is due (a bill, a document, an expiring registration): an icon tile in the status tag's tone, the tag, a heading, a fact, a meta line and one action. It has no coloured edge and is not a link | Items with nothing to do |
| | `sc-module-card` | A titled module on a signed-in page, with a header link named with the title ("View all, Applications") and its content | A single link: use `sc-tile` or `sc-service-card` |
| | `sc-accordion` | Sections that open and close, for frequently asked questions and long guidance, built on native `<details>` | Questions in a journey; content everyone needs |
| | `sc-channel-hero` | The top of a channel's home or section page: a flat band with the heading and search ([CHR-07](#tpl-chrome)) | Question pages |
| | `sc-summary-list`, `sc-summary-row` | Check your answers; the details of one thing | Comparing several things: use `sc-table` |
| | `sc-table` | Comparing rows of the same kind of thing: fines, payments, applications; sorting, selection, `compact` density for staff tools | Layout; the details of one thing |
| | `sc-ltr` | Isolating left-to-right values in page markup ([5.4](#bidi)) | Whole sentences in another language |

<a id="component-decisions"></a>

### 10.3 Decisions about components

These rules decide how components behave where version 1.0 or the v1 library did otherwise, or where a service might be tempted to change them. The components follow them, except for the known gaps at the end of this section.

**Error summary.**

- **CMP-05.** When the page loads with errors, or when errors are added after a submission, focus MUST move to the error summary (`tabindex="-1"`), so screen readers read its heading and the list. The summary MUST NOT also carry `role="alert"`: with focus moving to it, the alert role makes some screen readers announce it twice. This follows GOV.UK Design System practice.
- `sc-error-summary` follows CMP-05: it takes focus and is a `role="group"` named by its heading, "There is a problem" / "توجد مشكلة", with no `role="alert"`.
- The page `<title>` starts with "Error: " / "خطأ: " while errors are shown. Each item links to the field's `id`; the field components delegate focus so the link lands in the control.

**Service card.**

- **CMP-06.** A service card's link is its title, inside the heading. The link's hit area MUST NOT be stretched over the whole card, and the card MUST NOT be wrapped in a link. A channel chip link, if present, is a separate link. Keyboard and screen reader users meet one link per card, named by the service title, and the owning entity is its description.
- `sc-service-card` follows CMP-06: the title link's target grows to 44 × 44 without covering the card, and the arrow at its top end is decorative, not a second link.
- The card shows the service name, the owning entity and, when relevant, a channel chip. Fees, eligibility and timings belong on the service detail page ([11.2](#tpl-start)), not on the card.

**Links.**

- **CMP-08** (new in v2). Links MUST be underlined in every state, in `--sc-color-channel-action` (or `--sc-color-primary` in the shared network chrome), with the underline thickening on hover. Visited links are not styled differently. Standalone links use `sc-link`; links inside running text use the CSS-only `.sc-link` class on a native `<a>`, so text selection and find-in-page work across them. A link MUST NOT be styled as a button by removing its underline, except in the navigation of the header, footer and menus.

**Stepper.**

- **CMP-09** (new in v2). In `sc-step-progress`, completed and current step markers MUST use the channel action colour, and completed markers MUST carry a check icon, so that completion does not depend on colour. The current step also has a halo and `aria-current="step"`. Green (`--sc-color-success`) is reserved for genuine success messages and MUST NOT mark completed steps.

**Shared hand-offs and UAE PASS.**

- **CMP-10** (new in v2). Buttons that hand the user to a shared government service other than UAE PASS (pay with Dubai Pay, for example) MUST use `sc-button variant="handoff"`: city indigo (`--sc-color-primary`, with `--sc-color-on-primary` text) on every channel, so they never look like a channel's own action. If Dubai Pay or another provider mandates its own button, that button is used instead ([LEG-03](#legal), [OQ-4](#open-questions)).
- **CMP-11** (new in v2). "Sign in with UAE PASS", and any "confirm with UAE PASS", MUST use the official UAE PASS button exactly as the UAE PASS button specification sets it: its colours, fingerprint mark, English and Arabic labels, sizes, variants and dark-mode treatment. It is a brand exception: services MUST NOT restyle it, recolour it to the channel or to city indigo, or replace its mark, and it is never an `sc-button`. Until the official kit is in the library ([OQ-3](#open-questions)), `sc-site-header` shows a clearly marked placeholder (a black button with the white label "Sign in with UAE PASS" and a fingerprint glyph, 56px tall, the same on every channel and in both themes), which the official button replaces through the header's `signin` slot.

**Status tags.**

- **CMP-12** (new in v2). `sc-status-tag` shows a status from [9.6](#status-vocabulary) in a semantic tone: `neutral`, `info`, `success`, `warning` or `error`. Its `channel` tone (`--sc-color-channel-action` text on `--sc-color-channel-subtle`) is a highlight that is not a status, such as a "Life event" label; services MUST NOT use it for a status. A label that refers to another channel uses `sc-channel-chip`, not a status tag.

**Known gaps in current components**

- Two default Arabic strings use the imperative, which [CNT-11](#arabic-style) does not allow: the call item of `sc-utility-bar` ("اتصل") and the sign-in hint in the `sc-site-header` mobile menu ("سجّل الدخول لعرض مهامك…"). They are to be rewritten in the library (for example "الاتصال" and "يمكنك تسجيل الدخول لعرض مهامك ومدفوعاتك والخدمات المحفوظة."); neither component offers an override.

<a id="backlog"></a>

### 10.4 Planned components

These components do not exist yet. Tag names are proposed. Priority reflects how many patterns in this standard depend on each one.

| Planned component | Needed for | Priority | Until it exists |
| --- | --- | --- | --- |
| `sc-uaepass-button` | Sign in with UAE PASS anywhere in a journey, built from the official kit ([CMP-11](#component-decisions)) | High | The provider's official asset; in the header, its placeholder |
| `sc-file-upload` | Upload documents ([13.7](#pat-upload)) | High | Native `<input type="file">` with a visible label, following [13.7](#pat-upload) |
| `sc-combobox` | Nationality, area, business activity and other long lists people type into | High | `sc-select` with the full list |
| `sc-notification-banner` | Page-level messages, including the result of an action on the next page | High | `sc-callout` at the top of `<main>`. Site-wide interruptions use `sc-announcement-bar` |
| `sc-panel` | The confirmation panel with the reference number ([11.5](#tpl-confirmation)) | High | `sc-card` with a heading and the reference in `sc-ltr` |
| `sc-task-list` | Task list pages ([11.6](#tpl-task-list)) | High | A list of links with `sc-status-tag` |
| `sc-details` | Help text revealed on request | High | Native `<details>` and `<summary>` |
| `sc-cookie-banner` | Cookie consent ([14.4](#cookies)) | High | A service-built banner meeting [14.4](#cookies) |
| `sc-plate` | Showing a vehicle plate as a plate | Medium | Page markup with the plate in `sc-ltr` |
| `sc-filter` | Choosing filters for service search results | Medium | A form with checkboxes and a submit button, with `sc-filter-chips` for the filters applied |
| `sc-exit-page` | Quick exit for sensitive services ([13.19](#pat-quick-exit)) | Medium | A service-built link meeting [13.19](#pat-quick-exit) |
| `sc-warning-text`, `sc-inset-text` | Legal warnings and quoted information | Medium | `sc-callout` |
| `sc-phase-banner` | Showing that a service is in beta | Medium | `sc-callout tone="info"` under the app bar |
| `sc-chip` (suggestion and toggle), `sc-icon-tile` | Suggestion and toggle chips outside the hero; a standalone tinted icon tile | Low | The hero's suggestion chips; the icon slots of `sc-tile` and `sc-service-card` |
| `sc-tabs` | Closely related views | Low | Separate pages |
| `sc-progress-bar`, skeleton | Long processes with measurable progress | Low | `sc-spinner` with a label |

Not planned: toasts. Outcomes are shown in the page with `sc-callout` or `sc-notification-banner`, where they persist and can be found again. Inputs for phone numbers, amounts, Emirates ID numbers, plates and one-time codes are configurations of `sc-text-input`, not new components ([12](#ask)).

Whether Dubai Pay needs its own button component depends on whether it mandates one ([OQ-4](#open-questions)).

### How we check

- The panel inspects the service's pages for `sc-` components where one exists for the need, and for local copies or restyled components (CMP-01).
- For each local component, the team shows its exception record and its test results against `CONVENTIONS.md` (keyboard, axe in English and Arabic, light and dark).
- The panel checks that `sc.css` is loaded once, by `<link>`, and that no component has colours set on it directly (CMP-02).
- The panel presses Enter in a single-line field on a question page and checks that the form submits (CMP-07).
- The panel checks that links in running text are underlined (CMP-08) and that completed steps are in the channel colour with a check (CMP-09).
- On two channels and in both themes, the panel checks that the Dubai Pay button is city indigo or the provider's asset (CMP-10), and that the UAE PASS button is the official button, or the header's marked placeholder, identical on both channels (CMP-11).
- The panel checks that every status tag shows a status from [9.6](#status-vocabulary) in a semantic tone (CMP-12).

---

<a id="templates"></a>

## 11. Page templates

Every page uses one of these templates. Each lists the content it must contain, in order.

<a id="tpl-shell"></a>

### 11.1 Page shell and title

```html
<sc-page lang="en" channel="transport" sync-document>
  <div slot="header">
    <sc-skip-link href="#main-content"></sc-skip-link>
    <sc-app-bar sticky>
      <sc-back-link slot="start" href="/en/renew-vehicle-registration/vehicle"></sc-back-link>
      <span slot="title">Dubai Transport</span>
      <sc-language-switch slot="end" href="/ar/renew-vehicle-registration/plate"></sc-language-switch>
    </sc-app-bar>
  </div>
  <sc-container width="reading">…</sc-container>
  <sc-footer slot="footer" help-href="/en/help" accessibility-href="/en/accessibility"
             privacy-href="/en/privacy" cookies-href="/en/cookies" terms-href="/en/terms">
  </sc-footer>
</sc-page>
```

This is the shell of a transaction page. `sc-app-bar` shows the channel's official name when its `title` slot is empty. Channel pages outside a transaction use `sc-site-header` and the grouped footer instead ([11.9](#tpl-chrome)). How the page links the stylesheet and preloads its font is in [PERF-10](#performance).

- **TPL-01** (changed in v2). Every page MUST use a page shell: skip link, a header with the channel name and the language switch (`sc-app-bar` on transaction pages, `sc-site-header` on channel pages), one `<main>`, and the footer with all four standard links plus "Cookies". Neither header is fixed by default; a sticky header sets `scroll-padding-top` so it never covers focus ([A11Y-05](#beyond-wcag)).
- **TPL-02.** The page `<title>` MUST be "{Page heading} – {Service name} – {Channel name}" in the page language, for example "What is your plate number? – Renew vehicle registration – Dubai Transport" / "ما رقم لوحة المركبة؟ – تجديد ترخيص المركبة – مواصلات دبي". It starts with "Error: " / "خطأ: " while errors are shown. Pages outside a service omit the service name.
- **TPL-03.** Each page MUST have exactly one `<h1>`, and it MUST match the first part of the title.

<a id="tpl-start"></a>

### 11.2 Service detail page (start page)

The page a user reaches from search, a channel listing or a link. It is public: it never requires sign-in.

Content, in order:

1. `<h1>`: the service name ("Renew vehicle registration" / "تجديد ترخيص المركبة").
2. One or two sentences on what the service lets the user do.
3. Who can use it, and who cannot (with a link to the right service for them).
4. **Before you start** (قبل البدء): what the user needs (documents, information, the fee and how to pay it, whether they need UAE PASS, whether they can act for someone else), how long the form takes, and how long the decision takes. Fees and timings follow [9.4](#style-guide).
5. The start button: `<sc-button href="…" icon="arrow-forward">Start now</sc-button>` / "البدء الآن" (a verbal noun, not the imperative "ابدأ الآن").
6. Other ways to apply, and help ([13.17](#pat-help)).
7. The owning entity, as text, and channel chips for other channels that list the service.
8. The date the content was last reviewed.

- **TPL-04.** Every fact on the page MUST come from the canonical record ([SVC-15](#service-record)). Prerequisites MUST NOT appear for the first time later in the journey.
- **TPL-05.** If the service is temporarily closed, the page stays up, says so in an `sc-callout tone="warning"` at the top, and gives the alternative route and the next confirmed update, if there is one.

<a id="tpl-question"></a>

### 11.3 Question page

- **TPL-06.** Each question page SHOULD ask one question. Related professional fields MAY be grouped on one page when research shows it helps.
- **TPL-07.** When the page asks one question, the question is the page heading: set `heading-level="1"` on the field component (its label or legend becomes the `<h1>`). Otherwise the page has its own `<h1>` and each field a visible label.
- **TPL-08.** Content, in order: back link (in the app bar), `sc-step-progress` (for linear journeys only), the error summary when there are errors, the heading, any short explanation, the field or fields, the "Continue" button (متابعة). A "Save and finish later" secondary button follows it where saving is offered ([13.9](#pat-save)).
- **TPL-09.** The page uses `sc-container width="reading"`.

<a id="tpl-check"></a>

### 11.4 Check answers page

- **TPL-10.** Before any submission, declaration or payment, the service MUST show every answer in `sc-summary-list`, grouped under headings that match the journey's sections, with a "Change" link (`action-href`) for each answer the user can change. The hidden text after "Change" names the answer, so screen readers hear "Change plate number".
- **TPL-11.** Following "Change" MUST return to the question with the answer filled in, then back to this page, through any new questions the change makes necessary.
- **TPL-12.** The page shows the amount to pay, if any, and any declaration in plain language, then one button that says what it does: "Submit application" (إرسال الطلب) or "Continue to payment" (المتابعة إلى الدفع).
- **TPL-13.** Optional questions the user skipped show "Not provided" (لم يتم تقديمه), not an empty value.

<a id="tpl-confirmation"></a>

### 11.5 Confirmation page

- **TPL-14.** The confirmation page MUST appear only after the server confirms what it reports.
- **TPL-15.** Content, in order: a panel with what happened ("Application received" / "تم استلام الطلب") and the reference number, isolated; what happens next and who does it; how long it should take, if confirmed; how to track progress; what to do if nothing happens; how to get a receipt; and help.
- **TPL-16.** The heading MUST say exactly what happened. "Received" when processing continues; "Registration renewed" (تم تجديد ترخيص المركبة) only when the outcome is delivered. A payment confirmation MUST NOT say or imply the application is approved.
- **TPL-17.** Reloading the page or pressing Back MUST NOT submit or pay again; it shows the same confirmation or the tracking page.
- **TPL-18.** The confirmation MUST be available as an HTML page in the user's account or tracking page. A PDF receipt MAY be offered as well, not instead.

<a id="tpl-task-list"></a>

### 11.6 Task list page

- **TPL-19.** Use a task list only when a service has several sections that can be completed in any order or over several sessions. Each task is a link with its status from [9.6](#status-vocabulary); a task that cannot start yet is text, with the task it depends on named next to it.
- **TPL-20.** The page heading says what the list is for ("Apply for a building permit"), with a summary such as "You have completed 3 of 6 sections" (أكملت 3 من 6 أقسام). Check answers becomes available when every required task is completed.

<a id="tpl-errors"></a>

### 11.7 Error pages

| Page | Heading (EN / AR) | Must contain |
| --- | --- | --- |
| Page not found (404) | Page not found / الصفحة غير موجودة | "If you typed the web address, check it is correct." A link to the channel's search and home page. Help contact. Never a stack trace or code |
| There is a problem with the service (500) | Sorry, there is a problem with the service / نعتذر، توجد مشكلة في الخدمة | Whether answers were saved. When to try again, without inventing a time. Other ways to complete the task. Help contact |
| Service unavailable (503, planned or not) | Sorry, the service is unavailable / نعتذر، الخدمة غير متاحة حاليًا | When it will be available, only if confirmed. What happens to saved answers. Other routes. The same page is used by every channel listing the service |
| No permission | You cannot view this page / لا يمكنك عرض هذه الصفحة | Why in general terms, without revealing whether a record exists. How to switch account or represented organisation. Help contact |

- **TPL-21.** Error pages MUST use the page shell, return the matching HTTP status, and be available in both languages.

<a id="tpl-other"></a>

### 11.8 Cookies, privacy and accessibility pages

- The cookies page is defined in [14.4](#cookies), the privacy notice in [14.2](#privacy-notice) and the accessibility statement in [Appendix C](#appendix-statement). Each uses the page shell and `sc-container width="reading"`.

<a id="tpl-chrome"></a>

### 11.9 Channel-site chrome

Channel pages outside a transaction (a channel's home, topic and section pages, search results and the signed-in account area) share one set of chrome, carried over from the Phase 1 Dubai Now reference. It is the same on every channel; only the channel roles change. Transaction pages keep the shell in [11.1](#tpl-shell).

**Header**

- **CHR-01** (new in v2). The channel-site header (`sc-site-header`, a `<header>` landmark) MUST hold, from the inline-start edge: the Government of Dubai lockup ([CHR-02](#tpl-chrome)); the main navigation, a `<nav>` labelled "Main" / "رئيسية"; search; the language switch ([LANG-04](#switching)); sign in, with the official UAE PASS button ([CMP-11](#component-decisions)), or the account menu (`sc-account-menu`) once signed in; and the channel's logo and the channel switcher ([CHR-03](#tpl-chrome)) at the inline-end edge. The order mirrors in Arabic. The bar is flat `--sc-color-surface` with a 1px `--sc-color-outline-variant` rule beneath it. The current navigation item is marked by `--sc-color-channel-action` text, a 3px bar in the same colour, Bold text and `aria-current="page"`. The full row MUST NOT wrap or clip: where it does not fit (long Arabic labels at 1024–1279px, for example), the header uses the compact row of [CHR-04](#tpl-chrome) instead.
- **CHR-02** (new in v2). The Government of Dubai lockup MUST appear at the inline-start edge of every channel-site header, identical on every channel. It is the official artwork from The Executive Council, used exactly as supplied: it MUST NOT be recoloured, cropped, converted or mirrored, including in Arabic ([5.6](#mirroring)), and no entity logo may replace it or sit beside it ([SVC-02](#channel-theme)). The library ships no logo: `sc-site-header` takes the lockup through its `lockup` slot, and public demonstration pages use a neutral placeholder of the same proportions labelled "Government of Dubai lockup". The artwork is not published in the public repository or on public demonstration pages until the initiative has the usage manual or approval that Law No. (1) of 2025 requires ([OQ-30](#open-questions)). The lockup has a text alternative in the page language: "Government of Dubai" / "حكومة دبي". Until the Executive Council's rules are known, it is at least 40px tall in the header, keeps clear space on every side equal to the height of the wordmark's capital "G", and sits on a white plate on dark surfaces.
- **CHR-03** (new in v2). The channel switcher MUST be a disclosure, not an ARIA menu: a `<button>` with `aria-expanded`, whose accessible name includes the current channel ("Choose a channel: Dubai Transport"), opening a non-modal panel. The panel lists all seven channels as links, in the order of [3.1](#seven-channels), each with its name and a one-line descriptor in the page language and a swatch in that channel's own colour ([FND-26](#colour)). Each link leads to that channel's home page in the current language. The current channel carries a check and `aria-current="true"`. Escape and a click outside close the panel, Escape returns focus to the button, and the panel closes when focus leaves it. Opened from the keyboard it appears instantly ([MOT-02](#motion)).
- **CHR-04** (new in v2). Below 1024px the header row MUST keep the menu button, the lockup, the language switch and the channel switcher (which MAY shrink to the channel's logo, keeping its accessible name with the channel's name). Navigation, search and sign in (or the account menu) move into the mobile menu: a modal `<dialog>` labelled by its title, with focus on its close button when it opens, Escape closing it and returning focus to the menu button, and the page behind it inert. The menu button has `aria-expanded`.

**Utility bar**

- **CHR-05** (new in v2). Where a channel site offers a utility bar (`sc-utility-bar`: help and feedback links such as the Happiness Meter / "مؤشر السعادة", the call centre, chat / "المحادثة" and accessibility options), from 1024px it MUST be a flat bar docked to the bottom edge across the full width, at `--sc-elevation-1`, with a 1px `--sc-color-outline-variant` hairline along its top and no upward shadow. It is not a floating capsule. It is a `<nav>` labelled "Help and feedback" / "المساعدة والملاحظات". Every item keeps a visible text label beside its icon; labels MUST NOT collapse to icons. The page reserves the bar's height (`padding-block-end` and `scroll-padding-bottom`), so the bar never covers content or the focused element ([A11Y-05](#beyond-wcag)). Below 1024px it folds into the footer as a "Help and feedback" group. It is present when the page loads and does not animate.

**Footer**

- **CHR-06** (new in v2). Channel-site pages MUST use the grouped footer: the channel's brand group; a Channels group listing all seven channels as links, in the order of [3.1](#seven-channels); and the "Helpful information" / "معلومات مفيدة" and "Legal" / "المعلومات القانونية" groups, which together carry every required link ([LEG-01](#legal), [TPL-01](#tpl-shell)). Each group has an `<h2>` heading. In the Channels group the current channel is Bold with `aria-current="true"`, without a swatch. Apart from the Channels group, the footer is not a sitemap: it holds only the required links, help and contact, and the channel's own description. The footer sits on `--sc-color-surface`, never on a dark band, and its links are underlined in `--sc-color-on-surface`.

**Hero and network**

- **CHR-07** (new in v2). The hero of a channel's home or section page (`sc-channel-hero`) MUST be a flat `--sc-color-channel-subtle` band: no gradient, wash, shadow or image behind text. It holds, in order: breadcrumbs on inner pages, an optional eyebrow in `--sc-color-channel-action`, the `<h1>` in a display role ([FND-29](#typography)), `sc-search`, and optionally a row of suggestion chips. Services follow the hero directly.
- **CHR-08** (new in v2). A channel's home page SHOULD end with the channel network strip (`sc-channel-network`), after the last content band and before the footer. It lists all seven channels in the order of [3.1](#seven-channels), in the same place on every channel. City indigo marks it as shared ([FND-25](#colour)); each tile carries its own channel's colour only as attribution ([FND-26](#colour)); the current channel's tile is text, not a link, says "You are here" and carries `aria-current="true"`. The strip is a `<nav>` labelled "Government of Dubai channels".

**Announcements and signed-in navigation**

- **CHR-09** (new in v2). A site-wide announcement (planned maintenance, an outage, a change people need to know about) MUST use `sc-announcement-bar`, after the skip link and before the header: a region labelled "Announcement", present when the page loads, and not a live region or an alert. If it can be dismissed, its 44 × 44 dismiss button is named, focus moves to the next element after the bar, and the choice MAY be remembered for later pages. A message about one page or one person's task is not an announcement ([10.2](#component-index)).
- **CHR-10** (new in v2). The signed-in account area MUST use `sc-account-nav` for its own navigation (a side list, which becomes a row that scrolls sideways below 600px), and below 1024px `sc-bottom-nav` as the primary navigation, with three to five destinations. The bottom navigation is docked flat to the bottom edge with targets of at least 44px, and the page reserves its height, so it never covers content or the focused element ([A11Y-05](#beyond-wcag)). Its current item has a Filled icon, an indicator in `--sc-color-channel-container` and `aria-current="page"` ([A11Y-06](#beyond-wcag)).

### How we check

- The panel opens each template the service uses and checks content order, the single `<h1>`, the title format and the footer links (TPL-01 to TPL-03).
- The panel submits the check answers page twice quickly and reloads the confirmation page; neither may create a second submission (TPL-17).
- The panel requests a non-existent URL in both languages and checks the 404 page and status.
- On a channel site, the panel checks the header order and the Government of Dubai lockup in both languages (CHR-01, CHR-02); opens the channel switcher and the mobile menu with the keyboard and the pointer, and closes each with Escape (CHR-03, CHR-04); tabs to the last element above the utility bar at 400% zoom to confirm nothing is covered (CHR-05); and checks the footer's Channels group, the flat hero and, on the home page, the network strip (CHR-06 to CHR-08). It checks the lockup is the supplied artwork, unmirrored in Arabic and at least 40px tall (CHR-02); dismisses an announcement with the keyboard (CHR-09); and, signed in at 390px, tabs to the last element above the bottom navigation (CHR-10).

---

<a id="ask"></a>

## 12. Ask users for

These patterns cover the information services ask for most often. Each starts from one rule: do not ask for it if the service can get it from UAE PASS, another government record or an earlier answer ([principle 6](#principles)).

<a id="ask-general"></a>

### 12.1 Rules for every question

- **ASK-01.** Every question MUST have a recorded purpose in the service's question protocol ([PRV-02](#minimisation)). A question without one is removed.
- **ASK-02.** Information returned by UAE PASS or another authoritative record MUST be shown to the user, not asked again. If it is wrong, the page explains how to correct it at the source; editing it locally MUST NOT appear to change the official record.
- **ASK-03.** Fields MUST accept the formats people naturally type: spaces, hyphens, upper or lower case and Arabic-Indic digits ([LANG-21](#numerals)). The service normalises them; it does not reject them.
- **ASK-04.** Fields MUST use the right `autocomplete` token so browsers and password managers can fill them (WCAG 1.3.5), and MUST allow pasting.
- **ASK-05.** Left-to-right values use `sc-text-input ltr` ([LANG-17](#bidi)). Identifiers use `inputmode="numeric"` where they are digits only, never `type="number"`.

<a id="ask-table"></a>

### 12.2 Field reference

| Information | Component and settings | `autocomplete` | Accept and validate | Error (EN / AR) |
| --- | --- | --- | --- | --- |
| Full name | `sc-text-input`, `width="full"` | `name` | One field unless the service needs parts. Any script, single names, apostrophes, hyphens, up to at least 100 characters. Never transliterate | Enter your full name / يُرجى إدخال الاسم الكامل |
| Name as on a document | `sc-text-input`, label "Your name as shown on your passport" | `name` | As above; explain why the exact spelling matters | Enter your name as it is shown on your passport / يُرجى إدخال الاسم كما هو مكتوب في جواز السفر |
| Emirates ID number | `sc-text-input ltr`, `width="20"`, `inputmode="numeric"`, hint "For example, 784-1990-1234567-1" | – | 15 digits starting with 784; hyphens and spaces optional. Stored without separators | Enter your Emirates ID number in the correct format, like 784-1990-1234567-1 / يُرجى إدخال رقم الهوية الإماراتية بالصيغة الصحيحة، مثل 784-1990-1234567-1 |
| Passport number | `sc-text-input ltr`, `width="10"` | – | Letters and digits as printed; no country-specific format check | Enter your passport number / يُرجى إدخال رقم جواز السفر |
| Nationality | `sc-select` (planned: `sc-combobox`) | `country-name` | The full country list, in the page language, sorted alphabetically for that language | Select your nationality / يُرجى اختيار الجنسية |
| Date of birth | `sc-date-input autocomplete="bday"`, hint "For example, 27 3 1990" | `bday-day`, `bday-month`, `bday-year` | A real date in the past | Date of birth must be in the past / يجب أن يكون تاريخ الميلاد في الماضي |
| Email address | `sc-text-input ltr type="email"` | `email` | Contains "@" and a domain; no other format rules | Enter an email address in the correct format, like name@example.com / يُرجى إدخال البريد الإلكتروني بالصيغة الصحيحة، مثل name@example.com |
| Mobile phone | `sc-text-input ltr type="tel"`, `width="20"`, hint "For a number outside the UAE, include the country code" | `tel` | UAE numbers with or without +971 or a leading 0; international numbers with a country code. Stored in international format | Enter a mobile number, like 050 123 4567 or +971 50 123 4567 / يُرجى إدخال رقم الهاتف المتحرك، مثل 050 123 4567 أو +971 50 123 4567 |
| Address in Dubai | See [12.3](#ask-address) | `address-line1`, `address-line2`, `address-level2` | No postcode. Map never required | Enter the building name or number / يُرجى إدخال اسم المبنى أو رقمه |
| Makani number | `sc-text-input ltr`, `width="10"`, `inputmode="numeric"` | – | 10 digits; spaces optional | Enter the Makani number using numbers only / يُرجى إدخال رقم مكاني بالأرقام فقط |
| Vehicle plate | Three fields: emirate (`sc-select`), plate code (`sc-text-input ltr width="4"`), plate number (`sc-text-input ltr width="10" inputmode="numeric"`) | – | Plate number up to 5 digits; code as issued | Enter the plate number using numbers only, like 12345 / يُرجى إدخال رقم اللوحة بالأرقام فقط، مثل 12345 |
| Trade licence number | `sc-text-input ltr`, `width="20"` | – | As issued by the licensing authority; ask which authority first when formats differ | Enter the trade licence number / يُرجى إدخال رقم الرخصة التجارية |
| Bank account (IBAN) | `sc-text-input ltr`, `width="full"`, hint "Starts with AE, 23 characters" | – | UAE IBANs: "AE" and 21 digits; spaces optional; checksum validated. Show the bank name back for confirmation | Enter an IBAN in the correct format, like AE07 0331 2345 6789 0123 456 / يُرجى إدخال رقم الآيبان بالصيغة الصحيحة، مثل AE07 0331 2345 6789 0123 456 |
| Amount | `sc-text-input ltr`, `prefix-text="AED"`, `inputmode="decimal"`, `width="10"` | – | Digits with optional thousands commas and up to two decimals | Enter the amount in dirhams, like 450.00 / يُرجى إدخال المبلغ بالدرهم، مثل 450.00 |
| Verification code | `sc-text-input ltr`, `width="10"`, `inputmode="numeric"`, one field | `one-time-code` | Paste and autofill allowed. Say where the code was sent and when it expires; offer "Send a new code" | Enter the 6-digit code we sent to +971 50 123 4567 / يُرجى إدخال الرمز المكوّن من 6 أرقام المرسل إلى +971 50 123 4567 |
| Payment card | Never collected by the service | – | Card details are entered only on Dubai Pay ([13.12](#pat-pay)) | – |

- **ASK-06. Sex and gender.** Ask only when the service has a recorded legal or operational need, and take it from UAE PASS or the official record where available. Do not ask for gender to decide how to address the user ([CNT-11](#arabic-style)).
- **ASK-07. Equality and diversity information.** Do not collect it as part of a transaction. Where research or monitoring needs it, ask separately, after the transaction, make every question optional with a "Prefer not to say" (أفضّل عدم الإجابة) option, and explain how it is used.
- **ASK-08. People without an Emirates ID or a UAE phone.** Services used by visitors or by people abroad MUST offer a route for people who do not have an Emirates ID, a UAE phone number, a family name or a Latin-script name, or explain the alternative route before they start.

<a id="ask-address"></a>

### 12.3 Addresses and locations

- **ASK-09.** State why the location is needed and whether it is a physical location (a building to inspect) or a postal address.
- **ASK-10.** For Dubai locations, ask only for the parts the service needs, from: area, street, building name or number, unit, and Makani number. Offer a saved or earlier address for selection.
- **ASK-11.** A postcode MUST NOT be required. International addresses MUST adapt to the chosen country and allow countries without postcodes.
- **ASK-12.** A map or the device's location MAY help, but MUST NOT be the only way to give a location. Ask for location permission only when the user chooses that option, and explain why first. If permission is refused or the result is inaccurate, the typed route works without penalty and the service does not ask again.
- **ASK-13.** Any map selection MUST work without dragging: search, tap or click to place, and buttons to move the marker (WCAG 2.5.7). The selected location is shown as text for the user to confirm.

### How we check

- The panel reviews the question protocol and challenges any field without a purpose (ASK-01).
- The panel enters each field type with spaces, hyphens, Arabic-Indic digits and pasted values, and checks that they are accepted and normalised (ASK-03), then checks `autocomplete` in the markup (ASK-04).
- The panel gives an address with location permission refused and without a map (ASK-12, ASK-13).

---

<a id="patterns"></a>

## 13. Journey patterns

Each pattern gives when to use it, the flow, the rules, the recovery states the service must handle, the components it uses and an example in both languages. Language switching during a journey is covered in [5.2](#switching); privacy choices in [14](#privacy).

<a id="pat-find"></a>

### 13.1 Find a service

**Use when** people know their goal but not which entity or channel owns it.

**Flow.** Search, topic categories and life or business events lead to the same service records. Results lead to the service detail page ([11.2](#tpl-start)) before any sign-in.

- **FIND-01.** Every channel home page MUST offer `sc-search` and topic browsing. Search MUST work in both languages, accept synonyms, spelling variants and former names from the record, and work without choosing an autocomplete suggestion.
- **FIND-02.** Results MUST show the query, the number of results, the applied filters and a way to clear each one. Query and filters MUST be in the URL, so Back, refresh and sharing keep them.
- **FIND-03.** A search with no results MUST repeat the query, suggest corrections or broader terms, and offer browsing and help. It MUST NOT be shown when the search itself failed.
- **FIND-04.** Result counts that change without a page load MUST be announced in a polite status region.

| Recovery state | Response |
| --- | --- |
| Search is unavailable | Keep the query, say search is not working, and offer topic browsing |

**Components:** `sc-channel-hero`, `sc-search`, `sc-service-card`, `sc-tile` (categories and life events), `sc-step-list` (the services of a life event), `sc-grid`, `sc-channel-chip`, `sc-filter-chips` (the filters applied, FIND-02), `sc-pagination`, `sc-empty-state` (no results, FIND-03); planned `sc-filter`.

**Example:** Results for "renew car" (2) / نتائج البحث عن «تجديد السيارة» (2).

**Check:** search for the same service by its name, a synonym and a misspelling in each language.

<a id="pat-eligibility"></a>

### 13.2 Check eligibility

**Use when** conditions can stop an application or change its route, documents or cost.

- **ELIG-01.** Offer the check from the service detail page, before sign-in, when it does not need protected records. Say whether the result is a guide or a decision.
- **ELIG-02.** Ask only the questions needed, starting with the one most likely to rule people out.
- **ELIG-03.** An ineligible result MUST be an outcome page that names the condition and offers the right alternative, review route or help. It MUST NOT be a validation error.
- **ELIG-04.** "I do not know" MUST have a supported route. A failed verification MUST NOT be reported as ineligibility.
- **ELIG-05.** Answers MUST be carried into the application, not asked again.

| Recovery state | Response |
| --- | --- |
| Verification cannot complete | Keep the answers; offer to try again or an assisted review |

**Components:** `sc-radio-group`, `sc-button`, `sc-callout`.

**Example:** You may need a different service / قد تحتاج إلى خدمة أخرى.

**Check:** reach each outcome, including "I do not know", in both languages.

<a id="pat-multi-step"></a>

### 13.3 Navigate a multi-step service

- **NAV-01.** Every step except the first MUST have `sc-back-link` to the previous step. Browser Back MUST also work and MUST NOT lose answers or repeat a submission or payment.
- **NAV-02.** Linear journeys of 2 to about 7 question pages SHOULD show `sc-step-progress`, counting question pages only. Branching or long journeys MUST NOT show a step count or percentage that could be wrong; use a task list ([11.6](#tpl-task-list)) where sections are independent.
- **NAV-03.** The service name stays visible (in the title and, where useful, in the app bar), and the `<h1>` names the step.
- **NAV-04.** When a requirement changes after a section was completed, only the affected tasks change status, with an explanation; other answers stay.

**Components:** `sc-back-link`, `sc-step-progress`, `sc-app-bar`; planned `sc-task-list`.

**Example:** Step 2 of 4: Plate number / الخطوة 2 من 4: رقم اللوحة.

**Check:** go back and forward through a branching journey with the browser and the back link.

<a id="pat-sign-in"></a>

### 13.4 Sign in with UAE PASS

**Use when** the task needs a verified identity, protected records, a saved application or a binding submission.

- **ID-01.** Sign-in MUST be deferred until the task needs it. The service detail page and eligibility check never require it.
- **ID-02** (changed in v2). Services MUST authenticate through the official UAE PASS integration, using the official UAE PASS button, with the provider's own wording in both languages, exactly as its specification sets it ([CMP-11](#component-decisions), [OQ-3](#open-questions)). They MUST NOT create their own passwords or accounts to replace it, imitate its screens, or collect its credentials.
- **ID-03.** Before the handoff, the page explains why sign-in is needed and what information the service will receive.
- **ID-04.** The service MUST return the user to the same step, in the same language, with their draft, after success. It MUST validate the response on the server.
- **ID-05.** Signing in proves who someone is; it does not prove they may act for someone else ([13.5](#pat-represent)) or that they are eligible.
- **ID-06.** When the account lacks an attribute the service needs (for example, some visitor accounts), the service explains which and what the user can do.
- **ID-07.** Steps the service owns around sign-in MUST allow paste and password managers and MUST NOT add memory tests (WCAG 3.3.8). The whole sign-in journey, including provider pages, is part of the accessibility assessment.
- **ID-08.** The service MUST support the provider's app-to-app and browser return routes, including returning to a backgrounded app ([PLAT-03](#platform-rules)).

| Recovery state | Response |
| --- | --- |
| User cancelled | Back on the same step: "You did not sign in" / "لم يتم تسجيل الدخول", with "Try again" and help |
| Request expired or refused | Explain which, keep the draft, offer a new request |
| UAE PASS unavailable or app missing | Say so, keep the draft, offer the routes the integration supports and help. Never bypass identity checks |

**Components:** the official UAE PASS button ([CMP-11](#component-decisions); in the header, `sc-site-header`'s `signin` slot; planned `sc-uaepass-button`), `sc-callout`.

**Check:** test success, cancellation, expiry, missing attributes and app absence, in both languages.

<a id="pat-represent"></a>

### 13.5 Act for an organisation or another person

**Use when** a lawyer, employee, company representative or other authorised person acts for someone else (common on Dubai Justice, Build in Dubai, Invest in Dubai and Dubai Trade).

- **REP-01.** After sign-in and before loading protected records, ask who the user is acting for: themselves, an organisation or another person, showing only the options in scope.
- **REP-02.** Service owners MUST define what proves authority, its scope, its expiry and how it is revoked. The server MUST check it for every protected action.
- **REP-03.** The selected context MUST stay visible on every page and be repeated on check answers, payment and confirmation. Switching context MUST be explicit, and drafts, documents, searches and notifications MUST be kept separate per context.
- **REP-04.** Users MUST NOT be asked to use or share someone else's credentials.

| Recovery state | Response |
| --- | --- |
| Authority missing, insufficient or expired | Say what authority is needed and how to get it, without revealing protected information; keep the draft; offer the user's other contexts |

**Components:** `sc-radio-group` or `sc-select`, `sc-callout`, `sc-summary-list`.

**Example:** Who are you acting for? / نيابةً عمّن يُقدَّم هذا الطلب؟ (passive, so it does not mark the reader's gender).

**Check:** try a protected action with revoked authority and with a known reference that belongs to someone else; both MUST be refused by the server.

<a id="pat-questions"></a>

### 13.6 Answer questions and fix errors

- **Q-01.** Labels MUST always be visible; placeholder text MUST NOT be used for labels or instructions. Related radios and checkboxes are grouped with a legend (the group components do this).
- **Q-02.** Only optional fields are marked, with "(optional)" / "(اختياري)" (the `optional` property).
- **Q-03.** Validation MUST run on the server when the user continues. Client-side checks MAY help but MUST NOT be the only check, and MUST NOT show errors while the user is still typing.
- **Q-04.** When validation fails: answers are kept; the page title starts with "Error: "; `sc-error-summary` lists every error at the top of `<main>` and receives focus ([CMP-05](#component-decisions)); each field shows its own message using the templates in [9.5](#error-messages).
- **Q-05.** Choosing an option MUST NOT submit the form or move the user elsewhere. Questions revealed by an answer appear directly after it in reading and focus order.
- **Q-06.** Information the user has already given in the journey MUST be pre-filled or offered for selection (WCAG 3.3.7).

| Recovery state | Response |
| --- | --- |
| Submission interrupted | Keep the answers, say the page did not send, and offer to try again |

**Components:** every field component, `sc-error-summary`, `sc-button`.

**Example:** Enter your email address / يُرجى إدخال البريد الإلكتروني.

**Check:** submit each question page empty, then with wrong formats, with a screen reader on, in both languages.

<a id="pat-upload"></a>

### 13.7 Upload documents

**Use when** evidence is needed and cannot be fetched from another government system.

- **UP-01.** Before the user chooses a file, the page states what the document is for, acceptable alternatives, accepted file types and the maximum size.
- **UP-02.** Upload MUST work with a native file picker by keyboard, click and tap. Drag and drop MAY be offered as well, never alone. Taking a photo MAY be offered on phones.
- **UP-03.** Each file shows its name, size and state: uploading, checking, accepted, or rejected with the reason. "Uploaded" (transfer finished), "accepted" (passed the server's checks) and "approved" (accepted by the entity as evidence) MUST be shown as different states.
- **UP-04.** A failed file MUST NOT remove files already accepted. Each file can be removed or replaced, and the remove button names the file.
- **UP-05.** Accepted files MUST be kept in the draft and on check answers, and MUST NOT be requested again later in the journey.
- **UP-06.** Progress milestones and errors are announced politely, not every percentage.

| Recovery state | Response |
| --- | --- |
| Connection lost during upload | Keep accepted files, name the file that did not finish, offer to retry it |
| File rejected by a security check | Name the file and ask for another, without describing the check |

**Components:** planned `sc-file-upload`; `sc-callout`, `sc-button`.

**Example:** Upload your insurance certificate / إرفاق شهادة التأمين.

**Check:** upload a file that is too large, the wrong type, and lose the connection mid-upload.

<a id="pat-add-another"></a>

### 13.8 Add another item

**Use when** a service needs a variable number of people, vehicles, properties or shipment items.

- **ADD-01.** State any limit before the first item. Collect one item at a time, then show a summary list in which each item is named by its own details ("Nissan Patrol, Dubai A 48213"), not "Item 1".
- **ADD-02.** Each item has "Change" and "Remove" links that name it. Removing an item that other answers depend on explains the effect first.
- **ADD-03.** After adding or removing, focus moves to the summary heading and the change is announced.
- **ADD-04.** Reordering, where it matters, uses buttons, never dragging alone.
- **ADD-05.** Large professional datasets MAY offer a bulk upload with errors reported per row, as long as single entry still works.

**Components:** `sc-summary-list`, `sc-radio-group` ("Do you need to add another vehicle?"), `sc-button`.

**Example:** Add another property / إضافة عقار آخر.

**Check:** add the maximum, remove the focused item, and fail a save mid-list.

<a id="pat-save"></a>

### 13.9 Save and return

- **SAVE-01.** The service MUST say whether saving is automatic or by choice, how to come back, and when a draft is deleted.
- **SAVE-02.** "Saved" MUST NOT be shown until the server confirms it.
- **SAVE-03.** Returning to a draft MUST re-establish identity and authority before showing anything ([13.4](#pat-sign-in), [13.5](#pat-represent)). A link alone MUST NOT give access.
- **SAVE-04.** On return, the service shows the service name, the represented context, when it was last saved and what is left, and resumes at a useful step.
- **SAVE-05.** Drafts MUST NOT put personal information in URLs, page titles or email links.

| Recovery state | Response |
| --- | --- |
| Save failed | Say what is and is not saved; keep the session; offer to retry |
| Draft expired | Say so and offer to start again with anything still valid |

**Components:** `sc-button variant="secondary"` ("Save and finish later" / "حفظ والمتابعة لاحقًا"), `sc-callout`.

**Check:** save, close the browser, return on another device after signing in.

<a id="pat-timeout"></a>

### 13.10 Session timeout

- **TIME-01.** Where a service has an inactivity time limit, it MUST meet WCAG 2.2.1: the user can turn the limit off or adjust it beforehand, or is warned before it ends and given at least 20 seconds to extend it with a simple action, at least ten times. A security reason is not in itself an exception.
- **TIME-02.** The warning is a modal dialog with focus moved into it, a heading ("You will be signed out soon" / "ستنتهي الجلسة قريبًا"), the time remaining as text, "Stay signed in" (تمديد الجلسة) and "Sign out" (تسجيل الخروج). It MUST NOT read a countdown aloud every second.
- **TIME-03.** Extending MUST NOT lose the current answers or errors. Expiry MUST NOT submit or pay.
- **TIME-04.** At expiry, protected information is hidden, permitted progress is saved, and the user can sign in again and return to the same step, with authority checked again.
- **TIME-05.** The default inactivity time and how it relates to the UAE PASS session are set with the security owner ([OQ-18](#open-questions)).

**Components:** `sc-modal` with `alert` (no close button or scrim dismissal) and `countdown` (the time left as text, announced politely on opening, at each whole minute and at 30 and 10 seconds, never every second; nothing is submitted at zero); `sc-button`.

**Check:** let the warning appear while typing, extend it ten times, then let it expire.

<a id="pat-submit"></a>

### 13.11 Check answers and submit

The page is defined in [11.4](#tpl-check). In addition:

- **SUB-01.** Changing an answer MUST recalculate eligibility, requirements and fees, and explain anything new.
- **SUB-02.** Declarations are in plain language and never pre-ticked. Optional choices (such as reminders) are separate from required declarations.
- **SUB-03.** The final action MUST be protected against duplicates on the server, using one transaction identifier per submission. Disabling the button is not protection.
- **SUB-04.** If the response is lost, the service checks the existing submission before allowing another.

| Recovery state | Response |
| --- | --- |
| Response lost | "We are checking whether your application was sent" / "جارٍ التحقق من إرسال طلبك", then the real result |

**Check:** double-click submit, refresh during submission, and press Back after it.

<a id="pat-pay"></a>

### 13.12 Pay with Dubai Pay

**Use when** a service takes a fee, deposit or other payment.

- **PAY-01.** Before the handoff, the service shows the amount, what it is for, a breakdown where there is more than one fee, who is paying (the represented context), and the refund conditions.
- **PAY-02.** Payment MUST go through the official Dubai Pay integration and its assets. Services MUST NOT build their own card form or store card details, and MUST NOT log payment details, identity tokens or evidence in analytics or diagnostics.
- **PAY-03.** The service creates one server-side payment request per application and amount, with an idempotent reference.
- **PAY-04.** On return, the result MUST be confirmed server to server, not from browser parameters. Statuses follow [9.6](#status-vocabulary).
- **PAY-05.** While a payment is "Checking payment", the service MUST NOT offer to pay again. It offers "Check payment status" (التحقق من حالة الدفع) and help.
- **PAY-06.** Repeated taps, refreshes, duplicate callbacks and several open tabs MUST NOT charge twice.
- **PAY-07.** Payment success MUST NOT be presented as approval ([CNT-19](#status-vocabulary)). Success produces a receipt the user can get again later.
- **PAY-08.** The service states only payment methods, timings and refund conditions confirmed for the actual integration ([OQ-4](#open-questions)).

| Recovery state | Response |
| --- | --- |
| Payment failed | "Your payment did not go through. No money has been taken." / "لم تتم عملية الدفع. لم يتم خصم أي مبلغ." Offer to try again once the server confirms the failure |
| Payment cancelled | Say no money was taken; return to check answers |
| Return lost, timeout or conflicting results | Keep the reference; show "Checking payment"; reconcile; never charge again while unknown |

**Components:** `sc-summary-list` (breakdown), `sc-button variant="handoff"` ("Pay with Dubai Pay", city indigo: [CMP-10](#component-decisions)), `sc-callout`, `sc-status-tag`.

**Example:** We are checking your payment / جارٍ التحقق من عملية الدفع.

**Check:** test decline, cancel, timeout, duplicate callback, closing the browser after paying, and two tabs.

<a id="pat-confirmation"></a>

### 13.13 Confirmation and receipts

The page is defined in [11.5](#tpl-confirmation). In addition:

- **CONF-01.** The reference MUST also be available in the user's account or tracking page; the service MUST NOT rely on an email or SMS arriving.
- **CONF-02.** Confirmation URLs and receipts MUST NOT expose personal data without sign-in.
- **CONF-03.** If the confirmation message cannot be delivered, the transaction stands: the page says the message failed and how to get it.

**Example:** We have received your application / تم استلام طلبك.

<a id="pat-track"></a>

### 13.14 Track progress and respond

- **TRACK-01.** The tracking page shows the service, reference, represented context and current status from [9.6](#status-vocabulary), with the time it was last updated.
- **TRACK-02.** Past events and expected next steps are shown separately. Percentages and completion dates are shown only when they are real.
- **TRACK-03.** "Action needed" says what is needed, why, how to respond and the deadline in Dubai time. A response is confirmed as received without implying a decision.
- **TRACK-04.** "Not approved" names the reasons that can be shared and the review or appeal route, with its deadline if confirmed.
- **TRACK-05.** Earlier requests and responses stay visible in a history.
- **TRACK-06.** Access is checked against the current identity and representation ([REP-02](#pat-represent)).

| Recovery state | Response |
| --- | --- |
| Status source unavailable | Show the last known status with its time, labelled as such; offer to refresh and help |

**Components:** `sc-status-tag`, `sc-timeline` (the history, TRACK-05), `sc-attention-card` (an "Action needed" item on the user's signed-in pages), `sc-summary-list`.

**Example:** Action needed: upload a document / إجراء مطلوب: إرفاق مستند.

<a id="pat-notifications"></a>

### 13.15 Notifications

- **NOTE-01.** Essential service messages and optional messages MUST have separate settings. Optional messages are off until the user chooses them.
- **NOTE-02.** Every message names the service and gives one next action. It MUST NOT include case details, amounts owed by a named person or other sensitive information on a lock screen or in SMS.
- **NOTE-03.** Links in messages go to the channel's own domain and require sign-in before showing protected information. Messages never ask for credentials, codes or card details.
- **NOTE-04.** Messages are sent in the user's chosen language. Left-to-right values in Arabic messages are isolated with Unicode isolates ([LANG-15](#bidi)).
- **NOTE-05.** Arabic SMS SHOULD fit in as few segments as possible; the segment length for Arabic SMS is to be confirmed with operators ([OQ-12](#open-questions)).
- **NOTE-06.** Delivery status is recorded separately from application status.

**Components:** in the account area, `sc-notification-list` (each notification is one link to its page) and the unread count in `sc-account-menu`.

**Example (SMS):** "Dubai Transport: your vehicle registration has been renewed. Reference R-2026-55120. Details: {link}". The Arabic message carries the reference between U+2066 and U+2069.

<a id="pat-appointments"></a>

### 13.16 Book or change an appointment

- **APPT-01.** The user chooses the location or format first, then sees only compatible slots.
- **APPT-02.** Slots are listed with full dates and times in Dubai time. A calendar MUST NOT be the only way to choose a date: a list of available dates or a typed date works too.
- **APPT-03.** A slot is booked only when the server confirms it. A temporary hold with a time limit meets WCAG 2.2.1 ([TIME-01](#pat-timeout)).
- **APPT-04.** Rescheduling keeps the old slot until the new one is confirmed.

| Recovery state | Response |
| --- | --- |
| Slot taken | Keep the other choices, say the slot was taken, show current alternatives |

**Example:** All times are in Dubai time / جميع المواعيد بتوقيت دبي.

<a id="pat-help"></a>

### 13.17 Get help and assisted service

- **HELP-01.** Help MUST be in the same place on every page of a service (`sc-footer` "Help and contact", plus help next to difficult questions), and in the same relative order (WCAG 3.2.6).
- **HELP-02.** At least one help route MUST NOT need speech, and at least one MUST NOT need written English. Essential help MUST NOT exist only in a tooltip, a chatbot or a PDF.
- **HELP-03.** Help pages give only contact routes, hours and response times confirmed by the owner.
- **HELP-04.** Opening help MUST NOT lose the user's progress.
- **HELP-05.** Assisted staff see the same status and reference as the user, check authority before acting, record what they did, and never ask for UAE PASS credentials, codes or card details.

**Example:** Get help with this service / الحصول على المساعدة بشأن هذه الخدمة.

<a id="pat-failure"></a>

### 13.18 Recover from failures and poor connectivity

Failures are of five kinds, each with its own response: a validation error ([13.6](#pat-questions)), no permission, a missing page, a service problem or outage ([11.7](#tpl-errors)), and an uncertain transaction ([SUB-04](#pat-submit), [PAY-05](#pat-pay)).

- **FAIL-01.** A failure message says what failed in terms of the task, whether anything was saved or may have gone through, and the safest next step.
- **FAIL-02.** Entered values MUST survive a recoverable failure.
- **FAIL-03.** Automatic retries MUST be limited and visible, and are allowed for consequential requests only with server-side duplicate protection.
- **FAIL-04.** Offline working MUST NOT be promised unless it is built. Apps that queue actions offline MUST show what is queued and confirm each action when it is sent.
- **FAIL-05.** After a long interruption, the service checks the session and draft again and asks before applying any consequential action.

**Example:** We could not save your changes / تعذّر حفظ التغييرات.

<a id="pat-quick-exit"></a>

### 13.19 Leave a sensitive service quickly

**Use when** research shows that people using the service may be at risk if someone sees what they are doing.

- **EXIT-01.** A visible "Leave this page" (مغادرة هذه الصفحة) control appears on every page of the sensitive journey and goes immediately to a neutral page, without confirmation.
- **EXIT-02.** It works with keyboard, touch and assistive technology. A keyboard shortcut MAY be added but MUST NOT be the only way and MUST NOT interfere with typing.
- **EXIT-03.** The service explains, before sensitive content, what the control does and what it cannot do: it cannot erase browser history, device records or screenshots.
- **EXIT-04.** The service owner decides whether leaving signs out, saves or discards the draft, and says which.

**Components:** planned `sc-exit-page`.

<a id="pat-data-tables"></a>

### 13.20 Professional data tables and bulk actions

`sc-table` defines the table itself: caption, column types, sorting, selection, responsive behaviour and states. In addition:

- **DATA-01.** The workspace shows the active organisation, the filters in force and the scope of the data.
- **DATA-02.** Opening a record and returning MUST keep the table's position, sort and filters.
- **DATA-03.** Selection distinguishes "selected on this page" from "all matching records".
- **DATA-04.** Before a bulk action, the user sees how many records it affects, its consequences and which records cannot be processed. Afterwards, the result is reported per record, and only failed records are offered for retry.
- **DATA-05.** Exports respect filters, permissions and the represented context.

**Example:** 3 applications selected / تم تحديد 3 طلبات.

<a id="pat-cross-channel"></a>

### 13.21 Continue across channels and entities

- **XCH-01.** Before a handoff, the page says where the user is going, why, and whether it continues the same application or starts another, with any new fee or sign-in.
- **XCH-02.** The handoff carries a stable journey reference, the language and the represented context. Personal data, tokens and case content MUST NOT travel in URLs. The receiving service checks identity, authority and consent itself.
- **XCH-03.** Information already given in the journey MUST be reused across the handoff (WCAG 3.3.7); crossing an entity boundary is not an exception.
- **XCH-04.** The user can see which organisation owns each outstanding action, and a referral is shown as complete only when the receiving service confirms it.

| Recovery state | Response |
| --- | --- |
| Destination unavailable or return lost | Keep the draft and the referral reference; give a resume link and a way to check the other service |

**Example:** Continue to Dubai Justice to pay the court fee / المتابعة إلى عدالة دبي لدفع رسوم المحكمة.

### How we check

- For each pattern the service uses, the team shows test evidence for every recovery state listed, in both languages.
- The panel runs the payment and submission duplicate tests itself (SUB-03, PAY-06) and walks one recovery state per pattern.
- The panel checks that each pattern uses the named components or a recorded exception.

---

<a id="privacy"></a>

## 14. Privacy, security and consent

The legal basis for processing, retention periods and consent are confirmed by the entity's legal and privacy owners ([4](#legal)); this chapter sets what the service must show and do.

<a id="minimisation"></a>

### 14.1 Collect only what is needed

- **PRV-01.** Services MUST collect only the information the task needs, at the point it is needed.
- **PRV-02.** Each service MUST keep a question protocol: for every field, why it is needed, who uses it, whether it is reused, and how long it is kept. It is reviewed at each assessment.
- **PRV-03.** Services MUST NOT ask for information about disability, health, religion or other sensitive characteristics unless the task requires it and the reason is recorded.

<a id="privacy-notice"></a>

### 14.2 Privacy notice

- **PRV-04.** Each service MUST have a privacy notice in both languages, linked from `sc-footer` (`privacy-href`) and from the start page, saying in plain language what is collected, why, who receives it, how long it is kept and how users can ask about or correct their data.
- **PRV-05.** Short explanations at the point of collection ("We will use your phone number only to send you updates about this application" / "سنستخدم رقم هاتفك لإرسال التحديثات الخاصة بهذا الطلب فقط") SHOULD link to the notice.
- **PRV-06.** A privacy notice MUST NOT be presented as a consent box. Consent is asked for only where it is the actual basis for processing.

<a id="security"></a>

### 14.3 Security

- **PRV-07.** Authorisation MUST be checked on the server for every protected request; knowing a reference MUST NOT give access to someone else's record.
- **PRV-08.** Secrets MUST NOT be in client code or in the repository (the design system's own push protection and secret scanning show the expected practice). Sessions use secure, HTTP-only cookies.
- **PRV-09.** Personal data, tokens and codes MUST NOT appear in URLs, page titles, analytics events or logs.
- **PRV-10.** The service has a threat model, reviewed at each assessment. The applicable information security baseline is to be confirmed ([OQ-8](#open-questions)).
- **PRV-11.** On shared devices, signing out MUST clear protected information from the screen and from local storage, and the service says what it keeps on the device.

<a id="cookies"></a>

### 14.4 Cookies and analytics

- **PRV-12.** Non-essential cookies, analytics and similar storage MUST be off until the user accepts them. Nothing non-essential runs before a choice is made.
- **PRV-13.** The cookie banner appears at the top of the page on first visit, before the skip link's target content, and offers "Accept additional cookies" (قبول ملفات تعريف الارتباط الإضافية) and "Reject additional cookies" (رفض ملفات تعريف الارتباط الإضافية) as buttons of equal weight, plus a link to the cookies page. It MUST NOT cover content or trap focus.
- **PRV-14.** After a choice, the banner confirms it and can be hidden. The choice is stored and applied; it is a real switch, not a record.
- **PRV-15.** The cookies page lists every cookie by name, purpose and lifetime, separates essential from optional ones, and lets the user change their choice at any time.
- **PRV-16.** Choosing not to accept optional cookies MUST NOT block or degrade any service.

The legal basis for analytics and the retention period of the consent record are to be confirmed ([OQ-27](#open-questions)).

### How we check

- The panel reviews the question protocol and the privacy notice in both languages.
- The panel loads the service in a clean browser and checks, in the browser's network and storage tools, that nothing non-essential is set or sent before accepting, and that rejecting leaves it off.
- The panel changes a reference in a URL to another user's and expects a refusal (PRV-07).

---

<a id="performance"></a>

## 15. Performance and resilience

- **PERF-01.** Before release, the main journey is tested on a low-cost Android phone and in a repeatable throttled profile of 1.6 Mbps download, 750 Kbps upload and 150 ms round-trip time. The device, profile and cache state are recorded.
- **PERF-02.** After release, at the 75th percentile of real users measured by the channel's real-user monitoring, each page MUST meet: Largest Contentful Paint 2.5 s or less, Interaction to Next Paint 200 ms or less, and Cumulative Layout Shift 0.1 or less. Before release, the same thresholds are checked in the lab with the PERF-01 profile. These are release gates.
- **PERF-03.** Pages SHOULD load no more than 200 KB of compressed JavaScript per route and 1 MB in total on first load, not counting documents the user asks for. A larger budget is recorded with its reason.
- **PERF-04.** Public information, navigation and help MUST work without JavaScript. Where a transaction needs JavaScript, failure to load is detected and the user is told what to do.
- **PERF-05.** Loading feedback appears promptly; a wait longer than a few seconds says what is happening and what to do if it does not finish. Nothing spins forever.
- **PERF-06.** Each service sets availability and recovery objectives based on the harm an outage causes, monitors UAE PASS, Dubai Pay and entity systems separately, and has an incident process and a named on-call route.
- **PERF-07.** Native performance budgets (cold start, app size, offline behaviour) will be set when the native kits phase starts ([OQ-19](#open-questions)).

<a id="perf-budgets"></a>

**Design system budgets.** The `sc-` library has its own budgets, which sit inside PERF-02 and PERF-03 so that the library leaves most of a page's budget to the service. The reasoning and the measurements behind them are in `design-system/docs/v2/architecture.md`.

- **PERF-08** (new in v2). Each release of the `sc-` library SHOULD stay within these size budgets, measured gzip -9 per file as the browser downloads it (fonts by file size). `npm run check:budget` enforces them in CI from `components/perf-budgets.json`, which is authoritative where it and this table disagree. A component over budget records its reason in its specification, or is split.

| Budget | Limit |
| --- | --- |
| Runtime core | 14 KiB |
| Library stylesheet (`sc.css`: tokens, fonts, type roles, shared styles, light DOM component styles) | 9 KiB |
| Helper styles shared into shadow roots | 1.5 KiB |
| Component (its module and the files it imports, excluding the core) | 4 KiB |
| Form fields (`sc-text-input`, `sc-textarea`, `sc-select`, `sc-checkbox`, `sc-checkbox-group`, `sc-radio-group`, `sc-date-input`) | 7 KiB each |
| Recorded overrides | `sc-breadcrumbs` 4,224 B; `sc-button` 5 KiB; `sc-account-nav`, `sc-bottom-nav`, `sc-app-bar` and `sc-channel-network` 4.5 KiB; `sc-utility-bar` 5 KiB; `sc-announcement-bar` 5.5 KiB; `sc-error-summary` and `sc-footer` 6 KiB; `sc-modal` and `sc-account-menu` 7 KiB; `sc-site-header` 7.5 KiB; `sc-search` and `sc-channel-switcher` 8 KiB; `sc-table` 12 KiB; `sc-date-range` 21 KiB |
| Each font file | 32 KiB |

- **PERF-09** (new in v2). A page built with the `sc-` library SHOULD meet these limits for the library's share of it, on a Slow 4G profile (1.6 Mbps down, 750 Kbps up, 150 ms round trip) with the CPU slowed four times:

| Budget | Limit |
| --- | --- |
| Library JavaScript on a typical page (including loader and core) | 30 KiB gzip |
| Component CSS parsed on a typical page | 4 KiB gzip |
| Fonts downloaded | 75 KiB on an English page, 100 KiB on an Arabic page |
| Total transferred by the library | 115 KiB in English, 140 KiB in Arabic |
| All `sc-` content visible | 1.2 s or less |
| Cumulative Layout Shift from the library | 0 (0.005 or less measured) |
| Total blocking time | 0 ms |
| Longest task | Under 50 ms |
| Requests, with the lazy loader | 10 or fewer |

- **PERF-10** (new in v2). Fonts SHOULD load as one family (`Dubai W23`) with a real `font-weight` per face (400, 500 and 700) and `font-synthesis: none`, subset by script: a Latin and an Arabic file for each weight, declared with `unicode-range`, so a page downloads only the scripts and weights it shows (an Arabic page takes even its spaces, digits and punctuation from the Arabic files). The language switch's name of the other language ("العربية" on an English page, "English" on an Arabic page) is set in its own small face (`Dubai W23 Name`), so one word never pulls in the other script's whole file. Only the Regular file of the page's language is preloaded, before the stylesheet, and every face uses `font-display: swap` with a metric-matched fallback face, so the swap does not move text:

```html
<link rel="preload" as="font" type="font/woff2" crossorigin href="/sc/assets/fonts/dubai-w23-400-latin.woff2">
<link rel="stylesheet" href="/sc/sc.css">
```

  On an Arabic page the preloaded file is `dubai-w23-400-arabic.woff2`. No other weight is preloaded: on Slow 4G, several preloads compete with the stylesheet and scripts.
- **PERF-11** (new in v2). The library stylesheet SHOULD be the only render-blocking resource the library adds. Applications SHOULD import only the components they use from the custom elements build, so their bundler can merge them; plain HTML pages use the lazy loader and include the `sc-preload.html` that each build generates, which preloads the runtime core and the page-shell bundle. Before a component upgrades, its final size is reserved, so nothing is hidden and nothing shifts.

### How we check

- The team shows the lab results with the PERF-01 profile before release, and the real-user monitoring report after release.
- The panel loads the start page with JavaScript off and checks it is usable.
- The design system team publishes the `check:budget` result and the `measure:runtime` report (Slow 4G, CPU ×4) with each library release (PERF-08, PERF-09). `check:budget` loads the typical page in English and in Arabic in a real Chromium-based browser and counts the font files it actually downloads, so the font budgets measure real downloads, not the files on disk. The service team shows the library version it uses; the panel loads one channel page and one question page with the browser's network panel open, in English and Arabic, and checks the fonts transferred, the render-blocking resources and the layout shift (PERF-09 to PERF-11).
- The team shows its availability objectives, monitoring dashboard and incident runbook at the beta assessment.

---

<a id="research"></a>

## 16. User research

- **RES-01.** Research MUST include the people the service is for, recruited for the service's real audiences: citizens, residents, visitors, business representatives and professionals as relevant.
- **RES-02.** Every research round MUST include participants who use the service in Arabic and participants who use it in English, and participants with access needs. Across the alpha and beta phases, research MUST include people of determination using their own assistive technology (including screen readers in Arabic), older people, people with low digital confidence, and people on low-cost phones or slow connections. Where relevant: domestic workers, visitors without a UAE phone number, and people acting for others.
- **RES-03.** Participants consent in their own language to how their data and recordings are used, and are paid or otherwise compensated for their time.
- **RES-04.** Each critical journey is tested with at least one interruption (a failed payment, an expired session, a lost connection) and one assisted route.
- **RES-05.** Research findings, recruitment gaps and the design changes made are recorded and shown at assessment. Testing by the team's own staff does not count as research with users.
- **RES-06.** Research rounds happen in discovery, alpha, beta and after major changes. The number of participants follows the risk and the range of users, not a fixed number.

Recruitment routes for people of determination in the UAE are to be agreed with the issuing authority as part of the assessment process ([OQ-14](#open-questions)).

### How we check

- The team shows its research plan, participant profiles (without personal data) against RES-02 and the changes made as a result.
- The panel asks which findings came from Arabic-first participants and from people of determination, and what changed.

---

<a id="assurance"></a>

## 17. Assurance

<a id="roles"></a>

### 17.1 Roles

| Role | Accountable for |
| --- | --- |
| Issuing authority | Adopting the standard, appointing assessors, approving exceptions and settling disputes between entities |
| Design system team | Tokens, `sc-` components, patterns, this standard and its changelog |
| Service owner (owning entity) | The whole service outcome, the canonical record, the accuracy of fees, eligibility and timings, and funding fixes |
| Channel product owner | Findability, navigation and presentation on the channel, and correct use of canonical records |
| Bilingual content and taxonomy lead | Service names, taxonomy, the glossary and Arabic–English parity |
| Accessibility lead | The evaluation scope and method, the Appendix A register and the accessibility statement |
| Security, privacy and records owners | Controls, data flows, retention and incident handling |
| Operations and support owner | Assisted service, status reconciliation and incident communication |
| Supplier | Building to the standard, providing evidence, fixing defects and handing over maintainable code |

<a id="assessments"></a>

### 17.2 Service assessments

Services are assessed against the 12 points of the [service standard](#service-standard) at three points:

| Assessment | When | Main evidence |
| --- | --- | --- |
| Alpha | Before building the real service | Research findings, journey map with owners, prototypes in both languages, component reuse and gaps, threat model, the plan for UAE PASS and Dubai Pay |
| Beta | Before the service is open to the public | A working end-to-end service in both languages, the Appendix A register, performance results, the question protocol, legal review (LEG-02), recovery-state tests, support and incident processes |
| Live | Before the service is declared live and the beta label removed | Real-user measures ([17.5](#measures)), accessibility statement, fixes for earlier "not met" points, operating model |

A service also returns for reassessment after a major change: a new platform, a new identity or payment flow, a new channel listing or a change to who the service is for.

**The panel.** A lead assessor (chair) and specialists in user research, design, content design in English, content design in Arabic, accessibility, and technology. The Arabic content specialist and the accessibility specialist are required members of every panel.

**Outcomes.** The panel records each of the 12 points as **met** or **not met**, with reasons and recommendations. The assessment is **met** only when every point is met. A service with any point not met may not move to the next phase; it fixes the points and is reassessed on those points only, within three months. The team may ask the issuing authority to review an outcome it disagrees with.

**Reports** use the template in [Appendix D](#appendix-report) and are shared with the service team within two weeks of the assessment.

<a id="exceptions"></a>

### 17.3 Exceptions

- **ASR-01.** A service that cannot meet a requirement MUST record an exception: the requirement identifiers, the services, platforms, languages and users affected, the barrier, the options considered, the interim support provided, the remediation owner and date, and an expiry date. The issuing authority approves it.
- **ASR-02.** An exception lasts at most 90 days and is reviewed monthly. Renewal needs new evidence and a new decision.
- **ASR-03.** Severity is set by the effect on people: task blocked, task possible only with unreasonable effort, or inconvenience. It is not set by WCAG level.
- **ASR-04.** An exception does not change the truth of an accessibility statement: a known failure is still listed as a failure. It cannot waive a legal duty or a provider's security requirement.
- **ASR-05.** Where a critical service runs with an accepted barrier, the statement lists it and a staffed alternative is provided and measured.

### 17.4 Release decisions

- **ASR-06.** Each release names the standard version, the `sc-` library and token versions it uses, its open defects and the people who approved it.

<a id="measures"></a>

### 17.5 Measures

| Measure | Definition | Segment by |
| --- | --- | --- |
| Completion rate | Successful outcomes divided by eligible starts, including assisted completions | Channel, platform, language, assisted or not |
| Findability | Share of searches that reach the right service detail page; no-result and repeated searches | Language, entry route, device |
| Time and effort | Time to complete and drop-out points; form time kept separate from decision time | Language, platform, new or returning |
| Accessibility barriers | Open failures by effect, criterion, age and owner; support contacts about accessibility | Platform, language, assistive technology where known |
| Identity and payment recovery | Successful recovery from cancelled, interrupted or unknown handoffs; duplicate charges or submissions (target zero) | Provider outcome, platform, language |
| Performance | PERF-02 thresholds, availability, failed saves | Platform, route, connection |
| Support and satisfaction | Contact reasons, assisted outcomes, satisfaction with the completed service (including people refused) | Route, language, stage |
| Content health | Records past their review date, missing translations, unsupported library versions, expired exceptions | Entity, channel, service |

Measures are segmented only where that is lawful and proportionate. Services do not collect diagnoses or full search queries to measure accessibility.

### How we check

- The issuing authority keeps the assessment reports, the exception register and release decisions, and publishes a summary of outcomes per channel.

---

<a id="contributing"></a>

## 18. Contributing and versioning

<a id="contribution"></a>

### 18.1 Proposing a new component or pattern

1. **Raise the need.** Describe the user need, the services that have it and the evidence, and check the backlog ([10.4](#backlog)).
2. **Agree the approach** with the design system team, who check whether an existing component or pattern can meet the need.
3. **Design and research.** Design both languages, every state and the right-to-left behaviour; test with users.
4. **Build to the recipe** in `components/CONTRIBUTING.md`: the files, strings in both languages, tests (axe in English and Arabic, light and dark; keyboard; form behaviour) and a readme with usage guidance.
5. **Review.** The design system team, an Arabic content designer and an accessibility specialist review it.
6. **Publish** with a changelog entry. Patterns are added to this standard in a minor version.

<a id="versioning"></a>

### 18.2 Versioning and deprecation

- **ASR-07.** The standard, the tokens and the `sc-` library are versioned separately with semantic versioning: a major version breaks existing use, a minor version adds, a patch fixes.
- **ASR-08.** Each release has a published changelog. A breaking change includes migration guidance.
- **ASR-09.** A component, property or token being removed is marked deprecated for at least one minor release before removal, with the replacement named.
- **ASR-10.** Services MUST stay within the two most recent major versions of the library and tokens.

### How we check

- The design system team shows the changelog and deprecation notices for each release; the panel checks the versions named in the service's release record against ASR-10.

---

<a id="open-questions"></a>

## 19. Open questions

The standard does not rely on any of the following until it is confirmed. Each has an owner to confirm it; the answer is added to the standard in a later version. Answered questions are removed and their numbers are not reused; the change log (`ux-standard-changes.md`) records how each was answered.

| # | To confirm | Owner | Affects |
| --- | --- | --- | --- |
| OQ-1 | The current dated edition of WCAG 2.2. Version 1.0 cited an edition dated 12 December 2024; the date of the original Recommendation (believed to be 5 October 2023) and of any later edition are to be checked. | Accessibility lead | [Appendix E](#appendix-bibliography) |
| OQ-2 | The current URL and title of the W3C guidance on applying WCAG 2 to non-web ICT (WCAG2ICT). | Accessibility lead | [7.4](#native-parity), [Appendix E](#appendix-bibliography) |
| OQ-3 | The official UAE PASS button kit: its colours, fingerprint mark, labels in English and Arabic (with the official styling of "UAE PASS" and its Arabic name), sizes, variants and dark-mode treatment. It replaces the header placeholder ([CMP-11](#component-decisions)) and sets the width the header row must fit ([CHR-01](#tpl-chrome)). | Design system team with the UAE PASS provider | [10.3](#component-decisions), [11.9](#tpl-chrome), [13.4](#pat-sign-in) |
| OQ-4 | The official styling of "Dubai Pay" (or "DubaiPay") in English and Arabic, its integration guidelines, whether it requires its own button asset in place of the city indigo hand-off button ([CMP-10](#component-decisions)), and the payment and refund states it reports, so that [9.6](#status-vocabulary) matches them. | Design system team with the Dubai Pay provider | [9.4](#style-guide), [9.6](#status-vocabulary), [13.12](#pat-pay) |
| OQ-5 | Which data protection instruments apply to these channels and what they require (version 1.0's review listed the federal Personal Data Protection Law, Dubai Law No. 26 of 2015 (the Dubai Data Law), Digital Dubai policies, and DIFC and ADGM rules as candidates). | Legal counsel | [4](#legal), [14](#privacy) |
| OQ-6 | Which instruments on the rights of people of determination and on digital accessibility apply, and whether any mandates a WCAG level (candidates: Federal Law No. 29 of 2006 as amended, Dubai Law No. 2 of 2014, Digital Dubai or TDRA accessibility policy, the Dubai Universal Design Code). | Legal counsel | [4](#legal), [6](#accessibility) |
| OQ-7 | Whether federal design-system or digital-experience guidelines (TDRA, the UAE Design System) apply to Dubai channels, and how this standard must align with them. | Issuing authority | Whole standard |
| OQ-8 | Which information security baseline applies (for example the Dubai Electronic Security Center Information Security Regulation, or UAE Information Assurance standards). | Security owners | [14.3](#security) |
| OQ-9 | The use of "people of determination" (أصحاب الهمم) in official Dubai government content, and whether an official Arabic glossary exists for terms such as service, application, fee and entity. | Bilingual content and taxonomy lead | [4](#legal), [9.3](#arabic-style) |
| OQ-10 | The official status of the new dirham symbol, its Unicode support, and whether services must use it instead of "AED" / "درهم". | Design system team with the Central Bank of the UAE guidance | [9.4](#style-guide) |
| OQ-11 | Whether any service (Dubai Justice in particular) must show Hijri dates alongside Gregorian dates, and how. | Service owners, Dubai Justice | [9.4](#style-guide), `sc-date-input`, `sc-date-range` |
| OQ-12 | The operators' segment limits for Arabic SMS (commonly 70 characters per segment with UCS-2 encoding). | Operations owner | [13.15](#pat-notifications) |
| OQ-13 | Each channel's audiences and categories, and whether staff-facing tools (for example for court staff on Dubai Justice) are in scope. | Channel product owners | [0.2](#scope), [3.1](#seven-channels) |
| OQ-14 | The body that will adopt, own and enforce this standard, appoint assessors and approve exceptions; and the recruitment route for research with people of determination. | Initiative leadership | [0.1](#status), [16](#research), [17](#assurance) |
| OQ-15 | Whether the companion artefacts named in version 1.0 (`theme.schema.json`, `service-catalogue.schema.json`, the WCAG assessment CSV files, `specification.json`, `handbook.html`) exist anywhere. None is in the repository; this standard does not depend on them. | Design system team | [Appendix B](#appendix-catalogue) |
| OQ-16 | That the GOV.UK Service Manual page "Naming your service" is still current at publication. | Content lead | [Appendix E](#appendix-bibliography) |
| OQ-17 | Which channels use Flutter and which React Native; which framework versions the kits must support; and whether the kits should wrap shared UAE PASS and Dubai Pay native modules. | Channel product owners | [7](#platforms) |
| OQ-18 | The default inactivity timeout and warning time, and how the service session relates to the UAE PASS session. | Security owners with the UAE PASS provider | [13.10](#pat-timeout) |
| OQ-19 | Performance budgets for the native apps (cold start, app size, offline behaviour), to be set when the kits phase starts. | Design system team | [15](#performance) |
| OQ-21 | A chart palette in the tokens, checked for contrast and against the teal rule. | Design system team | [8.1](#colour) |
| OQ-27 | The legal basis for analytics and other optional cookies, and how long a consent choice is kept. | Legal counsel and privacy owners | [14.4](#cookies) |
| OQ-28 | That `sc-date-range` opens its picker instantly when opened from the keyboard, as [MOT-02](#motion) requires. | Design system team | [8.7](#motion) |
| OQ-30 | The usage manual or approval for the Government of Dubai lockup that Law No. (1) of 2025 requires before the lockup is published: its clear space, minimum size, dark-background version and link target, which replace the interim rules in [CHR-02](#tpl-chrome). | Design system team with The Executive Council | [11.9](#tpl-chrome) |

---

<a id="appendix-wcag"></a>

## Appendix A. WCAG 2.2 register

The 55 Level A and AA success criteria of WCAG 2.2. Criterion 4.1.1 Parsing is obsolete in WCAG 2.2 and is not listed. Level AAA criteria (for example 2.4.8 Location, which breadcrumbs support) are outside the baseline.

For each criterion, the service records Pass, Fail, Not applicable (with the reason) or Not tested, with dated evidence and the browser, assistive technology and version used. A percentage score does not establish conformance. Criterion names are W3C's own, in US spelling. The checks are prompts for the tester; the normative criteria and their exceptions are in WCAG 2.2 itself, linked from each name.

| Criterion | Level | How to check |
| --- | --- | --- |
| 1.1.1 [Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html) | A | Review each image, icon, chart, canvas, and image control in context; inspect names and long descriptions. |
| 1.2.1 [Audio-only and Video-only (Prerecorded)](https://www.w3.org/WAI/WCAG22/Understanding/audio-only-and-video-only-prerecorded.html) | A | Compare the alternative with all relevant sounds, visuals, sequence, and interaction. |
| 1.2.2 [Captions (Prerecorded)](https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded.html) | A | Check accuracy, synchronisation, completeness, and caption availability. |
| 1.2.3 [Audio Description or Media Alternative (Prerecorded)](https://www.w3.org/WAI/WCAG22/Understanding/audio-description-or-media-alternative-prerecorded.html) | A | Check that important visual information is available through description or the full alternative. |
| 1.2.4 [Captions (Live)](https://www.w3.org/WAI/WCAG22/Understanding/captions-live.html) | AA | Test caption delivery during a live event, including speaker changes and meaningful sounds. |
| 1.2.5 [Audio Description (Prerecorded)](https://www.w3.org/WAI/WCAG22/Understanding/audio-description-prerecorded.html) | AA | Listen without watching; identify visual information missing from the audio. |
| 1.3.1 [Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) | A | Inspect the accessibility tree and navigate headings, fields, and table relationships. |
| 1.3.2 [Meaningful Sequence](https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html) | A | Read in document order and compare with the intended meaning at each layout. |
| 1.3.3 [Sensory Characteristics](https://www.w3.org/WAI/WCAG22/Understanding/sensory-characteristics.html) | A | Replace “select the green circle on the right” with a reference to the control's label. |
| 1.3.4 [Orientation](https://www.w3.org/WAI/WCAG22/Understanding/orientation.html) | AA | Rotate a real device and confirm information and controls remain usable. |
| 1.3.5 [Identify Input Purpose](https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html) | AA | Inspect names, addresses, contact details, birth dates, and credentials for correct purpose metadata. |
| 1.4.1 [Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) | A | Review errors, chart series, required fields, selected states, and links without relying on hue. |
| 1.4.2 [Audio Control](https://www.w3.org/WAI/WCAG22/Understanding/audio-control.html) | A | Load the page and locate the audio control without losing access to screen-reader speech. |
| 1.4.3 [Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) | AA | Measure actual foreground/background pairs, including states, gradients, and image backgrounds. |
| 1.4.4 [Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html) | AA | Increase text or browser zoom to 200%; check clipping, overlap, and control usability. |
| 1.4.5 [Images of Text](https://www.w3.org/WAI/WCAG22/Understanding/images-of-text.html) | AA | Check headings, banners, promotional cards, and text embedded in exported graphics. |
| 1.4.10 [Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) | AA | Test narrow layouts and zoom. Keep any justified horizontal scrolling local to the relevant region. |
| 1.4.11 [Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) | AA | Check input boundaries or other identifying cues, checkmarks, focus indicators, and meaningful graph lines. |
| 1.4.12 [Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html) | AA | Apply all four values together and inspect content, dialogs, controls, and navigation. |
| 1.4.13 [Content on Hover or Focus](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html) | AA | Open tooltips and submenus with pointer and keyboard; move onto them and test dismissal. |
| 2.1.1 [Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html) | A | Complete each task without a mouse, including editing, uploads, and custom controls. |
| 2.1.2 [No Keyboard Trap](https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html) | A | Enter and exit widgets, embedded content, editors, and dialogs in both directions. |
| 2.1.4 [Character Key Shortcuts](https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html) | A | Try single-letter shortcuts while using speech input and when focus is elsewhere. |
| 2.2.1 [Timing Adjustable](https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html) | A | Test the actual timeout and chosen compliance route. “Security” is not an automatic exception. |
| 2.2.2 [Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) | A | Check carousels, tickers, animated backgrounds, scores, and refreshing dashboards. |
| 2.3.1 [Three Flashes or Below Threshold](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html) | A | Avoid flashing or use appropriate analysis against the defined thresholds. |
| 2.4.1 [Bypass Blocks](https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html) | A | Bypass repeated headers/navigation using the intended mechanism and confirm the destination works. |
| 2.4.2 [Page Titled](https://www.w3.org/WAI/WCAG22/Understanding/page-titled.html) | A | Review browser-tab titles across routes, states, and languages. |
| 2.4.3 [Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html) | A | Tab and reverse-tab through the page, overlays, and dynamically added controls. |
| 2.4.4 [Link Purpose (In Context)](https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html) | A | Inspect repeated “Read more” links with their actual accessible context. |
| 2.4.5 [Multiple Ways](https://www.w3.org/WAI/WCAG22/Understanding/multiple-ways.html) | AA | Find representative non-process pages by two available methods. |
| 2.4.6 [Headings and Labels](https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html) | AA | Read headings and labels in isolation and confirm their meaning. |
| 2.4.7 [Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html) | AA | Follow focus through every control, including controls inside scroll containers. |
| 2.4.11 [Focus Not Obscured (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html) | AA | Test sticky headers, cookie banners, chat panels, and fixed footers while tabbing and zooming. |
| 2.5.1 [Pointer Gestures](https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html) | A | Replace pinch, multipoint actions, and required swiping paths with simple pointer actions. |
| 2.5.2 [Pointer Cancellation](https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation.html) | A | Press, move away, and release; check whether accidental actions can be prevented or reversed. |
| 2.5.3 [Label in Name](https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html) | A | Compare visible labels with computed accessible names and try speech commands. |
| 2.5.4 [Motion Actuation](https://www.w3.org/WAI/WCAG22/Understanding/motion-actuation.html) | A | Test shake, tilt, or camera-detected motion and their button-based alternatives. |
| 2.5.7 [Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html) | AA | Reorder, move, resize, or set a value through clicks/taps alone. |
| 2.5.8 [Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) | AA | Measure hit areas and apply the circle test where relying on spacing. |
| 3.1.1 [Language of Page](https://www.w3.org/WAI/WCAG22/Understanding/language-of-page.html) | A | Inspect the language declaration and listen to pronunciation with a suitable screen-reader voice. |
| 3.1.2 [Language of Parts](https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts.html) | AA | Review multilingual paragraphs, quotes, and language-switch labels. |
| 3.2.1 [On Focus](https://www.w3.org/WAI/WCAG22/Understanding/on-focus.html) | A | Tab through the interface without activating controls. |
| 3.2.2 [On Input](https://www.w3.org/WAI/WCAG22/Understanding/on-input.html) | A | Change selections, checkboxes, and field values; inspect unexpected navigation or focus movement. |
| 3.2.3 [Consistent Navigation](https://www.w3.org/WAI/WCAG22/Understanding/consistent-navigation.html) | AA | Compare repeated navigation across representative pages and states. |
| 3.2.4 [Consistent Identification](https://www.w3.org/WAI/WCAG22/Understanding/consistent-identification.html) | AA | Compare repeated search, download, contact, and action controls. |
| 3.2.6 [Consistent Help](https://www.w3.org/WAI/WCAG22/Understanding/consistent-help.html) | A | Compare the same responsive variation across pages, including document order. |
| 3.3.1 [Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html) | A | Submit empty, malformed, and contradictory values and review the resulting feedback. |
| 3.3.2 [Labels or Instructions](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html) | A | Check whether users can understand what to enter before making an error. |
| 3.3.3 [Error Suggestion](https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html) | AA | Check that messages explain how to recover, rather than merely saying “invalid”. |
| 3.3.4 [Error Prevention (Legal, Financial, Data)](https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html) | AA | Test the chosen protection on payments, deletions, commitments, and relevant submissions. |
| 3.3.7 [Redundant Entry](https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html) | A | Follow a complete process and identify repeated names, codes, addresses, and answers. |
| 3.3.8 [Accessible Authentication (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html) | AA | Test sign-in, MFA, and recovery paths with password managers, copying/pasting, and available alternatives. |
| 4.1.2 [Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html) | A | Inspect computed names, roles, values, expanded/selected/checked states, and state changes. |
| 4.1.3 [Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) | AA | Trigger updates while focus stays on the initiating control and check their announcement. |

---

<a id="appendix-catalogue"></a>

## Appendix B. Catalogue record

Every service has one record ([SVC-10](#service-record)). Fields marked "Required" must be present before a service is listed. Facts are published only once the service owner has confirmed them; an unconfirmed value is stored as "not confirmed" and shown as such.

| Field | Content | Required |
| --- | --- | --- |
| `service_id` | Stable identifier, never reused (for example `SC-SVC-TRN-0042`) | Yes |
| `revision`, `status` | Record revision; `draft`, `live`, `closed temporarily`, `retired` | Yes |
| `title.en`, `title.ar` | Task-led names ([3.3](#naming)) | Yes |
| `summary.en`, `summary.ar` | One sentence on what the service lets the user do | Yes |
| `synonyms.en`, `synonyms.ar` | Former names, formal names, codes, misspellings, transliterations | Yes |
| `owning_entity` | The accountable entity, with its official names in both languages | Yes |
| `service_owner`, `content_owner` | Named roles accountable for the outcome and for the content | Yes |
| `primary_channel`, `listed_channels[]` | Channel identifiers from [3.1](#seven-channels) | Yes |
| `categories[]`, `audiences[]`, `events[]` | Classification, separate from the name | Yes |
| `canonical_url.web`, `canonical_url.app` | One start URL per platform | Yes |
| `eligibility.en`, `eligibility.ar` | Who can and cannot use it | Yes |
| `prerequisites[]` | Documents and information needed, with acceptable alternatives | Yes |
| `fees` | Amount in AED, or "free", or how it varies, or "not confirmed"; when it is paid; refund conditions | Yes |
| `form_duration`, `processing_duration` | Time to fill in the form, and time to decide, kept separate; or "not confirmed" | Yes |
| `authentication` | None, or UAE PASS, and at which step | Yes |
| `representation` | Whether users can act for others, and how authority is proved | Yes |
| `resume_url` | Where saved work is resumed | If drafts are saved |
| `support` | Help routes, hours and languages, as confirmed | Yes |
| `reviewed_at` | Date the content was last reviewed | Yes |
| `replaced_by` | The replacement `service_id`, for retired services | If retired |

---

<a id="appendix-statement"></a>

## Appendix C. Accessibility statement template

Each service publishes this statement in both languages ([A11Y-12](#statement)). Headings are fixed; the content in braces is the service's own.

| English heading | Arabic heading | Content |
| --- | --- | --- |
| Accessibility statement for {service name} | بيان إمكانية الوصول لخدمة {اسم الخدمة} | Which pages, apps and documents the statement covers |
| Using this service | استخدام هذه الخدمة | What people should be able to do: zoom to 400%, use the keyboard only, use a screen reader in Arabic or English, change colours and text spacing, use the service in light or dark mode |
| How accessible this service is | مدى إمكانية الوصول إلى هذه الخدمة | A plain-language list of the parts that are not fully accessible |
| What to do if you cannot use part of this service | ما يمكن فعله عند تعذّر استخدام جزء من الخدمة | Alternative routes and how to request information in another format, with the response time confirmed by the owner |
| Reporting accessibility problems | الإبلاغ عن مشكلات إمكانية الوصول | How to contact the service team, and what happens next |
| Compliance status | حالة المطابقة | "This service fully meets / partially meets / does not meet WCAG 2.2 Level AA", consistent with the register |
| Content that is not accessible | المحتوى غير المتاح للجميع | Each failure: what it affects, the WCAG criterion, and the date it will be fixed |
| How we tested this service | كيفية اختبار هذه الخدمة | Who tested it, when, what was tested and with which assistive technologies ([6.4](#support-matrix)) |
| What we are doing to improve accessibility | ما نقوم به لتحسين إمكانية الوصول | The remediation plan with dates |
| Preparation of this statement | إعداد هذا البيان | The date the statement was prepared and last reviewed |

---

<a id="appendix-report"></a>

## Appendix D. Assessment report template

| Section | Content |
| --- | --- |
| Service | Name (both languages), `service_id`, owning entity, channels, phase assessed, assessment date |
| Panel | Names and roles, including the Arabic content and accessibility specialists |
| Standard version | The version of this standard assessed against |
| Outcome | Met or not met overall |
| Point by point | For each of the 12 points: met or not met, what the team did well, what must change (each linked to requirement identifiers), and recommendations |
| Exceptions | Exceptions in force or requested, with expiry dates |
| Next steps | Points to reassess and the date by which to do so |

---

<a id="appendix-bibliography"></a>

## Appendix E. Bibliography

**Standards and guidance**

- W3C. *Web Content Accessibility Guidelines (WCAG) 2.2*. W3C Recommendation. https://www.w3.org/TR/WCAG22/ (edition date: [OQ-1](#open-questions))
- W3C. *Understanding WCAG 2.2*. https://www.w3.org/WAI/WCAG22/Understanding/
- W3C. *Guidance on Applying WCAG 2 to Non-Web Information and Communications Technologies (WCAG2ICT)*. Current location: [OQ-2](#open-questions)
- W3C. *ARIA Authoring Practices Guide*. https://www.w3.org/WAI/ARIA/apg/
- W3C Design Tokens Community Group. *Design Tokens Format*. https://www.designtokens.org/
- Unicode Consortium. *Unicode Bidirectional Algorithm (UAX #9)*. https://www.unicode.org/reports/tr9/
- IETF. *RFC 2119: Key words for use in RFCs to indicate requirement levels*. https://www.rfc-editor.org/rfc/rfc2119
- Google. *Web Vitals*. https://web.dev/articles/vitals

**Benchmarks**

- GOV.UK. *Service Manual*. https://www.gov.uk/service-manual
- GOV.UK. *Service Standard*. https://www.gov.uk/service-manual/service-standard
- GOV.UK. *Naming your service*. https://www.gov.uk/service-manual/design/naming-your-service ([OQ-16](#open-questions))
- GOV.UK. *Design System*. https://design-system.service.gov.uk/

**Motion**

- Kowalski, E. *Skills* (`emil-design-eng`, `animate`, `review-animations`, `animation-performance`, `apple-design`, `mobile-native`). https://github.com/emilkowalski/skills

**Shared Channels design system** (paths relative to `design-system/`)

- `README.md`: tokens, build and checks
- `MOBILE.md`: building for mobile
- `components/CONVENTIONS.md`: component conventions
- `components/COMPONENTS.md`: the component index
- `components/CONTRIBUTING.md`: adding a component
- `components/specs/<tag>.md`: each component's specification
- `components/src/components/<tag>/readme.md`: each component's API and usage
- `components/perf-budgets.json`: the library's size budgets
- `docs/v2/decisions.md`, `docs/v2/foundations.md`, `docs/v2/architecture.md`, `docs/v2/migration.md`: design system v2
- `tokens/*.json`: design tokens
- `docs/ux-standard-review.md`: review of version 1.0
- `docs/ux-standard-changes.md`: how version 2.0 resolves that review
- StencilJS. https://stenciljs.com/
