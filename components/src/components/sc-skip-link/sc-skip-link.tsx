import { Component, Element, Host, Prop, h } from '@stencil/core';
import { LocaleController } from '../../i18n/controller';
import strings from '../../i18n/components/sc-skip-link';

/**
 * "Skip to main content": the first focusable element on every page. Hidden until it gets
 * keyboard focus, then shown at the top start corner. Activating it moves focus to the
 * target (adding `tabindex="-1"` for the moment it's needed), so the next Tab continues
 * from the main content in every browser.
 *
 * Put it first inside `<body>`, before `sc-app-bar` or `sc-site-header`. v2 shows it as a
 * 48px `inverse-surface` block, so it stands out over any hero or announcement colour.
 *
 * @slot - Overrides the label. Defaults to "Skip to main content" / "الانتقال إلى المحتوى الرئيسي".
 *
 * @part control - The inner `<a>`.
 */
@Component({
  tag: 'sc-skip-link',
  styleUrl: 'sc-skip-link.css',
  shadow: { delegatesFocus: true },
})
export class ScSkipLink {
  @Element() el!: HTMLElement;

  /** The fragment of the element to skip to, `<main id="main-content">` by default, the id `sc-page` renders. */
  @Prop({ reflect: true }) href = '#main-content';

  private locale = new LocaleController(this, strings);

  connectedCallback() {
    this.locale.connect();
  }

  disconnectedCallback() {
    this.locale.disconnect();
  }

  private onClick = () => {
    const href = this.href || '';
    if (!href.startsWith('#') || href.length < 2) return;
    let id = href.slice(1);
    try {
      id = decodeURIComponent(id);
    } catch {
      /* keep the raw fragment */
    }
    const target = this.el.ownerDocument.getElementById(id);
    if (!target) return;
    if (!target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1');
      target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
    }
    target.focus();
  };

  render() {
        return (
      <Host>
        <a class="control" part="control" href={this.href} onClick={this.onClick}>
          <slot>{this.locale.t('skipLinkLabel')}</slot>
        </a>
      </Host>
    );
  }
}
