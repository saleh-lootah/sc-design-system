import { newSpecPage } from '@stencil/core/testing';
import { ScSpinner } from './sc-spinner';

describe('sc-spinner (spec)', () => {
  it('renders a spinning decorative icon and a hidden "Loading" in a status region', async () => {
    const page = await newSpecPage({ components: [ScSpinner], html: `<sc-spinner></sc-spinner>` });
    const r = page.root!.shadowRoot!;
    expect(r.querySelector('svg.spin[aria-hidden="true"]')).not.toBeNull();
    expect(r.querySelector('[role="status"]')!.textContent).toBe('Loading');
    expect(r.querySelector('[part="label"]')).toHaveClass('label--hidden');
    expect(r.querySelector('.spinner')).toHaveClass('spinner--l');
  });

  it('shows the label with show-label, takes a custom label and size m', async () => {
    const page = await newSpecPage({ components: [ScSpinner], html: `<sc-spinner show-label size="m" label="Checking your plate number"></sc-spinner>` });
    const r = page.root!.shadowRoot!;
    expect(r.querySelector('[part="label"]')).not.toHaveClass('label--hidden');
    expect(r.querySelector('[part="label"]')!.textContent).toBe('Checking your plate number');
    expect(r.querySelector('.spinner')).not.toHaveClass('spinner--l');
  });

  it('uses Arabic from the closest lang', async () => {
    const page = await newSpecPage({ components: [ScSpinner], html: `<div lang="ar"><sc-spinner></sc-spinner></div>` });
    expect(page.body.querySelector('sc-spinner')!.shadowRoot!.querySelector('[part="label"]')!.textContent).toBe('جارٍ التحميل');
  });
});
