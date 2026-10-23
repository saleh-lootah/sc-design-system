import { E2EPage } from '@stencil/core/testing';
import { describeAxe, expectNoAxeViolations } from '../../test/axe';
import { newScPage, setPageContext, settleTransitions } from '../../test/page';
import { CHANNELS, axNode, forceColors, inner, token } from '../sc-text-input/field-test';

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

const box = (page: E2EPage, sel: string, expr: string) => inner(page, sel, `((i) => ${expr})(host.querySelector('input'))`);

describe('sc-checkbox-group and sc-checkbox (e2e)', () => {
  it('groups native checkboxes in a light-DOM fieldset named by the legend, each named by its content', async () => {
    const page = await newScPage(GROUP);
    expect(await inner(page, '#docs', '[host.shadowRoot, q("fieldset > .sc-choice-group__options > sc-checkbox") !== null]')).toEqual([null, true]);
    const group = await axNode(page, '#docs', 'fieldset');
    expect(group!.role).toBe('group');
    expect(group!.name).toBe('Which documents do you have?');
    expect(group!.description).toBe('Select all that apply');
    const inGroup = (group!.children ?? []).flatMap(function walk(n): { role: string; name?: string; checked?: unknown }[] {
      return n.role === 'checkbox' ? [n] : (n.children ?? []).flatMap(walk);
    });
    expect(inGroup.map((n) => n.name)).toEqual(['Valid insurance policy', 'Technical inspection certificate', 'Receipt for paid fines']);
    expect(inGroup[0].checked).toBe(true);
    const second = await axNode(page, 'sc-checkbox[value="inspection"]', 'input');
    expect(second!.description).toBe('From a centre approved by RTA');
  });

  it('Tab reaches each box and Space toggles it; checked boxes submit under the group name natively', async () => {
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
    expect(await box(page, '#confirm', 'getComputedStyle(i).outlineWidth')).toBe('3px');
  });

  it('resets every box to its initial state', async () => {
    const page = await newScPage(GROUP);
    await page.click('sc-checkbox[value="fines"] label');
    await page.click('sc-checkbox[value="insurance"] label');
    await page.evaluate(() => document.querySelector('form')!.reset());
    await page.waitForChanges();
    expect(await page.evaluate(() => [...document.querySelectorAll('sc-checkbox')].map((c) => [(c as HTMLElement & { checked: boolean }).checked, c.querySelector('input')!.checked]))).toEqual([
      [true, true],
      [false, false],
      [false, false],
      [false, false],
    ]);
  });

  it('reports a missing required choice for the group and for a single checkbox, natively', async () => {
    const page = await newScPage(`<form>
      <sc-checkbox-group id="g" name="documents" label="Documents" required><sc-checkbox value="a">A</sc-checkbox><sc-checkbox value="b">B</sc-checkbox></sc-checkbox-group>
      <sc-checkbox id="c" name="confirm" required>I confirm</sc-checkbox></form>`);
    expect(await page.evaluate(() => document.querySelector('form')!.checkValidity())).toBe(false);
    expect(await box(page, 'sc-checkbox[value="a"]', 'i.validationMessage')).toBe('Select at least one option');
    expect(await box(page, '#c', 'i.validity.valueMissing')).toBe(true);
    await page.evaluate(() => document.querySelector('form')!.reportValidity());
    expect(await box(page, 'sc-checkbox[value="a"]', 'document.activeElement === i')).toBe(true);
    await page.click('sc-checkbox[value="b"] label');
    await page.click('#c label');
    expect(await page.evaluate(() => document.querySelector('form')!.checkValidity())).toBe(true);
  });

  it('shows the group error on the group and marks every box invalid', async () => {
    const page = await newScPage(`<sc-checkbox-group id="g" label="Documents" error="Select at least one document"><sc-checkbox value="a">A</sc-checkbox></sc-checkbox-group>`);
    const group = await axNode(page, '#g', 'fieldset');
    expect(group!.description).toBe('Error: Select at least one document');
    expect((await axNode(page, 'sc-checkbox', 'input'))!.invalid).toBe('true');
    // The box's border fades to the error colour (120ms) once the group renders its error.
    await settleTransitions(page);
    expect(await box(page, 'sc-checkbox', 'getComputedStyle(i).borderTopColor')).toBe(await token(page, 'body', '--sc-color-error'));
    await page.$eval('#g', (el) => el.removeAttribute('error'));
    await page.waitForChanges();
    expect((await axNode(page, 'sc-checkbox', 'input'))!.invalid).toBeFalsy();
  });

  it('draws a 24px box with a 2px edge and the channel fill when checked, at the start in both directions', async () => {
    const page = await newScPage(`<sc-checkbox id="c" checked>أؤكد أن بيانات المركبة صحيحة</sc-checkbox><sc-checkbox id="o">B</sc-checkbox>`, { lang: 'ar' });
    expect(await box(page, '#c', 'i.getBoundingClientRect().left > host.querySelector("label").getBoundingClientRect().left')).toBe(true);
    expect(await box(page, '#c', 'Math.round(i.getBoundingClientRect().width)')).toBe(24);
    expect(await box(page, '#c', 'getComputedStyle(i).backgroundColor')).toBe(await token(page, 'body', '--sc-color-channel-action'));
    expect(await box(page, '#o', 'getComputedStyle(i).borderTopWidth')).toBe('2px');
    expect(await box(page, '#o', 'getComputedStyle(i).borderTopColor')).toBe(await token(page, 'body', '--sc-color-outline'));
    expect(await inner(page, '#c', 'Math.round(q("label").getBoundingClientRect().height)')).toBeGreaterThanOrEqual(48);
    // The check is a symbol: drawn the same way in both directions.
    const ar = await inner(page, '#c', 'getComputedStyle(q(".sc-choice__mark")).transform');
    await setPageContext(page, { lang: 'en' });
    expect(await inner(page, '#c', 'getComputedStyle(q(".sc-choice__mark")).transform')).toBe(ar);
    expect(await box(page, '#c', 'i.getBoundingClientRect().left < host.querySelector("label").getBoundingClientRect().right')).toBe(true);
  });

  it('disables boxes in a disabled group and in a disabled fieldset, natively', async () => {
    const page = await newScPage(`<form><fieldset disabled><sc-checkbox name="a" checked>A</sc-checkbox></fieldset><sc-checkbox-group label="G" disabled><sc-checkbox name="b" checked>B</sc-checkbox></sc-checkbox-group></form>`);
    expect(await box(page, 'sc-checkbox[name="a"]', 'i.matches(":disabled")')).toBe(true);
    expect(await box(page, 'sc-checkbox[name="b"]', 'i.matches(":disabled")')).toBe(true);
    expect(await page.evaluate(() => [...new FormData(document.querySelector('form')!).keys()])).toEqual([]);
  });

  it('moves boxes added later into the group', async () => {
    const page = await newScPage(GROUP);
    await page.evaluate(() => {
      const b = document.createElement('sc-checkbox');
      b.setAttribute('value', 'noc');
      b.textContent = 'No objection certificate';
      document.getElementById('docs')!.append(b);
    });
    await page.waitForChanges();
    await page.waitForFunction(() => document.querySelector('sc-checkbox[value="noc"] input'));
    expect(await inner(page, '#docs', 'q("sc-checkbox[value=noc]").parentElement.classList.contains("sc-choice-group__options")')).toBe(true);
    await page.click('sc-checkbox[value="noc"] label');
    expect(await page.evaluate(() => new FormData(document.querySelector('form')!).getAll('documents'))).toEqual(['insurance', 'noc']);
  });

  it('stays visible in forced colours (Windows High Contrast)', async () => {
    const page = await newScPage(`<sc-checkbox id="on" checked>On</sc-checkbox><sc-checkbox id="off">Off</sc-checkbox>`);
    await forceColors(page);
    const highlight = await page.evaluate(() => {
      const probe = document.createElement('div');
      probe.style.backgroundColor = 'Highlight';
      document.body.append(probe);
      return getComputedStyle(probe).backgroundColor;
    });
    expect(await box(page, '#on', 'getComputedStyle(i).backgroundColor')).toBe(highlight);
    expect(await box(page, '#off', 'getComputedStyle(i).borderTopColor')).not.toBe(await box(page, '#off', 'getComputedStyle(i).backgroundColor'));
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

describeAxe('sc-checkbox-group', ALL_STATES);
