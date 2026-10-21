import { E2EPage } from '@stencil/core/testing';
import { describeAxe, expectNoAxeViolations } from '../../test/axe';
import { newScPage, setPageContext } from '../../test/page';
import { CHANNELS, axNode, inner } from '../sc-text-input/field-test';

const part = (page: E2EPage, sel: string, p: string, expr: string) => inner(page, sel, `((i) => ${expr})(host.querySelector('[id$="-${p}"]'))`);

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
  it('exposes a group named by the legend, and three named numeric boxes in light DOM', async () => {
    const page = await newScPage(`<sc-date-input id="d" label="When does your insurance policy start?" hint="For example, 27 3 2026" error="The date must include a year" error-parts="year"></sc-date-input>`);
    expect(await inner(page, '#d', 'host.shadowRoot')).toBeNull();
    const group = await axNode(page, '#d', 'fieldset');
    expect(group!.role).toBe('group');
    expect(group!.name).toBe('When does your insurance policy start?');
    expect(group!.description).toBe('For example, 27 3 2026 Error: The date must include a year');
    const names = [];
    for (const p of ['day', 'month', 'year']) {
      const node = await axNode(page, '#d', `[id$="-${p}"]`);
      names.push([node!.name, node!.invalid ?? false]);
    }
    expect(names).toEqual([
      ['Day', false],
      ['Month', false],
      ['Year', 'true'],
    ]);
    expect(await part(page, '#d', 'year', 'i.inputMode')).toBe('numeric');
    expect(await part(page, '#d', 'year', 'Math.round(i.parentElement.getBoundingClientRect().height)')).toBe(56);
  });

  it('builds an ISO value from typing and submits it natively with the raw parts', async () => {
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
    expect(await data()).toEqual({ 'start-day': '7', 'start-month': '3', 'start-year': '2026', 'start': '2026-03-07' });
    expect(await page.evaluate(() => document.querySelector('form')!.checkValidity())).toBe(true);
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
    expect(await page.$eval('#d', (el) => Array.from(el.querySelectorAll('input:not([type=hidden])')).map((i) => (i as HTMLInputElement).value))).toEqual(['27', '3', '1990']);
  });

  it('reports an impossible date and an empty required date as native validity errors', async () => {
    const page = await newScPage(`<form><sc-date-input id="d" name="d" label="Start date" required></sc-date-input></form>`);
    expect(await part(page, '#d', 'day', 'i.validationMessage')).toBe('Enter a date');
    await page.evaluate(() => document.querySelector('form')!.reportValidity());
    expect(await part(page, '#d', 'day', 'document.activeElement === i')).toBe(true);
    await page.keyboard.type('31');
    await page.keyboard.press('Tab');
    await page.keyboard.type('4');
    await page.keyboard.press('Tab');
    await page.keyboard.type('2026');
    await page.waitForChanges();
    expect(await page.$eval('#d', (el) => (el as HTMLElement & { value: string }).value)).toBe('');
    expect(await part(page, '#d', 'day', 'i.validationMessage')).toBe('The date must be a real date');
    expect(await page.evaluate(() => new FormData(document.querySelector('form')!).get('d'))).toBe('');
    await page.evaluate(() => ((document.getElementById('d') as HTMLElement & { value: string }).value = '2026-04-30'));
    await page.waitForChanges();
    expect(await part(page, '#d', 'day', 'i.value')).toBe('30');
    expect(await page.evaluate(() => document.querySelector('form')!.checkValidity())).toBe(true);
  });

  it('resets to its initial value', async () => {
    const page = await newScPage(`<form><sc-date-input name="d" label="Start date" value="2026-03-27"></sc-date-input></form>`);
    await page.keyboard.press('Tab');
    await page.keyboard.type('1');
    await page.evaluate(() => document.querySelector('form')!.reset());
    await page.waitForChanges();
    expect(await part(page, 'sc-date-input', 'day', 'i.value')).toBe('27');
    expect(await page.evaluate(() => new FormData(document.querySelector('form')!).get('d'))).toBe('2026-03-27');
  });

  it('runs right to left in Arabic, Day on the right, with Arabic labels and the bar on the right', async () => {
    const page = await newScPage(`<sc-date-input id="d" label="تاريخ الميلاد" error="يُرجى إدخال تاريخ الميلاد"></sc-date-input>`, { lang: 'ar' });
    const x = (p: string) => part(page, '#d', p, 'i.getBoundingClientRect().left') as Promise<number>;
    expect(await x('day')).toBeGreaterThan(await x('month'));
    expect(await x('month')).toBeGreaterThan(await x('year'));
    expect(await inner(page, '#d', '[...host.querySelectorAll(".sc-date-input__part-label")].map((l) => l.textContent)')).toEqual(['يوم', 'شهر', 'سنة']);
    expect(await inner(page, '#d', 'getComputedStyle(q("fieldset")).borderRightWidth')).toBe('4px');
    await page.keyboard.press('Tab');
    expect(await part(page, '#d', 'day', 'document.activeElement === i')).toBe(true);
    await setPageContext(page, { lang: 'en' });
    expect(await inner(page, '#d', '[...host.querySelectorAll(".sc-date-input__part-label")].map((l) => l.textContent)')).toEqual(['Day', 'Month', 'Year']);
  });

  it('focuses the day box from the host (error summary link) and marks only the named box', async () => {
    const page = await newScPage(`<sc-date-input id="d" label="Start date" error="Include a year" error-parts="year"></sc-date-input>`);
    await page.evaluate(() => document.getElementById('d')!.focus());
    expect(await part(page, '#d', 'day', 'document.activeElement === i')).toBe(true);
    expect(await part(page, '#d', 'day', 'i.parentElement.classList.contains("sc-field__frame--error")')).toBe(false);
    expect(await part(page, '#d', 'year', 'i.parentElement.classList.contains("sc-field__frame--error")')).toBe(true);
  });

  it('has no axe violations while focused, on every channel', async () => {
    const page = await newScPage(ALL_STATES);
    await page.keyboard.press('Tab');
    for (const channel of CHANNELS) {
      await setPageContext(page, { channel, theme: 'light' });
      await expectNoAxeViolations(page);
    }
  });
});

describeAxe('sc-date-input', ALL_STATES);
