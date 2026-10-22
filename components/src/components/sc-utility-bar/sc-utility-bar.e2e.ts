import { E2EPage, newE2EPage } from '@stencil/core/testing';
import type { HTTPRequest, Page as PuppeteerPage } from 'puppeteer';
import { describeAxe } from '../../test/axe';
import { newScPage } from '../../test/page';

const BAR = `<p><a href="#top">Top</a></p><sc-utility-bar happiness-href="#happiness" contact-href="tel:04" services-href="#services" chat-href="#chat" accessibility-href="#accessibility"></sc-utility-bar>`;

/** The bar as a service writes it for PERF-04: the same links again, in slot="fallback". */
const FALLBACK = (lang: string) =>
  lang === 'ar'
    ? `<nav slot="fallback" aria-labelledby="ub-fb"><h2 id="ub-fb">المساعدة والملاحظات</h2><ul>
        <li><a href="#happiness">مؤشر السعادة</a></li><li><a href="tel:04">الاتصال 04</a></li><li><a href="#chat">المحادثة</a></li><li><a href="#accessibility">إمكانية الوصول</a></li></ul></nav>`
    : `<nav slot="fallback" aria-labelledby="ub-fb"><h2 id="ub-fb">Help and feedback</h2><ul>
        <li><a href="#happiness">Happiness Meter</a></li><li><a href="tel:04">Call 04</a></li><li><a href="#chat">Chat</a></li><li><a href="#accessibility">Accessibility</a></li></ul></nav>`;
const WITH_FALLBACK = (lang = 'en') =>
  `<sc-utility-bar happiness-href="#happiness" contact-href="tel:04" chat-href="#chat" accessibility-href="#accessibility">${FALLBACK(lang)}</sc-utility-bar>`;

/**
 * Opens `html` with sc.css and JavaScript disabled, so no sc- tag is ever defined: what a
 * visitor gets when script fails or is blocked (PERF-04), and what every visitor sees before
 * the upgrade.
 */
async function noScriptPage(html: string, lang = 'en', viewport = { width: 1280, height: 800 }) {
  const e2e = await newE2EPage();
  await e2e.setContent('');
  const origin = new URL(e2e.url()).origin;
  // E2EPage is a Puppeteer page; its type hides browser().
  const page = await (e2e as unknown as PuppeteerPage).browser().newPage();
  await page.setJavaScriptEnabled(false);
  await page.setRequestInterception(true);
  page.on('request', (r: HTTPRequest) =>
    r.url() === `${origin}/no-script.html`
      ? r.respond({ status: 200, contentType: 'text/html', body: `<!doctype html><html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}" data-channel="now"><head><meta charset="utf-8"><link rel="stylesheet" href="/build/sc.css"></head><body>${html}</body></html>` })
      : r.continue(),
  );
  await page.setViewport(viewport);
  await page.goto(`${origin}/no-script.html`, { waitUntil: 'load' });
  return page;
}

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
    // Board ERV-0: 48px items, 12px block padding, a gap of 8.
    const m = await inRoot<number[]>(page, '(() => { const n = root.querySelector("nav"); const a = root.querySelectorAll("a"); return [parseFloat(getComputedStyle(n).paddingTop), Math.round(a[0].getBoundingClientRect().height), Math.round(a[1].getBoundingClientRect().left - a[0].getBoundingClientRect().right)]; })()');
    expect(m).toEqual([12, 48, 8]);
  });

  it('keeps all five labels visible and every target 48px', async () => {
    const page = await newScPage(BAR, { lang: 'ar' });
    await page.setViewport({ width: 1024, height: 720 });
    const items = await inRoot<number[][]>(page, 'Array.from(root.querySelectorAll("a")).map((a) => { const r = a.getBoundingClientRect(); return [Math.round(r.height), a.querySelector("span").getBoundingClientRect().width]; })');
    expect(items.length).toBe(5);
    for (const [h, label] of items) {
      expect(h).toBeGreaterThanOrEqual(48);
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
    const tops = await inRoot<number[]>(page, 'Array.from(root.querySelectorAll("a")).filter((a) => a.getClientRects().length).map((a) => Math.round(a.getBoundingClientRect().top))');
    expect(tops.length).toBe(4);
    expect(new Set(tops).size).toBe(2);
    expect(await inRoot(page, 'Array.from(root.querySelectorAll("a svg")).every((s) => getComputedStyle(s).display === "none")')).toBe(true);
  });

  it('removes the reservation when it is removed', async () => {
    const page = await newScPage(BAR);
    await page.setViewport({ width: 1280, height: 720 });
    await page.waitForFunction(() => document.documentElement.style.getPropertyValue('--sc-utility-bar-block-size') !== '');
    await page.evaluate(() => document.querySelector('sc-utility-bar')!.remove());
    expect(await page.evaluate(() => document.documentElement.style.getPropertyValue('--sc-utility-bar-block-size'))).toBe('');
  });
});

describe('sc-utility-bar at short viewport heights (R11)', () => {
  const PAGE = `
    <sc-page channel="now">
      <div style="block-size: 1500px"></div>
      <p><a id="last" href="#last">Last link</a></p>
      <sc-utility-bar slot="footer" happiness-href="#h" contact-href="tel:04" services-href="#s" chat-href="#c" accessibility-href="#a"></sc-utility-bar>
    </sc-page>`;

  it.each([
    ['1280 × 560', 1280, 560],
    ['1024 × 599', 1024, 599],
  ])('is static at the end of the page at %s, keeps its row, and reserves nothing', async (_, width, height) => {
    const page = await newScPage(PAGE);
    await page.setViewport({ width, height });
    await page.waitForFunction(() => document.documentElement.style.getPropertyValue('--sc-utility-bar-block-size') === '');
    const s = await inRoot<string[]>(page, '(() => { const s = getComputedStyle(root.querySelector("nav")); return [s.position, s.boxShadow, s.borderTopWidth, getComputedStyle(root.querySelector(".list")).display, getComputedStyle(root.querySelector(".item svg")).display]; })()');
    expect(s).toEqual(['static', 'none', '1px', 'flex', 'block']);
    expect(await page.evaluate(() => getComputedStyle(document.querySelector('sc-page')!).paddingBlockEnd)).toBe('0px');
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollPaddingBottom)).toBe('0px');
    // At the end of the page, after the content, not over the viewport.
    const [lastBottom, barTop] = await page.evaluate(() => [
      document.getElementById('last')!.getBoundingClientRect().bottom,
      document.querySelector('sc-utility-bar')!.shadowRoot!.querySelector('nav')!.getBoundingClientRect().top,
    ]);
    expect(barTop).toBeGreaterThan(lastBottom);
    expect(barTop).toBeGreaterThan(height);
  });

  it('docks again (and reserves its height) when the viewport grows to 600px tall', async () => {
    const page = await newScPage(PAGE);
    await page.setViewport({ width: 1280, height: 560 });
    await page.waitForFunction(() => document.documentElement.style.getPropertyValue('--sc-utility-bar-block-size') === '');
    await page.setViewport({ width: 1280, height: 600 });
    await page.waitForFunction(() => document.documentElement.style.getPropertyValue('--sc-utility-bar-block-size') !== '');
    expect(await inRoot(page, 'getComputedStyle(root.querySelector("nav")).position')).toBe('fixed');
    const bar = await page.evaluate(() => document.documentElement.style.getPropertyValue('--sc-utility-bar-block-size'));
    expect(await page.evaluate(() => getComputedStyle(document.querySelector('sc-page')!).paddingBlockEnd)).toBe(bar);
  });
});

describe('sc-utility-bar without JavaScript (PERF-04)', () => {
  it.each([
    ['en', 1280, 800],
    ['ar', 1280, 800],
    ['en', 390, 800],
  ] as const)('shows the fallback links, visible, 44px tall and with hrefs, before any upgrade (%s, %ipx)', async (lang, width, height) => {
    const page = await noScriptPage(WITH_FALLBACK(lang), lang, { width, height });
    expect(await page.evaluate(() => !!customElements.get('sc-utility-bar'))).toBe(false);
    const links = await page.evaluate(() =>
      Array.from(document.querySelectorAll('sc-utility-bar a')).map((a) => {
        const r = a.getBoundingClientRect();
        return { href: a.getAttribute('href'), visible: r.width > 0 && r.height > 0 && getComputedStyle(a).visibility === 'visible', h: Math.round(r.height) };
      }),
    );
    expect(links.map((l) => l.href)).toEqual(['#happiness', 'tel:04', '#chat', '#accessibility']);
    for (const l of links) {
      expect(l.visible).toBe(true);
      expect(l.h).toBeGreaterThanOrEqual(44);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await page.close();
  });

  it('once upgraded, renders its own items with the same hrefs and hides the fallback', async () => {
    const page = await newScPage(WITH_FALLBACK());
    await page.setViewport({ width: 1280, height: 800 });
    expect(await page.evaluate(() => document.querySelector('sc-utility-bar [slot="fallback"]')!.getClientRects().length)).toBe(0);
    expect(await inRoot<string[]>(page, 'Array.from(root.querySelectorAll("a.item")).map((a) => a.getAttribute("href"))')).toEqual(['#happiness', 'tel:04', '#chat', '#accessibility']);
    expect(await inRoot(page, 'getComputedStyle(root.querySelector("nav")).position')).toBe('fixed');
  });
});

describeAxe('sc-utility-bar', BAR);
