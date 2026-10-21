/**
 * The disclosure behaviour shared by the channel switcher and the account menu (CHR-03,
 * component-language B2a and B3). Not an ARIA menu: a `<button aria-expanded>` that shows a
 * non-modal panel of links.
 *
 * - The trigger toggles the panel. From a pointer the panel grows in from the trigger's
 *   corner and fades out on close; from the keyboard it appears and goes instantly (MOT-02).
 * - Escape closes it and returns focus to the trigger. The Escape is consumed, so a modal
 *   dialog around the disclosure (the mobile menu) stays open.
 * - A pointer press outside the component closes it.
 * - Focus leaving the component closes it.
 *
 * Works in light DOM and inside shadow roots (`composedPath`, retargeted `relatedTarget`).
 */
import { enter, exit, fromPointer } from './motion';

export interface DisclosureParts {
  /** The component host (a function: `@Element()` is not ready in field initialisers). */
  host: () => HTMLElement;
  trigger: () => HTMLElement | undefined;
  panel: () => HTMLElement | undefined;
  /** Called with the new state: re-render `aria-expanded` and the panel's `hidden`. */
  render: (expanded: boolean, visible: boolean) => void;
}

export class Disclosure {
  expanded = false;
  visible = false;

  constructor(private readonly parts: DisclosureParts) {}

  connect(): void {
    const host = this.parts.host();
    host.ownerDocument?.addEventListener('pointerdown', this.onDocumentPointer, true);
    host.addEventListener('keydown', this.onKeydown);
    host.addEventListener('focusout', this.onFocusOut);
  }

  disconnect(): void {
    const host = this.parts.host();
    host.ownerDocument?.removeEventListener('pointerdown', this.onDocumentPointer, true);
    host.removeEventListener('keydown', this.onKeydown);
    host.removeEventListener('focusout', this.onFocusOut);
  }

  /** The trigger's click handler. */
  toggle = (ev?: Event): void => {
    if (this.expanded) this.close(fromPointer(ev));
    else this.open(fromPointer(ev));
  };

  open(pointer = false): void {
    this.expanded = true;
    this.visible = true;
    this.parts.render(true, true);
    // The panel is shown on the next render; animate it once it is in the layout.
    requestAnimationFrame(() => enter(this.parts.panel(), pointer, 'scale'));
  }

  close(pointer = false, returnFocus = false): void {
    if (!this.expanded) return;
    this.expanded = false;
    this.parts.render(false, true);
    exit(this.parts.panel(), pointer, () => {
      if (this.expanded) return; // reopened meanwhile
      this.visible = false;
      this.parts.render(false, false);
    });
    if (returnFocus) this.parts.trigger()?.focus();
  }

  private inside(target: EventTarget | null): boolean {
    const host = this.parts.host();
    if (!target || !(target instanceof Node)) return false;
    return host === target || host.contains(target) || !!host.shadowRoot?.contains(target);
  }

  private onDocumentPointer = (ev: Event): void => {
    if (!this.expanded) return;
    if (ev.composedPath().includes(this.parts.host())) return;
    this.close(true);
  };

  private onKeydown = (ev: KeyboardEvent): void => {
    if (ev.key !== 'Escape' || !this.expanded) return;
    ev.preventDefault();
    ev.stopPropagation();
    this.close(false, true);
  };

  private onFocusOut = (ev: FocusEvent): void => {
    if (!this.expanded) return;
    // relatedTarget is null when focus goes nowhere (a click on the panel's padding); the
    // outside-press handler covers real outside clicks.
    if (ev.relatedTarget && !this.inside(ev.relatedTarget)) this.close(false);
  };
}
