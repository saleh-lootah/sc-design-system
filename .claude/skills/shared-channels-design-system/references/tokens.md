# Token cheat sheet (v2)

Every name below exists in `dist/css/tokens.css`. The values, the contrast results and the full rules are in `docs/v2/foundations.md`. Each colour token holds both modes as `light-dark()`, so never write a separate dark value.

## Colour roles: `--sc-color-<role>`

| Group | Tokens | Use |
|---|---|---|
| Surfaces | `surface`, `surface-card`, `surface-container`, `surface-container-high` | The page; cards, fields and dialogs; bands, panels, table headers and totals; a container inside a container and skeletons |
| Text | `on-surface`, `on-surface-variant` | Primary text, and secondary text (hints, captions, metadata). There is no third text colour |
| Edges | `outline`, `outline-strong`, `outline-variant` | Control edges (1.5px); hovered control edges and the sign-in edge; dividers and card edges only |
| Inverse | `inverse-surface`, `inverse-on-surface` | Tooltips |
| Disabled | `disabled-container`, `on-disabled` | Disabled controls, which should be rare |
| Focus | `focus-ring` | Set by `sc.css`. In a filled area, set it to that area's "on" colour |
| City indigo | `primary`, `on-primary`, `primary-hover`, `primary-pressed`, `primary-container`, `on-primary-container`, `primary-subtle` | Only what all channels share: the network strip and the Dubai Pay hand-off. Never UAE PASS |
| Semantic | `error`, `success`, `warning`, `info`, each with `on-*`, `*-container` and `on-*-container`; `error-hover` and `error-pressed` for destructive fills | Status and messages. Tone 40 text and icon on the tone 95 container |
| Decorative tints | `tint-<hue>`, `on-tint-<hue>` for `amber`, `blue`, `green`, `orange`, `rose`, `violet` | Icon tiles only. Never meaning, never status |
| Overlay | `scrim`, `shadow` | Behind modals; the base colour for shadows |

## Channel roles: `--sc-color-channel-<role>`

`data-channel` rebinds these for the subtree. Never use a named channel's token.

| Token | Use |
|---|---|
| `channel-action` | Filled and outlined buttons, links, selected states, the current step, progress |
| `channel-action-hover`, `channel-action-pressed` | A filled action on hover and while pressed |
| `channel-on-action` | Text and icons on any action fill |
| `channel-subtle` (tone 95) | The hero band, tinted and selected rows, unread rows, applied filter chips, the selection bar |
| `channel-container` (tone 90), `channel-on-container` | A selected navigation item, tags, the bottom-nav indicator, and the text on them |
| `channel-outline` | 1px edges on suggestion chips and outlined channel chips (decorative) |

### Role-name traps

`docs/v2/component-language.md` uses different names. Always translate them through the table in `docs/v2/decisions.md`. The ones that catch people:

| component-language.md says | Use |
|---|---|
| `channel-container` (tone 95) | `channel-subtle` |
| `channel-container-high` (tone 90) | `channel-container` |
| `on-channel-action` | `channel-on-action` |
| `channel-accent` | `channel-action` |
| `surface-container-low` | `surface-container` |
| `surface-disabled` / `on-surface-disabled` | `disabled-container` / `on-disabled` |
| `on-surface-muted` | `on-surface-variant` |
| `divider` | `outline-variant` |
| `city-action` / `on-city-action` | `primary` / `on-primary` |
| `city-container` / `city-container-high` | `primary-subtle` / `primary-container` |
| `state-hover` | A state layer (below) |
| `shadow-2`, `shadow-3` | `--sc-elevation-2` |

### State layers

Quiet controls (outlined and text buttons, rows, chips, menu items) show hover and press with a layer, not a token. Wrap the hover rule in `@media (hover: hover) and (pointer: fine)`:

```css
background: color-mix(in oklab, var(--sc-color-channel-action) var(--sc-opacity-hover), transparent);   /* 8% */
background: color-mix(in oklab, var(--sc-color-channel-action) var(--sc-opacity-pressed), transparent); /* 12% */
```

Inside components, the `state-layer` helper class does this. Filled controls use their `-hover` and `-pressed` tokens instead.

## Type: `--sc-type-<role>`

Apply a role with:

```css
font: var(--sc-type-<role>);
letter-spacing: var(--sc-type-<role>-tracking);
```

In page markup, use the `.sc-type-<role>` class instead. Each role also has `-size`, `-leading`, `-tracking`, `-weight` and `-family` parts. They follow `lang`, so there are no Arabic classes.

| Role | English | Arabic | Use |
|---|---|---|---|
| `display-large` | 80/84 | 88/108 | Home hero, from 1024px |
| `display-medium` | 57/62 | 64/80 | Channel hero, from 1024px |
| `display-small` | 45/50 | 50/64 | Heroes below 1024px |
| `headline-large` | 32/38 | 36/48 | Page heading `h1` |
| `headline-medium` | 28/34 | 32/44 | Section heading `h2` |
| `headline-small` | 24/30 | 28/38 | Subsection heading `h3`; totals and amounts |
| `title-large` | 22/28 | 24/34 | Card and panel titles |
| `title-medium` | 18/24 | 20/30 | Row titles, emphasised values |
| `title-small` | 17/22 Medium | 19/28 Bold | Navigation items, back link, summary values, step names |
| `body-large` | 18/26 | 20/32 | Running text (the default) |
| `body-medium` | 16/24 | 18/28 | Hints, secondary text, table cells |
| `body-small` | 14/20 | 16/24 | Captions and fine print; the smallest text |
| `label-large` | 18/22 | 20/28 | Buttons, field labels, legends |
| `label-medium` | 16/20 Medium | 18/24 Bold | Chips, tabs, 48px buttons, error messages |
| `label-small` | 14/18 Medium | 16/22 Bold | Metadata labels, step counters, badges |

All sizes and line heights are px. Weights are Bold unless the table says otherwise, except the body roles, which are Regular.

Fonts: `--sc-font-family` follows `lang`. `--sc-font-family-latin` and `--sc-font-family-arabic` are also available, with the weights `--sc-font-weight-regular`, `-medium` and `-bold`. There is no Light weight.

## Shape: `--sc-radius-*`

| Token | Value | Use |
|---|---|---|
| `none` | 0 | Tables, full-bleed bands |
| `control` | 4px | Buttons, checkboxes, tags |
| `chip` | 6px | Status chips |
| `field` | 8px | Inputs, selects, callouts, the error summary |
| `card` | 12px | Cards, panels, tables, dialogs |
| `full` | 9999px | Radios, stepper markers, avatars, suggestion chips. Never buttons |

## Size: `--sc-size-*`

| Token | Value | Use |
|---|---|---|
| `control-primary` | 56px | Primary buttons and fields |
| `control-secondary` | 48px | Secondary, compact, table and header controls |
| `target-min` | 44px | The minimum target, for every control |
| `chip` | 32px | Visual chip height; the target is extended to 44px |
| `stepper-marker` | 28px | Stepper markers |
| `icon-s`, `icon-m`, `icon-l` | 16, 20, 24px | Icons |
| `focus-ring`, `focus-offset` | 3px, 2px | The focus ring |
| `border-hairline` | 1px | Dividers and card edges |
| `border-control` | 1.5px | Control edges |
| `border-strong` | 2px | Error and selected edges, stepper connectors |
| `border-accent` | 3px | The current-item bar |
| `strip` | 4px | The one start-bar width: the error bar on a field, the callout accent |
| `measure` | 680px | Maximum width of running text |

## Space: `--sc-space-<n>`

The scale is 0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96 and 128 (px). Snap any other value to it.

| Context | Phone | Wider |
|---|---|---|
| Label, hint, error and input | 8 | 8 |
| Between fields or questions | 24 | 32 |
| Card padding | 16 | 24 |
| Card grid gap | 12 | 16–24 |
| Section padding, block | 40 | 80–96 |

## Elevation: `--sc-elevation-*`

| Token | Use |
|---|---|
| `0` | Everything in the page flow, cards included |
| `1` | Sticky bars once content scrolls under them; the utility bar has none (W23) |
| `2` | Popovers, menus, dialogs and sheets. In dark mode, add a 1px `outline-variant` edge |

## Layout

| Breakpoint (`--sc-breakpoint-*`) | From | Columns | Gutter | Margin |
|---|---|---|---|---|
| `compact` | 0 | 4 | 16 | 20 |
| `medium` | 600px | 8 | 20 | 32 |
| `expanded` | 1024px | 12 | 24 | 48 |
| `wide` | 1440px | 12 | 24 | 80 |

`--sc-container-max` is 1280px, and `--sc-container-reading` is 680px for question pages, check answers and running text. The per-breakpoint grid values are `--sc-grid-<bp>-columns`, `-gutter` and `-margin`.

Layouts respond to the available width, not the device. Components respond to their own width, with container queries.

## Motion: `--sc-duration-*`, `--sc-easing-*`, `--sc-scale-*`

| Token | Value | Use |
|---|---|---|
| `duration-instant` | 0ms | Keyboard-initiated actions, and anything seen 100 or more times a day |
| `duration-fast` | 120ms | Hover and colour changes, with `easing-hover` |
| `duration-press` | 150ms | `:active` scale to `scale-press` (0.97); pointer and touch only |
| `duration-base` / `duration-exit` | 200 / 160ms | Popovers, menus, centred dialogs; `easing-enter` from `scale-enter` (0.96) plus opacity |
| `duration-slow` | 280ms | Bottom sheets and drawers, with `easing-drawer`; they exit at about 80% of the duration |
| `duration-spin` / `duration-pulse` | 600 / 1200ms | Spinner and skeleton; 0 under reduced motion |
| `easing-standard` | ease-in-out | Things already on screen that move |

Under reduced motion, `scale-press` and `scale-enter` become 1, so movement stops while opacity and colour keep their timing. Name the exact properties you transition. Never use `transition: all`.
