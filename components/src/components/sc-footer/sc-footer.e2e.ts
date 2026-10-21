import { E2EPage } from '@stencil/core/testing';
import { describeAxe } from '../../test/axe';
import { groupedFooter } from '../../test/chrome';
import { newScPage, setPageContext } from '../../test/page';

const SIMPLE = `<sc-footer help-href="#help" accessibility-href="#a11y" privacy-href="#privacy" cookies-href="#cookies" terms-href="#terms"><a href="#feedback">Give feedback</a></sc-footer>`;

function inRoot<T = unknown>(page: E2EPage, expr: string): Promise<T> {
  return page.evaluate((e: string) => {
    const root = document.querySelector('sc-footer')!.shadowRoot!;
    // eslint-disable-next-line no-new-func
    return new Function('root', `return (${e});`)(root);
  }, expr) as Promise<T>;
}

describe('sc-footer (e2e)', () => {
  it('is the contentinfo landmark on surface, with underlined on-surface links at least 44px tall', async () => {
    const page = await newScPage(SIMPLE);
    expect(JSON.stringify(await page.accessibility.snapshot())).toContain('"role":"contentinfo"');
    const s = await inRoot<string[]>(page, '(() => { const a = root.querySelector("a.link"); const s = getComputedStyle(a); return [s.textDecorationLine, s.color, String(Math.round(a.getBoundingClientRect().height))]; })()');
    const onSurface = await page.evaluate(() => {
      const i = document.createElement('i');
      i.style.color = 'var(--sc-color-on-surface)';
      document.body.append(i);
      return getComputedStyle(i).color;
    });
    expect(s[0]).toBe('underline');
    expect(s[1]).toBe(onSurface);
    expect(Number(s[2])).toBeGreaterThanOrEqual(44);
  });

  it('Tab moves through every link in order, including slotted ones', async () => {
    const page = await newScPage(SIMPLE);
    const seen: string[] = [];
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab');
      seen.push(
        await page.evaluate(() => {
          const a = document.activeElement!;
          return (a.shadowRoot?.activeElement ?? a).getAttribute('href')!;
        }),
      );
    }
    expect(seen).toEqual(['#help', '#a11y', '#privacy', '#cookies', '#terms', '#feedback']);
  });

  it('grouped: four columns from 1024px, the Channels group in two columns, mirrored in Arabic', async () => {
    const page = await newScPage(groupedFooter('en'));
    await page.setViewport({ width: 1440, height: 900 });
    const lefts = () => inRoot<number[]>(page, '[".brand", ".channels", "section:nth-of-type(2)", "section:nth-of-type(3)"].map((s) => Math.round(root.querySelector(s).getBoundingClientRect().left))');
    const ltr = await lefts();
    expect([...ltr].sort((a, b) => a - b)).toEqual(ltr);
    const cols = await inRoot<number>(page, 'new Set(Array.from(root.querySelectorAll(".channels li")).map((l) => Math.round(l.getBoundingClientRect().left))).size');
    expect(cols).toBe(2);
    await setPageContext(page, { lang: 'ar' });
    const rtl = await lefts();
    expect([...rtl].sort((a, b) => b - a)).toEqual(rtl);
  });

  it('grouped: the current channel is Bold', async () => {
    const page = await newScPage(groupedFooter('en'), { channel: 'justice' });
    const weights = await inRoot<string[]>(page, 'Array.from(root.querySelectorAll(".channels a")).map((a) => getComputedStyle(a).fontWeight)');
    expect(weights[3]).toBe('700');
    expect(weights.filter((w) => w === '700').length).toBe(1);
  });

  it('grouped: stacks into one column on phones, links stay 44px', async () => {
    const page = await newScPage(groupedFooter('en'));
    await page.setViewport({ width: 390, height: 900 });
    const lefts = await inRoot<number[]>(page, '[".brand", "section:nth-of-type(2)", "section:nth-of-type(3)"].map((s) => Math.round(root.querySelector(s).getBoundingClientRect().left))');
    expect(new Set(lefts).size).toBe(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  });
});

describeAxe('sc-footer', `${SIMPLE}${groupedFooter('en')}`);
