import { Component, Event, EventEmitter, Host, Prop, h } from '@stencil/core';
import { LocaleController } from '../../i18n/controller';
import strings from '../../i18n/components/sc-pagination';
import type { Lang } from '../../i18n/core';

export interface PaginationChangeDetail {
  /** The page asked for (1-based). */
  page: number;
}

/**
 * The two chevrons, drawn here rather than imported from the shared icon set: that module
 * carries every icon (0.9 KiB gzip) and these two cost about 0.1 KiB. Same grammar: 24px
 * grid, 2px stroke, `currentColor`, decorative, mirrored in right-to-left.
 */
const Chevron = ({ d }: { d: string }) => (
  <svg class="icon icon-directional" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <path d={d} />
  </svg>
);

/** Latin digits with a comma for thousands, in both languages (LANG-20, LANG-22). */
const num = (n: number) => n.toLocaleString('en-US');

/**
 * Picks a form from a `|`-separated plural template with Intl.PluralRules: "one|other" in
 * English, "zero|one|two|few|many|other" in Arabic (missing forms fall back to the last).
 */
function plural(template: string, count: number, lang: Lang): string {
  const forms = template.split('|');
  const order = lang === 'ar' ? ['zero', 'one', 'two', 'few', 'many', 'other'] : ['one', 'other'];
  let category = 'other';
  try {
    category = new Intl.PluralRules(lang).select(count);
  } catch {
    /* keep "other" */
  }
  return (forms[order.indexOf(category)] ?? forms[forms.length - 1]).trim();
}

/** The pages to show: the first, the last, the current one and its neighbours; 0 is a gap. */
function pageWindow(page: number, total: number): number[] {
  const out: number[] = [];
  for (let p = 1; p <= total; p++) {
    // A gap of exactly one page shows that page rather than an ellipsis.
    const near = Math.abs(p - page) <= 1 || p === 1 || p === total || (p === 2 && page === 4) || (p === total - 1 && page === total - 3);
    if (near) out.push(p);
    else if (out[out.length - 1] !== 0) out.push(0);
  }
  return out;
}

/**
 * Moves between the pages of a long list: search results, payments, fines. Inside
 * `sc-table`, put it in the table's `footer` slot.
 *
 * Renders, in its shadow root, an optional results count ("Showing 1–20 of 1,284 fines";
 * in Arabic "عرض 1 إلى 20 من 1,284 مخالفة", with a word for the range, never a dash), then
 * `<nav aria-label="Pagination">` with Previous, the page numbers and Next. Previous is
 * left out on the first page and Next on the last (not disabled). The current page carries
 * `aria-current="page"`. Below 600px the numbers give way to "Page 2 of 13".
 *
 * Pages are links when `href-template` is set ("?page={page}"), so the list works without
 * JavaScript; otherwise they are buttons. Every activation fires `scPageChange`; call
 * `preventDefault()` on it to stay on the page and load the new page yourself.
 *
 * @part count - The results count line.
 * @part nav - The `<nav>` landmark.
 * @part list - The `<ul>` of controls.
 */
@Component({
  tag: 'sc-pagination',
  styleUrl: 'sc-pagination.css',
  shadow: true,
})
export class ScPagination {
  /** The current page, from 1. */
  @Prop({ reflect: true }) page = 1;

  /** The number of pages. Leave it out to work it out from `total-items` and `page-size`. */
  @Prop() totalPages?: number;

  /** The number of items across every page. Shows the results count when set. */
  @Prop() totalItems?: number;

  /** Items per page, for the results count and `total-pages`. */
  @Prop() pageSize = 20;

  /**
   * The URL of a page, with `{page}` where its number goes: `"?page={page}"`. Without it the
   * pages are buttons and you handle `scPageChange`.
   */
  @Prop() hrefTemplate?: string;

  /**
   * What is being counted, as a plural template in the page language: `"fine|fines"` in
   * English, the six Arabic forms `"zero|one|two|few|many|other"` in Arabic
   * (`"مخالفة|مخالفة|مخالفتين|مخالفات|مخالفة|مخالفة"`). Defaults to results / نتيجة.
   */
  @Prop() itemLabel?: string;

  /** Overrides the landmark name ("Pagination" / "ترقيم الصفحات"). */
  @Prop() label?: string;

  /** Fires when a page is chosen. Cancelable: `preventDefault()` stops a link from navigating. */
  @Event({ bubbles: true, composed: true, cancelable: true }) scPageChange!: EventEmitter<PaginationChangeDetail>;

  private locale = new LocaleController(this, strings);

  connectedCallback() {
    this.locale.connect();
  }

  disconnectedCallback() {
    this.locale.disconnect();
  }

  private get pages(): number {
    const pages = this.totalPages ?? (this.totalItems ? Math.ceil(this.totalItems / Math.max(1, this.pageSize)) : 1);
    return Math.max(1, Math.floor(pages) || 1);
  }

  private go(ev: Event, page: number) {
    if (this.scPageChange.emit({ page }).defaultPrevented) ev.preventDefault();
  }

  private control(page: number, cls: string, content: unknown, attrs: Record<string, string | undefined> = {}) {
    const props = { 'class': `${cls} focus-ring`, ...attrs, 'onClick': (ev: Event) => this.go(ev, page) };
    return this.hrefTemplate ? (
      <a {...props} href={this.hrefTemplate.replace(/\{page\}/g, String(page))}>
        {content}
      </a>
    ) : (
      <button {...props} type="button">
        {content}
      </button>
    );
  }

  private count() {
    const total = this.totalItems;
    if (!total || total < 1) return null;
    const { t, lang } = this.locale;
    const size = Math.max(1, this.pageSize);
    const page = Math.min(Math.max(1, this.page), this.pages);
    const from = (page - 1) * size + 1;
    const to = Math.min(page * size, total);
    const items = plural(this.itemLabel || t('paginationItems'), total, lang);
    const values = { from: num(from), to: num(to), total: num(total), items };
    return (
      <p class="count" part="count">
        {t(from === to ? 'paginationShowingOne' : 'paginationShowing', values)}
      </p>
    );
  }

  render() {
    const { t } = this.locale;
    const total = this.pages;
    const page = Math.min(Math.max(1, Math.floor(this.page) || 1), total);
    return (
      <Host>
        {this.count()}
        {total > 1 && (
          <nav part="nav" aria-label={this.label || t('paginationLabel')}>
            <ul class="list" part="list">
              {page > 1 && (
                <li class="step">
                  {this.control(page - 1, 'turn', [<Chevron d="M15 5.5L8.5 12l6.5 6.5" />, <span>{t('paginationPrevious')}</span>], { rel: this.hrefTemplate ? 'prev' : undefined })}
                </li>
              )}
              {pageWindow(page, total).map((p) =>
                p === 0 ? (
                  <li class="gap">…</li>
                ) : (
                  <li class="num">
                    {this.control(p, p === page ? 'cell state-layer cell--current' : 'cell state-layer', num(p), {
                      'aria-label': t('paginationPage', { page: num(p) }),
                      'aria-current': p === page ? 'page' : undefined,
                    })}
                  </li>
                ),
              )}
              <li class="of">
                {t('paginationPageOf', { page: num(page), total: num(total) })}
              </li>
              {page < total && (
                <li class="step">
                  {this.control(page + 1, 'turn', [<span>{t('paginationNext')}</span>, <Chevron d="M9 5.5l6.5 6.5L9 18.5" />], { rel: this.hrefTemplate ? 'next' : undefined })}
                </li>
              )}
            </ul>
          </nav>
        )}
      </Host>
    );
  }
}
