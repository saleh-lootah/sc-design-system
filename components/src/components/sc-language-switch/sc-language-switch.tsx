import { Component, Element, Event, EventEmitter, Host, Prop, h } from '@stencil/core';
import { LocaleController } from '../../i18n/controller';
import strings from '../../i18n/components/sc-language-switch';
import type { Lang } from '../../i18n/core';
import { Language } from '../../icons/nav'; // a file import: Stencil only scans file imports for <svg>

/** Warn once per page about the deprecated button mode, not once per render. */
let warnedButtonMode = false;

export type LanguageSwitchAppearance = 'inline' | 'header';

export interface LanguageSwitchDetail {
  /** The language the user asked for. */
  lang: Lang;
}

/**
 * Switches to the same page in the other language. The label is always the other
 * language's own name, "العربية" on an English page and "English" on an Arabic page,
 * marked with its own `lang` and direction so screen readers pronounce it correctly, and
 * set in its own script's type role (an Arabic name at the Arabic size on an English page).
 *
 * Renders an `<a href hreflang lang>` to the same page in the other language (LANG-05: the
 * switch is a link). It fires `scSwitch` on every activation; a single-page app calls
 * `preventDefault()` on it and switches in place, and the link still works without script.
 *
 * The language name is kept as one light-DOM `<span lang>` child that the component writes
 * itself and shows through its slot: the type roles switch by `lang` in the document, which
 * a span inside the shadow root could not reach. Don't add or remove children yourself.
 *
 * Without `href` it falls back to a `<button lang>`. That mode is deprecated and will be
 * removed: always set `href`.
 *
 * @part control - The inner `<a>` (or, deprecated, `<button>` when `href` is missing).
 * @part label - The wrapper around the language name.
 * @part icon - The globe (`appearance="header"` only).
 */
@Component({
  tag: 'sc-language-switch',
  styleUrl: 'sc-language-switch.css',
  shadow: { delegatesFocus: true },
})
export class ScLanguageSwitch {
  @Element() el!: HTMLElement;

  /**
   * The same page in the other language. Sets `hreflang` to that language. Always set it:
   * without it the switch renders a button, which is deprecated.
   */
  @Prop({ reflect: true }) href?: string;

  /**
   * Where the switch sits.
   * - `inline` (default): the app bar of a transaction. An underlined text link in the
   *   channel action colour, label-medium.
   * - `header`: the channel-site header. A globe icon and the name in `on-surface`,
   *   label-large Medium, underlined on hover.
   *
   * The v1 values still work: `glass` is `inline` and `plain` is `header`.
   */
  @Prop({ reflect: true }) appearance: LanguageSwitchAppearance | 'glass' | 'plain' = 'inline';

  /**
   * Fires when the switch is activated, with the language asked for. Call `preventDefault()`
   * to stop a link from navigating (for example, to switch language in a single-page app).
   */
  @Event({ bubbles: true, composed: true, cancelable: true }) scSwitch!: EventEmitter<LanguageSwitchDetail>;

  private locale = new LocaleController(this, strings);

  connectedCallback() {
    this.locale.connect();
  }

  componentDidLoad() {
    if (!this.href && !warnedButtonMode) {
      warnedButtonMode = true;
      console.warn('sc-language-switch: the button mode (no href) is deprecated. Set href to the same page in the other language; call preventDefault() on scSwitch to switch in place.');
    }
  }

  disconnectedCallback() {
    this.locale.disconnect();
  }

  /** The language this switch leads to: the other one. */
  private get target(): Lang {
    return this.locale.lang === 'ar' ? 'en' : 'ar';
  }

  /** Writes the language name into the one light-DOM child the slot shows. */
  componentWillRender() {
    const target = this.target;
    const name = this.locale.t(target === 'ar' ? 'languageSwitchNameAr' : 'languageSwitchNameEn');
    let span = Array.from(this.el.children).find((c) => c.hasAttribute('data-sc-language-name'));
    if (!span) {
      span = this.el.ownerDocument.createElement('span');
      span.setAttribute('data-sc-language-name', '');
      this.el.append(span);
    }
    if (span.getAttribute('lang') !== target) {
      span.setAttribute('lang', target);
      span.setAttribute('dir', target === 'ar' ? 'rtl' : 'ltr');
    }
    if (span.textContent !== name) span.textContent = name;
  }

  private onClick = (ev: MouseEvent) => {
    const event = this.scSwitch.emit({ lang: this.target });
    if (event.defaultPrevented) ev.preventDefault();
  };

  render() {
    const target = this.target;
    const header = this.appearance === 'header' || this.appearance === 'plain';
    const classes = { 'control': true, 'focus-ring': true, 'control--header': header };
    const content = [
      header && (
        <span class="icon-box" part="icon">
          <Language />
        </span>
      ),
      <span class="label" part="label">
        <slot />
      </span>,
    ];
    return (
      <Host>
        {this.href ? (
          <a class={classes} part="control" href={this.href} hreflang={target} lang={target} onClick={this.onClick}>
            {content}
          </a>
        ) : (
          <button class={classes} part="control" type="button" lang={target} onClick={this.onClick}>
            {content}
          </button>
        )}
      </Host>
    );
  }
}
