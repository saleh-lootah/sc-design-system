import { newSpecPage } from '@stencil/core/testing';
import { ScSearch } from './sc-search';

describe('sc-search (spec)', () => {
  it('renders a search form, a labelled search input and a submit button in light DOM', async () => {
    const page = await newSpecPage({ components: [ScSearch], html: `<sc-search label="Search Dubai Now services" name="query" action="/search"></sc-search>` });
    expect(page.root!.shadowRoot).toBeNull();
    const form = page.body.querySelector('form')!;
    const label = page.body.querySelector('label')!;
    const input = page.body.querySelector('input')!;
    expect(form.getAttribute('role')).toBe('search');
    expect(form.getAttribute('aria-labelledby')).toBe(label.id);
    expect(form.getAttribute('action')).toBe('/search');
    expect(label.getAttribute('for')).toBe(input.id);
    expect(input.getAttribute('type')).toBe('search');
    expect(input.getAttribute('name')).toBe('query');
    expect(page.body.querySelector('sc-button')!.getAttribute('type')).toBe('submit');
  });

  it('defaults the label and button text from strings, in Arabic too, and hides the label on request', async () => {
    const page = await newSpecPage({ components: [ScSearch], html: `<div lang="ar"><sc-search label-hidden></sc-search></div>` });
    expect(page.body.querySelector('label')!.textContent).toBe('بحث');
    expect(page.body.querySelector('label')).toHaveClass('visually-hidden');
    expect(page.body.querySelector('sc-button')!.textContent).toBe('بحث');
  });

  it('uses the xl button for the hero size', async () => {
    const page = await newSpecPage({ components: [ScSearch], html: `<sc-search size="l"></sc-search><sc-search id="m"></sc-search>` });
    expect(page.body.querySelector('sc-search sc-button')!.getAttribute('size')).toBe('xl');
    expect(page.body.querySelector('#m sc-button')!.getAttribute('size')).toBe('l');
  });
});
