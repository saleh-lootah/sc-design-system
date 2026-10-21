# sc-channel-hero

The top band of a channel's home or section page: a flat band in the channel's quiet tone (no gradient), the page heading, search and "Popular now" suggestions.

## Usage

```html
<sc-channel-hero>
  <p slot="eyebrow">Government services for everyone who lives in Dubai</p>
  <h1 slot="heading">What do you need to do?</h1>
  <sc-search size="l" label-hidden label="Search services" placeholder="Try “renew car registration” or “school fees”" action="/search"></sc-search>
  <a slot="popular" href="/services/renew-registration">Renew vehicle registration</a>
  <a slot="popular" href="/services/pay-dewa">Pay water and electricity</a>
</sc-channel-hero>
```

- Pass the page's `<h1>` in the `heading` slot. The hero styles it (headline-large on phones, display-small from 600px, display-large from 1024px, or display-medium with `size="medium"`) but it stays a real heading.
- The eyebrow is optional context, one short line. The lede (`slot="lede"`) is one or two sentences; skip it on a home page whose heading is a question.
- The default slot holds search. Suggestion links go in `slot="popular"`: the hero draws them as 40px chips on 44px targets after a "Popular now" label.
- One hero per page, at the top of `<main>`. Don't put calls to action in the hero other than search.

### Colour

A flat `--sc-color-channel-subtle` band (decision Q-hero), so it follows `data-channel` and the theme. In forced colours it becomes plain canvas with a rule underneath.

### Layout

The hero is full-bleed; its content follows the page grid's margins (20, 32, 48, 80px) and the 1280px cap, so it lines up with `sc-container` below.

### Arabic

Content aligns right; the search field mirrors.

<!-- Auto Generated Below -->
