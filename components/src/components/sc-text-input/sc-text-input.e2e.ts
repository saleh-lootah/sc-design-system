import { describeAxe, expectNoAxeViolations } from '../../test/axe';
import { newScPage, setPageContext } from '../../test/page';
import { CHANNELS, axNode, forceColors, inner, token } from './field-test';

const PLATE = `
  <form novalidate>
    <sc-select id="emirate" name="emirate" label="Issuing authority" value="dubai">
      <option value="dubai">Dubai</option>
      <option value="sharjah">Sharjah</option>
    </sc-select>
    <sc-text-input id="plate-code" name="plateCode" label="Plate code" hint="1 or 2 English letters" value="A" width="4" ltr></sc-text-input>
    <sc-text-input id="plate-number" name="plateNumber" label="Plate number" hint="Up to 5 digits, for example 12345"
      error="Enter numbers only, like 12345" value="48B13" width="10" inputmode="numeric" ltr></sc-text-input>
    <sc-button type="submit">Continue</sc-button>
  </form>`;

const PLATE_AR = `
  <form novalidate>
    <sc-text-input name="plateCode" label="رمز اللوحة" hint="حرف أو حرفان باللغة الإنجليزية" value="A" width="4" ltr></sc-text-input>
    <sc-text-input id="plate-number" name="plateNumber" label="رقم اللوحة" hint="حتى 5 أرقام، مثل 12345"
      error="يُرجى إدخال رقم اللوحة بالأرقام فقط، مثل 12345" value="48B13" width="10" inputmode="numeric" ltr></sc-text-input>
  </form>`;

export const ALL_STATES = `
  <main>
    <h1>Renew your vehicle registration</h1>
    <form novalidate>
      <sc-text-input label="Plate code" hint="1 or 2 English letters" value="A" width="4" ltr></sc-text-input>
      <sc-text-input label="Plate number" hint="Up to 5 digits, for example 12345" error="Enter numbers only, like 12345" value="48B13" width="10" inputmode="numeric" ltr></sc-text-input>
      <sc-text-input label="Full name"></sc-text-input>
      <sc-text-input label="Building name" optional></sc-text-input>
      <sc-text-input label="Amount" prefix-text="AED" width="10" ltr></sc-text-input>
      <sc-text-input label="Odometer reading" suffix-text="km" width="10"></sc-text-input>
      <sc-text-input label="Chassis number" value="JTMHV05J604123456" disabled></sc-text-input>
      <sc-text-input label="Policy number" value="POL-2026-0042" readonly></sc-text-input>
      <sc-text-input label="What is your email address?" heading-level="2" type="email" ltr></sc-text-input>
    </form>
  </main>`;

describe('sc-text-input (e2e)', () => {
  it('renders a native input in light DOM with per-instance IDs', async () => {
    const page = await newScPage(`<sc-text-input label="A"></sc-text-input><sc-text-input label="B"></sc-text-input>`);
    const ids = await page.evaluate(() => [...document.querySelectorAll('sc-text-input')].map((h) => [h.shadowRoot, h.querySelector('input')!.id, h.querySelector('label')!.htmlFor]));
    expect(ids[0][0]).toBeNull();
    expect(ids[0][1]).toBe(ids[0][2]);
    expect(ids[0][1]).not.toBe(ids[1][1]);
    expect(ids[0][1]).toMatch(/^sc-text-input-\d+-control$/);
  });

  it('exposes the label as the name, hint and error as the description, and the invalid state', async () => {
    const page = await newScPage(PLATE);
    const node = await axNode(page, '#plate-number');
    expect(node!.role).toBe('textbox');
    expect(node!.name).toBe('Plate number');
    expect(node!.description).toBe('Up to 5 digits, for example 12345 Error: Enter numbers only, like 12345');
    expect(node!.invalid).toBe('true');
    const code = await axNode(page, '#plate-code');
    expect(code!.name).toBe('Plate code');
    expect(code!.description).toBe('1 or 2 English letters');
    expect(code!.invalid).toBeFalsy();
  });

  it('is 56px tall with 8px corners and a 1.5px outline edge; the error state adds a 4px bar and a 2px error edge', async () => {
    const page = await newScPage(PLATE);
    const frame = (sel: string, p: string) => inner<string>(page, sel, `getComputedStyle(q(".sc-field__frame")).${p}`);
    expect(Math.round(await inner<number>(page, '#plate-code', 'q(".sc-field__frame").getBoundingClientRect().height'))).toBe(56);
    expect(await frame('#plate-code', 'borderTopLeftRadius')).toBe('8px');
    expect(['1px', '1.5px']).toContain(await frame('#plate-code', 'borderTopWidth'));
    expect(await frame('#plate-code', 'borderTopColor')).toBe(await token(page, 'body', '--sc-color-outline'));
    expect(await inner(page, '#plate-number', 'getComputedStyle(q(".sc-field")).borderLeftWidth')).toBe('4px');
    expect(await inner(page, '#plate-number', 'getComputedStyle(q(".sc-field")).paddingLeft')).toBe('16px');
    expect(await frame('#plate-number', 'boxShadow')).toContain('0px 0px 0px 0.5px inset');
    expect(await frame('#plate-number', 'borderTopColor')).toBe(await token(page, 'body', '--sc-color-error'));
    expect(await inner(page, '#plate-number', 'getComputedStyle(q(".sc-field__error")).color')).toBe(await token(page, 'body', '--sc-color-error'));
  });

  it('sets the type roles: label-large Bold, body-medium hint, body-large value, in EN and AR', async () => {
    const page = await newScPage(PLATE);
    const font = (part: string) => inner<string[]>(page, '#plate-number', `((s) => [s.fontSize, s.lineHeight, s.fontWeight])(getComputedStyle(q("${part}")))`);
    expect(await font('label')).toEqual(['18px', '22px', '700']);
    expect(await font('.sc-field__hint')).toEqual(['16px', '24px', '400']);
    expect(await font('.sc-field__error')).toEqual(['16px', '24px', '700']);
    expect(await font('input')).toEqual(['18px', '26px', '400']);
    await setPageContext(page, { lang: 'ar' });
    expect(await font('label')).toEqual(['20px', '28px', '700']);
    expect(await font('.sc-field__hint')).toEqual(['18px', '28px', '400']);
    expect(await font('input')).toEqual(['20px', '32px', '400']);
    expect(Math.round(await inner<number>(page, '#plate-number', 'q(".sc-field__frame").getBoundingClientRect().height'))).toBe(56);
  });

  it('puts the error bar on the right and keeps LTR values at the start (right) in Arabic', async () => {
    const page = await newScPage(PLATE_AR, { lang: 'ar' });
    expect(await inner(page, '#plate-number', 'getComputedStyle(q(".sc-field")).borderRightWidth')).toBe('4px');
    expect(await inner(page, '#plate-number', 'getComputedStyle(q(".sc-field")).borderLeftWidth')).toBe('0px');
    expect(await inner(page, '#plate-number', 'getComputedStyle(input).direction')).toBe('ltr');
    const [frameRight, labelRight] = await inner<number[]>(page, '#plate-number', '[q(".sc-field__frame").getBoundingClientRect().right, q("label").getBoundingClientRect().right]');
    expect(Math.abs(frameRight - labelRight)).toBeLessThan(1);
    expect(await inner(page, '#plate-number', 'getComputedStyle(input).textAlign')).toBe('end');
    const node = await axNode(page, '#plate-number');
    expect(node!.name).toBe('رقم اللوحة');
    expect(node!.description).toBe('حتى 5 أرقام، مثل 12345 خطأ: يُرجى إدخال رقم اللوحة بالأرقام فقط، مثل 12345');
  });

  it('submits natively, follows typing, fires native and sc events once, and resets with the form', async () => {
    const page = await newScPage(PLATE);
    const data = () => page.evaluate(() => Object.fromEntries(new FormData(document.querySelector('form')!)));
    expect(await data()).toEqual({ emirate: 'dubai', plateCode: 'A', plateNumber: '48B13' });
    await page.evaluate(() => {
      const w = window as unknown as { events: string[] };
      w.events = [];
      const el = document.getElementById('plate-number')!;
      for (const type of ['input', 'change', 'scInput', 'scChange']) el.addEventListener(type, () => w.events.push(type));
    });
    await page.click('#plate-number input', { clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.keyboard.type('48213');
    await page.keyboard.press('Tab');
    await page.waitForChanges();
    expect((await data()).plateNumber).toBe('48213');
    expect(await page.$eval('#plate-number', (el) => (el as HTMLElement & { value: string }).value)).toBe('48213');
    const events = await page.evaluate(() => (window as unknown as { events: string[] }).events);
    expect(events).toContain('input');
    expect(events).toContain('scInput');
    expect(events.filter((e) => e === 'change')).toHaveLength(1);
    expect(events.filter((e) => e === 'scChange')).toHaveLength(1);

    await page.evaluate(() => document.querySelector('form')!.reset());
    await page.waitForChanges();
    expect((await data()).plateNumber).toBe('48B13');
    expect(await page.$eval('#plate-number', (el) => (el as HTMLElement & { value: string }).value)).toBe('48B13');
  });

  it('submits the form with Enter through its default button (A2)', async () => {
    const page = await newScPage(PLATE);
    await page.evaluate(() => {
      const w = window as unknown as { submits: number };
      w.submits = 0;
      document.querySelector('form')!.addEventListener('submit', (ev) => {
        ev.preventDefault();
        w.submits++;
      });
    });
    await page.focus('#plate-code input');
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(await page.evaluate(() => (window as unknown as { submits: number }).submits)).toBe(1);
  });

  it('turns Arabic-Indic digits into Latin digits as they are typed (LANG-21)', async () => {
    const page = await newScPage(`<form><sc-text-input id="eid" name="eid" label="رقم الهوية الإماراتية" inputmode="numeric" width="20" ltr></sc-text-input></form>`, { lang: 'ar' });
    await page.click('#eid input');
    await page.keyboard.type('٧٨٤-۱۹۹۰-');
    await page.keyboard.type('١٢٣');
    await page.waitForChanges();
    expect(await inner(page, '#eid', 'input.value')).toBe('784-1990-123');
    expect(await page.$eval('#eid', (el) => (el as HTMLElement & { value: string }).value)).toBe('784-1990-123');
    expect(await page.evaluate(() => new FormData(document.querySelector('form')!).get('eid'))).toBe('784-1990-123');
    expect(await inner(page, '#eid', 'input.selectionStart')).toBe(12);
  });

  it('uses native constraint validation on the input', async () => {
    const page = await newScPage(`<form><sc-text-input id="name" name="name" label="Full name" required></sc-text-input><sc-text-input id="email" name="email" label="Email" type="email" ltr></sc-text-input></form>`);
    expect(await page.evaluate(() => document.querySelector('form')!.checkValidity())).toBe(false);
    await page.evaluate(() => document.querySelector('form')!.reportValidity());
    expect(await inner(page, '#name', 'document.activeElement === input')).toBe(true);
    await page.keyboard.type('Saleh Al Mansoori');
    expect(await inner(page, '#name', 'input.matches(":valid")')).toBe(true);
    await page.click('#email input');
    await page.keyboard.type('name@example.');
    expect(await inner(page, '#email', 'input.validity.typeMismatch')).toBe(true);
  });

  it('focuses the input from the host, from an error-summary link and from the keyboard, with the U1 ring on the box', async () => {
    const page = await newScPage(`<a id="link" href="#plate-number">Enter numbers only, like 12345</a>${PLATE}`);
    await page.evaluate(() =>
      document.getElementById('link')!.addEventListener('click', (ev) => {
        ev.preventDefault();
        (document.getElementById('plate-number') as HTMLElement).focus();
      }),
    );
    await page.click('#link');
    expect(await inner(page, '#plate-number', 'document.activeElement === input')).toBe(true);
    await page.keyboard.down('Shift');
    await page.keyboard.press('Tab');
    await page.keyboard.up('Shift');
    expect(await inner(page, '#plate-code', 'document.activeElement === input')).toBe(true);
    const ring = await inner<string[]>(page, '#plate-code', '((s) => [s.outlineStyle, s.outlineWidth, s.outlineOffset, s.outlineColor])(getComputedStyle(q(".sc-field__frame")))');
    expect(ring).toEqual(['solid', '3px', '2px', await token(page, 'body', '--sc-color-focus-ring', 'outlineColor')]);
    // The ring is on the box, not doubled on the input.
    expect(await inner(page, '#plate-code', 'getComputedStyle(input).outlineStyle')).toBe('none');
  });

  it('follows a disabled fieldset natively and is left out of the form data', async () => {
    const page = await newScPage(`<form><fieldset disabled><sc-text-input name="plate" label="Plate" value="12345"></sc-text-input></fieldset></form>`);
    expect(await inner(page, 'sc-text-input', 'input.matches(":disabled")')).toBe(true);
    expect(await inner(page, 'sc-text-input', 'getComputedStyle(q(".sc-field__frame")).backgroundColor')).toBe(await token(page, 'body', '--sc-color-disabled-container'));
    expect(await page.evaluate(() => [...new FormData(document.querySelector('form')!).keys()])).toEqual([]);
    await page.evaluate(() => (document.querySelector('fieldset')!.disabled = false));
    expect(await page.evaluate(() => new FormData(document.querySelector('form')!).get('plate'))).toBe('12345');
  });

  it('moves rich label, hint, error and prefix content into place', async () => {
    const page = await newScPage(`<sc-text-input id="r"><span slot="label">Plate <b>number</b></span><span slot="hint">See <a href="#help">where to find it</a></span><span slot="error">Enter numbers only</span><span slot="prefix">AED</span></sc-text-input>`);
    expect(await inner(page, '#r', 'q("label").textContent')).toBe('Plate number');
    expect(await inner(page, '#r', '!!q(".sc-field__hint a")')).toBe(true);
    expect(await inner(page, '#r', 'q(".sc-field__affix--prefix").textContent')).toBe('AED');
    const node = await axNode(page, '#r');
    expect(node!.name).toBe('Plate number');
    expect(node!.description).toBe('See where to find it Error: Enter numbers only AED');
  });

  it('re-renders its strings when lang changes', async () => {
    const page = await newScPage(`<sc-text-input label="Plate number" optional error="Enter numbers only"></sc-text-input>`, { lang: 'en' });
    expect(await inner(page, 'sc-text-input', 'q(".sc-field__optional").textContent')).toBe(' (optional)');
    await setPageContext(page, { lang: 'ar' });
    expect(await inner(page, 'sc-text-input', 'q(".sc-field__optional").textContent')).toBe(' (اختياري)');
    expect(await inner(page, 'sc-text-input', 'q(".sc-field__error .visually-hidden").textContent')).toBe('خطأ: ');
    expect(await inner(page, 'sc-text-input', 'getComputedStyle(q("label")).letterSpacing')).toMatch(/^(normal|0px)$/);
  });

  it('keeps its edge and the thicker error edge in forced colours', async () => {
    const page = await newScPage(PLATE);
    await forceColors(page);
    const border = (sel: string) => inner<string>(page, sel, 'getComputedStyle(q(".sc-field__frame")).borderTopWidth');
    expect(await border('#plate-code')).not.toBe('0px');
    expect(parseFloat(await border('#plate-number'))).toBeGreaterThan(parseFloat(await border('#plate-code')));
  });

  it('has no axe violations while focused, on every channel', async () => {
    const page = await newScPage(ALL_STATES);
    await page.keyboard.press('Tab');
    for (const channel of CHANNELS) {
      await setPageContext(page, { channel, theme: 'dark' });
      await expectNoAxeViolations(page);
    }
  });

  it('sizes boxes on the E2 scale (4 characters 120px, 10 characters 200px), 10px from the label without a hint, and the bar 14px from the Arabic content', async () => {
    const page = await newScPage(`<sc-text-input id="a" label="Code" width="4"></sc-text-input><sc-text-input id="b" label="Number" width="10" hint="Digits"></sc-text-input><div lang="ar" dir="rtl"><sc-text-input id="c" label="رقم" error="خطأ"></sc-text-input></div>`);
    expect(Math.round(await inner<number>(page, '#a', 'q(".sc-field__frame").getBoundingClientRect().width'))).toBe(120);
    expect(Math.round(await inner<number>(page, '#b', 'q(".sc-field__frame").getBoundingClientRect().width'))).toBe(200);
    expect(await inner(page, '#a', 'getComputedStyle(q(".sc-field")).rowGap')).toBe('10px');
    expect(await inner(page, '#b', 'getComputedStyle(q(".sc-field")).rowGap')).toBe('8px');
    expect(await inner(page, '#c', 'getComputedStyle(q(".sc-field")).paddingRight')).toBe('14px');
  });

  it('reserves its height before it upgrades (CLS 0)', async () => {
    const page = await newScPage(`<p>Text</p>`);
    const text = await page.evaluate(() => [...document.styleSheets].map((s) => { try { return [...s.cssRules].map((r) => r.cssText).join(''); } catch { return ''; } }).join(''));
    expect(text).toMatch(/sc-text-input[^{]*:not\(:defined\)/);
  });

});

describeAxe('sc-text-input', ALL_STATES);
