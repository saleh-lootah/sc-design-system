import { E2EPage } from '@stencil/core/testing';
import { describeAxe } from '../../test/axe';
import { newScPage, setPageContext } from '../../test/page';

const ITEMS = `<a href="#home" data-icon="home" aria-current="page">Home</a><a href="#services" data-icon="apps">Services</a><a href="#activity" data-icon="history">Activity</a>`;

function read<T = unknown>(page: E2EPage, expr: string): Promise<T> {
  return page.evaluate((e: string) => {
    const host = document.querySelector('sc-bottom-nav')!;
    const root = host.shadowRoot!;
    const items = [...root.querySelectorAll('a')];
    // eslint-disable-next-line no-new-func
    return new Function('host', 'root', 'items', `return (${e});`)(host, root, items);
  }, expr) as Promise<T>;
}

const token = (page: E2EPage, name: string, prop: 'color' | 'backgroundColor' = 'color') =>
  page.evaluate(
    (n: string, p: string) => {
      const probe = document.createElement('i');
      probe.style.setProperty(p === 'color' ? 'color' : 'background-color', `var(${n})`);
      document.body.append(probe);
      const v = getComputedStyle(probe)[p as 'color'];
      probe.remove();
      return v;
    },
    name,
    prop,
  );

const PAGE = `<main><h1>Good morning, Sara</h1><p>Content</p><a href="#last">Last link</a></main><sc-bottom-nav>${ITEMS}</sc-bottom-nav>`;
export const ALL_STATES = PAGE;

async function mobile(page: E2EPage) {
  await page.setViewport({ width: 375, height: 700 });
  await page.waitForChanges();
}

describe('sc-bottom-nav (e2e)', () => {
  it('is docked to the bottom edge below 1024px: 64px tall, surface fill, hairline on top, equal items', async () => {
    const page = await newScPage(PAGE);
    await mobile(page);
    expect(await read(page, 'Math.round(host.getBoundingClientRect().bottom)')).toBe(700);
    expect(await read(page, 'Math.round(host.getBoundingClientRect().height)')).toBe(65);
    expect(await read(page, 'getComputedStyle(root.querySelector("nav")).backgroundColor')).toBe(await token(page, '--sc-color-surface', 'backgroundColor'));
    expect(await read(page, 'getComputedStyle(root.querySelector("nav")).borderTopColor')).toBe(await token(page, '--sc-color-outline-variant'));
    expect(await read(page, 'getComputedStyle(root.querySelector("nav")).boxShadow')).toBe('none');
    const widths = await read<number[]>(page, 'items.map((a) => Math.round(a.getBoundingClientRect().width))');
    expect(new Set(widths).size).toBe(1);
    expect(widths[0]).toBeGreaterThanOrEqual(48);
  });

  it('is hidden from 1024px', async () => {
    const page = await newScPage(PAGE);
    await page.setViewport({ width: 1280, height: 800 });
    await page.waitForChanges();
    expect(await read(page, 'getComputedStyle(host).display')).toBe('none');
    expect(await page.evaluate(() => getComputedStyle(document.body).paddingBottom)).toBe('0px');
  });

  it('reserves its height at the end of the page, so the last link is never covered', async () => {
    const page = await newScPage(PAGE);
    await mobile(page);
    expect(await page.evaluate(() => getComputedStyle(document.body).paddingBottom)).toBe('72px');
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollPaddingBottom)).toBe('72px');
  });

  it('marks the current item: a 56 × 32 channel-container indicator, channel action icon and Bold label', async () => {
    const page = await newScPage(PAGE);
    await mobile(page);
    const ind = (i: number, p: string) => read<string>(page, `getComputedStyle(items[${i}].querySelector(".indicator")).${p}`);
    expect(await ind(0, 'backgroundColor')).toBe(await token(page, '--sc-color-channel-container', 'backgroundColor'));
    expect(await ind(0, 'width')).toBe('56px');
    expect(await ind(0, 'height')).toBe('32px');
    expect(await ind(1, 'backgroundColor')).toBe('rgba(0, 0, 0, 0)');
    expect(await read(page, 'getComputedStyle(items[0]).color')).toBe(await token(page, '--sc-color-channel-action'));
    expect(await read(page, 'getComputedStyle(items[0]).fontWeight')).toBe('700');
    expect(await read(page, 'getComputedStyle(items[1]).color')).toBe(await token(page, '--sc-color-on-surface-variant'));
    expect(await read(page, 'getComputedStyle(items[1]).fontSize')).toBe('14px');
    // Board GD6-0: indicator 6 below the top rule, label 2 below the indicator.
    const gaps = await read<number[]>(page, '(() => { const a = items[1].getBoundingClientRect(); const i = items[1].querySelector(".indicator").getBoundingClientRect(); const l = items[1].querySelector(".label").getBoundingClientRect(); return [i.top - a.top, l.top - i.bottom]; })()');
    expect(gaps).toEqual([6, 2]);
    await setPageContext(page, { lang: 'ar' });
    expect(await read(page, 'getComputedStyle(items[1]).fontSize')).toBe('16px');
    // A one-line Arabic label still fits the 64px bar.
    expect(await read(page, 'Math.round(items[1].getBoundingClientRect().height)')).toBe(64);
  });

  it('mirrors the item order in Arabic', async () => {
    const page = await newScPage(PAGE, { lang: 'ar' });
    await mobile(page);
    const lefts = await read<number[]>(page, 'items.map((a) => a.getBoundingClientRect().left)');
    expect(lefts[0]).toBeGreaterThan(lefts[2]);
  });

  it('keeps the focus ring inside the bar, and Enter follows an item', async () => {
    const page = await newScPage(`<sc-bottom-nav>${ITEMS}</sc-bottom-nav>`);
    await mobile(page);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    expect(await read(page, 'root.activeElement.getAttribute("href")')).toBe('#services');
    expect(await read(page, 'getComputedStyle(root.activeElement).outlineWidth')).toBe('3px');
    expect(await read(page, 'getComputedStyle(root.activeElement).outlineOffset')).toBe('-3px');
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(await page.evaluate(() => location.hash)).toBe('#services');
  });

  it('marks the current item with a 3px bar as well as Bold, so the cue holds in Arabic where every label is Bold (R10)', async () => {
    for (const lang of ['en', 'ar'] as const) {
      const page = await newScPage(PAGE, { lang });
      await mobile(page);
      const weights = await read<string[]>(page, 'items.map((a) => getComputedStyle(a).fontWeight)');
      if (lang === 'ar') expect(new Set(weights)).toEqual(new Set(['700'])); // weight alone tells nothing in Arabic
      const bars = await read<{ content: string; w: number; h: number; bg: string; top: number; centre: number; pill: number }[]>(
        page,
        `items.map((a) => {
          const s = getComputedStyle(a, "::before");
          const r = a.getBoundingClientRect();
          const p = a.querySelector(".indicator").getBoundingClientRect();
          return { content: s.content, w: parseFloat(s.width), h: parseFloat(s.height), bg: s.backgroundColor, top: parseFloat(s.top), centre: r.left + parseFloat(s.left) + parseFloat(s.width) / 2, pill: p.left + p.width / 2 };
        })`,
      );
      expect(bars.filter((b) => b.content !== 'none').length).toBe(1);
      const bar = bars[0];
      expect(bar.content).not.toBe('none');
      expect([bar.w, bar.h, bar.top]).toEqual([56, 3, 0]);
      expect(Math.abs(bar.centre - bar.pill)).toBeLessThan(0.5);
      expect(bar.bg).toBe(await token(page, '--sc-color-channel-action', 'backgroundColor'));
    }
  });

  it('follows an item on release only: pressing, sliding off and releasing does nothing (WCAG 2.5.2)', async () => {
    const page = await newScPage(PAGE);
    await mobile(page);
    const box = (await (await page.$('sc-bottom-nav >>> a[href="#services"]'))!.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2, 100, { steps: 4 });
    await page.mouse.up();
    await page.waitForChanges();
    expect(await page.evaluate(() => location.hash)).toBe('');
    await page.click('sc-bottom-nav >>> a[href="#services"]');
    await page.waitForChanges();
    expect(await page.evaluate(() => location.hash)).toBe('#services');
  });

  describeAxe('sc-bottom-nav', ALL_STATES);
});
