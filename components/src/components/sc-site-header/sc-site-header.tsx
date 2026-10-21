import { Component, Element, Host, Listen, Method, Prop, State, Watch, h } from '@stencil/core';
import { LocaleController } from '../../i18n/controller';
import strings from '../../i18n/components/sc-site-header';
import { ChevronForward as Chevron, Close as CloseIcon, Fingerprint, Menu, Search as SearchIcon } from '../../icons/for/sc-site-header';
import { enter, exit, fromPointer } from '../../utils/motion';

/** Below this width the header is compact and navigation moves into the menu (CHR-04). */
const COMPACT = '(max-width: 1023.98px)';

/**
 * The header of channel pages outside a transaction (Standard CHR-01 to CHR-04;
 * component-language B2). Transaction pages use `sc-app-bar`.
 *
 * From the inline-start edge: the Government of Dubai lockup (`slot="lockup"`), the main
 * navigation (`slot="nav"`), search, the language switch (`slot="language"`), sign in with UAE PASS
 * (`slot="signin"`) or the account menu once signed in (`slot="account"`), and the
 * channel's logo and switcher (`slot="switcher"`, an `sc-channel-switcher`). Sign in is the
 * official UAE PASS button (decision U3a), never a themed `sc-button`: until the official kit
 * arrives the header renders a marked placeholder (black, white label, fingerprint glyph,
 * 56px) that `slot="signin"` replaces. The order
 * mirrors in Arabic. A flat `surface` bar, 80px tall, with a 1px `outline-variant` rule.
 *
 * Below 1024px the row keeps the menu button, the lockup, the language switch and the
 * channel switcher (64px). Navigation, search and sign in (or the account menu) move into
 * the mobile menu: a modal `<dialog>` labelled "Menu", with focus on its close button when
 * it opens, Escape closing it and returning focus to the menu button, and the page behind
 * it inert. The same slotted elements move; nothing is duplicated.
 *
 * The host is a `<header>` banner landmark. It is not fixed by default; with `sticky`,
 * `sc-page` keeps `scroll-padding-top` clear of it (A11Y-05, F-009).
 *
 * @slot lockup - The Government of Dubai lockup, as supplied (decision L1–L4): an `<img>` or
 *   `<svg>` with the text alternative "Government of Dubai" / "حكومة دبي", 40px tall, usually
 *   inside an `<a href>` to the channel home. The library ships no logo.
 * @slot nav - The main navigation: `<a href>` elements, direct children of the header, four
 *   or five of them. Mark the current one with `aria-current="page"`.
 * @slot language - `<sc-language-switch>`.
 * @slot signin - The official UAE PASS sign-in button, when available (U3a). Replaces the
 *   built-in placeholder; it moves into the mobile menu on compact screens.
 * @slot account - `<sc-account-menu>` once the user is signed in. It replaces sign in.
 * @slot switcher - `<sc-channel-switcher>`, the channel's logo and the channel switcher.
 *
 * @part bar - The header row.
 * @part menu - The mobile menu `<dialog>`.
 */
@Component({
  tag: 'sc-site-header',
  styleUrl: 'sc-site-header.css',
  shadow: true,
})
export class ScSiteHeader {
  @Element() el!: HTMLElement;

  /**
   * Where the UAE PASS placeholder button leads. The placeholder shows when this is set and
   * there is neither a `slot="signin"` nor a `slot="account"` child.
   */
  @Prop() signInHref?: string;

  /** Overrides the placeholder's "Sign in with UAE PASS" (in the page language). */
  @Prop() signInText?: string;

  /** The search page. Adds a search button (an icon link named "Search"). */
  @Prop() searchHref?: string;

  /** Keeps the header at the top while the page scrolls. `sc-page` then sets `scroll-padding-top`. */
  @Prop({ reflect: true }) sticky = false;

  /** The compact layout: below 1024px, or wider when the full row does not fit. */
  @State() compact = false;
  @State() menuOpen = false;
  @State() hasAccount = false;
  @State() hasSignIn = false;

  private locale = new LocaleController(this, strings);
  private media?: MediaQueryList;
  private dialog?: HTMLDialogElement;
  private menuButton?: HTMLButtonElement;
  private closeButton?: HTMLButtonElement;
  private observer?: MutationObserver;
  private resize?: ResizeObserver;
  private nav?: HTMLElement;
  /** The host width at which the full row last overflowed: stay compact up to it. */
  private overflowAt = 0;

  connectedCallback() {
    this.locale.connect();
    this.readSlots();
    if (typeof MutationObserver !== 'undefined') {
      this.observer = new MutationObserver(() => this.readSlots());
      this.observer.observe(this.el, { childList: true, attributes: true, attributeFilter: ['slot'] });
    }
    if (typeof matchMedia === 'function') {
      this.media = matchMedia(COMPACT);
      this.compact = this.media.matches;
      this.media.addEventListener('change', this.fit);
    }
    if (typeof ResizeObserver !== 'undefined') {
      this.resize = new ResizeObserver(this.fit);
      this.resize.observe(this.el);
    }
  }

  componentDidRender() {
    // A new language or new navigation can make the full row overflow. Measured after the
    // frame, so state never changes during a render.
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(this.fit);
  }

  disconnectedCallback() {
    this.locale.disconnect();
    this.observer?.disconnect();
    this.media?.removeEventListener('change', this.fit);
    this.resize?.disconnect();
  }

  private readSlots() {
    const slots = Array.from(this.el.children).map((c) => c.getAttribute('slot'));
    this.hasAccount = slots.includes('account');
    this.hasSignIn = slots.includes('signin');
  }

  /**
   * Chooses the layout. Below 1024px it is always compact (CHR-04). Wider, the full row is
   * used when it fits; when the navigation and end controls overflow (five long items in
   * Arabic at 1024–1279px), the header falls back to the compact row and its menu rather
   * than wrapping or clipping, until the header is wider than where it overflowed.
   */
  private fit = () => {
    const width = this.el.clientWidth;
    if (this.media?.matches) {
      this.compact = true;
      return;
    }
    if (!this.compact) {
      const inner = this.nav?.parentElement;
      if (this.nav && (this.nav.scrollWidth > this.nav.clientWidth + 1 || (inner && inner.scrollWidth > inner.clientWidth + 1))) {
        this.overflowAt = width;
        this.compact = true;
      }
    } else if (width > this.overflowAt) {
      this.compact = false;
    }
  };

  @Watch('compact')
  onCompactChange(compact: boolean) {
    // Widening the window with the menu open: close it; the navigation is back in the bar.
    if (!compact && this.menuOpen) this.closeMenu(false);
  }

  /** Opens the mobile menu (compact layout only). */
  @Method()
  async openMenu() {
    this.showMenu(false);
  }

  /** Closes the mobile menu and returns focus to the menu button. */
  @Method()
  async closeMenu(pointer = false) {
    if (!this.menuOpen || !this.dialog) return;
    exit(this.dialog, pointer, () => this.dialog?.open && this.dialog.close());
  }

  private showMenu(pointer: boolean) {
    if (!this.dialog || this.dialog.open) return;
    this.menuOpen = true;
    this.dialog.showModal();
    this.closeButton?.focus();
    enter(this.dialog, pointer, 'rise');
  }

  private onMenuButton = (ev: MouseEvent) => this.showMenu(fromPointer(ev));
  private onCloseButton = (ev: MouseEvent) => this.closeMenu(fromPointer(ev));

  /** Escape (the dialog's cancel) closes instantly, as every keyboard action. */
  private onDialogClose = () => {
    this.menuOpen = false;
    this.menuButton?.focus();
  };

  /** A click on a navigation link inside the menu closes it (in-page links, single-page apps). */
  @Listen('click')
  onHostClick(ev: MouseEvent) {
    if (!this.menuOpen) return;
    const link = (ev.target as Element | null)?.closest?.('a[slot="nav"]');
    if (link && this.dialog?.open) this.dialog.close();
  }

  /**
   * Sign in (U3a): the official UAE PASS button from `slot="signin"`, or, until the kit
   * arrives, a placeholder that is never themed: black fill, white label, a fingerprint
   * glyph, 56px. It is marked `data-placeholder="uaepass"` so it is easy to find and swap.
   */
  private renderSignIn() {
    if (this.hasSignIn) return <slot name="signin" />;
    if (!this.signInHref) return null;
    return (
      <a class="uaepass focus-ring" part="signin" data-placeholder="uaepass" href={this.signInHref}>
        <Fingerprint />
        <span>{this.signInText || this.locale.t('headerSignIn')}</span>
      </a>
    );
  }

  private get canSignIn() {
    return this.hasSignIn || !!this.signInHref;
  }

  private renderSearch(row: boolean) {
    if (!this.searchHref) return null;
    const { t } = this.locale;
    return row ? (
      <a class="menu-row menu-search focus-ring state-layer" href={this.searchHref}>
        <SearchIcon />
        <span class="menu-row-label">{t('headerSearch')}</span>
        <Chevron class="menu-chevron" />
      </a>
    ) : (
      <a class="icon-button focus-ring state-layer" href={this.searchHref}>
        <SearchIcon />
        <span class="visually-hidden">{t('headerSearch')}</span>
      </a>
    );
  }

  render() {
    const { t } = this.locale;
    const compact = this.compact;
    return (
      <Host>
        <header class={{ bar: true, compact }} part="bar">
          <div class="inner">
            {compact && (
              <button
                type="button"
                class="icon-button menu-button focus-ring state-layer"
                aria-haspopup="dialog"
                aria-expanded={this.menuOpen ? 'true' : 'false'}
                aria-controls="menu"
                ref={(el) => (this.menuButton = el)}
                onClick={this.onMenuButton}
              >
                <Menu />
                <span class="visually-hidden">{t('headerOpenMenu')}</span>
              </button>
            )}
            <div class="lockup">
              <slot name="lockup" />
            </div>
            {!compact && (
              <nav class="nav" aria-label={t('headerNav')} ref={(el) => (this.nav = el)}>
                <slot name="nav" />
              </nav>
            )}
            <div class="end">
              {!compact && this.renderSearch(false)}
              {!this.menuOpen && (
                <div class="language">
                  <slot name="language" />
                </div>
              )}
              {!compact && (this.hasAccount ? <slot name="account" /> : this.renderSignIn())}
              <div class="switcher">
                <slot name="switcher" />
              </div>
            </div>
          </div>
        </header>
        <dialog class="menu" id="menu" part="menu" aria-labelledby="menu-title" ref={(el) => (this.dialog = el)} onClose={this.onDialogClose}>
          {compact && [
            <div class="menu-head">
              <button type="button" class="icon-button focus-ring state-layer" ref={(el) => (this.closeButton = el)} onClick={this.onCloseButton}>
                <CloseIcon />
                <span class="visually-hidden">{t('headerCloseMenu')}</span>
              </button>
              <h2 class="menu-title" id="menu-title">
                {t('headerMenu')}
              </h2>
              <div class="menu-language">{this.menuOpen && <slot name="language" />}</div>
            </div>,
            <div class="menu-body">
              {this.renderSearch(true)}
              <nav class="menu-nav" aria-label={t('headerNav')}>
                <slot name="nav" />
              </nav>
              <div class="menu-foot">
                {this.hasAccount ? (
                  <slot name="account" />
                ) : (
                  this.canSignIn && [this.renderSignIn(), <p class="menu-hint">{t('headerSignInHint')}</p>]
                )}
              </div>
            </div>,
          ]}
        </dialog>
      </Host>
    );
  }
}
