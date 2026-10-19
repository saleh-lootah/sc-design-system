import { Component, Element, Host, Prop, State, h } from '@stencil/core';
import { ChevronForward } from '../../icons/index'; // explicit /index: Stencil only scans file imports for <svg>

export type ServiceCardHeadingLevel = 2 | 3 | 4 | 5 | 6;

/**
 * A link to a service: its title, the entity that owns it, an optional channel chip and an
 * end chevron. The whole card is one link target.
 *
 * The title is a heading containing the link, so heading navigation finds every service;
 * the link's hit area is stretched over the card. The owning entity is the link's
 * description. A chip that is itself a link stays clickable on its own.
 *
 * @slot - The service title, e.g. "Renew vehicle registration". Text only.
 * @slot entity - The owning entity, when it needs markup. Otherwise use the `entity` prop.
 * @slot chip - An optional `sc-channel-chip` ("Also on Dubai Transport").
 *
 * @part card - The surface.
 * @part link - The `<a>` inside the heading.
 * @part title - The heading.
 * @part entity - The entity line.
 * @part chevron - The end chevron and its circle.
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
              <a class="link" part="link" href={this.href} aria-describedby={hasEntity ? 'entity' : undefined}>
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
          <span class="chevron" part="chevron" aria-hidden="true">
            <ChevronForward />
          </span>
        </div>
      </Host>
    );
  }
}
