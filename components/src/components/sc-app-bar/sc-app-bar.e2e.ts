import { E2EPage } from '@stencil/core/testing';
import { expectNoAxeViolations } from '../../test/axe';
import { contexts, newScPage, setPageContext } from '../../test/page';

function bar(page: E2EPage, selector: string, read: string) {
  return page.evaluate(
    (sel: string, expr: string) => {
      const host = document.querySelector(sel)!;
      const b = host.shadowRoot!.querySelector('[part="bar"]') as HTMLElement;
      // eslint-disable-next-line no-new-func
      return new Function('host', 'bar', `return (${expr});`)(host, b);
    },
    selector,
    read,
  );
}

const MOBILE = `
  <sc-app-bar id="m" sticky>
    <sc-back-link slot="start" href="#previous"></sc-back-link>
    <span slot="title">Dubai Transport</span>
    <sc-language-switch slot="end" href="#ar"></sc-language-switch>
  </sc-app-bar>
  <main><h1>What is your plate number?</h1><div style="block-size: 2000px"></div></main>`;

const DESKTOP = `
  <sc-app-bar id="d" align="start" shape="floating">
    <span slot="title">Dubai Now</span>
    <nav aria-label="Main"><a href="#services">Services</a> <a href="#tasks">My tasks</a></nav>
    <sc-language-switch slot="end" appearance="plain" href="#ar"></sc-language-switch>
    <sc-button slot="end" size="m" href="#signin">Sign in with UAE PASS</sc-button>
  </sc-app-bar>
  <main><h1>What do you need to do?</h1></main>`;

describe('sc-app-bar (e2e)', () => {
  it('is a glass banner with a centred bold title', async () => {
    const page = await newScPage(MOBILE, { lang: 'en' });
    expect(await page.evaluate(() => document.querySelector('sc-app-bar')!.getAttribute('role'))).toBe('banner');
    expect(await bar(page, '#m', 'getComputedStyle(bar).backdropFilter')).toContain('blur');
    expect(await bar(page, '#m', 'getComputedStyle(bar).boxShadow')).not.toBe('none');
    expect(await bar(page, '#m', 'getComputedStyle(host.shadowRoot.querySelector(".title")).fontWeight')).toBe('700');
    const centred = await bar(
      page,
      '#m',
      `(() => { const t = host.querySelector('[slot=title]').getBoundingClientRect(); const b = bar.getBoundingClientRect(); return Math.abs((t.left + t.width / 2) - (b.left + b.width / 2)); })()`,
    );
    expect(centred).toBeLessThan(2);
  });

  it('puts the back link at the start and the language switch at the end, mirrored in Arabic', async () => {
    const page = await newScPage(MOBILE, { lang: 'en' });
    const order = () => page.evaluate(() => document.querySelector('sc-back-link')!.getBoundingClientRect().left < document.querySelector('sc-language-switch')!.getBoundingClientRect().left);
    expect(await order()).toBe(true);
    await setPageContext(page, { lang: 'ar' });
    expect(await order()).toBe(false);
  });

  it('keeps 44px controls and follows the tab order start, end', async () => {
    const page = await newScPage(MOBILE);
    expect(await page.evaluate(() => Math.round(document.querySelector('sc-back-link')!.getBoundingClientRect().height))).toBe(44);
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement!.localName)).toBe('sc-back-link');
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement!.localName)).toBe('sc-language-switch');
  });

  it('sticks to the top when sticky', async () => {
    const page = await newScPage(MOBILE);
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForChanges();
    expect(await page.evaluate(() => Math.round(document.querySelector('sc-app-bar')!.getBoundingClientRect().top))).toBe(0);
  });

  it('lays out the desktop header with the title at the start and the end controls at the end', async () => {
    await (async () => {
      const page = await newScPage(DESKTOP);
      await page.setViewport({ width: 1280, height: 800 });
      await page.waitForChanges();
      const r = await page.evaluate(() => {
        const host = document.querySelector('sc-app-bar')!;
        const b = host.shadowRoot!.querySelector('[part="bar"]')!.getBoundingClientRect();
        const title = host.querySelector('[slot=title]')!.getBoundingClientRect();
        const sign = host.querySelector('sc-button')!.getBoundingClientRect();
        return { titleGap: title.left - b.left, endGap: b.right - sign.right, radius: getComputedStyle(host.shadowRoot!.querySelector('[part="bar"]')!).borderTopLeftRadius };
      });
      expect(r.titleGap).toBeLessThan(40);
      expect(r.endGap).toBeLessThan(20);
      expect(r.radius).toBe('999px');
    })();
  });

  it('falls back to a solid surface under prefers-reduced-transparency', async () => {
    const page = await newScPage(MOBILE);
    // Puppeteer's emulateMediaFeatures rejects this feature name; the DevTools protocol accepts it.
    const cdp = await (page as unknown as import('puppeteer').Page).createCDPSession();
    await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-transparency', value: 'reduce' }] });
    expect(await page.evaluate(() => matchMedia('(prefers-reduced-transparency: reduce)').matches)).toBe(true);
    expect(await bar(page, '#m', 'getComputedStyle(bar).backdropFilter')).toBe('none');
    const surface = await page.evaluate(() => {
      const probe = document.createElement('span');
      probe.style.color = 'var(--sc-color-surface)';
      document.body.append(probe);
      return getComputedStyle(probe).color;
    });
    expect(await bar(page, '#m', 'getComputedStyle(bar).backgroundColor')).toBe(surface);
  });

  for (const ctx of contexts) {
    it(`has no axe violations (${ctx.lang}, ${ctx.theme})`, async () => {
      const mobile = await newScPage(MOBILE, ctx);
      await expectNoAxeViolations(mobile);
      const desktop = await newScPage(DESKTOP, ctx);
      await expectNoAxeViolations(desktop);
    });
  }

  it('has no axe violations on every channel', async () => {
    const page = await newScPage(DESKTOP);
    for (const channel of ['now', 'transport', 'visit', 'justice', 'build', 'invest', 'trade'] as const) {
      await setPageContext(page, { channel, theme: 'dark' });
      await expectNoAxeViolations(page);
    }
  });
});
