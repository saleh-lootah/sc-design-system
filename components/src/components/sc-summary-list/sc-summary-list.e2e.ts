import { E2EPage } from '@stencil/core/testing';
import { describeAxe } from '../../test/axe';
import { newScPage, setPageContext } from '../../test/page';

/** E2EPage is a Puppeteer page; this is the slice used to emulate forced colours. */
type CdpPage = { createCDPSession(): Promise<{ send(method: string, params: object): Promise<unknown> }> };

export const CYA = `
  <main>
    <h1>Check your answers before you pay</h1>
    <h2>Renewal</h2>
    <sc-summary-list id="renewal">
      <sc-summary-row label="Vehicle">Nissan Patrol 2021, white</sc-summary-row>
      <sc-summary-row label="Plate">Dubai <sc-ltr>A 48213</sc-ltr></sc-summary-row>
      <sc-summary-row label="Renew for" action-href="#renew-for">1 year, until 3 November 2027</sc-summary-row>
      <sc-summary-row label="Insurance" action-href="#insurance">Valid until 14 March 2027</sc-summary-row>
    </sc-summary-list>
    <sc-summary-list appearance="plain" id="plain">
      <sc-summary-row label="Mobile number" action-href="#mobile"><sc-ltr>+971 50 123 4567</sc-ltr></sc-summary-row>
    </sc-summary-list>
    <h2>Payment</h2>
    <sc-summary-list layout="pairs" id="pay">
      <sc-summary-row label="Paying for">Vehicle registration renewal</sc-summary-row>
      <sc-summary-row label="Payment reference" action-href="#ignored"><sc-ltr>DT-2026-0048213</sc-ltr></sc-summary-row>
      <sc-summary-row label="Amount" variant="total"><sc-ltr>AED 420.00</sc-ltr></sc-summary-row>
    </sc-summary-list>
  </main>`;

/** Bounding boxes of the key, value and action of row n (0-based) in the list. */
function boxes(page: E2EPage, sel: string, n: number) {
  return page.evaluate(
    (s: string, i: number) => {
      const row = document.querySelector(s)!.querySelectorAll('.sc-summary-list__row')[i];
      const box = (q: string) => {
        const el = row.querySelector(q);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, w: r.width, h: r.height, right: r.right };
      };
      return { key: box('.sc-summary-list__key'), value: box('.sc-summary-list__value'), text: box('sc-summary-row'), action: box('.sc-summary-list__action') };
    },
    sel,
    n,
  );
}

describe('sc-summary-list (e2e)', () => {
  it('renders one light-DOM dl whose children are div groups of dt and dd, with each row inside its value dd', async () => {
    const page = await newScPage(CYA);
    const structure = await page.evaluate(() => {
      const list = document.querySelector('#renewal')!;
      const dl = list.querySelector('dl')!;
      return {
        shadow: !!list.shadowRoot,
        rows: Array.from(dl.children).map((row) => `${row.tagName}:${Array.from(row.children).map((c) => c.tagName).join(',')}`),
        inDd: Array.from(list.querySelectorAll('sc-summary-row')).every((r) => r.parentElement!.matches('dd.sc-summary-list__value')),
        value: (dl.querySelectorAll('dd.sc-summary-list__value')[1] as HTMLElement).innerText,
      };
    });
    expect(structure.shadow).toBe(false);
    expect(structure.rows).toEqual(['DIV:DT,DD', 'DIV:DT,DD', 'DIV:DT,DD,DD', 'DIV:DT,DD,DD']);
    expect(structure.inDd).toBe(true);
    expect(structure.value).toBe('Dubai A 48213');
  });

  it('gives each action a name that includes the key, and Tab and Enter follow it', async () => {
    const page = await newScPage(CYA);
    const names = await page.evaluate(() => Array.from(document.querySelectorAll('#renewal a')).map((a) => a.textContent));
    expect(names).toEqual(['Change Renew for', 'Change Insurance']);
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement!.textContent)).toBe('Change Renew for');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(await page.evaluate(() => location.hash)).toBe('#insurance');
  });

  it('has 44px action targets, underlined in the channel action colour', async () => {
    const page = await newScPage(CYA);
    const r = await page.evaluate(() => {
      const a = document.querySelector('#renewal a')!;
      const box = a.getBoundingClientRect();
      const cs = getComputedStyle(a);
      return [box.width >= 44, box.height >= 44, cs.textDecorationLine, cs.textUnderlineOffset];
    });
    expect(r).toEqual([true, true, 'underline', '4px']);
  });

  it('is a flat 12px card with a 1px outline-variant edge', async () => {
    const page = await newScPage(CYA);
    const r = await page.evaluate(() => {
      const cs = getComputedStyle(document.querySelector('#renewal dl')!);
      return [cs.borderTopLeftRadius, cs.borderTopWidth, cs.boxShadow];
    });
    expect(r).toEqual(['12px', '1px', 'none']);
  });

  it('shows three aligned columns when wide, with a fixed 96px action column', async () => {
    const page = await newScPage(`<div style="inline-size: 800px">${CYA}</div>`);
    const noAction = await boxes(page, '#renewal', 0);
    const withAction = await boxes(page, '#renewal', 2);
    expect(Math.abs(noAction.key!.y - noAction.value!.y)).toBeLessThan(3);
    expect(noAction.value!.x).toBe(withAction.value!.x);
    expect(withAction.value!.x).toBeGreaterThan(withAction.key!.x + withAction.key!.w - 1);
    const col = await page.evaluate(() => getComputedStyle(document.querySelectorAll('#renewal .sc-summary-list__row')[2]).gridTemplateColumns);
    expect(col.split(' ').pop()).toBe('96px');
  });

  it('stacks key above value when narrow, with the action in a 64px end column', async () => {
    const page = await newScPage(`<div style="inline-size: 360px">${CYA}</div>`);
    const b = await boxes(page, '#renewal', 2);
    expect(b.value!.y).toBeGreaterThan(b.key!.y);
    expect(b.key!.x).toBe(b.value!.x);
    expect(b.action!.x).toBeGreaterThan(b.value!.x);
    const col = await page.evaluate(() => getComputedStyle(document.querySelectorAll('#renewal .sc-summary-list__row')[2]).gridTemplateColumns);
    expect(col.split(' ').pop()).toBe('64px');
  });

  it('pairs: a fixed key column, values end-aligned (left in Arabic), no actions, a filled total row', async () => {
    const page = await newScPage(`<div style="inline-size: 360px">${CYA}</div>`);
    const read = () =>
      page.evaluate(() => {
        const list = document.querySelector('#pay')!;
        const value = list.querySelectorAll('.sc-summary-list__value')[0] as HTMLElement;
        const total = list.querySelector('.sc-summary-list__row--total')!;
        const v = value.getBoundingClientRect();
        const text = value.querySelector('sc-summary-row')!.getBoundingClientRect();
        return {
          align: getComputedStyle(value).textAlign,
          endGap: Math.round(getComputedStyle(document.documentElement).direction === 'rtl' ? 0 : v.right - text.right),
          actions: list.querySelectorAll('a').length,
          keyCol: getComputedStyle(list.querySelector('.sc-summary-list__row')!).gridTemplateColumns.split(' ')[0],
          totalFill: getComputedStyle(total).backgroundColor !== 'rgba(0, 0, 0, 0)',
          totalWeight: getComputedStyle(total.querySelector('dt')!).fontWeight,
        };
      });
    const en = await read();
    expect(en.align).toBe('end');
    expect(en.actions).toBe(0);
    expect(en.keyCol).toBe('104px');
    expect(en.totalFill).toBe(true);
    expect(en.totalWeight).toBe('700');
    await setPageContext(page, { lang: 'ar' });
    const ar = await read();
    expect(ar.keyCol).toBe('120px');
    const r = await page.evaluate(() => {
      const value = document.querySelector('#pay .sc-summary-list__value')!.getBoundingClientRect();
      const text = document.querySelector('#pay sc-summary-row')!;
      const range = document.createRange();
      range.selectNodeContents(text);
      return Math.round(range.getBoundingClientRect().left - value.left);
    });
    expect(r).toBe(0);
  });

  it('mirrors in Arabic: the key is at the right and the action at the left', async () => {
    const page = await newScPage(`<div style="inline-size: 800px">${CYA}</div>`, { lang: 'ar' });
    const b = await boxes(page, '#renewal', 2);
    expect(b.key!.x).toBeGreaterThan(b.value!.x);
    expect(b.value!.x).toBeGreaterThan(b.action!.x);
  });

  it('re-renders the action text when the language changes', async () => {
    const page = await newScPage(CYA);
    const first = () => page.evaluate(() => document.querySelector('#renewal a')!.textContent);
    expect(await first()).toBe('Change Renew for');
    await setPageContext(page, { lang: 'ar' });
    expect(await first()).toBe('تغيير Renew for');
  });

  it('follows the channel: the action takes the channel action colour', async () => {
    const page = await newScPage(CYA, { channel: 'now' });
    const colour = () => page.evaluate(() => getComputedStyle(document.querySelector('#renewal a')!).color);
    const now = await colour();
    await setPageContext(page, { channel: 'transport' });
    expect(await colour()).not.toBe(now);
  });

  it('updates when rows are added, removed or changed', async () => {
    const page = await newScPage(CYA);
    await page.evaluate(() => {
      const row = document.createElement('sc-summary-row');
      row.setAttribute('label', 'Registration card');
      row.textContent = 'Digital card in Dubai Now';
      document.querySelector('#renewal')!.append(row);
      document.querySelector('#renewal sc-summary-row')!.remove();
    });
    await page.waitForChanges();
    const keys = () => page.evaluate(() => Array.from(document.querySelectorAll('#renewal dt')).map((d) => d.textContent));
    expect(await keys()).toEqual(['Plate', 'Renew for', 'Insurance', 'Registration card']);
    const value = await page.evaluate(() => (document.querySelectorAll('#renewal dd.sc-summary-list__value')[3] as HTMLElement).innerText);
    expect(value).toBe('Digital card in Dubai Now');
    await page.evaluate(() => {
      const row = document.querySelector('#renewal sc-summary-row') as HTMLElement & { label: string; actionHref: string };
      row.label = 'Plate number';
      row.actionHref = '#plate';
    });
    await page.waitForChanges();
    expect((await keys())[0]).toBe('Plate number');
    expect(await page.evaluate(() => document.querySelector('#renewal a')!.getAttribute('href'))).toBe('#plate');
  });

  it('matches board 09.04: rows 14 by 16, a 200px key column when wide, a headline-small total, surface-container in dark', async () => {
    const page = await newScPage(`<div style="inline-size: 800px">${CYA}</div>`);
    const probe = (name: string) =>
      page.evaluate((n: string) => {
        const i = document.createElement('i');
        i.style.backgroundColor = `var(${n})`;
        document.querySelector('main')!.append(i);
        const v = getComputedStyle(i).backgroundColor;
        i.remove();
        return v;
      }, name);
    const read = () =>
      page.evaluate(() => {
        const row = getComputedStyle(document.querySelector('#renewal .sc-summary-list__row')!);
        const total = document.querySelector('#pay .sc-summary-list__row--total')!;
        return {
          pad: [row.paddingTop, row.paddingInlineStart],
          keyCol: row.gridTemplateColumns.split(' ')[0],
          totalSize: getComputedStyle(total.querySelector('.sc-summary-list__value')!).fontSize,
          card: getComputedStyle(document.querySelector('#renewal dl')!).backgroundColor,
          totalFill: getComputedStyle(total).backgroundColor,
        };
      });
    const light = await read();
    expect(light.pad).toEqual(['14px', '16px']);
    expect(light.keyCol).toBe('200px');
    expect(light.totalSize).toBe('24px');
    expect(light.card).toBe(await probe('--sc-color-surface-card'));
    await setPageContext(page, { theme: 'dark' });
    const dark = await read();
    expect(dark.card).toBe(await probe('--sc-color-surface-container'));
    expect(dark.totalFill).toBe(await probe('--sc-color-surface-container-high'));
  });

  it('keeps the card edge and link colour in forced colours', async () => {
    const page = await newScPage(CYA);
    await (await (page as unknown as CdpPage).createCDPSession()).send('Emulation.setEmulatedMedia', { features: [{ name: 'forced-colors', value: 'active' }] });
    const r = await page.evaluate(() => [getComputedStyle(document.querySelector('#renewal dl')!).borderTopColor, getComputedStyle(document.querySelector('#renewal a')!).textDecorationLine]);
    expect(r[0]).not.toBe('rgba(0, 0, 0, 0)');
    expect(r[1]).toBe('underline');
  });
});

describeAxe('sc-summary-list', CYA);
