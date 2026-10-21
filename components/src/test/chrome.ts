/**
 * Markup for the site chrome (C1) e2e and screenshot tests: a channel page with every part,
 * built from the public API only, as a service would write it.
 *
 *   import { CHANNEL_LINKS, LOCKUP, siteHeader } from '../../test/chrome';
 */

/** Every channel's home, as the `links` attribute of the switcher, footer and network strip. */
export const CHANNEL_LINKS = `{"now":"#now-{lang}","transport":"#transport-{lang}","visit":"#visit-{lang}","justice":"#justice-{lang}","build":"#build-{lang}","invest":"#invest-{lang}","trade":"#trade-{lang}"}`;

/**
 * The neutral lockup placeholder public pages use (decision L2): the official lockup's
 * proportions (680.84 × 274.11) at 40px tall, labelled "Government of Dubai lockup".
 */
export const LOCKUP = `<a slot="lockup" href="#home" style="color: inherit"><svg role="img" aria-label="Government of Dubai" viewBox="0 0 680.84 274.11" style="display:block;block-size:40px;inline-size:auto" fill="none" stroke="currentColor" stroke-width="6" stroke-dasharray="18 12"><rect x="3" y="3" width="674.84" height="268.11" rx="16"/></svg></a>`;

const t = (lang: string, en: string, ar: string) => (lang === 'ar' ? ar : en);

/** A signed-out (or, with `signedIn`, signed-in) channel-site header in the given language. */
export function siteHeader(lang = 'en', { signedIn = false, attrs = '' } = {}): string {
  const other = lang === 'ar' ? 'en' : 'ar';
  const account = signedIn
    ? `<sc-account-menu slot="account" name="Sara Al Mansoori" acting-for="Al Mansoori Trading LLC" profile-href="#profile" settings-href="#settings" representation-href="#representation" notifications-href="#notifications" unread="3"></sc-account-menu>`
    : '';
  return `
    <sc-site-header ${signedIn ? '' : 'sign-in-href="#sign-in"'} search-href="#search" ${attrs}>
      ${LOCKUP}
      <a slot="nav" href="#home" aria-current="page">${t(lang, 'Home', 'الرئيسية')}</a>
      <a slot="nav" href="#services">${t(lang, 'Services', 'الخدمات')}</a>
      <a slot="nav" href="#life-events">${t(lang, 'Life events', 'أحداث الحياة')}</a>
      <a slot="nav" href="#help">${t(lang, 'Help and contact', 'المساعدة والتواصل')}</a>
      <sc-language-switch slot="language" appearance="plain" href="#${other}"></sc-language-switch>
      ${account}
      <sc-channel-switcher slot="switcher" links='${CHANNEL_LINKS}'></sc-channel-switcher>
    </sc-site-header>`;
}

/** The grouped footer with every required link. */
export function groupedFooter(lang = 'en', attrs = ''): string {
  return `
    <sc-footer variant="grouped" ${attrs} updated="${t(lang, '12 October 2026', '12 أكتوبر 2026')}" links='${CHANNEL_LINKS}'
      about-href="#about" help-href="#help" accessibility-href="#accessibility" privacy-href="#privacy" terms-href="#terms" sitemap-href="#sitemap">
      <p slot="brand">${t(lang, 'Government services for everyone who lives in Dubai, in one place.', 'الخدمات الحكومية لكل من يعيش في دبي، في مكان واحد.')}</p>
    </sc-footer>`;
}
