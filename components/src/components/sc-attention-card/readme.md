# sc-attention-card

One thing that is due ("Needs your attention"): a thin topic-tint strip, an icon tile, a status tag in words, the title, the key fact, a meta line and one action. Specification: `specs/sc-attention-card.md`.

## Usage

```html
<ul class="due">
  <li>
    <sc-attention-card tint="amber">
      <svg slot="icon" …></svg>
      <sc-status-tag slot="status" tone="warning">Not paid</sc-status-tag>
      Electricity and water bill
      <span slot="fact">Due tomorrow, 21 Oct 2026</span>
      <span slot="meta"><sc-ltr>AED 412.60</sc-ltr> · DEWA account <sc-ltr>2004 1187</sc-ltr></span>
      <sc-button slot="action" variant="secondary" size="m" href="/pay/dewa">Pay <sc-ltr>AED 412.60</sc-ltr></sc-button>
    </sc-attention-card>
  </li>
</ul>
```

<!-- Auto Generated Below -->
