import { newSpecPage } from '@stencil/core/testing';
import { ScTextInput } from './sc-text-input';

const root = (page: { root?: HTMLElement }) => page.root!.shadowRoot!;
const input = (page: { root?: HTMLElement }) => root(page).querySelector('input')!;

describe('sc-text-input (spec)', () => {
  it('renders a label wired to the input, and no hint or error by default', async () => {
    const page = await newSpecPage({ components: [ScTextInput], html: `<sc-text-input label="Plate number" name="plate"></sc-text-input>` });
    const label = root(page).querySelector('label')!;
    expect(label.textContent).toBe('Plate number');
    expect(label.getAttribute('for')).toBe('control');
    expect(input(page).id).toBe('control');
    expect(input(page).hasAttribute('aria-describedby')).toBe(false);
    expect(input(page).hasAttribute('aria-invalid')).toBe(false);
    expect(root(page).querySelector('.hint')!.hasAttribute('hidden')).toBe(true);
    expect(root(page).querySelector('.error')!.hasAttribute('hidden')).toBe(true);
  });

  it('describes the input with the hint and the error, and shows the error state', async () => {
    const page = await newSpecPage({
      components: [ScTextInput],
      html: `<sc-text-input label="Plate number" hint="Up to 5 digits, for example 12345" error="Enter numbers only, like 12345"></sc-text-input>`,
    });
    expect(input(page).getAttribute('aria-describedby')).toBe('hint error');
    expect(input(page).getAttribute('aria-invalid')).toBe('true');
    expect(root(page).querySelector('.field')).toHaveClass('field--error');
    expect(root(page).querySelector('.frame')).toHaveClass('frame--error');
    const error = root(page).querySelector('.error')!;
    expect(error.hasAttribute('hidden')).toBe(false);
    expect(error.querySelector('svg')).not.toBeNull();
    expect(error.querySelector('.visually-hidden')!.textContent).toBe('Error: ');
    expect(error.textContent).toContain('Enter numbers only, like 12345');
  });

  it('appends "(optional)"', async () => {
    const page = await newSpecPage({ components: [ScTextInput], html: `<sc-text-input label="Building name" optional></sc-text-input>` });
    expect(root(page).querySelector('label .optional')!.textContent).toBe(' (optional)');
  });

  it('uses Arabic strings from the closest lang', async () => {
    const page = await newSpecPage({
      components: [ScTextInput],
      html: `<div lang="ar" dir="rtl"><sc-text-input label="رقم اللوحة" optional error="أدخل رقم اللوحة بالأرقام فقط، مثل 12345"></sc-text-input></div>`,
    });
    const r = page.body.querySelector('sc-text-input')!.shadowRoot!;
    expect(r.querySelector('.optional')!.textContent).toBe(' (اختياري)');
    expect(r.querySelector('.error .visually-hidden')!.textContent).toBe('خطأ: ');
  });

  it('keeps left-to-right values LTR with ltr, without changing the field direction', async () => {
    const page = await newSpecPage({ components: [ScTextInput], html: `<sc-text-input label="Plate number" ltr value="48B13"></sc-text-input>` });
    expect(input(page).getAttribute('dir')).toBe('ltr');
    expect(input(page)).toHaveClass('control--ltr');
    expect(page.root!.hasAttribute('dir')).toBe(false);
  });

  it('passes input attributes through', async () => {
    const page = await newSpecPage({
      components: [ScTextInput],
      html: `<sc-text-input label="Mobile" type="tel" inputmode="tel" autocomplete="tel" maxlength="9" required></sc-text-input>`,
    });
    const el = input(page);
    expect(el.getAttribute('type')).toBe('tel');
    expect(el.getAttribute('inputmode')).toBe('tel');
    expect(el.getAttribute('autocomplete')).toBe('tel');
    expect(el.getAttribute('maxlength')).toBe('9');
    expect(el.hasAttribute('required')).toBe(true);
  });

  it('sizes the box by character width and shows prefix and suffix as part of the description', async () => {
    const page = await newSpecPage({ components: [ScTextInput], html: `<sc-text-input label="Amount" width="10" prefix-text="AED" suffix-text="per year"></sc-text-input>` });
    const frame = root(page).querySelector('.frame') as HTMLElement;
    expect(frame).toHaveClass('frame--chars');
    expect(frame.getAttribute('style')).toContain('--_chars');
    expect(root(page).querySelector('#prefix')!.textContent).toBe('AED');
    expect(root(page).querySelector('#suffix')!.textContent).toBe('per year');
    expect(input(page).getAttribute('aria-describedby')).toBe('prefix suffix');
  });

  it('wraps the label in a heading with heading-level', async () => {
    const page = await newSpecPage({ components: [ScTextInput], html: `<sc-text-input label="What is your plate number?" heading-level="1"></sc-text-input>` });
    const h1 = root(page).querySelector('h1')!;
    expect(h1.querySelector('label')!.textContent).toBe('What is your plate number?');
    expect(h1.querySelector('label')).toHaveClass('label--heading');
  });

  it('disables the input', async () => {
    const page = await newSpecPage({ components: [ScTextInput], html: `<sc-text-input label="Chassis number" disabled></sc-text-input>` });
    expect(input(page).hasAttribute('disabled')).toBe(true);
    expect(root(page).querySelector('.frame')).toHaveClass('frame--disabled');
  });
});
