import { Component, Element, Host, Prop, State, h } from '@stencil/core';
import { LocaleController } from '../../i18n/controller';
import own from '../../i18n/components/sc-footer';
import { channelStrings, nameKey } from '../../i18n/components/channels';
import { Channel, ChannelLinks, channelHref, channels, parseLinks, resolveChannel } from '../../utils/channels';

const strings = channelStrings(own);

export type FooterVariant = 'simple' | 'grouped';

type Link = [href: string | undefined, label: string];

/**
 * The page footer, a `<footer>` (the page's `contentinfo` landmark). Two variants:
 *
 * - `simple` (default; transaction pages, component-language A29): one row of underlined
 *   links and "Government of Dubai", under a 1px rule.
 * - `grouped` (channel sites, Standard CHR-06, decision Q-footer; B5): the channel's brand
 *   group (`slot="brand"`: a one-sentence description and app badges); a **Channels** group
 *   listing all seven channels in the Standard 3.1 order, the current one Bold with
 *   `aria-current="true"` and no swatch; **Helpful information** (about, help and contact,
 *   accessibility statement, sitemap); and **Legal** (privacy and cookies, terms). Each group
 *   has an `<h2>`. Then "Government of Dubai · Last updated …" and "… is run by the
 *   Government of Dubai".
 *
 * The standard links appear when their `*-href` is set, with text from strings in the page
 * language. Every channel sets all of them (TPL-01, LEG-01). Extra links go in the default
 * slot as plain `<a href>` elements; each gets its own list item (the footer sets their
 * `slot` attribute). The footer is on `surface`, never a dark band.
 *
 * @slot - Extra links, as `<a href>` elements, listed after the standard ones (in Helpful information when grouped).
 * @slot brand - Grouped: the channel's description and app badges, under its name.
 * @slot meta - Replaces "Government of Dubai" at the end of the simple footer.
 *
 * @part footer - The `<footer>`.
 * @part list - Each `<ul>` of links.
 * @part link - Each standard link.
 * @part meta - The end text.
 */
@Component({
  tag: 'sc-footer',
  styleUrl: 'sc-footer.css',
  shadow: true,
})
export class ScFooter {
  @Element() el!: HTMLElement;

  /** `simple` (one row) or `grouped` (channel sites, with the Channels group). */
  @Prop({ reflect: true }) variant: FooterVariant = 'simple';

  /** The current channel. Defaults to the closest `data-channel`. */
  @Prop() channel?: Channel;

  /** Each channel's home page, for the Channels group (as `sc-channel-switcher` `links`; `{lang}` becomes `en` or `ar`). */
  @Prop() links?: ChannelLinks | string;

  /** About the channel ("About Dubai Now"). */
  @Prop() aboutHref?: string;

  /** The help and contact page. */
  @Prop() helpHref?: string;

  /** The accessibility statement. */
  @Prop() accessibilityHref?: string;

  /** The privacy notice. Labelled "Privacy and cookies" unless `cookies-href` is set too. */
  @Prop() privacyHref?: string;

  /** A separate cookies page. Splits "Privacy and cookies" into "Privacy" and "Cookies". */
  @Prop() cookiesHref?: string;

  /** The terms of use. */
  @Prop() termsHref?: string;

  /** The sitemap. */
  @Prop() sitemapHref?: string;

  /** Grouped: when the site was last updated, as it should read ("12 October 2026"). */
  @Prop() updated?: string;

  /** Bumped when slotted links change. */
  @State() revision = 0;

  private locale = new LocaleController(this, strings);
  private observer?: MutationObserver;

  connectedCallback() {
    this.locale.connect();
    if (typeof MutationObserver !== 'undefined') {
      this.observer = new MutationObserver(() => this.revision++);
      this.observer.observe(this.el, { childList: true });
    }
  }

  disconnectedCallback() {
    this.locale.disconnect();
    this.observer?.disconnect();
  }

  private extraLinks(): Element[] {
    return Array.from(this.el.children).filter((c) => c.localName === 'a' || (c.getAttribute('slot') ?? '').startsWith('link-'));
  }

  componentWillRender() {
    this.extraLinks().forEach((link, i) => {
      const name = `link-${i}`;
      if (link.getAttribute('slot') !== name) link.setAttribute('slot', name);
    });
  }

  private renderLinks(links: Link[], extra = false) {
    return [
      ...links
        .filter(([href]) => !!href)
        .map(([href, label]) => (
          <li>
            <a class="link focus-ring" part="link" href={href}>
              {label}
            </a>
          </li>
        )),
      ...(extra
        ? this.extraLinks().map((_, i) => (
            <li>
              <slot name={`link-${i}`} />
            </li>
          ))
        : []),
    ];
  }

  private renderSimple(about: Link, helpful: Link[], legal: Link[]) {
    const { t } = this.locale;
    return (
      <div class="inner simple">
        <h2 class="visually-hidden" id="heading">
          {t('footerLinksHeading')}
        </h2>
        <ul class="row" part="list" aria-labelledby="heading">
          {this.renderLinks([helpful[0], helpful[1], ...legal, about, helpful[2]], true)}
        </ul>
        <p class="meta" part="meta">
          <slot name="meta">{t('footerGovernment')}</slot>
        </p>
      </div>
    );
  }

  private renderGrouped(current: Channel, about: Link, helpful: Link[], legal: Link[]) {
    const { t, lang } = this.locale;
    const links = parseLinks(this.links);
    const name = t(nameKey(current));
    return (
      <div class="inner grouped">
        <div class="groups">
          <div class="brand">
            <p class="brand-name">
              <span class="mark" aria-hidden="true" />
              {name}
            </p>
            <div class="brand-body">
              <slot name="brand" />
            </div>
          </div>
          <section class="group channels" aria-labelledby="g-channels">
            <h2 class="group-title" id="g-channels">
              {t('footerChannels')}
            </h2>
            <ul class="list two" part="list">
              {channels.map((channel) => {
                const href = channelHref(links, channel, lang);
                const isCurrent = channel === current;
                const label = t(nameKey(channel));
                return (
                  <li>
                    {href ? (
                      <a class={{ 'link': true, 'focus-ring': true, 'is-current': isCurrent }} part="link" href={href} hreflang={lang} aria-current={isCurrent ? 'true' : undefined}>
                        {label}
                      </a>
                    ) : (
                      <span class={{ 'text': true, 'is-current': isCurrent }} aria-current={isCurrent ? 'true' : undefined}>
                        {label}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
          <section class="group" aria-labelledby="g-helpful">
            <h2 class="group-title" id="g-helpful">
              {t('footerHelpful')}
            </h2>
            <ul class="list" part="list">
              {this.renderLinks([about, ...helpful], true)}
            </ul>
          </section>
          <section class="group" aria-labelledby="g-legal">
            <h2 class="group-title" id="g-legal">
              {t('footerLegal')}
            </h2>
            <ul class="list" part="list">
              {this.renderLinks(legal)}
            </ul>
          </section>
        </div>
        <div class="lower">
          <p class="meta" part="meta">
            {t('footerGovernment')}
            {this.updated && [' · ', t('footerUpdated', { date: this.updated })]}
          </p>
          <p class="meta">{t('footerRunBy', { channel: name })}</p>
        </div>
      </div>
    );
  }

  render() {
    const { t } = this.locale;
    const current = resolveChannel(this.el, this.channel);
    const about: Link = [this.aboutHref, t('footerAbout', { channel: t(nameKey(current)) })];
    const helpful: Link[] = [
      [this.helpHref, t('footerHelp')],
      [this.accessibilityHref, t('footerAccessibility')],
      [this.sitemapHref, t('footerSitemap')],
    ];
    const legal: Link[] = [
      [this.privacyHref, t(this.cookiesHref ? 'footerPrivacy' : 'footerPrivacyCookies')],
      [this.cookiesHref, t('footerCookies')],
      [this.termsHref, t('footerTerms')],
    ];
    return (
      <Host>
        <footer class="footer" part="footer">
          {this.variant === 'grouped' ? this.renderGrouped(current, about, helpful, legal) : this.renderSimple(about, helpful, legal)}
        </footer>
      </Host>
    );
  }
}
