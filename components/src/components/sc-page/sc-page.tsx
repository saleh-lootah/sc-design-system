import { Component, Element, Host, Prop, Watch, h } from '@stencil/core';
import { LocaleController } from '../../i18n/locale';
import { Channel, channels, dirFor } from '../../i18n/strings';

/**
 * The page frame: header, `<main>` and footer, with the page's language, direction and
 * channel on its root.
 *
 * - Set `lang` on `sc-page` as on any element; the page sets `dir` to match (`rtl` for
 *   Arabic) and re-applies it when `lang` changes.
 * - `channel` sets `data-channel`, which themes every component inside.
 * - `<main>` is rendered in light DOM (the component is scoped, not shadowed) with
 *   `id="main-content"` and `tabindex="-1"`, so a skip link (`<a href="#main-content">`)
 *   anywhere on the page can reach it and move focus into it.
 *
 * @slot header - The skip link, then the app bar.
 * @slot - The page content. It's wrapped in `<main>`.
 * @slot footer - `sc-footer`.
 */
@Component({
  tag: 'sc-page',
  styleUrl: 'sc-page.css',
  scoped: true,
})
export class ScPage {
  @Element() el!: HTMLElement;

  /** The channel this page belongs to. Sets `data-channel` on the page root. */
  @Prop({ reflect: true }) channel?: Channel;

  /** The id of `<main>`, the skip link's target. */
  @Prop() mainId = 'main-content';

  /**
   * Also sets `lang`, `dir` and `data-channel` on `<html>`. Use it when `sc-page` is the
   * whole page, so browsers and screen readers get the page language from the document root.
   */
  @Prop() syncDocument = false;

  private locale = new LocaleController(this);

  connectedCallback() {
    this.locale.connect();
  }

  disconnectedCallback() {
    this.locale.disconnect();
  }

  @Watch('channel')
  @Watch('syncDocument')
  onChange() {
    this.sync();
  }

  componentDidRender() {
    this.sync();
  }

  private get validChannel(): Channel | undefined {
    return channels.includes(this.channel as Channel) ? this.channel : undefined;
  }

  /** Copies the page's language, direction and channel to <html> when asked to. */
  private sync() {
    if (!this.syncDocument) return;
    const html = this.el.ownerDocument?.documentElement;
    if (!html) return;
    const lang = this.el.getAttribute('lang');
    if (lang) html.lang = lang;
    html.dir = dirFor(this.locale.lang);
    if (this.validChannel) html.dataset.channel = this.validChannel;
  }

  render() {
    // The language is this element's own `lang` or the closest ancestor's; the direction always follows it.
    const dir = dirFor(this.locale.lang);
    return (
      <Host dir={dir} data-channel={this.validChannel}>
        <slot name="header" />
        <main class="main" id={this.mainId} tabindex="-1">
          <slot />
        </main>
        <slot name="footer" />
      </Host>
    );
  }
}
