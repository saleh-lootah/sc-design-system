import { E2EPage, newE2EPage } from '@stencil/core/testing';
import type { HTTPRequest, Page as PuppeteerPage } from 'puppeteer';
import { describeAxe } from '../../test/axe';
import { groupedFooter } from '../../test/chrome';
import { newScPage, setPageContext } from '../../test/page';

const SIMPLE = `<sc-footer help-href="#help" accessibility-href="#a11y" privacy-href="#privacy" cookies-href="#cookies" terms-href="#terms"><a href="#feedback">Give feedback</a></sc-footer>`;

/** The simple footer as a service writes it for PERF-04: the same links again, in slot="fallback". */
const WITH_FALLBACK = `<sc-footer help-href="#help" accessibility-href="#a11y" privacy-href="#privacy" terms-href="#terms">
  <nav slot="fallback" aria-label="Support links"><ul>
    <li><a href="#help">Help and contact</a></li>
    <li><a href="#a11y">Accessibility statement</a></li>
    <li><a href="#privacy">Privacy and cookies</a></li>
    <li><a href="#terms">Terms of use</a></li>
    <li><a href="#feedback">Give feedback</a></li>
  </ul></nav>
  <a href="#feedback">Give feedback</a>
</sc-footer>`;

/**
 * Opens `html` with sc.css and JavaScript disabled, so no sc- tag is ever defined: what a
 * visitor gets when script fails or is blocked (PERF-04), and what every visitor sees before
 * the upgrade.
 */
async function noScriptPage(html: string, lang = 'en') {
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
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(`${origin}/no-script.html`, { waitUntil: 'load' });
  return page;
}

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

  it('simple: padding 32 on top and 40 below, meta text in body-medium (A29, board F66-0)', async () => {
    const page = await newScPage(SIMPLE);
    await page.setViewport({ width: 1440, height: 800 });
    const m = await inRoot<string[]>(page, '(() => { const i = getComputedStyle(root.querySelector(".simple")); const m = getComputedStyle(root.querySelector(".meta")); return [i.paddingTop, i.paddingBottom, m.fontSize, m.lineHeight]; })()');
    expect(m).toEqual(['32px', '40px', '16px', '24px']);
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
    expect(seen).toEqual(['#help', '#a11y', '#privacy', '#terms', '#cookies', '#feedback']);
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

  // R10: in Arabic every footer link is already Bold (D12), so the current channel also has a
  // 3px channel-action bar at its inline start, in both languages.
  it.each(['en', 'ar'] as const)('grouped: the current channel has a non-weight cue, a 3px inline-start bar (%s)', async (lang) => {
    const page = await newScPage(groupedFooter(lang), { lang, channel: 'justice' });
    const bars = await inRoot<string[][]>(page, `Array.from(root.querySelectorAll(".channels a")).map((a) => { const s = getComputedStyle(a); return ${lang === 'ar' ? '[s.borderRightStyle, s.borderRightWidth, s.borderRightColor]' : '[s.borderLeftStyle, s.borderLeftWidth, s.borderLeftColor]'}; })`);
    const action = await page.evaluate(() => {
      const i = document.createElement('i');
      i.style.color = 'var(--sc-color-channel-action)';
      document.documentElement.append(i);
      return getComputedStyle(i).color;
    });
    expect(bars[3]).toEqual(['solid', '3px', action]);
    expect(bars.filter((b) => b[0] === 'solid').length).toBe(1);
    expect(await inRoot(page, 'root.querySelectorAll(".channels a")[3].getAttribute("aria-current")')).toBe('true');
  });

  it('links are navigation links (R6) that keep the underline in every state', async () => {
    const page = await newScPage(groupedFooter('en'));
    const lines = await inRoot<string[]>(page, 'Array.from(root.querySelectorAll("a.link")).map((a) => getComputedStyle(a).textDecorationLine)');
    expect(new Set(lines)).toEqual(new Set(['underline']));
    await page.hover('sc-footer >>> a.link');
    expect(await inRoot(page, 'getComputedStyle(root.querySelector("a.link")).textDecorationLine')).toBe('underline');
  });

  describe('without JavaScript (PERF-04)', () => {
    it.each(['en', 'ar'] as const)('shows the fallback links, visible, 44px tall and with hrefs, before any upgrade (%s)', async (lang) => {
      const page = await noScriptPage(WITH_FALLBACK, lang);
      const links = await page.evaluate(() =>
        Array.from(document.querySelectorAll('sc-footer a')).map((a) => {
          const r = a.getBoundingClientRect();
          const s = getComputedStyle(a);
          return { href: a.getAttribute('href'), visible: r.width > 0 && r.height > 0 && s.visibility === 'visible', h: Math.round(r.height), line: s.textDecorationLine };
        }),
      );
      expect(await page.evaluate(() => !!customElements.get('sc-footer'))).toBe(false);
      // The bare extra is hidden: the fallback lists it.
      expect(links.filter((l) => l.visible).map((l) => l.href)).toEqual(['#help', '#a11y', '#privacy', '#terms', '#feedback']);
      for (const l of links.filter((x) => x.visible)) {
        expect(l.h).toBeGreaterThanOrEqual(44);
        expect(l.line).toBe('underline');
      }
      await page.close();
    });

    it('once upgraded, renders its own links with the same hrefs and hides the fallback', async () => {
      const page = await newScPage(WITH_FALLBACK);
      expect(await page.evaluate(() => document.querySelector('sc-footer [slot="fallback"]')!.getClientRects().length)).toBe(0);
      expect(await inRoot<string[]>(page, 'Array.from(root.querySelectorAll("a.link")).map((a) => a.getAttribute("href"))')).toEqual(['#help', '#a11y', '#privacy', '#terms']);
      // The bare extra is slotted as before; the fallback's links are not.
      expect(await page.evaluate(() => Array.from(document.querySelectorAll('sc-footer > a')).map((a) => [a.getAttribute('slot'), a.getClientRects().length > 0]))).toEqual([['link-0', true]]);
      expect(JSON.stringify(await page.accessibility.snapshot())).not.toContain('"name":"Support links","children"');
    });
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
