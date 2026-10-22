# sc-footer · specification (v2)

Status: rebuilt for v2 by C1 (Wave 2b); **CSS only since v2-lib-gaps**. Rules: component-language A29 (simple) and B5 (grouped), Standard CHR-06, decision Q-footer. Code: the `sc-footer` block of `src/global/components.css` (in `sc.css`); tests in `src/components/sc-footer`.

## Encapsulation

**CSS only** (architecture §3.1, like `sc-container`): the tag is never registered. `sc.css` styles `sc-footer` and the plain markup inside it in `@layer sc.components`, so the footer needs no JavaScript, has its final size at first paint (no reservation) and works with scripting off (PERF-04, review B1). The page writes every link and line in the page language; the `<footer>` child is the `contentinfo` landmark and the content box (grid margins, the 1280px cap, the 1px rule).

```html
<sc-footer>
  <footer>
    <nav aria-label="Support links"><ul>
      <li><a href="/en/help">Help and contact</a></li>
      <li><a href="/en/accessibility">Accessibility statement</a></li>
      <li><a href="/en/privacy">Privacy and cookies</a></li>
      <li><a href="/en/terms">Terms of use</a></li>
    </ul></nav>
    <p>Government of Dubai</p>
  </footer>
</sc-footer>
```

Grouped: inside the `<footer>`, a `.sc-footer__brand` block (the first `<p>` is the channel's name, drawn after its ring mark; then the description and app badges), a `<section class="sc-footer__channels">` and two more `<section>`s, each with an `<h2>` and a `<ul>`, and a `.sc-footer__lower` block with the two lower lines. The current channel is the item with `aria-current="true"` (a link, or a `<span>` when it has no link). The three classes are the only hooks; everything else is styled by element.

## Variants

| Variant | Use | Anatomy |
| --- | --- | --- |
| `simple` (default) | Transaction pages | A 1px `outline-variant` rule, padding 32/40; one row of links 32 apart (help and contact, accessibility statement, privacy, terms, cookies, about, sitemap, then any extras) in a `<nav aria-label="Support links">`; "Government of Dubai" (the `<p>`, body-medium) at inline-end. Links stack as 44px rows below 600px. |
| `grouped` | Channel sites | A 1px rule, padding 56/40 (32/40 below 600px). Four groups on 4/4/2/2 columns from 1024px (two columns from 600, one below): **brand** (the channel's ring mark and name in headline-small, then the description and app badges), **Channels** (all seven in the Standard 3.1 order, two inner columns, the current one Bold with a 3px `channel-action` bar at its inline start, 8 before the text, and `aria-current="true"`, no swatch), **Helpful information** (about, help and contact, accessibility statement, sitemap, then any extras), **Legal** (privacy and cookies, terms). Each group has an `<h2>`. Then a 1px rule, "Government of Dubai · Last updated {date}" and "{Channel} is run by the Government of Dubai". |

Links: label-medium, `on-surface`, underlined 1px at 4px (5px Arabic), 2px on hover, at least 44px tall.

**Link rule (R6, CMP-08).** Footer links are navigation links. R6 would let them underline on hover only, because their place in a footer list under a group heading identifies them as links; the footer keeps the underline in every state anyway, as CHR-06 draws it, so it meets the stricter running-text rule too. Their colour is `on-surface`, not `channel-action`: CHR-06's footer exception to CMP-08. Every link in the footer gets the same style.

**Current channel (R10).** Bold alone is no cue in Arabic, where label-medium is already Bold (D12), so the current channel also has the 3px `channel-action` bar at its inline start (`Highlight` in forced colours), in both languages. Meta: body-small in the grouped lower line, body-medium in the simple footer (A29), `on-surface-variant`. Group headings sit 8 above the first 44px link row (16 to its text, as board F66-0 draws compact). The footer is always on `surface`.

## API changes

- **v2-lib-gaps (breaking):** CSS only. The props (`channel`, `links`, `about-href`, `help-href`, `accessibility-href`, `privacy-href`, `cookies-href`, `terms-href`, `sitemap-href`, `updated`), the slots (`brand`, `meta`, `fallback`, the default slot) and the parts are gone; `variant` stays. The page writes the markup above. See `docs/v2/migration.md`.
- From v1 (Wave 2b): labels "Accessibility statement", "Terms of use", "Privacy and cookies" (or "Privacy" and "Cookies"); no `sc-container` inside.

## Strings

None: the page writes the text. The wording above is the standard one (EN / AR): Support links / روابط الدعم; Channels / القنوات; Helpful information / معلومات مفيدة; Legal / المعلومات القانونية; About {channel} / عن {channel}; Help and contact / المساعدة والتواصل; Accessibility statement / بيان إمكانية الوصول; Sitemap / خريطة الموقع; Privacy and cookies / الخصوصية وملفات تعريف الارتباط; Terms of use / شروط الاستخدام; Government of Dubai / حكومة دبي; Last updated {date} / آخر تحديث {date}; {channel} is run by the Government of Dubai / {channel} تديرها حكومة دبي. Channel names: R12.

## Budget

No JavaScript. Its rules are part of `sc.css` (about 0.4 KiB gzip).

## Tests

e2e (`sc-footer.e2e.ts`): not registered; contentinfo, surface, underlined `on-surface` links at least 44px; simple padding 32/40, the rule and the body-medium meta at inline-end; the page margins at 375/700/1200/1440; Tab order; stacked 44px rows below 600px; grouped columns and mirroring, padding 56/32, the lower line 40 below under its rule; the brand mark; the current channel Bold with the 3px bar in EN and AR (R10); underline in every state, 2px on hover (R6); the same with JavaScript disabled in EN and AR (PERF-04); one column on phones; `hidden`; `describeAxe`. Visual: grouped and simple EN/AR × light/dark.

## Container

The footer does not nest `sc-container`: its `<footer>` applies the grid margins and the `--sc-container-max` cap (sharing `sc-container`'s margin rules in `sc.css`).
