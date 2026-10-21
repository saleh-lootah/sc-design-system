import { AttachInternals, Component, Element, Event, EventEmitter, Host, Listen, Prop, State, h } from '@stencil/core';
import { LocaleController } from '../../i18n/locale';
import { AlertCircle } from '../../icons/index'; // explicit /index: enables SVG rendering for this component (see CONTRIBUTING)
import { FieldError, FieldHint, FieldLabel, HeadingLevel, IDS, describedBy, hasSlotted, headingLevel, formSupported } from '../sc-text-input/field-v1';

void AlertCircle;

type CheckboxEl = HTMLElement & { checked: boolean; value: string; groupInvalid: boolean; groupDisabled: boolean };

/**
 * Several choices from a short list: "Which documents do you have?".
 *
 * A `<fieldset>` with a `<legend>`, hint and error in this element's shadow root, with the
 * `sc-checkbox` children slotted inside it. Each checkbox keeps its own native input, label
 * and hint in its own shadow root (so `sc-checkbox` also works on its own); the fieldset
 * groups them in the accessibility tree, which follows the flattened tree. The group's
 * hint and error describe the fieldset, and in the error state every box gets
 * `aria-invalid` and an error border.
 *
 * Each checked box submits its own value under the group's `name` (or its own). The group is
 * form-associated only to report `valueMissing` when `required` and nothing is checked.
 *
 * @slot - `sc-checkbox` elements, one per option.
 * @slot label - Rich legend content, instead of the `label` prop.
 * @slot hint - Rich hint content, instead of the `hint` prop.
 * @slot error - Rich error content, instead of the `error` prop.
 *
 * @part field - The `<fieldset>` (gets the error bar).
 * @part label - The `<legend>`.
 * @part hint - The hint.
 * @part error - The error message.
 * @part options - The wrapper around the checkboxes.
 */
@Component({
  tag: 'sc-checkbox-group',
  styleUrl: 'sc-checkbox-group.css',
  shadow: { delegatesFocus: true },
  formAssociated: true,
})
export class ScCheckboxGroup {
  @Element() el!: HTMLElement;

  @AttachInternals() internals!: ElementInternals;

  /** The question, shown as the legend: "Which documents do you have?". */
  @Prop() label?: string;

  /** Help text below the legend: "Select all that apply". */
  @Prop() hint?: string;

  /** The error message. Setting it shows the error state on the group and every box. */
  @Prop({ reflect: true }) error?: string;

  /** Appends "(optional)" to the legend. */
  @Prop() optional = false;

  /** The name each checked box submits its value under (unless the box has its own `name`). */
  @Prop({ reflect: true }) name?: string;

  /** Requires at least one box to be checked (`valueMissing`). Not shown visually. */
  @Prop() required = false;

  /** Disables every checkbox. Avoid it. */
  @Prop({ reflect: true }) disabled = false;

  /** Lays short options side by side. They wrap on narrow screens. */
  @Prop({ reflect: true }) inline = false;

  /** When set (1–6), the legend is also the page heading at this level. */
  @Prop() headingLevel?: HeadingLevel;

  /** Fires when any box is toggled, with the values of all checked boxes: `{ value: string[] }`. */
  @Event({ bubbles: true, composed: true }) scGroupChange!: EventEmitter<{ value: string[] }>;

  @State() formDisabled = false;
  @State() slots = { label: false, hint: false, error: false };

  private locale = new LocaleController(this);

  connectedCallback() {
    this.locale.connect();
    this.readSlots();
  }

  componentDidLoad() {
    // slotchange bubbles to the shadow root but not past it.
    this.el.shadowRoot?.addEventListener('slotchange', this.readSlots);
  }

  disconnectedCallback() {
    this.locale.disconnect();
  }

  componentDidRender() {
    this.syncChildren();
    this.sync();
  }

  formDisabledCallback(disabled: boolean) {
    this.formDisabled = disabled;
    this.syncChildren();
  }

  formResetCallback() {
    // Each sc-checkbox resets itself; re-check validity once they have.
    queueMicrotask(() => this.sync());
  }

  /** The values of the checked boxes, in order. */
  private valueList(): string[] {
    return this.boxes.filter((b) => b.checked).map((b) => b.value);
  }

  private get boxes(): CheckboxEl[] {
    return Array.from(this.el.children).filter((c) => c.localName === 'sc-checkbox') as CheckboxEl[];
  }

  @Listen('scChange')
  onBoxChange(ev: Event) {
    if ((ev.target as HTMLElement).parentElement !== this.el) return;
    this.sync();
    this.scGroupChange.emit({ value: this.valueList() });
  }

  /** Passes the error and disabled state down to each checkbox. */
  private syncChildren() {
    const invalid = !!this.error || this.slots.error;
    const disabled = this.disabled || this.formDisabled;
    for (const box of this.boxes) {
      box.groupInvalid = invalid;
      box.groupDisabled = disabled;
    }
  }

  private sync() {
    if (!formSupported()) return;
    this.internals?.setFormValue?.(null);
    if (!this.internals?.setValidity) return;
    const boxes = this.boxes;
    const anchor = boxes.find((b) => !b.hasAttribute('disabled'))?.shadowRoot?.querySelector('input') ?? undefined;
    if (this.required && !boxes.some((b) => b.checked) && anchor) {
      this.internals.setValidity({ valueMissing: true }, this.locale.t('checkboxGroupRequired'), anchor);
    } else {
      this.internals.setValidity({});
    }
  }

  private readSlots = () => {
    const next = { label: hasSlotted(this.el, 'label'), hint: hasSlotted(this.el, 'hint'), error: hasSlotted(this.el, 'error') };
    if (JSON.stringify(next) !== JSON.stringify(this.slots)) this.slots = next;
  };

  render() {
    const { t } = this.locale;
    const hasHint = !!this.hint || this.slots.hint;
    const hasError = !!this.error || this.slots.error;

    return (
      <Host>
        <fieldset
          class={{ 'field': true, 'field--error': hasError }}
          part="field"
          aria-describedby={describedBy(hasHint && IDS.hint, hasError && IDS.error)}
         
        >
          <FieldLabel text={this.label} optional={this.optional} optionalText={t('optional')} level={headingLevel(this.headingLevel)} as="legend" />
          <FieldHint text={this.hint} show={hasHint} />
          <FieldError text={this.error} show={hasError} prefix={t('errorPrefix')} />
          <div class={{ 'options': true, 'options--inline': this.inline }} part="options">
            <slot />
          </div>
        </fieldset>
      </Host>
    );
  }
}
