import { Component, Element, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { LocaleController } from '../../i18n/controller';
import { ExpandMore, FieldError, FieldHint, FieldLabel, HeadingLevel, Slotted, adoptChildren, describedBy, forwardFocus, headingLevel, nextId, onFormReset, takeSlotted, withField } from '../sc-text-input/field';

const strings = withField();
const isOption = (el: Element) => el.localName === 'option' || el.localName === 'optgroup';

/**
 * One choice from a list too long for radios, such as the emirate that issued a plate.
 *
 * v2 renders a native `<select>` in light DOM (Stencil `scoped`, decision A2), styled like
 * `sc-text-input` with an `expand_more` chevron. Write the options as `<option>` (and
 * `<optgroup>`) children: they are moved INTO the native select, so they are the real options
 * (no copies), and options added later are moved in too. The select submits, resets, validates
 * and follows `<fieldset disabled>` natively; `focus()` on the host reaches it.
 *
 * @slot - `<option>` and `<optgroup>` elements.
 */
@Component({
  tag: 'sc-select',
  styleUrls: ['../sc-text-input/field.css', 'sc-select.css'],
  scoped: true,
})
export class ScSelect {
  @Element() el!: HTMLElement;

  /** The visible label: "Issuing authority". */
  @Prop() label?: string;

  /** Help text below the label. */
  @Prop() hint?: string;

  /** The error message. Setting it shows the error state. */
  @Prop({ reflect: true }) error?: string;

  /** Appends "(optional)" to the label. */
  @Prop() optional = false;

  /** The name submitted with the form. */
  @Prop({ reflect: true }) name?: string;

  /** The selected value. Defaults to the `<option selected>`, else the first option. */
  @Prop({ mutable: true }) value?: string;

  /** Requires a choice. Make the first option a placeholder with `value=""` ("Select an emirate"). */
  @Prop() required = false;

  /** Disables the field. Avoid it. */
  @Prop({ reflect: true }) disabled = false;

  /** Autofill hint, for example `country-name`. */
  @Prop() autocomplete?: string;

  /** When set (1–6), the label is also the page heading at this level. */
  @Prop() headingLevel?: HeadingLevel;

  /** Fires when the selection changes with `{ value }`. The native `change` and `input` events also bubble. */
  @Event({ bubbles: true, composed: true }) scChange!: EventEmitter<{ value: string }>;

  @State() slotted: Slotted = {};

  private uid = nextId('sc-select');
  private select?: HTMLSelectElement;
  private observer?: MutationObserver;
  private locale = new LocaleController(this, strings);
  private stopReset?: () => void;

  connectedCallback() {
    this.locale.connect();
    this.slotted = takeSlotted(this.el, ['label', 'hint', 'error'], this.slotted);
    forwardFocus(this.el, () => this.select);
    this.stopReset = onFormReset(this.el, () => (this.value = this.select?.value ?? ''));
    this.observer = adoptChildren(this.el, () => this.select, isOption, () => this.syncValue());
  }

  disconnectedCallback() {
    this.locale.disconnect();
    this.stopReset?.();
    this.observer?.disconnect();
  }

  componentDidLoad() {
    const select = this.select;
    if (!select?.options) return; // the spec-test DOM has no HTMLSelectElement API
    // Moving the options in can leave the last one selected; choose as the parser would:
    // the option with `selected`, else the first enabled one.
    const options = Array.from(select.options);
    const initial = options.find((o) => o.defaultSelected) ?? options.find((o) => !o.disabled);
    if (initial) initial.selected = true;
    if (this.value != null) {
      // A `value` set on the host chooses the option and becomes what a reset restores.
      const match = Array.from(select.options).find((o) => o.value === this.value);
      if (match && !Array.from(select.options).some((o) => o.defaultSelected)) match.defaultSelected = true;
    }
    this.syncValue();
  }

  @Watch('value')
  onValueChange() {
    this.syncValue();
  }

  /** Shows `value` in the select, or adopts the select's own choice when `value` is unset. */
  private syncValue() {
    const select = this.select;
    if (!select?.options) return;
    if (this.value == null) this.value = select.value;
    else if (select.value !== this.value) select.value = this.value;
  }

  private onChange = (ev: Event) => {
    this.value = (ev.target as HTMLSelectElement).value;
    this.scChange.emit({ value: this.value });
  };

  render() {
    const { t } = this.locale;
    const id = this.uid;
    const { slotted } = this;
    const hasHint = !!this.hint || !!slotted.hint;
    const hasError = !!this.error || !!slotted.error;

    return (
      <Host>
        <div class={{ 'sc-field': true, 'sc-field--error': hasError }}>
          <FieldLabel id={`${id}-label`} htmlFor={`${id}-control`} text={this.label} rich={slotted.label} optional={this.optional} optionalText={t('fieldOptional')} level={headingLevel(this.headingLevel)} as="label" />
          <FieldHint id={`${id}-hint`} text={this.hint} rich={slotted.hint} show={hasHint} />
          <FieldError id={`${id}-error`} text={this.error} rich={slotted.error} show={hasError} prefix={t('fieldErrorPrefix')} />
          <div class={{ 'sc-field__frame': true, 'sc-select__frame': true, 'sc-field__frame--error': hasError }}>
            <select
              ref={(el) => (this.select = el)}
              id={`${id}-control`}
              class="sc-field__control sc-select__control"
              name={this.name}
              required={this.required}
              disabled={this.disabled}
              autoComplete={this.autocomplete}
              aria-describedby={describedBy(hasHint && `${id}-hint`, hasError && `${id}-error`)}
              aria-invalid={hasError ? 'true' : undefined}
              onChange={this.onChange}
            >
              <slot />
            </select>
            <ExpandMore class="sc-select__chevron" />
          </div>
        </div>
      </Host>
    );
  }
}
