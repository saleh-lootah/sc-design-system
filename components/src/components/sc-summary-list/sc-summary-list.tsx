import { Component, Element, Host, Prop, State, h } from '@stencil/core';
import { LocaleController } from '../../i18n/controller';
import strings from '../../i18n/components/sc-summary-list';

export type SummaryListAppearance = 'card' | 'plain';
export type SummaryListLayout = 'auto' | 'stacked' | 'columns' | 'pairs';

let nextRow = 0;

const LAYOUTS: readonly SummaryListLayout[] = ['auto', 'stacked', 'columns', 'pairs'];
/** Row attributes the list renders from; a change to any of them re-renders the list. */
const ROW_ATTRS = ['label', 'action-href', 'action-text', 'action-hidden-text', 'variant', 'hidden'];

interface RowData {
  label: string;
  href?: string;
  actionText?: string;
  hiddenText?: string;
  total: boolean;
}

/** Reads a row's props, falling back to attributes before the row has upgraded. */
function readRow(row: HTMLElement): RowData {
  const el = row as HTMLElement & Partial<Record<'label' | 'actionHref' | 'actionText' | 'actionHiddenText' | 'variant', string>>;
  return {
    label: el.label ?? row.getAttribute('label') ?? '',
    href: el.actionHref ?? row.getAttribute('action-href') ?? undefined,
    actionText: el.actionText ?? row.getAttribute('action-text') ?? undefined,
    hiddenText: el.actionHiddenText ?? row.getAttribute('action-hidden-text') ?? undefined,
    total: (el.variant ?? row.getAttribute('variant')) === 'total',
  };
}

/**
 * The "Check your answers" pattern (E3) and the payment summary (E4): rows of a key, a value
 * and an optional "Change" action, as one `<dl>`.
 *
 * v2 renders in light DOM (Stencil `scoped`, architecture §3.1). The list renders the
 * `<dl>` itself: one `<div>` per row holding the `<dt>` (the row's `label`), the value `<dd>`
 * and the action `<dd>`. Each `sc-summary-row` child is moved into its value `<dd>`, so the
 * description list is valid HTML (a `<dl>` may only contain `<div>`, `<dt>` and `<dd>`) and
 * rich values (addresses, `<sc-ltr>` plates) stay the service's own markup.
 *
 * Layouts: `stacked` puts the key above the value with the action in a fixed 64px end column
 * (E3); `columns` shows key, value and a fixed 96px action column; `pairs` puts the key in a
 * fixed column and end-aligns the value, with no actions (E4); `auto` (default) is `stacked`
 * below 600px of the list's own width and `columns` from there.
 *
 * @slot - `sc-summary-row` elements, one per answer. Other children are ignored.
 */
@Component({
  tag: 'sc-summary-list',
  styleUrl: 'sc-summary-list.css',
  scoped: true,
})
export class ScSummaryList {
  @Element() el!: HTMLElement;

  /** `card` (default) draws the rows on a 12px card with a 1px edge; `plain` draws only the row dividers, for use inside another card. */
  @Prop({ reflect: true }) appearance: SummaryListAppearance = 'card';

  /** `auto` (default), `stacked`, `columns` or `pairs`. See the component description. */
  @Prop({ reflect: true }) layout: SummaryListLayout = 'auto';

  /** Bumped when rows are added, removed or change. */
  @State() revision = 0;

  private locale = new LocaleController(this, strings);
  private observer?: MutationObserver;

  connectedCallback() {
    this.locale.connect();
    if (typeof MutationObserver !== 'undefined') {
      this.observer = new MutationObserver((records) => {
        // Only rows coming, going or changing a rendered attribute re-render the list.
        const relevant = records.some((r) =>
          r.type === 'attributes'
            ? (r.target as Element).localName === 'sc-summary-row'
            : [...Array.from(r.addedNodes), ...Array.from(r.removedNodes)].some((n) => (n as Element).localName === 'sc-summary-row'),
        );
        if (relevant) this.revision++;
      });
      this.observer.observe(this.el, { childList: true, subtree: true, attributes: true, attributeFilter: ROW_ATTRS });
    }
  }

  disconnectedCallback() {
    this.locale.disconnect();
    this.observer?.disconnect();
  }

  /** The rows, wherever they sit now (a direct child before the first render, inside a value dd after it). */
  private rows(): HTMLElement[] {
    return Array.from(this.el.querySelectorAll('sc-summary-row')).filter(
      (row) => row.closest('sc-summary-list') === this.el && !row.hasAttribute('hidden'),
    ) as HTMLElement[];
  }

  /**
   * Gives each row its own value slot, once. The name is stable for the row's lifetime, so
   * adding or removing other rows never has to move it to a different slot.
   */
  private slotOf(row: HTMLElement): string {
    let name = row.getAttribute('slot');
    if (!name || !name.startsWith('sc-summary-row-')) {
      name = `sc-summary-row-${++nextRow}`;
      row.setAttribute('slot', name);
    }
    return name;
  }

  render() {
    const { t } = this.locale;
    const rows = this.rows();
    const layout = LAYOUTS.includes(this.layout) ? this.layout : 'auto';
    const appearance = this.appearance === 'plain' ? 'plain' : 'card';
    void this.revision;
    return (
      <Host class={{ 'sc-summary-list': true, [`sc-summary-list--${appearance}`]: true, [`sc-summary-list--${layout}`]: true }}>
        <dl class="sc-summary-list__list">
          {rows.map((row) => {
            const { label, href, actionText, hiddenText, total } = readRow(row);
            const action = href && layout !== 'pairs';
            return (
              <div class={{ 'sc-summary-list__row': true, 'sc-summary-list__row--no-action': !action, 'sc-summary-list__row--total': total }}>
                <dt class="sc-summary-list__key">{label}</dt>
                <dd class="sc-summary-list__value">
                  <slot name={this.slotOf(row)} />
                </dd>
                {action && (
                  <dd class="sc-summary-list__action">
                    <a class="sc-summary-list__link" href={href}>
                      {actionText || t('summaryChange')}
                      <span class="visually-hidden"> {hiddenText || label}</span>
                    </a>
                  </dd>
                )}
              </div>
            );
          })}
        </dl>
      </Host>
    );
  }
}
