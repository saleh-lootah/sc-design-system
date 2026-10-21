# sc-notification-list

A person's notifications, grouped by day. Each item is a link.

## Usage

```html
<p>You have 1 unread notification.</p>
<sc-notification-list>
  <h2>Today</h2>
  <ul>
    <li data-unread>
      <a href="/applications/A-2026-0412">
        <strong>Parking permit approved</strong>
        <span>Your permit for Al Barsha is ready to download.</span>
      </a>
      <time datetime="2026-10-21T09:40">09:40</time>
    </li>
  </ul>
  <h2>Earlier</h2>
  <ul>…</ul>
</sc-notification-list>
```

- Light DOM: real headings and real lists. Each `<li>` holds one link (its first child is the title, the rest the body) and a `<time>`.
- Unread (`data-unread`): `channel-subtle` fill, a dot in the channel colour, a Bold title and a visually hidden "Unread:" / "غير مقروء:" before the link text. Read: no fill, no dot, Medium title.
- `markAllRead()` clears every unread item; the fills fade over 200ms when a pointer started it and change instantly from the keyboard (MOT-02). Put the unread count in the page lede.
- Under 600px wide the time wraps under the body.
- Name the service and one next action in each notification (NOTE-02), never sensitive details.

<!-- Auto Generated Below -->


## Overview

A person's notifications, grouped by day ("Today", "Earlier"). Light DOM (architecture
§3.1): you write the headings and native lists, so each group is a real list under a real
heading and the links are ordinary links.

```html
<sc-notification-list>
  <h2>Today</h2>
  <ul>
    <li data-unread>
      <a href="/applications/A-2026-0412">
        <strong>Parking permit approved</strong>
        <span>Your permit for Al Barsha is ready to download.</span>
      </a>
      <time datetime="2026-10-21T09:40">09:40</time>
    </li>
  </ul>
  <h2>Earlier</h2>
  <ul>…</ul>
</sc-notification-list>

```

Each item is a link (its title and body), with the time beside it. An unread item
(`data-unread`) has a `channel-subtle` fill, a dot in the channel colour, a Bold title and
a visually hidden "Unread:" before the link text, so unread is never colour alone; a read
item has no fill or dot and a Medium title. Each group is a card with 1px rules between
rows. Under 600px wide the time wraps under the body.

## Methods

### `markAllRead() => Promise<number>`

Marks every item as read. The fills fade over 200ms when a pointer started it; from the
keyboard the change is instant (MOT-02). Returns the number of items changed.

#### Returns

Type: `Promise<number>`




## Slots

| Slot | Description                                                  |
| ---- | ------------------------------------------------------------ |
|      | Day headings (`h2`/`h3`) each followed by a `<ul>` of items. |


----------------------------------------------


