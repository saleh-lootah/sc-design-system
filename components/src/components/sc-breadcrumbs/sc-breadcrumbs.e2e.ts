import { E2EPage } from '@stencil/core/testing';
import { describeAxe } from '../../test/axe';
import { newScPage, noScriptPage, setPageContext, settleTransitions } from '../../test/page';

/** A trail as a service writes it (CSS only): a named <nav>, an <ol> of links, the current page last. */
const crumbs = (links: [string, string][], current: string, label = 'Breadcrumb') =>
  `<sc-breadcrumbs><nav aria-label="${label}"><ol>${links.map(([href, text]) => `<li><a href="${href}">${text}</a></li>`).join('')}<li aria-current="page">${current}</li></ol></nav></sc-breadcrumbs>`;
const TRAIL_EN = crumbs([['#home', 'Home'], ['#vehicles', 'Vehicles']], 'Renew your vehicle registration');
const TRAIL_AR = crumbs([['#home', 'الرئيسية'], ['#vehicles', 'المركبات']], 'تجديد ترخيص المركبة', 'مسار التنقل');

/** Evaluates `expr` with `root` bound to the sc-breadcrumbs element. */
function read<T = unknown>(page: E2EPage, expr: string): Promise<T> {
  return page.evaluate((e: string) => {
    const root = document.querySelector('sc-breadcrumbs')!;
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

const TINY = crumbs([['#a', 'A'], ['#b', 'B'], ['#c', 'C']], 'D');
const ROUNDING = 1 / 32;
const overlaps = (a: { left: number; top: number; right: number; bottom: number }, b: typeof a) =>
  a.left < b.right - ROUNDING && b.left < a.right - ROUNDING && a.top < b.bottom - ROUNDING && b.top < a.bottom - ROUNDING;

export const ALL_STATES = `<main>${TRAIL_EN}<h1>Renew your vehicle registration</h1></main>`;

describe('sc-breadcrumbs (e2e, CSS only)', () => {
  it('exposes a navigation landmark with a list of links and the current page', async () => {
    const page = await newScPage(`${TRAIL_EN}`);
    type Node = { role: string; name?: string; children?: Node[] };
    const all = (n: Node): Node[] => [n, ...(n.children ?? []).flatMap(all)];
    const nodes = all((await page.accessibility.snapshot()) as Node).map((n) => `${n.role}:${n.name ?? ''}`);
    expect(nodes).toContain('navigation:Breadcrumb');
    expect(nodes).toContain('link:Home');
    expect(nodes).toContain('link:Vehicles');
    expect(await read(page, 'root.querySelector("[aria-current=page]").textContent')).toBe('Renew your vehicle registration');
    // CSS only: never registered, so it needs no JavaScript and never waits for an upgrade.
    expect(await page.evaluate(() => !!customElements.get('sc-breadcrumbs'))).toBe(false);
  });

  it('styles links label-medium in on-surface, underlined; the current page Bold; chevrons muted', async () => {
    const page = await newScPage(`${TRAIL_EN}`);
    const s = (sel: string, p: string) => read<string>(page, `getComputedStyle(root.querySelector("${sel}")).${p}`);
    expect(await s('a', 'color')).toBe(await token(page, '--sc-color-on-surface'));
    expect(await s('a', 'textDecorationLine')).toBe('underline');
    expect(await s('a', 'textUnderlineOffset')).toBe('4px');
    expect(await s('a', 'fontSize')).toBe('16px');
    expect(await s('[aria-current]', 'fontWeight')).toBe('700');
    expect(await s('[aria-current]', 'textDecorationLine')).toBe('none');
    expect(await read(page, 'getComputedStyle(root.querySelectorAll("li")[1], "::before").backgroundColor')).toBe(await token(page, '--sc-color-on-surface-variant'));
    expect(await read(page, 'getComputedStyle(root.querySelectorAll("li")[0], "::before").display')).toBe('none');
    await setPageContext(page, { lang: 'ar' });
    expect(await s('a', 'fontSize')).toBe('18px');
  });

  it('mirrors the chevrons in Arabic and runs from the right', async () => {
    const page = await newScPage(`${TRAIL_AR}`, { lang: 'ar' });
    expect(await read(page, 'getComputedStyle(root.querySelectorAll("li")[1], "::before").transform')).toBe('matrix(-1, 0, 0, 1, 0, 0)');
    const [first, second] = await read<number[]>(page, '[...root.querySelectorAll("a")].map((a) => a.getBoundingClientRect().left)');
    expect(first).toBeGreaterThan(second);
  });

  it.each([
    ['en', TRAIL_EN, 'Back to Vehicles', 'matrix(-1, 0, 0, 1, 0, 0)'],
    ['ar', TRAIL_AR, 'رجوع إلى المركبات', 'none'],
  ] as const)('collapses to one "Back to {parent}" link with a back chevron below 600px (%s)', async (lang, trail, name, flip) => {
    const page = await newScPage(trail, { lang });
    await page.setViewport({ width: 375, height: 640 });
    await page.waitForChanges();
    const visible = await read<number>(page, '[...root.querySelectorAll("li")].filter((li) => li.getBoundingClientRect().width > 0).length');
    expect(visible).toBe(1);
    const snap = await page.accessibility.snapshot({ root: (await page.$('sc-breadcrumbs li:nth-last-child(2) a'))! });
    expect(snap!.name).toBe(name);
    expect(await read<number>(page, 'root.querySelector("li:nth-last-child(2) a").getBoundingClientRect().height')).toBeGreaterThanOrEqual(44);
    expect(await read(page, 'getComputedStyle(root.querySelector("li:nth-last-child(2)"), "::before").transform')).toBe(flip);
  });

  it('takes its compact wording from --sc-breadcrumbs-back, and shows a two-item trail as one back link', async () => {
    const page = await newScPage(`<div style="--sc-breadcrumbs-back: 'Return to '">${crumbs([['#home', 'Home']], 'Pay a fine')}</div>`);
    await page.setViewport({ width: 375, height: 640 });
    const snap = await page.accessibility.snapshot({ root: (await page.$('sc-breadcrumbs a'))! });
    expect(snap!.name).toBe('Return to Home');
    expect(await read(page, 'getComputedStyle(root.querySelector("li"), "::before").display')).toBe('block');
  });

  it('works the same without JavaScript', async () => {
    const page = await noScriptPage(TRAIL_EN);
    const links = await page.evaluate(() => Array.from(document.querySelectorAll('sc-breadcrumbs a')).map((a) => [a.getAttribute('href'), getComputedStyle(a).textDecorationLine, getComputedStyle(a).paddingTop]));
    expect(links).toEqual([
      ['#home', 'underline', '10px'],
      ['#vehicles', 'underline', '10px'],
    ]);
    await page.close();
  });

  it('Tab reaches each ancestor link and Enter follows it', async () => {
    const page = await newScPage(`${TRAIL_EN}`);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement!.getAttribute('href'))).toBe('#vehicles');
    expect(await page.evaluate(() => getComputedStyle(document.activeElement!).outlineWidth)).toBe('3px');
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(await page.evaluate(() => location.hash)).toBe('#vehicles');
  });

  it('gives every ancestor link a 44 x 44 hit area without moving the layout, and no two overlap (A11Y-04)', async () => {
    for (const lang of ['en', 'ar'] as const) {
      for (const trail of [lang === 'en' ? TRAIL_EN : TRAIL_AR, TINY]) {
        const page = await newScPage(`<div style="padding: 24px">${trail}</div>`, { lang });
        // The visible link keeps its 10px padding: 40px tall in English (20px line), 44 in Arabic.
        expect(await read(page, 'getComputedStyle(root.querySelector("a")).paddingTop')).toBe('10px');
        const areas = await hitAreas(page);
        expect(areas.length).toBe(trail === TINY ? 3 : 2);
        for (const a of areas) {
          expect(a.right - a.left).toBeGreaterThanOrEqual(44 - ROUNDING);
          expect(a.bottom - a.top).toBeGreaterThanOrEqual(44 - ROUNDING);
          // The extension really takes the pointer: its corners hit the link.
          const hit = await read<string>(page, `document.elementFromPoint(${a.left + 1}, ${a.top + 1})?.closest("a")?.getAttribute("href") ?? ""`);
          expect(hit).not.toBe('');
        }
        for (let i = 0; i < areas.length; i++) for (let j = i + 1; j < areas.length; j++) expect(overlaps(areas[i], areas[j])).toBe(false);
      }
    }
  });

  it('keeps hit areas apart when the trail wraps onto several rows', async () => {
    const trail = crumbs(Array.from({ length: 8 }, (_, i): [string, string] => [`#p${i}`, `Page ${i}`]), 'Here');
    const page = await newScPage(`<div style="inline-size: 260px">${trail}</div>`);
    const areas = await hitAreas(page);
    const rows = new Set(areas.map((a) => Math.round(a.top)));
    expect(rows.size).toBeGreaterThan(1);
    for (let i = 0; i < areas.length; i++) for (let j = i + 1; j < areas.length; j++) expect(overlaps(areas[i], areas[j])).toBe(false);
  });

  it('keeps the underline in every state: rest, hover and focus (R6: a navigation link that stays underlined)', async () => {
    for (const lang of ['en', 'ar'] as const) {
      const page = await newScPage(`${lang === 'en' ? TRAIL_EN : TRAIL_AR}`, { lang });
      const deco = () => read<string>(page, '(() => { const s = getComputedStyle(root.querySelector("a")); return s.textDecorationLine + " " + s.textDecorationThickness; })()');
      expect(await deco()).toBe('underline 1px');
      await page.hover('sc-breadcrumbs a');
      await settleTransitions(page);
      expect(await deco()).toBe('underline 2px');
      await page.mouse.move(0, 400);
      await page.keyboard.press('Tab');
      await settleTransitions(page);
      expect(await deco()).toBe('underline 1px');
    }
  });

  it('follows a link on release only: pressing, sliding off and releasing does nothing (WCAG 2.5.2)', async () => {
    const page = await newScPage(`${TRAIL_EN}<div style="block-size: 400px"></div>`);
    await pressAndSlideOff(page, 'sc-breadcrumbs a[href="#vehicles"]', 300, 300);
    expect(await page.evaluate(() => location.hash)).toBe('');
    await page.click('sc-breadcrumbs a[href="#vehicles"]');
    await page.waitForChanges();
    expect(await page.evaluate(() => location.hash)).toBe('#vehicles');
  });

  describeAxe('sc-breadcrumbs', ALL_STATES);
});
