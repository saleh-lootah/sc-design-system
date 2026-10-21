# sc-radio · specification (v2)

The radio and its group share one specification; it is repeated here so each tag has its own file.

Status: rebuilt for v2 by C3 (Wave 2b). Visual rules: `docs/v2/component-language.md` A10 and A11. Shared field anatomy (legend, hint, error, bar): `specs/sc-text-input.md`; option row: `specs/sc-checkbox-group.md` (the same `choice.css`). Code: `src/components/sc-radio-group`, `src/components/sc-radio`.

One choice from a short list ("Who issued the plate?", "Is the vehicle insured?").

## Encapsulation

**Light DOM (Stencil `scoped`)**, decision A2, both tags. The group renders a native `<fieldset role="radiogroup">` with its legend, hint and error and moves the `sc-radio` children in; each `sc-radio` renders a native radio, label and hint. All radios share the group's `name` in one tree, so the browser provides the radio group behaviour. v1 rendered every radio in the group's shadow root with manual slot assignment; v2 needs neither.

## Anatomy

| # | Part | Class | Notes |
| --- | --- | --- | --- |
| 1 | Fieldset, legend, hint, error, bar | `.sc-field*` | As `sc-text-input`; legend label-large, or the page heading |
| 2 | Options | `.sc-choice-group__options` | Column, gap 8; `inline`: wrapping row, gap 24 |
| 3 | Option row | `.sc-choice` | At least 48 tall, 44px target column, 12 from radio to label |
| 4 | Radio | `.sc-choice__box--radio` | 24px circle, 2px `outline` edge (proposed in component-language; 1.5px reads thin on a circle) |
| 5 | Dot | `.sc-choice__mark--radio` | 12px `channel-action`; the edge also turns `channel-action` |
| 6 | Halo | `.sc-choice__halo` | 40px `on-surface` 8% circle on hover (fine pointers) |
| 7 | Label, option hint | `.sc-choice__label`, `.sc-choice__hint` | body-large; body-medium `on-surface-variant`, 4 below |

## States

| State | Rule |
| --- | --- |
| Hover | Halo; edge `outline-strong` |
| Checked | Edge and dot `channel-action` |
| Focus | U1 ring round the 24px circle |
| Error | 2px `error` edge on every radio, the bar and the message; the fieldset has `aria-invalid` |
| Disabled | `disabled-container` fill, `on-disabled` edge, dot and label; through the fieldset or per option |
| Forced colours | Edge `ButtonText`, checked `Highlight` edge and dot |

## Worst-case data (break-ui)

- An option label with a value (`2 years · <sc-ltr>AED 900</sc-ltr>`) keeps the amount left-to-right in Arabic.
- Two inline options with long Arabic labels wrap onto two rows.
- Options added after load join the group.

## Accessibility

- A radiogroup named by the legend (`aria-labelledby`), described by hint and error; `aria-required` with `required`.
- Native radios: one Tab stop, arrows move and select (they wrap), Space selects, position in set.
- `required`: native `valueMissing` on the radios.

## RTL and Arabic

The radio sits on the right of its label; the bar is on the right; arrow keys behave natively in RTL (Down and Right both move forward in DOM order as the platform defines). Labels 20/32; the radio stays 24.

## Motion

The dot scales from 0.5 to 1 with opacity over 120ms with `easing-hover`, pointer only; from the keyboard it appears at once (MOT-02). Never from 0 (MOT-08). Under reduced motion it only fades.

## Code

```html
<sc-radio-group name="issuer" label="Who issued the plate?" hint="It's shown on the plate" required>
  <sc-radio value="dubai">Dubai</sc-radio>
  <sc-radio value="abu-dhabi" hint="Including Al Ain">Abu Dhabi</sc-radio>
</sc-radio-group>
```

| Tag | Properties | Events |
| --- | --- | --- |
| `sc-radio-group` | label, hint, error, optional, name, value, required, disabled, inline, heading-level | `scChange` `{ value }`; native `change` bubbles |
| `sc-radio` | value, hint, checked (initial), disabled | – |

## Strings

`sc-field.ts` only (`sc-radio-group.ts` keeps `radioGroupRequired` for the legacy dictionary; v2 uses the browser's own `valueMissing` message).

## Budget

Form field, 7 KiB gzip (group); `sc-radio` 4 KiB leaf. Measured in the C3 report.

## Tests

`sc-radio-group.spec.tsx`, `sc-radio.spec.tsx`, `sc-radio-group.e2e.ts` (radiogroup semantics, keyboard, Space and click, Arabic, submit/reset/required, later options, fieldset, host focus, dot motion, forced colours, axe on every channel, `describeAxe`), `sc-radio.e2e.ts` (name, hint, 24px circle and 44px target, focus, `describeAxe`), and the visual suites for both tags.
