import { Component, Element, Host, Prop, State, h } from '@stencil/core';
import { ArrowForward } from '../../icons/for/sc-service-card';

export type ServiceCardHeadingLevel = 2 | 3 | 4 | 5 | 6;
/** The six decorative topic tints (foundations §2.7). Decorative only: never status or selection. */
export type ServiceCardTint = 'blue' | 'violet' | 'rose' | 'orange' | 'amber' | 'green';

const TINTS: readonly ServiceCardTint[] = ['blue', 'violet', 'rose', 'orange', 'amber', 'green'];

/**
 * A link to a service: its title, the entity that owns it, an optional icon and an optional
 * channel chip, on a flat 12px card with a 1px edge (direction E, "Most used services").
 *
 * Only the title is the link (CMP-06), so screen readers hear a short link name ("Renew
 * vehicle registration"), with the entity as its description. The card is not wrapped in an
 * `<a>` and the link's hit area is not stretched over the card: it is the title, grown to at
 * least 44 × 44. The forward arrow at the top end is decorative: it is not a second link and
 * is hidden from assistive technology. The title is a heading containing the link, so heading
 * navigation finds every service. A chip that is a link is a separate link.
 *
 * @slot - The service title, e.g. "Renew vehicle registration". Text only.
 * @slot entity - The owning entity, when it needs markup. Otherwise use the `entity` prop.
 * @slot icon - An optional decorative icon: an inline 24px `<svg>` in `currentColor`. It sits
 *   in a 40px tile at the start, in the channel's container colour or the `tint`.
 * @slot chip - An optional `sc-channel-chip` ("Also on Dubai Transport").
 *
 * @part card - The surface.
 * @part icon - The 40px icon tile.
 * @part title - The heading.
 * @part link - The `<a>` inside the heading.
 * @part entity - The entity line.
 * @part arrow - The decorative forward arrow.
 */
@Component({
  tag: 'sc-service-card',
  styleUrl: 'sc-service-card.css',
  shadow: { delegatesFocus: true },
})
export class ScServiceCard {
  @Element() el!: HTMLElement;

  /** Where the service starts. Required. */
  @Prop({ reflect: true }) href!: string;

  /** The heading level of the title. Pick the level that fits the page outline (3 under a "Most used services" `h2`). */
  @Prop() headingLevel: ServiceCardHeadingLevel = 3;

  /** The owning entity (attribution), e.g. "Roads and Transport Authority". Written out in full, not as an acronym. */
  @Prop() entity?: string;

  /**
   * Colours the icon tile with a decorative topic tint (foundations §2.7) instead of the
   * channel container: `blue` transport, `violet` residency, `rose` family, `orange` housing,
   * `amber` bills, `green` health. Decorative only. Ignored without an icon.
   */
  @Prop({ reflect: true }) tint?: ServiceCardTint;

  @State() hasEntitySlot = false;
  @State() hasChip = false;
  @State() hasIcon = false;

  connectedCallback() {
    const slots = Array.from(this.el.children).map((c) => c.getAttribute('slot'));
    this.hasEntitySlot = slots.includes('entity');
    this.hasChip = slots.includes('chip');
    this.hasIcon = slots.includes('icon');
  }

  private onSlotChange = (ev: Event) => {
    const slot = ev.target as HTMLSlotElement;
    const filled = slot.assignedNodes().some((n) => n.nodeType === 1 || !!n.textContent?.trim());
    if (slot.name === 'entity') this.hasEntitySlot = filled;
    else if (slot.name === 'chip') this.hasChip = filled;
    else if (slot.name === 'icon') this.hasIcon = filled;
  };

  render() {
    const level = [2, 3, 4, 5, 6].includes(Number(this.headingLevel)) ? Number(this.headingLevel) : 3;
    const Heading = `h${level}`;
    const hasEntity = this.hasEntitySlot || !!this.entity;
    const tint = this.tint && TINTS.includes(this.tint) ? this.tint : undefined;
    return (
      <Host>
        <div class="card" part="card">
          <div class="top">
            <span class={{ 'icon-tile': true, [`icon-tile--${tint}`]: !!tint, 'is-empty': !this.hasIcon }} part="icon" aria-hidden="true">
              <slot name="icon" onSlotchange={this.onSlotChange} />
            </span>
            <div class="text">
              <Heading class="title" part="title">
                <a class="link focus-ring" part="link" href={this.href} aria-describedby={hasEntity ? 'entity' : undefined}>
                  <slot />
                </a>
              </Heading>
              <p class={{ entity: true, 'is-empty': !hasEntity }} id="entity" part="entity">
                <slot name="entity" onSlotchange={this.onSlotChange}>
                  {this.entity}
                </slot>
              </p>
            </div>
            <span class="arrow" part="arrow">
              <ArrowForward />
            </span>
          </div>
          <div class={{ chip: true, 'is-empty': !this.hasChip }}>
            <slot name="chip" onSlotchange={this.onSlotChange} />
          </div>
        </div>
      </Host>
    );
  }
}
