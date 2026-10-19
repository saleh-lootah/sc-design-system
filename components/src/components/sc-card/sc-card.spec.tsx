import { newSpecPage } from '@stencil/core/testing';
import { ScCard } from './sc-card';

const surface = (root: HTMLElement) => root.shadowRoot!.querySelector('[part="surface"]') as HTMLElement;

describe('sc-card (spec)', () => {
  it('renders a plain surface with large padding by default and no role', async () => {
    const page = await newSpecPage({ components: [ScCard], html: `<sc-card><p>Seven services</p></sc-card>` });
    expect(surface(page.root!)).toHaveClasses(['surface', 'surface--l']);
    expect(page.root!.getAttribute('role')).toBeNull();
    expect(page.root!.getAttribute('aria-labelledby')).toBeNull();
    expect(surface(page.root!).querySelector('slot')).not.toBeNull();
  });

  it('renders medium padding', async () => {
    const page = await newSpecPage({ components: [ScCard], html: `<sc-card padding="m"></sc-card>` });
    expect(surface(page.root!)).toHaveClass('surface--m');
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
