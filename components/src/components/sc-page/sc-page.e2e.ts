import { expectNoAxeViolations } from '../../test/axe';
import { contexts, newScPage, setPageContext } from '../../test/page';

/** The D+ Dubai Now home in miniature: skip link, hero with search, service cards, footer. */
const HOME = `
  <sc-page channel="now">
    <div slot="header"><a id="skip" href="#main-content">Skip to main content</a></div>
    <sc-channel-hero>
      <p slot="eyebrow">Government services for everyone who lives in Dubai</p>
      <h1 slot="heading">What do you need to do?</h1>
      <sc-search label-hidden label="Search services"></sc-search>
    </sc-channel-hero>
    <sc-container>
      <h2>Most used services</h2>
      <sc-grid span-medium="4" span-expanded="4">
        <sc-service-card href="#renew" entity="Roads and Transport Authority">Renew vehicle registration</sc-service-card>
        <sc-service-card href="#bills" entity="Dubai Electricity and Water Authority">Pay water and electricity bills</sc-service-card>
        <sc-service-card href="#tenancy" entity="Dubai Land Department">Register a tenancy contract</sc-service-card>
      </sc-grid>
    </sc-container>
    <sc-footer slot="footer" help-href="#help" accessibility-href="#a11y" privacy-href="#privacy" terms-href="#terms"></sc-footer>
  </sc-page>`;

describe('sc-page (e2e)', () => {
  it('composes the home page with no axe violations in English and Arabic, light and dark', async () => {
    const page = await newScPage(HOME);
    await page.setViewport({ width: 1440, height: 900 });
    for (const ctx of contexts) {
      await setPageContext(page, ctx);
      await expectNoAxeViolations(page);
    }
  });

  it('renders header, main and footer in order, with main in light DOM', async () => {
    const page = await newScPage(HOME);
    const order = await page.evaluate(() => {
      const el = document.querySelector('sc-page')!;
      return [el.shadowRoot === null, Array.from(el.querySelectorAll('[slot="header"], main, sc-footer')).map((n) => n.localName)];
    });
    expect(order).toEqual([true, ['div', 'main', 'sc-footer']]);
    expect(await page.evaluate(() => document.getElementById('main-content')!.contains(document.querySelector('sc-channel-hero')))).toBe(true);
  });

  it('the skip link moves focus to main', async () => {
    const page = await newScPage(HOME);
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement!.id)).toBe('skip');
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(await page.evaluate(() => document.activeElement!.id)).toBe('main-content');
    // The next Tab continues inside main (the search field), not back at the top.
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement!.localName)).toBe('sc-search');
  });

  it('sets dir from lang, and follows lang changes on itself', async () => {
    const page = await newScPage(HOME);
    const attrs = () => page.evaluate(() => ['lang', 'dir', 'data-channel'].map((a) => document.querySelector('sc-page')!.getAttribute(a)));
    expect(await attrs()).toEqual([null, 'ltr', 'now']);
    await page.evaluate(() => document.querySelector('sc-page')!.setAttribute('lang', 'ar'));
    await page.waitForChanges();
    expect(await attrs()).toEqual(['ar', 'rtl', 'now']);
    // Components inside take the page's language.
    const button = await page.evaluate(() => document.querySelector('sc-search')!.shadowRoot!.querySelector('sc-button')!.textContent);
    expect(button).toBe('بحث');
  });

  it('themes everything inside by channel', async () => {
    const page = await newScPage(HOME);
    const action = () => page.evaluate(() => getComputedStyle(document.querySelector('sc-page')!).getPropertyValue('--sc-channel-action').trim());
    const now = await action();
    await page.evaluate(() => document.querySelector('sc-page')!.setAttribute('channel', 'justice'));
    await page.waitForChanges();
    expect(await page.evaluate(() => document.querySelector('sc-page')!.getAttribute('data-channel'))).toBe('justice');
    expect(await action()).not.toBe(now);
  });

  it('copies lang, dir and channel to <html> with sync-document', async () => {
    const page = await newScPage(`<sc-page lang="ar" channel="trade" sync-document><p>Content</p></sc-page>`);
    const html = await page.evaluate(() => [document.documentElement.lang, document.documentElement.dir, document.documentElement.dataset.channel]);
    expect(html).toEqual(['ar', 'rtl', 'trade']);
  });

  it('keeps the strings in sync with the page language context', async () => {
    const page = await newScPage(HOME, { lang: 'ar' });
    const first = () => page.evaluate(() => document.querySelector('sc-footer')!.shadowRoot!.querySelector('li a')!.textContent);
    expect(await first()).toBe('المساعدة والتواصل');
    await setPageContext(page, { lang: 'en' });
    expect(await first()).toBe('Help and contact');
  });
});
