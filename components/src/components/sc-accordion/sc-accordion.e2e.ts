import { E2EPage } from '@stencil/core/testing';
import { describeAxe } from '../../test/axe';
import { newScPage, setPageContext } from '../../test/page';

export const FAQ = `
  <main>
    <h2>Frequently asked questions</h2>
    <sc-accordion id="faq" show-all>
      <details id="d1"><summary>How long does renewal take?<small>Online, in most cases</small></summary><p>Usually about 10 minutes, once your vehicle has passed its technical test.</p></details>
      <details id="d2"><summary>What do I need?</summary><p>A valid insurance policy and a passed technical test.</p><p>Pay any traffic fines first.</p></details>
      <details id="d3"><summary>Can I renew for 2 years?</summary><p>Yes, for vehicles under 3 years old.</p></details>
    </sc-accordion>
  </main>`;

const chevron = (page: E2EPage, id: string) =>
  page.evaluate((s: string) => {
    const summary = document.querySelector(`${s} > summary`)!;
    const after = getComputedStyle(summary, '::after');
    const r = summary.getBoundingClientRect();
    return { transform: after.transform, width: after.width, transition: after.transitionDuration, height: r.height, left: r.left, right: r.right };
  }, id);

describe('sc-accordion (e2e)', () => {
  it('opens and closes a section with Enter and Space, exposing its state', async () => {
    const page = await newScPage(FAQ);
    await page.keyboard.press('Tab'); // show all
    await page.keyboard.press('Tab'); // first summary
    await page.keyboard.press('Enter');
    expect(await page.evaluate(() => (document.querySelector('#d1') as HTMLDetailsElement).open)).toBe(true);
    await page.keyboard.press('Space');
    expect(await page.evaluate(() => (document.querySelector('#d1') as HTMLDetailsElement).open)).toBe(false);
    const snap = (await page.accessibility.snapshot()) as unknown;
    const found: { name?: string; expanded?: boolean }[] = [];
    const walk = (n: { role?: string; name?: string; expanded?: boolean; children?: unknown[] } | null) => {
      if (!n) return;
      if (n.role === 'DisclosureTriangle' || n.role === 'button') found.push({ name: n.name, expanded: n.expanded });
      (n.children as (typeof n)[] | undefined)?.forEach(walk);
    };
    walk(snap as never);
    expect(found.find((f) => f.name?.startsWith('How long'))).toBeTruthy();
  });

  it('draws 56px summaries with a 24px chevron at the end that turns over when open; instant from the keyboard', async () => {
    const page = await newScPage(FAQ);
    let c = await chevron(page, '#d2');
    expect(c.height).toBeGreaterThanOrEqual(56);
    expect(c.width).toBe('24px');
    expect(c.transform).toBe('none');
    expect(c.transition).toBe('0.12s');
    await page.evaluate(() => ((document.querySelector('#d2') as HTMLDetailsElement).open = true));
    await page.evaluate(() => document.getAnimations().forEach((a) => a.finish()));
    c = await chevron(page, '#d2');
    expect(c.transform).toBe('matrix(-1, 0, 0, -1, 0, 0)');
    await page.focus('#d2 > summary');
    await page.keyboard.press('Shift');
    expect((await chevron(page, '#d2')).transition).toBe('0s');
  });

  it('puts the chevron on the left in Arabic, without mirroring it', async () => {
    const page = await newScPage(FAQ);
    await setPageContext(page, { lang: 'ar' });
    const r = await page.evaluate(() => {
      const summary = document.querySelector('#d3 > summary')!;
      const text = document.createRange();
      text.selectNodeContents(summary);
      return { textRight: text.getBoundingClientRect().right, summaryRight: summary.getBoundingClientRect().right, gridCols: getComputedStyle(summary).gridTemplateColumns };
    });
    expect(Math.round(r.summaryRight - r.textRight)).toBeLessThan(2);
    expect(r.gridCols.endsWith('24px')).toBe(true);
  });

  it('show all opens every section, then hides them, and tracks manual toggles', async () => {
    const page = await newScPage(FAQ);
    const state = () =>
      page.evaluate(() => {
        const b = document.querySelector('#faq .sc-accordion__toggle')!;
        return [b.textContent, b.getAttribute('aria-expanded'), Array.from(document.querySelectorAll('#faq details')).filter((d) => (d as HTMLDetailsElement).open).length];
      });
    expect(await state()).toEqual(['Show all sections', 'false', 0]);
    await page.click('#faq .sc-accordion__toggle');
    await page.waitForChanges();
    expect(await state()).toEqual(['Hide all sections', 'true', 3]);
    await page.click('#d2 > summary');
    await page.waitForChanges();
    expect(await state()).toEqual(['Show all sections', 'false', 2]);
  });

  it('rules the sections with outline-variant and sets summaries at title-medium (Arabic scale in Arabic)', async () => {
    const page = await newScPage(FAQ);
    const read = () =>
      page.evaluate(() => {
        const d = document.querySelector('#d1')!;
        const s = getComputedStyle(d.querySelector('summary')!);
        return [getComputedStyle(d).borderTopWidth, getComputedStyle(document.querySelector('#d3')!).borderBottomWidth, s.fontSize, s.fontWeight];
      });
    expect(await read()).toEqual(['1px', '1px', '18px', '700']);
    await setPageContext(page, { lang: 'ar' });
    expect((await read())[2]).toBe('20px');
  });

  it('sets the answer in body-medium, 8 apart, clear of the chevron column, with 2 under the title (board 09.10)', async () => {
    const page = await newScPage(FAQ);
    await page.evaluate(() => ((document.querySelector('#d2') as HTMLDetailsElement).open = true));
    await page.waitForChanges();
    const r = await page.evaluate(() => {
      const ps = document.querySelectorAll('#d2 > p');
      const s = getComputedStyle(document.querySelector('#d1 > summary')!);
      const p = getComputedStyle(ps[1]);
      return [getComputedStyle(ps[0]).fontSize, getComputedStyle(ps[0]).marginBlockStart, p.marginBlockStart, p.paddingInlineEnd, s.rowGap];
    });
    expect(r).toEqual(['16px', '8px', '8px', '40px', '2px']);
  });
});

describeAxe('sc-accordion', FAQ);
