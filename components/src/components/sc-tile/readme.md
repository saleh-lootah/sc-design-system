# sc-tile



<!-- Auto Generated Below -->


## Overview

A compact single-link tile: a tinted icon tile, a title and an optional count. Use it for
life events ("Moving home · 14 services"), categories ("Transport and vehicles") and
favourite services ("Pay a traffic fine").

The whole tile is one link, because the title (and the count) is its only content and so
the link's whole name: "Moving home, 14 services". That does not conflict with CMP-06,
which is about cards that hold more than one thing. Tiles carry no other links or buttons.

## Properties

| Property            | Attribute     | Description                                                                                                                                                                                                                                                                 | Type                                                                          | Default     |
| ------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------- |
| `count`             | `count`       | How many things the tile leads to, e.g. 14. Shown as "14 services" with the right plural form in both languages.                                                                                                                                                            | `number \| undefined`                                                         | `undefined` |
| `countLabel`        | `count-label` | Overrides the count text, with `{count}` and plural forms separated by `\|`: "{count} step\|{count} steps"; in Arabic zero\|one\|two\|few\|many\|other.                                                                                                                     | `string \| undefined`                                                         | `undefined` |
| `href` _(required)_ | `href`        | Where the tile goes. Required.                                                                                                                                                                                                                                              | `string`                                                                      | `undefined` |
| `tint`              | `tint`        | The icon tile's decorative topic tint (foundations §2.7): `blue` transport and vehicles, `violet` residency and identity, `rose` family, `orange` housing and utilities, `amber` bills and money, `green` health. Without it the tile takes the channel's container colour. | `"amber" \| "blue" \| "green" \| "orange" \| "rose" \| "violet" \| undefined` | `undefined` |


## Slots

| Slot     | Description                                                                                                                                 |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
|          | The title, e.g. "Moving home". Text only.                                                                                                   |
| `"icon"` | A decorative icon: an inline 24px `<svg>` in `currentColor`, shown in a 40px tile in the `tint` colour (or the channel's container colour). |


## Shadow Parts

| Part      | Description                   |
| --------- | ----------------------------- |
| `"count"` | The count line.               |
| `"icon"`  | The 40px icon tile.           |
| `"link"`  | The `<a>`, which is the tile. |
| `"title"` | The title.                    |


----------------------------------------------


