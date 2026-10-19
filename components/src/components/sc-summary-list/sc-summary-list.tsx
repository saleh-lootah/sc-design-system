import { Component, Element, Host, Listen, Prop, State, h } from '@stencil/core';
import { LocaleController } from '../../i18n/locale';

export type SummaryListAppearance = 'card' | 'plain';

interface RowData {
  label: string;
  href?: string;
  actionText?: string;
  hiddenText?: string;
}

/** Reads a row's props, falling back to attributes before the row has upgraded. */
function readRow(row: HTMLElement): RowData {
  const el = row as HTMLElement & Partial<Record<'label' | 'actionHref' | 'actionText' | 'actionHiddenText', string>>;
  return {
    label: el.label ?? row.getAttribute('label') ?? '',
    href: el.actionHref ?? row.getAttribute('action-href') ?? undefined,
    actionText: el.actionText ?? row.getAttribute('action-text') ?? undefined,
    hiddenText: el.actionHiddenText ?? row.getAttribute('action-hidden-text') ?? undefined,
  };
}

/**
 * The "Check your answers" pattern: rows of a key, a value and an optional "Change" action,
 * as one `<dl>`.
 *
 * Description lists can't span shadow roots (a `<dl>` must directly contain `<dt>`/`<dd>`
 * or `<div>` groups), so this component renders the whole `<dl>` in its own shadow root:
 * one `<div>` per row holding the `<dt>` (from the row's `label`), the value `<dd>` and the
 * action `<dd>`. Each `sc-summary-row` child is assigned to a named slot inside its value
 * `<dd>`, so rich values (addresses, `<sc-ltr>` plates) stay in light DOM.
 *
 * Wide containers show three columns (key, value, a fixed-width action column, so rows
 * align). Below 600px of container width the key sits above the value, with the action at
 * the end.
 *
 * @slot - `sc-summary-row` elements, one per answer. Other children are ignored.
 *
 * @part list - The `<dl>`.
 * @part row - Each row's `<div>`.
 * @part key - Each `<dt>`.
 * @part value - Each value `<dd>`.
 * @part action - Each action `<dd>`.
 */
@Component({
  tag: 'sc-summary-list',
  styleUrl: 'sc-summary-list.css',
  shadow: true,
})
export class ScSummaryList {
  @Element() el!: HTMLElement;

  /** `card` (default) sits the rows on a surface card, as in D+; `plain` draws only the row dividers, for use inside another card. */
  @Prop({ reflect: true }) appearance: SummaryListAppearance = 'card';

  /** Bumped when rows are added, removed or change. */
  @State() revision = 0;

  private locale = new LocaleController(this);
  private observer?: MutationObserver;

  connectedCallback() {
    this.locale.connect();
    if (typeof MutationObserver !== 'undefined') {
      this.observer = new MutationObserver(() => this.revision++);
      // Rows added, removed or hidden.
      this.observer.observe(this.el, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
    }
  }

  disconnectedCallback() {
    this.locale.disconnect();
    this.observer?.disconnect();
  }

  /** Rows dispatch this (internal) event when a prop changes; the name must be a literal for the compiler. */
  @Listen('sc-summary-row-update')
  onRowUpdate() {
    this.revision++;
  }

  private rows(): HTMLElement[] {
    return Array.from(this.el.children).filter((c) => c.localName === 'sc-summary-row' && !c.hasAttribute('hidden')) as HTMLElement[];
  }

  /** Assigns each row to its value slot. Runs before every render. */
  componentWillRender() {
    this.rows().forEach((row, i) => {
      const name = `row-${i}`;
      if (row.getAttribute('slot') !== name) row.setAttribute('slot', name);
    });
  }

  render() {
    const { t } = this.locale;
    const rows = this.rows();
    return (
      <Host>
        <dl class={{ list: true, [`list--${this.appearance === 'plain' ? 'plain' : 'card'}`]: true }} part="list">
          {rows.map((row, i) => {
            const { label, href, actionText, hiddenText } = readRow(row);
            return (
              <div class={{ row: true, 'row--no-action': !href }} part="row">
                <dt class="key" part="key">
                  {label}
                </dt>
                <dd class="value" part="value">
                  <slot name={`row-${i}`} />
                </dd>
                {href && (
                  <dd class="action" part="action">
                    <a class="link focus-ring" href={href}>
                      {actionText || t('change')}
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
