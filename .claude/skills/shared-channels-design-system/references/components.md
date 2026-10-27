# sc- component catalogue (v2)

Use this table to choose a component. Before writing markup, read the component's API, states and content rules in `components/specs/<tag>.md`, or in the Usage section of `components/src/components/<tag>/readme.md`.

How each component is built:

- **Light**: light DOM (Stencil `scoped`). The native elements are children of the host, so forms, labels and ARIA work as they do natively. There is no `::part()`: override with the BEM classes (`.sc-<tag>__<part>`).
- **Shadow**: shadow DOM. Style it through its `part`s. It never contains a form control.
- **CSS**: no JavaScript and no registration. `sc.css` styles the markup the page writes.

## Page shell and site chrome

| Tag | Mode | Use for | Not for |
|---|---|---|---|
| `sc-page` | Light | The page frame. `lang`, `channel` and `sync-document`; `header` and `footer` slots; reserves room for a sticky header and the utility bar | |
| `sc-container` | CSS | Max-width container (1280px) with the side margins for each breakpoint; reading width 680px | |
| `sc-grid` | CSS | 4, 8 or 12 columns with the gutters for each breakpoint | |
| `sc-skip-link` | Shadow | "Skip to main content", first in the header; targets `#main-content` | |
| `sc-official-banner` | CSS | "Official websites use .gov.ae", a native `<details>` | |
| `sc-environment-banner` | CSS | Marks a draft, staging or test environment | |
| `sc-announcement-bar` | Shadow | A site-wide message above the header (`info`, `warning`, `error`), dismissible | Messages inside the page: use `sc-callout` |
| `sc-site-header` | Shadow | The channel-site header: `lockup` slot, navigation, search, language, sign in or account menu, channel switcher; `full-from` | Transaction pages: use `sc-app-bar` |
| `sc-channel-switcher` | Light | The channel's logo and a disclosure listing all seven channels, inside the header | |
| `sc-account-menu` | Shadow | A signed-in user's notifications bell and account disclosure (profile, settings, act for, sign out) | Applications and payments: they go in `sc-account-nav` |
| `sc-app-bar` | Shadow | The transaction app bar: back link, title, language switch | Channel-site pages |
| `sc-footer` | CSS | `simple` or `grouped`; the grouped variant may list all seven channels | |
| `sc-utility-bar` | Shadow | Help and feedback, docked flat at the bottom from 1024px; folds into the footer below that width | |
| `sc-channel-network` | Light | "One network · seven channels" strip, in city indigo | |
| `sc-account-nav` | Shadow | Signed-in side navigation with counts and Sign out | |
| `sc-bottom-nav` | Shadow | Signed-in primary navigation below 1024px | |
| `sc-breadcrumbs` | CSS | Where the page sits, outside transactions; collapses to "Back to {parent}" below 600px | Inside a transaction: use `sc-back-link` |

## Actions and navigation

| Tag | Mode | Use for | Not for |
|---|---|---|---|
| `sc-button` | Light | Actions. Variants: `primary` (one per page), `secondary` (outlined), `tertiary` (link-style), `destructive`, `handoff` (Dubai Pay, city indigo). Props: `type`, `href`, `loading`, `icon`, `full-width`, `name`, `value`, `form` | UAE PASS sign in: use the official UAE PASS button |
| `sc-link` | Shadow | Standalone links (`standalone`, `external`) | Links in running text: use `<a class="sc-link">` |
| `.sc-link` class | CSS | A native `<a>` in running text: underlined, channel action colour | |
| `sc-back-link` | Shadow | "Back" in transactions; the chevron mirrors | |
| `sc-language-switch` | Shadow | A link to the same page in the other language, labelled "العربية" or "English" | |
| `sc-pagination` | Shadow | Pages of a long list ("Showing 1–20 of 1,284 fines") | |
| `sc-channel-chip` | Shadow | Attribution to another channel ("Also on Dubai Transport"); sets `data-channel` on itself | Status: use `sc-status-tag` |

## Form fields (all light DOM, all native)

Shared behaviour:

- Props: `label`, `hint`, `error`, `optional`, `name`, `value`, `required` and `heading-level`.
- Slots `label`, `hint`, `error`, `prefix` and `suffix` are moved into place once, when the component loads.
- IDs are per instance. `focus()` on the host is forwarded to the control.
- To restyle, override `.sc-field__*`.

| Tag | Use for | Not for |
|---|---|---|
| `sc-text-input` | One line. `width` (`2`, `3`, `4`, `5`, `10`, `20`, `full`), `ltr` for plates, phones, emails and IBANs, `prefix-text` and `suffix-text` ("AED") | |
| `sc-textarea` | Longer answers, with an optional character count | |
| `sc-select` | One choice from a list too long for radios (an issuing authority, an inspection centre); a native select with `<option>` children | About 7 options or fewer: use `sc-radio-group`. Answers people know by heart: a text input with autocomplete is often easier |
| `sc-radio-group` + `sc-radio` | One choice; the legend can be the `h1`; `inline` for two short options | |
| `sc-checkbox-group` + `sc-checkbox` | Several choices; `sc-checkbox` also works alone | |
| `sc-date-input` | A single date the person knows (day, month, year) | Ranges |
| `sc-date-range` | Start and end dates related to a calendar; submits `name-start` and `name-end` as ISO dates | A known single date |
| `sc-search` | A self-contained search form (`role="search"`); `size="l"` is the 64px hero search | Inside another `<form>` |
| `sc-filter-chips` | Filters applied to a results list: removable chips and "Clear all filters" | Navigation or suggestions |

## Feedback and status

| Tag | Mode | Use for | Not for |
|---|---|---|---|
| `sc-error-summary` | Shadow | All of a page's errors, at the top; links go to the field `id`s; takes focus; "There is a problem" / "توجد مشكلة" | |
| `sc-callout` | Shadow | An important message in the page: `info`, `success`, `warning`, `error` | Site-wide messages: use `sc-announcement-bar` |
| `sc-status-tag` | Shadow | Status of a task or payment, as an icon plus words. Tones: `neutral`, `info`, `success`, `warning`, `error`. `channel` is a non-status highlight such as "Life event" | Another channel: use `sc-channel-chip` |
| `sc-spinner` | Shadow | Inline loading, 20 or 24px, with a label | A loading button: use `sc-button loading` |
| `sc-step-progress` | Shadow | Progress through a transaction: a stepper with channel-coloured done and current steps; compact "Step 2 of 4" below 600px | |
| `sc-step-list` | Light | A life event's steps, including steps that belong to other channels | |
| `sc-timeline` | Light | An application's status history | |
| `sc-notification-list` | Light | Notifications grouped by day; unread items marked; each item is one link | |
| `sc-empty-state` | Shadow | Nothing to show yet; `variant="success"` for the all-clear | |
| `sc-modal` | Shadow | A native `<dialog>` (a bottom sheet below 600px); `alert` for the session timeout | |

## Content and layout

| Tag | Mode | Use for | Not for |
|---|---|---|---|
| `sc-card` | Light | A flat container: `outlined` (default) or `filled` (totals) | Links: a whole card is never a link. Use `sc-service-card` or `sc-tile` |
| `sc-service-card` | Shadow | A link to a service: the title is the only link, with entity attribution text and an optional channel chip | |
| `sc-tile` | Shadow | Life events, categories and favourite services: one link with an icon and an optional count | |
| `sc-attention-card` | Shadow | Something due ("Needs your attention"): a status tag, a fact and one action; not a link | |
| `sc-module-card` | Shadow | A titled module on the signed-in home (Vehicles, Applications, Traffic fines) | |
| `sc-channel-hero` | Shadow | The top of a channel page: a flat `channel-subtle` band with an eyebrow, display heading, lede, search and "Popular now" chips | Gradients: there are none |
| `sc-summary-list` + `sc-summary-row` | Light | Check your answers, or the details of one thing. Layouts `auto`, `stacked`, `columns`, `pairs`; `variant="total"` | Comparing many rows: use `sc-table` |
| `sc-table` | Light | Comparing rows of the same kind (fines, payments). A native `<table>` with a required `caption`, `data-type` columns, sorting, selection, `responsive="stack"` or `"scroll"` | The details of one thing |
| `sc-accordion` | Light | Native `<details>` sections; optional `show-all` | |
| `sc-ltr` | CSS | Keeps a value left-to-right in running Arabic: plates, amounts, references, phone numbers | |

## Known gaps

- `sc-plate`, `sc-icon-tile` and a general `sc-chip` are planned for Wave 3 (W26).
- The UAE PASS button waits for the official kit (U3a).
- Flutter and React Native kits come later (`MOBILE.md`).

If a task needs one of these, say so. Don't fake it with a different component.
