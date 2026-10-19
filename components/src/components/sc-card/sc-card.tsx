import { Component, Element, Host, Prop, State, Watch, h } from '@stencil/core';

export type CardLandmark = 'section' | 'article';
export type CardPadding = 'm' | 'l';

let uid = 0;

/**
 * A surface container: surface fill, card radius, elevation 1. Groups related content,
 * such as a life event and its steps, or the answers in one section of "Check your answers".
 *
 * With `landmark`, the card becomes a named region (`section`) or an `article`, labelled by
 * the first heading inside it. The role and `aria-labelledby` go on the host, in light DOM,
 * so the reference to the slotted heading resolves.
 *
 * @slot - The card's content. Start with a heading when the card is a landmark.
 *
 * @part surface - The inner surface (fill, radius, shadow, padding).
 */
@Component({
  tag: 'sc-card',
  styleUrl: 'sc-card.css',
  shadow: true,
})
export class ScCard {
  @Element() el!: HTMLElement;

  /**
   * Makes the card a landmark. `section` exposes a region (use it for a part of a page a
   * user would want to jump to); `article` is for self-contained content. Both are named by
   * the first heading (`h1`–`h6`) inside the card, or by `label`. Leave unset for a plain box.
   */
  @Prop({ reflect: true }) landmark?: CardLandmark;

  /** Inner padding: `m` is 16px, `l` is 24px (default). */
  @Prop({ reflect: true }) padding: CardPadding = 'l';

  /** Names the landmark when the card has no heading of its own. Ignored without `landmark`. */
  @Prop() label?: string;

  /** The id of the heading that names the landmark. */
  @State() headingId?: string;

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
    if (heading) {
      if (!heading.id) heading.id = `sc-card-heading-${++uid}`;
      this.headingId = heading.id;
    } else {
      this.headingId = undefined;
    }
  }

  private onSlotChange = () => this.findHeading();


  render() {
    const role = this.landmark === 'section' ? 'region' : this.landmark === 'article' ? 'article' : undefined;
    const padding = this.padding === 'm' ? 'm' : 'l';
    return (
      <Host role={role} aria-labelledby={role && !this.label ? this.headingId : undefined} aria-label={role ? this.label : undefined}>
        <div class={{ surface: true, [`surface--${padding}`]: true }} part="surface">
          <slot onSlotchange={this.onSlotChange} />
        </div>
      </Host>
    );
  }
}
