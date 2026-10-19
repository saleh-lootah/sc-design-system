import { Component, Element, Host, Prop, State, h } from '@stencil/core';

export type ServiceCardHeadingLevel = 2 | 3 | 4 | 5 | 6;

/**
 * A link to a service: its title, the entity that owns it and an optional channel chip.
 * There is no end chevron: the card is not itself a link, so nothing on it may look like one.
 *
 * Only the title is the link (CMP-06), so screen readers hear a short link name ("Renew
 * vehicle registration"), not the whole card's text. The card is not wrapped in an `<a>`
 * and the link's hit area is not stretched over the card: it is the title, grown to at
 * least 44 x 44. The title is a heading containing the link, so heading navigation finds
 * every service. The owning entity is the link's description. A chip that is a link is a
 * separate link.
 *
 * @slot - The service title, e.g. "Renew vehicle registration". Text only.
 * @slot entity - The owning entity, when it needs markup. Otherwise use the `entity` prop.
 * @slot chip - An optional `sc-channel-chip` ("Also on Dubai Transport").
 *
 * @part card - The surface.
 * @part link - The `<a>` inside the heading.
 * @part title - The heading.
 * @part entity - The entity line.
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

  @State() hasEntitySlot = false;
  @State() hasChip = false;

  connectedCallback() {
    const slots = Array.from(this.el.children).map((c) => c.getAttribute('slot'));
    this.hasEntitySlot = slots.includes('entity');
    this.hasChip = slots.includes('chip');
  }

  private onEntitySlotChange = (ev: Event) => {
    this.hasEntitySlot = (ev.target as HTMLSlotElement).assignedNodes().length > 0;
  };

  private onChipSlotChange = (ev: Event) => {
    this.hasChip = (ev.target as HTMLSlotElement).assignedElements().length > 0;
  };

  render() {
    const level = [2, 3, 4, 5, 6].includes(Number(this.headingLevel)) ? Number(this.headingLevel) : 3;
    const Heading = `h${level}`;
    const hasEntity = this.hasEntitySlot || !!this.entity;
    return (
      <Host>
        <div class="card" part="card">
          <div class="body">
            <Heading class="title type-title-s" part="title">
              <a class="link focus-ring" part="link" href={this.href} aria-describedby={hasEntity ? 'entity' : undefined}>
                <slot />
              </a>
            </Heading>
            <p class={{ 'entity': true, 'type-body-s': true, 'is-empty': !hasEntity }} id="entity" part="entity">
              <slot name="entity" onSlotchange={this.onEntitySlotChange}>
                {this.entity}
              </slot>
            </p>
            <div class={{ chip: true, 'is-empty': !this.hasChip }}>
              <slot name="chip" onSlotchange={this.onChipSlotChange} />
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
