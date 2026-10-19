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
  it('exposes a combobox named by the label and described by the hint and error', async () => {
    const page = await newScPage(`<sc-select label="Inspection centre" hint="Choose the one nearest to you" error="Select an inspection centre"><option value="">Select a centre</option></sc-select>`);
    const node = await axNode(page, 'sc-select');
    expect(node!.role).toBe('combobox');
    expect(node!.name).toBe('Inspection centre');
    expect(node!.description).toBe('Choose the one nearest to you Error: Select an inspection centre');
    expect(node!.invalid).toBe('true');
  });

  it('submits the chosen value, follows changes and resets', async () => {
    const page = await newScPage(`<form><sc-select name="emirate" label="Issuing authority" value="dubai">${EMIRATES}</sc-select></form>`);
    const value = () => page.evaluate(() => new FormData(document.querySelector('form')!).get('emirate'));
    expect(await value()).toBe('dubai');
    expect(await inner(page, 'sc-select', 'input.value')).toBe('dubai');
    await page.evaluate(() => {
      const w = window as unknown as { events: string[] };
      w.events = [];
      for (const type of ['change', 'scChange']) document.querySelector('sc-select')!.addEventListener(type, () => w.events.push(type));
    });
    // Choose with the keyboard: focus, then type to select (works the same on every platform).
    await page.keyboard.press('Tab');
    expect(await inner(page, 'sc-select', 'root.activeElement === input')).toBe(true);
    await page.keyboard.type('Sha');
    await page.waitForChanges();
    expect(await value()).toBe('sharjah');
    expect(await page.evaluate(() => (window as unknown as { events: string[] }).events)).toEqual(['scChange', 'change']);
    await page.evaluate(() => document.querySelector('form')!.reset());
    await page.waitForChanges();
    expect(await value()).toBe('dubai');
    expect(await inner(page, 'sc-select', 'input.value')).toBe('dubai');
  });

  it('keeps the inner options in sync with the light DOM', async () => {
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

  it('reports valueMissing for a required placeholder, anchored to the inner select', async () => {
    const page = await newScPage(`<form><sc-select name="centre" label="Inspection centre" required><option value="">Select a centre</option><option value="al-quoz">Al Quoz</option></sc-select></form>`);
    expect(await page.$eval('sc-select', (el) => el.matches(':invalid'))).toBe(true);
    await page.evaluate(() => document.querySelector('form')!.reportValidity());
    expect(await inner(page, 'sc-select', 'root.activeElement === input')).toBe(true);
    await page.$eval('sc-select', (el) => ((el as HTMLElement & { value: string }).value = 'al-quoz'));
    await page.waitForChanges();
    expect(await page.$eval('sc-select', (el) => el.matches(':valid'))).toBe(true);
  });

  it('places the chevron at the end, pointing down, in both directions', async () => {
    const page = await newScPage(`<sc-select label="Issuing authority">${EMIRATES}</sc-select>`, { lang: 'en' });
    const chevronAtEnd = () => inner(page, 'sc-select', '(() => { const f = root.querySelector(".frame").getBoundingClientRect(); const c = root.querySelector(".chevron").getBoundingClientRect(); return getComputedStyle(host).direction === "rtl" ? c.left - f.left < 40 : f.right - c.right < 40; })()');
    expect(await chevronAtEnd()).toBe(true);
    expect(await inner(page, 'sc-select', 'getComputedStyle(root.querySelector(".chevron svg")).transform')).toBe('matrix(0, 1, -1, 0, 0, 0)');
    await setPageContext(page, { lang: 'ar' });
    expect(await chevronAtEnd()).toBe(true);
    expect(await inner(page, 'sc-select', 'getComputedStyle(root.querySelector(".chevron svg")).transform')).toBe('matrix(0, 1, -1, 0, 0, 0)');
  });

  it('follows a disabled fieldset', async () => {
    const page = await newScPage(`<form><fieldset disabled><sc-select name="emirate" label="Issuing authority">${EMIRATES}</sc-select></fieldset></form>`);
    expect(await inner(page, 'sc-select', 'input.disabled')).toBe(true);
    expect(await page.evaluate(() => new FormData(document.querySelector('form')!).get('emirate'))).toBeNull();
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
      await setPageContext(page, { channel, theme: 'dark' });
      await expectNoAxeViolations(page);
    }
  });
});
