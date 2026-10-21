import { Component, Host, Prop, h } from '@stencil/core';
import { LocaleController } from '../../i18n/controller';
import strings from '../../i18n/components/sc-link';
import { ArrowForward, External } from '../../icons/index'; // explicit /index: Stencil only scans file imports for <svg>

/**
 * Goes somewhere. Use it for navigation; use `sc-button` for actions.
 *
 * v2 keeps a shadow root (architecture §3.1) with a native `<a>` inside and delegates focus
 * to it. For links inside running text prefer the CSS-only `.sc-link` class on a native
 * `<a>` (decision A4), which keeps text selection and find-in-page working across the link.
 * - Inline (default): takes the surrounding type, underlined 1px at 4px (5px in Arabic) in
 *   the channel action colour; 2px on hover. Visited links are not styled differently (D8).
 * - `standalone`: a link on its own line ("All 412 services"): label-large Bold, an end
 *   arrow that mirrors in right-to-left, and a 44px target.
 * - `external`: opens in a new tab, adds an icon and the visually hidden
 *   "(opens in new tab)" in the page language.
 *
 * The colour is `--sc-color-channel-action` unless `--sc-link-color` is set on an ancestor
 * (the footer and the error summary set it to `on-surface` and `error`).
 *
 * @slot - The link text. Say where it goes ("Check your fines"), never "Click here".
 *
 * @part control - The inner `<a>`.
 * @part label - The wrapper around the default slot (it carries the underline).
 * @part icon - The external or arrow icon, when shown.
 */
@Component({
  tag: 'sc-link',
  styleUrl: 'sc-link.css',
  shadow: { delegatesFocus: true },
})
export class ScLink {
  /** Where the link goes. */
  @Prop({ reflect: true }) href?: string;

  /**
   * Opens the link in a new tab (`target="_blank" rel="noopener noreferrer"`), shows the
   * external icon and adds a visually hidden "(opens in new tab)". Only use it when leaving
   * the page would lose the user's progress, for example a guidance page linked from a form.
   */
  @Prop({ reflect: true }) external = false;

  /** A link on its own (not inside a sentence): label-large Bold, an end arrow and a 44px target. */
  @Prop({ reflect: true }) standalone = false;

  /** Overrides the visually hidden "(opens in new tab)" (default from strings, in the page language). */
  @Prop() externalText?: string;

  /** The language of the linked page, when it differs from this one (sets `hreflang`). */
  @Prop() hreflang?: string;

  /** Sets `download` on the inner link: the browser saves the file instead of opening it. The value is the suggested filename. */
  @Prop() download?: string;

  private locale = new LocaleController(this, strings);

  connectedCallback() {
    this.locale.connect();
  }

  disconnectedCallback() {
    this.locale.disconnect();
  }

  render() {
    const { external, standalone } = this;
    return (
      <Host>
        <a
          class={{ 'link': true, 'focus-ring': true, 'link--standalone': standalone }}
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
          {(external || standalone) && (
            <span class="icon-box" part="icon">
              {external ? <External /> : <ArrowForward />}
            </span>
          )}
          {external && <span class="visually-hidden"> {this.externalText || this.locale.t('linkOpensInNewTab')}</span>}
        </a>
      </Host>
    );
  }
}
