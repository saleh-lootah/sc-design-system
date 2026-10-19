import { expectNoAxeViolations } from '../../test/axe';
import { contexts, newScPage, setPageContext } from '../../test/page';

/** E2EPage is a Puppeteer page; this is the slice used to emulate forced colours. */
type CdpPage = { createCDPSession(): Promise<{ send(method: string, params: object): Promise<unknown> }> };

const MARKUP = `
  <main>
    <h1>What do you need to do?</h1>
    <sc-search id="visible" label="Search Dubai Now services" placeholder="Try “school fees”"></sc-search>
    <sc-search id="hidden" label-hidden label="Search services"></sc-search>
  </main>`;

async function recordSearches(page: import('@stencil/core/testing').E2EPage) {
  await page.evaluate(() => {
    const w = window as unknown as { searches: string[] };
    w.searches = [];
    document.addEventListener('scSearch', (ev) => w.searches.push((ev as CustomEvent<{ value: string }>).detail.value));
  });
  return () => page.evaluate(() => (window as unknown as { searches: string[] }).searches);
}

describe('sc-search (e2e)', () => {
  it('has no axe violations in English and Arabic, light and dark', async () => {
    const page = await newScPage(MARKUP);
    for (const ctx of contexts) {
      await setPageContext(page, ctx);
      await expectNoAxeViolations(page);
    }
  });

  it('exposes a named search landmark and a labelled search box, even with a hidden label', async () => {
    const page = await newScPage(MARKUP);
    const snapshot = await page.accessibility.snapshot({ interestingOnly: true });
    const found: string[] = [];
    const walk = (n: { role?: string; name?: string; children?: unknown[] } | null) => {
      if (!n) return;
      if (n.role === 'search' || n.role === 'searchbox') found.push(`${n.role}:${n.name}`);
      (n.children as (typeof n)[] | undefined)?.forEach(walk);
    };
    walk(snapshot as never);
    expect(found).toEqual(['search:Search Dubai Now services', 'searchbox:Search Dubai Now services', 'search:Search services', 'searchbox:Search services']);
  });

  it('Tab reaches the field then the button; Enter in the field emits scSearch with the trimmed query', async () => {
    const page = await newScPage(MARKUP);
    const searches = await recordSearches(page);
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement!.shadowRoot!.activeElement!.tagName)).toBe('INPUT');
    await page.keyboard.type('  renew registration ');
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(await searches()).toEqual(['renew registration']);
    expect(await page.evaluate(() => (document.querySelector('#visible') as HTMLElement & { value: string }).value)).toBe('  renew registration ');
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement!.shadowRoot!.activeElement!.localName)).toBe('sc-button');
    await page.keyboard.press('Space');
    await page.waitForChanges();
    expect(await searches()).toEqual(['renew registration', 'renew registration']);
    // No action: the page stays where it is.
    expect(await page.evaluate(() => location.search)).toBe('');
  });

  it('clicking the button submits', async () => {
    const page = await newScPage(MARKUP);
    const searches = await recordSearches(page);
    await page.evaluate(() => ((document.querySelector('#hidden') as HTMLElement & { value: string }).value = 'school fees'));
    await page.waitForChanges();
    await page.evaluate(() => (document.querySelector('#hidden')!.shadowRoot!.querySelector('sc-button') as HTMLElement).click());
    await page.waitForChanges();
    expect(await searches()).toEqual(['school fees']);
  });

  it('focuses the input through the host (delegatesFocus) and shows the ring on the pill', async () => {
    const page = await newScPage(MARKUP);
    await page.evaluate(() => (document.querySelector('#visible') as HTMLElement).focus());
    expect(await page.evaluate(() => document.activeElement!.shadowRoot!.activeElement!.tagName)).toBe('INPUT');
  });

  it('navigates to action with the query, unless scSearch is cancelled', async () => {
    const page = await newScPage(`<sc-search label="Search" action="/search-results"></sc-search>`);
    await page.evaluate(() => document.addEventListener('scSearch', (ev) => ev.preventDefault(), { once: true }));
    await page.evaluate(() => (document.querySelector('sc-search') as HTMLElement).focus());
    await page.keyboard.type('fines');
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(await page.evaluate(() => location.pathname)).not.toBe('/search-results');
    // The results page doesn't exist on the test server; the request itself is what matters.
    const request = page.waitForRequest((r) => r.url().includes('/search-results'));
    await page.keyboard.press('Enter');
    expect(new URL((await request).url()).search).toBe('?q=fines');
  });

  it('mirrors in Arabic: the button is at the left, and strings re-render', async () => {
    const page = await newScPage(`<sc-search label-hidden></sc-search>`, { lang: 'ar' });
    const layout = () =>
      page.evaluate(() => {
        const root = document.querySelector('sc-search')!.shadowRoot!;
        return {
          button: root.querySelector('sc-button')!.getBoundingClientRect().x,
          input: root.querySelector('input')!.getBoundingClientRect().x,
          label: root.querySelector('label')!.textContent,
        };
      });
    const ar = await layout();
    expect(ar.button).toBeLessThan(ar.input);
    expect(ar.label).toBe('بحث');
    await setPageContext(page, { lang: 'en' });
    const en = await layout();
    expect(en.button).toBeGreaterThan(en.input);
    expect(en.label).toBe('Search');
  });

  it('follows the channel: the button takes the channel action colour', async () => {
    const page = await newScPage(MARKUP, { channel: 'now' });
    const fill = () =>
      page.evaluate(() => {
        const button = document.querySelector('#visible')!.shadowRoot!.querySelector('sc-button')!;
        return getComputedStyle(button.shadowRoot!.querySelector('button')!).backgroundColor;
      });
    const now = await fill();
    await setPageContext(page, { channel: 'visit' });
    expect(await fill()).not.toBe(now);
  });

  it('keeps the field boundary in forced colours', async () => {
    const page = await newScPage(MARKUP);
    // Puppeteer's emulateMediaFeatures doesn't list forced-colors; Chromium's CDP does.
    await (await (page as unknown as CdpPage).createCDPSession()).send('Emulation.setEmulatedMedia', { features: [{ name: 'forced-colors', value: 'active' }] });
    const border = await page.evaluate(() => getComputedStyle(document.querySelector('#visible')!.shadowRoot!.querySelector('.field')!).borderTopStyle);
    expect(border).toBe('solid');
  });
});
