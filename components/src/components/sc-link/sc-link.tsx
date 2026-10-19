import { Component, Element, Host, Prop, h } from '@stencil/core';
import { LocaleController } from '../../i18n/locale';
import { ChevronForward, External } from '../../icons/index'; // explicit /index: Stencil only scans file imports for <svg>

/**
 * Goes somewhere. Use it for navigation; use `sc-button` for actions.
 *
 * Renders a native `<a>` inside its shadow root and delegates focus to it.
 * - Inline (default): sits inside running text, takes the surrounding type, underlined in
 *   the channel action colour, with a visited colour.
 * - `standalone`: a link on its own line ("View all services") with an end chevron that
 *   mirrors in right-to-left, and a 44px target.
 * - `external`: opens in a new tab, adds an icon and the visually hidden
 *   "(opens in new tab)" in the page language.
 *
 * @slot - The link text. Say where it goes ("Check your fines"), never "Click here".
 *
 * @part control - The inner `<a>`.
 * @part label - The wrapper around the default slot (it carries the underline).
 * @part icon - The external or chevron icon, when shown.
 */
@Component({
  tag: 'sc-link',
  styleUrl: 'sc-link.css',
  shadow: { delegatesFocus: true },
})
export class ScLink {
  @Element() el!: HTMLElement;

  /** Where the link goes. */
  @Prop({ reflect: true }) href?: string;

  /**
   * Opens the link in a new tab (`target="_blank" rel="noopener noreferrer"`), shows the
   * external icon and adds a visually hidden "(opens in new tab)". Only use it when leaving
   * the page would lose the user's progress, for example a guidance page linked from a form.
   */
  @Prop({ reflect: true }) external = false;

  /** A link on its own (not inside a sentence): adds an end chevron and a 44px target. */
  @Prop({ reflect: true }) standalone = false;

  /** Overrides the visually hidden "(opens in new tab)" (default from strings, in the page language). */
  @Prop() externalText?: string;

  /** The language of the linked page, when it differs from this one (sets `hreflang`). */
  @Prop() hreflang?: string;

  /** Sets `download` on the inner link: the browser saves the file instead of opening it. The value is the suggested filename. */
  @Prop() download?: string;

  private locale = new LocaleController(this);

  connectedCallback() {
    this.locale.connect();
  }

  disconnectedCallback() {
    this.locale.disconnect();
  }

  render() {
    const { t } = this.locale;
    const external = this.external;
    return (
      <Host>
        <a
          class={{ 'link': true, 'focus-ring': true, 'link--standalone': this.standalone, 'type-label-m': this.standalone }}
          part="control"
          href={this.href}
          hreflang={this.hreflang}
          download={this.download}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
        >
          <span class="label" part="label">
            <slot />
          </span>
          {external && (
            <span class="icon-box" part="icon">
              <External />
            </span>
          )}
          {external && <span class="visually-hidden"> {this.externalText || t('opensInNewTab')}</span>}
          {this.standalone && !external && (
            <span class="icon-box" part="icon">
              <ChevronForward />
            </span>
          )}
        </a>
      </Host>
    );
  }
}
