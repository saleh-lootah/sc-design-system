import { Component, Element, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { normaliseDigits } from '../../i18n/digits';
import { LocaleController } from '../../i18n/controller';
import dateStrings from '../../i18n/components/sc-date-input';
import { FieldError, FieldHint, FieldLabel, HeadingLevel, Slotted, describedBy, forwardFocus, headingLevel, nextId, onFormReset, takeSlotted, withField } from '../sc-text-input/field';
import { DatePart, PARTS, Parts, isoFromParts, partsFromIso } from './date';

const LABEL_KEYS = { day: 'dateInputDay', month: 'dateInputMonth', year: 'dateInputYear' } as const;
/** Character widths of each box (a little more than the digits, so they never feel cramped). */
const CHARS: Record<DatePart, number> = { day: 3, month: 3, year: 5 };
const strings = withField(dateStrings);

/**
 * A date people know, such as a date of birth or the date on a document: Day, Month and
 * Year boxes (يوم / شهر / سنة) with the numeric keyboard.
 *
 * v2 renders a native `<fieldset>` and `<legend>` with the hint and error, three labelled
 * native inputs and a hidden input in light DOM (Stencil `scoped`, decision A2). It submits
 * the date as an ISO string (`2026-03-07`, or empty while it isn't a real date) under `name`,
 * and the raw parts as `name-day`, `name-month` and `name-year`, so a server can re-display
 * what was typed. An empty required date and an impossible date are native validity errors
 * on the first box concerned. In Arabic the boxes run right to left (Day on the right). An
 * error can mark one box with `error-parts="year"`.
 */
@Component({
  tag: 'sc-date-input',
  styleUrls: ['../sc-text-input/field.css', 'sc-date-input.css'],
  scoped: true,
})
export class ScDateInput {
  @Element() el!: HTMLElement;

  /** The question, shown as the legend: "When does your insurance start?". */
  @Prop() label?: string;

  /** Help text below the legend: "For example, 27 3 2026". */
  @Prop() hint?: string;

  /** The error message. Setting it shows the error state. */
  @Prop({ reflect: true }) error?: string;

  /**
   * Which boxes the error is about, space-separated: `"day"`, `"month year"`. Only those get
   * the error edge and `aria-invalid`. When empty, an error marks all three.
   */
  @Prop() errorParts?: string;

  /** Appends "(optional)" to the legend. */
  @Prop() optional = false;

  /** The name submitted with the form (with `-day`, `-month`, `-year` for the parts). */
  @Prop({ reflect: true }) name?: string;

  /** The date as an ISO string (`YYYY-MM-DD`). Empty while the boxes don't make a real date. */
  @Prop({ mutable: true }) value = '';

  /** Requires a date (a validity error while every box is empty). */
  @Prop() required = false;

  /** Disables the boxes. Avoid it. */
  @Prop({ reflect: true }) disabled = false;

  /** Set to `bday` for a date of birth, so browsers can fill it (`bday-day`, `bday-month`, `bday-year`). */
  @Prop() autocomplete?: string;

  /** When set (1–6), the legend is also the page heading at this level. */
  @Prop() headingLevel?: HeadingLevel;

  /** Fires on every keystroke with `{ value, day, month, year }`. */
  @Event({ bubbles: true, composed: true }) scInput!: EventEmitter<{ value: string } & Parts>;

  /** Fires when a box is committed with `{ value, day, month, year }`. The native `change` also bubbles from the box. */
  @Event({ bubbles: true, composed: true }) scChange!: EventEmitter<{ value: string } & Parts>;

  @State() slotted: Slotted = {};
  @State() parts: Parts = { day: '', month: '', year: '' };

  private uid = nextId('sc-date-input');
  private inputs: Partial<Record<DatePart, HTMLInputElement>> = {};
  private locale = new LocaleController(this, strings);
  private stopReset?: () => void;

  connectedCallback() {
    this.locale.connect();
    this.slotted = takeSlotted(this.el, ['label', 'hint', 'error'], this.slotted);
    forwardFocus(this.el, () => this.inputs.day);
    this.stopReset = onFormReset(this.el, () => {
      this.parts = { day: this.inputs.day?.value ?? '', month: this.inputs.month?.value ?? '', year: this.inputs.year?.value ?? '' };
      this.value = isoFromParts(this.parts);
    });
  }

  disconnectedCallback() {
    this.locale.disconnect();
    this.stopReset?.();
  }

  componentWillLoad() {
    this.value = this.value ?? '';
    this.parts = partsFromIso(this.value);
  }

  componentDidRender() {
    this.validate();
  }

  /** A value set from outside replaces the boxes; one computed from typing leaves them alone. */
  @Watch('value')
  onValueChange(next: string) {
    if ((next ?? '') !== isoFromParts(this.parts)) this.parts = partsFromIso(next);
  }

  /** "Enter a date" while empty and required; "The date must be a real date" when it isn't one. */
  private validate() {
    const { parts, inputs } = this;
    const empty = PARTS.every((p) => !parts[p].trim());
    const firstEmpty = PARTS.find((p) => !parts[p].trim()) ?? 'day';
    let message = '';
    let anchor: DatePart = 'day';
    if (empty && this.required) message = this.locale.t('dateInputRequired');
    else if (!empty && !isoFromParts(parts)) {
      message = this.locale.t('dateInputInvalid');
      anchor = firstEmpty;
    }
    for (const p of PARTS) inputs[p]?.setCustomValidity?.(p === anchor ? message : '');
  }

  private setInput = (p: DatePart) => (el?: HTMLInputElement) => {
    if (el && !this.inputs[p]) el.defaultValue = this.parts[p];
    this.inputs[p] = el;
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
  };

  /** The parts the error is about. */
  private invalidParts(hasError: boolean): Set<DatePart> {
    if (!hasError) return new Set();
    const named = (this.errorParts ?? '').split(/[\s,]+/).filter((p): p is DatePart => (PARTS as string[]).includes(p));
    return new Set(named.length ? named : PARTS);
  }

  render() {
    const { t } = this.locale;
    const id = this.uid;
    const { slotted } = this;
    const hasHint = !!this.hint || !!slotted.hint;
    const hasError = !!this.error || !!slotted.error;
    const invalid = this.invalidParts(hasError);
    const auto = this.autocomplete && this.autocomplete !== 'off' ? this.autocomplete : undefined;

    return (
      <Host>
        <fieldset class={{ 'sc-field': true, 'sc-field--error': hasError }} role="group" aria-describedby={describedBy(hasHint && `${id}-hint`, hasError && `${id}-error`)} disabled={this.disabled}>
          <FieldLabel id={`${id}-label`} text={this.label} rich={slotted.label} optional={this.optional} optionalText={t('fieldOptional')} level={headingLevel(this.headingLevel)} as="legend" />
          <FieldHint id={`${id}-hint`} text={this.hint} rich={slotted.hint} show={hasHint} />
          <FieldError id={`${id}-error`} text={this.error} rich={slotted.error} show={hasError} prefix={t('fieldErrorPrefix')} />
          <div class="sc-date-input__parts">
            {PARTS.map((p) => (
              <div class={`sc-date-input__part sc-date-input__part--${p}`}>
                <label class="sc-date-input__part-label" htmlFor={`${id}-${p}`}>
                  {t(LABEL_KEYS[p])}
                </label>
                <div class={{ 'sc-field__frame': true, 'sc-field__frame--chars': true, 'sc-field__frame--error': invalid.has(p) }} style={{ '--_chars': String(CHARS[p]) }}>
                  <input
                    ref={this.setInput(p)}
                    id={`${id}-${p}`}
                    class="sc-field__control sc-date-input__control"
                    type="text"
                    name={this.name ? `${this.name}-${p}` : undefined}
                    inputMode="numeric"
                    autoComplete={auto ? `${auto}-${p}` : 'off'}
                    spellcheck={false}
                    value={this.parts[p]}
                    aria-invalid={invalid.has(p) ? 'true' : undefined}
                    onInput={this.onInput(p)}
                    onChange={this.onChange}
                  />
                </div>
              </div>
            ))}
          </div>
          {this.name && <input type="hidden" name={this.name} value={isoFromParts(this.parts)} />}
        </fieldset>
      </Host>
    );
  }
}
