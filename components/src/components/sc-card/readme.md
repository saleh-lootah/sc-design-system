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

- `variant="filled"` gives a quiet fill with no edge: a totals card, or a group inside an outlined area.

### Styling hooks

v2 renders in light DOM: the host is the surface (`.sc-card`), and there is no `::part(surface)`. Cards are flat: a 1px edge and 12px corners, no shadow. In forced colours the card keeps a visible edge.

<!-- Auto Generated Below -->


## Overview

A surface that groups related content: a life event and its steps, the answers in one
section of "Check your answers", a totals card. Flat and outline-first (ELV-01): 12px
corners, a 1px `outline-variant` edge, no shadow. Cards are never links (CMP-06): put the
link on a heading or a button inside.

v2 renders in light DOM (Stencil `scoped`, architecture §3.1): the host is the surface and
your content stays its direct children, so `aria-labelledby` points at your own heading
with an ordinary id. There is no `::part(surface)`; style the host (`.sc-card`) if you must.

With `landmark`, the card becomes a named region (`section`) or an `article`, labelled by
the first heading inside it, or by `label`.

## Properties

| Property   | Attribute  | Description                                                                                                                                                                                                                                                           | Type                                  | Default      |
| ---------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | ------------ |
| `label`    | `label`    | Names the landmark when the card has no heading of its own. Ignored without `landmark`.                                                                                                                                                                               | `string \| undefined`                 | `undefined`  |
| `landmark` | `landmark` | Makes the card a landmark. `section` exposes a region (a part of a page a user would want to jump to); `article` is for self-contained content. Both are named by the first heading (`h1`–`h6`) inside the card, or by `label`. Leave unset for a plain box.          | `"article" \| "section" \| undefined` | `undefined`  |
| `padding`  | `padding`  | Inner padding: `l` is 24px (default), `m` is 16px.                                                                                                                                                                                                                    | `"l" \| "m"`                          | `'l'`        |
| `variant`  | `variant`  | `outlined` (default): white surface with a 1px `outline-variant` edge, for groups on a page or a neutral band. `filled`: a quiet `surface-container` fill (`surface-container-high` in dark mode) with no edge, for a totals card or a group inside an outlined area. | `"filled" \| "outlined"`              | `'outlined'` |


## Slots

| Slot | Description                                                           |
| ---- | --------------------------------------------------------------------- |
|      | The card's content. Start with a heading when the card is a landmark. |


----------------------------------------------


