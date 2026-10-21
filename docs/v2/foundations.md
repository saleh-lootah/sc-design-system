# Shared Channels Design System v2 · Foundations

**Status:** Wave 1 (F1), 21 October 2026. This document is the single source of truth for colour, type, shape, space, size, elevation, focus, layout, icons and motion in v2. Every v2 agent builds from it. The token files in `tokens/` implement it, and `npm run build` checks that they agree.

**Sources:** direction E, "Dubai Design System, evolved" (Paper file `01M5A0E3KTNXQ1262CTCJDXCMP`, page p-6-0, artboards E0 to E4); the v1 tokens, scripts and Standard 2.0 chapter 8, for reference only; the v1 `feat/tint-palette` branch for the decorative tints.

**Hard constraints:** every colour is OKLAB; nothing in the teal band (OKLCH hue 160 to 215 with chroma above 0.015); WCAG 2.2 AA is the floor for every pair defined here, and each pair's ratio is stated; digits stay Latin in both languages.

Where this document gives a number, the token files are authoritative if the two ever disagree. Tables marked "generated" were produced from the token files by the build's own maths.

## Contents

1. [Token naming and delivery](#1-token-naming-and-delivery)
2. [Colour](#2-colour)
3. [Typography](#3-typography)
4. [Shape](#4-shape)
5. [Spacing](#5-spacing)
6. [Sizing](#6-sizing)
7. [Elevation](#7-elevation)
8. [Focus](#8-focus)
9. [Layout](#9-layout)
10. [Iconography](#10-iconography)
11. [Motion](#11-motion)
12. [v1 to v2 token map](#12-v1-to-v2-token-map)
13. [v1 component tokens that disappear](#13-v1-component-tokens-that-disappear)
14. [Checks](#14-checks)
15. [Decisions to confirm](#15-decisions-to-confirm)

---

## 1. Token naming and delivery

### 1.1 Files

| File | Edited by | Contents |
| --- | --- | --- |
| `tokens/source/color.source.json` | People | Palette seeds, the tone list, the chroma curve, and the role map (which tone each role takes in light and dark). The only colour file anyone edits. |
| `tokens/palette.json` | `scripts/generate-palettes.mjs` | Every tonal palette, OKLAB, with its tone in `$extensions["sc.tone"]` and the seed in `$extensions["sc.seed"]`. |
| `tokens/color.json`, `tokens/color.dark.json` | `scripts/generate-palettes.mjs` | Role tokens as DTCG aliases into the palettes (`"{palette.neutral.100}"`), light and dark. |
| `tokens/typography.json` | People | Dubai Font families and weights; the type roles `type.en.*` and `type.ar.*`. |
| `tokens/space.json`, `radius.json`, `size.json`, `elevation.json`, `opacity.json`, `layout.json`, `motion.json` | People | Everything else. `motion.json`, `space.json` and `layout.json` are unchanged from v1. |

`npm run build` runs, in order: `generate` (palettes and roles), `build:tokens` (all platform outputs), then `check:contrast`, `check:teal` and `check:no-hex`. It stops on the first failure.

### 1.2 Web names

| Pattern | Example | Notes |
| --- | --- | --- |
| `--sc-color-<role>` | `--sc-color-on-surface` | System colour roles. One value holds both modes: `light-dark(<light>, <dark>)`. |
| `--sc-color-channel-<role>` | `--sc-color-channel-action` | The active channel's roles. Rebound by `data-channel`. |
| `--sc-palette-<palette>-<tone>` | `--sc-palette-now-40` | Raw tones. Only in `dist/css/palette.css`, for documentation and tooling. Components never use them. |
| `--sc-type-<role>-<property>` | `--sc-type-body-large-size` | `family`, `weight`, `size`, `leading`, `tracking`. Arabic values are rebound by `lang`. |
| `--sc-opacity-<state>` | `--sc-opacity-hover` | State-layer strength, as a percentage. |
| `--sc-space-<n>`, `--sc-radius-<name>`, `--sc-size-<name>`, `--sc-elevation-<n>` | `--sc-radius-field` | Unchanged pattern from v1; the names inside changed (section 12). |
| `--sc-duration-<name>`, `--sc-easing-<name>`, `--sc-scale-<name>` | `--sc-duration-base` | Unchanged from v1. |
| `--sc-breakpoint-<name>`, `--sc-grid-<bp>-<prop>`, `--sc-container-<name>` | `--sc-grid-compact-margin` | Unchanged from v1. |

The `.sc-type-<role>` classes remain for page markup. There are no `.sc-type-ar-*` classes any more: the plain class follows the element's language.

### 1.3 Switching mode, channel and script

All three switches are attribute selectors on ordinary elements, resolved by the browser's cascade. None costs anything at runtime, and all of them work on a subtree as well as on the whole page.

- **Dark mode.** `:root` sets `color-scheme: light dark`, so every `light-dark()` value follows the system setting. `data-theme="light"` or `data-theme="dark"` on any element sets `color-scheme` for that subtree, which forces the mode there (a dark footer on a light page works). Because the custom property holds the unresolved `light-dark()` function, the mode is decided where the colour is used, so it crosses shadow roots correctly.
- **Channel.** The default channel (`now`) is bound at `:root`. `data-channel="<name>"` on any element rebinds the six per-channel `--sc-color-channel-*` roles for its subtree. A page sets it once on `<html>`; an attribution chip ("Also on Dubai Transport") sets it on itself, so the chip shows Transport's colours on a Dubai Now page without any per-channel variables.
- **Script.** English values are bound at `:root` and on any element whose `lang` is not Arabic; `lang="ar"` (or `ar-AE`) rebinds every `--sc-type-*` property to the Arabic scale. `lang="en"` inside an Arabic page switches back. Components read `--sc-type-<role>-*` only and never branch on script.

`light-dark()` is Baseline 2024 (Chrome and Edge 123, Firefox 120, Safari 17.5). There is no fallback for older engines; see decision D9.

These three switches were verified in a headless Chromium build (Helium): one page with a light Dubai Now band containing a Transport chip, a forced-dark Visit section containing Arabic and English text, and an Arabic block containing English. Computed values matched the tokens in each case.

### 1.4 Other platforms

| Output | Colour | Channel | Type |
| --- | --- | --- | --- |
| `dist/tailwind/theme.css` | `--color-<role>` and `--color-channel-<role>`, pointing at the `--sc-*` properties | Inherited from `data-channel` | `text-<role>`, script-aware through the variables |
| `dist/ios/SCTokens.swift` | `Color.sc<Role>`, dynamic light and dark | `SCChannel.<name>` with every channel role; `onAction` shared | `SCType.En.<role>`, `SCType.Ar.<role>` |
| `dist/android/SCTokens.kt` | `SCLightColors`, `SCDarkColors` | `SCLightChannels`, `SCDarkChannels` | `SCTypeEn`, `SCTypeAr` |
| `dist/paper/tokens.paper.json` | Roles as `--sc-color-<role>`, dark as `--sc-color-<role>-dark`; every channel spelled out as `--sc-color-channel-<channel>-<role>` (and `-dark`); every tone as `--sc-palette-<palette>-<tone>` | Spelled out per channel | `--sc-type-<role>-size`, `-leading`, `-tracking`; Arabic with an `-ar` suffix |

iOS and Android need sRGB numbers, so only those outputs convert; every converted colour carries its OKLAB source in a comment. No v2 colour is outside sRGB, so nothing is clamped.

---

## 2. Colour

### 2.1 The tone scale

Every palette is a ramp of **tones**. A tone is CIELAB L\*, from 0 (black) to 100 (white): the scale Material and the Dubai Design System use. Direction E was already built on it: measured, its channel 40s sit at tone 39.6 to 40.3 and its neutral-40 at exactly 40.0.

The useful property is that a colour's relative luminance depends only on its tone, and WCAG contrast depends only on luminance. So the contrast between two tones is fixed, whatever their hues. Tone 40 on tone 100 is 6.46:1 for every palette, which is why every channel action passes on white by the same margin. The generator does not approximate this: for each tone it solves for the OKLAB lightness that gives exactly that luminance at the palette's hue and chroma.

Contrast between tones (generated):

| Tone | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 95 | 100 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **10** | 1.00 | 1.30 | 1.83 | 2.65 | 3.82 | 5.41 | 7.47 | 10.07 | 13.27 | 15.12 | 17.14 |
| **20** | 1.30 | 1.00 | 1.41 | 2.03 | 2.93 | 4.15 | 5.73 | 7.72 | 10.18 | 11.59 | 13.14 |
| **30** | 1.83 | 1.41 | 1.00 | 1.45 | 2.08 | 2.95 | 4.07 | 5.49 | 7.24 | 8.24 | 9.35 |
| **35** | 2.20 | 1.69 | 1.20 | 1.20 | 1.73 | 2.45 | 3.39 | 4.57 | 6.02 | 6.86 | 7.78 |
| **40** | 2.65 | 2.03 | 1.45 | 1.00 | 1.44 | 2.04 | 2.82 | 3.80 | 5.00 | 5.70 | 6.46 |
| **80** | 10.07 | 7.72 | 5.49 | 3.80 | 2.63 | 1.86 | 1.35 | 1.00 | 1.32 | 1.50 | 1.70 |
| **90** | 13.27 | 10.18 | 7.24 | 5.00 | 3.47 | 2.45 | 1.78 | 1.32 | 1.00 | 1.14 | 1.29 |
| **95** | 15.12 | 11.59 | 8.24 | 5.70 | 3.95 | 2.80 | 2.02 | 1.50 | 1.14 | 1.00 | 1.13 |
| **100** | 17.14 | 13.14 | 9.35 | 6.46 | 4.48 | 3.17 | 2.30 | 1.70 | 1.29 | 1.13 | 1.00 |

Reading the table: text needs 4.5:1, so any tone 40 or darker works on tones 90 to 100, and tone 80 or lighter works on tones 10 to 20 (dark mode). Control edges and focus rings need 3:1.

### 2.2 How palettes are generated

`scripts/generate-palettes.mjs` reads `tokens/source/color.source.json` and, for each palette:

1. takes the seed's OKLCH hue and chroma (the neutral palette is given a hue and chroma directly);
2. for each tone, asks for the seed chroma times the chroma curve below (light tones carry less chroma, so containers stay calm);
3. solves for the OKLAB lightness that gives that tone's exact luminance, reducing chroma at constant hue where the colour would leave sRGB;
4. rounds to four decimals and confirms the rounded colour is still inside sRGB.

| Tone | 10 | 20 | 25 | 30 | 35 | 40 | 50 | 60 | 70 | 75 | 80 | 90 | 95 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Chroma × seed | 0.35 | 0.45 | 0.7 | 0.9 | 0.95 | 1 | 1 | 0.95 | 0.85 | 0.75 | 0.65 | 0.3 | 0.15 |

The light end of the curve (80, 90, 95) is the average of direction E's ramps. The dark end is lower than Material's because dark-mode bands at tone 20 looked heavy at full chroma. Four palettes override the curve, each to match what E drew: **build** and **invest** keep more chroma in their light tones, so build-80 reads yellow and invest-80 green rather than beige and sage; **trade** has a low-chroma seed, so its light tones keep proportionally more; **success** and **warning** keep a little more chroma at 95 so their containers are recognisable.

Tones generated: neutral 10, 12, 17, 20, 22, 24, 30, 40, 50, 60, 70, 80, 90, 94, 96, 100; every other palette 10, 20, 25, 30, 35, 40, 50, 60, 70, 75, 80, 90, 95. The full values are in `tokens/palette.json` and `dist/css/palette.css`.

### 2.3 Palettes

Generated. Seeds are direction E's action swatches (for the tints, v1's tint inks). Most E swatches sit at tone 40, so those palettes' 40s land on E's colours to within rounding; city indigo (31.9) and trade (35.2) are deeper, and the tint inks sit at 35 to 40.

| Palette | Seed (OKLAB) | Hue | Seed chroma | Seed tone | 30 | 40 | 80 | 90 | 95 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| neutral | none (hue and chroma only) | 275 | 0.004 | n/a | `oklab(0.3967 0.0003 -0.004)` | `oklab(0.4829 0.0003 -0.004)` | `oklab(0.8277 0.0003 -0.004)` | `oklab(0.9139 0.0003 -0.004)` |  |
| indigo | `oklab(0.421 0.011 -0.128)` | 274.9 | 0.1285 | 31.9 | `oklab(0.4037 0.0099 -0.1152)` | `oklab(0.4902 0.011 -0.128)` | `oklab(0.8306 0.0072 -0.0832)` | `oklab(0.9149 0.0033 -0.0384)` | `oklab(0.9574 0.0016 -0.0192)` |
| now | `oklab(0.485 -0.03 -0.153)` | 258.9 | 0.1559 | 39.7 | `oklab(0.4014 -0.027 -0.1377)` | `oklab(0.4874 -0.03 -0.153)` | `oklab(0.8276 -0.0166 -0.0845)` | `oklab(0.9135 -0.008 -0.041)` | `oklab(0.9567 -0.004 -0.0202)` |
| transport | `oklab(0.501 0.111 0.1)` | 42 | 0.1494 | 40.3 | `oklab(0.4094 0.0916 0.0825)` | `oklab(0.4982 0.111 0.1)` | `oklab(0.8364 0.0705 0.0636)` | `oklab(0.9177 0.033 0.0298)` | `oklab(0.9588 0.016 0.0144)` |
| visit | `oklab(0.502 0.155 -0.016)` | 354.1 | 0.1558 | 39.9 | `oklab(0.4151 0.1395 -0.0144)` | `oklab(0.5033 0.155 -0.016)` | `oklab(0.8405 0.0993 -0.0102)` | `oklab(0.9198 0.0462 -0.0048)` | `oklab(0.9598 0.0223 -0.0023)` |
| justice | `oklab(0.492 0.059 -0.113)` | 297.6 | 0.1275 | 39.6 | `oklab(0.408 0.0531 -0.1017)` | `oklab(0.4951 0.059 -0.113)` | `oklab(0.8342 0.0383 -0.0735)` | `oklab(0.9166 0.0177 -0.0339)` | `oklab(0.9583 0.0088 -0.017)` |
| build | `oklab(0.486 0.011 0.099)` | 83.7 | 0.0996 | 40.1 | `oklab(0.3984 0.009 0.0813)` | `oklab(0.4851 0.011 0.099)` | `oklab(0.8304 0.0156 0.1406)` | `oklab(0.9149 0.0097 0.0871)` | `oklab(0.9571 0.0041 0.0366)` |
| invest | `oklab(0.472 -0.093 0.074)` | 141.5 | 0.1188 | 40.1 | `oklab(0.3864 -0.0837 0.0666)` | `oklab(0.4713 -0.093 0.074)` | `oklab(0.8145 -0.1023 0.0814)` | `oklab(0.9055 -0.0632 0.0503)` | `oklab(0.9529 -0.0298 0.0237)` |
| trade | `oklab(0.44 -0.018 -0.046)` | 248.6 | 0.0494 | 35.2 | `oklab(0.3956 -0.0162 -0.0414)` | `oklab(0.4816 -0.018 -0.046)` | `oklab(0.8263 -0.0169 -0.0432)` | `oklab(0.9131 -0.0085 -0.0216)` | `oklab(0.9565 -0.0043 -0.011)` |
| error | `oklab(0.508 0.183 0.098)` | 28.2 | 0.2076 | 40 | `oklab(0.4173 0.1504 0.0806)` | `oklab(0.508 0.183 0.098)` | `oklab(0.8375 0.0791 0.0424)` | `oklab(0.9183 0.0369 0.0198)` | `oklab(0.9591 0.0178 0.0096)` |
| success | `oklab(0.469 -0.11 0.067)` | 148.7 | 0.1288 | 40 | `oklab(0.385 -0.0934 0.0569)` | `oklab(0.4691 -0.11 0.067)` | `oklab(0.8182 -0.0715 0.0436)` | `oklab(0.9094 -0.033 0.0201)` | `oklab(0.9525 -0.033 0.0201)` |
| warning | `oklab(0.487 0.032 0.099)` | 72.1 | 0.104 | 39.9 | `oklab(0.4007 0.0264 0.0816)` | `oklab(0.4878 0.032 0.099)` | `oklab(0.83 0.0208 0.0643)` | `oklab(0.9147 0.0096 0.0297)` | `oklab(0.9578 0.009 0.0277)` |
| info | `oklab(0.484 -0.027 -0.13)` | 258.3 | 0.1328 | 39.8 | `oklab(0.3996 -0.0243 -0.117)` | `oklab(0.4856 -0.027 -0.13)` | `oklab(0.8275 -0.0176 -0.0845)` | `oklab(0.9135 -0.0081 -0.039)` | `oklab(0.9567 -0.0041 -0.0195)` |
| tint-blue | `oklab(0.47 -0.029 -0.137)` | 258 | 0.14 | 38.1 | `oklab(0.4 -0.0261 -0.1233)` | `oklab(0.486 -0.029 -0.137)` | `oklab(0.8275 -0.0179 -0.0845)` | `oklab(0.9134 -0.0087 -0.0411)` | `oklab(0.9567 -0.0043 -0.0202)` |
| tint-violet | `oklab(0.47 0.07 -0.121)` | 300 | 0.1398 | 36.8 | `oklab(0.4099 0.063 -0.1089)` | `oklab(0.4972 0.07 -0.121)` | `oklab(0.8353 0.0455 -0.0786)` | `oklab(0.9171 0.021 -0.0363)` | `oklab(0.9585 0.0105 -0.0181)` |
| tint-rose | `oklab(0.47 0.137 0.029)` | 12 | 0.14 | 36.5 | `oklab(0.4126 0.1233 0.0261)` | `oklab(0.5005 0.137 0.029)` | `oklab(0.8388 0.0883 0.0187)` | `oklab(0.9189 0.0411 0.0087)` | `oklab(0.9594 0.0198 0.0042)` |
| tint-orange | `oklab(0.45 0.062 0.079)` | 51.9 | 0.1004 | 35.2 | `oklab(0.4043 0.0558 0.0711)` | `oklab(0.4912 0.062 0.079)` | `oklab(0.8325 0.0403 0.0513)` | `oklab(0.9159 0.0186 0.0237)` | `oklab(0.9579 0.0093 0.0118)` |
| tint-amber | `oklab(0.45 0.013 0.089)` | 81.7 | 0.0899 | 35.9 | `oklab(0.3988 0.0117 0.0801)` | `oklab(0.4851 0.013 0.089)` | `oklab(0.8284 0.0084 0.0579)` | `oklab(0.914 0.0039 0.0267)` | `oklab(0.957 0.0019 0.0134)` |
| tint-green | `oklab(0.47 -0.11 0.086)` | 142 | 0.1396 | 40.1 | `oklab(0.3847 -0.099 0.0774)` | `oklab(0.4695 -0.11 0.086)` | `oklab(0.8182 -0.0715 0.0559)` | `oklab(0.9094 -0.033 0.0258)` | `oklab(0.9547 -0.0165 0.0129)` |

**Neutral.** Direction E's neutrals have a trace of hue between 163° and 194° (chroma 0.004): below the teal check's threshold, but on the teal side of grey. v2 keeps the same tones and gives them a trace of city indigo instead (hue 275°, chroma 0.004), so the greys lean cool towards the primary rather than towards teal. Neutral tones (generated):

| Tone | OKLAB | Contrast with white | Contrast with neutral-10 |
| --- | --- | --- | --- |
| 10 | `oklab(0.2242 0.0003 -0.004)` | 17.14:1 | 1.00:1 |
| 12 | `oklab(0.2415 0.0003 -0.004)` | 16.39:1 | 1.05:1 |
| 17 | `oklab(0.2846 0.0003 -0.004)` | 14.38:1 | 1.19:1 |
| 20 | `oklab(0.3104 0.0003 -0.004)` | 13.14:1 | 1.30:1 |
| 22 | `oklab(0.3277 0.0003 -0.004)` | 12.33:1 | 1.39:1 |
| 24 | `oklab(0.3449 0.0003 -0.004)` | 11.54:1 | 1.49:1 |
| 30 | `oklab(0.3967 0.0003 -0.004)` | 9.35:1 | 1.83:1 |
| 40 | `oklab(0.4829 0.0003 -0.004)` | 6.46:1 | 2.65:1 |
| 50 | `oklab(0.5691 0.0003 -0.004)` | 4.48:1 | 3.82:1 |
| 60 | `oklab(0.6553 0.0003 -0.004)` | 3.17:1 | 5.41:1 |
| 70 | `oklab(0.7415 0.0003 -0.004)` | 2.30:1 | 7.47:1 |
| 80 | `oklab(0.8277 0.0003 -0.004)` | 1.70:1 | 10.07:1 |
| 90 | `oklab(0.9139 0.0003 -0.004)` | 1.29:1 | 13.27:1 |
| 94 | `oklab(0.9484 0.0003 -0.004)` | 1.16:1 | 14.74:1 |
| 96 | `oklab(0.9656 0.0003 -0.004)` | 1.11:1 | 15.51:1 |
| 100 | `oklab(1 0 0)` | 1.00:1 | 17.14:1 |

**City indigo** is the shared primary. Its seed is E's primary-40 exactly, which measures tone 31.9 (8.73:1 on white), deliberately deeper than the channels' tone 40 so that it reads as the network colour and not as one more channel. The `primary` role takes tone 30 (9.35:1), the nearest generated tone (decision D1).

**No secondary palette.** E defines a `secondary-40` but never uses it. In v2 the channels carry every colour other than indigo, so there is no secondary role (decision D2).

**Semantic palettes** (error, success, warning, info) use E's 40s as seeds. **Info** shares Dubai Now's hue (258° against 259°). That is acceptable because status is never shown by colour alone, but see decision D10.

### 2.4 System roles

Components use roles, never palette tones. Light and dark values (generated):

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--sc-color-surface` | neutral-100<br>`oklab(1 0 0)` | neutral-10<br>`oklab(0.2242 0.0003 -0.004)` | Page background |
| `--sc-color-surface-card` | neutral-100<br>`oklab(1 0 0)` | neutral-12<br>`oklab(0.2415 0.0003 -0.004)` | Cards, fields, list groups, dialogs and sheets |
| `--sc-color-surface-container` | neutral-96<br>`oklab(0.9656 0.0003 -0.004)` | neutral-17<br>`oklab(0.2846 0.0003 -0.004)` | Bands, panels, table headers, totals rows |
| `--sc-color-surface-container-high` | neutral-94<br>`oklab(0.9484 0.0003 -0.004)` | neutral-22<br>`oklab(0.3277 0.0003 -0.004)` | A container nested in a container; skeletons |
| `--sc-color-on-surface` | neutral-10<br>`oklab(0.2242 0.0003 -0.004)` | neutral-100<br>`oklab(1 0 0)` | Primary text and icons |
| `--sc-color-on-surface-variant` | neutral-40<br>`oklab(0.4829 0.0003 -0.004)` | neutral-80<br>`oklab(0.8277 0.0003 -0.004)` | Secondary text: hints, captions, metadata |
| `--sc-color-outline` | neutral-40<br>`oklab(0.4829 0.0003 -0.004)` | neutral-60<br>`oklab(0.6553 0.0003 -0.004)` | Control boundaries (1.5px) and inactive markers; at least 3:1 |
| `--sc-color-outline-variant` | neutral-90<br>`oklab(0.9139 0.0003 -0.004)` | neutral-24<br>`oklab(0.3449 0.0003 -0.004)` | Dividers and card edges only; never the only edge of a control |
| `--sc-color-inverse-surface` | neutral-20<br>`oklab(0.3104 0.0003 -0.004)` | neutral-90<br>`oklab(0.9139 0.0003 -0.004)` | Tooltips and toasts |
| `--sc-color-inverse-on-surface` | neutral-96<br>`oklab(0.9656 0.0003 -0.004)` | neutral-10<br>`oklab(0.2242 0.0003 -0.004)` | Text on inverse-surface |
| `--sc-color-disabled-container` | neutral-94<br>`oklab(0.9484 0.0003 -0.004)` | neutral-20<br>`oklab(0.3104 0.0003 -0.004)` | Fill of a disabled control |
| `--sc-color-on-disabled` | neutral-50<br>`oklab(0.5691 0.0003 -0.004)` | neutral-60<br>`oklab(0.6553 0.0003 -0.004)` | Text, icons and edges of a disabled control |
| `--sc-color-focus-ring` | neutral-10<br>`oklab(0.2242 0.0003 -0.004)` | neutral-100<br>`oklab(1 0 0)` | The 3px focus ring, drawn outside a 2px gap of surface |
| `--sc-color-primary` | indigo-30<br>`oklab(0.4037 0.0099 -0.1152)` | indigo-80<br>`oklab(0.8306 0.0072 -0.0832)` | City indigo: the network strip, sign-in and Dubai Pay hand-offs |
| `--sc-color-on-primary` | neutral-100<br>`oklab(1 0 0)` | neutral-10<br>`oklab(0.2242 0.0003 -0.004)` | Text and icons on primary |
| `--sc-color-primary-hover` | indigo-25<br>`oklab(0.3585 0.0077 -0.0896)` | indigo-75<br>`oklab(0.7882 0.0082 -0.096)` | Primary fill on pointer hover |
| `--sc-color-primary-pressed` | indigo-20<br>`oklab(0.3131 0.0049 -0.0576)` | indigo-70<br>`oklab(0.7459 0.0093 -0.1088)` | Primary fill while pressed |
| `--sc-color-primary-container` | indigo-90<br>`oklab(0.9149 0.0033 -0.0384)` | indigo-30<br>`oklab(0.4037 0.0099 -0.1152)` | Selected or emphasised indigo container |
| `--sc-color-on-primary-container` | indigo-30<br>`oklab(0.4037 0.0099 -0.1152)` | indigo-90<br>`oklab(0.9149 0.0033 -0.0384)` | Text and icons on primary-container |
| `--sc-color-primary-subtle` | indigo-95<br>`oklab(0.9574 0.0016 -0.0192)` | indigo-20<br>`oklab(0.3131 0.0049 -0.0576)` | Quiet indigo band or tint |
| `--sc-color-error` | error-40<br>`oklab(0.508 0.183 0.098)` | error-80<br>`oklab(0.8375 0.0791 0.0424)` | Error text, icons, field edges and destructive fills |
| `--sc-color-on-error` | neutral-100<br>`oklab(1 0 0)` | neutral-10<br>`oklab(0.2242 0.0003 -0.004)` | Text and icons on an error fill |
| `--sc-color-error-hover` | error-35<br>`oklab(0.4626 0.1664 0.0891)` | error-75<br>`oklab(0.7975 0.1024 0.0548)` | Destructive fill on pointer hover |
| `--sc-color-error-pressed` | error-30<br>`oklab(0.4173 0.1504 0.0806)` | error-70<br>`oklab(0.7578 0.1275 0.0683)` | Destructive fill while pressed |
| `--sc-color-error-container` | error-95<br>`oklab(0.9591 0.0178 0.0096)` | error-20<br>`oklab(0.3213 0.0823 0.0441)` | Error summary, error chip and callout background |
| `--sc-color-on-error-container` | error-30<br>`oklab(0.4173 0.1504 0.0806)` | error-90<br>`oklab(0.9183 0.0369 0.0198)` | Strong text on error-container |
| `--sc-color-success` | success-40<br>`oklab(0.4691 -0.11 0.067)` | success-80<br>`oklab(0.8182 -0.0715 0.0436)` | Success text and icons; completed step markers |
| `--sc-color-on-success` | neutral-100<br>`oklab(1 0 0)` | neutral-10<br>`oklab(0.2242 0.0003 -0.004)` | Text and icons on a success fill |
| `--sc-color-success-container` | success-95<br>`oklab(0.9525 -0.033 0.0201)` | success-20<br>`oklab(0.304 -0.0495 0.0302)` | Success chip and callout background |
| `--sc-color-on-success-container` | success-30<br>`oklab(0.385 -0.0934 0.0569)` | success-90<br>`oklab(0.9094 -0.033 0.0201)` | Strong text on success-container |
| `--sc-color-warning` | warning-40<br>`oklab(0.4878 0.032 0.099)` | warning-80<br>`oklab(0.83 0.0208 0.0643)` | Warning text and icons |
| `--sc-color-on-warning` | neutral-100<br>`oklab(1 0 0)` | neutral-10<br>`oklab(0.2242 0.0003 -0.004)` | Text and icons on a warning fill |
| `--sc-color-warning-container` | warning-95<br>`oklab(0.9578 0.009 0.0277)` | warning-20<br>`oklab(0.3123 0.0144 0.0445)` | Warning chip and callout background |
| `--sc-color-on-warning-container` | warning-30<br>`oklab(0.4007 0.0264 0.0816)` | warning-90<br>`oklab(0.9147 0.0096 0.0297)` | Strong text on warning-container |
| `--sc-color-info` | info-40<br>`oklab(0.4856 -0.027 -0.13)` | info-80<br>`oklab(0.8275 -0.0176 -0.0845)` | Information text and icons |
| `--sc-color-on-info` | neutral-100<br>`oklab(1 0 0)` | neutral-10<br>`oklab(0.2242 0.0003 -0.004)` | Text and icons on an info fill |
| `--sc-color-info-container` | info-95<br>`oklab(0.9567 -0.0041 -0.0195)` | info-20<br>`oklab(0.311 -0.0122 -0.0585)` | Information chip and callout background |
| `--sc-color-on-info-container` | info-30<br>`oklab(0.3996 -0.0243 -0.117)` | info-90<br>`oklab(0.9135 -0.0081 -0.039)` | Strong text on info-container |
| `--sc-color-channel-on-action` | neutral-100<br>`oklab(1 0 0)` | neutral-10<br>`oklab(0.2242 0.0003 -0.004)` | Text and icons on any channel action fill (the same in every channel) |
| `--sc-color-scrim` | `oklab(0 0 0 / 0.5)` | `oklab(0 0 0 / 0.64)` | Behind modal dialogs and sheets |
| `--sc-color-shadow` | `oklab(0 0 0)` | `oklab(0 0 0)` | Base shadow colour; elevation layers set their own alpha |

Rules:

- **COL-01.** `outline` (neutral-40 in light) is the only colour for the edge of a control: text fields, selects, checkboxes, radios, outlined buttons, the inactive stepper marker. Its edge is 1.5px (`--sc-size-border-control`). It passes 3:1 against every surface (5.55:1 at the lowest, on `surface-container-high`).
- **COL-02.** `outline-variant` (neutral-90 in light) is for dividers and card edges only. It is 1.29:1 on white and MUST NOT be the only boundary of anything interactive. This is the fix for DDS's 1px neutral-90 control edges.
- **COL-03.** Pages are `surface` (white in light). Cards, fields and dialogs are `surface-card`, which is also white in light, so a card on a white page is defined by its 1px `outline-variant` edge, not by a shadow. Bands and panels (the "Most used services" band, a totals row) are `surface-container`. In dark mode the three step up: neutral-10, 12 and 17.
- **COL-04.** Text is `on-surface` or `on-surface-variant`. There is no third text colour and no "strong" ink: hierarchy comes from size and weight.
- **COL-05.** In dark mode, actions take tone 80 with neutral-10 text, containers take tone 30 and bands tone 20. That is E's rule, applied to every palette by the role map.
- **COL-06.** Disabled controls use `disabled-container` and `on-disabled`. WCAG exempts disabled controls from contrast, but v2 keeps them at 3:1 or more (3.85:1 light, 4.15:1 dark) so they remain legible. Prefer not disabling at all (Standard 2.0).
- **COL-07.** Colour MUST NOT be the only way to convey meaning. Status uses an icon and words; the current step has a marker shape and a label; a selected item has a shape or weight change as well as a fill.
- **COL-08.** Links are `--sc-color-channel-action` (or `primary` in the network chrome) and always underlined: 1px at a 4px offset, as in E. Visited links are not styled differently (decision D8).
- **COL-09.** In forced-colours mode, components map to system colours (`CanvasText`, `Canvas`, `LinkText`, `Highlight`, `ButtonText`, `GrayText`). Borders that exist only as background fills need a transparent border so they show. Q1 tests this.

### 2.5 State layers

Hover and press on quiet controls (outlined and text buttons, list rows, chips, menu items) use a state layer: the content colour at a low opacity over the control's own background. The layer is computed in CSS, so it adapts to channel and mode with no extra tokens:

```css
background: color-mix(in oklab, var(--sc-color-channel-action) var(--sc-opacity-hover), transparent);
```

| Token | Value | Use |
| --- | --- | --- |
| `--sc-opacity-hover` | 8% | Hover, on pointer devices only (`@media (hover: hover) and (pointer: fine)`) |
| `--sc-opacity-pressed` | 12% | While pressed |

Filled controls do not use layers; they have explicit hover and pressed tones (`primary-hover`, `channel-action-hover`, and so on: the action tone minus 5 and minus 10 in light, tone 75 and 70 in dark), so their text contrast is checked directly. Layers never reduce contrast below the thresholds: the check composites them and measures (section 2.8).

### 2.6 Channel roles

Seven channels, one structure. Each is a tonal palette; the roles take the same tones in every channel, except Dubai Trade, whose action is tone 35 as E drew it, because a tone-40 slate reads as grey (decision D4).

| Role | Light tone | Dark tone | Use |
| --- | --- | --- | --- |
| `--sc-color-channel-action` | 40 (trade 35) | 80 | Filled and outlined buttons, links, selected states, the current step, progress |
| `--sc-color-channel-action-hover` | action − 5 | 75 | Filled action on pointer hover |
| `--sc-color-channel-action-pressed` | action − 10 | 70 | Filled action while pressed |
| `--sc-color-channel-container` | 90 | 30 | Selected navigation item; emphasised container |
| `--sc-color-channel-on-container` | 30 | 90 | Text and icons on `channel-container` |
| `--sc-color-channel-subtle` | 95 | 20 | Hero band, tinted rows, the halo of the current step |
| `--sc-color-channel-on-action` | neutral-100 | neutral-10 | Text and icons on any action fill. The same in every channel, so it is bound once at `:root`. |

Text on `channel-subtle` is `on-surface` or `on-surface-variant`, or `channel-action` for links and eyebrows; all three are checked.

Light values (generated):

| Channel | `action` | `action-hover` | `action-pressed` | `container` | `on-container` | `subtle` |
| --- | --- | --- | --- | --- | --- | --- |
| now | 40 `oklab(0.4874 -0.03 -0.153)` | 35 `oklab(0.4444 -0.0285 -0.1454)` | 30 `oklab(0.4014 -0.027 -0.1377)` | 90 `oklab(0.9135 -0.008 -0.041)` | 30 `oklab(0.4014 -0.027 -0.1377)` | 95 `oklab(0.9567 -0.004 -0.0202)` |
| transport | 40 `oklab(0.4982 0.111 0.1)` | 35 `oklab(0.4539 0.1017 0.0916)` | 30 `oklab(0.4094 0.0916 0.0825)` | 90 `oklab(0.9177 0.033 0.0298)` | 30 `oklab(0.4094 0.0916 0.0825)` | 95 `oklab(0.9588 0.016 0.0144)` |
| visit | 40 `oklab(0.5033 0.155 -0.016)` | 35 `oklab(0.4592 0.1472 -0.0152)` | 30 `oklab(0.4151 0.1395 -0.0144)` | 90 `oklab(0.9198 0.0462 -0.0048)` | 30 `oklab(0.4151 0.1395 -0.0144)` | 95 `oklab(0.9598 0.0223 -0.0023)` |
| justice | 40 `oklab(0.4951 0.059 -0.113)` | 35 `oklab(0.4516 0.056 -0.1074)` | 30 `oklab(0.408 0.0531 -0.1017)` | 90 `oklab(0.9166 0.0177 -0.0339)` | 30 `oklab(0.408 0.0531 -0.1017)` | 95 `oklab(0.9583 0.0088 -0.017)` |
| build | 40 `oklab(0.4851 0.011 0.099)` | 35 `oklab(0.4418 0.01 0.09)` | 30 `oklab(0.3984 0.009 0.0813)` | 90 `oklab(0.9149 0.0097 0.0871)` | 30 `oklab(0.3984 0.009 0.0813)` | 95 `oklab(0.9571 0.0041 0.0366)` |
| invest | 40 `oklab(0.4713 -0.093 0.074)` | 35 `oklab(0.4288 -0.0883 0.0703)` | 30 `oklab(0.3864 -0.0837 0.0666)` | 90 `oklab(0.9055 -0.0632 0.0503)` | 30 `oklab(0.3864 -0.0837 0.0666)` | 95 `oklab(0.9529 -0.0298 0.0237)` |
| trade | 35 `oklab(0.4386 -0.0171 -0.0437)` | 30 `oklab(0.3956 -0.0162 -0.0414)` | 25 `oklab(0.3526 -0.0126 -0.0322)` | 90 `oklab(0.9131 -0.0085 -0.0216)` | 30 `oklab(0.3956 -0.0162 -0.0414)` | 95 `oklab(0.9565 -0.0043 -0.011)` |

Dark values (generated):

| Channel | `action` | `action-hover` | `action-pressed` | `container` | `on-container` | `subtle` |
| --- | --- | --- | --- | --- | --- | --- |
| now | 80 `oklab(0.8276 -0.0166 -0.0845)` | 75 `oklab(0.785 -0.021 -0.1072)` | 70 `oklab(0.7427 -0.0255 -0.13)` | 30 `oklab(0.4014 -0.027 -0.1377)` | 90 `oklab(0.9135 -0.008 -0.041)` | 20 `oklab(0.3115 -0.0135 -0.0689)` |
| transport | 80 `oklab(0.8364 0.0705 0.0636)` | 75 `oklab(0.7951 0.0832 0.075)` | 70 `oklab(0.7536 0.0943 0.085)` | 30 `oklab(0.4094 0.0916 0.0825)` | 90 `oklab(0.9177 0.033 0.0298)` | 20 `oklab(0.317 0.0499 0.045)` |
| visit | 80 `oklab(0.8405 0.0993 -0.0102)` | 75 `oklab(0.7996 0.1163 -0.012)` | 70 `oklab(0.7586 0.1318 -0.0136)` | 30 `oklab(0.4151 0.1395 -0.0144)` | 90 `oklab(0.9198 0.0462 -0.0048)` | 20 `oklab(0.3195 0.0698 -0.0072)` |
| justice | 80 `oklab(0.8342 0.0383 -0.0735)` | 75 `oklab(0.7923 0.0442 -0.0848)` | 70 `oklab(0.7505 0.0501 -0.0961)` | 30 `oklab(0.408 0.0531 -0.1017)` | 90 `oklab(0.9166 0.0177 -0.0339)` | 20 `oklab(0.3154 0.0265 -0.0509)` |
| build | 80 `oklab(0.8304 0.0156 0.1406)` | 75 `oklab(0.7866 0.0132 0.1188)` | 70 `oklab(0.7426 0.0094 0.0842)` | 30 `oklab(0.3984 0.009 0.0813)` | 90 `oklab(0.9149 0.0097 0.0871)` | 20 `oklab(0.3111 0.005 0.0446)` |
| invest | 80 `oklab(0.8145 -0.1023 0.0814)` | 75 `oklab(0.772 -0.0976 0.0777)` | 70 `oklab(0.7312 -0.079 0.0629)` | 30 `oklab(0.3864 -0.0837 0.0666)` | 90 `oklab(0.9055 -0.0632 0.0503)` | 20 `oklab(0.305 -0.0418 0.0333)` |
| trade | 80 `oklab(0.8263 -0.0169 -0.0432)` | 75 `oklab(0.7832 -0.0171 -0.0437)` | 70 `oklab(0.7402 -0.0153 -0.0391)` | 30 `oklab(0.3956 -0.0162 -0.0414)` | 90 `oklab(0.9131 -0.0085 -0.0216)` | 20 `oklab(0.3098 -0.0081 -0.0207)` |

Rules:

- **COL-10.** The channel is the theme. Entities (RTA, DEWA, Dubai Police) appear only as attribution text, never as colour.
- **COL-11.** City indigo (`primary`) carries only what all channels share: the network strip, sign-in with UAE PASS, Dubai Pay hand-offs and the "One network" row. Everything inside a channel's service uses the channel roles.
- **COL-12.** To show another channel's colour inside a page (an attribution chip, the channel row on the Dubai Now home), set `data-channel` on that element. Never hard-code another channel's values.

### 2.7 Decorative topic tints

Six tints for category icon tiles, favourite tiles and topic accents, re-derived from v1's `feat/tint-palette` as tonal palettes in the same system: the tile is tone 95 (dark 20), the icon and any short text on it tone 40 (dark 80). Hues and chromas are v1's. Generated:

| Tint | Tile (`--sc-color-tint-<name>`), light / dark | Icon and text (`--sc-color-on-tint-<name>`), light / dark | Topics |
| --- | --- | --- | --- |
| blue | `oklab(0.9567 -0.0043 -0.0202)` / `oklab(0.3111 -0.013 -0.0617)` | `oklab(0.486 -0.029 -0.137)` / `oklab(0.8275 -0.0179 -0.0845)` | transport, vehicles, travel |
| violet | `oklab(0.9585 0.0105 -0.0181)` / `oklab(0.3163 0.0315 -0.0544)` | `oklab(0.4972 0.07 -0.121)` / `oklab(0.8353 0.0455 -0.0786)` | residency, visas, identity |
| rose | `oklab(0.9594 0.0198 0.0042)` / `oklab(0.3182 0.0617 0.013)` | `oklab(0.5005 0.137 0.029)` / `oklab(0.8388 0.0883 0.0187)` | family, social support, people |
| orange | `oklab(0.9579 0.0093 0.0118)` / `oklab(0.3139 0.0279 0.0355)` | `oklab(0.4912 0.062 0.079)` / `oklab(0.8325 0.0403 0.0513)` | housing, utilities, home |
| amber | `oklab(0.957 0.0019 0.0134)` / `oklab(0.3112 0.0058 0.0401)` | `oklab(0.4851 0.013 0.089)` / `oklab(0.8284 0.0084 0.0579)` | bills, money, payments due |
| green | `oklab(0.9547 -0.0165 0.0129)` / `oklab(0.3041 -0.0495 0.0387)` | `oklab(0.4695 -0.11 0.086)` / `oklab(0.8182 -0.0715 0.0559)` | health, environment |

- **COL-13.** Tints are decorative only. They MUST NOT mark actions, links, status or selection, and they MUST NOT carry meaning on their own: the tile always has a text label. Several share a hue family with a channel or a status (blue with Dubai Now and info, violet with Justice, orange with Transport, amber with Build, green with Invest and success); because tints never sit where those colours carry meaning, this is acceptable (decision D11).

### 2.8 Contrast, every pair

`npm run check:contrast` recomputes every pair below, in both modes and for all seven channels, and fails the build if any falls under its minimum. Minimums: 4.5:1 for text (WCAG 1.4.3), 3:1 for control edges, focus indicators and meaningful graphics (WCAG 1.4.11 and 2.4.13). A background written `base+hover:content` is the base with a state layer of the content colour on top, composited as browsers do. 388 pairs pass; the tightest is `channel-action` text on `channel-container` at 5.00:1 (light) and 5.49:1 (dark). Generated by `npm run report:contrast`:

| Group | Foreground | Background | Min | Light | Dark | Use |
| --- | --- | --- | --- | --- | --- | --- |
| Text | `on-surface` | `surface` | 4.5:1 | 17.14:1 | 17.14:1 | Primary text |
| Text | `on-surface` | `surface-card` | 4.5:1 | 17.14:1 | 16.39:1 | Primary text |
| Text | `on-surface` | `surface-container` | 4.5:1 | 15.51:1 | 14.38:1 | Primary text |
| Text | `on-surface` | `surface-container-high` | 4.5:1 | 14.74:1 | 12.33:1 | Primary text |
| Text | `on-surface` | `primary-subtle` | 4.5:1 | 15.12:1 | 13.14:1 | Primary text |
| Text | `on-surface` | `primary-container` | 4.5:1 | 13.27:1 | 9.35:1 | Primary text |
| Text | `on-surface-variant` | `surface` | 4.5:1 | 6.46:1 | 10.07:1 | Secondary text |
| Text | `on-surface-variant` | `surface-card` | 4.5:1 | 6.46:1 | 9.63:1 | Secondary text |
| Text | `on-surface-variant` | `surface-container` | 4.5:1 | 5.84:1 | 8.45:1 | Secondary text |
| Text | `on-surface-variant` | `surface-container-high` | 4.5:1 | 5.55:1 | 7.24:1 | Secondary text |
| Text | `on-surface-variant` | `primary-subtle` | 4.5:1 | 5.70:1 | 7.72:1 | Secondary text |
| Text | `inverse-on-surface` | `inverse-surface` | 4.5:1 | 11.89:1 | 13.27:1 | Tooltip and toast text |
| State layers | `on-surface` | `surface+hover:on-surface` | 4.5:1 | 14.61:1 | 13.65:1 | Text on a hovered or pressed quiet control |
| State layers | `on-surface` | `surface+pressed:on-surface` | 4.5:1 | 13.44:1 | 11.95:1 | Text on a hovered or pressed quiet control |
| State layers | `on-surface` | `surface-container+pressed:on-surface` | 4.5:1 | 12.21:1 | 9.82:1 | Text on a hovered or pressed quiet control |
| Boundaries | `outline` | `surface` | 3:1 | 6.46:1 | 5.41:1 | Control edge (1.5px) |
| Boundaries | `outline` | `surface-card` | 3:1 | 6.46:1 | 5.17:1 | Control edge (1.5px) |
| Boundaries | `outline` | `surface-container` | 3:1 | 5.84:1 | 4.54:1 | Control edge (1.5px) |
| Boundaries | `outline` | `surface-container-high` | 3:1 | 5.55:1 | 3.89:1 | Control edge (1.5px) |
| Boundaries | `outline` | `primary-subtle` | 3:1 | 5.70:1 | 4.15:1 | Control edge (1.5px) |
| Boundaries | `on-disabled` | `disabled-container` | 3:1 | 3.85:1 | 4.15:1 | Disabled control (exempt in WCAG; held to 3:1 anyway) |
| Focus | `focus-ring` | `surface` | 3:1 | 17.14:1 | 17.14:1 | Focus ring against what surrounds it |
| Focus | `focus-ring` | `surface-card` | 3:1 | 17.14:1 | 16.39:1 | Focus ring against what surrounds it |
| Focus | `focus-ring` | `surface-container` | 3:1 | 15.51:1 | 14.38:1 | Focus ring against what surrounds it |
| Focus | `focus-ring` | `surface-container-high` | 3:1 | 14.74:1 | 12.33:1 | Focus ring against what surrounds it |
| Focus | `focus-ring` | `primary-subtle` | 3:1 | 15.12:1 | 13.14:1 | Focus ring against what surrounds it |
| Focus | `focus-ring` | `error-container` | 3:1 | 15.12:1 | 13.14:1 | Focus ring against what surrounds it |
| Focus | `focus-ring` | `success-container` | 3:1 | 15.12:1 | 13.15:1 | Focus ring against what surrounds it |
| Focus | `focus-ring` | `warning-container` | 3:1 | 15.12:1 | 13.14:1 | Focus ring against what surrounds it |
| Focus | `focus-ring` | `info-container` | 3:1 | 15.12:1 | 13.14:1 | Focus ring against what surrounds it |
| Primary | `on-primary` | `primary` | 4.5:1 | 9.35:1 | 10.07:1 | Text on city indigo fills |
| Primary | `on-primary` | `primary-hover` | 4.5:1 | 11.15:1 | 8.70:1 | Text on city indigo fills |
| Primary | `on-primary` | `primary-pressed` | 4.5:1 | 13.14:1 | 7.47:1 | Text on city indigo fills |
| Primary | `on-primary-container` | `primary-container` | 4.5:1 | 7.24:1 | 7.24:1 | Text on indigo container |
| Primary | `primary` | `surface` | 4.5:1 | 9.35:1 | 10.07:1 | Indigo text and links |
| Primary | `primary` | `surface-card` | 4.5:1 | 9.35:1 | 9.63:1 | Indigo text and links |
| Primary | `primary` | `surface-container` | 4.5:1 | 8.46:1 | 8.45:1 | Indigo text and links |
| Primary | `primary` | `primary-subtle` | 4.5:1 | 8.24:1 | 7.72:1 | Indigo text and links |
| Status | `error` | `error-container` | 4.5:1 | 5.70:1 | 7.72:1 | error text and icon |
| Status | `error` | `surface` | 4.5:1 | 6.46:1 | 10.07:1 | error text and icon |
| Status | `error` | `surface-card` | 4.5:1 | 6.46:1 | 9.63:1 | error text and icon |
| Status | `error` | `surface-container` | 4.5:1 | 5.85:1 | 8.45:1 | error text and icon |
| Status | `on-error` | `error` | 4.5:1 | 6.46:1 | 10.07:1 | Text on a error fill |
| Status | `on-error-container` | `error-container` | 4.5:1 | 8.24:1 | 10.18:1 | Strong text in a error callout |
| Status | `on-surface` | `error-container` | 4.5:1 | 15.12:1 | 13.14:1 | Body text in a error callout |
| Status | `success` | `success-container` | 4.5:1 | 5.70:1 | 7.72:1 | success text and icon |
| Status | `success` | `surface` | 4.5:1 | 6.46:1 | 10.07:1 | success text and icon |
| Status | `success` | `surface-card` | 4.5:1 | 6.46:1 | 9.63:1 | success text and icon |
| Status | `success` | `surface-container` | 4.5:1 | 5.85:1 | 8.44:1 | success text and icon |
| Status | `on-success` | `success` | 4.5:1 | 6.46:1 | 10.07:1 | Text on a success fill |
| Status | `on-success-container` | `success-container` | 4.5:1 | 8.24:1 | 10.18:1 | Strong text in a success callout |
| Status | `on-surface` | `success-container` | 4.5:1 | 15.12:1 | 13.15:1 | Body text in a success callout |
| Status | `warning` | `warning-container` | 4.5:1 | 5.70:1 | 7.72:1 | warning text and icon |
| Status | `warning` | `surface` | 4.5:1 | 6.46:1 | 10.07:1 | warning text and icon |
| Status | `warning` | `surface-card` | 4.5:1 | 6.46:1 | 9.63:1 | warning text and icon |
| Status | `warning` | `surface-container` | 4.5:1 | 5.85:1 | 8.45:1 | warning text and icon |
| Status | `on-warning` | `warning` | 4.5:1 | 6.46:1 | 10.07:1 | Text on a warning fill |
| Status | `on-warning-container` | `warning-container` | 4.5:1 | 8.24:1 | 10.18:1 | Strong text in a warning callout |
| Status | `on-surface` | `warning-container` | 4.5:1 | 15.12:1 | 13.14:1 | Body text in a warning callout |
| Status | `info` | `info-container` | 4.5:1 | 5.70:1 | 7.72:1 | info text and icon |
| Status | `info` | `surface` | 4.5:1 | 6.46:1 | 10.07:1 | info text and icon |
| Status | `info` | `surface-card` | 4.5:1 | 6.46:1 | 9.63:1 | info text and icon |
| Status | `info` | `surface-container` | 4.5:1 | 5.85:1 | 8.45:1 | info text and icon |
| Status | `on-info` | `info` | 4.5:1 | 6.46:1 | 10.07:1 | Text on a info fill |
| Status | `on-info-container` | `info-container` | 4.5:1 | 8.24:1 | 10.18:1 | Strong text in a info callout |
| Status | `on-surface` | `info-container` | 4.5:1 | 15.12:1 | 13.14:1 | Body text in a info callout |
| Status | `on-error` | `error-hover` | 4.5:1 | 7.78:1 | 8.70:1 | Destructive button states |
| Status | `on-error` | `error-pressed` | 4.5:1 | 9.34:1 | 7.47:1 | Destructive button states |
| Status | `error` | `surface-card+hover:error` | 4.5:1 | 5.57:1 | 8.13:1 | Error text on a hovered destructive outlined button |
| Decorative tints | `on-tint-blue` | `tint-blue` | 4.5:1 | 5.70:1 | 7.72:1 | Icon and short text on a topic tile |
| Decorative tints | `on-tint-violet` | `tint-violet` | 4.5:1 | 5.70:1 | 7.72:1 | Icon and short text on a topic tile |
| Decorative tints | `on-tint-rose` | `tint-rose` | 4.5:1 | 5.70:1 | 7.72:1 | Icon and short text on a topic tile |
| Decorative tints | `on-tint-orange` | `tint-orange` | 4.5:1 | 5.70:1 | 7.72:1 | Icon and short text on a topic tile |
| Decorative tints | `on-tint-amber` | `tint-amber` | 4.5:1 | 5.70:1 | 7.72:1 | Icon and short text on a topic tile |
| Decorative tints | `on-tint-green` | `tint-green` | 4.5:1 | 5.70:1 | 7.72:1 | Icon and short text on a topic tile |

Channels, light / dark:

| Foreground | Background | Min | now | transport | visit | justice | build | invest | trade |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `channel-on-action` | `channel-action` | 4.5:1 | 6.46 / 10.07 | 6.46 / 10.07 | 6.46 / 10.07 | 6.46 / 10.07 | 6.46 / 10.07 | 6.46 / 10.07 | 7.78 / 10.07 |
| `channel-on-action` | `channel-action-hover` | 4.5:1 | 7.78 / 8.70 | 7.78 / 8.70 | 7.78 / 8.70 | 7.78 / 8.70 | 7.78 / 8.70 | 7.78 / 8.70 | 9.34 / 8.70 |
| `channel-on-action` | `channel-action-pressed` | 4.5:1 | 9.34 / 7.47 | 9.34 / 7.47 | 9.34 / 7.47 | 9.35 / 7.47 | 9.35 / 7.47 | 9.34 / 7.47 | 11.15 / 7.47 |
| `channel-action` | `surface` | 4.5:1 | 6.46 / 10.07 | 6.46 / 10.07 | 6.46 / 10.07 | 6.46 / 10.07 | 6.46 / 10.07 | 6.46 / 10.07 | 7.78 / 10.07 |
| `channel-action` | `surface-card` | 4.5:1 | 6.46 / 9.63 | 6.46 / 9.63 | 6.46 / 9.63 | 6.46 / 9.63 | 6.46 / 9.63 | 6.46 / 9.63 | 7.78 / 9.63 |
| `channel-action` | `surface-container` | 4.5:1 | 5.85 / 8.45 | 5.85 / 8.45 | 5.85 / 8.45 | 5.85 / 8.45 | 5.85 / 8.45 | 5.85 / 8.45 | 7.04 / 8.45 |
| `channel-action` | `channel-subtle` | 4.5:1 | 5.70 / 7.72 | 5.70 / 7.72 | 5.70 / 7.72 | 5.70 / 7.72 | 5.70 / 7.72 | 5.70 / 7.72 | 6.86 / 7.72 |
| `channel-action` | `channel-container` | 4.5:1 | 5.00 / 5.49 | 5.00 / 5.49 | 5.00 / 5.49 | 5.00 / 5.49 | 5.00 / 5.49 | 5.00 / 5.49 | 6.02 / 5.49 |
| `channel-action` | `surface-card+hover:channel-action` | 4.5:1 | 5.74 / 8.12 | 5.72 / 8.13 | 5.72 / 8.13 | 5.77 / 8.11 | 5.76 / 8.14 | 5.76 / 8.13 | 6.89 / 8.11 |
| `channel-action` | `surface-card+pressed:channel-action` | 4.5:1 | 5.41 / 7.37 | 5.37 / 7.40 | 5.37 / 7.40 | 5.44 / 7.37 | 5.43 / 7.41 | 5.43 / 7.39 | 6.47 / 7.37 |
| `channel-on-container` | `channel-container` | 4.5:1 | 7.24 / 7.24 | 7.23 / 7.23 | 7.24 / 7.24 | 7.24 / 7.24 | 7.24 / 7.24 | 7.24 / 7.24 | 7.24 / 7.24 |
| `on-surface` | `channel-subtle` | 4.5:1 | 15.12 / 13.14 | 15.12 / 13.14 | 15.12 / 13.14 | 15.12 / 13.14 | 15.12 / 13.14 | 15.12 / 13.14 | 15.12 / 13.14 |
| `on-surface` | `channel-container` | 4.5:1 | 13.27 / 9.34 | 13.27 / 9.34 | 13.27 / 9.34 | 13.27 / 9.35 | 13.27 / 9.35 | 13.27 / 9.34 | 13.27 / 9.34 |
| `on-surface-variant` | `channel-subtle` | 4.5:1 | 5.70 / 7.72 | 5.70 / 7.72 | 5.70 / 7.72 | 5.70 / 7.72 | 5.70 / 7.72 | 5.70 / 7.72 | 5.70 / 7.72 |
| `outline` | `channel-subtle` | 3:1 | 5.70 / 4.15 | 5.70 / 4.15 | 5.70 / 4.15 | 5.70 / 4.15 | 5.70 / 4.15 | 5.70 / 4.15 | 5.70 / 4.15 |
| `focus-ring` | `channel-subtle` | 3:1 | 15.12 / 13.14 | 15.12 / 13.14 | 15.12 / 13.14 | 15.12 / 13.14 | 15.12 / 13.14 | 15.12 / 13.14 | 15.12 / 13.14 |
| `channel-action` | `surface` | 3:1 | 6.46 / 10.07 | 6.46 / 10.07 | 6.46 / 10.07 | 6.46 / 10.07 | 6.46 / 10.07 | 6.46 / 10.07 | 7.78 / 10.07 |

Pairs not in these tables have not been designed for. A service that combines roles another way MUST measure the pair itself (as Standard 2.0 FND-05 already says).

**Charts** still have no palette (v1 OQ-21). Until they do, charts use `on-surface`, `on-surface-variant`, `outline` and `channel-action`, label every series directly, and separate series by shape or pattern as well as colour.

---

## 3. Typography

### 3.1 Family and weights

**Dubai Font** (family Dubai W23) for both scripts. Each weight ships as its own family locally, so the tokens name them per weight: `--sc-font-family-regular` (400), `-medium` (500), `-bold` (700). Light (300) exists in the tokens but no role uses it.

- **TYP-01.** Dubai Font only. No channel, entity or service introduces another typeface.
- **TYP-02.** Text is set with a role (section 3.2), never a free size.

### 3.2 Scale

A Material-style scale of 15 roles, with English and Arabic values. Arabic runs about one step larger, with taller leading, in the same weight family: where English uses Medium for short UI text, Arabic uses Bold (carried from v1, decision D12). Sizes and line heights are px; tracking is em.

| Role | Use | English size / leading, weight, tracking | Arabic size / leading, weight |
| --- | --- | --- | --- |
| `display-large` | Home hero, from 1024px | 80 / 84, Bold, −0.02em | 88 / 108, Bold |
| `display-medium` | Channel hero, from 1024px | 57 / 62, Bold, −0.015em | 64 / 80, Bold |
| `display-small` | Heroes below 1024px; wide marketing headings | 45 / 50, Bold, −0.01em | 50 / 64, Bold |
| `headline-large` | Page heading (`h1`) | 32 / 38, Bold | 36 / 48, Bold |
| `headline-medium` | Section heading (`h2`) | 28 / 34, Bold | 32 / 44, Bold |
| `headline-small` | Subsection heading (`h3`); totals and amounts | 24 / 30, Bold | 28 / 38, Bold |
| `title-large` | Card and panel titles | 22 / 28, Bold | 24 / 34, Bold |
| `title-medium` | Row titles, the legend of a question group, emphasised values | 18 / 24, Bold | 20 / 30, Bold |
| `title-small` | Navigation items, back link, summary-list values, step names | 17 / 22, Medium | 19 / 28, Bold |
| `body-large` | Body text, the default for running text | **18 / 26**, Regular | **20 / 32**, Regular |
| `body-medium` | Hints, secondary text, table cells | 16 / 24, Regular | 18 / 28, Regular |
| `body-small` | Captions and fine print; the smallest text | 14 / 20, Regular | 16 / 24, Regular |
| `label-large` | Buttons and field labels | 18 / 22, Bold | 20 / 28, Bold |
| `label-medium` | Chips, tabs, 48px buttons, error messages | 16 / 20, Medium | 18 / 24, Bold |
| `label-small` | Metadata labels, step counters, badges | 14 / 18, Medium | 16 / 22, Bold |

Body is 18px in English and 20px in Arabic, as E sets it. The leading is tighter than E drew it (E: body 18/30 and Arabic 20/34; display-small 45/52 and Arabic 50/68; headline-large 32/40 and Arabic 36/52) because Dubai Font's tall vertical metrics make loose leading look airy, and tighter leading was the stated preference for this font (decision D5). Ratios: English display 1.05 to 1.11, headings 1.19 to 1.25, body 1.43 to 1.5; Arabic headings 1.33 to 1.38, body 1.5 to 1.6. Arabic `body-large` at 20/32 was checked by eye in Helium with marks clear of the line above; Q2 should confirm every Arabic role with fully vocalised text.

- **TYP-03.** Arabic text is never letter-spaced, and never set below 16px. English never goes below 14px.
- **TYP-04.** Do not override leading. The WCAG 1.4.12 text-spacing test confirms content survives users' own overrides.
- **TYP-05.** Headings use the headline roles; the display roles are for heroes only.

### 3.3 Digits and numbers

- **TYP-06.** Digits are Latin (0 to 9) in both languages, for amounts, plates, references, dates and phone numbers. Format with the `latn` numbering system: `new Intl.NumberFormat('ar-AE-u-nu-latn')` and `new Intl.DateTimeFormat('ar-AE-u-nu-latn')`. Never rely on the default `ar-AE` locale, which may produce Arabic-Indic digits.
- **TYP-07.** In running Arabic text, isolate each number, amount, plate or reference so its order is kept: `<bdi>` in markup, or U+2066 and U+2069 in strings. Inside an isolate the number reads left to right, as it should.
- **TYP-08.** Dubai W23's digits are tabular by default: every digit has the same advance (0.54em, measured in Regular and Bold). Amount columns therefore align without `font-variant-numeric: tabular-nums` (the font has no `tnum` feature for it to switch on).

---

## 4. Shape

| Token | Value | Use |
| --- | --- | --- |
| `--sc-radius-none` | 0 | Tables, full-bleed bands |
| `--sc-radius-control` | 4px | Buttons, checkboxes, segmented controls, tags |
| `--sc-radius-chip` | 6px | Status chips |
| `--sc-radius-field` | 8px | Text inputs, selects, textareas, callouts, the Dubai Pay frame |
| `--sc-radius-card` | 12px | Cards, list groups, panels, dialogs, bottom sheets (top corners) |
| `--sc-radius-full` | 9999px | Circular marks only, and suggestion chips |

- **SHP-01.** Full rounding is justified only where the shape itself carries meaning: a circle for radio buttons, stepper markers, avatars and switch thumbs, and a capsule for suggestion chips ("Popular now" on E1), which keeps them visibly different from 6px status chips that are not interactive. Buttons are never pills.
- **SHP-02.** A focus ring follows its element's radius (outline does this automatically).

---

## 5. Spacing

The v1 scale is unchanged: `--sc-space-<n>` for 0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96 and 128 (px). Values that E uses off the scale snap to it (E's 14 to 12 or 16, 28 to 24 or 32, 36 to 32 or 40, 88 to 80 or 96).

Rhythm, measured from E and snapped:

| Context | Compact (phone) | Expanded and wide |
| --- | --- | --- |
| Page side margin | 20 | 48, then 80 from 1440px (the grid margin) |
| Section padding, block | 40 | 80 to 96 |
| Between a field's label, hint, error and input | 8 | 8 |
| Between questions or fields | 24 | 32 |
| Card padding | 16 | 24 |
| Gap in a card grid | 12 | 16 to 24 |

---

## 6. Sizing

| Token | Value | Use |
| --- | --- | --- |
| `--sc-size-control-primary` | 56px | Primary buttons and text fields: everything in a question page's main flow |
| `--sc-size-control-secondary` | 48px | Secondary and compact buttons, compact fields, controls in tables and headers |
| `--sc-size-target-min` | 44px | The minimum interactive target, every control, in both directions |
| `--sc-size-chip` | 32px | Visual height of chips; the target is extended to 44px |
| `--sc-size-stepper-marker` | 28px | Stepper step marker |
| `--sc-size-icon-s`, `-m`, `-l` | 16, 20, 24px | Icons (section 10) |
| `--sc-size-focus-ring`, `--sc-size-focus-offset` | 3px, 2px | Focus ring (section 8) |
| `--sc-size-border-hairline` | 1px | Dividers and card edges |
| `--sc-size-border-control` | 1.5px | Control edges |
| `--sc-size-border-strong` | 2px | Error and selected edges; stepper connectors; the inactive stepper marker |
| `--sc-size-border-accent` | 3px | The bar on the start side of an error field group or callout |
| `--sc-size-strip` | 4px | The network or channel strip at the top of the header |
| `--sc-size-measure` | 680px | Maximum width of running text |

- **SIZ-01.** A control whose visual size is below 44px (a chip, a 28px stepper marker that is a link, an inline icon button) extends its target to 44 by 44 with padding or a pseudo-element, without overlapping another target. WCAG 2.5.8 asks for 24px; v2 asks for 44.

---

## 7. Elevation

Surfaces are flat and outline-first. A shadow means "this floats over the page", nothing else.

| Token | Value | Use |
| --- | --- | --- |
| `--sc-elevation-0` | none | Everything in the page flow, cards included |
| `--sc-elevation-1` | `0 1px 3px oklab(0 0 0 / 0.08)` | Sticky bars once content scrolls under them |
| `--sc-elevation-2` | `0 2px 6px oklab(0 0 0 / 0.06), 0 8px 24px oklab(0 0 0 / 0.1)` | Popovers, menus, dialogs, sheets, toasts |

- **ELV-01.** Cards are separated by a 1px `outline-variant` edge or by sitting on `surface-container`, never by a shadow.
- **ELV-02.** In dark mode shadows barely show, so overlays also take a 1px `outline-variant` edge, and dialogs and sheets use `surface-container` so they step up from the page beneath the scrim.
- **ELV-03.** Modal dialogs and sheets sit over `--sc-color-scrim`.
- **ELV-04.** There is no glass. v1's translucent bars are gone; sticky bars are `surface` with `elevation-1` once scrolled.

---

## 8. Focus

- **FOC-01.** Every focusable element shows a 3px ring 2px outside its edge on `:focus-visible`, following its radius:

  ```css
  outline: var(--sc-size-focus-ring) solid var(--sc-color-focus-ring);
  outline-offset: var(--sc-size-focus-offset);
  ```

  Use `outline`, not `box-shadow`: it survives forced-colours mode and needs no knowledge of the background. The 2px offset leaves the background showing between control and ring, as E draws it.
- **FOC-02.** The ring is neutral, not the channel colour: `focus-ring` is neutral-10 in light mode and neutral-100 in dark, as E draws it. Against everything a control can sit on it measures at least 12.33:1 (dark `surface-container-high`) and at least 13.14:1 on any channel band; see section 2.8. It never depends on the channel, so it never fails on a pale channel.
- **FOC-03.** Inside a filled region, set `--sc-color-focus-ring` to that region's "on" colour for the subtree: `on-primary` on the indigo strip (9.35:1 light, 10.07:1 dark), `channel-on-action` on a filled channel band (6.46:1 at the lowest), `inverse-on-surface` in a toast (11.89:1). These are the same pairs as the text checks, so they are covered.
- **FOC-04.** Focus is never removed and never animated (MOT-02: keyboard actions are instant).

---

## 9. Layout

Unchanged from v1 (`tokens/layout.json`); E's pages already fit it.

| Breakpoint | From | Columns | Gutter | Side margin |
| --- | --- | --- | --- | --- |
| compact | 0 | 4 | 16px | 20px |
| medium | 600px | 8 | 20px | 32px |
| expanded | 1024px | 12 | 24px | 48px |
| wide | 1440px | 12 | 24px | 80px |

- **LAY-01.** Content is capped at `--sc-container-max` (1280px, E1's content width at 1440). Question pages, check-answers pages and running text use `--sc-container-reading` (680px), aligned to the start edge.
- **LAY-02.** Layouts respond to available width, not device type; components that change layout respond to their own width (container queries).
- **LAY-03.** The header is 80px at expanded and wider and 60px below, plus the 4px strip above it (E1, E2 to E4). Component-level detail is in `component-language.md`.
- **LAY-04.** Layout mirrors in Arabic. Use logical properties only (`margin-inline-start`, `inset-inline-end`, `border-start-start-radius`); progress fills from the right; the start-side error bar moves to the right.

---

## 10. Iconography

**Set: Material Symbols, Outlined style**, weight 400, grade 0, optical size matched to the rendered size (20 at 20px, 24 at 24px). Licence: Apache 2.0.

Why: direction E draws its icons in Google's Material icon font, so the Material family is the right shape language for a DDS-derived system; the Outlined style's 2px stroke at 24px matches v2's 1.5px and 2px control edges and its square-ish 4px corners; and the variable font's FILL axis gives a filled twin of every icon, which v2 uses for state.

- **ICN-01.** Delivered as **inline SVG**, not an icon font: one path per icon, `fill="currentColor"`, a 24 by 24 viewBox. An icon font adds a blocking font load, renders ligature text if it fails, and can be read aloud. The shared set in `components/src/icons/` is redrawn from Material Symbols in Wave 2; each icon records whether it mirrors.
- **ICN-02.** **Outlined** is the default. **Filled** (FILL 1) is used for two things only: status icons (error, check circle, warning, info, schedule), which must read as solid marks at 16px inside chips; and the selected state of navigation and tab icons, so selection changes shape as well as colour (COL-07).
- **ICN-03.** Sizes: 16px in chips and beside `label-small` or `body-small`; 20px beside body text and inside fields; 24px in buttons and standalone. A 56px button uses 24px icons; E's 22px is snapped to 24.
- **ICN-04.** Icons take the colour of the text they sit with (`currentColor`). Status icons take their status role.
- **ICN-05.** Icons are decorative (`aria-hidden="true"`): the words next to them carry the meaning. An icon-only control has an accessible name, a tooltip, and a 44px target.

**Mirroring in right-to-left layouts.** An icon mirrors when it shows direction along the reading line. Mirror with `:dir(rtl) { transform: scaleX(-1) }` driven by the icon's `mirror` flag.

| Mirrors | Does not mirror |
| --- | --- |
| Back and forward arrows, chevrons used for navigation or disclosure (`arrow_back`, `arrow_forward`, `chevron_left`, `chevron_right`, `navigate_next`) | Check marks, close (×), plus and minus |
| "Open in new" and external-link arrows | Search (magnifier), lock, home, person, calendar, mail, phone |
| Send, reply, undo and redo, logout and login | Clocks, timers, `schedule` and `history` circular arrows (time runs clockwise in both scripts) |
| List and text-alignment icons with a ragged edge, indent and outdent | Media playback (play, pause, fast-forward: they follow tape direction, not reading direction) |
| `help` (question mark), because Arabic writes the question mark mirrored (؟) | Status icons (error, warning, info, check circle) |
| Progress and stepper direction (fills from the right) | Logos, brand marks and Latin text inside icons |

Numbers and Latin text are never mirrored, even inside a mirrored layout.

---

## 11. Motion

Carried over unchanged from v1 (`tokens/motion.json`), which is already distilled from Emil Kowalski's skills and the duration rule of thumb. Nothing in v2 conflicts with it.

| Token | Value | Use |
| --- | --- | --- |
| `--sc-duration-instant` | 0ms | Keyboard-initiated actions; anything seen 100 or more times a day |
| `--sc-duration-fast` | 120ms | Micro-interactions: hover, colour and border changes |
| `--sc-duration-press` | 150ms | Press feedback (`scale(0.97)` on `:active`) |
| `--sc-duration-base` | 200ms | Entrances of tooltips, popovers, menus, selects |
| `--sc-duration-exit` | 160ms | Exits of base-duration elements (about 20% faster) |
| `--sc-duration-slow` | 280ms | Modals, drawers and bottom sheets only; they exit at `calc(var(--sc-duration-slow) * 0.8)` |
| `--sc-duration-spin` | 600ms | One spinner rotation, linear; 0 under reduced motion |
| `--sc-easing-enter`, `--sc-easing-exit` | `cubic-bezier(0.23, 1, 0.32, 1)` | Strong ease-out for anything entering or leaving |
| `--sc-easing-standard` | `cubic-bezier(0.77, 0, 0.175, 1)` | Strong ease-in-out for things already on screen that move or morph |
| `--sc-easing-hover` | `cubic-bezier(0.25, 0.1, 0.25, 1)` | Hover and colour changes |
| `--sc-easing-drawer` | `cubic-bezier(0.32, 0.72, 0, 1)` | Bottom sheets and drawers |
| `--sc-scale-press` | 0.97 | `:active` scale; 1 under reduced motion |
| `--sc-scale-enter` | 0.96 | Starting scale of popovers and menus; 1 under reduced motion |

The rules MOT-01 to MOT-12 in Standard 2.0 section 8.7 apply unchanged: decide by frequency, never animate keyboard actions, ease-out for enter and exit, ease-in-out for movement, never ease-in, 100 to 150ms for micro-interactions, 150 to 250ms for standard UI, 200 to 300ms for modals and drawers, exits about 20% faster, nothing from `scale(0)`, popovers grow from their trigger's logical corner, only `transform` and `opacity` animate movement, transitions over keyframes for anything interruptible, hover motion gated on `(hover: hover) and (pointer: fine)`, and under reduced motion movement stops while opacity and colour keep their timing.

Note for S1: Standard 2.0 still says `--sc-duration-slow` is 320ms (OQ-29) and that `--sc-easing-exit` is an ease-in curve (MOT-05, OQ-22). Both were fixed in the tokens before v2 (280ms, and the exit curve is now the strong ease-out). Chapter 8.7 should drop those caveats.

---

## 12. v1 to v2 token map

Every v1 token and what replaces it. "Removed" means there is no v2 token; the note says what to do instead.

### 12.1 Colour

| v1 token | v2 replacement | Note |
| --- | --- | --- |
| `--sc-color-canvas` | `--sc-color-surface` | Pages are white in v2. Use `surface-container` for bands. |
| `--sc-color-grouped` | `--sc-color-surface-container` | |
| `--sc-color-surface` | `--sc-color-surface-card` | Same name now means the page; cards and fields are `surface-card`. |
| `--sc-color-rule` | `--sc-color-outline-variant` | Dividers only. |
| `--sc-color-control` | `--sc-color-outline` | |
| `--sc-color-muted` | `--sc-color-on-surface-variant` | |
| `--sc-color-ink` | `--sc-color-on-surface` | |
| `--sc-color-ink-strong` | `--sc-color-on-surface` | Removed as a separate colour: one text colour, hierarchy by size and weight. |
| `--sc-color-on-action` | `--sc-color-channel-on-action` | |
| `--sc-color-glass`, `--sc-color-glass-edge` | Removed | No glass (ELV-04). Sticky bars: `surface` plus `elevation-1`. |
| `--sc-color-fill-quiet` | State layer, or `--sc-color-surface-container` | Hover and pressed fills are `color-mix()` with `--sc-opacity-hover` or `-pressed`; static quiet fills are `surface-container`. |
| `--sc-color-fill-selected` | `--sc-color-channel-container` | With `channel-on-container` text. |
| `--sc-color-error` | `--sc-color-error` | Value moved to E's error-40. |
| `--sc-color-error-hover`, `-pressed` | `--sc-color-error-hover`, `-pressed` | |
| `--sc-color-on-error` | `--sc-color-on-error` | |
| `--sc-color-error-surface` | `--sc-color-error-container` | Plus new `on-error-container`. |
| `--sc-color-success`, `-surface` | `--sc-color-success`, `-success-container` | Plus new `on-success`, `on-success-container`. |
| `--sc-color-warning`, `-surface` | `--sc-color-warning`, `-warning-container` | Plus new `on-warning`, `on-warning-container`. |
| (none) | `--sc-color-info`, `on-info`, `info-container`, `on-info-container` | New. |
| `--sc-color-shadow` | `--sc-color-shadow` | |
| (none) | `--sc-color-primary` and its family; `inverse-surface`, `inverse-on-surface`, `surface-container-high`, `disabled-container`, `on-disabled`, `focus-ring`, `scrim` | New. |
| `--sc-color-tint-<name>-subtle` (feat/tint-palette) | `--sc-color-tint-<name>` | |
| `--sc-color-tint-<name>-ink` (feat/tint-palette) | `--sc-color-on-tint-<name>` | |
| `--sc-channel-action` | `--sc-color-channel-action` | |
| `--sc-channel-action-hover`, `-pressed` | `--sc-color-channel-action-hover`, `-pressed` | |
| `--sc-channel-subtle` | `--sc-color-channel-subtle` | |
| `--sc-channel-ink` | `--sc-color-channel-on-container` or `--sc-color-on-surface` | Text on a container uses `channel-on-container`; text on a subtle band uses `on-surface`. |
| `--sc-channel-wash-start`, `--sc-channel-wash-end` | `--sc-color-channel-subtle` | Removed: no gradients. The hero is a flat `channel-subtle` band. |
| `--sc-channel-link-visited` | Removed | Visited links are not styled differently (D8). |
| (none) | `--sc-color-channel-container` | New. |
| `--sc-channel-<channel>-<role>` (all 56) | Removed | Set `data-channel="<channel>"` on the element instead (COL-12). |

### 12.2 Typography

The v1 properties `--sc-text-latin-<role>`, `--sc-leading-latin-<role>`, `--sc-tracking-latin-<role>` and their `-arabic-` twins become `--sc-type-<role>-size`, `-leading` and `-tracking`, plus new `-family` and `-weight`, and the script is chosen by `lang`. The classes `.sc-type-<role>` keep their pattern with the new role names; `.sc-type-ar-<role>` is removed.

| v1 role | v2 role | Change |
| --- | --- | --- |
| `display-xl` (80) | `display-large` (80) | Leading 82 to 84 |
| `display-l` (48) | `display-small` (45) | `display-medium` (57) is new |
| `heading-xl` (34, `h1`) | `headline-large` (32) | |
| `heading-l` (30) | `headline-medium` (28) | |
| `heading-m` (24) | `headline-small` (24) | |
| `title-l` (22) | `title-large` (22) | |
| `title-m` (20) | `title-medium` (18) | |
| `title-s` (17, Medium) | `title-small` (17, Medium) | Buttons move to `label-large` |
| `body-l` (19) | `body-large` (18) | |
| `body-m` (17) | `body-large` (18) | Body text is 18 in v2 |
| `body-s` (15) | `body-medium` (16) | |
| `label-m` (15, field labels) | `label-large` (18, Bold) | E's field labels are 18 Bold |
| `label-s` (14, chips) | `label-medium` (16) | |
| `eyebrow` (14) | `label-small` (14) | |
| `hint` (15) | `body-medium` (16) | |
| `error` (15, Medium) | `label-medium` (16) | E draws field errors Bold; F2 may ask for a bold variant |
| `value` (17, Medium) | `title-small` (17, Medium) | |
| `numeral-l` (34) | `headline-large` (32) or `headline-small` (24) | Page-level amount or a total |
| `caption` (14) | `body-small` (14) | |
| `caption-s` (13) | `body-small` (14) | 13px is gone; 14 is the English minimum |

### 12.3 Shape, size, elevation

| v1 token | v2 replacement | Note |
| --- | --- | --- |
| `--sc-radius-xs` (6) | `--sc-radius-chip` (6) | |
| `--sc-radius-s` (10) | `--sc-radius-control` (4) or `--sc-radius-field` (8) | |
| `--sc-radius-field` (14) | `--sc-radius-field` (8) | |
| `--sc-radius-card` (20) | `--sc-radius-card` (12) | |
| `--sc-radius-panel` (24) | `--sc-radius-card` (12) | |
| `--sc-radius-sheet` (28) | `--sc-radius-card` (12) | |
| `--sc-radius-control` (22, glass controls) | `--sc-radius-control` (4) | Same name, new meaning |
| `--sc-radius-pill` | `--sc-radius-full` | Restricted (SHP-01) |
| (none) | `--sc-radius-none` | New |
| `--sc-size-control-m` (44) | `--sc-size-control-secondary` (48) | |
| `--sc-size-control-l` (54) | `--sc-size-control-primary` (56) | |
| `--sc-size-progress` (8) | Removed | The stepper uses `--sc-size-stepper-marker` and `--sc-size-border-strong` connectors |
| `--sc-size-target-min`, `icon-*`, `focus-*`, `border-*`, `measure` | Same names | |
| (none) | `--sc-size-chip`, `--sc-size-stepper-marker`, `--sc-size-strip` | New |
| `--sc-elevation-0` | `--sc-elevation-0` | |
| `--sc-elevation-1` (cards) | `--sc-elevation-0` plus an `outline-variant` edge | Cards are flat |
| `--sc-elevation-2` (glass bars) | `--sc-elevation-1` | Sticky bars |
| `--sc-elevation-3` (sheets, popovers) | `--sc-elevation-2` | |
| (none) | `--sc-opacity-hover`, `--sc-opacity-pressed` | New |

Space, motion, breakpoints, grid and containers: unchanged.

---

## 13. v1 component tokens that disappear

The v1 components in `components/` still read v1 names and will lose these values on the `v2` branch until Wave 2 rebuilds them. That is expected: v2 has no compatibility layer. Per token, the components that use it today:

| Removed or renamed v1 token | Used by |
| --- | --- |
| `--sc-color-glass`, `--sc-color-glass-edge` | `sc-app-bar`, `sc-back-link`, `sc-language-switch` |
| `--sc-color-fill-quiet` | `sc-back-link`, `sc-button`, `sc-callout`, `sc-date-range`, `sc-language-switch`, `sc-status-tag`, `sc-table`, `sc-text-input` |
| `--sc-color-fill-selected` | `sc-back-link`, `sc-date-range`, `sc-language-switch`, `sc-table` |
| `--sc-color-ink-strong` | `sc-app-bar`, `sc-callout`, `sc-channel-hero`, `sc-date-range`, `sc-error-summary`, `sc-footer`, `sc-search`, `sc-service-card`, `sc-step-progress`, `sc-summary-list`, `sc-table`, `sc-text-input` |
| `--sc-channel-wash-start`, `--sc-channel-wash-end` | `sc-channel-hero`, `sc-button`, `sc-channel-chip` |
| `--sc-channel-ink` | `sc-channel-chip`, `sc-channel-hero`, `sc-service-card`, `sc-status-tag` |
| `--sc-channel-link-visited` | `sc-link` |
| `--sc-radius-pill` | `sc-app-bar`, `sc-button`, `sc-channel-chip`, `sc-date-range`, `sc-error-summary`, `sc-search`, `sc-skip-link`, `sc-status-tag`, `sc-step-progress`, `sc-table`, `sc-text-input` |
| `--sc-radius-panel`, `--sc-radius-sheet` | `sc-date-range` |
| `--sc-radius-control` (meaning changes) | `sc-back-link`, `sc-language-switch` |
| `--sc-size-progress` | `sc-step-progress` |
| `--sc-elevation-1` (meaning changes) | `sc-card`, `sc-error-summary`, `sc-search`, `sc-service-card`, `sc-summary-list`, `sc-table` |
| `--sc-elevation-2`, `--sc-elevation-3` (meaning changes) | `sc-app-bar`, `sc-back-link`, `sc-language-switch`; `sc-date-range`, `sc-skip-link` |
| `--sc-color-canvas`, `--sc-color-grouped` | `global/sc.css`, `sc-page` |
| Every `--sc-text-*`, `--sc-leading-*`, `--sc-tracking-*` | The type mixins and every component that sets text |
| `--sc-size-control-m`, `--sc-size-control-l` | `sc-button`, `sc-text-input`, `sc-search`, and others sized to 44 or 54 |

The playground (`components/src/www/`) also references `--sc-channel-now-action` and `--sc-channel-visit-action` directly; those pages are rebuilt in Wave 2 too.

---

## 14. Checks

| Command | What it proves | Result on this branch |
| --- | --- | --- |
| `npm run check:contrast` | Every pair in section 2.8, light and dark, all seven channels | 388 pairs pass. Tightest: `channel-action` on `channel-container`, 5.00:1 light, 5.49:1 dark |
| `npm run check:teal` | No colour in any token file, light or dark, palette or role, sits in OKLCH hue 160 to 215 above chroma 0.015 | 455 colours, none in the band |
| `npm run check:no-hex` | The CSS and Tailwind outputs contain no hex colour | 3 files, none |
| `npm run report:contrast` | Prints the section 2.8 tables | |

---

## 15. Decisions to confirm

| # | Decision | Alternative |
| --- | --- | --- |
| D1 | City indigo `primary` is tone 30, `oklab(0.4037 0.0099 -0.1152)`, 9.35:1 on white. E's swatch is tone 31.9, `oklab(0.421 0.011 -0.128)`, 8.73:1. | Generate a tone 32 so `primary` matches E exactly. |
| D2 | No secondary palette: channels carry every colour except indigo. E's unused `secondary-40` is dropped. | Keep a secondary for the network chrome. |
| D3 | Neutrals lean towards indigo (hue 275°, chroma 0.004) instead of E's slight teal-side grey. | Pure neutral greys (chroma 0). |
| D4 | Dubai Trade's action is tone 35 (7.78:1), as E drew it; every other channel is tone 40 (6.46:1). | Trade at 40 for uniformity; it reads greyer. |
| D5 | Leading is tighter than E (body 18/26 against 18/30; Arabic 20/32 against 20/34; headings and display tightened too). | E's looser values. |
| D6 | `on-surface-variant` (secondary text) is neutral-40, 6.46:1, as E uses for hints. | Neutral-30, 9.35:1, AAA. |
| D7 | Dark-mode text is pure white (E's `d-ink`), 17.14:1 on the dark page. | Neutral-96 to soften halation. |
| D8 | Visited links are not styled differently; v1's placeholder token is removed. | A visited colour per channel. |
| D9 | Dark mode uses `light-dark()` (Baseline 2024), with no fallback for older browsers. F3 should confirm against the support policy. | Emit a `prefers-color-scheme` fallback block, which repeats every colour role. |
| D10 | Info shares Dubai Now's blue hue. | Shift info towards indigo (it would then sit near `primary`). |
| D11 | Decorative tints keep v1's six hues, several of which share a family with a channel or status. | Re-hue tints away from channels. |
| D12 | Arabic sets short UI text in Bold where English uses Medium (from v1). | Medium in both scripts. |
| D13 | Icons are Material Symbols Outlined, as inline SVG, with filled variants for status and selection. E uses the classic filled Material Icons font throughout. | Filled everywhere, as E. |
| D14 | The focus ring is neutral (neutral-10 light, white dark), as E draws it; v1 used the channel action. | Channel-coloured ring. |
| D15 | The worktree branch is `v2-foundations`: git cannot create `v2/foundations` while a branch named `v2` exists. | Rename `v2` to something like `v2/main` first. |
