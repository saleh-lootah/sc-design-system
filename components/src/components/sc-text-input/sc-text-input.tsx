import { AttachInternals, Component, Element, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { normaliseDigits } from '../../i18n/digits';
import { LocaleController } from '../../i18n/locale';
import { AlertCircle } from '../../icons/index'; // explicit /index: enables SVG rendering for this component (see CONTRIBUTING)
import { FieldError, FieldHint, FieldLabel, HeadingLevel, IDS, describedBy, emitNativeChange, hasSlotted, headingLevel, mirrorValidity, formSupported } from './field';

export type TextInputType = 'text' | 'email' | 'tel' | 'url' | 'search' | 'password';
export type TextInputWidth = 'full' | '2' | '3' | '4' | '5' | '10' | '20';

const WIDTHS: readonly string[] = ['2', '3', '4', '5', '10', '20'];
void AlertCircle;

/**
 * A single-line answer, such as a plate number, an email address or a phone number.
 *
 * Renders its own label, hint, error and native `<input>` in one shadow root, so the
 * label and `aria-describedby` work. The host is form-associated (it submits `value`
 * under `name`, resets, and reports validity from the inner input) and delegates focus,
 * so an error-summary link to the host's `id` focuses the input.
 *
 * @slot label - Rich label content, instead of the `label` prop.
 * @slot hint - Rich hint content (for example with a link), instead of the `hint` prop.
 * @slot error - Rich error content, instead of the `error` prop.
 * @slot prefix - Content before the value inside the box, instead of `prefix-text`.
 * @slot suffix - Content after the value inside the box, instead of `suffix-text`.
 *
 * @part field - The field group (gets the error bar).
 * @part label - The `<label>`.
 * @part hint - The hint.
 * @part error - The error message.
 * @part frame - The bordered box around the input, prefix and suffix.
 * @part control - The native `<input>`.
 * @part prefix - The prefix box.
 * @part suffix - The suffix box.
 */
@Component({
  tag: 'sc-text-input',
  styleUrl: 'sc-text-input.css',
  shadow: { delegatesFocus: true },
  formAssociated: true,
})
export class ScTextInput {
  @Element() el!: HTMLElement;

  @AttachInternals() internals!: ElementInternals;

  /** The visible label. Write it as the question or the thing to enter: "Plate number". */
  @Prop() label?: string;

  /** Help text below the label: "Up to 5 digits, for example 12345". */
  @Prop() hint?: string;

  /**
   * The error message. Setting it shows the error state: a 3px error bar on the start side,
   * an error border on the input, the message with an icon and a visually hidden "Error:",
   * and `aria-invalid`. Say what to do: "Enter numbers only, like 12345".
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
   * value still sits at the start (right) of the box. Use this, not `dir` on the host, which
   * would flip the label and hint too.
   */
  @Prop({ reflect: true }) ltr = false;

  /** Text before the value inside the box, such as "AED". (Named `prefixText` because `prefix` is a reserved DOM property.) */
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

  /** Fires on every keystroke with `{ value }`. The native `input` event also reaches the host. */
  @Event({ bubbles: true, composed: true }) scInput!: EventEmitter<{ value: string }>;

  /** Fires when the value is committed (blur after a change) with `{ value }`. A native `change` event is also dispatched on the host. */
  @Event({ bubbles: true, composed: true }) scChange!: EventEmitter<{ value: string }>;

  @State() formDisabled = false;
  @State() slots = { label: false, hint: false, error: false, prefix: false, suffix: false };

  private input?: HTMLInputElement;
  private defaultValue = '';
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

  componentWillLoad() {
    this.value = this.value ?? '';
    this.defaultValue = this.value;
  }

  componentDidRender() {
    this.sync();
  }

  @Watch('value')
  onValueChange() {
    if (this.input && this.input.value !== (this.value ?? '')) this.input.value = this.value ?? '';
  }

  /** Form-associated lifecycle: a `<fieldset disabled>` ancestor or `disabled` changed. */
  formDisabledCallback(disabled: boolean) {
    this.formDisabled = disabled;
  }

  /** Form-associated lifecycle: the form was reset. */
  formResetCallback() {
    this.value = this.defaultValue;
  }

  /** Form-associated lifecycle: the browser restored the value (back/forward cache, autofill). */
  formStateRestoreCallback(state: string | null) {
    if (typeof state === 'string') this.value = state;
  }

  private sync() {
    if (!formSupported()) return;
    this.internals?.setFormValue?.(this.value ?? '');
    mirrorValidity(this.internals, this.input);
  }

  private readSlots = () => {
    const el = this.el;
    const next = {
      label: hasSlotted(el, 'label'),
      hint: hasSlotted(el, 'hint'),
      error: hasSlotted(el, 'error'),
      prefix: hasSlotted(el, 'prefix'),
      suffix: hasSlotted(el, 'suffix'),
    };
    if (JSON.stringify(next) !== JSON.stringify(this.slots)) this.slots = next;
  };

  private onInput = (ev: Event) => {
    this.value = normaliseDigits(ev.target as HTMLInputElement);
    this.scInput.emit({ value: this.value });
  };

  private onChange = () => {
    this.scChange.emit({ value: this.value });
    emitNativeChange(this.el);
  };

  render() {
    const { t } = this.locale;
    const hasHint = !!this.hint || this.slots.hint;
    const hasError = !!this.error || this.slots.error;
    const hasPrefix = !!this.prefixText || this.slots.prefix;
    const hasSuffix = !!this.suffixText || this.slots.suffix;
    const chars = WIDTHS.includes(String(this.width)) ? Number(this.width) : 0;
    const disabled = this.disabled || this.formDisabled;

    return (
      <Host>
        <div class={{ 'field': true, 'field--error': hasError }} part="field">
          <FieldLabel text={this.label} optional={this.optional} optionalText={t('optional')} level={headingLevel(this.headingLevel)} as="label" htmlFor={IDS.control} />
          <FieldHint text={this.hint} show={hasHint} />
          <FieldError text={this.error} show={hasError} prefix={t('errorPrefix')} />
          <div
            class={{ 'frame': true, 'frame--error': hasError, 'frame--disabled': disabled, 'frame--chars': chars > 0 }}
            style={chars ? { '--_chars': String(chars + (hasPrefix || hasSuffix ? 4 : 0)) } : undefined}
            part="frame"
          >
            <span class={{ 'affix': true, 'affix--prefix': true, 'affix--empty': !hasPrefix }} id="prefix" part="prefix">
              <slot name="prefix">{this.prefixText}</slot>
            </span>
            <input
              ref={(el) => (this.input = el)}
              id={IDS.control}
              class={{ 'control': true, 'control--ltr': this.ltr }}
              part="control"
              type={this.type}
              value={this.value ?? ''}
              dir={this.ltr ? 'ltr' : undefined}
              spellcheck={this.ltr ? false : undefined}
              autocapitalize={this.ltr ? 'off' : undefined}
              required={this.required}
              disabled={disabled}
              readOnly={this.readonly}
              inputMode={this.inputmode}
              autoComplete={this.autocomplete}
              maxLength={this.maxlength}
              minLength={this.minlength}
              pattern={this.pattern}
              aria-describedby={describedBy(hasHint && IDS.hint, hasError && IDS.error, hasPrefix && 'prefix', hasSuffix && 'suffix')}
              aria-invalid={hasError ? 'true' : undefined}
              onInput={this.onInput}
              onChange={this.onChange}
            />
            <span class={{ 'affix': true, 'affix--suffix': true, 'affix--empty': !hasSuffix }} id="suffix" part="suffix">
              <slot name="suffix">{this.suffixText}</slot>
            </span>
          </div>
        </div>
      </Host>
    );
  }
}
