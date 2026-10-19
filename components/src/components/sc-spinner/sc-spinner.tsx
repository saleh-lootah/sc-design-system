import { Component, Host, Prop, h } from '@stencil/core';
import { LocaleController } from '../../i18n/locale';
import { Spinner } from '../../icons/index'; // explicit /index: see CONTRIBUTING

/**
 * Shows that something is loading. Inline, 20px, in the current text colour.
 *
 * The label ("Loading" by default) is visually hidden and sits in a polite status region.
 * Under `prefers-reduced-motion` the icon stops spinning and the label becomes visible,
 * so the state never depends on motion.
 *
 * Inside a button, use `sc-button loading` instead.
 *
 * @part icon - The spinner `<svg>` wrapper.
 * @part label - The label text.
 */
@Component({
  tag: 'sc-spinner',
  styleUrl: 'sc-spinner.css',
  shadow: true,
})
export class ScSpinner {
  /** What is loading, e.g. "Checking your plate number". Defaults to "Loading" / "جارٍ التحميل". */
  @Prop() label?: string;

  /** Shows the label next to the spinner at all times, not only under reduced motion. */
  @Prop({ reflect: true }) showLabel = false;

  private locale = new LocaleController(this);

  connectedCallback() {
    this.locale.connect();
  }

  disconnectedCallback() {
    this.locale.disconnect();
  }

  render() {
    const label = this.label || this.locale.t('loading');
    return (
      <Host>
        <span class="spinner" role="status">
          <span class="icon-box" part="icon">
            <Spinner class="spin" />
          </span>
          <span class={{ 'label': true, 'type-label-m': true, 'label--hidden': !this.showLabel }} part="label">
            {label}
          </span>
        </span>
      </Host>
    );
  }
}
