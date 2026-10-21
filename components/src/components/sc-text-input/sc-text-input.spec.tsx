import { newSpecPage } from '@stencil/core/testing';
import { ScTextInput } from './sc-text-input';

const render = (html: string) => newSpecPage({ components: [ScTextInput], html });
const q = (page: { body: HTMLElement }, css: string) => page.body.querySelector(`sc-text-input ${css}`) as HTMLElement;

describe('sc-text-input (spec)', () => {
  it('renders the label wired to a native input in light DOM, with no hint or error by default', async () => {
    const page = await render(`<sc-text-input label="Plate number" name="plate"></sc-text-input>`);
    expect(page.root!.shadowRoot).toBeNull();
    const label = q(page, 'label');
    const input = q(page, 'input');
    expect(label.textContent).toBe('Plate number');
    expect(input.id).toMatch(/^sc-text-input-\d+-control$/);
    expect(label.getAttribute('for')).toBe(input.id);
    expect(input.getAttribute('name')).toBe('plate');
    expect(input.hasAttribute('aria-describedby')).toBe(false);
    expect(input.hasAttribute('aria-invalid')).toBe(false);
    expect(q(page, '.sc-field__hint').hasAttribute('hidden')).toBe(true);
    expect(q(page, '.sc-field__error').hasAttribute('hidden')).toBe(true);
  });

  it('gives every instance its own IDs', async () => {
    const page = await render(`<sc-text-input label="A"></sc-text-input><sc-text-input label="B"></sc-text-input>`);
    const ids = Array.from(page.body.querySelectorAll('input')).map((i) => i.id);
    expect(new Set(ids).size).toBe(2);
  });

  it('describes the input with the hint and the error, and shows the error state', async () => {
    const page = await render(`<sc-text-input label="Plate number" hint="Up to 5 digits, for example 12345" error="Enter numbers only, like 12345"></sc-text-input>`);
    const input = q(page, 'input');
    const [hint, error] = [q(page, '.sc-field__hint'), q(page, '.sc-field__error')];
    expect(input.getAttribute('aria-describedby')).toBe(`${hint.id} ${error.id}`);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(q(page, '.sc-field')).toHaveClass('sc-field--error');
    expect(q(page, '.sc-field__frame')).toHaveClass('sc-field__frame--error');
    expect(error.hasAttribute('hidden')).toBe(false);
    expect(error.querySelector('svg')).not.toBeNull();
    expect(error.querySelector('.visually-hidden')!.textContent).toBe('Error: ');
    expect(error.textContent).toContain('Enter numbers only, like 12345');
  });

  it('appends "(optional)", and uses Arabic strings from the closest lang', async () => {
    const page = await render(`<sc-text-input label="Building name" optional></sc-text-input>`);
    expect(q(page, 'label .sc-field__optional').textContent).toBe(' (optional)');
    const ar = await render(`<div lang="ar" dir="rtl"><sc-text-input label="رقم اللوحة" optional error="يُرجى إدخال رقم اللوحة بالأرقام فقط، مثل 12345"></sc-text-input></div>`);
    expect(q(ar, '.sc-field__optional').textContent).toBe(' (اختياري)');
    expect(q(ar, '.sc-field__error .visually-hidden').textContent).toBe('خطأ: ');
  });

  it('keeps left-to-right values LTR with ltr, without changing the field direction', async () => {
    const page = await render(`<sc-text-input label="Plate number" ltr value="48B13"></sc-text-input>`);
    expect(q(page, 'input').getAttribute('dir')).toBe('ltr');
    expect(q(page, 'input')).toHaveClass('sc-field__control--ltr');
    expect(page.root!.hasAttribute('dir')).toBe(false);
  });

  it('passes input attributes through', async () => {
    const page = await render(`<sc-text-input label="Mobile" type="tel" inputmode="tel" autocomplete="tel" maxlength="9" minlength="9" pattern="5[0-9]+" required readonly></sc-text-input>`);
    const el = q(page, 'input');
    expect(el.getAttribute('type')).toBe('tel');
    expect(el.getAttribute('inputmode')).toBe('tel');
    expect(el.getAttribute('autocomplete')).toBe('tel');
    expect(el.getAttribute('maxlength')).toBe('9');
    expect(el.getAttribute('minlength')).toBe('9');
    expect(el.getAttribute('pattern')).toBe('5[0-9]+');
    expect(el.hasAttribute('required')).toBe(true);
    expect(el.hasAttribute('readonly')).toBe(true);
  });

  it('sizes the box by character width and adds prefix and suffix to the description', async () => {
    const page = await render(`<sc-text-input label="Amount" width="10" prefix-text="AED" suffix-text="per year"></sc-text-input>`);
    const frame = q(page, '.sc-field__frame');
    expect(frame).toHaveClass('sc-field__frame--chars');
    expect(frame.getAttribute('style')).toContain('--_chars');
    const [prefix, suffix] = [q(page, '.sc-field__affix--prefix'), q(page, '.sc-field__affix--suffix')];
    expect(prefix.textContent).toBe('AED');
    expect(suffix.textContent).toBe('per year');
    expect(q(page, 'input').getAttribute('aria-describedby')).toBe(`${prefix.id} ${suffix.id}`);
  });

  it('wraps the label in a heading with heading-level', async () => {
    const page = await render(`<sc-text-input label="What is your plate number?" heading-level="1"></sc-text-input>`);
    const h1 = q(page, 'h1');
    expect(h1.querySelector('label')!.textContent).toBe('What is your plate number?');
    expect(h1.querySelector('label')).toHaveClass('sc-field__label--heading');
  });

  it('disables the input', async () => {
    const page = await render(`<sc-text-input label="Chassis number" disabled></sc-text-input>`);
    expect(q(page, 'input').hasAttribute('disabled')).toBe(true);
  });

  it('moves rich slot content into the label, hint and error', async () => {
    const page = await render(`<sc-text-input><span slot="label">Plate <b>number</b></span><span slot="hint">Hint</span><span slot="error">Wrong</span></sc-text-input>`);
    expect(q(page, 'label').textContent).toBe('Plate number');
    expect(q(page, '.sc-field__hint').textContent).toBe('Hint');
    expect(q(page, '.sc-field__error').textContent).toContain('Wrong');
    expect(q(page, 'input').getAttribute('aria-invalid')).toBe('true');
  });
});
