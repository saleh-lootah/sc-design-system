import { Component, Host, Prop, h } from '@stencil/core';

/**
 * One option in an `sc-radio-group`. Its content is the option's label.
 *
 * `sc-radio` holds data and label content only. The parent `sc-radio-group` renders the
 * native `<input type="radio">` for every option inside its own shadow root and slots
 * this element into that option's `<label>`, so all the radios share one tree: they form a
 * real native radio group (one Tab stop, arrow keys move and select, "2 of 3" announced).
 * Use it only inside `sc-radio-group`.
 *
 * @slot - The option label: "Dubai". Text, or text with `<sc-ltr>` for values.
 */
@Component({
  tag: 'sc-radio',
  styleUrl: 'sc-radio.css',
  shadow: true,
})
export class ScRadio {
  /** The value submitted when this option is chosen. */
  @Prop({ reflect: true }) value!: string;

  /** Help text under this option's label. */
  @Prop({ reflect: true }) hint?: string;

  /** Chosen when the page loads (unless the group has a `value`). */
  @Prop({ reflect: true }) checked = false;

  /** Disables this option. Avoid it; remove options that don't apply instead. */
  @Prop({ reflect: true }) disabled = false;

  render() {
    return (
      <Host>
        <slot />
      </Host>
    );
  }
}
