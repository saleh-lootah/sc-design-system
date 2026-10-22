# sc-footer · specification (v2)

Status: rebuilt for v2 by C1 (Wave 2b). Rules: component-language A29 (simple) and B5 (grouped), Standard CHR-06, decision Q-footer. Code: `src/components/sc-footer`.

## Encapsulation

**Shadow DOM** (architecture §3.1, chrome). The Channels group needs no swatches (CHR-06), so the channel rebinding problem of the switcher does not arise. Extra links are slotted (`::slotted(a)` styles them).

## Variants

| Variant | Use | Anatomy |
| --- | --- | --- |
| `simple` (default) | Transaction pages | A 1px `outline-variant` rule, padding 32/40; one row of links 32 apart (help and contact, accessibility statement, privacy, terms, cookies, about, sitemap: those with an href, then slotted extras) under a visually hidden "Support links" `<h2>`; "Government of Dubai" (`slot="meta"`, body-medium) at inline-end. Links stack as 44px rows below 600px. |
| `grouped` | Channel sites | A 1px rule, padding 56/40 (32/40 below 600px). Four groups on 4/4/2/2 columns from 1024px (two columns from 600, one below): **brand** (the channel's ring mark and name in headline-small, `slot="brand"` for the description and app badges), **Channels** (all seven in the Standard 3.1 order, two inner columns, the current one Bold with a 3px `channel-action` bar at its inline start, 8 before the text, and `aria-current="true"`, no swatch), **Helpful information** (about, help and contact, accessibility statement, sitemap, then slotted extras), **Legal** (privacy and cookies, terms). Each group has an `<h2>`. Then a 1px rule, "Government of Dubai · Last updated {updated}" and "{Channel} is run by the Government of Dubai". |

Links: label-medium, `on-surface`, underlined 1px at 4px (5px Arabic), 2px on hover, at least 44px tall.

**Link rule (R6, CMP-08).** Footer links are navigation links. R6 would let them underline on hover only, because their place in a footer list under a group heading identifies them as links; the footer keeps the underline in every state anyway, as CHR-06 draws it, so it meets the stricter running-text rule too. Their colour is `on-surface`, not `channel-action`: CHR-06's footer exception to CMP-08. Slotted extras get the same style.

**Current channel (R10).** Bold alone is no cue in Arabic, where label-medium is already Bold (D12), so the current channel also has the 3px `channel-action` bar at its inline start (`Highlight` in forced colours), in both languages. Meta: body-small in the grouped lower line, body-medium in the simple footer (A29), `on-surface-variant`. Group headings sit 8 above the first 44px link row (16 to its text, as board F66-0 draws compact). The footer is always on `surface`.

## API changes from v1

- New props: `variant`, `channel`, `links`, `about-href`, `cookies-href`, `sitemap-href`, `updated`. Kept: `help-href`, `accessibility-href`, `privacy-href`, `terms-href`, the default slot for extra links, `slot="meta"`, parts `footer`, `list`, `link`, `meta`.
- Labels: "Accessibility" → "Accessibility statement", "Terms" → "Terms of use", and `privacy-href` reads "Privacy and cookies" unless `cookies-href` is also set (then "Privacy" and "Cookies"). Services that added `<a>Cookies</a>` as an extra link should set `cookies-href` instead.
- No `sc-container` inside: the footer sets its own margins and 1280 cap.

## Strings

`src/i18n/components/sc-footer.ts` (rewritten); channel names from `common.ts` through `channelStrings()`.

## Budget

6 KiB override. Measured 5.6 KiB: own module 2.8 KiB, plus locale and channel strings.

## Tests

Spec: simple links and meta, hrefs only, privacy/cookies split, slotted extras, the fallback left unslotted, grouped groups and order, current channel, lower line, Arabic. e2e: contentinfo, link roles and 44px, Tab order including slotted, grouped columns and mirroring, current Bold, the current bar in EN and AR (R10), underline in every state (R6), no-JS fallback links visible, 44px and with hrefs with JavaScript disabled in EN and AR, and hidden with the same hrefs rendered once upgraded (PERF-04), one column on phones; `describeAxe`. Visual: grouped and simple EN/AR × light/dark.

## Without JavaScript (PERF-04)

The footer renders in shadow DOM, so without script it would show nothing, and PERF-04 needs help and navigation to work without it. A service writes the same links as light-DOM children in `slot="fallback"`:

```html
<sc-footer help-href="/en/help" accessibility-href="/en/accessibility" privacy-href="/en/privacy" terms-href="/en/terms">
  <nav slot="fallback" aria-label="Support links"><ul>
    <li><a href="/en/help">Help and contact</a></li>
    <li><a href="/en/accessibility">Accessibility statement</a></li>
    <li><a href="/en/privacy">Privacy and cookies</a></li>
    <li><a href="/en/terms">Terms of use</a></li>
  </ul></nav>
</sc-footer>
```

Before the footer is defined (no script, script blocked or failed, or not loaded yet), the browser shows that content: `sc.css` styles it as a row of underlined label-medium `on-surface` links, 44px tall, with the grid margins and a 1px rule above. The upgraded shadow root has no `fallback` slot, so the fallback is then neither shown nor in the accessibility tree; the footer's own links replace it. Bare `<a>` extras are hidden before upgrade when a fallback exists (list them in the fallback too). For the grouped footer, write one `<h2>` and `<ul>` per group inside the fallback. The fallback's links and hrefs must match the attributes: the e2e checks both states.

## Before upgrade

The shadow root is empty until the component upgrades (or shows only the fallback while the tag is undefined), so `sc.css` reserves the measured height (`sc-footer:not(:defined)`): simple 253 / 149 / 117px and grouped 946 / 760 / 388px at compact / medium (600) / expanded (1024), measured with the standard links in English (Arabic is equal or taller). CLS stays 0 on the typical page.

## Container

The footer does not nest `sc-container` (CSS-only in v2 and unusable in a shadow root): it applies the grid margins (`--sc-grid-*-margin` per breakpoint) and the `--sc-container-max` cap in its own CSS. The same holds for `sc-site-header`, `sc-announcement-bar` and `sc-utility-bar`.
