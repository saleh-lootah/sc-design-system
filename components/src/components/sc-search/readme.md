# sc-search

A search box for a channel or a list of services.

## Usage

```html
<sc-search label="Search Dubai Now services" placeholder="Try “renew car registration” or “school fees”" action="/search"></sc-search>
```

```js
document.querySelector('sc-search').addEventListener('scSearch', (ev) => {
  ev.preventDefault();            // handle it in the page instead of going to `action`
  showResults(ev.detail.value);
});
```

- Give it a specific `label` ("Search Dubai Now services"). Hide it visually with `label-hidden` only where the context makes the purpose obvious, such as a hero that asks "What do you need to do?"; screen readers still read it.
- `placeholder` gives example queries. It disappears when typing, so never put instructions there.
- With `action`, submitting goes to that URL with `?q=…` (`name` changes the parameter) after `scSearch`, unless a listener cancels the event. Without `action`, handle `scSearch`.
- The button text defaults to "Search" ("بحث"); change it with `button-text` only for a more specific verb.

### Behaviour

v2 renders `<form role="search">` named by the label, a field box (radius 8, 1.5px `outline` edge, search icon at inline-start) holding a native `<input type="search">`, and a separate primary `sc-button type="submit"` 12px away (E1), all in light DOM (decision A2). Enter in the field submits through the button natively; `scSearch` carries the trimmed query. `focus()` on the host goes to the input, and the U1 focus ring wraps the field box. `size="l"` is the 64px hero search; the default `m` is 56px. Arabic-Indic digits typed into the query become Latin digits (LANG-21). Bidi control characters pasted with a code (U+200E, U+200F, U+202A–U+202E, U+2066–U+2069) are removed (R9, amends LANG-21). The form is self-contained: don't put `sc-search` inside another `<form>`.

### Arabic

The field mirrors: icon on the right, button on the left. The default label and button read "بحث". Search terms are typed in either script; the field follows the page direction.

<!-- Auto Generated Below -->


## Overview

A search field and its button, inside a `<form role="search">` named by the label (E1: the
field and the primary button are siblings with a 12px gap, not one pill).

v2 renders the form, a native `<input type="search">` and an `sc-button type="submit"` in
light DOM (Stencil `scoped`, decision A2), so Enter in the field submits through the button
natively. Submitting emits `scSearch`. With `action`, the form then goes to that URL with the
query as `?<name>=…`, unless a listener calls `preventDefault()`; without `action`, the page
handles `scSearch` itself. Don't nest `sc-search` inside another `<form>`.

## Properties

| Property      | Attribute      | Description                                                                                                                                                                   | Type                  | Default     |
| ------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `action`      | `action`       | The results page. When set, the form submits there with GET after `scSearch`, unless the event is cancelled.                                                                  | `string \| undefined` | `undefined` |
| `buttonText`  | `button-text`  | The button text. Defaults to "Search" ("بحث").                                                                                                                                | `string \| undefined` | `undefined` |
| `label`       | `label`        | The field's label. Defaults to "Search" ("بحث"). Make it specific: "Search Dubai Now services".                                                                               | `string \| undefined` | `undefined` |
| `labelHidden` | `label-hidden` | Hides the label visually; screen readers still read it. Only do this when the context makes the purpose obvious, such as a hero whose heading asks "What do you need to do?". | `boolean`             | `false`     |
| `name`        | `name`         | The query parameter name sent with `action`.                                                                                                                                  | `string`              | `'q'`       |
| `placeholder` | `placeholder`  | Example queries, e.g. `Try "renew car registration"`. A hint, never a replacement for the label.                                                                              | `string \| undefined` | `undefined` |
| `size`        | `size`         | `m` (default): a 56px field and button. `l`: the 64px hero search (E1).                                                                                                       | `"l" \| "m"`          | `'m'`       |
| `value`       | `value`        | The query. Updated as the user types.                                                                                                                                         | `string`              | `''`        |


## Events

| Event      | Description                                                                                            | Type                          |
| ---------- | ------------------------------------------------------------------------------------------------------ | ----------------------------- |
| `scSearch` | Emitted on submit with the trimmed query. Cancelable: `preventDefault()` stops navigation to `action`. | `CustomEvent<ScSearchDetail>` |


## Methods

### `setFocus() => Promise<void>`

Focuses the input.

#### Returns

Type: `Promise<void>`




## Dependencies

### Depends on

- [sc-button](../sc-button)

### Graph
```mermaid
graph TD;
  sc-search --> sc-button
  style sc-search fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


