# sc-channel-hero

The top of a channel's home or section page: a wash in the channel's colours, the page heading and usually search.

## Usage

```html
<sc-channel-hero>
  <p slot="eyebrow">Government services for everyone who lives in Dubai</p>
  <h1 slot="heading">What do you need to do?</h1>
  <sc-search label-hidden label="Search services" placeholder="Try “renew car registration” or “school fees”" action="/search"></sc-search>
</sc-channel-hero>
```

- Pass the page's `<h1>` in the `heading` slot. The hero styles it (heading-xl on phones, display-l from 1024px) but it stays a real heading.
- The eyebrow is optional context, one short line. The lede (`slot="lede"`) is one or two sentences; skip it on a home page whose heading is a question.
- The default slot holds search and anything that goes with it, such as "Popular now" links.
- One hero per page, at the top of `<main>`. Don't put calls to action in the hero other than search.

### Colour

The wash is `linear-gradient(in oklab, var(--sc-channel-wash-start), var(--sc-channel-wash-end))`, so it follows `data-channel` and the theme. In forced colours it becomes plain canvas with a rule underneath.

### Layout

The hero is full-bleed; its content sits in an `sc-container`, so it lines up with the page below, and is capped at eight of twelve columns.

### Arabic

Content aligns right; the search field mirrors.

<!-- Auto Generated Below -->


## Overview

The top band of a channel's home or section page (E1): a flat `channel-subtle` band
(decision Q-hero: no gradient), holding optional breadcrumbs, an eyebrow, the page's
`<h1>` at display size, an optional lede, search and a "Popular now" row of suggestion
chips. It follows `data-channel` and the theme like every component.

The band is full-bleed; its content follows the page grid's margins (20, 32, 48, 80px)
and the 1280px cap, so it lines up with `sc-container` content below. The hero never
carries a carousel or autoplaying media.

## Properties

| Property       | Attribute       | Description                                                                                                                                                                                                                  | Type                  | Default     |
| -------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `popularLabel` | `popular-label` | Overrides the label before the suggestion chips (default "Popular now" / "الأكثر طلبًا الآن").                                                                                                                               | `string \| undefined` | `undefined` |
| `size`         | `size`          | The heading size from 1024px: `large` (display-large, 80px) for a channel's home page, `medium` (display-medium, 57px) for a section page. Below 1024px both step down (display-small from 600px, headline-large on phones). | `"large" \| "medium"` | `'large'`   |


## Slots

| Slot            | Description                                                                                                                                                       |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|                 | Search (`sc-search size="l"`), up to 880px wide.                                                                                                                  |
| `"breadcrumbs"` | Optional breadcrumbs, on inner pages.                                                                                                                             |
| `"eyebrow"`     | A short line above the heading, e.g. "Government services for everyone who lives in Dubai".                                                                       |
| `"heading"`     | The page's `<h1>`. Pass the element itself: `<h1 slot="heading">What do you need to do?</h1>`.                                                                    |
| `"lede"`        | An optional paragraph under the heading.                                                                                                                          |
| `"popular"`     | Suggestion links, one `<a href>` each: "Renew vehicle registration". The hero draws them as 40px capsule chips with a 44px target, after the "Popular now" label. |


## Shadow Parts

| Part        | Description                   |
| ----------- | ----------------------------- |
| `"band"`    | The full-bleed band.          |
| `"content"` | The column holding the slots. |
| `"popular"` | The "Popular now" row.        |


----------------------------------------------


