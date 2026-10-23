# sc-language-switch · specification (v2)

Status: rebuilt for v2 by C2 (Wave 2b). Visual rules: `docs/v2/component-language.md` A5; behaviour LANG-04 to LANG-08. Code: `src/components/sc-language-switch`.

A link to the same page in the other language, named in that language.

## Encapsulation

**Shadow DOM** with `delegatesFocus` (architecture §3.1). One exception to "nothing in light DOM": the language name is a single light-DOM `<span lang dir data-sc-language-name>` that the component writes and shows through its slot. The `--sc-type-*` roles switch by `lang` in the document; a span inside the shadow root can't match `[lang|="ar"]` there, so the Arabic name on an English page could not get the Arabic type values (component-language A5: "an Arabic name is set at the Arabic size even on an English page"). Services don't add or remove children. Parts: `control`, `label`, `icon`.

## Anatomy

| # | Part | Notes |
| --- | --- | --- |
| 1 | Control | `<a href hreflang lang>` (or, deprecated, `<button lang>`), min 44 × 44, padding-inline 4, gap 6, radius 4 |
| 2 | Icon | `header` only: a 20px globe, never mirrored |
| 3 | Name | "العربية" on an English page, "English" on an Arabic page, with its own `lang` and `dir` |

## Appearances

| Appearance | Where | Colour | Type (of the name's own script) | Hover |
| --- | --- | --- | --- | --- |
| `inline` (default) | `sc-app-bar` | `channel-action`, underlined 1px at 4px (5px for Arabic) | `label-medium` | underline 2px |
| `header` | `sc-site-header` | `on-surface`, no underline, globe icon | `label-large` in Medium (Bold in Arabic, D12) | underline 1px |

Focus: U1 ring. Forced colours: `LinkText` (`ButtonText` for the deprecated button).

## Behaviour

`scSwitch` (`{ lang }`, bubbles, composed, cancelable) fires on every activation; `preventDefault()` stops the link from navigating, for single-page apps. Without `href` it renders a deprecated `<button>` and warns once per page.

## Without JavaScript (PERF-04, LANG-04)

The switch renders in shadow DOM, so without script it would show nothing, and LANG-04 needs the switch on every page. A service writes the same link as a light-DOM child in `slot="fallback"`:

```html
<sc-language-switch href="/ar/renew"><a slot="fallback" href="/ar/renew" hreflang="ar" lang="ar" dir="rtl">العربية</a></sc-language-switch>
```

Until the switch is defined, `sc.css` shows it as the `inline` appearance: an underlined label-medium link in `channel-action`, at least 44 × 44, in the endonym face. With `appearance="header"` or `"plain"` it shows the header look instead (the 20px globe, 6 before the name, label-large in `on-surface`, not underlined), so the switch keeps its size and place in the header when it upgrades (R26). The upgraded shadow root has no `fallback` slot, so the link is then neither shown nor read, and the component's own control and name span take over. The component ignores the fallback when it writes its name span.

## Strings

`src/i18n/components/sc-language-switch.ts`: the two endonyms (the same in both dictionaries on purpose).

## API changes from v1

- `appearance` values are now `inline` (default) and `header`. v1's `glass` maps to `inline`, `plain` to `header`.
- No glass pill; `header` gains the globe icon.
- The name is a light-DOM child (see Encapsulation). `control.textContent` in the shadow root is empty; read the accessible name or the `[data-sc-language-name]` child.
- New part `icon`.

## Budget

Custom-elements closure 3,205 B gzip (4 KiB budget), its own CSS 573 B.

## Tests

`sc-language-switch.spec.tsx` (both directions, one name child, button mode and `scSwitch`, appearance mapping), `sc-language-switch.e2e.ts` (accessible name, `lang`, `hreflang` and the name's own type role in both directions; inline and header colours and sizes; globe not mirrored; 44px, keyboard and ring; `scSwitch` and `preventDefault`; button with Space; the no-JS fallback visible, 44px and with `href` and `hreflang` with JavaScript disabled on EN and AR pages, hidden once upgraded (PERF-04); `describeAxe`, axe with focus on every channel), `sc-language-switch.visual.e2e.ts`.
