# sc-step-progress · specification (v2: the E stepper)

Status: rebuilt for v2 by C4 (Wave 2b). Rules: `docs/v2/component-language.md` A20, direction E artboard 39Q-0, decision U2 and CMP-09 (completed steps in the channel colour, never green), NAV-02. Code: `src/components/sc-step-progress`. The tag name is kept (Q-names).

## Encapsulation

**Shadow DOM** (chrome and display). Step names given as child elements are read as text and never rendered (`sc.css` hides them before upgrade).

## Layouts

`layout="auto"` (default) renders the full stepper when step names exist and the component is at least 600px wide (container query on itself), and the compact one otherwise. `compact` and `full` force one.

### Compact (E2–E4)

| Part | Rule |
| --- | --- |
| Meta row (`meta`) | Step name (`label`): `title-small` Bold, `on-surface`, 12 from the count. Count (`count`): "Step 2 of 4" / "الخطوة 2 من 4", `body-medium`, `on-surface-variant`, at inline-end. This row carries the meaning. |
| Marker row (`track`) | `aria-hidden`. Padding 4 (the halo is never clipped). 24px markers, 2px connectors, gap 6. |

### Full (E0)

An `<ol part="list" aria-label="Steps">`, one `<li>` per step, equal columns:

| Part | Rule |
| --- | --- |
| Rail | 28px marker (`size-stepper-marker`) then a 2px connector to the next step, gap 8, 14 above the text. |
| State line | `label-small` at Regular weight (Medium and `channel-action` on the current step), 2 above the name: "Step 1 · Done", "Step 2 · Current", "Step 3" plus a visually hidden " · Not started". |
| Name | `title-small` Bold `on-surface`, padding 8 at inline-end; upcoming names Medium `on-surface-variant`. |
| Current | `aria-current="step"`. |

## Markers

| Step | Marker | Connector after it |
| --- | --- | --- |
| Done | `channel-action` fill, a check in `channel-on-action` (16px compact, 18px full) | Solid `channel-action` |
| Current | `channel-action` fill, an inner dot (8 / 10) in `channel-on-action`, a halo: compact 4px `channel-container` (CL's channel-container-high), full 5px `channel-subtle` (CL's channel-container) | Dashed `outline` |
| Upcoming | `surface` fill, 2px `outline` edge | Dashed `outline` |

Dark: tone-80 markers with neutral-10 marks; the halo is the divider, `outline-variant` (A20 E3 and the Paper board's dark note), through `light-dark()` with the A1 `--sc-dk` / `--sc-lt` fallback. Forced colours: `Highlight` markers, `GrayText` upcoming edges and connectors.

## RTL

Steps run from the right through DOM order (no reversing, LANG-14). The check does not mirror. Digits are Latin.

## Changes from v1

- The segmented track is replaced by markers and connectors; part `track` keeps its name.
- New: `steps` (string[] property) or child elements for step names; `layout` (`auto` | `compact` | `full`); part `list`.
- `label` now defaults to the current step's name when names are given. `total` is ignored when names are given.
- Strings: own file `sc-step-progress.ts` (`stepProgressCount` replaces the shared `step`).

## Budget

`perf-budgets.json` gives **5 KiB** (leaf 4 KiB): like `sc-button`, the closure counts the shared icon set (0.9 KiB) and locale controller (1.0 KiB) in full; its own module is about 2.9 KiB. Measured **4.8 KiB** gzip; CSS 1.0 KiB.

## Tests

Spec (compact render, clamping, names from children, `aria-current`, states in words, `steps` property, `layout`, Arabic and `count-text`), e2e (container-query switch at 600px, 28 / 24px markers, channel colour not green, the 5px halo and its light and dark colours, the 14 / 2 text spacing and state weights, upcoming edge, solid and dashed connectors, accessibility tree, right-to-left order, channel switch, re-render, forced colours), `describeAxe`, visual (full and compact, EN/AR × light/dark).
