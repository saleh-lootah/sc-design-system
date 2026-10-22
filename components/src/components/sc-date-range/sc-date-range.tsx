import { Component, Element, Event, EventEmitter, Host, Method, Prop, State, Watch, h } from '@stencil/core';
import { normaliseDigits } from '../../i18n/digits';
import { LocaleController } from '../../i18n/controller';
import { ArrowForward, Calendar as CalendarIcon, ChevronBack, ChevronForward, Close } from '../../icons/for/sc-date-range';
import { CheckMark, FieldError, FieldHint, FieldLabel, HeadingLevel, Slotted, describedBy, forwardFocus, headingLevel, nextId, onFormReset, takeSlotted, withField } from '../sc-text-input/field';
import { DateRangeKey, StringsInput, translator } from './overrides';
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

const fieldStrings = withField();

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
  missing?: boolean;
}

const PLURAL_KEYS: Record<string, DateRangeKey> = {
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
 * Two typed segments (From / To, من / إلى) in one 56px frame, and a calendar button that
 * opens a picker: a popover with one or two months and optional presets on medium and
 * wider screens, a modal bottom sheet below 600px. People can always type instead
 * ("21/9/2026", "21 9 2026", "21-09-2026").
 *
 * v2 renders everything in light DOM (Stencil `scoped`, decision A2), with classes prefixed
 * `.sc-date-range__`. It submits `name-start` and `name-end` as ISO dates through hidden
 * inputs (empty until each is a real date). The first problem with the range (missing with
 * `required`, not a real date, end before start, outside `min`/`max`, too long or short) is a
 * native validity error on the segment concerned; the component shows its own message on
 * blur or after a failed submit. `focus()` on the host goes to the start segment. One native
 * `change` is dispatched from the host per committed range.
 *
 * Rich content: a child with `slot="label"`, `slot="hint"` or `slot="error"` is moved into place once.
 */
@Component({
  tag: 'sc-date-range',
  styleUrls: ['../sc-text-input/field.css', 'sc-date-range.css'],
  scoped: true,
})
export class ScDateRange {
  @Element() el!: HTMLElement;

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

  @State() slotted: Slotted = {};
  @State() texts: Record<End, string> = { start: '', end: '' };
  @State() isOpen = false;
  @State() mode: Mode = 'popover';
  @State() pending: Record<End, string> = { start: '', end: '' };
  /** Which end the next tap sets, when chosen with the sheet's chips. */
  @State() target?: End;
  @State() focusDate = '';
  @State() view: YearMonth = { year: 2026, month: 0 };
  @State() hover = '';
  @State() announcement = '';
  /** The component's own error, shown after blur, Apply or a failed submit. */
  @State() shown?: Problem;
  @State() twoMonths = false;
  @State() flipped = false;
  /** Opened from the keyboard: the popover appears without its entrance (MOT-02). */
  @State() instant = false;

  private inputs: Partial<Record<End, HTMLInputElement>> = {};
  private calendarButton?: HTMLButtonElement;
  private popover?: HTMLElement;
  private sheet?: HTMLDialogElement;
  private defaults = { start: '', end: '' };
  private shouldFocusDay = false;
  private pendingShow = false;
  /** True while the component sets start/end itself, so the watcher keeps the typed text. */
  private internal = false;
  private locale = new LocaleController(this, fieldStrings);
  private uid = nextId('sc-date-range');
  private stopReset?: () => void;
  private drag?: { id: number; y: number; t: number; dy: number };
  /** A pointer month change waiting for its render, so the new months can slide in. */
  private pendingSlide: 0 | 1 | -1 = 0;
  /**
   * The month the sheet's list is centred on. It stays put while focus moves, because moving
   * the window re-orders the month elements and that drops the focus; it only moves when focus
   * leaves the list.
   */
  private sheetCentre?: YearMonth;

  connectedCallback() {
    this.locale.connect();
    this.slotted = takeSlotted(this.el, ['label', 'hint', 'error'], this.slotted);
    forwardFocus(this.el, () => this.inputs.start);
    // `invalid` doesn't bubble: listen in the capture phase for the segments' own.
    this.el.addEventListener('invalid', this.onInvalid, true);
    this.stopReset = onFormReset(this.el, () => {
      this.start = this.defaults.start;
      this.end = this.defaults.end;
      this.texts = { start: this.format(this.start), end: this.format(this.end) };
      this.shown = undefined;
    });
  }

  componentWillLoad() {
    this.start = isIso(this.start) ? this.start : '';
    this.end = isIso(this.end) ? this.end : '';
    this.defaults = { start: this.start, end: this.end };
    this.texts = { start: this.format(this.start), end: this.format(this.end) };
  }

  disconnectedCallback() {
    this.locale.disconnect();
    this.el.removeEventListener('invalid', this.onInvalid, true);
    this.stopReset?.();
    this.removeOutsideListeners();
  }

  componentDidRender() {
    this.sync();
    if (this.pendingShow) {
      this.pendingShow = false;
      this.show();
    }
    if (this.pendingSlide) {
      this.slideMonths(this.pendingSlide);
      this.pendingSlide = 0;
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

  private list(key: DateRangeKey): string[] {
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

  /**
   * "21 Sep – 9 Oct 2026 · 19 days", "1 – 31 Oct 2026", "28 Dec 2026 – 3 Jan 2027". In Arabic
   * the range is written with words ("من 1 إلى 31 أكتوبر 2026"), never a dash (LANG-22A).
   */
  private summary(start: string, end: string): string {
    const s = fromIso(start)!;
    const e = fromIso(end)!;
    const sameYear = s.getUTCFullYear() === e.getUTCFullYear();
    const sameMonth = sameYear && s.getUTCMonth() === e.getUTCMonth();
    const days = this.days(lengthInDays(start, end));
    if (start === end) return `${this.format(start)} · ${days}`;
    const from = sameMonth ? String(s.getUTCDate()) : this.format(start, { year: !sameYear });
    return `${this.t('dateRangeSummary', { start: from, end: this.format(end) })} · ${days}`;
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
    if (s === null) return { message: t('dateRangeStartInvalid'), part: 'start' };
    if (e === null) return { message: t('dateRangeEndInvalid'), part: 'end' };
    if (!s && (this.required || e)) return { message: t('dateRangeStartMissing'), part: 'start', missing: true };
    if (!e && (this.required || s)) return { message: t('dateRangeEndMissing'), part: 'end', missing: true };
    if (!s || !e) return undefined;
    if (e < s) return { message: t('dateRangeEndBeforeStart'), part: 'end' };
    if (isIso(this.min) && s < this.min!) return { message: t('dateRangeBeforeMin', { date: this.format(this.min!) }), part: 'start' };
    if (isIso(this.max) && e > this.max!) {
      const message = this.max === this.todayValue ? t('dateRangeBeyondMaxToday') : t('dateRangeBeyondMax', { date: this.format(this.max!) });
      return { message, part: 'end' };
    }
    const length = lengthInDays(s, e);
    if (this.maxDays && length > Number(this.maxDays)) return { message: t('dateRangeTooLong', { days: this.days(Number(this.maxDays)) }), part: 'both' };
    if (this.minDays && length < Number(this.minDays)) return { message: t('dateRangeTooShort', { days: this.days(Number(this.minDays)) }), part: 'both' };
    return undefined;
  }

  /** The first problem is a native validity error on the segment it concerns. */
  private sync() {
    const problem = this.problem();
    const anchor: End | undefined = problem ? (problem.part === 'both' ? 'start' : problem.part) : undefined;
    for (const end of ['start', 'end'] as End[]) this.inputs[end]?.setCustomValidity?.(end === anchor ? problem!.message : '');
  }

  /** A failed submit (or reportValidity) shows the component's own message, including "Enter a start date". */
  private onInvalid = () => {
    this.shown = this.problem();
  };

  // Typing -----------------------------------------------------------------------------------

  private onInput = (end: End) => (ev: Event) => {
    this.texts = { ...this.texts, [end]: normaliseDigits(ev.target as HTMLInputElement) };
  };

  /** On blur: commit the typed date, format it, and show what's wrong with the range (never swap the dates). */
  private onCommit = (end: End) => (ev: Event) => {
    // The host dispatches its own `change` once the range changes; the segment's is internal.
    ev.stopPropagation();
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
    // The segments' own `change` is not this component's change (the value is committed on
    // blur and by Apply), so a native `change` is dispatched from the host.
    this.el.dispatchEvent(new globalThis.Event('change', { bubbles: true }));
  }

  // The picker -----------------------------------------------------------------------------

  private get pickerEl(): HTMLElement | undefined {
    return this.mode === 'sheet' ? this.sheet : this.popover;
  }

  private openPicker(fromKeyboard = false) {
    if (this.isOpen || this.calendarButton?.matches(':disabled')) return;
    const compact = typeof matchMedia !== 'undefined' && matchMedia('(max-width: 599.98px)').matches;
    this.mode = compact ? 'sheet' : 'popover';
    // A click from Enter or Space has detail 0; a pointer click counts presses from 1.
    this.instant = fromKeyboard;
    const months = Number(this.months);
    this.twoMonths = !compact && (months === 2 || (months !== 1 && typeof innerWidth !== 'undefined' && innerWidth >= 720));
    // Start from what is typed, so a typed start shows in the calendar.
    const s = parseTyped(this.texts.start, this.monthNames) || '';
    const e = parseTyped(this.texts.end, this.monthNames) || '';
    this.pending = { start: s, end: e && s && e >= s ? e : '' };
    this.target = undefined;
    this.hover = '';
    this.announcement = '';
    this.focusDate = this.pending.start || this.clamp(this.todayValue);
    this.view = this.sheetCentre = ymOf(this.focusDate);
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
    const frame = this.el.querySelector('.sc-date-range__frame');
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
      const centre = this.sheetCentre || ymOf(this.focusDate || this.clamp(this.todayValue));
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
    this.pendingSlide = by;
    // Keep the roving focus target inside the visible months.
    const months = this.visibleMonths();
    const first = firstOfMonth(months[0]);
    const last = lastOfMonth(months[months.length - 1]);
    if (!this.focusDate || this.focusDate < first || this.focusDate > last) this.focusDate = this.clamp(addMonths(this.focusDate || first, by));
  }

  /**
   * Month change by pointer: the months crossfade in with a 12px shift in the direction of
   * travel (mirrored in RTL). WAAPI rather than @keyframes, so clicking Next several times
   * retargets from the current frame instead of restarting from zero. Under reduced motion
   * --_shift is 0px, so the months only crossfade. Keyboard month changes never call this.
   */
  private slideMonths(by: 1 | -1) {
    const months = this.pickerEl?.querySelector<HTMLElement>('.sc-date-range__months');
    if (!months?.animate) return;
    const styles = getComputedStyle(months);
    const duration = parseFloat(styles.getPropertyValue('--sc-duration-base')) || 0;
    if (!duration) return;
    const shift = parseFloat(styles.getPropertyValue('--_shift')) || 0;
    // Start from wherever a running slide has got to.
    const running = months.getAnimations();
    const from = running.length ? Number(styles.opacity) : 0;
    running.forEach((a) => a.cancel());
    months.animate(
      [
        { opacity: from, transform: `translateX(${by * shift}px)` },
        { opacity: 1, transform: 'none' },
      ],
      { duration, easing: styles.getPropertyValue('--sc-easing-enter').trim() || 'ease-out' },
    );
  }

  /** Moves the keyboard focus to a day, scrolling the months instantly (keyboard actions are never animated). */
  private moveFocus(iso: string) {
    const previous = this.focusDate;
    this.focusDate = iso;
    const m = ymOf(iso);
    const months = this.visibleMonths();
    const outside = compareMonth(m, months[0]) < 0 || compareMonth(m, months[months.length - 1]) > 0;
    if (this.mode === 'sheet') {
      if (outside) this.sheetCentre = m;
    } else if (compareMonth(m, months[0]) < 0) this.view = m;
    else if (outside) this.view = shiftMonth(m, -(months.length - 1));
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
      // Show the end of the range in the last visible month (with max = today, the month
      // after it would be all unavailable days).
      this.view = shiftMonth(endMonth, -(months.length - 1));
    } else this.sheetCentre = ymOf(preset.start);
    this.announce();
  }

  // Sheet drag -------------------------------------------------------------------------------

  private onDragStart = (ev: PointerEvent) => {
    // One pointer at a time: a second finger mid-drag would make the sheet jump.
    if (ev.button !== 0 || this.drag) return;
    this.drag = { id: ev.pointerId, y: ev.clientY, t: ev.timeStamp, dy: 0 };
    // The grab area holds no buttons, so capturing the pointer can't swallow a tap.
    (ev.currentTarget as HTMLElement).setPointerCapture?.(ev.pointerId);
    this.sheet?.classList.add('sc-date-range__picker--dragging');
  };

  private onDragMove = (ev: PointerEvent) => {
    if (!this.drag || ev.pointerId !== this.drag.id || !this.sheet) return;
    const raw = ev.clientY - this.drag.y;
    // Down follows the finger; up meets rising resistance instead of a hard stop.
    const dy = raw >= 0 ? raw : -Math.min(24, Math.sqrt(-raw) * 2);
    this.drag = { ...this.drag, dy };
    // Set the transform on the sheet itself: a custom property would restyle every descendant.
    this.sheet.style.transform = `translateY(${dy}px)`;
  };

  /** A downward flick faster than 0.11 px/ms dismisses the sheet (no distance needed), as does a drag past a third of it; otherwise it settles back. */
  private onDragEnd = (ev: PointerEvent) => {
    if (!this.drag || ev.pointerId !== this.drag.id || !this.sheet) return;
    const { dy, t } = this.drag;
    const velocity = dy / Math.max(1, ev.timeStamp - t);
    this.drag = undefined;
    this.sheet.classList.remove('sc-date-range__picker--dragging');
    this.sheet.style.removeProperty('transform');
    if (velocity > 0.11 || dy > this.sheet.offsetHeight / 3) this.closePicker(true);
  };

  // Rendering --------------------------------------------------------------------------------

  private errorState(): { text?: string; parts: Set<End>; show: boolean } {
    const hasOwn = !!this.error || !!this.slotted.error;
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

  private onSegmentClick = (end: End) => (ev: MouseEvent) => {
    const input = this.inputs[end];
    if (input && ev.target !== input) input.focus();
  };

  private renderSegment(end: End, invalid: boolean, disabled: boolean, described?: string) {
    const t = this.t;
    return (
      // The whole 54px segment, label included, is the input's target (A11Y-04), not only the text line.
      <div class={{ 'sc-date-range__segment': true, [`sc-date-range__segment--${end}`]: true, 'sc-date-range__segment--error': invalid }} onClick={this.onSegmentClick(end)}>
        <span class="sc-date-range__segment-label" aria-hidden="true">
          {t(end === 'start' ? 'dateRangeFrom' : 'dateRangeTo')}
        </span>
        <input
          ref={(el) => (this.inputs[end] = el)}
          id={`${this.uid}-${end}`}
          class="sc-date-range__segment-input"
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
    const id = `${this.uid}-month-${m.year}-${m.month}`;
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
      <div class="sc-date-range__month" key={id}>
        <div class="sc-date-range__month-head">
          {!sheet && index === 0 && (
            <button type="button" class="sc-date-range__nav sc-date-range__nav--prev" aria-label={t('dateRangePrevMonth')} disabled={!this.canGo(-1)} onClick={() => this.go(-1)}>
              <ChevronBack />
            </button>
          )}
          <h2 id={id} class="sc-date-range__month-title">
            {this.monthTitle(m)}
          </h2>
          {!sheet && index === count - 1 && (
            <button type="button" class="sc-date-range__nav sc-date-range__nav--next" aria-label={t('dateRangeNextMonth')} disabled={!this.canGo(1)} onClick={() => this.go(1)}>
              <ChevronForward />
            </button>
          )}
        </div>
        <table class="sc-date-range__grid" role="grid" aria-labelledby={id} onKeyDown={this.onGridKey} onMouseLeave={() => (this.hover = '')}>
          <thead class={{ 'visually-hidden': sheet }}>
            <tr>
              {short.map((d, i) => (
                <th scope="col" abbr={long[i]} class="sc-date-range__weekday">
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
                  if (!iso) return <td class="sc-date-range__day sc-date-range__day--blank" role="gridcell" />;
                  const disabled = this.isDisabled(iso);
                  const isStart = iso === start;
                  const isEnd = iso === end;
                  const inBand = !!(start && bandEnd && iso >= start && iso <= bandEnd && start !== bandEnd);
                  const selected = !!(start && ((end && iso >= start && iso <= end) || isStart));
                  const cls = {
                    'sc-date-range__day': true,
                    'sc-date-range__day--band': inBand,
                    'sc-date-range__day--preview': inBand && !end,
                    'sc-date-range__day--band-start': inBand && iso === start,
                    'sc-date-range__day--band-end': inBand && iso === bandEnd,
                    // The band is rounded where it meets a row edge or a month boundary.
                    'sc-date-range__day--edge-start': inBand && (col === 0 || iso === monthFirst),
                    'sc-date-range__day--edge-end': inBand && (col === 6 || iso === monthLast),
                  };
                  return (
                    <td class={cls} role="gridcell" aria-selected={selected ? 'true' : 'false'}>
                      <button
                        type="button"
                        class={{
                          'sc-date-range__day-button': true,
                          'sc-date-range__day-button--end': isStart || isEnd,
                          'sc-date-range__day-button--today': iso === this.todayValue,
                          'sc-date-range__day-button--disabled': disabled,
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
      <div class="sc-date-range__presets" role="group" aria-label={t('dateRangePresets')}>
        {presets.map((p) => {
          const on = p.start === start && p.end === end;
          return (
            <button type="button" class={{ 'sc-date-range__preset': true, 'sc-date-range__preset--on': on }} aria-pressed={on ? 'true' : 'false'} onClick={() => this.applyPreset(p)}>
              {on && <CheckMark />}
              {p.label}
            </button>
          );
        })}
      </div>
    );

    return [
      sheet && (
        <div class="sc-date-range__sheet-head">
          <div class="sc-date-range__sheet-grab" onPointerDown={this.onDragStart} onPointerMove={this.onDragMove} onPointerUp={this.onDragEnd} onPointerCancel={this.onDragEnd}>
            <span class="sc-date-range__grabber" aria-hidden="true" />
          </div>
          <div class="sc-date-range__sheet-title-row">
            <h2 class="sc-date-range__sheet-title" id={`${this.uid}-title`}>
              {t('dateRangeChoose')}
            </h2>
            <button type="button" class="sc-date-range__nav sc-date-range__close" aria-label={t('dateRangeClose')} onClick={() => this.closePicker(true)}>
              <Close />
            </button>
          </div>
          <div class="sc-date-range__chips">
            {(['start', 'end'] as End[]).map((e) => (
              <button type="button" class={{ 'sc-date-range__chip': true, 'sc-date-range__chip--on': target === e }} aria-pressed={target === e ? 'true' : 'false'} onClick={() => (this.target = e)}>
                <span class="sc-date-range__chip-label">{t(e === 'start' ? 'dateRangeFrom' : 'dateRangeTo')}</span>
                <span class="sc-date-range__chip-value">{this.pending[e] ? this.format(this.pending[e], { year: false }) : t('dateRangeChipEmpty')}</span>
              </button>
            ))}
          </div>
          {presetButtons}
          <div class="sc-date-range__weekdays" aria-hidden="true">
            {this.list('dateRangeWeekdaysShort').map((d) => (
              <span class="sc-date-range__weekday">{d}</span>
            ))}
          </div>
        </div>
      ),
      <div class="sc-date-range__picker-body">
        {!sheet && presetButtons}
        <div class="sc-date-range__months">
          {months.map((m, i) => this.renderMonth(m, i, months.length))}
        </div>
      </div>,
      <div class="sc-date-range__picker-foot">
        <p class="sc-date-range__summary">{note}</p>
        <div class="sc-date-range__foot-actions">
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
    const id = this.uid;
    const { slotted } = this;
    const hasHint = !!this.hint || !!slotted.hint;
    const err = this.errorState();
    const described = describedBy(hasHint && `${id}-hint`, err.show && `${id}-error`);
    const range = isIso(this.start) && isIso(this.end) ? this.spoken(this.start, this.end) : '';
    const buttonLabel = range ? this.t('dateRangeChooseSet', { range }) : this.t('dateRangeChoose');
    const sheet = this.mode === 'sheet';
    const pickerContent = this.isOpen ? this.renderPicker() : null;

    return (
      <Host>
        <fieldset class={{ 'sc-field': true, 'sc-field--error': err.show }} role="group" aria-describedby={described} disabled={this.disabled}>
          <FieldLabel id={`${id}-label`} text={this.label} rich={slotted.label} optional={this.optional} optionalText={t('fieldOptional')} level={headingLevel(this.headingLevel)} as="legend" />
          <FieldHint id={`${id}-hint`} text={this.hint} rich={slotted.hint} show={hasHint} />
          <FieldError id={`${id}-error`} text={err.text} rich={this.error ? undefined : slotted.error} show={err.show} prefix={t('fieldErrorPrefix')} />
          <div class={{ 'sc-field__frame': true, 'sc-date-range__frame': true, 'sc-field__frame--error': err.parts.size === 2, 'sc-date-range__frame--open': this.isOpen }}>
            {this.renderSegment('start', err.parts.has('start'), this.disabled, described)}
            <ArrowForward class="sc-date-range__range-arrow" />
            {this.renderSegment('end', err.parts.has('end'), this.disabled, described)}
            <button
              ref={(el) => (this.calendarButton = el)}
              type="button"
              class="sc-date-range__calendar-button"
              aria-label={buttonLabel}
              aria-haspopup="dialog"
              aria-expanded={this.isOpen ? 'true' : 'false'}
              onClick={(ev: MouseEvent) => (this.isOpen ? this.closePicker(true) : this.openPicker(ev.detail === 0))}
            >
              <CalendarIcon />
            </button>
          </div>
          {this.name && [<input type="hidden" name={`${this.name}-start`} value={this.start} />, <input type="hidden" name={`${this.name}-end`} value={this.end} />]}
        </fieldset>
        <div
          ref={(el) => (this.popover = el)}
          class={{ 'sc-date-range__picker': true, 'sc-date-range__picker--popover': true, 'sc-date-range__picker--two': this.twoMonths, 'sc-date-range__picker--presets': this.presetList().length > 0, 'sc-date-range__picker--flipped': this.flipped, 'sc-date-range__picker--instant': this.instant }}
          {...{ popover: 'manual' }}
          role="dialog"
          aria-label={this.t('dateRangeChoose')}
          onKeyDown={this.onPickerKey}
        >
          {!sheet && pickerContent}
        </div>
        <dialog
          ref={(el) => (this.sheet = el)}
          class={{ 'sc-date-range__picker': true, 'sc-date-range__picker--sheet': true }}
          aria-labelledby={`${this.uid}-title`}
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
