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
 * this site).
 *
 * A `<nav>` labelled "Government of Dubai channels" with a list of links. Seven tiles in a
 * row from 1024px (by the strip's own width), four from 600px, two below.
 */
@Component({
  tag: 'sc-channel-network',
  styleUrl: 'sc-channel-network.css',
  scoped: true,
})
export class ScChannelNetwork {
  @Element() el!: HTMLElement;

  /** The current channel. Defaults to the closest `data-channel`. */
  @Prop() channel?: Channel;

  /** Each channel's home page (as `sc-channel-switcher` `links`; `{lang}` becomes `en` or `ar`). */
  @Prop() links?: ChannelLinks | string;

  private locale = new LocaleController(this, strings);

  connectedCallback() {
    this.locale.connect();
  }

  disconnectedCallback() {
    this.locale.disconnect();
  }

  render() {
    const { t, lang } = this.locale;
    const current = resolveChannel(this.el, this.channel);
    const links = parseLinks(this.links);
    return (
      <Host>
        <nav class="sc-channel-network" aria-label={t('networkLabel')}>
          <p class="sc-channel-network__eyebrow">{t('networkEyebrow')}</p>
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
