import { Component, Element, Event, EventEmitter, Host, Method, Prop, State, Watch, h } from '@stencil/core';
import { LocaleController } from '../../i18n/controller';
import strings from '../../i18n/components/sc-modal';
import { Close } from '../../icons/index'; // explicit /index: see CONTRIBUTING

export type ModalHeadingLevel = 2 | 3;
export type ModalInitialFocus = 'heading' | 'first';
export type ModalCloseReason = 'close-button' | 'escape' | 'scrim' | 'drag' | 'method';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
/** Release velocity (px/ms) above which a downward flick closes the sheet (MOT-10). */
const FLICK = 0.11;
let nextId = 0;

/** The element that really has focus, looking inside shadow roots. */
function deepActive(doc: Document): HTMLElement | null {
  let el = doc.activeElement as HTMLElement | null;
  while (el?.shadowRoot?.activeElement) el = el.shadowRoot.activeElement as HTMLElement;
  return el;
}

/**
 * A modal dialog for a short secondary task or a decision that can't wait, such as the
 * session-timeout warning (TIME-02). On phones (under 600px) the same component is a bottom
 * sheet.
 *
 * It is a native `<dialog>` opened with `showModal()`, so the page behind is inert and focus
 * can't leave it. On open, focus goes to the heading (or, with `initial-focus="first"`, the
 * first control). Escape, the close button and a click on the scrim close it (an `alert`
 * dialog ignores the scrim and has no close button), and focus returns to whatever had it
 * before. A sheet can also be dragged down or flicked closed, never only that (WCAG 2.5.7).
 *
 * Motion: the dialog stays centred and enters with opacity and a slight scale over
 * `--sc-duration-slow` (280ms) with the strong ease-out; the sheet slides up on
 * `--sc-easing-drawer`. Both exit 20% faster (224ms). The scrim fades with them. Opened
 * from the keyboard it appears instantly (MOT-02); under reduced motion it only fades.
 *
 * Session timeout: set `alert` and `countdown` (seconds). The time left shows as text,
 * updated every second, and is announced politely only once on open, at each whole minute
 * and at 30 and 10 seconds, never every second. `scCountdownEnd` fires at zero; expiring
 * never submits anything (TIME-03).
 *
 * @slot - The body: one or two short paragraphs.
 * @slot actions - The buttons, primary first: `<sc-button slot="actions">Stay signed in</sc-button>`. On a sheet they stack at full width.
 *
 * @part dialog - The native `<dialog>`.
 * @part panel - The panel inside it (padding and layout).
 * @part heading - The heading that labels the dialog.
 * @part close - The close button.
 * @part countdown - The visible "Time left" line.
 * @part actions - The wrapper of the actions slot.
 */
@Component({
  tag: 'sc-modal',
  styleUrl: 'sc-modal.css',
  shadow: true,
})
export class ScModal {
  @Element() el!: HTMLElement;

  /** Whether the dialog is open. Set it, or call `show()` and `close()`. */
  @Prop({ reflect: true, mutable: true }) open = false;

  /** The heading, which names the dialog: "You will be signed out soon". */
  @Prop() heading!: string;

  /** The heading level. 2 for a dialog opened from the page (the default). */
  @Prop() headingLevel: ModalHeadingLevel = 2;

  /**
   * An alert dialog (`role="alertdialog"`) for something that needs an answer, such as the
   * session timeout: a click on the scrim does not close it, and there is no close button;
   * the actions decide. Escape still closes it (reason `escape`).
   */
  @Prop({ reflect: true }) alert = false;

  /** Where focus goes on open: the `heading` (default), or the `first` control in the body or actions. */
  @Prop() initialFocus: ModalInitialFocus = 'heading';

  /** Overrides the close button's name ("Close" / "إغلاق"). */
  @Prop() closeLabel?: string;

  /**
   * Seconds left, for a countdown such as the session timeout. Shown as "Time left: 1:45" and
   * announced sparingly. Set it again (for example after "Stay signed in") to restart.
   */
  @Prop() countdown?: number;

  /** Fires after the dialog opens. */
  @Event({ eventName: 'scOpen', bubbles: true, composed: true }) scOpen!: EventEmitter<void>;

  /** Fires when the dialog closes, with why: `close-button`, `escape`, `scrim`, `drag` or `method`. */
  @Event({ eventName: 'scClose', bubbles: true, composed: true }) scClose!: EventEmitter<{ reason: ModalCloseReason }>;

  /** Fires when the countdown reaches zero. The dialog stays open; the service decides what happens. */
  @Event({ eventName: 'scCountdownEnd', bubbles: true, composed: true }) scCountdownEnd!: EventEmitter<void>;

  @State() remaining?: number;
  @State() announcement = '';
  @State() sheet = false;
  @State() hasActions = false;

  private locale = new LocaleController(this, strings);
  private dialog?: HTMLDialogElement;
  private headingEl?: HTMLElement;
  private returnTo: HTMLElement | null = null;
  private timer?: ReturnType<typeof setInterval>;
  private deadline = 0;
  private reason: ModalCloseReason = 'method';
  private media?: MediaQueryList;
  private drag?: { y: number; t: number; dy: number; v: number };
  private readonly id = `sc-modal-${++nextId}`;

  connectedCallback() {
    this.locale.connect();
    this.hasActions = Array.from(this.el.children).some((child) => child.getAttribute('slot') === 'actions');
    if (typeof matchMedia === 'function') {
      this.media = matchMedia('(max-width: 599.98px)');
      this.sheet = this.media.matches;
      this.media.addEventListener?.('change', this.onMedia);
    }
  }

  disconnectedCallback() {
    this.locale.disconnect();
    this.media?.removeEventListener?.('change', this.onMedia);
    this.stopCountdown();
  }

  componentDidLoad() {
    if (this.open) this.openDialog();
  }

  componentDidRender() {
    this.fitActions();
  }

  @Watch('open')
  onOpenChange(open: boolean) {
    if (open) this.openDialog();
    else this.closeDialog();
  }

  @Watch('countdown')
  onCountdownChange() {
    if (this.open) this.startCountdown();
  }

  /** Opens the dialog. */
  @Method()
  async show(): Promise<void> {
    this.open = true;
  }

  /** Closes the dialog and returns focus to where it was. */
  @Method()
  async close(): Promise<void> {
    this.reason = 'method';
    this.open = false;
  }

  private onMedia = () => {
    this.sheet = !!this.media?.matches;
  };

  /** On a sheet the actions stack at full width: give slotted sc-buttons `full-width`. */
  private fitActions() {
    const slotted = Array.from(this.el.children).filter((child) => child.getAttribute('slot') === 'actions');
    const buttons = slotted.flatMap((el) => (el.localName === 'sc-button' ? [el] : Array.from(el.querySelectorAll('sc-button'))));
    for (const button of buttons) {
      if (this.sheet && !button.hasAttribute('full-width')) {
        button.setAttribute('full-width', '');
        button.setAttribute('data-sc-modal-full', '');
      } else if (!this.sheet && button.hasAttribute('data-sc-modal-full')) {
        button.removeAttribute('full-width');
        button.removeAttribute('data-sc-modal-full');
      }
    }
  }

  private openDialog() {
    const dialog = this.dialog;
    if (!dialog || dialog.open) return;
    const doc = this.el.ownerDocument;
    this.returnTo = deepActive(doc);
    // MOT-02: opened from the keyboard, it appears instantly.
    const fromKeyboard = !!this.returnTo && this.returnTo !== doc.body && this.returnTo.matches?.(':focus-visible');
    this.el.classList.toggle('is-instant', fromKeyboard);
    this.reason = 'method';
    dialog.showModal();
    this.focusInitial();
    this.startCountdown();
    this.scOpen.emit();
  }

  private closeDialog() {
    const dialog = this.dialog;
    this.stopCountdown();
    if (!dialog || !dialog.open) return;
    // Close first, then drop a drag offset: the exit transition starts from where the finger left it.
    dialog.close();
    dialog.style.removeProperty('transform');
    const target = this.returnTo;
    this.returnTo = null;
    if (target && target.isConnected) target.focus({ preventScroll: true });
    this.scClose.emit({ reason: this.reason });
  }

  private requestClose(reason: ModalCloseReason) {
    this.reason = reason;
    this.open = false;
  }

  private focusInitial() {
    if (this.initialFocus === 'first') {
      const first = this.el.querySelector<HTMLElement>(FOCUSABLE);
      if (first) {
        first.focus();
        return;
      }
    }
    this.headingEl?.focus();
  }

  /* Countdown (TIME-02) ----------------------------------------------------------------- */
  private startCountdown() {
    this.stopCountdown();
    const seconds = Math.floor(Number(this.countdown));
    if (!this.open || !(seconds >= 0)) {
      this.remaining = undefined;
      return;
    }
    this.deadline = Date.now() + seconds * 1000;
    this.remaining = seconds;
    this.announcement = '';
    // Announce once after the heading has been read, then only at the checkpoints.
    let first = true;
    this.timer = setInterval(() => {
      const left = Math.max(0, Math.round((this.deadline - Date.now()) / 1000));
      this.remaining = left;
      if (first || (left > 0 && (left % 60 === 0 || left === 30 || left === 10))) this.announcement = this.locale.t('modalAnnounce', { time: this.spoken(left) });
      first = false;
      if (left === 0) {
        this.stopCountdown();
        this.scCountdownEnd.emit();
      }
    }, 1000);
  }

  private stopCountdown() {
    if (this.timer) clearInterval(this.timer);
    this.timer = undefined;
  }

  private plural(kind: 'Minutes' | 'Seconds', n: number): string {
    const category = new Intl.PluralRules(this.locale.lang).select(n);
    const suffix = ({ one: 'One', two: 'Two', few: 'Few', many: 'Many' } as Record<string, string>)[category] ?? 'Other';
    return this.locale.t(`modal${kind}${suffix}` as 'modalMinutesOne', { n });
  }

  /** "1 minute and 35 seconds" / "دقيقة واحدة و35 ثانية". */
  private spoken(left: number): string {
    const m = Math.floor(left / 60);
    const s = left % 60;
    if (m && s) return this.locale.t('modalAnd', { minutes: this.plural('Minutes', m), seconds: this.plural('Seconds', s) });
    return m ? this.plural('Minutes', m) : this.plural('Seconds', s);
  }

  /* Events ------------------------------------------------------------------------------ */
  private onCancel = (ev: Event) => {
    ev.preventDefault();
    this.requestClose('escape');
  };

  /** A click on the dialog element itself is a click on the scrim: the panel fills the box. */
  private onDialogClick = (ev: MouseEvent) => {
    if (ev.target === this.dialog && !this.alert) this.requestClose('scrim');
  };

  /** The sheet follows the finger from its top edge, and closes on a flick or a long drag. */
  private onPointerDown = (ev: PointerEvent) => {
    if (!this.sheet || !this.dialog || ev.button !== 0) return;
    (ev.currentTarget as HTMLElement).setPointerCapture?.(ev.pointerId);
    this.drag = { y: ev.clientY, t: ev.timeStamp, dy: 0, v: 0 };
    this.dialog.classList.add('is-dragging');
  };

  private onPointerMove = (ev: PointerEvent) => {
    if (!this.drag || !this.dialog) return;
    const dy = Math.max(0, ev.clientY - this.drag.y);
    const dt = Math.max(1, ev.timeStamp - this.drag.t);
    this.drag = { y: this.drag.y, t: ev.timeStamp, dy, v: (dy - this.drag.dy) / dt };
    this.dialog.style.transform = `translateY(${dy}px)`;
  };

  private onPointerUp = () => {
    const drag = this.drag;
    const dialog = this.dialog;
    this.drag = undefined;
    if (!drag || !dialog) return;
    dialog.classList.remove('is-dragging');
    if (drag.v > FLICK || drag.dy > dialog.offsetHeight / 3) {
      this.requestClose('drag');
    } else {
      dialog.style.removeProperty('transform');
    }
  };

  private renderCountdown() {
    if (this.remaining === undefined) return null;
    const m = Math.floor(this.remaining / 60);
    const s = String(this.remaining % 60).padStart(2, '0');
    const [before, after = ''] = this.locale.t('modalTimeLeft').split('{time}');
    return (
      <p class="countdown" part="countdown">
        {before}
        <bdi dir="ltr" class="ltr">{`${m}:${s}`}</bdi>
        {after}
      </p>
    );
  }

  render() {
    const level = Number(this.headingLevel) === 3 ? 3 : 2;
    const Heading = `h${level}` as 'h2';
    const headingId = `${this.id}-heading`;

    return (
      <Host class={{ 'is-sheet': this.sheet }}>
        <dialog
          class="dialog"
          part="dialog"
          role={this.alert ? 'alertdialog' : undefined}
          aria-labelledby={headingId}
          aria-modal="true"
          ref={(el) => (this.dialog = el)}
          onCancel={this.onCancel}
          onClick={this.onDialogClick}
        >
          <div class="panel" part="panel">
            <div class="top" onPointerDown={this.onPointerDown} onPointerMove={this.onPointerMove} onPointerUp={this.onPointerUp} onPointerCancel={this.onPointerUp}>
              <span class="grabber" aria-hidden="true"></span>
              <Heading id={headingId} class="heading" part="heading" tabindex="-1" ref={(el) => (this.headingEl = el)}>
                {this.heading}
              </Heading>
              {!this.alert && (
                <button type="button" class="close focus-ring state-layer" part="close" aria-label={this.closeLabel || this.locale.t('modalClose')} onClick={() => this.requestClose('close-button')}>
                  <Close />
                </button>
              )}
            </div>
            <div class="body">
              {this.renderCountdown()}
              <slot />
            </div>
            <div class={{ actions: true, 'actions--empty': !this.hasActions }} part="actions">
              <slot name="actions" onSlotchange={(ev) => (this.hasActions = (ev.target as HTMLSlotElement).assignedElements().length > 0)} />
            </div>
            <span class="visually-hidden" role="status">
              {this.announcement}
            </span>
          </div>
        </dialog>
      </Host>
    );
  }
}
