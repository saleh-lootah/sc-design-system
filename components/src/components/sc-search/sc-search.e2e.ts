import { E2EPage } from '@stencil/core/testing';
import { describeAxe } from '../../test/axe';
import { newScPage, setPageContext } from '../../test/page';
import { forceColors, inner, token } from '../sc-text-input/field-test';

const MARKUP = `
  <main>
    <h1>What do you need to do?</h1>
    <sc-search id="visible" label="Search Dubai Now services" placeholder="Try “school fees”"></sc-search>
    <sc-search id="hidden" label-hidden label="Search services"></sc-search>
    <sc-search id="hero" size="l" label-hidden label="Search all services"></sc-search>
  </main>`;

async function recordSearches(page: E2EPage) {
  await page.evaluate(() => {
    const w = window as unknown as { searches: string[] };
    w.searches = [];
    document.addEventListener('scSearch', (ev) => w.searches.push((ev as CustomEvent<{ value: string }>).detail.value));
  });
  return () => page.evaluate(() => (window as unknown as { searches: string[] }).searches);
}

describe('sc-search (e2e)', () => {
  it('exposes a named search landmark and a labelled search box in light DOM, even with a hidden label', async () => {
    const page = await newScPage(MARKUP);
    expect(await inner(page, '#visible', 'host.shadowRoot')).toBeNull();
    const snapshot = await page.accessibility.snapshot({ interestingOnly: true });
    const found: string[] = [];
    const walk = (n: { role?: string; name?: string; children?: unknown[] } | null) => {
      if (!n) return;
      if (n.role === 'search' || n.role === 'searchbox') found.push(`${n.role}:${n.name}`);
      (n.children as (typeof n)[] | undefined)?.forEach(walk);
    };
    walk(snapshot as never);
    expect(found).toEqual([
      'search:Search Dubai Now services',
      'searchbox:Search Dubai Now services',
      'search:Search services',
      'searchbox:Search services',
      'search:Search all services',
      'searchbox:Search all services',
    ]);
  });

  it('Tab reaches the field then the button; Enter in the field submits through the button natively', async () => {
    const page = await newScPage(MARKUP);
    const searches = await recordSearches(page);
    await page.keyboard.press('Tab');
    expect(await inner(page, '#visible', 'document.activeElement === input')).toBe(true);
    await page.keyboard.type('  renew registration ');
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(await searches()).toEqual(['renew registration']);
    expect(await page.$eval('#visible', (el) => (el as HTMLElement & { value: string }).value)).toBe('  renew registration ');
    await page.keyboard.press('Tab');
    expect(await inner(page, '#visible', 'document.activeElement === q("sc-button button")')).toBe(true);
    await page.keyboard.press('Space');
    await page.waitForChanges();
    expect(await searches()).toEqual(['renew registration', 'renew registration']);
    expect(await page.evaluate(() => location.search)).toBe('');
  });

  it('clicking the button submits', async () => {
    const page = await newScPage(MARKUP);
    const searches = await recordSearches(page);
    await page.$eval('#hidden', (el) => ((el as HTMLElement & { value: string }).value = 'school fees'));
    await page.waitForChanges();
    await page.click('#hidden sc-button');
    expect(await searches()).toEqual(['school fees']);
  });

  it('focuses the input through the host and draws the U1 ring round the field box', async () => {
    const page = await newScPage(MARKUP);
    await page.evaluate(() => (document.querySelector('#visible') as HTMLElement).focus());
    expect(await inner(page, '#visible', 'document.activeElement === input')).toBe(true);
    expect(await inner(page, '#visible', '[getComputedStyle(q(".sc-search__field")).outlineWidth, getComputedStyle(q(".sc-search__field")).outlineOffset]')).toEqual(['3px', '2px']);
    expect(await inner(page, '#visible', 'getComputedStyle(input).outlineStyle')).toBe('none');
  });

  it('is 56px with an 8px field and a 4px button 12 apart; the hero size is 64px', async () => {
    const page = await newScPage(MARKUP);
    const geo = (sel: string) =>
      inner<number[]>(page, sel, '(() => { const f = q(".sc-search__field").getBoundingClientRect(); const b = q("sc-button button").getBoundingClientRect(); return [Math.round(f.height), Math.round(b.height), Math.round(b.left - f.right), parseFloat(getComputedStyle(q(".sc-search__field")).borderTopLeftRadius), parseFloat(getComputedStyle(q("sc-button button")).borderTopLeftRadius)]; })()');
    expect(await geo('#visible')).toEqual([56, 56, 12, 8, 4]);
    expect((await geo('#hero')).slice(0, 2)).toEqual([64, 64]);
    expect(await inner(page, '#visible', 'getComputedStyle(q(".sc-search__field")).borderTopColor')).toBe(await token(page, 'body', '--sc-color-outline'));
  });

  it('navigates to action with the query, unless scSearch is cancelled', async () => {
    const page = await newScPage(`<sc-search label="Search" action="/search-results"></sc-search>`);
    await page.evaluate(() => document.addEventListener('scSearch', (ev) => ev.preventDefault(), { once: true }));
    await page.evaluate(() => (document.querySelector('sc-search') as HTMLElement).focus());
    await page.keyboard.type('fines');
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(await page.evaluate(() => location.pathname)).not.toBe('/search-results');
    const request = page.waitForRequest((r) => r.url().includes('/search-results'));
    await page.keyboard.press('Enter');
    expect(new URL((await request).url()).search).toBe('?q=fines');
  });

  it('turns Arabic-Indic digits into Latin digits (LANG-21)', async () => {
    const page = await newScPage(`<sc-search label-hidden></sc-search>`, { lang: 'ar' });
    await page.evaluate(() => (document.querySelector('sc-search') as HTMLElement).focus());
    await page.keyboard.type('مخالفة ١٢٣');
    expect(await inner(page, 'sc-search', 'input.value')).toBe('مخالفة 123');
  });

  it('strips bidi control characters from a pasted value (R9, LANG-21)', async () => {
    const page = await newScPage(`<sc-search id="s" label-hidden></sc-search>`, { lang: 'ar' });
    // A code copied from an Arabic SMS carries LANG-15 isolates: U+2066 ... U+2069.
    await page.evaluate((sel: string) => {
      const field = document.querySelector(sel)!.querySelector('input') as HTMLInputElement;
      field.focus();
      document.execCommand('insertText', false, String.fromCharCode(0x2066) + '123456' + String.fromCharCode(0x2069));
    }, '#s');
    await page.waitForChanges();
    expect(await page.evaluate((sel: string) => (document.querySelector(sel)!.querySelector('input') as HTMLInputElement).value, '#s')).toBe('123456');
    expect(await page.evaluate((sel: string) => (document.querySelector(sel)!.querySelector('input') as HTMLInputElement).selectionStart, '#s')).toBe(6);
    expect(await page.$eval('#s', (el) => (el as HTMLElement & { value: string }).value)).toBe('123456');
  });

  it('mirrors in Arabic: the icon on the right and the button on the left; strings re-render', async () => {
    const page = await newScPage(`<sc-search label-hidden></sc-search>`, { lang: 'ar' });
    const layout = () => inner<{ button: number; input: number; icon: number; label: string; text: string }>(page, 'sc-search', '({ button: q("sc-button").getBoundingClientRect().x, input: input.getBoundingClientRect().x, icon: q(".sc-search__icon").getBoundingClientRect().x, label: q("label").textContent, text: q("sc-button").textContent })');
    const ar = await layout();
    expect(ar.button).toBeLessThan(ar.input);
    expect(ar.icon).toBeGreaterThan(ar.input);
    expect([ar.label, ar.text]).toEqual(['بحث', 'بحث']);
    await setPageContext(page, { lang: 'en' });
    const en = await layout();
    expect(en.button).toBeGreaterThan(en.input);
    expect([en.label, en.text]).toEqual(['Search', 'Search']);
  });

  it('follows the channel: the button takes the channel action colour', async () => {
    const page = await newScPage(MARKUP, { channel: 'now' });
    const fill = () => inner<string>(page, '#visible', 'getComputedStyle(q("sc-button button")).backgroundColor');
    const now = await fill();
    await setPageContext(page, { channel: 'visit' });
    expect(await fill()).not.toBe(now);
  });

  it('keeps the field boundary in forced colours', async () => {
    const page = await newScPage(MARKUP);
    await forceColors(page);
    expect(await inner(page, '#visible', 'getComputedStyle(q(".sc-search__field")).borderTopStyle')).toBe('solid');
  });
});

describeAxe('sc-search', MARKUP);
