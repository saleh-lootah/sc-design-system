import { Component, Element, Host, Prop, h } from '@stencil/core';
import { LocaleController } from '../../i18n/controller';
import strings from '../../i18n/components/sc-breadcrumbs';
import { readNavItems, watchNavItems } from '../../utils/nav-items';

/**
 * The two chevrons, drawn here rather than imported from the shared icon set, as
 * sc-pagination does: that module carries every icon (0.9 KiB gzip) and these two cost about
 * 0.1 KiB. Same paths and grammar as src/icons: 24px grid, 2px stroke, `currentColor`,
 * decorative, mirrored in right-to-left.
 */
const Chevron = ({ d, cls }: { d: string; cls: string }) => (
  <svg class={`icon icon-directional ${cls}`} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <path d={d} />
  </svg>
);

/**
 * Where this page sits in the channel's hierarchy, on pages outside a transaction (in the
 * hero of inner pages, CHR-07). Never inside a journey: use `sc-back-link` there.
 *
 * Write the trail as plain children: a link for each ancestor, then the current page as
 * plain text (a `<span>`). The last child is always the current page; it is not a link and
 * carries `aria-current="page"`.
 *
 *   <sc-breadcrumbs>
 *     <a href="/en">Home</a>
 *     <a href="/en/vehicles">Vehicles</a>
 *     <span>Renew your vehicle registration</span>
 *   </sc-breadcrumbs>
 *
 * Renders `<nav aria-label="Breadcrumb">` with an ordered list in its shadow root. The
 * chevrons between items mirror in right-to-left. Below 600px the trail collapses to one
 * "Back to {parent}" link.
 *
 * @part nav - The `<nav>` landmark.
 * @part list - The `<ol>`.
 * @part link - Each ancestor link.
 * @part current - The current page.
 */
@Component({
  tag: 'sc-breadcrumbs',
  styleUrl: 'sc-breadcrumbs.css',
  shadow: true,
})
export class ScBreadcrumbs {
  @Element() el!: HTMLElement;

  /** Overrides the landmark name ("Breadcrumb" / "مسار التنقل"). */
  @Prop() label?: string;

  /**
   * Overrides the text of the single link shown on compact screens (default "Back to {parent}"
   * / "رجوع إلى {parent}"). `{parent}` is replaced by the parent page's text.
   */
  @Prop() compactLabel?: string;

  private locale = new LocaleController(this, strings);
  private observer?: MutationObserver;

  connectedCallback() {
    this.locale.connect();
    this.observer = watchNavItems(this.el, this);
  }

  disconnectedCallback() {
    this.locale.disconnect();
    this.observer?.disconnect();
  }

  render() {
    const { t } = this.locale;
    const items = readNavItems(this.el);
    const last = items.length - 1;
    return (
      <Host>
        <nav part="nav" aria-label={this.label || t('breadcrumbsLabel')}>
          <ol class="list" part="list">
            {items.map((item, i) => (
              <li class={{ 'item': true, 'item--parent': i === last - 1 }}>
                {i > 0 && <Chevron cls="sep" d="M9 5.5l6.5 6.5L9 18.5" />}
                {i === last || item.href === null ? (
                  <span class="current" part="current" aria-current={i === last ? 'page' : undefined} lang={item.lang ?? undefined}>
                    {item.text}
                  </span>
                ) : (
                  <a class="link focus-ring" part="link" href={item.href} lang={item.lang ?? undefined}>
                    <Chevron cls="back" d="M15 5.5L8.5 12l6.5 6.5" />
                    <span class="full">{item.text}</span>
                    <span class="compact">{this.compactLabel ? this.compactLabel.replace('{parent}', item.text) : t('breadcrumbsBackTo', { page: item.text })}</span>
                  </a>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </Host>
    );
  }
}
