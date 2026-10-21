import { Component, Element, Host, Prop, h } from '@stencil/core';
import { LocaleController } from '../../i18n/controller';
import strings from '../../i18n/components/sc-bottom-nav';
import { NavIcon } from '../../icons/destinations'; // a file import: Stencil only scans file imports for <svg>
import { readNavItems, watchNavItems } from '../../utils/nav-items';

/**
 * The primary navigation of signed-in channel pages on phones and tablets: a flat bar
 * docked to the bottom edge with three to five destinations, each an icon above a label.
 * It shows below 1024px only (from 1024px the header navigation takes over), and `sc.css`
 * reserves its height at the end of the page, so it never covers content or the focused
 * element. When it is present, the utility bar folds into the footer.
 *
 * Write the destinations as plain links:
 *
 *   <sc-bottom-nav>
 *     <a href="/en" data-icon="home" aria-current="page">Home</a>
 *     <a href="/en/services" data-icon="apps">Services</a>
 *     <a href="/en/account/activity" data-icon="history">Activity</a>
 *   </sc-bottom-nav>
 *
 * The current destination (`aria-current="page"`) gets a 56 × 32 channel-container
 * indicator behind its icon and a Bold label in the channel action colour. Items share the
 * width equally, each at least 48px wide and 64px tall.
 *
 * @part nav - The `<nav>` landmark (the bar).
 * @part item - Each link.
 * @part indicator - The pill behind each icon.
 */
@Component({
  tag: 'sc-bottom-nav',
  styleUrl: 'sc-bottom-nav.css',
  shadow: true,
})
export class ScBottomNav {
  @Element() el!: HTMLElement;

  /** Overrides the landmark name ("Main" / "رئيسية"). */
  @Prop() label?: string;

  private locale = new LocaleController(this, strings);
  private observer?: MutationObserver;

  connectedCallback() {
    this.locale.connect();
    this.observer = watchNavItems(this.el, this);
  }

  disconnectedCallback() {
    this.locale.disconnect();
    this.observer?.disconnect();
  }

  render() {
    const items = readNavItems(this.el).filter((i) => i.href !== null);
    return (
      <Host>
        <nav class="bar" part="nav" aria-label={this.label || this.locale.t('bottomNavLabel')}>
          <ul class="list">
            {items.map((item) => (
              <li class="cell">
                <a
                  class={{ 'item': true, 'focus-ring': true, 'item--current': item.current }}
                  part="item"
                  href={item.href!}
                  aria-current={item.current ? 'page' : undefined}
                  lang={item.lang ?? undefined}
                >
                  <span class="indicator" part="indicator">
                    <NavIcon name={item.icon} />
                  </span>
                  <span class="label">{item.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Host>
    );
  }
}
