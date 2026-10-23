# sc-modal · specification (v2, new)

Status: new in v2, built by C4 (Wave 2b). Rules: `docs/v2/component-language.md` B19 read through `docs/v2/decisions.md` (shadow-3 is `elevation-2`), FND-19/20, MOT-01 to MOT-15 with the modal and drawer rule (200–300ms, exits about 20% faster), W2 (`duration-slow` 280ms), W21 (dialog 200 / 160ms, sheet 280 / 224ms), TIME-01 to TIME-03. Code: `src/components/sc-modal`.

## Encapsulation

**Shadow DOM** with a native `<dialog>` in its own root, opened with `showModal()` (architecture §3.1): the top layer, the inert page and the focus trap come from the browser. Slotted body and actions stay in light DOM and are not inert (flat tree).

## Anatomy

| Part | Dialog (600px and wider) | Sheet (under 600px) |
| --- | --- | --- |
| `dialog` | Centred, `min(100% − 32, 560)` wide, radius 12, 1px `outline-variant` edge, `elevation-2`, over `scrim` (`::backdrop`). Panel `surface`; dark `surface-container-high` (B19 and board BWH-0 dark note; `light-dark()` behind `@supports`, so the A1 fallback keeps `surface`). | Full width, at most 92dvh, top corners 12, docked to the bottom. |
| `panel` | Padding 32 (24 below 1024px). | Padding 8 top (the grabber), 24 bottom plus the safe area, 20 inline (board BY7-0). |
| Grabber | none | 32 × 4 `outline-variant`, 8 from the top and 12 above the heading row, decorative. The top strip is the drag handle. Not rendered for `alert`, which can't be dragged (R7). |
| `heading` | `headline-small` (Bold), 6 top padding so its first line centres on the close button; labels the dialog (`aria-labelledby`), `tabindex="-1"`. 16 from the close button. | 12 from the close button |
| `close` | 44 × 44 in the panel's top inline-end corner (inside the padding), radius 4 (`radius-control`, board BXL-0), `on-surface`, state layer on hover; named "Close" / "إغلاق" (`close-label`). Not rendered for `alert`. | same |
| `countdown` | `title-medium`: "Time left: 1:45" with the time in an LTR isolate. | same |
| Body | `body-large`, 12 below the heading. | 8 below the heading (board BYG-0) |
| `actions` | A wrapping row, gap 16 (board BXP-0), 32 below the body; primary first. | Stacked, gap 12, 24 below the body; slotted `sc-button`s get `full-width`. |

## Behaviour

- **Open:** `open` attribute, or `show()`. Focus goes to the heading, or the first control with `initial-focus="first"`. `scOpen` fires.
- **Close:** Escape (`cancel`, prevented so the exit animates), the close button, a scrim click (not for `alert`), a drag or flick down on a sheet (release velocity above 0.11 px/ms or a third of its height; not for `alert`), or `close()`. Focus returns to the element that had it. `scClose` carries `{ reason }`: `close-button`, `escape`, `stay`, `scrim`, `drag` or `method`.
- **Alert (R7):** `alert` gives `role="alertdialog"`, no close button, no scrim dismissal and, on a sheet, no drag or flick dismissal and no grabber (the top strip keeps `touch-action: auto`), so a scroll gesture can't dismiss the warning. The dialog is described by its body, countdown line included (`aria-describedby` on the body wrapper, read through the slot), so a screen reader hears the time and the consequence on open. **Escape is the safe default:** it closes the dialog with reason `stay`, never `escape`. For the session timeout `stay` means "Stay signed in": the service extends the session exactly as for that button, and only "Sign out" signs out (TIME-02). We chose a close reason over clicking the primary action because an `alert` dialog's primary action can be destructive; the service maps `stay` to its safe action.
- **Countdown (session timeout):** `countdown` in seconds. The service opens the warning **at least 2 minutes before expiry** (`countdown` of 120 or more, R7): 20 seconds is the WCAG 2.2.1 floor, too short for someone who has to find and read the dialog with a screen reader. The visible line updates every second; a polite `role="status"` announces "{time} left" once on open, at each whole minute and at 30 and 10 seconds, with plural forms per `Intl.PluralRules` ("1 minute and 1 second", "دقيقتان"). `scCountdownEnd` fires at zero; the dialog stays open and nothing is submitted (TIME-03).

## Motion

| | Enter | Exit |
| --- | --- | --- |
| Dialog | opacity and `scale(--sc-scale-enter)` → 1, from its own centre (MOT-08), `duration-base` 200ms, `easing-enter` (W21) | `duration-exit` 160ms, `easing-exit` |
| Sheet | `translateY(100%)` → 0, `duration-slow` 280ms, `easing-drawer` | `calc(duration-slow × 0.8)` 224ms, `easing-drawer`; a drag hands off from where the finger left it |
| Scrim | fades with the panel | fades with the panel |

`@starting-style` and `transition-behavior: allow-discrete` on `display` and `overlay`, so transitions retarget (MOT-12). Opened while the trigger is keyboard-focused: instant (MOT-02), for the sheet too. Reduced motion: the scale token is 1 and the sheet does not slide; only opacity remains.

Close button: the state layer fades over `duration-fast` with `easing-hover`, and the button presses to `scale(--sc-scale-press)` on `:active` over `duration-press` with `easing-enter`, pointer and touch only (MOT-09); none from the keyboard (MOT-02) or under reduced motion (the token is 1). Approved by the user, 23 October 2026.

## RTL

The close button moves to the left; actions keep primary first in reading order. Digits stay Latin.

## Budget

`perf-budgets.json` gives **7 KiB** (leaf 4 KiB): a dialog that is also a bottom sheet with drag, focus return and the countdown with plural announcements. Its own module is about 4.7 KiB plus the shared icon set and locale controller. Measured **6.6 KiB** gzip; CSS 1.2 KiB. A split (a separate timeout helper) is possible if a page budget needs it.

## Tests

Spec (labelling, close button, alertdialog, alert `aria-describedby` and no grabber, strings), e2e (modal and inert, Tab stays inside, Escape and focus return with the reason, alert Escape closes with `stay`, alert described by body and countdown, close button, scrim, alert ignores scrim, alert sheet ignores drag and scrim while a plain sheet drags closed, `initial-focus`, dialog 200 / 160ms and centred 560px, sheet 280 / 224ms, keyboard-instant (dialog and sheet), sheet geometry, drawer curve and full-width actions, countdown text and checkpoint announcements in EN and AR), axe open in EN/AR × light/dark, visual (dialog and sheet, EN/AR × light/dark).
