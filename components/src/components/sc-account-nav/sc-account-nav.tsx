import { Component, Element, Host, Prop, h } from '@stencil/core';
import { LocaleController } from '../../i18n/controller';
import strings from '../../i18n/components/sc-account-nav';
import { NavIcon } from '../../icons/destinations'; // a file import: Stencil only scans file imports for <svg>
import { NavItem, readNavItems, watchNavItems } from '../../utils/nav-items';

/**
 * The side navigation of the signed-in account area: Applications, Payments,
 * Notifications, Profile and settings, then a divider and Sign out. It takes 3 of 12
 * columns on wide screens and becomes a horizontal row of 44px items below 600px.
 *
 * Write the items as plain links (they are what shows before upgrade and without
 * JavaScript):
 *
 *   <sc-account-nav>
 *     <a href="/en/account/applications" data-icon="description">Applications</a>
 *     <a href="/en/account/payments" data-icon="credit-card" aria-current="page">Payments</a>
 *     <a href="/en/account/notifications" data-icon="notifications" data-count="3" data-count-label="3 unread">Notifications</a>
 *     <a href="/en/account/profile" data-icon="person">Profile and settings</a>
 *     <a href="/en/sign-out" data-icon="logout" data-sign-out>Sign out</a>
 *   </sc-account-nav>
 *
 * - `aria-current="page"` marks the current item: a channel-subtle fill, a 3px channel bar
 *   at inline-start, a channel icon and a Bold label (never colour alone).
 * - `data-icon`: `description`, `credit-card`, `notifications`, `person`, `history`,
 *   `home`, `apps` or `logout` (24px; `logout` mirrors in right-to-left).
 * - `data-count`: a count badge, read with the visually hidden `data-count-label`
 *   (default "{count} new" / "{count} جديدة").
 * - `data-sign-out`: puts the item after the divider.
 *
 * @part nav - The `<nav>` landmark.
 * @part item - Each link.
 * @part badge - A count badge.
 */
@Component({
  tag: 'sc-account-nav',
  styleUrl: 'sc-account-nav.css',
  shadow: true,
})
export class ScAccountNav {
  @Element() el!: HTMLElement;

  /** Overrides the landmark name ("Account" / "الحساب"). */
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

  private item = (item: NavItem) => (
    <li>
      <a
        class={{ 'item': true, 'state-layer': true, 'focus-ring': true, 'item--current': item.current }}
        part="item"
        href={item.href ?? undefined}
        aria-current={item.current ? 'page' : undefined}
        lang={item.lang ?? undefined}
      >
        <NavIcon name={item.icon} />
        <span class="label">{item.text}</span>
        {item.count !== null && [
          <span class="badge" part="badge" aria-hidden="true">
            {item.count}
          </span>,
          <span class="visually-hidden"> {(item.countLabel || this.locale.t('accountNavCount')).replace('{count}', String(item.count))}</span>,
        ]}
      </a>
    </li>
  );

  render() {
    const items = readNavItems(this.el).filter((i) => i.href !== null);
    const main = items.filter((i) => !i.signOut);
    const out = items.filter((i) => i.signOut);
    return (
      <Host>
        <nav part="nav" aria-label={this.label || this.locale.t('accountNavLabel')}>
          <ul class="list">{main.map(this.item)}</ul>
          {out.length > 0 && <ul class="list list--out">{out.map(this.item)}</ul>}
        </nav>
      </Host>
    );
  }
}
