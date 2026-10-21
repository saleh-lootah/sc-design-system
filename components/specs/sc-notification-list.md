# sc-notification-list · specification (v2, new)

Status: new in v2, built by C4 (Wave 2b). Rules: `docs/v2/component-language.md` B17, with one change from the coordinator's brief: **each item is a link** (component-language had a separate action link). Code: `src/components/sc-notification-list`.

## Encapsulation

**Light DOM (Stencil `scoped`)** (architecture §3.1: notification list). The author writes day headings and `<ul>` lists; each `<li>` holds one `<a>` (first child: the title; the rest: the body) and a `<time>`. `data-unread` marks unread items. The component adds a visually hidden `.sc-notification-list__unread` ("Unread:" / "غير مقروء:") inside the link of each unread item.

## Anatomy

| Part | Rule |
| --- | --- |
| Day heading | The author's `h2`/`h3`: `title-small` Bold, 32 above, 12 below. |
| Group | The `<ul>`: radius 12, 1px `outline-variant` edge, `surface-card`, 1px rules between rows. |
| Row | Grid: 16 dot column, the link, a 96 time column; gap 16; padding 20 block, 24 inline (board 8J4-0). |
| Unread | `channel-subtle` fill, an 8px `channel-action` dot, a Bold title, the hidden word. |
| Read | No fill, no dot, a Medium title. |
| Link | The title in `channel-action`, underlined (CMP-08), 2px on hover; the body in `on-surface` (`body-medium`, board 8JC-0), 2 below the title; at least 44 tall. Focus ring drawn 2px inside, because the card clips. |
| Time | `body-small`, `on-surface-variant`, aligned start in its 96 column (board 8JD-0). |

Under 600px wide the time wraps under the body, the inline padding is 16 and the column gap 12 (board 02 States, compact).

## Behaviour

`markAllRead()` removes `data-unread` from every item. The fill fades over `duration-base` (200ms, `easing-hover`) when a pointer started it, and instantly when focus is keyboard-visible (MOT-02). Put the unread count in the page lede (B17).

## Budget

Leaf, 4 KiB. Measured **3.0 KiB** gzip; CSS 1.0 KiB.

## Tests

Spec (hidden word EN/AR, `markAllRead()`), e2e (unread fill, dot, weight and words; links, 44px, Tab and colour; cards and rules; fade vs keyboard instant; compact wrap and RTL), `describeAxe`, visual.
