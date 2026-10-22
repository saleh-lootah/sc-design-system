# sc-tile

A compact tile that is one link: a tinted icon, a title and an optional plural-aware count. For life events, categories and favourite services. Specification: `specs/sc-tile.md`; Paper board 09.07.

## Usage

```html
<ul class="tiles">
  <li><sc-tile tint="orange" count="14"><svg slot="icon" …></svg><a href="/life-events/moving-home">Moving home</a></sc-tile></li>
</ul>
```

- Write the title as an `<a href>`: it is a working tile before the component upgrades and without JavaScript (the whole box is the link). The upgraded tile takes its `href` and text.
- `href` on the host with the title as text still works, but has no link until the tile upgrades.

<!-- Auto Generated Below -->


## Overview

A compact single-link tile: a tinted icon tile, a title and an optional count. Use it for
life events ("Moving home · 14 services"), categories ("Transport and vehicles") and
favourite services ("Pay a traffic fine").

The whole tile is one link, because the title (and the count) is its only content and so
the link's whole name: "Moving home, 14 services". That does not conflict with CMP-06,
which is about cards that hold more than one thing. Tiles carry no other links or buttons.

Write the title as a light-DOM link, so the tile works before it upgrades and without
JavaScript (PERF-04): `<sc-tile><svg slot="icon">…</svg><a href="/en/moving-home">Moving
home</a></sc-tile>`. `sc.css` draws it as the tile meanwhile, the whole box one link. Once
upgraded the tile takes the link's `href` and text and renders its own link; the child is
then neither shown nor read. The older form, `href` on the host and the title as text, still
works, but shows no link until the tile upgrades.

## Properties

| Property     | Attribute     | Description                                                                                                                                                                                                                                                                 | Type                                                                          | Default     |
| ------------ | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------- |
| `count`      | `count`       | How many things the tile leads to, e.g. 14. Shown as "14 services" with the right plural form in both languages.                                                                                                                                                            | `number \| undefined`                                                         | `undefined` |
| `countLabel` | `count-label` | Overrides the count text, with `{count}` and plural forms separated by `\|`: "{count} step\|{count} steps"; in Arabic zero\|one\|two\|few\|many\|other.                                                                                                                     | `string \| undefined`                                                         | `undefined` |
| `href`       | `href`        | Where the tile goes, when the title is not written as an `<a href>` child.                                                                                                                                                                                                  | `string \| undefined`                                                         | `undefined` |
| `tint`       | `tint`        | The icon tile's decorative topic tint (foundations §2.7): `blue` transport and vehicles, `violet` residency and identity, `rose` family, `orange` housing and utilities, `amber` bills and money, `green` health. Without it the tile takes the channel's container colour. | `"amber" \| "blue" \| "green" \| "orange" \| "rose" \| "violet" \| undefined` | `undefined` |


## Slots

| Slot     | Description                                                                                                                                 |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
|          | The title as an `<a href>` (recommended), or as text with `href` on the host.                                                               |
| `"icon"` | A decorative icon: an inline 24px `<svg>` in `currentColor`, shown in a 40px tile in the `tint` colour (or the channel's container colour). |


## Shadow Parts

| Part      | Description                   |
| --------- | ----------------------------- |
| `"count"` | The count line.               |
| `"icon"`  | The 40px icon tile.           |
| `"link"`  | The `<a>`, which is the tile. |
| `"title"` | The title.                    |


----------------------------------------------


