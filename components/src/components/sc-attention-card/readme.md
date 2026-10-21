# sc-attention-card



<!-- Auto Generated Below -->


## Overview

One thing that is due ("Needs your attention"): a bill to pay, a document to upload, a
registration about to expire. A thin topic-tint strip on top, an icon tile, a status tag,
the title, the key fact, a meta line (amount and reference) and one action.

The card is neutral and is not a link: the action is the only thing to press, and its
label names the action and the item ("Pay AED 412.60"). Status is never shown by colour:
the strip and the icon tile are decorative topic tints, and the urgency is in the status
tag's words. Put the cards in a list (`<ul>`), most urgent first, under a heading that
gives the count ("4 things, most urgent first").

## Properties

| Property       | Attribute       | Description                                                                                                                                                                                                                                                                                                                                        | Type                                                                          | Default     |
| -------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------- |
| `headingLevel` | `heading-level` | The heading level of the title: 3 under a "Needs your attention" `h2` (default).                                                                                                                                                                                                                                                                   | `2 \| 3 \| 4 \| 5 \| 6`                                                       | `3`         |
| `tint`         | `tint`          | The decorative topic tint of the top strip and the icon tile (foundations §2.7): `amber` bills, `violet` documents and residency, `blue` vehicles, `rose` family, `orange` housing, `green` health. Without it there is no strip and the icon tile takes the channel's container colour. Never use a tint to mean urgency: that is the status tag. | `"amber" \| "blue" \| "green" \| "orange" \| "rose" \| "violet" \| undefined` | `undefined` |


## Slots

| Slot       | Description                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------- |
|            | The title, e.g. "Electricity and water bill". Text only; it becomes a heading.                                |
| `"action"` | One `sc-button variant="secondary" size="m"` (or `href`), named for the action and the item.                  |
| `"fact"`   | The key fact: "Due tomorrow, 21 Oct 2026".                                                                    |
| `"icon"`   | A decorative icon: an inline 24px `<svg>` in `currentColor`, in a 40px tile.                                  |
| `"meta"`   | Amount and reference, each isolated: `<sc-ltr>AED 412.60</sc-ltr> · DEWA account <sc-ltr>2004 1187</sc-ltr>`. |
| `"status"` | An `sc-status-tag` with the urgency in words: "Not paid", "Expires in 21 days".                               |


## Shadow Parts

| Part      | Description         |
| --------- | ------------------- |
| `"card"`  | The surface.        |
| `"icon"`  | The 40px icon tile. |
| `"title"` | The heading.        |


----------------------------------------------


