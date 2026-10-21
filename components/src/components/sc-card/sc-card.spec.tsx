import { newSpecPage } from '@stencil/core/testing';
import { ScCard } from './sc-card';

describe('sc-card (spec)', () => {
  it('renders the host as a light-DOM surface with large padding, outlined, and no role', async () => {
    const page = await newSpecPage({ components: [ScCard], html: `<sc-card><p>Seven services</p></sc-card>` });
    expect(page.root!.shadowRoot).toBeNull();
    expect(page.root).toHaveClasses(['sc-card', 'sc-card--l', 'sc-card--outlined']);
    expect(page.root!.getAttribute('role')).toBeNull();
    expect(page.root!.getAttribute('aria-labelledby')).toBeNull();
    expect(page.root!.querySelector('p')!.textContent).toBe('Seven services');
  });

  it('renders medium padding and the filled variant', async () => {
    const page = await newSpecPage({ components: [ScCard], html: `<sc-card padding="m" variant="filled"></sc-card>` });
    expect(page.root).toHaveClasses(['sc-card--m', 'sc-card--filled']);
  });

  it('falls back to the defaults for unknown values', async () => {
    const page = await newSpecPage({ components: [ScCard], html: `<sc-card padding="xl" variant="raised"></sc-card>` });
    expect(page.root).toHaveClasses(['sc-card--l', 'sc-card--outlined']);
  });

  it('becomes a region named by its first heading with landmark="section"', async () => {
    const page = await newSpecPage({ components: [ScCard], html: `<sc-card landmark="section"><h2>My tasks</h2><h3>Other</h3></sc-card>` });
    const h2 = page.root!.querySelector('h2')!;
    expect(page.root!.getAttribute('role')).toBe('region');
    expect(h2.id).toMatch(/^sc-card-heading-/);
    expect(page.root!.getAttribute('aria-labelledby')).toBe(h2.id);
  });

  it('keeps an existing heading id and supports article', async () => {
    const page = await newSpecPage({ components: [ScCard], html: `<sc-card landmark="article"><h3 id="fees">Changes to parking fees</h3></sc-card>` });
    expect(page.root!.getAttribute('role')).toBe('article');
    expect(page.root!.getAttribute('aria-labelledby')).toBe('fees');
  });

  it('uses label instead of a heading when given', async () => {
    const page = await newSpecPage({ components: [ScCard], html: `<sc-card landmark="section" label="Your vehicle"><p>Nissan Patrol</p></sc-card>` });
    expect(page.root!.getAttribute('aria-label')).toBe('Your vehicle');
    expect(page.root!.getAttribute('aria-labelledby')).toBeNull();
  });
});
