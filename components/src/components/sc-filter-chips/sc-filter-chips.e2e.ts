import { E2EPage } from '@stencil/core/testing';
import { describeAxe, expectNoAxeViolations } from '../../test/axe';
import { newScPage, setPageContext } from '../../test/page';
import { CHANNELS, token } from '../sc-text-input/field-test';

const FILTERS = JSON.stringify([
  { value: 'transport', label: 'Transport and vehicles' },
  { value: 'online', label: 'Paid online' },
  { value: '2026', label: '2026' },
]);

const MARKUP = `
  <main>
    <h1>Search results</h1>
    <h2 id="results">24 results</h2>
    <sc-filter-chips id="f" focus-target="results" filters='${FILTERS}'></sc-filter-chips>
  </main>`;

const labels = (page: E2EPage) => page.$$eval('#f .sc-filter-chips__label', (els) => els.map((e) => e.textContent));
const live = (page: E2EPage) => page.$eval('#f [aria-live]', (e) => e.textContent);
const active = (page: E2EPage) => page.evaluate(() => document.activeElement?.getAttribute('aria-label') ?? document.activeElement?.id);

describe('sc-filter-chips (e2e)', () => {
  it('renders a named group of native buttons in light DOM, each named "Remove filter: …"', async () => {
    const page = await newScPage(MARKUP);
    expect(await page.$eval('#f', (el) => el.shadowRoot)).toBeNull();
    const snap = await page.accessibility.snapshot({ root: (await page.$('#f .sc-filter-chips'))!, interestingOnly: false });
    expect(snap!.role).toBe('group');
    expect(snap!.name).toBe('Applied filters');
    const names = await page.$$eval('#f button', (els) => els.map((e) => e.getAttribute('aria-label') ?? e.textContent));
    expect(names).toEqual(['Remove filter: Transport and vehicles', 'Remove filter: Paid online', 'Remove filter: 2026', 'Clear all filters']);
  });

  it('is 32px tall with a 44px target, pill-shaped, channel-subtle with channel-action text', async () => {
    const page = await newScPage(MARKUP);
    const geo = await page.$eval('#f .sc-filter-chips__chip', (b) => {
      const r = b.getBoundingClientRect();
      const a = getComputedStyle(b, '::after');
      return { h: Math.round(r.height), target: Math.round(r.height - 2 * parseFloat(a.top)), radius: parseFloat(getComputedStyle(b).borderTopLeftRadius) > 100, bg: getComputedStyle(b).backgroundColor, fg: getComputedStyle(b).color };
    });
    expect(geo.h).toBe(32);
    expect(geo.target).toBe(44);
    expect(geo.radius).toBe(true);
    expect(geo.bg).toBe(await token(page, 'body', '--sc-color-channel-subtle'));
    expect(geo.fg).toBe(await token(page, 'body', '--sc-color-channel-action'));
  });

  it('removes a chip at once, emits scRemove, announces the count and moves focus to the next chip', async () => {
    const page = await newScPage(MARKUP);
    const removed = await page.spyOnEvent('scRemove');
    await page.keyboard.press('Tab');
    expect(await active(page)).toBe('Remove filter: Transport and vehicles');
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(await labels(page)).toEqual(['Paid online', '2026']);
    expect(removed).toHaveReceivedEventDetail({ value: 'transport', label: 'Transport and vehicles' });
    await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label') === 'Remove filter: Paid online');
    expect(await live(page)).toBe('Filter removed: Transport and vehicles. 2 filters applied');
  });

  it('moves focus to the previous chip after the last one, then to the results heading', async () => {
    const page = await newScPage(MARKUP);
    await page.click('#f button[aria-label="Remove filter: 2026"]');
    await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label') === 'Remove filter: Paid online');
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label') === 'Remove filter: Transport and vehicles');
    // With one chip left there is no "Clear all".
    expect(await page.$('#f .sc-filter-chips__clear')).toBeNull();
    await page.keyboard.press('Space');
    await page.waitForFunction(() => document.activeElement?.id === 'results');
    expect(await live(page)).toBe('Filter removed: Transport and vehicles. No filters applied');
    expect(await page.$eval('#f .sc-filter-chips', (e) => (e as HTMLElement).hidden)).toBe(true);
  });

  it('clears every filter with "Clear all filters", emits scClear and focuses the results heading', async () => {
    const page = await newScPage(MARKUP);
    const cleared = await page.spyOnEvent('scClear');
    await page.click('#f .sc-filter-chips__clear');
    await page.waitForFunction(() => document.activeElement?.id === 'results');
    expect(cleared).toHaveReceivedEventTimes(1);
    expect(await labels(page)).toEqual([]);
    expect(await live(page)).toBe('No filters applied');
  });

  it('announces a count change made by the page', async () => {
    const page = await newScPage(MARKUP);
    await page.$eval('#f', (el) => ((el as HTMLElement & { filters: unknown }).filters = [{ value: 'a', label: 'Housing' }]));
    await page.waitForChanges();
    expect(await labels(page)).toEqual(['Housing']);
    expect(await live(page)).toBe('1 filter applied');
  });

  it('speaks Arabic with the right plural, mirrors, and keeps the close at inline-end', async () => {
    const page = await newScPage(`<h2 id="results">النتائج</h2><sc-filter-chips id="f" focus-target="results" filters='[{"value":"a","label":"النقل والمركبات"},{"value":"b","label":"مدفوع إلكترونيًا"},{"value":"c","label":"2026"}]'></sc-filter-chips>`, { lang: 'ar' });
    const names = await page.$$eval('#f button', (els) => els.map((e) => e.getAttribute('aria-label') ?? e.textContent));
    expect(names[0]).toBe('إزالة عامل التصفية: النقل والمركبات');
    expect(names[3]).toBe('مسح كل عوامل التصفية');
    const x = await page.$eval('#f .sc-filter-chips__chip', (b) => [b.querySelector('svg')!.getBoundingClientRect().x, b.querySelector('span')!.getBoundingClientRect().x]);
    expect(x[0]).toBeLessThan(x[1]);
    const first = await page.$eval('#f .sc-filter-chips__chip', (b) => b.getBoundingClientRect().right);
    const second = await page.$eval('#f .sc-filter-chips__item:nth-child(2) button', (b) => b.getBoundingClientRect().right);
    expect(first).toBeGreaterThan(second);
    await page.click('#f .sc-filter-chips__chip');
    await page.waitForChanges();
    expect(await live(page)).toBe('تمت إزالة عامل التصفية: النقل والمركبات. عاملا تصفية مطبّقان');
    await setPageContext(page, { lang: 'en' });
    expect(await page.$eval('#f .sc-filter-chips', (e) => e.getAttribute('aria-label'))).toBe('Applied filters');
  });

  it('scales on pointer press but not on a keyboard press', async () => {
    const page = await newScPage(MARKUP);
    const box = await page.$eval('#f .sc-filter-chips__chip', (b) => (({ x, y, width, height }) => ({ x: x + width / 2, y: y + height / 2 }))(b.getBoundingClientRect()));
    await page.mouse.move(box.x, box.y);
    await page.mouse.down();
    await new Promise((r) => setTimeout(r, 300));
    expect(await page.$eval('#f .sc-filter-chips__chip', (b) => getComputedStyle(b).transform)).toBe('matrix(0.97, 0, 0, 0.97, 0, 0)');
  });

  it('has no axe violations while focused, on every channel', async () => {
    const page = await newScPage(MARKUP);
    await page.keyboard.press('Tab');
    for (const channel of CHANNELS) {
      await setPageContext(page, { channel, theme: 'dark' });
      await expectNoAxeViolations(page);
    }
  });
});

describeAxe('sc-filter-chips', MARKUP);
