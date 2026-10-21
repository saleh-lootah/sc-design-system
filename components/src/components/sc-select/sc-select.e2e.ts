import { describeAxe, expectNoAxeViolations } from '../../test/axe';
import { newScPage, setPageContext } from '../../test/page';
import { CHANNELS, axNode, inner } from '../sc-text-input/field-test';

const EMIRATES = `
  <option value="dubai">Dubai</option>
  <option value="abu-dhabi">Abu Dhabi</option>
  <option value="sharjah">Sharjah</option>`;

const ALL_STATES = `
  <main>
    <h1>Renew your vehicle registration</h1>
    <sc-select label="Issuing authority" value="dubai">${EMIRATES}</sc-select>
    <sc-select label="Inspection centre" hint="Choose the one nearest to you" required>
      <option value="">Select a centre</option>
      <optgroup label="Dubai"><option value="al-quoz">Al Quoz</option></optgroup>
    </sc-select>
    <sc-select label="Inspection centre" error="Select an inspection centre"><option value="">Select a centre</option></sc-select>
    <sc-select label="Preferred time" optional><option>Morning</option></sc-select>
    <sc-select label="Vehicle type" disabled><option>Light vehicle</option></sc-select>
  </main>`;

describe('sc-select (e2e)', () => {
  it('moves the options into a native select in light DOM, named by the label and described by hint and error', async () => {
    const page = await newScPage(`<sc-select label="Inspection centre" hint="Choose the one nearest to you" error="Select an inspection centre"><option value="">Select a centre</option><optgroup label="Dubai"><option value="al-quoz">Al Quoz</option></optgroup></sc-select>`);
    expect(await inner(page, 'sc-select', '[host.shadowRoot, input.options.length, input.querySelector("optgroup").label]')).toEqual([null, 2, 'Dubai']);
    const node = await axNode(page, 'sc-select');
    expect(node!.role).toBe('combobox');
    expect(node!.name).toBe('Inspection centre');
    expect(node!.description).toBe('Choose the one nearest to you Error: Select an inspection centre');
    expect(node!.invalid).toBe('true');
  });

  it('submits the chosen value natively, follows keyboard changes and resets to the initial value', async () => {
    const page = await newScPage(`<form><sc-select name="emirate" label="Issuing authority" value="sharjah">${EMIRATES}</sc-select></form>`);
    const value = () => page.evaluate(() => new FormData(document.querySelector('form')!).get('emirate'));
    expect(await value()).toBe('sharjah');
    await page.evaluate(() => {
      const w = window as unknown as { events: string[] };
      w.events = [];
      for (const type of ['change', 'scChange']) document.querySelector('sc-select')!.addEventListener(type, () => w.events.push(type));
    });
    await page.keyboard.press('Tab');
    expect(await inner(page, 'sc-select', 'document.activeElement === input')).toBe(true);
    await page.keyboard.type('Abu');
    await page.waitForChanges();
    expect(await value()).toBe('abu-dhabi');
    expect(await page.$eval('sc-select', (el) => (el as HTMLElement & { value: string }).value)).toBe('abu-dhabi');
    expect(await page.evaluate(() => (window as unknown as { events: string[] }).events)).toEqual(['scChange', 'change']);
    await page.evaluate(() => document.querySelector('form')!.reset());
    await page.waitForChanges();
    expect(await value()).toBe('sharjah');
    expect(await page.$eval('sc-select', (el) => (el as HTMLElement & { value: string }).value)).toBe('sharjah');
  });

  it('takes the selected option, or the first, when value is unset; and follows value set from script', async () => {
    const page = await newScPage(`<sc-select id="a" label="A">${EMIRATES}</sc-select><sc-select id="b" label="B"><option value="x">X</option><option value="y" selected>Y</option></sc-select>`);
    expect(await page.$eval('#a', (el) => (el as HTMLElement & { value: string }).value)).toBe('dubai');
    expect(await page.$eval('#b', (el) => (el as HTMLElement & { value: string }).value)).toBe('y');
    await page.$eval('#a', (el) => ((el as HTMLElement & { value: string }).value = 'sharjah'));
    await page.waitForChanges();
    expect(await inner(page, '#a', 'input.value')).toBe('sharjah');
  });

  it('moves options added later into the select', async () => {
    const page = await newScPage(`<sc-select label="Issuing authority">${EMIRATES}</sc-select>`);
    await page.evaluate(() => {
      const opt = document.createElement('option');
      opt.value = 'ajman';
      opt.textContent = 'Ajman';
      document.querySelector('sc-select')!.append(opt);
      document.querySelector('sc-select option')!.textContent = 'Dubai (DXB)';
    });
    await page.waitForChanges();
    expect(await inner(page, 'sc-select', '[...input.options].map((o) => o.textContent)')).toEqual(['Dubai (DXB)', 'Abu Dhabi', 'Sharjah', 'Ajman']);
  });

  it('reports valueMissing natively for a required placeholder', async () => {
    const page = await newScPage(`<form><sc-select name="centre" label="Inspection centre" required><option value="">Select a centre</option><option value="al-quoz">Al Quoz</option></sc-select></form>`);
    expect(await inner(page, 'sc-select', 'input.validity.valueMissing')).toBe(true);
    await page.evaluate(() => document.querySelector('form')!.reportValidity());
    expect(await inner(page, 'sc-select', 'document.activeElement === input')).toBe(true);
    await page.$eval('sc-select', (el) => ((el as HTMLElement & { value: string }).value = 'al-quoz'));
    await page.waitForChanges();
    expect(await inner(page, 'sc-select', 'input.matches(":valid")')).toBe(true);
  });

  it('is 56px tall with a 26px chevron 16px from the inline end, pointing down in both directions', async () => {
    const page = await newScPage(`<sc-select label="Issuing authority">${EMIRATES}</sc-select>`, { lang: 'en' });
    const geo = () =>
      inner<{ h: number; w: number; gap: number; t: string }>(
        page,
        'sc-select',
        '(() => { const f = q(".sc-field__frame").getBoundingClientRect(); const c = q(".sc-select__chevron").getBoundingClientRect(); const rtl = getComputedStyle(host).direction === "rtl"; return { h: Math.round(f.height), w: Math.round(c.width), gap: Math.round(rtl ? c.left - f.left : f.right - c.right), t: getComputedStyle(q(".sc-select__chevron")).transform }; })()',
      );
    expect(await geo()).toEqual({ h: 56, w: 26, gap: 17, t: 'none' });
    await setPageContext(page, { lang: 'ar' });
    expect(await geo()).toEqual({ h: 56, w: 26, gap: 17, t: 'none' });
  });

  it('follows a disabled fieldset natively', async () => {
    const page = await newScPage(`<form><fieldset disabled><sc-select name="emirate" label="Issuing authority">${EMIRATES}</sc-select></fieldset></form>`);
    expect(await inner(page, 'sc-select', 'input.matches(":disabled")')).toBe(true);
    expect(await page.evaluate(() => new FormData(document.querySelector('form')!).get('emirate'))).toBeNull();
  });

  it('has no axe violations while focused, on every channel', async () => {
    const page = await newScPage(ALL_STATES);
    await page.keyboard.press('Tab');
    for (const channel of CHANNELS) {
      await setPageContext(page, { channel, theme: 'dark' });
      await expectNoAxeViolations(page);
    }
  });
});

describeAxe('sc-select', ALL_STATES);
