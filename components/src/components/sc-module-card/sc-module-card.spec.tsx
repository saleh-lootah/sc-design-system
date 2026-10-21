import { newSpecPage } from '@stencil/core/testing';
import { ScModuleCard } from './sc-module-card';

describe('sc-module-card (spec)', () => {
  it('renders the heading, the header link with the title as hidden context, and the content slot', async () => {
    const page = await newSpecPage({
      components: [ScModuleCard],
      html: `<sc-module-card heading="Applications" action-href="/applications" action-text="View all" tint="violet"><svg slot="icon"></svg><p>Ejari tenancy renewal</p></sc-module-card>`,
    });
    const root = page.root!.shadowRoot!;
    expect(root.querySelector('h3')!.textContent).toBe('Applications');
    const link = root.querySelector('a[part="link"]')!;
    expect(link.getAttribute('href')).toBe('/applications');
    expect(link.textContent).toBe('View all, Applications');
    expect(link.querySelector('.visually-hidden')!.textContent).toBe(', Applications');
    expect(root.querySelector('[part="icon"]')).toHaveClass('icon-tile--violet');
    expect(root.querySelector('[part="body"] slot:not([name])')).not.toBeNull();
  });

  it('has no header link without action-href and action-text, and prefers slot="action"', async () => {
    const none = await newSpecPage({ components: [ScModuleCard], html: `<sc-module-card heading="Vehicles" action-href="/v"></sc-module-card>` });
    expect(none.root!.shadowRoot!.querySelector('a')).toBeNull();
    expect(none.root!.shadowRoot!.querySelector('.action')).toHaveClass('is-empty');
    expect(none.root!.shadowRoot!.querySelector('[part="icon"]')).toHaveClass('is-empty');
    const own = await newSpecPage({ components: [ScModuleCard], html: `<sc-module-card heading="Vehicles" action-href="/v" action-text="Manage"><a slot="action" href="/x">Manage vehicles</a></sc-module-card>` });
    expect(own.root!.shadowRoot!.querySelector('a[part="link"]')).toBeNull();
    expect(own.root!.shadowRoot!.querySelector('.action')).not.toHaveClass('is-empty');
  });

  it('renders a footer slot, hidden when empty', async () => {
    const none = await newSpecPage({ components: [ScModuleCard], html: `<sc-module-card heading="Vehicles"><p>x</p></sc-module-card>` });
    expect(none.root!.shadowRoot!.querySelector('[part="footer"]')).toHaveClass('is-empty');
    const own = await newSpecPage({ components: [ScModuleCard], html: `<sc-module-card heading="Traffic fines"><p>x</p><button slot="footer">Pay all fines</button></sc-module-card>` });
    const footer = own.root!.shadowRoot!.querySelector('[part="footer"]')!;
    expect(footer).not.toHaveClass('is-empty');
    expect(footer.querySelector('slot[name="footer"]')).not.toBeNull();
  });

  it('uses heading-level and reflects divided', async () => {
    const page = await newSpecPage({ components: [ScModuleCard], html: `<sc-module-card heading="Traffic fines" heading-level="2" divided></sc-module-card>` });
    expect(page.root!.shadowRoot!.querySelector('h2')).not.toBeNull();
    expect(page.root!.hasAttribute('divided')).toBe(true);
  });
});
