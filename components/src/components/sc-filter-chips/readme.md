# sc-filter-chips

The filters applied to a list of results, as removable chips beside the result count, with "Clear all filters" from two filters. New in v2.

## Usage

```html
<h2 id="results">24 results</h2>
<sc-filter-chips id="applied" focus-target="results"
  filters='[{"value":"transport","label":"Transport and vehicles"},{"value":"online","label":"Paid online"}]'></sc-filter-chips>
<script>
  const chips = document.getElementById('applied');
  chips.addEventListener('scRemove', (ev) => refreshResults({ without: ev.detail.value }));
  chips.addEventListener('scClear', () => refreshResults({ filters: [] }));
</script>
```

- Each chip is a native button named "Remove filter: Transport and vehicles". Removing one takes it away at once and moves focus to the next chip, else the previous, else `focus-target` (your results heading).
- Count changes are announced politely: "Filter removed: Paid online. 1 filter applied".
- Chips are 32px tall with a 44px target (decision Q-chips), `channel-subtle` with `channel-action` text.
- Set `filters` (an array or JSON) when your page adds or changes filters; the component announces the new count.
- Light DOM: style with `.sc-filter-chips__chip` if you must.

<!-- Auto Generated Below -->


## Overview

The filters applied to a list of results, as removable chips beside the result count, with
"Clear all filters" when there are two or more (component-language B18, applied filter).

Each chip is a native `<button>` named "Remove filter: Transport and vehicles". Removing one
takes it away at once (no animation), emits `scRemove`, and moves focus to the next chip,
else the previous one, else the element named by `focus-target` (the results heading).
Every change in the number of filters is announced politely: "2 filters applied".
The page updates its results on `scRemove` / `scClear`; set `filters` to change the chips.

Chips are 32px tall (decision Q-chips) with a 44px target. Light DOM (Stencil `scoped`).

## Properties

| Property      | Attribute      | Description                                                                                                                                                                 | Type                     | Default     |
| ------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ----------- |
| `filters`     | `filters`      | The applied filters, in order: an array of `{ value, label }`, or the same as JSON in the attribute (`filters='[{"value":"transport","label":"Transport and vehicles"}]'`). | `FilterChip[] \| string` | `[]`        |
| `focusTarget` | `focus-target` | The id of the element that gets focus when the last chip goes, usually the results heading. It is made focusable (`tabindex="-1"`) if it isn't.                             | `string \| undefined`    | `undefined` |
| `label`       | `label`        | The group's accessible name. Defaults to "Applied filters" ("عوامل التصفية المطبّقة").                                                                                      | `string \| undefined`    | `undefined` |
| `noClear`     | `no-clear`     | Hides "Clear all filters".                                                                                                                                                  | `boolean`                | `false`     |


## Events

| Event      | Description                                                                      | Type                      |
| ---------- | -------------------------------------------------------------------------------- | ------------------------- |
| `scClear`  | Fires when "Clear all filters" is used. Every chip is already gone.              | `CustomEvent<void>`       |
| `scRemove` | Fires when a chip is removed, with `{ value, label }`. The chip is already gone. | `CustomEvent<FilterChip>` |


----------------------------------------------


