import { Component, Element, Host, Prop, State, h } from '@stencil/core';
import { Icon, IconName } from '../../icons/index'; // explicit /index: see CONTRIBUTING

export type EmptyStateVariant = 'default' | 'success';
export type EmptyStateHeadingLevel = 2 | 3 | 4;

/**
 * What a list, table or page shows when there is nothing in it: "You have no fines".
 *
 * An optional 48px icon in an 80px circle, a heading written as a sentence (never "No
 * data"), one or two sentences in the default slot, and at most one action (usually an
 * `sc-button variant="secondary"`) in `slot="action"`. It aligns to the start edge in both
 * languages, so it scans with the content around it.
 *
 * `variant="success"` is the all-clear: nothing is left to do ("You have no fines to pay").
 * The icon becomes a check in the success colour on a success container, and the words
 * still say it, so the meaning never rests on colour.
 *
 * @slot - One or two sentences: what this means and what the user can do.
 * @slot action - Optional, a single action: `<sc-button slot="action" variant="secondary">`.
 *
 * @part container - The block.
 * @part icon - The icon circle (decorative).
 * @part heading - The heading.
 * @part body - The wrapper around the default slot.
 * @part action - The wrapper around the action slot.
 */
@Component({
  tag: 'sc-empty-state',
  styleUrl: 'sc-empty-state.css',
  shadow: true,
})
export class ScEmptyState {
  @Element() el!: HTMLElement;

  /** The heading, as a sentence: "You have no notifications". */
  @Prop() heading!: string;

  /** Renders the heading as `<h2>`–`<h4>`. Leave it unset to render a paragraph at the title role, for an empty state inside a card or table. */
  @Prop() headingLevel?: EmptyStateHeadingLevel;

  /** An icon from the library (`inbox`, `search`, `check-circle` …). Leave unset for no icon; `success` defaults to `check-circle`. */
  @Prop() icon?: IconName;

  /** `default`: neutral. `success`: the all-clear, with a check on the success container. */
  @Prop({ reflect: true }) variant: EmptyStateVariant = 'default';

  /** True when an element carries `slot="action"`. */
  @State() hasAction = false;

  connectedCallback() {
    this.hasAction = Array.from(this.el.children).some((child) => child.getAttribute('slot') === 'action');
  }

  private onActionSlotChange = (ev: Event) => {
    this.hasAction = (ev.target as HTMLSlotElement).assignedElements().length > 0;
  };

  render() {
    const success = this.variant === 'success';
    const icon: IconName | undefined = this.icon || (success ? 'check-circle' : undefined);
    const level = Number(this.headingLevel);
    const Heading = (level >= 2 && level <= 4 ? `h${level}` : 'p') as 'p';

    return (
      <Host>
        <div class={{ empty: true, 'empty--success': success }} part="container">
          {icon && (
            <span class="icon-box" part="icon">
              <Icon name={icon} />
            </span>
          )}
          <Heading class="heading" part="heading">
            {this.heading}
          </Heading>
          <div class="body" part="body">
            <slot />
          </div>
          <div class={{ action: true, 'action--empty': !this.hasAction }} part="action">
            <slot name="action" onSlotchange={this.onActionSlotChange} />
          </div>
        </div>
      </Host>
    );
  }
}
