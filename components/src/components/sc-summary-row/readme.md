# sc-summary-row

One answer in a `sc-summary-list`. See that component for the full pattern.

## Usage

```html
<sc-summary-row label="Delivery address" action-href="/renew/address">
  Villa 14, Street 23<br />Al Sufouh 2, Dubai
</sc-summary-row>
<sc-summary-row label="Email" value="saeed.almansoori@example.ae"></sc-summary-row>
```

- Use it only as a direct child of `sc-summary-list`. The list renders the key, the action and the `<dl>` structure, and sets the row's `slot` attribute; don't set `slot` yourself.
- `label` is the key (required). The value is the default slot, or `value` for plain text. With neither, the row shows "Not provided" ("لم يتم تقديمه"). Leave no whitespace between the tags of an empty row (`<sc-summary-row label="…"></sc-summary-row>`): a slotted space counts as a value.
- `action-href` adds the "Change" link; `action-text` and `action-hidden-text` override its words.

<!-- Auto Generated Below -->


## Overview

One answer in a `sc-summary-list`: a key (`label`), a value (the default slot) and an
optional "Change" action.

The row only carries data and its value. The parent `sc-summary-list` renders the
`<dt>`, `<dd>` and action inside its own `<dl>`, and slots this element into the value
`<dd>`, so the description list stays valid across shadow roots. Use it only as a direct
child of `sc-summary-list`; the list sets its `slot` attribute.

## Properties

| Property             | Attribute            | Description                                                                                                                                                                                                                                                             | Type                  | Default     |
| -------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `actionHiddenText`   | `action-hidden-text` | Visually hidden text after the action text, so screen reader users hear which answer they're changing ("Change Plate number"). Defaults to `label`. Set it when the label alone doesn't read well after the action text, e.g. `action-hidden-text="your plate number"`. | `string \| undefined` | `undefined` |
| `actionHref`         | `action-href`        | Where the action goes, e.g. back to the question with `#plate-number` or a page URL. Without it the row has no action (the action column stays, so values still align).                                                                                                 | `string \| undefined` | `undefined` |
| `actionText`         | `action-text`        | The visible action text. Defaults to "Change" ("تغيير") in the page language.                                                                                                                                                                                           | `string \| undefined` | `undefined` |
| `label` _(required)_ | `label`              | The key: what the answer is about, e.g. "Plate number". Rendered as the `<dt>`. Required.                                                                                                                                                                               | `string`              | `undefined` |
| `value`              | `value`              | A plain-text value, used when the default slot is empty. With neither, the row shows "Not provided".                                                                                                                                                                    | `string \| undefined` | `undefined` |


## Slots

| Slot | Description                                                                                                                                                                                                                                                  |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|      | The value. Text or inline markup; wrap plates, amounts and references in `<sc-ltr>`. Use `<br>` or separate block elements for an address. Falls back to the `value` prop, then to "Not provided" / "لم يتم تقديمه" (an optional question the user skipped). |


----------------------------------------------


