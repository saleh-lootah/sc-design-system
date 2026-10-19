import { newSpecPage } from '@stencil/core/testing';
import { ScSummaryRow } from './sc-summary-row';

describe('sc-summary-row (spec)', () => {
  it('renders its value through a slot', async () => {
    const page = await newSpecPage({ components: [ScSummaryRow], html: `<sc-summary-row label="Plate">Dubai A 48213</sc-summary-row>` });
    expect(page.root!.shadowRoot!.querySelector('slot')).not.toBeNull();
    expect(page.root!.getAttribute('label')).toBe('Plate');
  });

  it('falls back to the value prop', async () => {
    const page = await newSpecPage({ components: [ScSummaryRow], html: `<sc-summary-row label="Email" value="saeed@example.ae"></sc-summary-row>` });
    expect(page.root!.shadowRoot!.querySelector('slot')!.textContent).toBe('saeed@example.ae');
  });

  it('shows "Not provided" when there is no value (TPL-13)', async () => {
    const en = await newSpecPage({ components: [ScSummaryRow], html: `<sc-summary-row label="Second phone number"></sc-summary-row>` });
    expect(en.root!.shadowRoot!.querySelector('slot')!.textContent).toBe('Not provided');
    const ar = await newSpecPage({ components: [ScSummaryRow], html: `<div lang="ar" dir="rtl"><sc-summary-row label="رقم هاتف آخر"></sc-summary-row></div>` });
    expect(ar.body.querySelector('sc-summary-row')!.shadowRoot!.querySelector('slot')!.textContent).toBe('لم يتم تقديمه');
  });

  it('notifies its list when a prop changes', async () => {
    const page = await newSpecPage({ components: [ScSummaryRow], html: `<sc-summary-row label="Plate">A</sc-summary-row>` });
    const spy = jest.fn();
    page.root!.addEventListener('sc-summary-row-update', spy);
    (page.root as HTMLElement & { label: string }).label = 'Plate number';
    await page.waitForChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
