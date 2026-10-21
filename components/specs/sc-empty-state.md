# sc-empty-state · specification (v2, new)

Status: new in v2, built by C4 (Wave 2b). Rules: `docs/v2/component-language.md` B14, plus the all-clear success variant. Code: `src/components/sc-empty-state`.

## Encapsulation

**Shadow DOM** (new display components, architecture §3.1). Slots: default (the body), `icon` (your own decorative 48px `<svg>`, overriding the `icon` prop; board 07 Code), `action`.

## Anatomy

| Part | Rule |
| --- | --- |
| Container (`container`) | Aligned to the start, never centred. Padding 32. |
| Icon (`icon`) | Optional (`icon` prop, from the library). 48px (`icon-l` × 2) in an 80px circle of `surface-container` (`surface-container-high` in dark mode, board dark note; behind `@supports` for `light-dark()`), `on-surface-variant`. 20 below. Or your own icon in `slot="icon"`. |
| Heading (`heading`) | A sentence ("You have no fines"). `title-medium` (Bold). `<p>` by default, `h2`–`h6` with `heading-level`. |
| Body (`body`) | `body-large`, `on-surface-variant`, 8 below the heading, at most 520 wide (board 9ED-0). |
| Action (`action`) | At most one, usually `sc-button variant="secondary"`; 24 above. Hidden when empty. |

`variant="success"` (the all-clear): the icon defaults to `check-circle` on `success-container` in `success`. The heading still says it.

## Budget

Leaf, 4 KiB. Measured **2.7 KiB** gzip; CSS 0.6 KiB.

## Tests

Spec (paragraph heading, levels, icon, action, success default icon), e2e (80/48 icon at the start edge, body colour, success colours and accessible text, Arabic alignment), `describeAxe`, visual.
