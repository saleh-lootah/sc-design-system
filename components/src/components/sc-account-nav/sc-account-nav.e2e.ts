import { E2EPage } from '@stencil/core/testing';
import { describeAxe } from '../../test/axe';
import { newScPage, setPageContext } from '../../test/page';

const ITEMS = `
  <a href="#applications" data-icon="description">Applications</a>
  <a href="#payments" data-icon="credit-card" aria-current="page">Payments</a>
  <a href="#notifications" data-icon="notifications" data-count="3" data-count-label="3 unread">Notifications</a>
  <a href="#profile" data-icon="person">Profile and settings</a>
  <a href="#sign-out" data-icon="logout" data-sign-out>Sign out</a>`;

function read<T = unknown>(page: E2EPage, expr: string): Promise<T> {
  return page.evaluate((e: string) => {
    const root = document.querySelector('sc-account-nav')!.shadowRoot!;
    const items = [...root.querySelectorAll('a')];
    // eslint-disable-next-line no-new-func
    return new Function('root', 'items', `return (${e});`)(root, items);
  }, expr) as Promise<T>;
}

const token = (page: E2EPage, name: string, prop: 'color' | 'backgroundColor' = 'color') =>
  page.evaluate(
    (n: string, p: string) => {
      const probe = document.createElement('i');
      probe.style.setProperty(p === 'color' ? 'color' : 'background-color', `var(${n})`);
      document.body.append(probe);
      const v = getComputedStyle(probe)[p as 'color'];
      probe.remove();
      return v;
    },
    name,
    prop,
  );

export const ALL_STATES = `<main><h1>Payments and receipts</h1><div style="inline-size: 300px"><sc-account-nav>${ITEMS}</sc-account-nav></div></main>`;

describe('sc-account-nav (e2e)', () => {
  it('lays out 48px items with 24px icons, label-large Medium (Bold in Arabic)', async () => {
    const page = await newScPage(ALL_STATES);
    expect(await read(page, 'Math.round(items[0].getBoundingClientRect().height)')).toBeGreaterThanOrEqual(48);
    expect(await read(page, 'items[0].querySelector("svg").getBoundingClientRect().width')).toBe(24);
    expect(await read(page, 'getComputedStyle(items[0]).fontSize')).toBe('18px');
    expect(await read(page, 'getComputedStyle(items[0]).fontWeight')).toBe('500');
    expect(await read(page, 'getComputedStyle(items[0]).color')).toBe(await token(page, '--sc-color-on-surface'));
    expect(await read(page, 'getComputedStyle(items[0].querySelector("svg")).color')).toBe(await token(page, '--sc-color-on-surface-variant'));
    await setPageContext(page, { lang: 'ar' });
    expect(await read(page, 'getComputedStyle(items[0]).fontSize')).toBe('20px');
    expect(await read(page, 'getComputedStyle(items[0]).fontWeight')).toBe('700');
  });

  it('marks the current item with a channel-subtle fill, a 3px channel bar at inline-start, a channel-action icon and Bold label', async () => {
    const page = await newScPage(ALL_STATES);
    expect(await read(page, 'getComputedStyle(items[1]).backgroundColor')).toBe(await token(page, '--sc-color-channel-subtle', 'backgroundColor'));
    expect(await read(page, 'getComputedStyle(items[1]).fontWeight')).toBe('700');
    expect(await read(page, 'getComputedStyle(items[1]).color')).toBe(await token(page, '--sc-color-channel-action'));
    expect(await read(page, 'getComputedStyle(items[1].querySelector("svg")).color')).toBe(await token(page, '--sc-color-channel-action'));
    expect(await read(page, 'getComputedStyle(items[1], "::before").width')).toBe('3px');
    expect(await read(page, 'getComputedStyle(items[1], "::before").backgroundColor')).toBe(await token(page, '--sc-color-channel-action', 'backgroundColor'));
    expect(await read(page, 'getComputedStyle(items[1], "::before").left')).toBe('0px');
  });

  it('puts the bar and icons on the right in Arabic', async () => {
    const page = await newScPage(ALL_STATES, { lang: 'ar' });
    const iconRight = await read<boolean>(page, 'items[1].querySelector("svg").getBoundingClientRect().left > items[1].querySelector(".label").getBoundingClientRect().left');
    expect(iconRight).toBe(true);
    expect(await read(page, 'getComputedStyle(items[1], "::before").right')).toBe('0px');
    expect(await read(page, 'getComputedStyle(items[4].querySelector("svg")).transform')).toBe('matrix(-1, 0, 0, 1, 0, 0)');
  });

  it('names items with their badge text, and the current one with aria-current', async () => {
    const page = await newScPage(ALL_STATES);
    const names = await page.evaluate(() => [...document.querySelector('sc-account-nav')!.shadowRoot!.querySelectorAll('a')].map((a) => a.textContent));
    expect(names[2]).toBe('Notifications3 3 unread');
    const snap = await page.accessibility.snapshot({ root: (await page.$('sc-account-nav >>> a[href="#notifications"]'))! });
    expect(snap!.name).toBe('Notifications 3 unread');
    const badge = (p: string) => read<string>(page, `getComputedStyle(items[2].querySelector(".badge")).${p}`);
    expect(await badge('backgroundColor')).toBe(await token(page, '--sc-color-channel-action', 'backgroundColor'));
    expect(await badge('color')).toBe(await token(page, '--sc-color-channel-on-action'));
    expect(Math.round(Number.parseFloat(await badge('height')))).toBe(24);
  });

  it('Tab moves through the items, Enter follows one', async () => {
    const page = await newScPage(ALL_STATES);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    expect(await read(page, 'root.activeElement.getAttribute("href")')).toBe('#payments');
    expect(await read(page, 'getComputedStyle(root.activeElement).outlineWidth')).toBe('3px');
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(await page.evaluate(() => location.hash)).toBe('#payments');
  });

  it('becomes one scrolling row of 44px items below 600px', async () => {
    const page = await newScPage(`<sc-account-nav>${ITEMS}</sc-account-nav>`);
    await page.setViewport({ width: 375, height: 600 });
    await page.waitForChanges();
    const tops = await read<number[]>(page, 'items.map((a) => Math.round(a.getBoundingClientRect().top))');
    expect(new Set(tops).size).toBe(1);
    expect(await read(page, 'Math.round(items[0].getBoundingClientRect().height)')).toBe(44);
    expect(await read(page, 'getComputedStyle(root.querySelector("nav")).overflowX')).toBe('auto');
  });

  it('re-renders when the current item changes', async () => {
    const page = await newScPage(ALL_STATES);
    await page.evaluate(() => {
      document.querySelector('sc-account-nav [aria-current]')!.removeAttribute('aria-current');
      document.querySelector('sc-account-nav [href="#profile"]')!.setAttribute('aria-current', 'page');
    });
    await page.waitForChanges();
    expect(await read(page, 'root.querySelector("[aria-current]").getAttribute("href")')).toBe('#profile');
  });

  describeAxe('sc-account-nav', ALL_STATES);
});
