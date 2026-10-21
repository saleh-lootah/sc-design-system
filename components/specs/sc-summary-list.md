# sc-summary-list · specification (v2)

Status: rebuilt for v2 by C5 (Wave 2b). Visual rules: `docs/v2/component-language.md` A26–A27, §3.4 (E3, check answers) and §3.5 (E4, payment review), read through the role table in `decisions.md`. Code: `src/components/sc-summary-list` with `sc-summary-row`.

The details of one thing, as rows of a key, a value and an optional "Change" action: "Check your answers" and the payment summary. Use `sc-table` to compare several things.

## Encapsulation

**Light DOM (Stencil `scoped`)**, architecture §3.1 (lists with native semantics). The list renders one `<dl>` in light DOM: a `<div>` per row with the `<dt>` (from the row's `label`), the value `<dd>` and the action `<dd>`. Each `sc-summary-row` is moved into its own value `<dd>` through a per-row named slot whose name is stable for the row's lifetime (`sc-summary-row-<n>`), so adding or removing rows never re-slots the others. The `<dl>` is valid HTML and passes axe's `definition-list` and `dlitem` rules (a custom element directly inside a `<dl>` would not). A MutationObserver re-renders on rows added, removed, hidden, or changing a rendered attribute; v1's internal `sc-summary-row-update` event is gone. Styles sit in `@layer sc.components`.

## Anatomy

| # | Part | Notes |
| --- | --- | --- |
| 1 | List (`.sc-summary-list__list`) | Card: 1px `outline-variant` edge, radius 12, `surface-card`, `overflow: clip` (the total row's fill follows the corners). Plain: no card, a rule above the first row and below each row. |
| 2 | Row (`.sc-summary-list__row`) | Padding 12 block (16 in columns), 16 inline (24 from 600px in a card). 1px `outline-variant` rules between rows. |
| 3 | Key (`dt`) | `body-medium`, `on-surface-variant`. |
| 4 | Value (`dd`) | `title-small` (17/22 Medium; AR 19/28 Bold), `on-surface`. Holds the row element. |
| 5 | Action (`dd`, optional) | A link, `label-medium`, `channel-action`, underlined 1px at 4px (5px Arabic), 2px on hover, 44 × 44 target; "Change" plus the key as visually hidden text. |
| 6 | Total row (`variant="total"`) | `surface-container` fill, key `title-medium`, value `title-large`. |

## Layouts

| Layout | Structure |
| --- | --- |
| `auto` (default) | `stacked` below 600px of the list's own width, `columns` from there (a container query) |
| `stacked` (E3) | Key above value (2 apart), the action in a fixed 64px end column, centred. Rows without an action keep the empty column |
| `columns` | Key, value (1fr : 2fr) and a fixed 96px action column (`--sc-summary-list-action-width`), on a shared baseline |
| `pairs` (E4) | Key in a fixed 104px column (120 in Arabic), value **end-aligned** (`text-align: end`, never `right`; it is left in Arabic). Actions are not rendered |

## Accessibility

- One `<dl>`; each action's name is "Change <key>" (overridable with `action-text` and `action-hidden-text`).
- A row with no value reads "Not provided" / "لم يتم تقديمه" (TPL-13).
- Forced colours: card edge `CanvasText`, links `LinkText`, a 1.5px rule above the total.

## RTL and Arabic

Key on the right, action on the left; pair values align left. Values in LTR scripts are isolated by the author (`<sc-ltr>`).

## Motion

Link underline thickness over 120ms on hover (fine pointers); keyboard focus instant.

## Code

```html
<sc-summary-list>
  <sc-summary-row label="Plate">Dubai <sc-ltr>A 48213</sc-ltr></sc-summary-row>
  <sc-summary-row label="Renew for" action-href="/renew/period">1 year, until 3 November 2027</sc-summary-row>
</sc-summary-list>

<sc-summary-list layout="pairs">
  <sc-summary-row label="Payment reference"><sc-ltr>DT-2026-0048213</sc-ltr></sc-summary-row>
  <sc-summary-row label="Amount" variant="total"><sc-ltr>AED 420.00</sc-ltr></sc-summary-row>
</sc-summary-list>
```

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| appearance | `"card"` \| `"plain"` | `"card"` | Card, or rules only inside another card |
| layout | `"auto"` \| `"stacked"` \| `"columns"` \| `"pairs"` | `"auto"` | New in v2 |

Slot: default (`sc-summary-row` children; others are ignored). No events. **v1 to v2:** the shadow root and its parts (`list`, `row`, `key`, `value`, `action`) are gone: the `<dl>` is light DOM with classes `.sc-summary-list__list`, `__row`, `__key`, `__value`, `__action`, `__link`. Rows get a generated `slot` attribute. `layout` and the total row are new.

## Strings

`src/i18n/components/sc-summary-list.ts`: `summaryChange`. `sc-summary-row.ts`: `summaryRowNotProvided`.

## Budget

3.2 KiB gzip closure (includes the shared locale controller chunk); leaf budget 4 KiB. `sc-summary-row` 1.8 KiB.

## Tests

`sc-summary-list.spec.tsx`; `sc-summary-list.e2e.ts` (light-DOM `dl` structure with rows inside value `dd`s, action names, Tab and Enter, 44px underlined targets, card metrics, columns at 800, stacked at 360 with a 64px column, pairs end-aligned in both directions with 104/120 key columns and a filled bold total, Arabic mirroring, language and channel changes, rows added, removed and changed, forced colours, `describeAxe`); `sc-summary-list.visual.e2e.ts` (narrow and wide, EN/AR × light/dark).
