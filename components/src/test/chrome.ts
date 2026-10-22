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

const CHANNEL_KEYS = ['now', 'transport', 'visit', 'justice', 'build', 'invest', 'trade'];
/** The official channel names (R12), in the Standard 3.1 order. */
export const CHANNEL_NAMES = {
  en: ['Dubai Now', 'Dubai Transport', 'Visit Dubai', 'Dubai Justice', 'Build in Dubai', 'Invest in Dubai', 'Dubai Trade'],
  ar: ['دبي الآن', 'مواصلات دبي', 'زوروا دبي', 'دبي للعدالة', 'دبي للبناء', 'استثمر في دبي', 'دبي التجارية'],
};

/**
 * The grouped footer with every required link, as a service writes it (CSS only): the brand,
 * the Channels group with `current` marked, Helpful information, Legal and the lower line.
 */
export function groupedFooter(lang = 'en', { current = 'now', attrs = '' } = {}): string {
  const names = lang === 'ar' ? CHANNEL_NAMES.ar : CHANNEL_NAMES.en;
  const name = names[CHANNEL_KEYS.indexOf(current)];
  const li = (href: string, text: string, extra = '') => `<li><a href="${href}"${extra}>${text}</a></li>`;
  return `
    <sc-footer variant="grouped" ${attrs}><footer>
      <div class="sc-footer__brand">
        <p>${name}</p>
        <p>${t(lang, 'Government services for everyone who lives in Dubai, in one place.', 'الخدمات الحكومية لكل من يعيش في دبي، في مكان واحد.')}</p>
      </div>
      <section class="sc-footer__channels" aria-labelledby="footer-channels">
        <h2 id="footer-channels">${t(lang, 'Channels', 'القنوات')}</h2>
        <ul>${CHANNEL_KEYS.map((k, i) => li(`#${k}-${lang}`, names[i], k === current ? ` hreflang="${lang}" aria-current="true"` : ` hreflang="${lang}"`)).join('')}</ul>
      </section>
      <section aria-labelledby="footer-helpful">
        <h2 id="footer-helpful">${t(lang, 'Helpful information', 'معلومات مفيدة')}</h2>
        <ul>${li('#about', t(lang, `About ${name}`, `عن ${name}`))}${li('#help', t(lang, 'Help and contact', 'المساعدة والتواصل'))}${li('#accessibility', t(lang, 'Accessibility statement', 'بيان إمكانية الوصول'))}${li('#sitemap', t(lang, 'Sitemap', 'خريطة الموقع'))}</ul>
      </section>
      <section aria-labelledby="footer-legal">
        <h2 id="footer-legal">${t(lang, 'Legal', 'المعلومات القانونية')}</h2>
        <ul>${li('#privacy', t(lang, 'Privacy and cookies', 'الخصوصية وملفات تعريف الارتباط'))}${li('#terms', t(lang, 'Terms of use', 'شروط الاستخدام'))}</ul>
      </section>
      <div class="sc-footer__lower">
        <p>${t(lang, 'Government of Dubai · Last updated 12 October 2026', 'حكومة دبي · آخر تحديث 12 أكتوبر 2026')}</p>
        <p>${t(lang, `${name} is run by the Government of Dubai`, `${name} تديرها حكومة دبي`)}</p>
      </div>
    </footer></sc-footer>`;
}

/** The simple footer (transaction pages), as a service writes it. */
export function simpleFooter(lang = 'en', extra = ''): string {
  const links: [string, string, string][] = [
    ['#help', 'Help and contact', 'المساعدة والتواصل'],
    ['#a11y', 'Accessibility statement', 'بيان إمكانية الوصول'],
    ['#privacy', 'Privacy', 'الخصوصية'],
    ['#terms', 'Terms of use', 'شروط الاستخدام'],
    ['#cookies', 'Cookies', 'ملفات تعريف الارتباط'],
  ];
  return `<sc-footer><footer>
    <nav aria-label="${t(lang, 'Support links', 'روابط الدعم')}"><ul>${links.map(([h, en, ar]) => `<li><a href="${h}">${t(lang, en, ar)}</a></li>`).join('')}${extra}</ul></nav>
    <p>${t(lang, 'Government of Dubai', 'حكومة دبي')}</p>
  </footer></sc-footer>`;
}
