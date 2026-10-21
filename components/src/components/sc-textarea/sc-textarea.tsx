import { Component, Element, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { normaliseDigits } from '../../i18n/digits';
import { LocaleController } from '../../i18n/controller';
import textareaStrings from '../../i18n/components/sc-textarea';
import { FieldError, FieldHint, FieldLabel, HeadingLevel, Slotted, describedBy, forwardFocus, headingLevel, nextId, onFormReset, takeSlotted, withField } from '../sc-text-input/field';

/** How long typing must pause before the count is announced to screen readers. */
const COUNT_ANNOUNCE_DELAY = 1000;

type Plural = 'Zero' | 'One' | 'Two' | 'Few' | 'Many' | 'Other';
const strings = withField(textareaStrings);
type Key = keyof typeof strings.en;

/**
 * A longer answer, such as a reason or a description, with an optional character count.
 *
 * v2 renders its label, hint, error, a native `<textarea>` and the count in light DOM
 * (Stencil `scoped`, decision A2), so the textarea is a real form control. The count is shown
 * as you type but announced politely only once typing pauses. People can type past the limit:
 * the count then says how many characters to remove and the textarea reports a custom
 * validity error, which is easier to fix than text that silently stops.
 *
 * Rich content: a child with `slot="label"`, `slot="hint"` or `slot="error"` is moved into place once.
 */
@Component({
  tag: 'sc-textarea',
  styleUrls: ['../sc-text-input/field.css', 'sc-textarea.css'],
  scoped: true,
})
export class ScTextarea {
  @Element() el!: HTMLElement;

  /** The visible label: "Why are you cancelling your registration?" */
  @Prop() label?: string;

  /** Help text below the label. */
  @Prop() hint?: string;

  /** The error message. Setting it shows the error state (bar, edge, icon, "Error:", `aria-invalid`). */
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

  /** Visible height in lines (at least 3). */
  @Prop() rows = 5;

  /**
   * Shows a character count for this limit: "You have 120 characters remaining". People can
   * type past it; the count then says how many to remove and the field is invalid.
   */
  @Prop() maxlength?: number;

  /** Autofill hint. */
  @Prop() autocomplete?: string;

  /** When set (1–6), the label is also the page heading at this level. */
  @Prop() headingLevel?: HeadingLevel;

  /** Fires on every keystroke with `{ value }`. The native `input` event also bubbles. */
  @Event({ bubbles: true, composed: true }) scInput!: EventEmitter<{ value: string }>;

  /** Fires when the value is committed with `{ value }`. The native `change` event also bubbles. */
  @Event({ bubbles: true, composed: true }) scChange!: EventEmitter<{ value: string }>;

  @State() slotted: Slotted = {};
  /** The text in the polite live region. Updated only after typing pauses. */
  @State() announcement = '';

  private uid = nextId('sc-textarea');
  private textarea?: HTMLTextAreaElement;
  private timer?: ReturnType<typeof setTimeout>;
  private locale = new LocaleController(this, strings);
  private stopReset?: () => void;

  connectedCallback() {
    this.locale.connect();
    this.slotted = takeSlotted(this.el, ['label', 'hint', 'error'], this.slotted);
    forwardFocus(this.el, () => this.textarea);
    this.stopReset = onFormReset(this.el, () => {
      this.value = this.textarea?.value ?? '';
      this.announcement = '';
    });
  }

  disconnectedCallback() {
    this.locale.disconnect();
    this.stopReset?.();
    clearTimeout(this.timer);
  }

  componentWillLoad() {
    this.value = this.value ?? '';
  }

  componentDidRender() {
    // Over the limit is a validity error on the textarea itself, so the form won't submit.
    const over = this.limit > 0 && this.length > this.limit;
    this.textarea?.setCustomValidity?.(over ? this.countMessage() : '');
  }

  @Watch('value')
  onValueChange() {
    if (this.textarea && this.textarea.value !== (this.value ?? '')) this.textarea.value = this.value ?? '';
  }

  private get limit(): number {
    const n = Number(this.maxlength);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  }

  private get length(): number {
    // User-perceived characters, so an emoji is not "2".
    return Array.from(this.value ?? '').length;
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
    if (left >= 0) return this.locale.t(`textareaRemaining${this.plural(left)}` as Key, { count: left });
    const form = this.plural(-left);
    return this.locale.t(`textareaOver${form === 'Zero' ? 'Other' : form}` as Key, { count: -left });
  }

  private setTextarea = (el?: HTMLTextAreaElement) => {
    if (el && !this.textarea) el.defaultValue = this.value ?? '';
    this.textarea = el;
  };

  private onInput = (ev: Event) => {
    this.value = normaliseDigits(ev.target as HTMLTextAreaElement);
    this.scInput.emit({ value: this.value });
    if (this.limit) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => (this.announcement = this.countMessage()), COUNT_ANNOUNCE_DELAY);
    }
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
    const limit = this.limit;
    const over = limit > 0 && this.length > limit;

    return (
      <Host>
        <div class={{ 'sc-field': true, 'sc-field--error': hasError }}>
          <FieldLabel id={`${id}-label`} htmlFor={`${id}-control`} text={this.label} rich={slotted.label} optional={this.optional} optionalText={t('fieldOptional')} level={headingLevel(this.headingLevel)} as="label" />
          <FieldHint id={`${id}-hint`} text={this.hint} rich={slotted.hint} show={hasHint} />
          <FieldError id={`${id}-error`} text={this.error} rich={slotted.error} show={hasError} prefix={t('fieldErrorPrefix')} />
          <div class={{ 'sc-field__frame': true, 'sc-textarea__frame': true, 'sc-field__frame--error': hasError || over }}>
            <textarea
              ref={this.setTextarea}
              id={`${id}-control`}
              class="sc-field__control sc-textarea__control"
              name={this.name}
              rows={Math.max(3, Number(this.rows) || 5)}
              value={this.value ?? ''}
              required={this.required}
              disabled={this.disabled}
              readOnly={this.readonly}
              autoComplete={this.autocomplete}
              aria-describedby={describedBy(hasHint && `${id}-hint`, hasError && `${id}-error`, limit > 0 && `${id}-limit`)}
              aria-invalid={hasError || over ? 'true' : undefined}
              onInput={this.onInput}
              onChange={this.onChange}
            />
          </div>
          {limit > 0 && [
            <span id={`${id}-limit`} class="visually-hidden">
              {t('textareaLimit', { max: limit })}
            </span>,
            <p class={{ 'sc-textarea__count': true, 'sc-textarea__count--over': over }} aria-hidden="true">
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
