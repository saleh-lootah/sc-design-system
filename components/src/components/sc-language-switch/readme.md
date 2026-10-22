# sc-language-switch

A link to the same page in the other language (LANG-04 to LANG-08). Spec: `specs/sc-language-switch.md`.

## Usage

```html
<sc-language-switch href="/ar/renew-vehicle-registration/plate"></sc-language-switch>
<sc-language-switch appearance="header" href="/ar"></sc-language-switch>
```

- The label is always the other language's own name, "العربية" or "English", with its own `lang`, `dir` and `hreflang`, set in that script's type role.
- `appearance="inline"` (default) is an underlined link in the channel action colour, for the app bar. `appearance="header"` adds a globe and uses `on-surface`, for `sc-site-header`. The v1 values `glass` and `plain` still work.
- Always set `href`. A single-page app listens for `scSwitch`, calls `preventDefault()` and switches in place, then moves focus to the `<h1>` (LANG-08).
- The component keeps one light-DOM `<span lang>` child for the name; don't add or remove other children.
- Without JavaScript (PERF-04): add the same link as `<a slot="fallback" href hreflang lang dir>` with the other language's name, for example `<sc-language-switch href="/ar/renew"><a slot="fallback" href="/ar/renew" hreflang="ar" lang="ar" dir="rtl">العربية</a></sc-language-switch>`. It shows until the switch upgrades and never after.
- No flags, never a menu.

### Styling hooks

Parts: `control`, `label`, `icon` (header only).

<!-- Auto Generated Below -->


## Overview

Switches to the same page in the other language. The label is always the other
language's own name, "العربية" on an English page and "English" on an Arabic page,
marked with its own `lang` and direction so screen readers pronounce it correctly, and
set in its own script's type role (an Arabic name at the Arabic size on an English page).

Renders an `<a href hreflang lang>` to the same page in the other language (LANG-05: the
switch is a link). It fires `scSwitch` on every activation; a single-page app calls
`preventDefault()` on it and switches in place, and the link still works without script.

The language name is kept as one light-DOM `<span lang>` child that the component writes
itself and shows through its slot: the type roles switch by `lang` in the document, which
a span inside the shadow root could not reach. Don't add or remove children yourself, other
than the `fallback` link below.

Without JavaScript (PERF-04, LANG-04): the switch renders in shadow DOM, so write the same
link as a light-DOM child, `<a slot="fallback" href hreflang lang>` with the other
language's name. The browser shows it until the switch upgrades; the upgraded switch has no
`fallback` slot, so it is then neither shown nor read.

Without `href` it falls back to a `<button lang>`. That mode is deprecated and will be
removed: always set `href`.

## Properties

| Property     | Attribute    | Description                                                                                                                                                                                                                                                                                                                                         | Type                                         | Default     |
| ------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ----------- |
| `appearance` | `appearance` | Where the switch sits. - `inline` (default): the app bar of a transaction. An underlined text link in the   channel action colour, label-medium. - `header`: the channel-site header. A globe icon and the name in `on-surface`,   label-large Medium, underlined on hover.  The v1 values still work: `glass` is `inline` and `plain` is `header`. | `"glass" \| "header" \| "inline" \| "plain"` | `'inline'`  |
| `href`       | `href`       | The same page in the other language. Sets `hreflang` to that language. Always set it: without it the switch renders a button, which is deprecated.                                                                                                                                                                                                  | `string \| undefined`                        | `undefined` |


## Events

| Event      | Description                                                                                                                                                                     | Type                                |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| `scSwitch` | Fires when the switch is activated, with the language asked for. Call `preventDefault()` to stop a link from navigating (for example, to switch language in a single-page app). | `CustomEvent<LanguageSwitchDetail>` |


## Slots

| Slot         | Description                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------------ |
|              | The default slot                                                                                             |
| `"fallback"` | Never shown once upgraded: the link for pages without JavaScript (PERF-04), shown until the switch upgrades. |


## Shadow Parts

| Part        | Description                                                          |
| ----------- | -------------------------------------------------------------------- |
| `"control"` | The inner `<a>` (or, deprecated, `<button>` when `href` is missing). |
| `"icon"`    | The globe (`appearance="header"` only).                              |
| `"label"`   | The wrapper around the language name.                                |


----------------------------------------------


