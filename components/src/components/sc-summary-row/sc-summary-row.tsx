import { Component, Element, Host, Prop, h } from '@stencil/core';
import { LocaleController } from '../../i18n/controller';
import strings from '../../i18n/components/sc-summary-row';

export type SummaryRowVariant = 'default' | 'total';

/**
 * One answer in a `sc-summary-list`: a key (`label`), a value (the default slot) and an
 * optional "Change" action.
 *
 * v2 renders in light DOM (Stencil `scoped`). The row carries the data and its value; the
 * parent `sc-summary-list` renders the `<dt>`, the value `<dd>` and the action inside its own
 * `<dl>`, and moves this element into the value `<dd>`. Use it only as a direct child of
 * `sc-summary-list`; the list sets its `slot` attribute.
 *
 * @slot - The value. Text or inline markup; wrap plates, amounts and references in `<sc-ltr>`.
 *   Use `<br>` or separate block elements for an address. Falls back to the `value` prop,
 *   then to "Not provided" / "لم يتم تقديمه" (an optional question the user skipped).
 */
@Component({
  tag: 'sc-summary-row',
  styleUrl: 'sc-summary-row.css',
  scoped: true,
})
export class ScSummaryRow {
  @Element() el!: HTMLElement;

  /** The key: what the answer is about, e.g. "Plate number". Rendered as the `<dt>`. Required. */
  @Prop({ reflect: true }) label!: string;

  /** A plain-text value, used when the row has no content. With neither, the row shows "Not provided". */
  @Prop() value?: string;

  /**
   * Where the action goes, e.g. back to the question with `#plate-number` or a page URL.
   * Without it the row has no action (the action column stays, so values still align).
   * Ignored in the `pairs` layout.
   */
  @Prop({ reflect: true }) actionHref?: string;

  /** The visible action text. Defaults to "Change" ("تغيير") in the page language. */
  @Prop({ reflect: true }) actionText?: string;

  /**
   * Visually hidden text after the action text, so screen reader users hear which answer
   * they're changing ("Change Plate number"). Defaults to `label`. Set it when the label alone
   * doesn't read well after the action text, e.g. `action-hidden-text="your plate number"`.
   */
  @Prop({ reflect: true }) actionHiddenText?: string;

  /** `total` marks the amount row of a payment summary (E4): a quiet fill and Bold key and value. */
  @Prop({ reflect: true }) variant: SummaryRowVariant = 'default';

  private locale = new LocaleController(this, strings);
  private hasContent = false;

  connectedCallback() {
    this.locale.connect();
  }

  disconnectedCallback() {
    this.locale.disconnect();
  }

  componentWillLoad() {
    // Before the first render the host holds only the author's content.
    this.hasContent = Array.from(this.el.childNodes).some((n) => n.nodeType === 1 || (n.nodeType === 3 && !!n.textContent?.trim()));
  }

  render() {
    return <Host class="sc-summary-row">{this.hasContent ? <slot /> : this.value || this.locale.t('summaryRowNotProvided')}</Host>;
  }
}
