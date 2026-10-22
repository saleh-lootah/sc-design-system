# sc-filter-chips · specification (v2, new)

Status: new in v2, built by C3 (Wave 2b). Visual rules: `docs/v2/component-language.md` B18 (the applied-filter kind) and decision Q-chips. Paper board: v2 file, page 07, "Filter chips" (AQQ-0). Code: `src/components/sc-filter-chips`.

The filters applied to a list of results, as removable chips beside the result count ("24 results · Transport and vehicles × · Paid online ×"), with "Clear all filters".

## Encapsulation

**Light DOM (Stencil `scoped`)**, as the coordinator assigned to the forms family: native `<button>`s and a `<ul>` that service CSS and tests reach directly, and focus moves to a heading in the page. Architecture §3.1 listed "filter chips" with the shadow display components; nothing here needs encapsulation, and light DOM keeps it consistent with the other form controls. Recorded for the coordinator.

## Anatomy

| # | Part | Class | Notes |
| --- | --- | --- | --- |
| 1 | Group | `.sc-filter-chips` | `role="group"` named "Applied filters" / "عوامل التصفية المطبّقة" (or `label`); a wrapping row, gap 12; hidden when empty |
| 2 | List | `.sc-filter-chips__list` | `<ul>`, one `<li>` per filter |
| 3 | Chip | `.sc-filter-chips__chip` | A native button, **32 tall** (`size-chip`, Q-chips) with a 44px invisible target (6px above and below); pill (`radius-full`); padding 12 at the start, 8 at the end; gap 6; `channel-subtle` fill; label-medium in `channel-action` |
| 4 | Close | `.sc-filter-chips__close` | 18px close icon at inline-end, `channel-action`. A symbol: not mirrored |
| 5 | Clear all | `.sc-filter-chips__clear` | From two filters: a link-style button, label-medium, `channel-action`, underlined 1px at 4px (5px Arabic), 44px target |
| 6 | Live region | visually hidden | polite, atomic |

## States

| State | Rule |
| --- | --- |
| Hover (fine pointers) | Chip `channel-container`; clear underline 2px; 120ms |
| Pressed (pointer) | Scale 0.97 over 150ms; never from the keyboard (MOT-02). Visual only: a chip removes, and Clear all clears, on release (the native `click`), so pressing, sliding off and releasing does nothing (WCAG 2.5.2) |
| Focus | U1 ring (3px `focus-ring`, 2px offset) round the pill |
| Forced colours | Chip edge `ButtonText` |

## Behaviour

- Removing a chip takes it away at once (no exit animation), emits `scRemove` `{ value, label }`, announces "Filter removed: Paid online. 1 filter applied", and moves focus to the next chip, else the previous, else `focus-target` (made focusable with `tabindex="-1"` when needed).
- "Clear all filters" empties the list, emits `scClear`, announces "No filters applied" and focuses `focus-target`.
- A new `filters` list from the page with a different count is announced ("3 filters applied").
- The page filters its results on the events; the component never fetches.

## Worst-case data (break-ui)

- A long label ("Roads and Transport Authority services") wraps the row, not the chip.
- One filter: no "Clear all".
- Arabic plurals: عامل تصفية واحد مطبّق، عاملا تصفية مطبّقان، 3 عوامل تصفية مطبّقة، 11 عاملًا مطبّقًا.

## Accessibility

Each chip is a button named "Remove filter: <label>" (the visible label is `aria-hidden` inside it, so it is read once); the group is named; count changes are announced politely; a 44px target on a 32px chip; colour is not the only cue (the close icon and the name).

## RTL and Arabic

Chips flow from the right; the close sits at inline-end (the left). Arabic labels are label-medium Arabic (18/24 Bold, D12). Digits stay Latin.

## Motion

Colour over 120ms (hover); press scale 0.97; removal is instant.

## Paper board differences

Board AQQ-0 draws applied chips **40px** tall with 16px padding and a 20px close (component-language B18). Decision Q-chips (which wins) sets chips at 32px with a 44px target and keeps 40px for interactive suggestion chips; the coordinator's brief asked for 32px. The code is 32px, padding 12/8, close 18. The board also proposes a general `sc-chip` child with suggestion and toggle modes; this tag implements the applied-filter kind only (the board marks its API as a proposal).

## Code

```html
<h2 id="results">24 results</h2>
<sc-filter-chips focus-target="results"
  filters='[{"value":"transport","label":"Transport and vehicles"},{"value":"online","label":"Paid online"}]'></sc-filter-chips>
```

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| filters | `{ value, label }[]` or JSON | `[]` | The applied filters, in order |
| label | string | "Applied filters" | The group's name |
| focus-target | string (id) | – | Gets focus when the last chip goes |
| no-clear | boolean | false | Hides "Clear all filters" |

| Event | Detail |
| --- | --- |
| `scRemove` | `{ value, label }` |
| `scClear` | – |

## Strings

`src/i18n/components/sc-filter-chips.ts` (also listed in the legacy `index.ts`, so the strings spec checks it).

## Budget

Leaf, 4 KiB gzip; measured in the C3 report.

## Tests

`sc-filter-chips.spec.tsx`, `sc-filter-chips.e2e.ts` (names, 32/44 geometry and colours, removal and focus order, clear all, page-driven count, Arabic plurals and RTL, pointer-only press, press-and-slide-off removes nothing while a click does, axe on every channel, `describeAxe`), `sc-filter-chips.visual.e2e.ts`.
