import { Component, Element, Host, Prop, State, Watch, h } from '@stencil/core';

export type CardLandmark = 'section' | 'article';
export type CardPadding = 'm' | 'l';
export type CardVariant = 'outlined' | 'filled';

let uid = 0;

/**
 * A surface that groups related content: a life event and its steps, the answers in one
 * section of "Check your answers", a totals card. Flat and outline-first (ELV-01): 12px
 * corners, a 1px `outline-variant` edge, no shadow. Cards are never links (CMP-06): put the
 * link on a heading or a button inside.
 *
 * v2 renders in light DOM (Stencil `scoped`, architecture §3.1): the host is the surface and
 * your content stays its direct children, so `aria-labelledby` points at your own heading
 * with an ordinary id. There is no `::part(surface)`; style the host (`.sc-card`) if you must.
 *
 * With `landmark`, the card becomes a named region (`section`) or an `article`, labelled by
 * the first heading inside it, or by `label`.
 *
 * @slot - The card's content. Start with a heading when the card is a landmark.
 */
@Component({
  tag: 'sc-card',
  styleUrl: 'sc-card.css',
  scoped: true,
})
export class ScCard {
  @Element() el!: HTMLElement;

  /**
   * Makes the card a landmark. `section` exposes a region (a part of a page a user would want
   * to jump to); `article` is for self-contained content. Both are named by the first heading
   * (`h1`–`h6`) inside the card, or by `label`. Leave unset for a plain box.
   */
  @Prop({ reflect: true }) landmark?: CardLandmark;

  /** Inner padding: `l` is 24px (default), `m` is 16px. */
  @Prop({ reflect: true }) padding: CardPadding = 'l';

  /**
   * `outlined` (default): white surface with a 1px `outline-variant` edge, for groups on a
   * page or a neutral band. `filled`: a quiet `surface-container` fill with no edge, for a
   * totals card or a group inside an outlined area.
   */
  @Prop({ reflect: true }) variant: CardVariant = 'outlined';

  /** Names the landmark when the card has no heading of its own. Ignored without `landmark`. */
  @Prop() label?: string;

  /** The id of the heading that names the landmark. */
  @State() headingId?: string;

  private observer?: MutationObserver;

  connectedCallback() {
    if (typeof MutationObserver !== 'undefined') {
      this.observer = new MutationObserver(() => this.findHeading());
      this.observer.observe(this.el, { childList: true, subtree: true });
    }
  }

  disconnectedCallback() {
    this.observer?.disconnect();
  }

  componentWillLoad() {
    this.findHeading();
  }

  @Watch('landmark')
  @Watch('label')
  findHeading() {
    if (!this.landmark || this.label) {
      this.headingId = undefined;
      return;
    }
    const heading = this.el.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading && !heading.id) heading.id = `sc-card-heading-${++uid}`;
    this.headingId = heading?.id || undefined;
  }

  render() {
    const role = this.landmark === 'section' ? 'region' : this.landmark === 'article' ? 'article' : undefined;
    const padding = this.padding === 'm' ? 'm' : 'l';
    const variant = this.variant === 'filled' ? 'filled' : 'outlined';
    return (
      <Host
        class={{ 'sc-card': true, [`sc-card--${padding}`]: true, [`sc-card--${variant}`]: true }}
        role={role}
        aria-labelledby={role && !this.label ? this.headingId : undefined}
        aria-label={role ? this.label : undefined}
      >
        <slot />
      </Host>
    );
  }
}
