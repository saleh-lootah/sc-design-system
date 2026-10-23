import { Component, Element, Event, EventEmitter, Host, Prop, State, h } from '@stencil/core';
import { LocaleController } from '../../i18n/controller';
import strings from '../../i18n/components/sc-table';
import { StringsInput, overrideTranslator, plural } from './strings-override';
import { ArrowDownwardPath, ArrowUpwardPath, UnfoldMorePath } from '../../icons/for/sc-table';

type StringKey = keyof (typeof strings)['en'];

export type TableColumnType = 'text' | 'reference' | 'date' | 'amount' | 'status' | 'action';
export type SortDirection = 'ascending' | 'descending';

const TYPES: readonly TableColumnType[] = ['text', 'reference', 'date', 'amount', 'status', 'action'];
const SVG_NS = 'http://www.w3.org/2000/svg';
/** Skeleton bar widths for text columns, so the loading rows don't look machine-made. */
const SKELETON_WIDTHS = [72, 60, 80, 66, 76];
const SKELETON_ROWS = 5;

let nextId = 0;

/*
 * DOM helpers. The component walks children rather than using the HTMLTableElement API
 * (tHead, rows, cells…) or `:scope >`, which the spec-test DOM doesn't implement.
 */
type Row = HTMLTableRowElement;
type Cell = HTMLTableCellElement;

function kids<T extends Element>(el: Element | null | undefined, ...tags: string[]): T[] {
  return el ? (Array.from(el.children).filter((child) => tags.includes(child.tagName)) as T[]) : [];
}
const sectionOf = (table: Element, tag: 'CAPTION' | 'THEAD' | 'TFOOT') => kids<HTMLElement>(table, tag)[0] ?? null;
const bodiesOf = (table: Element) => kids<HTMLElement>(table, 'TBODY');
const rowsOf = (section: Element | null | undefined) => kids<Row>(section, 'TR');
const cellsOf = (row: Element) => kids<Cell>(row, 'TH', 'TD');
const spanOf = (cell: Element) => Math.max(1, Number(cell.getAttribute('colspan')) || 1);

/** Sets or removes a boolean attribute. */
function flag(el: Element | null | undefined, name: string, on: boolean) {
  if (!el) return;
  if (on) el.setAttribute(name, '');
  else el.removeAttribute(name);
}

/** The first child element with a class. */
function childWith(el: Element, cls: string): Element | null {
  return Array.from(el.children).find((child) => child.classList.contains(cls)) ?? null;
}

/**
 * A table compares rows of the same kind of thing across a few attributes: fines, payments,
 * permit applications. It styles and enhances a slotted native `<table>`; it never rebuilds
 * one out of divs, so screen readers announce rows, columns and headers.
 *
 * The component is scoped (light DOM). Mark up the table as usual: `th scope="col"` in the
 * header, `th scope="row"` as each row's first cell, and give header cells a column type with
 * `data-type` (`text`, `reference`, `date`, `amount`, `status`, `action`) to set alignment,
 * wrapping and figures. The component then:
 * - writes the `caption` property into a native `<caption>` (the table's accessible name);
 * - turns `th[data-sort]` headers into sort buttons with `aria-sort`, and emits `scSort`
 *   (the service sorts the data, usually on the server);
 * - with `selectable`, adds a checkbox column (rows are identified by `tr[data-id]`) and a
 *   selection bar, and emits `scSelectionChange`;
 * - fills empty cells with a muted "None";
 * - below 600px, stacks rows as cards (`responsive="stack"`) or scrolls sideways (`"scroll"`).
 *
 * Use `class="sc-visually-hidden"` inside the table for context only screen readers need
 * ("View <span class="sc-visually-hidden">fine F-2026-118204</span>").
 *
 * @slot - The native `<table>`.
 * @slot footer - Count and pagination: "Showing 1–20 of 1,284 fines", Previous and Next.
 * @slot empty - Shown in place of the body when there are no rows: "You have no fines".
 * @slot error - Shown in place of the body when the data could not load: an `sc-callout tone="error"` with a "Try again" button.
 * @slot actions - The selection bar's action: `<sc-button>Pay 2 fines</sc-button>`.
 */
@Component({
  tag: 'sc-table',
  styleUrl: 'sc-table.css',
  scoped: true,
})
export class ScTable {
  @Element() el!: HTMLElement;

  /** The table's accessible name, written into a native `<caption>`: "Your fines". Required unless the table already has a `<caption>`. */
  @Prop() caption?: string;

  /** Hides the caption visually (it is still announced). Use it when a heading straight above says the same thing. */
  @Prop({ reflect: true }) captionHidden = false;

  /** Row height: `default` (56) for the public, `compact` (44, body-s) for staff tools with long lists. */
  @Prop({ reflect: true }) density: 'default' | 'compact' = 'default';

  /** Behaviour below 600px: `stack` turns each row into a card (up to about 6 columns); `scroll` keeps the table in a horizontal scroll region. */
  @Prop({ reflect: true }) responsive: 'stack' | 'scroll' = 'stack';

  /** Adds a checkbox column at inline-start and a selection bar below the table. Rows are identified by `tr[data-id]`. */
  @Prop({ reflect: true }) selectable = false;

  /**
   * The selection bar text, with `{count}`: "{count} fines selected". Plural forms are
   * separated by `|`: "{count} fine selected|{count} fines selected" (Arabic:
   * zero|one|two|few|many|other). When the table has an amount column, the selected total follows it.
   */
  @Prop() selectionLabel?: string;

  /** Shows 5 skeleton rows in place of the body. The header stays real. */
  @Prop({ reflect: true }) loading = false;

  /** The rows are the result of a filter: when there are none, the header stays (for "No fines from 1 to 31 March 2026"). */
  @Prop({ reflect: true }) filtered = false;

  /** Overrides the built-in English and Arabic strings, as JSON: `{"tableSelectRow": "Select fine {row}", "tableSelectAll": "Select all fines on this page"}`, or per language: `{"ar": {…}}`. */
  @Prop() strings?: StringsInput;

  /** Fires when a sortable header is activated, with `{ column, direction }`. `column` is the header's `data-sort` value, or its text. The service sorts the rows. */
  @Event({ bubbles: true, composed: true }) scSort!: EventEmitter<{ column: string; direction: SortDirection }>;

  /** Fires when the selection changes, with `{ ids }` (the selected rows' `data-id`). */
  @Event({ bubbles: true, composed: true }) scSelectionChange!: EventEmitter<{ ids: string[] }>;

  @State() selected: string[] = [];
  @State() announcement = '';
  @State() selectionText = '';
  @State() selectionInstant = false;
  /** The bar shows the count (Bold) and the total (Medium) side by side (board 09.05). */
  private selectionParts: string[] = [];
  @State() empty = false;
  @State() hasError = false;
  @State() hasFooter = false;
  @State() scrollEdges = { start: false, end: false };

  private locale = new LocaleController(this, strings);
  private observer?: MutationObserver;
  private resizeObserver?: ResizeObserver;
  private scroller?: HTMLElement;
  private captionId = `sc-table-caption-${++nextId}`;
  private enhancing = false;

  connectedCallback() {
    this.locale.connect();
  }

  disconnectedCallback() {
    this.locale.disconnect();
    this.observer?.disconnect();
    this.resizeObserver?.disconnect();
  }

  componentDidLoad() {
    if (typeof MutationObserver !== 'undefined') {
      this.observer = new MutationObserver(() => {
        if (this.enhancing) return;
        this.enhance();
        this.updateScroll();
      });
      this.observer.observe(this.el, { childList: true, subtree: true, characterData: true });
    }
    if (typeof ResizeObserver !== 'undefined' && this.scroller) {
      this.resizeObserver = new ResizeObserver(() => this.updateScroll());
      // Fires once on observe, then on every size change.
      this.resizeObserver.observe(this.scroller);
      // The sticky column's width follows the table's content (WCAG 2.4.11 scroll padding).
      if (this.table) this.resizeObserver.observe(this.table);
    }
  }

  componentDidRender() {
    // A language change re-renders and can change the row header column's width.
    this.updateScroll();
  }

  componentWillRender() {
    // Runs before every render (a language change re-renders): re-label the injected
    // checkboxes and "None" cells, and read the state the template shows.
    this.enhance();
  }

  private get t() {
    return overrideTranslator<StringKey>(this.locale.lang, this.strings, this.locale.t);
  }

  private get table(): HTMLTableElement | null {
    return this.el.querySelector('table');
  }

  // Enhancing the slotted table --------------------------------------------------------

  /** Brings the light-DOM table in line with the props. Idempotent; runs on every change. */
  private enhance() {
    const table = this.table;
    if (!table || this.enhancing) return;
    this.enhancing = true;
    try {
      this.enhanceCaption(table);
      const headRow = this.headerRow(table);
      const types = this.enhanceHeader(table, headRow);
      const rows = this.bodyRows(table);
      for (const row of rows) this.enhanceRow(row, types, headRow);
      for (const row of rowsOf(sectionOf(table, 'TFOOT'))) this.enhanceRow(row, types, null);
      this.enhanceSkeleton(table, types);
      this.enhanceRoles(table);
      if (this.loading) table.setAttribute('aria-busy', 'true');
      else table.removeAttribute('aria-busy');
      this.syncSelection(rows, headRow);
      this.readState(table, rows);
    } finally {
      // Let the observer see our own mutations before we listen again.
      this.observer?.takeRecords();
      this.enhancing = false;
    }
  }

  private enhanceCaption(table: HTMLTableElement) {
    let caption = sectionOf(table, 'CAPTION');
    if (!caption && this.caption) {
      caption = document.createElement('caption');
      table.insertBefore(caption, table.firstChild);
    }
    if (!caption) return;
    if (this.caption && caption.textContent !== this.caption) caption.textContent = this.caption;
    if (!caption.id) caption.id = this.captionId;
    if (this.captionHidden) caption.classList.add('sc-table__caption--hidden');
    else caption.classList.remove('sc-table__caption--hidden');
  }

  private headerRow(table: HTMLTableElement): Row | null {
    const rows = rowsOf(sectionOf(table, 'THEAD'));
    if (rows.length) return rows[rows.length - 1];
    return null;
  }

  private bodyRows(table: HTMLTableElement): Row[] {
    return bodiesOf(table)
      .filter((body) => !body.classList.contains('sc-table__skeleton'))
      .flatMap((body) => rowsOf(body));
  }

  /** Data cells of a row, without the injected checkbox cell. */
  private cells(row: Row): Cell[] {
    return cellsOf(row).filter((cell) => !cell.classList.contains('sc-table__select'));
  }

  private typeOf(cell: Element | undefined): TableColumnType {
    const type = cell?.getAttribute('data-type') as TableColumnType;
    return TYPES.includes(type) ? type : 'text';
  }

  private enhanceHeader(table: HTMLTableElement, headRow: Row | null): TableColumnType[] {
    if (!headRow) return [];
    const headers = this.cells(headRow);
    for (const th of headers) {
      if (th.tagName === 'TH' && !th.hasAttribute('scope')) th.setAttribute('scope', 'col');
      th.setAttribute('data-type', this.typeOf(th));
      if (th.hasAttribute('data-sort')) this.enhanceSortHeader(th);
    }
    this.toggleSelectCell(headRow, 'head');
    void table;
    return headers.map((th) => this.typeOf(th));
  }

  private enhanceSortHeader(th: Cell) {
    if (childWith(th, 'sc-table__sort')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'sc-table__sort';
    const label = document.createElement('span');
    label.className = 'sc-table__sort-label';
    while (th.firstChild) label.appendChild(th.firstChild);
    button.appendChild(label);
    button.appendChild(this.sortGlyph());
    th.appendChild(button);
    button.addEventListener('click', () => this.sort(th));
  }

  /** Three glyphs; CSS shows the one that matches the header's aria-sort. Arrows are vertical, so they never mirror. */
  private sortGlyph(): Element {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'sc-table__sort-glyph');
    // Material Symbols (D13): unfold_more, arrow_upward, arrow_downward, Outlined, on the 960 grid.
    svg.setAttribute('viewBox', '0 -960 960 960');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.setAttribute('fill', 'currentColor');
    const paths: Record<string, string> = {
      none: UnfoldMorePath,
      ascending: ArrowUpwardPath,
      descending: ArrowDownwardPath,
    };
    for (const [state, d] of Object.entries(paths)) {
      const path = document.createElementNS(SVG_NS, 'path');
      path.setAttribute('d', d);
      path.setAttribute('class', `sc-table__glyph-${state}`);
      svg.appendChild(path);
    }
    return svg;
  }

  private enhanceRow(row: Row, types: TableColumnType[], headRow: Row | null) {
    const t = this.t;
    const headers = this.headerRow(this.table!) ? this.cells(this.headerRow(this.table!)!) : [];
    let column = 0;
    this.cells(row).forEach((cell, i) => {
      // Cells that span columns take the type of the first column they cover.
      const type = types[column] ?? 'text';
      const header = headers[column];
      column += spanOf(cell);
      if (cell.getAttribute('data-type') !== type) cell.setAttribute('data-type', type);
      const label = header && spanOf(cell) === 1 ? this.headerText(header) : '';
      if (label && cell.getAttribute('data-label') !== label) cell.setAttribute('data-label', label);
      if (i === 0 && cell.tagName === 'TH' && !cell.hasAttribute('scope')) cell.setAttribute('scope', 'row');
      // A missing optional value reads "None", never an empty cell or a bare dash.
      const none = childWith(cell, 'sc-table__none');
      if (none) {
        if (none.textContent !== t('tableNone')) none.textContent = t('tableNone');
      } else if (type !== 'action' && row.parentElement?.tagName === 'TBODY' && !cell.textContent?.trim() && !cell.children.length) {
        const span = document.createElement('span');
        span.className = 'sc-table__none';
        span.textContent = t('tableNone');
        cell.appendChild(span);
      }
    });
    this.toggleSelectCell(row, row.parentElement?.tagName === 'TFOOT' ? 'foot' : 'body');
    void headRow;
  }

  private headerText(th: Cell): string {
    const label = th.querySelector('.sc-table__sort-label') ?? th;
    return (label.textContent ?? '').replace(/\s+/g, ' ').trim();
  }

  /** The row's id: `data-id`, else its row header's text. */
  private rowId(row: Row): string {
    return row.dataset.id || (this.cells(row)[0]?.textContent ?? '').replace(/\s+/g, ' ').trim();
  }

  private rowName(row: Row): string {
    const header = this.cells(row).find((cell) => cell.tagName === 'TH') ?? this.cells(row)[0];
    return (header?.textContent ?? '').replace(/\s+/g, ' ').trim();
  }

  /** Adds or removes the checkbox cell at inline-start of a row. */
  private toggleSelectCell(row: Row, section: 'head' | 'body' | 'foot') {
    const existing = childWith(row, 'sc-table__select');
    if (!this.selectable) {
      existing?.remove();
      return;
    }
    if (existing) return;
    const cell = document.createElement(section === 'head' ? 'th' : 'td');
    cell.className = 'sc-table__select';
    if (section === 'head') cell.setAttribute('scope', 'col');
    if (section !== 'foot') {
      const wrap = document.createElement('label');
      wrap.className = 'sc-table__check';
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.className = 'sc-table__box';
      const mark = document.createElement('span');
      mark.className = 'sc-table__mark';
      mark.setAttribute('aria-hidden', 'true');
      wrap.append(input, mark);
      cell.appendChild(wrap);
      input.addEventListener('change', () => {
        // Space on a focused checkbox is a keyboard action: the selection bar comes and goes at once (MOT-02).
        try {
          this.selectionInstant = input.matches(':focus-visible');
        } catch {
          this.selectionInstant = false; // a DOM without :focus-visible (the spec tests' mock document)
        }
        if (section === 'head') this.toggleAll(input.checked);
        else this.toggleRow(row, input.checked);
      });
    }
    row.insertBefore(cell, row.firstChild);
  }

  private enhanceSkeleton(table: HTMLTableElement, types: TableColumnType[]) {
    let skeleton = bodiesOf(table).find((body) => body.classList.contains('sc-table__skeleton'));
    for (const body of bodiesOf(table)) if (body !== skeleton) flag(body, 'data-sc-hidden', this.loading);
    flag(sectionOf(table, 'TFOOT'), 'data-sc-hidden', this.loading);
    if (!this.loading) {
      skeleton?.remove();
      return;
    }
    const columns = (this.selectable ? 1 : 0) + Math.max(types.length, 1);
    if (skeleton && rowsOf(skeleton)[0] && cellsOf(rowsOf(skeleton)[0]).length === columns) return;
    skeleton?.remove();
    skeleton = document.createElement('tbody');
    skeleton.className = 'sc-table__skeleton';
    skeleton.setAttribute('aria-hidden', 'true');
    for (let r = 0; r < SKELETON_ROWS; r++) {
      const row = skeleton.appendChild(document.createElement('tr'));
      if (this.selectable) row.appendChild(document.createElement('td')).className = 'sc-table__select';
      (types.length ? types : (['text'] as TableColumnType[])).forEach((type) => {
        const cell = row.appendChild(document.createElement('td'));
        cell.setAttribute('data-type', type);
        const bar = document.createElement('span');
        bar.className = `sc-table__bar sc-table__bar--${type}`;
        if (type === 'text' || type === 'reference' || type === 'date') bar.style.inlineSize = `${SKELETON_WIDTHS[r % SKELETON_WIDTHS.length]}%`;
        cell.appendChild(bar);
      });
    }
    table.appendChild(skeleton);
  }

  /**
   * Stacked rows are laid out with CSS grid, which makes some browsers drop the native table
   * semantics. Explicit roles keep rows, headers and cells announced in the stacked layout.
   */
  private enhanceRoles(table: HTMLTableElement) {
    const stack = this.responsive === 'stack';
    const set = (el: Element, role: string) => (stack ? el.getAttribute('role') !== role && el.setAttribute('role', role) : el.getAttribute('role') === role && el.removeAttribute('role'));
    set(table, 'table');
    for (const section of [sectionOf(table, 'THEAD'), ...bodiesOf(table), sectionOf(table, 'TFOOT')]) {
      if (!section) continue;
      set(section, 'rowgroup');
      for (const row of rowsOf(section)) {
        set(row, 'row');
        for (const cell of cellsOf(row)) {
          const scope = cell.getAttribute('scope');
          set(cell, cell.tagName === 'TH' ? (scope === 'row' ? 'rowheader' : 'columnheader') : 'cell');
        }
      }
    }
  }

  // Sorting --------------------------------------------------------------------------------

  private sort(th: Cell) {
    const current = th.getAttribute('aria-sort');
    const direction: SortDirection = current === 'ascending' ? 'descending' : 'ascending';
    const headRow = th.parentElement as Row;
    // Only one column is sorted at a time.
    for (const other of this.cells(headRow)) if (other !== th && other.hasAttribute('aria-sort')) other.removeAttribute('aria-sort');
    th.setAttribute('aria-sort', direction);
    const name = this.headerText(th);
    const column = th.getAttribute('data-sort') || name;
    const type = this.typeOf(th);
    const kind = type === 'amount' ? 'Amount' : type === 'date' ? 'Date' : 'Text';
    const order = this.t(`tableSort${kind}${direction === 'ascending' ? 'Ascending' : 'Descending'}` as StringKey);
    this.announcement = this.t('tableSortedBy', { column: name, order });
    this.scSort.emit({ column, direction });
  }

  // Selection ------------------------------------------------------------------------------

  private toggleRow(row: Row, checked: boolean) {
    const id = this.rowId(row);
    const next = new Set(this.selected);
    if (checked) next.add(id);
    else next.delete(id);
    this.commitSelection(next);
  }

  private toggleAll(checked: boolean) {
    const next = new Set(this.selected);
    for (const row of this.bodyRows(this.table!)) {
      if (checked) next.add(this.rowId(row));
      else next.delete(this.rowId(row));
    }
    this.commitSelection(next);
  }

  private commitSelection(next: Set<string>) {
    this.selected = Array.from(next);
    this.enhance();
    this.scSelectionChange.emit({ ids: this.selected });
  }

  /** Reads initial `data-selected` rows once, then mirrors the selection onto checkboxes and rows. */
  private initialised = false;

  private syncSelection(rows: Row[], headRow: Row | null) {
    if (!this.initialised && this.selectable) {
      this.initialised = true;
      const initial = rows.filter((row) => row.hasAttribute('data-selected')).map((row) => this.rowId(row));
      if (initial.length) this.selected = Array.from(new Set([...this.selected, ...initial]));
    }
    const selected = new Set(this.selectable ? this.selected : []);
    const t = this.t;
    let on = 0;
    for (const row of rows) {
      const isOn = selected.has(this.rowId(row));
      if (isOn) on++;
      flag(row, 'data-selected', isOn);
      const box = childWith(row, 'sc-table__select')?.querySelector('input') ?? null;
      if (box) {
        box.checked = isOn;
        const label = t('tableSelectRow', { row: this.rowName(row) });
        if (box.getAttribute('aria-label') !== label) box.setAttribute('aria-label', label);
      }
    }
    const all = headRow ? (childWith(headRow, 'sc-table__select')?.querySelector('input') ?? null) : null;
    if (all) {
      all.checked = rows.length > 0 && on === rows.length;
      all.indeterminate = on > 0 && on < rows.length;
      const label = t('tableSelectAll');
      if (all.getAttribute('aria-label') !== label) all.setAttribute('aria-label', label);
    }
    this.selectionParts = selected.size ? this.selectionSummary(rows, selected) : [];
    const text = this.selectionParts.join(' · ');
    if (text !== this.selectionText) this.selectionText = text;
  }

  /** "2 fines selected · AED 1,700.00". */
  private selectionSummary(rows: Row[], selected: Set<string>): string[] {
    const count = selected.size;
    const template = this.selectionLabel ?? this.t('tableSelected');
    const label = plural(template, count, this.locale.lang).replace(/\{count\}/g, String(count));
    const total = this.selectedTotal(rows, selected);
    return total ? [label, total] : [label];
  }

  /** The sum of the amount column over the selected rows, written like the first selected amount. */
  private selectedTotal(rows: Row[], selected: Set<string>): string {
    const headRow = this.headerRow(this.table!);
    if (!headRow) return '';
    const index = this.cells(headRow).findIndex((th) => this.typeOf(th) === 'amount');
    if (index < 0) return '';
    const chosen = rows.filter((row) => selected.has(this.rowId(row)));
    // Selected rows on other pages can't be summed here, so no total is better than a wrong one.
    if (chosen.length !== selected.size) return '';
    let sum = 0;
    let sample = '';
    let decimals = 0;
    for (const row of chosen) {
      const cell = this.cells(row)[index];
      const text = (cell?.textContent ?? '').trim();
      const raw = cell?.getAttribute('data-value') ?? text.replace(/[^\d.-]/g, '');
      const value = Number(raw);
      if (!raw || Number.isNaN(value)) return '';
      sum += value;
      if (!sample) sample = text;
      decimals = Math.max(decimals, (/\.(\d+)/.exec(text)?.[1].length ?? 0));
    }
    const formatted = sum.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    return /\d[\d,]*(\.\d+)?/.test(sample) ? sample.replace(/\d[\d,]*(\.\d+)?/, formatted) : formatted;
  }

  // State and scrolling --------------------------------------------------------------------

  private readState(table: HTMLTableElement, rows: Row[]) {
    const hasError = !!this.el.querySelector('[slot="error"]');
    const empty = !this.loading && !hasError && rows.length === 0;
    const hasFooter = !!this.el.querySelector('[slot="footer"]');
    // In the error state the callout replaces the body.
    for (const body of bodiesOf(table)) if (!body.classList.contains('sc-table__skeleton')) flag(body, 'data-sc-hidden', this.loading || hasError);
    flag(sectionOf(table, 'TFOOT'), 'data-sc-hidden', this.loading || hasError || empty);
    // An empty table hides its header, unless the rows are filtered ("No results"). With no
    // header and no rows left there is no table to announce, so the message stands alone.
    flag(sectionOf(table, 'THEAD'), 'data-sc-hidden', (empty || hasError) && !this.filtered);
    flag(table, 'data-sc-hidden', (empty || hasError) && !this.filtered);
    if (empty !== this.empty) this.empty = empty;
    if (hasError !== this.hasError) this.hasError = hasError;
    if (hasFooter !== this.hasFooter) this.hasFooter = hasFooter;
  }

  /** Makes the region focusable only when it actually scrolls, and shows the edge on the side with more content. */
  private updateScroll = (ev?: Event) => {
    const scroller = this.scroller;
    if (!scroller) return;
    // Any table that is wider than its container scrolls rather than clipping data; `scroll` mode
    // adds the sticky row headers below 600px.
    const scrolls = scroller.scrollWidth > scroller.clientWidth + 1;
    const caption = this.table ? sectionOf(this.table, 'CAPTION') : null;
    if (scrolls) {
      scroller.setAttribute('role', 'region');
      scroller.setAttribute('tabindex', '0');
      if (caption?.id) scroller.setAttribute('aria-labelledby', caption.id);
    } else {
      scroller.removeAttribute('role');
      scroller.removeAttribute('tabindex');
      scroller.removeAttribute('aria-labelledby');
    }
    // scrollLeft is negative in RTL in every current engine; its magnitude is the distance from the start.
    const offset = Math.abs(scroller.scrollLeft);
    const max = scroller.scrollWidth - scroller.clientWidth;
    const edges = { start: scrolls && offset > 1, end: scrolls && offset < max - 1 };
    if (edges.start !== this.scrollEdges.start || edges.end !== this.scrollEdges.end) this.scrollEdges = edges;
    // WCAG 2.4.11: a control focused in a later column scrolls clear of the sticky row-header
    // column, not under it. The scroll padding at inline-start (the right in RTL) is that
    // column's width, read from the cells that are actually sticky.
    // The width doesn't change while scrolling, so a scroll event skips the measurement.
    if (ev) return;
    const sticky = this.stickyWidth();
    const current = scroller.style.getPropertyValue('--_sticky-w');
    if (sticky && current !== `${sticky}px`) scroller.style.setProperty('--_sticky-w', `${sticky}px`);
    else if (!sticky && current) scroller.style.removeProperty('--_sticky-w');
  };

  /** The width of the sticky cells (checkbox and row header) at the start of a body row, or 0. */
  private stickyWidth(): number {
    const row = this.table?.querySelector('tbody tr');
    if (!row || typeof getComputedStyle !== 'function') return 0;
    let start = Infinity;
    let end = -Infinity;
    for (const cell of Array.from(row.children) as HTMLElement[]) {
      if (getComputedStyle(cell).position !== 'sticky') continue;
      const box = cell.getBoundingClientRect();
      start = Math.min(start, box.left);
      end = Math.max(end, box.right);
    }
    return end > start ? Math.ceil(end - start) : 0;
  }

  render() {
    const open = this.selectable && this.selected.length > 0;
    return (
      <Host
        class={{
          'sc-table--empty': this.empty,
          'sc-table--error': this.hasError,
          'sc-table--edge-start': this.scrollEdges.start,
          'sc-table--edge-end': this.scrollEdges.end,
        }}
      >
        <div class="container">
          <div class="scroller" ref={(el) => (this.scroller = el)} onScroll={this.updateScroll}>
            <slot />
          </div>
          <div class="state state--error" hidden={!this.hasError}>
            <slot name="error" />
          </div>
          <div class="state state--empty" hidden={!this.empty}>
            <slot name="empty" />
          </div>
          <div class="footer" hidden={!this.hasFooter}>
            <slot name="footer" />
          </div>
        </div>
        <div class={{ 'selection-bar': true, 'selection-bar--open': open, 'selection-bar--instant': this.selectionInstant }}>
          <p class="selection-text">
            {this.selectionParts.map((part, i) => (i ? [<span class="selection-sep"> · </span>, <bdi class="selection-total">{part}</bdi>] : <bdi class="selection-count">{part}</bdi>))}
          </p>
          <div class="selection-actions">
            <slot name="actions" />
          </div>
        </div>
        <div class="visually-hidden" aria-live="polite">
          {this.announcement}
        </div>
        <div class="visually-hidden" aria-live="polite">
          {open ? this.selectionText : ''}
        </div>
      </Host>
    );
  }
}
