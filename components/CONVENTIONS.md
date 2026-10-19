# Component conventions

The Shared Channels component library is a set of **web components built with StencilJS**. One build works in plain HTML and JavaScript, and in React, Angular, Vue or any other framework. Every component follows these rules. A component that breaks one is not finished.

## Stack

- StencilJS 4, TypeScript (strict). Tag prefix `sc-`, e.g. `<sc-button>`, `<sc-text-input>`. The prefix stays distinct from Digital Dubai's existing `dda-` components, so both can run on one page during migration.
- Shadow DOM on (`shadow: true`). Styles live in one CSS file per component and use only `var(--sc-…)` tokens from `../dist/css/tokens.css`. Never write a colour, font or size literal. Tailwind is not used inside components.
- The page loads `tokens.css` once. It supplies every token, Dubai Font, dark mode and channel switching. CSS custom properties inherit through shadow roots, so `data-channel` and `data-theme` on any ancestor theme every component inside it.
- No runtime dependencies beyond Stencil. Icons are inline SVG in `src/icons/`, drawn on a 24px grid with `currentColor`.

## Output targets

- `dist` (lazy-loaded) and `dist-custom-elements` (tree-shakable, for bundlers).
- `www`: the playground and documentation harness.
- `docs-readme` and `docs-json`: API docs generated from JSDoc.
- Framework wrappers for React, Angular and Vue are generated with Stencil's official output targets in a later step. The components themselves never depend on a framework.

## Forms and accessibility in Shadow DOM

ARIA references can't cross a shadow boundary, so each field component owns its whole field: label, hint, error and control in one shadow root, with IDs wired inside it.
- Field components are form-associated (`formAssociated: true`, `@AttachInternals()`). They submit their value with a native `<form>`, take part in form reset, and report validity through `ElementInternals`.
- Hosts that wrap a focusable control use `delegatesFocus: true`. Focusing the host, for example from an error summary link to `#plate-number`, focuses the inner control.
- Interactive targets are at least 44×44px. Primary buttons and fields are 54px tall.
- Focus ring: 3px `--sc-channel-action` with a 2px offset in the surface colour, on `:focus-visible` only.
- Every field has a visible label. Hint and error are linked with `aria-describedby`. An error sets `aria-invalid`, and the error message starts with a visually hidden "Error:".
- Colour never carries meaning alone: status always has an icon and words.
- Respect `prefers-reduced-motion`, `prefers-reduced-transparency` and `forced-colors`. Every component must stay usable in Windows High Contrast mode.

## Channels, themes and direction

- Components read channel roles only (`--sc-channel-action`, `--sc-channel-ink`, `--sc-channel-subtle`, and so on). They never name a specific channel. The exception is `sc-channel-chip`, which sets `data-channel` on itself.
- Use logical properties only (`padding-inline-start`, `inset-inline-end`, `text-align: start`). Never `left` or `right`.
- Directional icons flip with `:host(:dir(rtl)) .icon-directional { transform: scaleX(-1); }`. Icons for time, media, real objects and logos never flip.

## Type

Shadow DOM can't see the global `.sc-type-*` classes. Components set type through the token custom properties instead:
- Latin: `font: var(--sc-…)` pieces from `--sc-text-latin-<role>`, `--sc-leading-latin-<role>`, `--sc-tracking-latin-<role>` and the matching weight and family.
- Arabic: `:host(:lang(ar))` switches to `--sc-text-arabic-<role>` and `--sc-leading-arabic-<role>`, and letter-spacing is always 0.
- Shared mixins live in `src/styles/type.css`, are imported into component CSS, and are generated from the token roles.

## Language and copy

- Arabic and English are equal. Text a component renders itself comes from `src/i18n/strings.ts` (`en` and `ar`). The language is the closest `lang` attribute. A shared locale controller watches for `lang` changes and re-renders. Every string can be overridden by a property or a slot.
- Digits are always Latin (0–9) in both languages. Values that must stay left-to-right, such as plates, amounts, references and phone numbers, are wrapped in `<bdi dir="ltr">`; `sc-ltr` provides this in markup.
- Slots carry content: the default slot for labels and body text, named slots (`hint`, `error`, `start`, `end`, `actions`) for the rest. Attributes are for short values.

## Events

Custom events use the `sc` prefix and bubble and cross shadow boundaries (`composed: true`): `scChange`, `scInput`, `scClick` when it differs from native click, `scDismiss`. Native events keep working wherever a native element sits underneath.

## Files

```
src/components/<tag>/
  <tag>.tsx          component; JSDoc on every @Prop, @Event, slot and CSS part
  <tag>.css          styles, tokens only
  <tag>.spec.tsx     unit tests (render, props, events)
  <tag>.e2e.ts       browser tests: keyboard, axe, English and Arabic, light and dark
  readme.md          generated API, plus a hand-written "Usage" section above the generated part
src/www/pages/<tag>.html   playground page: every variant and state
```

## Tests

Every component has e2e tests in English and in Arabic (`dir="rtl" lang="ar"`) that check:
- there are no axe violations, in light and in dark
- keyboard behaviour works (Tab, Enter, Space, arrows where relevant)
- names, descriptions and states are exposed to assistive tech
- forms submit and reset correctly, for form-associated components

`npm run check:literals` fails if component CSS or TSX contains a hex, rgb() or hsl() colour, or a raw font size.

## Content style in examples

Use real service content from the vehicle registration renewal journey. Write in sentence case. Use verbs for buttons: "Continue", "Pay with Dubai Pay", "Save and finish later".
