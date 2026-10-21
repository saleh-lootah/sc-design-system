import { describeAxe } from '../../test/axe';
import { newScPage, setPageContext } from '../../test/page';

const MARKUP = `<main><sc-container id="page"><h1>Renew your vehicle registration</h1></sc-container><sc-container id="reading" width="reading"><p>Running text</p></sc-container></main>`;

/** The content box of a container (inside its padding), against the viewport edges. */
const measure = (page: import('@stencil/core/testing').E2EPage, sel: string) =>
  page.evaluate((s: string) => {
    const host = document.querySelector(s)!;
    const r = host.getBoundingClientRect();
    const cs = getComputedStyle(host);
    const left = r.left + parseFloat(cs.paddingLeft);
    const right = r.right - parseFloat(cs.paddingRight);
    return { left: Math.round(left), right: Math.round(document.documentElement.clientWidth - right), width: Math.round(right - left) };
  }, sel);

describe('sc-container (e2e, CSS only)', () => {
  it('is not a registered custom element and needs no hydration', async () => {
    const page = await newScPage(MARKUP);
    expect(await page.evaluate(() => [!!customElements.get('sc-container'), getComputedStyle(document.querySelector('#page')!).display])).toEqual([false, 'block']);
  });

  it.each([
    [375, 20],
    [700, 32],
    [1200, 48],
    [1440, 80],
  ])('at %ipx wide uses a %ipx margin', async (width, margin) => {
    const page = await newScPage(MARKUP);
    await page.setViewport({ width, height: 800 });
    const m = await measure(page, '#page');
    expect(m.left).toBe(margin);
    expect(m.right).toBe(margin);
  });

  it('caps content at 1280px and centres it on very wide screens', async () => {
    const page = await newScPage(MARKUP);
    await page.setViewport({ width: 1920, height: 800 });
    const m = await measure(page, '#page');
    expect(m.width).toBe(1280);
    expect(m.left).toBe(m.right);
  });

  it('caps the reading width at 680px, aligned to the start (right in Arabic)', async () => {
    const page = await newScPage(MARKUP);
    await page.setViewport({ width: 1440, height: 800 });
    let m = await measure(page, '#reading');
    expect(m.width).toBe(680);
    expect(m.left).toBe(80);
    await page.setViewport({ width: 1920, height: 800 });
    const pageCol = await measure(page, '#page');
    m = await measure(page, '#reading');
    expect(m.left).toBe(pageCol.left);
    await page.setViewport({ width: 1440, height: 800 });
    await setPageContext(page, { lang: 'ar' });
    m = await measure(page, '#reading');
    expect(m.right).toBe(80);
    expect(m.width).toBe(680);
  });

  it('keeps the margins on a phone in reading width', async () => {
    const page = await newScPage(MARKUP);
    await page.setViewport({ width: 375, height: 800 });
    const m = await measure(page, '#reading');
    expect([m.left, m.right]).toEqual([20, 20]);
  });
});

describeAxe('sc-container', MARKUP);
