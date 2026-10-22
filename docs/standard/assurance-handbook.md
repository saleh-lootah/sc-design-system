# Shared Channels Assurance handbook

| | |
| --- | --- |
| Status | Consultation draft, published with the Service Standard |
| Date | 22 October 2026 |
| Owner | Shared Channels design system team, for the issuing authority (to be confirmed, [OQ-14](service-standard.md#open-questions)) |
| Read with | [Shared Channels Service Standard](service-standard.md) and [Design System reference](design-system-reference.md) |

This handbook explains how services are checked against the [Shared Channels Service Standard](service-standard.md): who assesses, when, what evidence teams show, how panels test, how exceptions work and how the standard is written into contracts. It holds the templates for assessment reports, accessibility statements, exception records and release records.

The handbook is procedural. The requirements services must meet are in the Service Standard, and where this handbook repeats one (for example the exception rules [ASR-01 to ASR-05](service-standard.md#assurance)), the Service Standard is authoritative. The assessment model below is proposed for consultation: the issuing authority confirms it on adoption.

<a id="contents"></a>

## Contents

1. [Roles](#roles)
2. [Risk tiers](#tiers)
3. [Assessments](#assessments)
4. [Panels and outcomes](#panels)
5. [Evidence by assessment](#evidence)
6. [How we check: test scripts](#checks)
7. [Accessibility testing](#a11y-testing)
8. [Exceptions](#exceptions)
9. [Bringing live services into the standard](#transition)
10. [Releases and measures](#releases)
11. [Using the standard in contracts](#contracts)
12. [Templates](#templates)

---

<a id="roles"></a>

## 1. Roles

| Role | Accountable for |
| --- | --- |
| Issuing authority (to be confirmed) | Adopting the standard, appointing the central assessors, approving high-severity exceptions, settling disputes between entities, and publishing a summary of outcomes per channel |
| Central assurance team | Running high-risk assessments, keeping the assessor pool, the exception register and the sampled audit of self-assessments |
| Design system team | Tokens, components, the Design System reference, the Service Standard text and its changelog. Evidence that the library meets the standard (build checks, budgets, component tests), published with each release |
| Service owner (owning entity) | The whole service outcome, the canonical record, the accuracy of fees, eligibility and timings, funding fixes, and the service's assessment evidence |
| Channel product owner | Findability, navigation and presentation on the channel, correct use of canonical records, and running standard-tier assessments and low-severity exceptions for services on the channel |
| Bilingual content and taxonomy lead | Service names, taxonomy, the glossary, Arabic–English parity, and the shared Arabic content design pool |
| Accessibility lead | The evaluation scope and method, the WCAG register, the accessibility statement, and the shared accessibility testing service |
| Security, privacy and records owners | Controls, data flows, retention and incident handling |
| Operations and support owner | Assisted service, status reconciliation and incident communication |
| Supplier | Building to the standard, providing evidence, fixing defects and handing over maintainable code and the accessibility register |

**Shared capacity.** Arabic content designers and accessibility specialists are scarce. The central teams keep a pool of both that entities and suppliers can call on for writing, reviewing and assessing, and publish the glossary and the shared string library first so that most content is reused rather than written.

---

<a id="tiers"></a>

## 2. Risk tiers

Every service has a risk tier, recorded in its catalogue record (`risk_tier`, [Appendix B](service-standard.md#appendix-catalogue)) by the channel product owner and confirmed by the central assurance team ([ASR-11](service-standard.md#assurance)).

| Tier | A service is in this tier when it… | Examples |
| --- | --- | --- |
| High | Takes payment, establishes identity or authority, has legal effect (court, permit, licence, declaration), handles sensitive personal data, or has high volume (to be set by the issuing authority, for example more than 100,000 transactions a year) | Pay a traffic fine; apply for a building permit; check a court case status; renew a trade licence |
| Standard | Is a transaction or a signed-in view that is not high risk | Book a building inspection; update contact details |
| Low | Is a change that does not alter a journey, its content facts, its identity or payment flow or its audience; or a content page with no transaction | Wording fixes; a new topic page; a visual fix inside an existing template |

A service moves to a higher tier when a change adds payment, identity, legal effect or a new audience.

---

<a id="assessments"></a>

## 3. Assessments

Services are assessed against the 12 points of the [Service Standard](service-standard.md#points). Each assessment maps to the stage most Dubai projects already have, so that the standard fits fixed-scope delivery as well as iterative delivery.

| Assessment | Project stage | When |
| --- | --- | --- |
| Alpha | Design sign-off, before the main build | Before building the real service |
| Beta | Before user acceptance testing ends and the service opens to the public | Before the service is open to the public |
| Live | Post-launch review | Before the service is declared live and the beta label removed, normally 3 to 6 months after beta |

**Route by tier ([ASR-12](service-standard.md#assurance))**

| Tier | Alpha | Beta | Live |
| --- | --- | --- | --- |
| High | Central panel | Central panel | Central panel |
| Standard | Self-assessment, reviewed by the channel product owner | Channel panel, with a pool Arabic content specialist and accessibility specialist | Self-assessment with evidence, sampled by the central assurance team |
| Low | None | Self-assessment against the affected points | None |

A service returns for reassessment after a major change: a new platform, a new identity or payment flow, a new channel listing or a change to who the service is for. The reassessment covers the points the change affects.

**Self-assessment.** The service team completes the assessment report template ([12.1](#tpl-report)) with its evidence, and the channel product owner signs it. The central assurance team audits a sample each quarter, weighted towards services with complaints, accessibility contacts or open exceptions. A self-assessment found to be wrong is redone as a channel panel.

---

<a id="panels"></a>

## 4. Panels and outcomes

**Panel make-up.**

| Panel | Members |
| --- | --- |
| Central | A lead assessor (chair) and specialists in user research, design, content design in English, content design in Arabic, accessibility and technology |
| Channel | The channel product owner or a delegate (chair), an Arabic content specialist and an accessibility specialist from the pool, and one other specialist the service's risks call for |

The Arabic content specialist and the accessibility specialist are members of every panel.

**What panels do.** Panels review the team's own test evidence and walk the service; they do not run the team's quality assurance for it. For high-risk services the panel also repeats the duplicate submission and payment tests ([SUB-03](service-standard.md#pat-submit), [PAY-06](service-standard.md#pat-pay)).

**Outcomes.** The panel records each of the 12 points as **met**, **met with conditions** or **not met**, with reasons and recommendations.

- **Met** when every point is met or met with conditions. Conditions have owners and dates, and are checked at the next assessment or within three months.
- **Not met** when any point is not met. The service may not move to the next phase. It fixes the points and is reassessed on those points only, within three months.

A team may ask the issuing authority to review an outcome it disagrees with.

**Reports** use the template in [12.1](#tpl-report) and are shared with the service team within two weeks of the assessment.

---

<a id="evidence"></a>

## 5. Evidence by assessment

| Assessment | Main evidence |
| --- | --- |
| Alpha | Research findings in both languages; a journey map with an owner for each handoff; prototypes in both languages; component reuse and gaps; the threat model; the plan for UAE PASS and Dubai Pay; the risk tier |
| Beta | A working end-to-end service in both languages; the WCAG register with a result and evidence for each criterion; the accessibility statement draft; performance results; the question protocol; the signed legal review ([LEG-02](service-standard.md#legal)); recovery-state tests for each pattern used; support and incident processes; the exception register entries |
| Live | Real-user measures ([measures](service-standard.md#measures)); the published accessibility statement; fixes for earlier conditions and "not met" points; the operating model |

---

<a id="checks"></a>

## 6. How we check: test scripts

Each chapter of the Service Standard ends with a short "How we check". These are the full scripts panels and self-assessing teams use. "Both languages" means Arabic and English; "both themes" means light and dark.

<a id="check-channels"></a>

### 6.1 Channels and services

- The catalogue rejects a record without an identifier or owner; the team shows the validation result.
- Open the service from each channel that lists it and from search, and confirm that each route reaches the same record revision and transaction.
- Check the service's pages for a single channel theme and for entity branding (logos, colours, fonts); any entity styling fails [SVC-02](service-standard.md#svc-theme).
- The team shows its naming research: search terms, comprehension findings and the synonym list.

<a id="check-language"></a>

### 6.2 Arabic and English

- Run the main journey in both languages, switching language once on a question page with an error showing and once on the check answers page. Confirm answers, errors and the step are kept ([LANG-06](service-standard.md#lang-switching)).
- Inspect `<html lang dir>`, the `hreflang` alternates and the language switch markup on three pages.
- Review the team's automated check for Arabic-Indic digits in output and for `left` and `right` in service CSS.
- Read a confirmation page with a plate, an amount and a reference in Arabic with a screen reader, and copy the reference into a text field to confirm it is intact ([LANG-15](service-standard.md#lang-bidi)).
- Copy a verification code from an Arabic SMS on iOS and on Android, paste it into the code field, and confirm it is accepted ([LANG-21](service-standard.md#lang-numerals)).
- Confirm the Arabic content designer's sign-off ([LANG-03](service-standard.md#lang-parity)).

<a id="check-a11y"></a>

### 6.3 Accessibility

- Review the axe results per template ([A11Y-09](service-standard.md#a11y-testing)), the manual test record against the support matrix ([A11Y-10](service-standard.md#a11y-testing)) and the WCAG register.
- Test one full journey with a keyboard and with a screen reader in Arabic.
- In two channels and both themes, check that the focus ring is the same neutral ring, is never covered and is never clipped at a screen edge ([A11Y-05, A11Y-15](service-standard.md#a11y-beyond)). Tab to the last element above any docked bar at 400% zoom, and at 1280 × 720 at 200%.
- Press, move off and release on three controls; nothing fires ([MOT-09](design-system-reference.md#motion)).
- Open every tooltip or toggletip with pointer and keyboard and dismiss it with Escape ([A11Y-16](service-standard.md#a11y-more)).
- Compare visible labels with accessible names in both languages ([A11Y-17](service-standard.md#a11y-more)).
- Confirm there is no CAPTCHA anywhere in the journey ([ASK-14](service-standard.md#ask-general)).
- Open each embedded third-party widget and check it against the register ([A11Y-19](service-standard.md#a11y-more)).
- Open one receipt or issued document with a screen reader in Arabic and copy its reference out ([A11Y-21](service-standard.md#a11y-more)).
- Compare the accessibility statement with the register; any known failure missing from the statement fails [A11Y-13](service-standard.md#a11y-statement).

<a id="check-privacy"></a>

### 6.4 Privacy, security and consent

- Review the question protocol and the privacy notice in both languages.
- Load the service in a clean browser and check, in the browser's network and storage tools, that nothing non-essential is set or sent before accepting, and that rejecting leaves it off.
- Change a reference in a URL to another user's and expect a refusal ([PRV-07](service-standard.md#prv-security)).

<a id="check-performance"></a>

### 6.5 Performance and resilience

- Review the lab results with the [PERF-01](service-standard.md#perf) profile before release, and the real-user monitoring report after release.
- Load the start page with JavaScript off and check it is usable, including navigation and help.
- Load one channel page and one question page with the browser's network panel open, in both languages, and check the fonts transferred, the render-blocking resources and the layout shift. Compare with the library's published budget report for the version the service uses.
- Review the availability objectives, monitoring dashboard and incident runbook at the beta assessment.

<a id="check-research"></a>

### 6.6 User research

- Review the research plan, participant profiles (without personal data) against [RES-02](service-standard.md#research) and the changes made as a result.
- Ask which findings came from Arabic-first participants and from people of determination, and what changed.

<a id="check-content"></a>

### 6.7 Content design

- Review the content review record for both languages ([CNT-16](service-standard.md#cnt-arabic)) and the glossary entries added ([CNT-15](service-standard.md#cnt-arabic)).
- Read the main journey in each language, check five error messages against the templates, and check every status shown against the status vocabulary.
- Search the Arabic content for imperative verbs and gender-marked second-person verbs ([CNT-11](service-standard.md#cnt-arabic)).
- Search both languages for instructions that rely on position, shape, colour or sound ([CNT-20](service-standard.md#cnt-plain)).

<a id="check-ask"></a>

### 6.8 Asking for information

- Review the question protocol and challenge any field without a purpose ([ASK-01](service-standard.md#ask-general)).
- Enter each field type with spaces, hyphens, Arabic-Indic digits and pasted values, and check that they are accepted and normalised ([ASK-03](service-standard.md#ask-general)); check `autocomplete` in the markup ([ASK-04](service-standard.md#ask-general)).
- Give an address with location permission refused and without a map ([ASK-12, ASK-13](service-standard.md#ask-address)).

<a id="check-templates"></a>

### 6.9 Page templates and channel-site chrome

- Open each template the service uses and check content order, the single `<h1>`, the title format and the footer links ([TPL-01 to TPL-03](service-standard.md#tpl-shell)).
- Submit the check answers page twice quickly and reload the confirmation page; neither may create a second submission ([TPL-17](service-standard.md#tpl-confirmation)).
- Request a non-existent URL in both languages and check the 404 page and its status.
- On a channel site: check the header order and the lockup in both languages ([CHR-01, CHR-02](service-standard.md#tpl-chrome)); open the channel switcher and the mobile menu with the keyboard and the pointer and close each with Escape ([CHR-03, CHR-04](service-standard.md#tpl-chrome)); tab to the last element above the utility bar at 400% zoom and at a viewport height below 600px ([CHR-05](service-standard.md#tpl-chrome)); check the footer's Channels group, the flat hero and, on the home page, the network strip ([CHR-06 to CHR-08](service-standard.md#tpl-chrome)); dismiss an announcement with the keyboard ([CHR-09](service-standard.md#tpl-chrome)); and, signed in at 390px, tab to the last element above the bottom navigation ([CHR-10](service-standard.md#tpl-chrome)).
- On a promotion channel, check that promotional content sits only in the promotion slots ([CHR-11](service-standard.md#tpl-chrome)).

<a id="check-patterns"></a>

### 6.10 Journey patterns

- For each pattern the service uses, review test evidence for every recovery state listed, in both languages.
- For high-risk services, repeat the payment and submission duplicate tests ([SUB-03](service-standard.md#pat-submit), [PAY-06](service-standard.md#pat-pay)): double-click submit, refresh during submission, press Back after it, pay in two tabs, close the browser after paying.
- Walk one recovery state per pattern.
- At the session timeout warning, press Escape and confirm the session was extended; let the warning appear while typing, extend it ten times, then let it expire ([TIME-01, TIME-02](service-standard.md#pat-timeout)).

<a id="check-platforms"></a>

### 6.11 Platforms

- Review the platform capability matrix ([PLAT-01](service-standard.md#plat-rules)) and, for native apps, the parity checklist results for each component the team built.
- Test the main journey in the app with VoiceOver and TalkBack in Arabic, with the largest text size, in both orientations, and by moving the app to the background during a UAE PASS handoff.

<a id="check-design-system"></a>

### 6.12 Using the design system

- Inspect the service's pages for `sc-` components where one exists for the need, and for local copies or restyled components ([CMP-01](service-standard.md#cmp)).
- For each local component, review its exception record (if one is needed) and its test results against the component conventions.
- Check that `sc.css` is loaded once, by `<link>`, and that no component has colours set on it directly ([CMP-02](service-standard.md#cmp)).
- Review the service's literal check ([FND-02](service-standard.md#cmp)) and search service code for palette tones and for another channel's values.
- Switch the theme in the system settings and on the page, and check two templates in each.
- Press Enter in a single-line field on a question page and check that the form submits ([CMP-07](service-standard.md#cmp)).
- Check that links in running text are underlined ([CMP-08](service-standard.md#cmp)) and that completed steps are in the channel colour with a check ([CMP-09](service-standard.md#cmp)).
- On two channels and in both themes, check that the Dubai Pay button is the city indigo hand-off button or the provider's asset ([CMP-10](service-standard.md#cmp)), and that the UAE PASS button is the official button ([CMP-11](service-standard.md#cmp)).
- Check that every status tag shows a status from the vocabulary in a semantic tone ([CMP-12](service-standard.md#cmp)).
- Review the service's own animations: trigger each with the keyboard and with the pointer, with reduced motion on and off ([MOT-02, MOT-14, MOT-15](service-standard.md#cmp-motion)).

**What the design system team shows instead.** The token build's contrast, colour-space and palette checks, the component tests and the budget report are published with each library release. Panels do not repeat them; they check the service uses a supported version ([ASR-10](service-standard.md#contributing)).

---

<a id="a11y-testing"></a>

## 7. Accessibility testing

**Scope by change ([A11Y-10](service-standard.md#a11y-testing)).**

| Change | Manual testing |
| --- | --- |
| A new journey, a major change, or any change to a high-risk journey | The full support matrix ([support matrix](service-standard.md#a11y-support)) in both languages |
| A minor change to a standard or low-risk journey | The smoke set: keyboard only; NVDA with Firefox or Chrome on Windows; VoiceOver on iOS; in both languages; 400% zoom; reduced motion |

**Recording voices and versions.** The test record names each screen reader, its version, the browser, and the Arabic and English voices installed (for example NVDA with a OneCore or Vocalizer Arabic voice, not only the default voice). Automatic language switching works only when both voices are installed.

**Specialist evaluation.** Before the beta assessment, an accessibility specialist who did not build the service evaluates it against every criterion in the WCAG register and the adopted AAA criteria ([A11Y-11, A11Y-22](service-standard.md#a11y-testing)). The shared accessibility testing service can do this for entities without their own.

**People of determination.** Recruitment routes for research with people of determination are to be agreed with the issuing authority and community organisations ([OQ-14](service-standard.md#open-questions)).

---

<a id="exceptions"></a>

## 8. Exceptions

The rules are [ASR-01 to ASR-05 and ASR-13, ASR-14](service-standard.md#assurance). This is the process.

**When an exception is not needed.** A planned component's documented interim approach ([Design System reference 10.4](design-system-reference.md#backlog)) meets the standard and needs no exception. Neither does a recommendation recorded as a SHOULD with a reason.

**Recording.** The service team records the exception in the exception register using the template in [12.3](#tpl-exception). Every exception has an end date.

**Severity** is set by the effect on people ([ASR-03](service-standard.md#assurance)):

| Severity | Effect | Approved by | Longest term | Review |
| --- | --- | --- | --- | --- |
| 1 | A task is blocked for some people | The issuing authority | 90 days | Monthly |
| 2 | A task is possible only with unreasonable effort | The issuing authority, or the channel product owner for standard and low-risk services | 90 days | Monthly |
| 3 | Inconvenience | The channel product owner | 90 days | At expiry |

Exceptions approved by channel product owners are visible to the central assurance team in the shared register. Renewal needs new evidence and a new decision.

**Native token exception ([PLAT-06](service-standard.md#plat-native)).** A Flutter or React Native team that copies token values records an exception renewed under ASR-02 until the generated token output for its framework is published.

**What an exception cannot do.** It does not change the truth of an accessibility statement: a known failure is still listed as a failure. It cannot waive a legal duty or a provider's security requirement ([ASR-04](service-standard.md#assurance)).

---

<a id="transition"></a>

## 9. Bringing live services into the standard

The conformance tiers are set in the Service Standard ([TRN-01 to TRN-05](service-standard.md#transition)). This is how a channel brings its live services in.

1. **Inventory.** The channel product owner lists every live service on the channel with its owning entity, platform and risk tier.
2. **Minimum public duty check.** Each live service is checked against the minimum public duty set ([TRN-03](service-standard.md#transition)) using a self-assessment, sampled by the central assurance team. Failures go into a dated remediation plan.
3. **Roadmap.** The channel publishes a roadmap with, for each service, the date of its next major change or re-platforming, when it will meet the full standard.
4. **Report.** Progress against the roadmap is reported each quarter with the measures ([10](#releases)).

---

<a id="releases"></a>

## 10. Releases and measures

**Release record ([ASR-06](service-standard.md#assurance)).** Each release names the standard version, the library and token versions it uses, its open defects and exceptions, and the people who approved it. The template is in [12.4](#tpl-release).

**Measures.** Services report the [measures](service-standard.md#measures) each quarter to the channel product owner, who publishes a performance page per channel. The issuing authority publishes a summary of assessment outcomes per channel; its format is agreed with entity leadership at adoption.

---

<a id="contracts"></a>

## 11. Using the standard in contracts

Entities that procure delivery from suppliers cite the standard in the contract so that suppliers can price compliance and entities can reject work that does not meet it.

A contract should state:

- **Version.** The Service Standard version the work is built and assessed against, and the design system major version.
- **Must-pass list.** That the service must meet the [must-pass list](service-standard.md#appendix-must-pass) at beta, and the full standard at live.
- **Evidence.** The evidence deliverables for each assessment ([5](#evidence)), including the WCAG register, test records, the question protocol and recovery-state tests.
- **Defects.** Defect classes using the severities in [8](#exceptions), with fix times for each.
- **Accessibility warranty.** That accessibility defects found within an agreed period after go-live are fixed at no extra cost.
- **Handover.** Code, the accessibility register and the exception records are handed over with the service.
- **Procurement reference.** Where an accessibility standard must be cited, EN 301 549 ([A11Y-01](service-standard.md#a11y-baseline)). A service that meets the Service Standard meets EN 301 549 clause 9 (web). Where a contract requires EN 301 549 V3.2.1 or Section 508, record 4.1.1 Parsing as supported: the HTML validates, with no duplicate IDs and no incorrectly nested elements.

Model clauses in Arabic and English are to be drafted with entity procurement and legal teams.

---

<a id="templates"></a>

## 12. Templates

<a id="tpl-report"></a>

### 12.1 Assessment report

| Section | Content |
| --- | --- |
| Service | Name (both languages), `service_id`, owning entity, channels, risk tier, phase assessed, assessment date |
| Route | Central panel, channel panel or self-assessment |
| Panel | Names and roles, including the Arabic content and accessibility specialists |
| Standard version | The version of the Service Standard assessed against |
| Outcome | Met or not met overall |
| Point by point | For each of the 12 points: met, met with conditions or not met; what the team did well; what must change (each linked to requirement identifiers); conditions with owners and dates; recommendations |
| Exceptions | Exceptions in force or requested, with severity and end dates |
| Next steps | Points to reassess and the date by which to do so |

<a id="tpl-statement"></a>

### 12.2 Accessibility statement

Each service publishes this statement in both languages ([A11Y-12](service-standard.md#a11y-statement)). Headings are fixed; the content in braces is the service's own.

| English heading | Arabic heading | Content |
| --- | --- | --- |
| Accessibility statement for {service name} | بيان إمكانية الوصول لخدمة {اسم الخدمة} | Which pages, apps and documents the statement covers |
| Using this service | استخدام هذه الخدمة | What people should be able to do: zoom to 400%, use the keyboard only, use a screen reader in Arabic or English, change colours and text spacing, use the service in light or dark mode |
| How accessible this service is | مدى إمكانية الوصول إلى هذه الخدمة | A plain-language list of the parts that are not fully accessible |
| What to do if you cannot use part of this service | ما يمكن فعله عند تعذّر استخدام جزء من الخدمة | Alternative routes and how to request information in another format, with the response time confirmed by the owner |
| Reporting accessibility problems | الإبلاغ عن مشكلات إمكانية الوصول | How to contact the service team, and what happens next |
| Compliance status | حالة المطابقة | "This service fully meets / partially meets / does not meet WCAG 2.2 Level AA", consistent with the register |
| Content that is not accessible | المحتوى غير المتاح للجميع | Each failure: what it affects, the WCAG criterion, and the date it will be fixed |
| How we tested this service | كيفية اختبار هذه الخدمة | Who tested it, when, what was tested and with which assistive technologies and voices |
| What we are doing to improve accessibility | ما نقوم به لتحسين إمكانية الوصول | The remediation plan with dates |
| Preparation of this statement | إعداد هذا البيان | The date the statement was prepared and last reviewed |

**Wording and approval.** Listing known failures in public is new for many entities. Describe each failure by its effect on people and what they can do instead, not by blame or technical cause. The entity's communications and legal teams review the statement within 10 working days; if they have not responded by then, the statement is published as written, because the standard requires it to be honest ([A11Y-13](service-standard.md#a11y-statement)).

<a id="tpl-exception"></a>

### 12.3 Exception record

| Field | Content |
| --- | --- |
| Requirement identifiers | The rules not met |
| Scope | Services, platforms, languages and users affected |
| Barrier | What people cannot do, in plain language |
| Severity | 1, 2 or 3 ([8](#exceptions)) |
| Options considered | Including the design system's interim approach |
| Interim support | What people can do instead, and how it is staffed and measured |
| Remediation | Owner and date |
| End date | At most 90 days from approval |
| Approved by | Name, role and date |
| Reviews | Dates and decisions |

<a id="tpl-release"></a>

### 12.4 Release record

| Field | Content |
| --- | --- |
| Service and release | `service_id`, release identifier, date |
| Versions | Service Standard, design system library, tokens |
| Change size | Minor, major (as [A11Y-10](service-standard.md#a11y-testing) uses it) |
| Tests | Automated results; manual accessibility scope (full matrix or smoke set) |
| Open defects | With severity |
| Exceptions | In force, with end dates |
| Approved by | Names and roles |
