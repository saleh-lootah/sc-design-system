import { E2EPage } from '@stencil/core/testing';
import { expectNoAxeViolations } from '../../test/axe';
import { contexts, newScPage, setPageContext } from '../../test/page';

/** Evaluates `expr` with `host`, `root` (its shadow root) and `input` (the inner control). */
function inner(page: E2EPage, selector: string, expr: string) {
  return page.evaluate(
    (sel: string, e: string) => {
      const host = document.querySelector(sel)!;
      const root = host.shadowRoot!;
      const input = root.querySelector('input, textarea, select');
      // eslint-disable-next-line no-new-func
      return new Function('host', 'root', 'input', `return (${e});`)(host, root, input);
    },
    selector,
    expr,
  );
}

/** The accessibility-tree node of an element inside a shadow root, as Chromium exposes it. */
async function axNode(page: E2EPage, selector: string, inside = 'input, textarea, select') {
  const handle = await page.evaluateHandle((sel: string, q: string) => document.querySelector(sel)!.shadowRoot!.querySelector(q)!, selector, inside);
  return page.accessibility.snapshot({ root: handle as never, interestingOnly: false });
}

const part = (page: E2EPage, sel: string, p: string, expr: string) => inner(page, sel, `((i) => ${expr})(root.getElementById('${p}'))`);

const ALL_STATES = `
  <main>
    <h1>Renew your vehicle registration</h1>
    <sc-date-input label="When does your insurance policy start?" hint="For example, 27 3 2026" value="2026-03-27"></sc-date-input>
    <sc-date-input label="When does your insurance policy start?" error="The date your policy starts must include a year" error-parts="year"></sc-date-input>
    <sc-date-input label="Date of birth" error="Enter your date of birth" autocomplete="bday"></sc-date-input>
    <sc-date-input label="Date the vehicle was exported" optional></sc-date-input>
    <sc-date-input label="Registration expiry date" value="2026-11-15" disabled></sc-date-input>
    <sc-date-input label="When did you buy the vehicle?" heading-level="2"></sc-date-input>
  </main>`;

describe('sc-date-input (e2e)', () => {
  it('exposes a group named by the legend, and three named numeric boxes', async () => {
    const page = await newScPage(`<sc-date-input id="d" label="When does your insurance policy start?" hint="For example, 27 3 2026" error="The date must include a year" error-parts="year"></sc-date-input>`);
    const group = await axNode(page, '#d', 'fieldset');
    expect(group!.role).toBe('group');
    expect(group!.name).toBe('When does your insurance policy start?');
    expect(group!.description).toBe('For example, 27 3 2026 Error: The date must include a year');
    const names = [];
    for (const p of ['day', 'month', 'year']) {
      const node = await axNode(page, '#d', `#${p}`);
      names.push([node!.name, node!.invalid ?? false]);
    }
    expect(names).toEqual([
      ['Day', false],
      ['Month', false],
      ['Year', 'true'],
    ]);
    expect(await part(page, '#d', 'year', 'i.inputMode')).toBe('numeric');
  });

  it('builds an ISO value from typing and submits it with the raw parts', async () => {
    const page = await newScPage(`<form><sc-date-input id="d" name="start" label="Start date"></sc-date-input></form>`);
    const data = () => page.evaluate(() => Object.fromEntries(new FormData(document.querySelector('form')!)));
    await page.keyboard.press('Tab');
    await page.keyboard.type('7');
    await page.keyboard.press('Tab');
    await page.keyboard.type('3');
    await page.keyboard.press('Tab');
    await page.keyboard.type('2026');
    await page.waitForChanges();
    expect(await page.$eval('#d', (el) => (el as HTMLElement & { value: string }).value)).toBe('2026-03-07');
    expect(await data()).toEqual({ 'start': '2026-03-07', 'start-day': '7', 'start-month': '3', 'start-year': '2026' });
    expect(await page.$eval('#d', (el) => el.matches(':valid'))).toBe(true);
  });

  it('accepts Arabic-Indic digits and shows them back as Latin digits (LANG-21)', async () => {
    const page = await newScPage(`<form><sc-date-input id="d" name="dob" label="تاريخ الميلاد"></sc-date-input></form>`, { lang: 'ar' });
    await page.keyboard.press('Tab');
    await page.keyboard.type('٢٧');
    await page.keyboard.press('Tab');
    await page.keyboard.type('۳');
    await page.keyboard.press('Tab');
    await page.keyboard.type('١٩٩٠');
    await page.waitForChanges();
    expect(await page.$eval('#d', (el) => (el as HTMLElement & { value: string }).value)).toBe('1990-03-27');
    const boxes = await page.$eval('#d', (el) => Array.from(el.shadowRoot!.querySelectorAll('input')).map((i) => i.value));
    expect(boxes).toEqual(['27', '3', '1990']);
  });

  it('reports a date that does not exist as badInput, and an empty required date as valueMissing', async () => {
    const page = await newScPage(`<form><sc-date-input id="d" name="d" label="Start date" required></sc-date-input></form>`);
    expect(await page.$eval('#d', (el) => el.matches(':invalid'))).toBe(true);
    await page.evaluate(() => document.querySelector('form')!.reportValidity());
    expect(await part(page, '#d', 'day', 'root.activeElement === i')).toBe(true);
    await page.keyboard.type('31');
    await page.keyboard.press('Tab');
    await page.keyboard.type('4');
    await page.keyboard.press('Tab');
    await page.keyboard.type('2026');
    await page.waitForChanges();
    expect(await page.$eval('#d', (el) => (el as HTMLElement & { value: string }).value)).toBe('');
    expect(await page.$eval('#d', (el) => el.matches(':invalid'))).toBe(true);
    expect(await page.evaluate(() => new FormData(document.querySelector('form')!).get('d'))).toBe('');
    await page.click('#d');
    await page.evaluate(() => {
      const d = document.getElementById('d') as HTMLElement & { value: string };
      d.value = '2026-04-30';
    });
    await page.waitForChanges();
    expect(await part(page, '#d', 'day', 'i.value')).toBe('30');
    expect(await page.$eval('#d', (el) => el.matches(':valid'))).toBe(true);
  });

  it('resets to its initial value', async () => {
    const page = await newScPage(`<form><sc-date-input name="d" label="Start date" value="2026-03-27"></sc-date-input></form>`);
    await page.keyboard.press('Tab');
    await page.keyboard.type('1');
    await page.waitForChanges();
    await page.evaluate(() => document.querySelector('form')!.reset());
    await page.waitForChanges();
    expect(await part(page, 'sc-date-input', 'day', 'i.value')).toBe('27');
    expect(await page.evaluate(() => new FormData(document.querySelector('form')!).get('d'))).toBe('2026-03-27');
  });

  it('runs right to left in Arabic, Day on the right, with Arabic labels', async () => {
    const page = await newScPage(`<sc-date-input id="d" label="تاريخ الميلاد" error="يُرجى إدخال تاريخ الميلاد"></sc-date-input>`, { lang: 'ar' });
    const x = (p: string) => part(page, '#d', p, 'i.getBoundingClientRect().left');
    expect(await x('day')).toBeGreaterThan(await x('month'));
    expect(await x('month')).toBeGreaterThan(await x('year'));
    expect(await inner(page, '#d', '[...root.querySelectorAll(".part-label")].map((l) => l.textContent)')).toEqual(['يوم', 'شهر', 'سنة']);
    expect(await inner(page, '#d', 'getComputedStyle(root.querySelector("fieldset")).borderRightWidth')).toBe('3px');
    await page.keyboard.press('Tab');
    expect(await part(page, '#d', 'day', 'root.activeElement === i')).toBe(true);
    await setPageContext(page, { lang: 'en' });
    expect(await inner(page, '#d', '[...root.querySelectorAll(".part-label")].map((l) => l.textContent)')).toEqual(['Day', 'Month', 'Year']);
  });

  it('focuses the day box from the host (error summary link)', async () => {
    const page = await newScPage(`<sc-date-input id="d" label="Start date"></sc-date-input>`);
    await page.evaluate(() => document.getElementById('d')!.focus());
    expect(await part(page, '#d', 'day', 'root.activeElement === i')).toBe(true);
  });

  for (const ctx of contexts) {
    it(`has no axe violations (${ctx.lang}, ${ctx.theme})`, async () => {
      const page = await newScPage(ALL_STATES, ctx);
      await expectNoAxeViolations(page);
    });
  }

  it('has no axe violations while focused, on every channel', async () => {
    const page = await newScPage(ALL_STATES);
    await page.keyboard.press('Tab');
    for (const channel of ['now', 'transport', 'visit', 'justice', 'build', 'invest', 'trade'] as const) {
      await setPageContext(page, { channel, theme: 'light' });
      await expectNoAxeViolations(page);
    }
  });
});
