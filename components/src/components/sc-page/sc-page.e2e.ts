import { E2EPage } from '@stencil/core/testing';
import { describeAxe } from '../../test/axe';
import { CHANNEL_LINKS, groupedFooter, siteHeader } from '../../test/chrome';
import { newScPage, setPageContext } from '../../test/page';

/** A channel home in miniature: skip link, announcement, header, content, network, footer, utility bar. */
const HOME = (lang = 'en') => `
  <sc-page channel="now">
    <div slot="header">
      <sc-skip-link></sc-skip-link>
      <sc-announcement-bar>Planned maintenance on Saturday 25 October.</sc-announcement-bar>
      ${siteHeader(lang)}
    </div>
    <div style="padding: 24px">
      <h1>What do you need to do?</h1>
      <p><a id="first" href="#renew">Renew vehicle registration</a></p>
      <sc-channel-network links='${CHANNEL_LINKS}'></sc-channel-network>
    </div>
    <div slot="footer">
      ${groupedFooter(lang)}
      <sc-utility-bar happiness-href="#happiness" contact-href="tel:04" chat-href="#chat" accessibility-href="#accessibility"></sc-utility-bar>
    </div>
  </sc-page>`;

describe('sc-page (e2e)', () => {
  it('renders in light DOM: header, main and footer in order, with one banner, main and contentinfo', async () => {
    const page = await newScPage(HOME());
    await page.setViewport({ width: 1440, height: 900 });
    const order = await page.evaluate(() => {
      const el = document.querySelector('sc-page')!;
      return [el.shadowRoot === null, Array.from(el.querySelectorAll('[slot="header"], main, [slot="footer"]')).map((n) => n.localName)];
    });
    expect(order).toEqual([true, ['div', 'main', 'div']]);
    const tree = await page.accessibility.snapshot({ interestingOnly: true });
    const roles: string[] = [];
    const walk = (n: { role?: string; children?: unknown[] }) => {
      if (n.role) roles.push(n.role);
      (n.children as typeof n[] | undefined)?.forEach(walk);
    };
    walk(tree as never);
    expect(roles.filter((r) => r === 'banner').length).toBe(1);
    expect(roles.filter((r) => r === 'main').length).toBe(1);
    expect(roles.filter((r) => r === 'contentinfo').length).toBe(1);
  });

  it('the skip link (default href) moves focus to main, and the next Tab continues inside it', async () => {
    const page = await newScPage(HOME());
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement!.localName)).toBe('sc-skip-link');
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(await page.evaluate(() => document.activeElement!.id)).toBe('main-content');
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement!.id)).toBe('first');
  });

  it('sets dir from lang, and follows lang changes on itself', async () => {
    const page = await newScPage(HOME());
    const attrs = () => page.evaluate(() => ['lang', 'dir', 'data-channel'].map((a) => document.querySelector('sc-page')!.getAttribute(a)));
    expect(await attrs()).toEqual([null, 'ltr', 'now']);
    await page.evaluate(() => document.querySelector('sc-page')!.setAttribute('lang', 'ar'));
    await page.waitForChanges();
    expect(await attrs()).toEqual(['ar', 'rtl', 'now']);
    // Components inside take the page's language.
    const label = await page.evaluate(() => document.querySelector('sc-footer')!.shadowRoot!.querySelector('#g-channels')!.textContent);
    expect(label).toBe('القنوات');
  });

  it('themes everything inside by channel', async () => {
    const page = await newScPage(HOME());
    const action = () => page.evaluate(() => getComputedStyle(document.querySelector('main')!).getPropertyValue('--sc-color-channel-action').trim());
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

  it('reserves the docked utility bar: the end of the page and focused elements stay clear of it (CHR-05)', async () => {
    const page = await newScPage(`
      <sc-page channel="now">
        <div style="block-size: 2000px"></div>
        <p><a id="last" href="#last">Last link</a></p>
        <div style="block-size: 400px"></div>
        <sc-utility-bar slot="footer" happiness-href="#h" contact-href="tel:04" chat-href="#c" accessibility-href="#a"></sc-utility-bar>
      </sc-page>`);
    await page.setViewport({ width: 1280, height: 700 });
    await page.waitForFunction(() => document.documentElement.style.getPropertyValue('--sc-utility-bar-block-size') !== '');
    const bar = await page.evaluate(() => Math.ceil(document.querySelector('sc-utility-bar')!.shadowRoot!.querySelector('nav')!.getBoundingClientRect().height));
    expect(bar).toBeGreaterThanOrEqual(44);
    const reserved = await page.evaluate(() => getComputedStyle(document.querySelector('sc-page')!).paddingBlockEnd);
    expect(reserved).toBe(`${bar}px`);
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollPaddingBottom)).toBe(`${bar}px`);
    // Focus the last link from far above: it lands above the bar, not under it.
    await page.evaluate(() => document.getElementById('last')!.focus());
    await page.waitForChanges();
    const linkBottom = await page.evaluate(() => document.getElementById('last')!.getBoundingClientRect().bottom);
    const barTop = await page.evaluate(() => document.querySelector('sc-utility-bar')!.shadowRoot!.querySelector('nav')!.getBoundingClientRect().top);
    expect(linkBottom).toBeLessThanOrEqual(barTop);
    // Below 1024px the bar is in the flow and nothing is reserved.
    await page.setViewport({ width: 600, height: 700 });
    await page.waitForFunction(() => document.documentElement.style.getPropertyValue('--sc-utility-bar-block-size') === '');
    expect(await page.evaluate(() => getComputedStyle(document.querySelector('sc-page')!).paddingBlockEnd)).toBe('0px');
  });

  describe('sticky header (WCAG 2.4.11)', () => {
    const STICKY = (tag: string) => `
      <sc-page channel="now" sync-document>
        <div slot="header">${tag === 'sc-app-bar' ? '<sc-app-bar sticky></sc-app-bar>' : siteHeader('en', { attrs: 'sticky' })}</div>
        <div style="block-size: 1500px"></div>
        <a id="renew" href="#renew">Renew vehicle registration</a>
        <div style="block-size: 1500px"></div>
      </sc-page>`;

    const padding = (page: E2EPage) => page.evaluate(() => getComputedStyle(document.documentElement).scrollPaddingTop);
    const waitForPadding = (page: E2EPage) => page.waitForFunction(() => document.documentElement.style.scrollPaddingBlockStart !== '');

    it.each(['sc-app-bar', 'sc-site-header'])('pads the document scroll by the %s height plus 8px, and scrolls focus clear of it', async (tag) => {
      const page = await newScPage(STICKY(tag));
      await page.setViewport({ width: 1280, height: 600 });
      await waitForPadding(page);
      // The padding is first set for the header at the 800px default viewport; wait until the
      // ResizeObserver has caught up with the header at 1280px.
      await page.waitForFunction(
        (t: string) => getComputedStyle(document.documentElement).scrollPaddingTop === `${Math.ceil(document.querySelector(t)!.getBoundingClientRect().height) + 8}px`,
        { timeout: 5000 },
        tag,
      );
      const height = await page.evaluate((t: string) => Math.ceil(document.querySelector(t)!.getBoundingClientRect().height), tag);
      expect(height).toBeGreaterThan(0);
      expect(await padding(page)).toBe(`${height + 8}px`);
      await page.evaluate(() => {
        const link = document.getElementById('renew')!;
        window.scrollTo(0, link.getBoundingClientRect().top + window.scrollY - 2);
      });
      await page.evaluate(() => document.getElementById('renew')!.focus());
      await page.waitForChanges();
      const top = await page.evaluate(() => document.getElementById('renew')!.getBoundingClientRect().top);
      const barBottom = await page.evaluate((t: string) => document.querySelector(t)!.getBoundingClientRect().bottom, tag);
      expect(top).toBeGreaterThanOrEqual(barBottom);
    });

    it('stops padding when the header is not sticky, and restores <html> when the page is removed', async () => {
      const page = await newScPage(STICKY('sc-app-bar'));
      await waitForPadding(page);
      await page.evaluate(() => document.querySelector('sc-app-bar')!.removeAttribute('sticky'));
      await page.waitForChanges();
      expect(await page.evaluate(() => document.documentElement.style.scrollPaddingBlockStart)).toBe('');
      await page.evaluate(() => document.querySelector('sc-app-bar')!.setAttribute('sticky', ''));
      await waitForPadding(page);
      await page.evaluate(() => document.querySelector('sc-page')!.remove());
      await page.waitForChanges();
      expect(await page.evaluate(() => document.documentElement.style.scrollPaddingBlockStart)).toBe('');
    });
  });

  it('re-renders the chrome strings when the page language changes', async () => {
    const page = await newScPage(HOME(), { lang: 'ar' });
    const heading = () => page.evaluate(() => document.querySelector('sc-footer')!.shadowRoot!.querySelector('#g-helpful')!.textContent);
    expect(await heading()).toBe('معلومات مفيدة');
    await setPageContext(page, { lang: 'en' });
    expect(await heading()).toBe('Helpful information');
  });
});

describeAxe('sc-page', HOME());
