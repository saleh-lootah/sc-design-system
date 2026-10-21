import { Component, Element, Event, EventEmitter, Host, Method, Prop, State, h } from '@stencil/core';
import { LocaleController } from '../../i18n/controller';
import strings from '../../i18n/components/sc-announcement-bar';
import { CloseIcon, ErrorIcon, InfoIcon, WarningIcon } from '../../icons/chrome';
import { nextFocusable } from '../../utils/focus';
import { exit, fromPointer } from '../../utils/motion';

export type AnnouncementTone = 'info' | 'warning' | 'error';

const KEY = 'sc-announcement-dismissed:';

function storage(): Storage | undefined {
  try {
    return typeof localStorage === 'undefined' ? undefined : localStorage;
  } catch {
    return undefined;
  }
}

/**
 * A site-wide announcement above the header: planned maintenance, a service outage, a change
 * people need to know about (component-language B1). One message, one optional link, and an
 * optional dismiss button.
 *
 * A labelled region ("Announcement" / "إعلان"), present when the page loads. It is not a
 * live region and not an alert. The text carries the severity in words ("Planned
 * maintenance…"); the tone's icon and container repeat it.
 *
 * Dismissing it fires `scDismiss` (cancelable) and hides it. With `announcement-id`, the
 * dismissal is remembered in this browser, so the same announcement does not come back.
 * Focus moves to the next focusable element after it. From a pointer it fades out over
 * `duration-exit`; from the keyboard it goes at once. Its height is never animated (MOT-11).
 *
 * @slot - The message. Text, in the page language.
 *
 * @part bar - The region.
 * @part link - The link.
 * @part dismiss - The dismiss button.
 */
@Component({
  tag: 'sc-announcement-bar',
  styleUrl: 'sc-announcement-bar.css',
  shadow: true,
})
export class ScAnnouncementBar {
  @Element() el!: HTMLElement;

  /** `warning` (maintenance; default), `info`, or `error` (a service is down). */
  @Prop({ reflect: true }) tone: AnnouncementTone = 'warning';

  /** A link with more detail ("See affected services"). Shown with `link-text`. */
  @Prop() linkHref?: string;

  /** The link's text. */
  @Prop() linkText?: string;

  /** Shows the dismiss button. */
  @Prop({ reflect: true }) dismissible = false;

  /**
   * Remembers a dismissal in this browser (localStorage) under this id, so the announcement
   * stays hidden on later pages. Change the id when the message changes.
   */
  @Prop() announcementId?: string;

  /** Overrides the dismiss button's name, "Dismiss announcement" (in the page language). */
  @Prop() dismissLabel?: string;

  /** Fired before the bar hides. Call `preventDefault()` to keep it. */
  @Event({ eventName: 'scDismiss', bubbles: true, composed: true, cancelable: true }) scDismiss!: EventEmitter<{ id?: string }>;

  @State() dismissed = false;

  private locale = new LocaleController(this, strings);
  private bar?: HTMLElement;

  connectedCallback() {
    this.locale.connect();
    if (this.announcementId && storage()?.getItem(KEY + this.announcementId)) this.dismissed = true;
  }

  disconnectedCallback() {
    this.locale.disconnect();
  }

  /** Dismisses the announcement, as the dismiss button does from the keyboard. */
  @Method()
  async dismiss() {
    this.doDismiss(false);
  }

  private onDismiss = (ev: MouseEvent) => this.doDismiss(fromPointer(ev));

  private doDismiss(pointer: boolean) {
    const event = this.scDismiss.emit({ id: this.announcementId });
    if (event.defaultPrevented) return;
    if (this.announcementId) {
      try {
        storage()?.setItem(KEY + this.announcementId, '1');
      } catch {
        /* storage full or blocked: hide for this page only */
      }
    }
    // Choose the next stop before the bar leaves the layout.
    const next = nextFocusable(this.el);
    exit(this.bar, pointer, () => {
      this.dismissed = true;
      next?.focus();
    });
  }

  render() {
    const { t } = this.locale;
    const tone: AnnouncementTone = this.tone === 'info' || this.tone === 'error' ? this.tone : 'warning';
    const Icon = tone === 'info' ? InfoIcon : tone === 'error' ? ErrorIcon : WarningIcon;
    return (
      <Host hidden={this.dismissed}>
        <section class={{ bar: true, [`bar--${tone}`]: true }} part="bar" aria-label={t('announcementLabel')} ref={(el) => (this.bar = el)}>
          <div class="inner">
            <Icon class="tone-icon" />
            <div class="body">
              <p class="message">
                <slot />
              </p>
              {this.linkHref && this.linkText && (
                <a class="link focus-ring" part="link" href={this.linkHref}>
                  {this.linkText}
                </a>
              )}
            </div>
            {this.dismissible && (
              <button type="button" class="dismiss focus-ring state-layer" part="dismiss" onClick={this.onDismiss}>
                <CloseIcon />
                <span class="visually-hidden">{this.dismissLabel || t('announcementDismiss')}</span>
              </button>
            )}
          </div>
        </section>
      </Host>
    );
  }
}
