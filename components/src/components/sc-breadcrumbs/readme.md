# sc-breadcrumbs

Where the page sits in the channel's hierarchy, on channel pages outside a transaction (the hero of inner pages, CHR-07). Never inside a journey. Spec: `specs/sc-breadcrumbs.md`.

## Usage

```html
<sc-breadcrumbs>
  <a href="/en">Home</a>
  <a href="/en/vehicles">Vehicles</a>
  <span>Renew your vehicle registration</span>
</sc-breadcrumbs>
```

- Write the trail as plain children, a link per ancestor and the current page last as text. The component renders `<nav aria-label="Breadcrumb">` with an ordered list; the last item is never a link and carries `aria-current="page"`.
- The children are what shows before upgrade and without JavaScript. Changing them re-renders the trail.
- Chevrons mirror in Arabic. Below 600px the trail collapses to one "Back to {parent}" / "رجوع إلى {parent}" link, 44px tall; `compact-label` overrides its text.
- Every ancestor link has a 44 × 44 hit area (an invisible extension; the layout doesn't move) and stays underlined: breadcrumbs are navigation links, which R6 lets underline on hover only, but these keep the underline at rest too. Links follow on release, never on press.

### Styling hooks

Parts: `nav`, `list`, `link`, `current`.

<!-- Auto Generated Below -->


## Overview

Where this page sits in the channel's hierarchy, on pages outside a transaction (in the
hero of inner pages, CHR-07). Never inside a journey: use `sc-back-link` there.

Write the trail as plain children: a link for each ancestor, then the current page as
plain text (a `<span>`). The last child is always the current page; it is not a link and
carries `aria-current="page"`.

  <sc-breadcrumbs>
    <a href="/en">Home</a>
    <a href="/en/vehicles">Vehicles</a>
    <span>Renew your vehicle registration</span>
  </sc-breadcrumbs>

Renders `<nav aria-label="Breadcrumb">` with an ordered list in its shadow root. The
chevrons between items mirror in right-to-left. Below 600px the trail collapses to one
"Back to {parent}" link.

## Properties

| Property       | Attribute       | Description                                                                                                                                                          | Type                  | Default     |
| -------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `compactLabel` | `compact-label` | Overrides the text of the single link shown on compact screens (default "Back to {parent}" / "رجوع إلى {parent}"). `{parent}` is replaced by the parent page's text. | `string \| undefined` | `undefined` |
| `label`        | `label`         | Overrides the landmark name ("Breadcrumb" / "مسار التنقل").                                                                                                          | `string \| undefined` | `undefined` |


## Shadow Parts

| Part        | Description           |
| ----------- | --------------------- |
| `"current"` | The current page.     |
| `"link"`    | Each ancestor link.   |
| `"list"`    | The `<ol>`.           |
| `"nav"`     | The `<nav>` landmark. |


----------------------------------------------


