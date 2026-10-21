# sc-channel-hero · specification (v2)

Status: rebuilt for v2 by C5 (Wave 2b). Visual rules: `docs/v2/component-language.md` A24 and §3.2, decision **Q-hero** (flat `channel-subtle`, no gradient), direction E E1. Code: `src/components/sc-channel-hero`.

The top band of a channel's home or section page.

## Encapsulation

**Shadow DOM** (architecture §3.1). The page's `<h1>`, search and suggestion links stay in light DOM through slots, so they remain the page's own elements. The hero does not use `sc-container` inside its shadow root (it is CSS-only in v2 and cannot reach in): it repeats the page grid margins (20/32/48/80) and the 1280 cap itself, so its content lines up with `sc-container` below.

## Anatomy

| # | Part | Notes |
| --- | --- | --- |
| 1 | Band (`band`) | Full bleed, flat `channel-subtle` (Q-hero; v1's OKLAB gradient wash is retired). Padding 32/40 on phones, 56/56 from 600, 80/80 from 1024. |
| 2 | Content (`content`) | The page grid column. Gap 20 → 24 → 32. |
| 3 | Breadcrumbs (optional) | `slot="breadcrumbs"`, inner pages. |
| 4 | Eyebrow (optional) | `title-small` in `channel-action`. |
| 5 | Heading | The page's `<h1>`, `slot="heading"`: `headline-large` on phones, `display-small` from 600px, `display-large` from 1024px (`size="medium"`: `display-medium`). `text-wrap: balance`. |
| 6 | Lede (optional) | `body-large` in `on-surface-variant`, at most 680 wide. |
| 7 | Search | The default slot (`sc-search size="l"`), at most 880 wide. |
| 8 | Popular (`popular`, optional) | "Popular now" label (`label-medium`, `on-surface-variant`) and `slot="popular"` links drawn as suggestion chips (B18). |

### Suggestion chips

40px capsules (`radius-full`, SHP-01) with a 1px `channel-outline` edge (an inset shadow, so it sits inside the painted capsule), `channel-action` text, `label-medium`, 16 inline padding, 12 apart. The target is 44px (Q-chips): 2px transparent borders above and below, outside the painted area (`background-clip: padding-box`). Hover (fine pointers): `channel-container`. Press: scale 0.97 from a pointer only.

## Accessibility

- The heading stays a real `<h1>` in light DOM.
- The popular row is a `role="group"` named by its label ("Popular now" / "الأكثر طلبًا الآن").
- No carousel, slider or autoplaying media (DDS F-026).
- Contrast: `channel-action` on `channel-subtle` 5.70:1 at the lowest; `on-surface-variant` on `channel-subtle` 5.70:1.
- Forced colours: `Canvas` with a 1px rule beneath; chips get a `LinkText` edge.

## RTL and Arabic

Content aligns right; chips flow from the right. Arabic display sizes come from the type roles (display-large AR 88/108).

## Motion

Chip hover colour over 120ms (fine pointers); press scale over 150ms, never from the keyboard. Nothing else moves.

## Code

```html
<sc-channel-hero>
  <p slot="eyebrow">Government services for everyone who lives in Dubai</p>
  <h1 slot="heading">What do you need to do?</h1>
  <sc-search size="l" label-hidden label="Search services"></sc-search>
  <a slot="popular" href="/services/renew-registration">Renew vehicle registration</a>
  <a slot="popular" href="/services/pay-dewa">Pay water and electricity</a>
</sc-channel-hero>
```

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| size | `"large"` \| `"medium"` | `"large"` | display-large (home) or display-medium (section page) from 1024px |
| popular-label | string | "Popular now" | Overrides the row's label |

Slots: `breadcrumbs`, `eyebrow`, `heading`, `lede`, default (search), `popular`. Parts: `band` (was `wash`), `content`, `popular`. **v1 to v2:** the gradient and `::part(wash)` are gone (use `::part(band)`); the internal `sc-container` is gone; `size`, `popular-label`, and the `breadcrumbs` and `popular` slots are new.

## Strings

`src/i18n/components/sc-channel-hero.ts`: `heroPopular`.

## Budget

3.2 KiB gzip closure (includes the locale controller chunk shared by every component with strings); leaf budget 4 KiB.

## Tests

`sc-channel-hero.spec.tsx`; `sc-channel-hero.e2e.ts` (flat band per channel, heading sizes at three widths, size="medium" and Arabic, eyebrow colour, grid margins in Arabic at four widths, 40px chips on 44px targets, the named group, pointer-only press, empty slots, forced colours, `describeAxe`); `sc-channel-hero.visual.e2e.ts` (desktop and phone, EN/AR × light/dark).
