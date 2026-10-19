import { AttachInternals, Component, Element, Event, EventEmitter, Host, Prop, State, h } from '@stencil/core';
import { LocaleController } from '../../i18n/locale';
import { AlertCircle } from '../../icons/index'; // explicit /index: enables SVG rendering for this component (see CONTRIBUTING)
import { FieldError, IDS, describedBy, emitNativeChange, hasSlotted, formSupported } from '../sc-text-input/field';

void AlertCircle;

/**
 * A checkbox: one of several choices in an `sc-checkbox-group`, or on its own for a single
 * yes/no statement ("I confirm the vehicle details are correct").
 *
 * Renders a native `<input type="checkbox">`, its `<label>` (the default slot) and hint in
 * its own shadow root. Space toggles it. Form-associated: when checked it submits `value`
 * under its `name`, or under the group's `name` inside `sc-checkbox-group`. On its own it can
 * show an error; inside a group the group shows the error and marks every box invalid.
 *
 * @slot - The label: "Car". Keep it short; put detail in the hint.
 * @slot hint - Rich hint content, instead of the `hint` prop.
 * @slot error - Rich error content, instead of the `error` prop (on its own only).
 *
 * @part field - The wrapper (gets the error bar when the checkbox shows its own error).
 * @part error - The error message.
 * @part option - The option row.
 * @part checkbox - The native `<input type="checkbox">`.
 * @part label - The `<label>`.
 * @part hint - The hint.
 */
@Component({
  tag: 'sc-checkbox',
  styleUrl: 'sc-checkbox.css',
  shadow: { delegatesFocus: true },
  formAssociated: true,
})
export class ScCheckbox {
  @Element() el!: HTMLElement;

  @AttachInternals() internals!: ElementInternals;

  /** The name submitted with the form. Inside `sc-checkbox-group`, defaults to the group's `name`. */
  @Prop({ reflect: true }) name?: string;

  /** The value submitted when checked. */
  @Prop({ reflect: true }) value = 'on';

  /** Whether the box is checked. Updated when the user toggles it. */
  @Prop({ mutable: true, reflect: true }) checked = false;

  /** Help text under the label. */
  @Prop() hint?: string;

  /** The error message, for a checkbox on its own. Inside a group, set `error` on the group. */
  @Prop({ reflect: true }) error?: string;

  /** On its own: must be checked to submit (`valueMissing`). Inside a group, use the group's `required`. */
  @Prop() required = false;

  /** Disables the checkbox. Avoid it. */
  @Prop({ reflect: true }) disabled = false;

  /** @internal Set by sc-checkbox-group: the group is in its error state. */
  @Prop() groupInvalid = false;

  /** @internal Set by sc-checkbox-group: the group is disabled. */
  @Prop() groupDisabled = false;

  /** Fires when the box is toggled with `{ checked, value }`. A native `change` is also dispatched on the host. */
  @Event({ bubbles: true, composed: true }) scChange!: EventEmitter<{ checked: boolean; value: string }>;

  @State() formDisabled = false;
  @State() slots = { hint: false, error: false };
  @State() inGroup = false;

  private input?: HTMLInputElement;
  private defaultChecked = false;
  private locale = new LocaleController(this);

  connectedCallback() {
    this.locale.connect();
    this.readSlots();
    this.inGroup = !!this.group;
  }

  componentDidLoad() {
    // slotchange bubbles to the shadow root but not past it.
    this.el.shadowRoot?.addEventListener('slotchange', this.readSlots);
  }

  disconnectedCallback() {
    this.locale.disconnect();
  }

  componentWillLoad() {
    this.defaultChecked = this.checked;
  }

  componentDidRender() {
    this.sync();
  }

  formDisabledCallback(disabled: boolean) {
    this.formDisabled = disabled;
  }

  formResetCallback() {
    this.checked = this.defaultChecked;
  }

  formStateRestoreCallback(state: unknown) {
    if (state instanceof FormData) this.checked = [...state.values()].length > 0;
  }

  private get group(): HTMLElement | null {
    const parent = this.el.parentElement;
    return parent?.localName === 'sc-checkbox-group' ? parent : null;
  }

  private sync() {
    if (!formSupported()) return;
    const name = this.name || this.group?.getAttribute('name') || '';
    // A FormData value is submitted as-is, so the group's name works without copying it onto this element.
    if (this.internals?.setFormValue) {
      if (this.checked && name && typeof FormData !== 'undefined') {
        const data = new FormData();
        data.append(name, this.value);
        this.internals.setFormValue(data);
      } else {
        this.internals.setFormValue(null);
      }
    }
    if (!this.internals?.setValidity) return;
    if (this.required && !this.inGroup && !this.checked && this.input) {
      this.internals.setValidity({ valueMissing: true }, this.locale.t('checkboxRequired'), this.input);
    } else {
      this.internals.setValidity({});
    }
  }

  private readSlots = () => {
    const next = { hint: hasSlotted(this.el, 'hint'), error: hasSlotted(this.el, 'error') };
    if (JSON.stringify(next) !== JSON.stringify(this.slots)) this.slots = next;
  };

  private onChange = (ev: Event) => {
    this.checked = (ev.target as HTMLInputElement).checked;
    this.scChange.emit({ checked: this.checked, value: this.value });
    emitNativeChange(this.el);
  };

  render() {
    const { t } = this.locale;
    const hasHint = !!this.hint || this.slots.hint;
    const ownError = !this.inGroup && (!!this.error || this.slots.error);
    const invalid = ownError || (this.inGroup && this.groupInvalid);
    const disabled = this.disabled || this.formDisabled || this.groupDisabled;

    return (
      <Host>
        <div class={{ 'field': true, 'field--error': ownError }} part="field">
          {!this.inGroup && <FieldError text={this.error} show={ownError} prefix={t('errorPrefix')} />}
          <div class="option" part="option">
            <input
              ref={(el) => (this.input = el)}
              id={IDS.control}
              class={{ 'box': true, 'box--check': true, 'box--invalid': invalid, 'focus-ring': true }}
              part="checkbox"
              type="checkbox"
              checked={this.checked}
              disabled={disabled}
              aria-describedby={describedBy(hasHint && IDS.hint, ownError && IDS.error)}
              aria-invalid={invalid ? 'true' : undefined}
              onChange={this.onChange}
            />
            <span class="mark mark--check" aria-hidden="true" />
            <label class="option-label" htmlFor={IDS.control} part="label">
              <slot />
            </label>
            <div id={IDS.hint} class="option-hint" part="hint" hidden={!hasHint}>
              <slot name="hint">{this.hint}</slot>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
