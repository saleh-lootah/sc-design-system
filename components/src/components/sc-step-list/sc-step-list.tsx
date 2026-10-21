import { Component, Element, Host, h } from '@stencil/core';
import { LocaleController } from '../../i18n/controller';
import strings from '../../i18n/components/sc-step-list';
import { channels, Channel } from '../../i18n/core';
import { ChevronForwardPath } from '../../icons/for/sc-step-list';

const PART = 'sc-step-list__';
const SVG_NS = 'http://www.w3.org/2000/svg';
const CHANNEL_KEYS = {
  now: 'stepListChannelNow',
  transport: 'stepListChannelTransport',
  visit: 'stepListChannelVisit',
  justice: 'stepListChannelJustice',
  build: 'stepListChannelBuild',
  invest: 'stepListChannelInvest',
  trade: 'stepListChannelTrade',
} as const;

/**
 * A life event as an ordered list of services, possibly across channels (direction E1,
 * "Moving home"). Light DOM: you write the native `<ol>`, so the list position is the number
 * screen readers announce.
 *
 * ```html
 * <sc-step-list>
 *   <ol>
 *     <li><a href="/tenancy">Register your tenancy contract</a><span>Dubai Land Department</span></li>
 *     <li data-channel="transport"><a href="https://transport…/address">Update the address on your vehicle</a><span>RTA</span></li>
 *   </ol>
 * </sc-step-list>
 * ```
 *
 * Each row has a 32px numbered marker joined by 2px connectors, the service title (the
 * link; the row is not a link), the owning entity, and a fixed trailing slot with a
 * decorative chevron. A row whose `data-channel` differs from the page's channel belongs to
 * another channel: it takes that channel's `channel-subtle` tint and filled marker, joins
 * neighbouring rows of the same channel with that channel's colour, and gets an outlined
 * attribution chip, "On Dubai Transport", which is read as text. The component adds the
 * marker, chip and chevron to each `<li>` (frameworks that own the list should not
 * re-render those nodes). The marker column moves to the right in Arabic and the chevron
 * points left.
 *
 * @slot - An `<ol>` of `<li>`, each with a link (`<a>`) and the entity (`<span>`).
 */
@Component({
  tag: 'sc-step-list',
  styleUrl: 'sc-step-list.css',
  scoped: true,
})
export class ScStepList {
  @Element() el!: HTMLElement;

  private locale = new LocaleController(this, strings);
  private observer?: MutationObserver;

  connectedCallback() {
    this.locale.connect();
    if (typeof MutationObserver !== 'undefined') {
      this.observer = new MutationObserver((records) => {
        // Ignore the nodes this component adds itself.
        const own = records.every((r) => [...r.addedNodes, ...r.removedNodes].every((n) => n.nodeType === 1 && (n as HTMLElement).getAttribute("class")?.startsWith(PART)));
        if (!own || records.some((r) => r.type === 'attributes')) this.enhance();
      });
      this.observer.observe(this.el, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-channel'] });
    }
  }

  componentDidRender() {
    this.enhance();
  }

  disconnectedCallback() {
    this.locale.disconnect();
    this.observer?.disconnect();
  }

  /** The page's channel: the closest `data-channel` above the component. */
  private pageChannel(): string | null {
    return this.el.parentElement?.closest('[data-channel]')?.getAttribute('data-channel') ?? null;
  }

  private make(tag: string, cls: string, text?: string): HTMLElement {
    const el = this.el.ownerDocument.createElement(tag);
    el.className = PART + cls;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  private chevron(): HTMLElement {
    const box = this.make('span', 'chevron');
    box.setAttribute('aria-hidden', 'true');
    const svg = this.el.ownerDocument.createElementNS(SVG_NS, 'svg');
    // Material Symbols chevron_right, Outlined, weight 400 (D13).
    svg.setAttribute('viewBox', '0 -960 960 960');
    svg.setAttribute('class', 'icon icon-directional');
    svg.setAttribute('fill', 'currentColor');
    svg.setAttribute('focusable', 'false');
    const path = this.el.ownerDocument.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', ChevronForwardPath);
    svg.append(path);
    box.append(svg);
    return box;
  }

  /** Adds the marker, chip and chevron to each item, and marks other-channel rows. */
  private enhance() {
    const list = Array.from(this.el.children).find((child) => child.localName === 'ol');
    if (!list) return;
    const page = this.pageChannel();
    const items = Array.from(list.children).filter((child) => child.localName === 'li') as HTMLElement[];
    const otherOf = (item: HTMLElement | undefined) => {
      const ch = item?.getAttribute('data-channel');
      return ch && ch !== page && (channels as readonly string[]).includes(ch) ? (ch as Channel) : null;
    };

    items.forEach((item, i) => {
      const own = (cls: string) => Array.from(item.children).find((child) => child.classList.contains(PART + cls)) as HTMLElement | undefined;
      const other = otherOf(item);
      const number = String(i + 1);

      let marker = own('marker');
      if (!marker) {
        marker = this.make('span', 'marker');
        marker.setAttribute('aria-hidden', 'true');
        item.prepend(marker);
      }
      if (marker.textContent !== number) marker.textContent = number;

      let end = own('end');
      if (!end) {
        end = this.make('span', 'end');
        end.append(this.chevron());
        item.append(end);
      }
      let chip = Array.from(end.children).find((child) => child.classList.contains(PART + 'chip')) as HTMLElement | undefined;
      if (other) {
        const text = this.locale.t('stepListOn', { channel: this.locale.t(CHANNEL_KEYS[other]) });
        if (!chip) {
          chip = this.make('span', 'chip');
          chip.append(this.make('span', 'chip-dot'), this.make('span', 'chip-label'));
          end.prepend(chip);
        }
        const label = chip.lastElementChild!;
        if (label.textContent !== text) label.textContent = text;
      } else if (chip) {
        chip.remove();
      }

      this.flag(item, 'is-other', !!other);
      this.flag(item, 'is-joined-prev', !!other && otherOf(items[i - 1]) === other);
      this.flag(item, 'is-joined-next', !!other && otherOf(items[i + 1]) === other);
    });
  }

  private flag(el: HTMLElement, cls: string, on: boolean) {
    if (el.classList.contains(PART + cls) !== on) el.classList.toggle(PART + cls, on);
  }

  render() {
    return (
      <Host>
        <slot />
      </Host>
    );
  }
}
