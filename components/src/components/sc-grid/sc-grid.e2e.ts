import { expectNoAxeViolations } from '../../test/axe';
import { newScPage, setPageContext } from '../../test/page';

const CELLS = Array.from({ length: 3 }, (_, i) => `<div class="cell">${i + 1}</div>`).join('');

const layout = (page: import('@stencil/core/testing').E2EPage, sel: string) =>
  page.evaluate((s: string) => {
    const grid = document.querySelector(s)!;
    const cs = getComputedStyle(grid.shadowRoot!.querySelector('.grid')!);
    return {
      columns: cs.gridTemplateColumns.split(' ').length,
      gap: cs.columnGap,
      cells: Array.from(grid.children).map((c) => {
        const r = c.getBoundingClientRect();
        return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width) };
      }),
    };
  }, sel);

describe('sc-grid (e2e)', () => {
  it.each([
    [375, 4, '16px'],
    [700, 8, '20px'],
    [1200, 12, '24px'],
    [1440, 12, '24px'],
  ])('at %ipx wide has %i columns and %s gutters', async (width, columns, gap) => {
    const page = await newScPage(`<sc-grid id="g">${CELLS}</sc-grid>`);
    await page.setViewport({ width, height: 800 });
    await page.waitForChanges();
    const l = await layout(page, '#g');
    expect(l.columns).toBe(columns);
    expect(l.gap).toBe(gap);
  });

  it('puts service cards three to a row on desktop, two on tablets and one on phones', async () => {
    const page = await newScPage(`<sc-grid id="g" span-medium="4" span-expanded="4">${CELLS}</sc-grid>`);
    const rows = async (width: number) => {
      await page.setViewport({ width, height: 800 });
      await page.waitForChanges();
      return new Set((await layout(page, '#g')).cells.map((c) => c.y)).size;
    };
    expect(await rows(1280)).toBe(1);
    expect(await rows(800)).toBe(2);
    expect(await rows(375)).toBe(3);
  });

  it('honours --sc-grid-span per item, capped at the columns available', async () => {
    const page = await newScPage(`<sc-grid id="g"><div style="--sc-grid-span: 8">a</div><div style="--sc-grid-span: 4">b</div></sc-grid>`);
    await page.setViewport({ width: 1280, height: 800 });
    await page.waitForChanges();
    let l = await layout(page, '#g');
    expect(l.cells[0].y).toBe(l.cells[1].y);
    expect(l.cells[0].w).toBeGreaterThan(l.cells[1].w * 1.9);
    await page.setViewport({ width: 375, height: 800 });
    await page.waitForChanges();
    l = await layout(page, '#g');
    expect(l.cells[0].w).toBe(l.cells[1].w);
  });

  it('starts from the right in Arabic', async () => {
    const page = await newScPage(`<sc-grid id="g" span="2">${CELLS}</sc-grid>`, { lang: 'ar' });
    await page.setViewport({ width: 375, height: 800 });
    await page.waitForChanges();
    const l = await layout(page, '#g');
    expect(l.cells[0].x).toBeGreaterThan(l.cells[1].x);
    await setPageContext(page, { lang: 'en' });
    const en = await layout(page, '#g');
    expect(en.cells[0].x).toBeLessThan(en.cells[1].x);
  });

  it('has no axe violations', async () => {
    const page = await newScPage(`<main><sc-grid>${CELLS}</sc-grid></main>`);
    await expectNoAxeViolations(page);
  });
});
