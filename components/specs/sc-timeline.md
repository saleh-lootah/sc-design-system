# sc-timeline · specification (v2, new)

Status: new in v2, built by C4 (Wave 2b). Rules: `docs/v2/component-language.md` B16. Code: `src/components/sc-timeline`.

The status history of an application.

## Encapsulation

**Light DOM (Stencil `scoped`)** (architecture §3.1: timeline). The author writes `<ol><li><sc-status-tag>…</sc-status-tag><time>…</time><p>…</p></li>…</ol>`; styles in `@layer sc.components`. The component sets `aria-current="step"` and `data-tone` (from the tag's `tone`) on the latest entry, and keeps them current with a MutationObserver.

## Anatomy

| Part | Rule |
| --- | --- |
| Entry | Padding-inline-start 36 (a 24 marker column plus 12); 20 between entries; the time 6 below the tag and the description 2 below the time (board A9D-0). |
| Dot | 12px, centred in the column, centred on the 32px tag. Latest: its tone (`error`, `warning`, `success`, `info`; neutral uses `on-surface-variant`). Earlier: `outline`. |
| Connector | 2px `outline-variant`, from 4 below one dot to the bottom of its entry (board A9C-0); with `divided`, to the rule. None after the last entry. |
| Time | `body-small`, `on-surface-variant`. Latin digits; Dubai W23's digits are tabular. |
| Description | `body-medium`. |
| `divided` | 1px `outline-variant` rules between entries, for a timeline in a card. |

`order="oldest-first"` makes the last entry current.

## RTL

The marker column moves to the right (logical properties).

## Budget

Leaf, 4 KiB. Measured **1.7 KiB** gzip; CSS 0.8 KiB.

## Tests

Spec (light DOM, current and tone, `order`), e2e (dot size and colours, tone updates, connector, `aria-current`, Arabic column), `describeAxe`, visual.
