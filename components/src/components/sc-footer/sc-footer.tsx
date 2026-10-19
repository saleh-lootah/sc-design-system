import { Component, Element, Host, Prop, State, h } from '@stencil/core';
import { LocaleController } from '../../i18n/locale';
import { StringKey } from '../../i18n/strings';

/**
 * The page footer: help and contact, accessibility, privacy and terms links, and
 * "Government of Dubai". Renders a `<footer>` (the page's `contentinfo` landmark) with a
 * list of links under a visually hidden "Support links" heading.
 *
 * The four standard links appear when their `*-href` is set, with text from strings in the
 * page language. Extra links go in the default slot as plain `<a>` elements; each gets its
 * own list item (the footer sets their `slot` attribute).
 *
 * @slot - Extra links, as `<a href>` elements, listed after the standard ones.
 * @slot meta - Replaces "Government of Dubai" at the end of the footer.
 *
 * @part footer - The `<footer>`.
 * @part list - The `<ul>` of links.
 * @part link - Each standard link.
 * @part meta - The end text.
 */
@Component({
  tag: 'sc-footer',
  styleUrl: 'sc-footer.css',
  shadow: true,
})
export class ScFooter {
  @Element() el!: HTMLElement;

  /** The help and contact page. */
  @Prop() helpHref?: string;

  /** The accessibility statement. */
  @Prop() accessibilityHref?: string;

  /** The privacy notice. */
  @Prop() privacyHref?: string;

  /** The terms and conditions. */
  @Prop() termsHref?: string;

  /** Bumped when slotted links change. */
  @State() revision = 0;

  private locale = new LocaleController(this);
  private observer?: MutationObserver;

  connectedCallback() {
    this.locale.connect();
    if (typeof MutationObserver !== 'undefined') {
      this.observer = new MutationObserver(() => this.revision++);
      this.observer.observe(this.el, { childList: true });
    }
  }

  disconnectedCallback() {
    this.locale.disconnect();
    this.observer?.disconnect();
  }

  private extraLinks(): Element[] {
    return Array.from(this.el.children).filter((c) => c.localName === 'a' || (c.getAttribute('slot') ?? '').startsWith('link-'));
  }

  componentWillRender() {
    this.extraLinks().forEach((link, i) => {
      const name = `link-${i}`;
      if (link.getAttribute('slot') !== name) link.setAttribute('slot', name);
    });
  }

  render() {
    const { t } = this.locale;
    const standard: [string | undefined, StringKey][] = [
      [this.helpHref, 'footerHelp'],
      [this.accessibilityHref, 'footerAccessibility'],
      [this.privacyHref, 'footerPrivacy'],
      [this.termsHref, 'footerTerms'],
    ];
    const extra = this.extraLinks();
    return (
      <Host>
        <footer class="footer" part="footer">
          <sc-container>
            <div class="inner">
              <h2 class="visually-hidden" id="heading">
                {t('footerLinksHeading')}
              </h2>
              <ul class="list" part="list" aria-labelledby="heading">
                {standard
                  .filter(([href]) => !!href)
                  .map(([href, key]) => (
                    <li>
                      <a class="link focus-ring" part="link" href={href}>
                        {t(key)}
                      </a>
                    </li>
                  ))}
                {extra.map((_, i) => (
                  <li>
                    <slot name={`link-${i}`} />
                  </li>
                ))}
              </ul>
              <p class="meta type-caption" part="meta">
                <slot name="meta">{t('footerGovernment')}</slot>
              </p>
            </div>
          </sc-container>
        </footer>
      </Host>
    );
  }
}
