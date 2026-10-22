# Shared Channels Service Standard

| | |
| --- | --- |
| Status | **Consultation draft.** Not yet binding. It becomes binding when the issuing authority adopts it ([OQ-14](#open-questions)) |
| Date | 22 October 2026 |
| Owner | Shared Channels design system team, for the issuing authority |
| Companion documents | [Design System reference](design-system-reference.md) (values and components, not assessed) and [Assurance handbook](assurance-handbook.md) (how services are checked) |

## <a id="on-a-page"></a>The standard on a page

**What Shared Channels is.** Shared Channels are the seven Government of Dubai websites and apps where people find and use government services: Dubai Now, Dubai Transport, Visit Dubai, Dubai Justice, Build in Dubai, Invest in Dubai and Dubai Trade. Entities own the services; the channels make them findable and host the journey.

**What this standard does.** It sets what every service on those channels must do, whichever entity owns it, on the web and in the channel apps, in Arabic and English. It is the basis on which services are assessed.

**What is mandatory.** Every service must meet the [12 points](#points). Each point is backed by numbered requirements marked MUST, SHOULD or MAY ([how to read them](#keywords)). A service cannot open to the public until it passes its beta assessment, and the [must-pass list](#appendix-must-pass) says which requirements a service cannot open without.

**When it applies.** New services meet it in full from adoption. Live services meet a short minimum set first and the full standard at their next major change ([conformance and transition](#transition)).

**What changes for you.**

- **Entities** keep owning their services, their facts and their outcomes, but no longer brand them: the channel sets the look, and the entity appears as text.
- **Service owners** launch every service in Arabic and English on the same day, with one record of facts that every channel shows.
- **Delivery teams and suppliers** build with the shared design system, sign people in with UAE PASS and take payment with Dubai Pay, and never show success before the server confirms it.
- **Everyone** gets one honest accessibility statement per service, and one way to check work: the "How we check" sections and the [Assurance handbook](assurance-handbook.md).

**How to comment on this draft.** This is a draft for consultation with channel owners, entities and suppliers. Send comments to the Shared Channels design system team through the route given in the consultation notice, by the closing date it sets ([OQ-38](#open-questions)). Quote the requirement identifier (for example **LANG-06**) or section you are commenting on, say what should change and why, and give evidence where you have it. The [questions for consultation](#open-questions) list what is still to be confirmed.

<a id="on-a-page-ar"></a>

<div lang="ar" dir="rtl">

### المعيار في صفحة واحدة

**ما القنوات المشتركة؟** القنوات المشتركة هي سبعة مواقع وتطبيقات تابعة لحكومة دبي، يجد فيها الناس الخدمات الحكومية ويستخدمونها: دبي الآن، ومواصلات دبي، وزوروا دبي، ودبي للعدالة، ودبي للبناء، واستثمر في دبي، ودبي التجارية. تملك الجهات الحكومية الخدمات، وتتيح القنوات الوصول إليها وتستضيف رحلة المتعامل.

**ما الذي يحدده هذا المعيار؟** يحدد ما يجب أن تحققه كل خدمة على هذه القنوات، أيًّا كانت الجهة المالكة لها، على المواقع الإلكترونية وتطبيقات القنوات، باللغتين العربية والإنجليزية. وعلى أساسه تُقيَّم الخدمات.

**ما الإلزامي؟** يجب أن تستوفي كل خدمة النقاط الاثنتي عشرة للمعيار. ولا تُفتح أي خدمة للجمهور قبل اجتياز تقييم المرحلة التجريبية.

**متى يُطبَّق؟** تلتزم الخدمات الجديدة بالمعيار كاملًا من تاريخ اعتماده. وتستوفي الخدمات القائمة أولًا حدًّا أدنى من المتطلبات، ثم المعيار كاملًا عند أول تغيير رئيسي فيها.

**ما الذي يتغير؟** تظل الجهات مالكة لخدماتها وبياناتها، لكن القناة هي التي تحدد الهوية البصرية، ويظهر اسم الجهة نصًّا. تُطلق كل خدمة باللغتين في اليوم نفسه. يتم تسجيل الدخول عبر UAE PASS والدفع عبر Dubai Pay، ولا تظهر رسالة نجاح قبل أن يؤكدها الخادم.

**الوضع الحالي.** هذه مسودة للتشاور، وليست ملزمة بعد. تُنشر النسخة العربية الكاملة مع النسخة الإنجليزية في يوم الاعتماد.

</div>

### <a id="reading-paths"></a>If you are…

| If you are… | Read first | Then |
| --- | --- | --- |
| An executive or director-general | This page, [principles](#principles), [the 12 points](#points), [conformance and transition](#transition) | [Assurance](#assurance), [legal context](#legal) |
| A service owner | [The 12 points](#points), [channels and services](#svc), [assurance](#assurance) | [Must-pass list](#appendix-must-pass), [Assurance handbook](assurance-handbook.md) |
| A product owner or channel product owner | [Channels and services](#svc), [page templates](#templates), [journey patterns](#patterns) | [Assurance handbook](assurance-handbook.md) |
| A content designer | [Arabic and English](#lang), [content design](#content), [asking for information](#ask) | [Journey patterns](#patterns) |
| A designer | [Arabic and English](#lang), [accessibility](#a11y), [page templates](#templates), [using the design system](#cmp) | [Design System reference](design-system-reference.md) |
| A developer | [Arabic and English](#lang), [accessibility](#a11y), [performance](#perf), [platforms](#plat), [using the design system](#cmp) | [Design System reference](design-system-reference.md) |
| A supplier | [The 12 points](#points), [must-pass list](#appendix-must-pass) | [Assurance handbook: contracts](assurance-handbook.md#contracts) |
| An assessor | [How to read the requirements](#keywords), [WCAG register](#appendix-wcag), [requirement index](#appendix-index) | [Assurance handbook](assurance-handbook.md) |

---

## <a id="contents"></a>Contents

- **Part 1. The standard:** [1. About this standard](#about) · [2. Principles](#principles) · [3. The 12 points](#points) · [4. Conformance and transition](#transition) · [5. Channels, services and the service record](#svc) · [6. Arabic and English](#lang) · [7. Accessibility](#a11y) · [8. Privacy, security and consent](#privacy) · [9. Performance and resilience](#perf) · [10. User research](#research) · [11. Assurance](#assurance) · [12. Legal and policy context](#legal)
- **Part 2. Designing the service:** [13. Content design](#content) · [14. Asking for information](#ask) · [15. Page templates](#templates) · [16. Journey patterns](#patterns) · [17. Platforms](#plat)
- **Part 3. Using the design system:** [18. What services must use](#cmp) · [19. Contributing and versioning](#contributing)
- **Appendices:** [A. WCAG 2.2 register](#appendix-wcag) · [B. Catalogue record](#appendix-catalogue) · [C. Must-pass list](#appendix-must-pass) · [D. Requirement index](#appendix-index) · [E. Where the earlier draft's content went](#appendix-map) · [F. Glossary](#appendix-glossary) · [G. Questions for consultation](#open-questions) · [H. Bibliography and acknowledgements](#appendix-bibliography)

---

## <a id="about"></a>1. About this standard

### <a id="status"></a>1.1 Status

This is a consultation draft. It is not yet binding. It becomes binding on the date the issuing authority adopts it; the issuing authority is still to be confirmed ([OQ-14](#open-questions)). Until then, delivery teams can use it as the target they expect to be assessed against.

The authoritative edition will be the one the issuing authority publishes on a government domain, in Arabic and English. Printed and PDF copies are for reference.

### <a id="scope"></a>1.2 Scope

The standard applies to:

- every public-facing and professional-facing service listed on a Shared Channel
- websites, mobile web, hybrid apps and WebView screens, and the native channel apps
- everything a user meets during the service: identity and payment handoffs, uploaded and issued documents, confirmation messages, emails, SMS and push notifications, embedded third-party widgets, and assisted routes

How it applies depends on who owns the service. Proposed for consultation ([OQ-36](#open-questions)):

| Owner | How the standard applies |
| --- | --- |
| Dubai government entities | In full |
| Semi-government bodies and operators under concession | As a condition of listing on a channel, through the channel listing agreement |
| Federal bodies and other third parties | Listed by reference: the channel's listing and handoff meet the standard, and the service is described honestly |

Staff-only tools (for example, case management screens used by court staff) are in scope when a channel delivers them through Shared Channels. Whether staff tools are in scope for each channel is to be confirmed with channel owners ([OQ-13](#open-questions)).

### <a id="keywords"></a>1.3 How to read the requirements

Requirement keywords are used in their [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119) sense:

| Keyword | Meaning |
| --- | --- |
| MUST, MUST NOT | An absolute requirement. A service that does not meet it fails assessment against the point it belongs to, unless an [exception](#assurance) is in force |
| SHOULD, SHOULD NOT | The expected approach. A team may depart from it only with a recorded reason, which the assessment reviews |
| MAY | Optional |

Every numbered requirement (for example **LANG-04**) carries one of these keywords, so that teams, suppliers and assessors can cite it in tickets, contracts and reports. Text without an identifier is explanation or guidance. Each rule appears once; other sections link to it. Identifiers are stable: a rule keeps its identifier when it moves, and a retired identifier is not reused ([Appendix E](#appendix-map)).

Every chapter ends with **How we check**: the evidence a service shows. The full test scripts are in the [Assurance handbook](assurance-handbook.md#checks).

### <a id="relationship"></a>1.4 Where the detail lives

| Document | What it holds | Assessed? |
| --- | --- | --- |
| This Service Standard | The outcomes services must achieve, and the rules assessed | Yes |
| [Design System reference](design-system-reference.md) | Tokens, colour roles, type scale, sizes, motion, icons, the component index and budgets. Versioned with the library | No: services are assessed on outcomes, and the design system team publishes evidence that the library meets them |
| [Assurance handbook](assurance-handbook.md) | Roles, risk tiers, panels, evidence, test scripts, exceptions, contracts and templates | It describes how assessment works |

When this standard names a component, it uses its tag (for example `sc-button`). A component marked **planned** does not exist yet.

The standard adapts the approach of the GOV.UK Service Manual and GOV.UK Design System to Dubai. It does not adopt UK law, UK branding or UK platforms.

---

## <a id="principles"></a>2. Principles

These principles explain the rules that follow. When a rule does not cover a situation, use the principle.

1. **Start with the task, not the entity.** People come to do something: renew a vehicle registration, pay a fine, apply for a building permit. Name and structure services around that task, not around the government structure behind it.
2. **Treat Arabic and English as equals.** Neither language is a translation of the other. Both get the same content, the same quality and the same care in typography and wording.
3. **Run one service with many front doors.** A service can appear on several channels. It is still one service, with one record, one set of facts and one transaction.
4. **Never leave someone unsure whether it worked.** After a submission or a payment, people must know exactly what happened, what did not happen and what to do next.
5. **Design for everyone.** Include people of determination, older people, people with low digital confidence, visitors and people on low-cost phones from the start, not as an afterthought.
6. **Ask once, reuse safely.** Do not ask for information the government already holds and may lawfully reuse, or that the user has already given in the same journey, unless there is a recorded reason.
7. **Be honest about what is known.** Show fees, timings and statuses only when they are confirmed. Say "varies" or "we are checking" when that is the truth.
8. **Share by default.** Use the shared components, patterns and tokens. When they do not meet a need, improve them for everyone rather than building a local copy.

**How we check.** Principles are not assessed on their own. The panel uses them to judge situations that no requirement covers, and records in the report which principle it applied.

---

## <a id="points"></a>3. The 12 points

A service is assessed against these 12 points ([assurance](#assurance)). Each point lists the chapters that hold its requirements. The panel records each point as met, met with conditions or not met.

| # | Point | The team shows that it… | Detailed in |
| --- | --- | --- | --- |
| 1 | Understand users and their needs | Has researched the people who use the service, in Arabic and English, including people of determination and people who need help | [10](#research) |
| 2 | Solve a whole problem | Has mapped the whole journey, across channels and entities, from finding the service to receiving the outcome, and named an owner for each handoff | [5](#svc), [16.21](#pat-cross-channel) |
| 3 | Make the service simple to use | Uses task-led names, one thing per page where it helps, the shared templates and plain language | [13](#content), [15](#templates), [16](#patterns) |
| 4 | Treat Arabic and English as equals | Ships both languages together with equal content, typography and behaviour | [6](#lang), [13.3](#cnt-arabic) |
| 5 | Make sure everyone can use the service | Meets WCAG 2.2 AA across the whole journey and offers assisted routes | [7](#a11y), [16.17](#pat-help) |
| 6 | Use the shared design system | Uses the shared design system and the channel's look, and contributes improvements back | [18](#cmp), [19](#contributing) |
| 7 | Be findable from every relevant channel | Has one canonical service record that every channel listing resolves to | [5.4](#service-record) |
| 8 | Handle identity and payment safely | Uses UAE PASS and Dubai Pay through the providers' official integrations, never shows success before the server confirms it, and prevents duplicate transactions | [16.4](#pat-sign-in), [16.12](#pat-pay) |
| 9 | Protect privacy and security | Collects only what it needs, explains why, and secures what it holds | [8](#privacy) |
| 10 | Work on every device and connection | Meets the performance thresholds and works on the supported browsers, assistive technologies and app platforms | [7.5](#a11y-support), [9](#perf), [17](#plat) |
| 11 | Have accountable owners and a capable team | Has a named service owner and access to user research, design, Arabic and English content design, accessibility and engineering skills | [11](#assurance) |
| 12 | Measure, operate and improve | Measures the outcomes in [11.5](#measures), runs support and incident processes, and improves the service from what it learns | [9](#perf), [11.5](#measures) |

---

## <a id="transition"></a>4. Conformance and transition

Most services on the seven channels are already live, on many platforms. This chapter sets how each is brought into the standard. The deadlines are proposed for consultation ([OQ-37](#open-questions)).

- **TRN-01. New services.** A service that starts alpha after adoption MUST meet the full standard.
- **TRN-02. Live services at their next major change.** A live service MUST meet the full standard at its next major change ([11.2](#assurance)) or re-platforming, and no later than the date in its channel's roadmap ([TRN-05](#transition)).
- **TRN-03. Minimum public duty.** Within 12 months of adoption, every live service MUST meet this set: the same facts in both languages ([LANG-01](#lang-parity)); a privacy notice ([PRV-04](#prv-notice)), an accessibility statement ([A11Y-12, A11Y-13](#a11y-statement)) and terms of use ([LEG-01](#legal)); no non-essential cookies before consent and an equal reject option ([PRV-12, PRV-13, PRV-16](#prv-cookies)); no success shown before the server confirms it ([TPL-14](#tpl-confirmation), [SAVE-02](#pat-save), [PAY-04](#pat-pay)); protection against duplicate submissions and charges ([SUB-03](#pat-submit), [PAY-06](#pat-pay)); "Paid" never shown as "Approved" ([CNT-19](#status-vocabulary)); a help route that needs neither speech nor written English ([HELP-02](#pat-help)); and all times in Dubai time ([style guide](#cnt-style)).
- **TRN-04. Conformance level.** Each service MUST state its conformance level in its catalogue record and accessibility statement, as one of:

| Level | Meaning |
| --- | --- |
| Conforms | Meets the full standard at its last assessment |
| Conforms with exceptions | Meets the full standard except for recorded exceptions that are in force |
| In transition | A live service that meets the minimum public duty (TRN-03) and has a dated roadmap entry |
| Does not conform | None of the above |

- **TRN-05. Channel roadmaps.** Each channel product owner MUST publish, within 6 months of adoption, a roadmap that lists every live service on the channel with its conformance level and the date by which it will meet the full standard.

**How we check.** The channel's inventory and roadmap, and a self-assessment of each live service against TRN-03, sampled centrally ([Assurance handbook 9](assurance-handbook.md#transition)).

---

## <a id="svc"></a>5. Channels, services and the service record

### <a id="svc-channels"></a>5.1 The seven channels

An entity owns a service and is accountable for its outcome. A channel makes services findable and hosts the journey. The channel names are fixed. The audiences and categories below are the working taxonomy, to be confirmed with each channel owner ([OQ-13](#open-questions)).

| Channel | Arabic name | Main audiences | Example services |
| --- | --- | --- | --- |
| Dubai Now | دبي الآن | Residents and citizens | Pay water and electricity bills; get a good conduct certificate |
| Dubai Transport | مواصلات دبي | Drivers, vehicle owners, transport operators | Renew vehicle registration; pay a traffic fine |
| Visit Dubai | زوروا دبي | Visitors and event organisers | Get a permit to hold an event |
| Dubai Justice | دبي للعدالة | Parties to cases, lawyers, legal professionals | Check a court case status; pay a court fee |
| Build in Dubai | دبي للبناء | Developers, consultants, contractors | Apply for a building permit; book a building inspection |
| Invest in Dubai | استثمر في دبي | Founders, investors, company representatives | Apply for a trade licence; renew a trade licence |
| Dubai Trade | دبي التجارية | Importers, exporters, logistics companies | Submit a customs declaration |

These are the official Arabic channel names. The design system's components all take them from the same source, so every page agrees. Channel names are not translated afresh.

### <a id="svc-theme"></a>5.2 The channel is the theme

- **SVC-01.** Every page and app screen MUST set exactly one channel, the channel the user is in (on the web, `sc-page channel="…"`). Only components that point to other channels show another channel's colours: the channel chip, the channel switcher, the footer's Channels group, the channel network strip and the rows of a life-event step list that belong to another channel.
- **SVC-02.** Entities MUST NOT supply or override colours, fonts, radii, logos or any other part of the look. An entity appears only as attribution text, written in full in both languages (for example "Roads and Transport Authority" / «هيئة الطرق والمواصلات»).
- **SVC-03.** A page MUST NOT mix channel themes, except in the components named in SVC-01.

### <a id="svc-naming"></a>5.3 Naming services

- **SVC-04.** A service name MUST describe the task as a verb and an object, in the words users search for: "Renew vehicle registration", "Pay a traffic fine", "Apply for a building permit".
- **SVC-05.** A service name MUST NOT be an entity name, a programme or campaign name, a system name or an internal code. Formal names and codes are stored as search synonyms.
- **SVC-06.** Different user intentions with different journeys (apply, renew, check status) MUST have separate names and records. Related tasks are grouped on a topic page.
- **SVC-07.** The Arabic and English names MUST be written together, by Arabic and English content designers, and MUST describe the same action, scope and outcome. Arabic names use a verbal noun: «تجديد ترخيص المركبة»، «دفع مخالفة مرورية»، «التقدّم بطلب رخصة بناء».
- **SVC-08.** The English name SHOULD be 65 characters or fewer.
- **SVC-09.** Names MUST be tested with users before launch (search-term analysis and a comprehension test), and former names, common misspellings and transliterations MUST be kept as synonyms.

| Avoid | Use | Arabic |
| --- | --- | --- |
| Commercial licensing renewal services portal | Renew a trade licence | تجديد الرخصة التجارية |
| CMS case enquiry | Check a court case status | الاستعلام عن حالة قضية |
| Vehicle licensing | Renew vehicle registration | تجديد ترخيص المركبة |

### <a id="service-record"></a>5.4 One canonical service record

- **SVC-10.** Each service MUST have one canonical record ([Appendix B](#appendix-catalogue)) with one stable identifier, one accountable service owner, one owning entity and one canonical start URL per platform.
- **SVC-11.** A service listed on more than one channel MUST resolve to the same record, the same facts (fees, eligibility, documents, timings) and the same transaction. Channels MUST NOT create duplicate transactions or channel-specific fees.
- **SVC-12.** Classification MUST be stored separately from the name: primary and secondary categories, audiences, life or business events, synonyms, owning entity and the channels that list it.
- **SVC-13.** When a service appears in more than one channel, the decision about where it is primary MUST be recorded by the content and taxonomy lead. Secondary listings MUST point to the other channel with a channel chip ("Also on Dubai Transport" / «متوفر أيضًا في مواصلات دبي»).
- **SVC-14.** Taxonomy changes MUST be made centrally with redirects. A retired service identifier MUST resolve to its replacement or to a page that explains what replaced it.
- **SVC-15.** Fees, eligibility, documents and timings MUST come from the record and MUST be confirmed by the service owner before publication. Where a value is not confirmed, the page MUST say so ([style guide](#cnt-style), "Fees and timings").

**How we check.** The catalogue validation result, the naming research and synonym list, and a walk from each listing channel to the same record and transaction ([handbook 6.1](assurance-handbook.md#check-channels)).

---

## <a id="lang"></a>6. Arabic and English

This chapter holds every rule about language parity, switching, direction, bidirectional text, numerals, mirroring and Arabic typography. Arabic content style is in [13.3](#cnt-arabic).

### <a id="lang-parity"></a>6.1 Parity

- **LANG-01.** Every service MUST launch in Arabic and English at the same time, with the same eligibility, fees, warnings, documents, actions, error messages, status meanings, privacy information and support routes in both.
- **LANG-02.** A service MUST NOT go live with any part of its content missing in either language, including assistive text (visually hidden labels, live-region announcements, accessible names), file errors, receipts and notifications. A missing translation is a release defect, not a variant: there is no "translation unavailable" state.
- **LANG-03.** Arabic and English content MUST be written by content designers working in each language, from the same source facts. Machine translation MAY be used as a draft only; a person who writes the language professionally reviews and owns the result.

Which text prevails for legal effect when the two differ is for counsel to confirm ([OQ-35](#open-questions)).

### <a id="lang-switching"></a>6.2 Switching language

- **LANG-04.** Every page and screen MUST offer the language switch in the same place for its kind of page: at the end of the app bar on transaction pages, and among the end controls of the site header on channel pages ([CHR-01](#tpl-chrome)). On the web it is `sc-language-switch`.
- **LANG-05.** The switch MUST be a link to the same page in the other language, labelled with that language's own name in its own script: «العربية» on an English page and "English" on an Arabic page, with the matching `lang` and `hreflang`. It MUST NOT use flags and MUST NOT be a button that opens a menu. A single-page app keeps the link and MAY cancel its navigation to switch in place ([LANG-08](#lang-switching)).
- **LANG-06.** Switching MUST keep the user on the equivalent page or step. It MUST keep everything the user has entered, uploaded files, selected options, filters, the represented person or organisation, any error messages (re-rendered in the new language) and any transaction in progress. It MUST NOT submit anything.
- **LANG-07.** Web URLs MUST carry the language as the first path segment, with the rest of the path identical: `/en/renew-vehicle-registration/plate` and `/ar/renew-vehicle-registration/plate`. Each page MUST declare its alternate with `<link rel="alternate" hreflang="ar|en" href="…">`.
- **LANG-08.** After a full page load in the new language, focus starts at the top of the page as for any page load. When a single-page app switches without a page load, focus MUST move to the page `<h1>`.
- **LANG-09.** Text the user typed (names, addresses, descriptions) MUST NOT be translated or transliterated when the language changes.
- **LANG-10.** Handoffs to UAE PASS, Dubai Pay and other channels MUST request the user's current language where the provider supports it, and MUST restore it on return.
- **LANG-11.** Native apps MUST start in the device language when it is Arabic or English, and MUST offer an in-app switch that follows LANG-06.

### <a id="lang-direction"></a>6.3 Direction and layout

- **LANG-12.** Every page MUST set `lang` and `dir` on the root element: `lang="ar" dir="rtl"` or `lang="en" dir="ltr"`. A passage in the other language MUST set its own `lang`, and its own `dir` if it is longer than a word or two.
- **LANG-13.** Layout MUST use logical properties only (`margin-inline-start`, `padding-inline-end`, `inset-inline-start`, `text-align: start`). Service code MUST NOT use `left` or `right` for layout.
- **LANG-14.** DOM order MUST follow the reading order. Direction comes from `dir`; it MUST NOT be faked by reversing the DOM, using `flex-direction: row-reverse` for language, or reordering with CSS.

### <a id="lang-bidi"></a>6.4 Bidirectional text

Arabic text often contains left-to-right runs: plates, amounts, references, phone numbers, emails, URLs, file names and Latin names. Without isolation, the bidirectional algorithm can move their punctuation and reorder their parts.

- **LANG-15.** Every left-to-right value inside Arabic text MUST be isolated:
  - in page markup, wrap it in `sc-ltr`: `رقم اللوحة <sc-ltr>Dubai A 12345</sc-ltr> مسجل باسمك.`
  - inside a component's shadow root, use `<bdi dir="ltr">…</bdi>`
  - in plain text that cannot carry markup (SMS, push notifications, email subjects, PDF text, native string resources), put U+2066 LEFT-TO-RIGHT ISOLATE before the value and U+2069 POP DIRECTIONAL ISOLATE after it
- **LANG-16.** Isolation MUST be used for values, not sentences. A whole sentence in the other language MUST set `lang` and `dir` on its element instead.
- **LANG-17.** Fields that take left-to-right values (plate, Emirates ID number, phone, email, IBAN, reference) MUST read left to right while staying aligned to the start of the field, under the label (`sc-text-input ltr`). The field's label, hint and error MUST NOT be flipped.
- **LANG-18.** Free text that the user writes (names, descriptions) MUST use `dir="auto"` wherever it is displayed back, so an English name on an Arabic page and an Arabic name on an English page both read correctly.
- **LANG-19.** Directional marks (U+200E, U+200F) MUST NOT be used as a substitute for isolates.

### <a id="lang-numerals"></a>6.5 Numerals

- **LANG-20.** Digits MUST be Latin (0 1 2 3 4 5 6 7 8 9) in both languages, for amounts, plates, references, dates, times, counts, phone numbers and every other number. Arabic-Indic digits MUST NOT be output, except in a reproduced official document whose issuing authority requires them.
- **LANG-21.** Inputs MUST accept Arabic-Indic and Eastern Arabic-Indic digits, normalise them to Latin digits before validation and storage, and show the normalised value back. Text and number fields MUST also remove bidirectional control characters from pasted values before validation (U+200E, U+200F, U+202A to U+202E and U+2066 to U+2069), because values copied from Arabic messages carry them. Normalisation MUST NOT change any other character of an identifier.
- **LANG-22.** Numbers MUST be formatted the same way in both languages: comma for thousands and full stop for decimals ("1,250.00"). Formats for money, dates and phone numbers are in the [style guide](#cnt-style).
- **LANG-22A.** In Arabic, a range of numbers MUST be written with a word, not a dash: «عرض 1 إلى 20 من 1,284 مخالفة», not "1–20". A dash is direction-neutral, so in right-to-left text "1–20" displays as "20–1".
- **LANG-23.** Arabic plural forms MUST follow the number, using the language's plural categories (zero, one, two, few, many, other): «يوم واحد»، «يومان»، «3 أيام»، «15 يومًا»، «100 يوم». On the web, use `Intl.PluralRules('ar')`.

### <a id="lang-mirroring"></a>6.6 What mirrors and what does not

In Arabic the layout mirrors. Some things keep their direction because their meaning does not depend on reading direction. Which icons mirror is listed in the [Design System reference](design-system-reference.md#icons).

| Mirrors in Arabic | Does not mirror |
| --- | --- |
| Page layout, grid column order, the app bar (back link at the start, language switch at the end) | Digits and numbers, and the order of their parts (plates, references, phone numbers, IBANs, dates inside an isolate) |
| Directional icons (arrows, chevrons, "open in new", send, the question mark) | Other icons, and the spinner |
| Back and forward controls, pagination, disclosure chevrons | Media playback controls (play, pause, skip, the progress bar of a video or audio player) |
| Progress that represents journey order: the stepper runs from the right | Clocks, timers and anything that depicts clockwise time |
| Form layout: the error bar and the radio or checkbox sit at the start of a field | Logos, brand marks, the Government of Dubai lockup, the UAE PASS button and Dubai Pay assets |
| Tables: the first column is at the start, amounts aligned to the end | Photographs, maps and illustrations of real scenes |
| The arrow between "From" and "To" in a date range, and the calendar (Monday in the rightmost column) | Charts: axes keep their orientation (time runs from left to right, values rise upwards); titles, legends and labels are in Arabic and the legend follows the reading direction |
| Horizontal scroll regions start on the right | Code, URLs and email addresses |

### <a id="lang-type"></a>6.7 Arabic typography

- **LANG-25.** Arabic text MUST use the Arabic values of the type scale (larger sizes and taller leading), never the English values. The design system's type roles switch automatically under `lang="ar"`.
- **LANG-26.** Arabic MUST NOT be letter-spaced. Letter-spacing breaks the joins between letters.
- **LANG-27.** Arabic text MUST NOT be smaller than 16px.
- **LANG-28.** Arabic MUST NOT use italic or oblique styles, real or synthesised. Emphasise with the Bold weight or with wording.
- **LANG-29.** Arabic text MUST be aligned to the start and MUST NOT be justified. Tatweel (kashida, U+0640) MUST NOT be used to stretch words.
- **LANG-30.** `text-transform` MUST NOT be applied to text that may contain Arabic.
- **LANG-31.** A Latin word or value inside Arabic text MUST stay in the surrounding Arabic size and the same font. Dubai Font covers both scripts, so no font or size switch is needed.
- **LANG-32.** Arabic SHOULD be written without diacritics (tashkīl). Add them only where a word would otherwise be misread, and never to mark the grammatical gender of the reader ([CNT-11](#cnt-arabic)).
- **LANG-33.** Running text in either language MUST NOT exceed the reading width of 680px.

**How we check.** The main journey in both languages with a language switch mid-journey; the page language and alternates; an automated check for Arabic-Indic digits and physical CSS properties; a screen reader reading a confirmation page in Arabic; a code pasted from an Arabic SMS; and the Arabic content designer's sign-off ([handbook 6.2](assurance-handbook.md#check-language)).

---

## <a id="a11y"></a>7. Accessibility

### <a id="a11y-baseline"></a>7.1 Baseline

- **A11Y-01.** Every web page and every process MUST meet WCAG 2.2 Level AA, which includes every Level A criterion. The 55 criteria, the requirements that cover each and how to check them are in [Appendix A](#appendix-wcag). Native apps MUST meet the same criteria as interpreted for non-web software by WCAG2ICT ([17.4](#plat-parity)).
- **A11Y-02.** Conformance MUST be assessed on complete processes, not sample pages: signed-in views, both languages, light and dark themes, every error and recovery state, issued documents, embedded third-party widgets, and third-party steps such as UAE PASS and Dubai Pay that are part of the journey.
- **A11Y-03.** A team MUST NOT claim conformance because the service uses the shared components, because an automated tool reports no issues, or because a sample of pages passed. Components help a service conform; they do not make it conform.
- **A11Y-22.** Services MUST also meet the AAA criteria the standard adopts ([Appendix A.2](#appendix-aaa)). Most are met by the requirements below and by the shared components.

WCAG 2.2 is also published as ISO/IEC 40500:2025. For procurement, the European standard EN 301 549 is the reference: version 3.2.1 (which uses WCAG 2.1) now, and version 4.1.1 (which uses WCAG 2.2) once it is cited in the Official Journal of the European Union. A service that meets this standard meets the web requirements of both versions ([Assurance handbook 11](assurance-handbook.md#contracts)).

### <a id="a11y-beyond"></a>7.2 Rules that go beyond WCAG

These are deliberate decisions, stricter than WCAG AA.

- **A11Y-04. Target size.** Every standalone interactive target MUST be at least 44 × 44 CSS px. A control drawn smaller (a 32px chip, an inline icon button) MUST extend its target to 44 × 44 without overlapping another target. WCAG 2.5.8 exempts links in running text; Shared Channels still requires them to be at least 24px tall, which body line heights give. A link alone in a table cell is a standalone target. This rule also meets AAA 2.5.5.
- **A11Y-05. Focus is always visible.** When someone moves through a page with a keyboard, the element they are on MUST show the shared focus ring. The ring is the same on every channel and in both themes, and MUST have at least 3:1 contrast with what is next to it (WCAG 1.4.11). The shared components draw it; how is in the [Design System reference](design-system-reference.md#focus).
- **A11Y-15. Focus is never covered or cut off.** Sticky headers, docked bars, banners, chat panels and sticky parts inside components MUST NOT hide the focused element, even partly (WCAG 2.4.11 and AAA 2.4.12). Sticky and fixed bars MUST become static when the viewport is too short for them: the docked utility bar below a viewport height of 600px, and the sticky app bar when the design system says so. If the ring would be cut off at a screen edge, it MUST be drawn inside the element.
- **A11Y-06. Colour is never the only signal.** Status MUST always have words and an icon as well as colour. A current or selected item MUST also change shape: a check, an indicator bar, an underline or a Filled icon. Bold text alone is not enough, because short Arabic text is already Bold. A dot MUST NOT be used for status; it is used only for channel attribution and, with a fill, Bold text and a hidden "Unread:" word, for unread notifications.
- **A11Y-07. User preferences.** Services MUST respect reduced motion ([MOT-15](#cmp-motion)), forced colours (every control stays visible in Windows contrast themes) and the light or dark theme the user has chosen ([FND-09](#cmp)).
- **A11Y-08. No disabled buttons for validation.** Buttons MUST stay enabled while a form is incomplete; the service explains what is missing when the user tries to continue ([16.6](#pat-questions)).

### <a id="a11y-more"></a>7.3 Content, controls and third parties

- **A11Y-16. Content on hover or focus.** Content that appears on hover or focus MUST be dismissible with Escape without moving focus, MUST stay while the pointer moves over it, and MUST stay until dismissed or no longer relevant (WCAG 1.4.13). Services SHOULD use a toggletip (a button that shows the text when pressed) rather than a hover tooltip. Essential information MUST NOT exist only in a tooltip ([HELP-02](#pat-help)).
- **A11Y-17. Label in name.** A control's accessible name MUST contain its visible label, in the same words and order, preferably at the start, in both languages (WCAG 2.5.3). Hidden text is added after the visible label, never before it ("Change plate number").
- **A11Y-18. Character key shortcuts.** Services MUST NOT add single-key shortcuts (letters, digits or punctuation, in either script). Any shortcut MUST use a modifier key or be possible to turn off or remap (WCAG 2.1.4).
- **A11Y-23. Pointer cancellation.** Actions MUST fire when the pointer is released, not when it is pressed, so that moving off the target before release cancels them (WCAG 2.5.2). Visual feedback MAY appear on press.
- **A11Y-19. Third-party widgets and overlays.** Embedded third-party widgets (chat, surveys, maps, video players, the Happiness Meter) are part of the service and MUST meet [Appendix A](#appendix-wcag). They MUST NOT open uninvited, cover the focused element or trap focus. An accessibility overlay or toolbar MUST NOT be used to meet any criterion, and MUST NOT override users' own settings. Where "accessibility options" are offered, they MUST link to the accessibility statement and explain how to use the device's own settings.
- **A11Y-20. Audio and video.** Prerecorded video MUST have captions in the language of the page, written or checked by a person, and a transcript; it MUST have audio description or a full text alternative where visual information is not in the soundtrack. Live audio and video (for example remote hearings and webinars) MUST have live captions. Audio MUST NOT play automatically. Players MUST work by keyboard, MUST offer captions at the same level as play, and their controls do not mirror ([6.6](#lang-mirroring)). High-volume services SHOULD offer Emirati Sign Language for their main explainer video.
- **A11Y-21. Documents.** Every document a service issues (receipts, certificates, letters, downloadable forms) MUST be tagged, set its language, have a logical reading order and contain text that extracts correctly in Arabic and English, following PDF/UA (ISO 14289). A reference copied out of an Arabic document MUST paste intact. Emails MUST follow the same rules as pages.

### <a id="a11y-testing"></a>7.4 Testing

- **A11Y-09.** Each release MUST pass automated checks (axe, in English and Arabic, light and dark) on every page template it uses.
- **A11Y-10.** Each release that changes a journey MUST also be tested by hand: keyboard only; screen readers from the support matrix in both languages; 200% text resize; 400% zoom and reflow at 320 CSS px; text spacing overrides (in Arabic, line height, paragraph spacing and word spacing; letter spacing is not used in Arabic so is not tested); forced colours; and reduced motion. A new journey or major change MUST be tested on the full matrix; a minor change MAY use the smoke set in the [Assurance handbook](assurance-handbook.md#a11y-testing).
- **A11Y-11.** Before the beta assessment, the service MUST be tested by people of determination using their own assistive technology, in Arabic and in English ([10](#research)), and evaluated against every criterion in Appendix A by an accessibility specialist who did not build it.

### <a id="a11y-support"></a>7.5 Supported browsers and assistive technology

Services MUST work on, and are tested with, the combinations below. The matrix is reviewed every six months against channel analytics.

| Platform | Browser or app | Assistive technology (tested in Arabic and English) |
| --- | --- | --- |
| Windows | Edge, Chrome, Firefox (latest two major versions) | NVDA with Firefox or Chrome; JAWS with Chrome or Edge; Narrator with Edge; Windows contrast themes; Windows Magnifier; ZoomText or Fusion |
| macOS | Safari, Chrome (latest two major versions) | VoiceOver with Safari; Zoom; Voice Control (English) |
| iOS and iPadOS | Safari (latest two major iOS versions); the channel apps | VoiceOver; Dynamic Type at the largest accessibility size; Switch Control; Voice Control |
| Android | Chrome, Samsung Internet (latest two major versions); the channel apps | TalkBack; font size and display size at maximum; Switch Access; Voice Access |

- Screen readers are tested with both an Arabic and an English voice installed, and the test record names them, because automatic language switching works only when both exist.
- Speech input is tested in English, and in Arabic where the platform supports it.
- Each release that changes a journey includes one check with an Arabic braille display.

### <a id="a11y-statement"></a>7.6 Accessibility statement

- **A11Y-12.** Each service MUST publish an accessibility statement in Arabic and English, linked from the footer, using the template in the [Assurance handbook](assurance-handbook.md#tpl-statement).
- **A11Y-13.** The statement MUST be honest: it lists every known failure against Appendix A, what users can do instead, and when it will be fixed. It MUST NOT claim full conformance while known failures exist.
- **A11Y-14.** The statement MUST be reviewed at least every 12 months and after every major change, and MUST show the date of the last review.

**How we check.** Automated results per template, the manual test record against the support matrix, the WCAG register with a result and evidence for each criterion, a keyboard and Arabic screen reader walk of one journey, and a comparison of the statement with the register ([handbook 6.3](assurance-handbook.md#check-a11y)).

---

## <a id="privacy"></a>8. Privacy, security and consent

The legal basis for processing, retention periods and consent are confirmed by the entity's legal and privacy owners ([12](#legal)). This chapter sets what the service must show and do.

### <a id="prv-minimisation"></a>8.1 Collect only what is needed

- **PRV-01.** Services MUST collect only the information the task needs, at the point it is needed.
- **PRV-02.** Each service MUST keep a question protocol: for every field, why it is needed, who uses it, whether it is reused, and how long it is kept. It MUST be reviewed at each assessment.
- **PRV-03.** Services MUST NOT ask for information about disability, health, religion or other sensitive characteristics unless the task requires it and the reason is recorded.

### <a id="prv-notice"></a>8.2 Privacy notice

- **PRV-04.** Each service MUST have a privacy notice in both languages, linked from the footer and from the start page, saying in plain language what is collected, why, who receives it, how long it is kept and how users can ask about or correct their data.
- **PRV-05.** Short explanations at the point of collection ("We will use your phone number only to send you updates about this application" / «سنستخدم رقم هاتفك لإرسال التحديثات الخاصة بهذا الطلب فقط») SHOULD link to the notice.
- **PRV-06.** A privacy notice MUST NOT be presented as a consent box. Consent MUST be asked for only where it is the actual basis for processing.

### <a id="prv-security"></a>8.3 Security

- **PRV-07.** Authorisation MUST be checked on the server for every protected request; knowing a reference MUST NOT give access to someone else's record.
- **PRV-08.** Secrets MUST NOT be in client code or in source repositories. Sessions MUST use secure, HTTP-only cookies.
- **PRV-09.** Personal data, tokens and codes MUST NOT appear in URLs, page titles, analytics events or logs.
- **PRV-10.** Each service MUST have a threat model, reviewed at each assessment. The applicable information security baseline, hosting and data residency rules are to be confirmed ([OQ-8](#open-questions)).
- **PRV-11.** On shared devices, signing out MUST clear protected information from the screen and from local storage, and the service MUST say what it keeps on the device.

### <a id="prv-cookies"></a>8.4 Cookies and analytics

- **PRV-12.** Non-essential cookies, analytics and similar storage MUST be off until the user accepts them. Nothing non-essential runs before a choice is made. Remembering that a user dismissed an announcement is kept in session storage only, which ends with the session ([CHR-09](#tpl-chrome)).
- **PRV-13.** The cookie banner MUST appear at the top of the page on first visit, before the main content, and offer "Accept additional cookies" / «قبول ملفات تعريف الارتباط الإضافية» and "Reject additional cookies" / «رفض ملفات تعريف الارتباط الإضافية» as buttons of equal weight, plus a link to the cookies page. It MUST NOT cover content or trap focus.
- **PRV-14.** After a choice, the banner MUST confirm it and MAY then be hidden. The choice MUST be stored and applied: it is a real switch, not a record.
- **PRV-15.** The cookies page MUST list every cookie and similar storage by name, purpose and lifetime, separate essential from optional ones, and let the user change their choice at any time.
- **PRV-16.** Choosing not to accept optional cookies MUST NOT block or degrade any service.

The legal basis for analytics and the retention period of the consent record are to be confirmed ([OQ-27](#open-questions)).

**How we check.** The question protocol and privacy notice in both languages, a clean-browser check that nothing non-essential runs before consent, and an attempt to open another user's record by changing a reference ([handbook 6.4](assurance-handbook.md#check-privacy)).

---

## <a id="perf"></a>9. Performance and resilience

- **PERF-01.** Before release, the main journey MUST be tested on a low-cost Android phone and in a repeatable throttled profile of 1.6 Mbps download, 750 Kbps upload and 150 ms round-trip time. The device, profile and cache state MUST be recorded.
- **PERF-02.** After release, at the 75th percentile of real users measured by the channel's real-user monitoring, each page MUST meet: Largest Contentful Paint 2.5 s or less, Interaction to Next Paint 200 ms or less, and Cumulative Layout Shift 0.1 or less. Before release, the same thresholds MUST be met in the lab with the PERF-01 profile. These are release gates.
- **PERF-03.** Pages SHOULD load no more than 200 KB of compressed JavaScript per route and 1 MB in total on first load, not counting documents the user asks for. A larger budget is recorded with its reason. The shared design system takes a small, fixed share of this ([Design System reference](design-system-reference.md#budgets)).
- **PERF-04.** Public information, navigation and help MUST work without JavaScript. Where a transaction needs JavaScript, failure to load MUST be detected and the user told what to do.
- **PERF-05.** Loading feedback MUST appear promptly; a wait longer than a few seconds MUST say what is happening and what to do if it does not finish. Nothing spins forever.
- **PERF-06.** Each service MUST set availability and recovery objectives based on the harm an outage causes, monitor UAE PASS, Dubai Pay and entity systems separately, and have an incident process and a named on-call route.
- **PERF-07.** Native apps SHOULD meet the native performance budgets (cold start, app size, offline behaviour) once they are set ([OQ-19](#open-questions)).

**How we check.** Lab results with the PERF-01 profile before release, the real-user monitoring report after release, the start page with JavaScript off, and the availability objectives and incident runbook ([handbook 6.5](assurance-handbook.md#check-performance)).

---

## <a id="research"></a>10. User research

- **RES-01.** Research MUST include the people the service is for, recruited for the service's real audiences: citizens, residents, visitors, business representatives and professionals as relevant.
- **RES-02.** Every research round MUST include participants who use the service in Arabic and participants who use it in English, and participants with access needs. Across the alpha and beta phases, research MUST include people of determination using their own assistive technology (including screen readers in Arabic), older people, people with low digital confidence, and people on low-cost phones or slow connections. Where relevant, it MUST also include domestic workers, visitors without a UAE phone number, and people acting for others.
- **RES-03.** Participants MUST consent in their own language to how their data and recordings are used, and MUST be compensated for their time through a route the entity's finance rules allow.
- **RES-04.** Each critical journey MUST be tested with at least one interruption (a failed payment, an expired session, a lost connection) and one assisted route.
- **RES-05.** Research findings, recruitment gaps and the design changes made MUST be recorded and shown at assessment. Testing by the team's own staff does not count as research with users.
- **RES-06.** Research rounds SHOULD happen in discovery, alpha, beta and after major changes. The number of participants follows the risk and the range of users, not a fixed number.

**How we check.** The research plan, participant profiles against RES-02 (without personal data) and the changes made as a result ([handbook 6.6](assurance-handbook.md#check-research)).

---

## <a id="assurance"></a>11. Assurance

This chapter sets the assurance rules. How assessments, panels and exceptions work in practice is in the [Assurance handbook](assurance-handbook.md).

### 11.1 Roles

The issuing authority adopts the standard, appoints assessors, approves high-severity exceptions and settles disputes between entities. The service owner in the owning entity is accountable for the whole service. The channel product owner is accountable for how services appear on the channel. The design system team owns the design system and this standard. The full list of roles is in the [handbook](assurance-handbook.md#roles).

### 11.2 Assessments

Services are assessed against the [12 points](#points) at alpha, beta and live, by a route that matches their risk. A **major change** is a new platform, a new identity or payment flow, a new channel listing or a change to who the service is for; it brings a reassessment of the points it affects.

The risk tiers, routes and approvals below are proposed for consultation ([OQ-39](#open-questions)).

- **ASR-11. Risk tier.** Each service MUST have a risk tier (high, standard or low) recorded in its catalogue record. A service that takes payment, establishes identity or authority, has legal effect, handles sensitive personal data or has high volume is high risk.
- **ASR-12. Assessment route.** High-risk services MUST be assessed by a central panel at alpha, beta and live. Standard-risk services MUST pass a channel panel at beta and MAY self-assess at alpha and live, with central sampling. Low-risk changes MAY be self-assessed. Every panel MUST include an Arabic content specialist and an accessibility specialist.

A service MUST NOT open to the public until its beta assessment is met, and MUST NOT drop the beta label until its live assessment is met.

### 11.3 Exceptions

- **ASR-01.** A service that cannot meet a requirement MUST record an exception: the requirement identifiers, the services, platforms, languages and users affected, the barrier, the options considered, the interim support provided, the remediation owner and date, and an end date.
- **ASR-02.** An exception MUST last no more than 90 days and MUST be reviewed at least at expiry, and monthly for severity 1 and 2. Renewal needs new evidence and a new decision.
- **ASR-03.** Severity MUST be set by the effect on people: task blocked (1), task possible only with unreasonable effort (2), or inconvenience (3). It is not set by WCAG level.
- **ASR-13.** Severity 1 exceptions MUST be approved by the issuing authority. Severity 2 and 3 exceptions for standard and low-risk services MAY be approved by the channel product owner, and MUST be visible in the shared exception register.
- **ASR-04.** An exception MUST NOT change the truth of an accessibility statement: a known failure is still listed as a failure. It cannot waive a legal duty or a provider's security requirement.
- **ASR-05.** Where a critical service runs with an accepted barrier, the statement MUST list it and a staffed alternative MUST be provided and measured.
- **ASR-14.** Using the documented interim approach for a planned component ([Design System reference 10.4](design-system-reference.md#backlog)) meets the standard and MUST NOT require an exception.

### 11.4 Release decisions

- **ASR-06.** Each release MUST name the standard version, the design system library and token versions it uses, its open defects and the people who approved it.

### <a id="measures"></a>11.5 Measures

Services MUST report these measures each quarter ([point 12](#points)):

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

Measures are segmented only where that is lawful and proportionate. Services do not collect diagnoses or full search queries to measure accessibility. Targets and how the measures relate to existing government customer happiness reporting are to be agreed at adoption ([OQ-32](#open-questions)).

**How we check.** The issuing authority keeps the assessment reports, the exception register and release decisions, and publishes a summary of outcomes per channel.

---

## <a id="legal"></a>12. Legal and policy context

Each service remains responsible for meeting the law that applies to it. This standard does not interpret law. A legal annex will be added once counsel has confirmed the instruments that apply ([OQ-5 to OQ-9](#open-questions)).

The standard cites one instrument because the shared chrome uses the Government of Dubai lockup. Law No. (1) of 2025 regulates the emblems of Dubai and of the Government of Dubai. Article 7 requires them to be used according to a usage manual prepared by the General Secretariat of the Executive Council and approved by the Chairman of the Executive Council. Article 6(b) requires the Chairman's prior authorisation for use by non-government entities and by government entities run on a commercial basis. The lockup is used only as that manual sets out, with any authorisation under Article 6(b) if it applies ([CHR-02](#tpl-chrome), [OQ-30](#open-questions)).

Whatever the instruments turn out to be, every service needs the following:

- **LEG-01.** Each service MUST have a privacy notice ([PRV-04](#prv-notice)), an accessibility statement ([A11Y-12](#a11y-statement)) and terms of use, in Arabic and English, linked from the footer.
- **LEG-02.** Each service MUST have a record of legal review covering its data flows, retention, consent basis and any sector rules, signed by the entity's legal or privacy owner before the beta assessment.
- **LEG-03.** UAE PASS and Dubai Pay integrations MUST follow the provider's current integration terms, brand rules and button assets. This standard does not replace them.
- **LEG-04.** Content MUST use "people of determination" / «أصحاب الهمم», the official UAE term, for disabled people. Quotations from WCAG keep WCAG's own wording.

**How we check.** The signed legal review record at beta, and the footer links in both languages ([handbook 5](assurance-handbook.md#evidence)).

---

## <a id="content"></a>13. Content design

### <a id="cnt-voice"></a>13.1 Voice

Shared Channels content is plain, direct and calm. It speaks to one person about their task.

- **CNT-01.** Content MUST say what the user needs to do and what will happen, in the order they need it, with the most important information first.
- **CNT-02.** Service content MUST NOT use marketing language ("world-class", "seamless", "smart"), slogans or exclamation marks, and MUST NOT promote the government, the entity or the channel. Channels whose purpose includes promotion MAY carry promotional content in the promotion slots of channel pages, and only there ([CHR-11](#tpl-chrome)).
- **CNT-03.** Content MUST be honest about uncertainty: say "We are checking your payment", "The fee depends on the size of the building" or "We have not confirmed this date yet" instead of guessing.

### <a id="cnt-plain"></a>13.2 Plain English

- **CNT-04.** English content MUST be written in UK English, addressing the user as "you" and the service as "we". It SHOULD use the active voice.
- **CNT-05.** Sentences SHOULD be 25 words or fewer. Paragraphs SHOULD be 3 sentences or fewer.
- **CNT-06.** Content SHOULD use the words users use, and MUST explain a legal or technical term the first time it appears, or replace it.
- **CNT-07.** Every heading, label, button and link MUST use sentence case. Capitalise only proper nouns.
- **CNT-08.** Acronyms SHOULD be spelt out the first time, except "UAE", "UAE PASS", "AED" and "PDF".
- **CNT-20.** Instructions MUST NOT rely on position, direction, shape, size, colour or sound, because layouts mirror between languages (WCAG 1.3.3). Refer to a control by its label ("Select Continue"), never as "the button on the right" or "the green box".

### <a id="cnt-arabic"></a>13.3 Arabic content style

- **CNT-09. Register.** Arabic content MUST be written in plain Modern Standard Arabic: short sentences, common words, no legal or bureaucratic formulas where a plain phrase exists. It MUST NOT use a dialect, including Gulf dialect, in service content.
- **CNT-10. Written, not translated.** Arabic content MUST be written for Arabic readers from the same facts as the English. Sentence order, structure and length may differ from the English; meaning, facts and actions MUST NOT.
- **CNT-11. Addressing the reader without assuming gender.** Arabic marks gender in verbs, so content MUST read correctly for every reader:
  - Buttons, links, labels and headings use a verbal noun (masdar), not an imperative.
  - Instructions and error messages use «يُرجى» with a verbal noun.
  - Sentences use forms that are not marked for gender in unvocalised text: «يمكنك», the possessive suffix «ـك» («طلبك»، «رقم لوحتك»), and passive or impersonal constructions («تم استلام طلبك»).
  - Second-person verbs marked for gender («تحتاج» / «تحتاجين»، «تريد» / «تريدين») and imperatives («أدخل» / «أدخلي») MUST NOT be used. Diacritics MUST NOT be added to fix the reader's gender.
  - Content MUST NOT infer a person's gender from their name.
  - Official names are not content and are kept as they are ([CNT-14](#cnt-arabic)), even where they contain an imperative, as «استثمر في دبي» does.
- **CNT-12. Numbers and agreement.** Numbers MUST use Latin digits ([LANG-20](#lang-numerals)). Nouns after numbers MUST follow Arabic rules for dual and plural ([LANG-23](#lang-numerals)). Status words and adjectives MUST agree with the noun they describe; the [status vocabulary](#status-vocabulary) fixes the form for each.
- **CNT-13. Punctuation.** Arabic MUST use the Arabic comma (،), semicolon (؛) and question mark (؟). The full stop and colon are the same characters as in English. Quotations use guillemets (« »). A button, label or heading MUST NOT end with a full stop.
- **CNT-14. Transliteration.** Names of people MUST be shown as the person or their verified record wrote them, never transliterated by the service. Brand and product names MUST keep their official Arabic form where one exists («هيئة الطرق والمواصلات»); where none exists, they stay in Latin script inside an isolate, marked `lang="en"`.
- **CNT-15. Glossary.** Each channel's Arabic and English terms MUST come from the shared glossary, owned by the bilingual content and taxonomy lead. A new term MUST be added to the glossary before it is used. [Appendix F](#appendix-glossary) seeds it.
- **CNT-16. Review.** Every Arabic string, including component strings and notifications, MUST be reviewed by a qualified Arabic content designer before release. Review is recorded once per release, not repeated as a disclaimer on the page.

| English | Arabic | Note |
| --- | --- | --- |
| Continue | متابعة | Verbal noun, not «تابع» |
| Enter the plate number | يُرجى إدخال رقم اللوحة | «يُرجى» with a verbal noun |
| You can pay now or later | يمكنك الدفع الآن أو لاحقًا | «يمكنك» is not marked for gender |
| We have received your application | تم استلام طلبك | Passive form |
| Check your answers before you submit | مراجعة الإجابات قبل إرسال الطلب | Heading as a verbal noun |
| Save and finish later | حفظ والمتابعة لاحقًا | Verbal nouns |
| Upload documents | إرفاق المستندات | Verbal noun |

### <a id="cnt-style"></a>13.4 Style guide

| Topic | English | Arabic | Rule |
| --- | --- | --- | --- |
| Dates | 14 March 2026 | 14 مارس 2026 | Day, month name, year. No ordinals ("14th"), no weekday unless it matters. Abbreviate the month ("14 Mar 2026") only in tables and narrow summaries. Numeric dates ("14/03/2026") only in input hints and typed values |
| Date ranges | 21 September to 9 October 2026 | من 21 سبتمبر إلى 9 أكتوبر 2026 | Use "to" in sentences. An en dash ("21 Sep – 9 Oct 2026") is for compact English summaries only. Arabic compact summaries also use words, because a dash between numbers reverses in right-to-left text ([LANG-22A](#lang-numerals)) |
| Times | 9:30am, 2pm, midday | 9:30 صباحًا، 2 مساءً، 12 ظهرًا | 12-hour clock in both languages |
| Time zone | 2pm (Dubai time) | 2 مساءً (بتوقيت دبي) | All times are Dubai time (Gulf Standard Time, UTC+4, no daylight saving). Say "Dubai time" next to every deadline and appointment |
| Calendar | Gregorian | الميلادي | Gregorian by default. Showing a Hijri date alongside is a service-specific decision ([OQ-11](#open-questions)) |
| Money | AED 1,250.00 | 1,250.00 درهم | English puts "AED" before the amount; Arabic puts «درهم» after it. Always two decimals for amounts due, paid or refunded. Never abbreviate an amount ("1.2k"). Whether to use the dirham symbol is [OQ-10](#open-questions) |
| Free services | Free | مجانًا | Never "AED 0.00" |
| Fees and timings | The fee depends on… / We have not confirmed this yet | تعتمد الرسوم على… / لم يتم تأكيد ذلك بعد | Distinguish "Free", "varies" and "not confirmed". Separate the time it takes to fill in the form from the time the entity takes to decide |
| Phone numbers | +971 4 123 4567, +971 50 123 4567 | the same, isolated | International format with spaces. A UAE mobile number MAY be shown in local form (050 123 4567) in examples and hints. Inside Arabic, isolate the whole number so "+" stays at the start ([LANG-15](#lang-bidi)) |
| Numbers | 1,284 fines; 3 days | 1,284 مخالفة؛ 3 أيام | Digits for all numbers, including one to nine |
| References | F-2026-118204 | F-2026-118204 | Exactly as issued; isolated in Arabic |
| Links | Check your traffic fines | الاستعلام عن المخالفات المرورية | Say where the link goes. Never "click here", "more" or a bare URL |
| Buttons | Continue; Pay with Dubai Pay; Save and finish later | متابعة؛ الدفع عبر Dubai Pay؛ حفظ والمتابعة لاحقًا | Start with the action. Not "Submit", "OK" or "Yes". No full stop |
| Headings | What is your plate number? | ما رقم لوحة المركبة؟ | A question page's heading is the question |
| File references | Insurance certificate (PDF, 240 KB) | شهادة التأمين (PDF، 240 KB) | Give the format and size for downloads |

The Arabic rendering of "Pay with Dubai Pay" depends on the provider's official Arabic name and button wording ([OQ-4](#open-questions)).

### <a id="cnt-errors"></a>13.5 Error messages

- **CNT-17.** An error message MUST say what to do, in the words of the field label, and MUST be the same in the error summary and next to the field. It MUST NOT blame the user or use "invalid", "error occurred" or a system code.
- **CNT-18.** Error messages MUST be written for each situation below. Replace the words in braces with the field's own words.

| Situation | English template | Arabic template |
| --- | --- | --- |
| Required field empty | Enter {the thing} | يُرجى إدخال {الشيء} |
| Required choice not made | Select {the thing} | يُرجى اختيار {الشيء} |
| Wrong format | Enter {the thing} in the correct format, like {example} | يُرجى إدخال {الشيء} بالصيغة الصحيحة، مثل {مثال} |
| Digits only | Enter {the thing} using numbers only, like {example} | يُرجى إدخال {الشيء} بالأرقام فقط، مثل {مثال} |
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

Example: "Enter the plate number using numbers only, like 12345" / «يُرجى إدخال رقم اللوحة بالأرقام فقط، مثل 12345» (with the example isolated). The Arabic plural after `{n}` follows [LANG-23](#lang-numerals); the templates show the form for 11 and above.

### <a id="status-vocabulary"></a>13.6 Status vocabulary

These are the only status words a service may show for applications, tasks, payments and refunds. Each maps to one business state and one status tone (neutral, info, success, warning or error).

- **CNT-21.** Services MUST use only these statuses, with these tones, in tags, lists, tracking pages, notifications and staff tools alike.

**Applications**

| Status | Arabic | Tone | Business state |
| --- | --- | --- | --- |
| Draft | مسودة | neutral | Started, saved, not submitted |
| Received | تم الاستلام | neutral | Submitted and confirmed by the server; not yet being reviewed |
| In review | قيد المراجعة | neutral | The entity is reviewing it |
| Action needed | إجراء مطلوب | error | The entity is waiting for the user to do something |
| Approved | تمت الموافقة | success | The entity has decided in the user's favour |
| Not approved | لم تتم الموافقة | neutral | The entity has decided against the application; reasons and the review route are shown with it |
| Completed | مكتمل | success | The outcome has been delivered (for example, the registration is renewed) |
| Withdrawn | تم السحب | neutral | The user withdrew it |
| Cancelled | تم الإلغاء | neutral | The entity cancelled it; the reason is shown with it |
| Expires in {n} days | تنتهي الصلاحية خلال {n} يومًا | warning | A licence, registration or permit is due for renewal. The Arabic noun after {n} follows [LANG-23](#lang-numerals): «يوم واحد»، «يومين»، «3 أيام»، «15 يومًا» |

**Tasks in a task list** (the Arabic agrees with «مهمة»)

| Status | Arabic | Tone | Meaning |
| --- | --- | --- | --- |
| Not started | لم تبدأ | neutral | Available, nothing saved |
| In progress | قيد التنفيذ | neutral | Some answers saved |
| Completed | مكتملة | success | Every answer saved on the server and valid; not merely visited |
| Cannot start yet | غير متاحة بعد | neutral | Depends on another task, which is named next to it |

**Payments and refunds**

| Status | Arabic | Tone | Business state |
| --- | --- | --- | --- |
| Awaiting payment | بانتظار الدفع | warning | Payment due, not started |
| Checking payment | جارٍ التحقق من الدفع | neutral | Outcome not yet known; do not take payment again |
| Paid | تم الدفع | success | Confirmed by Dubai Pay through the server |
| Payment failed | تعذّر الدفع | error | Confirmed failed; no money taken |
| Payment cancelled | تم إلغاء الدفع | neutral | The user cancelled at the payment step; no money taken |
| Refund requested | تم طلب الاسترداد | neutral | Refund requested, not yet approved |
| Refund in progress | الاسترداد قيد التنفيذ | neutral | Refund approved, money not yet returned |
| Refunded | تم الاسترداد | success | Money returned |

The payment states must match the states the Dubai Pay integration actually reports ([OQ-4](#open-questions)).

- **CNT-19.** "Paid" MUST NOT be shown as, or imply, "Approved". "Received" MUST NOT be shown as, or imply, "Completed".

**How we check.** The content review record for both languages and the glossary entries added; five error messages against the templates; every status shown against the vocabulary; and a search of the Arabic for imperatives and gender-marked verbs ([handbook 6.7](assurance-handbook.md#check-content)).

---

## <a id="ask"></a>14. Asking for information

These patterns cover the information services ask for most often. Each starts from one rule: do not ask for it if the service can lawfully get it from UAE PASS, another government record or an earlier answer ([principle 6](#principles)).

### <a id="ask-general"></a>14.1 Rules for every question

- **ASK-01.** Every question MUST have a recorded purpose in the service's question protocol ([PRV-02](#prv-minimisation)). A question without one is removed.
- **ASK-02.** Information returned by UAE PASS or another authoritative record MUST be shown to the user, not asked again. If it is wrong, the page MUST explain how to correct it at the source; editing it locally MUST NOT appear to change the official record.
- **ASK-03.** Fields MUST accept the formats people naturally type: spaces, hyphens, upper or lower case and Arabic-Indic digits ([LANG-21](#lang-numerals)). The service normalises them; it does not reject them.
- **ASK-04.** Fields MUST use the right `autocomplete` token so browsers and password managers can fill them (WCAG 1.3.5), and MUST allow pasting.
- **ASK-05.** Left-to-right values MUST follow [LANG-17](#lang-bidi). Identifiers MUST use `inputmode="numeric"` where they are digits only, never `type="number"`.
- **ASK-14. No CAPTCHAs.** Services MUST NOT use a CAPTCHA or any other test that asks the user to recognise, transcribe, solve or remember something (WCAG 3.3.8). Bot protection MUST use measures that ask nothing of the user (rate limiting, risk scoring, non-interactive checks). A verification code MUST offer "Send a new code", and running out of attempts MUST NOT lock the user out without an assisted route.

### <a id="ask-fields"></a>14.2 Field reference

| Information | Settings | `autocomplete` | Accept and validate | Error (EN / AR) |
| --- | --- | --- | --- | --- |
| Full name | One text field, full width | `name` | One field unless the service needs parts. Any script, single names, apostrophes, hyphens, up to at least 100 characters. Never transliterate | Enter your full name / يُرجى إدخال الاسم الكامل |
| Name as on a document | Label "Your name as shown on your passport" | `name` | As above; explain why the exact spelling matters | Enter your name as it is shown on your passport / يُرجى إدخال الاسم كما هو مكتوب في جواز السفر |
| Emirates ID number | Left-to-right field, numeric keyboard, hint "For example, 784-1990-1234567-1" | – | 15 digits starting with 784; hyphens and spaces optional. Stored without separators | Enter your Emirates ID number in the correct format, like 784-1990-1234567-1 / يُرجى إدخال رقم الهوية الإماراتية بالصيغة الصحيحة، مثل 784-1990-1234567-1 |
| Passport number | Left-to-right field | – | Letters and digits as printed; no country-specific format check | Enter your passport number / يُرجى إدخال رقم جواز السفر |
| Nationality | A select (planned: a combobox) | `country-name` | The full country list, in the page language, sorted alphabetically for that language | Select your nationality / يُرجى اختيار الجنسية |
| Date of birth | Date input, hint "For example, 27 3 1990" | `bday-day`, `bday-month`, `bday-year` | A real date in the past | Date of birth must be in the past / يجب أن يكون تاريخ الميلاد في الماضي |
| Email address | Left-to-right email field | `email` | Contains "@" and a domain; no other format rules | Enter an email address in the correct format, like name@example.com / يُرجى إدخال البريد الإلكتروني بالصيغة الصحيحة، مثل name@example.com |
| Mobile phone | Left-to-right telephone field, hint "For a number outside the UAE, include the country code" | `tel` | UAE numbers with or without +971 or a leading 0; international numbers with a country code. Stored in international format | Enter a mobile number, like 050 123 4567 or +971 50 123 4567 / يُرجى إدخال رقم الهاتف المتحرك، مثل 050 123 4567 أو +971 50 123 4567 |
| Address in Dubai | See [14.3](#ask-address) | `address-line1`, `address-line2`, `address-level2` | No postcode. Map never required | Enter the building name or number / يُرجى إدخال اسم المبنى أو رقمه |
| Makani number | Left-to-right field, numeric keyboard | – | 10 digits; spaces optional | Enter the Makani number using numbers only / يُرجى إدخال رقم مكاني بالأرقام فقط |
| Vehicle plate | Three fields: emirate (select), plate code, plate number (numeric keyboard) | – | Plate number up to 5 digits; code as issued | Enter the plate number using numbers only, like 12345 / يُرجى إدخال رقم اللوحة بالأرقام فقط، مثل 12345 |
| Trade licence number | Left-to-right field | – | As issued by the licensing authority; ask which authority first when formats differ | Enter the trade licence number / يُرجى إدخال رقم الرخصة التجارية |
| Bank account (IBAN) | Left-to-right field, full width, hint "Starts with AE, 23 characters" | – | UAE IBANs: "AE" and 21 digits; spaces optional; checksum validated. Show the bank name back for confirmation | Enter an IBAN in the correct format, like AE07 0331 2345 6789 0123 456 / يُرجى إدخال رقم الآيبان بالصيغة الصحيحة، مثل AE07 0331 2345 6789 0123 456 |
| Amount | Left-to-right field with "AED" before it, decimal keyboard | – | Digits with optional thousands commas and up to two decimals | Enter the amount in dirhams, like 450.00 / يُرجى إدخال المبلغ بالدرهم، مثل 450.00 |
| Verification code | One left-to-right field, numeric keyboard | `one-time-code` | Paste and autofill allowed. Say where the code was sent and when it expires; offer "Send a new code" | Enter the 6-digit code we sent to +971 50 123 4567 / يُرجى إدخال الرمز المكوّن من 6 أرقام المرسل إلى +971 50 123 4567 |
| Payment card | Never collected by the service | – | Card details are entered only on Dubai Pay ([16.12](#pat-pay)) | – |

The component settings for each row are in the `sc-text-input` and related component specifications.

- **ASK-06. Sex and gender.** Services MUST ask only when they have a recorded legal or operational need, and SHOULD take it from UAE PASS or the official record where available. They MUST NOT ask for gender to decide how to address the user ([CNT-11](#cnt-arabic)).
- **ASK-07. Equality and diversity information.** Services MUST NOT collect it as part of a transaction. Where research or monitoring needs it, they MUST ask separately, after the transaction, make every question optional with a "Prefer not to say" / «أفضّل عدم الإجابة» option, and explain how it is used.
- **ASK-08. People without an Emirates ID or a UAE phone.** Services used by visitors or by people abroad MUST offer a route for people who do not have an Emirates ID, a UAE phone number, a family name or a Latin-script name, or explain the alternative route before they start.

### <a id="ask-address"></a>14.3 Addresses and locations

- **ASK-09.** The service MUST state why the location is needed and whether it is a physical location (a building to inspect) or a postal address.
- **ASK-10.** For Dubai locations, the service MUST ask only for the parts it needs, from: area, street, building name or number, unit, and Makani number. It SHOULD offer a saved or earlier address for selection.
- **ASK-11.** A postcode MUST NOT be required. International addresses MUST adapt to the chosen country and allow countries without postcodes.
- **ASK-12.** A map or the device's location MAY help, but MUST NOT be the only way to give a location. Location permission MUST be asked for only when the user chooses that option, with the reason explained first. If permission is refused or the result is inaccurate, the typed route MUST work without penalty and the service MUST NOT ask again.
- **ASK-13.** Any map selection MUST work without dragging: search, tap or click to place, and buttons to move the marker (WCAG 2.5.7). The selected location MUST be shown as text for the user to confirm.

**How we check.** The question protocol, each field type with spaces, hyphens, Arabic-Indic digits and pasted values, `autocomplete` in the markup, and an address given without a map ([handbook 6.8](assurance-handbook.md#check-ask)).

---

## <a id="templates"></a>15. Page templates

Every page uses one of these templates. Each lists the content it must contain, in order.

### <a id="tpl-shell"></a>15.1 Page shell and title

- **TPL-01.** Every page MUST use a page shell: a skip link; the official banner ([CHR-12](#tpl-chrome)); a header with the channel name and the language switch (the app bar on transaction pages, the site header on channel pages); one `<main>`; and the footer with help and contact, accessibility, privacy, cookies and terms links. Sticky headers MUST follow [A11Y-15](#a11y-beyond).
- **TPL-02.** The page `<title>` MUST be "{Page heading} – {Service name} – {Channel name}" in the page language, for example "What is your plate number? – Renew vehicle registration – Dubai Transport" / «ما رقم لوحة المركبة؟ – تجديد ترخيص المركبة – مواصلات دبي». While errors are shown, it MUST start with "Error: " / «خطأ: ». Pages outside a service omit the service name.
- **TPL-03.** Each page MUST have exactly one `<h1>`, and it MUST match the page heading part of the title, after any "Error: " prefix.

The page shell's markup is in the `sc-page` specification and the [Design System reference](design-system-reference.md#components).

### <a id="tpl-start"></a>15.2 Service detail page (start page)

The page a user reaches from search, a channel listing or a link. It is public: it never requires sign-in. Content, in order:

1. `<h1>`: the service name ("Renew vehicle registration" / «تجديد ترخيص المركبة»).
2. One or two sentences on what the service lets the user do.
3. Who can use it, and who cannot (with a link to the right service for them).
4. **Before you start** / «قبل البدء»: what the user needs (documents, information, the fee and how to pay it, whether they need UAE PASS, whether they can act for someone else), how long the form takes, how long the decision takes, and how long inactivity can last before unsaved answers are lost. Fees and timings follow the [style guide](#cnt-style).
5. The start button: "Start now" / «البدء الآن» (a verbal noun, not the imperative «ابدأ الآن»).
6. Other ways to apply, and help ([16.17](#pat-help)).
7. The owning entity, as text, and channel chips for other channels that list the service.
8. The date the content was last reviewed.

- **TPL-04.** Every fact on the page MUST come from the canonical record ([SVC-15](#service-record)). Prerequisites MUST NOT appear for the first time later in the journey.
- **TPL-05.** If the service is temporarily closed, the page MUST stay up, say so in a warning callout at the top, and give the alternative route and the next confirmed update, if there is one.

### <a id="tpl-question"></a>15.3 Question page

- **TPL-06.** Each question page SHOULD ask one question. Related professional fields MAY be grouped on one page when research shows it helps.
- **TPL-07.** When the page asks one question, the question MUST be the page heading (the field's label or legend becomes the `<h1>`). Otherwise the page MUST have its own `<h1>` and each field a visible label.
- **TPL-08.** Content MUST be in this order: back link (in the app bar); the stepper, for linear journeys only, above `<main>`; then, inside `<main>`, the error summary when there are errors, the heading, any short explanation, the field or fields, and the "Continue" / «متابعة» button. A "Save and finish later" secondary button follows it where saving is offered ([16.9](#pat-save)).
- **TPL-09.** The page MUST use the reading width ([LANG-33](#lang-type)).

### <a id="tpl-check"></a>15.4 Check answers page

- **TPL-10.** Before any submission, declaration or payment, the service MUST show every answer in a summary list, grouped under headings that match the journey's sections, with a "Change" link for each answer the user can change. The hidden text after "Change" names the answer, so screen readers hear "Change plate number".
- **TPL-11.** Following "Change" MUST return to the question with the answer filled in, then back to this page, through any new questions the change makes necessary.
- **TPL-12.** The page MUST show the amount to pay, if any, and any declaration in plain language, then one button that says what it does: "Submit application" / «إرسال الطلب» or "Continue to payment" / «المتابعة إلى الدفع».
- **TPL-13.** Optional questions the user skipped MUST show "Not provided" / «لم يتم تقديمه», not an empty value.

### <a id="tpl-confirmation"></a>15.5 Confirmation page

- **TPL-14.** The confirmation page MUST appear only after the server confirms what it reports.
- **TPL-15.** Content MUST be in this order: a panel with what happened ("Application received" / «تم استلام الطلب») and the reference number, isolated; what happens next and who does it; how long it should take, if confirmed; how to track progress; what to do if nothing happens; how to get a receipt; and help.
- **TPL-16.** The heading MUST say exactly what happened: "Received" when processing continues; "Registration renewed" / «تم تجديد ترخيص المركبة» only when the outcome is delivered. A payment confirmation MUST NOT say or imply the application is approved.
- **TPL-17.** Reloading the page or pressing Back MUST NOT submit or pay again; it shows the same confirmation or the tracking page.
- **TPL-18.** The confirmation MUST be available as an HTML page in the user's account or tracking page. A PDF receipt MAY be offered as well, not instead, and follows [A11Y-21](#a11y-more).

### <a id="tpl-task-list"></a>15.6 Task list page

- **TPL-19.** A task list SHOULD be used only when a service has several sections that can be completed in any order or over several sessions. Each task MUST be a link with its status from the [status vocabulary](#status-vocabulary); a task that cannot start yet is text, with the task it depends on named next to it.
- **TPL-20.** The page heading MUST say what the list is for ("Apply for a building permit"), with a summary such as "You have completed 3 of 6 sections" / «تم إكمال 3 من 6 أقسام». Check answers becomes available when every required task is completed.

### <a id="tpl-errors"></a>15.7 Error pages

| Page | Heading (EN / AR) | Must contain |
| --- | --- | --- |
| Page not found (404) | Page not found / الصفحة غير موجودة | "If you typed the web address, check it is correct." A link to the channel's search and home page. Help contact. Never a stack trace or code |
| There is a problem with the service (500) | Sorry, there is a problem with the service / نعتذر، توجد مشكلة في الخدمة | Whether answers were saved. When to try again, without inventing a time. Other ways to complete the task. Help contact |
| Service unavailable (503, planned or not) | Sorry, the service is unavailable / نعتذر، الخدمة غير متاحة حاليًا | When it will be available, only if confirmed. What happens to saved answers. Other routes. The same page is used by every channel listing the service |
| No permission | You cannot view this page / لا يمكنك عرض هذه الصفحة | Why in general terms, without revealing whether a record exists. How to switch account or represented organisation. Help contact |

- **TPL-21.** Error pages MUST use the page shell, return the matching HTTP status, contain what the table lists, and be available in both languages.

### <a id="tpl-other"></a>15.8 Cookies, privacy and accessibility pages

The cookies page is defined in [8.4](#prv-cookies), the privacy notice in [8.2](#prv-notice) and the accessibility statement in [7.6](#a11y-statement). Each uses the page shell and the reading width.

### <a id="tpl-chrome"></a>15.9 Channel-site chrome

Channel pages outside a transaction (a channel's home, topic and section pages, search results and the signed-in account area) share one set of chrome. It is the same on every channel; only the channel colours change. Transaction pages keep the shell in [15.1](#tpl-shell). The design values are in the [Design System reference](design-system-reference.md#chrome).

- **CHR-01. Header.** The channel-site header MUST be a `<header>` landmark holding, from the start edge: the Government of Dubai lockup; the main navigation, a `<nav>` labelled "Main" / «رئيسية»; search; the language switch; sign in with the official UAE PASS button ([CMP-11](#cmp)), or the account menu once signed in; and the channel's logo and the channel switcher at the end edge. The current navigation item MUST carry `aria-current="page"` and a non-weight cue ([A11Y-06](#a11y-beyond)). The full row MUST NOT wrap or clip; where it does not fit, the header MUST use the compact row ([CHR-04](#tpl-chrome)).
- **CHR-02. Lockup.** The Government of Dubai lockup MUST appear at the start edge of every channel-site header, identical on every channel, with the text alternative "Government of Dubai" / «حكومة دبي». It MUST be used only as the usage manual under Law No. (1) of 2025 sets out ([12](#legal)): never recoloured, cropped, converted or mirrored, and with no entity logo beside it or in its place ([SVC-02](#svc-theme)). It MUST NOT be published until the initiative has that manual and any authorisation that applies ([OQ-30](#open-questions)).
- **CHR-03. Channel switcher.** The channel switcher MUST be a disclosure, not an ARIA menu: a button with `aria-expanded`, whose accessible name includes the current channel ("Choose a channel: Dubai Transport"), opening a non-modal panel. The panel MUST list all seven channels as links in the order of [5.1](#svc-channels), each with its name and a one-line descriptor in the page language, leading to that channel's home page in the current language. The current channel MUST carry a check and `aria-current="true"`. Escape and a click outside MUST close the panel, Escape MUST return focus to the button, and the panel MUST close when focus leaves it.
- **CHR-04. Compact header.** Below 1024px, and whenever the full row does not fit, the header row MUST keep the menu button, the lockup, the language switch and the channel switcher (which MAY shrink to the channel's logo, keeping its accessible name). Navigation, search and sign in (or the account menu) MUST move into the mobile menu: a modal dialog labelled by its title, with focus on its close button when it opens, Escape closing it and returning focus to the menu button, and the page behind it inert. The menu button MUST have `aria-expanded`.
- **CHR-05. Utility bar.** Where a channel site offers a utility bar (help and feedback links such as the Happiness Meter / «مؤشر السعادة», the call centre, chat / «المحادثة» and accessibility options), from 1024px it MUST be a flat bar docked to the bottom edge across the full width, a `<nav>` labelled "Help and feedback" / «المساعدة والملاحظات». Every item MUST keep a visible text label beside its icon. The page MUST reserve the bar's height so it never covers content or the focused element, and the bar MUST become static at the end of the page below a viewport height of 600px ([A11Y-15](#a11y-beyond)). Below 1024px it MUST fold into the footer as a "Help and feedback" group. It MUST be present when the page loads and MUST NOT animate.
- **CHR-06. Footer.** Channel-site pages MUST use the grouped footer: the channel's brand group; a Channels group listing all seven channels as links in the order of [5.1](#svc-channels); and the "Helpful information" / «معلومات مفيدة» and "Legal" / «المعلومات القانونية» groups, which together carry every required link ([LEG-01](#legal), [TPL-01](#tpl-shell)). Each group MUST have an `<h2>` heading. In the Channels group the current channel MUST carry `aria-current="true"` and a non-weight cue ([A11Y-06](#a11y-beyond)). Apart from the Channels group, the footer MUST hold only the required links, about, help and contact, the sitemap and the channel's own description.
- **CHR-07. Hero.** The hero of a channel's home or section page MUST be a flat band in the channel's subtle colour, with no gradient, wash, shadow or image behind text. It MUST hold, in order: breadcrumbs on inner pages, an optional eyebrow, the `<h1>`, search, and optionally a row of suggestion chips.
- **CHR-08. Channel network strip.** A channel's home page SHOULD end with the channel network strip, after the last content band and before the footer, in the same place on every channel. It MUST list all seven channels in the order of [5.1](#svc-channels); the current channel's tile MUST be text, not a link, say "You are here" and carry `aria-current="true"`. The strip MUST be a `<nav>` labelled "Government of Dubai channels".
- **CHR-09. Announcements.** A site-wide announcement (planned maintenance, an outage, a change people need to know about) MUST appear after the skip link and before the header, as a region labelled "Announcement", present when the page loads, and not a live region or an alert. If it can be dismissed, its 44 × 44 dismiss button MUST be named and focus MUST move to the next element after the bar; the choice MAY be remembered for the rest of the session ([PRV-12](#prv-cookies)). A message about one page or one person's task is not an announcement.
- **CHR-10. Signed-in navigation.** The signed-in account area MUST use the account navigation for its own navigation, and below 1024px the bottom navigation as the primary navigation, with three to five destinations, docked to the bottom edge with targets of at least 44px. The page MUST reserve the bottom navigation's height so it never covers content or the focused element. Its current item MUST have a Filled icon, an indicator and `aria-current="page"`.
- **CHR-11. Promotion slots.** Channels whose purpose includes promotion (Visit Dubai, Invest in Dubai, and any channel whose owner records promotion as part of its purpose) MAY carry campaign content, promotional language and photography in promotion slots: content bands on channel home, topic and section pages, between the hero and the channel network strip. Promotional content MUST NOT appear in the fixed chrome (announcement bar, header, hero, utility bar, footer), on service detail pages, in transactions or in notifications. It MUST meet the accessibility, parity ([LANG-01](#lang-parity)) and honesty ([CNT-03](#cnt-voice)) rules, MUST NOT contain images of text, and MUST NOT look like a service action or a status.
- **CHR-12. Official banner.** Every page, on channel sites and in transactions, MUST start with the official banner, before the announcement and the header: a region labelled "Official website of the Government of Dubai" / «موقع رسمي لحكومة دبي» that says "An official website of the Government of Dubai" / «موقع إلكتروني رسمي لحكومة دبي». A native `<details>` disclosure, "How to check" / «طريقة التحقق», MUST explain how to tell an official website (its web address, [OQ-40](#open-questions)) and a secure one (HTTPS). It MUST work without JavaScript, MUST NOT animate its height, and is the same on every channel and in both themes. An emblem beside the statement MAY be used only under [CHR-02](#tpl-chrome)'s conditions. It is a statement of identity, never a place for messages or promotion.
- **CHR-13. Environment banner.** Every build that is not the live service (development, QA, user acceptance testing, staging, training) MUST show the environment banner first on every page, above the official banner: a region labelled "Test version" / «نسخة تجريبية» that names the environment and says it is not the live service, and SHOULD tell people not to enter real personal or payment details. It MUST be switched on by the environment's configuration, never by page code, and MUST NOT appear in production. It MUST NOT be dismissible, sticky or animated. A build reference MAY follow the message, isolated left to right ([LANG-20](#lang-numerals)).

**How we check.** Each template's content order, single `<h1>`, title and footer links; a double submit and a reload of the confirmation page; the 404 page in both languages; and, on channel sites, the header, lockup, switcher, mobile menu, utility bar, footer, hero, network strip, announcements, signed-in navigation and promotion slots; on every page, the official banner and, outside production, the environment banner ([handbook 6.9](assurance-handbook.md#check-templates)).

---

## <a id="patterns"></a>16. Journey patterns

Each pattern gives when to use it, the rules, the recovery states the service must handle, the components it uses and an example in both languages. Language switching during a journey is covered in [6.2](#lang-switching); privacy choices in [8](#privacy).

### <a id="pat-find"></a>16.1 Find a service

**Use when** people know their goal but not which entity or channel owns it. Search, topic categories and life or business events lead to the same service records, and results lead to the service detail page ([15.2](#tpl-start)) before any sign-in.

- **FIND-01.** Every channel home page MUST offer search and topic browsing. Search MUST work in both languages, accept synonyms, spelling variants and former names from the record, and work without choosing an autocomplete suggestion.
- **FIND-02.** Results MUST show the query, the number of results, the applied filters and a way to clear each one. Query and filters MUST be in the URL, so Back, refresh and sharing keep them.
- **FIND-03.** A search with no results MUST repeat the query, suggest corrections or broader terms, and offer browsing and help. It MUST NOT be shown when the search itself failed.
- **FIND-04.** Result counts that change without a page load MUST be announced in a polite status region.

**Recovery states.** *Search is unavailable:* keep the query, say search is not working, and offer topic browsing.

**Components:** `sc-channel-hero`, `sc-search`, `sc-service-card`, `sc-tile`, `sc-step-list`, `sc-filter-chips`, `sc-pagination`, `sc-empty-state`; planned `sc-filter`. **Example:** Results for "renew car" (2) / نتائج البحث عن «تجديد السيارة» (2).

### <a id="pat-eligibility"></a>16.2 Check eligibility

**Use when** conditions can stop an application or change its route, documents or cost.

- **ELIG-01.** Services SHOULD offer the check from the service detail page, before sign-in, when it does not need protected records, and MUST say whether the result is a guide or a decision.
- **ELIG-02.** The check SHOULD ask only the questions needed, starting with the one most likely to rule people out.
- **ELIG-03.** An ineligible result MUST be an outcome page that names the condition and offers the right alternative, review route or help. It MUST NOT be a validation error.
- **ELIG-04.** "I do not know" MUST have a supported route. A failed verification MUST NOT be reported as ineligibility.
- **ELIG-05.** Answers MUST be carried into the application, not asked again.

**Recovery states.** *Verification cannot complete:* keep the answers; offer to try again or an assisted review.

**Components:** `sc-radio-group`, `sc-button`, `sc-callout`. **Example:** You may need a different service / «قد تكون هناك خدمة أنسب لطلبك».

### <a id="pat-multi-step"></a>16.3 Navigate a multi-step service

- **NAV-01.** Every step except the first MUST have a back link to the previous step. Browser Back MUST also work and MUST NOT lose answers or repeat a submission or payment.
- **NAV-02.** Linear journeys of 2 to about 7 question pages SHOULD show the stepper, counting question pages only. Branching or long journeys MUST NOT show a step count or percentage that could be wrong; use a task list ([15.6](#tpl-task-list)) where sections are independent.
- **NAV-03.** The service name MUST stay visible in the page title, and the `<h1>` MUST name the step.
- **NAV-04.** When a requirement changes after a section was completed, only the affected tasks MUST change status, with an explanation; other answers stay.

**Components:** `sc-back-link`, `sc-step-progress`, `sc-app-bar`; planned `sc-task-list`. **Example:** Step 2 of 4: Plate number / الخطوة 2 من 4: رقم اللوحة.

### <a id="pat-sign-in"></a>16.4 Sign in with UAE PASS

**Use when** the task needs a verified identity, protected records, a saved application or a binding submission. UAE PASS is the only identity route ([OQ-3](#open-questions)).

- **ID-01.** Sign-in MUST be deferred until the task needs it. The service detail page and eligibility check MUST NOT require it.
- **ID-02.** Services MUST authenticate through the official UAE PASS integration, using the official UAE PASS button and the provider's own wording in both languages ([CMP-11](#cmp)). They MUST NOT create their own passwords or accounts to replace it, imitate its screens, or collect its credentials.
- **ID-03.** Before the handoff, the page MUST explain why sign-in is needed and what information the service will receive.
- **ID-04.** The service MUST return the user to the same step, in the same language, with their draft, after success. It MUST validate the response on the server.
- **ID-05.** Services MUST NOT treat sign-in as proof that someone may act for another person ([16.5](#pat-represent)) or is eligible.
- **ID-06.** When the account lacks an attribute the service needs (for example, some visitor accounts), the service MUST explain which and what the user can do.
- **ID-07.** Steps the service owns around sign-in MUST allow paste and password managers and MUST NOT add memory tests or object-recognition tests (WCAG 3.3.8 and AAA 3.3.9). The whole sign-in journey, including provider pages, is part of the accessibility assessment.
- **ID-08.** The service MUST support the provider's app-to-app and browser return routes, including returning to an app that was in the background ([PLAT-03](#plat-rules)).

**Recovery states.** *User cancelled:* back on the same step: "You did not sign in" / «لم يتم تسجيل الدخول», with "Try again" and help. *Request expired or refused:* explain which, keep the draft, offer a new request. *UAE PASS unavailable or app missing:* say so, keep the draft, offer the routes the integration supports and help. Never bypass identity checks.

**Components:** the official UAE PASS button ([CMP-11](#cmp)); `sc-callout`.

### <a id="pat-represent"></a>16.5 Act for an organisation or another person

**Use when** a lawyer, employee, company representative or other authorised person acts for someone else (common on Dubai Justice, Build in Dubai, Invest in Dubai and Dubai Trade).

- **REP-01.** After sign-in and before loading protected records, the service MUST ask who the user is acting for: themselves, an organisation or another person, showing only the options in scope.
- **REP-02.** Service owners MUST define what proves authority, its scope, its expiry and how it is revoked. The server MUST check it for every protected action.
- **REP-03.** The selected context MUST stay visible on every page and be repeated on check answers, payment and confirmation. Switching context MUST be explicit, and drafts, documents, searches and notifications MUST be kept separate per context.
- **REP-04.** Users MUST NOT be asked to use or share someone else's credentials.

**Recovery states.** *Authority missing, insufficient or expired:* say what authority is needed and how to get it, without revealing protected information; keep the draft; offer the user's other contexts.

**Components:** `sc-radio-group` or `sc-select`, `sc-callout`, `sc-summary-list`. **Example:** Who is this application for? / «لمن هذا الطلب؟», with the options "Myself" / «لنفسي», "An organisation" / «لمنشأة» and "Someone else" / «لشخص آخر».

### <a id="pat-questions"></a>16.6 Answer questions and fix errors

- **Q-01.** Labels MUST always be visible; placeholder text MUST NOT be used for labels or instructions. Related radios and checkboxes MUST be grouped with a legend.
- **Q-02.** Only optional fields MUST be marked, with "(optional)" / «(اختياري)».
- **Q-03.** Validation MUST run on the server when the user continues. Client-side checks MAY help but MUST NOT be the only check, and MUST NOT show errors while the user is still typing.
- **Q-04.** When validation fails, answers MUST be kept, the title MUST change ([TPL-02](#tpl-shell)), the error summary MUST list every error and take focus ([CMP-05](#cmp)), and each field MUST show its own message using the [templates](#cnt-errors).
- **Q-05.** Choosing an option MUST NOT submit the form or move the user elsewhere. Questions revealed by an answer MUST appear directly after it in reading and focus order.
- **Q-06.** Information the user has already given in the journey MUST be pre-filled or offered for selection (WCAG 3.3.7).

**Recovery states.** *Submission interrupted:* keep the answers, say the page did not send, and offer to try again.

**Components:** every field component, `sc-error-summary`, `sc-button`. **Example:** Enter your email address / يُرجى إدخال البريد الإلكتروني.

### <a id="pat-upload"></a>16.7 Upload documents

**Use when** evidence is needed and cannot be fetched from another government system.

- **UP-01.** Before the user chooses a file, the page MUST state what the document is for, acceptable alternatives, accepted file types and the maximum size.
- **UP-02.** Upload MUST work with a native file picker by keyboard, click and tap. Drag and drop MAY be offered as well, never alone. Taking a photo MAY be offered on phones.
- **UP-03.** Each file MUST show its name, size and state: uploading, checking, accepted, or rejected with the reason. "Uploaded" (transfer finished), "accepted" (passed the server's checks) and "approved" (accepted by the entity as evidence) MUST be shown as different states.
- **UP-04.** A failed file MUST NOT remove files already accepted. Each file MUST be removable or replaceable, and the remove button MUST name the file.
- **UP-05.** Accepted files MUST be kept in the draft and on check answers, and MUST NOT be requested again later in the journey.
- **UP-06.** Progress milestones and errors MUST be announced politely; individual percentages MUST NOT be.

**Recovery states.** *Connection lost during upload:* keep accepted files, name the file that did not finish, offer to retry it. *File rejected by a security check:* name the file and ask for another, without describing the check.

**Components:** planned `sc-file-upload`; `sc-callout`, `sc-button`. **Example:** Upload your insurance certificate / إرفاق شهادة التأمين.

### <a id="pat-add-another"></a>16.8 Add another item

**Use when** a service needs a variable number of people, vehicles, properties or shipment items.

- **ADD-01.** The service MUST state any limit before the first item, collect one item at a time, then show a summary list in which each item is named by its own details ("Nissan Patrol, Dubai A 48213"), not "Item 1".
- **ADD-02.** Each item MUST have "Change" and "Remove" links that name it. Removing an item that other answers depend on MUST explain the effect first.
- **ADD-03.** After adding or removing, focus MUST move to the summary heading and the change MUST be announced.
- **ADD-04.** Reordering, where it matters, MUST work with buttons, never by dragging alone.
- **ADD-05.** Large professional datasets MAY offer a bulk upload with errors reported per row, as long as single entry still works.

**Components:** `sc-summary-list`, `sc-radio-group` ("Do you need to add another vehicle?"), `sc-button`. **Example:** Add another property / إضافة عقار آخر.

### <a id="pat-save"></a>16.9 Save and return

- **SAVE-01.** The service MUST say whether saving is automatic or by choice, how to come back, when a draft is deleted, and, before the user starts, how long inactivity can last before unsaved answers are lost (AAA 2.2.6).
- **SAVE-02.** "Saved" MUST NOT be shown until the server confirms it.
- **SAVE-03.** Returning to a draft MUST re-establish identity and authority before showing anything ([16.4](#pat-sign-in), [16.5](#pat-represent)). A link alone MUST NOT give access.
- **SAVE-04.** On return, the service MUST show the service name, the represented context, when it was last saved and what is left, and resume at a useful step.
- **SAVE-05.** Drafts MUST NOT put personal information in URLs, page titles or email links.

**Recovery states.** *Save failed:* say what is and is not saved; keep the session; offer to retry. *Draft expired:* say so and offer to start again with anything still valid.

**Components:** `sc-button variant="secondary"` ("Save and finish later" / «حفظ والمتابعة لاحقًا»), `sc-callout`.

### <a id="pat-timeout"></a>16.10 Session timeout

- **TIME-01.** Where a service has an inactivity time limit, it MUST meet WCAG 2.2.1: the user can turn the limit off or adjust it beforehand, or is warned before it ends and given at least 20 seconds to extend it with a simple action, at least ten times. A security reason is not in itself an exception.
- **TIME-02.** The warning MUST be a modal alert dialog with focus moved into it, a heading ("You will be signed out soon" / «ستنتهي الجلسة قريبًا»), the time remaining as text, "Stay signed in" / «تمديد الجلسة» and "Sign out" / «تسجيل الخروج». It MUST appear at least 2 minutes before expiry. Its message and the time left MUST be announced when it opens, and it MUST NOT read a countdown aloud every second. Pressing Escape, or any way of closing it other than "Sign out", MUST keep the user signed in; it MUST NOT be dismissed by dragging or by tapping outside it. Activity in one tab SHOULD extend the session in the others.
- **TIME-03.** Extending MUST NOT lose the current answers or errors. Expiry MUST NOT submit or pay.
- **TIME-04.** At expiry, protected information MUST be hidden and permitted progress saved, and the user MUST be able to sign in again and return to the same step, with authority checked again (AAA 2.2.5).
- **TIME-05.** The default inactivity time and how it relates to the UAE PASS session MUST be set with the security owner ([OQ-18](#open-questions)).

**Components:** `sc-modal` with `alert` and `countdown`; `sc-button`.

### <a id="pat-submit"></a>16.11 Check answers and submit

The page is defined in [15.4](#tpl-check). In addition:

- **SUB-01.** Changing an answer MUST recalculate eligibility, requirements and fees, and explain anything new.
- **SUB-02.** Declarations MUST be in plain language and never pre-ticked. Optional choices (such as reminders) MUST be separate from required declarations.
- **SUB-03.** The final action MUST be protected against duplicates on the server, using one transaction identifier per submission. Disabling the button is not protection.
- **SUB-04.** If the response is lost, the service MUST check for the existing submission before allowing another.

**Recovery states.** *Response lost:* "We are checking whether your application was sent" / «جارٍ التحقق من إرسال طلبك», then the real result.

### <a id="pat-pay"></a>16.12 Pay with Dubai Pay

**Use when** a service takes a fee, deposit or other payment. Dubai Pay is the only payment route.

- **PAY-01.** Before the handoff, the service MUST show the amount, what it is for, a breakdown where there is more than one fee, who is paying (the represented context), and the refund conditions.
- **PAY-02.** Payment MUST go through the official Dubai Pay integration and its assets. Services MUST NOT build their own card form or store card details, and MUST NOT log payment details, identity tokens or evidence in analytics or diagnostics.
- **PAY-03.** The service MUST create one server-side payment request per application and amount, with an idempotent reference.
- **PAY-04.** On return, the result MUST be confirmed server to server, not from browser parameters. Statuses follow the [status vocabulary](#status-vocabulary).
- **PAY-05.** While a payment is "Checking payment", the service MUST NOT offer to pay again. It MUST offer "Check payment status" / «التحقق من حالة الدفع» and help.
- **PAY-06.** Repeated taps, refreshes, duplicate callbacks and several open tabs MUST NOT charge twice.
- **PAY-07.** Payment success MUST NOT be presented as approval ([CNT-19](#status-vocabulary)). Success MUST produce a receipt the user can get again later.
- **PAY-08.** The service MUST state only payment methods, timings and refund conditions confirmed for the actual integration ([OQ-4](#open-questions)).

**Recovery states.** *Payment failed:* "Your payment did not go through. No money has been taken." / «لم تتم عملية الدفع. لم يتم خصم أي مبلغ.» Offer to try again once the server confirms the failure. *Payment cancelled:* say no money was taken; return to check answers. *Return lost, timeout or conflicting results:* keep the reference; show "Checking payment"; reconcile; never charge again while unknown.

**Components:** `sc-summary-list` (breakdown), `sc-button variant="handoff"` ("Pay with Dubai Pay", [CMP-10](#cmp)), `sc-callout`, `sc-status-tag`. **Example:** We are checking your payment / جارٍ التحقق من عملية الدفع.

### <a id="pat-confirmation"></a>16.13 Confirmation and receipts

The page is defined in [15.5](#tpl-confirmation). In addition:

- **CONF-01.** The reference MUST also be available in the user's account or tracking page; the service MUST NOT rely on an email or SMS arriving.
- **CONF-02.** Confirmation URLs and receipts MUST NOT expose personal data without sign-in.
- **CONF-03.** If the confirmation message cannot be delivered, the transaction MUST stand, and the page MUST say the message failed and how to get it.

**Example:** We have received your application / تم استلام طلبك.

### <a id="pat-track"></a>16.14 Track progress and respond

- **TRACK-01.** The tracking page MUST show the service, reference, represented context and current status from the [status vocabulary](#status-vocabulary), with the time it was last updated.
- **TRACK-02.** Past events and expected next steps MUST be shown separately. Percentages and completion dates MUST be shown only when they are real.
- **TRACK-03.** "Action needed" MUST say what is needed, why, how to respond and the deadline in Dubai time. A response MUST be confirmed as received without implying a decision.
- **TRACK-04.** "Not approved" MUST name the reasons that can be shared and the review or appeal route, with its deadline if confirmed.
- **TRACK-05.** Earlier requests and responses MUST stay visible in a history.
- **TRACK-06.** Access MUST be checked against the current identity and representation ([REP-02](#pat-represent)).

**Recovery states.** *Status source unavailable:* show the last known status with its time, labelled as such; offer to refresh and help.

**Components:** `sc-status-tag`, `sc-timeline`, `sc-attention-card`, `sc-summary-list`. **Example:** Action needed: upload a document / إجراء مطلوب: إرفاق مستند.

### <a id="pat-notifications"></a>16.15 Notifications

- **NOTE-01.** Essential service messages and optional messages MUST have separate settings. Optional messages MUST be off until the user chooses them.
- **NOTE-02.** Every message MUST name the service and give one next action. It MUST NOT include case details, amounts owed by a named person or other sensitive information on a lock screen or in SMS.
- **NOTE-03.** Links in messages MUST go to the channel's own domain and require sign-in before showing protected information. Messages MUST NOT ask for credentials, codes or card details.
- **NOTE-04.** Messages MUST be sent in the user's chosen language. Left-to-right values in Arabic messages MUST be isolated with Unicode isolates ([LANG-15](#lang-bidi)).
- **NOTE-05.** Arabic SMS SHOULD fit in a single message. Arabic SMS uses UCS-2 encoding: 70 characters fit in a single message, and 67 per segment once a message is split.
- **NOTE-06.** Delivery status MUST be recorded separately from application status.

**Components:** in the account area, `sc-notification-list` and the unread count in `sc-account-menu`. **Example (SMS):** "Dubai Transport: your vehicle registration has been renewed. Reference R-2026-55120. Details: {link}". The Arabic message carries the reference between U+2066 and U+2069.

### <a id="pat-appointments"></a>16.16 Book or change an appointment

- **APPT-01.** The user SHOULD choose the location or format first, then see only compatible slots.
- **APPT-02.** Slots MUST be listed with full dates and times in Dubai time. A calendar MUST NOT be the only way to choose a date: a list of available dates or a typed date works too.
- **APPT-03.** A slot MUST be booked only when the server confirms it. A temporary hold with a time limit MUST meet WCAG 2.2.1 ([TIME-01](#pat-timeout)).
- **APPT-04.** Rescheduling MUST keep the old slot until the new one is confirmed.

**Recovery states.** *Slot taken:* keep the other choices, say the slot was taken, show current alternatives.

**Example:** All times are in Dubai time / جميع المواعيد بتوقيت دبي.

### <a id="pat-help"></a>16.17 Get help and assisted service

- **HELP-01. Consistent help.** A channel site and every transaction reached from it are one set of pages (WCAG 3.2.6). On every page of the set, the help mechanisms the service offers (contact details, a contact route such as chat, self-help pages and any automated assistant) MUST appear in the same relative order: in the utility bar and footer on channel pages, and in the footer on transaction pages, which MUST carry the same contact details and chat link as the utility bar.
- **HELP-06. Help in context.** Services SHOULD give help next to questions that people find difficult (AAA 3.3.5).
- **HELP-02.** At least one help route MUST NOT need speech, and at least one MUST NOT need written English. Essential help MUST NOT exist only in a tooltip, a chatbot or a PDF.
- **HELP-03.** Help pages MUST give only contact routes, hours and response times confirmed by the owner.
- **HELP-04.** Opening help MUST NOT lose the user's progress.
- **HELP-05.** Assisted staff MUST see the same status and reference as the user, check authority before acting, record what they did, and never ask for UAE PASS credentials, codes or card details.

**Example:** Get help with this service / الحصول على المساعدة بشأن هذه الخدمة.

### <a id="pat-failure"></a>16.18 Recover from failures and poor connectivity

Failures are of five kinds, each with its own response: a validation error ([16.6](#pat-questions)), no permission, a missing page, a service problem or outage ([15.7](#tpl-errors)), and an uncertain transaction ([SUB-04](#pat-submit), [PAY-05](#pat-pay)).

- **FAIL-01.** A failure message MUST say what failed in terms of the task, whether anything was saved or may have gone through, and the safest next step.
- **FAIL-02.** Entered values MUST survive a recoverable failure.
- **FAIL-03.** Automatic retries MUST be limited and visible, and are allowed for consequential requests only with server-side duplicate protection.
- **FAIL-04.** Offline working MUST NOT be promised unless it is built. Apps that queue actions offline MUST show what is queued and confirm each action when it is sent.
- **FAIL-05.** After a long interruption, the service MUST check the session and draft again and ask before applying any consequential action.

**Example:** We could not save your changes / تعذّر حفظ التغييرات.

### <a id="pat-quick-exit"></a>16.19 Leave a sensitive service quickly

**Use when** research shows that people using the service may be at risk if someone sees what they are doing.

- **EXIT-01.** A visible "Leave this page" / «مغادرة هذه الصفحة» control MUST appear on every page of the sensitive journey and go immediately to a neutral page, without confirmation.
- **EXIT-02.** It MUST work with keyboard, touch and assistive technology. A keyboard shortcut MAY be added but MUST NOT be the only way and MUST follow [A11Y-18](#a11y-more).
- **EXIT-03.** The service MUST explain, before sensitive content, what the control does and what it cannot do: it cannot erase browser history, device records or screenshots.
- **EXIT-04.** The service owner MUST decide whether leaving signs out, saves or discards the draft, and the service MUST say which.

**Components:** planned `sc-exit-page`.

### <a id="pat-data-tables"></a>16.20 Professional data tables and bulk actions

`sc-table` defines the table itself: caption, column types, sorting, selection, responsive behaviour and states. In addition:

- **DATA-01.** The workspace MUST show the active organisation, the filters in force and the scope of the data.
- **DATA-02.** Opening a record and returning MUST keep the table's position, sort and filters.
- **DATA-03.** Selection MUST distinguish "selected on this page" from "all matching records".
- **DATA-04.** Before a bulk action, the user MUST see how many records it affects, its consequences and which records cannot be processed. Afterwards, the result MUST be reported per record, and only failed records offered for retry.
- **DATA-05.** Exports MUST respect filters, permissions and the represented context.

**Example:** 3 applications selected / تم تحديد 3 طلبات.

### <a id="pat-cross-channel"></a>16.21 Continue across channels and entities

- **XCH-01.** Before a handoff, the page MUST say where the user is going, why, and whether it continues the same application or starts another, with any new fee or sign-in.
- **XCH-02.** The handoff MUST carry a stable journey reference, the language and the represented context. Personal data, tokens and case content MUST NOT travel in URLs. The receiving service MUST check identity, authority and consent itself.
- **XCH-03.** Information already given in the journey MUST be reused across the handoff (WCAG 3.3.7) wherever a lawful basis and an agreed data-sharing arrangement exist. Where they do not, the receiving service MUST explain why it asks again.
- **XCH-04.** The user MUST be able to see which organisation owns each outstanding action, and a referral MUST be shown as complete only when the receiving service confirms it.

**Recovery states.** *Destination unavailable or return lost:* keep the draft and the referral reference; give a resume link and a way to check the other service.

**Example:** Continue to Dubai Justice to pay the court fee / المتابعة إلى دبي للعدالة لدفع رسوم المحكمة.

**How we check.** Test evidence for every recovery state of each pattern used, in both languages; for high-risk services, the panel repeats the duplicate submission and payment tests ([handbook 6.10](assurance-handbook.md#check-patterns)).

---

## <a id="plat"></a>17. Platforms

The channel apps are built with Flutter and React Native. Web components cannot run inside either, so each framework will get its own component kit that implements the same specifications. Which platform uses what, and what is available now, is in the [Design System reference](design-system-reference.md#conventions). Which channels use which framework is [OQ-17](#open-questions).

### <a id="plat-rules"></a>17.1 Rules for every platform

- **PLAT-01.** Where web and native versions of a service exist, the team MUST publish which tasks each supports. A critical task that is not available on one platform MUST offer a working route on another, with the user's progress kept.
- **PLAT-02.** Responsive web MUST keep every task, piece of content, error and help route at every width from 320 CSS px, in both orientations. Required content MUST NOT depend on hover.
- **PLAT-03.** Service context and safe draft state MUST survive app links, returning from a browser, moving the app to the background and back, and permission prompts. An app link opened without the app installed MUST lead to a working web page, not an error.
- **PLAT-04.** A native screen MAY follow platform navigation conventions (for example a native back gesture or a bottom sheet) where research shows they help, as long as the task names, status vocabulary, content and outcomes are the same as on the web.

### <a id="plat-native"></a>17.2 Native teams before the kits exist

- **PLAT-05.** Native teams MUST implement against the component specifications and readmes, not against screenshots.
- **PLAT-06.** SwiftUI and Compose code MUST use the generated tokens. A Flutter or React Native team that must ship before generated tokens exist for its framework MUST take values from the token source, record the token version it copied, and record an exception, renewed under [ASR-02](#assurance) until the generated output is published.

### <a id="plat-parity"></a>17.3 Parity for native components

A native component, whether built by a service team today or in a kit later, is finished when it meets these rules:

- **PLAT-07.** It MUST use the same tokens: colour, type roles (Latin and Arabic scales), spacing, radii, elevation and motion, generated from the same source.
- **PLAT-08.** It MUST have the same behaviour and content: states, validation and error behaviour, wording in both languages and status vocabulary, as defined in the component's specification.
- **PLAT-09.** It MUST give the same accessibility outcomes through the platform's own accessibility layer: names, roles, values and states exposed; tested with VoiceOver and TalkBack; text that scales with the platform's text size; targets of at least 44 × 44 points on iOS and 48 × 48 dp on Android.
- **PLAT-10.** It MUST have the same Arabic behaviour: right-to-left layout through the framework's own support, mirroring as in [6.6](#lang-mirroring), Latin digits, isolated left-to-right values, the Arabic type scale, and the accessibility language set on mixed-language text so that Latin names are spoken correctly.
- **PLAT-11.** It MUST have the same theming: one channel per screen, set once and read by every component, in light and dark.
- **PLAT-12.** Native apps MUST NOT embed web components in a WebView to imitate native controls; a WebView is acceptable for a whole hybrid screen.
- **PLAT-13.** Native screens MUST NOT lock orientation unless it is essential, and MUST honour the platform's text size, bold text, reduce motion and increase contrast settings. They MUST be tested with Switch Control and Switch Access.

WCAG2ICT, the W3C guidance on applying WCAG to non-web software, is how [A11Y-01](#a11y-baseline) applies to the apps.

**How we check.** The platform capability matrix, the parity results for each native component the team built, and the main journey in the app with VoiceOver and TalkBack in Arabic ([handbook 6.11](assurance-handbook.md#check-platforms)).

---

## <a id="cmp"></a>18. What services must use

The shared design system gives every service the channel's look, Arabic and English typography, accessible components and the shared chrome. The [Design System reference](design-system-reference.md) holds its values and components; these are the rules a service is assessed on.

**Components**

- **CMP-01.** Where a shared component exists for a need, services MUST use it. They MUST NOT rebuild it, copy its code into a local version or restyle it beyond its documented parts.
- **CMP-02.** Services MUST load the library stylesheet once per page, by a link in the page head, and set the language, direction and channel once on the page root, normally through `sc-page`. They MUST NOT set colours on individual components.
- **CMP-03.** A service that needs something the library does not have MUST first check the planned components and talk to the design system team ([19](#contributing)). Anything built locally in the meantime MUST follow the component conventions and pass the same tests. A documented interim approach needs no exception ([ASR-14](#assurance)); anything else is recorded as one.
- **CMP-04.** Services MUST NOT add a separate `<label>` next to a shared field component: the field renders its own label, hint and error and links them.
- **CMP-07.** Forms MUST submit when the user presses Enter in a single-line field, through the form's default button, as native forms do. Services MUST NOT block implicit submission. Choosing an option still never submits ([Q-05](#pat-questions)).

**Behaviour the components carry, which services must not change**

- **CMP-05. Error summary.** When the page loads with errors, or errors are added after a submission, focus MUST move to the error summary, so screen readers read its heading ("There is a problem" / «توجد مشكلة») and the list. The summary MUST NOT also carry `role="alert"`. GOV.UK Frontend keeps an inner `role="alert"`; this standard drops it because focus already causes the announcement, and the alert role makes some screen readers announce it twice. Each item MUST link to its field.
- **CMP-06. Service card.** A service card's only link MUST be its title, inside the heading. The link's hit area MUST NOT be stretched over the whole card, and the card MUST NOT be wrapped in a link. Fees, eligibility and timings belong on the service detail page ([15.2](#tpl-start)), not on the card.
- **CMP-08. Links.** Links in running text MUST be underlined in every state, in the channel's action colour. Navigation links (header navigation, footer, breadcrumbs, cards, tiles, chips and the skip link) MAY underline on hover only, provided their position, a heading or an icon identifies them as links. Visited links are not styled differently. A link MUST NOT be styled as a button.
- **CMP-09. Stepper.** Completed and current steps MUST use the channel action colour, and completed steps MUST carry a check icon, so that completion does not depend on colour. The current step MUST carry `aria-current="step"`. Green is reserved for genuine success messages and MUST NOT mark completed steps.
- **CMP-10. Shared hand-offs.** Buttons that hand the user to a shared government service other than UAE PASS (pay with Dubai Pay, for example) MUST use the hand-off button, in city indigo on every channel, so they never look like a channel's own action. If Dubai Pay or another provider mandates its own button, that button MUST be used instead ([LEG-03](#legal), [OQ-4](#open-questions)).
- **CMP-11. UAE PASS.** "Sign in with UAE PASS", and any "confirm with UAE PASS", MUST use the official UAE PASS button exactly as the UAE PASS button guidelines set it ([OQ-3](#open-questions)). Services MUST NOT restyle it, recolour it to the channel or to city indigo, or replace its mark. The design system's placeholder for it is for prototypes and demonstration pages only, and MUST NOT appear on a production page.
- **CMP-12. Status tags.** A status tag MUST show a status from the [status vocabulary](#status-vocabulary) in a status tone. The channel-colour tag is a highlight that is not a status (for example "Life event") and MUST NOT be used for one. A label about another channel uses the channel chip, not a status tag.

**Foundations**

- **FND-01.** Services MUST take every colour, font, size, space, radius, shadow, duration and easing from the design system's tokens, in the output for their platform. Generated token files MUST NOT be edited by hand. Official third-party artwork (the Government of Dubai lockup, the UAE PASS button and Dubai Pay assets) keeps its own colours.
- **FND-02.** Service code MUST NOT contain colour literals or raw font sizes. Services SHOULD run an automated check for them.
- **FND-06.** Colour MUST NOT be the only way to convey meaning ([A11Y-06](#a11y-beyond)).
- **FND-09.** Services built on the design system MUST support the light and dark themes, and both MUST pass the same contrast checks and assessment. A live service in transition ([TRN-04](#transition)) SHOULD support both. Images and illustrations MUST be legible in both.
- **FND-10.** Services MUST use Dubai Font only. No entity, channel or service may introduce another typeface.
- **FND-22.** Icons MUST be decorative, with the words next to them carrying the meaning. An icon-only control MUST have an accessible name.
- **FND-23.** Images MUST NOT contain text. Photographs MUST show real Dubai settings and people, be relevant to the task and have a text alternative unless decorative.
- **FND-28.** English text MUST NOT be set smaller than 14px. The Arabic minimum is 16px ([LANG-27](#lang-type)).

Channel colours are set centrally in the token files. Services do not choose, add or adjust colours.

<a id="cmp-motion"></a>

**Motion**

- **MOT-02.** Actions started from the keyboard MUST NOT animate. They happen instantly.
- **MOT-14.** Motion MUST NOT block interaction. Content that moves, blinks or scrolls for more than five seconds MUST have a pause control (WCAG 2.2.2), and content MUST NOT flash more than three times a second (WCAG 2.3.1). Parallax and autoplaying background video MUST NOT be used.
- **MOT-15.** Under the reduced motion setting, movement MUST stop (no sliding, scaling or springing) and short opacity fades MAY stay, because they help people notice what changed (AAA 2.3.3). A spinner stops turning and its label is shown.

The design system's motion tokens set every timing and curve ([Design System reference](design-system-reference.md#motion)).

**How we check.** Shared components used where they exist; the stylesheet loaded once; Enter submits; links, steppers, hand-offs, UAE PASS and status tags as above; the service's literal check; both themes; and the service's own animations with the keyboard and with reduced motion ([handbook 6.12](assurance-handbook.md#check-design-system)). The design system team publishes evidence that the library itself meets the standard with each release.

---

## <a id="contributing"></a>19. Contributing and versioning

### 19.1 Proposing a new component or pattern

1. **Raise the need.** Describe the user need, the services that have it and the evidence, and check the planned components.
2. **Agree the approach** with the design system team, who check whether an existing component or pattern can meet the need.
3. **Design and research.** Design both languages, every state and the right-to-left behaviour; test with users.
4. **Build to the design system's recipe:** the files, strings in both languages, tests (axe in English and Arabic, light and dark; keyboard; form behaviour) and usage guidance.
5. **Review.** The design system team, an Arabic content designer and an accessibility specialist review it.
6. **Publish** with a changelog entry. Patterns are added to this standard in a minor version.

### 19.2 Versioning and deprecation

- **ASR-07.** The standard, the tokens and the component library MUST be versioned separately with semantic versioning: a major version breaks existing use, a minor version adds, a patch fixes.
- **ASR-08.** Each release MUST have a published changelog. A breaking change MUST include migration guidance.
- **ASR-09.** A component, property or token being removed MUST be marked deprecated for at least one minor release before removal, with the replacement named.
- **ASR-10.** Services MUST stay within the two most recent major versions of the library and tokens. Each major version MUST be supported for at least 18 months after the next one is released.

Major versions of this standard are consulted on before they are adopted.

---

## <a id="appendix-wcag"></a>Appendix A. WCAG 2.2 register

### <a id="appendix-wcag-aa"></a>A.1 Level A and AA

The 55 Level A and AA success criteria of WCAG 2.2. Criterion 4.1.1 Parsing is obsolete in WCAG 2.2 and is not listed; where a contract requires EN 301 549 version 3.2.1 or Section 508, it is recorded as supported ([Assurance handbook 11](assurance-handbook.md#contracts)).

For each criterion, the service records Pass, Fail, Not applicable (with the reason) or Not tested, with dated evidence and the browser, assistive technology, voice and version used. A percentage score does not establish conformance. Criterion names are W3C's own, in US spelling. "Covered by" names the requirements that deliver the criterion. The checks are prompts for the tester; the normative criteria and their exceptions are in WCAG 2.2 itself, linked from each name.

| Criterion | Level | Covered by | How to check |
| --- | --- | --- | --- |
| 1.1.1 [Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html) | A | FND-22, FND-23, CHR-02 | Review each image, icon, chart, canvas and image control in context; inspect names and long descriptions; charts have a text summary or data table |
| 1.2.1 [Audio-only and Video-only (Prerecorded)](https://www.w3.org/WAI/WCAG22/Understanding/audio-only-and-video-only-prerecorded.html) | A | A11Y-20 | Compare the alternative with all relevant sounds, visuals, sequence and interaction |
| 1.2.2 [Captions (Prerecorded)](https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded.html) | A | A11Y-20 | Check accuracy, synchronisation, completeness and caption availability in both languages |
| 1.2.3 [Audio Description or Media Alternative (Prerecorded)](https://www.w3.org/WAI/WCAG22/Understanding/audio-description-or-media-alternative-prerecorded.html) | A | A11Y-20 | Check that important visual information is available through description or the full alternative |
| 1.2.4 [Captions (Live)](https://www.w3.org/WAI/WCAG22/Understanding/captions-live.html) | AA | A11Y-20 | Test caption delivery during a live event, including speaker changes and meaningful sounds |
| 1.2.5 [Audio Description (Prerecorded)](https://www.w3.org/WAI/WCAG22/Understanding/audio-description-prerecorded.html) | AA | A11Y-20 | Listen without watching; identify visual information missing from the audio |
| 1.3.1 [Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) | A | CMP-04, Q-01, TPL-03, A11Y-21 | Inspect the accessibility tree and navigate headings, fields and table relationships |
| 1.3.2 [Meaningful Sequence](https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html) | A | LANG-14, Q-05 | Read in document order and compare with the intended meaning at each layout, in both directions |
| 1.3.3 [Sensory Characteristics](https://www.w3.org/WAI/WCAG22/Understanding/sensory-characteristics.html) | A | CNT-20 | Find instructions that refer to position, shape, size, colour or sound, in both languages |
| 1.3.4 [Orientation](https://www.w3.org/WAI/WCAG22/Understanding/orientation.html) | AA | PLAT-02, PLAT-13 | Rotate a real device and confirm information and controls remain usable, on the web and in the apps |
| 1.3.5 [Identify Input Purpose](https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html) | AA | ASK-04 | Inspect names, addresses, contact details, birth dates and credentials for correct purpose metadata |
| 1.4.1 [Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) | A | A11Y-06, FND-06, CMP-08, CMP-09 | Review errors, chart series, required fields, selected and current states, and links without relying on hue, in both languages |
| 1.4.2 [Audio Control](https://www.w3.org/WAI/WCAG22/Understanding/audio-control.html) | A | A11Y-20, MOT-14 | Load the page and confirm no audio plays automatically |
| 1.4.3 [Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) | AA | FND-01, FND-09 | Measure actual foreground and background pairs, including states and image backgrounds, in both themes |
| 1.4.4 [Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html) | AA | A11Y-10, PLAT-09 | Increase text or browser zoom to 200%; check clipping, overlap and control usability |
| 1.4.5 [Images of Text](https://www.w3.org/WAI/WCAG22/Understanding/images-of-text.html) | AA | FND-23, CHR-11 | Check headings, banners, promotional cards and text embedded in exported graphics |
| 1.4.10 [Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) | AA | PLAT-02, A11Y-15 | Test at 320 CSS px wide; content that scrolls horizontally at 256 CSS px tall; sticky bars at 1280 × 720 at 400% |
| 1.4.11 [Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) | AA | A11Y-05, FND-01 | Check input boundaries, checkmarks, focus indicators and meaningful graph lines |
| 1.4.12 [Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html) | AA | A11Y-10 | Apply the values together and inspect content, dialogs, controls and navigation. In Arabic, letter spacing is not used and is not tested |
| 1.4.13 [Content on Hover or Focus](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html) | AA | A11Y-16 | Open tooltips and submenus with pointer and keyboard; move onto them and dismiss them with Escape |
| 2.1.1 [Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html) | A | A11Y-10, UP-02, ADD-04 | Complete each task without a mouse, including editing, uploads and custom controls |
| 2.1.2 [No Keyboard Trap](https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html) | A | CHR-03, CHR-04, A11Y-19 | Enter and leave widgets, embedded content, editors and dialogs in both directions |
| 2.1.4 [Character Key Shortcuts](https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html) | A | A11Y-18, EXIT-02 | Try single-letter shortcuts while using speech input and when focus is elsewhere |
| 2.2.1 [Timing Adjustable](https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html) | A | TIME-01 to TIME-04, APPT-03 | Test the actual timeout and chosen compliance route; press Escape at the warning. "Security" is not an automatic exception |
| 2.2.2 [Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) | A | MOT-14, PERF-05 | Check carousels, tickers, animated backgrounds and refreshing dashboards |
| 2.3.1 [Three Flashes or Below Threshold](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html) | A | MOT-14 | Avoid flashing, or analyse against the defined thresholds |
| 2.4.1 [Bypass Blocks](https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html) | A | TPL-01 | Bypass repeated headers and navigation with the skip link and confirm the destination works |
| 2.4.2 [Page Titled](https://www.w3.org/WAI/WCAG22/Understanding/page-titled.html) | A | TPL-02 | Review browser-tab titles across routes, states and languages |
| 2.4.3 [Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html) | A | Q-05, CMP-05, CHR-03, CHR-04, CHR-09, ADD-03 | Tab and reverse-tab through the page, overlays and dynamically added controls |
| 2.4.4 [Link Purpose (In Context)](https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html) | A | TPL-10, CMP-06, style guide | Inspect repeated links such as "Change" or "View all" with their accessible names |
| 2.4.5 [Multiple Ways](https://www.w3.org/WAI/WCAG22/Understanding/multiple-ways.html) | AA | FIND-01 | Find representative pages that are not part of a process by two available methods |
| 2.4.6 [Headings and Labels](https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html) | AA | TPL-03, TPL-07, CNT-07 | Read headings and labels on their own and confirm their meaning |
| 2.4.7 [Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html) | AA | A11Y-05 | Follow focus through every control, including controls inside scroll containers |
| 2.4.11 [Focus Not Obscured (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html) | AA | A11Y-15, CHR-05, CHR-10, PRV-13, A11Y-19 | Test sticky headers, cookie banners, chat panels, docked bars and sticky table columns while tabbing and zooming |
| 2.5.1 [Pointer Gestures](https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html) | A | ASK-13, ADD-04 | Replace pinch, multipoint actions and required swiping paths with simple pointer actions |
| 2.5.2 [Pointer Cancellation](https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation.html) | A | A11Y-23 | Press, move away and release; nothing should fire |
| 2.5.3 [Label in Name](https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html) | A | A11Y-17 | Compare visible labels with computed accessible names in both languages, and try speech commands where available |
| 2.5.4 [Motion Actuation](https://www.w3.org/WAI/WCAG22/Understanding/motion-actuation.html) | A | Not used by the patterns | Test shake, tilt or camera-detected motion, if any, and their button alternatives |
| 2.5.7 [Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html) | AA | ASK-13, UP-02, ADD-04 | Reorder, move, resize or set a value through clicks and taps alone |
| 2.5.8 [Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) | AA | A11Y-04 | Measure hit areas, excluding any overlap between extended targets |
| 3.1.1 [Language of Page](https://www.w3.org/WAI/WCAG22/Understanding/language-of-page.html) | A | LANG-12 | Inspect the language declaration and listen with a suitable screen-reader voice |
| 3.1.2 [Language of Parts](https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts.html) | AA | LANG-12, LANG-16, CNT-14, PLAT-10 | Review multilingual passages, Latin names in Arabic text and the language switch label |
| 3.2.1 [On Focus](https://www.w3.org/WAI/WCAG22/Understanding/on-focus.html) | A | CHR-03 | Tab through the interface without activating controls |
| 3.2.2 [On Input](https://www.w3.org/WAI/WCAG22/Understanding/on-input.html) | A | Q-05, CMP-07, LANG-05 | Change selections, checkboxes and field values; look for unexpected navigation or focus movement |
| 3.2.3 [Consistent Navigation](https://www.w3.org/WAI/WCAG22/Understanding/consistent-navigation.html) | AA | TPL-01, CHR-01, CHR-06 | Compare repeated navigation across representative pages and states |
| 3.2.4 [Consistent Identification](https://www.w3.org/WAI/WCAG22/Understanding/consistent-identification.html) | AA | CMP-01, CNT-15 | Compare repeated search, download, contact and action controls |
| 3.2.6 [Consistent Help](https://www.w3.org/WAI/WCAG22/Understanding/consistent-help.html) | A | HELP-01 | List each help mechanism and its order on three channel pages and three transaction pages |
| 3.3.1 [Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html) | A | Q-03, Q-04, CMP-05 | Submit empty, malformed and contradictory values and review the feedback |
| 3.3.2 [Labels or Instructions](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html) | A | Q-01, Q-02, UP-01 | Check whether users can understand what to enter before making an error |
| 3.3.3 [Error Suggestion](https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html) | AA | CNT-17, CNT-18 | Check that messages explain how to recover, rather than saying "invalid" |
| 3.3.4 [Error Prevention (Legal, Financial, Data)](https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html) | AA | TPL-10, SUB-01 to SUB-04, PAY-01, DATA-04 | Test the protection on payments, deletions, commitments and submissions |
| 3.3.7 [Redundant Entry](https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html) | A | Q-06, XCH-03, ELIG-05, UP-05, ASK-02 | Follow a complete process and identify repeated names, codes, addresses and answers |
| 3.3.8 [Accessible Authentication (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html) | AA | ID-07, ASK-04, ASK-14, LANG-21 | Test sign-in, verification and recovery with password managers and paste; paste a code copied from an Arabic SMS; confirm there is no CAPTCHA |
| 4.1.2 [Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html) | A | CMP-04, CHR-03, PLAT-09 | Inspect computed names, roles, values and expanded, selected and checked states, and their changes |
| 4.1.3 [Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) | AA | FIND-04, UP-06 | Trigger updates while focus stays on the initiating control and check their announcement |

### <a id="appendix-aaa"></a>A.2 AAA criteria adopted

Services meet these AAA criteria as well ([A11Y-22](#a11y-baseline)). Most are delivered by requirements above and by the shared components.

| Criterion | Delivered by |
| --- | --- |
| 2.2.5 [Re-authenticating](https://www.w3.org/WAI/WCAG22/Understanding/re-authenticating.html) | TIME-04 |
| 2.2.6 [Timeouts](https://www.w3.org/WAI/WCAG22/Understanding/timeouts.html) | SAVE-01 |
| 2.3.3 [Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) | MOT-15 |
| 2.4.12 [Focus Not Obscured (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-enhanced.html) | A11Y-15 |
| 2.4.13 [Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html) | A11Y-05 and the shared focus ring |
| 2.5.5 [Target Size (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html) | A11Y-04 (links in running text are exempt in WCAG too) |
| 3.3.9 [Accessible Authentication (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-enhanced.html) | ID-07, ASK-14, for the steps the service owns |

Not adopted as rules, but met in practice or recommended: 2.4.8 Location (breadcrumbs and the stepper), 2.4.10 Section Headings, 3.1.4 Abbreviations (CNT-08), 3.3.5 Help (HELP-06) and 1.2.6 Sign Language (A11Y-20, for main explainer videos). 1.4.6 Contrast (Enhanced) is not met by secondary text (6.46:1 against the 7:1 it asks for).

---

## <a id="appendix-catalogue"></a>Appendix B. Catalogue record

Every service has one record ([SVC-10](#service-record)). Fields marked "Required" must be present before a service is listed. Facts are published only once the service owner has confirmed them; an unconfirmed value is stored as "not confirmed" and shown as such.

| Field | Content | Required |
| --- | --- | --- |
| `service_id` | Stable identifier, never reused (for example `SC-SVC-TRN-0042`) | Yes |
| `revision`, `status` | Record revision; `draft`, `live`, `closed temporarily`, `retired` | Yes |
| `title.en`, `title.ar` | Task-led names ([5.3](#svc-naming)) | Yes |
| `summary.en`, `summary.ar` | One sentence on what the service lets the user do | Yes |
| `synonyms.en`, `synonyms.ar` | Former names, formal names, codes, misspellings, transliterations | Yes |
| `owning_entity` | The accountable entity, with its official names in both languages | Yes |
| `service_owner`, `content_owner` | Named roles accountable for the outcome and for the content | Yes |
| `primary_channel`, `listed_channels[]` | Channel identifiers: `now`, `transport`, `visit`, `justice`, `build`, `invest`, `trade` | Yes |
| `categories[]`, `audiences[]`, `events[]` | Classification, separate from the name | Yes |
| `canonical_url.web`, `canonical_url.app` | One start URL per platform | Yes |
| `eligibility.en`, `eligibility.ar` | Who can and cannot use it | Yes |
| `prerequisites[]` | Documents and information needed, with acceptable alternatives | Yes |
| `fees` | Amount in AED, or "free", or how it varies, or "not confirmed"; when it is paid; refund conditions | Yes |
| `form_duration`, `processing_duration` | Time to fill in the form, and time to decide, kept separate; or "not confirmed" | Yes |
| `authentication` | None, or UAE PASS, at which step, and the assurance level required | Yes |
| `representation` | Whether users can act for others, and how authority is proved | Yes |
| `risk_tier` | High, standard or low ([ASR-11](#assurance)) | Yes |
| `conformance_level` | Conforms, conforms with exceptions, in transition, or does not conform ([TRN-04](#transition)) | Yes |
| `resume_url` | Where saved work is resumed | If drafts are saved |
| `support` | Help routes, hours and languages, as confirmed | Yes |
| `reviewed_at` | Date the content was last reviewed | Yes |
| `replaced_by` | The replacement `service_id`, for retired services | If retired |

---

## <a id="appendix-must-pass"></a>Appendix C. Must-pass list

A service cannot open to the public (pass its beta assessment) while it fails any of these. Contracts can cite this list as the acceptance criteria for beta ([Assurance handbook 11](assurance-handbook.md#contracts)). Every other MUST is still assessed, and a failure against it needs a fix or an exception before live.

| # | Requirement | In short |
| --- | --- | --- |
| 1 | [LANG-01](#lang-parity), [LANG-02](#lang-parity) | Both languages launch together, complete |
| 2 | [LANG-06](#lang-switching) | Switching language keeps the user's place and answers |
| 3 | [LANG-12](#lang-direction) | Language and direction set on every page |
| 4 | [LANG-15](#lang-bidi) | Left-to-right values isolated in Arabic |
| 5 | [LANG-20](#lang-numerals), [LANG-21](#lang-numerals) | Latin digits out; Arabic-Indic digits and pasted values accepted |
| 6 | [CNT-11](#cnt-arabic) | Arabic addresses every reader without assuming gender |
| 7 | [A11Y-01](#a11y-baseline) | WCAG 2.2 AA across the whole journey, with no severity 1 failure |
| 8 | [A11Y-04](#a11y-beyond) | 44px targets |
| 9 | [A11Y-05](#a11y-beyond), [A11Y-15](#a11y-beyond) | Focus visible and never covered |
| 10 | [A11Y-12](#a11y-statement), [A11Y-13](#a11y-statement) | An honest accessibility statement in both languages |
| 11 | [ASK-14](#ask-general) | No CAPTCHA |
| 12 | [TIME-01](#pat-timeout), [TIME-02](#pat-timeout) | Timeouts can be extended; Escape keeps the user signed in |
| 13 | [ID-02](#pat-sign-in), [ID-07](#pat-sign-in) | Official UAE PASS integration; paste and password managers allowed |
| 14 | [PAY-02](#pat-pay), [PAY-04](#pat-pay) | Official Dubai Pay integration; result confirmed server to server |
| 15 | [PAY-05](#pat-pay), [PAY-06](#pat-pay), [SUB-03](#pat-submit) | No duplicate charges or submissions |
| 16 | [TPL-14](#tpl-confirmation), [TPL-17](#tpl-confirmation) | No success before the server confirms it; no resubmission on reload |
| 17 | [CNT-19](#status-vocabulary) | "Paid" never shown as "Approved" |
| 18 | [SVC-02](#svc-theme), [SVC-11](#service-record) | No entity branding; one record and one transaction across channels |
| 19 | [PRV-07](#prv-security), [PRV-09](#prv-security) | Server-side authorisation; no personal data in URLs or logs |
| 20 | [PRV-12](#prv-cookies), [PRV-16](#prv-cookies) | Nothing non-essential before consent; rejecting degrades nothing |
| 21 | [PERF-02](#perf), [PERF-04](#perf) | Core Web Vitals in the lab; help and navigation without JavaScript |
| 22 | [LEG-01](#legal), [LEG-02](#legal) | Privacy notice, accessibility statement and terms; signed legal review |
| 23 | [HELP-02](#pat-help) | A help route that needs neither speech nor written English |
| 24 | [CMP-01](#cmp), [CMP-11](#cmp) | Shared components used; the official UAE PASS button, not a placeholder |
| 25 | [A11Y-11](#a11y-testing), [RES-02](#research) | Tested by people of determination and by an independent specialist |

---

## <a id="appendix-index"></a>Appendix D. Requirement index

Every numbered requirement, with where it is defined. Identifiers marked in the Design System reference bind the design system and component builders, not services.

| Requirements | Defined in |
| --- | --- |
| TRN-01 to TRN-05 | [4. Conformance and transition](#transition) |
| SVC-01 to SVC-03 | [5.2 The channel is the theme](#svc-theme) |
| SVC-04 to SVC-09 | [5.3 Naming services](#svc-naming) |
| SVC-10 to SVC-15 | [5.4 One canonical service record](#service-record) |
| LANG-01 to LANG-03 | [6.1 Parity](#lang-parity) |
| LANG-04 to LANG-11 | [6.2 Switching language](#lang-switching) |
| LANG-12 to LANG-14 | [6.3 Direction and layout](#lang-direction) |
| LANG-15 to LANG-19 | [6.4 Bidirectional text](#lang-bidi) |
| LANG-20, LANG-21, LANG-22, LANG-22A, LANG-23 | [6.5 Numerals](#lang-numerals) |
| LANG-25 to LANG-33 | [6.7 Arabic typography](#lang-type) |
| A11Y-01, A11Y-02, A11Y-03, A11Y-22 | [7.1 Baseline](#a11y-baseline) |
| A11Y-04, A11Y-05, A11Y-15, A11Y-06, A11Y-07, A11Y-08 | [7.2 Rules that go beyond WCAG](#a11y-beyond) |
| A11Y-16, A11Y-17, A11Y-18, A11Y-23, A11Y-19, A11Y-20, A11Y-21 | [7.3 Content, controls and third parties](#a11y-more) |
| A11Y-09, A11Y-10, A11Y-11 | [7.4 Testing](#a11y-testing) |
| A11Y-12, A11Y-13, A11Y-14 | [7.6 Accessibility statement](#a11y-statement) |
| PRV-01 to PRV-03 | [8.1 Collect only what is needed](#prv-minimisation) |
| PRV-04 to PRV-06 | [8.2 Privacy notice](#prv-notice) |
| PRV-07 to PRV-11 | [8.3 Security](#prv-security) |
| PRV-12 to PRV-16 | [8.4 Cookies and analytics](#prv-cookies) |
| PERF-01 to PERF-07 | [9. Performance and resilience](#perf) |
| RES-01 to RES-06 | [10. User research](#research) |
| ASR-11, ASR-12 | [11.2 Assessments](#assurance) |
| ASR-01, ASR-02, ASR-03, ASR-13, ASR-04, ASR-05, ASR-14 | [11.3 Exceptions](#assurance) |
| ASR-06 | [11.4 Release decisions](#assurance) |
| LEG-01 to LEG-04 | [12. Legal and policy context](#legal) |
| CNT-01 to CNT-03 | [13.1 Voice](#cnt-voice) |
| CNT-04, CNT-05, CNT-06, CNT-07, CNT-08, CNT-20 | [13.2 Plain English](#cnt-plain) |
| CNT-09 to CNT-16 | [13.3 Arabic content style](#cnt-arabic) |
| CNT-17, CNT-18 | [13.5 Error messages](#cnt-errors) |
| CNT-21, CNT-19 | [13.6 Status vocabulary](#status-vocabulary) |
| ASK-01, ASK-02, ASK-03, ASK-04, ASK-05, ASK-14 | [14.1 Rules for every question](#ask-general) |
| ASK-06 to ASK-08 | [14.2 Field reference](#ask-fields) |
| ASK-09 to ASK-13 | [14.3 Addresses and locations](#ask-address) |
| TPL-01 to TPL-03 | [15.1 Page shell and title](#tpl-shell) |
| TPL-04, TPL-05 | [15.2 Service detail page (start page)](#tpl-start) |
| TPL-06 to TPL-09 | [15.3 Question page](#tpl-question) |
| TPL-10 to TPL-13 | [15.4 Check answers page](#tpl-check) |
| TPL-14 to TPL-18 | [15.5 Confirmation page](#tpl-confirmation) |
| TPL-19, TPL-20 | [15.6 Task list page](#tpl-task-list) |
| TPL-21 | [15.7 Error pages](#tpl-errors) |
| CHR-01 to CHR-11 | [15.9 Channel-site chrome](#tpl-chrome) |
| FIND-01 to FIND-04 | [16.1 Find a service](#pat-find) |
| ELIG-01 to ELIG-05 | [16.2 Check eligibility](#pat-eligibility) |
| NAV-01 to NAV-04 | [16.3 Navigate a multi-step service](#pat-multi-step) |
| ID-01 to ID-08 | [16.4 Sign in with UAE PASS](#pat-sign-in) |
| REP-01 to REP-04 | [16.5 Act for an organisation or another person](#pat-represent) |
| Q-01 to Q-06 | [16.6 Answer questions and fix errors](#pat-questions) |
| UP-01 to UP-06 | [16.7 Upload documents](#pat-upload) |
| ADD-01 to ADD-05 | [16.8 Add another item](#pat-add-another) |
| SAVE-01 to SAVE-05 | [16.9 Save and return](#pat-save) |
| TIME-01 to TIME-05 | [16.10 Session timeout](#pat-timeout) |
| SUB-01 to SUB-04 | [16.11 Check answers and submit](#pat-submit) |
| PAY-01 to PAY-08 | [16.12 Pay with Dubai Pay](#pat-pay) |
| CONF-01 to CONF-03 | [16.13 Confirmation and receipts](#pat-confirmation) |
| TRACK-01 to TRACK-06 | [16.14 Track progress and respond](#pat-track) |
| NOTE-01 to NOTE-06 | [16.15 Notifications](#pat-notifications) |
| APPT-01 to APPT-04 | [16.16 Book or change an appointment](#pat-appointments) |
| HELP-01, HELP-06, HELP-02, HELP-03, HELP-04, HELP-05 | [16.17 Get help and assisted service](#pat-help) |
| FAIL-01 to FAIL-05 | [16.18 Recover from failures and poor connectivity](#pat-failure) |
| EXIT-01 to EXIT-04 | [16.19 Leave a sensitive service quickly](#pat-quick-exit) |
| DATA-01 to DATA-05 | [16.20 Professional data tables and bulk actions](#pat-data-tables) |
| XCH-01 to XCH-04 | [16.21 Continue across channels and entities](#pat-cross-channel) |
| PLAT-01 to PLAT-04 | [17.1 Rules for every platform](#plat-rules) |
| PLAT-05, PLAT-06 | [17.2 Native teams before the kits exist](#plat-native) |
| PLAT-07 to PLAT-13 | [17.3 Parity for native components](#plat-parity) |
| CMP-01, CMP-02, CMP-03, CMP-04, CMP-07, CMP-05, CMP-06, CMP-08, CMP-09, CMP-10, CMP-11, CMP-12 | [18. What services must use](#cmp) |
| FND-01, FND-02, FND-06, FND-09, FND-10, FND-22, FND-23, FND-28 | [18. What services must use](#cmp) |
| MOT-02, MOT-14, MOT-15 | [18. What services must use](#cmp-motion) |
| ASR-07 to ASR-10 | [19.2 Versioning and deprecation](#contributing) |
| FND-03, FND-04, FND-05, FND-07, FND-25, FND-24, FND-26 | [Design System reference: 2. Colour](design-system-reference.md#colour) |
| FND-27 | [Design System reference: 2. Colour](design-system-reference.md#tints) |
| FND-08 | [Design System reference: 2. Colour](design-system-reference.md#dark-mode) |
| FND-11, FND-12, FND-13, FND-29 | [Design System reference: 3. Typography](design-system-reference.md#typography) |
| FND-14 to FND-16 | [Design System reference: 4. Spacing, sizes and shape](design-system-reference.md#spacing) |
| FND-17, FND-18 | [Design System reference: 5. Layout and grid](design-system-reference.md#layout) |
| FND-19, FND-20 | [Design System reference: 6. Elevation](design-system-reference.md#elevation) |
| FND-21 | [Design System reference: 7. Icons and imagery](design-system-reference.md#icons) |
| LANG-24 | [Design System reference: 7. Icons and imagery](design-system-reference.md#icons) |
| MOT-01, MOT-03, MOT-04, MOT-05, MOT-06, MOT-07, MOT-08, MOT-09, MOT-10, MOT-11, MOT-12, MOT-13 | [Design System reference: 8. Motion](design-system-reference.md#motion) |
| PERF-08 to PERF-11 | [Design System reference: 12. Budgets](design-system-reference.md#budgets) |

---

## <a id="appendix-map"></a>Appendix E. Where the earlier draft's content went

This consultation draft restructures the working draft of 22 October 2026 into three documents. Requirement identifiers did not change: a rule that moved keeps its identifier. The full change log is published with the standard.

| Earlier chapter | Requirements | New home |
| --- | --- | --- |
| 0. About this standard | – | [1. About this standard](#about); repository layout in the [Design System reference](design-system-reference.md#tokens) |
| 1. Principles | – | [2. Principles](#principles) |
| 2. Service standard | – | [3. The 12 points](#points) |
| 3. Channels and services | SVC-01 to SVC-15 | [5. Channels, services and the service record](#svc) |
| 4. Legal and policy context | LEG-01 to LEG-04 | [12. Legal and policy context](#legal) |
| 5. Arabic and English | LANG-01 to LANG-33 | [6. Arabic and English](#lang); LANG-24 (icon classification) in the [Design System reference](design-system-reference.md#icons) |
| 6. Accessibility | A11Y-01 to A11Y-14 | [7. Accessibility](#a11y); the statement template in the [Assurance handbook](assurance-handbook.md#tpl-statement) |
| 7. Platforms | PLAT-01 to PLAT-12 | [17. Platforms](#plat); the platform table in the [Design System reference](design-system-reference.md#platforms) |
| 8. Visual foundations | FND-01, FND-02, FND-06, FND-09, FND-10, FND-22, FND-23, FND-28 | [18. What services must use](#cmp) |
| 8. Visual foundations | FND-03 to FND-05, FND-07, FND-08, FND-11 to FND-21, FND-24 to FND-27, FND-29 | [Design System reference 2 to 7](design-system-reference.md#colour) |
| 8.7 Motion | MOT-02, MOT-14, MOT-15 | [18. What services must use](#cmp-motion) |
| 8.7 Motion | MOT-01, MOT-03 to MOT-13 | [Design System reference 8](design-system-reference.md#motion) |
| 8.8 Focus | – | [Design System reference 9](design-system-reference.md#focus) |
| 9. Content design | CNT-01 to CNT-19 | [13. Content design](#content) |
| 10. Components | CMP-01 to CMP-12 | [18. What services must use](#cmp); the component index and planned components in the [Design System reference](design-system-reference.md#components) |
| 11. Page templates | TPL-01 to TPL-21, CHR-01 to CHR-10 | [15. Page templates](#templates); chrome design values in the [Design System reference](design-system-reference.md#chrome) |
| 12. Ask users for | ASK-01 to ASK-13 | [14. Asking for information](#ask) |
| 13. Journey patterns | FIND, ELIG, NAV, ID, REP, Q, UP, ADD, SAVE, TIME, SUB, PAY, CONF, TRACK, NOTE, APPT, HELP, FAIL, EXIT, DATA, XCH | [16. Journey patterns](#patterns) |
| 14. Privacy, security and consent | PRV-01 to PRV-16 | [8. Privacy, security and consent](#privacy) |
| 15. Performance and resilience | PERF-01 to PERF-07 | [9. Performance and resilience](#perf) |
| 15. Performance and resilience | PERF-08 to PERF-11 | [Design System reference 12](design-system-reference.md#budgets) |
| 16. User research | RES-01 to RES-06 | [10. User research](#research) |
| 17. Assurance | ASR-01 to ASR-06 | [11. Assurance](#assurance); roles, panels, evidence and the report template in the [Assurance handbook](assurance-handbook.md) |
| 18. Contributing and versioning | ASR-07 to ASR-10 | [19. Contributing and versioning](#contributing) |
| 19. Open questions | – | [Appendix G](#open-questions) |
| Appendix A. WCAG 2.2 register | – | [Appendix A](#appendix-wcag) |
| Appendix B. Catalogue record | – | [Appendix B](#appendix-catalogue) |
| Appendix C. Accessibility statement template | – | [Assurance handbook 12.2](assurance-handbook.md#tpl-statement) |
| Appendix D. Assessment report template | – | [Assurance handbook 12.1](assurance-handbook.md#tpl-report) |
| Appendix E. Bibliography | – | [Appendix H](#appendix-bibliography) and the [Design System reference bibliography](design-system-reference.md#bibliography) |
| "How we check" sections | – | A summary at the end of each chapter; full scripts in the [Assurance handbook](assurance-handbook.md#checks) |

New in this draft: TRN-01 to TRN-05, A11Y-15 to A11Y-23, ASK-14, CNT-20, CNT-21, HELP-06, PLAT-13, CHR-11 and ASR-11 to ASR-14.

---

## <a id="appendix-glossary"></a>Appendix F. Glossary

The Arabic terms are proposed and are confirmed by the bilingual content and taxonomy lead for the shared glossary ([CNT-15](#cnt-arabic), [OQ-9](#open-questions)).

| English | Arabic | Meaning |
| --- | --- | --- |
| Accessibility statement | بيان إمكانية الوصول | A service's public account of how accessible it is, and what to do if a part is not ([7.6](#a11y-statement)) |
| Acting for someone | النيابة عن الغير | Using a service for an organisation or another person, with proven authority ([16.5](#pat-represent)) |
| Application | الطلب | What a user submits to an entity for a decision |
| Assisted route | الخدمة بمساعدة موظف | A way to complete a service with help from staff, by phone, chat or in person |
| Assessment | التقييم | The check of a service against the 12 points at alpha, beta and live |
| Canonical service record | السجل الموحد للخدمة | The one record of a service's facts that every channel shows ([5.4](#service-record)) |
| Channel | القناة | One of the seven Shared Channels websites and apps |
| Channel product owner | مسؤول منتج القناة | The person accountable for how services appear on a channel |
| Conformance level | مستوى المطابقة | Whether a service conforms, conforms with exceptions, is in transition or does not conform ([TRN-04](#transition)) |
| Consultation draft | مسودة للتشاور | A draft published for comment before adoption |
| Design system | نظام التصميم | The shared tokens, components and patterns ([Design System reference](design-system-reference.md)) |
| Dubai time | بتوقيت دبي | Gulf Standard Time, UTC+4, with no daylight saving |
| Entity | الجهة الحكومية | The government body that owns a service and is accountable for its outcome |
| Exception | الاستثناء | A recorded, time-limited permission not to meet a requirement ([11.3](#assurance)) |
| Fee | الرسوم | An amount a user pays for a service |
| Handoff | الانتقال إلى خدمة أخرى | Sending a user to another service or provider (UAE PASS, Dubai Pay, another channel) and back |
| Issuing authority | الجهة المُصدِرة | The body that adopts and enforces the standard (to be confirmed, [OQ-14](#open-questions)) |
| Life event | مناسبة حياتية | A situation that needs several services, such as having a baby or starting a business |
| People of determination | أصحاب الهمم | The official UAE term for disabled people |
| Privacy notice | إشعار الخصوصية | A plain-language account of what a service collects and why ([8.2](#prv-notice)) |
| Reference number | الرقم المرجعي | The identifier a service gives a submission or payment |
| Risk tier | فئة المخاطر | High, standard or low, which sets how a service is assessed ([ASR-11](#assurance)) |
| Service | الخدمة | Something a user does with government, such as renewing a registration |
| Service owner | مالك الخدمة | The person in the owning entity accountable for the whole service |
| Status | الحالة | Where an application, task or payment stands, from the [status vocabulary](#status-vocabulary) |

---

## <a id="open-questions"></a>Appendix G. Questions for consultation

Some details are still being confirmed. The standard does not rely on any of them until they are; each has an owner, and the answer is added in a later version. Answered questions are removed and their numbers are not reused. Comments on any of them are welcome ([how to comment](#on-a-page)).

| # | To confirm | Owner | Affects |
| --- | --- | --- | --- |
| OQ-3 | The official UAE PASS button guidelines and kit: colours, mark, labels in English and Arabic (with the official styling of "UAE PASS" and its Arabic name), sizes, variants and dark-mode treatment. They replace the design system's placeholder ([CMP-11](#cmp)) and set the width the header row must fit ([CHR-01](#tpl-chrome)). Needed before any public launch with sign-in | Design system team with the UAE PASS provider | [16.4](#pat-sign-in), [15.9](#tpl-chrome) |
| OQ-4 | The official styling of "Dubai Pay" in English and Arabic, its integration guidelines, whether it requires its own button asset in place of the hand-off button ([CMP-10](#cmp)), and the payment and refund states it reports | Design system team with the Dubai Pay provider | [13.4](#cnt-style), [13.6](#status-vocabulary), [16.12](#pat-pay) |
| OQ-5 | Which data protection instruments apply and what they require (candidates include the federal Personal Data Protection Law, Dubai Law No. 26 of 2015 (the Dubai Data Law), Digital Dubai policies, and DIFC and ADGM rules) | Legal counsel | [12](#legal), [8](#privacy), [XCH-03](#pat-cross-channel) |
| OQ-6 | Which instruments on the rights of people of determination and on digital accessibility apply, and whether any mandates a WCAG level (candidates: Federal Law No. 29 of 2006 as amended, Dubai Law No. 2 of 2014, Digital Dubai or TDRA accessibility policy, the Dubai Universal Design Code). Until then, WCAG 2.2 AA is the benchmark the issuing authority chooses | Legal counsel | [12](#legal), [7](#a11y) |
| OQ-7 | How this standard relates to the Dubai Digital Authority's design guidance, the UAE Design System and TDRA guidelines: whether it adopts, extends or profiles them | Issuing authority | Whole standard |
| OQ-8 | Which information security baseline applies (for example the Dubai Electronic Security Center Information Security Regulation), with the rules for hosting, data residency, third-party scripts, penetration testing and vulnerability reporting | Security owners | [8.3](#prv-security) |
| OQ-9 | Whether an official Arabic glossary exists for terms such as service, application, fee and entity, to seed [Appendix F](#appendix-glossary) | Bilingual content and taxonomy lead | [13.3](#cnt-arabic) |
| OQ-10 | Whether services must use the dirham symbol introduced by the Central Bank of the UAE in 2025, and its font and keyboard support. Its Unicode code point (reported as U+20C3 in Unicode 18.0) is not yet confirmed from unicode.org | Design system team with the Central Bank of the UAE guidance | [13.4](#cnt-style) |
| OQ-11 | Whether any service (Dubai Justice in particular) must show Hijri dates alongside Gregorian dates, and how | Service owners, Dubai Justice | [13.4](#cnt-style) |
| OQ-13 | Each channel's audiences and categories, and whether staff-facing tools (for example for court staff on Dubai Justice) are in scope for assessment | Channel product owners | [1.2](#scope), [5.1](#svc-channels) |
| OQ-14 | The body that will adopt, own and enforce this standard, appoint assessors and approve exceptions; the enforcement levers it will use; and the recruitment route for research with people of determination | Initiative leadership | [1.1](#status), [10](#research), [11](#assurance) |
| OQ-17 | Which channels use Flutter and which React Native; which framework versions the kits must support; whether the kits should wrap shared UAE PASS and Dubai Pay native modules; and a dated plan for native tokens and kits | Channel product owners | [17](#plat) |
| OQ-18 | The default inactivity timeout and warning time, and how the service session relates to the UAE PASS session | Security owners with the UAE PASS provider | [16.10](#pat-timeout) |
| OQ-19 | Performance budgets for the native apps (cold start, app size, offline behaviour) | Design system team | [PERF-07](#perf) |
| OQ-21 | A chart palette in the tokens, checked for contrast and against the palette rules | Design system team | [Design System reference](design-system-reference.md#colour) |
| OQ-27 | The legal basis for analytics and other optional cookies, and how long a consent choice is kept | Legal counsel and privacy owners | [8.4](#prv-cookies) |
| OQ-30 | The usage manual for the Government of Dubai lockup under Article 7 of Law No. (1) of 2025, and any authorisation under Article 6(b) if it applies: clear space, minimum size, dark-background version and link target | Design system team with the General Secretariat of the Executive Council | [CHR-02](#tpl-chrome) |
| OQ-32 | Which Dubai government feedback mandates services must carry and where (the Happiness Meter, the government complaints and suggestions route), with measure targets and how they relate to existing customer happiness reporting | Issuing authority with Digital Dubai | [11.5](#measures), [16.17](#pat-help) |
| OQ-33 | Rules for AI assistants and chatbots: disclosure, answers on fees and eligibility from the canonical record only, no personal data sent without a basis, human takeover and audit | Issuing authority with Digital Dubai | [16.17](#pat-help) |
| OQ-34 | Whether and how services may add languages other than Arabic and English, and what parity they must keep | Issuing authority | [6](#lang) |
| OQ-35 | Which language prevails for legal effect (terms, declarations, notices, decisions) when the Arabic and English texts differ | Legal counsel | [6.1](#lang-parity) |
| OQ-36 | How the standard applies by owner type: Dubai government entities, semi-government bodies and concession operators, federal bodies and third parties | Issuing authority | [1.2](#scope) |
| OQ-37 | The transition deadlines (12 months for the minimum public duty, 6 months for channel roadmaps) and the volume threshold for high-risk services | Issuing authority with channel owners | [4](#transition), [11.2](#assurance) |
| OQ-38 | The consultation route, contact and closing date | Initiative leadership | [The standard on a page](#on-a-page) |
| OQ-39 | The assessment model: the risk-tier criteria (ASR-11), assessment routes (ASR-12), who approves exceptions at each severity (ASR-13), the 18-month support period per major version (ASR-10) and the 10-working-day limit for entity sign-off of accessibility statements | Issuing authority with channel owners | [11](#assurance), [19](#contributing) |
| OQ-40 | Which web addresses the official banner may name as official. Many Government of Dubai websites use `.gov.ae`, but some entities use other `.ae` addresses, so "Official websites use .gov.ae" may need to become a list or a link to a register of official websites | Initiative leadership with the Dubai Digital Authority | [15.9](#tpl-chrome) |

---

## <a id="appendix-bibliography"></a>Appendix H. Bibliography and acknowledgements

**Standards and guidance**

- W3C. *Web Content Accessibility Guidelines (WCAG) 2.2*. W3C Recommendation, 12 December 2024 (first published 5 October 2023). https://www.w3.org/TR/WCAG22/
- ISO/IEC 40500:2025. *Web Content Accessibility Guidelines (WCAG) 2.2*.
- W3C. *Understanding WCAG 2.2*. https://www.w3.org/WAI/WCAG22/Understanding/
- W3C. *Guidance on Applying WCAG 2 to Non-Web Information and Communications Technologies (WCAG2ICT)*. W3C Group Note. https://www.w3.org/TR/wcag2ict-22/
- W3C. *ARIA Authoring Practices Guide*. https://www.w3.org/WAI/ARIA/apg/
- ETSI. *EN 301 549: Accessibility requirements for ICT products and services*, V3.2.1 and V4.1.1.
- ISO 14289. *Document management applications: Electronic document file format enhancement for accessibility (PDF/UA)*.
- Unicode Consortium. *Unicode Bidirectional Algorithm (UAX #9)*. https://www.unicode.org/reports/tr9/
- IETF. *RFC 2119: Key words for use in RFCs to indicate requirement levels*. https://www.rfc-editor.org/rfc/rfc2119
- Google. *Web Vitals*. https://web.dev/articles/vitals

**Law**

- Government of Dubai. *Law No. (1) of 2025 on the emblems of Dubai and the Government of Dubai*. Dubai Legislation Portal.

**Benchmarks**

- GOV.UK. *Service Manual*. https://www.gov.uk/service-manual
- GOV.UK. *Service Standard*. https://www.gov.uk/service-manual/service-standard
- GOV.UK. *Naming your service*. https://www.gov.uk/service-manual/design/naming-your-service
- GOV.UK. *Design System*. https://design-system.service.gov.uk/

**Shared Channels**

- [Shared Channels Design System reference](design-system-reference.md)
- [Shared Channels Assurance handbook](assurance-handbook.md)

**Acknowledgements.** The standard adapts the GOV.UK Service Manual, Service Standard and Design System, with thanks to the Government Digital Service. The sources of the design system's own guidance are credited in the [Design System reference](design-system-reference.md#bibliography).
