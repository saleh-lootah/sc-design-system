# sc-footer

The page footer. `simple` for transaction pages; `grouped` for channel sites, with the Channels group (Standard CHR-06). Spec: `specs/sc-footer.md`.

## Usage

```html
<sc-footer variant="grouped" updated="12 October 2026" links='{"now":"https://…/{lang}/", …}'
  about-href="/en/about" help-href="/en/help" accessibility-href="/en/accessibility"
  privacy-href="/en/privacy" terms-href="/en/terms" sitemap-href="/en/sitemap">
  <p slot="brand">Government services for everyone who lives in Dubai, in one place.</p>
</sc-footer>

<sc-footer help-href="/en/help" accessibility-href="/en/accessibility" privacy-href="/en/privacy"
  cookies-href="/en/cookies" terms-href="/en/terms"></sc-footer>
```

- Standard links appear when their `*-href` is set, with text in the page language. Extra links go in the default slot as `<a href>`.
- `privacy-href` reads "Privacy and cookies" unless `cookies-href` is set too.

<!-- Auto Generated Below -->


## Overview

The page footer, a `<footer>` (the page's `contentinfo` landmark). Two variants:

- `simple` (default; transaction pages, component-language A29): one row of underlined
  links and "Government of Dubai", under a 1px rule.
- `grouped` (channel sites, Standard CHR-06, decision Q-footer; B5): the channel's brand
  group (`slot="brand"`: a one-sentence description and app badges); a **Channels** group
  listing all seven channels in the Standard 3.1 order, the current one Bold with
  `aria-current="true"` and no swatch; **Helpful information** (about, help and contact,
  accessibility statement, sitemap); and **Legal** (privacy and cookies, terms). Each group
  has an `<h2>`. Then "Government of Dubai · Last updated …" and "… is run by the
  Government of Dubai".

The standard links appear when their `*-href` is set, with text from strings in the page
language. Every channel sets all of them (TPL-01, LEG-01). Extra links go in the default
slot as plain `<a href>` elements; each gets its own list item (the footer sets their
`slot` attribute). The footer is on `surface`, never a dark band.

## Properties

| Property            | Attribute            | Description                                                                                                         | Type                                                                                                    | Default     |
| ------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ----------- |
| `aboutHref`         | `about-href`         | About the channel ("About Dubai Now").                                                                              | `string \| undefined`                                                                                   | `undefined` |
| `accessibilityHref` | `accessibility-href` | The accessibility statement.                                                                                        | `string \| undefined`                                                                                   | `undefined` |
| `channel`           | `channel`            | The current channel. Defaults to the closest `data-channel`.                                                        | `"build" \| "invest" \| "justice" \| "now" \| "trade" \| "transport" \| "visit" \| undefined`           | `undefined` |
| `cookiesHref`       | `cookies-href`       | A separate cookies page. Splits "Privacy and cookies" into "Privacy" and "Cookies".                                 | `string \| undefined`                                                                                   | `undefined` |
| `helpHref`          | `help-href`          | The help and contact page.                                                                                          | `string \| undefined`                                                                                   | `undefined` |
| `links`             | `links`              | Each channel's home page, for the Channels group (as `sc-channel-switcher` `links`; `{lang}` becomes `en` or `ar`). | `"build" \| "invest" \| "justice" \| "now" \| "trade" \| "transport" \| "visit" \| string \| undefined` | `undefined` |
| `privacyHref`       | `privacy-href`       | The privacy notice. Labelled "Privacy and cookies" unless `cookies-href` is set too.                                | `string \| undefined`                                                                                   | `undefined` |
| `sitemapHref`       | `sitemap-href`       | The sitemap.                                                                                                        | `string \| undefined`                                                                                   | `undefined` |
| `termsHref`         | `terms-href`         | The terms of use.                                                                                                   | `string \| undefined`                                                                                   | `undefined` |
| `updated`           | `updated`            | Grouped: when the site was last updated, as it should read ("12 October 2026").                                     | `string \| undefined`                                                                                   | `undefined` |
| `variant`           | `variant`            | `simple` (one row) or `grouped` (channel sites, with the Channels group).                                           | `"grouped" \| "simple"`                                                                                 | `'simple'`  |


## Slots

| Slot      | Description                                                                                                |
| --------- | ---------------------------------------------------------------------------------------------------------- |
|           | Extra links, as `<a href>` elements, listed after the standard ones (in Helpful information when grouped). |
| `"brand"` | Grouped: the channel's description and app badges, under its name.                                         |
| `"meta"`  | Replaces "Government of Dubai" at the end of the simple footer.                                            |


## Shadow Parts

| Part       | Description           |
| ---------- | --------------------- |
| `"footer"` | The `<footer>`.       |
| `"link"`   | Each standard link.   |
| `"list"`   | Each `<ul>` of links. |
| `"meta"`   | The end text.         |


----------------------------------------------


