import { Component, Element, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { normaliseDigits } from '../../i18n/digits';
import { LocaleController } from '../../i18n/controller';
import { FieldError, FieldHint, FieldLabel, HeadingLevel, Moved, Slotted, describedBy, forwardFocus, headingLevel, nextId, onFormReset, takeSlotted, withField } from './field';

export type TextInputType = 'text' | 'email' | 'tel' | 'url' | 'search' | 'password';
export type TextInputWidth = 'full' | '2' | '3' | '4' | '5' | '10' | '20';

const WIDTHS: readonly string[] = ['2', '3', '4', '5', '10', '20'];
const strings = withField();

/**
 * A single-line answer, such as a plate number, an email address or a phone number.
 *
 * v2 renders its label, hint, error and a native `<input>` in light DOM (Stencil `scoped`,
 * decision A2). The input is a real form control: it submits under `name`, Enter submits the
 * form through its default button, and validation, reset, autofill and `<fieldset disabled>`
 * are native. `focus()` on the host reaches the input, so an error-summary link to the host's
 * `id` works. Styles: the classes `.sc-field`, `.sc-field__label`, `.sc-field__frame`,
 * `.sc-field__control` (no `::part()`).
 *
 * Rich content: a child element with `slot="label"`, `slot="hint"`, `slot="error"`,
 * `slot="prefix"` or `slot="suffix"` is moved into place once, when the component loads.
 */
@Component({
  tag: 'sc-text-input',
  styleUrls: ['field.css', 'sc-text-input.css'],
  scoped: true,
})
export class ScTextInput {
  @Element() el!: HTMLElement;

  /** The visible label. Write it as the question or the thing to enter: "Plate number". */
  @Prop() label?: string;

  /** Help text below the label: "Up to 5 digits, for example 12345". */
  @Prop() hint?: string;

  /**
   * The error message. Setting it shows the error state: a 4px error bar at inline-start, a
   * 2px error edge on the box, the message with an icon and a visually hidden "Error:", and
   * `aria-invalid`. Say what to do: "Enter numbers only, like 12345".
   */
  @Prop({ reflect: true }) error?: string;

  /** Appends "(optional)" to the label. Required fields are not marked. */
  @Prop() optional = false;

  /** The name submitted with the form. */
  @Prop({ reflect: true }) name?: string;

  /** The value. Updated as the user types. */
  @Prop({ mutable: true }) value = '';

  /** Makes the field required for native constraint validation (`valueMissing`). Not shown visually. */
  @Prop() required = false;

  /** Disables the field. Avoid it: say why something can't be changed instead. */
  @Prop({ reflect: true }) disabled = false;

  /** Makes the value read-only (still focusable and submitted). */
  @Prop() readonly = false;

  /** The input type. Use `text` for numbers such as plate numbers, with `inputmode="numeric"`. */
  @Prop() type: TextInputType = 'text';

  /**
   * The width of the box: `full` (default) or the number of characters the answer needs
   * (`2`, `3`, `4`, `5`, `10`, `20`). Matching the width to the answer helps people fill it in.
   */
  @Prop({ reflect: true }) width: TextInputWidth = 'full';

  /**
   * Keeps the value left-to-right (plates, phone numbers, emails, references). In Arabic the
   * value still sits at the start (right) of the box. Use this, not `dir` on the host.
   */
  @Prop({ reflect: true }) ltr = false;

  /** Text before the value inside the box, such as "AED". */
  @Prop() prefixText?: string;

  /** Text after the value inside the box, such as "km". */
  @Prop() suffixText?: string;

  /** The virtual keyboard: `numeric` for digits, `email`, `tel`, … */
  @Prop() inputmode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';

  /** Autofill hint, for example `email`, `tel` or `off`. */
  @Prop() autocomplete?: string;

  /** Maximum length for native validation (`tooLong`). Prefer telling people in the hint. */
  @Prop() maxlength?: number;

  /** Minimum length for native validation (`tooShort`). */
  @Prop() minlength?: number;

  /** A regular expression the value must match (`patternMismatch`). */
  @Prop() pattern?: string;

  /** When set (1–6), the label is also the page heading at this level (`<h1><label>…</label></h1>`). */
  @Prop() headingLevel?: HeadingLevel;

  /** Fires on every keystroke with `{ value }`. The native `input` event also bubbles from the input. */
  @Event({ bubbles: true, composed: true }) scInput!: EventEmitter<{ value: string }>;

  /** Fires when the value is committed (blur after a change) with `{ value }`. The native `change` event also bubbles from the input. */
  @Event({ bubbles: true, composed: true }) scChange!: EventEmitter<{ value: string }>;

  @State() slotted: Slotted = {};

  private uid = nextId('sc-text-input');
  private input?: HTMLInputElement;
  private locale = new LocaleController(this, strings);
  private stopReset?: () => void;

  connectedCallback() {
    this.locale.connect();
    this.slotted = takeSlotted(this.el, ['label', 'hint', 'error', 'prefix', 'suffix'], this.slotted);
    forwardFocus(this.el, () => this.input);
    this.stopReset = onFormReset(this.el, () => (this.value = this.input?.value ?? ''));
  }

  disconnectedCallback() {
    this.locale.disconnect();
    this.stopReset?.();
  }

  componentWillLoad() {
    this.value = this.value ?? '';
  }

  @Watch('value')
  onValueChange() {
    if (this.input && this.input.value !== (this.value ?? '')) this.input.value = this.value ?? '';
  }

  private setInput = (el?: HTMLInputElement) => {
    // The value the page loaded with is what a form reset restores.
    if (el && !this.input) el.defaultValue = this.value ?? '';
    this.input = el;
  };

  private onInput = (ev: Event) => {
    this.value = normaliseDigits(ev.target as HTMLInputElement);
    this.scInput.emit({ value: this.value });
  };

  private onChange = () => {
    this.scChange.emit({ value: this.value });
  };

  render() {
    const { t } = this.locale;
    const id = this.uid;
    const { slotted } = this;
    const hasHint = !!this.hint || !!slotted.hint;
    const hasError = !!this.error || !!slotted.error;
    const hasPrefix = !!this.prefixText || !!slotted.prefix;
    const hasSuffix = !!this.suffixText || !!slotted.suffix;
    const chars = WIDTHS.includes(String(this.width)) ? Number(this.width) : 0;

    return (
      <Host>
        <div class={{ 'sc-field': true, 'sc-field--error': hasError }}>
          <FieldLabel id={`${id}-label`} htmlFor={`${id}-control`} text={this.label} rich={slotted.label} optional={this.optional} optionalText={t('fieldOptional')} level={headingLevel(this.headingLevel)} as="label" />
          <FieldHint id={`${id}-hint`} text={this.hint} rich={slotted.hint} show={hasHint} />
          <FieldError id={`${id}-error`} text={this.error} rich={slotted.error} show={hasError} prefix={t('fieldErrorPrefix')} />
          <div
            class={{ 'sc-field__frame': true, 'sc-field__frame--error': hasError, 'sc-field__frame--chars': chars > 0 }}
            style={chars ? { '--_chars': String(chars + (hasPrefix || hasSuffix ? 4 : 0)) } : undefined}
          >
            {hasPrefix && (
              <span class="sc-field__affix sc-field__affix--prefix" id={`${id}-prefix`}>
                {slotted.prefix ? <Moved node={slotted.prefix} /> : this.prefixText}
              </span>
            )}
            <input
              ref={this.setInput}
              id={`${id}-control`}
              class={{ 'sc-field__control': true, 'sc-field__control--ltr': this.ltr }}
              type={this.type}
              name={this.name}
              value={this.value ?? ''}
              dir={this.ltr ? 'ltr' : undefined}
              spellcheck={this.ltr ? false : undefined}
              autocapitalize={this.ltr ? 'off' : undefined}
              required={this.required}
              disabled={this.disabled}
              readOnly={this.readonly}
              inputMode={this.inputmode}
              autoComplete={this.autocomplete}
              maxLength={this.maxlength}
              minLength={this.minlength}
              pattern={this.pattern}
              aria-describedby={describedBy(hasHint && `${id}-hint`, hasError && `${id}-error`, hasPrefix && `${id}-prefix`, hasSuffix && `${id}-suffix`)}
              aria-invalid={hasError ? 'true' : undefined}
              onInput={this.onInput}
              onChange={this.onChange}
            />
            {hasSuffix && (
              <span class="sc-field__affix sc-field__affix--suffix" id={`${id}-suffix`}>
                {slotted.suffix ? <Moved node={slotted.suffix} /> : this.suffixText}
              </span>
            )}
          </div>
        </div>
      </Host>
    );
  }
}
