/**
 * Navigation items written as plain children (C2: sc-breadcrumbs, sc-account-nav,
 * sc-bottom-nav). The service writes ordinary links, which are what a page shows before the
 * component upgrades and without JavaScript:
 *
 *   <sc-account-nav>
 *     <a href="/applications" data-icon="description">Applications</a>
 *     <a href="/payments" data-icon="credit-card" aria-current="page">Payments</a>
 *     <a href="/notifications" data-icon="notifications" data-count="3">Notifications</a>
 *     <a href="/sign-out" data-icon="logout" data-sign-out>Sign out</a>
 *   </sc-account-nav>
 *
 * The component reads them and renders its own list in its shadow root; children are not
 * slotted, so they are neither shown nor in the accessibility tree once upgraded. A list
 * wrapper (`<ul><li><a>`) is accepted too. Changes to the children re-render the component.
 */
import { forceUpdate } from '@stencil/core';

export interface NavItem {
  /** The link target; null for a non-link child (the current page in breadcrumbs). */
  href: string | null;
  text: string;
  /** `data-icon` */
  icon: string | null;
  /** `data-count`, when it is a positive whole number. */
  count: number | null;
  /** `data-count-label`: the visually hidden text after the count. */
  countLabel: string | null;
  /** `aria-current` set to anything but "false". */
  current: boolean;
  /** `data-sign-out` */
  signOut: boolean;
  /** `lang` of the child, passed on to the rendered link. */
  lang: string | null;
}

export function readNavItems(host: HTMLElement): NavItem[] {
  const els = Array.from(host.children).flatMap((el) =>
    el.localName === 'ul' || el.localName === 'ol'
      ? Array.from(el.children).flatMap((li) => (li.firstElementChild ? [li.firstElementChild] : []))
      : /^(template|style|script)$/.test(el.localName)
        ? []
        : [el],
  );
  return els.map((el) => {
    const count = Number.parseInt(el.getAttribute('data-count') ?? '', 10);
    const current = el.getAttribute('aria-current');
    return {
      href: el.localName === 'a' ? el.getAttribute('href') : null,
      text: (el.textContent ?? '').replace(/\s+/g, ' ').trim(),
      icon: el.getAttribute('data-icon'),
      count: count > 0 ? count : null,
      countLabel: el.getAttribute('data-count-label'),
      current: current !== null && current !== 'false',
      signOut: el.hasAttribute('data-sign-out'),
      lang: el.getAttribute('lang'),
    };
  });
}

/** Re-renders `component` whenever the host's children change. Returns the observer (disconnect it). */
export function watchNavItems(host: HTMLElement, component: object): MutationObserver | undefined {
  if (typeof MutationObserver === 'undefined') return undefined;
  const observer = new MutationObserver(() => forceUpdate(component));
  // Every attribute of the children counts (href, aria-current, data-*, lang); the component
  // never writes to its light DOM, so this cannot loop.
  observer.observe(host, { childList: true, subtree: true, characterData: true, attributes: true });
  return observer;
}
