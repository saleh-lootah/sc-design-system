import { Component, Host, Prop, h } from '@stencil/core';
import { AlertCircle, CheckCircle, Hourglass, Pending, Schedule } from '../../icons/index'; // explicit /index: see CONTRIBUTING

export type StatusTagTone = 'neutral' | 'info' | 'success' | 'warning' | 'error';

const TONES: readonly StatusTagTone[] = ['neutral', 'info', 'success', 'warning', 'error'];
const ICONS = { neutral: Pending, info: Hourglass, success: CheckCircle, warning: Schedule, error: AlertCircle };

/**
 * The status of an application, task or payment, in the words of the status vocabulary
 * (Standard 9.6): "Paid", "Action needed", "In review", "Expires in 15 days".
 *
 * v2: a 32px chip with a 6px radius, a tone icon and the words, tone-40 text on a tone-95
 * container (A11Y-06: never colour alone). It isn't interactive and isn't announced on
 * change (use `sc-callout` or a live region for that). There is no channel tone: status is
 * never in a channel's colour.
 *
 * @slot - The status words. Always required; keep them to two or three words.
 *
 * @part tag - The chip.
 * @part icon - The tone icon (decorative).
 */
@Component({
  tag: 'sc-status-tag',
  styleUrl: 'sc-status-tag.css',
  shadow: true,
})
export class ScStatusTag {
  /**
   * - `neutral`: a plain state ("Draft", "Received", "In review", "Not started").
   * - `info`: an informational state, where a service needs one (hourglass icon).
   * - `success`: done ("Paid", "Approved", "Completed").
   * - `warning`: needs attention soon ("Expires in 15 days").
   * - `error`: blocked or waiting on the user ("Action needed", "Payment failed").
   *
   * An unknown tone, including v1's removed `channel`, renders as `neutral`.
   */
  @Prop({ reflect: true }) tone: StatusTagTone = 'neutral';

  render() {
    const tone = TONES.includes(this.tone) ? this.tone : 'neutral';
    const ToneIcon = ICONS[tone];
    return (
      <Host>
        <span class={`tag tag--${tone}`} part="tag">
          <span class="icon-box" part="icon">
            <ToneIcon />
          </span>
          <span class="label">
            <slot />
          </span>
        </span>
      </Host>
    );
  }
}
