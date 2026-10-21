# sc-ltr · specification (v2)

Status: rebuilt for v2 by C5 (Wave 2b). Rules: `component-language.md` A33, `foundations.md` TYP-06 and TYP-07. Code: the `sc-ltr` rule in `src/global/components.css`.

Keeps a value left to right inside any text: plates, amounts, references, phone numbers.

## Encapsulation

**CSS only** (architecture §3.1). Not registered. `sc.css` gives the tag `direction: ltr; unicode-bidi: isolate`, which is exactly what `<bdi dir="ltr">` does, so the value is isolated from first paint with no JavaScript. Inside a shadow root use `<bdi dir="ltr">` or the `.ltr` helper class.

## Anatomy

| # | Part | Notes |
| --- | --- | --- |
| 1 | Host | Inline, `direction: ltr`, `unicode-bidi: isolate`. |

## Rules

- Digits are Latin in both languages (TYP-06).
- Use it for values only, not for whole sentences in another language: set `lang` and `dir` on those.
- Numbers are never mirrored.

## Accessibility

No semantics; the text is read as written.

## Code

```html
<p lang="ar" dir="rtl">رقم اللوحة <sc-ltr>Dubai A 12345</sc-ltr> مسجل باسمك.</p>
```

**v1 to v2:** markup unchanged; the shadow root and its `<bdi>` are gone (the effect is the same).

## Budget

0 bytes of JavaScript; a few bytes of `sc.css`.

## Tests

`sc-ltr.e2e.ts`: not registered and computed `direction: ltr; unicode-bidi: isolate`; a Latin run keeps its order inside Arabic text; `describeAxe`.
