import { E2EPage } from '@stencil/core/testing';
import { describeAxe } from '../../test/axe';
import { newScPage, setPageContext } from '../../test/page';

function read<T = unknown>(page: E2EPage, expr: string, sel = 'sc-pagination'): Promise<T> {
  return page.evaluate(
    (e: string, s: string) => {
      const root = document.querySelector(s)!.shadowRoot!;
      // eslint-disable-next-line no-new-func
      return new Function('root', `return (${e});`)(root);
    },
    expr,
    sel,
  ) as Promise<T>;
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

const PAGER = `<sc-pagination page="7" total-items="1284" item-label="fine|fines" href-template="#page-{page}"></sc-pagination>`;
export const ALL_STATES = `<main><h1>Your traffic fines</h1>${PAGER}<sc-pagination id="b" page="1" total-pages="3"></sc-pagination></main>`;

describe('sc-pagination (e2e)', () => {
  it('draws 44px cells with 4px corners; the current page filled in the channel action colour, Bold', async () => {
    const page = await newScPage(PAGER);
    expect(await read(page, 'Math.round(root.querySelector(".cell").getBoundingClientRect().height)')).toBe(44);
    expect(await read(page, 'Math.round(root.querySelector(".cell").getBoundingClientRect().width)')).toBeGreaterThanOrEqual(44);
    expect(await read(page, 'getComputedStyle(root.querySelector(".cell")).borderTopLeftRadius')).toBe('4px');
    const cur = (p: string) => read<string>(page, `getComputedStyle(root.querySelector(".cell--current")).${p}`);
    expect(await cur('backgroundColor')).toBe(
      await page.evaluate(() => {
        const probe = document.createElement('i');
        probe.style.backgroundColor = 'var(--sc-color-channel-action)';
        document.body.append(probe);
        return getComputedStyle(probe).backgroundColor;
      }),
    );
    expect(await cur('color')).toBe(await token(page, '--sc-color-channel-on-action'));
    expect(await cur('fontWeight')).toBe('700');
    expect(await read(page, 'getComputedStyle(root.querySelector(".cell:not(.cell--current)")).fontWeight')).toBe('500');
    expect(await read(page, 'getComputedStyle(root.querySelector(".turn")).color')).toBe(await token(page, '--sc-color-channel-action'));
    expect(await read(page, 'getComputedStyle(root.querySelector(".turn")).textDecorationLine')).toBe('underline');
    expect(await read(page, 'getComputedStyle(root.querySelector(".cell")).fontSize')).toBe('18px');
    await setPageContext(page, { lang: 'ar' });
    expect(await read(page, 'getComputedStyle(root.querySelector(".cell")).fontSize')).toBe('20px');
  });

  it('shows the results count above the navigation', async () => {
    const page = await newScPage(PAGER);
    expect(await read(page, 'root.querySelector(".count").textContent')).toBe('Showing 121–140 of 1,284 fines');
    await setPageContext(page, { lang: 'ar' });
    expect(await read(page, 'root.querySelector(".count").textContent')).toBe('عرض 121 إلى 140 من 1,284 fines');
  });

  it('puts Previous on the right in Arabic, with its chevron pointing right', async () => {
    const page = await newScPage(PAGER, { lang: 'ar' });
    const [prev, next] = await read<number[]>(page, '[...root.querySelectorAll(".turn")].map((t) => t.getBoundingClientRect().left)');
    expect(prev).toBeGreaterThan(next);
    expect(await read(page, 'getComputedStyle(root.querySelector(".turn svg")).transform')).toBe('matrix(-1, 0, 0, 1, 0, 0)');
  });

  it('follows a page link with Enter and fires scPageChange; preventDefault keeps the page', async () => {
    const page = await newScPage(PAGER);
    const spy = await page.spyOnEvent('scPageChange');
    await page.keyboard.press('Tab'); // Previous
    await page.keyboard.press('Tab'); // 1
    expect(await read(page, 'root.activeElement.getAttribute("aria-label")')).toBe('Page 1');
    expect(await read(page, 'getComputedStyle(root.activeElement).outlineWidth')).toBe('3px');
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(spy).toHaveReceivedEventDetail({ page: 1 });
    expect(await page.evaluate(() => location.hash)).toBe('#page-1');

    await page.evaluate(() => document.addEventListener('scPageChange', (e) => e.preventDefault()));
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(await page.evaluate(() => location.hash)).toBe('#page-1');
  });

  it('as buttons, Space chooses a page', async () => {
    const page = await newScPage(`<sc-pagination page="1" total-pages="3"></sc-pagination>`);
    const spy = await page.spyOnEvent('scPageChange');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await page.waitForChanges();
    expect(spy).toHaveReceivedEventDetail({ page: 2 });
  });

  it('shows Previous, "Page 7 of 65" and Next below 600px', async () => {
    const page = await newScPage(PAGER);
    await page.setViewport({ width: 375, height: 600 });
    await page.waitForChanges();
    const visible = await read<string[]>(page, '[...root.querySelectorAll(".list > li")].filter((li) => li.getBoundingClientRect().width > 0).map((li) => li.textContent)');
    expect(visible).toEqual(['Previous', 'Page 7 of 65', 'Next']);
  });

  it('scales a number cell on pointer press only', async () => {
    const page = await newScPage(PAGER);
    const box = await read<{ x: number; y: number }>(page, '(() => { const r = root.querySelector(".cell").getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; })()');
    await page.mouse.move(box.x, box.y);
    await page.mouse.down();
    await page.waitForFunction(() => getComputedStyle(document.querySelector('sc-pagination')!.shadowRoot!.querySelector('.cell')!).transform !== 'none');
    await page.mouse.up();
  });

  describeAxe('sc-pagination', ALL_STATES);
});
