# Shared Channels design system: foundations

Phase 2 foundations for the Dubai Shared Channels standard. The visual direction is **Native** (from DubaiNow Next), set in **Dubai Font** with tight leading.

## Source of truth

`tokens/` holds the design tokens in the [W3C Design Tokens (DTCG)](https://www.designtokens.org/) format. Edit these files; everything else is generated from them.

| File | Contents |
|---|---|
| `color.json` | Semantic colours and the seven channel signatures, light mode |
| `color.dark.json` | Dark-mode overrides for the same names |
| `typography.json` | Dubai Font families and weights; separate Latin and Arabic type scales |
| `space.json`, `radius.json`, `size.json` | Spacing scale, corner radii, control and icon sizes |
| `elevation.json` | Shadow levels 0–3 |
| `motion.json` | Durations and easing curves |
| `layout.json` | Breakpoints, grid columns, gutters, margins and containers |

## Rules

- **Every colour is OKLAB.** Colour values use the DTCG colour object with `"colorSpace": "oklab"`. Platform outputs may convert to sRGB where a platform requires it, but the source never contains hex.
- **No teal.** Nothing in OKLCH hue 160–215 with chroma above 0.015.
- **The channel is the theme.** A page sets one channel (`now`, `transport`, `visit`, `justice`, `build`, `invest`, `trade`). Government entities appear only as attribution text.
- **Contrast is checked, not assumed.** Text 4.5:1, control boundaries 3:1, in light and dark, for every channel.
- **Dubai Font, tight leading.** Latin display text uses about 1.0–1.05× leading, headings about 1.15×, and body text about 1.4×. Arabic body text uses 1.5–1.6× and is never letter-spaced.

`scripts/oklab.py` contains the OKLAB-to-sRGB conversion and the WCAG contrast maths used for the checks.

## Build

The outputs in `dist/` are generated from `tokens/`. Do not edit them by hand.

```sh
cd design-system
npm run build
```

This needs Node 20 or later and nothing else: the build is one plain Node script, `scripts/build-tokens.mjs`, with no dependencies. `npm run build` generates every output and then runs the checks. It stops with an error if any check fails. You can also run the steps on their own:

| Command | What it does |
|---|---|
| `npm run build:tokens` | Generates `dist/` only |
| `npm run check:contrast` | Recomputes WCAG contrast for the pairs the colours were designed for, in light and dark, for every channel |
| `npm run check:teal` | Fails if any colour is in OKLCH hue 160–215 with chroma above 0.015 |
| `npm run check:no-hex` | Fails if the CSS or Tailwind output contains a hex colour |

Without npm, run the same scripts with `node scripts/<name>.mjs`.

### Outputs

| File | For |
|---|---|
| `dist/css/tokens.css` | Websites. Every token as a `--sc-*` custom property, dark mode (system setting, or forced with `data-theme="dark"` / `"light"` on `<html>`), channel theming with `data-channel="<name>"` on any element (default `now`), `.sc-type-*` text classes for Latin and Arabic, and reduced motion |
| `dist/tailwind/theme.css` | Tailwind v4 projects. Import it after `tailwindcss`. Utilities point at the `--sc-*` properties, so dark mode and channels keep working. Tailwind's default colours and breakpoints are removed. Spacing is 1 unit = 1px, so `p-16` is 16px |
| `dist/ios/SCTokens.swift` | SwiftUI apps. `Color.sc*` colours that follow light and dark mode, `SCChannel`, `SCSpace`, `SCRadius`, `SCSize`, and `SCType` text styles using the Dubai W23 PostScript names |
| `dist/android/SCTokens.kt` | Jetpack Compose apps. Light and dark colour schemes, channels, `Dp` spacing and radii, and `TextStyle`s. Replace the `DubaiFontFamily` placeholder with the bundled font files |
| `dist/paper/tokens.paper.json` | Loading the tokens into Paper with its `create_tokens` API. Dark colours have a `-dark` suffix. Paper has no token type for shadows, motion or grid columns, so those are left out |

### Colour on native platforms

Colours stay OKLAB wherever the platform understands it: the CSS and Tailwind outputs use `oklab()` values, and `check:no-hex` enforces this. iOS and Android need numeric sRGB components, so only those two outputs convert. They use the same maths as `scripts/oklab.py`, and each converted colour has its source OKLAB value in a comment next to it. A few very light tints sit just outside sRGB and are clamped, exactly as `oklab.py` does. The build lists them.

## Keeping secrets out of the repository

Two checks stop secrets (API keys, tokens, private keys, passwords) from reaching this repository:

- **GitHub push protection** is turned on. A push that contains a known provider secret is rejected before it lands.
- **The Secret scan workflow** (`.github/workflows/secret-scan.yml`) runs gitleaks over the full history on every push and pull request, and fails if it finds anything.

If either check flags something, remove the secret from the commit and revoke it at the provider: once it has been pushed, treat it as exposed. To check locally before pushing, install gitleaks and run `gitleaks git .` in this folder.
