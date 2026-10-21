import { newSpecPage } from '@stencil/core/testing';
import { ScSelect } from './sc-select';

const render = (html: string) => newSpecPage({ components: [ScSelect], html });
const q = (page: { body: HTMLElement }, css: string) => page.body.querySelector(`sc-select ${css}`) as HTMLElement;

describe('sc-select (spec)', () => {
  it('renders a labelled native select in light DOM with the chevron', async () => {
    const page = await render(`<sc-select label="Issuing authority" name="emirate"><option value="dubai">Dubai</option></sc-select>`);
    expect(page.root!.shadowRoot).toBeNull();
    const select = q(page, 'select');
    expect(q(page, 'label').getAttribute('for')).toBe(select.id);
    expect(select.getAttribute('name')).toBe('emirate');
    expect(q(page, '.sc-select__chevron')).not.toBeNull();
    expect(q(page, '.sc-select__chevron').getAttribute('aria-hidden')).toBe('true');
  });

  it('wires hint and error and marks the error', async () => {
    const page = await render(`<sc-select label="Centre" hint="Nearest to you" error="Select a centre" required><option value="">Select</option></sc-select>`);
    const select = q(page, 'select');
    expect(select.getAttribute('aria-describedby')).toBe(`${q(page, '.sc-field__hint').id} ${q(page, '.sc-field__error').id}`);
    expect(select.getAttribute('aria-invalid')).toBe('true');
    expect(select.hasAttribute('required')).toBe(true);
    expect(q(page, '.sc-field__frame')).toHaveClass('sc-field__frame--error');
  });

  it('uses the Arabic strings', async () => {
    const page = await render(`<div lang="ar"><sc-select label="جهة الإصدار" optional error="يُرجى اختيار جهة الإصدار"><option>دبي</option></sc-select></div>`);
    expect(q(page, '.sc-field__optional').textContent).toBe(' (اختياري)');
    expect(q(page, '.sc-field__error .visually-hidden').textContent).toBe('خطأ: ');
  });
});
