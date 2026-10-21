# sc-account-nav

The side navigation of the signed-in account area. Spec: `specs/sc-account-nav.md`.

## Usage

```html
<sc-account-nav>
  <a href="/en/account/applications" data-icon="description">Applications</a>
  <a href="/en/account/payments" data-icon="credit-card" aria-current="page">Payments</a>
  <a href="/en/account/notifications" data-icon="notifications" data-count="3" data-count-label="3 unread">Notifications</a>
  <a href="/en/account/profile" data-icon="person">Profile and settings</a>
  <a href="/en/sign-out" data-icon="logout" data-sign-out>Sign out</a>
</sc-account-nav>
```

- Write the items as plain links. `aria-current="page"` marks the current one (channel-subtle fill, 3px bar, channel-action icon and Bold label); `data-icon` picks a 24px icon (`description`, `credit-card`, `notifications`, `person`, `history`, `home`, `apps`, `logout`); `data-count` adds a badge read as `data-count-label` (default "{count} new" / "{count} جديدة"); `data-sign-out` puts the item after the divider.
- 3 of 12 columns on wide screens. Below 600px it becomes one row of 44px items that scrolls sideways.
- The links are what shows before upgrade and without JavaScript. Changing them re-renders the nav.

### Styling hooks

Parts: `nav`, `item`, `badge`.

<!-- Auto Generated Below -->


## Overview

The side navigation of the signed-in account area: Applications, Payments,
Notifications, Profile and settings, then a divider and Sign out. It takes 3 of 12
columns on wide screens and becomes a horizontal row of 44px items below 600px.

Write the items as plain links (they are what shows before upgrade and without
JavaScript):

  <sc-account-nav>
    <a href="/en/account/applications" data-icon="description">Applications</a>
    <a href="/en/account/payments" data-icon="credit-card" aria-current="page">Payments</a>
    <a href="/en/account/notifications" data-icon="notifications" data-count="3" data-count-label="3 unread">Notifications</a>
    <a href="/en/account/profile" data-icon="person">Profile and settings</a>
    <a href="/en/sign-out" data-icon="logout" data-sign-out>Sign out</a>
  </sc-account-nav>

- `aria-current="page"` marks the current item: a channel-subtle fill, a 3px channel bar
  at inline-start, and the icon and a Bold label in channel-action (never colour alone).
- `data-icon`: `description`, `credit-card`, `notifications`, `person`, `history`,
  `home`, `apps` or `logout` (24px; `logout` mirrors in right-to-left).
- `data-count`: a count badge, read with the visually hidden `data-count-label`
  (default "{count} new" / "{count} جديدة").
- `data-sign-out`: puts the item after the divider.

## Properties

| Property | Attribute | Description                                         | Type                  | Default     |
| -------- | --------- | --------------------------------------------------- | --------------------- | ----------- |
| `label`  | `label`   | Overrides the landmark name ("Account" / "الحساب"). | `string \| undefined` | `undefined` |


## Shadow Parts

| Part      | Description           |
| --------- | --------------------- |
| `"badge"` | A count badge.        |
| `"item"`  | Each link.            |
| `"nav"`   | The `<nav>` landmark. |


----------------------------------------------


