import { Component, Element, Host, Prop, h } from '@stencil/core';
import { LocaleController } from '../../i18n/locale';
import { ChevronBack } from '../../icons/index'; // explicit /index: Stencil only scans file imports for <svg>

/**
 * The "Back" control at the start of an app bar or above a question. A 44px glass pill with
 * a back chevron that mirrors in right-to-left.
 *
 * Renders a native `<a>` when `href` is set (the previous page has a URL, which also works
 * without JavaScript), or a `<button type="button">` otherwise: listen for `click` and go
 * back in your router. It delegates focus to the inner control.
 *
 * @slot - Overrides the label. Defaults to "Back" / "رجوع" in the page language.
 *
 * @part control - The inner `<a>` or `<button>`.
 * @part label - The label wrapper.
 * @part icon - The chevron wrapper.
 */
@Component({
  tag: 'sc-back-link',
  styleUrl: 'sc-back-link.css',
  shadow: { delegatesFocus: true },
})
export class ScBackLink {
  @Element() el!: HTMLElement;

  /** The previous page. Without it the control is a `<button>`; handle its `click`. */
  @Prop({ reflect: true }) href?: string;

  /**
   * Surface.
   * - `glass` (default): translucent pill with an edge and shadow, for app bars and washes.
   * - `plain`: no fill, for use inside a page body under a solid surface.
   */
  @Prop({ reflect: true }) appearance: 'glass' | 'plain' = 'glass';

  private locale = new LocaleController(this);

  connectedCallback() {
    this.locale.connect();
  }

  disconnectedCallback() {
    this.locale.disconnect();
  }

  render() {
    const { t } = this.locale;
    const classes = {
      'control': true,
      'focus-ring': true,
      'type-label-m': true,
      'control--plain': this.appearance === 'plain',
    };
    const content = [
      <span class="icon-box" part="icon">
        <ChevronBack />
      </span>,
      <span class="label" part="label">
        <slot>{t('back')}</slot>
      </span>,
    ];
    return (
      <Host>
        {this.href ? (
          <a class={classes} part="control" href={this.href}>
            {content}
          </a>
        ) : (
          <button class={classes} part="control" type="button">
            {content}
          </button>
        )}
      </Host>
    );
  }
}
