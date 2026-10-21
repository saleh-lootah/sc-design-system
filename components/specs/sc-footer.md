# sc-footer · specification (v2)

Status: rebuilt for v2 by C1 (Wave 2b). Rules: component-language A29 (simple) and B5 (grouped), Standard CHR-06, decision Q-footer. Code: `src/components/sc-footer`.

## Encapsulation

**Shadow DOM** (architecture §3.1, chrome). The Channels group needs no swatches (CHR-06), so the channel rebinding problem of the switcher does not arise. Extra links are slotted (`::slotted(a)` styles them).

## Variants

| Variant | Use | Anatomy |
| --- | --- | --- |
| `simple` (default) | Transaction pages | A 1px `outline-variant` rule; one row of links (help and contact, accessibility statement, privacy, cookies, terms, about, sitemap: those with an href, then slotted extras) under a visually hidden "Support links" `<h2>`; "Government of Dubai" (`slot="meta"`) at inline-end. Links stack as 44px rows below 600px. |
| `grouped` | Channel sites | A 1px rule, padding 56/40. Four groups on 4/4/2/2 columns from 1024px (two columns from 600, one below): **brand** (the channel's ring mark and name, `slot="brand"` for the description and app badges), **Channels** (all seven in the Standard 3.1 order, two inner columns, the current one Bold with `aria-current="true"`, no swatch), **Helpful information** (about, help and contact, accessibility statement, sitemap, then slotted extras), **Legal** (privacy and cookies, terms). Each group has an `<h2>`. Then a 1px rule, "Government of Dubai · Last updated {updated}" and "{Channel} is run by the Government of Dubai". |

Links: label-medium, `on-surface`, underlined 1px at 4px (5px Arabic), 2px on hover, at least 44px tall. Meta: body-small, `on-surface-variant`. The footer is always on `surface`.

## API changes from v1

- New props: `variant`, `channel`, `links`, `about-href`, `cookies-href`, `sitemap-href`, `updated`. Kept: `help-href`, `accessibility-href`, `privacy-href`, `terms-href`, the default slot for extra links, `slot="meta"`, parts `footer`, `list`, `link`, `meta`.
- Labels: "Accessibility" → "Accessibility statement", "Terms" → "Terms of use", and `privacy-href` reads "Privacy and cookies" unless `cookies-href` is also set (then "Privacy" and "Cookies"). Services that added `<a>Cookies</a>` as an extra link should set `cookies-href` instead.
- No `sc-container` inside: the footer sets its own margins and 1280 cap.

## Strings

`src/i18n/components/sc-footer.ts` (rewritten); channel names from `common.ts` through `channelStrings()`.

## Budget

6 KiB override. Measured 5.6 KiB: own module 2.8 KiB, plus locale and channel strings.

## Tests

Spec: simple links and meta, hrefs only, privacy/cookies split, slotted extras, grouped groups and order, current channel, lower line, Arabic. e2e: contentinfo, link roles and 44px, Tab order including slotted, grouped columns and mirroring, current Bold, one column on phones; `describeAxe`. Visual: grouped and simple EN/AR × light/dark.
