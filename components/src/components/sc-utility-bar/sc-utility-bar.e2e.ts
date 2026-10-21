import { E2EPage } from '@stencil/core/testing';
import { describeAxe } from '../../test/axe';
import { newScPage } from '../../test/page';

const BAR = `<p><a href="#top">Top</a></p><sc-utility-bar happiness-href="#happiness" contact-href="tel:04" chat-href="#chat" accessibility-href="#accessibility"></sc-utility-bar>`;

function inRoot<T = unknown>(page: E2EPage, expr: string): Promise<T> {
  return page.evaluate((e: string) => {
    const root = document.querySelector('sc-utility-bar')!.shadowRoot!;
    // eslint-disable-next-line no-new-func
    return new Function('root', `return (${e});`)(root);
  }, expr) as Promise<T>;
}

const token = (page: E2EPage, prop: string, value: string) =>
  page.evaluate(
    (p: string, v: string) => {
      const i = document.createElement('i');
      i.style.setProperty(p, v);
      document.body.append(i);
      return getComputedStyle(i).getPropertyValue(p);
    },
    prop,
    value,
  );

describe('sc-utility-bar (e2e)', () => {
  it('from 1024px is a flat bar docked to the bottom, full width, at elevation 1 with an outline-variant top edge (U4)', async () => {
    const page = await newScPage(BAR);
    await page.setViewport({ width: 1280, height: 720 });
    const box = await inRoot<number[]>(page, '(() => { const r = root.querySelector("nav").getBoundingClientRect(); return [r.left, Math.round(r.right), Math.round(r.bottom)]; })()');
    expect(box).toEqual([0, 1280, 720]);
    const s = await inRoot<string[]>(page, '(() => { const s = getComputedStyle(root.querySelector("nav")); return [s.position, s.boxShadow, s.borderTopWidth, s.borderTopColor, s.borderTopLeftRadius]; })()');
    expect(s[0]).toBe('fixed');
    expect(s[1]).toBe(await token(page, 'box-shadow', 'var(--sc-elevation-1)'));
    expect(s[2]).toBe('1px');
    expect(s[3]).toBe(await token(page, 'color', 'var(--sc-color-outline-variant)'));
    expect(s[4]).toBe('0px');
  });

  it('keeps every label visible and every target at least 44px', async () => {
    const page = await newScPage(BAR, { lang: 'ar' });
    await page.setViewport({ width: 1024, height: 720 });
    const items = await inRoot<number[][]>(page, 'Array.from(root.querySelectorAll("a")).map((a) => { const r = a.getBoundingClientRect(); return [Math.round(r.height), a.querySelector("span").getBoundingClientRect().width]; })');
    expect(items.length).toBe(4);
    for (const [h, label] of items) {
      expect(h).toBeGreaterThanOrEqual(44);
      expect(label).toBeGreaterThan(20);
    }
  });

  it('publishes its height for the page to reserve, and below 1024px folds into the flow as a 2 × 2 group', async () => {
    const page = await newScPage(BAR);
    await page.setViewport({ width: 1280, height: 720 });
    await page.waitForFunction(() => document.documentElement.style.getPropertyValue('--sc-utility-bar-block-size') !== '');
    await page.setViewport({ width: 390, height: 720 });
    await page.waitForFunction(() => document.documentElement.style.getPropertyValue('--sc-utility-bar-block-size') === '');
    expect(await inRoot(page, 'getComputedStyle(root.querySelector("nav")).position')).toBe('static');
    expect(await inRoot(page, 'root.querySelector("h2").getBoundingClientRect().height > 10')).toBe(true);
    const tops = await inRoot<number[]>(page, 'Array.from(root.querySelectorAll("a")).map((a) => Math.round(a.getBoundingClientRect().top))');
    expect(new Set(tops).size).toBe(2);
  });

  it('removes the reservation when it is removed', async () => {
    const page = await newScPage(BAR);
    await page.setViewport({ width: 1280, height: 720 });
    await page.waitForFunction(() => document.documentElement.style.getPropertyValue('--sc-utility-bar-block-size') !== '');
    await page.evaluate(() => document.querySelector('sc-utility-bar')!.remove());
    expect(await page.evaluate(() => document.documentElement.style.getPropertyValue('--sc-utility-bar-block-size'))).toBe('');
  });
});

describeAxe('sc-utility-bar', BAR);
