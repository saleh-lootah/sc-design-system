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

const GROUP = `
  <form novalidate>
    <sc-checkbox-group id="docs" name="documents" label="Which documents do you have?" hint="Select all that apply">
      <sc-checkbox value="insurance" checked>Valid insurance policy</sc-checkbox>
      <sc-checkbox value="inspection" hint="From a centre approved by RTA">Technical inspection certificate</sc-checkbox>
      <sc-checkbox value="fines">Receipt for paid fines</sc-checkbox>
    </sc-checkbox-group>
    <sc-checkbox id="confirm" name="confirm" value="yes">I confirm the vehicle details are correct</sc-checkbox>
  </form>`;

const ALL_STATES = `
  <main>
    <h1>Renew your vehicle registration</h1>
    ${GROUP}
    <sc-checkbox-group label="Which documents do you have?" error="Select at least one document"><sc-checkbox value="a">Valid insurance policy</sc-checkbox><sc-checkbox value="b">Technical inspection certificate</sc-checkbox></sc-checkbox-group>
    <sc-checkbox error="Confirm the vehicle details are correct">I confirm the vehicle details are correct</sc-checkbox>
    <sc-checkbox-group label="Send reminders by" inline optional><sc-checkbox value="sms" checked>SMS</sc-checkbox><sc-checkbox value="email">Email</sc-checkbox></sc-checkbox-group>
    <sc-checkbox-group label="Included in your renewal" disabled><sc-checkbox value="card" checked>Registration card</sc-checkbox></sc-checkbox-group>
  </main>`;

const box = (page: E2EPage, sel: string, expr: string) => inner(page, sel, `((i) => ${expr})(root.querySelector('input'))`);

describe('sc-checkbox-group and sc-checkbox (e2e)', () => {
  it('groups the checkboxes under the legend, and names each by its content', async () => {
    const page = await newScPage(GROUP);
    const group = await axNode(page, '#docs', 'fieldset');
    expect(group!.role).toBe('group');
    expect(group!.name).toBe('Which documents do you have?');
    expect(group!.description).toBe('Select all that apply');
    // The slotted checkboxes sit inside the fieldset in the accessibility tree (it follows the flat tree).
    const inGroup = (group!.children ?? []).flatMap(function walk(n): { role: string; name?: string; checked?: unknown }[] {
      return n.role === 'checkbox' ? [n] : (n.children ?? []).flatMap(walk);
    });
    expect(inGroup.map((n) => n.name)).toEqual(['Valid insurance policy', 'Technical inspection certificate', 'Receipt for paid fines']);
    expect(inGroup[0].checked).toBe(true);
    const second = await axNode(page, 'sc-checkbox[value="inspection"]', 'input');
    expect(second!.description).toBe('From a centre approved by RTA');
  });

  it('Tab reaches each box and Space toggles it; checked boxes submit under the group name', async () => {
    const page = await newScPage(GROUP);
    const data = () => page.evaluate(() => [...new FormData(document.querySelector('form')!)].map(([k, v]) => `${k}=${v}`));
    expect(await data()).toEqual(['documents=insurance']);
    await page.evaluate(() => {
      const w = window as unknown as { values: string[][] };
      w.values = [];
      document.getElementById('docs')!.addEventListener('scGroupChange', (e) => w.values.push((e as CustomEvent).detail.value));
    });
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await page.waitForChanges();
    expect(await data()).toEqual(['documents=inspection', 'confirm=yes']);
    expect(await page.evaluate(() => (window as unknown as { values: string[][] }).values)).toEqual([[], ['inspection']]);
    expect(await box(page, '#confirm', 'i.matches(":focus-visible")')).toBe(true);
  });

  it('resets every box to its initial state', async () => {
    const page = await newScPage(GROUP);
    await page.click('sc-checkbox[value="fines"]');
    await page.click('sc-checkbox[value="insurance"]');
    await page.waitForChanges();
    await page.evaluate(() => document.querySelector('form')!.reset());
    await page.waitForChanges();
    expect(await page.evaluate(() => [...document.querySelectorAll('sc-checkbox')].map((c) => (c as HTMLElement & { checked: boolean }).checked))).toEqual([true, false, false, false]);
  });

  it('reports a missing required choice for the group and for a single checkbox', async () => {
    const page = await newScPage(`<form>
      <sc-checkbox-group id="g" name="documents" label="Documents" required><sc-checkbox value="a">A</sc-checkbox><sc-checkbox value="b">B</sc-checkbox></sc-checkbox-group>
      <sc-checkbox id="c" name="confirm" required>I confirm</sc-checkbox></form>`);
    expect(await page.$eval('#g', (el) => el.matches(':invalid'))).toBe(true);
    expect(await page.$eval('#c', (el) => el.matches(':invalid'))).toBe(true);
    await page.evaluate(() => document.querySelector('form')!.reportValidity());
    expect(await box(page, 'sc-checkbox[value="a"]', 'root.activeElement === i')).toBe(true);
    await page.keyboard.press('Space');
    // Clicking the label text toggles the box.
    const label = await page.evaluateHandle(() => document.getElementById('c')!.shadowRoot!.querySelector('label')!);
    await (label as unknown as { click: () => Promise<void> }).click();
    await page.waitForChanges();
    expect(await page.$eval('#g', (el) => el.matches(':valid'))).toBe(true);
    expect(await page.$eval('#c', (el) => el.matches(':valid'))).toBe(true);
  });

  it('shows the group error on the group and marks every box invalid', async () => {
    const page = await newScPage(`<sc-checkbox-group id="g" label="Documents" error="Select at least one document"><sc-checkbox value="a">A</sc-checkbox></sc-checkbox-group>`);
    const group = await axNode(page, '#g', 'fieldset');
    expect(group!.description).toBe('Error: Select at least one document');
    const node = await axNode(page, 'sc-checkbox', 'input');
    expect(node!.invalid).toBe('true');
    await page.$eval('#g', (el) => el.removeAttribute('error'));
    await page.waitForChanges();
    expect((await axNode(page, 'sc-checkbox', 'input'))!.invalid).toBeFalsy();
  });

  it('draws the tick the same way in both directions, with the box at the start', async () => {
    const page = await newScPage(`<sc-checkbox id="c" checked>أؤكد أن بيانات المركبة صحيحة</sc-checkbox>`, { lang: 'ar' });
    expect(await inner(page, '#c', 'getComputedStyle(root.querySelector(".mark")).transform')).toBe(await (async () => {
      await setPageContext(page, { lang: 'en' });
      return inner(page, '#c', 'getComputedStyle(root.querySelector(".mark")).transform');
    })());
    await setPageContext(page, { lang: 'ar' });
    expect(await box(page, '#c', 'i.getBoundingClientRect().left > root.querySelector("label").getBoundingClientRect().left')).toBe(true);
    expect(await box(page, '#c', 'Math.round(i.getBoundingClientRect().width)')).toBe(24);
    expect(await inner(page, '#c', 'Math.round(root.querySelector("label").getBoundingClientRect().height)')).toBeGreaterThanOrEqual(44);
  });

  it('disables boxes in a disabled group and in a disabled fieldset', async () => {
    const page = await newScPage(`<form><fieldset disabled><sc-checkbox name="a" checked>A</sc-checkbox></fieldset><sc-checkbox-group label="G" disabled><sc-checkbox name="b" checked>B</sc-checkbox></sc-checkbox-group></form>`);
    expect(await box(page, 'sc-checkbox[name="a"]', 'i.disabled')).toBe(true);
    expect(await box(page, 'sc-checkbox[name="b"]', 'i.disabled')).toBe(true);
  });

  it('stays visible in forced colours (Windows High Contrast)', async () => {
    const page = await newScPage(`<sc-checkbox id="on" checked>On</sc-checkbox><sc-checkbox id="off">Off</sc-checkbox><sc-radio-group label="R" value="a"><sc-radio value="a">A</sc-radio></sc-radio-group>`);
    // Puppeteer's emulateMediaFeatures doesn't accept forced-colors; the DevTools protocol does.
    const cdp = await (page as unknown as { createCDPSession: () => Promise<{ send: (m: string, p: object) => Promise<unknown> }> }).createCDPSession();
    await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'forced-colors', value: 'active' }] });
    await new Promise((r) => setTimeout(r, 300)); // let the emulated media reach the adopted stylesheets
    const highlight = await page.evaluate(() => {
      const probe = document.createElement('div');
      probe.style.backgroundColor = 'Highlight';
      document.body.append(probe);
      return getComputedStyle(probe).backgroundColor;
    });
    expect(await box(page, '#on', 'getComputedStyle(i).backgroundColor')).toBe(highlight);
    expect(await box(page, '#off', 'getComputedStyle(i).borderTopColor')).not.toBe(await box(page, '#off', 'getComputedStyle(i).backgroundColor'));
    expect(await inner(page, 'sc-radio-group', 'getComputedStyle(root.querySelector(".mark--radio")).backgroundColor')).toBe(highlight);
    expect(await inner(page, 'sc-radio-group', 'getComputedStyle(root.querySelector(".mark--radio")).opacity')).toBe('1');
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
