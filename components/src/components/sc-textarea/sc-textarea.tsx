import { AttachInternals, Component, Element, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { LocaleController } from '../../i18n/locale';
import type { StringKey } from '../../i18n/strings';
import { AlertCircle } from '../../icons/index'; // explicit /index: enables SVG rendering for this component (see CONTRIBUTING)
import { FieldError, FieldHint, FieldLabel, HeadingLevel, IDS, describedBy, emitNativeChange, hasSlotted, headingLevel, mirrorValidity, formSupported } from '../sc-text-input/field';

void AlertCircle;

/** How long typing must pause before the count is announced to screen readers. */
const COUNT_ANNOUNCE_DELAY = 1000;

type Plural = 'Zero' | 'One' | 'Two' | 'Few' | 'Many' | 'Other';

/**
 * A longer answer, such as a reason or a description, with an optional character count.
 *
 * Renders its own label, hint, error, native `<textarea>` and count in one shadow root.
 * The count is shown as you type, but announced to screen readers politely, once typing
 * pauses, never on every keystroke. Form-associated and delegates focus, like `sc-text-input`.
 *
 * @slot label - Rich label content, instead of the `label` prop.
 * @slot hint - Rich hint content, instead of the `hint` prop.
 * @slot error - Rich error content, instead of the `error` prop.
 *
 * @part field - The field group (gets the error bar).
 * @part label - The `<label>`.
 * @part hint - The hint.
 * @part error - The error message.
 * @part frame - The bordered box around the textarea.
 * @part control - The native `<textarea>`.
 * @part count - The visible character count.
 */
@Component({
  tag: 'sc-textarea',
  styleUrl: 'sc-textarea.css',
  shadow: { delegatesFocus: true },
  formAssociated: true,
})
export class ScTextarea {
  @Element() el!: HTMLElement;

  @AttachInternals() internals!: ElementInternals;

  /** The visible label: "Why are you cancelling your registration?" */
  @Prop() label?: string;

  /** Help text below the label. */
  @Prop() hint?: string;

  /** The error message. Setting it shows the error state (bar, border, icon, "Error:", `aria-invalid`). */
  @Prop({ reflect: true }) error?: string;

  /** Appends "(optional)" to the label. */
  @Prop() optional = false;

  /** The name submitted with the form. */
  @Prop({ reflect: true }) name?: string;

  /** The value. Updated as the user types. */
  @Prop({ mutable: true }) value = '';

  /** Makes the field required for native validation (`valueMissing`). */
  @Prop() required = false;

  /** Disables the field. Avoid it. */
  @Prop({ reflect: true }) disabled = false;

  /** Makes the value read-only. */
  @Prop() readonly = false;

  /** Visible height in lines. */
  @Prop() rows = 5;

  /**
   * Shows a character count for this limit: "You have 120 characters remaining". People can
   * type past it (the count then says how many to remove and the field reports `tooLong`),
   * which is easier to fix than text that silently stops.
   */
  @Prop() maxlength?: number;

  /** Autofill hint. */
  @Prop() autocomplete?: string;

  /** When set (1–6), the label is also the page heading at this level. */
  @Prop() headingLevel?: HeadingLevel;

  /** Fires on every keystroke with `{ value }`. */
  @Event({ bubbles: true, composed: true }) scInput!: EventEmitter<{ value: string }>;

  /** Fires when the value is committed with `{ value }`. A native `change` is also dispatched on the host. */
  @Event({ bubbles: true, composed: true }) scChange!: EventEmitter<{ value: string }>;

  @State() formDisabled = false;
  @State() slots = { label: false, hint: false, error: false };
  /** The text in the polite live region. Updated only after typing pauses. */
  @State() announcement = '';

  private textarea?: HTMLTextAreaElement;
  private defaultValue = '';
  private timer?: ReturnType<typeof setTimeout>;
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
    clearTimeout(this.timer);
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
    if (this.textarea && this.textarea.value !== (this.value ?? '')) this.textarea.value = this.value ?? '';
  }

  formDisabledCallback(disabled: boolean) {
    this.formDisabled = disabled;
  }

  formResetCallback() {
    this.value = this.defaultValue;
    this.announcement = '';
  }

  formStateRestoreCallback(state: string | null) {
    if (typeof state === 'string') this.value = state;
  }

  private get limit(): number {
    const n = Number(this.maxlength);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  }

  private get length(): number {
    // Count user-perceived characters, so an emoji or an Arabic letter with marks is not "2".
    return Array.from(this.value ?? '').length;
  }

  private sync() {
    if (!formSupported()) return;
    this.internals?.setFormValue?.(this.value ?? '');
    const over = this.limit ? this.length - this.limit : 0;
    if (over > 0 && this.internals?.setValidity && this.textarea) {
      this.internals.setValidity({ tooLong: true }, this.countMessage(), this.textarea);
    } else {
      mirrorValidity(this.internals, this.textarea);
    }
  }

  private plural(n: number): Plural {
    if (this.locale.lang === 'ar') {
      const cat = new Intl.PluralRules('ar').select(n);
      return (cat.charAt(0).toUpperCase() + cat.slice(1)) as Plural;
    }
    if (n === 0) return 'Zero';
    return n === 1 ? 'One' : 'Many';
  }

  /** "You have 120 characters remaining" / "يتبقى لديك 120 حرفًا", or the "too many" form. */
  private countMessage(): string {
    const left = this.limit - this.length;
    if (left >= 0) return this.locale.t(`textareaRemaining${this.plural(left)}` as StringKey, { count: left });
    const over = -left;
    const form = this.plural(over);
    return this.locale.t(`textareaOver${form === 'Zero' ? 'Other' : form}` as StringKey, { count: over });
  }

  private readSlots = () => {
    const next = { label: hasSlotted(this.el, 'label'), hint: hasSlotted(this.el, 'hint'), error: hasSlotted(this.el, 'error') };
    if (JSON.stringify(next) !== JSON.stringify(this.slots)) this.slots = next;
  };

  private onInput = (ev: Event) => {
    this.value = (ev.target as HTMLTextAreaElement).value;
    this.scInput.emit({ value: this.value });
    if (this.limit) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => (this.announcement = this.countMessage()), COUNT_ANNOUNCE_DELAY);
    }
  };

  private onChange = () => {
    this.scChange.emit({ value: this.value });
    emitNativeChange(this.el);
  };

  render() {
    const { t } = this.locale;
    const hasHint = !!this.hint || this.slots.hint;
    const hasError = !!this.error || this.slots.error;
    const disabled = this.disabled || this.formDisabled;
    const limit = this.limit;
    const over = limit > 0 && this.length > limit;

    return (
      <Host>
        <div class={{ 'field': true, 'field--error': hasError }} part="field">
          <FieldLabel text={this.label} optional={this.optional} optionalText={t('optional')} level={headingLevel(this.headingLevel)} as="label" htmlFor={IDS.control} />
          <FieldHint text={this.hint} show={hasHint} />
          <FieldError text={this.error} show={hasError} prefix={t('errorPrefix')} />
          <div class={{ 'frame': true, 'frame--area': true, 'frame--error': hasError || over, 'frame--disabled': disabled }} part="frame">
            <textarea
              ref={(el) => (this.textarea = el)}
              id={IDS.control}
              class="control"
              part="control"
              rows={this.rows}
              value={this.value ?? ''}
              required={this.required}
              disabled={disabled}
              readOnly={this.readonly}
              autoComplete={this.autocomplete}
              aria-describedby={describedBy(hasHint && IDS.hint, hasError && IDS.error, limit > 0 && 'limit')}
              aria-invalid={hasError || over ? 'true' : undefined}
              onInput={this.onInput}
              onChange={this.onChange}
            />
          </div>
          {limit > 0 && [
            <span id="limit" class="visually-hidden">
              {t('textareaLimit', { max: limit })}
            </span>,
            <p class={{ 'count': true, 'count--over': over }} part="count" aria-hidden="true">
              {this.countMessage()}
            </p>,
          ]}
          <span class="visually-hidden" aria-live="polite" aria-atomic="true">
            {this.announcement}
          </span>
        </div>
      </Host>
    );
  }
}
