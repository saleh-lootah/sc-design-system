# sc-ltr

## Usage

Wrap any value that must read left to right whatever the page direction: vehicle plates, amounts, reference numbers, phone numbers, emails.

```html
<p lang="ar" dir="rtl">رقم اللوحة <sc-ltr>Dubai A 12345</sc-ltr> مسجل باسمك.</p>
<p>Amount due: <sc-ltr>AED 450.00</sc-ltr></p>
```

- Digits are always Latin (0–9), in both languages.
- Don't use it for whole sentences in another language; set `lang` and `dir` on that element instead.
- Inside a shadow root (in a component's own template), write `<bdi dir="ltr">` directly instead.

## v2: CSS only

`sc-ltr` is not a registered custom element in v2 (architecture §3.1): `sc.css` gives the tag `direction: ltr; unicode-bidi: isolate`, which is exactly what `<bdi dir="ltr">` does. Nothing changes in markup, and the value is isolated from first paint.
