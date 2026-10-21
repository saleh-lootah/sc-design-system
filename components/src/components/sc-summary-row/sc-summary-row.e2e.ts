import { describeAxe } from '../../test/axe';
import { newScPage } from '../../test/page';

const MARKUP = `
  <main>
    <sc-summary-list>
      <sc-summary-row label="Delivery address">Villa 14, Street 23<br />Al Sufouh 2, Dubai</sc-summary-row>
      <sc-summary-row label="Email" value="saeed@example.ae"></sc-summary-row>
      <sc-summary-row label="Second phone number"></sc-summary-row>
    </sc-summary-list>
  </main>`;

describe('sc-summary-row (e2e)', () => {
  it('shows rich content, the value prop, or "Not provided", inside its list', async () => {
    const page = await newScPage(MARKUP);
    const text = await page.evaluate(() => Array.from(document.querySelectorAll('sc-summary-row')).map((r) => (r as HTMLElement).innerText));
    expect(text).toEqual(['Villa 14, Street 23\nAl Sufouh 2, Dubai', 'saeed@example.ae', 'Not provided']);
    const height = await page.evaluate(() => document.querySelector('sc-summary-row')!.getBoundingClientRect().height);
    expect(height).toBeGreaterThan(30);
  });
});

describeAxe('sc-summary-row', MARKUP);
