import { newSpecPage } from '@stencil/core/testing';
import { ScCheckbox } from './sc-checkbox';
import { ScCheckboxGroup } from '../sc-checkbox-group/sc-checkbox-group';

const render = (html: string) => newSpecPage({ components: [ScCheckbox, ScCheckboxGroup], html });

describe('sc-checkbox (spec)', () => {
  it('renders a labelled native checkbox in light DOM', async () => {
    const page = await render(`<sc-checkbox name="confirm" value="yes" checked>I confirm</sc-checkbox>`);
    const input = page.body.querySelector('input')!;
    expect(page.root!.shadowRoot).toBeNull();
    expect(input.getAttribute('type')).toBe('checkbox');
    expect(input.getAttribute('name')).toBe('confirm');
    expect(input.getAttribute('value')).toBe('yes');
    expect(page.body.querySelector('label')!.getAttribute('for')).toBe(input.id);
    expect(page.body.querySelector('label')!.textContent).toBe('I confirm');
  });

  it('shows its own error on its own, with the hidden prefix', async () => {
    const page = await render(`<sc-checkbox error="Confirm the details" required>I confirm</sc-checkbox>`);
    const input = page.body.querySelector('input')!;
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.hasAttribute('required')).toBe(true);
    expect(page.body.querySelector('.sc-field__error .visually-hidden')!.textContent).toBe('Error: ');
    expect(page.body.querySelector('.sc-field')).toHaveClass('sc-field--error');
  });

  it('leaves the error to its group, and takes the group name', async () => {
    const page = await render(`<sc-checkbox-group name="documents" label="Documents" error="Select one"><sc-checkbox value="a" error="ignored">A</sc-checkbox></sc-checkbox-group>`);
    await page.waitForChanges();
    const input = page.body.querySelector('sc-checkbox input')!;
    expect(page.body.querySelector('sc-checkbox .sc-field__error')).toBeNull();
    expect(input.getAttribute('name')).toBe('documents');
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('describes the box with its hint', async () => {
    const page = await render(`<sc-checkbox hint="From an approved centre">Inspection certificate</sc-checkbox>`);
    const hint = page.body.querySelector('.sc-choice__hint')!;
    expect(page.body.querySelector('input')!.getAttribute('aria-describedby')).toBe(hint.id);
    expect(hint.textContent).toBe('From an approved centre');
  });
});
