import { Component, Element, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { LocaleController } from '../../i18n/controller';
import { CheckMark, FieldError, Moved, Slotted, describedBy, forwardFocus, nextId, onFormReset, takeSlotted, withField } from '../sc-text-input/field';

const strings = withField();

/**
 * A checkbox: one of several choices in an `sc-checkbox-group`, or on its own for a single
 * statement ("I confirm the vehicle details are correct").
 *
 * v2 renders a native `<input type="checkbox">`, its `<label>` (the default slot) and hint in
 * light DOM (Stencil `scoped`, decision A2). Space toggles it; clicking the label or the 44px
 * target around the box toggles it. When checked it submits `value` under its `name`, or under
 * the group's `name` inside `sc-checkbox-group`. On its own it can show an error and use
 * native `required`; inside a group the group shows the error and marks every box invalid.
 *
 * @slot - The label: "Valid insurance policy". Keep it short; put detail in the hint.
 */
@Component({
  tag: 'sc-checkbox',
  styleUrls: ['../sc-text-input/field.css', '../sc-text-input/choice.css', 'sc-checkbox.css'],
  scoped: true,
})
export class ScCheckbox {
  @Element() el!: HTMLElement;

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

  /** On its own: must be checked to submit (native `valueMissing`). Inside a group, use the group's `required`. */
  @Prop() required = false;

  /** Disables the checkbox. Avoid it. */
  @Prop({ reflect: true }) disabled = false;

  /** @internal Set by sc-checkbox-group: the group's `name`. */
  @Prop() groupName?: string;

  /** @internal Set by sc-checkbox-group: the group is in its error state. */
  @Prop() groupInvalid = false;

  /** Fires when the box is toggled with `{ checked, value }`. The native `change` event also bubbles. */
  @Event({ bubbles: true, composed: true }) scChange!: EventEmitter<{ checked: boolean; value: string }>;

  @State() slotted: Slotted = {};
  @State() inGroup = false;

  private uid = nextId('sc-checkbox');
  private input?: HTMLInputElement;
  private locale = new LocaleController(this, strings);
  private stopReset?: () => void;

  connectedCallback() {
    this.locale.connect();
    this.slotted = takeSlotted(this.el, ['hint', 'error'], this.slotted);
    this.inGroup = !!this.el.parentElement?.closest('sc-checkbox-group');
    forwardFocus(this.el, () => this.input);
    this.stopReset = onFormReset(this.el, () => (this.checked = !!this.input?.checked));
  }

  disconnectedCallback() {
    this.locale.disconnect();
    this.stopReset?.();
  }

  @Watch('checked')
  onCheckedChange() {
    if (this.input && this.input.checked !== this.checked) this.input.checked = this.checked;
  }

  private setInput = (el?: HTMLInputElement) => {
    // The initial state is what a form reset restores.
    if (el && !this.input) el.defaultChecked = this.checked;
    this.input = el;
  };

  private onChange = (ev: Event) => {
    this.checked = (ev.target as HTMLInputElement).checked;
    this.scChange.emit({ checked: this.checked, value: this.value });
  };

  render() {
    const { t } = this.locale;
    const id = this.uid;
    const { slotted } = this;
    const hasHint = !!this.hint || !!slotted.hint;
    const ownError = !this.inGroup && (!!this.error || !!slotted.error);
    const invalid = ownError || (this.inGroup && this.groupInvalid);

    return (
      <Host>
        <div class={{ 'sc-field': true, 'sc-checkbox': true, 'sc-field--error': ownError }}>
          {!this.inGroup && <FieldError id={`${id}-error`} text={this.error} rich={slotted.error} show={ownError} prefix={t('fieldErrorPrefix')} />}
          <div class="sc-choice">
            <span class="sc-choice__halo" aria-hidden="true" />
            <input
              ref={this.setInput}
              id={`${id}-control`}
              class={{ 'sc-choice__box': true, 'sc-choice__box--check': true, 'sc-choice__box--invalid': invalid }}
              type="checkbox"
              name={this.name || this.groupName}
              value={this.value}
              checked={this.checked}
              required={this.required && !this.inGroup}
              disabled={this.disabled}
              aria-describedby={describedBy(hasHint && `${id}-hint`, ownError && `${id}-error`)}
              aria-invalid={invalid ? 'true' : undefined}
              onChange={this.onChange}
            />
            <CheckMark class="sc-choice__mark sc-choice__mark--check" />
            <label class="sc-choice__label" htmlFor={`${id}-control`}>
              <slot />
            </label>
            <div id={`${id}-hint`} class="sc-choice__hint" hidden={!hasHint}>
              {slotted.hint ? <Moved node={slotted.hint} /> : this.hint}
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
