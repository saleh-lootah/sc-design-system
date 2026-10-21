import { AttachInternals, Component, Element, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { normaliseDigits } from '../../i18n/digits';
import { LocaleController } from '../../i18n/locale';
import { AlertCircle } from '../../icons/index'; // explicit /index: enables SVG rendering for this component (see CONTRIBUTING)
import { FieldError, FieldHint, FieldLabel, HeadingLevel, IDS, describedBy, emitNativeChange, hasSlotted, headingLevel, formSupported } from '../sc-text-input/field-v1';
import { DatePart, PARTS, Parts, isoFromParts, partsFromIso } from './date';

void AlertCircle;

const LABEL_KEYS = { day: 'dateInputDay', month: 'dateInputMonth', year: 'dateInputYear' } as const;
/** Character widths of each box (a little more than the digits, so they never feel cramped). */
const CHARS: Record<DatePart, number> = { day: 3, month: 3, year: 5 };

/**
 * A date people know, such as a date of birth or the date on a document: Day, Month and
 * Year boxes (يوم / شهر / سنة) with the numeric keyboard.
 *
 * A `<fieldset>` and `<legend>` with the hint and error, and three labelled native inputs,
 * in one shadow root. In Arabic the boxes run right to left (Day on the right). An error can
 * highlight one part with `error-parts="year"`.
 *
 * Form-associated: submits the date as an ISO string (`2026-03-07`, or empty while it isn't
 * a real date) under `name`, plus the raw parts as `name-day`, `name-month` and `name-year`
 * so a server can re-display what was typed. Reports `valueMissing` and `badInput`.
 * Delegates focus to the first box.
 *
 * @slot label - Rich legend content, instead of the `label` prop.
 * @slot hint - Rich hint content, instead of the `hint` prop.
 * @slot error - Rich error content, instead of the `error` prop.
 *
 * @part field - The `<fieldset>` (gets the error bar).
 * @part label - The `<legend>`.
 * @part hint - The hint.
 * @part error - The error message.
 * @part parts - The row of boxes.
 * @part part-label - The label above a box.
 * @part frame - The bordered box around an input.
 * @part control - A native `<input>`.
 */
@Component({
  tag: 'sc-date-input',
  styleUrl: 'sc-date-input.css',
  shadow: { delegatesFocus: true },
  formAssociated: true,
})
export class ScDateInput {
  @Element() el!: HTMLElement;

  @AttachInternals() internals!: ElementInternals;

  /** The question, shown as the legend: "When does your insurance start?". */
  @Prop() label?: string;

  /** Help text below the legend: "For example, 27 3 2026". */
  @Prop() hint?: string;

  /** The error message. Setting it shows the error state. */
  @Prop({ reflect: true }) error?: string;

  /**
   * Which boxes the error is about, space-separated: `"day"`, `"month year"`. Only those get
   * the error border and `aria-invalid`. When empty, an error highlights all three.
   */
  @Prop() errorParts?: string;

  /** Appends "(optional)" to the legend. */
  @Prop() optional = false;

  /** The name submitted with the form (with `-day`, `-month`, `-year` for the parts). */
  @Prop({ reflect: true }) name?: string;

  /** The date as an ISO string (`YYYY-MM-DD`). Empty while the boxes don't make a real date. */
  @Prop({ mutable: true }) value = '';

  /** Requires a date (`valueMissing` while every box is empty). */
  @Prop() required = false;

  /** Disables the boxes. Avoid it. */
  @Prop({ reflect: true }) disabled = false;

  /** Set to `bday` for a date of birth, so browsers can fill it (`bday-day`, `bday-month`, `bday-year`). */
  @Prop() autocomplete?: string;

  /** When set (1–6), the legend is also the page heading at this level. */
  @Prop() headingLevel?: HeadingLevel;

  /** Fires on every keystroke with `{ value, day, month, year }`. */
  @Event({ bubbles: true, composed: true }) scInput!: EventEmitter<{ value: string } & Parts>;

  /** Fires when a box is committed with `{ value, day, month, year }`. A native `change` is also dispatched on the host. */
  @Event({ bubbles: true, composed: true }) scChange!: EventEmitter<{ value: string } & Parts>;

  @State() formDisabled = false;
  @State() slots = { label: false, hint: false, error: false };
  @State() parts: Parts = { day: '', month: '', year: '' };

  private inputs: Partial<Record<DatePart, HTMLInputElement>> = {};
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
    this.parts = partsFromIso(this.value);
  }

  componentDidRender() {
    this.sync();
  }

  /** A value set from outside replaces the boxes; one computed from typing leaves them alone. */
  @Watch('value')
  onValueChange(next: string) {
    if ((next ?? '') !== isoFromParts(this.parts)) this.parts = partsFromIso(next);
  }

  formDisabledCallback(disabled: boolean) {
    this.formDisabled = disabled;
  }

  formResetCallback() {
    this.parts = partsFromIso(this.defaultValue);
    this.value = this.defaultValue;
  }

  formStateRestoreCallback(state: unknown) {
    if (state instanceof FormData && this.name) {
      this.parts = {
        day: String(state.get(`${this.name}-day`) ?? ''),
        month: String(state.get(`${this.name}-month`) ?? ''),
        year: String(state.get(`${this.name}-year`) ?? ''),
      };
      this.value = isoFromParts(this.parts);
    }
  }

  private sync() {
    if (!formSupported()) return;
    const { parts } = this;
    const iso = isoFromParts(parts);
    if (this.internals?.setFormValue) {
      if (this.name && typeof FormData !== 'undefined') {
        const data = new FormData();
        data.append(this.name, iso);
        for (const p of PARTS) data.append(`${this.name}-${p}`, parts[p]);
        this.internals.setFormValue(data);
      } else {
        this.internals.setFormValue(iso);
      }
    }
    if (!this.internals?.setValidity) return;
    const empty = PARTS.every((p) => !parts[p].trim());
    const firstEmpty = PARTS.find((p) => !parts[p].trim()) ?? 'day';
    if (empty && this.required && this.inputs.day) {
      this.internals.setValidity({ valueMissing: true }, this.locale.t('dateInputRequired'), this.inputs.day);
    } else if (!empty && !iso && this.inputs[firstEmpty]) {
      this.internals.setValidity({ badInput: true }, this.locale.t('dateInputInvalid'), this.inputs[firstEmpty]);
    } else {
      this.internals.setValidity({});
    }
  }

  private readSlots = () => {
    const next = { label: hasSlotted(this.el, 'label'), hint: hasSlotted(this.el, 'hint'), error: hasSlotted(this.el, 'error') };
    if (JSON.stringify(next) !== JSON.stringify(this.slots)) this.slots = next;
  };

  private detail() {
    return { value: this.value, ...this.parts };
  }

  private onInput = (part: DatePart) => (ev: Event) => {
    this.parts = { ...this.parts, [part]: normaliseDigits(ev.target as HTMLInputElement) };
    this.value = isoFromParts(this.parts);
    this.scInput.emit(this.detail());
  };

  private onChange = () => {
    this.scChange.emit(this.detail());
    emitNativeChange(this.el);
  };

  /** The parts the error is about. */
  private invalidParts(hasError: boolean): Set<DatePart> {
    if (!hasError) return new Set();
    const named = (this.errorParts ?? '').split(/[\s,]+/).filter((p): p is DatePart => (PARTS as string[]).includes(p));
    return new Set(named.length ? named : PARTS);
  }

  render() {
    const { t } = this.locale;
    const hasHint = !!this.hint || this.slots.hint;
    const hasError = !!this.error || this.slots.error;
    const disabled = this.disabled || this.formDisabled;
    const invalid = this.invalidParts(hasError);
    const auto = this.autocomplete && this.autocomplete !== 'off' ? this.autocomplete : undefined;

    return (
      <Host>
        <fieldset
          class={{ 'field': true, 'field--error': hasError }}
          part="field"
          role="group"
          aria-describedby={describedBy(hasHint && IDS.hint, hasError && IDS.error)}
          disabled={disabled}
         
        >
          <FieldLabel text={this.label} optional={this.optional} optionalText={t('optional')} level={headingLevel(this.headingLevel)} as="legend" />
          <FieldHint text={this.hint} show={hasHint} />
          <FieldError text={this.error} show={hasError} prefix={t('errorPrefix')} />
          <div class="parts" part="parts">
            {PARTS.map((p) => (
              <div class={`part part--${p}`}>
                <label class="part-label" htmlFor={p} part="part-label">
                  {t(LABEL_KEYS[p])}
                </label>
                <div
                  class={{ 'frame': true, 'frame--chars': true, 'frame--error': invalid.has(p), 'frame--disabled': disabled }}
                  style={{ '--_chars': String(CHARS[p]) }}
                  part="frame"
                >
                  <input
                    ref={(el) => (this.inputs[p] = el)}
                    id={p}
                    class="control"
                    part="control"
                    type="text"
                    inputMode="numeric"
                    autoComplete={auto ? `${auto}-${p}` : 'off'}
                    spellcheck={false}
                    value={this.parts[p]}
                    disabled={disabled}
                    aria-invalid={invalid.has(p) ? 'true' : undefined}
                    onInput={this.onInput(p)}
                    onChange={this.onChange}
                  />
                </div>
              </div>
            ))}
          </div>
        </fieldset>
      </Host>
    );
  }
}
