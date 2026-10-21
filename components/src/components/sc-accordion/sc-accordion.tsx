import { Component, Element, Host, Prop, State, h } from '@stencil/core';
import { LocaleController } from '../../i18n/controller';
import strings from '../../i18n/components/sc-accordion';

/**
 * Sections that open and close, for frequently asked questions and long guidance. Built on
 * native `<details>` and `<summary>`: they open with Enter or Space, expose their expanded
 * state to assistive technology and work before (and without) JavaScript. The component adds
 * the v2 look (ruled sections, a title-medium summary, a chevron at the end that turns over
 * when open) and an optional "Show all sections" toggle.
 *
 * v2 renders in light DOM (Stencil `scoped`, architecture §3.1): the `<details>` stay your
 * own markup, so in-page links and `id`s inside them work as usual.
 *
 * Put the question in `<summary>` as plain text, optionally followed by a `<small>` summary
 * line; put the answer after it. Keep headings out of `<summary>`: it is a button, so a
 * heading inside it is not announced as one.
 *
 * @slot - `<details>` elements, one per section.
 */
@Component({
  tag: 'sc-accordion',
  styleUrl: 'sc-accordion.css',
  scoped: true,
})
export class ScAccordion {
  @Element() el!: HTMLElement;

  /** Adds a "Show all sections" / "Hide all sections" toggle above the sections. Use it from about four sections. */
  @Prop({ reflect: true }) showAll = false;

  /** True when every section is open (drives the toggle's text and `aria-expanded`). */
  @State() allOpen = false;

  private locale = new LocaleController(this, strings);

  connectedCallback() {
    this.locale.connect();
    // `toggle` does not bubble: listen in the capture phase.
    this.el.addEventListener('toggle', this.sync, true);
  }

  disconnectedCallback() {
    this.locale.disconnect();
    this.el.removeEventListener('toggle', this.sync, true);
  }

  componentWillLoad() {
    this.sync();
  }

  private sections(): HTMLDetailsElement[] {
    return Array.from(this.el.querySelectorAll('details')).filter((d) => d.closest('sc-accordion') === this.el);
  }

  private sync = () => {
    const sections = this.sections();
    this.allOpen = sections.length > 0 && sections.every((d) => d.open);
  };

  private toggleAll = () => {
    const open = !this.allOpen;
    for (const d of this.sections()) d.open = open;
    this.allOpen = open;
  };

  render() {
    return (
      <Host class="sc-accordion">
        {this.showAll && (
          <button type="button" class="sc-accordion__toggle" aria-expanded={this.allOpen ? 'true' : 'false'} onClick={this.toggleAll}>
            {this.locale.t(this.allOpen ? 'accordionHideAll' : 'accordionShowAll')}
          </button>
        )}
        <slot />
      </Host>
    );
  }
}
