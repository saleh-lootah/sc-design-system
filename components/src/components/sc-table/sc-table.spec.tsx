import { newSpecPage } from '@stencil/core/testing';
import { parseStrings, plural, translator } from './overrides';
import { ScTable } from './sc-table';

const FINES = `
  <table>
    <thead>
      <tr>
        <th>Reference</th>
        <th data-type="date" data-sort="date" aria-sort="descending">Date</th>
        <th>Offence</th>
        <th data-type="amount" data-sort>Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr data-id="F-2026-118204"><th scope="row">F-2026-118204</th><td>14 Mar 2026</td><td>Speeding</td><td>AED 600.00</td></tr>
      <tr data-id="F-2026-107455"><th scope="row">F-2026-107455</th><td>2 Mar 2026</td><td></td><td>AED 1,100.00</td></tr>
    </tbody>
  </table>`;

describe('sc-table (spec)', () => {
  it('writes the caption into a native <caption> and copies column types to every cell', async () => {
    const page = await newSpecPage({ components: [ScTable], html: `<sc-table caption="Your fines">${FINES}</sc-table>` });
    const table = page.body.querySelector('table')!;
    expect(table.querySelector('caption')!.textContent).toBe('Your fines');
    expect(table.querySelector('caption')!.classList.contains('sc-table__caption--hidden')).toBe(false);
    const row = table.querySelector('tbody tr')!;
    expect(Array.from(row.children).map((c) => c.getAttribute('data-type'))).toEqual(['text', 'date', 'text', 'amount']);
    expect(Array.from(row.children).map((c) => c.getAttribute('data-label'))).toEqual(['Reference', 'Date', 'Offence', 'Amount']);
    expect(table.querySelector('thead th')!.getAttribute('scope')).toBe('col');
  });

  it('hides the caption visually with caption-hidden', async () => {
    const page = await newSpecPage({ components: [ScTable], html: `<sc-table caption="Your fines" caption-hidden>${FINES}</sc-table>` });
    expect(page.body.querySelector('caption')!.classList.contains('sc-table__caption--hidden')).toBe(true);
  });

  it('turns data-sort headers into buttons and keeps aria-sort on the th', async () => {
    const page = await newSpecPage({ components: [ScTable], html: `<sc-table caption="Your fines">${FINES}</sc-table>` });
    const headers = Array.from(page.body.querySelectorAll('thead th'));
    expect(headers.map((th) => !!th.querySelector('button.sc-table__sort'))).toEqual([false, true, false, true]);
    expect(headers[1].getAttribute('aria-sort')).toBe('descending');
    expect(headers[1].querySelector('.sc-table__sort-label')!.textContent).toBe('Date');
  });

  it('cycles the sort direction, sorts one column at a time and emits scSort', async () => {
    const page = await newSpecPage({ components: [ScTable], html: `<sc-table caption="Your fines">${FINES}</sc-table>` });
    const spy = jest.fn();
    page.body.addEventListener('scSort', (e: Event) => spy((e as CustomEvent).detail));
    const [, date, , amount] = Array.from(page.body.querySelectorAll('thead th'));
    (amount.querySelector('button') as HTMLButtonElement).click();
    await page.waitForChanges();
    expect(spy).toHaveBeenLastCalledWith({ column: 'Amount', direction: 'ascending' });
    expect(amount.getAttribute('aria-sort')).toBe('ascending');
    expect(date.hasAttribute('aria-sort')).toBe(false);
    (amount.querySelector('button') as HTMLButtonElement).click();
    await page.waitForChanges();
    expect(spy).toHaveBeenLastCalledWith({ column: 'Amount', direction: 'descending' });
    expect(page.root!.querySelector('[aria-live]')!.textContent).toBe('Sorted by Amount, highest first');
    (date.querySelector('button') as HTMLButtonElement).click();
    await page.waitForChanges();
    expect(spy).toHaveBeenLastCalledWith({ column: 'date', direction: 'ascending' });
    expect(page.root!.querySelector('[aria-live]')!.textContent).toBe('Sorted by Date, oldest first');
  });

  it('fills an empty cell with a muted "None" (لا يوجد in Arabic)', async () => {
    const page = await newSpecPage({ components: [ScTable], html: `<sc-table caption="Your fines">${FINES}</sc-table>` });
    expect(page.body.querySelector('tbody tr:nth-child(2) td:nth-of-type(2)')!.textContent).toBe('None');
    const ar = await newSpecPage({ components: [ScTable], html: `<div lang="ar"><sc-table caption="مخالفاتك">${FINES}</sc-table></div>` });
    expect(ar.body.querySelector('.sc-table__none')!.textContent).toBe('لا يوجد');
  });

  it('adds a labelled checkbox column with selectable, and emits scSelectionChange', async () => {
    const page = await newSpecPage({
      components: [ScTable],
      html: `<sc-table caption="Your fines" selectable selection-label="{count} fine selected|{count} fines selected" strings='{"tableSelectRow": "Select fine {row}", "tableSelectAll": "Select all fines on this page"}'>${FINES}</sc-table>`,
    });
    const boxes = Array.from(page.body.querySelectorAll('.sc-table__select input')) as HTMLInputElement[];
    expect(boxes.map((b) => b.getAttribute('aria-label'))).toEqual(['Select all fines on this page', 'Select fine F-2026-118204', 'Select fine F-2026-107455']);
    const spy = jest.fn();
    page.body.addEventListener('scSelectionChange', (e: Event) => spy((e as CustomEvent).detail));
    boxes[1].checked = true;
    boxes[1].dispatchEvent(new Event('change'));
    await page.waitForChanges();
    expect(spy).toHaveBeenLastCalledWith({ ids: ['F-2026-118204'] });
    expect(page.body.querySelector('tr[data-id="F-2026-118204"]')!.hasAttribute('data-selected')).toBe(true);
    expect(page.root!.querySelector('.selection-text')!.textContent).toBe('1 fine selected · AED 600.00');
    boxes[0].checked = true;
    boxes[0].dispatchEvent(new Event('change'));
    await page.waitForChanges();
    expect(spy).toHaveBeenLastCalledWith({ ids: ['F-2026-118204', 'F-2026-107455'] });
    expect(page.root!.querySelector('.selection-text')!.textContent).toBe('2 fines selected · AED 1,700.00');
  });

  it('shows skeleton rows while loading and hides the real body', async () => {
    const page = await newSpecPage({ components: [ScTable], html: `<sc-table caption="Your fines" loading>${FINES}</sc-table>` });
    const table = page.body.querySelector('table')!;
    const skeleton = table.querySelector('tbody.sc-table__skeleton')!;
    expect(skeleton.getAttribute('aria-hidden')).toBe('true');
    expect(skeleton.querySelectorAll('tr').length).toBe(5);
    expect(skeleton.querySelector('tr')!.querySelectorAll('td').length).toBe(4);
    expect(table.getAttribute('aria-busy')).toBe('true');
    expect(table.querySelector('tbody')!.hasAttribute('data-sc-hidden')).toBe(true);
    page.root!.loading = false;
    await page.waitForChanges();
    expect(table.querySelector('.sc-table__skeleton')).toBeNull();
    expect(table.hasAttribute('aria-busy')).toBe(false);
  });

  it('shows the empty slot and hides the header when there are no rows (but keeps it when filtered)', async () => {
    const html = (extra: string) => `<sc-table caption="Your fines" ${extra}><table><thead><tr><th>Reference</th></tr></thead><tbody></tbody></table><div slot="empty"><p>You have no fines</p></div></sc-table>`;
    const page = await newSpecPage({ components: [ScTable], html: html('') });
    expect(page.root!.querySelector('.state--empty')!.hasAttribute('hidden')).toBe(false);
    expect(page.body.querySelector('thead')!.hasAttribute('data-sc-hidden')).toBe(true);
    const filtered = await newSpecPage({ components: [ScTable], html: html('filtered') });
    expect(filtered.body.querySelector('thead')!.hasAttribute('data-sc-hidden')).toBe(false);
  });

  it('adds explicit table roles in stack mode and removes them in scroll mode', async () => {
    const page = await newSpecPage({ components: [ScTable], html: `<sc-table caption="Your fines">${FINES}</sc-table>` });
    const table = page.body.querySelector('table')!;
    expect(table.getAttribute('role')).toBe('table');
    expect(table.querySelector('tbody th')!.getAttribute('role')).toBe('rowheader');
    expect(table.querySelector('thead th')!.getAttribute('role')).toBe('columnheader');
    page.root!.responsive = 'scroll';
    await page.waitForChanges();
    expect(table.hasAttribute('role')).toBe(false);
  });
});

describe('string overrides and plurals', () => {
  it('parses JSON overrides, per language or flat, and ignores bad JSON', () => {
    expect(parseStrings('{"a": "b"}')).toEqual({ a: 'b' });
    expect(parseStrings('nope')).toEqual({});
    expect(translator('en', '{"tableNone": "Not given"}')('tableNone')).toBe('Not given');
    expect(translator('ar', '{"en": {"tableNone": "Not given"}}')('tableNone')).toBe('لا يوجد');
    expect(translator('en', '{"tableSelectRow": "Select fine {row}"}')('tableSelectRow', { row: 'F-1' })).toBe('Select fine F-1');
  });

  it('picks plural forms with Intl.PluralRules', () => {
    expect(plural('{count} fine|{count} fines', 1, 'en')).toBe('{count} fine');
    expect(plural('{count} fine|{count} fines', 2, 'en')).toBe('{count} fines');
    const ar = 'zero|one|two|few|many|other';
    expect([0, 1, 2, 3, 11, 100].map((n) => plural(ar, n, 'ar'))).toEqual(['zero', 'one', 'two', 'few', 'many', 'other']);
    expect(plural('no forms', 3, 'en')).toBe('no forms');
  });
});
