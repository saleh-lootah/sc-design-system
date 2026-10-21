import { newSpecPage } from '@stencil/core/testing';
import { ScRadio } from '../sc-radio/sc-radio';
import { ScRadioGroup } from './sc-radio-group';

const render = (html: string) => newSpecPage({ components: [ScRadio, ScRadioGroup], html });

describe('sc-radio-group (spec)', () => {
  it('renders a radiogroup fieldset with legend, hint and error in light DOM', async () => {
    const page = await render(`<sc-radio-group name="issuer" label="Who issued the plate?" hint="It's on the plate" error="Select who issued the plate" required><sc-radio value="dubai">Dubai</sc-radio></sc-radio-group>`);
    const fieldset = page.body.querySelector('fieldset')!;
    expect(page.root!.shadowRoot).toBeNull();
    expect(fieldset.getAttribute('role')).toBe('radiogroup');
    expect(fieldset.getAttribute('aria-labelledby')).toBe(page.body.querySelector('legend')!.id);
    expect(fieldset.getAttribute('aria-invalid')).toBe('true');
    expect(fieldset.getAttribute('aria-required')).toBe('true');
    expect(fieldset.querySelector('.sc-choice-group__options sc-radio')).not.toBeNull();
  });

  it('passes the name, the choice, the error and required to each radio', async () => {
    const page = await render(`<sc-radio-group name="issuer" value="other" error="x" required><sc-radio value="dubai">Dubai</sc-radio><sc-radio value="other">Other</sc-radio></sc-radio-group>`);
    await page.waitForChanges();
    const inputs = Array.from(page.body.querySelectorAll('input'));
    expect(inputs.map((i) => i.getAttribute('name'))).toEqual(['issuer', 'issuer']);
    expect(inputs.map((i) => i.hasAttribute('required'))).toEqual([true, true]);
    expect(inputs.every((i) => i.classList.contains('sc-choice__box--invalid'))).toBe(true);
    expect((inputs[1] as HTMLInputElement).checked).toBe(true);
  });

  it('defaults to the checked radio and generates a shared name when there is none', async () => {
    const page = await render(`<sc-radio-group label="Term"><sc-radio value="1">1</sc-radio><sc-radio value="2" checked>2</sc-radio></sc-radio-group>`);
    await page.waitForChanges();
    expect((page.root as HTMLElement & { value: string }).value).toBe('2');
    const names = Array.from(page.body.querySelectorAll('input')).map((i) => i.getAttribute('name'));
    expect(names[0]).toMatch(/^sc-radio-group-\d+$/);
    expect(names[1]).toBe(names[0]);
  });

  it('uses the Arabic strings and the inline layout', async () => {
    const page = await render(`<div lang="ar"><sc-radio-group label="هل المركبة مؤمنة؟" inline optional error="يُرجى الاختيار"><sc-radio value="yes">نعم</sc-radio></sc-radio-group></div>`);
    expect(page.body.querySelector('.sc-field__optional')!.textContent).toBe(' (اختياري)');
    expect(page.body.querySelector('.sc-field__error .visually-hidden')!.textContent).toBe('خطأ: ');
    expect(page.body.querySelector('.sc-choice-group__options')).toHaveClass('sc-choice-group__options--inline');
  });
});
