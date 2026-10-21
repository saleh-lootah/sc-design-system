# sc-account-menu · specification (v2)

Status: new in v2, built by C1 (Wave 2b). Rules: component-language B3 (B8 for the badge), Standard CHR-01. Code: `src/components/sc-account-menu`. Used in `sc-site-header`'s `slot="account"`, where it replaces sign in.

## Encapsulation

**Shadow DOM.** Self-contained: its own links and button, no form control, nothing referenced from outside. It reads the current channel's roles, which inherit into the shadow root.

## Anatomy

| # | Part | Notes |
| --- | --- | --- |
| 1 | Notifications | With `notifications-href`: a 44 × 44 bell link. With `unread` above 0, a count badge (`channel-action` fill, `channel-on-action` text, label-small Bold, a 2px `surface` ring, 99+ cap). Name: "Notifications" or "Notifications, 3 unread". |
| 2 | Trigger | `<button aria-expanded aria-controls>`, 48 tall, 1.5px `outline` edge, padding 6 at the start and 12 at the end. Avatar (32px circle, `channel-container` with `channel-action` initials (B3), initials from the name as written, or `initials`), the name (shown from 1280px, always in the accessible name "Account: …"), a 20px chevron. |
| 3 | Panel | As the channel switcher's, 320 wide: the name (label-medium Bold) and "Acting for: …" (`acting-for`, body-small, `on-surface-variant`), links Profile, Settings, "Change who you act for" (representation), a divider (4 around it), Sign out. Items 48 tall, 24px icon in `on-surface-variant` (Sign out's in `on-surface`), 8px corners. |
| 4 | Sign out | `on-surface` with a `logout` icon (mirrors), not `error`. A link with `sign-out-href`, else a button that fires `scSignOut`. |

## Behaviour

The shared disclosure: Escape closes and returns focus, a press outside or focus leaving closes, Tab moves through. Not an ARIA menu (B3 says "as the channel switcher"; the brief's "menu" is read as this disclosure). Methods `open()`, `close()`. Event `scSignOut` (bubbles, composed).

## Motion, RTL

As the channel switcher. The panel aligns to the trigger's inline-end edge (left in Arabic).

## Strings

`src/i18n/components/sc-account-menu.ts`: `accountLabel`, `accountActingFor`, `accountProfile`, `accountSettings`, `accountRepresentation`, `accountSignOut`, `accountNotifications`, `accountUnread` (the whole phrase per language, so Arabic gets its own comma).

## Budget

7 KiB override. Measured closure 6.8 KiB: own module 3.3 KiB (CSS 1.2), plus locale, icons and disclosure chunks.

## Tests

Spec: trigger name and initials, links, acting for, sign out event or link, unread names and badge cap, initials from Latin and Arabic names, Arabic. e2e: Tab order, keyboard open (instant), Escape and focus return, focus leaving, outside press, name from 1280px, 44/48px targets, panel alignment EN/AR, badge colours, avatar colours and trigger padding, axe open; `describeAxe`. Visual: open panel EN/AR × light/dark.
