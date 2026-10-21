# sc-timeline

The status history of an application: each change with its status, date and one line of detail.

## Usage

```html
<sc-timeline>
  <ol>
    <li>
      <sc-status-tag tone="error">Action needed</sc-status-tag>
      <time datetime="2026-10-20T09:40">20 Oct 2026, 09:40</time>
      <p>Upload a clearer copy of your Emirates ID.</p>
    </li>
    <li>
      <sc-status-tag>In review</sc-status-tag>
      <time datetime="2026-10-18T14:05">18 Oct 2026, 14:05</time>
      <p>RTA is checking your documents.</p>
    </li>
  </ol>
</sc-timeline>
```

- Light DOM: you write the native list. Newest first by default (`order="oldest-first"` to reverse).
- The latest entry gets `aria-current="step"`, and its 12px dot takes the tone of its `sc-status-tag`; earlier dots are `outline`. The status words are always in the tag.
- `divided` adds 1px rules between entries, for a timeline inside a card.
- Dates use Latin digits; Dubai W23's digits are tabular. The marker column moves to the right in Arabic.

<!-- Auto Generated Below -->


## Overview

The status history of an application: each change, with its status, date and a line of
detail. Light DOM (architecture §3.1): you write the native list, so screen readers count
the entries and nothing crosses a shadow boundary.

```html
<sc-timeline>
  <ol>
    <li>
      <sc-status-tag tone="error">Action needed</sc-status-tag>
      <time datetime="2026-10-20T09:40">20 Oct 2026, 09:40</time>
      <p>Upload a clearer copy of your Emirates ID.</p>
    </li>
    …
  </ol>
</sc-timeline>
```

The latest entry is the current step: it gets `aria-current="step"`, and its 12px dot
takes the tone of its `sc-status-tag` (the status words are always in the tag). Earlier
dots are `outline`; a 2px `outline-variant` connector joins them. Dates use Dubai W23's
tabular Latin digits. The marker column moves to the right in Arabic.

## Properties

| Property  | Attribute | Description                                                                       | Type                               | Default          |
| --------- | --------- | --------------------------------------------------------------------------------- | ---------------------------------- | ---------------- |
| `divided` | `divided` | Draws a 1px `outline-variant` rule between entries, for a timeline inside a card. | `boolean`                          | `false`          |
| `order`   | `order`   | Which end of the list is the latest (current) entry.                              | `"newest-first" \| "oldest-first"` | `'newest-first'` |


## Slots

| Slot | Description                                                           |
| ---- | --------------------------------------------------------------------- |
|      | An `<ol>` with one `<li>` per status change, newest first by default. |


----------------------------------------------


