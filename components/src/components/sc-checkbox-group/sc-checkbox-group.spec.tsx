import { newSpecPage } from '@stencil/core/testing';
import { ScCheckbox } from '../sc-checkbox/sc-checkbox';
import { ScCheckboxGroup } from './sc-checkbox-group';

const render = (html: string) => newSpecPage({ components: [ScCheckbox, ScCheckboxGroup], html });

describe('sc-checkbox-group (spec)', () => {
  it('renders a fieldset with a legend, hint and error in light DOM, holding the checkboxes', async () => {
    const page = await render(`<sc-checkbox-group label="Which documents do you have?" hint="Select all that apply" error="Select at least one"><sc-checkbox value="a">A</sc-checkbox></sc-checkbox-group>`);
    const fieldset = page.body.querySelector('fieldset')!;
    expect(page.root!.shadowRoot).toBeNull();
    expect(fieldset.querySelector('legend')!.textContent).toBe('Which documents do you have?');
    expect(fieldset.getAttribute('aria-describedby')).toBe(`${page.body.querySelector('.sc-field__hint')!.id} ${page.body.querySelector('.sc-field__error')!.id}`);
    expect(fieldset).toHaveClass('sc-field--error');
    expect(fieldset.querySelector('.sc-choice-group__options sc-checkbox')).not.toBeNull();
  });

  it('disables the fieldset, lays options inline and uses Arabic strings', async () => {
    const page = await render(`<div lang="ar"><sc-checkbox-group label="التذكير" disabled inline optional><sc-checkbox value="sms">رسالة نصية</sc-checkbox></sc-checkbox-group></div>`);
    expect(page.body.querySelector('fieldset')!.hasAttribute('disabled')).toBe(true);
    expect(page.body.querySelector('.sc-choice-group__options')).toHaveClass('sc-choice-group__options--inline');
    expect(page.body.querySelector('.sc-field__optional')!.textContent).toBe(' (اختياري)');
  });

  it('puts the legend inside a heading with heading-level', async () => {
    const page = await render(`<sc-checkbox-group label="Which documents do you have?" heading-level="1"><sc-checkbox value="a">A</sc-checkbox></sc-checkbox-group>`);
    expect(page.body.querySelector('legend h1')!.textContent).toBe('Which documents do you have?');
  });
});
