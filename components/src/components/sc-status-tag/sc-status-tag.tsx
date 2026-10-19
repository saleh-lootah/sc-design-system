import { Component, Host, Prop, h } from '@stencil/core';

export type StatusTagTone = 'neutral' | 'success' | 'warning' | 'error' | 'channel';

const TONES: readonly StatusTagTone[] = ['neutral', 'success', 'warning', 'error', 'channel'];

/**
 * The status of a task, application or payment: "Paid", "Action needed", "In review",
 * "Expires in 15 days". A pill with a status dot and the status words.
 *
 * The words carry the meaning; the colour and the dot only support them. It isn't
 * interactive and isn't announced on change (use `sc-callout` or a live region for that).
 *
 * @slot - The status words. Always required; keep them to two or three words.
 *
 * @part tag - The pill.
 * @part dot - The status dot.
 */
@Component({
  tag: 'sc-status-tag',
  styleUrl: 'sc-status-tag.css',
  shadow: true,
})
export class ScStatusTag {
  /**
   * - `neutral`: no action needed yet, or a plain state ("Draft", "In review").
   * - `success`: done ("Paid", "Renewed").
   * - `warning`: needs attention soon ("Expires in 15 days").
   * - `error`: blocked or failed ("Action needed", "Payment failed").
   * - `channel`: highlights something in the current channel's colours ("New").
   */
  @Prop({ reflect: true }) tone: StatusTagTone = 'neutral';

  render() {
    const tone = TONES.includes(this.tone) ? this.tone : 'neutral';
    return (
      <Host>
        <span class={{ tag: true, [`tag--${tone}`]: true, 'type-label-s': true }} part="tag">
          <span class="dot" part="dot" aria-hidden="true"></span>
          <span class="label">
            <slot />
          </span>
        </span>
      </Host>
    );
  }
}
