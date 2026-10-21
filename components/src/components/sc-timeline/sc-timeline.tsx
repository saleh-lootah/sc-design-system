import { Component, Element, Host, Prop, h } from '@stencil/core';

export type TimelineOrder = 'newest-first' | 'oldest-first';
const TONES = ['neutral', 'info', 'success', 'warning', 'error'];

/**
 * The status history of an application: each change, with its status, date and a line of
 * detail. Light DOM (architecture §3.1): you write the native list, so screen readers count
 * the entries and nothing crosses a shadow boundary.
 *
 * ```html
 * <sc-timeline>
 *   <ol>
 *     <li>
 *       <sc-status-tag tone="error">Action needed</sc-status-tag>
 *       <time datetime="2026-10-20T09:40">20 Oct 2026, 09:40</time>
 *       <p>Upload a clearer copy of your Emirates ID.</p>
 *     </li>
 *     …
 *   </ol>
 * </sc-timeline>
 * ```
 *
 * The latest entry is the current step: it gets `aria-current="step"`, and its 12px dot
 * takes the tone of its `sc-status-tag` (the status words are always in the tag). Earlier
 * dots are `outline`; a 2px `outline-variant` connector joins them. Dates use Dubai W23's
 * tabular Latin digits. The marker column moves to the right in Arabic.
 *
 * @slot - An `<ol>` with one `<li>` per status change, newest first by default.
 */
@Component({
  tag: 'sc-timeline',
  styleUrl: 'sc-timeline.css',
  scoped: true,
})
export class ScTimeline {
  @Element() el!: HTMLElement;

  /** Which end of the list is the latest (current) entry. */
  @Prop({ reflect: true }) order: TimelineOrder = 'newest-first';

  /** Draws a 1px `outline-variant` rule between entries, for a timeline inside a card. */
  @Prop({ reflect: true }) divided = false;

  private observer?: MutationObserver;

  connectedCallback() {
    if (typeof MutationObserver !== 'undefined') {
      this.observer = new MutationObserver(() => this.mark());
      this.observer.observe(this.el, { childList: true, subtree: true, attributes: true, attributeFilter: ['tone'] });
    }
  }

  componentDidRender() {
    this.mark();
  }

  disconnectedCallback() {
    this.observer?.disconnect();
  }

  /** Marks the latest entry: `aria-current="step"` and `data-tone` from its status tag. */
  private mark() {
    const list = Array.from(this.el.children).find((child) => child.localName === 'ol' || child.localName === 'ul');
    if (!list) return;
    const items = Array.from(list.children).filter((child) => child.localName === 'li');
    const latest = this.order === 'oldest-first' ? items[items.length - 1] : items[0];
    for (const item of items) {
      const isLatest = item === latest;
      const tone = item.querySelector('sc-status-tag')?.getAttribute('tone') ?? 'neutral';
      const want = isLatest ? (TONES.includes(tone) ? tone : 'neutral') : null;
      if (item.getAttribute('data-tone') !== want) {
        if (want) item.setAttribute('data-tone', want);
        else item.removeAttribute('data-tone');
      }
      if (isLatest && item.getAttribute('aria-current') !== 'step') item.setAttribute('aria-current', 'step');
      if (!isLatest && item.hasAttribute('aria-current')) item.removeAttribute('aria-current');
    }
  }

  render() {
    return (
      <Host>
        <slot />
      </Host>
    );
  }
}
