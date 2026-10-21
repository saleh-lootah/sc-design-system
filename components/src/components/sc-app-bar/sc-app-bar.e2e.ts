import { E2EPage } from '@stencil/core/testing';
import { describeAxe } from '../../test/axe';
import { newScPage, setPageContext } from '../../test/page';

const BAR = `<sc-app-bar><sc-back-link slot="start" href="#vehicle"></sc-back-link><sc-language-switch slot="end" href="#ar"></sc-language-switch></sc-app-bar>`;

function inRoot<T = unknown>(page: E2EPage, expr: string): Promise<T> {
  return page.evaluate((e: string) => {
    const root = document.querySelector('sc-app-bar')!.shadowRoot!;
    // eslint-disable-next-line no-new-func
    return new Function('root', `return (${e});`)(root);
  }, expr) as Promise<T>;
}

const token = (page: E2EPage, name: string) =>
  page.evaluate((n: string) => {
    const i = document.createElement('i');
    i.style.color = `var(${n})`;
    document.body.append(i);
    return getComputedStyle(i).color;
  }, name);

describe('sc-app-bar (e2e)', () => {
  it('is a flat 60px bar with a 4px channel rule on top and a 1px rule beneath (A4)', async () => {
    const page = await newScPage(BAR);
    await page.setViewport({ width: 390, height: 800 });
    const s = await inRoot<string[]>(page, '(() => { const b = root.querySelector(".bar"); const s = getComputedStyle(b); return [String(Math.round(b.getBoundingClientRect().height)), s.borderTopWidth, s.borderTopColor, s.borderBottomWidth, s.borderBottomColor, s.boxShadow, s.backdropFilter]; })()');
    expect(s).toEqual(['65', '4px', await token(page, '--sc-color-channel-action'), '1px', await token(page, '--sc-color-outline-variant'), 'none', 'none']);
    const title = await inRoot<string[]>(page, '(() => { const s = getComputedStyle(root.querySelector(".title")); return [s.fontWeight, root.querySelector("slot[name=title]").textContent]; })()');
    expect(title).toEqual(['700', 'Dubai Now']);
  });

  it('keeps the title centred with fixed 96px side slots, and puts back at the start in both directions', async () => {
    const page = await newScPage(BAR);
    await page.setViewport({ width: 390, height: 800 });
    const centre = await inRoot<number>(page, '(() => { const r = root.querySelector(".title").getBoundingClientRect(); return Math.round(r.left + r.width / 2); })()');
    expect(Math.abs(centre - 195)).toBeLessThanOrEqual(1);
    expect(await inRoot(page, 'Math.round(root.querySelector(".start").getBoundingClientRect().width)')).toBe(96);
    const order = () => page.evaluate(() => [document.querySelector('sc-back-link')!.getBoundingClientRect().left, document.querySelector('sc-language-switch')!.getBoundingClientRect().left]);
    const [b, l] = await order();
    expect(b).toBeLessThan(l);
    await setPageContext(page, { lang: 'ar' });
    const [b2, l2] = await order();
    expect(b2).toBeGreaterThan(l2);
    expect(await inRoot(page, 'root.querySelector("slot[name=title]").textContent')).toBe('دبي الآن');
  });

  it('sticks to the top when sticky', async () => {
    const page = await newScPage(`<sc-app-bar sticky></sc-app-bar><div style="block-size: 3000px"></div>`);
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForChanges();
    expect(await page.evaluate(() => Math.round(document.querySelector('sc-app-bar')!.getBoundingClientRect().top))).toBe(0);
  });
});

describeAxe('sc-app-bar', BAR);
