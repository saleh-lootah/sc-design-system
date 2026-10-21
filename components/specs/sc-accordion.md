# sc-accordion · specification (v2)

Status: new in v2, built by C5 (Wave 2b). Visual rules: `docs/v2/component-language.md` B15, read through the role table in `decisions.md`. Code: `src/components/sc-accordion`.

Sections that open and close, for frequently asked questions and long guidance.

## Encapsulation

**Light DOM (Stencil `scoped`)**, architecture §3.1 (lists with native semantics). The component enhances native `<details>` and `<summary>` children (component-language B15's proposal: zero-JS resilience). The sections are the author's markup, so in-page links and ids inside them work, and the sections open and close before and without JavaScript. Styles sit in `@layer sc.components`.

## Anatomy

| # | Part | Notes |
| --- | --- | --- |
| 1 | Show all (optional) | `show-all`: a `<button>` "Show all sections" / "Hide all sections" with `aria-expanded`, `label-medium` in `channel-action`, underlined, 44px tall. |
| 2 | Section | A `<details>`. A 1px `outline-variant` rule above each section and below the last. 24 of padding below an open section. |
| 3 | Summary | The `<summary>`: at least 56 tall, 16 block padding, no inline padding (it aligns with the text column), `title-medium`. A grid with a fixed 24px chevron column at inline-end, 16 apart. An optional `<small>` summary line in `body-medium`, `on-surface-variant`, 2 below the title. |
| 4 | Chevron | `expand_more`, 24px, drawn as a CSS mask in `currentColor`. Turns 180° when open. It sits at inline-end, so it is on the left in Arabic; it turns over vertically, so it never mirrors. |
| 5 | Answer | The content after `<summary>`: `body-medium` in `on-surface`, 8 below it, blocks 8 apart, padded 40 at inline-end so it keeps clear of the chevron column (board 09.10). |

## States

| State | Rule |
| --- | --- |
| Hover (fine pointers) | Summary underlined 1px |
| Open | Chevron turned over; the native `open` state (exposed as expanded) |
| Focus | The U1 ring around the summary |
| Forced colours | Rules `CanvasText`; chevron `CanvasText` (`forced-color-adjust: none` on the mask) |

## Accessibility

Native disclosure semantics (DDS F-001 fixed by construction): Enter and Space toggle, the expanded state is announced. Keep headings out of `<summary>` (it is a button, so a heading inside is not announced as one); put the question in plain text.

## Motion

- From a pointer: the chevron turns over `duration-fast` (120ms) with `easing-standard` (in-out, MOT-06), and the answer fades in (opacity only, no height animation, MOT-11).
- From the keyboard (`summary:focus-visible`): both are instant (MOT-02).
- component-language proposed 150ms; 120ms is the micro-interaction token (100–150ms).
- Reduced motion: the chevron turn is dropped; the opacity fade stays (board 09.10).

## Board differences kept in code (board 09.10)

- API: the board proposes `sc-accordion-section` with `heading`, `summary`, `open`, a `heading-level` prop and an `scToggle` event. The code keeps native `<details>`/`<summary>` children (component-language B15 allows them, and they work before JavaScript); `toggle` is the native event.
- Motion: the board quotes 150ms for the turn and the fade; the code keeps `duration-fast` (120ms), as above.
- Focus: the board draws the ring at inset 0; the code keeps U1 (3px with a 2px offset).
- Chevron: Material Symbols `expand_more` (Outlined, D13), drawn as a mask in `currentColor`.

## Code

```html
<sc-accordion show-all>
  <details>
    <summary>How long does renewal take?<small>Online, in most cases</small></summary>
    <p>Usually about 10 minutes, once your vehicle has passed its technical test.</p>
  </details>
</sc-accordion>
```

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| show-all | boolean | false | Adds the "Show all sections" toggle |

Slot: default (`<details>` children). No events (listen to the native `toggle` event on each `<details>`).

## Strings

`src/i18n/components/sc-accordion.ts`: `accordionShowAll`, `accordionHideAll`.

## Budget

2.9 KiB gzip closure (includes the shared locale controller chunk); leaf budget 4 KiB.

## Tests

`sc-accordion.spec.tsx` (light DOM, the toggle and its strings in both languages); `sc-accordion.e2e.ts` (Enter and Space, summary metrics, chevron turn with pointer timing and instant from the keyboard, chevron position in Arabic, show all and manual toggles, rules and type in both scripts, `describeAxe`); `sc-accordion.visual.e2e.ts`.
