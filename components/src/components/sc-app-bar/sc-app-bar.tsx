import { Component, Element, Host, Prop, State, h } from '@stencil/core';

/**
 * The top bar of every mobile screen and desktop page: a translucent glass bar with a
 * start control (usually `sc-back-link`), the channel name, and an end control (usually
 * `sc-language-switch`).
 *
 * - `align="center"` (default) is the mobile bar: start, title in the middle, end.
 * - `align="start"` is the desktop header: title (with a mark) at the start, then the
 *   default slot (primary navigation), and the end slot pushed to the end.
 * - `shape="floating"` turns the bar into the inset glass capsule used on desktop.
 *
 * The glass becomes a solid surface under `prefers-reduced-transparency: reduce` and in
 * forced colours. The host is a `banner` landmark unless `landmark` is false.
 *
 * @slot start - Leading control, usually `<sc-back-link>`. Controls are at least 44px.
 * @slot title - The channel or service name, shown bold. Text, optionally with a logo mark.
 * @slot - Extra content after the title, such as primary navigation (`align="start"`).
 * @slot end - Trailing controls, usually `<sc-language-switch>` and a sign-in button.
 *
 * @part bar - The glass bar.
 * @part start - The start slot wrapper.
 * @part title - The title wrapper.
 * @part content - The default slot wrapper.
 * @part end - The end slot wrapper.
 */
@Component({
  tag: 'sc-app-bar',
  styleUrl: 'sc-app-bar.css',
  shadow: true,
})
export class ScAppBar {
  @Element() el!: HTMLElement;

  /** Keeps the bar at the top of the viewport while the page scrolls (`position: sticky`). */
  @Prop({ reflect: true }) sticky = false;

  /** `center`: mobile layout with the title in the middle. `start`: desktop layout with the title at the start. */
  @Prop({ reflect: true }) align: 'center' | 'start' = 'center';

  /** `bar`: edge to edge with a hairline at the bottom. `floating`: an inset glass capsule (desktop). */
  @Prop({ reflect: true }) shape: 'bar' | 'floating' = 'bar';

  /**
   * Makes the host a `banner` landmark. Set it to false when the page already has a banner
   * (for example a site header around the bar), or when the bar sits inside a dialog.
   */
  @Prop() landmark = true;

  @State() hasStart = false;
  @State() hasEnd = false;
  @State() hasContent = false;

  connectedCallback() {
    this.readSlots();
  }

  private readSlots() {
    const children = Array.from(this.el.children);
    this.hasStart = children.some((c) => c.getAttribute('slot') === 'start');
    this.hasEnd = children.some((c) => c.getAttribute('slot') === 'end');
    this.hasContent = children.some((c) => !c.hasAttribute('slot'));
  }

  private onSlotChange = () => this.readSlots();

  render() {
    const align = this.align === 'start' ? 'start' : 'center';
    const shape = this.shape === 'floating' ? 'floating' : 'bar';
    return (
      <Host role={this.landmark ? 'banner' : undefined}>
        <div class={{ bar: true, [`bar--${align}`]: true, [`bar--${shape}`]: true }} part="bar">
          <div class={{ start: true, empty: !this.hasStart }} part="start">
            <slot name="start" onSlotchange={this.onSlotChange} />
          </div>
          <div class="title type-title-s" part="title">
            <slot name="title" />
          </div>
          <div class={{ content: true, empty: !this.hasContent }} part="content">
            <slot onSlotchange={this.onSlotChange} />
          </div>
          <div class={{ end: true, empty: !this.hasEnd }} part="end">
            <slot name="end" onSlotchange={this.onSlotChange} />
          </div>
        </div>
      </Host>
    );
  }
}
