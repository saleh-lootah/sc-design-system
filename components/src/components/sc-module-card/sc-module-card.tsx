import { Component, Element, Host, Prop, State, h } from '@stencil/core';

export type ModuleCardHeadingLevel = 2 | 3 | 4 | 5 | 6;
/** The six decorative topic tints (foundations §2.7). Decorative only. */
export type ModuleCardTint = 'blue' | 'violet' | 'rose' | 'orange' | 'amber' | 'green';

const TINTS: readonly ModuleCardTint[] = ['blue', 'violet', 'rose', 'orange', 'amber', 'green'];

/**
 * A titled module on a signed-in home page ("At a glance"): Vehicles, Applications, Traffic
 * fines. A header row with an optional tinted icon, the title (a heading) and a standalone
 * link at the end ("Manage", "View all"), then the module's own content.
 *
 * The card is not a link (CMP-06). The header link's accessible name includes the title
 * ("View all, Applications"), so a page with several "View all" links still makes sense out
 * of context.
 *
 * @slot - The module content: rows, figures, a status tag, one action. With `divided`, the
 *   top-level children are separated by 1px rules.
 * @slot icon - A decorative icon: an inline 24px `<svg>` in `currentColor`, in a 40px tile.
 * @slot action - A custom header link, used instead of `action-href` and `action-text`.
 * @slot footer - One optional footer action, e.g. `<sc-button variant="secondary" size="m" full-width>`
 *   "Pay all fines". Pushed to the bottom of the card, below a 1px rule.
 *
 * @part card - The surface.
 * @part header - The header row.
 * @part icon - The 40px icon tile.
 * @part title - The heading.
 * @part link - The header link (from `action-href`).
 * @part body - The content.
 * @part footer - The footer action area.
 */
@Component({
  tag: 'sc-module-card',
  styleUrl: 'sc-module-card.css',
  shadow: true,
})
export class ScModuleCard {
  @Element() el!: HTMLElement;

  /** The module's title, e.g. "Vehicles". Required. */
  @Prop() heading!: string;

  /** The heading level of the title: 3 under an "At a glance" `h2` (default). */
  @Prop() headingLevel: ModuleCardHeadingLevel = 3;

  /** Where the header link goes ("Manage", "View all"). Without it (and without `slot="action"`) there is no header link. */
  @Prop() actionHref?: string;

  /** The header link's visible text, e.g. "Manage" or "View all". Its accessible name adds the title. */
  @Prop() actionText?: string;

  /** The icon tile's decorative topic tint (foundations §2.7). Without it the tile takes the channel's container colour. */
  @Prop({ reflect: true }) tint?: ModuleCardTint;

  /** Separates the top-level content blocks with 1px `outline-variant` rules, 20px apart. */
  @Prop({ reflect: true }) divided = false;

  @State() hasIcon = false;
  @State() hasAction = false;
  @State() hasFooter = false;

  connectedCallback() {
    const slots = Array.from(this.el.children).map((c) => c.getAttribute('slot'));
    this.hasIcon = slots.includes('icon');
    this.hasAction = slots.includes('action');
    this.hasFooter = slots.includes('footer');
  }

  private onSlotChange = (ev: Event) => {
    const slot = ev.target as HTMLSlotElement;
    const filled = slot.assignedElements().length > 0;
    if (slot.name === 'icon') this.hasIcon = filled;
    else if (slot.name === 'footer') this.hasFooter = filled;
    else this.hasAction = filled;
  };

  render() {
    const level = [2, 3, 4, 5, 6].includes(Number(this.headingLevel)) ? Number(this.headingLevel) : 3;
    const Heading = `h${level}`;
    const tint = this.tint && TINTS.includes(this.tint) ? this.tint : undefined;
    const link = !this.hasAction && this.actionHref && this.actionText;
    return (
      <Host>
        <div class="card" part="card">
          <div class="header" part="header">
            <span class={{ 'icon-tile': true, [`icon-tile--${tint}`]: !!tint, 'is-empty': !this.hasIcon }} part="icon" aria-hidden="true">
              <slot name="icon" onSlotchange={this.onSlotChange} />
            </span>
            <Heading class="title" part="title">
              {this.heading}
            </Heading>
            <span class={{ action: true, 'is-empty': !this.hasAction && !link }}>
              <slot name="action" onSlotchange={this.onSlotChange} />
              {link && (
                <a class="link focus-ring" part="link" href={this.actionHref}>
                  {this.actionText}<span class="visually-hidden">, {this.heading}</span>
                </a>
              )}
            </span>
          </div>
          <div class="body" part="body">
            <slot />
          </div>
          <div class={{ footer: true, 'is-empty': !this.hasFooter }} part="footer">
            <slot name="footer" onSlotchange={this.onSlotChange} />
          </div>
        </div>
      </Host>
    );
  }
}
