/**
 * Finds where focus goes when an element removes itself (a dismissed announcement): the
 * next focusable element after it in document order, looking inside open shadow roots of
 * hosts whose own light DOM holds nothing focusable. Falls back to `<main>`.
 */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

function shown(el: Element): boolean {
  return (el as HTMLElement).getClientRects().length > 0 && !el.closest('[hidden], [inert]');
}

function firstIn(root: ParentNode): HTMLElement | undefined {
  for (const el of Array.from(root.querySelectorAll<HTMLElement>('*'))) {
    if (el.matches(FOCUSABLE) && shown(el)) return el;
    if (el.shadowRoot && !el.querySelector(FOCUSABLE)) {
      const inner = firstIn(el.shadowRoot);
      if (inner) return inner;
    }
  }
  return undefined;
}

export function nextFocusable(after: Element): HTMLElement | undefined {
  const doc = after.ownerDocument;
  for (const el of Array.from(doc.querySelectorAll<HTMLElement>('*'))) {
    if (!(after.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) || after.contains(el)) continue;
    if (el.matches(FOCUSABLE) && shown(el)) return el;
    if (el.shadowRoot && !el.querySelector(FOCUSABLE)) {
      const inner = firstIn(el.shadowRoot);
      if (inner) return inner;
    }
  }
  return doc.querySelector<HTMLElement>('main') ?? undefined;
}
