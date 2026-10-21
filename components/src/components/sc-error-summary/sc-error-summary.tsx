import { Component, Element, Host, Method, Prop, State, h } from '@stencil/core';
import { LocaleController } from '../../i18n/controller';
import strings from '../../i18n/components/sc-error-summary';

/** One error in the summary: a link to the field with the problem and the message to show. */
export interface ErrorSummaryItem {
  /** Fragment link to the field, e.g. `#plate-number`. */
  href: string;
  /** The error message, exactly as it appears next to the field. */
  text: string;
}

export type ErrorSummaryHeadingLevel = 2 | 3 | 4;

/**
 * Lists every error on the page, at the top of the main content, after a form is
 * submitted. Each item links to its field; following a link moves focus to the field.
 *
 * Give it items either as links in the default slot (`<a href="#plate-number">…</a>`,
 * optionally inside a `<ul>`) or through the `errors` property. When it first has items
 * it moves focus to itself (`tabindex="-1"`), so keyboard and screen reader users hear
 * the heading and errors straight away. It has no `role="alert"`: moving focus already
 * announces it, and a live region on top can make screen readers read it twice (GOV.UK
 * practice). The focused box is a `role="group"` named by its heading (CMP-05).
 *
 * v2: an `error-container` box with a 2px `error` border and an 8px radius; the heading in
 * `on-surface`, the links in `error`, Bold and underlined, each at least 44 × 44. Field
 * components are light DOM in v2, so a link's `#id` can name the native control or the
 * field host (whose `focus()` is forwarded to its control).
 *
 * @slot - Error links: `<a href="#field-id">Message</a>`, one per error. They are read
 *   from the light DOM and rendered as a list inside the component.
 * @slot description - Optional text under the heading, e.g. "Check the plate details".
 *
 * @part container - The focusable box with the border.
 * @part heading - The heading ("There is a problem").
 * @part list - The `<ul>` of error links.
 */
@Component({
  tag: 'sc-error-summary',
  styleUrl: 'sc-error-summary.css',
  shadow: true,
})
export class ScErrorSummary {
  @Element() el!: HTMLElement;

  /**
   * Errors to list, as `{ href, text }` objects. Set it as a property from JavaScript.
   * When set (and not empty), it is used instead of the slotted links.
   */
  @Prop() errors?: ErrorSummaryItem[];

  /** Overrides the heading text (default "There is a problem" / "توجد مشكلة"). */
  @Prop() heading?: string;

  /** The heading level. Use 2 when the summary sits under the page's `<h1>` (the usual case). */
  @Prop() headingLevel: ErrorSummaryHeadingLevel = 2;

  /**
   * Stops the summary from moving focus to itself when it first has errors. Only use it
   * when you move focus yourself (call `setFocus()`); otherwise users won't hear the errors.
   */
  @Prop() noAutofocus = false;

  /** Items read from slotted links. */
  @State() slotted: ErrorSummaryItem[] = [];

  /** True when content is slotted into `description`. */
  @State() hasDescription = false;

  private locale = new LocaleController(this, strings);
  private observer?: MutationObserver;
  private container?: HTMLElement;
  private hadItems = false;

  connectedCallback() {
    this.locale.connect();
    this.readLightDom();
    if (typeof MutationObserver !== 'undefined') {
      this.observer = new MutationObserver(() => this.readLightDom());
      this.observer.observe(this.el, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['href', 'slot'] });
    }
  }

  disconnectedCallback() {
    this.locale.disconnect();
    this.observer?.disconnect();
  }

  // Not componentDidRender: on first load the host is still hidden (no `hydrated` class)
  // at that point, and a hidden element can't take focus.
  componentDidLoad() {
    this.maybeFocus();
  }

  componentDidUpdate() {
    this.maybeFocus();
  }

  /** Moves focus here when the summary goes from no errors to some. */
  private maybeFocus() {
    const has = this.items.length > 0;
    if (has && !this.hadItems && !this.noAutofocus) this.focusContainer();
    this.hadItems = has;
  }

  /** Moves focus to the summary, e.g. after client-side validation updates `errors`. */
  @Method()
  async setFocus(): Promise<void> {
    this.focusContainer();
  }

  private focusContainer() {
    this.container?.focus();
  }

  private readLightDom() {
    const links: ErrorSummaryItem[] = [];
    let description = false;
    const walk = (parent: Element) => {
      for (const child of Array.from(parent.children)) {
        const slot = parent === this.el ? child.getAttribute('slot') : null;
        if (slot === 'description') {
          description = true;
          continue;
        }
        if (slot) continue;
        if (child.localName === 'a' && child.hasAttribute('href')) {
          links.push({ href: child.getAttribute('href')!, text: (child.textContent ?? '').trim() });
        } else {
          walk(child);
        }
      }
    };
    walk(this.el);
    this.slotted = links;
    this.hasDescription = description;
  }

  private get items(): ErrorSummaryItem[] {
    return this.errors && this.errors.length ? this.errors : this.slotted;
  }

  /** Finds the element a `#fragment` points to: in the summary's own tree first, then the document. */
  private findTarget(href: string): HTMLElement | null {
    if (!href.startsWith('#') || href.length < 2) return null;
    let id = href.slice(1);
    try {
      id = decodeURIComponent(id);
    } catch {
      /* keep the raw id */
    }
    const root = this.el.getRootNode() as Document | ShadowRoot;
    const inRoot = typeof (root as Document).getElementById === 'function' ? (root as Document).getElementById(id) : null;
    return (inRoot ?? this.el.ownerDocument.getElementById(id)) as HTMLElement | null;
  }

  private onItemClick = (ev: MouseEvent, href: string) => {
    const target = this.findTarget(href);
    if (!target) return;
    ev.preventDefault();
    // Show the field with its label above it, then focus it. A host with delegatesFocus
    // passes focus to its inner control.
    target.scrollIntoView?.({ block: 'center' });
    target.focus({ preventScroll: true });
  };

  render() {
    const { t } = this.locale;
    const items = this.items;
    const level = [2, 3, 4].includes(Number(this.headingLevel)) ? Number(this.headingLevel) : 2;
    const Heading = `h${level}` as 'h2';

    return (
      <Host class={{ 'is-empty': items.length === 0 }}>
        <div
          class="summary focus-ring"
          part="container"
          tabindex="-1"
          role="group"
          aria-labelledby="heading"
          ref={(el) => (this.container = el)}
        >
          <Heading id="heading" class="heading" part="heading">
            {this.heading || t('errorSummaryHeading')}
          </Heading>
          <div class={{ 'description': true, 'description--empty': !this.hasDescription }}>
            <slot name="description" />
          </div>
          <ul class="list" part="list">
            {items.map((item) => (
              <li>
                <a class="link focus-ring" href={item.href} onClick={(ev) => this.onItemClick(ev, item.href)}>
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Host>
    );
  }
}
