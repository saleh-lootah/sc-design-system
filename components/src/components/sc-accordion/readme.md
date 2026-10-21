# sc-accordion



<!-- Auto Generated Below -->


## Overview

Sections that open and close, for frequently asked questions and long guidance. Built on
native `<details>` and `<summary>`: they open with Enter or Space, expose their expanded
state to assistive technology and work before (and without) JavaScript. The component adds
the v2 look (ruled sections, a title-medium summary, a chevron at the end that turns over
when open) and an optional "Show all sections" toggle.

v2 renders in light DOM (Stencil `scoped`, architecture §3.1): the `<details>` stay your
own markup, so in-page links and `id`s inside them work as usual.

Put the question in `<summary>` as plain text, optionally followed by a `<small>` summary
line; put the answer after it. Keep headings out of `<summary>`: it is a button, so a
heading inside it is not announced as one.

## Properties

| Property  | Attribute  | Description                                                                                                  | Type      | Default |
| --------- | ---------- | ------------------------------------------------------------------------------------------------------------ | --------- | ------- |
| `showAll` | `show-all` | Adds a "Show all sections" / "Hide all sections" toggle above the sections. Use it from about four sections. | `boolean` | `false` |


## Slots

| Slot | Description                            |
| ---- | -------------------------------------- |
|      | `<details>` elements, one per section. |


----------------------------------------------


