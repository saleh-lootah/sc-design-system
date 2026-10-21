import { Component, Element, Host, Prop, State, h } from '@stencil/core';

export type AttentionCardHeadingLevel = 2 | 3 | 4 | 5 | 6;
/** The six decorative topic tints (foundations §2.7). Decorative only: never status. */
export type AttentionCardTint = 'blue' | 'violet' | 'rose' | 'orange' | 'amber' | 'green';

const TINTS: readonly AttentionCardTint[] = ['blue', 'violet', 'rose', 'orange', 'amber', 'green'];
/** Status-tag tones the icon tile follows (B10): their container fill with the on-container glyph. */
const TONES = ['error', 'warning', 'info', 'success'];
const SLOTS = ['icon', 'status', 'fact', 'meta', 'action'] as const;

/**
 * One thing that is due ("Needs your attention"): a bill to pay, a document to upload, a
 * registration about to expire. An icon tile, a status tag, the title, the key fact, a meta
 * line (amount and reference) and one action.
 *
 * The card is neutral and is not a link: the action is the only thing to press, and its
 * label names the action and the item ("Pay AED 412.60"). There is no coloured edge. Status
 * is never shown by colour alone: the icon tile takes the status tag's tone (error, warning,
 * info, success) only as reinforcement, and the urgency is in the tag's words. Put the cards in a list (`<ul>`), most urgent first, under a heading that
 * gives the count ("4 things, most urgent first").
 *
 * @slot - The title, e.g. "Electricity and water bill". Text only; it becomes a heading.
 * @slot icon - A decorative icon: an inline 24px `<svg>` in `currentColor`, in a 40px tile that
 *   takes the status tag's tone (or `tint`, or the channel's colours).
 * @slot status - An `sc-status-tag` with the urgency in words: "Not paid", "Expires in 21 days".
 * @slot fact - The key fact: "Due tomorrow, 21 Oct 2026".
 * @slot meta - Amount and reference, each isolated: `<sc-ltr>AED 412.60</sc-ltr> · DEWA account <sc-ltr>2004 1187</sc-ltr>`.
 * @slot action - One `sc-button variant="secondary" size="m" full-width` (or `href`), named for the action and the item.
 *
 * @part card - The surface.
 * @part icon - The 40px icon tile.
 * @part title - The heading.
 */
@Component({
  tag: 'sc-attention-card',
  styleUrl: 'sc-attention-card.css',
  shadow: true,
})
export class ScAttentionCard {
  @Element() el!: HTMLElement;

  /** The heading level of the title: 3 under a "Needs your attention" `h2` (default). */
  @Prop() headingLevel: AttentionCardHeadingLevel = 3;

  /**
   * A decorative topic tint for the icon tile (foundations §2.7), used instead of the status
   * tone: `amber` bills, `violet` documents and residency, `blue` vehicles, `rose` family,
   * `orange` housing, `green` health. Without it the icon tile takes the status tag's tone
   * (error, warning, info, success), or else the channel's colours. Never use a tint to mean
   * urgency: that is the status tag.
   */
  @Prop({ reflect: true }) tint?: AttentionCardTint;

  @State() filled: Record<string, boolean> = {};
  @State() tone?: string;

  private toneObserver?: MutationObserver;

  connectedCallback() {
    const filled: Record<string, boolean> = {};
    for (const child of Array.from(this.el.children)) {
      const slot = child.getAttribute('slot');
      if (slot) filled[slot] = true;
    }
    this.filled = filled;
    this.readTone();
    // The status tag's tone can change (a bill gets paid): follow it.
    if (typeof MutationObserver !== 'undefined') {
      this.toneObserver = new MutationObserver(() => this.readTone());
      this.toneObserver.observe(this.el, { subtree: true, attributes: true, attributeFilter: ['tone'] });
    }
  }

  disconnectedCallback() {
    this.toneObserver?.disconnect();
  }

  /** The tone of the slotted status tag (the slotted element, or an sc-status-tag inside it). */
  private readTone() {
    const status = Array.from(this.el.children).find((c) => c.getAttribute('slot') === 'status');
    const tag = status && (status.matches('sc-status-tag') ? status : status.querySelector('sc-status-tag'));
    const tone = tag?.getAttribute('tone') ?? undefined;
    this.tone = tone && TONES.includes(tone) ? tone : undefined;
  }

  private onSlotChange = (ev: Event) => {
    const slot = ev.target as HTMLSlotElement;
    this.filled = { ...this.filled, [slot.name]: slot.assignedNodes().some((n) => n.nodeType === 1 || !!n.textContent?.trim()) };
    if (slot.name === 'status') this.readTone();
  };

  render() {
    const level = [2, 3, 4, 5, 6].includes(Number(this.headingLevel)) ? Number(this.headingLevel) : 3;
    const Heading = `h${level}`;
    const tint = this.tint && TINTS.includes(this.tint) ? this.tint : undefined;
    const tone = !tint ? this.tone : undefined;
    const empty = (name: (typeof SLOTS)[number]) => !this.filled[name];
    return (
      <Host>
        <div class={{ card: true, [`card--${tint}`]: !!tint, [`card--tone-${tone}`]: !!tone }} part="card">
          <div class={{ top: true, 'is-empty': empty('icon') && empty('status') }}>
            <span class={{ 'icon-tile': true, 'is-empty': empty('icon') }} part="icon" aria-hidden="true">
              <slot name="icon" onSlotchange={this.onSlotChange} />
            </span>
            <span class={{ status: true, 'is-empty': empty('status') }}>
              <slot name="status" onSlotchange={this.onSlotChange} />
            </span>
          </div>
          <div class="body">
            <Heading class="title" part="title">
              <slot />
            </Heading>
            <p class={{ fact: true, 'is-empty': empty('fact') }}>
              <slot name="fact" onSlotchange={this.onSlotChange} />
            </p>
            <p class={{ meta: true, 'is-empty': empty('meta') }}>
              <slot name="meta" onSlotchange={this.onSlotChange} />
            </p>
          </div>
          <div class={{ action: true, 'is-empty': empty('action') }}>
            <slot name="action" onSlotchange={this.onSlotChange} />
          </div>
        </div>
      </Host>
    );
  }
}
