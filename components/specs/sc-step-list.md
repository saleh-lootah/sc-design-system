# sc-step-list · specification (v2, new)

Status: new in v2, built by C4 (Wave 2b). Rules: `docs/v2/component-language.md` B20 and direction E1 (artboard 3AT-0, the "Moving home" list); name approved in Q-names. Code: `src/components/sc-step-list`.

A life event as an ordered list of services, possibly spanning channels.

## Encapsulation

**Light DOM (Stencil `scoped`)**: a list with native semantics (architecture §3.1). The author writes `<ol><li><a>Title</a><span>Entity</span></li>…</ol>`; the default slot is the only slot. Styles are in `@layer sc.components`. The component adds to each `<li>`: `.sc-step-list__marker` (the number, `aria-hidden`), and `.sc-step-list__end` holding the chip (other channels) and the decorative chevron; it sets the classes `sc-step-list__is-other`, `__is-joined-prev`, `__is-joined-next`. Frameworks that own the list must not re-render those nodes.

## Anatomy

| # | Part | Rule |
| --- | --- | --- |
| 1 | Container | The `<ol>`: radius 12, 1px `outline-variant` edge, padding 12 block, `surface-card`. |
| 2 | Row | Grid: 32 marker column, text, 200 trailing column; gap 20; padding 20 block, 24 inline (E's 28 snapped). |
| 3 | Marker | 32px circle. Own channel: `surface-card`, 1.5px `channel-action` edge, number in `channel-action`. Another channel: that channel's `channel-action` fill, number in `channel-on-action`. `label-small` Bold. |
| 4 | Connectors | 2px. An 18px stub above the marker and a line below it to the next row, in `outline-variant`; between two rows of the same other channel, in that channel's `channel-action`. |
| 5 | Title | The link: `title-medium` (Bold), `on-surface`, underlined on fine-pointer hover; a 44px target without moving the text. |
| 6 | Entity | `body-medium`, `on-surface-variant` (any child of the `<li>` that is not the link or an added part). Rows are 90 tall in English, as on the board. |
| 7 | Chip | Other channel only: the outlined channel chip (A19): `surface-card`, 1px `channel-outline`, 6px radius, 30 tall, padding 10, an 8px dot and Bold `label-small` in `channel-action`: "On Dubai Transport" / "على مواصلات دبي". |
| 8 | Chevron | 24px, `on-surface-variant`, decorative, mirrors in Arabic. |

Other-channel rows: `data-channel="<ch>"` on the `<li>` (differing from the closest `data-channel` above the component) rebinds the channel roles for the row, so its fill is that channel's `channel-subtle` (CL's channel-container). Dark: the channel's tone-20 subtle and tone-80 action.

Under 600px wide (container query): padding 16, the chip moves under the entity, the chevron keeps its own column.

## Semantics

The `<ol>` gives the number; the visible marker is hidden. The title is the only link; the row is not a link (CMP-06 thinking). The chip is read as text.

## Open point

CMP-08 says links are underlined in every state in `channel-action`; E1 and component-language draw the title in `on-surface`, underlined on hover only. This follows E; the coordinator should confirm (see the report).

## Budget

Leaf, 4 KiB. Measured **4.0 KiB** gzip; CSS 1.3 KiB.

## Tests

Spec (markers, chevrons, other-channel marking and joins, chip text EN/AR, same-channel rows not attributed), e2e (32px markers and their colours per channel, row tint, joined connectors, accessibility tree, 44px targets and Tab, Arabic layout and mirrored chevron), `describeAxe`, visual (wide and compact, EN/AR × light/dark).
