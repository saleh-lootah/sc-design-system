import { Component, Element, Host, Prop, State, h } from '@stencil/core';
import { LocaleController } from '../../i18n/controller';
import { format } from '../../i18n/core';
import { plural } from '../../i18n/plural';
import strings from '../../i18n/components/sc-tile';

/** The six decorative topic tints (foundations §2.7). Decorative only: never status or selection. */
export type TileTint = 'blue' | 'violet' | 'rose' | 'orange' | 'amber' | 'green';

const TINTS: readonly TileTint[] = ['blue', 'violet', 'rose', 'orange', 'amber', 'green'];

/**
 * A compact single-link tile: a tinted icon tile, a title and an optional count. Use it for
 * life events ("Moving home · 14 services"), categories ("Transport and vehicles") and
 * favourite services ("Pay a traffic fine").
 *
 * The whole tile is one link, because the title (and the count) is its only content and so
 * the link's whole name: "Moving home, 14 services". That does not conflict with CMP-06,
 * which is about cards that hold more than one thing. Tiles carry no other links or buttons.
 *
 * Write the title as a light-DOM link, so the tile works before it upgrades and without
 * JavaScript (PERF-04): `<sc-tile><svg slot="icon">…</svg><a href="/en/moving-home">Moving
 * home</a></sc-tile>`. `sc.css` draws it as the tile meanwhile, the whole box one link. Once
 * upgraded the tile takes the link's `href` and text and renders its own link; the child is
 * then neither shown nor read. The older form, `href` on the host and the title as text, still
 * works, but shows no link until the tile upgrades.
 *
 * @slot - The title as an `<a href>` (recommended), or as text with `href` on the host.
 * @slot icon - A decorative icon: an inline 24px `<svg>` in `currentColor`, shown in a 40px
 *   tile in the `tint` colour (or the channel's container colour).
 *
 * @part link - The `<a>`, which is the tile.
 * @part icon - The 40px icon tile.
 * @part title - The title.
 * @part count - The count line.
 */
@Component({
  tag: 'sc-tile',
  styleUrl: 'sc-tile.css',
  shadow: { delegatesFocus: true },
})
export class ScTile {
  @Element() el!: HTMLElement;

  /** Where the tile goes, when the title is not written as an `<a href>` child. */
  @Prop({ reflect: true }) href?: string;

  /**
   * The icon tile's decorative topic tint (foundations §2.7): `blue` transport and vehicles,
   * `violet` residency and identity, `rose` family, `orange` housing and utilities, `amber`
   * bills and money, `green` health. Without it the tile takes the channel's container colour.
   */
  @Prop({ reflect: true }) tint?: TileTint;

  /** How many things the tile leads to, e.g. 14. Shown as "14 services" with the right plural form in both languages. */
  @Prop() count?: number;

  /**
   * Overrides the count text, with `{count}` and plural forms separated by `|`:
   * "{count} step|{count} steps"; in Arabic zero|one|two|few|many|other.
   */
  @Prop() countLabel?: string;

  @State() hasIcon = false;
  /** Bumped when the light-DOM link changes. */
  @State() revision = 0;

  private locale = new LocaleController(this, strings);
  private observer?: MutationObserver;

  connectedCallback() {
    this.locale.connect();
    this.hasIcon = Array.from(this.el.children).some((c) => c.getAttribute('slot') === 'icon');
    if (typeof MutationObserver !== 'undefined') {
      this.observer = new MutationObserver(() => this.revision++);
      this.observer.observe(this.el, { childList: true, subtree: true, characterData: true, attributeFilter: ['href'] });
    }
  }

  disconnectedCallback() {
    this.locale.disconnect();
    this.observer?.disconnect();
  }

  /** The title link written as a child (`<a href>`, not in the icon slot). */
  private get link(): HTMLAnchorElement | null {
    return (Array.from(this.el.children).find((c) => c.localName === 'a' && c.hasAttribute('href') && !c.hasAttribute('slot')) as HTMLAnchorElement) ?? null;
  }

  private onIconSlotChange = (ev: Event) => {
    this.hasIcon = (ev.target as HTMLSlotElement).assignedElements().length > 0;
  };

  private countText(): string {
    const n = Number(this.count);
    if (this.count === undefined || this.count === null || !Number.isFinite(n) || n < 0) return '';
    const template = plural(this.countLabel || this.locale.t('tileCount'), n, this.locale.lang);
    // Latin digits with grouping in both languages (TYP-06): 1,284.
    return format(template, { count: n.toLocaleString('en-US') });
  }

  render() {
    const tint = this.tint && TINTS.includes(this.tint) ? this.tint : undefined;
    const count = this.countText();
    const link = this.link;
    return (
      <Host>
        <a class="tile focus-ring" part="link" href={this.href || link?.getAttribute('href') || undefined}>
          <span class={{ 'icon-tile': true, [`icon-tile--${tint}`]: !!tint, 'is-empty': !this.hasIcon }} part="icon" aria-hidden="true">
            <slot name="icon" onSlotchange={this.onIconSlotChange} />
          </span>
          <span class="text">
            <span class="title" part="title">
              {link ? link.textContent?.trim() : <slot />}
            </span>
            {count && (
              <span class="count" part="count">
                <span class="visually-hidden">, </span>
                {count}
              </span>
            )}
          </span>
        </a>
      </Host>
    );
  }
}
