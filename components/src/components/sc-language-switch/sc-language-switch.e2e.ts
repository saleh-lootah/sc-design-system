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
    <h1>Renew your vehicle registration</h1>
    <sc-language-switch href="#other"></sc-language-switch>
    <sc-language-switch id="btn"></sc-language-switch>
    <sc-language-switch appearance="plain" href="#other"></sc-language-switch>
  </main>`;

describe('sc-language-switch (e2e)', () => {
  it('names the other language in its own language, with lang and hreflang', async () => {
    const page = await newScPage(`<sc-language-switch href="/ar/renew"></sc-language-switch>`, { lang: 'en' });
    expect(await inner(page, 'sc-language-switch', 'control.textContent')).toBe('العربية');
    expect(await inner(page, 'sc-language-switch', 'control.lang')).toBe('ar');
    expect(await inner(page, 'sc-language-switch', 'control.hreflang')).toBe('ar');
    expect(await inner(page, 'sc-language-switch', 'getComputedStyle(control.querySelector(".label")).fontFamily')).toContain('Dubai W23 Bold');

    await setPageContext(page, { lang: 'ar' });
    expect(await inner(page, 'sc-language-switch', 'control.textContent')).toBe('English');
    expect(await inner(page, 'sc-language-switch', 'control.lang')).toBe('en');
    expect(await inner(page, 'sc-language-switch', 'control.hreflang')).toBe('en');
    expect(await inner(page, 'sc-language-switch', 'getComputedStyle(control.querySelector(".label")).fontFamily')).toContain('Dubai W23 Medium');
  });

  it('is a 44px target and follows its link with Enter', async () => {
    const page = await newScPage(`<sc-language-switch href="#ar"></sc-language-switch>`);
    expect(Math.round(await inner(page, 'sc-language-switch', 'control.getBoundingClientRect().height'))).toBe(44);
    await page.keyboard.press('Tab');
    expect(await inner(page, 'sc-language-switch', 'host.shadowRoot.activeElement === control')).toBe(true);
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(await page.evaluate(() => location.hash)).toBe('#ar');
  });

  it('fires scSwitch from the keyboard, and preventDefault stops navigation', async () => {
    const page = await newScPage(`<sc-language-switch href="#ar"></sc-language-switch>`);
    const spy = await page.spyOnEvent('scSwitch');
    await page.evaluate(() => document.addEventListener('scSwitch', (e) => e.preventDefault()));
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(spy).toHaveReceivedEventDetail({ lang: 'ar' });
    expect(await page.evaluate(() => location.hash)).toBe('');
  });

  it('works as a button with Space', async () => {
    const page = await newScPage(`<sc-language-switch></sc-language-switch>`, { lang: 'ar' });
    const spy = await page.spyOnEvent('scSwitch');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await page.waitForChanges();
    expect(spy).toHaveReceivedEventDetail({ lang: 'en' });
  });

  for (const ctx of contexts) {
    it(`has no axe violations (${ctx.lang}, ${ctx.theme})`, async () => {
      const page = await newScPage(ALL_STATES, ctx);
      await expectNoAxeViolations(page);
    });
  }

  it('has no axe violations with focus on every channel', async () => {
    const page = await newScPage(ALL_STATES);
    await page.keyboard.press('Tab');
    for (const channel of ['now', 'transport', 'visit', 'justice', 'build', 'invest', 'trade'] as const) {
      await setPageContext(page, { channel, theme: 'light' });
      await expectNoAxeViolations(page);
    }
  });
});
