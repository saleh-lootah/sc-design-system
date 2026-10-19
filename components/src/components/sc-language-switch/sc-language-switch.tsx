import { Component, Element, Event, EventEmitter, Host, Prop, h } from '@stencil/core';
import { LocaleController } from '../../i18n/locale';
import type { Lang } from '../../i18n/strings';

/** Warn once per page about the deprecated button mode, not once per render. */
let warnedButtonMode = false;

export interface LanguageSwitchDetail {
  /** The language the user asked for. */
  lang: Lang;
}

/**
 * Switches to the same page in the other language. The label is always the other
 * language's own name, "العربية" on an English page and "English" on an Arabic page,
 * marked with its own `lang` and direction so screen readers pronounce it correctly.
 *
 * Renders an `<a href hreflang lang>` to the same page in the other language (LANG-05: the
 * switch is a link). It fires `scSwitch` on every activation; a single-page app calls
 * `preventDefault()` on it and switches in place, and the link still works without script.
 *
 * Without `href` it falls back to a `<button lang>`. That mode is deprecated and will be
 * removed in the next major version: always set `href`.
 *
 * @part control - The inner `<a>` (or, deprecated, `<button>` when `href` is missing).
 * @part label - The language name.
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
   * Surface.
   * - `glass` (default): a 44px translucent pill, for mobile app bars.
   * - `plain`: no fill, for desktop headers.
   */
  @Prop({ reflect: true }) appearance: 'glass' | 'plain' = 'glass';

  /**
   * Fires when the switch is activated, with the language asked for. Call `preventDefault()`
   * to stop a link from navigating (for example, to switch language in a single-page app).
   */
  @Event({ bubbles: true, composed: true, cancelable: true }) scSwitch!: EventEmitter<LanguageSwitchDetail>;

  private locale = new LocaleController(this);

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

  private onClick = (ev: MouseEvent) => {
    const event = this.scSwitch.emit({ lang: this.target });
    if (event.defaultPrevented) ev.preventDefault();
  };

  render() {
    const { t } = this.locale;
    const target = this.target;
    const name = target === 'ar' ? t('languageSwitchNameAr') : t('languageSwitchNameEn');
    const dir = target === 'ar' ? 'rtl' : 'ltr';
    const classes = { 'control': true, 'focus-ring': true, 'control--plain': this.appearance === 'plain' };
    const label = (
      <span class="label" part="label" lang={target} dir={dir}>
        {name}
      </span>
    );
    return (
      <Host>
        {this.href ? (
          <a class={classes} part="control" href={this.href} hreflang={target} lang={target} onClick={this.onClick}>
            {label}
          </a>
        ) : (
          <button class={classes} part="control" type="button" lang={target} onClick={this.onClick}>
            {label}
          </button>
        )}
      </Host>
    );
  }
}
