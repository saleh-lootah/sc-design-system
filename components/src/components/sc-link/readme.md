# sc-link

Goes somewhere. If it does something instead (submits, saves, deletes), use `sc-button`. Spec: `specs/sc-link.md`.

## Usage

```html
<p>You need a valid <a class="sc-link" href="/insurance">insurance certificate</a>.</p>
<sc-link href="/services" standalone>All 412 services</sc-link>
<sc-link href="https://www.rta.ae/fees" external>RTA fees guide</sc-link>
```

### Which kind

| Kind | Use it for | Example |
|---|---|---|
| `.sc-link` class on a native `<a>` | A link inside running text (decision A4). Text selection and find-in-page work across it. | "You need a valid insurance certificate." |
| inline `sc-link` (default) | A link inside a sentence when you need `external` or `download`. It takes the sentence's type. | "Read the RTA fees guide" |
| `standalone` | A link on its own line, below a list or a card. label-large Bold, an end arrow (mirrored in Arabic) and a 44px target. | "All 412 services", "Payment history" |
| `external` | A link that must open in a new tab because leaving would lose the user's progress. | "RTA fees guide" |

- Links are always underlined (1px at 4px, 5px in Arabic), in the channel action colour; the underline thickens to 2px on hover. Visited links look the same (D8).
- Don't open links in a new tab by default. When you do, use `external`: it adds the 20px external icon (6px gap) and the visually hidden "(opens in new tab)" / "(يفتح في علامة تبويب جديدة)", and sets `rel="noopener noreferrer"`. Override the hidden text with `external-text`, e.g. "(PDF, 2 MB, opens in new tab)".
- Use `hreflang` when the linked page is in the other language, and `download` for files.
- Components that need another link colour set `--sc-link-color` on an ancestor: the footer uses `on-surface`, the error summary `error`. Services don't.

### Content

- Say where the link goes, and make it make sense out of context: "Check your traffic fines", not "Click here" or "More".
- Plates, references and amounts inside link text stay left-to-right: `<sc-link href="…">Vehicle <sc-ltr>A 12345</sc-ltr></sc-link>`.

### Styling hooks

Parts: `control` (the `<a>`), `label` (carries the underline), `icon`.

<!-- Auto Generated Below -->


## Overview

Goes somewhere. Use it for navigation; use `sc-button` for actions.

v2 keeps a shadow root (architecture §3.1) with a native `<a>` inside and delegates focus
to it. For links inside running text prefer the CSS-only `.sc-link` class on a native
`<a>` (decision A4), which keeps text selection and find-in-page working across the link.
- Inline (default): takes the surrounding type, underlined 1px at 4px (5px in Arabic) in
  the channel action colour; 2px on hover. Visited links are not styled differently (D8).
- `standalone`: a link on its own line ("All 412 services"): label-large Bold, an end
  arrow that mirrors in right-to-left, and a 44px target.
- `external`: opens in a new tab, adds an icon and the visually hidden
  "(opens in new tab)" in the page language.

The colour is `--sc-color-channel-action` unless `--sc-link-color` is set on an ancestor
(the footer and the error summary set it to `on-surface` and `error`).

## Properties

| Property       | Attribute       | Description                                                                                                                                                                                                                                                           | Type                  | Default     |
| -------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `download`     | `download`      | Sets `download` on the inner link: the browser saves the file instead of opening it. The value is the suggested filename.                                                                                                                                             | `string \| undefined` | `undefined` |
| `external`     | `external`      | Opens the link in a new tab (`target="_blank" rel="noopener noreferrer"`), shows the external icon and adds a visually hidden "(opens in new tab)". Only use it when leaving the page would lose the user's progress, for example a guidance page linked from a form. | `boolean`             | `false`     |
| `externalText` | `external-text` | Overrides the visually hidden "(opens in new tab)" (default from strings, in the page language).                                                                                                                                                                      | `string \| undefined` | `undefined` |
| `href`         | `href`          | Where the link goes.                                                                                                                                                                                                                                                  | `string \| undefined` | `undefined` |
| `hreflang`     | `hreflang`      | The language of the linked page, when it differs from this one (sets `hreflang`).                                                                                                                                                                                     | `string \| undefined` | `undefined` |
| `standalone`   | `standalone`    | A link on its own (not inside a sentence): label-large Bold, an end arrow and a 44px target.                                                                                                                                                                          | `boolean`             | `false`     |


## Slots

| Slot | Description                                                                |
| ---- | -------------------------------------------------------------------------- |
|      | The link text. Say where it goes ("Check your fines"), never "Click here". |


## Shadow Parts

| Part        | Description                                                     |
| ----------- | --------------------------------------------------------------- |
| `"control"` | The inner `<a>`.                                                |
| `"icon"`    | The external or arrow icon, when shown.                         |
| `"label"`   | The wrapper around the default slot (it carries the underline). |


----------------------------------------------


