# Adding a component

This is the exact recipe for adding an `sc-` component. `sc-button` is the worked example: copy its files and change them. Read `CONVENTIONS.md` (binding) and the component's entry in `COMPONENTS.md` first.

Several people build components at the same time. **Only touch your own folders**, plus the two append-only lines described in steps 5 and 7. Never edit another component, `src/styles/`, `src/icons/`, `src/i18n/locale.ts`, `src/i18n/strings.ts` or `stencil.config.ts`; if you need a change there, say so in your report.

## Commands

All from `design-system/components/`. Node 20+.

| Command | What it does |
|---|---|
| `npm install` | Installs exact versions from the lockfile. Puppeteer never downloads Chrome: tests run in Helium (`/Applications/Helium.app/...`; override with `SC_BROWSER=/path/to/chromium`). |
| `npm start` | Dev build with watch, and the playground at http://localhost:3333 (or the next free port; it's printed). |
| `npm run build` | Production build into `dist/`, `loader/`, `www/`, and regenerates `readme.md` API docs and `docs/components.json`. |
| `npm test` | Spec and e2e tests. `npm run test:spec` / `npm run test:e2e` to run one kind. One file: `npx stencil test --e2e -- src/components/sc-link/sc-link.e2e.ts`. |
| `npm run check:literals` | Fails on hex/rgb()/hsl() colours or raw font sizes in `src/components/**/*.{css,tsx}`. |
| `npm run check` | All of the above. Must pass before you hand over. |

Don't run `npm start` and `npm test` at the same time: both write `www/`.

## 1. Files

```
src/components/<tag>/
  <tag>.tsx         component
  <tag>.css         styles (tokens only)
  <tag>.spec.tsx    unit tests (newSpecPage)
  <tag>.e2e.ts      browser tests (Helium, axe)
  readme.md         hand-written Usage + generated API
src/i18n/components/<tag>.ts   your strings, if the component renders any text itself
src/www/pages/<tag>.html       playground page
```

Child components of a family (for example `sc-radio` inside `sc-radio-group`) get their own folder each.

## 2. The component (`<tag>.tsx`)

```tsx
import { AttachInternals, Component, Element, Host, Prop, h } from '@stencil/core';
import { LocaleController } from '../../i18n/locale';
import { ChevronForward } from '../../icons/index';

/**
 * One sentence on what it's for.
 *
 * @slot - What goes in the default slot.
 * @slot hint - …
 * @part control - …
 */
@Component({
  tag: 'sc-thing',
  styleUrl: 'sc-thing.css',
  shadow: true,                     // or { delegatesFocus: true } if the host wraps a focusable control
  // formAssociated: true,          // field components and submit-type buttons
})
export class ScThing {
  @Element() el!: HTMLElement;

  /** JSDoc on every @Prop, @Event, slot and part: it becomes the API docs. */
  @Prop({ reflect: true }) variant: 'a' | 'b' = 'a';

  private locale = new LocaleController(this);
  connectedCallback() { this.locale.connect(); }
  disconnectedCallback() { this.locale.disconnect(); }

  render() {
    const { t } = this.locale;
    return <Host>…{t('thingSomething')}…</Host>;
  }
}
```

Rules that bite:
- **Import icons from `'../../icons/index'`, never `'../../icons'`.** Stencil only turns on SVG rendering for a component when it can follow the import to a file that contains `<svg>`; it doesn't resolve folder imports, and without it SVGs render as unknown HTML elements (invisible).
- Don't use `:scope` in `querySelector` inside component code: the spec-test DOM doesn't support it. Iterate `this.el.children` instead.
- Logical properties only (`inline-size`, `padding-inline-start`, `inset-inline-end`), never left/right.
- Events: `@Event({ bubbles: true, composed: true }) scChange` etc., `sc` prefix. Keep native events working.
- Every string the component renders by itself comes from strings (step 5) and can be overridden by a prop or a slot.

## 3. Styles (`<tag>.css`)

Start every component stylesheet with the shared helpers and the type roles you use:

```css
@import '../../styles/shared.css';
@import '../../styles/type/label-m.css';
@import '../../styles/type/body-m.css';
```

**Type.** Shadow DOM can't see the global `.sc-type-*` classes. `src/styles/type/<role>.css` (generated from `tokens/typography.json` by `scripts/gen-type-css.mjs`; never edit it) defines, per role, `--type-<role>-family|weight|size|leading|tracking` on `:host`, switched to the Arabic scale with letter-spacing 0 by `:host(:lang(ar))`. Apply a role either with the ready-made class in TSX (`<span class="type-label-m">`) or with the five properties in CSS:

```css
.label {
  font-family: var(--type-label-m-family);
  font-weight: var(--type-label-m-weight);
  font-size: var(--type-label-m-size);
  line-height: var(--type-label-m-leading);
  letter-spacing: var(--type-label-m-tracking);
}
```

`sc-button` picks the role from a prop by adding `type-title-s` (size l) or `type-label-m` (size m) to its control. The header of `src/styles/type.css` lists every role and which ones borrow metrics from the other script.

**Shared helpers** (`src/styles/shared.css`), used as classes in TSX:
- `focus-ring`: 3px `--sc-channel-action` outline, 2px offset painted in `--sc-color-surface`, on `:focus-visible` only; `Highlight` in forced colours. Put it on the focusable element.
- `visually-hidden`: off screen, still read.
- `icon` (sized by `--icon-size`, default `--sc-size-icon-m`) and `icon-directional` (mirrored by `:host(:dir(rtl))`).
- `spin`: spinner rotation, static under `prefers-reduced-motion`.

**Colour.** Tokens only: `--sc-color-*` and channel roles `--sc-channel-action`, `-action-pressed`, `-subtle`, `-ink`, `-wash-start`, `-wash-end`. Never name a channel. Mixing two tokens is fine (`color-mix(in oklab, var(--sc-channel-action), var(--sc-channel-action-pressed))` is the button's hover). Transitions use `--sc-duration-*` and `--sc-easing-*` and follow the Motion rules in [CONVENTIONS.md](CONVENTIONS.md#motion).

**Forced colours.** Give controls `border: 1px solid transparent` (the system repaints it) and add a `@media (forced-colors: active)` block using system colours (`ButtonText`, `LinkText`, `GrayText`, `Highlight`). See the end of `sc-button.css`.

**Sizes.** Interactive targets ≥ `--sc-size-target-min` (44px). Primary buttons and fields `--sc-size-control-l` (54px).

## 4. Icons

`src/icons/index.tsx` has functional components on a 24px grid using `currentColor`: `ArrowForward`, `ChevronForward`, `ChevronBack`, `External` (these four are **directional** and mirror in RTL), `AlertCircle`, `CheckCircle`, `Info`, `Warning`, `Spinner`, `Search`, `Close`. Use them by component (`<ChevronForward />`) or by name (`<Icon name={this.icon} />`, with `IconName` as the prop type). They are always `aria-hidden`; the words carry the meaning. If you need a new icon, ask: the file is shared.

## 5. Strings and locale

If the component renders any text itself (a prefix, a status, "(optional)"), add a strings file:

```ts
// src/i18n/components/sc-link.ts
import { defineStrings } from '../define';

export default defineStrings({
  en: { linkOpensInNewTab: '(opens in new tab)' },
  ar: { linkOpensInNewTab: '(يفتح في علامة تبويب جديدة)' },
});
```

then append **one line** to the index (append, don't edit in the middle):

```sh
echo "export { default as scLink } from './sc-link';" >> src/i18n/components/index.ts
```

- Prefix keys with the component name (`linkOpensInNewTab`, `summaryChange`). Shared strings already in `common.ts` (`problem`, `errorPrefix`, `optional`, `change`, `back`, `loading`, `step`, `opensInNewTab`, `alsoOn`, channel names) can be used as they are; don't duplicate them.
- `defineStrings` makes the build fail if an Arabic key is missing; `src/i18n/strings.spec.ts` fails on duplicate keys or mismatched `{placeholders}`.
- In the component: `this.locale.t('key', { name: value })`. Numbers are formatted with Latin digits.
- The `LocaleController` resolves the closest `lang` (crossing shadow roots), watches `lang`/`dir` changes with one shared `MutationObserver`, and re-renders the component when its language changes. `this.locale.lang` and `this.locale.dir` are available; style direction with `:host(:dir(rtl))`, not with JS.
- Wrap values that must stay left-to-right in `<bdi dir="ltr">` inside your shadow root (authors use `<sc-ltr>` in light DOM).

## 6. Form association

Field components (and anything that submits or resets) are form-associated. The pattern, from `sc-button`:

```tsx
@Component({ tag: 'sc-text-input', styleUrl: '…', shadow: { delegatesFocus: true }, formAssociated: true })
export class ScTextInput {
  @AttachInternals() internals!: ElementInternals;
  @State() formDisabled = false;

  // Submit the value: call whenever it changes (and on load).
  private sync() { this.internals.setFormValue(this.value ?? ''); /* + setValidity(...) */ }

  formResetCallback() { this.value = this.defaultValue; this.sync(); }
  formDisabledCallback(disabled: boolean) { this.formDisabled = disabled; }
}
```

- `sc-button` submits with `this.internals.form.requestSubmit()` and resets with `form.reset()` from a `@Listen('click')` on the host, so `el.click()` works too.
- Report validity with `this.internals.setValidity(flags, message, anchorElement)` where the anchor is the inner `<input>`, so the browser focuses it.
- `delegatesFocus: true` makes `#field-id` links (error summary) and `el.focus()` land on the inner control.
- Known limits of form-associated custom elements: the host is never the form's `submitter` (`event.submitter` is null), and it isn't a "default button" for implicit submission.
- Label, hint and error live inside the field's own shadow root (ARIA IDs can't cross shadow boundaries).

## 7. Tests

**Spec** (`<tag>.spec.tsx`, `newSpecPage`): render each variant and prop, check classes/attributes/ARIA in the shadow root, Arabic strings via `<div lang="ar">…</div>`. Copy `sc-button.spec.tsx`.

**E2E** (`<tag>.e2e.ts`) uses two helpers:

```ts
import { expectNoAxeViolations } from '../../test/axe';
import { contexts, newScPage, setPageContext } from '../../test/page';

const page = await newScPage('<sc-thing>…</sc-thing>', { lang: 'ar', theme: 'dark', channel: 'transport' });
await setPageContext(page, { lang: 'en' });     // switch later; waits for re-render
for (const ctx of contexts) { … }               // en/ar × light/dark
await expectNoAxeViolations(page);              // WCAG 2.0–2.2 A/AA, looks inside shadow roots
```

`newScPage` sets `lang`, `dir`, `data-theme` and `data-channel` on `<html>` before the markup is inserted, then waits for every `sc-` element to hydrate. Read shadow internals with `page.evaluate` (see the `inner()` helper at the top of `sc-button.e2e.ts`).

Every component must cover: axe clean in en/ar × light/dark; keyboard (Tab, Enter, Space, arrows where relevant); names, descriptions and states exposed; RTL behaviour (mirrored icons via computed `transform`, order); form submit/reset for form-associated components; that strings re-render when `lang` changes.

## 8. readme.md

Write a `## Usage` section **above** the `<!-- Auto Generated Below -->` marker: when to use it (and when to use something else), each variant, content rules (sentence case, verbs, real content from the vehicle registration renewal journey), states, Arabic notes. The build regenerates everything below the marker from JSDoc; never edit that part. If the file doesn't exist yet, run `npm run build` once, then add Usage above the marker. See `src/components/sc-button/readme.md`.

## 9. Playground page

Create `src/www/pages/<tag>.html`: an HTML fragment (no `<html>`/`<body>`) showing every variant, size and state, an Arabic block (`<div class="pg-card" lang="ar" dir="rtl">`), and the component inside a form where relevant. Helpers from `src/www/playground.css`: `pg-title`, `pg-lede`, `pg-section`, `pg-card`, `pg-row`, `pg-grid`, `pg-cell`, `pg-label`, `pg-note`, `pg-narrow`. Shell conventions:
- `data-ar="…"` on a text-only element swaps its text when the toolbar is set to العربية;
- `<script>` blocks run after the fragment is inserted (wrap code in `{ … }`);
- `data-demo-focus` focuses one element on load (to show the focus ring).

Then register it with **one appended line** (the sidebar sorts by group and title, so order doesn't matter):

```sh
echo "page('Actions and navigation', 'sc-link', 'Link');" >> src/www/registry.js
```

Groups: `Actions and navigation`, `Form fields`, `Feedback and status`, `Content and layout`. Open `http://localhost:3333/?page=sc-link&lang=ar&theme=dark&channel=transport` to check it; every toolbar state is in the URL, so headless screenshots can target it:

```sh
/Applications/Helium.app/Contents/MacOS/Helium --headless=new --hide-scrollbars --window-size=1440,1100 \
  --virtual-time-budget=6000 --screenshot=/tmp/sc-link.png "http://localhost:3333/?page=sc-link&lang=ar&theme=dark"
```

## Done means

- [ ] `npm run check` passes (literals, build, spec, e2e).
- [ ] JSDoc on every prop, event, slot and part; readme Usage written.
- [ ] Playground page registered and checked in English light, Arabic dark and one other channel: Dubai Font renders, RTL mirrors, channel colours change.
- [ ] No edits outside your folders except the two appended lines.
