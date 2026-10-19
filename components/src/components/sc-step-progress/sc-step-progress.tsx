import { Component, Host, Prop, h } from '@stencil/core';
import { LocaleController } from '../../i18n/locale';

/**
 * Shows where the user is in a short journey: "Step 2 of 4", with the current step's
 * name and a segmented track.
 *
 * The text carries the meaning; the track is decorative (`aria-hidden`). Done and
 * current segments use the channel action colour, upcoming ones the control colour;
 * the current segment is half filled. The track fills from the inline start,
 * so from the right in Arabic. Digits stay Latin in both languages.
 *
 * @part meta - The row with the step name and "Step 2 of 4".
 * @part label - The current step's name.
 * @part count - The "Step 2 of 4" text.
 * @part track - The segmented track.
 */
@Component({
  tag: 'sc-step-progress',
  styleUrl: 'sc-step-progress.css',
  shadow: true,
})
export class ScStepProgress {
  /** The current step, from 1. Clamped to `total`. */
  @Prop({ reflect: true }) current = 1;

  /** How many steps there are. Count only the question pages, not "Check your answers" or the confirmation. */
  @Prop({ reflect: true }) total = 1;

  /** The current step's name, e.g. "Plate number". Shown at the start of the row. */
  @Prop() label?: string;

  /**
   * Overrides "Step {current} of {total}" (default from strings). Use `{current}` and
   * `{total}` placeholders to keep the numbers.
   */
  @Prop() countText?: string;

  private locale = new LocaleController(this);

  connectedCallback() {
    this.locale.connect();
  }

  disconnectedCallback() {
    this.locale.disconnect();
  }

  render() {
    const { t } = this.locale;
    const total = Math.max(1, Math.floor(Number(this.total) || 1));
    const current = Math.min(total, Math.max(1, Math.floor(Number(this.current) || 1)));
    const values = { current, total };
    const count = this.countText
      ? this.countText.replace(/\{(current|total)\}/g, (_m, k: 'current' | 'total') => String(values[k]))
      : t('step', values);

    const segments = Array.from({ length: total }, (_, i) => {
      const n = i + 1;
      const state = n < current ? 'done' : n === current ? 'current' : 'upcoming';
      return <span class={`segment segment--${state}`}></span>;
    });

    return (
      <Host>
        <div class="meta" part="meta">
          {this.label && (
            <span class="label type-title-s" part="label">
              {this.label}
            </span>
          )}
          <span class="count type-label-m" part="count">
            {count}
          </span>
        </div>
        <div class="track" part="track" aria-hidden="true">
          {segments}
        </div>
      </Host>
    );
  }
}
