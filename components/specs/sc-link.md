# sc-link · specification (v2)

Status: rebuilt for v2 by C2 (Wave 2b). Visual rules: `docs/v2/component-language.md` A2 and Standard CMP-08, read through the role table in `docs/v2/decisions.md`. Code: `src/components/sc-link`.

A link goes somewhere. Inside running text, prefer the CSS-only `.sc-link` class on a native `<a>` (decision A4); use `sc-link` for standalone links, external links and downloads.

## Encapsulation

**Shadow DOM** with `delegatesFocus` (architecture §3.1, "Links"). Nothing outside references inside it; the native `<a>` is in the shadow root and `focus()` on the host lands on it. Parts: `control`, `label`, `icon`.

The `.sc-link` helper (`src/global/shadow.css`, also in `sc.css` `@layer sc.utilities`) draws the same link on a native `<a>`. Checked by e2e ("matches the .sc-link class"): colour, underline line, thickness and offset are identical. The helper matches A4 as written: channel action, 1px at 4px (5px Arabic), 2px on hover, `box-decoration-break: clone`, `LinkText` in forced colours.

## Anatomy

| # | Part | Notes |
| --- | --- | --- |
| 1 | Link | `[part=control]`, the native `<a>`. Inline by default, inheriting the sentence's type. Radius 4 (for the focus ring). |
| 2 | Label | `[part=label]`, the default slot. Carries the underline, so the icon and its gap are not underlined. |
| 3 | Icon (optional) | `[part=icon]`. `external`: the external icon, 20px, gap 6, on the middle of the text when inline. `standalone`: `arrow-forward`, 20px, gap 6 (Paper board sc-link, anatomy). |
| 4 | Hidden text | `external` only: " (opens in new tab)" / " (يفتح في علامة تبويب جديدة)", inside the link, visually hidden. |

## Kinds

| Kind | Type | Size |
| --- | --- | --- |
| inline (default) | inherits | flows with the text |
| `standalone` | `label-large` (18/22 Bold EN, 20/28 Bold AR) | inline-flex, min-height 44 (`size-target-min`) |
| `external` | as inline or standalone | adds `target="_blank" rel="noopener noreferrer"` |

## Colour and states

| State | Rule |
| --- | --- |
| Default | Text and underline `--sc-link-color`, default `channel-action`. Underline 1px at a 4px offset (5px when the text is Arabic), `text-decoration-skip-ink: auto` |
| Hover (fine pointers) | Underline 2px, over `duration-fast` with `easing-hover` |
| Visited | Not styled differently (D8) |
| Focus-visible | U1 ring (3px `focus-ring`, 2px offset), wrapping with the text across lines (`box-decoration-break: clone`) |
| Forced colours | `LinkText` |

`--sc-link-color` is a hook for other components (footer: `on-surface`; error summary: `error`), not for services (CMP-02).

## Keyboard

Native link: Tab focuses, Enter follows. No motion.

## RTL and Arabic

The arrow and external icon mirror (`icon-directional`). The underline offset is 5px for Arabic text. Hidden text follows the closest `lang`.

## Strings

`src/i18n/components/sc-link.ts`: `linkOpensInNewTab`. Overridable with `external-text`.

## API changes from v1

- `standalone` uses `label-large` Bold and an `arrow-forward` end icon (v1: label-m and a chevron).
- No visited colour (v1 used `--sc-channel-link-visited`, removed in v2).
- No colour change on hover or press; only the underline thickens.
- New: `--sc-link-color` custom property.
- Parts unchanged: `control`, `label`, `icon`.

## Budget

Custom-elements closure 3,374 B gzip (4 KiB budget), of which its own CSS 524 B. Shared chunks: icon set by name (0.9 KiB) and locale controller (0.9 KiB).

## Tests

`sc-link.spec.tsx` (render, external, Arabic text, standalone, attributes), `sc-link.e2e.ts` (underline values EN/AR, hover 2px, parity with `.sc-link`, `--sc-link-color`, keyboard and U1 ring, accessible name with hidden text in both languages, standalone type and mirrored arrow, channel and theme; `describeAxe` EN/AR × light/dark, axe on every channel in both themes), `sc-link.visual.e2e.ts` (baselines in `test/visual/darwin/sc-link/`).
