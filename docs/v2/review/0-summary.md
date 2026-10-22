# Standard review · consolidated findings

Five critics reviewed the Shared Channels UX Standard (v2 draft, 22 October 2026). Their full reports are in this folder:

| Critic | Verdict | Findings |
| --- | --- | --- |
| 1 · Fact checker | The numbers are almost all right (120+ internal claims checked) | 22: 6 wrong, 13 imprecise, 3 unverified |
| 2 · Contradictions | The rules are internally sound; a few library behaviours break them | 41: 2 blocker, 8 major, 31 minor |
| 3 · WCAG 2.2 | Broadly aligned with AA; all 55 criteria registered | 30: 7 fail risks, 12 gaps, 11 improvements |
| 4 · Government | Strong service behaviour, but it can't be adopted as binding yet | 42: 3 blocker, 24 major, 15 minor |
| 5 · Content (CEO) | 6/10: good rules inside a document that isn't publishable yet | 40: must fix, should fix and polish |

What every critic praises: the service behaviour rules (no success before the server confirms it, duplicate payments prevented, recovery states), Arabic and English parity, content design and the status vocabulary, the honest accessibility statement, testable "How we check" sections, and accurate numbers.

## A · Decisions for the user (strategic)

1. **Issuing authority and status.** No body is named to adopt and enforce the standard (OQ-14), and its relationship with the Dubai Digital Authority and UAE Design System is open (OQ-7). Both the government and content critics: either name the authority, or publish as a **consultation draft**, not as binding.
2. **Split into three documents** (government and content critics agree):
   - a short **Service Standard**: policy and the MUSTs services are assessed on, about 900 lines, published in Arabic and English on the same day
   - a **Design System reference**: tokens, components, motion and budgets, versioned with the library and not assessed
   - an **Assurance handbook**: panels, evidence, templates and exceptions
3. **Transition and conformance tiers for live services.** There is no plan for existing sites, legacy vendor platforms or deadlines. Proposed: tiers by service risk and reach, with dated targets.
4. **An assessment model that scales.** Three gates and six-person panels for every service doesn't scale: Dubai Now alone has about 280 services from 44 entities. Proposed: risk-based assessment, self-assessment for low-risk changes, central panels for high-risk services, and exceptions approved by the channel owner with central oversight.
5. **Public wording of internal choices.**
   - Naming and banning the Dubai Design System teal in a public standard reads as criticism of a sister authority. Keep the rule internally and word it neutrally, for example "channel colours are set centrally in the token files".
   - The motion chapter credits an individual's GitHub "skills". Keep the rules, and move the credit to the bibliography or remove it.
6. **Multi-entity rules that may be too strict:**
   - entity logos are banned outright (an attribution-only logo row could be allowed)
   - marketing is banned on Visit Dubai and Invest in Dubai, which exist to promote
   - the status vocabulary is closed, and doesn't cover court or customs stages
   - UAE PASS and Dubai Pay are exclusive, with no route for visitors, overseas investors or TradePay
7. **Official Arabic channel names.** Only دبي الآن، استثمر في دبي and زوروا دبي are confirmed from an official source. Dubai Media Office (May 2025) describes the transport channel as «قناة التنقل المشتركة», so مواصلات دبي، عدالة دبي، ابنِ في دبي and دبي التجارية need confirming.
8. **Missing Dubai mandates** to decide whether to include: the Happiness Meter and 04 complaints as requirements, the Dubai Electronic Security Center baseline, data residency, AI chat assistants, and languages other than Arabic and English.

## B · Library bugs: a service using our components would fail the standard

| # | Issue | Source | Fix |
| --- | --- | --- | --- |
| B1 | `sc-footer`, `sc-utility-bar` and `sc-language-switch` render nothing without JavaScript, which breaks PERF-04 (help and navigation work without JS) | Contradictions, blocker | Render real links in light DOM, or progressive-enhancement fallbacks |
| B2 | `sc-breadcrumbs` links are 24px; `sc-date-range` month buttons are 36px. Both break the 44px rule | Contradictions blocker; WCAG | Extend the targets to 44px |
| B3 | Session timeout: what Escape does is undefined; the sheet can be dragged closed; no `aria-describedby` | WCAG F-1 | Escape means "stay signed in"; no drag-to-dismiss for `alert`; add describedby; the warning at least 2 minutes before |
| B4 | Sticky parts inside components cover focus: the `sc-table` sticky column, and the date-range sheet's weekday row and footer | WCAG F-2, F-3 (2.4.11) | Scroll padding, or no sticky part at small sizes |
| B5 | The date-range sheet at 320px: seven 44px columns don't fit | WCAG F-4 (1.4.10) | Narrower cells with 44px targets through overlap rules, or a single-column agenda |
| B6 | Pasted codes fail because U+2066/U+2069 isolates in SMS are copied into fields | WCAG F-16 (3.3.8) | Fields strip bidi control characters from pasted input (amend LANG-21) |
| B7 | In Arabic, "Bold means current" is lost because short Arabic text is already Bold (D12) | WCAG gap | Add a second cue: an indicator bar or underline |
| B8 | Link underlines are inconsistent with CMP-08 (footer, breadcrumbs, cards, chips, skip link) | Contradictions, major | Decide the rule: running-text links are always underlined, navigation links underline on hover, and say so |
| B9 | A dismissed announcement is remembered in `localStorage` before consent (PRV-12) | Contradictions | Session storage only, or count it as strictly necessary and say so |
| B10 | The `sc-date-range` popover isn't instant when opened from the keyboard (MOT-02, OQ-28) | Fact check | Implement it and test it |
| B11 | MOT-09 "respond on press" invites firing on pointer-down | WCAG F-5 (2.5.2) | Reword: visual feedback on press, activation on release |
| B12 | The sticky app bar plus the fixed utility bar take over a quarter of short screens at high zoom | WCAG F-6 | Make the utility bar static below a viewport height |

## C · Document corrections (editorial)

- **Facts:**
  - CMP-05 doesn't follow GOV.UK: GOV.UK keeps `role="alert"`. Keep our rule, but drop the claim.
  - Law No. (1) of 2025: prior authorisation applies to non-government and commercial entities (Article 6(b)); the usage manual is Article 7.
  - Links in running text are exempt from 2.5.8.
  - Concatenated SMS segments hold 67 characters.
  - The scrim duration, icon optical size and stepper sizes are wrong in places.
  - The date: the draft is dated tomorrow.
- **Open questions that can now close:**
  - OQ-1: WCAG 2.2 was first published 5 October 2023; the current edition is 12 December 2024.
  - OQ-2: WCAG2ICT is at https://www.w3.org/TR/wcag2ict-22/.
  - OQ-10 (dirham symbol U+20C3) needs confirming on unicode.org.
- **Contradictions to resolve:**
  - legend role (`label-large`, W11)
  - docked-bar elevation (flat with a hairline)
  - the 10.3 "Known gaps" heading is now empty
  - the lockup and UAE PASS colour exemption isn't stated in FND-01
  - PLAT-06 exception has no end date
  - two wrong anchors
  - foundations.md and architecture.md are stale (A1 fallback, W21, U2, 9 KiB sc.css)
  - COMPONENTS.md is still largely v1 (native teams are told to build from it)
- **Arabic:** «قد تحتاج» (gender-marked) in the eligibility example, plus three stiff examples.
- **Hygiene:**
  - 52 "(changed in v2)" tags
  - v1, Phase 1 and Phase 3 references
  - 16 repository paths and npm scripts
  - a bug list inside the standard
  - about 70 numbered rules with no MUST or SHOULD
  - duplicated rules (mirroring, focus, the error page title, target sizes)
  - over-long rules (A11Y-05 runs to about 190 words)
- **Budgets:** record approval of the 4 KiB page CSS (W13), `sc-bottom-nav` (W14) and `sc-date-range` (W10) in `perf-budgets.json`, which still says "proposed".

## D · Beyond AA, recommended

- Adopt these AAA criteria, most of which are already met: 2.4.12, 2.4.13, 2.5.5, 2.2.5, 2.2.6, 2.3.3, 3.3.9.
- Name EN 301 549 as the procurement reference (V3.2.1 now, V4.1.1 once cited).
- The support matrix names Arabic voices, braille, speech input, Narrator and magnifiers.
- Add a rule against CAPTCHAs (3.3.8).
- Add rules for tooltips, media, positional instructions in mirrored layouts, third-party widgets and overlays, accessible PDF receipts (Arabic text extraction), label in name, single-key shortcuts, and orientation.
