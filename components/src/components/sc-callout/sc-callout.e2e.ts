import { E2EPage } from '@stencil/core/testing';
import { expectNoAxeViolations } from '../../test/axe';
import { contexts, newScPage, setPageContext } from '../../test/page';

function inner(page: E2EPage, selector: string, read: string) {
  return page.evaluate(
    (sel: string, expr: string) => {
      const host = document.querySelector(sel)!;
      const box = host.shadowRoot!.querySelector('[part="container"]') as HTMLElement;
      // eslint-disable-next-line no-new-func
      return new Function('host', 'box', `return (${expr});`)(host, box);
    },
    selector,
    read,
  );
}

const ALL = `
  <main>
    <h1>Pay for your vehicle registration</h1>
    <sc-callout id="i" tone="info">You'll need your plate number and Emirates ID number.</sc-callout>
    <sc-callout id="s" tone="success" heading="Registration renewed">Your vehicle registration is valid until 18 October 2027.</sc-callout>
    <sc-callout id="w" tone="warning">If your payment is interrupted, don't pay again. Check the payment status in My tasks first.</sc-callout>
    <sc-callout id="e" tone="error" heading="Payment failed" heading-level="2">No money has been taken. <a href="#retry">Try again</a>.</sc-callout>
  </main>`;

/** Emulates Windows High Contrast. Puppeteer's emulateMediaFeatures rejects forced-colors, so use CDP. */
async function forceColors(page: E2EPage) {
  const client = await (page as unknown as { createCDPSession(): Promise<{ send(m: string, p: object): Promise<unknown> }> }).createCDPSession();
  await client.send('Emulation.setEmulatedMedia', { features: [{ name: 'forced-colors', value: 'active' }] });
}

describe('sc-callout (e2e)', () => {
  it('gives each tone its own fill', async () => {
    const page = await newScPage(ALL);
    const fills = new Set<string>();
    for (const id of ['i', 's', 'w', 'e']) fills.add(await inner(page, `#${id}`, 'getComputedStyle(box).backgroundColor'));
    expect(fills.size).toBe(4);
  });

  it('exposes the tone in words: the accessible text starts with the tone word', async () => {
    const page = await newScPage(ALL);
    const text = (id: string) => inner(page, `#${id}`, 'host.innerText.replace(/\\s+/g, " ").trim()');
    expect(await inner(page, '#w', 'box.querySelector(".visually-hidden").textContent.trim()')).toBe('Warning:');
    expect(await inner(page, '#s', 'box.querySelector("[part=heading]").textContent')).toBe('Success: Registration renewed');
    expect(await text('w')).toContain("If your payment is interrupted, don't pay again.");
  });

  it('keeps slotted links in the tab order', async () => {
    const page = await newScPage(ALL);
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement!.getAttribute('href'))).toBe('#retry');
  });

  it('puts the icon at the start: on the right in Arabic, and re-renders the tone word', async () => {
    const page = await newScPage(ALL, { lang: 'en' });
    const iconLeft = () => inner(page, '#w', 'box.querySelector("[part=icon]").getBoundingClientRect().left < box.querySelector("[part=content]").getBoundingClientRect().left');
    expect(await iconLeft()).toBe(true);
    await setPageContext(page, { lang: 'ar' });
    expect(await iconLeft()).toBe(false);
    expect(await inner(page, '#w', 'box.querySelector(".visually-hidden").textContent.trim()')).toBe('تنبيه:');
  });

  it('switches to the Arabic type scale', async () => {
    const page = await newScPage(`<sc-callout id="en">Text</sc-callout><sc-callout id="ar" lang="ar">نص</sc-callout>`);
    expect(await inner(page, '#en', 'getComputedStyle(box.querySelector("[part=content]")).fontSize')).toBe('17px');
    expect(await inner(page, '#ar', 'getComputedStyle(box.querySelector("[part=content]")).fontSize')).toBe('19px');
  });

  it('keeps a visible border in forced colours', async () => {
    const page = await newScPage(ALL);
    await forceColors(page);
    const border = await inner(page, '#w', 'getComputedStyle(box).borderTopColor');
    const canvas = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(border).not.toBe(canvas);
    expect(border).not.toBe('rgba(0, 0, 0, 0)');
  });

  for (const ctx of contexts) {
    it(`has no axe violations (${ctx.lang}, ${ctx.theme})`, async () => {
      const page = await newScPage(ALL, ctx);
      await expectNoAxeViolations(page);
    });
  }

  it('has no axe violations on every channel', async () => {
    const page = await newScPage(ALL);
    for (const channel of ['now', 'transport', 'visit', 'justice', 'build', 'invest', 'trade'] as const) {
      await setPageContext(page, { channel, theme: 'dark' });
      await expectNoAxeViolations(page);
    }
  });
});
