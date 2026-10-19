import { AttachInternals, Component, Element, Event, EventEmitter, Host, Method, Prop, State, Watch, h } from '@stencil/core';
import { LocaleController } from '../../i18n/locale';
import { StringKey } from '../../i18n/strings';
import { AlertCircle, ArrowForward, ChevronBack, ChevronForward, Close } from '../../icons/index'; // explicit /index: enables SVG rendering (see CONTRIBUTING)
import { FieldError, FieldHint, FieldLabel, HeadingLevel, describedBy, emitNativeChange, formSupported, hasSlotted, headingLevel } from '../sc-text-input/field';
import { StringsInput, translator } from '../sc-table/overrides';
import { CalendarIcon } from './calendar-icon';
import {
  YearMonth,
  addDays,
  addMonths,
  compareMonth,
  firstOfMonth,
  fromIso,
  isIso,
  lastOfMonth,
  lengthInDays,
  monthGrid,
  parseTyped,
  shiftMonth,
  todayIso,
  weekday,
  ymOf,
} from './dates';

void AlertCircle;

type End = 'start' | 'end';
type Mode = 'popover' | 'sheet';

export interface DateRangePreset {
  label: string;
  start: string;
  end: string;
}

interface Problem {
  message: string;
  part: End | 'both';
  flag: keyof ValidityStateFlags;
  missing?: boolean;
}

const PLURAL_KEYS: Record<string, StringKey> = {
  zero: 'dateRangeDaysZero',
  one: 'dateRangeDaysOne',
  two: 'dateRangeDaysTwo',
  few: 'dateRangeDaysFew',
  many: 'dateRangeDaysMany',
  other: 'dateRangeDaysOther',
};

/** Months listed in the phone sheet on each side of the focused month. */
const SHEET_MONTHS_BEFORE = 6;
const SHEET_MONTHS_AFTER = 6;

/**
 * A start and an end date that relate to a calendar: filtering payments between two dates,
 * the nights of a hotel stay, how long a permit lasts. For one date people already know
 * (a date of birth), use `sc-date-input`.
 *
 * Two typed segments (From / To, من / إلى) in one 54px frame, and a calendar button that
 * opens a picker: a popover with one or two months and optional presets on medium and
 * wider screens, a modal bottom sheet below 600px. People can always type instead
 * ("21/9/2026", "21 9 2026", "21-09-2026").
 *
 * Form-associated: submits `name-start` and `name-end` as ISO dates (empty until each is a
 * real date). Reports `valueMissing` (with `required`), `badInput`, `rangeUnderflow` and
 * `rangeOverflow`, and shows its own messages for impossible ranges on blur. Delegates focus
 * to the start segment.
 *
 * @slot label - Rich legend content, instead of the `label` prop.
 * @slot hint - Rich hint content, instead of the `hint` prop.
 * @slot error - Rich error content, instead of the `error` prop.
 *
 * @part field - The `<fieldset>` (gets the error bar).
 * @part label - The `<legend>`.
 * @part hint - The hint.
 * @part error - The error message.
 * @part frame - The 54px frame around both segments and the calendar button.
 * @part control - Each native `<input>`.
 * @part calendar-button - The button that opens the picker.
 * @part picker - The popover or bottom sheet.
 */
@Component({
  tag: 'sc-date-range',
  styleUrl: 'sc-date-range.css',
  shadow: { delegatesFocus: true },
  formAssociated: true,
})
export class ScDateRange {
  @Element() el!: HTMLElement;

  @AttachInternals() internals!: ElementInternals;

  /** The question, shown as the legend: "Show payments between". */
  @Prop() label?: string;

  /** An example in the typed order: "For example, 21 9 2026". */
  @Prop() hint?: string;

  /** The error message. Setting it shows the error state (it replaces the component's own messages). */
  @Prop({ reflect: true }) error?: string;

  /** Which segment the error marks: `start`, `end` or `both`. */
  @Prop() errorParts: 'start' | 'end' | 'both' = 'both';

  /** The start date, ISO (`2026-09-21`). Empty until it is a real date. */
  @Prop({ mutable: true, reflect: true }) start = '';

  /** The end date, ISO (`2026-10-09`). Empty until it is a real date. */
  @Prop({ mutable: true, reflect: true }) end = '';

  /** The earliest day people can choose, ISO. */
  @Prop() min?: string;

  /** The latest day people can choose, ISO. For payment filters this is today. */
  @Prop() max?: string;

  /** The shortest range, in days, counted inclusively. */
  @Prop() minDays?: number;

  /** The longest range, in days, counted inclusively. Days past the limit are disabled once a start is chosen. */
  @Prop() maxDays?: number;

  /**
   * Quick ranges at inline-start of the picker. `true` (or the bare attribute) shows Today,
   * Last 7 days, Last 30 days, This month, Last month and This year. A JSON list replaces them:
   * `[{"label": "This weekend", "start": "2026-10-23", "end": "2026-10-24"}]`.
   */
  @Prop() presets: boolean | string = false;

  /** Months shown in the popover: `1`, `2`, or `auto` (two when the window is at least 720px wide). */
  @Prop() months: 1 | 2 | 'auto' = 'auto';

  /** The name submitted with the form, as `name-start` and `name-end`. */
  @Prop({ reflect: true }) name?: string;

  /** Appends "(optional)" to the legend. */
  @Prop() optional = false;

  /** Requires both dates (`valueMissing` while either is empty). */
  @Prop() required = false;

  /** Disables the field. Avoid it. */
  @Prop({ reflect: true }) disabled = false;

  /** When set (1–6), the legend is also the page heading at this level. */
  @Prop() headingLevel?: HeadingLevel;

  /** Overrides the built-in English and Arabic strings, as JSON (`{"dateRangeFrom": "Check-in"}`, or per language `{"ar": {…}}`). */
  @Prop() strings?: StringsInput;

  /** Today's date, ISO. Defaults to the browser's date; set it when the server's "today" matters, and in tests. */
  @Prop() today?: string;

  /** Fires when the range changes (Apply, or a committed typed date), with `{ start, end }`. A native `change` is also dispatched on the host. */
  @Event({ bubbles: true, composed: true }) scChange!: EventEmitter<{ start: string; end: string }>;

  /** Fires when the picker opens. */
  @Event({ bubbles: true, composed: true }) scOpen!: EventEmitter<void>;

  /** Fires when the picker closes. */
  @Event({ bubbles: true, composed: true }) scClose!: EventEmitter<void>;

  @State() formDisabled = false;
  @State() slots = { label: false, hint: false, error: false };
  @State() texts: Record<End, string> = { start: '', end: '' };
  @State() isOpen = false;
  @State() mode: Mode = 'popover';
  @State() pending: Record<End, string> = { start: '', end: '' };
  /** Which end the next tap sets, when chosen with the sheet's chips. */
  @State() target?: End;
  @State() focusDate = '';
  @State() view: YearMonth = { year: 2026, month: 0 };
  @State() hover = '';
  @State() slide: '' | 'next' | 'prev' = '';
  @State() slideKey = 0;
  @State() announcement = '';
  /** The component's own error, shown after blur, Apply or a failed submit. */
  @State() shown?: Problem;
  @State() twoMonths = false;
  @State() flipped = false;

  private inputs: Partial<Record<End, HTMLInputElement>> = {};
  private calendarButton?: HTMLButtonElement;
  private popover?: HTMLElement;
  private sheet?: HTMLDialogElement;
  private defaults = { start: '', end: '' };
  private shouldFocusDay = false;
  private pendingShow = false;
  /** True while the component sets start/end itself, so the watcher keeps the typed text. */
  private internal = false;
  private locale = new LocaleController(this);
  private drag?: { y: number; t: number; dy: number; v: number };

  connectedCallback() {
    this.locale.connect();
    this.readSlots();
    this.el.addEventListener('invalid', this.onInvalid);
  }

  componentWillLoad() {
    this.start = isIso(this.start) ? this.start : '';
    this.end = isIso(this.end) ? this.end : '';
    this.defaults = { start: this.start, end: this.end };
    this.texts = { start: this.format(this.start), end: this.format(this.end) };
  }

  componentDidLoad() {
    this.el.shadowRoot?.addEventListener('slotchange', this.readSlots);
  }

  disconnectedCallback() {
    this.locale.disconnect();
    this.el.removeEventListener('invalid', this.onInvalid);
    this.removeOutsideListeners();
  }

  componentDidRender() {
    this.sync();
    if (this.pendingShow) {
      this.pendingShow = false;
      this.show();
    }
    if (this.shouldFocusDay) {
      this.shouldFocusDay = false;
      const button = this.pickerEl?.querySelector<HTMLButtonElement>(`button[data-date="${this.focusDate}"]`);
      button?.focus({ preventScroll: this.mode === 'popover' });
      if (this.mode === 'sheet') button?.scrollIntoView({ block: 'nearest' });
    }
  }

  @Watch('start')
  @Watch('end')
  onValueChange() {
    if (this.internal) return;
    // A value set from outside replaces the typed text; one that came from typing leaves it.
    for (const end of ['start', 'end'] as End[]) {
      const value = this[end];
      if (value && !isIso(value)) this[end] = '';
      if (parseTyped(this.texts[end], this.monthNames) !== this[end]) this.texts = { ...this.texts, [end]: this.format(this[end]) };
    }
  }

  formDisabledCallback(disabled: boolean) {
    this.formDisabled = disabled;
  }

  formResetCallback() {
    this.start = this.defaults.start;
    this.end = this.defaults.end;
    this.texts = { start: this.format(this.start), end: this.format(this.end) };
    this.shown = undefined;
  }

  formStateRestoreCallback(state: unknown) {
    if (state instanceof FormData && this.name) {
      this.start = String(state.get(`${this.name}-start`) ?? '');
      this.end = String(state.get(`${this.name}-end`) ?? '');
    }
  }

  /** Opens the picker. */
  @Method()
  async open() {
    this.openPicker();
  }

  /** Closes the picker without changing the field. */
  @Method()
  async close() {
    this.closePicker(false);
  }

  /** Focuses the start segment. */
  @Method()
  async setFocus() {
    this.inputs.start?.focus();
  }

  // Strings and formatting -----------------------------------------------------------------

  private get t() {
    return translator(this.locale.lang, this.strings);
  }

  private list(key: StringKey): string[] {
    return this.t(key).split(',');
  }

  private get monthNames(): string[][] {
    // Typed month names are accepted in both languages, whatever the page language.
    const en = translator('en', this.strings);
    const ar = translator('ar', this.strings);
    return [en('dateRangeMonths'), en('dateRangeMonthsShort'), ar('dateRangeMonths'), ar('dateRangeMonthsShort')].map((s) => s.split(','));
  }

  private get todayValue(): string {
    return isIso(this.today) ? this.today! : todayIso();
  }

  /** "21 Sep 2026" (· "21 سبتمبر 2026"); `year: false` drops the year. */
  private format(iso: string, { long = false, year = true } = {}): string {
    const date = fromIso(iso);
    if (!date) return '';
    const months = this.list(long ? 'dateRangeMonths' : 'dateRangeMonthsShort');
    return [date.getUTCDate(), months[date.getUTCMonth()], year ? date.getUTCFullYear() : ''].join(' ').trim();
  }

  private monthTitle(m: YearMonth): string {
    return `${this.list('dateRangeMonths')[m.month]} ${m.year}`;
  }

  private days(count: number): string {
    let category = 'other';
    try {
      category = new Intl.PluralRules(this.locale.lang).select(count);
    } catch {
      /* "other" */
    }
    return this.t(PLURAL_KEYS[category] ?? 'dateRangeDaysOther', { count });
  }

  /** "21 Sep – 9 Oct 2026 · 19 days", "1 – 31 Oct 2026", "28 Dec 2026 – 3 Jan 2027". */
  private summary(start: string, end: string): string {
    const s = fromIso(start)!;
    const e = fromIso(end)!;
    const sep = this.t('dateRangeRangeSep');
    const sameYear = s.getUTCFullYear() === e.getUTCFullYear();
    const sameMonth = sameYear && s.getUTCMonth() === e.getUTCMonth();
    const days = this.days(lengthInDays(start, end));
    if (start === end) return `${this.format(start)} · ${days}`;
    const from = sameMonth ? String(s.getUTCDate()) : this.format(start, { year: !sameYear });
    return `${from}${sep}${this.format(end)} · ${days}`;
  }

  /** "21 September to 9 October 2026". */
  private spoken(start: string, end: string): string {
    const sameYear = start.slice(0, 4) === end.slice(0, 4);
    return this.t('dateRangeSpoken', { start: this.format(start, { long: true, year: !sameYear }), end: this.format(end, { long: true }) });
  }

  /** "Monday 21 September 2026, today". */
  private dayLabel(iso: string, disabled: boolean): string {
    const name = `${this.list('dateRangeWeekdays')[weekday(iso)]} ${this.format(iso, { long: true })}`;
    return name + (iso === this.todayValue ? this.t('dateRangeTodaySuffix') : '') + (disabled ? this.t('dateRangeUnavailable') : '');
  }

  // Validation and the form ----------------------------------------------------------------

  /** The first thing wrong with the typed range, or undefined. */
  private problem(): Problem | undefined {
    const t = this.t;
    const s = parseTyped(this.texts.start, this.monthNames);
    const e = parseTyped(this.texts.end, this.monthNames);
    if (s === null) return { message: t('dateRangeStartInvalid'), part: 'start', flag: 'badInput' };
    if (e === null) return { message: t('dateRangeEndInvalid'), part: 'end', flag: 'badInput' };
    if (!s && (this.required || e)) return { message: t('dateRangeStartMissing'), part: 'start', flag: 'valueMissing', missing: true };
    if (!e && (this.required || s)) return { message: t('dateRangeEndMissing'), part: 'end', flag: 'valueMissing', missing: true };
    if (!s || !e) return undefined;
    if (e < s) return { message: t('dateRangeEndBeforeStart'), part: 'end', flag: 'rangeUnderflow' };
    if (isIso(this.min) && s < this.min!) return { message: t('dateRangeBeforeMin', { date: this.format(this.min!) }), part: 'start', flag: 'rangeUnderflow' };
    if (isIso(this.max) && e > this.max!) {
      const message = this.max === this.todayValue ? t('dateRangeBeyondMaxToday') : t('dateRangeBeyondMax', { date: this.format(this.max!) });
      return { message, part: 'end', flag: 'rangeOverflow' };
    }
    const length = lengthInDays(s, e);
    if (this.maxDays && length > Number(this.maxDays)) return { message: t('dateRangeTooLong', { days: this.days(Number(this.maxDays)) }), part: 'both', flag: 'rangeOverflow' };
    if (this.minDays && length < Number(this.minDays)) return { message: t('dateRangeTooShort', { days: this.days(Number(this.minDays)) }), part: 'both', flag: 'rangeUnderflow' };
    return undefined;
  }

  private sync() {
    if (!formSupported()) return;
    if (this.internals?.setFormValue) {
      if (this.name && typeof FormData !== 'undefined') {
        const data = new FormData();
        data.append(`${this.name}-start`, this.start);
        data.append(`${this.name}-end`, this.end);
        this.internals.setFormValue(data);
      } else {
        this.internals.setFormValue(null);
      }
    }
    if (!this.internals?.setValidity) return;
    const problem = this.problem();
    const anchor = problem && this.inputs[problem.part === 'both' ? 'start' : problem.part];
    if (problem && anchor) this.internals.setValidity({ [problem.flag]: true }, problem.message, anchor);
    else this.internals.setValidity({});
  }

  /** A failed submit (or reportValidity) shows the component's own message, including "Enter a start date". */
  private onInvalid = () => {
    this.shown = this.problem();
  };

  private readSlots = () => {
    const next = { label: hasSlotted(this.el, 'label'), hint: hasSlotted(this.el, 'hint'), error: hasSlotted(this.el, 'error') };
    if (JSON.stringify(next) !== JSON.stringify(this.slots)) this.slots = next;
  };

  // Typing -----------------------------------------------------------------------------------

  private onInput = (end: End) => (ev: Event) => {
    this.texts = { ...this.texts, [end]: (ev.target as HTMLInputElement).value };
  };

  /** On blur: commit the typed date, format it, and show what's wrong with the range (never swap the dates). */
  private onCommit = (end: End) => () => {
    const parsed = parseTyped(this.texts[end], this.monthNames);
    const before = { start: this.start, end: this.end };
    this.setValue(end, parsed ?? '');
    if (parsed) this.texts = { ...this.texts, [end]: this.format(parsed) };
    const problem = this.problem();
    // "Enter an end date" while someone is still filling in the start would nag; it waits for submit.
    this.shown = problem && !problem.missing ? problem : undefined;
    if (before.start !== this.start || before.end !== this.end) this.emitChange();
  };

  private setValue(end: End, value: string) {
    this.internal = true;
    this[end] = value;
    this.internal = false;
  }

  private emitChange() {
    this.scChange.emit({ start: this.start, end: this.end });
    emitNativeChange(this.el);
  }

  // The picker -----------------------------------------------------------------------------

  private get pickerEl(): HTMLElement | undefined {
    return this.mode === 'sheet' ? this.sheet : this.popover;
  }

  private openPicker() {
    if (this.isOpen || this.disabled || this.formDisabled) return;
    const compact = typeof matchMedia !== 'undefined' && matchMedia('(max-width: 599.98px)').matches;
    this.mode = compact ? 'sheet' : 'popover';
    const months = Number(this.months);
    this.twoMonths = !compact && (months === 2 || (months !== 1 && typeof innerWidth !== 'undefined' && innerWidth >= 720));
    // Start from what is typed, so a typed start shows in the calendar.
    const s = parseTyped(this.texts.start, this.monthNames) || '';
    const e = parseTyped(this.texts.end, this.monthNames) || '';
    this.pending = { start: s, end: e && s && e >= s ? e : '' };
    this.target = undefined;
    this.hover = '';
    this.slide = '';
    this.announcement = '';
    this.focusDate = this.pending.start || this.clamp(this.todayValue);
    this.view = ymOf(this.focusDate);
    this.isOpen = true;
    // Render the contents, then show the element in the top layer and focus the day.
    this.pendingShow = true;
    this.shouldFocusDay = true;
    this.scOpen.emit();
  }

  private show() {
    if (!this.isOpen) return;
    if (this.mode === 'sheet') {
      if (this.sheet && !this.sheet.open) this.sheet.showModal?.();
    } else if (this.popover) {
      try {
        this.popover.showPopover?.();
      } catch {
        /* already open */
      }
      this.position();
      addEventListener('scroll', this.position, true);
      addEventListener('resize', this.position);
      document.addEventListener('pointerdown', this.onOutside, true);
    }
  }

  private closePicker(returnFocus = true) {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.removeOutsideListeners();
    try {
      this.popover?.hidePopover?.();
    } catch {
      /* not open */
    }
    if (this.sheet?.open) this.sheet.close();
    if (returnFocus) this.calendarButton?.focus();
    this.scClose.emit();
  }

  private removeOutsideListeners() {
    if (typeof removeEventListener === 'undefined') return;
    removeEventListener('scroll', this.position, true);
    removeEventListener('resize', this.position);
    document.removeEventListener('pointerdown', this.onOutside, true);
  }

  /** A click outside the field and the popover closes it without changing the field. */
  private onOutside = (ev: Event) => {
    const path = ev.composedPath();
    if (path.includes(this.el) || (this.popover && path.includes(this.popover))) return;
    this.closePicker(false);
  };

  /** 8px below the field, aligned to its inline-start edge; above it when there's no room below. */
  private position = () => {
    const frame = this.el.shadowRoot?.querySelector('.range-frame');
    const pop = this.popover;
    if (!frame || !pop || !this.isOpen || this.mode !== 'popover') return;
    const rect = frame.getBoundingClientRect();
    const gap = 8;
    const vw = document.documentElement.clientWidth;
    const vh = innerHeight;
    const height = pop.offsetHeight;
    const width = pop.offsetWidth;
    const flipped = vh - rect.bottom < height + gap && rect.top > vh - rect.bottom;
    const top = flipped ? Math.max(gap, rect.top - gap - height) : rect.bottom + gap;
    const rtl = this.locale.dir === 'rtl';
    let start = rtl ? vw - rect.right : rect.left;
    if (start + width > vw - gap) start = Math.max(gap, vw - gap - width);
    pop.style.setProperty('--_top', `${Math.round(top)}px`);
    pop.style.setProperty('--_start', `${Math.round(start)}px`);
    if (flipped !== this.flipped) this.flipped = flipped;
  };

  private clamp(iso: string): string {
    if (isIso(this.min) && iso < this.min!) return this.min!;
    if (isIso(this.max) && iso > this.max!) return this.max!;
    return iso;
  }

  private visibleMonths(): YearMonth[] {
    if (this.mode === 'sheet') {
      const centre = ymOf(this.focusDate || this.clamp(this.todayValue));
      let from = shiftMonth(centre, -SHEET_MONTHS_BEFORE);
      let to = shiftMonth(centre, SHEET_MONTHS_AFTER);
      if (isIso(this.min) && compareMonth(from, ymOf(this.min!)) < 0) from = ymOf(this.min!);
      if (isIso(this.max) && compareMonth(to, ymOf(this.max!)) > 0) to = ymOf(this.max!);
      const list: YearMonth[] = [];
      for (let m = from; compareMonth(m, to) <= 0; m = shiftMonth(m, 1)) list.push(m);
      return list;
    }
    return this.twoMonths ? [this.view, shiftMonth(this.view, 1)] : [this.view];
  }

  private canGo(by: -1 | 1): boolean {
    const months = this.visibleMonths();
    if (by < 0) return !(isIso(this.min) && lastOfMonth(shiftMonth(months[0], -1)) < this.min!);
    return !(isIso(this.max) && firstOfMonth(shiftMonth(months[months.length - 1], 1)) > this.max!);
  }

  /** Previous / next by pointer: the grid crossfades with a shift in the direction of travel. */
  private go(by: -1 | 1) {
    if (!this.canGo(by)) return;
    this.view = shiftMonth(this.view, by);
    this.slide = by > 0 ? 'next' : 'prev';
    this.slideKey++;
    // Keep the roving focus target inside the visible months.
    const months = this.visibleMonths();
    const first = firstOfMonth(months[0]);
    const last = lastOfMonth(months[months.length - 1]);
    if (!this.focusDate || this.focusDate < first || this.focusDate > last) this.focusDate = this.clamp(addMonths(this.focusDate || first, by));
  }

  /** Moves the keyboard focus to a day, scrolling the months instantly (keyboard actions are never animated). */
  private moveFocus(iso: string) {
    const previous = this.focusDate;
    this.focusDate = iso;
    this.slide = '';
    if (this.mode === 'popover') {
      const m = ymOf(iso);
      const months = this.visibleMonths();
      if (compareMonth(m, months[0]) < 0) this.view = m;
      else if (compareMonth(m, months[months.length - 1]) > 0) this.view = shiftMonth(m, -(months.length - 1));
    }
    // A day that is already on screen gets focus now, so fast key repeats never outrun the
    // render; a day in another month is focused once that month has rendered.
    const button = this.pickerEl?.querySelector<HTMLButtonElement>(`button[data-date="${iso}"]`);
    if (button) {
      this.pickerEl?.querySelector<HTMLButtonElement>(`button[data-date="${previous}"]`)?.setAttribute('tabindex', '-1');
      button.setAttribute('tabindex', '0');
      button.focus({ preventScroll: this.mode === 'popover' });
      if (this.mode === 'sheet') button.scrollIntoView({ block: 'nearest' });
    } else {
      this.shouldFocusDay = true;
    }
  }

  private onGridKey = (ev: KeyboardEvent) => {
    const from = this.focusDate;
    if (!from) return;
    const rtl = this.locale.dir === 'rtl';
    let next: string | undefined;
    switch (ev.key) {
      // Arrows move visually: in right-to-left, Left is the next day.
      case 'ArrowRight':
        next = addDays(from, rtl ? -1 : 1);
        break;
      case 'ArrowLeft':
        next = addDays(from, rtl ? 1 : -1);
        break;
      case 'ArrowUp':
        next = addDays(from, -7);
        break;
      case 'ArrowDown':
        next = addDays(from, 7);
        break;
      case 'Home':
        next = addDays(from, -weekday(from));
        break;
      case 'End':
        next = addDays(from, 6 - weekday(from));
        break;
      case 'PageUp':
        next = addMonths(from, ev.shiftKey ? -12 : -1);
        break;
      case 'PageDown':
        next = addMonths(from, ev.shiftKey ? 12 : 1);
        break;
      default:
        return;
    }
    ev.preventDefault();
    this.moveFocus(next);
  };

  private onPickerKey = (ev: KeyboardEvent) => {
    if (ev.key === 'Escape') {
      ev.preventDefault();
      ev.stopPropagation();
      this.closePicker(true);
    }
  };

  private isDisabled(iso: string): boolean {
    if (isIso(this.min) && iso < this.min!) return true;
    if (isIso(this.max) && iso > this.max!) return true;
    const { start, end } = this.pending;
    const choosingEnd = (this.target ?? (start && !end ? 'end' : 'start')) === 'end';
    if (choosingEnd && start && iso > start) {
      const length = lengthInDays(start, iso);
      if (this.maxDays && length > Number(this.maxDays)) return true;
      if (this.minDays && length < Number(this.minDays)) return true;
    }
    return false;
  }

  /** First click sets the start, the second the end; a day before the start, or any day after a complete range, starts again. */
  private pick(iso: string) {
    if (this.isDisabled(iso)) return;
    const { start, end } = this.pending;
    const target = this.target ?? (start && !end ? 'end' : 'start');
    let next: Record<End, string>;
    if (target === 'end' && start && iso >= start) next = { start, end: iso };
    else if (target === 'end' && !start) next = { start: iso, end: '' };
    else if (target === 'end') next = { start: iso, end: '' };
    else next = { start: iso, end: this.target === 'start' && end && end >= iso ? end : '' };
    this.pending = next;
    this.target = undefined;
    this.focusDate = iso;
    this.hover = '';
    this.announce();
  }

  private announce() {
    const { start, end } = this.pending;
    if (start && end) this.announcement = this.t('dateRangeAnnounceRange', { start: this.format(start, { long: true, year: start.slice(0, 4) !== end.slice(0, 4) }), end: this.format(end, { long: true }), days: this.days(lengthInDays(start, end)) });
    else if (start) this.announcement = this.t('dateRangeAnnounceStart', { date: this.format(start, { long: true }) });
    else this.announcement = '';
  }

  private apply = () => {
    const { start, end } = this.pending;
    if (!start || !end) return;
    const changed = start !== this.start || end !== this.end;
    this.setValue('start', start);
    this.setValue('end', end);
    this.texts = { start: this.format(start), end: this.format(end) };
    const problem = this.problem();
    this.shown = problem && !problem.missing ? problem : undefined;
    this.closePicker(true);
    if (changed) this.emitChange();
  };

  private clear = () => {
    this.pending = { start: '', end: '' };
    this.target = undefined;
    this.announcement = '';
  };

  // Presets ----------------------------------------------------------------------------------

  private presetList(): DateRangePreset[] {
    const value = this.presets as unknown;
    if (value === false || value === null || value === undefined || value === 'false') return [];
    if (typeof value === 'string' && value.trim().startsWith('[')) {
      try {
        const list = JSON.parse(value) as DateRangePreset[];
        return list.filter((p) => p && p.label && isIso(p.start) && isIso(p.end));
      } catch {
        return [];
      }
    }
    const t = this.t;
    const today = this.todayValue;
    const month = ymOf(today);
    const last = shiftMonth(month, -1);
    const year = today.slice(0, 4);
    const clampRange = (start: string, end: string) => ({ start: this.clamp(start), end: this.clamp(end) });
    return [
      { label: t('dateRangeToday'), ...clampRange(today, today) },
      { label: t('dateRangeLast7'), ...clampRange(addDays(today, -6), today) },
      { label: t('dateRangeLast30'), ...clampRange(addDays(today, -29), today) },
      { label: t('dateRangeThisMonth'), ...clampRange(firstOfMonth(month), lastOfMonth(month)) },
      { label: t('dateRangeLastMonth'), ...clampRange(firstOfMonth(last), lastOfMonth(last)) },
      { label: t('dateRangeThisYear'), ...clampRange(`${year}-01-01`, `${year}-12-31`) },
    ];
  }

  /** A preset applies at once and shows its days; the picker stays open so people can see what it chose. */
  private applyPreset(preset: DateRangePreset) {
    this.pending = { start: preset.start, end: preset.end };
    this.target = undefined;
    this.focusDate = preset.start;
    const months = this.visibleMonths();
    const endMonth = ymOf(preset.end);
    if (this.mode === 'popover') {
      // Show the end of the range in the last visible month.
      const first = shiftMonth(endMonth, -(months.length - 1));
      const startMonth = ymOf(preset.start);
      this.view = compareMonth(startMonth, first) > 0 ? startMonth : first;
      this.slide = '';
    }
    this.announce();
  }

  // Sheet drag -------------------------------------------------------------------------------

  private onDragStart = (ev: PointerEvent) => {
    if (ev.button !== 0) return;
    this.drag = { y: ev.clientY, t: ev.timeStamp, dy: 0, v: 0 };
    this.sheet?.classList.add('picker--dragging');
  };

  private onDragMove = (ev: PointerEvent) => {
    if (!this.drag || !this.sheet) return;
    const dy = Math.max(0, ev.clientY - this.drag.y);
    const dt = Math.max(1, ev.timeStamp - this.drag.t);
    this.drag = { y: this.drag.y, t: ev.timeStamp, dy, v: (dy - this.drag.dy) / dt };
    this.sheet.style.setProperty('--_drag', `${dy}px`);
  };

  /** A downward flick faster than 0.11 px/ms (or a drag past a third of the sheet) dismisses it; otherwise it settles back. */
  private onDragEnd = () => {
    if (!this.drag || !this.sheet) return;
    const { dy, v } = this.drag;
    this.drag = undefined;
    this.sheet.classList.remove('picker--dragging');
    this.sheet.style.removeProperty('--_drag');
    if (v > 0.11 || dy > this.sheet.offsetHeight / 3) this.closePicker(true);
  };

  // Rendering --------------------------------------------------------------------------------

  private errorState(): { text?: string; parts: Set<End>; show: boolean } {
    const hasOwn = !!this.error || this.slots.error;
    if (hasOwn) {
      const parts = new Set<End>(this.errorParts === 'start' ? ['start'] : this.errorParts === 'end' ? ['end'] : ['start', 'end']);
      return { text: this.error, parts, show: true };
    }
    if (this.shown) {
      const parts = new Set<End>(this.shown.part === 'both' ? ['start', 'end'] : [this.shown.part]);
      return { text: this.shown.message, parts, show: true };
    }
    return { parts: new Set(), show: false };
  }

  private renderSegment(end: End, invalid: boolean, disabled: boolean, described?: string) {
    const t = this.t;
    return (
      <div class={{ 'segment': true, [`segment--${end}`]: true, 'segment--error': invalid }}>
        <span class="segment-label" aria-hidden="true">
          {t(end === 'start' ? 'dateRangeFrom' : 'dateRangeTo')}
        </span>
        <input
          ref={(el) => (this.inputs[end] = el)}
          id={end}
          class="control segment-input"
          part="control"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          spellcheck={false}
          dir="auto"
          value={this.texts[end]}
          placeholder={t(end === 'start' ? 'dateRangeStart' : 'dateRangeEnd')}
          aria-label={t(end === 'start' ? 'dateRangeStart' : 'dateRangeEnd')}
          aria-describedby={described}
          aria-invalid={invalid ? 'true' : undefined}
          disabled={disabled}
          onInput={this.onInput(end)}
          onChange={this.onCommit(end)}
        />
      </div>
    );
  }

  private renderMonth(m: YearMonth, index: number, count: number) {
    const t = this.t;
    const id = `month-${m.year}-${m.month}`;
    const sheet = this.mode === 'sheet';
    const short = this.list('dateRangeWeekdaysShort');
    const long = this.list('dateRangeWeekdays');
    const cells = monthGrid(m);
    const { start, end } = this.pending;
    const choosingEnd = start && !end && (this.target ?? 'end') === 'end';
    const previewEnd = choosingEnd && this.hover && this.hover > start && !this.isDisabled(this.hover) ? this.hover : '';
    const bandEnd = end || previewEnd;
    const monthFirst = firstOfMonth(m);
    const monthLast = lastOfMonth(m);
    const rows = [0, 1, 2, 3, 4, 5].map((r) => cells.slice(r * 7, r * 7 + 7));

    return (
      <div class="month" key={id}>
        <div class="month-head">
          {!sheet && index === 0 && (
            <button type="button" class="nav nav--prev focus-ring" aria-label={t('dateRangePrevMonth')} disabled={!this.canGo(-1)} onClick={() => this.go(-1)}>
              <ChevronBack />
            </button>
          )}
          <h2 id={id} class="month-title">
            {this.monthTitle(m)}
          </h2>
          {!sheet && index === count - 1 && (
            <button type="button" class="nav nav--next focus-ring" aria-label={t('dateRangeNextMonth')} disabled={!this.canGo(1)} onClick={() => this.go(1)}>
              <ChevronForward />
            </button>
          )}
        </div>
        <table class="grid" role="grid" aria-labelledby={id} onKeyDown={this.onGridKey} onMouseLeave={() => (this.hover = '')}>
          <thead class={{ 'visually-hidden': sheet }}>
            <tr>
              {short.map((d, i) => (
                <th scope="col" abbr={long[i]} class="weekday">
                  <span aria-hidden="true">{d}</span>
                  <span class="visually-hidden">{long[i]}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr>
                {row.map((iso, col) => {
                  if (!iso) return <td class="day day--blank" role="gridcell" />;
                  const disabled = this.isDisabled(iso);
                  const isStart = iso === start;
                  const isEnd = iso === end;
                  const inBand = !!(start && bandEnd && iso >= start && iso <= bandEnd && start !== bandEnd);
                  const selected = !!(start && ((end && iso >= start && iso <= end) || isStart));
                  const cls = {
                    'day': true,
                    'day--band': inBand,
                    'day--preview': inBand && !end,
                    'day--band-start': inBand && iso === start,
                    'day--band-end': inBand && iso === bandEnd,
                    // The band is rounded where it meets a row edge or a month boundary.
                    'day--edge-start': inBand && (col === 0 || iso === monthFirst),
                    'day--edge-end': inBand && (col === 6 || iso === monthLast),
                  };
                  return (
                    <td class={cls} role="gridcell" aria-selected={selected ? 'true' : 'false'}>
                      <button
                        type="button"
                        class={{
                          'day-button': true,
                          'day-button--end': isStart || isEnd,
                          'day-button--today': iso === this.todayValue,
                          'day-button--disabled': disabled,
                        }}
                        data-date={iso}
                        tabindex={iso === this.focusDate ? 0 : -1}
                        aria-label={this.dayLabel(iso, disabled)}
                        aria-current={iso === this.todayValue ? 'date' : undefined}
                        aria-disabled={disabled ? 'true' : undefined}
                        onClick={() => this.pick(iso)}
                        onMouseEnter={() => choosingEnd && (this.hover = iso)}
                        onFocus={() => (this.focusDate = iso)}
                      >
                        {Number(iso.slice(8))}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  private renderPicker() {
    const t = this.t;
    const sheet = this.mode === 'sheet';
    const presets = this.presetList();
    const months = this.visibleMonths();
    const { start, end } = this.pending;
    const applyLabel = !start ? t('dateRangeNeedStart') : !end ? t('dateRangeNeedEnd') : t('dateRangeApply');
    const note = start && !end && this.maxDays ? t('dateRangeUpTo', { days: this.days(Number(this.maxDays)) }) : start && end ? this.summary(start, end) : '';
    const target = this.target ?? (start && !end ? 'end' : 'start');

    const presetButtons = presets.length > 0 && (
      <div class="presets" role="group" aria-label={t('dateRangePresets')}>
        {presets.map((p) => {
          const on = p.start === start && p.end === end;
          return (
            <button type="button" class={{ 'preset': true, 'preset--on': on, 'focus-ring': true }} aria-pressed={on ? 'true' : 'false'} onClick={() => this.applyPreset(p)}>
              {p.label}
            </button>
          );
        })}
      </div>
    );

    return [
      sheet && (
        <div class="sheet-head">
          <div class="sheet-grab" onPointerDown={this.onDragStart} onPointerMove={this.onDragMove} onPointerUp={this.onDragEnd} onPointerCancel={this.onDragEnd}>
            <span class="grabber" aria-hidden="true" />
          </div>
          <div class="sheet-title-row">
            <h2 class="sheet-title" id="picker-title">
              {t('dateRangeChoose')}
            </h2>
            <button type="button" class="nav close focus-ring" aria-label={t('dateRangeClose')} onClick={() => this.closePicker(true)}>
              <Close />
            </button>
          </div>
          <div class="chips">
            {(['start', 'end'] as End[]).map((e) => (
              <button type="button" class={{ 'chip': true, 'chip--on': target === e, 'focus-ring': true }} aria-pressed={target === e ? 'true' : 'false'} onClick={() => (this.target = e)}>
                <span class="chip-label">{t(e === 'start' ? 'dateRangeFrom' : 'dateRangeTo')}</span>
                <span class="chip-value">{this.pending[e] ? this.format(this.pending[e], { year: false }) : t('dateRangeChipEmpty')}</span>
              </button>
            ))}
          </div>
          {presetButtons}
          <div class="weekdays" aria-hidden="true">
            {this.list('dateRangeWeekdaysShort').map((d) => (
              <span class="weekday">{d}</span>
            ))}
          </div>
        </div>
      ),
      <div class="picker-body">
        {!sheet && presetButtons}
        <div class={{ 'months': true, [`months--slide-${this.slide}`]: !!this.slide }} key={`months-${this.slideKey}`}>
          {months.map((m, i) => this.renderMonth(m, i, months.length))}
        </div>
      </div>,
      <div class="picker-foot">
        <p class="summary">{note}</p>
        <div class="foot-actions">
          <sc-button variant="tertiary" size="m" onClick={this.clear}>
            {t('dateRangeClear')}
          </sc-button>
          <sc-button variant="primary" size="m" fullWidth={sheet} disabled={!start || !end} onClick={this.apply}>
            {applyLabel}
          </sc-button>
        </div>
      </div>,
    ];
  }

  render() {
    const { t } = this.locale;
    const hasHint = !!this.hint || this.slots.hint;
    const disabled = this.disabled || this.formDisabled;
    const err = this.errorState();
    const described = describedBy(hasHint && 'hint', err.show && 'error');
    const range = isIso(this.start) && isIso(this.end) ? this.spoken(this.start, this.end) : '';
    const buttonLabel = range ? this.t('dateRangeChooseSet', { range }) : this.t('dateRangeChoose');
    const sheet = this.mode === 'sheet';
    const pickerContent = this.isOpen ? this.renderPicker() : null;

    return (
      <Host>
        <fieldset class={{ 'field': true, 'field--error': err.show }} part="field" role="group" aria-describedby={described} disabled={disabled}>
          <FieldLabel text={this.label} optional={this.optional} optionalText={t('optional')} level={headingLevel(this.headingLevel)} as="legend" />
          <FieldHint text={this.hint} show={hasHint} />
          <FieldError text={err.text} show={err.show} prefix={t('errorPrefix')} />
          <div
            class={{ 'frame': true, 'range-frame': true, 'frame--error': err.parts.size === 2, 'frame--disabled': disabled, 'frame--open': this.isOpen }}
            part="frame"
          >
            {this.renderSegment('start', err.parts.has('start'), disabled, described)}
            <ArrowForward class="range-arrow" />
            {this.renderSegment('end', err.parts.has('end'), disabled, described)}
            <button
              ref={(el) => (this.calendarButton = el)}
              type="button"
              class="calendar-button focus-ring"
              part="calendar-button"
              aria-label={buttonLabel}
              aria-haspopup="dialog"
              aria-expanded={this.isOpen ? 'true' : 'false'}
              disabled={disabled}
              onClick={() => (this.isOpen ? this.closePicker(true) : this.openPicker())}
            >
              <CalendarIcon />
            </button>
          </div>
        </fieldset>
        <div
          ref={(el) => (this.popover = el)}
          class={{ 'picker': true, 'picker--popover': true, 'picker--two': this.twoMonths, 'picker--presets': this.presetList().length > 0, 'picker--flipped': this.flipped }}
          part="picker"
          {...{ popover: 'manual' }}
          role="dialog"
          aria-label={this.t('dateRangeChoose')}
          onKeyDown={this.onPickerKey}
        >
          {!sheet && pickerContent}
        </div>
        <dialog
          ref={(el) => (this.sheet = el)}
          class={{ 'picker': true, 'picker--sheet': true }}
          part="picker"
          aria-labelledby="picker-title"
          onCancel={(ev: Event) => {
            ev.preventDefault();
            this.closePicker(true);
          }}
          onClick={(ev: MouseEvent) => {
            // A tap on the scrim (the dialog's own box outside its content) closes it.
            if (ev.target === this.sheet) this.closePicker(true);
          }}
        >
          {sheet && pickerContent}
        </dialog>
        <div class="visually-hidden" aria-live="polite">
          {this.announcement}
        </div>
      </Host>
    );
  }
}
