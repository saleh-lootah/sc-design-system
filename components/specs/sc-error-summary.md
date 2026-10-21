# sc-error-summary · specification (v2)

Status: rebuilt for v2 by C4 (Wave 2b). Rules: `docs/v2/component-language.md` A16, CMP-05 (Standard 10.3), Q-04, decision W1. Code: `src/components/sc-error-summary`.

Lists every error at the top of `<main>` after a submission; each item links to its field.

## Encapsulation

**Shadow DOM** (chrome and display; architecture §2.5 confirms `href="#id"` focus works across the boundary). Slotted `<a>` children are data: the component reads them (with a MutationObserver) and renders its own list.

## Anatomy

| # | Part | Notes |
| --- | --- | --- |
| 1 | Box (`container`) | `tabindex="-1"`, `role="group"`, `aria-labelledby` the heading. No `role="alert"`, no live region (CMP-05). Fill `error-container`, 2px `error` border (`size-border-strong`), radius 8, padding 16, gap 6. The U1 ring shows outside the border on focus. |
| 2 | Heading (`heading`) | `h2` (or `heading-level` 3–4). "There is a problem" / "توجد مشكلة" (W1). `title-medium` (Bold), `on-surface`. |
| 3 | Description | Optional `slot="description"`, `body-medium`. |
| 4 | List (`list`) | `<ul>`, no bullets. Links `body-large` Bold in `error`, underlined 1px at 5px (2px on fine-pointer hover, 120ms), each at least 44 × 44 (A11Y-04), rows touching. |

Dark: error-20 fill, error-80 border and links.

## Behaviour

- Focus moves to the box when it goes from no errors to some (load or `errors` set), unless `no-autofocus`; `setFocus()` does it on demand.
- A link click scrolls the target into view (centre) and focuses it. v2 fields are light DOM, so the target can be the native control or the field host (`focus()` forwarded). Targets are looked up in the summary's own root first, then the document.
- Hidden (`display: none`) when there are no errors.

## RTL

Text and links align right in Arabic. References inside messages: wrap in `<bdi dir="ltr">`.

## Changes from v1

- Look: the "!" badge, the thicker start border and the elevation-1 shadow are gone; error-container fill, 2px border all round, 8px radius.
- The focus ring is the neutral U1 ring (v1: channel colour).
- Strings: own file `sc-error-summary.ts` (`errorSummaryHeading`). API, slots and parts unchanged.

## Budget

6 KiB (architecture §3.7). Measured **3.1 KiB** gzip; CSS 0.5 KiB.

## Tests

Spec (heading, slotted and nested links, group role, no live region, `errors` property, empty, heading level, Arabic), e2e (focus on load without alert, `no-autofocus` and `setFocus()`, focusing plain and delegating targets with scroll, keyboard, targets in a shadow root, late `errors`, slot updates, Arabic heading and alignment, box and link tokens and 44px links, neutral ring on every channel), `describeAxe`, visual (focused, EN/AR × light/dark).
