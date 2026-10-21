# sc-tile · specification (v2)

Status: new in v2, built by C5 (Wave 2b). Visual rules: Paper board 09.07 (page 09, still titled `sc-service-tile`; renamed in Wave 4, W6), `docs/v2/component-language.md` B11 and B10, `foundations.md` §2.7 (decorative tints), the Dubai Now reference pages ("Browse by life event", "Favourite services"). Code: `src/components/sc-tile`. The coordinator named it `sc-tile` (component-language's `sc-service-tile`) because it serves life events and categories as well as favourite services.

A compact tile that is one link: a tinted icon, a title and an optional count.

## Encapsulation

**Shadow DOM** with `delegatesFocus` (architecture §3.1, new display components). The title stays light DOM through the default slot.

## Anatomy

| # | Part | Notes |
| --- | --- | --- |
| 1 | Tile (`link`) | The `<a>`. `surface-card`, 1px `outline-variant` edge, radius 12, padding 16, `min-block-size` 112. Icon above the text, 16 apart (board 09.07): the title follows the icon directly, so titles line up across a row and the tile grows below them. |
| 2 | Icon tile (`icon`) | 40 × 40, radius 8, a 24px icon. Fill `tint-<name>` with `on-tint-<name>` (5.70:1), or `channel-subtle` with `channel-action` without a tint. Decorative. |
| 3 | Title (`title`) | `title-small` (17/22 Medium; AR 19/28 Bold), `on-surface`. Up to three lines; never truncated. |
| 4 | Count (`count`, optional) | `body-small`, `on-surface-variant`. Plural-aware in both languages (see Strings), Latin digits with grouping ("1,284 services"). A visually hidden comma separates it from the title in the link name. |

## States

| State | Rule |
| --- | --- |
| Hover (fine pointers) | Edge `outline`, title underlined 1px at 4px (5px Arabic) |
| Pressed | Scale 0.97 over 150ms and a 12% `on-surface` state layer (board 09.07), pointer and touch only |
| Focus | The U1 ring around the tile, following its 12px corners |
| Forced colours | Edge and text `LinkText`; the icon tile outlined in `CanvasText` |

## Differences from board 09.07 (kept in code)

| Board | Code | Why |
| --- | --- | --- |
| Tag `sc-service-tile` | `sc-tile` | W6 |
| Icon tile fill `channel-container` (tone 90) | `channel-subtle` (tone 95) | The role table in decisions.md maps component-language's `channel-container` to `channel-subtle` |
| Label Bold in English | `title-small` (Medium 17/22 EN; Bold 19/28 AR) | W5: type roles only, the token wins |
| No count ("Don't add a count that carries meaning") | Optional `count` | W6: the tile also serves life events and categories, which carry a count |

## Accessibility

The whole tile is one link because its title (and count) is its only content: the name is "Moving home, 14 services". This does not conflict with CMP-06, which forbids making a card with several pieces of content a link. Never put another link or button inside a tile. Tints are decorative (COL-13): the title always carries the meaning.

## RTL and Arabic

Content aligns right. Arabic counts use the six plural forms: لا توجد خدمات، خدمة واحدة، خدمتان، 3 خدمات، 14 خدمة، 100 خدمة.

## Motion

Edge colour over 120ms (fine pointers); press scale over 150ms with `easing-enter`, 1 under reduced motion; keyboard activation instant.

## Code

```html
<ul class="tiles">
  <li><sc-tile href="/life-events/moving-home" tint="orange" count="14"><svg slot="icon" …></svg>Moving home</sc-tile></li>
</ul>
```

Use a list around a set of tiles. Layout (proposed): 6 up at 1440, 3 up from 600, 2 up on phones.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| href | string | – | Required |
| tint | `blue` \| `violet` \| `rose` \| `orange` \| `amber` \| `green` | – | Decorative tint of the icon tile |
| count | number | – | Shown as "14 services" |
| count-label | string | – | `{count}` template with plural forms split by `|` |

Slots: default (title), `icon`. Parts: `link`, `icon`, `title`, `count`. No events.

## Strings

`src/i18n/components/sc-tile.ts`: `tileCount` ("{count} service|{count} services"; Arabic zero|one|two|few|many|other). Plural selection is the shared `src/i18n/plural.ts` (Intl.PluralRules).

## Budget

3.2 KiB gzip closure (includes the shared locale controller chunk); leaf budget 4 KiB.

## Tests

`sc-tile.spec.tsx` (single link, counts in English and in all six Arabic forms with Latin digits and grouping, count-label, no count, tint); `sc-tile.e2e.ts` (link names, Tab and Enter, metrics and tint roles, the U1 ring, pointer-only press, Arabic re-render, `describeAxe`); `sc-tile.visual.e2e.ts`.
