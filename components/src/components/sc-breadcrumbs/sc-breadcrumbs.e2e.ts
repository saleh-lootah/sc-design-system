import { E2EPage } from '@stencil/core/testing';
import { describeAxe } from '../../test/axe';
import { newScPage, setPageContext } from '../../test/page';

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
    // Targets are at least 24px tall (WCAG 2.5.8).
    expect(await read(page, 'root.querySelector("a").getBoundingClientRect().height')).toBeGreaterThanOrEqual(24);
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

  describeAxe('sc-breadcrumbs', ALL_STATES);
});
