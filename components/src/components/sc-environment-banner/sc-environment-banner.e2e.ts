import { E2EPage } from '@stencil/core/testing';
import { describeAxe } from '../../test/axe';
import { environmentBanner } from '../../test/chrome';
import { newScPage, noScriptPage } from '../../test/page';

const role = (page: E2EPage, prop: 'color' | 'backgroundColor', name: string) =>
  page.evaluate(
    (p: string, r: string) => {
      const i = document.createElement('i');
      (i.style as unknown as Record<string, string>)[p] = `var(--sc-color-${r})`;
      document.body.append(i);
      const c = (getComputedStyle(i) as unknown as Record<string, string>)[p];
      i.remove();
      return c;
    },
    prop,
    name,
  );

describe('sc-environment-banner (e2e, CSS only)', () => {
  it('is not a registered custom element: a labelled region, an inverse band with a 4px striped top edge', async () => {
    const page = await newScPage(environmentBanner());
    expect(await page.evaluate(() => !!customElements.get('sc-environment-banner'))).toBe(false);
    expect(JSON.stringify(await page.accessibility.snapshot())).toContain('Test version');
    const s = await page.evaluate(() => {
      const cs = getComputedStyle(document.querySelector('sc-environment-banner')!);
      return [cs.backgroundColor, cs.color, cs.borderTopWidth, cs.borderImageSource.startsWith('repeating-linear-gradient')];
    });
    expect(s).toEqual([await role(page, 'backgroundColor', 'inverse-surface'), await role(page, 'color', 'inverse-on-surface'), '4px', true]);
  });

  it('the environment name is a warning chip; the message is label-medium', async () => {
    const page = await newScPage(environmentBanner());
    const s = await page.evaluate(() => {
      const cs = getComputedStyle(document.querySelector('sc-environment-banner strong')!);
      const p = getComputedStyle(document.querySelector('sc-environment-banner p')!);
      return [cs.backgroundColor, cs.color, cs.borderRadius, p.fontSize, p.fontWeight];
    });
    expect(s).toEqual([await role(page, 'backgroundColor', 'warning-container'), await role(page, 'color', 'on-warning-container'), '6px', '16px', '500']);
  });

  it.each([
    [375, 20],
    [1440, 80],
  ])('at %ipx wide uses the %ipx page margin and does not scroll sideways', async (width, margin) => {
    const page = await newScPage(environmentBanner());
    await page.setViewport({ width, height: 800 });
    expect(await page.evaluate(() => Math.round(document.querySelector('sc-environment-banner strong')!.getBoundingClientRect().left))).toBe(margin);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });

  it('mirrors in Arabic: the chip starts at the right margin', async () => {
    const page = await newScPage(environmentBanner('ar'), { lang: 'ar' });
    await page.setViewport({ width: 1280, height: 800 });
    expect(await page.evaluate(() => Math.round(document.documentElement.clientWidth - document.querySelector('sc-environment-banner strong')!.getBoundingClientRect().right))).toBe(48);
  });

  it('is in the flow, never sticky or fixed, and has no controls', async () => {
    const page = await newScPage(environmentBanner());
    expect(await page.evaluate(() => [getComputedStyle(document.querySelector('sc-environment-banner')!).position, document.querySelectorAll('sc-environment-banner button').length])).toEqual(['static', 0]);
  });

  it('shows with JavaScript disabled', async () => {
    const page = await noScriptPage(environmentBanner());
    expect(await page.evaluate(() => Math.round(document.querySelector('sc-environment-banner')!.getBoundingClientRect().height))).toBeGreaterThanOrEqual(44);
    await page.close();
  });
});

describeAxe('sc-environment-banner', environmentBanner() + environmentBanner('en', 'Staging').replace('Test version', 'Test version, staging'));
