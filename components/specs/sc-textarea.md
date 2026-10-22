# sc-textarea · specification (v2)

Status: rebuilt for v2 by C3 (Wave 2b). Visual rules: `docs/v2/component-language.md` A8. Shared field anatomy, states and accessibility: `specs/sc-text-input.md`. Code: `src/components/sc-textarea`.

A longer answer: why a registration is being cancelled, a description of damage, a note for the inspector.

## Encapsulation

**Light DOM (Stencil `scoped`)**, decision A2: a native `<textarea>` with the shared label, hint and error (`field.css` + `sc-textarea.css`). Per-instance IDs; `focus()` forwarded; rich `label`, `hint` and `error` children moved once.

## Anatomy

| # | Part | Class | Notes |
| --- | --- | --- | --- |
| 1–5 | Group, error bar, label, hint, error | `.sc-field*` | As `sc-text-input` |
| 6 | Box | `.sc-field__frame.sc-textarea__frame` | Radius 8, 1.5px `outline`; grows with `rows` (at least 3) |
| 7 | Control | `.sc-textarea__control` | Padding 12 block, 16 inline; body-large with body leading (18/26 EN, 20/32 AR); vertical resize only |
| 8 | Count | `.sc-textarea__count` | 8 below the box, body-medium, `on-surface-variant`, aligned to inline-start; `aria-hidden` |
| 9 | Limit | visually hidden | "You can enter up to 200 characters", in the description |
| 10 | Live region | visually hidden | polite, atomic: the count, after a 1s pause |

## States

As `sc-text-input`. Over the limit: the count turns `error` Bold ("You have 6 characters too many"), the box gets the 2px `error` edge and `aria-invalid`, and the textarea has a custom validity error with the same words, so the form won't submit. Text is never cut off.

## Worst-case data (break-ui)

- Arabic counts use the right plural for the number (حرف واحد، حرفان، 3 أحرف، 120 حرفًا، 100 حرف).
- Emoji and combined characters count as one (user-perceived characters).
- Arabic-Indic digits typed into the text become Latin digits (LANG-21). Bidirectional control characters (U+200E, U+200F, U+202A–U+202E, U+2066–U+2069), which a code copied from an Arabic SMS often carries, are removed from pasted or typed text, with the caret kept on the same character (R9, amends LANG-21).

## Accessibility

Name from the label; description: hint, error, limit. The visible count is hidden from assistive technology; the polite live region speaks once typing pauses for 1 second, never on every keystroke. Enter adds a line; it never submits.

## RTL and Arabic

Mirrors through logical properties; the count aligns to inline-start; the error bar is on the right.

## Motion

None beyond the shared 120ms edge colour on hover.

## Code

```html
<sc-textarea name="reason" label="Why are you cancelling the registration?" hint="For example, the vehicle was sold or exported" maxlength="200"></sc-textarea>
```

Properties as `sc-text-input` (label, hint, error, optional, name, value, required, disabled, readonly, autocomplete, heading-level), plus `rows` (default 5, at least 3) and `maxlength` (shows the count; doesn't cut text). Events `scInput` and `scChange` with `{ value }`; native `input` and `change` bubble.

## Strings

`src/i18n/components/sc-textarea.ts` (the limit and the count, one key per Arabic plural category) plus `sc-field.ts`.

## Budget

Form field, 7 KiB gzip. Measured: see the report table in `docs/v2/migration.md` (C3 section).

## Tests

`sc-textarea.spec.tsx`, `sc-textarea.e2e.ts` (light DOM, description, count and polite announcement, over-limit validity, submit/reset/fieldset, Enter never submits, LANG-21 and pasted bidi controls (R9), Arabic plurals, type, axe on every channel, `describeAxe`), `sc-textarea.visual.e2e.ts`.

## Paper board alignment

Board 3SS-0 matches (radius 8, padding 12 × 16, at least 3 rows, count 8 below). Kept as built: the board's count reads "28 of 300 characters"; the code keeps v1's tested wording, "You have 272 characters remaining", with Arabic plurals.
