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

const radio = (page: E2EPage, sel: string, i: number, expr: string) => inner(page, sel, `((r) => ${expr})(root.querySelectorAll('input[type=radio]')[${i}])`);

const GROUP = `
  <form novalidate>
    <sc-radio-group id="issuer" name="issuer" label="Who issued the plate?" hint="It's shown on the plate">
      <sc-radio value="dubai">Dubai</sc-radio>
      <sc-radio value="abu-dhabi" hint="Including Al Ain">Abu Dhabi</sc-radio>
      <sc-radio value="other">Another emirate</sc-radio>
    </sc-radio-group>
    <button type="button" id="after">After</button>
  </form>`;

const ALL_STATES = `
  <main>
    <h1>Renew your vehicle registration</h1>
    ${GROUP}
    <sc-radio-group label="Is the vehicle insured?" inline value="yes"><sc-radio value="yes">Yes</sc-radio><sc-radio value="no">No</sc-radio></sc-radio-group>
    <sc-radio-group label="Who issued the plate?" error="Select who issued the plate"><sc-radio value="dubai">Dubai</sc-radio><sc-radio value="other">Another emirate</sc-radio></sc-radio-group>
    <sc-radio-group label="Preferred language for SMS" optional><sc-radio value="ar">Arabic</sc-radio><sc-radio value="ur" disabled hint="Coming soon">Urdu</sc-radio></sc-radio-group>
    <sc-radio-group label="Do you want to renew for 1 or 2 years?" heading-level="2" value="1"><sc-radio value="1">1 year</sc-radio><sc-radio value="2">2 years</sc-radio></sc-radio-group>
    <sc-radio-group label="Delivery" disabled><sc-radio value="a">Courier</sc-radio></sc-radio-group>
  </main>`;

describe('sc-radio-group (e2e)', () => {
  it('exposes a radiogroup named by the legend, with radios named by their sc-radio content', async () => {
    const page = await newScPage(GROUP);
    const group = await axNode(page, '#issuer', 'fieldset');
    expect(group!.role).toBe('radiogroup');
    expect(group!.name).toBe('Who issued the plate?');
    expect(group!.description).toBe("It's shown on the plate");
    const radios = (group!.children ?? []).flatMap(function walk(n): { role: string; name?: string; description?: string }[] {
      return n.role === 'radio' ? [n] : (n.children ?? []).flatMap(walk);
    });
    expect(radios.map((r) => r.name)).toEqual(['Dubai', 'Abu Dhabi', 'Another emirate']);
    expect(radios[1].description).toBe('Including Al Ain');
    // Position in set comes from the native radio group.
    expect(await radio(page, '#issuer', 1, 'r.name')).toBe(await radio(page, '#issuer', 0, 'r.name'));
  });

  it('is one Tab stop; arrow keys move and select; Tab leaves the group', async () => {
    const page = await newScPage(GROUP);
    await page.evaluate(() => {
      const w = window as unknown as { events: string[] };
      w.events = [];
      const el = document.getElementById('issuer')!;
      el.addEventListener('scChange', (e) => w.events.push(`scChange:${(e as CustomEvent).detail.value}`));
      el.addEventListener('change', () => w.events.push('change'));
    });
    const data = () => page.evaluate(() => new FormData(document.querySelector('form')!).get('issuer'));
    const focused = () => inner(page, '#issuer', '[...root.querySelectorAll("input")].indexOf(root.activeElement)');

    await page.keyboard.press('Tab');
    expect(await focused()).toBe(0);
    expect(await data()).toBeNull();
    await page.keyboard.press('ArrowDown');
    await page.waitForChanges();
    expect(await focused()).toBe(1);
    expect(await data()).toBe('abu-dhabi');
    await page.keyboard.press('ArrowDown');
    await page.waitForChanges();
    expect(await data()).toBe('other');
    await page.keyboard.press('ArrowUp');
    await page.waitForChanges();
    expect(await data()).toBe('abu-dhabi');
    expect(await page.$eval('#issuer', (el) => (el as HTMLElement & { value: string }).value)).toBe('abu-dhabi');
    expect(await page.evaluate(() => (window as unknown as { events: string[] }).events)).toEqual([
      'scChange:abu-dhabi',
      'change',
      'scChange:other',
      'change',
      'scChange:abu-dhabi',
      'change',
    ]);
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement!.id)).toBe('after');
    // Shift+Tab returns to the checked radio.
    await page.keyboard.down('Shift');
    await page.keyboard.press('Tab');
    await page.keyboard.up('Shift');
    expect(await focused()).toBe(1);
  });

  it('selects with Space and by clicking the option text', async () => {
    const page = await newScPage(GROUP);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await page.waitForChanges();
    expect(await page.$eval('#issuer', (el) => (el as HTMLElement & { value: string }).value)).toBe('dubai');
    await page.click('sc-radio[value="other"]');
    await page.waitForChanges();
    expect(await page.$eval('#issuer', (el) => (el as HTMLElement & { value: string }).value)).toBe('other');
    expect(await radio(page, '#issuer', 2, 'r.checked')).toBe(true);
  });

  it('moves with the arrow keys in Arabic too, and mirrors the layout', async () => {
    const page = await newScPage(`<sc-radio-group id="g" label="من أصدر اللوحة؟" error="يُرجى اختيار جهة إصدار اللوحة"><sc-radio value="dubai">دبي</sc-radio><sc-radio value="other">إمارة أخرى</sc-radio></sc-radio-group>`, { lang: 'ar' });
    expect(await inner(page, '#g', 'getComputedStyle(root.querySelector("fieldset")).borderRightWidth')).toBe('3px');
    expect(await radio(page, '#g', 0, 'r.getBoundingClientRect().left > root.querySelector("label.option-label slot").assignedElements()[0].getBoundingClientRect().right')).toBe(true);
    expect(await inner(page, '#g', 'root.querySelector(".error .visually-hidden").textContent')).toBe('خطأ: ');
    await page.keyboard.press('Tab');
    await page.keyboard.press('ArrowDown');
    await page.waitForChanges();
    expect(await page.$eval('#g', (el) => (el as HTMLElement & { value: string }).value)).toBe('other');
  });

  it('submits, resets to the initial choice and reports a missing required choice', async () => {
    const page = await newScPage(`<form><sc-radio-group name="term" label="Renew for" value="1"><sc-radio value="1">1 year</sc-radio><sc-radio value="2">2 years</sc-radio></sc-radio-group><sc-radio-group id="req" name="issuer" label="Issuer" required><sc-radio value="dubai">Dubai</sc-radio></sc-radio-group></form>`);
    const data = () => page.evaluate(() => Object.fromEntries(new FormData(document.querySelector('form')!)));
    expect(await data()).toEqual({ term: '1' });
    expect(await page.$eval('#req', (el) => el.matches(':invalid'))).toBe(true);
    await page.evaluate(() => document.querySelector('form')!.reportValidity());
    expect(await radio(page, '#req', 0, 'root.activeElement === r')).toBe(true);
    await page.keyboard.press('Space');
    await page.click('sc-radio[value="2"]');
    await page.waitForChanges();
    expect(await data()).toEqual({ term: '2', issuer: 'dubai' });
    expect(await page.$eval('#req', (el) => el.matches(':valid'))).toBe(true);
    await page.evaluate(() => document.querySelector('form')!.reset());
    await page.waitForChanges();
    expect(await data()).toEqual({ term: '1' });
    expect(await radio(page, 'sc-radio-group', 0, 'r.checked')).toBe(true);
  });

  it('re-renders when options change, and disables with a fieldset', async () => {
    const page = await newScPage(`<form><fieldset><sc-radio-group label="Issuer"><sc-radio value="dubai">Dubai</sc-radio></sc-radio-group></fieldset></form>`);
    await page.evaluate(() => {
      const r = document.createElement('sc-radio');
      r.setAttribute('value', 'sharjah');
      r.textContent = 'Sharjah';
      document.querySelector('sc-radio-group')!.append(r);
    });
    await page.waitForChanges();
    const node = await axNode(page, 'sc-radio-group', '#option-1');
    expect(node!.name).toBe('Sharjah');
    await page.evaluate(() => (document.querySelector('fieldset')!.disabled = true));
    await page.waitForChanges();
    expect(await radio(page, 'sc-radio-group', 0, 'r.matches(":disabled")')).toBe(true);
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
    await page.keyboard.press('ArrowDown');
    for (const channel of ['now', 'transport', 'visit', 'justice', 'build', 'invest', 'trade'] as const) {
      await setPageContext(page, { channel, theme: 'dark' });
      await expectNoAxeViolations(page);
    }
  });
});
