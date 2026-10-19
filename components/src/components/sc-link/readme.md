# sc-link

Goes somewhere. If it does something instead (submits, saves, deletes), use `sc-button`.

## Usage

```html
<p>You need a valid <sc-link href="/insurance">insurance certificate</sc-link>.</p>
<sc-link href="/services" standalone>View all services</sc-link>
<sc-link href="https://www.rta.ae/fees" external>RTA fees guide</sc-link>
```

### Which kind

| Kind | Use it for | Example |
|---|---|---|
| inline (default) | A link inside a sentence. It takes the sentence's type and wraps with it. | "You need a valid insurance certificate." |
| `standalone` | A link on its own line, below a list or a card. Adds an end chevron (mirrored in Arabic) and a 44px target. | "View all services", "Payment history" |
| `external` | A link that must open in a new tab because leaving would lose the user's progress, for example guidance linked from a form. | "RTA fees guide" |

- Don't open links in a new tab by default. When you do, use `external`: it adds the icon and the visually hidden "(opens in new tab)" / "(يفتح في علامة تبويب جديدة)", and sets `rel="noopener noreferrer"`. Override the hidden text with `external-text`, e.g. "(PDF, 2 MB, opens in new tab)".
- Use `hreflang` when the linked page is in the other language, and `download` for files.

### Content

- Say where the link goes, and make it make sense out of context: "Check your traffic fines", not "Click here" or "More".
- Sentence case. Link the words that describe the destination, not the whole sentence.
- Plates, references and amounts inside link text stay left-to-right: `<sc-link href="…">Vehicle <sc-ltr>A 12345</sc-ltr></sc-link>`.

### States

Underlined in the channel action colour; the underline thickens on hover. Visited links use `--sc-channel-link-visited`, which has the same value as channel ink until a visited-link colour is chosen. Keyboard focus shows the 3px channel ring around the link, and wraps with it across lines.

### Arabic

The external icon and the standalone chevron mirror in right-to-left. The hidden text and the type follow the closest `lang`.

### Styling hooks

Parts: `control` (the `<a>`), `label` (carries the underline), `icon`.

<!-- Auto Generated Below -->


## Overview

Goes somewhere. Use it for navigation; use `sc-button` for actions.

Renders a native `<a>` inside its shadow root and delegates focus to it.
- Inline (default): sits inside running text, takes the surrounding type, underlined in
  the channel action colour, with a visited colour.
- `standalone`: a link on its own line ("View all services") with an end chevron that
  mirrors in right-to-left, and a 44px target.
- `external`: opens in a new tab, adds an icon and the visually hidden
  "(opens in new tab)" in the page language.

## Properties

| Property       | Attribute       | Description                                                                                                                                                                                                                                                           | Type                  | Default     |
| -------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `download`     | `download`      | Sets `download` on the inner link: the browser saves the file instead of opening it. The value is the suggested filename.                                                                                                                                             | `string \| undefined` | `undefined` |
| `external`     | `external`      | Opens the link in a new tab (`target="_blank" rel="noopener noreferrer"`), shows the external icon and adds a visually hidden "(opens in new tab)". Only use it when leaving the page would lose the user's progress, for example a guidance page linked from a form. | `boolean`             | `false`     |
| `externalText` | `external-text` | Overrides the visually hidden "(opens in new tab)" (default from strings, in the page language).                                                                                                                                                                      | `string \| undefined` | `undefined` |
| `href`         | `href`          | Where the link goes.                                                                                                                                                                                                                                                  | `string \| undefined` | `undefined` |
| `hreflang`     | `hreflang`      | The language of the linked page, when it differs from this one (sets `hreflang`).                                                                                                                                                                                     | `string \| undefined` | `undefined` |
| `standalone`   | `standalone`    | A link on its own (not inside a sentence): adds an end chevron and a 44px target.                                                                                                                                                                                     | `boolean`             | `false`     |


## Slots

| Slot | Description                                                                |
| ---- | -------------------------------------------------------------------------- |
|      | The link text. Say where it goes ("Check your fines"), never "Click here". |


## Shadow Parts

| Part        | Description                                                     |
| ----------- | --------------------------------------------------------------- |
| `"control"` | The inner `<a>`.                                                |
| `"icon"`    | The external or chevron icon, when shown.                       |
| `"label"`   | The wrapper around the default slot (it carries the underline). |


----------------------------------------------


