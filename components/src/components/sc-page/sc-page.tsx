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
 * - With `sync-document` and a sticky `sc-app-bar` in the header, it sets
 *   `scroll-padding-block-start` on `<html>` to the bar's height plus `--sc-space-8`, so
 *   focused elements and `#fragment` targets scroll into view below the bar, not under it
 *   (WCAG 2.4.11). It follows the bar's size and removes the padding when no longer needed.
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
   * With a sticky `sc-app-bar` in the header, it also sets `scroll-padding-block-start` on
   * `<html>` so focus is never hidden under the bar.
   */
  @Prop() syncDocument = false;

  private locale = new LocaleController(this);

  /** Watches the header for a sticky app bar appearing, disappearing or changing. */
  private headerObserver?: MutationObserver;
  /** Follows the sticky bar's size (it grows with 200% text or when its content wraps). */
  private barObserver?: ResizeObserver;
  /** The sticky app bar currently measured. */
  private bar?: Element;
  /** The inline `scroll-padding-block-start` on <html> before this page set it, to restore. */
  private savedScrollPadding?: { value: string; priority: string };

  connectedCallback() {
    this.locale.connect();
    this.syncScrollPadding();
  }

  disconnectedCallback() {
    this.locale.disconnect();
    this.stopScrollPadding();
  }

  @Watch('channel')
  @Watch('syncDocument')
  onChange() {
    this.sync();
  }

  @Watch('syncDocument')
  onSyncDocumentChange() {
    this.syncScrollPadding();
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

  /** The sticky `sc-app-bar` in this page's header slot: a header child itself, or inside one. */
  private findStickyBar(): Element | undefined {
    const headers = Array.from(this.el.querySelectorAll('[slot="header"]')).filter((node) => node.closest('sc-page') === this.el);
    for (const header of headers) {
      const bar = header.matches('sc-app-bar[sticky]') ? header : header.querySelector('sc-app-bar[sticky]');
      if (bar) return bar;
    }
    return undefined;
  }

  /**
   * Starts or stops keeping `scroll-padding-block-start` on <html> clear of a sticky app bar.
   * Only with `sync-document`: without it, `sc-page` does not own <html>.
   */
  private syncScrollPadding() {
    if (!this.syncDocument || typeof MutationObserver === 'undefined' || typeof ResizeObserver === 'undefined') {
      this.stopScrollPadding();
      return;
    }
    if (!this.headerObserver) {
      // Scoped slots don't fire slotchange, so watch the light DOM directly.
      this.headerObserver = new MutationObserver(() => this.trackBar());
      this.headerObserver.observe(this.el, { childList: true, subtree: true, attributes: true, attributeFilter: ['sticky', 'slot', 'hidden'] });
    }
    this.trackBar();
  }

  /** Points the ResizeObserver at the current sticky bar, or clears the padding when there is none. */
  private trackBar() {
    const bar = this.findStickyBar();
    if (bar === this.bar) return;
    this.barObserver?.disconnect();
    this.bar = bar;
    if (!bar) {
      this.clearScrollPadding();
      return;
    }
    this.barObserver ??= new ResizeObserver((entries) => {
      const entry = entries[entries.length - 1];
      if (!entry || entry.target !== this.bar) return;
      const box = entry.borderBoxSize?.[0];
      this.applyScrollPadding(box ? box.blockSize : entry.target.getBoundingClientRect().height);
    });
    this.barObserver.observe(bar);
    this.applyScrollPadding(bar.getBoundingClientRect().height);
  }

  private applyScrollPadding(blockSize: number) {
    const html = this.el.ownerDocument?.documentElement;
    if (!html) return;
    if (!(blockSize > 0)) {
      this.clearScrollPadding();
      return;
    }
    this.savedScrollPadding ??= {
      value: html.style.getPropertyValue('scroll-padding-block-start'),
      priority: html.style.getPropertyPriority('scroll-padding-block-start'),
    };
    html.style.setProperty('scroll-padding-block-start', `calc(${Math.ceil(blockSize)}px + var(--sc-space-8))`);
  }

  /** Puts back whatever inline scroll padding <html> had before this page set it. */
  private clearScrollPadding() {
    const saved = this.savedScrollPadding;
    const html = this.el.ownerDocument?.documentElement;
    if (!saved || !html) return;
    this.savedScrollPadding = undefined;
    if (saved.value) html.style.setProperty('scroll-padding-block-start', saved.value, saved.priority);
    else html.style.removeProperty('scroll-padding-block-start');
    if (!html.getAttribute('style')) html.removeAttribute('style');
  }

  private stopScrollPadding() {
    this.headerObserver?.disconnect();
    this.headerObserver = undefined;
    this.barObserver?.disconnect();
    this.barObserver = undefined;
    this.bar = undefined;
    this.clearScrollPadding();
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
