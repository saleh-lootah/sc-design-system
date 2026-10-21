import { newSpecPage } from '@stencil/core/testing';
import { ScSummaryRow } from './sc-summary-row';

describe('sc-summary-row (spec)', () => {
  it('renders in light DOM and keeps its content', async () => {
    const page = await newSpecPage({ components: [ScSummaryRow], html: `<sc-summary-row label="Plate">Dubai A 48213</sc-summary-row>` });
    expect(page.root!.shadowRoot).toBeNull();
    expect(page.root!.textContent).toContain('Dubai A 48213');
    expect(page.root!.getAttribute('label')).toBe('Plate');
  });

  it('falls back to the value prop', async () => {
    const page = await newSpecPage({ components: [ScSummaryRow], html: `<sc-summary-row label="Email" value="saeed@example.ae"></sc-summary-row>` });
    expect(page.root!.textContent).toBe('saeed@example.ae');
  });

  it('shows "Not provided" when there is no value (TPL-13)', async () => {
    const en = await newSpecPage({ components: [ScSummaryRow], html: `<sc-summary-row label="Second phone number"></sc-summary-row>` });
    expect(en.root!.textContent).toBe('Not provided');
    const ar = await newSpecPage({ components: [ScSummaryRow], html: `<div lang="ar" dir="rtl"><sc-summary-row label="رقم هاتف آخر"></sc-summary-row></div>` });
    expect(ar.body.querySelector('sc-summary-row')!.textContent).toBe('لم يتم تقديمه');
  });

  it('reflects the attributes the list renders from', async () => {
    const page = await newSpecPage({ components: [ScSummaryRow], html: `<sc-summary-row label="Plate">A</sc-summary-row>` });
    const row = page.root as HTMLElement & { actionHref: string; actionText: string; actionHiddenText: string; variant: string };
    row.actionHref = '#p';
    row.actionText = 'Edit';
    row.actionHiddenText = 'your plate';
    row.variant = 'total';
    await page.waitForChanges();
    expect(['action-href', 'action-text', 'action-hidden-text', 'variant'].map((a) => page.root!.getAttribute(a))).toEqual(['#p', 'Edit', 'your plate', 'total']);
  });
});
