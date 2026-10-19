import { expectNoAxeViolations } from '../../test/axe';
import { newScPage, setPageContext } from '../../test/page';

const MARKUP = `<main><sc-container id="page"><h1>Renew your vehicle registration</h1></sc-container><sc-container id="reading" width="reading"><p>Running text</p></sc-container></main>`;

const measure = (page: import('@stencil/core/testing').E2EPage, sel: string) =>
  page.evaluate((s: string) => {
    const host = document.querySelector(s)!;
    const inner = host.shadowRoot!.querySelector('.inner')!.getBoundingClientRect();
    return { left: Math.round(inner.left), right: Math.round(document.documentElement.clientWidth - inner.right), width: Math.round(inner.width) };
  }, sel);

describe('sc-container (e2e)', () => {
  it.each([
    [375, 20],
    [700, 32],
    [1200, 48],
    [1440, 80],
  ])('at %ipx wide uses a %ipx margin', async (width, margin) => {
    const page = await newScPage(MARKUP);
    await page.setViewport({ width, height: 800 });
    await page.waitForChanges();
    const m = await measure(page, '#page');
    expect(m.left).toBe(margin);
    expect(m.right).toBe(margin);
  });

  it('caps content at 1280px and centres it on very wide screens', async () => {
    const page = await newScPage(MARKUP);
    await page.setViewport({ width: 1920, height: 800 });
    await page.waitForChanges();
    const m = await measure(page, '#page');
    expect(m.width).toBe(1280);
    expect(m.left).toBe(m.right);
  });

  it('caps the reading width at 680px, aligned to the start (right in Arabic)', async () => {
    const page = await newScPage(MARKUP);
    await page.setViewport({ width: 1440, height: 800 });
    await page.waitForChanges();
    let m = await measure(page, '#reading');
    expect(m.width).toBe(680);
    expect(m.left).toBe(80);
    await setPageContext(page, { lang: 'ar' });
    m = await measure(page, '#reading');
    expect(m.right).toBe(80);
  });

  it('has no axe violations', async () => {
    const page = await newScPage(MARKUP);
    await expectNoAxeViolations(page);
  });
});
