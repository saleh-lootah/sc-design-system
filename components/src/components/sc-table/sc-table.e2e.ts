import { E2EPage } from '@stencil/core/testing';
import { expectNoAxeViolations } from '../../test/axe';
import { contexts, newScPage, setPageContext } from '../../test/page';

const STRINGS = `strings='{"en": {"tableSelectAll": "Select all fines on this page", "tableSelectRow": "Select fine {row}"}, "ar": {"tableSelectAll": "تحديد كل المخالفات في هذه الصفحة", "tableSelectRow": "تحديد المخالفة {row}"}}'`;

const fines = (lang: 'en' | 'ar', attrs = '') => {
  const en = lang === 'en';
  const rows = [
    ['F-2026-118204', en ? '14 Mar 2026' : '14 مارس 2026', en ? 'Speeding: 21 to 30 km/h over the limit' : 'تجاوز السرعة المحددة بـ 21 إلى 30 كم/س', 'warning', en ? 'Unpaid' : 'غير مدفوعة', '600', en ? 'AED 600.00' : '600.00 درهم'],
    ['F-2026-107455', en ? '2 Mar 2026' : '2 مارس 2026', en ? 'Blocking a lane while parking, Deira' : 'إغلاق مسار أثناء الوقوف، ديرة', 'warning', en ? 'Unpaid' : 'غير مدفوعة', '1100', en ? 'AED 1,100.00' : '1,100.00 درهم'],
    ['F-2026-081930', en ? '19 Feb 2026' : '19 فبراير 2026', '', 'success', en ? 'Paid' : 'مدفوعة', '100', en ? 'AED 100.00' : '100.00 درهم'],
  ];
  return `
  <main>
    <h1>${en ? 'Fines' : 'المخالفات'}</h1>
    <sc-table id="t" caption="${en ? 'Your fines' : 'مخالفاتك'}" selectable ${STRINGS} selection-label="${en ? '{count} fine selected|{count} fines selected' : 'تم تحديد {count}'}" ${attrs}>
      <table>
        <thead>
          <tr>
            <th scope="col" data-type="reference">${en ? 'Reference' : 'الرقم المرجعي'}</th>
            <th scope="col" data-type="date" data-sort="date" aria-sort="descending">${en ? 'Date' : 'التاريخ'}</th>
            <th scope="col">${en ? 'Offence' : 'المخالفة'}</th>
            <th scope="col" data-type="status">${en ? 'Status' : 'الحالة'}</th>
            <th scope="col" data-type="amount" data-sort="amount">${en ? 'Amount' : 'المبلغ'}</th>
            <th scope="col" data-type="action"><span class="sc-visually-hidden">${en ? 'Action' : 'الإجراء'}</span></th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              ([id, date, offence, tone, status, value, amount]) => `
          <tr data-id="${id}">
            <th scope="row"><a href="#${id}"><sc-ltr>${id}</sc-ltr></a></th>
            <td>${date}</td>
            <td>${offence}</td>
            <td><sc-status-tag tone="${tone}">${status}</sc-status-tag></td>
            <td data-value="${value}">${amount}</td>
            <td><a href="#${id}">${en ? 'View' : 'عرض'}<span class="sc-visually-hidden"> ${id}</span></a></td>
          </tr>`,
            )
            .join('')}
        </tbody>
      </table>
      <div slot="footer"><span>${en ? 'Showing 1–3 of 3 fines' : 'عرض 1–3 من 3 مخالفات'}</span></div>
      <sc-button slot="actions">${en ? 'Pay fines' : 'ادفع المخالفات'}</sc-button>
    </sc-table>
  </main>`;
};

const STATES = `
  <main>
    <h1>Fines</h1>
    <sc-table caption="Loading fines" loading><table><thead><tr><th>Reference</th><th data-type="status">Status</th><th data-type="amount">Amount</th></tr></thead><tbody></tbody></table></sc-table>
    <sc-table caption="No fines"><table><thead><tr><th>Reference</th></tr></thead><tbody></tbody></table><div slot="empty"><p>You have no fines</p><p>New fines appear here as soon as they are issued.</p></div></sc-table>
    <sc-table caption="Filtered fines" filtered><table><thead><tr><th>Reference</th></tr></thead><tbody></tbody></table><div slot="empty"><p>No fines from 1 to 31 March 2026</p><p><a href="#clear">Clear dates</a></p></div></sc-table>
    <sc-table caption="Fines that failed to load"><table><thead><tr><th>Reference</th></tr></thead><tbody></tbody></table><sc-callout slot="error" tone="error">We could not load your fines. Try again in a few minutes.</sc-callout></sc-table>
    <sc-table caption="Plates" density="compact"><table><thead><tr><th>Plate</th><th data-type="amount">Fines</th></tr></thead><tbody><tr><th scope="row">Dubai A 12345</th><td>AED 0.00</td></tr></tbody></table></sc-table>
  </main>`;

const rect = (page: E2EPage, selector: string) =>
  page.$eval(selector, (el) => {
    const r = el.getBoundingClientRect();
    return { left: r.left, right: r.right, top: r.top, width: r.width };
  });

/** The accessibility-tree node of a light-DOM element. */
async function axNode(page: E2EPage, selector: string) {
  const handle = await page.$(selector);
  return page.accessibility.snapshot({ root: handle as never, interestingOnly: false });
}

describe('sc-table (e2e)', () => {
  it('is a native table named by its caption, with column and row headers', async () => {
    const page = await newScPage(fines('en'));
    const table = await axNode(page, '#t table');
    expect(table!.role).toBe('table');
    expect(table!.name).toBe('Your fines');
    const roles = await page.evaluate(() => {
      const t = document.querySelector('#t table')!;
      return [t.querySelector('thead th:nth-child(2)')!.getAttribute('scope'), t.querySelector('tbody th')!.getAttribute('scope'), t.querySelector('caption')!.textContent];
    });
    expect(roles).toEqual(['col', 'row', 'Your fines']);
    const sort = await axNode(page, '#t thead th[data-sort="amount"] button');
    expect(sort!.role).toBe('button');
    expect(sort!.name).toBe('Amount');
  });

  it('reaches sort buttons, checkboxes and links with Tab, in reading order', async () => {
    const page = await newScPage(fines('en'));
    const names: string[] = [];
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('Tab');
      names.push(await page.evaluate(() => {
        const a = document.activeElement as HTMLElement;
        return a.getAttribute('aria-label') || a.textContent!.trim();
      }));
    }
    expect(names).toEqual([
      'Select all fines on this page',
      'Date',
      'Amount',
      'Select fine F-2026-118204',
      'F-2026-118204',
      'View F-2026-118204',
      'Select fine F-2026-107455',
      'F-2026-107455',
    ]);
  });

  it('sorts with Enter: one column at a time, cycling the direction, announced politely', async () => {
    const page = await newScPage(fines('en'));
    const sort = await page.spyOnEvent('scSort');
    await page.focus('#t th[data-sort="amount"] button');
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(sort).toHaveReceivedEventDetail({ column: 'amount', direction: 'ascending' });
    expect(await page.$eval('#t th[data-sort="amount"]', (th) => th.getAttribute('aria-sort'))).toBe('ascending');
    expect(await page.$eval('#t th[data-sort="date"]', (th) => th.hasAttribute('aria-sort'))).toBe(false);
    await page.keyboard.press('Space');
    await page.waitForChanges();
    expect(sort).toHaveReceivedEventDetail({ column: 'amount', direction: 'descending' });
    expect(await page.$eval('#t [aria-live]', (el) => el.textContent)).toBe('Sorted by Amount, highest first');
    // The glyph matches the state: the down arrow shows, the faint double chevron doesn't.
    const glyph = await page.$eval('#t th[data-sort="amount"]', (th) => [getComputedStyle(th.querySelector('.sc-table__glyph-descending')!).display, getComputedStyle(th.querySelector('.sc-table__glyph-none')!).display]);
    expect(glyph).toEqual(['inline', 'none']);
  });

  it('selects rows with Space, shows the selection bar with the total, and selects all from the header', async () => {
    const page = await newScPage(fines('en'));
    const change = await page.spyOnEvent('scSelectionChange');
    await page.focus('#t tr[data-id="F-2026-118204"] .sc-table__select input');
    await page.keyboard.press('Space');
    await page.waitForChanges();
    expect(change).toHaveReceivedEventDetail({ ids: ['F-2026-118204'] });
    const state = () =>
      page.evaluate(() => {
        const all = document.querySelector('#t thead .sc-table__select input') as HTMLInputElement;
        const bar = document.querySelector('#t .selection-bar')!;
        return {
          all: [all.checked, all.indeterminate],
          bar: getComputedStyle(bar).display,
          text: bar.querySelector('.selection-text')!.textContent,
          selected: [...document.querySelectorAll('#t tbody tr[data-selected]')].map((r) => (r as HTMLElement).dataset.id),
        };
      });
    expect(await state()).toEqual({ all: [false, true], bar: 'flex', text: '1 fine selected · AED 600.00', selected: ['F-2026-118204'] });
    await page.focus('#t thead .sc-table__select input');
    await page.keyboard.press('Space');
    await page.waitForChanges();
    expect(change).toHaveReceivedEventDetail({ ids: ['F-2026-118204', 'F-2026-107455', 'F-2026-081930'] });
    expect(await state()).toEqual({ all: [true, false], bar: 'flex', text: '3 fines selected · AED 1,800.00', selected: ['F-2026-118204', 'F-2026-107455', 'F-2026-081930'] });
    const fill = async () => {
      await new Promise((r) => setTimeout(r, 300)); // the 120ms background transition
      return page.$eval('#t tbody tr', (tr) => getComputedStyle(tr).backgroundColor);
    };
    expect(await fill()).toContain('oklab');
    await page.keyboard.press('Space');
    await page.waitForChanges();
    expect(change).toHaveReceivedEventDetail({ ids: [] });
    expect(await fill()).toBe('rgba(0, 0, 0, 0)');
  });

  it('mirrors in Arabic: first column and checkboxes on the right, amounts on the left, glyph after the label', async () => {
    const page = await newScPage(fines('ar'), { lang: 'ar' });
    const select = await rect(page, '#t tbody tr:first-child .sc-table__select');
    const ref = await rect(page, '#t tbody tr:first-child th');
    const amount = await rect(page, '#t tbody tr:first-child td[data-type="amount"]');
    expect(select.left).toBeGreaterThan(ref.left);
    expect(ref.left).toBeGreaterThan(amount.left);
    const align = await page.$eval('#t tbody tr:first-child td[data-type="amount"]', (td) => getComputedStyle(td).textAlign);
    expect(align).toBe('end');
    const label = await rect(page, '#t th[data-sort="amount"] .sc-table__sort-label');
    const glyph = await rect(page, '#t th[data-sort="amount"] .sc-table__sort-glyph');
    expect(glyph.left).toBeLessThan(label.left);
    expect(await page.$eval('#t tbody tr:first-child .sc-table__select input', (i) => i.getAttribute('aria-label'))).toBe('تحديد المخالفة F-2026-118204');
    expect(await page.$eval('#t tbody tr:nth-child(3) td:nth-of-type(3)', (td) => td.textContent)).toBe('لا يوجد');
  });

  it('re-labels its own strings when the language changes', async () => {
    const page = await newScPage(fines('en'));
    expect(await page.$eval('#t tbody tr:nth-child(3) .sc-table__none', (el) => el.textContent)).toBe('None');
    await setPageContext(page, { lang: 'ar' });
    await page.waitForChanges();
    expect(await page.$eval('#t thead .sc-table__select input', (i) => i.getAttribute('aria-label'))).toBe('تحديد كل المخالفات في هذه الصفحة');
    expect(await page.$eval('#t tbody tr:nth-child(3) .sc-table__none', (el) => el.textContent)).toBe('لا يوجد');
  });

  it('stacks rows as cards below 600px, status at top inline-end and the amount last', async () => {
    for (const lang of ['en', 'ar'] as const) {
      const page = await newScPage(`<div style="inline-size: 390px">${fines(lang)}</div>`, { lang });
      const row = 'sc-table tbody tr:first-child';
      expect(await page.$eval(row, (tr) => getComputedStyle(tr).display)).toBe('grid');
      const title = await rect(page, `${row} th`);
      const status = await rect(page, `${row} td[data-type="status"] sc-status-tag`);
      const amount = await rect(page, `${row} td[data-type="amount"]`);
      const offence = await rect(page, `${row} td:nth-of-type(3)`);
      expect(Math.abs(status.top - title.top)).toBeLessThan(16);
      expect(amount.top).toBeGreaterThan(offence.top);
      if (lang === 'en') expect(status.left).toBeGreaterThan(title.left);
      else expect(status.left).toBeLessThan(title.left);
      // The label above each value comes from its column header.
      const label = await page.$eval(`${row} td:nth-of-type(2)`, (td) => getComputedStyle(td, '::before').content);
      expect(label).toBe(lang === 'en' ? '"Date"' : '"التاريخ"');
      await expectNoAxeViolations(page);
    }
  });

  it('scrolls sideways below 600px with responsive="scroll": a named, focusable region, sticky row headers', async () => {
    for (const lang of ['en', 'ar'] as const) {
      const page = await newScPage(`<div style="inline-size: 360px">${fines(lang, 'responsive="scroll"')}</div>`, { lang });
      await page.waitForChanges();
      const region = await page.$eval('sc-table .scroller', (el) => [el.getAttribute('role'), el.getAttribute('tabindex'), document.getElementById(el.getAttribute('aria-labelledby')!)?.tagName, getComputedStyle(el).overflowX]);
      expect(region).toEqual(['region', '0', 'CAPTION', 'auto']);
      expect(await page.$eval('sc-table tbody th', (th) => getComputedStyle(th).position)).toBe('sticky');
      // The shadow edge shows on the side with more content: the end side at first.
      const edges = await page.$eval('sc-table', (el) => [el.classList.contains('sc-table--edge-start'), el.classList.contains('sc-table--edge-end')]);
      expect(edges).toEqual([false, true]);
      // The region starts at inline-start (the right in RTL): the checkbox, then the row header.
      const scroller = await rect(page, 'sc-table .scroller');
      const select = await rect(page, 'sc-table tbody tr:first-child .sc-table__select');
      const th = await rect(page, 'sc-table tbody tr:first-child th');
      if (lang === 'ar') {
        expect(Math.round(select.right)).toBeGreaterThanOrEqual(Math.round(scroller.right) - 1);
        expect(Math.round(th.right)).toBe(Math.round(select.left));
      } else {
        expect(Math.round(select.left)).toBeLessThanOrEqual(Math.round(scroller.left) + 1);
        expect(Math.round(th.left)).toBe(Math.round(select.right));
      }
      // Scrolling keeps the row header in place.
      await page.$eval('sc-table .scroller', (el, rtl) => el.scrollBy({ left: rtl ? -200 : 200, behavior: 'instant' as ScrollBehavior }), lang === 'ar');
      await page.waitForChanges();
      expect(Math.round((await rect(page, 'sc-table tbody tr:first-child th')).left)).toBe(Math.round(th.left));
      expect(await page.$eval('sc-table', (el) => el.classList.contains('sc-table--edge-start'))).toBe(true);
    }
  });

  for (const ctx of contexts) {
    it(`has no axe violations (${ctx.lang}, ${ctx.theme})`, async () => {
      const page = await newScPage(fines(ctx.lang), ctx);
      await expectNoAxeViolations(page);
      await page.focus('#t thead .sc-table__select input');
      await page.keyboard.press('Space');
      await page.waitForChanges();
      await expectNoAxeViolations(page);
    });
  }

  it('has no axe violations in its loading, empty, no-results, error and compact states', async () => {
    const page = await newScPage(STATES);
    const shown = await page.evaluate(() => [...document.querySelectorAll('sc-table')].map((t) => [t.querySelector('thead')!.hasAttribute('data-sc-hidden'), !!t.querySelector('.sc-table__skeleton')]));
    expect(shown).toEqual([
      [false, true],
      [true, false],
      [false, false],
      [true, false],
      [false, false],
    ]);
    const visible = await page.evaluate(() => [...document.querySelectorAll('sc-table')].map((t) => [getComputedStyle(t.querySelector('table')!).display !== 'none', !t.querySelector('.state--empty')!.hasAttribute('hidden')]));
    expect(visible).toEqual([
      [true, false],
      [false, true],
      [true, true],
      [false, false],
      [true, false],
    ]);
    await expectNoAxeViolations(page);
    await setPageContext(page, { theme: 'dark' });
    await expectNoAxeViolations(page);
  });
});
