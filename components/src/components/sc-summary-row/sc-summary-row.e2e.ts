import { newScPage } from '../../test/page';

describe('sc-summary-row (e2e)', () => {
  it('shows rich slotted content, or the value prop, inside its list', async () => {
    const page = await newScPage(`
      <sc-summary-list>
        <sc-summary-row label="Delivery address">Villa 14, Street 23<br />Al Sufouh 2, Dubai</sc-summary-row>
        <sc-summary-row label="Email" value="saeed@example.ae"></sc-summary-row>
      </sc-summary-list>`);
    const text = await page.evaluate(() => Array.from(document.querySelectorAll('sc-summary-row')).map((r) => (r as HTMLElement).innerText || r.shadowRoot!.textContent));
    expect(text[0]).toBe('Villa 14, Street 23\nAl Sufouh 2, Dubai');
    expect(text[1]).toBe('saeed@example.ae');
    const height = await page.evaluate(() => document.querySelector('sc-summary-row')!.getBoundingClientRect().height);
    expect(height).toBeGreaterThan(30);
  });
});
