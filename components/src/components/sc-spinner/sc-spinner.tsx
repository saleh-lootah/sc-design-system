import { Component, Host, Prop, h } from '@stencil/core';
import { LocaleController } from '../../i18n/controller';
import strings from '../../i18n/components/sc-spinner';
import { Spinner } from '../../icons/index'; // explicit /index: see CONTRIBUTING

export type SpinnerSize = 'm' | 'l';

/**
 * Shows that something is loading: a short inline wait, with a label saying what.
 *
 * v2: 20px (`size="m"`, inline) or 24px (`size="l"`), in `currentColor`, turning once per
 * `--sc-duration-spin` (600ms, linear: a faster spinner makes loading feel faster). The label
 * ("Loading" by default) sits in a polite `role="status"` region and is visually hidden.
 * Under `prefers-reduced-motion` the arc stops and the label shows, so the state never
 * depends on motion (MOT-15). It never mirrors.
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

  /** `m` 20px, inline with body text (default); `l` 24px, standalone. */
  @Prop({ reflect: true }) size: SpinnerSize = 'm';

  private locale = new LocaleController(this, strings);

  connectedCallback() {
    this.locale.connect();
  }

  disconnectedCallback() {
    this.locale.disconnect();
  }

  render() {
    const label = this.label || this.locale.t('spinnerLoading');
    return (
      <Host>
        <span class={{ spinner: true, 'spinner--l': this.size === 'l' }} role="status">
          <span class="icon-box" part="icon">
            <Spinner class="spin" />
          </span>
          <span class={{ label: true, 'label--hidden': !this.showLabel }} part="label">
            {label}
          </span>
        </span>
      </Host>
    );
  }
}
