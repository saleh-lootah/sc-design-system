# sc-account-menu

The signed-in account control for `sc-site-header`'s `slot="account"`: notifications with the unread count, and a disclosure with profile, settings, representation and sign out. Spec: `specs/sc-account-menu.md`.

## Usage

```html
<sc-account-menu slot="account" name="Sara Al Mansoori" acting-for="Al Mansoori Trading LLC"
  profile-href="/en/profile" settings-href="/en/settings" representation-href="/en/act-for"
  notifications-href="/en/notifications" unread="3"></sc-account-menu>
```

- Without `sign-out-href`, Sign out is a button that fires `scSignOut`: post your sign-out form from the listener.
- The initials come from the name as written; `initials` overrides them.

<!-- Auto Generated Below -->


## Overview

The signed-in account control in `sc-site-header` (`slot="account"`; component-language
B3, Standard CHR-01). It replaces "Sign in with UAE PASS" once the user is signed in.

- A notifications button (a link to the notifications page) with the unread count, named
  "Notifications, 3 unread".
- A `<button aria-expanded>` with the user's initials (and name from 1280px) that opens a
  non-modal panel: the name and who they are acting for, links to Profile, Settings and
  representation ("Change who you act for"), and Sign out.

The panel is a disclosure, not an ARIA menu: Tab moves through its links, Escape closes it
and returns focus to the button, a press outside or focus leaving closes it. From a
pointer it grows from the button's corner; from the keyboard it appears instantly.

## Properties

| Property             | Attribute             | Description                                                                                                               | Type                  | Default     |
| -------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `actingFor`          | `acting-for`          | The person or organisation the user is acting for, when it is not themselves.                                             | `string \| undefined` | `undefined` |
| `initials`           | `initials`            | Overrides the initials taken from `name` ("SM").                                                                          | `string \| undefined` | `undefined` |
| `name`               | `name`                | The signed-in user's name as written ("Sara Al Mansoori").                                                                | `string`              | `''`        |
| `notificationsHref`  | `notifications-href`  | The notifications page. Adds the notifications button.                                                                    | `string \| undefined` | `undefined` |
| `profileHref`        | `profile-href`        | The profile page.                                                                                                         | `string \| undefined` | `undefined` |
| `representationHref` | `representation-href` | Where the user changes who they act for (representation).                                                                 | `string \| undefined` | `undefined` |
| `settingsHref`       | `settings-href`       | The account settings page.                                                                                                | `string \| undefined` | `undefined` |
| `signOutHref`        | `sign-out-href`       | The sign-out URL. Without it, Sign out is a button that fires `scSignOut`, so the service can post its own sign-out form. | `string \| undefined` | `undefined` |
| `unread`             | `unread`              | Unread notifications. Shown as a badge on the notifications button when above 0.                                          | `number`              | `0`         |


## Events

| Event       | Description                                                                     | Type                |
| ----------- | ------------------------------------------------------------------------------- | ------------------- |
| `scSignOut` | Fired when Sign out is a button (no `sign-out-href`) and the user activates it. | `CustomEvent<void>` |


## Methods

### `close() => Promise<void>`

Closes the panel.

#### Returns

Type: `Promise<void>`



### `open() => Promise<void>`

Opens the panel (as from the keyboard: no animation).

#### Returns

Type: `Promise<void>`




## Shadow Parts

| Part              | Description               |
| ----------------- | ------------------------- |
| `"notifications"` | The notifications button. |
| `"panel"`         | The panel.                |
| `"trigger"`       | The account button.       |


----------------------------------------------


