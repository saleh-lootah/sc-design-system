import { newSpecPage } from '@stencil/core/testing';
import { ScSummaryList } from './sc-summary-list';
import { ScSummaryRow } from '../sc-summary-row/sc-summary-row';

const components = [ScSummaryList, ScSummaryRow];
const MARKUP = `
  <sc-summary-list>
    <sc-summary-row label="Vehicle">Nissan Patrol 2021, white</sc-summary-row>
    <sc-summary-row label="Renew for" action-href="#renew-for">1 year</sc-summary-row>
    <sc-summary-row label="Insurance" action-href="#insurance" action-text="Edit" action-hidden-text="your insurance">Valid</sc-summary-row>
  </sc-summary-list>`;

describe('sc-summary-list (spec)', () => {
  it('renders one light-DOM dl with a div per row holding dt and dd', async () => {
    const page = await newSpecPage({ components, html: MARKUP });
    expect(page.root!.shadowRoot).toBeNull();
    expect(page.root).toHaveClasses(['sc-summary-list', 'sc-summary-list--card', 'sc-summary-list--auto']);
    const dl = page.root!.querySelector('dl')!;
    const rows = Array.from(dl.children);
    expect(rows.map((r) => r.tagName)).toEqual(['DIV', 'DIV', 'DIV']);
    expect(Array.from(rows[0].children).map((c) => c.tagName)).toEqual(['DT', 'DD']);
    expect(Array.from(rows[1].children).map((c) => c.tagName)).toEqual(['DT', 'DD', 'DD']);
    expect(rows[0].querySelector('dt')!.textContent).toBe('Vehicle');
  });

  it('gives each row a stable value slot of its own', async () => {
    const page = await newSpecPage({ components, html: MARKUP });
    const names = Array.from(page.root!.querySelectorAll('sc-summary-row')).map((r) => r.getAttribute('slot'));
    expect(new Set(names).size).toBe(3);
    for (const n of names) expect(n).toMatch(/^sc-summary-row-\d+$/);
  });

  it('renders "Change" plus the visually hidden key, or the overrides', async () => {
    const page = await newSpecPage({ components, html: MARKUP });
    const links = page.root!.querySelectorAll('a.sc-summary-list__link');
    expect(links.length).toBe(2);
    expect(links[0].getAttribute('href')).toBe('#renew-for');
    expect(links[0].textContent).toBe('Change Renew for');
    expect(links[0].querySelector('.visually-hidden')!.textContent).toBe(' Renew for');
    expect(links[1].textContent).toBe('Edit your insurance');
    expect(page.root!.querySelector('.sc-summary-list__row--no-action')).not.toBeNull();
  });

  it('uses the Arabic action text', async () => {
    const page = await newSpecPage({ components, html: `<div lang="ar"><sc-summary-list><sc-summary-row label="التأمين" action-href="#i">ساري</sc-summary-row></sc-summary-list></div>` });
    expect(page.body.querySelector('a.sc-summary-list__link')!.textContent).toBe('تغيير التأمين');
  });

  it('renders the plain appearance and the layouts, falling back to auto', async () => {
    const page = await newSpecPage({ components, html: `<sc-summary-list appearance="plain" layout="columns"><sc-summary-row label="Plate">A 48213</sc-summary-row></sc-summary-list>` });
    expect(page.root).toHaveClasses(['sc-summary-list--plain', 'sc-summary-list--columns']);
    const bad = await newSpecPage({ components, html: `<sc-summary-list layout="grid"></sc-summary-list>` });
    expect(bad.root).toHaveClass('sc-summary-list--auto');
  });

  it('drops actions in the pairs layout and marks the total row', async () => {
    const page = await newSpecPage({
      components,
      html: `<sc-summary-list layout="pairs"><sc-summary-row label="Plate" action-href="#p">A 48213</sc-summary-row><sc-summary-row label="Amount" variant="total">AED 420.00</sc-summary-row></sc-summary-list>`,
    });
    expect(page.root!.querySelectorAll('a').length).toBe(0);
    expect(page.root!.querySelectorAll('.sc-summary-list__row--total').length).toBe(1);
  });

  it('skips hidden rows and ignores other children', async () => {
    const page = await newSpecPage({
      components,
      html: `<sc-summary-list><sc-summary-row label="A">1</sc-summary-row><sc-summary-row hidden label="B">2</sc-summary-row><p>Note</p></sc-summary-list>`,
    });
    expect(page.root!.querySelectorAll('dt').length).toBe(1);
  });
});
