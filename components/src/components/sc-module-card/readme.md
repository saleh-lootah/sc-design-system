# sc-module-card

A titled module on a signed-in home page ("At a glance"): an optional tinted icon, the title, a link at the end of the header, then the content. Specification: `specs/sc-module-card.md`.

## Usage

```html
<sc-module-card heading="Traffic fines" action-href="/fines" action-text="View fines" tint="amber" divided>
  <svg slot="icon" …></svg>
  <div><p>To pay</p><p class="sc-type-headline-medium"><sc-ltr>AED 600.00</sc-ltr></p></div>
  <p><sc-ltr>F-2026-118204</sc-ltr> · Speeding, 14 Oct 2026</p>
</sc-module-card>
```

<!-- Auto Generated Below -->
