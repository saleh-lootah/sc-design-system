import { Component, Element, Event, EventEmitter, Host, Method, Prop, State, h } from '@stencil/core';
import { LocaleController } from '../../i18n/controller';
import strings from '../../i18n/components/sc-account-menu';
import { Bell, ExpandMore, Group, Logout, Person, Settings } from '../../icons/chrome';
import { Disclosure } from '../../utils/disclosure';

/** Initials from a name as written: the first letter of the first and last words. */
function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return '';
  const first = Array.from(words[0])[0] ?? '';
  const last = words.length > 1 ? Array.from(words[words.length - 1])[0] ?? '' : '';
  return (first + last).toLocaleUpperCase();
}

/**
 * The signed-in account control in `sc-site-header` (`slot="account"`; component-language
 * B3, Standard CHR-01). It replaces "Sign in with UAE PASS" once the user is signed in.
 *
 * - A notifications button (a link to the notifications page) with the unread count, named
 *   "Notifications, 3 unread".
 * - A `<button aria-expanded>` with the user's initials (and name from 1280px) that opens a
 *   non-modal panel: the name and who they are acting for, links to Profile, Settings and
 *   representation ("Change who you act for"), and Sign out.
 *
 * The panel is a disclosure, not an ARIA menu: Tab moves through its links, Escape closes it
 * and returns focus to the button, a press outside or focus leaving closes it. From a
 * pointer it grows from the button's corner; from the keyboard it appears instantly.
 *
 * @part trigger - The account button.
 * @part panel - The panel.
 * @part notifications - The notifications button.
 */
@Component({
  tag: 'sc-account-menu',
  styleUrl: 'sc-account-menu.css',
  shadow: true,
})
export class ScAccountMenu {
  @Element() el!: HTMLElement;

  /** The signed-in user's name as written ("Sara Al Mansoori"). */
  @Prop() name = '';

  /** Overrides the initials taken from `name` ("SM"). */
  @Prop() initials?: string;

  /** The person or organisation the user is acting for, when it is not themselves. */
  @Prop() actingFor?: string;

  /** The profile page. */
  @Prop() profileHref?: string;

  /** The account settings page. */
  @Prop() settingsHref?: string;

  /** Where the user changes who they act for (representation). */
  @Prop() representationHref?: string;

  /**
   * The sign-out URL. Without it, Sign out is a button that fires `scSignOut`, so the
   * service can post its own sign-out form.
   */
  @Prop() signOutHref?: string;

  /** The notifications page. Adds the notifications button. */
  @Prop() notificationsHref?: string;

  /** Unread notifications. Shown as a badge on the notifications button when above 0. */
  @Prop() unread = 0;

  /** Fired when Sign out is a button (no `sign-out-href`) and the user activates it. */
  @Event({ eventName: 'scSignOut', bubbles: true, composed: true }) scSignOut!: EventEmitter<void>;

  @State() expanded = false;
  @State() visible = false;

  private locale = new LocaleController(this, strings);
  private trigger?: HTMLButtonElement;
  private panel?: HTMLElement;
  private disclosure = new Disclosure({
    host: () => this.el,
    trigger: () => this.trigger,
    panel: () => this.panel,
    render: (expanded, visible) => {
      this.expanded = expanded;
      this.visible = visible;
    },
  });

  connectedCallback() {
    this.locale.connect();
    this.disclosure.connect();
  }

  disconnectedCallback() {
    this.locale.disconnect();
    this.disclosure.disconnect();
  }

  /** Opens the panel (as from the keyboard: no animation). */
  @Method()
  async open() {
    this.disclosure.open(false);
  }

  /** Closes the panel. */
  @Method()
  async close() {
    this.disclosure.close(false);
  }

  private onSignOut = () => {
    this.disclosure.close(false);
    this.scSignOut.emit();
  };

  private renderNotifications() {
    if (!this.notificationsHref) return null;
    const { t } = this.locale;
    const count = Math.max(0, Math.floor(Number(this.unread) || 0));
    const shown = count > 99 ? '99+' : String(count);
    return (
      <a class="notifications focus-ring state-layer" part="notifications" href={this.notificationsHref}>
        <Bell />
        {count > 0 && (
          <span class="badge" aria-hidden="true">
            {shown}
          </span>
        )}
        <span class="visually-hidden">
          {count > 0 ? t('accountUnread', { count }) : t('accountNotifications')}
        </span>
      </a>
    );
  }

  render() {
    const { t } = this.locale;
    const initials = (this.initials || initialsOf(this.name)).slice(0, 3);
    const links: [string | undefined, string, unknown][] = [
      [this.profileHref, t('accountProfile'), <Person />],
      [this.settingsHref, t('accountSettings'), <Settings />],
      [this.representationHref, t('accountRepresentation'), <Group />],
    ];
    return (
      <Host>
        <div class="account">
          {this.renderNotifications()}
          <div class="menu">
            <button
              type="button"
              class="trigger focus-ring state-layer"
              part="trigger"
              aria-expanded={this.expanded ? 'true' : 'false'}
              aria-controls="panel"
              ref={(el) => (this.trigger = el)}
              onClick={this.disclosure.toggle}
            >
              <span class="avatar" aria-hidden="true">
                {initials}
              </span>
              <span class="name">
                <span class="visually-hidden">{t('accountLabel')} </span>
                {this.name}
              </span>
              <ExpandMore class="chevron" />
            </button>
            <div class="panel" id="panel" part="panel" hidden={!this.visible} ref={(el) => (this.panel = el)}>
              <div class="who">
                <p class="who-name">{this.name}</p>
                {this.actingFor && <p class="who-acting">{t('accountActingFor', { name: this.actingFor })}</p>}
              </div>
              <ul class="list">
                {links
                  .filter(([href]) => !!href)
                  .map(([href, label, icon]) => (
                    <li>
                      <a class="item focus-ring state-layer" href={href}>
                        {icon}
                        <span>{label}</span>
                      </a>
                    </li>
                  ))}
              </ul>
              <div class="divider" />
              {this.signOutHref ? (
                <a class="item sign-out focus-ring state-layer" href={this.signOutHref}>
                  <Logout />
                  <span>{t('accountSignOut')}</span>
                </a>
              ) : (
                <button type="button" class="item sign-out focus-ring state-layer" onClick={this.onSignOut}>
                  <Logout />
                  <span>{t('accountSignOut')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
