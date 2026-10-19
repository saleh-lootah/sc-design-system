# sc-summary-list

The "Check your answers" pattern: the answers a user gave, each with a way to change it, before they submit or pay.

## Usage

```html
<h2>Renewal</h2>
<sc-summary-list>
  <sc-summary-row label="Vehicle">Nissan Patrol 2021, white</sc-summary-row>
  <sc-summary-row label="Plate">Dubai <sc-ltr>A 48213</sc-ltr></sc-summary-row>
  <sc-summary-row label="Renew for" action-href="/renew/period">1 year, until 3 November 2027</sc-summary-row>
  <sc-summary-row label="Insurance" action-href="/renew/insurance">Valid until 14 March 2027</sc-summary-row>
</sc-summary-list>
```

- Group answers under headings that match the journey's sections ("Vehicle", "Renewal"), one list per group.
- Add `action-href` on each row the user can change. The link reads "Change" ("تغيير") with the key as visually hidden text, so screen reader users hear "Change Insurance". Use `action-hidden-text` when the key doesn't read well after "Change", and `action-text` only for a different verb.
- Rows without an action keep the empty action column, so every value starts at the same place.
- Keys are short nouns in sentence case. Values are the user's answer, written out ("1 year, until 3 November 2027"), not codes. Wrap plates, amounts, references and phone numbers in `<sc-ltr>`.
- Use `appearance="plain"` when the list sits inside another card.

### Layout

The list responds to its own width (a container query), not the screen's. From 600px it shows key, value and a fixed 96px action column (`--sc-summary-list-action-width` changes it). Narrower, the key sits above the value and the action moves to the end of the row, as in D+ on mobile.

### Semantics

Description lists can't span shadow roots: a `<dl>` must directly contain `<dt>`/`<dd>` or `<div>` groups, and axe checks that in the flattened tree. So the list renders the entire `<dl>` itself: one `<div>` per row with the `<dt>` (the row's `label`), the value `<dd>` and the action `<dd>`. Each `sc-summary-row` is slotted into its value `<dd>` (the list sets its `slot` attribute), so values stay in light DOM and can hold any inline markup. Only `sc-summary-row` children are listed; adding, removing, hiding or changing a row re-renders the list.

### Arabic

Columns mirror: key on the right, action on the left. The action text is "تغيير", followed by the hidden key in the page language.

<!-- Auto Generated Below -->


## Overview

The "Check your answers" pattern: rows of a key, a value and an optional "Change" action,
as one `<dl>`.

Description lists can't span shadow roots (a `<dl>` must directly contain `<dt>`/`<dd>`
or `<div>` groups), so this component renders the whole `<dl>` in its own shadow root:
one `<div>` per row holding the `<dt>` (from the row's `label`), the value `<dd>` and the
action `<dd>`. Each `sc-summary-row` child is assigned to a named slot inside its value
`<dd>`, so rich values (addresses, `<sc-ltr>` plates) stay in light DOM.

Wide containers show three columns (key, value, a fixed-width action column, so rows
align). Below 600px of container width the key sits above the value, with the action at
the end.

## Properties

| Property     | Attribute    | Description                                                                                                                   | Type                | Default  |
| ------------ | ------------ | ----------------------------------------------------------------------------------------------------------------------------- | ------------------- | -------- |
| `appearance` | `appearance` | `card` (default) sits the rows on a surface card, as in D+; `plain` draws only the row dividers, for use inside another card. | `"card" \| "plain"` | `'card'` |


## Slots

| Slot | Description                                                            |
| ---- | ---------------------------------------------------------------------- |
|      | `sc-summary-row` elements, one per answer. Other children are ignored. |


## Shadow Parts

| Part       | Description         |
| ---------- | ------------------- |
| `"action"` | Each action `<dd>`. |
| `"key"`    | Each `<dt>`.        |
| `"list"`   | The `<dl>`.         |
| `"row"`    | Each row's `<div>`. |
| `"value"`  | Each value `<dd>`.  |


----------------------------------------------


