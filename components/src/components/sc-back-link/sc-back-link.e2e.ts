import { E2EPage } from '@stencil/core/testing';
import { expectNoAxeViolations } from '../../test/axe';
import { contexts, newScPage, setPageContext } from '../../test/page';

function inner(page: E2EPage, selector: string, read: string) {
  return page.evaluate(
    (sel: string, expr: string) => {
      const host = document.querySelector(sel)!;
      const control = host.shadowRoot!.querySelector('[part="control"]') as HTMLElement;
      // eslint-disable-next-line no-new-func
      return new Function('host', 'control', `return (${expr});`)(host, control);
    },
    selector,
    read,
  );
}

const ALL_STATES = `
  <main style="padding: 16px">
    <h1>What is your plate number?</h1>
    <sc-back-link href="#previous"></sc-back-link>
    <sc-back-link id="btn"></sc-back-link>
    <sc-back-link appearance="plain" href="#previous"></sc-back-link>
    <sc-back-link href="#vehicles">Back to my vehicles</sc-back-link>
  </main>`;

describe('sc-back-link (e2e)', () => {
  it('is a 44px glass pill', async () => {
    const page = await newScPage(`<sc-back-link href="#p"></sc-back-link>`);
    expect(Math.round(await inner(page, 'sc-back-link', 'control.getBoundingClientRect().height'))).toBe(44);
    expect(await inner(page, 'sc-back-link', 'getComputedStyle(control).borderTopLeftRadius')).toBe('22px');
    expect(await inner(page, 'sc-back-link', 'getComputedStyle(control).backdropFilter')).toContain('blur');
  });

  it('follows its href with Enter', async () => {
    const page = await newScPage(`<sc-back-link href="#previous"></sc-back-link>`);
    await page.keyboard.press('Tab');
    expect(await inner(page, 'sc-back-link', 'host.shadowRoot.activeElement === control')).toBe(true);
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(await page.evaluate(() => location.hash)).toBe('#previous');
  });

  it('is a button without href: Enter and Space fire click', async () => {
    const page = await newScPage(`<sc-back-link></sc-back-link>`);
    await page.evaluate(() => {
      (window as unknown as { clicks: number }).clicks = 0;
      document.querySelector('sc-back-link')!.addEventListener('click', () => (window as unknown as { clicks: number }).clicks++);
    });
    expect(await inner(page, 'sc-back-link', 'control.tagName')).toBe('BUTTON');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Space');
    await page.waitForChanges();
    expect(await page.evaluate(() => (window as unknown as { clicks: number }).clicks)).toBe(2);
  });

  it('is named "Back" / "رجوع" and re-renders when lang changes', async () => {
    const page = await newScPage(`<sc-back-link></sc-back-link>`);
    const name = async () => (await page.accessibility.snapshot({ root: (await page.$('sc-back-link >>> button'))! }))!.name;
    expect(await name()).toBe('Back');
    await setPageContext(page, { lang: 'ar' });
    expect(await name()).toBe('رجوع');
  });

  it('mirrors the chevron in RTL and keeps it at the start', async () => {
    const page = await newScPage(`<sc-back-link></sc-back-link>`);
    expect(await inner(page, 'sc-back-link', 'getComputedStyle(control.querySelector("svg")).transform')).toBe('none');
    await setPageContext(page, { lang: 'ar' });
    expect(await inner(page, 'sc-back-link', 'getComputedStyle(control.querySelector("svg")).transform')).toBe('matrix(-1, 0, 0, 1, 0, 0)');
    const chevronRight = await inner(page, 'sc-back-link', 'control.querySelector("svg").getBoundingClientRect().left > control.querySelector(".label").getBoundingClientRect().left');
    expect(chevronRight).toBe(true);
  });

  it('uses a solid surface under prefers-reduced-transparency', async () => {
    const page = await newScPage(`<sc-back-link></sc-back-link>`);
    // Puppeteer's emulateMediaFeatures rejects this feature name; the DevTools protocol accepts it.
    const cdp = await (page as unknown as import('puppeteer').Page).createCDPSession();
    await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-transparency', value: 'reduce' }] });
    expect(await page.evaluate(() => matchMedia('(prefers-reduced-transparency: reduce)').matches)).toBe(true);
    expect(await inner(page, 'sc-back-link', 'getComputedStyle(control).backdropFilter')).toBe('none');
  });

  for (const ctx of contexts) {
    it(`has no axe violations (${ctx.lang}, ${ctx.theme})`, async () => {
      const page = await newScPage(ALL_STATES, ctx);
      await expectNoAxeViolations(page);
    });
  }

  it('has no axe violations on every channel', async () => {
    const page = await newScPage(ALL_STATES);
    await page.keyboard.press('Tab');
    for (const channel of ['now', 'transport', 'visit', 'justice', 'build', 'invest', 'trade'] as const) {
      await setPageContext(page, { channel, theme: 'dark' });
      await expectNoAxeViolations(page);
    }
  });
});
