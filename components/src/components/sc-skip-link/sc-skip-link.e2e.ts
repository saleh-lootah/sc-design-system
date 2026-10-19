import { E2EPage } from '@stencil/core/testing';
import { expectNoAxeViolations } from '../../test/axe';
import { contexts, newScPage, setPageContext } from '../../test/page';

function inner(page: E2EPage, read: string) {
  return page.evaluate((expr: string) => {
    const host = document.querySelector('sc-skip-link')!;
    const control = host.shadowRoot!.querySelector('[part="control"]') as HTMLElement;
    // eslint-disable-next-line no-new-func
    return new Function('host', 'control', `return (${expr});`)(host, control);
  }, read);
}

const PAGE = `
  <sc-skip-link></sc-skip-link>
  <header style="padding-block: 72px 16px"><a href="#home">Dubai Now</a></header>
  <main id="main-content"><h1>Renew your vehicle registration</h1><a href="#start">Start now</a></main>`;

describe('sc-skip-link (e2e)', () => {
  it('is hidden until focused, then visible as a 44px pill', async () => {
    const page = await newScPage(PAGE);
    expect(await inner(page, 'control.getBoundingClientRect().width')).toBeLessThanOrEqual(1);
    await page.keyboard.press('Tab');
    expect(await inner(page, 'host.shadowRoot.activeElement === control')).toBe(true);
    expect(await inner(page, 'control.getBoundingClientRect().width')).toBeGreaterThan(100);
    expect(Math.round(await inner(page, 'control.getBoundingClientRect().height'))).toBeGreaterThanOrEqual(44);
  });

  it('moves focus to the main content with Enter, so the next Tab continues from there', async () => {
    const page = await newScPage(PAGE);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(await page.evaluate(() => document.activeElement!.id)).toBe('main-content');
    expect(await page.evaluate(() => location.hash)).toBe('#main-content');
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement!.getAttribute('href'))).toBe('#start');
    expect(await page.evaluate(() => document.getElementById('main-content')!.hasAttribute('tabindex'))).toBe(false);
  });

  it('starts at the inline start and re-renders in Arabic', async () => {
    const page = await newScPage(PAGE);
    expect(await inner(page, 'control.textContent')).toBe('Skip to main content');
    await setPageContext(page, { lang: 'ar' });
    expect(await inner(page, 'control.textContent')).toBe('الانتقال إلى المحتوى الرئيسي');
    await page.keyboard.press('Tab');
    const right = await inner(page, 'window.innerWidth - control.getBoundingClientRect().right');
    expect(right).toBeLessThan(20);
  });

  for (const ctx of contexts) {
    it(`has no axe violations, focused (${ctx.lang}, ${ctx.theme})`, async () => {
      const page = await newScPage(PAGE, ctx);
      await page.keyboard.press('Tab');
      await expectNoAxeViolations(page);
    });
  }
});
