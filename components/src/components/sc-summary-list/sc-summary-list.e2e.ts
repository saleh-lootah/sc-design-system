import { E2EPage } from '@stencil/core/testing';
import { expectNoAxeViolations } from '../../test/axe';
import { contexts, newScPage, setPageContext } from '../../test/page';

/** E2EPage is a Puppeteer page; this is the slice used to emulate forced colours. */
type CdpPage = { createCDPSession(): Promise<{ send(method: string, params: object): Promise<unknown> }> };

const CYA = `
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
  </main>`;

/** Bounding boxes of the key, value and action of row n (0-based) in the list. */
function boxes(page: E2EPage, sel: string, n: number) {
  return page.evaluate(
    (s: string, i: number) => {
      const row = document.querySelector(s)!.shadowRoot!.querySelectorAll('.row')[i];
      const box = (q: string) => {
        const el = row.querySelector(q);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, w: r.width, h: r.height, right: r.right };
      };
      return { key: box('.key'), value: box('.value'), action: box('.action') };
    },
    sel,
    n,
  );
}

describe('sc-summary-list (e2e)', () => {
  it('has no axe violations (definition list structure included) in English and Arabic, light and dark', async () => {
    const page = await newScPage(CYA);
    for (const ctx of contexts) {
      await setPageContext(page, ctx);
      await expectNoAxeViolations(page);
    }
  });

  it('keeps one dl whose children are div groups of dt and dd in the flattened tree', async () => {
    const page = await newScPage(CYA);
    const structure = await page.evaluate(() => {
      const dl = document.querySelector('#renewal')!.shadowRoot!.querySelector('dl')!;
      return Array.from(dl.children).map((row) => `${row.tagName}:${Array.from(row.children).map((c) => c.tagName).join(',')}`);
    });
    expect(structure).toEqual(['DIV:DT,DD', 'DIV:DT,DD', 'DIV:DT,DD,DD', 'DIV:DT,DD,DD']);
    // The value <dd> shows the row's light-DOM content.
    const value = await page.evaluate(() => {
      const slot = document.querySelector('#renewal')!.shadowRoot!.querySelector('slot[name="row-1"]') as HTMLSlotElement;
      return (slot.assignedElements()[0] as HTMLElement).innerText;
    });
    expect(value).toBe('Dubai A 48213');
  });

  it('gives each action a name that includes the key, and Tab and Enter follow it', async () => {
    const page = await newScPage(CYA);
    const names = await page.evaluate(() =>
      Array.from(document.querySelector('#renewal')!.shadowRoot!.querySelectorAll('a')).map((a) => a.textContent),
    );
    expect(names).toEqual(['Change Renew for', 'Change Insurance']);
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement!.shadowRoot!.activeElement!.textContent)).toBe('Change Renew for');
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement!.shadowRoot!.activeElement!.textContent)).toBe('Change Insurance');
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(await page.evaluate(() => location.hash)).toBe('#insurance');
  });

  it('has at least 44px action targets', async () => {
    const page = await newScPage(CYA);
    const size = await page.evaluate(() => {
      const r = document.querySelector('#renewal')!.shadowRoot!.querySelector('a')!.getBoundingClientRect();
      return [r.width, r.height];
    });
    expect(size[0]).toBeGreaterThanOrEqual(44);
    expect(size[1]).toBeGreaterThanOrEqual(44);
  });

  it('shows three aligned columns when wide, with a fixed action column', async () => {
    const page = await newScPage(`<div style="inline-size: 800px">${CYA}</div>`);
    const noAction = await boxes(page, '#renewal', 0);
    const withAction = await boxes(page, '#renewal', 2);
    // Key and value share a baseline (their line boxes differ by at most a pixel).
    expect(Math.abs(noAction.key!.y - noAction.value!.y)).toBeLessThan(2);
    expect(noAction.value!.x).toBe(withAction.value!.x);
    expect(withAction.value!.x).toBeGreaterThan(withAction.key!.x + withAction.key!.w - 1);
    // The action column is 96px (--sc-space-96).
    const col = await page.evaluate(() => getComputedStyle(document.querySelector('#renewal')!.shadowRoot!.querySelectorAll('.row')[2]).gridTemplateColumns);
    expect(col.split(' ').pop()).toBe('96px');
  });

  it('stacks key above value when narrow, with the action at the end', async () => {
    const page = await newScPage(`<div style="inline-size: 360px">${CYA}</div>`);
    const b = await boxes(page, '#renewal', 2);
    expect(b.value!.y).toBeGreaterThan(b.key!.y);
    expect(b.key!.x).toBe(b.value!.x);
    expect(b.action!.x).toBeGreaterThan(b.value!.x);
  });

  it('mirrors in Arabic: the key is at the right and the action at the left', async () => {
    const page = await newScPage(`<div style="inline-size: 800px">${CYA}</div>`, { lang: 'ar' });
    const b = await boxes(page, '#renewal', 2);
    expect(b.key!.x).toBeGreaterThan(b.value!.x);
    expect(b.value!.x).toBeGreaterThan(b.action!.x);
  });

  it('re-renders the action text when the language changes', async () => {
    const page = await newScPage(CYA);
    const first = () => page.evaluate(() => document.querySelector('#renewal')!.shadowRoot!.querySelector('a')!.textContent);
    expect(await first()).toBe('Change Renew for');
    await setPageContext(page, { lang: 'ar' });
    expect(await first()).toBe('تغيير Renew for');
  });

  it('follows the channel: the action takes the channel action colour', async () => {
    const page = await newScPage(CYA, { channel: 'now' });
    const colour = () => page.evaluate(() => getComputedStyle(document.querySelector('#renewal')!.shadowRoot!.querySelector('a')!).color);
    const now = await colour();
    await setPageContext(page, { channel: 'transport' });
    expect(await colour()).not.toBe(now);
  });

  it('updates when rows are added or removed', async () => {
    const page = await newScPage(CYA);
    await page.evaluate(() => {
      const row = document.createElement('sc-summary-row');
      row.setAttribute('label', 'Registration card');
      row.textContent = 'Digital card in Dubai Now';
      document.querySelector('#renewal')!.append(row);
      document.querySelector('#renewal sc-summary-row')!.remove();
    });
    await page.waitForChanges();
    const keys = await page.evaluate(() => Array.from(document.querySelector('#renewal')!.shadowRoot!.querySelectorAll('dt')).map((d) => d.textContent));
    expect(keys).toEqual(['Plate', 'Renew for', 'Insurance', 'Registration card']);
  });

  it('keeps the card edge and underlines actions in forced colours', async () => {
    const page = await newScPage(CYA);
    // Puppeteer's emulateMediaFeatures doesn't list forced-colors; Chromium's CDP does.
    await (await (page as unknown as CdpPage).createCDPSession()).send('Emulation.setEmulatedMedia', { features: [{ name: 'forced-colors', value: 'active' }] });
    const r = await page.evaluate(() => {
      const root = document.querySelector('#renewal')!.shadowRoot!;
      return [getComputedStyle(root.querySelector('dl')!).borderTopColor, getComputedStyle(root.querySelector('a')!).textDecorationLine];
    });
    expect(r[0]).not.toBe('rgba(0, 0, 0, 0)');
    expect(r[1]).toBe('underline');
  });
});
