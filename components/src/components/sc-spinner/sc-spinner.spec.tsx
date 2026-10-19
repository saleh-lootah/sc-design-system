import { newSpecPage } from '@stencil/core/testing';
import { ScSpinner } from './sc-spinner';

describe('sc-spinner (spec)', () => {
  it('renders a spinning icon and a hidden "Loading" in a status region', async () => {
    const page = await newSpecPage({ components: [ScSpinner], html: `<sc-spinner></sc-spinner>` });
    const r = page.root!.shadowRoot!;
    expect(r.querySelector('svg.spin[aria-hidden="true"]')).not.toBeNull();
    expect(r.querySelector('[role="status"]')!.textContent).toBe('Loading');
    expect(r.querySelector('[part="label"]')).toHaveClass('label--hidden');
  });

  it('shows the label with show-label and takes a custom label', async () => {
    const page = await newSpecPage({ components: [ScSpinner], html: `<sc-spinner show-label label="Checking your plate number"></sc-spinner>` });
    const label = page.root!.shadowRoot!.querySelector('[part="label"]')!;
    expect(label).not.toHaveClass('label--hidden');
    expect(label.textContent).toBe('Checking your plate number');
  });

  it('uses Arabic from the closest lang', async () => {
    const page = await newSpecPage({ components: [ScSpinner], html: `<div lang="ar"><sc-spinner></sc-spinner></div>` });
    expect(page.body.querySelector('sc-spinner')!.shadowRoot!.querySelector('[part="label"]')!.textContent).toBe('جارٍ التحميل');
  });
});
