import { E2EPage } from '@stencil/core/testing';
import { describeAxe } from '../../test/axe';
import { newScPage, setPageContext, settleTransitions } from '../../test/page';

const TRAIL_EN = `<a href="#home">Home</a><a href="#vehicles">Vehicles</a><span>Renew your vehicle registration</span>`;
const TRAIL_AR = `<a href="#home">الرئيسية</a><a href="#vehicles">المركبات</a><span>تجديد ترخيص المركبة</span>`;

function read<T = unknown>(page: E2EPage, expr: string): Promise<T> {
  return page.evaluate((e: string) => {
    const root = document.querySelector('sc-breadcrumbs')!.shadowRoot!;
    // eslint-disable-next-line no-new-func
    return new Function('root', `return (${e});`)(root);
  }, expr) as Promise<T>;
}

const token = (page: E2EPage, name: string) =>
  page.evaluate((n: string) => {
    const probe = document.createElement('i');
    probe.style.color = `var(${n})`;
    document.body.append(probe);
    const v = getComputedStyle(probe).color;
    probe.remove();
    return v;
  }, name);

/** Each ancestor link's hit area (the link box grown by its ::after extension), in page px. */
const hitAreas = (page: E2EPage) =>
  read<{ left: number; top: number; right: number; bottom: number }[]>(
    page,
    `[...root.querySelectorAll("a")].filter((a) => a.getBoundingClientRect().width > 0).map((a) => {
      const r = a.getBoundingClientRect();
      const s = getComputedStyle(a, "::after");
      return { left: r.left + parseFloat(s.left), top: r.top + parseFloat(s.top), right: r.right - parseFloat(s.right), bottom: r.bottom - parseFloat(s.bottom) };
    })`,
  );

/** Presses on the element's centre, slides the pointer off to (x, y), and releases there. */
async function pressAndSlideOff(page: E2EPage, selector: string, x: number, y: number) {
  const box = (await (await page.$(selector))!.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(x, y, { steps: 4 });
  await page.mouse.up();
  await page.waitForChanges();
}

const TINY = `<a href="#a">A</a><a href="#b">B</a><a href="#c">C</a><span>D</span>`;
const ROUNDING = 1 / 32;
const overlaps = (a: { left: number; top: number; right: number; bottom: number }, b: typeof a) =>
  a.left < b.right - ROUNDING && b.left < a.right - ROUNDING && a.top < b.bottom - ROUNDING && b.top < a.bottom - ROUNDING;

export const ALL_STATES = `<main><sc-breadcrumbs>${TRAIL_EN}</sc-breadcrumbs><h1>Renew your vehicle registration</h1></main>`;

describe('sc-breadcrumbs (e2e)', () => {
  it('exposes a navigation landmark with a list of links and the current page', async () => {
    const page = await newScPage(`<sc-breadcrumbs>${TRAIL_EN}</sc-breadcrumbs>`);
    type Node = { role: string; name?: string; children?: Node[] };
    const all = (n: Node): Node[] => [n, ...(n.children ?? []).flatMap(all)];
    const nodes = all((await page.accessibility.snapshot()) as Node).map((n) => `${n.role}:${n.name ?? ''}`);
    expect(nodes).toContain('navigation:Breadcrumb');
    expect(nodes).toContain('link:Home');
    expect(nodes).toContain('link:Vehicles');
    expect(await read(page, 'root.querySelector("[aria-current=page]").textContent')).toBe('Renew your vehicle registration');
    // The light-DOM children are not rendered once upgraded.
    expect(await page.$eval('sc-breadcrumbs > a', (a) => (a as HTMLElement).getBoundingClientRect().width)).toBe(0);
  });

  it('styles links label-medium in on-surface, underlined; the current page Bold; chevrons muted', async () => {
    const page = await newScPage(`<sc-breadcrumbs>${TRAIL_EN}</sc-breadcrumbs>`);
    const s = (sel: string, p: string) => read<string>(page, `getComputedStyle(root.querySelector("${sel}")).${p}`);
    expect(await s('a', 'color')).toBe(await token(page, '--sc-color-on-surface'));
    expect(await s('a', 'textDecorationLine')).toBe('underline');
    expect(await s('a', 'textUnderlineOffset')).toBe('4px');
    expect(await s('a', 'fontSize')).toBe('16px');
    expect(await s('[aria-current]', 'fontWeight')).toBe('700');
    expect(await s('[aria-current]', 'textDecorationLine')).toBe('none');
    expect(await s('.sep', 'color')).toBe(await token(page, '--sc-color-on-surface-variant'));
    await setPageContext(page, { lang: 'ar' });
    expect(await s('a', 'fontSize')).toBe('18px');
  });

  it('mirrors the chevrons in Arabic and runs from the right', async () => {
    const page = await newScPage(`<sc-breadcrumbs>${TRAIL_AR}</sc-breadcrumbs>`, { lang: 'ar' });
    expect(await read(page, 'getComputedStyle(root.querySelector(".sep")).transform')).toBe('matrix(-1, 0, 0, 1, 0, 0)');
    const [first, second] = await read<number[]>(page, '[...root.querySelectorAll("a")].map((a) => a.getBoundingClientRect().left)');
    expect(first).toBeGreaterThan(second);
  });

  it('collapses to one "Back to {parent}" link below 600px', async () => {
    const page = await newScPage(`<sc-breadcrumbs>${TRAIL_EN}</sc-breadcrumbs>`);
    await page.setViewport({ width: 375, height: 640 });
    await page.waitForChanges();
    const visible = await read<string[]>(page, '[...root.querySelectorAll("li")].filter((li) => li.getBoundingClientRect().width > 0).map((li) => li.innerText.trim())');
    expect(visible).toEqual(['Back to Vehicles']);
    const snap = await page.accessibility.snapshot({ root: (await page.$('sc-breadcrumbs >>> .item--parent a'))! });
    expect(snap!.name).toBe('Back to Vehicles');
    expect(await read<number>(page, 'root.querySelector(".item--parent a").getBoundingClientRect().height')).toBeGreaterThanOrEqual(44);
  });

  it('Tab reaches each ancestor link and Enter follows it', async () => {
    const page = await newScPage(`<sc-breadcrumbs>${TRAIL_EN}</sc-breadcrumbs>`);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    expect(await read(page, 'root.activeElement.getAttribute("href")')).toBe('#vehicles');
    expect(await read(page, 'getComputedStyle(root.activeElement).outlineWidth')).toBe('3px');
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(await page.evaluate(() => location.hash)).toBe('#vehicles');
  });

  it('re-renders when its children change', async () => {
    const page = await newScPage(`<sc-breadcrumbs>${TRAIL_EN}</sc-breadcrumbs>`);
    await page.evaluate(() => {
      document.querySelector('sc-breadcrumbs > span')!.textContent = 'Pay a fine';
    });
    await page.waitForChanges();
    expect(await read(page, 'root.querySelector("[aria-current]").textContent')).toBe('Pay a fine');
  });

  it('gives every ancestor link a 44 x 44 hit area without moving the layout, and no two overlap (A11Y-04)', async () => {
    for (const lang of ['en', 'ar'] as const) {
      for (const trail of [lang === 'en' ? TRAIL_EN : TRAIL_AR, TINY]) {
        const page = await newScPage(`<div style="padding: 24px"><sc-breadcrumbs>${trail}</sc-breadcrumbs></div>`, { lang });
        // The visible link keeps its 10px padding: 40px tall in English (20px line), 44 in Arabic.
        expect(await read(page, 'getComputedStyle(root.querySelector("a")).paddingTop')).toBe('10px');
        const areas = await hitAreas(page);
        expect(areas.length).toBe(trail === TINY ? 3 : 2);
        for (const a of areas) {
          expect(a.right - a.left).toBeGreaterThanOrEqual(44 - ROUNDING);
          expect(a.bottom - a.top).toBeGreaterThanOrEqual(44 - ROUNDING);
          // The extension really takes the pointer: its corners hit the link.
          const hit = await read<string>(page, `root.elementFromPoint(${a.left + 1}, ${a.top + 1})?.closest("a")?.getAttribute("href") ?? ""`);
          expect(hit).not.toBe('');
        }
        for (let i = 0; i < areas.length; i++) for (let j = i + 1; j < areas.length; j++) expect(overlaps(areas[i], areas[j])).toBe(false);
      }
    }
  });

  it('keeps hit areas apart when the trail wraps onto several rows', async () => {
    const trail = Array.from({ length: 8 }, (_, i) => `<a href="#p${i}">Page ${i}</a>`).join('') + '<span>Here</span>';
    const page = await newScPage(`<div style="inline-size: 260px"><sc-breadcrumbs>${trail}</sc-breadcrumbs></div>`);
    const areas = await hitAreas(page);
    const rows = new Set(areas.map((a) => Math.round(a.top)));
    expect(rows.size).toBeGreaterThan(1);
    for (let i = 0; i < areas.length; i++) for (let j = i + 1; j < areas.length; j++) expect(overlaps(areas[i], areas[j])).toBe(false);
  });

  it('keeps the underline in every state: rest, hover and focus (R6: a navigation link that stays underlined)', async () => {
    for (const lang of ['en', 'ar'] as const) {
      const page = await newScPage(`<sc-breadcrumbs>${lang === 'en' ? TRAIL_EN : TRAIL_AR}</sc-breadcrumbs>`, { lang });
      const deco = () => read<string>(page, '(() => { const s = getComputedStyle(root.querySelector("a")); return s.textDecorationLine + " " + s.textDecorationThickness; })()');
      expect(await deco()).toBe('underline 1px');
      await page.hover('sc-breadcrumbs >>> a');
      await settleTransitions(page);
      expect(await deco()).toBe('underline 2px');
      await page.mouse.move(0, 400);
      await page.keyboard.press('Tab');
      await settleTransitions(page);
      expect(await deco()).toBe('underline 1px');
    }
  });

  it('follows a link on release only: pressing, sliding off and releasing does nothing (WCAG 2.5.2)', async () => {
    const page = await newScPage(`<sc-breadcrumbs>${TRAIL_EN}</sc-breadcrumbs><div style="block-size: 400px"></div>`);
    await pressAndSlideOff(page, 'sc-breadcrumbs >>> a[href="#vehicles"]', 300, 300);
    expect(await page.evaluate(() => location.hash)).toBe('');
    await page.click('sc-breadcrumbs >>> a[href="#vehicles"]');
    await page.waitForChanges();
    expect(await page.evaluate(() => location.hash)).toBe('#vehicles');
  });

  describeAxe('sc-breadcrumbs', ALL_STATES);
});
