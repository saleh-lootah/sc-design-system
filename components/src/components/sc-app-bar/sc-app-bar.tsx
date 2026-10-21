import { Component, Element, Host, Prop, State, h } from '@stencil/core';
import { LocaleController } from '../../i18n/controller';
import { channelNameStrings, nameKey } from '../../i18n/components/channel-names';
import { resolveChannel } from '../../utils/channels';

/**
 * The transaction app bar (component-language A4; Standard TPL-01, LANG-04): the bar at the
 * top of every step of a journey (E2–E4). Channel pages outside a transaction use
 * `sc-site-header` instead.
 *
 * A 4px rule in `channel-action` along the top; a start slot (the back link), the title (a
 * 10px channel swatch and the channel name, centred) and an end slot (the language switch),
 * with fixed 96px side slots so the title stays centred; a 1px `outline-variant` rule
 * beneath. 60px tall on `surface`. Flat: no glass, no shadow.
 *
 * The host is a `banner` landmark unless `landmark` is false. It is not fixed by default;
 * with `sticky`, `sc-page sync-document` sets `scroll-padding-top` so focus never slides
 * under it (WCAG 2.4.11).
 *
 * @slot start - Usually `<sc-back-link>`.
 * @slot title - The channel name. Defaults to the channel's name in the page language.
 * @slot - Deprecated (v1 desktop header, `align="start"`): content after the title. Use `sc-site-header`.
 * @slot end - Usually `<sc-language-switch>`.
 *
 * @part bar - The bar.
 * @part start - The start slot wrapper.
 * @part title - The title wrapper.
 * @part content - The default slot wrapper.
 * @part end - The end slot wrapper.
 */
@Component({
  tag: 'sc-app-bar',
  styleUrl: 'sc-app-bar.css',
  shadow: true,
})
export class ScAppBar {
  @Element() el!: HTMLElement;

  /** Keeps the bar at the top of the viewport while the page scrolls (`position: sticky`). */
  @Prop({ reflect: true }) sticky = false;

  /**
   * `center` (default): the journey bar, title in the middle. `start`: deprecated (v1's
   * desktop header): the title at the start and the default slot after it. Use
   * `sc-site-header` for channel pages.
   */
  @Prop({ reflect: true }) align: 'center' | 'start' = 'center';

  /** Deprecated and ignored: v2 has no floating glass capsule (ELV-04). */
  @Prop({ reflect: true }) shape: 'bar' | 'floating' = 'bar';

  /**
   * Makes the host a `banner` landmark. Set it to false when the page already has a banner,
   * or when the bar sits inside a dialog.
   */
  @Prop() landmark = true;

  @State() hasContent = false;

  private locale = new LocaleController(this, channelNameStrings({ en: {}, ar: {} }));

  connectedCallback() {
    this.locale.connect();
    this.readSlots();
  }

  disconnectedCallback() {
    this.locale.disconnect();
  }

  private readSlots = () => {
    this.hasContent = Array.from(this.el.childNodes).some(
      (c) => (c.nodeType === 1 && !(c as Element).hasAttribute('slot')) || (c.nodeType === 3 && !!c.textContent?.trim()),
    );
  };

  render() {
    const start = this.align === 'start';
    return (
      <Host role={this.landmark ? 'banner' : undefined}>
        <div class={{ bar: true, 'bar--start': start }} part="bar">
          <div class="slot start" part="start">
            <slot name="start" />
          </div>
          <div class="title" part="title">
            <span class="swatch" aria-hidden="true" />
            <span class="title-text">
              <slot name="title">{this.locale.t(nameKey(resolveChannel(this.el)))}</slot>
            </span>
          </div>
          <div class={{ content: true, empty: !this.hasContent }} part="content">
            <slot onSlotchange={this.readSlots} />
          </div>
          <div class="slot end" part="end">
            <slot name="end" />
          </div>
        </div>
      </Host>
    );
  }
}
