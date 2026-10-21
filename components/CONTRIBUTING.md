# Adding a component

This is the exact recipe for adding or rebuilding an `sc-` component in v2. `sc-button` is the worked example (light DOM): copy its files and change them. Read `CONVENTIONS.md` (binding; its "Building a v2 component" recipe is the short version of this file), `docs/v2/architecture.md` §3 and §5, the component's section in `docs/v2/component-language.md` (read through the role table in `docs/v2/decisions.md`) and its spec in `specs/` first.

Several people build components at the same time. **Only touch your own folders**, plus: your block in `src/global/components.css`, your tag in `perf-budgets.json` (`enforce`) and in `V1_PENDING` of `scripts/check-literals.mjs` (remove it), and the append-only registry line. Never edit another component, `src/global/shadow.css`, `src/icons/`, `src/i18n/controller.ts` or `stencil.config.ts`; if you need a change there, say so in your report.

## Commands

All from `design-system/components/`. Node 20+.

| Command | What it does |
|---|---|
| `npm install` | Installs exact versions from the lockfile. Puppeteer never downloads Chrome: tests run in Helium (`/Applications/Helium.app/...`; override with `SC_BROWSER=/path/to/chromium`). |
| `npm start` | Dev build with watch, and the playground at http://localhost:3333 (or the next free port; it's printed). |
| `npm run build` | Production build into `dist/`, `loader/`, `www/`, and regenerates `readme.md` API docs and `docs/components.json`. |
| `npm test` | Spec and e2e tests (e2e on one worker). `npm run test:spec` / `npm run test:e2e` to run one kind; `npm run test:e2e:v2` runs only the rebuilt components. One file: `npx stencil test --e2e -- --max-workers=1 src/components/sc-link/sc-link.e2e.ts`. |
| `npm run test:visual` | Screenshot comparison (`*.visual.e2e.ts`), EN/AR × light/dark. `npm run test:visual:update` rewrites the baselines. |
| `npm run check:literals` | Fails on hex/rgb()/hsl() colours, raw font sizes, `@import` in component CSS and whole-dictionary string imports. |
| `npm run check:budget` | Fails if a rebuilt component, `sc.css`, the runtime or a font is over its budget (`perf-budgets.json`). |
| `npm run fonts` | Regenerates the Dubai W23 subsets and `src/global/fonts.css` (needs `hb-subset` and the TTFs; rarely needed). |
| `npm run check` | All of the above except visual and fonts. Must pass before you hand over. |

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

No `@import` (check:literals fails on it). What every component can rely on:

- **Tokens** from `sc.css` on the page: `--sc-color-*`, `--sc-color-channel-*`, `--sc-space-*`, `--sc-size-*`, `--sc-radius-*`, motion and opacity tokens. They inherit into shadow roots.
- **Type roles**: `font: var(--sc-type-<role>); letter-spacing: var(--sc-type-<role>-tracking);`. One declaration; Arabic sizes, leading, Bold weights and zero tracking switch by `lang` on their own.
- **Shared helper classes** (`src/global/shadow.css`, adopted into every shadow root and copied into `sc.css`): `focus-ring`, `visually-hidden`, `icon`, `icon-directional`, `spin`, `state-layer`, `ltr`, `sc-link`.

Light-DOM (`scoped`) components wrap their whole stylesheet in `@layer sc.components { … }` and use BEM-ish classes prefixed with the tag (`.sc-button`, `.sc-button__label`); see `sc-button.css`. Shadow components write plain CSS with `:host`.

**Colour.** Role tokens only, read through the role table in `docs/v2/decisions.md` (component-language's "channel-container" is the token `channel-subtle`). Never name a channel, never a palette tone. Filled controls use explicit hover and pressed roles; quiet controls use the `state-layer` helper or the roles in the table.

**Forced colours.** Give controls a transparent border (the system repaints it) and add a `@media (forced-colors: active)` block using system colours (`ButtonText`, `LinkText`, `GrayText`, `Highlight`). See the end of `sc-button.css`.

**Sizes.** Interactive targets ≥ `--sc-size-target-min` (44px). Primary buttons and fields `--sc-size-control-primary` (56px); secondary and compact `--sc-size-control-secondary` (48px).

## 4. Icons

`src/icons/index.tsx` has functional components on a 24px grid using `currentColor`: `ArrowForward`, `ChevronForward`, `ChevronBack`, `External` (these four are **directional** and mirror in RTL), `AlertCircle`, `CheckCircle`, `Info`, `Warning`, `Spinner`, `Search`, `Close`. Use them by component (`<ChevronForward />`) or by name (`<Icon name={this.icon} />`, with `IconName` as the prop type). They are always `aria-hidden`; the words carry the meaning. If you need a new icon, ask: the file is shared.

## 5. Strings and locale

If the component renders any text itself, it has its own strings file and imports only that:

```ts
// src/i18n/components/sc-link.ts
import { defineStrings } from '../define';

export default defineStrings({
  en: { linkOpensInNewTab: '(opens in new tab)' },
  ar: { linkOpensInNewTab: '(يفتح في علامة تبويب جديدة)' },
});
```

```tsx
import { LocaleController } from '../../i18n/controller';
import strings from '../../i18n/components/sc-link';

private locale = new LocaleController(this, strings);   // this.locale.t('linkOpensInNewTab')
```

- Never import `i18n/strings`, `i18n/locale` or `i18n/components/index`: they bundle every component's text (check:literals fails on it once your tag leaves `V1_PENDING`). Words that several components say ("Loading", "Error:") are repeated in each file that needs them; a few bytes are cheaper than a shared chunk.
- Keep the component prefix on keys (the legacy merged dictionary still lists every file until Wave 2b, and `strings.spec.ts` fails on duplicate keys). If your file is already in `index.ts`, leave the line there.
- `defineStrings` makes the build fail if an Arabic key is missing. Numbers are formatted with Latin digits.
- The controller resolves the closest `lang` (crossing shadow roots), watches `lang`/`dir` changes with one shared `MutationObserver`, and re-renders the component when its language changes. Style direction with `:dir(rtl)`, not with JS.

## 6. Form controls (light DOM)

Fields and buttons render their native elements into light DOM (`scoped: true`, decision A2), so the browser does the form work: submission, Enter-to-submit, the default button, `FormData`, constraint validation, reset, `<fieldset disabled>`, autofill and `<label for>`. No `formAssociated`, no `ElementInternals`.

- Generate per-instance IDs (`sc-<tag>-<n>`); light DOM shares the document.
- The default slot is the only slot Stencil relocates reliably. Rich content comes from props or a named child the component reads once.
- Forward `focus()` on the host to the native control (see `sc-button`'s `connectedCallback`), and `click()` where it makes sense.
- Add a `:not(:defined)` size reservation for the tag to `src/global/components.css`.

## 7. Tests

Copy `sc-button.spec.tsx`, `sc-button.e2e.ts` and `sc-button.visual.e2e.ts`.

- **Spec** (`newSpecPage`): each variant and prop, classes, attributes and ARIA, Arabic strings via `<div lang="ar">`. In light-DOM components query `page.root` directly; avoid `:scope` (the spec DOM lacks it).
- **E2E** (`newScPage(html, { lang, theme, channel })` links `sc.css` like a real page): keyboard (Tab, Enter, Space, arrows), names and states (`page.accessibility.snapshot`), form behaviour, RTL (computed `transform` of mirrored icons, order), type role in EN and AR, colours compared with the token through a probe, and re-render on `lang` change.
- **Axe**: `describeAxe('sc-thing', ALL_STATES)` registers one test per context (EN/AR × light/dark).
- **Screenshots**: one `expectScreenshot` per context in `<tag>.visual.e2e.ts`; commit the baselines it writes under `test/visual/<platform>/<tag>/`.
- No fixed sleeps for state: wait on the observable state (`page.waitForFunction`) or use fake timers.

## 8. readme.md

Write a `## Usage` section **above** the `<!-- Auto Generated Below -->` marker: when to use it (and when to use something else), each variant, content rules (sentence case, verbs, real content from the vehicle registration renewal journey), states, Arabic notes. The build regenerates everything below the marker from JSDoc; never edit that part. If the file doesn't exist yet, run `npm run build` once, then add Usage above the marker. See `src/components/sc-button/readme.md`.

## 9. Playground page

Create `src/www/pages/<tag>.html`: an HTML fragment (no `<html>`/`<body>`) showing every variant, size and state, an Arabic block (`<div class="pg-card" lang="ar" dir="rtl">`), and the component inside a form where relevant. Helpers from `src/www/playground.css`: `pg-title`, `pg-lede`, `pg-section`, `pg-card`, `pg-row`, `pg-grid`, `pg-cell`, `pg-label`, `pg-note`, `pg-narrow`. Shell conventions:
- `data-ar="…"` on a text-only element swaps its text when the toolbar is set to العربية. On a light-DOM component put it on a `<span>` inside the label (`<sc-button><span data-ar="متابعة">Continue</span></sc-button>`): swapping the host's own text would wipe the rendered control;
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

- [ ] `npm run check` passes (literals, build, spec, e2e, budget) with your tag in `enforce` and out of `V1_PENDING`.
- [ ] `npm run test:visual` passes and the new baselines are committed.
- [ ] Spec written or updated in `specs/<tag>.md` (encapsulation choice, sizes, roles, budget figure).
- [ ] JSDoc on every prop, event, slot and part; readme Usage written.
- [ ] Playground page registered and checked in English light, Arabic dark and one other channel: Dubai Font renders, RTL mirrors, channel colours change.
- [ ] No edits outside your folders except the shared lists named at the top.
