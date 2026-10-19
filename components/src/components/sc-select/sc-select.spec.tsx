import { newSpecPage } from '@stencil/core/testing';
import { ScSelect } from './sc-select';

const root = (el: Element) => el.shadowRoot!;

describe('sc-select (spec)', () => {
  it('copies light-DOM options into a native select inside the shadow root', async () => {
    const page = await newSpecPage({
      components: [ScSelect],
      html: `<sc-select label="Issuing authority" value="sharjah"><option value="dubai">Dubai</option><option value="sharjah">Sharjah</option></sc-select>`,
    });
    const r = root(page.root!);
    const options = Array.from(r.querySelectorAll('select option'));
    expect(options.map((o) => o.textContent)).toEqual(['Dubai', 'Sharjah']);
    expect(options.map((o) => o.getAttribute('value'))).toEqual(['dubai', 'sharjah']);
    expect(options[1].hasAttribute('selected')).toBe(true);
    expect(r.querySelector('label')!.getAttribute('for')).toBe('control');
    expect(r.querySelector('select')!.id).toBe('control');
  });

  it('defaults to the selected option, else the first', async () => {
    const first = await newSpecPage({ components: [ScSelect], html: `<sc-select label="A"><option value="a">A</option><option value="b">B</option></sc-select>` });
    expect((first.root as HTMLElement & { value: string }).value).toBe('a');
    const selected = await newSpecPage({ components: [ScSelect], html: `<sc-select label="A"><option value="a">A</option><option value="b" selected>B</option></sc-select>` });
    expect((selected.root as HTMLElement & { value: string }).value).toBe('b');
  });

  it('keeps optgroups', async () => {
    const page = await newSpecPage({
      components: [ScSelect],
      html: `<sc-select label="Centre"><option value="">Select a centre</option><optgroup label="Dubai"><option value="al-quoz">Al Quoz</option></optgroup></sc-select>`,
    });
    const group = root(page.root!).querySelector('optgroup')!;
    expect(group.getAttribute('label')).toBe('Dubai');
    expect(group.querySelector('option')!.textContent).toBe('Al Quoz');
  });

  it('shows the error state and a chevron', async () => {
    const page = await newSpecPage({ components: [ScSelect], html: `<sc-select label="Centre" error="Select an inspection centre"><option value="">Select</option></sc-select>` });
    const r = root(page.root!);
    expect(r.querySelector('select')!.getAttribute('aria-invalid')).toBe('true');
    expect(r.querySelector('select')!.getAttribute('aria-describedby')).toBe('error');
    expect(r.querySelector('.chevron svg')).not.toBeNull();
    expect(r.querySelector('.chevron')!.getAttribute('aria-hidden')).toBe('true');
  });
});
