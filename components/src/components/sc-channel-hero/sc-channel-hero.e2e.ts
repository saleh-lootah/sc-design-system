import { expectNoAxeViolations } from '../../test/axe';
import { contexts, newScPage, setPageContext } from '../../test/page';

const MARKUP = `
  <sc-channel-hero>
    <p slot="eyebrow">Government services for everyone who lives in Dubai</p>
    <h1 slot="heading">What do you need to do?</h1>
    <p slot="lede">Renew registration, pay fines and get parking permits, in one place.</p>
    <sc-search label-hidden label="Search services"></sc-search>
  </sc-channel-hero>
  <main><h2>Most used services</h2></main>`;

const wash = (page: import('@stencil/core/testing').E2EPage) =>
  page.evaluate(() => getComputedStyle(document.querySelector('sc-channel-hero')!.shadowRoot!.querySelector('.wash')!).backgroundImage);

describe('sc-channel-hero (e2e)', () => {
  it('has no axe violations in English and Arabic, light and dark', async () => {
    const page = await newScPage(MARKUP);
    for (const ctx of contexts) {
      await setPageContext(page, ctx);
      await expectNoAxeViolations(page);
    }
  });

  it('paints an OKLAB gradient that follows the channel', async () => {
    const page = await newScPage(MARKUP, { channel: 'now' });
    const now = await wash(page);
    // OKLAB is the default interpolation space, so Chromium serialises "in oklab" away.
    expect(now).toMatch(/^linear-gradient\((in oklab, )?oklab\(/);
    await setPageContext(page, { channel: 'transport' });
    expect(await wash(page)).not.toBe(now);
  });

  it('keeps the h1 a real heading and gives it the hero type', async () => {
    const page = await newScPage(MARKUP);
    const h1 = await page.evaluate(() => {
      const cs = getComputedStyle(document.querySelector('h1')!);
      return [cs.marginTop, cs.fontSize];
    });
    expect(h1[0]).toBe('0px');
    expect(parseFloat(h1[1])).toBeGreaterThanOrEqual(34);
    const snapshot = (await page.accessibility.snapshot()) as { children?: { role: string; name: string; level?: number }[] };
    expect(snapshot.children!.find((n) => n.role === 'heading' && n.level === 1)!.name).toBe('What do you need to do?');
  });

  it('lines up with the container and aligns to the right in Arabic', async () => {
    const page = await newScPage(MARKUP, { lang: 'ar' });
    const box = await page.evaluate(() => {
      const r = document.querySelector('h1')!.getBoundingClientRect();
      return { right: r.right, width: document.documentElement.clientWidth };
    });
    // 20/32/48/80px container margin at the end (right) side.
    expect([20, 32, 48, 80]).toContain(Math.round(box.width - box.right));
  });

  it('hides empty slot wrappers', async () => {
    const page = await newScPage(`<sc-channel-hero><h1 slot="heading">Dubai Transport</h1></sc-channel-hero>`);
    const hidden = await page.evaluate(() =>
      ['.eyebrow', '.lede', '.search'].map((s) => getComputedStyle(document.querySelector('sc-channel-hero')!.shadowRoot!.querySelector(s)!).display),
    );
    expect(hidden).toEqual(['none', 'none', 'none']);
  });
});
