import { newSpecPage } from '@stencil/core/testing';
import { ScCheckbox } from '../sc-checkbox/sc-checkbox';
import { ScCheckboxGroup } from './sc-checkbox-group';

const components = [ScCheckboxGroup, ScCheckbox];
const root = (el: Element) => el.shadowRoot!;

describe('sc-checkbox-group and sc-checkbox (spec)', () => {
  it('renders a fieldset with legend, hint and a slot for the checkboxes', async () => {
    const page = await newSpecPage({
      components,
      html: `<sc-checkbox-group label="Which documents do you have?" hint="Select all that apply" name="documents"><sc-checkbox value="insurance">Insurance</sc-checkbox></sc-checkbox-group>`,
    });
    const fieldset = root(page.root!).querySelector('fieldset')!;
    expect(fieldset.querySelector('legend')!.textContent).toBe('Which documents do you have?');
    expect(fieldset.getAttribute('aria-describedby')).toBe('hint');
    expect(fieldset.querySelector('.options slot:not([name])')).not.toBeNull();
  });

  it('gives each checkbox its own native input and label', async () => {
    const page = await newSpecPage({ components, html: `<sc-checkbox value="yes" hint="We'll check this with RTA">I confirm the details are correct</sc-checkbox>` });
    const r = root(page.root!);
    const input = r.querySelector('input')!;
    expect(input.getAttribute('type')).toBe('checkbox');
    expect(input.id).toBe('control');
    expect(r.querySelector('label')!.getAttribute('for')).toBe('control');
    expect(input.getAttribute('aria-describedby')).toBe('hint');
    expect(r.querySelector('.mark--check')!.getAttribute('aria-hidden')).toBe('true');
  });

  it('shows its own error on its own, with the error bar and "Error:"', async () => {
    const page = await newSpecPage({ components, html: `<sc-checkbox error="Confirm the vehicle details are correct">I confirm</sc-checkbox>` });
    const r = root(page.root!);
    expect(r.querySelector('.field')).toHaveClass('field--error');
    expect(r.querySelector('input')!.getAttribute('aria-invalid')).toBe('true');
    expect(r.querySelector('input')!.getAttribute('aria-describedby')).toBe('error');
    expect(r.querySelector('.error .visually-hidden')!.textContent).toBe('Error: ');
  });

  it('inside a group, leaves the error to the group and marks every box invalid', async () => {
    const page = await newSpecPage({
      components,
      html: `<sc-checkbox-group label="Documents" error="Select at least one document"><sc-checkbox value="a" error="ignored">A</sc-checkbox><sc-checkbox value="b">B</sc-checkbox></sc-checkbox-group>`,
    });
    await page.waitForChanges();
    expect(root(page.root!).querySelector('fieldset')).toHaveClass('field--error');
    for (const box of Array.from(page.root!.querySelectorAll('sc-checkbox'))) {
      const r = root(box);
      expect(r.querySelector('.error')).toBeNull();
      expect(r.querySelector('input')!.getAttribute('aria-invalid')).toBe('true');
      expect(r.querySelector('input')).toHaveClass('box--invalid');
    }
  });

  it('disables every checkbox in a disabled group', async () => {
    const page = await newSpecPage({ components, html: `<sc-checkbox-group label="Included" disabled><sc-checkbox value="a" checked>A</sc-checkbox></sc-checkbox-group>` });
    await page.waitForChanges();
    expect(root(page.root!.querySelector('sc-checkbox')!).querySelector('input')!.hasAttribute('disabled')).toBe(true);
  });

  it('reflects checked and lays a group inline', async () => {
    const page = await newSpecPage({ components, html: `<sc-checkbox-group label="Remind me by" inline><sc-checkbox value="sms" checked>SMS</sc-checkbox></sc-checkbox-group>` });
    expect(root(page.root!).querySelector('.options')).toHaveClass('options--inline');
    expect(page.root!.querySelector('sc-checkbox')!.hasAttribute('checked')).toBe(true);
  });
});
