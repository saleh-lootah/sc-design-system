import { E2EPage } from '@stencil/core/testing';
import { describeAxe } from '../../test/axe';
import { groupedFooter, simpleFooter } from '../../test/chrome';
import { newScPage, noScriptPage, setPageContext } from '../../test/page';

const SIMPLE = simpleFooter('en', '<li><a href="#feedback">Give feedback</a></li>');

const resolve = (page: E2EPage, role: string) =>
  page.evaluate((r: string) => {
    const i = document.createElement('i');
    i.style.color = `var(--sc-color-${r})`;
    document.querySelector('sc-footer')!.append(i);
    const c = getComputedStyle(i).color;
    i.remove();
    return c;
  }, role);

describe('sc-footer (e2e, CSS only)', () => {
  it('is not a registered custom element: the contentinfo landmark, on surface, with underlined on-surface links at least 44px tall', async () => {
    const page = await newScPage(SIMPLE);
    expect(await page.evaluate(() => !!customElements.get('sc-footer'))).toBe(false);
    expect(JSON.stringify(await page.accessibility.snapshot())).toContain('"role":"contentinfo"');
    const s = await page.evaluate(() => {
      const a = document.querySelector('sc-footer a')!;
      const cs = getComputedStyle(a);
      return [cs.textDecorationLine, cs.color, Math.round(a.getBoundingClientRect().height), getComputedStyle(document.querySelector('sc-footer')!).backgroundColor];
    });
    expect(s[0]).toBe('underline');
    expect(s[1]).toBe(await resolve(page, 'on-surface'));
    expect(s[2]).toBeGreaterThanOrEqual(44);
    expect(s[3]).toBe(await page.evaluate(() => getComputedStyle(document.body).backgroundColor));
  });

  it('simple: padding 32 on top and 40 below, a 1px rule, meta text in body-medium at inline-end (A29, board F66-0)', async () => {
    const page = await newScPage(SIMPLE);
    await page.setViewport({ width: 1440, height: 800 });
    const m = await page.evaluate(() => {
      const f = getComputedStyle(document.querySelector('sc-footer > footer')!);
      const p = document.querySelector('sc-footer > footer > p')!;
      const ps = getComputedStyle(p);
      return [f.paddingTop, f.paddingBottom, f.borderTopWidth, ps.fontSize, ps.lineHeight, Math.round(document.documentElement.clientWidth - p.getBoundingClientRect().right)];
    });
    expect(m).toEqual(['32px', '40px', '1px', '16px', '24px', 80]);
  });

  it.each([
    [375, 20],
    [700, 32],
    [1200, 48],
    [1440, 80],
  ])('at %ipx wide uses the %ipx page margin', async (width, margin) => {
    const page = await newScPage(SIMPLE);
    await page.setViewport({ width, height: 800 });
    expect(await page.evaluate(() => Math.round(document.querySelector('sc-footer a')!.getBoundingClientRect().left))).toBe(margin);
  });

  it('Tab moves through every link in order', async () => {
    const page = await newScPage(SIMPLE);
    const seen: string[] = [];
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab');
      seen.push(await page.evaluate(() => document.activeElement!.getAttribute('href')!));
    }
    expect(seen).toEqual(['#help', '#a11y', '#privacy', '#terms', '#cookies', '#feedback']);
  });

  it('simple: links stack as 44px rows below 600px', async () => {
    const page = await newScPage(SIMPLE);
    await page.setViewport({ width: 390, height: 800 });
    const rows = await page.evaluate(() => Array.from(document.querySelectorAll('sc-footer a')).map((a) => [Math.round(a.getBoundingClientRect().left), Math.round(a.getBoundingClientRect().height)]));
    expect(new Set(rows.map((r) => r[0])).size).toBe(1);
    for (const r of rows) expect(r[1]).toBeGreaterThanOrEqual(44);
  });

  it('grouped: four columns from 1024px, the Channels group in two columns, mirrored in Arabic', async () => {
    const page = await newScPage(groupedFooter('en'));
    await page.setViewport({ width: 1440, height: 900 });
    const lefts = () => page.evaluate(() => Array.from(document.querySelectorAll('sc-footer > footer > :not(.sc-footer__lower)')).map((s) => Math.round(s.getBoundingClientRect().left)));
    const ltr = await lefts();
    expect(ltr.length).toBe(4);
    expect([...ltr].sort((a, b) => a - b)).toEqual(ltr);
    const cols = await page.evaluate(() => new Set(Array.from(document.querySelectorAll('.sc-footer__channels li')).map((l) => Math.round(l.getBoundingClientRect().left))).size);
    expect(cols).toBe(2);
    await setPageContext(page, { lang: 'ar' });
    const rtl = await lefts();
    expect([...rtl].sort((a, b) => b - a)).toEqual(rtl);
  });

  it('grouped: padding 56 on top from 600px, 32 below it; the lower line under a 1px rule, 40 below the groups', async () => {
    const page = await newScPage(groupedFooter('en'));
    await page.setViewport({ width: 1440, height: 900 });
    const m = () =>
      page.evaluate(() => {
        const f = getComputedStyle(document.querySelector('sc-footer > footer')!);
        const lower = document.querySelector('.sc-footer__lower')!;
        const groups = Array.from(document.querySelectorAll('sc-footer > footer > section'));
        const bottom = Math.max(...groups.map((g) => g.getBoundingClientRect().bottom));
        return [f.paddingTop, getComputedStyle(lower).borderTopWidth, Math.round(lower.getBoundingClientRect().top - bottom)];
      });
    expect(await m()).toEqual(['56px', '1px', 40]);
    await page.setViewport({ width: 390, height: 900 });
    expect((await m())[0]).toBe('32px');
  });

  it('grouped: the brand name is headline-small after a ring mark in the channel colour', async () => {
    const page = await newScPage(groupedFooter('en'));
    const s = await page.evaluate(() => {
      const p = document.querySelector('.sc-footer__brand > p')!;
      const mark = getComputedStyle(p, '::before');
      return [getComputedStyle(p).fontSize, mark.width, mark.borderTopWidth, mark.borderTopColor];
    });
    expect(s.slice(0, 3)).toEqual(['24px', '24px', '3px']);
    expect(s[3]).toBe(await resolve(page, 'channel-action'));
  });

  // R10: in Arabic every footer link is already Bold (D12), so the current channel also has a
  // 3px channel-action bar at its inline start, in both languages.
  it.each(['en', 'ar'] as const)('grouped: the current channel is Bold with a 3px inline-start bar (%s)', async (lang) => {
    const page = await newScPage(groupedFooter(lang, { current: 'justice' }), { lang, channel: 'justice' });
    const bars = await page.evaluate(
      (ar: boolean) =>
        Array.from(document.querySelectorAll('.sc-footer__channels a')).map((a) => {
          const s = getComputedStyle(a);
          return ar ? [s.borderRightStyle, s.borderRightWidth, s.borderRightColor, s.fontWeight] : [s.borderLeftStyle, s.borderLeftWidth, s.borderLeftColor, s.fontWeight];
        }),
      lang === 'ar',
    );
    expect(bars[3]).toEqual(['solid', '3px', await resolve(page, 'channel-action'), '700']);
    expect(bars.filter((b) => b[0] === 'solid').length).toBe(1);
    if (lang === 'en') expect(bars.filter((b) => b[3] === '700').length).toBe(1);
  });

  it('links are navigation links (R6) that keep the underline in every state, 2px on hover', async () => {
    const page = await newScPage(groupedFooter('en'));
    const lines = await page.evaluate(() => Array.from(document.querySelectorAll('sc-footer a')).map((a) => getComputedStyle(a).textDecorationLine));
    expect(new Set(lines)).toEqual(new Set(['underline']));
    await page.hover('.sc-footer__channels a');
    await page.waitForFunction(() => getComputedStyle(document.querySelector('.sc-footer__channels a')!).textDecorationThickness === '2px');
    expect(await page.evaluate(() => getComputedStyle(document.querySelector('.sc-footer__channels a')!).textDecorationLine)).toBe('underline');
  });

  it.each(['en', 'ar'] as const)('works the same without JavaScript: links visible, 44px tall, underlined (%s)', async (lang) => {
    const page = await noScriptPage(`${simpleFooter(lang)}${groupedFooter(lang)}`, lang);
    const links = await page.evaluate(() =>
      Array.from(document.querySelectorAll('sc-footer a')).map((a) => {
        const r = a.getBoundingClientRect();
        return { visible: r.width > 0 && r.height > 0, h: Math.round(r.height), line: getComputedStyle(a).textDecorationLine };
      }),
    );
    expect(links.length).toBe(18);
    for (const l of links) {
      expect(l.visible).toBe(true);
      expect(l.line).toBe('underline');
      expect(l.h).toBeGreaterThanOrEqual(44);
    }
    await page.close();
  });

  it('grouped: stacks into one column on phones, with no horizontal scroll', async () => {
    const page = await newScPage(groupedFooter('en'));
    await page.setViewport({ width: 390, height: 900 });
    const lefts = await page.evaluate(() => Array.from(document.querySelectorAll('sc-footer > footer > *')).map((s) => Math.round(s.getBoundingClientRect().left)));
    expect(new Set(lefts).size).toBe(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  });

  it('hidden hides it', async () => {
    const page = await newScPage(SIMPLE.replace('<sc-footer>', '<sc-footer hidden>'));
    expect(await page.evaluate(() => getComputedStyle(document.querySelector('sc-footer')!).display)).toBe('none');
  });
});

describeAxe('sc-footer', `${SIMPLE}${groupedFooter('en')}`);
