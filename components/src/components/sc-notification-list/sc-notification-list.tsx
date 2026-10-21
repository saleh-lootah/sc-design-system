import { Component, Element, Host, Method, h } from '@stencil/core';
import { LocaleController } from '../../i18n/controller';
import strings from '../../i18n/components/sc-notification-list';

const UNREAD_CLASS = 'sc-notification-list__unread';

/**
 * A person's notifications, grouped by day ("Today", "Earlier"). Light DOM (architecture
 * §3.1): you write the headings and native lists, so each group is a real list under a real
 * heading and the links are ordinary links.
 *
 * ```html
 * <sc-notification-list>
 *   <h2>Today</h2>
 *   <ul>
 *     <li data-unread>
 *       <a href="/applications/A-2026-0412">
 *         <strong>Parking permit approved</strong>
 *         <span>Your permit for Al Barsha is ready to download.</span>
 *       </a>
 *       <time datetime="2026-10-21T09:40">09:40</time>
 *     </li>
 *   </ul>
 *   <h2>Earlier</h2>
 *   <ul>…</ul>
 * </sc-notification-list>

 * ```
 *
 * Each item is a link (its title and body), with the time beside it. An unread item
 * (`data-unread`) has a `channel-subtle` fill, a dot in the channel colour, a Bold title and
 * a visually hidden "Unread:" before the link text, so unread is never colour alone; a read
 * item has no fill or dot and a Medium title. Each group is a card with 1px rules between
 * rows. Under 600px wide the time wraps under the body.
 *
 * @slot - Day headings (`h2`/`h3`) each followed by a `<ul>` of items.
 */
@Component({
  tag: 'sc-notification-list',
  styleUrl: 'sc-notification-list.css',
  scoped: true,
})
export class ScNotificationList {
  @Element() el!: HTMLElement;

  private locale = new LocaleController(this, strings);
  private observer?: MutationObserver;

  connectedCallback() {
    this.locale.connect();
    if (typeof MutationObserver !== 'undefined') {
      this.observer = new MutationObserver(() => this.mark());
      this.observer.observe(this.el, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-unread'] });
    }
  }

  componentDidRender() {
    this.mark();
  }

  disconnectedCallback() {
    this.locale.disconnect();
    this.observer?.disconnect();
  }

  /**
   * Marks every item as read. The fills fade over 200ms when a pointer started it; from the
   * keyboard the change is instant (MOT-02). Returns the number of items changed.
   */
  @Method()
  async markAllRead(): Promise<number> {
    const unread = Array.from(this.el.querySelectorAll('li[data-unread]'));
    const active = this.el.ownerDocument.activeElement;
    const fromKeyboard = !!active && typeof active.matches === 'function' && active.matches(':focus-visible');
    this.el.classList.toggle('is-instant', fromKeyboard);
    unread.forEach((item) => item.removeAttribute('data-unread'));
    this.mark();
    return unread.length;
  }

  /** Adds or removes the hidden "Unread:" inside each item's link. */
  private mark() {
    const word = this.locale.t('notificationListUnread');
    for (const item of Array.from(this.el.querySelectorAll('li'))) {
      const link = Array.from(item.children).find((child) => child.localName === 'a');
      if (!link) continue;
      const existing = Array.from(link.children).find((child) => child.classList.contains(UNREAD_CLASS));
      const unread = item.hasAttribute('data-unread');
      if (unread && !existing) {
        const span = this.el.ownerDocument.createElement('span');
        span.className = `${UNREAD_CLASS} visually-hidden`;
        span.textContent = `${word} `;
        link.prepend(span);
      } else if (unread && existing && existing.textContent !== `${word} `) {
        existing.textContent = `${word} `;
      } else if (!unread && existing) {
        existing.remove();
      }
    }
  }

  render() {
    return (
      <Host>
        <slot />
      </Host>
    );
  }
}
