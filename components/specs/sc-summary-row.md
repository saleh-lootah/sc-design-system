# sc-summary-row · specification (v2)

Status: rebuilt for v2 by C5 (Wave 2b) with `sc-summary-list`; see `specs/sc-summary-list.md` for layout, type and accessibility.

One answer in a `sc-summary-list`: the key (`label`), the value (its content) and an optional action.

## Encapsulation

**Light DOM (Stencil `scoped`)**. The row carries data and its value. The list renders the `<dt>`, the value `<dd>` and the action, and moves the row into the value `<dd>`. Use it only as a direct child of `sc-summary-list`. The attributes the list renders from are reflected (`label`, `action-href`, `action-text`, `action-hidden-text`, `variant`), so setting them as properties also re-renders the list.

## Anatomy

| # | Part | Notes |
| --- | --- | --- |
| 1 | Host (`.sc-summary-row`) | `display: block` inside the value `<dd>`; takes the value's type. Its content, else `value`, else "Not provided". |

## Code

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| label | string | – | The key. Required |
| value | string | – | Plain-text value when there is no content |
| action-href | string | – | Adds the action; ignored in `pairs` |
| action-text | string | "Change" | The action's visible text |
| action-hidden-text | string | `label` | Visually hidden text after it |
| variant | `"default"` \| `"total"` | `"default"` | The amount row of a payment summary (new) |

Slot: default (the value). **v1 to v2:** no shadow root; the internal update event is gone; `action-text` and `action-hidden-text` now reflect; `variant` is new.

## Budget

1.8 KiB gzip closure; leaf budget 4 KiB.

## Tests

`sc-summary-row.spec.tsx` (light DOM, value prop, "Not provided" in both languages, reflection); `sc-summary-row.e2e.ts` (rich content, value, fallback inside a list; `describeAxe`).
