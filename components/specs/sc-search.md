# sc-search · specification (v2)

Status: rebuilt for v2 by C3 (Wave 2b). Visual rules: `docs/v2/component-language.md` A25 and E1 (the hero search). Code: `src/components/sc-search`.

A search field and its button, for finding services ("Search Dubai Now services") or results.

## Encapsulation

**Light DOM (Stencil `scoped`)**, decision A2 (architecture §3.1 lists `sc-search` with the form fields). It renders a `<form role="search">`, a native `<input type="search">` and an `sc-button type="submit"` as its own children, so Enter in the field submits through the button natively (v1's shadow `sc-button` needed the form inside the same shadow root). `focus()` on the host goes to the input. It does not use `field.css`: its field box is its own, so the bundle stays inside budget with `sc-button` in its closure.

## Anatomy

| # | Part | Class | Notes |
| --- | --- | --- | --- |
| 1 | Form | `.sc-search` | `role="search"`, named by the label |
| 2 | Label | `.sc-search__label` | label-large, `on-surface`; `label-hidden` keeps it for screen readers only |
| 3 | Row | `.sc-search__row` | The field and the button side by side, gap 12 (E1: siblings, not one pill) |
| 4 | Field box | `.sc-search__field` | Radius 8, 1.5px `outline`, `surface`. `m`: 56 tall, padding 16; `l`: 64 tall, padding 20. Gap 12 |
| 5 | Icon | `.sc-search__icon` | Magnifier, 24 (`m`) / 26 (`l`), `on-surface-variant`. Not mirrored |
| 6 | Input | `.sc-search__input` | Native `type="search"`, body-large, `on-surface`; placeholder `on-surface-variant` |
| 7 | Button | `.sc-search__button` | `sc-button` primary, 56 (`size="l"`) or 64 (`size="xl"`), radius 4 |

## States

| State | Rule |
| --- | --- |
| Hover (fine pointers) | Field edge `outline-strong` |
| Focus | U1 ring round the field box while the input has focus; the button has its own ring |
| Forced colours | Field edge `ButtonText`, ring `Highlight` |

## Worst-case data (break-ui)

- A long Arabic placeholder ends at the field's edge; the button keeps its width.
- On a 320px screen the field shrinks; the button never wraps its label.

## Accessibility

A search landmark named by the label (visible or visually hidden) and a searchbox with the same name. Tab reaches the field, then the button. Enter submits. Escape clears the native search field; the browser's own clear button is hidden (one way is enough).

## RTL and Arabic

The icon is on the right and the button on the left. The default label and button read "بحث". Digits typed in Arabic-Indic forms become Latin (LANG-21). Bidi control characters pasted with a code (U+200E, U+200F, U+202A–U+202E, U+2066–U+2069) are removed (R9, amends LANG-21).

## Motion

The edge colour over 120ms on hover; nothing else moves.

## Code

```html
<sc-search size="l" label="Search Dubai Now services" placeholder="Try “school fees”" action="/search"></sc-search>
```

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| label | string | "Search" / "بحث" | |
| label-hidden | boolean | false | |
| placeholder | string | – | Example queries |
| button-text | string | "Search" / "بحث" | |
| name | string | `q` | Query parameter |
| value | string | '' | |
| action | string | – | Results page (GET) |
| size | `m` \| `l` | `m` | **New in v2**: `l` is the 64px hero search |

| Event | Detail |
| --- | --- |
| `scSearch` | `{ value }`, trimmed; cancelable (stops navigation to `action`) |

Method: `setFocus()`.

## Strings

`sc-search.ts` (`searchLabel`, `searchButton`).

## Budget

**8 KiB gzip** in `perf-budgets.json`, not the 7 KiB form-field budget, for the same reason as `sc-button`'s 5 KiB: the custom-elements closure counts `sc-button` in full. Measured on this branch (each file gzipped on its own):

| Part | gzip |
| --- | --- |
| `sc-search` module, including its CSS | 2.3 KiB |
| Its strings, the digit normaliser and `defineStrings` | 0.5 KiB |
| `sc-button` module, its strings | 3.0 KiB |
| Locale controller (shared by every component with strings) | 0.9 KiB |
| Icon set (from `sc-button`'s `icon` prop) | 0.8 KiB |
| **Closure, excluding the runtime** | **7.4 KiB** (7,594 B) |

On a page with any `sc-button`, the search's own cost is 2.8 KiB. v1 was 10.3 KiB.

## Tests

`sc-search.spec.tsx`, `sc-search.e2e.ts` (landmark and searchbox names, keyboard and native Enter-to-submit, click, host focus and the U1 ring, sizes and E1 geometry, `action` and cancel, LANG-21 and pasted bidi controls (R9), RTL, channel colour, forced colours, `describeAxe`), `sc-search.visual.e2e.ts`.

## Paper board alignment

Board AQP-0 matches; the 64px hero button is now padded 36.
