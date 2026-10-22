import { Component, Element, Host, Prop, h } from '@stencil/core';
import { LocaleController } from '../../i18n/controller';
import own from '../../i18n/components/sc-channel-network';
import { channelStrings, descKey, nameKey } from '../../i18n/components/channels';
import { Channel, ChannelLinks, channelHref, channels, parseLinks, resolveChannel } from '../../utils/channels';

const strings = channelStrings(own);

/**
 * The channel network strip (component-language B21, Standard CHR-08): "One network · seven
 * channels" and a tile for each of the seven channels, in the Standard 3.1 order, at the end
 * of every channel home page, before the footer.
 *
 * City indigo marks it as shared (the eyebrow and its rule). Each tile carries its own
 * channel's colour only as attribution: a 4px top rule in that channel's `channel-action`.
 * Each tile sets its own `data-channel` (FND-26), which is why the strip renders into light
 * DOM (Stencil `scoped`). The current channel's tile is filled with its `channel-subtle`,
 * says "You are here", carries `aria-current="true"` and is not a link (it would lead to
 * this site). `channel="none"` is for a page that belongs to no channel (the network's own
 * site, the design system's documentation): no tile is current and every tile is a link.
 *
 * A `<nav>` labelled "Government of Dubai channels" with a list of links. Seven tiles in a
 * row from 960px of the strip's own width, four from 560px, two below. The eyebrow is set in
 * sentence case as written (CNT-07).
 *
 * Without JavaScript (PERF-04, B1): the strip renders from its props, so write the same links
 * as light-DOM children in `slot="fallback"` (a `<nav aria-label>` with a `<ul>` of
 * `<a href>`, the current channel as text with `aria-current="true"`). `sc.css` shows them as
 * a row of 44px links until the strip upgrades, and hides them once it has rendered.
 * Before it upgrades the host also reserves the strip's measured height for its width.
 *
 * @slot fallback - Never shown once upgraded: the channel links for pages without JavaScript.
 */
@Component({
  tag: 'sc-channel-network',
  styleUrl: 'sc-channel-network.css',
  scoped: true,
})
export class ScChannelNetwork {
  @Element() el!: HTMLElement;

  /**
   * The current channel. Defaults to the closest `data-channel` (else Dubai Now). `none`: the
   * page belongs to no channel, so no tile says "You are here".
   */
  @Prop() channel?: Channel | 'none';

  /** Each channel's home page (as `sc-channel-switcher` `links`; `{lang}` becomes `en` or `ar`). */
  @Prop() links?: ChannelLinks | string;

  /** Replaces the eyebrow, "One network · seven channels" in the page language. */
  @Prop() eyebrow?: string;

  private locale = new LocaleController(this, strings);

  connectedCallback() {
    this.locale.connect();
  }

  disconnectedCallback() {
    this.locale.disconnect();
  }

  render() {
    const { t, lang } = this.locale;
    const current = this.channel === 'none' ? undefined : resolveChannel(this.el, this.channel);
    const links = parseLinks(this.links);
    return (
      <Host>
        <nav class="sc-channel-network" aria-label={t('networkLabel')}>
          <p class="sc-channel-network__eyebrow">{this.eyebrow ?? t('networkEyebrow')}</p>
          <ul class="sc-channel-network__list">
            {channels.map((channel) => {
              const isCurrent = channel === current;
              const href = isCurrent ? undefined : channelHref(links, channel, lang);
              const body = [
                <span class="sc-channel-network__name">{t(nameKey(channel))}</span>,
                <span class="sc-channel-network__desc">{isCurrent ? t('networkHere') : t(descKey(channel))}</span>,
              ];
              return (
                <li class="sc-channel-network__entry" data-channel={channel} key={channel}>
                  {href ? (
                    <a class="sc-channel-network__tile focus-ring" href={href} hreflang={lang}>
                      {body}
                    </a>
                  ) : (
                    <div class={{ 'sc-channel-network__tile': true, 'is-current': isCurrent }} aria-current={isCurrent ? 'true' : undefined}>
                      {body}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </Host>
    );
  }
}
