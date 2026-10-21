import { newSpecPage } from '@stencil/core/testing';
import { ScFooter } from './sc-footer';

const LINKS = `{"now":"/now/{lang}","transport":"/transport/{lang}","visit":"/visit/{lang}","justice":"/justice/{lang}","build":"/build/{lang}","invest":"/invest/{lang}","trade":"/trade/{lang}"}`;
const HREFS = `about-href="/about" help-href="/help" accessibility-href="/a11y" privacy-href="/privacy" terms-href="/terms" sitemap-href="/sitemap"`;
const render = (html: string) => newSpecPage({ components: [ScFooter], html });

describe('sc-footer (spec)', () => {
  it('simple: a footer with a hidden heading, a list of the standard links and the government line', async () => {
    const page = await render(`<sc-footer help-href="/help" accessibility-href="/a11y" privacy-href="/privacy" terms-href="/terms"></sc-footer>`);
    const root = page.root!.shadowRoot!;
    expect(root.querySelector('footer')).not.toBeNull();
    expect(root.querySelector('h2.visually-hidden')!.textContent).toBe('Support links');
    const links = Array.from(root.querySelectorAll('ul > li > a'));
    expect(links.map((a) => a.textContent)).toEqual(['Help and contact', 'Accessibility statement', 'Privacy and cookies', 'Terms of use']);
    expect(links.map((a) => a.getAttribute('href'))).toEqual(['/help', '/a11y', '/privacy', '/terms']);
    expect(root.querySelector('[part="meta"] slot')!.textContent).toBe('Government of Dubai');
  });

  it('only renders standard links that have an href, and splits privacy and cookies with cookies-href', async () => {
    const page = await render(`<sc-footer privacy-href="/privacy" cookies-href="/cookies"></sc-footer>`);
    expect(Array.from(page.root!.shadowRoot!.querySelectorAll('li a')).map((a) => a.textContent)).toEqual(['Privacy', 'Cookies']);
  });

  it('simple: orders the links help, accessibility, privacy, terms, cookies (A29)', async () => {
    const page = await render(`<sc-footer help-href="/h" accessibility-href="/a" privacy-href="/p" cookies-href="/c" terms-href="/t"></sc-footer>`);
    expect(Array.from(page.root!.shadowRoot!.querySelectorAll('li a')).map((a) => a.getAttribute('href'))).toEqual(['/h', '/a', '/p', '/t', '/c']);
  });

  it('gives each slotted link its own list item', async () => {
    const page = await render(`<sc-footer help-href="/help"><a href="/feedback">Give feedback</a><a href="/jobs">Jobs</a></sc-footer>`);
    const extra = Array.from(page.root!.querySelectorAll('a'));
    expect(extra.map((a) => a.getAttribute('slot'))).toEqual(['link-0', 'link-1']);
    expect(page.root!.shadowRoot!.querySelectorAll('li').length).toBe(3);
  });

  it('grouped: brand, Channels, Helpful information and Legal groups, each with an h2 (CHR-06)', async () => {
    const page = await render(`<sc-footer variant="grouped" channel="transport" updated="12 October 2026" links='${LINKS}' ${HREFS}></sc-footer>`);
    const root = page.root!.shadowRoot!;
    expect(Array.from(root.querySelectorAll('h2')).map((h) => h.textContent)).toEqual(['Channels', 'Helpful information', 'Legal']);
    expect(root.querySelector('.brand-name')!.textContent).toBe('Dubai Transport');
    const groups = Array.from(root.querySelectorAll('section'));
    const texts = (s: Element) => Array.from(s.querySelectorAll('li')).map((l) => l.textContent);
    expect(texts(groups[0])).toEqual(['Dubai Now', 'Dubai Transport', 'Visit Dubai', 'Dubai Justice', 'Build in Dubai', 'Invest in Dubai', 'Dubai Trade']);
    expect(texts(groups[1])).toEqual(['About Dubai Transport', 'Help and contact', 'Accessibility statement', 'Sitemap']);
    expect(texts(groups[2])).toEqual(['Privacy and cookies', 'Terms of use']);
    expect(groups[0].querySelector('a')!.getAttribute('href')).toBe('/now/en');
    const metas = Array.from(root.querySelectorAll('.lower p')).map((p) => p.textContent);
    expect(metas).toEqual(['Government of Dubai · Last updated 12 October 2026', 'Dubai Transport is run by the Government of Dubai']);
  });

  it('grouped: marks the current channel with aria-current and no swatch', async () => {
    const page = await render(`<sc-footer variant="grouped" channel="visit" links='${LINKS}'></sc-footer>`);
    const current = page.root!.shadowRoot!.querySelectorAll('[aria-current="true"]');
    expect(current.length).toBe(1);
    expect(current[0].textContent).toBe('Visit Dubai');
    expect(current[0].querySelector('span')).toBeNull();
  });

  it('uses Arabic strings', async () => {
    const page = await render(`<div lang="ar"><sc-footer variant="grouped" channel="now" links='${LINKS}' ${HREFS}></sc-footer></div>`);
    const root = page.body.querySelector('sc-footer')!.shadowRoot!;
    expect(root.querySelector('h2')!.textContent).toBe('القنوات');
    expect(root.querySelector('section a')!.getAttribute('href')).toBe('/now/ar');
    expect(root.querySelectorAll('.lower p')[1].textContent).toBe('دبي الآن تديرها حكومة دبي');
  });
});
