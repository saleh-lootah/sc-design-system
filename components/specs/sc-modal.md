# sc-modal · specification (v2, new)

Status: new in v2, built by C4 (Wave 2b). Rules: `docs/v2/component-language.md` B19 read through `docs/v2/decisions.md` (shadow-3 is `elevation-2`), FND-19/20, MOT-01 to MOT-15 with the modal and drawer rule (200–300ms, exits about 20% faster), W2 (`duration-slow` 280ms), TIME-01 to TIME-03. Code: `src/components/sc-modal`.

## Encapsulation

**Shadow DOM** with a native `<dialog>` in its own root, opened with `showModal()` (architecture §3.1): the top layer, the inert page and the focus trap come from the browser. Slotted body and actions stay in light DOM and are not inert (flat tree).

## Anatomy

| Part | Dialog (600px and wider) | Sheet (under 600px) |
| --- | --- | --- |
| `dialog` | Centred, `min(100% − 32, 560)` wide, radius 12, 1px `outline-variant` edge, `elevation-2`, over `scrim` (`::backdrop`). Panel `surface-card`; dark `surface-container` (FND-20). | Full width, at most 92dvh, top corners 12, docked to the bottom. |
| `panel` | Padding 32 (24 below 1024px). | Padding 20 block, 20 inline, plus the bottom safe area. |
| Grabber | none | 32 × 4 `outline-variant`, decorative. The top strip is the drag handle. |
| `heading` | `headline-small` (Bold), labels the dialog (`aria-labelledby`), `tabindex="-1"`. | same |
| `close` | 44 × 44 at top inline-end, `on-surface`, state layer on hover; named "Close" / "إغلاق" (`close-label`). Not rendered for `alert`. | same |
| `countdown` | `title-medium`: "Time left: 1:45" with the time in an LTR isolate. | same |
| Body | `body-large`, 12 below the heading. | same |
| `actions` | A wrapping row, gap 12, 32 below; primary first. | Stacked; slotted `sc-button`s get `full-width`. |

## Behaviour

- **Open:** `open` attribute, or `show()`. Focus goes to the heading, or the first control with `initial-focus="first"`. `scOpen` fires.
- **Close:** Escape (`cancel`, prevented so the exit animates), the close button, a scrim click (not for `alert`), a drag or flick down on a sheet (release velocity above 0.11 px/ms or a third of its height), or `close()`. Focus returns to the element that had it. `scClose` carries `{ reason }`.
- **Alert:** `alert` gives `role="alertdialog"`, no close button and no scrim dismissal; Escape still closes it.
- **Countdown (session timeout):** `countdown` in seconds. The visible line updates every second; a polite `role="status"` announces "{time} left" once on open, at each whole minute and at 30 and 10 seconds, with plural forms per `Intl.PluralRules` ("1 minute and 1 second", "دقيقتان"). `scCountdownEnd` fires at zero; the dialog stays open and nothing is submitted (TIME-03).

## Motion

| | Enter | Exit |
| --- | --- | --- |
| Dialog | opacity and `scale(--sc-scale-enter)` → 1, from its own centre (MOT-08), `duration-slow` 280ms, `easing-enter` | `calc(duration-slow × 0.8)` 224ms, `easing-exit` |
| Sheet | `translateY(100%)` → 0, 280ms, `easing-drawer` | 224ms, `easing-drawer`; a drag hands off from where the finger left it |
| Scrim | fades with the panel | fades with the panel |

`@starting-style` and `transition-behavior: allow-discrete` on `display` and `overlay`, so transitions retarget (MOT-12). Opened while the trigger is keyboard-focused: instant (MOT-02). Reduced motion: the scale token is 1 and the sheet does not slide; only opacity remains.

## RTL

The close button moves to the left; actions keep primary first in reading order. Digits stay Latin.

## Budget

`perf-budgets.json` gives **7 KiB** (leaf 4 KiB): a dialog that is also a bottom sheet with drag, focus return and the countdown with plural announcements. Its own module is about 4.7 KiB plus the shared icon set and locale controller. Measured **6.6 KiB** gzip; CSS 1.2 KiB. A split (a separate timeout helper) is possible if a page budget needs it.

## Tests

Spec (labelling, close button, alertdialog, strings), e2e (modal and inert, Tab stays inside, Escape and focus return with the reason, close button, scrim, alert ignores scrim, `initial-focus`, 280 / 224ms and centred 560px, keyboard-instant, sheet geometry, drawer curve and full-width actions, countdown text and checkpoint announcements in EN and AR), axe open in EN/AR × light/dark, visual (dialog and sheet, EN/AR × light/dark).
