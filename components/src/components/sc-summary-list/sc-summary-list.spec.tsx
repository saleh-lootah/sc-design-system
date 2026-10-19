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
  it('renders one dl with a div per row holding dt and dd', async () => {
    const page = await newSpecPage({ components, html: MARKUP });
    const dl = page.root!.shadowRoot!.querySelector('dl')!;
    expect(dl).toHaveClasses(['list', 'list--card']);
    const rows = Array.from(dl.children);
    expect(rows.map((r) => r.tagName)).toEqual(['DIV', 'DIV', 'DIV']);
    expect(Array.from(rows[0].children).map((c) => c.tagName)).toEqual(['DT', 'DD']);
    expect(Array.from(rows[1].children).map((c) => c.tagName)).toEqual(['DT', 'DD', 'DD']);
    expect(rows[0].querySelector('dt')!.textContent).toBe('Vehicle');
  });

  it('assigns each row to the named slot inside its value dd', async () => {
    const page = await newSpecPage({ components, html: MARKUP });
    const rows = page.root!.querySelectorAll('sc-summary-row');
    rows.forEach((row, i) => {
      expect(row.getAttribute('slot')).toBe(`row-${i}`);
      expect(page.root!.shadowRoot!.querySelector(`dd.value slot[name="row-${i}"]`)).not.toBeNull();
    });
  });

  it('renders "Change" plus the visually hidden key, or the overrides', async () => {
    const page = await newSpecPage({ components, html: MARKUP });
    const links = page.root!.shadowRoot!.querySelectorAll('a.link');
    expect(links.length).toBe(2);
    expect(links[0].getAttribute('href')).toBe('#renew-for');
    expect(links[0].textContent).toBe('Change Renew for');
    expect(links[0].querySelector('.visually-hidden')!.textContent).toBe(' Renew for');
    expect(links[1].textContent).toBe('Edit your insurance');
    expect(page.root!.shadowRoot!.querySelector('.row--no-action')).not.toBeNull();
  });

  it('uses the Arabic action text', async () => {
    const page = await newSpecPage({
      components,
      html: `<div lang="ar"><sc-summary-list><sc-summary-row label="التأمين" action-href="#i">ساري</sc-summary-row></sc-summary-list></div>`,
    });
    const link = page.body.querySelector('sc-summary-list')!.shadowRoot!.querySelector('a.link')!;
    expect(link.textContent).toBe('تغيير التأمين');
  });

  it('renders the plain appearance', async () => {
    const page = await newSpecPage({ components, html: `<sc-summary-list appearance="plain"><sc-summary-row label="Plate">A 48213</sc-summary-row></sc-summary-list>` });
    expect(page.root!.shadowRoot!.querySelector('dl')).toHaveClass('list--plain');
  });

  it('skips hidden rows and ignores other children', async () => {
    const page = await newSpecPage({
      components,
      html: `<sc-summary-list><sc-summary-row label="A">1</sc-summary-row><sc-summary-row hidden label="B">2</sc-summary-row><p>Note</p></sc-summary-list>`,
    });
    expect(page.root!.shadowRoot!.querySelectorAll('dt').length).toBe(1);
  });

  it('re-renders when a row prop changes', async () => {
    const page = await newSpecPage({ components, html: `<sc-summary-list><sc-summary-row label="Plate">A 48213</sc-summary-row></sc-summary-list>` });
    const row = page.root!.querySelector('sc-summary-row') as HTMLElement & { actionHref?: string; label: string };
    row.label = 'Plate number';
    row.actionHref = '#plate';
    await page.waitForChanges();
    expect(page.root!.shadowRoot!.querySelector('dt')!.textContent).toBe('Plate number');
    expect(page.root!.shadowRoot!.querySelector('a.link')!.getAttribute('href')).toBe('#plate');
  });
});
