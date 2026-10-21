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
- A row with no value (an optional question the user skipped) shows "Not provided" ("لم يتم تقديمه"), never an empty value. Leave the row empty rather than writing your own placeholder.
- Keys are short nouns in sentence case. Values are the user's answer, written out ("1 year, until 3 November 2027"), not codes. Wrap plates, amounts, references and phone numbers in `<sc-ltr>`.
- Use `appearance="plain"` when the list sits inside another card.

### Layout

`layout="auto"` (default) responds to the list's own width: below 600px the key sits above the value with the action in a 64px end column (E3); from 600px it shows key, value and a fixed 96px action column. Force either with `stacked` or `columns`. `layout="pairs"` is the payment summary (E4): the key in a fixed column, the value aligned to the end, no actions; mark the amount row with `variant="total"`.

### Semantics

The list renders one `<dl>` in light DOM: a `<div>` per row with the `<dt>` (the row's `label`), the value `<dd>` and the action `<dd>`. Each `sc-summary-row` is moved into its value `<dd>`, so the description list is valid HTML and values stay your own markup. Only `sc-summary-row` children are listed; adding, removing, hiding or changing a row re-renders the list.

### Arabic

Columns mirror: key on the right, action on the left. The action text is "تغيير", followed by the hidden key in the page language.

<!-- Auto Generated Below -->
