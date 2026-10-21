import { Component, Host, Prop, h } from '@stencil/core';
import { LocaleController } from '../../i18n/controller';
import strings from '../../i18n/components/sc-back-link';
import { ArrowBack } from '../../icons/nav'; // a file import: Stencil only scans file imports for <svg>

/**
 * The "Back" control at the start of an app bar or above a question: plain text with a
 * 24px back arrow that mirrors in right-to-left, on a 44px target (v2 drops v1's glass pill).
 *
 * Renders a native `<a>` when `href` is set (the previous page has a URL, which also works
 * without JavaScript), or a `<button type="button">` otherwise: listen for `click` and go
 * back in your router. It delegates focus to the inner control.
 *
 * @slot - Overrides the label. Defaults to "Back" / "رجوع" in the page language.
 *
 * @part control - The inner `<a>` or `<button>`.
 * @part label - The label wrapper.
 * @part icon - The arrow wrapper.
 */
@Component({
  tag: 'sc-back-link',
  styleUrl: 'sc-back-link.css',
  shadow: { delegatesFocus: true },
})
export class ScBackLink {
  /** The previous page. Without it the control is a `<button>`; handle its `click`. */
  @Prop({ reflect: true }) href?: string;

  /**
   * Deprecated in v2 and ignored: the back link has one plain appearance on every surface.
   * Kept so v1 markup (`appearance="glass"` or `"plain"`) still renders.
   */
  @Prop({ reflect: true }) appearance?: string;

  private locale = new LocaleController(this, strings);

  connectedCallback() {
    this.locale.connect();
  }

  disconnectedCallback() {
    this.locale.disconnect();
  }

  render() {
    const content = [
      <span class="icon-box" part="icon">
        <ArrowBack />
      </span>,
      <span class="label" part="label">
        <slot>{this.locale.t('backLinkLabel')}</slot>
      </span>,
    ];
    return (
      <Host>
        {this.href ? (
          <a class="control focus-ring" part="control" href={this.href}>
            {content}
          </a>
        ) : (
          <button class="control focus-ring" part="control" type="button">
            {content}
          </button>
        )}
      </Host>
    );
  }
}
