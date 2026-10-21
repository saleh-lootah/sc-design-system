# sc-checkbox · specification (v2)

The checkbox and its group share one specification; it is repeated here so each tag has its own file.

Status: rebuilt for v2 by C3 (Wave 2b). Visual rules: `docs/v2/component-language.md` A12 and A13. Shared field anatomy (legend, hint, error, bar): `specs/sc-text-input.md`. Code: `src/components/sc-checkbox-group`, `src/components/sc-checkbox`, styles in `sc-text-input/choice.css`.

Several choices from a short list ("Which documents do you have?"), or one checkbox on its own for a single statement ("I confirm the vehicle details are correct").

## Encapsulation

**Light DOM (Stencil `scoped`)**, decision A2, both tags. The group renders a native `<fieldset>`/`<legend>` and moves the `sc-checkbox` children inside it (default slot, plus an observer for boxes added later). Each `sc-checkbox` renders a native `<input type="checkbox">`, `<label for>` and hint. Per-instance IDs; `focus()` on either host is forwarded to the first enabled box. v1 needed a shadow root per checkbox and a form-associated group; v2 needs neither.

## Anatomy

| # | Part | Class | Notes |
| --- | --- | --- | --- |
| 1 | Fieldset, legend, hint, error, bar | `.sc-field*` | As `sc-text-input`; the legend is label-large, or the page heading with `heading-level` |
| 2 | Options | `.sc-choice-group__options` | Column, gap 8; `inline`: a wrapping row, gap 24 |
| 3 | Option row | `.sc-choice` | At least 48 tall (`size-control-secondary`); a 44px target column (`size-target-min`), shifted back so the box lines up with the legend; 12 from box to label |
| 4 | Halo | `.sc-choice__halo` | 40px circle behind the box: `on-surface` at 8% on hover (fine pointers) |
| 5 | Box | `.sc-choice__box--check` | 24 × 24, radius 4 (`radius-control`), 2px `outline` edge (`size-border-strong`), `surface` |
| 6 | Check | `.sc-choice__mark--check` | 18px, 3px stroke, `channel-on-action` on a `channel-action` fill. A symbol: never mirrors |
| 7 | Label | `.sc-choice__label` | body-large, `on-surface`; covers the target column so the whole row toggles |
| 8 | Option hint | `.sc-choice__hint` | body-medium, `on-surface-variant`, 4 below the label, indented to it |

## States

| State | Rule |
| --- | --- |
| Hover (fine pointers) | Halo at 8%; edge `outline-strong` |
| Checked | Fill and edge `channel-action`, check in `channel-on-action` |
| Focus | U1 ring round the 24px box (3px, 2px offset, radius 4) |
| Error | 2px `error` edge on every box, `aria-invalid`; the group (or a lone checkbox) shows the bar and the message |
| Disabled | `disabled-container` fill, `on-disabled` edge and label; checked: `on-disabled` fill |
| Forced colours | Edge `ButtonText`, checked `Highlight` with a `HighlightText` check |

## Worst-case data (break-ui)

- A two-line Arabic label wraps beside the box; the box stays aligned with the first line.
- `inline` options wrap on narrow screens.

## Accessibility

- Group: native fieldset named by its legend, described by hint and error.
- Box: a native checkbox named by its content, described by its hint (and its own error on its own).
- `required` on the group: the first enabled box carries a custom validity message ("Select at least one option" / "يُرجى اختيار خيار واحد على الأقل") until one is checked. On its own, `required` is native `valueMissing`.
- Tab reaches each box; Space toggles.

## RTL and Arabic

The box sits on the right of its label; the error bar is on the right; the check does not mirror. Labels 20/32, hints 18/28; the box stays 24.

## Motion

The check draws over 120ms (stroke-dashoffset) and fills over 120ms with `easing-hover`, pointer only; from the keyboard it appears at once (MOT-02). The halo fades over 120ms.

## Code

```html
<sc-checkbox-group name="documents" label="Which documents do you have?" hint="Select all that apply" required>
  <sc-checkbox value="insurance">Valid insurance policy</sc-checkbox>
  <sc-checkbox value="inspection" hint="From a centre approved by RTA">Technical inspection certificate</sc-checkbox>
</sc-checkbox-group>
<sc-checkbox name="confirm" value="yes" required>I confirm the vehicle details are correct</sc-checkbox>
```

| Tag | Properties | Events |
| --- | --- | --- |
| `sc-checkbox-group` | label, hint, error, optional, name, required, disabled, inline, heading-level | `scGroupChange` `{ value: string[] }` |
| `sc-checkbox` | name, value (`on`), checked, hint, error (on its own), required (on its own), disabled | `scChange` `{ checked, value }`; native `change` bubbles |

## Strings

`sc-checkbox-group.ts` (`checkboxGroupRequired`) plus `sc-field.ts`.

## Budget

Form field, 7 KiB gzip each; measured in the C3 report.

## Tests

`sc-checkbox-group.spec.tsx`, `sc-checkbox.spec.tsx`, `sc-checkbox-group.e2e.ts` (group semantics, keyboard, native submission, reset, required, group error, geometry in AR/EN, disabled, boxes added later, forced colours, axe on every channel, `describeAxe`), `sc-checkbox.e2e.ts` (on its own: name, hint, error, 44px target, MOT-02, `describeAxe`), and the visual suites for both tags.
