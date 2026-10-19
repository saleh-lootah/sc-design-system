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

<!-- Auto Generated Below -->


## Overview

Keeps a value left-to-right inside any text, e.g. a plate number, amount, reference or
phone number in an Arabic sentence. Renders `<bdi dir="ltr">` around its content.

Shadow DOM is used on purpose: the author's text stays in the light DOM (searchable,
copyable, untouched), and layout follows the flat tree, so the `<bdi>` isolates the
slotted text from the surrounding paragraph exactly as a `<bdi>` written in place would.
The host is also `unicode-bidi: isolate; direction: ltr` (here and in sc.css), so the
value is isolated even before the component upgrades.

## Slots

| Slot | Description                      |
| ---- | -------------------------------- |
|      | The value to keep left-to-right. |


----------------------------------------------


