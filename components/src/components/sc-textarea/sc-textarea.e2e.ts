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

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const ALL_STATES = `
  <main>
    <h1>Cancel your vehicle registration</h1>
    <sc-textarea label="Why are you cancelling the registration?" hint="For example, the vehicle was sold or exported" maxlength="200" value="Sold to a dealer"></sc-textarea>
    <sc-textarea label="Add a note for the inspector" maxlength="10" value="Please call before arriving"></sc-textarea>
    <sc-textarea label="Describe the damage" error="Describe the damage to the vehicle"></sc-textarea>
    <sc-textarea label="Anything else we should know" optional rows="3"></sc-textarea>
    <sc-textarea label="Inspector's note" disabled value="Passed"></sc-textarea>
  </main>`;

describe('sc-textarea (e2e)', () => {
  it('exposes its name, the hint, the limit and the error', async () => {
    const page = await newScPage(`<sc-textarea label="Why are you cancelling?" hint="For example, the vehicle was sold" maxlength="200" error="Enter why you are cancelling"></sc-textarea>`);
    const node = await axNode(page, 'sc-textarea');
    expect(node!.role).toBe('textbox');
    expect(node!.name).toBe('Why are you cancelling?');
    expect(node!.description).toBe('For example, the vehicle was sold Error: Enter why you are cancelling You can enter up to 200 characters');
    expect(node!.invalid).toBe('true');
  });

  it('updates the visible count on every keystroke, but announces it politely only after typing pauses', async () => {
    const page = await newScPage(`<sc-textarea label="Reason" maxlength="20"></sc-textarea>`);
    const live = () => inner(page, 'sc-textarea', 'root.querySelector("[aria-live=polite]").textContent');
    const count = () => inner(page, 'sc-textarea', 'root.querySelector(".count").textContent');
    expect(await count()).toBe('You have 20 characters remaining');
    await page.click('sc-textarea');
    await page.keyboard.type('Sold', { delay: 50 });
    await page.waitForChanges();
    expect(await count()).toBe('You have 16 characters remaining');
    // Nothing announced while typing...
    expect(await live()).toBe('');
    await page.keyboard.type(' to', { delay: 50 });
    await sleep(500);
    expect(await live()).toBe('');
    // ...then once, after the pause.
    await sleep(800);
    await page.waitForChanges();
    expect(await live()).toBe('You have 13 characters remaining');
    expect(await inner(page, 'sc-textarea', 'root.querySelector("[aria-live=polite]").getAttribute("aria-atomic")')).toBe('true');
  });

  it('goes over the limit without cutting text, says how many to remove and reports tooLong', async () => {
    const page = await newScPage(`<form><sc-textarea name="note" label="Note" maxlength="5"></sc-textarea></form>`);
    await page.click('sc-textarea');
    await page.keyboard.type('Hello there');
    await page.waitForChanges();
    expect(await inner(page, 'sc-textarea', 'input.value')).toBe('Hello there');
    expect(await inner(page, 'sc-textarea', 'root.querySelector(".count").textContent')).toBe('You have 6 characters too many');
    expect(await inner(page, 'sc-textarea', 'input.getAttribute("aria-invalid")')).toBe('true');
    expect(await page.$eval('sc-textarea', (el) => el.matches(':invalid'))).toBe(true);
    expect(await page.evaluate(() => document.querySelector('form')!.checkValidity())).toBe(false);
  });

  it('submits, resets and follows a disabled fieldset', async () => {
    const page = await newScPage(`<form><fieldset><sc-textarea name="reason" label="Reason" value="Sold"></sc-textarea></fieldset></form>`);
    const value = () => page.evaluate(() => new FormData(document.querySelector('form')!).get('reason'));
    await page.click('sc-textarea');
    await page.keyboard.press('End');
    await page.keyboard.type(' to a dealer');
    await page.waitForChanges();
    expect(await value()).toBe('Sold to a dealer');
    await page.evaluate(() => document.querySelector('form')!.reset());
    await page.waitForChanges();
    expect(await value()).toBe('Sold');
    await page.evaluate(() => (document.querySelector('fieldset')!.disabled = true));
    await page.waitForChanges();
    expect(await inner(page, 'sc-textarea', 'input.disabled')).toBe(true);
    expect(await value()).toBeNull();
  });

  it('focuses the textarea from the host and from the keyboard', async () => {
    const page = await newScPage(`<sc-textarea id="reason" label="Reason"></sc-textarea>`);
    await page.keyboard.press('Tab');
    expect(await inner(page, '#reason', 'root.activeElement === input')).toBe(true);
    await page.evaluate(() => (document.activeElement as HTMLElement).blur());
    await page.evaluate(() => document.getElementById('reason')!.focus());
    expect(await inner(page, '#reason', 'root.activeElement === input')).toBe(true);
  });

  it('counts in Arabic with the right plural, and re-renders when lang changes', async () => {
    const page = await newScPage(`<sc-textarea label="Reason" maxlength="120"></sc-textarea>`, { lang: 'en' });
    expect(await inner(page, 'sc-textarea', 'root.querySelector(".count").textContent')).toBe('You have 120 characters remaining');
    await setPageContext(page, { lang: 'ar' });
    expect(await inner(page, 'sc-textarea', 'root.querySelector(".count").textContent')).toBe('يتبقى لديك 120 حرفًا');
    expect(await inner(page, 'sc-textarea', 'root.querySelector("#limit").textContent')).toBe('الحد الأقصى لعدد الأحرف: 120');
    expect(await inner(page, 'sc-textarea', 'getComputedStyle(input).direction')).toBe('rtl');
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
