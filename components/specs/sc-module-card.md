# sc-module-card · specification (v2)

Status: new in v2, built by C5 (Wave 2b). Visual rules: Paper board 09.09, `docs/v2/component-language.md` B13 and B10, the Dubai Now signed-in reference ("At a glance": Vehicles, Applications, Traffic fines). Code: `src/components/sc-module-card`.

A titled module: a header with an optional tinted icon, the title and a link at the end, then the module's content.

## Encapsulation

**Shadow DOM** (architecture §3.1). The content stays light DOM (default slot).

## Anatomy

| # | Part | Notes |
| --- | --- | --- |
| 1 | Card (`card`) | `surface-card`, 1px `outline-variant` edge, radius 12, padding 24. Not a link. |
| 2 | Header (`header`) | Icon tile, title and link in one row, 12 apart. In a narrow card the link wraps below rather than splitting a word of the title. |
| 3 | Icon tile (`icon`, optional) | 40 × 40, radius 8; `tint-<name>` / `on-tint-<name>` or `channel-subtle` / `channel-action`. Decorative. |
| 4 | Title (`title`) | A heading (`heading-level`, default 3) from the `heading` property, `title-large`. |
| 5 | Header link (`link`, optional) | From `action-href` and `action-text`, or `slot="action"`. A standalone link: `label-medium`, `channel-action`, underlined 1px at 4px (5px Arabic), 2px on hover, 44px tall. Its name adds the title as visually hidden text: "View all, Applications". |
| 6 | Body (`body`) | The default slot. Blocks 20 apart; with `divided`, a 1px `outline-variant` rule and 20 of padding above each block after the first. Slotted blocks lose their outer block margins. |
| 7 | Footer (`footer`, optional) | `slot="footer"`: one action, e.g. `sc-button variant="secondary" size="m" full-width` ("Pay all fines"). Pushed to the bottom so footers in a row line up, below a 1px `outline-variant` rule with 20 above the action (board 09.09). |

The plate chip (a 36px box, 12 inline padding, radius 4, a 1.5px `outline-strong` edge, `title-small`) is page markup for now, not part of the component; the playground shows it. Board 09.09 proposes an `sc-plate` element; that is a separate component, not built here.

## Accessibility

Not a link and not a landmark: the heading structures the page. The header link's hidden context keeps repeated "View all" links distinct. A large figure uses `headline-medium` in the content (`.sc-type-headline-medium`).

## RTL and Arabic

Mirrors: icon on the right, link on the left. Plates and amounts stay isolated.

## Motion

Link underline over 120ms on hover (fine pointers).

## Code

```html
<sc-module-card heading="Traffic fines" action-href="/fines" action-text="View fines" tint="amber" divided>
  <svg slot="icon" …></svg>
  <div><p>To pay</p><p class="sc-type-headline-medium"><sc-ltr>AED 600.00</sc-ltr></p></div>
  <p><sc-ltr>F-2026-118204</sc-ltr> · Speeding, 14 Oct 2026</p>
  <sc-button slot="footer" variant="secondary" size="m" full-width href="/fines/pay">Pay all fines</sc-button>
</sc-module-card>
```

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| heading | string | – | The title. Required |
| heading-level | 2–6 | 3 | Heading level |
| action-href | string | – | The header link's target |
| action-text | string | – | The header link's text ("Manage", "View all") |
| tint | `blue` \| `violet` \| `rose` \| `orange` \| `amber` \| `green` | – | Decorative icon-tile tint |
| divided | boolean | false | Rules between content blocks |

Slots: default, `icon`, `action`, `footer`. Parts: `card`, `header`, `icon`, `title`, `link`, `body`, `footer`. No events.

## Differences from board 09.09 (kept in code)

| Board | Code | Why |
| --- | --- | --- |
| Icon tile `channel-container` (tone 90) | `channel-subtle` (tone 95) | The decisions.md role table |
| Header link `slot="link"` (an `sc-link`) | `action-href` + `action-text` (adds the title as hidden text), or `slot="action"` | The board's API is proposed; the code's keeps the hidden context automatic |
| Rules always between body blocks | `divided` (opt-in) | The board's API is proposed; kept so a single block of loose paragraphs is not ruled apart |
| Header link Bold in English | `label-medium` (Medium EN, Bold AR) | W5: type roles only |
| `heading-level` default 2 | 3 | Modules sit under an "At a glance" `h2` |
| `<sc-plate>` | Page markup | A new component, outside this one |

## Budget

2.1 KiB gzip closure; leaf budget 4 KiB.

## Tests

`sc-module-card.spec.tsx`; `sc-module-card.e2e.ts` (headings and link names with context, metrics, link at the end in both directions, rules when divided, the footer at the bottom below a rule, `describeAxe`); `sc-module-card.visual.e2e.ts`.
