import { newSpecPage } from '@stencil/core/testing';
import { ScTextarea } from './sc-textarea';

const root = (el: Element) => el.shadowRoot!;

describe('sc-textarea (spec)', () => {
  it('renders a labelled textarea with rows', async () => {
    const page = await newSpecPage({ components: [ScTextarea], html: `<sc-textarea label="Describe the damage" rows="3"></sc-textarea>` });
    const r = root(page.root!);
    expect(r.querySelector('label')!.getAttribute('for')).toBe('control');
    expect(r.querySelector('textarea')!.getAttribute('rows')).toBe('3');
    expect(r.querySelector('.count')).toBeNull();
    expect(r.querySelector('[aria-live="polite"]')!.textContent).toBe('');
  });

  it('shows the remaining characters and describes the limit', async () => {
    const page = await newSpecPage({ components: [ScTextarea], html: `<sc-textarea label="Reason" maxlength="200" value="Sold"></sc-textarea>` });
    const r = root(page.root!);
    expect(r.querySelector('.count')!.textContent).toBe('You have 196 characters remaining');
    expect(r.querySelector('.count')!.getAttribute('aria-hidden')).toBe('true');
    expect(r.querySelector('#limit')!.textContent).toBe('You can enter up to 200 characters');
    expect(r.querySelector('textarea')!.getAttribute('aria-describedby')).toBe('limit');
    // No native maxlength: people can type past the limit and then edit.
    expect(r.querySelector('textarea')!.hasAttribute('maxlength')).toBe(false);
  });

  it('says how many characters are too many, with the error border', async () => {
    const page = await newSpecPage({ components: [ScTextarea], html: `<sc-textarea label="Note" maxlength="5" value="Hello there"></sc-textarea>` });
    const r = root(page.root!);
    expect(r.querySelector('.count')!.textContent).toBe('You have 6 characters too many');
    expect(r.querySelector('.count')).toHaveClass('count--over');
    expect(r.querySelector('.frame')).toHaveClass('frame--error');
    expect(r.querySelector('textarea')!.getAttribute('aria-invalid')).toBe('true');
  });

  it('uses singular English and the Arabic plural forms', async () => {
    const one = await newSpecPage({ components: [ScTextarea], html: `<sc-textarea label="Note" maxlength="5" value="Hell"></sc-textarea>` });
    expect(root(one.root!).querySelector('.count')!.textContent).toBe('You have 1 character remaining');

    const cases: [string, string][] = [
      ['', 'يتبقى لديك 120 حرفًا'],
      ['x'.repeat(110), 'يتبقى لديك 10 أحرف'],
      ['x'.repeat(118), 'يتبقى لديك حرفان'],
      ['x'.repeat(119), 'يتبقى لديك حرف واحد'],
      ['x'.repeat(120), 'لم يتبقَّ لديك أي حرف'],
      ['x'.repeat(122), 'لديك حرفان زائدان عن الحد'],
    ];
    for (const [value, expected] of cases) {
      const page = await newSpecPage({ components: [ScTextarea], html: `<div lang="ar"><sc-textarea label="ملاحظة" maxlength="120" value="${value}"></sc-textarea></div>` });
      expect(root(page.body.querySelector('sc-textarea')!).querySelector('.count')!.textContent).toBe(expected);
    }
  });

  it('shows the error state', async () => {
    const page = await newSpecPage({ components: [ScTextarea], html: `<sc-textarea label="Reason" hint="For example, the vehicle was sold" error="Enter why you are cancelling"></sc-textarea>` });
    const r = root(page.root!);
    expect(r.querySelector('textarea')!.getAttribute('aria-describedby')).toBe('hint error');
    expect(r.querySelector('.field')).toHaveClass('field--error');
  });
});
