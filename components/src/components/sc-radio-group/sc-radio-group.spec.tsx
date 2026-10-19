import { newSpecPage } from '@stencil/core/testing';
import { ScRadio } from '../sc-radio/sc-radio';
import { ScRadioGroup } from './sc-radio-group';

const components = [ScRadioGroup, ScRadio];
const root = (el: Element) => el.shadowRoot!;

const HTML = `
  <sc-radio-group label="Who issued the plate?" hint="It's on the plate" name="issuer" value="other">
    <sc-radio value="dubai">Dubai</sc-radio>
    <sc-radio value="other" hint="Abu Dhabi, Sharjah or another emirate">Another emirate</sc-radio>
  </sc-radio-group>`;

describe('sc-radio-group (spec)', () => {
  it('renders a fieldset exposed as a radiogroup, labelled by its legend and described by the hint', async () => {
    const page = await newSpecPage({ components, html: HTML });
    const fieldset = root(page.root!).querySelector('fieldset')!;
    expect(fieldset.getAttribute('role')).toBe('radiogroup');
    expect(fieldset.getAttribute('aria-labelledby')).toBe('label');
    expect(fieldset.getAttribute('aria-describedby')).toBe('hint');
    const legend = fieldset.querySelector('legend')!;
    expect(legend.id).toBe('label');
    expect(legend.textContent).toBe('Who issued the plate?');
  });

  it('renders one native radio per sc-radio, in one tree with one name, each with its label slot', async () => {
    const page = await newSpecPage({ components, html: HTML });
    const r = root(page.root!);
    const radios = Array.from(r.querySelectorAll('input[type="radio"]')) as HTMLInputElement[];
    expect(radios.map((i) => i.getAttribute('value'))).toEqual(['dubai', 'other']);
    expect(new Set(radios.map((i) => i.getAttribute('name'))).size).toBe(1);
    expect(radios.map((i) => i.checked)).toEqual([false, true]);
    const labels = Array.from(r.querySelectorAll('label.option-label'));
    expect(labels.map((l) => l.getAttribute('for'))).toEqual(['option-0', 'option-1']);
    expect(labels.map((l) => l.querySelector('slot')!.getAttribute('name'))).toEqual(['option-0', 'option-1']);
  });

  it('links an option hint to its radio', async () => {
    const page = await newSpecPage({ components, html: HTML });
    const r = root(page.root!);
    expect(r.querySelector('#option-0')!.hasAttribute('aria-describedby')).toBe(false);
    expect(r.querySelector('#option-1')!.getAttribute('aria-describedby')).toBe('option-1-hint');
    expect(r.querySelector('#option-1-hint')!.textContent).toBe('Abu Dhabi, Sharjah or another emirate');
  });

  it('takes its initial value from a checked sc-radio', async () => {
    const page = await newSpecPage({ components, html: `<sc-radio-group label="Insured?"><sc-radio value="yes">Yes</sc-radio><sc-radio value="no" checked>No</sc-radio></sc-radio-group>` });
    expect((page.root as HTMLElement & { value: string }).value).toBe('no');
  });

  it('shows the error state on the group and every radio', async () => {
    const page = await newSpecPage({
      components,
      html: `<sc-radio-group label="Who issued the plate?" error="Select who issued the plate" required><sc-radio value="dubai">Dubai</sc-radio></sc-radio-group>`,
    });
    const r = root(page.root!);
    const fieldset = r.querySelector('fieldset')!;
    expect(fieldset).toHaveClass('field--error');
    expect(fieldset.getAttribute('aria-invalid')).toBe('true');
    expect(fieldset.getAttribute('aria-required')).toBe('true');
    expect(fieldset.getAttribute('aria-describedby')).toBe('error');
    expect(r.querySelector('input')).toHaveClass('box--invalid');
    expect(r.querySelector('.error .visually-hidden')!.textContent).toBe('Error: ');
  });

  it('lays options inline, disables options and puts the legend in a heading', async () => {
    const page = await newSpecPage({
      components,
      html: `<sc-radio-group label="Renew for how long?" inline heading-level="1"><sc-radio value="1">1 year</sc-radio><sc-radio value="2" disabled>2 years</sc-radio></sc-radio-group>`,
    });
    const r = root(page.root!);
    expect(r.querySelector('.options')).toHaveClass('options--inline');
    expect(r.querySelector('legend h1')!.textContent).toBe('Renew for how long?');
    expect(r.querySelector('#option-1')!.hasAttribute('disabled')).toBe(true);
  });

  it('renders the slot for an sc-radio on its own', async () => {
    const page = await newSpecPage({ components, html: `<sc-radio value="dubai">Dubai</sc-radio>` });
    expect(root(page.root!).querySelector('slot')).not.toBeNull();
    expect(page.root).toEqualAttributes({ value: 'dubai' });
  });
});
