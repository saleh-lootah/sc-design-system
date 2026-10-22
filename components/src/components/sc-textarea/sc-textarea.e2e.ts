import { describeAxe, expectNoAxeViolations } from '../../test/axe';
import { newScPage, setPageContext } from '../../test/page';
import { CHANNELS, axNode, inner } from '../sc-text-input/field-test';

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
  it('renders a native textarea in light DOM and exposes its name, the hint, the error and the limit', async () => {
    const page = await newScPage(`<sc-textarea label="Why are you cancelling?" hint="For example, the vehicle was sold" maxlength="200" error="Enter why you are cancelling"></sc-textarea>`);
    expect(await inner(page, 'sc-textarea', 'host.shadowRoot === null && input.tagName')).toBe('TEXTAREA');
    const node = await axNode(page, 'sc-textarea');
    expect(node!.role).toBe('textbox');
    expect(node!.name).toBe('Why are you cancelling?');
    expect(node!.description).toBe('For example, the vehicle was sold Error: Enter why you are cancelling You can enter up to 200 characters');
    expect(node!.invalid).toBe('true');
  });

  it('updates the visible count on every keystroke, but announces it politely only after typing pauses', async () => {
    const page = await newScPage(`<sc-textarea label="Reason" maxlength="20"></sc-textarea>`);
    const live = () => inner(page, 'sc-textarea', 'q("[aria-live=polite]").textContent');
    const count = () => inner(page, 'sc-textarea', 'q(".sc-textarea__count").textContent');
    expect(await count()).toBe('You have 20 characters remaining');
    await page.click('sc-textarea textarea');
    await page.keyboard.type('Sold', { delay: 30 });
    await page.waitForChanges();
    expect(await count()).toBe('You have 16 characters remaining');
    expect(await live()).toBe('');
    await page.keyboard.type(' to', { delay: 30 });
    expect(await live()).toBe('');
    await page.waitForFunction(() => document.querySelector('sc-textarea [aria-live=polite]')!.textContent !== '', { timeout: 3000 });
    expect(await live()).toBe('You have 13 characters remaining');
    expect(await inner(page, 'sc-textarea', 'q("[aria-live=polite]").getAttribute("aria-atomic")')).toBe('true');
  });

  it('goes over the limit without cutting text, says how many to remove and blocks submission', async () => {
    const page = await newScPage(`<form><sc-textarea name="note" label="Note" maxlength="5"></sc-textarea></form>`);
    await page.click('sc-textarea textarea');
    await page.keyboard.type('Hello there');
    await page.waitForChanges();
    expect(await inner(page, 'sc-textarea', 'input.value')).toBe('Hello there');
    expect(await inner(page, 'sc-textarea', 'q(".sc-textarea__count").textContent')).toBe('You have 6 characters too many');
    expect(await inner(page, 'sc-textarea', 'input.getAttribute("aria-invalid")')).toBe('true');
    expect(await inner(page, 'sc-textarea', 'input.matches(":invalid")')).toBe(true);
    expect(await inner(page, 'sc-textarea', 'input.validationMessage')).toBe('You have 6 characters too many');
    expect(await page.evaluate(() => document.querySelector('form')!.checkValidity())).toBe(false);
  });

  it('submits, resets and follows a disabled fieldset natively', async () => {
    const page = await newScPage(`<form><fieldset><sc-textarea name="reason" label="Reason" value="Sold"></sc-textarea></fieldset></form>`);
    const value = () => page.evaluate(() => new FormData(document.querySelector('form')!).get('reason'));
    await page.click('sc-textarea textarea');
    await page.keyboard.press('End');
    await page.keyboard.type(' to a dealer');
    expect(await value()).toBe('Sold to a dealer');
    await page.evaluate(() => document.querySelector('form')!.reset());
    await page.waitForChanges();
    expect(await value()).toBe('Sold');
    expect(await page.$eval('sc-textarea', (el) => (el as HTMLElement & { value: string }).value)).toBe('Sold');
    await page.evaluate(() => (document.querySelector('fieldset')!.disabled = true));
    expect(await inner(page, 'sc-textarea', 'input.matches(":disabled")')).toBe(true);
    expect(await value()).toBeNull();
  });

  it('focuses the textarea from the host and from the keyboard; Enter adds a line, it never submits', async () => {
    const page = await newScPage(`<form><sc-textarea id="reason" label="Reason"></sc-textarea></form>`);
    await page.evaluate(() => {
      const w = window as unknown as { submits: number };
      w.submits = 0;
      document.querySelector('form')!.addEventListener('submit', (e) => (e.preventDefault(), w.submits++));
    });
    await page.keyboard.press('Tab');
    expect(await inner(page, '#reason', 'document.activeElement === input')).toBe(true);
    await page.keyboard.type('Line 1');
    await page.keyboard.press('Enter');
    expect(await page.evaluate(() => (window as unknown as { submits: number }).submits)).toBe(0);
    await page.evaluate(() => (document.activeElement as HTMLElement).blur());
    await page.evaluate(() => document.getElementById('reason')!.focus());
    expect(await inner(page, '#reason', 'document.activeElement === input')).toBe(true);
  });

  it('turns Arabic-Indic digits into Latin digits (LANG-21)', async () => {
    const page = await newScPage(`<sc-textarea label="ملاحظة"></sc-textarea>`, { lang: 'ar' });
    await page.click('sc-textarea textarea');
    await page.keyboard.type('الطابق ٣');
    expect(await inner(page, 'sc-textarea', 'input.value')).toBe('الطابق 3');
  });

  it('strips bidi control characters from a pasted value (R9, LANG-21)', async () => {
    const page = await newScPage(`<form><sc-textarea id="note" name="note" label="ملاحظة"></sc-textarea></form>`, { lang: 'ar' });
    // A code copied from an Arabic SMS carries LANG-15 isolates: U+2066 ... U+2069.
    await page.evaluate((sel: string) => {
      const field = document.querySelector(sel)!.querySelector('textarea') as HTMLTextAreaElement;
      field.focus();
      document.execCommand('insertText', false, String.fromCharCode(0x2066) + '123456' + String.fromCharCode(0x2069));
    }, '#note');
    await page.waitForChanges();
    expect(await page.evaluate((sel: string) => (document.querySelector(sel)!.querySelector('textarea') as HTMLTextAreaElement).value, '#note')).toBe('123456');
    expect(await page.evaluate((sel: string) => (document.querySelector(sel)!.querySelector('textarea') as HTMLTextAreaElement).selectionStart, '#note')).toBe(6);
    expect(await page.$eval('#note', (el) => (el as HTMLElement & { value: string }).value)).toBe('123456');
    expect(await page.evaluate(() => new FormData(document.querySelector('form')!).get('note'))).toBe('123456');
  });

  it('counts in Arabic with the right plural, and re-renders when lang changes', async () => {
    const page = await newScPage(`<sc-textarea label="Reason" maxlength="120"></sc-textarea>`, { lang: 'en' });
    expect(await inner(page, 'sc-textarea', 'q(".sc-textarea__count").textContent')).toBe('You have 120 characters remaining');
    await setPageContext(page, { lang: 'ar' });
    expect(await inner(page, 'sc-textarea', 'q(".sc-textarea__count").textContent')).toBe('يتبقى لديك 120 حرفًا');
    expect(await inner(page, 'sc-textarea', 'q("[id$=-limit]").textContent')).toBe('الحد الأقصى لعدد الأحرف: 120');
    expect(await inner(page, 'sc-textarea', 'getComputedStyle(input).direction')).toBe('rtl');
    expect(await inner(page, 'sc-textarea', 'getComputedStyle(q(".sc-textarea__count")).fontSize')).toBe('18px');
  });

  it('uses body-large with body leading for the value, and the field box', async () => {
    const page = await newScPage(`<sc-textarea label="Reason" rows="3"></sc-textarea>`);
    expect(await inner(page, 'sc-textarea', '[getComputedStyle(input).fontSize, getComputedStyle(input).lineHeight]')).toEqual(['18px', '26px']);
    expect(await inner(page, 'sc-textarea', 'getComputedStyle(q(".sc-field__frame")).borderTopLeftRadius')).toBe('8px');
    expect(await inner(page, 'sc-textarea', 'getComputedStyle(input).resize')).toBe('vertical');
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

describeAxe('sc-textarea', ALL_STATES);
