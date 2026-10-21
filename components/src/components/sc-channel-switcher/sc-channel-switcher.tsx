import { Component, Element, Host, Method, Prop, State, h } from '@stencil/core';
import { LocaleController } from '../../i18n/controller';
import own from '../../i18n/components/sc-channel-switcher';
import { channelStrings, descKey, nameKey } from '../../i18n/components/channels';
import { Check, ExpandMore } from '../../icons/for/sc-channel-switcher';
import { Disclosure } from '../../utils/disclosure';
import { Channel, ChannelLinks, channelHref, channels, parseLinks, resolveChannel } from '../../utils/channels';

const strings = channelStrings(own);

let instances = 0;

/**
 * The channel's logo and the channel switcher, at the inline-end of `sc-site-header`
 * (Standard CHR-01, CHR-03; component-language B2a).
 *
 * A disclosure, not an ARIA menu: a `<button aria-expanded>` named "Choose a channel: Dubai
 * Now" opens a non-modal panel listing all seven channels as links, in the Standard 3.1
 * order, each with its name, a one-line descriptor in the page language and a swatch in
 * that channel's own colour. Every item carries its own `data-channel` (FND-26), so the
 * swatch is that channel's `channel-action`; that is why the component renders into light
 * DOM (Stencil `scoped`): the document's channel rules must reach the items. The current
 * channel carries a check and `aria-current="true"`.
 *
 * Escape and a press outside close the panel; Escape returns focus to the button; the panel
 * closes when focus leaves it. From a pointer it grows from the trigger's corner over
 * `duration-base`; from the keyboard it appears instantly (MOT-02). Below 1024px the trigger
 * shrinks to the logo and chevron and keeps its accessible name (CHR-04).
 *
 * @slot - Optional: the channel's own logo (an `<svg>` or `<img alt="">`, 24px). Without it
 *   the trigger shows the current channel's swatch (10px, in its channel colour).
 */
@Component({
  tag: 'sc-channel-switcher',
  styleUrl: 'sc-channel-switcher.css',
  scoped: true,
})
export class ScChannelSwitcher {
  @Element() el!: HTMLElement;

  /** The current channel. Defaults to the closest `data-channel` (as set by `sc-page`). */
  @Prop({ reflect: true }) channel?: Channel;

  /**
   * Each channel's home page, as an object or a JSON attribute:
   * `links='{"now":"https://…/{lang}/","transport":"https://…/{lang}/"}'`. `{lang}` becomes
   * `en` or `ar`, so each link leads to that channel's home in the current language. Give all
   * seven; a channel without a link is listed as text.
   */
  @Prop() links?: ChannelLinks | string;

  @State() expanded = false;
  @State() visible = false;
  @State() hasLogo = false;

  private locale = new LocaleController(this, strings);
  private ids = `sc-channel-switcher-${++instances}`;
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
    this.hasLogo = Array.from(this.el.children).some((c) => !c.classList.contains('sc-channel-switcher'));
    this.el.focus = (options?: FocusOptions) => this.trigger?.focus(options);
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

  render() {
    const { t, lang } = this.locale;
    const current = resolveChannel(this.el, this.channel);
    const links = parseLinks(this.links);
    const panelId = `${this.ids}-panel`;
    const captionId = `${this.ids}-caption`;

    return (
      <Host>
        <div class="sc-channel-switcher">
          <button
            type="button"
            class="sc-channel-switcher__trigger focus-ring state-layer"
            aria-expanded={this.expanded ? 'true' : 'false'}
            aria-controls={panelId}
            ref={(el) => (this.trigger = el)}
            onClick={this.disclosure.toggle}
          >
            <span class={{ 'sc-channel-switcher__logo': true, 'is-mark': !this.hasLogo }} aria-hidden="true">
              <slot />
            </span>
            <span class="sc-channel-switcher__name">
              <span class="visually-hidden">{t('switcherPrefix')} </span>
              {t(nameKey(current))}
            </span>
            <ExpandMore class="sc-channel-switcher__chevron" />
          </button>
          <div class="sc-channel-switcher__panel" id={panelId} hidden={!this.visible} ref={(el) => (this.panel = el)}>
            <p class="sc-channel-switcher__caption" id={captionId}>
              {t('switcherCaption')}
            </p>
            <ul class="sc-channel-switcher__list" aria-labelledby={captionId}>
              {channels.map((channel) => {
                const href = channelHref(links, channel, lang);
                const isCurrent = channel === current;
                const content = [
                  <span class="sc-channel-switcher__swatch" aria-hidden="true" />,
                  <span class="sc-channel-switcher__text">
                    <span class="sc-channel-switcher__item-name">{t(nameKey(channel))}</span>
                    <span class="sc-channel-switcher__desc">{t(descKey(channel))}</span>
                  </span>,
                  isCurrent && <Check class="sc-channel-switcher__check" />,
                ];
                return (
                  <li class="sc-channel-switcher__entry" data-channel={channel} key={channel}>
                    {href ? (
                      <a class={{ 'sc-channel-switcher__item': true, 'focus-ring': true, 'state-layer': true, 'is-current': isCurrent }} href={href} hreflang={lang} aria-current={isCurrent ? 'true' : undefined}>
                        {content}
                      </a>
                    ) : (
                      <span class={{ 'sc-channel-switcher__item': true, 'is-current': isCurrent }} aria-current={isCurrent ? 'true' : undefined}>
                        {content}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Host>
    );
  }
}
