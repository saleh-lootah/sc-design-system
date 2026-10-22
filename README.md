# Shared Channels design system: foundations (v2)

Foundations for the Dubai Shared Channels standard, v2. The visual language is direction E, **Dubai Design System, evolved**: tonal palettes in the DDS and Material manner, city indigo as the shared primary, seven channel signatures, flat outline-first surfaces and **Dubai Font** for both scripts. The full specification is [`docs/v2/foundations.md`](docs/v2/foundations.md).

## Source of truth

`tokens/` holds the design tokens in the [W3C Design Tokens (DTCG)](https://www.designtokens.org/) format.

| File | Contents |
|---|---|
| `source/color.source.json` | **Edit this for colour.** Palette seeds, tones, chroma curve, and the role map for light and dark |
| `palette.json` | Generated: every tonal palette (tone = CIELAB L\*) |
| `color.json`, `color.dark.json` | Generated: colour roles and channel roles as aliases into the palettes |
| `typography.json` | Dubai Font families and weights; the English and Arabic type roles |
| `space.json`, `radius.json`, `size.json` | Spacing scale, corner radii, control and icon sizes |
| `elevation.json`, `opacity.json` | Shadow levels 0–2; state-layer opacities |
| `motion.json` | Durations, easing curves and scales |
| `layout.json` | Breakpoints, grid columns, gutters, margins and containers |

## Rules

- **Every colour is OKLAB.** The source never contains hex. Only the iOS and Android outputs convert to sRGB.
- **No colours in the reserved hue band.** Nothing in OKLCH hue 160–215 with chroma above 0.015.
- **The channel is the theme.** `data-channel` on any element (`now`, `transport`, `visit`, `justice`, `build`, `invest`, `trade`). Entities appear only as attribution text.
- **Contrast is checked, not assumed.** Every role pair in `docs/v2/foundations.md`, in light and dark, for every channel.
- **Roles, not tones.** Components use `--sc-color-<role>`; raw tones are for documentation only.

## Build

```sh
cd design-system
npm run build
```

Node 20 or later, no dependencies. `npm run build` generates the palettes, builds every output and runs the checks, stopping at the first failure.

| Command | What it does |
|---|---|
| `npm run generate` | Writes `palette.json`, `color.json` and `color.dark.json` from `tokens/source/color.source.json` |
| `npm run build:tokens` | Generates `dist/` only |
| `npm run check:contrast` | Recomputes WCAG contrast for every role pair, light and dark, all channels |
| `npm run check:hue-band` | Fails if any colour is in OKLCH hue 160–215 with chroma above 0.015 |
| `npm run check:no-hex` | Fails if the CSS or Tailwind output contains a hex colour |
| `npm run report:contrast` | Prints the contrast tables used in `docs/v2/foundations.md` |

### Documentation site

One site brings the design system, its components and the standard documents together, in English and Arabic. It is generated from the Markdown in this repository at build time (`components/scripts/build-site.mjs`), so it never needs editing by hand: change a document and rebuild.

```sh
npm run site          # tokens, then the components, then the site, into components/www/
npm run site:serve    # http://localhost:4400/
```

In `components/`, `npm run check:site` checks every link and anchor and the page budgets, and `npm run check:site-a11y` runs axe and the CLS, target-size and reflow checks in Helium.

### Outputs

| File | For |
|---|---|
| `dist/css/tokens.css` | Websites. Colour roles with light and dark in one `light-dark()` value (system setting, or `data-theme` on any element), channel roles rebound by `data-channel`, type roles rebound to the Arabic scale by `lang="ar"`, `.sc-type-*` classes, and reduced motion |
| `dist/css/palette.css` | Raw tonal palettes as `--sc-palette-<name>-<tone>`, for documentation and tooling |
| `dist/tailwind/theme.css` | Tailwind v4. Utilities point at the `--sc-*` properties. Default colours and breakpoints are removed; spacing is 1 unit = 1px |
| `dist/ios/SCTokens.swift` | SwiftUI. `Color.sc*` dynamic colours, `SCChannel`, `SCSpace`, `SCRadius`, `SCSize`, `SCOpacity`, `SCType.En` and `SCType.Ar` |
| `dist/android/SCTokens.kt` | Jetpack Compose. Light and dark schemes, channels, dimensions and `TextStyle`s. Replace the `DubaiFontFamily` placeholder |
| `dist/paper/tokens.paper.json` | Paper's `create_tokens` API. Dark colours have a `-dark` suffix, each channel is spelled out, Arabic type has an `-ar` suffix |

## Keeping secrets out of the repository

Two checks stop secrets (API keys, tokens, private keys, passwords) from reaching this repository:

- **GitHub push protection** is turned on. A push that contains a known provider secret is rejected before it lands.
- **The Secret scan workflow** (`.github/workflows/secret-scan.yml`) runs gitleaks over the full history on every push and pull request, and fails if it finds anything.

If either check flags something, remove the secret from the commit and revoke it at the provider: once it has been pushed, treat it as exposed. To check locally before pushing, install gitleaks and run `gitleaks git .` in this folder.
