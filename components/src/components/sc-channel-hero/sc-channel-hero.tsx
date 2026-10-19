import { Component, Element, Host, State, h } from '@stencil/core';

/**
 * The top wash of a channel page: a gradient from the channel's wash-start to wash-end
 * colour (interpolated in OKLAB), holding an eyebrow, the page's `<h1>`, a lede and a
 * search field. It follows `data-channel` and the theme like every component.
 *
 * The hero is full-bleed; its content sits in an `sc-container`, so it lines up with the
 * page below.
 *
 * @slot eyebrow - A short line above the heading, e.g. "Government services for everyone who lives in Dubai".
 * @slot heading - The page's `<h1>`. Pass the element itself: `<h1 slot="heading">What do you need to do?</h1>`.
 * @slot lede - An optional paragraph under the heading.
 * @slot - Search (`sc-search`) and anything that goes with it, such as popular links.
 *
 * @part wash - The full-bleed gradient.
 * @part content - The column holding the slots.
 */
@Component({
  tag: 'sc-channel-hero',
  styleUrl: 'sc-channel-hero.css',
  shadow: true,
})
export class ScChannelHero {
  @Element() el!: HTMLElement;

  @State() filled: Record<string, boolean> = {};

  connectedCallback() {
    const filled: Record<string, boolean> = {};
    for (const child of Array.from(this.el.children)) filled[child.getAttribute('slot') || ''] = true;
    this.filled = filled;
  }

  private onSlotChange = (ev: Event) => {
    const slot = ev.target as HTMLSlotElement;
    this.filled = { ...this.filled, [slot.name]: slot.assignedNodes().some((n) => n.nodeType === 1 || !!n.textContent?.trim()) };
  };

  render() {
    const part = (name: string, cls: string) => (
      <div class={{ [cls]: true, 'is-empty': !this.filled[name] }}>
        <slot name={name || undefined} onSlotchange={this.onSlotChange} />
      </div>
    );
    return (
      <Host>
        <div class="wash" part="wash">
          <sc-container>
            <div class="content" part="content">
              {part('eyebrow', 'eyebrow type-eyebrow')}
              {part('heading', 'heading')}
              {part('lede', 'lede type-body-l')}
              {part('', 'search')}
            </div>
          </sc-container>
        </div>
      </Host>
    );
  }
}
