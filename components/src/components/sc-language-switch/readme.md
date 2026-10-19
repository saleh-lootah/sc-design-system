# sc-language-switch

Switches to the same page in the other language. The label is always the other language's own name: "العربية" on an English page, "English" on an Arabic page.

## Usage

```html
<!-- On /en/renew -->
<sc-language-switch href="/ar/renew"></sc-language-switch>
<!-- renders <a href="/ar/renew" hreflang="ar" lang="ar">العربية</a> -->

<!-- Switching in the client -->
<sc-language-switch id="lang"></sc-language-switch>
<script>
  document.getElementById('lang').addEventListener('scSwitch', (e) => setLanguage(e.detail.lang));
</script>
```

- The component reads the page language from the closest `lang` and offers the other one. Don't pass a label: the name never changes with the page language, by design.
- Prefer `href` to the same page in the other language (not the home page), so the user keeps their place. The link gets `hreflang` and `lang` set to the target language, so screen readers pronounce "العربية" with an Arabic voice.
- `scSwitch` fires on every activation with `{ lang }`. Call `preventDefault()` on it to stop a link from navigating (for example in a single-page app).
- Keep the user's answers when switching mid-journey.
- `appearance="glass"` (default) is the 44px pill for mobile app bars; `appearance="plain"` is for desktop headers.

### Placement

At the end of `sc-app-bar` (`slot="end"`). In Arabic the end is on the left.

### Accessibility

The label's own type: Arabic names use the Arabic label-m role (Bold), English names the Latin one (Medium), whatever the page language. 44px target, focus ring, solid fallback under reduced transparency, system colours in forced colours.

### Styling hooks

Parts: `control`, `label`.

<!-- Auto Generated Below -->


## Overview

Switches to the same page in the other language. The label is always the other
language's own name, "العربية" on an English page and "English" on an Arabic page,
marked with its own `lang` and direction so screen readers pronounce it correctly.

Renders an `<a href hreflang lang>` when `href` is set (preferred: the other-language page
has its own URL), or a `<button lang>` otherwise. Either way it fires `scSwitch`.

## Properties

| Property     | Attribute    | Description                                                                                                          | Type                  | Default     |
| ------------ | ------------ | -------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `appearance` | `appearance` | Surface. - `glass` (default): a 44px translucent pill, for mobile app bars. - `plain`: no fill, for desktop headers. | `"glass" \| "plain"`  | `'glass'`   |
| `href`       | `href`       | The same page in the other language. Sets `hreflang` to that language.                                               | `string \| undefined` | `undefined` |


## Events

| Event      | Description                                                                                                                                                                     | Type                                |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| `scSwitch` | Fires when the switch is activated, with the language asked for. Call `preventDefault()` to stop a link from navigating (for example, to switch language in a single-page app). | `CustomEvent<LanguageSwitchDetail>` |


## Shadow Parts

| Part        | Description                    |
| ----------- | ------------------------------ |
| `"control"` | The inner `<a>` or `<button>`. |
| `"label"`   | The language name.             |


----------------------------------------------


