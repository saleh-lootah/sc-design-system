# sc-card

A surface for grouping related content: a life event and its steps, a task, a section of answers. If the whole box is a link to a service, use `sc-service-card` instead; for "Check your answers", `sc-summary-list` draws its own card.

## Usage

```html
<sc-card landmark="section">
  <h2>My tasks</h2>
  <p>Your vehicle registration expires in 15 days.</p>
  <sc-button size="m" variant="secondary" href="/renew">Renew registration</sc-button>
</sc-card>
```

- `padding="l"` (24px) is the default. Use `padding="m"` (16px) for dense content or narrow columns.
- Leave `landmark` unset for most cards: a card is a visual group, not a page region. Set `landmark="section"` only for a part of the page users would want to jump to ("My tasks"), and `landmark="article"` for self-contained content such as a news item. The first heading inside names the landmark; use `label` when there is no heading.
- Start the content with a heading at the right level for the page outline. Don't nest cards.
- Don't make a card clickable by wrapping it in a link; put a link or button inside it, or use `sc-service-card`.

### Arabic

Nothing to configure: padding and radius are symmetrical and content follows the page direction.

### Styling hooks

Part: `surface`. The fill, radius and shadow come from tokens and follow light and dark themes; in forced colours the card keeps a visible edge.

<!-- Auto Generated Below -->


## Overview

A surface container: surface fill, card radius, elevation 1. Groups related content,
such as a life event and its steps, or the answers in one section of "Check your answers".

With `landmark`, the card becomes a named region (`section`) or an `article`, labelled by
the first heading inside it. The role and `aria-labelledby` go on the host, in light DOM,
so the reference to the slotted heading resolves.

## Properties

| Property   | Attribute  | Description                                                                                                                                                                                                                                                             | Type                                  | Default     |
| ---------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | ----------- |
| `label`    | `label`    | Names the landmark when the card has no heading of its own. Ignored without `landmark`.                                                                                                                                                                                 | `string \| undefined`                 | `undefined` |
| `landmark` | `landmark` | Makes the card a landmark. `section` exposes a region (use it for a part of a page a user would want to jump to); `article` is for self-contained content. Both are named by the first heading (`h1`–`h6`) inside the card, or by `label`. Leave unset for a plain box. | `"article" \| "section" \| undefined` | `undefined` |
| `padding`  | `padding`  | Inner padding: `m` is 16px, `l` is 24px (default).                                                                                                                                                                                                                      | `"l" \| "m"`                          | `'l'`       |


## Slots

| Slot | Description                                                           |
| ---- | --------------------------------------------------------------------- |
|      | The card's content. Start with a heading when the card is a landmark. |


## Shadow Parts

| Part        | Description                                        |
| ----------- | -------------------------------------------------- |
| `"surface"` | The inner surface (fill, radius, shadow, padding). |


----------------------------------------------


