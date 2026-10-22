# sc-modal

A dialog for a short secondary task, or a decision that can't wait such as the session-timeout warning. On phones (under 600px) it is a bottom sheet. Prefer a page for anything longer.

## Usage

```html
<sc-button variant="destructive" id="remove">Remove vehicle</sc-button>
<sc-modal id="confirm" heading="Remove this vehicle?">
  <p>You can add it again later.</p>
  <sc-button slot="actions" variant="destructive">Remove vehicle</sc-button>
  <sc-button slot="actions" variant="secondary">Keep it</sc-button>
</sc-modal>
<script>
  remove.addEventListener('click', () => confirm.show());
</script>
```

Session timeout (TIME-01 to TIME-03):

```html
<sc-modal id="timeout" alert heading="You will be signed out soon" countdown="120">
  <p>We'll keep your answers if you stay signed in.</p>
  <sc-button slot="actions" id="stay">Stay signed in</sc-button>
  <sc-button slot="actions" variant="secondary" id="sign-out">Sign out</sc-button>
</sc-modal>
<script>
  // Escape closes an alert with reason "stay": extend the session, as for the button (R7).
  timeout.addEventListener('scClose', (e) => { if (e.detail.reason === 'stay') extendSession(); });
  stay.addEventListener('click', () => { extendSession(); timeout.close(); });
  document.getElementById('sign-out').addEventListener('click', signOut);
</script>
```

Open the warning **at least 2 minutes before the session expires** (`countdown` of 120 or more, R7).

- A native `<dialog>` opened with `showModal()`: the page behind is inert. Focus goes to the heading (or the first control with `initial-focus="first"`) and returns to the trigger on close.
- Escape, the close button and the scrim close it (`scClose` says why). `alert` makes it an `alertdialog`: the scrim doesn't close it, a sheet can't be dragged closed (no grabber), and there is no close button. **Escape in an `alert` is the safe default**: it closes with reason `stay`, which the session timeout treats as "Stay signed in"; only "Sign out" signs out. The body and countdown describe the dialog (`aria-describedby`).
- `countdown` (seconds) shows "Time left: 1:45" and announces it politely once on open, at each whole minute and at 30 and 10 seconds, never every second. `scCountdownEnd` fires at zero; nothing is submitted. Set `countdown` again after "Stay signed in" to restart.
- Motion: centred, entering with opacity and a slight scale over 280ms and leaving over 224ms; the sheet slides on the drawer curve and can be dragged or flicked down (it always has a close button too; an `alert` sheet can't be dragged). Opened from the keyboard it appears instantly; under reduced motion it only fades.
- On a sheet, slotted `sc-button` actions get `full-width` and stack, primary first.

Parts: `dialog`, `panel`, `heading`, `close`, `countdown`, `actions`.

<!-- Auto Generated Below -->


## Overview

A modal dialog for a short secondary task or a decision that can't wait, such as the
session-timeout warning (TIME-02). On phones (under 600px) the same component is a bottom
sheet.

It is a native `<dialog>` opened with `showModal()`, so the page behind is inert and focus
can't leave it. On open, focus goes to the heading (or, with `initial-focus="first"`, the
first control). Escape, the close button and a click on the scrim close it (an `alert`
dialog ignores the scrim, can't be dragged and has no close button), and focus returns to
whatever had it before. A sheet can also be dragged down or flicked closed, never only that
(WCAG 2.5.7).

Motion (W21): the dialog stays centred and enters with opacity and a slight scale over
`--sc-duration-base` (200ms) with the strong ease-out, and exits over `--sc-duration-exit`
(160ms); the sheet slides up over `--sc-duration-slow` (280ms) on `--sc-easing-drawer` and
exits 20% faster (224ms). The scrim fades with them. Opened
from the keyboard it appears instantly (MOT-02); under reduced motion it only fades.

Session timeout: set `alert` and `countdown` (seconds). The time left shows as text,
updated every second, and is announced politely only once on open, at each whole minute
and at 30 and 10 seconds, never every second. `scCountdownEnd` fires at zero; expiring
never submits anything (TIME-03). Escape means "stay signed in": it closes with reason
`stay`, and the service extends the session as for the "Stay signed in" button (R7). The
body and countdown describe the dialog (`aria-describedby`). Open the warning at least
2 minutes before expiry (`countdown` of 120 or more).

## Properties

| Property               | Attribute       | Description                                                                                                                                                                                                                                                                                                                                                                                       | Type                   | Default     |
| ---------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ----------- |
| `alert`                | `alert`         | An alert dialog (`role="alertdialog"`) for something that needs an answer, such as the session timeout: a click on the scrim does not close it, a sheet can't be dragged closed, and there is no close button; the actions decide. Escape closes it with reason `stay`, the safe default ("Stay signed in" for the session timeout, R7). The body and countdown describe it (`aria-describedby`). | `boolean`              | `false`     |
| `closeLabel`           | `close-label`   | Overrides the close button's name ("Close" / "إغلاق").                                                                                                                                                                                                                                                                                                                                            | `string \| undefined`  | `undefined` |
| `countdown`            | `countdown`     | Seconds left, for a countdown such as the session timeout. Shown as "Time left: 1:45" and announced sparingly. Set it again (for example after "Stay signed in") to restart.                                                                                                                                                                                                                      | `number \| undefined`  | `undefined` |
| `heading` _(required)_ | `heading`       | The heading, which names the dialog: "You will be signed out soon".                                                                                                                                                                                                                                                                                                                               | `string`               | `undefined` |
| `headingLevel`         | `heading-level` | The heading level. 2 for a dialog opened from the page (the default).                                                                                                                                                                                                                                                                                                                             | `2 \| 3`               | `2`         |
| `initialFocus`         | `initial-focus` | Where focus goes on open: the `heading` (default), or the `first` control in the body or actions.                                                                                                                                                                                                                                                                                                 | `"first" \| "heading"` | `'heading'` |
| `open`                 | `open`          | Whether the dialog is open. Set it, or call `show()` and `close()`.                                                                                                                                                                                                                                                                                                                               | `boolean`              | `false`     |


## Events

| Event            | Description                                                                                                                          | Type                                         |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- |
| `scClose`        | Fires when the dialog closes, with why: `close-button`, `escape`, `stay` (Escape in an `alert` dialog), `scrim`, `drag` or `method`. | `CustomEvent<{ reason: ModalCloseReason; }>` |
| `scCountdownEnd` | Fires when the countdown reaches zero. The dialog stays open; the service decides what happens.                                      | `CustomEvent<void>`                          |
| `scOpen`         | Fires after the dialog opens.                                                                                                        | `CustomEvent<void>`                          |


## Methods

### `close() => Promise<void>`

Closes the dialog and returns focus to where it was.

#### Returns

Type: `Promise<void>`



### `show() => Promise<void>`

Opens the dialog.

#### Returns

Type: `Promise<void>`




## Slots

| Slot        | Description                                                                                                              |
| ----------- | ------------------------------------------------------------------------------------------------------------------------ |
|             | The body: one or two short paragraphs.                                                                                   |
| `"actions"` | The buttons, primary first: `<sc-button slot="actions">Stay signed in</sc-button>`. On a sheet they stack at full width. |


## Shadow Parts

| Part          | Description                               |
| ------------- | ----------------------------------------- |
| `"actions"`   | The wrapper of the actions slot.          |
| `"close"`     | The close button.                         |
| `"countdown"` | The visible "Time left" line.             |
| `"dialog"`    | The native `<dialog>`.                    |
| `"heading"`   | The heading that labels the dialog.       |
| `"panel"`     | The panel inside it (padding and layout). |


----------------------------------------------


