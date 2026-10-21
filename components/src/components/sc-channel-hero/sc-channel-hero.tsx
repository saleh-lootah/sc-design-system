import { Component, Element, Host, Prop, State, h } from '@stencil/core';
import { LocaleController } from '../../i18n/controller';
import strings from '../../i18n/components/sc-channel-hero';

export type ChannelHeroSize = 'large' | 'medium';

const SLOTS = ['breadcrumbs', 'eyebrow', 'heading', 'lede', '', 'popular'] as const;

/**
 * The top band of a channel's home or section page (E1): a flat `channel-subtle` band
 * (decision Q-hero: no gradient), holding optional breadcrumbs, an eyebrow, the page's
 * `<h1>` at display size, an optional lede, search and a "Popular now" row of suggestion
 * chips. It follows `data-channel` and the theme like every component.
 *
 * The band is full-bleed; its content follows the page grid's margins (20, 32, 48, 80px)
 * and the 1280px cap, so it lines up with `sc-container` content below. The hero never
 * carries a carousel or autoplaying media.
 *
 * @slot breadcrumbs - Optional breadcrumbs, on inner pages.
 * @slot eyebrow - A short line above the heading, e.g. "Government services for everyone who lives in Dubai".
 * @slot heading - The page's `<h1>`. Pass the element itself: `<h1 slot="heading">What do you need to do?</h1>`.
 * @slot lede - An optional paragraph under the heading.
 * @slot - Search (`sc-search size="l"`), up to 880px wide.
 * @slot popular - Suggestion links, one `<a href>` each: "Renew vehicle registration". The hero
 *   draws them as 40px capsule chips with a 44px target, after the "Popular now" label.
 *
 * @part band - The full-bleed band.
 * @part content - The column holding the slots.
 * @part popular - The "Popular now" row.
 */
@Component({
  tag: 'sc-channel-hero',
  styleUrl: 'sc-channel-hero.css',
  shadow: true,
})
export class ScChannelHero {
  @Element() el!: HTMLElement;

  /**
   * The heading size from 1024px: `large` (display-large, 80px) for a channel's home page,
   * `medium` (display-medium, 57px) for a section page. Below 1024px both step down
   * (display-small from 600px, headline-large on phones).
   */
  @Prop({ reflect: true }) size: ChannelHeroSize = 'large';

  /** Overrides the label before the suggestion chips (default "Popular now" / "الأكثر طلبًا الآن"). */
  @Prop() popularLabel?: string;

  @State() filled: Record<string, boolean> = {};

  private locale = new LocaleController(this, strings);

  connectedCallback() {
    this.locale.connect();
    const filled: Record<string, boolean> = {};
    for (const node of Array.from(this.el.childNodes)) {
      if (node.nodeType === 1) filled[(node as Element).getAttribute('slot') || ''] = true;
    }
    this.filled = filled;
  }

  disconnectedCallback() {
    this.locale.disconnect();
  }

  private onSlotChange = (ev: Event) => {
    const slot = ev.target as HTMLSlotElement;
    this.filled = { ...this.filled, [slot.name]: slot.assignedNodes().some((n) => n.nodeType === 1 || !!n.textContent?.trim()) };
  };

  render() {
    const cls = (name: (typeof SLOTS)[number]) => ({ [name || 'search']: true, 'is-empty': !this.filled[name] });
    return (
      <Host>
        <div class="band" part="band">
          <div class="content" part="content">
            <div class={cls('breadcrumbs')}>
              <slot name="breadcrumbs" onSlotchange={this.onSlotChange} />
            </div>
            <div class="intro">
              <div class={cls('eyebrow')}>
                <slot name="eyebrow" onSlotchange={this.onSlotChange} />
              </div>
              <div class={cls('heading')}>
                <slot name="heading" onSlotchange={this.onSlotChange} />
              </div>
              <div class={cls('lede')}>
                <slot name="lede" onSlotchange={this.onSlotChange} />
              </div>
            </div>
            <div class={cls('')}>
              <slot onSlotchange={this.onSlotChange} />
            </div>
            <div class={cls('popular')} part="popular" role="group" aria-labelledby="popular-label">
              <span class="popular-label" id="popular-label">
                {this.popularLabel || this.locale.t('heroPopular')}
              </span>
              <slot name="popular" onSlotchange={this.onSlotChange} />
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
