# sc-select · specification (v2)

Status: rebuilt for v2 by C3 (Wave 2b). Visual rules: `docs/v2/component-language.md` A9 and E2 ("جهة الإصدار"). Shared field anatomy, states and accessibility: `specs/sc-text-input.md`. Code: `src/components/sc-select`.

One choice from a list too long for radios: the emirate that issued a plate, an inspection centre.

## Encapsulation

**Light DOM (Stencil `scoped`)**, decision A2. A native `<select>` with the shared label, hint and error. The `<option>`/`<optgroup>` children are relocated into the select by the default slot on first render, and later additions are moved in by a `MutationObserver`, so they are the real options (v1 copied them into a shadow select). Per-instance IDs; `focus()` forwarded.

## Anatomy

| # | Part | Class | Notes |
| --- | --- | --- | --- |
| 1–5 | Group, error bar, label, hint, error | `.sc-field*` | As `sc-text-input` |
| 6 | Box | `.sc-select__frame` | 56 tall, radius 8, 1.5px `outline`; as wide as the longest option, at least 280, at most the container |
| 7 | Control | `.sc-select__control` | Native `<select>`, padding 16 at the start and 52 at the end; body-large |
| 8 | Chevron | `.sc-select__chevron` | 26px `expand_more` in `on-surface`, 16 from the inline end, pointing down; never mirrors; `on-disabled` when disabled |

## States

As `sc-text-input` (hover `outline-strong`, U1 ring round the box on focus, 2px `error` edge, disabled). The native picker is used; nothing animates.

## Worst-case data (break-ui)

- A long option ("Roads and Transport Authority – Al Barsha inspection centre") ends with an ellipsis inside the box.
- An Arabic option list stays right-aligned with the chevron on the left.

## Accessibility

A native combobox, named by the label and described by hint and error; `aria-invalid` in the error state; `required` with a `value=""` placeholder reports `valueMissing` natively.

## RTL and Arabic

Mirrors: the chevron sits on the left in Arabic and still points down. Value 20/32 in Arabic; the box stays 56.

## Motion

None (the native picker).

## Code

```html
<sc-select name="emirate" label="Issuing authority" value="dubai">
  <option value="dubai">Dubai</option>
  <option value="sharjah">Sharjah</option>
</sc-select>
```

Properties: `label`, `hint`, `error`, `optional`, `name`, `value`, `required`, `disabled`, `autocomplete`, `heading-level`. Event `scChange` `{ value }`; native `change` and `input` bubble. Default slot: options.

## Strings

`sc-field.ts` only.

## Budget

Form field, 7 KiB gzip; measured in the C3 report.

## Tests

`sc-select.spec.tsx`, `sc-select.e2e.ts` (real options in light DOM, name and description, submit/keyboard/reset, initial choice, later options moved in, `valueMissing`, 56px box and chevron geometry in EN and AR, disabled fieldset, axe on every channel, `describeAxe`), `sc-select.visual.e2e.ts`.

## Paper board alignment

Board 6B2-0 matches (56 high, padding 16 / 52, 26px chevron 16 from the inline end, body-large value). No change.
