import { Component, Element, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { LocaleController } from '../../i18n/controller';
import strings from '../../i18n/components/sc-filter-chips';

export interface FilterChip {
  /** What the filter is, sent back in `scRemove`. */
  value: string;
  /** What people see: "Transport and vehicles". */
  label: string;
}

type Plural = 'Zero' | 'One' | 'Two' | 'Few' | 'Many' | 'Other';
let counter = 0;

/**
 * The filters applied to a list of results, as removable chips beside the result count, with
 * "Clear all filters" when there are two or more (component-language B18, applied filter).
 *
 * Each chip is a native `<button>` named "Remove filter: Transport and vehicles". Removing one
 * takes it away at once (no animation), emits `scRemove`, and moves focus to the next chip,
 * else the previous one, else the element named by `focus-target` (the results heading).
 * Every change in the number of filters is announced politely: "2 filters applied".
 * The page updates its results on `scRemove` / `scClear`; set `filters` to change the chips.
 *
 * Chips are 32px tall (decision Q-chips) with a 44px target. Light DOM (Stencil `scoped`).
 */
@Component({
  tag: 'sc-filter-chips',
  styleUrl: 'sc-filter-chips.css',
  scoped: true,
})
export class ScFilterChips {
  @Element() el!: HTMLElement;

  /**
   * The applied filters, in order: an array of `{ value, label }`, or the same as JSON in the
   * attribute (`filters='[{"value":"transport","label":"Transport and vehicles"}]'`).
   */
  @Prop({ mutable: true }) filters: FilterChip[] | string = [];

  /** The group's accessible name. Defaults to "Applied filters" ("عوامل التصفية المطبّقة"). */
  @Prop() label?: string;

  /** The id of the element that gets focus when the last chip goes, usually the results heading. It is made focusable (`tabindex="-1"`) if it isn't. */
  @Prop() focusTarget?: string;

  /** Hides "Clear all filters". */
  @Prop() noClear = false;

  /** Fires when a chip is removed, with `{ value, label }`. The chip is already gone. */
  @Event({ bubbles: true, composed: true }) scRemove!: EventEmitter<FilterChip>;

  /** Fires when "Clear all filters" is used. Every chip is already gone. */
  @Event({ bubbles: true, composed: true }) scClear!: EventEmitter<void>;

  @State() announcement = '';

  private uid = `sc-filter-chips-${++counter}`;
  private locale = new LocaleController(this, strings);
  private list?: HTMLElement;
  private loaded = false;

  connectedCallback() {
    this.locale.connect();
  }

  disconnectedCallback() {
    this.locale.disconnect();
  }

  componentDidLoad() {
    this.loaded = true;
  }

  /** A new list from the page is announced too (a filter added elsewhere on the page). */
  @Watch('filters')
  onFiltersChange(next: FilterChip[] | string, prev: FilterChip[] | string) {
    if (!this.loaded || this.internal) return;
    if (parse(next).length !== parse(prev).length) this.announcement = this.count(parse(next).length);
  }

  private internal = false;

  private get chips(): FilterChip[] {
    return parse(this.filters);
  }

  private plural(n: number): Plural {
    let cat = 'other';
    try {
      cat = new Intl.PluralRules(this.locale.lang).select(n);
    } catch {
      /* "other" */
    }
    if (n === 0) return 'Zero';
    return (cat.charAt(0).toUpperCase() + cat.slice(1)) as Plural;
  }

  private count(n: number): string {
    return this.locale.t(`filterChipsCount${this.plural(n)}`, { count: n });
  }

  private set(next: FilterChip[]) {
    this.internal = true;
    this.filters = next;
    this.internal = false;
  }

  private focusAfter(index: number) {
    const buttons = Array.from(this.list?.querySelectorAll<HTMLButtonElement>('.sc-filter-chips__chip') ?? []);
    const next = buttons[index] ?? buttons[index - 1];
    if (next) {
      next.focus();
      return;
    }
    const target = this.focusTarget ? document.getElementById(this.focusTarget) : null;
    if (target) {
      if (!target.matches('a[href], button, input, select, textarea, [tabindex]')) target.setAttribute('tabindex', '-1');
      target.focus();
    }
  }

  private remove = (chip: FilterChip, index: number) => {
    const next = this.chips.filter((_, i) => i !== index);
    this.set(next);
    this.announcement = this.locale.t('filterChipsRemoved', { label: chip.label, count: this.count(next.length) });
    this.scRemove.emit({ value: chip.value, label: chip.label });
    // The chip disappears at once; focus moves once the list has re-rendered.
    requestAnimationFrame(() => this.focusAfter(index));
  };

  private clear = () => {
    this.set([]);
    this.announcement = this.count(0);
    this.scClear.emit();
    requestAnimationFrame(() => this.focusAfter(0));
  };

  render() {
    const { t } = this.locale;
    const chips = this.chips;
    return (
      <Host>
        <div class="sc-filter-chips" role="group" aria-label={this.label || t('filterChipsLabel')} hidden={chips.length === 0}>
          <ul class="sc-filter-chips__list" ref={(el) => (this.list = el)}>
            {chips.map((chip, i) => (
              <li class="sc-filter-chips__item" key={chip.value}>
                <button type="button" class="sc-filter-chips__chip" aria-label={t('filterChipsRemove', { label: chip.label })} onClick={() => this.remove(chip, i)}>
                  <span class="sc-filter-chips__label" aria-hidden="true">
                    {chip.label}
                  </span>
                  <svg class="icon sc-filter-chips__close" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">
                    <path d="M6 6l12 12" />
                    <path d="M18 6L6 18" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
          {chips.length > 1 && !this.noClear && (
            <button type="button" class="sc-filter-chips__clear" onClick={this.clear}>
              {t('filterChipsClear')}
            </button>
          )}
        </div>
        <span id={`${this.uid}-status`} class="visually-hidden" aria-live="polite" aria-atomic="true">
          {this.announcement}
        </span>
      </Host>
    );
  }
}

/** The `filters` property, from an array or JSON. Entries without a value or label are dropped. */
function parse(input: FilterChip[] | string | undefined | null): FilterChip[] {
  let list: unknown = input;
  if (typeof input === 'string') {
    try {
      list = JSON.parse(input);
    } catch {
      list = [];
    }
  }
  return Array.isArray(list) ? (list.filter((c) => c && typeof c.value === 'string' && typeof c.label === 'string') as FilterChip[]) : [];
}
