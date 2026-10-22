# Review 5: content and publishing readiness

Document reviewed: `docs/shared-channels-ux-standard.md`, version 2.0, "Draft for review" (2,157 lines, 20 chapters, 5 appendices, 347 identified requirements across 37 prefixes, 52 "changed in v2" or "new in v2" tags).

Reviewer stance: chief content officer judging the document as a published product for a director-general, product owners, designers, developers and vendors. Benchmark: GOV.UK Service Manual, Service Standard and Design System.

---

## Verdict

**Score: 6 out of 10.**

The rules themselves are very good, close to GOV.UK quality. The service behaviour rules are specific, testable and honest: payments, submissions, status vocabulary, error messages, recovery states and "How we check". The Arabic and English chapter is better than anything GOV.UK has had to write. A delivery team that reads chapters 5, 9, 11, 12 and 13 will build better services. Most of the prose already follows its own content rules: short sentences, active voice, sentence case, UK spelling, no marketing language.

As a document to publish and sign, it is not ready yet. It scores 6 and not 8 for four reasons:

1. **There is no front door.** The first thing a senior official reads is a version note about OKLAB colour, a component prefix and a repository path (lines 67–71). Nothing says, in two minutes, what Shared Channels is, why the standard exists, what is mandatory, when it applies or what changes for each reader. "Shared Channels" is never defined.
2. **It is two documents bound as one.** About a third of it (chapter 8, most of chapters 10 and 11.9, the motion rules, PERF-08 to PERF-11, the platform kit status) is a design system specification: token tables, cubic-bézier values, byte budgets for single components, release velocity in px/ms. That content is accurate and useful, but it belongs in the design system documentation. Here it buries the policy and dates the standard every time the library changes.
3. **Internal process shows through.** It mentions version 1.0 and the "v1 library", "Phase 1" and "Phase 3", 52 change tags, `npm run` scripts, source file paths, a "Known gaps" bug list, open questions that are really tickets (OQ-15, OQ-28), an Emil Kowalski GitHub repository of agent "skills" cited as the basis for a government rule, and a sentence saying a Markdown file wins over every other edition. A public standard should read as settled policy, not as a working repository.
4. **Authority and law are unresolved.** The issuing authority is "to be confirmed" (OQ-14), and chapter 4 (Legal and policy context) is a placeholder. A director-general cannot sign a standard that does not say who issues it. Either settle this or publish clearly as a consultation draft.

There is also a matter of principle. Principle 2 says Arabic and English are equals, but the standard exists only in English. Arabic appears as glosses after the English, often in parentheses. Four of the Arabic examples break the document's own gender-neutral rule or read stiffly (see findings 23 to 26).

Fix the front door, split out the design system detail, clean out internal material and settle the authority question. Then it is an 8 or 9: a standard other governments would copy.

---

## Top 10 changes, in priority order

1. **Write a one-page front door before chapter 0.** Cover what Shared Channels is, who the standard is for, what is mandatory (the 12 points), when it applies, what changes for each role, and why it matters (the value case). See rewrite 1.
2. **Settle or frame the authority.** Name the issuing authority and the adoption date, or retitle the document "Consultation draft" with a closing date and a named owner. Replace the placeholder chapter 4 with a short holding statement, or move it to the open questions until counsel has written it.
3. **Split the policy standard from the design system specification.** Keep in the standard the outcome each rule protects (for example "focus is always visible and never covered", "status never relies on colour", "Arabic text is never smaller than 16px"). Move token tables, type scale values, easing curves, durations, per-component byte budgets, the motion-by-component table and kit status to `docs/v2/foundations.md`, `architecture.md` and the component specs. Link to them by version. This cuts the standard by about 35% and stops it going out of date with each library release.
4. **Remove internal and process material.** That means the 52 "(changed in v2)" or "(new in v2)" tags (put them in the change log), references to version 1.0 and the v1 library, "Phase 1" and "Phase 3", repository paths and `npm` scripts, the "Known gaps" list, OQ-15 and OQ-28, the reviewer documents in the bibliography, the "Paper edition", and the line saying the Markdown file wins.
5. **Make every requirement's force clear.** About 70 identified requirements have no MUST, SHOULD or MAY (for example ELIG-01, ADD-01 to ADD-04, TRACK-01 to TRACK-05, APPT-01, EXIT-01, DATA-01, PRV-13, ASR-03). Either add the keyword or state in 0.3 that an identified rule with no keyword is a MUST. Renumber before the first binding version: FND-24 to FND-29 sit inside FND-07 to FND-23, CMP-07 comes before CMP-05, and LANG-22A is a patch number.
6. **Make Arabic visibly equal.** Commit to an Arabic edition of at least the front door, principles and 12 points at publication, and the full standard at adoption. Show examples in a consistent English | Arabic two-column form rather than "(متابعة)" in brackets. Fix the four Arabic examples in findings 23 to 26. Cite the source of the "official Arabic channel names".
7. **Add layered reading paths.** Add a short "If you are…" table (executive, service owner, product owner, content designer, designer, developer, vendor or assessor) pointing to the chapters each must read. Add a requirement index (appendix) and a bilingual glossary (entity, channel, service, service owner, people of determination, handoff).
8. **Remove duplication.** The document says "Each rule appears once" (line 97), but mirroring is in both 5.6 and 8.6. Focus is in A11Y-05 and 8.8. The "Error:" page title is in CMP-05, TPL-02 and Q-04. Target sizes are in A11Y-04 and FND-15. The error summary focus rule is in CMP-05 and Q-04. The Arabic minimum size is in LANG-27 and FND-28. Keep one rule each and link to it.
9. **Shorten the long requirements.** A11Y-05 (about 190 words), CHR-01, CHR-02, CMP-02, CMP-11, CHR-05 and PERF-10 each break CNT-05 (25 words a sentence, three sentences a paragraph). Split each one into an outcome rule plus a link to the implementation. See rewrite 2.
10. **Reword three citations that would embarrass a public document.** Remove the agent skill names from the motion chapter body and credit the source once in the bibliography (rewrite 3). Keep the teal ban, but state it as a palette rule without naming or disparaging another Dubai Government design system in the body. Drop the tagline "Dubai Design System, evolved", which claims a lineage the next chapter forbids.

---

## Findings

| # | Severity | Line or section | Issue | Rewrite or recommendation |
| --- | --- | --- | --- | --- |
| 1 | Must fix | Lines 1–11, 0.1 | No executive summary. The first substantive paragraph (69) is about `sc-`, channel theming and OKLAB. | Add "The standard on a page" before 0 (rewrite 1). Move the version history to the end. |
| 2 | Must fix | Whole document | "Shared Channels" is never defined: is it an initiative, a platform, a team or seven websites? Who runs it? | Define it in the first paragraph: "Shared Channels is the Government of Dubai's network of seven websites and apps through which people find and use government services. It is run by {body}." |
| 3 | Must fix | Front matter, 0.1, OQ-14 | The issuing authority and owner are "to be confirmed". The standard cannot be adopted or signed as it stands. | Name the authority, or publish as a consultation draft with a closing date and a contact. |
| 4 | Must fix | Chapter 4 | Chapter 4 is a placeholder ("This chapter will list…") inside the binding part of the standard. It names Law No. (1) of 2025 only in passing. | Keep LEG-01 to LEG-04. Replace the narrative with two sentences: "Each service remains responsible for meeting the law that applies to it. A legal annex will follow once confirmed (OQ-5 to OQ-9)." |
| 5 | Must fix | 0.1 line 71 | "The canonical source is this Markdown file… Where an edition disagrees, this file wins." This is internal tooling written as policy. | "The authoritative version is the one published at {URL}. Printed and PDF copies are for reference." |
| 6 | Must fix | 52 places | "(changed in v2)" and "(new in v2)" tags. Readers of a first public standard do not know v1 and do not need its history. | Remove them all. Record changes in a published change log. |
| 7 | Must fix | 10.3 line 1034, OQ-5, OQ-15, bibliography | References to version 1.0, the v1 library, missing v1 artefacts and reviewer documents (`ux-standard-review.md`). | Remove from the body. Keep only in the change log. Delete OQ-15. |
| 8 | Must fix | 10.3 "Known gaps", OQ-28 | Bug reports in a standard ("Two default Arabic strings use the imperative…"; "That `sc-date-range` opens its picker instantly"). | Fix in the library before publishing. Track them in the issue tracker, not the standard. |
| 9 | Must fix | 0.3 and 13 to 16 | About 70 identified rules have no RFC 2119 keyword ("Offer the check…", "State any limit…", "The tracking page shows…"). It is unclear whether they are assessed. | Add keywords, or add to 0.3: "A numbered rule without a keyword is a MUST." |
| 10 | Must fix | Chapter 8, 10.2, 11.9, 15 | A design system specification is mixed into the policy: 15-role type tables, colour role tables, cubic-bézier values, 0.11 px/ms flick velocity, "`sc-breadcrumbs` 4,224 B". It goes out of date with every library release and loses executives and vendors. | Keep the outcome rules. Move the values to `docs/v2/foundations.md`, `architecture.md` and the component specs. Reference them by version ("design system 2.x"). |
| 11 | Must fix | Principle 2 vs the document | The standard says Arabic and English are equals but exists only in English. | Publish an Arabic edition of Part 1 at the same time as the English, and the full standard at adoption. State this in 0.1. |
| 12 | Should fix | 8.7 line 695, Appendix E | The motion rules are "distilled from Emil Kowalski's design engineering skills" with agent skill names (`apple-design`, `mobile-native`). A government standard should not appear to rest on one person's GitHub repository. | Remove from the body (rewrite 3). Credit once under "Acknowledgements" in the bibliography. |
| 13 | Should fix | 8 line 498, FND-04, 8.1 Neutral row | "Dubai Design System, evolved", then a rule banning "The Dubai Design System teal and anything that resembles it", and "never of teal". Publicly naming and banning another Dubai Government system's colour reads as institutional criticism. | Keep the rule. Word it neutrally: "Hues between 160° and 215° (OKLCH) are not used in Shared Channels, so that channels stay distinct from other government systems." Drop the tagline. |
| 14 | Should fix | 7.1, 11.9 line 1221 | "Available (Phase 3 components)" and "carried over from the Phase 1 Dubai Now reference" are internal programme language. | "Available now" or "Planned". Remove the Phase 1 reference. |
| 15 | Should fix | 16 places | Repository paths and scripts (`src/i18n/components/channel-names.ts`, `scripts/generate-palettes.mjs`, `npm run check:literals`). | Name the check, not the script ("the token build's contrast check"). Put paths in the design system documentation. |
| 16 | Should fix | Line 97 vs 5.6/8.6, A11Y-05/8.8, CMP-05/TPL-02/Q-04, A11Y-04/FND-15, LANG-27/FND-28 | The claim "Each rule appears once" is not true. | Keep one source for each rule and replace the others with links. |
| 17 | Should fix | A11Y-05 (line 385) | About 190 words in one requirement, mixing outcome, implementation, exceptions and test method. | Split it (rewrite 2). |
| 18 | Should fix | CHR-01, CHR-02, CHR-05, CMP-02, CMP-11, PERF-10 | Paragraph-length requirements that break CNT-05. CHR-02 has nine sentences on logo artwork. | One outcome per rule. Move the specifics to the chrome specification. |
| 19 | Should fix | Chapter 19 | Open questions take up 27 rows in the body. They make the standard look unfinished and will go out of date. | Move them to a separate live register. Keep a three-line box in 0.1: "Some details are still being confirmed. They are listed at {link}; the standard does not depend on them." |
| 20 | Should fix | OQ-1, OQ-2, OQ-16 | "believed to be 5 October 2023". The WCAG edition date and a GOV.UK URL are checks an editor makes, not open policy questions. | Check them and remove the entries. |
| 21 | Should fix | Contents | No reading paths by role. The order puts Legal (a placeholder) in Part 1 and Platforms (kit status) among the Foundations. | Use the restructure below. Add an "If you are…" table. |
| 22 | Should fix | Whole document | No glossary. "Entity", "channel", "service owner", "handoff", "represented context" and "people of determination" are used before or without being defined. | Add a bilingual glossary appendix. It also seeds CNT-15's shared glossary. |
| 23 | Must fix | 13.2 example (line 1365) | "قد تحتاج إلى خدمة أخرى" uses a second-person verb marked for gender (تحتاج / تحتاجين). This breaks CNT-11. | "قد تلزمك خدمة أخرى" or "قد تكون هناك خدمة أنسب لطلبك". |
| 24 | Should fix | 11.6 TPL-20 (line 1196) | "أكملت 3 من 6 أقسام" reads most naturally as "I completed", and otherwise depends on vocalisation for gender. | "تم إكمال 3 من 6 أقسام". |
| 25 | Should fix | 13.5 example (line 1426) | "نيابةً عمّن يُقدَّم هذا الطلب؟" is grammatical but stilted and legalistic, which goes against CNT-09. | "لمن هذا الطلب؟", with options "لنفسي" / "لمنشأة" / "لشخص آخر". |
| 26 | Should fix | 9.6 "Expires in {n} days", "Not paid" | "ينتهي خلال {n} يومًا" is masculine (it does not agree with رخصة) and is correct only for 11 and above. "Not paid" and "بانتظار الدفع" ("awaiting payment") do not mean the same thing. | "تنتهي الصلاحية خلال {n} يومًا" (with a pointer to LANG-23 plural forms). Align the two meanings: "Payment due" / "مستحق الدفع", or "Awaiting payment" / "بانتظار الدفع". |
| 27 | Should fix | 3.1 line 194 | "These are the official Arabic channel names" gives no source. Some (for example "دبي التجارية") should be checked against the owners' own usage. | Cite the source and date of confirmation, or add the names to OQ-13 until they are confirmed. |
| 28 | Should fix | Throughout | Arabic is shown in brackets after English: "Continue" (متابعة), "Not provided" (لم يتم تقديمه). This signals that Arabic is secondary. | Use a consistent "English / العربية" form inline, and two columns in tables. |
| 29 | Should fix | 2, point 6 | The 12 points, the most important table for executives, mention `sc-` components and generated tokens. | "Uses the shared design system and the channel's look, and contributes improvements back." |
| 30 | Should fix | 15 | PERF-01 to PERF-07 are service rules. PERF-08 to PERF-11 are the design system team's own engineering budgets and do not bind services. | Keep PERF-01 to PERF-07. Move PERF-08 to PERF-11 to `architecture.md`. |
| 31 | Should fix | FND-03, LANG-25, FND-11 | Some MUSTs are obligations on the design system team, or describe how tokens work, not what services must do ("Every colour is defined in OKLAB"). | Rephrase as service obligations ("use the tokens"). Move the build mechanics out. |
| 32 | Should fix | 13 | No vendor-facing summary of what must pass at beta. Vendors need a contractible checklist. | Add an appendix "Beta must-pass list" (about 25 MUSTs that fail assessment) that can be cited in contracts. |
| 33 | Polish | Front matter line 7 | "22 October 2026 (updated to the built design system v2 library)" includes an internal note. The date is also one day in the future. | "Date: {publication date}". |
| 34 | Polish | 12 title | "Ask users for" reads as truncated outside the GOV.UK context. | "Ask users for information" or "Common questions". |
| 35 | Polish | 0.3 | Capitalised MUST and SHOULD read as engineering rather than service manual. | This is acceptable for a contractual standard. Consider the GOV.UK lowercase bold "**must**", which is easier to read in Arabic too. Decide once and apply it to both editions. |
| 36 | Polish | 8.2 FND-13, MOT-06, MOT-07 | Hedged precision: "about 1.05–1.11×", "about 224ms", "within 0.95–0.98". | Give exact values in the foundations document. The standard needs none. |
| 37 | Polish | A11Y-05 | Jargon: "an inset ring that stays whole wins over the 2px outside offset". | "If the ring would be cut off, draw it inside the element." |
| 38 | Polish | 1, principle 7 | "Say 'varies' or 'we are checking' when that is the truth" is good. But "Be honest about what we know" switches to "we", while principles 1 to 6 address the reader. | Keep "we" consistently (the government speaking) or the imperative throughout. |
| 39 | Polish | 10.4 | Planned components with priorities are a roadmap. A roadmap goes out of date quickly in a standard. | Link to a live roadmap. Keep only the "Until it exists" column. |
| 40 | Polish | Appendix A | The register is good. The check prompts use US-style serial commas and slashes ("foreground/background", "clicks/taps"). | Edit to UK house style. Keep the W3C criterion names as they are, as the note says. |

---

## Proposed restructure

The aim is a standard of about 900 lines that a service owner can read in an hour, with the design system detail one click away and versioned separately.

**Front matter**

- Status, owner, version, adoption date (one box)
- The standard on a page: what Shared Channels is, who this is for, what is mandatory, when it applies, what changes for you
- Why this matters: one service, one record, two equal languages, lower cost and fewer failed transactions
- How to use this standard: reading paths by role, how to read MUST and SHOULD, how we check

**Part 1. The standard** (executives, service owners, assessors)

1. Principles
2. The 12 points of the service standard
3. Channels, services and the service record
4. Arabic and English
5. Accessibility
6. Privacy, security and consent
7. Performance and resilience (service rules only: PERF-01 to PERF-07)
8. User research
9. Assurance: roles, assessments, exceptions, release decisions, measures
10. Legal and policy context (when counsel has confirmed it; until then, one paragraph)

**Part 2. Designing the service** (product owners, content designers, designers, developers)

11. Content design (voice, plain English, Arabic style, style guide, error messages, status vocabulary)
12. Ask users for information
13. Page templates (including channel-site chrome, as outcomes)
14. Journey patterns
15. Platforms (outcome rules PLAT-01 to PLAT-04 and native parity PLAT-07 to PLAT-12)

**Part 3. Using the design system** (short; links out)

16. What the design system gives you and what you must use (CMP-01 to CMP-04, FND-01, FND-02, FND-24, a summary of FND-25 to FND-27)
17. Contributing and versioning

**Appendices**

- A. WCAG 2.2 register
- B. Catalogue record
- C. Accessibility statement template
- D. Assessment report template
- E. Beta and live must-pass list (new; contractible)
- F. Requirement index (new)
- G. Glossary, English and Arabic (new)
- H. Bibliography and acknowledgements

**Moved out to the design system documentation** (`docs/v2/`): colour and system role tables, the type scale, size, radius, grid and elevation values, icons and mirroring list, motion values and the per-component motion table, focus implementation, the component index, component decisions (CMP-05 to CMP-12 detail), planned components, library budgets PERF-08 to PERF-11, kit status, and the open questions register.

---

## Before and after: the target voice

### 1. The front door (lines 11 and 67–69)

**Before**

> This standard sets out how Dubai government services are designed, built and assessed across the seven Shared Channels. …
> This is version 2.0, a draft for review. It is not yet binding. … Version 2.0 is a rewrite. It keeps the service behaviour rules of version 1.0 and replaces its technical foundation: the component library is now the Shared Channels web component library (`sc-`), theming is by channel, and every colour is defined in OKLAB.

**After**

> **The standard on a page**
>
> Shared Channels are the seven Government of Dubai websites and apps where people find and use government services: Dubai Now, Dubai Transport, Visit Dubai, Dubai Justice, Build in Dubai, Invest in Dubai and Dubai Trade.
>
> This standard sets what every service on those channels must do, whichever entity owns it. It covers the web and the channel apps, in Arabic and English.
>
> **What is mandatory.** Every service must meet the 12 points in section 2. A service cannot open to the public until it passes its beta assessment, and cannot drop the beta label until it passes its live assessment.
>
> **When it applies.** From {date}, for every new service and for every existing service at its next major change.
>
> **What changes for you.** Entities keep owning their services but no longer brand them: the channel sets the look. Every service launches in Arabic and English on the same day. Payment and sign-in use Dubai Pay and UAE PASS, and a service never shows success before the server confirms it.

### 2. A long requirement (A11Y-05, line 385)

**Before**

> **A11Y-05. Focus indicator** (changed in v2). Focus MUST show the shared focus ring on `:focus-visible` only: a 3px ring (`--sc-size-focus-ring`) drawn 2px outside the element's edge … Where a ring drawn outside the element would be clipped …, the same ring MUST be drawn inside the element's edge instead: an inset ring that stays whole wins over the 2px outside offset. …

**After**

> **A11Y-05. Focus is always visible.** When someone moves through a page with a keyboard, the element they are on MUST show the shared focus ring. The ring looks the same on every channel and in both themes, and has at least 3:1 contrast with what is next to it.
>
> **A11Y-05A. Focus is never covered or cut off.** Sticky headers, bars and banners MUST NOT hide the focused element. If the ring would be cut off at a screen edge, draw it inside the element.
>
> The design system's components already meet both rules. How the ring is built is in *Foundations: focus*.

### 3. A citation that undermines authority (8.7, line 695)

**Before**

> The motion rules are distilled from Emil Kowalski's design engineering skills ([github.com/emilkowalski/skills](https://github.com/emilkowalski/skills): `emil-design-eng`, `animate`, `review-animations`, `animation-performance`, `apple-design` and `mobile-native`). The motion tokens in `tokens/motion.json` implement them.
>
> Motion in a government service has one job: to help people understand what changed.

**After**

> Motion in a government service has one job: to help people see what changed. It is never decoration on a task someone is trying to finish, and most changes should not animate at all.
>
> Use motion only when it keeps a spatial relationship clear, shows a change of state or confirms a press. Anything started from the keyboard happens instantly. The design system's motion tokens set the timings, so services do not choose their own.

(The credit moves to *Bibliography and acknowledgements*.)

---

## What it would take to publish

1. **Week 1 (editorial):** the front door, the glossary and the reading paths. Remove the change tags, version and phase references, file paths and the known gaps list. Fix the Arabic examples (findings 23 to 27). Make every rule's keyword explicit.
2. **Weeks 2–3 (structure):** move the design system detail into `docs/v2/`, cut duplicates, split the long rules, move the open questions out, renumber the requirements, and add the requirement index and must-pass list.
3. **Before signature (governance):** name the issuing authority and adoption date, get counsel's holding statement for the legal chapter, and confirm the channel names and the UAE PASS and Dubai Pay wording with their owners.
4. **Publication:** publish the English and Arabic editions of Part 1 on the same day, with the full Arabic edition to follow by adoption. Each edition should be reviewed by a native editor in that language, not translated one line at a time.
