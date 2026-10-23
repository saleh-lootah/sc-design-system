import { E2EPage } from '@stencil/core/testing';
import { describeAxe } from '../../test/axe';
import { officialBanner } from '../../test/chrome';
import { newScPage, noScriptPage, settleTransitions } from '../../test/page';

const resolve = (page: E2EPage, role: string) =>
  page.evaluate((r: string) => {
    const i = document.createElement('i');
    i.style.color = `var(--sc-color-${r})`;
    document.querySelector('sc-official-banner')!.append(i);
    const c = getComputedStyle(i).color;
    i.remove();
    return c;
  }, role);

const isOpen = (page: E2EPage) => page.evaluate(() => (document.querySelector('sc-official-banner details') as HTMLDetailsElement).open);

describe('sc-official-banner (e2e, CSS only)', () => {
  it('is not a registered custom element: a labelled region on surface-container, closed, with a 44px summary', async () => {
    const page = await newScPage(officialBanner());
    expect(await page.evaluate(() => !!customElements.get('sc-official-banner'))).toBe(false);
    expect(JSON.stringify(await page.accessibility.snapshot())).toContain('Official website of the Government of Dubai');
    const s = await page.evaluate(() => {
      const host = document.querySelector('sc-official-banner')!;
      const summary = host.querySelector('summary')!;
      return [getComputedStyle(host).backgroundColor, Math.round(summary.getBoundingClientRect().height), (host.querySelector('details > div') as HTMLElement).checkVisibility()];
    });
    expect(s[0]).toBe(await page.evaluate(() => {
      const i = document.createElement('i');
      i.style.backgroundColor = 'var(--sc-color-surface-container)';
      document.body.append(i);
      const c = getComputedStyle(i).backgroundColor;
      i.remove();
      return c;
    }));
    expect(s[1]).toBeGreaterThanOrEqual(44);
    expect(s[2]).toBe(false);
    expect(await isOpen(page)).toBe(false);
  });

  it('only "How to check" is underlined, with a 16px chevron that turns when open', async () => {
    const page = await newScPage(officialBanner());
    const read = () =>
      page.evaluate(() => {
        const [statement, toggle] = Array.from(document.querySelectorAll('sc-official-banner summary > span'));
        const after = getComputedStyle(toggle, '::after');
        return [getComputedStyle(statement).textDecorationLine, getComputedStyle(toggle).textDecorationLine, getComputedStyle(statement, '::after').content, after.width, after.transform];
      });
    const closed = await read();
    expect(closed.slice(0, 4)).toEqual(['none', 'underline', 'none', '16px']);
    expect(closed[4]).toBe('none');
    await page.click('sc-official-banner summary');
    await settleTransitions(page);
    expect((await read())[4]).toBe('matrix(-1, 0, 0, -1, 0, 0)');
  });

  it('from a pointer the chevron turns over 120ms and the explanation fades in; from the keyboard both are instant; reduced motion keeps only the fade (MOT-02, MOT-15)', async () => {
    const motion = (page: E2EPage) =>
      page.evaluate(() => {
        const after = getComputedStyle(document.querySelectorAll('sc-official-banner summary > span')[1], '::after');
        const panel = getComputedStyle(document.querySelector('sc-official-banner details > div')!);
        return {
          turn: `${after.transitionProperty} ${after.transitionDuration} ${after.transitionTimingFunction}`,
          fade: `${panel.animationName} ${panel.animationDuration} ${panel.animationTimingFunction}`,
          running: document
            .getAnimations()
            .map((a) => (a as CSSAnimation).animationName || (a as CSSTransition).transitionProperty)
            .sort(),
        };
      });
    const turn = 'transform 0.12s cubic-bezier(0.77, 0, 0.175, 1)';
    const fade = 'sc-official-banner-fade 0.12s cubic-bezier(0.23, 1, 0.32, 1)';
    let page = await newScPage(officialBanner());
    expect((await motion(page)).turn).toBe(turn);
    await page.click('sc-official-banner summary');
    expect(await motion(page)).toEqual({ turn, fade, running: ['sc-official-banner-fade', 'transform'] });

    page = await newScPage(officialBanner());
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    expect(await isOpen(page)).toBe(true);
    expect(await motion(page)).toEqual({ turn: 'none 0s ease', fade: 'none 0s ease', running: [] });

    page = await newScPage(officialBanner('ar'), { lang: 'ar' });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.click('sc-official-banner summary');
    expect(await motion(page)).toEqual({ turn: 'none 0s ease', fade, running: ['sc-official-banner-fade'] });
    // The turn is vertical, so Arabic does not mirror it.
    expect(await page.evaluate(() => getComputedStyle(document.querySelectorAll('sc-official-banner summary > span')[1], '::after').transform)).toBe('matrix(-1, 0, 0, -1, 0, 0)');
  });

  it('Enter and Space on the summary open and close it (native details)', async () => {
    const page = await newScPage(`<a href="#before">Before</a>${officialBanner()}`);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement!.tagName)).toBe('SUMMARY');
    await page.keyboard.press('Enter');
    expect(await isOpen(page)).toBe(true);
    await page.keyboard.press('Space');
    expect(await isOpen(page)).toBe(false);
  });

  it('open: two items in two columns from 600px with 24px icons, one column on phones, a 1px rule above', async () => {
    const page = await newScPage(officialBanner('en', { open: true }));
    await page.setViewport({ width: 1280, height: 800 });
    const wide = await page.evaluate(() => {
      const ps = Array.from(document.querySelectorAll('sc-official-banner details > div > p'));
      const icon = getComputedStyle(ps[0], '::before');
      return [ps.map((p) => Math.round(p.getBoundingClientRect().top)), icon.width, icon.height, getComputedStyle(document.querySelector('sc-official-banner details > div')!).borderTopWidth];
    });
    expect(new Set(wide[0] as number[]).size).toBe(1);
    expect(wide.slice(1)).toEqual(['24px', '24px', '1px']);
    await page.setViewport({ width: 375, height: 800 });
    const tops = await page.evaluate(() => Array.from(document.querySelectorAll('sc-official-banner details > div > p')).map((p) => Math.round(p.getBoundingClientRect().left)));
    expect(new Set(tops).size).toBe(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
  });

  it('item text is on-surface-variant, headings on-surface', async () => {
    const page = await newScPage(officialBanner('en', { open: true }));
    const c = await page.evaluate(() => [getComputedStyle(document.querySelector('sc-official-banner details > div > p')!).color, getComputedStyle(document.querySelector('sc-official-banner strong')!).color]);
    expect(c).toEqual([await resolve(page, 'on-surface-variant'), await resolve(page, 'on-surface')]);
  });

  it.each([
    [375, 20],
    [700, 32],
    [1200, 48],
    [1440, 80],
  ])('at %ipx wide uses the %ipx page margin', async (width, margin) => {
    const page = await newScPage(officialBanner());
    await page.setViewport({ width, height: 800 });
    expect(await page.evaluate(() => Math.round(document.querySelector('sc-official-banner summary')!.getBoundingClientRect().left))).toBe(margin);
  });

  it('mirrors in Arabic: the statement starts at the right margin and the icons sit at inline-start', async () => {
    const page = await newScPage(officialBanner('ar', { open: true }), { lang: 'ar' });
    await page.setViewport({ width: 1280, height: 800 });
    const m = await page.evaluate(() => {
      const s = document.querySelector('sc-official-banner summary > span')!.getBoundingClientRect();
      const p = document.querySelector('sc-official-banner details > div > p')!;
      const pr = p.getBoundingClientRect();
      return [Math.round(document.documentElement.clientWidth - s.right), Math.round(pr.right - p.querySelector('strong')!.getBoundingClientRect().right)];
    });
    expect(m).toEqual([48, 36]);
  });

  it.each(['en', 'ar'])('works with JavaScript disabled (%s): the summary is 44px and opens the panel', async (lang) => {
    const page = await noScriptPage(officialBanner(lang), lang);
    expect(await page.evaluate(() => Math.round(document.querySelector('sc-official-banner summary')!.getBoundingClientRect().height))).toBeGreaterThanOrEqual(44);
    await page.click('sc-official-banner summary');
    expect(await page.evaluate(() => (document.querySelector('sc-official-banner details > div') as HTMLElement).getBoundingClientRect().height)).toBeGreaterThan(40);
    await page.close();
  });

  it('hidden hides it', async () => {
    const page = await newScPage(officialBanner().replace('<sc-official-banner>', '<sc-official-banner hidden>'));
    expect(await page.evaluate(() => getComputedStyle(document.querySelector('sc-official-banner')!).display)).toBe('none');
  });
});

describeAxe('sc-official-banner', officialBanner() + officialBanner('en', { open: true }).replace('Official website of the Government of Dubai"', 'Official website of the Government of Dubai, open"'));
