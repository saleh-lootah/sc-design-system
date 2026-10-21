import { Component, Element, Host, Prop, Watch, h } from '@stencil/core';
import { resolveLang } from '../../i18n/controller';
import { dirFor } from '../../i18n/core';
import { Channel, isChannel } from '../../utils/channels';

/** The sticky headers whose height `scroll-padding-block-start` keeps clear. */
const STICKY = 'sc-app-bar[sticky], sc-site-header[sticky]';

/**
 * The page shell (Standard TPL-01, 11.1 and 11.9): the header, one `<main>` and the footer,
 * with the page's language, direction and channel on its root.
 *
 * - Set `lang` on `sc-page` as on any element; the page sets `dir` to match (`rtl` for
 *   Arabic) and re-applies it when `lang` changes.
 * - `channel` sets `data-channel`, which themes every component inside.
 * - `<main>` is rendered in light DOM (the component is scoped, not shadowed) with
 *   `id="main-content"` and `tabindex="-1"`, so the skip link (`sc-skip-link`, whose default
 *   `href` is `#main-content`) can reach it and move focus into it. The header slot gives
 *   the banner landmark, the footer slot the contentinfo landmark.
 * - With `sync-document` it also sets `lang`, `dir` and `data-channel` on `<html>`, and,
 *   with a sticky `sc-app-bar` or `sc-site-header` in the header, `scroll-padding-block-start`
 *   on `<html>` to the bar's height plus `--sc-space-8`, so focused elements are never
 *   hidden under it (WCAG 2.4.11).
 * - It reserves the height of a docked `sc-utility-bar` (`padding-block-end` from
 *   `--sc-utility-bar-block-size`, which the bar publishes), so the bar never covers the end
 *   of the page; `sc.css` sets the matching `scroll-padding-block-end` (CHR-05).
 *
 * @slot header - The skip link, then the announcement bar if any, then `sc-app-bar` or
 *   `sc-site-header`. Wrap them in one `<div slot="header">`.
 * @slot - The page content. It's wrapped in `<main>`.
 * @slot footer - `sc-footer`, then `sc-utility-bar` on channel sites. Wrap several in one
 *   `<div slot="footer">`.
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
   * With a sticky header, it also keeps `scroll-padding-block-start` on `<html>` clear of it.
   */
  @Prop() syncDocument = false;

  /** Watches the page for a sticky header appearing, disappearing or changing. */
  private headerObserver?: MutationObserver;
  /** Follows the sticky bar's size (it grows with 200% text or when its content wraps). */
  private barObserver?: ResizeObserver;
  /** Watches `lang` on the page and its ancestors, to keep `dir` in step. */
  private langObserver?: MutationObserver;
  /** The sticky header currently measured. */
  private bar?: Element;
  /** The inline `scroll-padding-block-start` on <html> before this page set it, to restore. */
  private savedScrollPadding?: { value: string; priority: string };

  connectedCallback() {
    if (typeof MutationObserver !== 'undefined') {
      this.langObserver = new MutationObserver(() => this.applyDir());
      this.langObserver.observe(this.el.ownerDocument.documentElement, { attributes: true, attributeFilter: ['lang'], subtree: true });
    }
    this.syncScrollPadding();
  }

  disconnectedCallback() {
    this.langObserver?.disconnect();
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
    this.applyDir();
    this.sync();
  }

  private get validChannel(): Channel | undefined {
    return isChannel(this.channel) ? this.channel : undefined;
  }

  /** The direction always follows the language: this element's own `lang` or the closest ancestor's. */
  private applyDir() {
    const dir = dirFor(resolveLang(this.el));
    if (this.el.getAttribute('dir') !== dir) this.el.setAttribute('dir', dir);
    this.sync();
  }

  /** Copies the page's language, direction and channel to <html> when asked to. */
  private sync() {
    if (!this.syncDocument) return;
    const html = this.el.ownerDocument?.documentElement;
    if (!html) return;
    const lang = this.el.getAttribute('lang');
    if (lang && html.lang !== lang) html.lang = lang;
    const dir = dirFor(resolveLang(this.el));
    if (html.dir !== dir) html.dir = dir;
    if (this.validChannel && html.dataset.channel !== this.validChannel) html.dataset.channel = this.validChannel;
  }

  /** The sticky header in this page's header slot: a header child itself, or inside one. */
  private findStickyBar(): Element | undefined {
    const headers = Array.from(this.el.querySelectorAll('[slot="header"]')).filter((node) => node.closest('sc-page') === this.el);
    for (const header of headers) {
      const bar = header.matches(STICKY) ? header : header.querySelector(STICKY);
      if (bar) return bar;
    }
    return undefined;
  }

  /**
   * Starts or stops keeping `scroll-padding-block-start` on <html> clear of a sticky header.
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

  /** Points the ResizeObserver at the current sticky header, or clears the padding when there is none. */
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
    return (
      <Host dir={dirFor(resolveLang(this.el))} data-channel={this.validChannel}>
        <slot name="header" />
        <main class="sc-page__main" id={this.mainId} tabindex="-1">
          <slot />
        </main>
        <slot name="footer" />
      </Host>
    );
  }
}
