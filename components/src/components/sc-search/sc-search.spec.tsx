import { newSpecPage } from '@stencil/core/testing';
import { ScSearch } from './sc-search';

describe('sc-search (spec)', () => {
  it('renders a search form labelled by its label, with a search input and a submit button', async () => {
    const page = await newSpecPage({ components: [ScSearch], html: `<sc-search label="Search Dubai Now services" placeholder="Try “school fees”"></sc-search>` });
    const root = page.root!.shadowRoot!;
    const form = root.querySelector('form')!;
    expect(form.getAttribute('role')).toBe('search');
    expect(form.getAttribute('aria-labelledby')).toBe('label');
    const label = root.querySelector('label')!;
    expect(label.textContent).toBe('Search Dubai Now services');
    expect(label.getAttribute('for')).toBe('input');
    expect(label).not.toHaveClass('visually-hidden');
    const input = root.querySelector('input')!;
    expect(input.getAttribute('type')).toBe('search');
    expect(input.getAttribute('name')).toBe('q');
    expect(input.getAttribute('placeholder')).toBe('Try “school fees”');
    const button = root.querySelector('sc-button')!;
    expect(button.getAttribute('type')).toBe('submit');
    expect(button.textContent).toBe('Search');
  });

  it('hides the label visually with label-hidden', async () => {
    const page = await newSpecPage({ components: [ScSearch], html: `<sc-search label-hidden></sc-search>` });
    expect(page.root!.shadowRoot!.querySelector('label')).toHaveClass('visually-hidden');
  });

  it('uses Arabic defaults', async () => {
    const page = await newSpecPage({ components: [ScSearch], html: `<div lang="ar"><sc-search></sc-search></div>` });
    const root = page.body.querySelector('sc-search')!.shadowRoot!;
    expect(root.querySelector('label')!.textContent).toBe('بحث');
    expect(root.querySelector('sc-button')!.textContent).toBe('بحث');
  });

  it('overrides the button text, name and action', async () => {
    const page = await newSpecPage({ components: [ScSearch], html: `<sc-search button-text="Find" name="query" action="/search"></sc-search>` });
    const root = page.root!.shadowRoot!;
    expect(root.querySelector('sc-button')!.textContent).toBe('Find');
    expect(root.querySelector('input')!.getAttribute('name')).toBe('query');
    expect(root.querySelector('form')!.getAttribute('action')).toBe('/search');
  });
});
