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

/** The accessibility-tree node of the inner control, as Chromium exposes it. */
async function axNode(page: E2EPage, selector: string) {
  const handle = await page.evaluateHandle((sel: string) => document.querySelector(sel)!.shadowRoot!.querySelector('input, textarea, select')!, selector);
  return page.accessibility.snapshot({ root: handle as never, interestingOnly: false });
}

const PLATE = `
  <form novalidate>
    <sc-select id="emirate" name="emirate" label="Issuing authority" value="dubai">
      <option value="dubai">Dubai</option>
      <option value="sharjah">Sharjah</option>
    </sc-select>
    <sc-text-input id="plate-code" name="plateCode" label="Plate code" hint="1 or 2 English letters" value="A" width="4" ltr></sc-text-input>
    <sc-text-input id="plate-number" name="plateNumber" label="Plate number" hint="Up to 5 digits, for example 12345"
      error="Enter numbers only, like 12345" value="48B13" width="10" inputmode="numeric" ltr></sc-text-input>
  </form>`;

const PLATE_AR = `
  <form novalidate>
    <sc-select name="emirate" label="جهة الإصدار" value="dubai"><option value="dubai">دبي</option></sc-select>
    <sc-text-input name="plateCode" label="رمز اللوحة" hint="حرف أو حرفان باللغة الإنجليزية" value="A" width="4" ltr></sc-text-input>
    <sc-text-input id="plate-number" name="plateNumber" label="رقم اللوحة" hint="حتى 5 أرقام، مثل 12345"
      error="يُرجى إدخال رقم اللوحة بالأرقام فقط، مثل 12345" value="48B13" width="10" inputmode="numeric" ltr></sc-text-input>
  </form>`;

const ALL_STATES = `
  <main>
    <h1>Renew your vehicle registration</h1>
    ${PLATE}
    <sc-text-input label="Full name"></sc-text-input>
    <sc-text-input label="Building name" optional></sc-text-input>
    <sc-text-input label="Amount" prefix-text="AED" width="10" ltr></sc-text-input>
    <sc-text-input label="Odometer reading" suffix-text="km" width="10"></sc-text-input>
    <sc-text-input label="Chassis number" value="JTMHV05J604123456" disabled></sc-text-input>
    <sc-text-input label="What is your email address?" heading-level="2" type="email" ltr></sc-text-input>
  </main>`;

describe('sc-text-input (e2e)', () => {
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

  it('is 54px tall with the field radius, and the error state adds a 3px start bar and a 2px error border', async () => {
    const page = await newScPage(PLATE);
    expect(Math.round(await inner(page, '#plate-code', 'root.querySelector(".frame").getBoundingClientRect().height'))).toBe(54);
    expect(await inner(page, '#plate-code', 'getComputedStyle(root.querySelector(".frame")).borderTopLeftRadius')).toBe('14px');
    // 1.5px, which Chromium snaps to 1px at device-pixel-ratio 1.
    expect(['1px', '1.5px']).toContain(await inner(page, '#plate-code', 'getComputedStyle(root.querySelector(".frame")).borderTopWidth'));
    expect(await inner(page, '#plate-number', 'getComputedStyle(root.querySelector(".field")).borderLeftWidth')).toBe('3px');
    expect(await inner(page, '#plate-number', 'getComputedStyle(root.querySelector(".frame")).boxShadow')).toContain('0px 0px 0px 0.5px inset');
    const [errorBorder, errorText] = await inner(page, '#plate-number', '[getComputedStyle(root.querySelector(".frame")).borderTopColor, getComputedStyle(root.querySelector(".error")).color]');
    expect(errorBorder).toBe(errorText);
  });

  it('puts the error bar on the right and keeps LTR values at the start (right) in Arabic', async () => {
    const page = await newScPage(PLATE_AR, { lang: 'ar' });
    expect(await inner(page, '#plate-number', 'getComputedStyle(root.querySelector(".field")).borderRightWidth')).toBe('3px');
    expect(await inner(page, '#plate-number', 'getComputedStyle(root.querySelector(".field")).borderLeftWidth')).toBe('0px');
    expect(await inner(page, '#plate-number', 'getComputedStyle(input).direction')).toBe('ltr');
    // The value is left-to-right but sits at the right edge, where the Arabic field starts.
    const [frameRight, labelRight] = await inner(page, '#plate-number', '[root.querySelector(".frame").getBoundingClientRect().right, root.querySelector("label").getBoundingClientRect().right]');
    expect(Math.abs(frameRight - labelRight)).toBeLessThan(1);
    expect(await inner(page, '#plate-number', 'getComputedStyle(input).textAlign')).toBe('end');
    const node = await axNode(page, '#plate-number');
    expect(node!.name).toBe('رقم اللوحة');
    expect(node!.description).toBe('حتى 5 أرقام، مثل 12345 خطأ: يُرجى إدخال رقم اللوحة بالأرقام فقط، مثل 12345');
  });

  it('submits its value, follows typing and resets with the form', async () => {
    const page = await newScPage(PLATE);
    const data = () => page.evaluate(() => Object.fromEntries(new FormData(document.querySelector('form')!)));
    expect(await data()).toEqual({ emirate: 'dubai', plateCode: 'A', plateNumber: '48B13' });

    await page.evaluate(() => {
      const w = window as unknown as { events: string[] };
      w.events = [];
      const el = document.getElementById('plate-number')!;
      for (const type of ['input', 'change', 'scInput', 'scChange']) el.addEventListener(type, () => w.events.push(type));
    });
    await page.click('#plate-number');
    await page.keyboard.down('Meta');
    await page.keyboard.press('a');
    await page.keyboard.up('Meta');
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
    expect(await inner(page, '#plate-number', 'input.value')).toBe('48B13');
  });

  it('turns Arabic-Indic digits into Latin digits as they are typed, keeping every other character (LANG-21)', async () => {
    const page = await newScPage(
      `<form><sc-text-input id="eid" name="eid" label="رقم الهوية الإماراتية" inputmode="numeric" width="20" ltr></sc-text-input></form>`,
      { lang: 'ar' },
    );
    await page.click('#eid');
    await page.keyboard.type('٧٨٤-۱۹۹۰-');
    await page.keyboard.type('١٢٣');
    await page.waitForChanges();
    expect(await inner(page, '#eid', 'input.value')).toBe('784-1990-123');
    expect(await page.$eval('#eid', (el) => (el as HTMLElement & { value: string }).value)).toBe('784-1990-123');
    expect(await page.evaluate(() => new FormData(document.querySelector('form')!).get('eid'))).toBe('784-1990-123');
    // The caret stays at the end, so typing carries on where it was.
    expect(await inner(page, '#eid', 'input.selectionStart')).toBe(12);
  });

  it('reports native validity anchored to the inner input', async () => {
    const page = await newScPage(`<form><sc-text-input id="name" name="name" label="Full name" required></sc-text-input><sc-text-input id="email" name="email" label="Email" type="email" ltr></sc-text-input></form>`);
    expect(await page.evaluate(() => document.querySelector('form')!.checkValidity())).toBe(false);
    expect(await page.$eval('#name', (el) => el.matches(':invalid'))).toBe(true);
    // reportValidity focuses the anchor: the inner input.
    await page.evaluate(() => document.querySelector('form')!.reportValidity());
    expect(await inner(page, '#name', 'root.activeElement === input')).toBe(true);

    await page.keyboard.type('Saleh Al Mansoori');
    await page.waitForChanges();
    expect(await page.$eval('#name', (el) => el.matches(':valid'))).toBe(true);

    await page.click('#email');
    await page.keyboard.type('name@example');
    await page.keyboard.press('Backspace');
    await page.keyboard.type('.');
    await page.waitForChanges();
    // "name@example." is not a valid email (typeMismatch on the inner input, mirrored to the host).
    expect(await inner(page, '#email', 'input.validity.typeMismatch')).toBe(true);
    expect(await page.$eval('#email', (el) => el.matches(':invalid'))).toBe(true);
  });

  it('focuses the input from the host, from an error-summary link to its id and from the keyboard', async () => {
    // An error summary focuses the target of its links (browsers don't move focus to a fragment
    // target that isn't itself focusable); delegatesFocus sends that focus to the inner input.
    const page = await newScPage(`<a id="link" href="#plate-number">Enter numbers only, like 12345</a>${PLATE}`);
    await page.evaluate(() =>
      document.getElementById('link')!.addEventListener('click', (ev) => {
        ev.preventDefault();
        (document.getElementById('plate-number') as HTMLElement).focus();
      }),
    );
    await page.evaluate(() => (document.getElementById('plate-code') as HTMLElement).focus());
    expect(await inner(page, '#plate-code', 'root.activeElement === input')).toBe(true);

    await page.click('#link');
    await page.waitForChanges();
    expect(await page.evaluate(() => document.activeElement!.id)).toBe('plate-number');
    expect(await inner(page, '#plate-number', 'root.activeElement === input')).toBe(true);

    await page.keyboard.down('Shift');
    await page.keyboard.press('Tab');
    await page.keyboard.up('Shift');
    expect(await page.evaluate(() => document.activeElement!.id)).toBe('plate-code');
    expect(await inner(page, '#plate-code', 'input.matches(":focus-visible")')).toBe(true);
    expect(await inner(page, '#plate-code', 'getComputedStyle(root.querySelector(".frame")).outlineWidth')).toBe('3px');
  });

  it('follows a disabled fieldset and is left out of the form data', async () => {
    const page = await newScPage(`<form><fieldset disabled><sc-text-input name="plate" label="Plate" value="12345"></sc-text-input></fieldset></form>`);
    expect(await inner(page, 'sc-text-input', 'input.disabled')).toBe(true);
    expect(await page.evaluate(() => [...new FormData(document.querySelector('form')!).keys()])).toEqual([]);
    await page.evaluate(() => (document.querySelector('fieldset')!.disabled = false));
    await page.waitForChanges();
    expect(await inner(page, 'sc-text-input', 'input.disabled')).toBe(false);
    expect(await page.evaluate(() => new FormData(document.querySelector('form')!).get('plate'))).toBe('12345');
  });

  it('re-renders its strings when lang changes, and switches to the Arabic type scale', async () => {
    const page = await newScPage(`<sc-text-input label="Plate number" optional error="Enter numbers only"></sc-text-input>`, { lang: 'en' });
    expect(await inner(page, 'sc-text-input', 'root.querySelector(".optional").textContent')).toBe(' (optional)');
    expect(await inner(page, 'sc-text-input', 'getComputedStyle(root.querySelector("label")).fontWeight')).toBe('500');
    await setPageContext(page, { lang: 'ar' });
    expect(await inner(page, 'sc-text-input', 'root.querySelector(".optional").textContent')).toBe(' (اختياري)');
    expect(await inner(page, 'sc-text-input', 'root.querySelector(".error .visually-hidden").textContent')).toBe('خطأ: ');
    expect(await inner(page, 'sc-text-input', 'getComputedStyle(root.querySelector("label")).fontWeight')).toBe('700');
    expect(await inner(page, 'sc-text-input', 'getComputedStyle(root.querySelector("label")).letterSpacing')).toBe('normal');
  });

  it('takes its focus ring from the channel', async () => {
    const page = await newScPage(`<sc-text-input label="Plate number"></sc-text-input>`, { channel: 'now' });
    await page.keyboard.press('Tab');
    const ring = () => inner(page, 'sc-text-input', 'getComputedStyle(root.querySelector(".frame")).outlineColor');
    const now = await ring();
    await setPageContext(page, { channel: 'transport' });
    expect(await ring()).not.toBe(now);
  });

  it('keeps its border and error state in forced colours (Windows High Contrast)', async () => {
    const page = await newScPage(PLATE);
    // Puppeteer's emulateMediaFeatures doesn't accept forced-colors; the DevTools protocol does.
    const cdp = await (page as unknown as { createCDPSession: () => Promise<{ send: (m: string, p: object) => Promise<unknown> }> }).createCDPSession();
    await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'forced-colors', value: 'active' }] });
    await new Promise((r) => setTimeout(r, 300)); // let the emulated media reach the adopted stylesheets
    const border = (sel: string) => inner(page, sel, 'getComputedStyle(root.querySelector(".frame")).borderTopWidth');
    expect(await border('#plate-code')).not.toBe('0px');
    // The error border is thicker, so it doesn't rely on colour.
    expect(parseFloat(await border('#plate-number'))).toBeGreaterThan(parseFloat(await border('#plate-code')));
    expect(await inner(page, '#plate-number', 'getComputedStyle(root.querySelector(".field")).borderLeftWidth')).toBe('3px');
  });

  for (const ctx of contexts) {
    it(`has no axe violations (${ctx.lang}, ${ctx.theme})`, async () => {
      const page = await newScPage(ctx.lang === 'ar' ? `<main><h1>تجديد ترخيص المركبة</h1>${PLATE_AR}</main>${ALL_STATES.replace('<main>', '<div>').replace('</main>', '</div>')}` : ALL_STATES, ctx);
      await expectNoAxeViolations(page);
    });
  }

  it('has no axe violations while focused, on every channel', async () => {
    const page = await newScPage(ALL_STATES);
    await page.keyboard.press('Tab');
    for (const channel of ['now', 'transport', 'visit', 'justice', 'build', 'invest', 'trade'] as const) {
      await setPageContext(page, { channel, theme: 'dark' });
      await expectNoAxeViolations(page);
    }
  });
});
