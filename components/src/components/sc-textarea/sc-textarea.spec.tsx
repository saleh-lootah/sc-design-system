import { newSpecPage } from '@stencil/core/testing';
import { ScTextarea } from './sc-textarea';

const render = (html: string) => newSpecPage({ components: [ScTextarea], html });
const q = (page: { body: HTMLElement }, css: string) => page.body.querySelector(`sc-textarea ${css}`) as HTMLElement;

describe('sc-textarea (spec)', () => {
  it('renders a labelled native textarea in light DOM', async () => {
    const page = await render(`<sc-textarea label="Reason" name="reason" rows="4"></sc-textarea>`);
    expect(page.root!.shadowRoot).toBeNull();
    const ta = q(page, 'textarea');
    expect(q(page, 'label').getAttribute('for')).toBe(ta.id);
    expect(ta.getAttribute('name')).toBe('reason');
    expect(ta.getAttribute('rows')).toBe('4');
    expect(q(page, '.sc-textarea__count')).toBeNull();
  });

  it('keeps at least 3 rows', async () => {
    const page = await render(`<sc-textarea label="Reason" rows="1"></sc-textarea>`);
    expect(q(page, 'textarea').getAttribute('rows')).toBe('3');
  });

  it('shows the count and links the limit, with the right Arabic plural', async () => {
    const page = await render(`<sc-textarea label="Reason" maxlength="200" value="Sold"></sc-textarea>`);
    expect(q(page, '.sc-textarea__count').textContent).toBe('You have 196 characters remaining');
    const limit = q(page, '[id$="-limit"]');
    expect(limit.textContent).toBe('You can enter up to 200 characters');
    expect(q(page, 'textarea').getAttribute('aria-describedby')).toBe(limit.id);
    const ar = await render(`<div lang="ar"><sc-textarea label="السبب" maxlength="2" value=""></sc-textarea></div>`);
    expect(q(ar, '.sc-textarea__count').textContent).toBe('يتبقى لديك حرفان');
  });

  it('marks the over-limit state with words, the error colour class and aria-invalid', async () => {
    const page = await render(`<sc-textarea label="Note" maxlength="3" value="Hello"></sc-textarea>`);
    expect(q(page, '.sc-textarea__count')).toHaveClass('sc-textarea__count--over');
    expect(q(page, '.sc-textarea__count').textContent).toBe('You have 2 characters too many');
    expect(q(page, 'textarea').getAttribute('aria-invalid')).toBe('true');
    expect(q(page, '.sc-field__frame')).toHaveClass('sc-field__frame--error');
  });

  it('shows the error with the hidden prefix in Arabic', async () => {
    const page = await render(`<div lang="ar"><sc-textarea label="السبب" error="يُرجى إدخال السبب"></sc-textarea></div>`);
    expect(q(page, '.sc-field__error .visually-hidden').textContent).toBe('خطأ: ');
    expect(q(page, '.sc-field')).toHaveClass('sc-field--error');
  });
});
