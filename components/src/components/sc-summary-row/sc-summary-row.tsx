import { Component, Element, Host, Prop, Watch, h } from '@stencil/core';
import { SUMMARY_ROW_UPDATE } from './summary-row-update';

/**
 * One answer in a `sc-summary-list`: a key (`label`), a value (the default slot) and an
 * optional "Change" action.
 *
 * The row only carries data and its value. The parent `sc-summary-list` renders the
 * `<dt>`, `<dd>` and action inside its own `<dl>`, and slots this element into the value
 * `<dd>`, so the description list stays valid across shadow roots. Use it only as a direct
 * child of `sc-summary-list`; the list sets its `slot` attribute.
 *
 * @slot - The value. Text or inline markup; wrap plates, amounts and references in `<sc-ltr>`.
 *   Use `<br>` or separate block elements for an address. Falls back to the `value` prop.
 */
@Component({
  tag: 'sc-summary-row',
  styleUrl: 'sc-summary-row.css',
  shadow: true,
})
export class ScSummaryRow {
  @Element() el!: HTMLElement;

  /** The key: what the answer is about, e.g. "Plate number". Rendered as the `<dt>`. Required. */
  @Prop({ reflect: true }) label!: string;

  /** A plain-text value, used when the default slot is empty. */
  @Prop() value?: string;

  /**
   * Where the action goes, e.g. back to the question with `#plate-number` or a page URL.
   * Without it the row has no action (the action column stays, so values still align).
   */
  @Prop({ reflect: true }) actionHref?: string;

  /** The visible action text. Defaults to "Change" ("تغيير") in the page language. */
  @Prop() actionText?: string;

  /**
   * Visually hidden text after the action text, so screen reader users hear which answer
   * they're changing ("Change Plate number"). Defaults to `label`. Set it when the label alone
   * doesn't read well after the action text, e.g. `action-hidden-text="your plate number"`.
   */
  @Prop() actionHiddenText?: string;

  @Watch('label')
  @Watch('value')
  @Watch('actionHref')
  @Watch('actionText')
  @Watch('actionHiddenText')
  notifyList() {
    this.el.dispatchEvent(new CustomEvent(SUMMARY_ROW_UPDATE, { bubbles: true }));
  }

  render() {
    return (
      <Host>
        <slot>{this.value}</slot>
      </Host>
    );
  }
}
