# sc-button · specification (v2)

Status: rebuilt for v2 by C0 (Wave 2) as the reference component every family agent copies. Visual rules: `docs/v2/component-language.md` A1, read through the role table in `docs/v2/decisions.md`. Code: `src/components/sc-button`.

A button starts an action: "Continue", "Pay with Dubai Pay", "Save and finish later". If the action goes to another page, it is a link (`sc-link`), or `sc-button href` when a call to action must look like a button ("Start now").

## Encapsulation

**Light DOM (Stencil `scoped`)**, decision A2. The component renders a native `<button>` (or `<a href>`) as its own child. That makes it a real form control:

- Enter in any field submits the form through the first `type="submit"` button: it is the form's default button (WCAG 3.2.2 and expected behaviour; v1 could not do this, architecture §2.5 probe e).
- `name`, `value`, `form="<id>"`, `<fieldset disabled>` and `FormData`'s submitter work natively. No `formAssociated`, no `ElementInternals`.
- `focus()` and `click()` on the host are forwarded to the native control, so error-summary links and scripts that target the host keep working.
- No `::part()`. Styles live in `@layer sc.components`; a service's unlayered CSS wins.

## Anatomy

| # | Part | Notes |
| --- | --- | --- |
| 1 | Container | `.sc-button`, the native `<button>` or `<a>`. Radius `radius-control` (4px). Inline padding 24 (size `m`: 16; `xl`: 32; tertiary: 12). Gap 8. |
| 2 | Label | `.sc-button__label`, the default slot. Wraps rather than truncates. |
| 3 | Icon (optional) | `.sc-button__icon`, at inline-end by default or inline-start (`icon-position`). 24px at 56/64px, 20px at 48px (ICN-03). From the `icon` prop or an `<svg slot="icon">`. |
| 4 | Spinner (loading) | 20px, `currentColor`, centred over the hidden label, so the width holds. |
| 5 | Status | A visually hidden `role="status"` beside the control that announces "Pay with Dubai Pay, Loading". |

## Variants and sizes

| Variant | Height (default size) | Fill | Text | Edge | Hover (fine pointers) | Pressed |
| --- | --- | --- | --- | --- | --- | --- |
| `primary` | 56 (`l`) | `channel-action` | `channel-on-action` | none | `channel-action-hover` | `channel-action-pressed` + scale 0.97 |
| `secondary` | 48 (`m`) | transparent | `channel-action` | 1.5px `channel-action` (inside the box) | `channel-subtle` | `channel-container` + scale |
| `tertiary` | 48 (`m`) | transparent | `channel-action`, underlined 1px at 4px (5px Arabic) | none | underline 2px | `channel-subtle` + scale |
| `destructive` | 56 (`l`) | `error` | `on-error` | none | `error-hover` | `error-pressed` + scale |
| `handoff` (U3) | 56 (`l`) | `primary` (city indigo) | `on-primary` | none | `primary-hover` | `primary-pressed` + scale |

- `size` overrides the variant's height: `l` 56 (`size-control-primary`), `m` 48 (`size-control-secondary`), `xl` 64 (hero search only). Every size is at least 44 wide (`size-target-min`).
- `handoff` is the same city indigo on every channel, so a UAE PASS sign-in or a Dubai Pay hand-off never looks like the channel's own action. Provider artwork can be added later through `slot="icon"`.
- component-language.md proposed an `inverse` variant for these placeholders; U3 replaced it with `handoff`.
- component-language's "channel-container" (secondary hover) is the token `channel-subtle`, and its "channel-container-high" (secondary pressed) is `channel-container`, per the role table.
- Secondary is transparent rather than `surface`-filled, so it sits correctly on bands and the hero; every pair it creates is in the contrast check (`channel-action` on surfaces, `channel-subtle` and `channel-container`: 5.00:1 at the lowest).

## Type

| Size | Role | English | Arabic |
| --- | --- | --- | --- |
| `l`, `xl` | `label-large` | 18/22 Bold | 20/28 Bold |
| `m` | `label-medium` | 16/20 Medium | 18/24 Bold (D12) |

Written as `font: var(--sc-type-label-large); letter-spacing: var(--sc-type-label-large-tracking)`; the Arabic values switch by `lang`.

## States

- **Focus-visible (U1):** the shared ring: 3px `focus-ring` (neutral-10 light, white dark), 2px offset, following the 4px radius. Inside a filled area the area sets `--sc-color-focus-ring` to its "on" colour. Forced colours: `Highlight`.
- **Disabled** (discouraged, A11Y-08): fill `disabled-container`, text and secondary edge `on-disabled` (3.85:1); tertiary loses its underline. The native `disabled` attribute, or on a link no `href` plus `role="link"` and `aria-disabled="true"`.
- **Loading:** keeps width and focus, sets `aria-busy`, hides the label visually behind the spinner, adds a visually hidden "Loading" / "جارٍ التحميل" (overridable with `loading-text`) and announces "<label>, Loading". Clicks, Enter, Space and implicit submission are ignored until `loading` is removed.
- **Forced colours:** the transparent edge is repainted `ButtonText` (`LinkText` on a link); disabled is `GrayText`.

## Keyboard

Native: Tab focuses; Enter and Space activate a button; Enter follows a link. No motion on keyboard activation (MOT-02): the press scale applies to pointer presses only (`:active:not(:focus-visible)`), and `.focus-ring` sets `transition: none`.

## Motion

Colour over `duration-fast` (120ms) with `easing-hover`, fine pointers only. Press scale `scale-press` (0.97) over `duration-press` (150ms) with `easing-enter`; `scale-press` is 1 under reduced motion. Visual feedback on press, activation on release (2.5.2, MOT-09): the press state is CSS `:active` only, nothing acts on `pointerdown`, `mousedown` or `touchstart`, and the action is the native `click` on release, so moving the pointer off before release cancels it. The spinner turns at `duration-spin` linear and stops under reduced motion (its text stays).

## RTL and Arabic

Layout mirrors through logical properties. Directional icons (`arrow-forward`, chevrons, `data-directional` on a slotted SVG) mirror; the search icon does not. The icon stays at inline-end. Labels are 20px in Arabic; the height does not change. Amounts in labels stay isolated: `Pay <sc-ltr>AED 450.00</sc-ltr>`.

## Before upgrade

`sc.css` reserves the host's final height with `sc-button:not(:defined)` (56px; 48px for secondary, tertiary and `size="m"`), and nothing is hidden for hydration (`invisiblePrehydration: false`), so CLS stays 0.

## Strings

`src/i18n/components/sc-button.ts`: `buttonLoading`, `buttonLoadingStatus` (`{label}, {loading}`). Imported only by sc-button, with `i18n/controller`.

## Budget

`perf-budgets.json` gives sc-button **5 KiB gzip** instead of the 4 KiB leaf budget. Measured on this branch (custom-elements build, each file gzipped on its own):

| Part | gzip |
| --- | --- |
| `sc-button.js` entry | 0.2 KiB |
| Component module, including its CSS (1.2 KiB) and its inlined icons (the `icon` set and the spinner, Material Symbols, `src/icons/for/sc-button.tsx`) | 3.5 KiB |
| Locale controller and helpers (shared by every component with strings) | 1.0 KiB |
| **Closure, excluding the runtime** | **4.8 KiB** (4,864 B) |

The locale controller is paid once per page, not once per component. The `icon` prop accepts the names of the button's own set (`ButtonIconName`: `arrow-forward`, `arrow-back`, `chevron-forward`, `chevron-back`, `external`, `search`, `check`, `close`, `add`, `download`); anything else goes in `slot="icon"`. v1 was 7.9 KiB.

## Tests

- `sc-button.spec.tsx`: variants and default heights, size override, native attributes, link, disabled, loading and its strings in both languages, icon placement.
- `sc-button.e2e.ts`: heights and radius, channel and city-indigo colours against the tokens, dark mode, type roles in EN and AR, font subsets loaded, full width, link with Enter, Enter-to-submit through the default button, submit/reset/`form=`, fieldset, keyboard and the U1 ring, the "on" ring inside a filled area, pointer-only press scale, press-and-drag-off cancels with no click, submit or navigation (2.5.2), host `focus()`/`click()`, loading, accessibility tree, RTL icon, size reservation; `describeAxe` in EN/AR × light/dark.
- `sc-button.visual.e2e.ts`: every variant and state in EN/AR × light/dark; baselines in `test/visual/darwin/sc-button/`.
