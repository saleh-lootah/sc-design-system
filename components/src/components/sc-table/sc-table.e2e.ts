import { E2EPage } from '@stencil/core/testing';
import { describeAxe, expectNoAxeViolations } from '../../test/axe';
import { contexts, newScPage, setPageContext } from '../../test/page';

const STRINGS = `strings='{"en": {"tableSelectAll": "Select all fines on this page", "tableSelectRow": "Select fine {row}"}, "ar": {"tableSelectAll": "تحديد كل المخالفات في هذه الصفحة", "tableSelectRow": "تحديد المخالفة {row}"}}'`;

const fines = (lang: 'en' | 'ar', attrs = '') => {
  const en = lang === 'en';
  const rows = [
    ['F-2026-118204', en ? '14 Mar 2026' : '14 مارس 2026', en ? 'Speeding: 21 to 30 km/h over the limit' : 'تجاوز السرعة المحددة بـ 21 إلى 30 كم/س', 'warning', en ? 'Not paid' : 'بانتظار الدفع', '600', en ? 'AED 600.00' : '600.00 درهم'],
    ['F-2026-107455', en ? '2 Mar 2026' : '2 مارس 2026', en ? 'Blocking a lane while parking, Deira' : 'إغلاق مسار أثناء الوقوف، ديرة', 'warning', en ? 'Not paid' : 'بانتظار الدفع', '1100', en ? 'AED 1,100.00' : '1,100.00 درهم'],
    ['F-2026-081930', en ? '19 Feb 2026' : '19 فبراير 2026', '', 'success', en ? 'Paid' : 'تم الدفع', '100', en ? 'AED 100.00' : '100.00 درهم'],
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
      <div slot="footer"><span>${en ? 'Showing 1–3 of 3 fines' : 'عرض 1 إلى 3 من 3 مخالفات'}</span></div>
      <sc-button slot="actions">${en ? 'Pay fines' : 'دفع المخالفات'}</sc-button>
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

  it('keeps a focused control clear of the sticky row-header column when tabbing sideways (WCAG 2.4.11)', async () => {
    for (const lang of ['en', 'ar'] as const) {
      const cols = Array.from({ length: 7 }, (_, i) => i + 1);
      const page = await newScPage(
        `<main><h1>Fines</h1><div style="inline-size: 360px">
          <sc-table caption="Wide" responsive="scroll" selectable ${STRINGS}>
            <table>
              <thead><tr><th scope="col">Reference</th>${cols.map((i) => `<th scope="col">Column ${i}</th>`).join('')}</tr></thead>
              <tbody>
                <tr><th scope="row"><a href="#a">F-2026-118204</a></th>${cols.map((i) => `<td><a href="#c${i}" class="far">Link ${i}</a></td>`).join('')}</tr>
              </tbody>
            </table>
          </sc-table></div></main>`,
        { lang },
      );
      await page.setViewport({ width: 400, height: 700 });
      await page.waitForChanges();
      expect(await page.$eval('sc-table .scroller', (el) => parseFloat(getComputedStyle(el).scrollPaddingInlineStart))).toBeGreaterThan(0);
      /** How far the focused link overlaps the sticky cells (0 when clear), and which link has focus. */
      const overlap = () =>
        page.evaluate(() => {
          const focused = document.activeElement as HTMLElement;
          const box = focused.getBoundingClientRect();
          const sticky = Array.from(document.querySelectorAll('sc-table tbody tr > *')).filter((c) => getComputedStyle(c).position === 'sticky').map((c) => c.getBoundingClientRect());
          const start = Math.min(...sticky.map((s) => s.left));
          const end = Math.max(...sticky.map((s) => s.right));
          return { link: focused.getAttribute('href'), overlap: Math.max(0, Math.min(box.right, end) - Math.max(box.left, start)) };
        });
      // Into the row: the checkbox, the row header link, then the links across to the far column.
      await page.focus('sc-table tbody .sc-table__select input');
      await page.keyboard.press('Tab');
      for (const i of cols) {
        await page.keyboard.press('Tab');
        expect(await overlap()).toEqual({ link: `#c${i}`, overlap: 0 });
      }
      // Back from the far column to the near ones: each scrolls in at the start edge, clear of the sticky column.
      for (const i of cols.slice(0, -1).reverse()) {
        await page.keyboard.down('Shift');
        await page.keyboard.press('Tab');
        await page.keyboard.up('Shift');
        expect(await overlap()).toEqual({ link: `#c${i}`, overlap: 0 });
      }
    }
  });

  it('gives links in body cells a target of at least 44 x 44 px without changing the row height (A11Y-04)', async () => {
    for (const density of ['default', 'compact']) {
      const page = await newScPage(`
        <main>
          <h1>Fines</h1>
          <sc-table caption="Your fines" density="${density}">
            <table>
              <thead><tr><th scope="col">Reference</th><th scope="col">Offence</th><th scope="col" data-type="action"><span class="sc-visually-hidden">Action</span></th></tr></thead>
              <tbody>
                <tr><th scope="row"><a href="#a">F-1</a></th><td>Speeding</td><td><a href="#a">View<span class="sc-visually-hidden"> F-1</span></a></td></tr>
                <tr><th scope="row">F-2</th><td>Speeding</td><td>View</td></tr>
              </tbody>
            </table>
          </sc-table>
        </main>`);
      const size = await page.evaluate(() => {
        const rows = document.querySelectorAll('sc-table tbody tr');
        const target = (a: Element) => {
          const r = a.getBoundingClientRect();
          const after = getComputedStyle(a, '::after');
          return {
            position: after.position,
            height: r.height - parseFloat(after.top) - parseFloat(after.bottom),
            width: r.width - parseFloat(after.left) - parseFloat(after.right),
          };
        };
        const height = () => rows[0].getBoundingClientRect().height;
        const withTarget = height();
        // The same row with the grown hit area switched off.
        const off = document.createElement('style');
        off.textContent = 'sc-table tbody a { position: static !important; } sc-table tbody a::after { display: none !important; }';
        document.head.append(off);
        const withoutTarget = height();
        off.remove();
        return {
          links: [...rows[0].querySelectorAll('a')].map(target),
          rows: [withTarget, withoutTarget],
        };
      });
      expect(size.links).toHaveLength(2);
      for (const link of size.links) {
        expect(link.position).toBe('absolute');
        // Chromium lays out in 1/64px units, so a computed 44 can read back as 43.98.
        expect(link.height).toBeGreaterThanOrEqual(44 - 1 / 32);
        expect(link.width).toBeGreaterThanOrEqual(44 - 1 / 32);
      }
      // The grown hit area does not change the row's height.
      expect(size.rows[0]).toBe(size.rows[1]);
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

describe('sc-table (e2e, v2 look)', () => {
  const token = (page: E2EPage, name: string, prop = 'backgroundColor') =>
    page.evaluate(
      (n: string, p: string) => {
        const probe = document.createElement('i');
        probe.style.backgroundColor = `var(${n})`;
        probe.style.outlineColor = `var(${n})`;
        document.querySelector('main')!.append(probe);
        const v = getComputedStyle(probe)[p as 'backgroundColor'];
        probe.remove();
        return v;
      },
      name,
      prop,
    );

  it('is a flat 12px container with a 1px outline-variant edge, a surface-container header and no shadow', async () => {
    const page = await newScPage(fines('en'));
    const r = await page.evaluate(() => {
      const c = getComputedStyle(document.querySelector('#t .container')!);
      const th = getComputedStyle(document.querySelector('#t thead th:not(.sc-table__select)')!);
      return { radius: c.borderTopLeftRadius, width: c.borderTopWidth, edge: c.borderTopColor, shadow: c.boxShadow, head: th.backgroundColor, headWeight: th.fontWeight };
    });
    expect([r.radius, r.width, r.shadow]).toEqual(['12px', '1px', 'none']);
    expect(r.edge).toBe(await token(page, '--sc-color-outline-variant'));
    expect(r.head).toBe(await token(page, '--sc-color-surface-container'));
  });

  it('marks selected rows with channel-subtle and a checked box, and keeps the U1 neutral ring on checkboxes', async () => {
    const page = await newScPage(fines('en'));
    await page.evaluate(() => (document.querySelector('#t tbody .sc-table__box') as HTMLInputElement).click());
    await page.waitForChanges();
    await page.evaluate(() => document.getAnimations().forEach((a) => a.finish()));
    const fill = await page.evaluate(() => getComputedStyle(document.querySelector('#t tbody tr[data-selected]')!).backgroundColor);
    expect(fill).toBe(await token(page, '--sc-color-channel-subtle'));
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const ring = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      const cs = getComputedStyle(el);
      return [cs.outlineWidth, cs.outlineColor];
    });
    expect(ring[0]).toBe('3px');
    expect(ring[1]).toBe(await token(page, '--sc-color-focus-ring', 'outlineColor'));
  });

  it('underlines links (COL-08) and sets cells in body-medium, the Arabic scale in Arabic', async () => {
    const page = await newScPage(fines('en'));
    const read = () =>
      page.evaluate(() => [getComputedStyle(document.querySelector('#t td a')!).textDecorationLine, getComputedStyle(document.querySelector('#t tbody td')!).fontSize]);
    expect(await read()).toEqual(['underline', '16px']);
    await setPageContext(page, { lang: 'ar' });
    expect((await read())[1]).toBe('18px');
  });

  it('matches board 09.05: a 48px header row, 14px cell padding, channel-action row-header links, a Bold count and a Medium total', async () => {
    const page = await newScPage(fines('en'));
    await page.evaluate(() => (document.querySelector('#t tbody .sc-table__box') as HTMLInputElement).click());
    await page.waitForChanges();
    const r = await page.evaluate(() => {
      const th = document.querySelector('#t thead th:not(.sc-table__select)')!;
      return {
        head: Math.round(th.getBoundingClientRect().height),
        pad: getComputedStyle(document.querySelector('#t tbody td:not(.sc-table__select)')!).paddingTop,
        link: getComputedStyle(document.querySelector('#t tbody th a')!).color,
        count: getComputedStyle(document.querySelector('#t .selection-count')!).fontWeight,
        total: getComputedStyle(document.querySelector('#t .selection-total')!).fontWeight,
      };
    });
    expect(r.head).toBeGreaterThanOrEqual(48);
    expect(r.pad).toBe('14px');
    expect(r.link).toBe(await token(page, '--sc-color-channel-action'));
    expect([r.count, r.total]).toEqual(['700', '500']);
  });

  it('stacks cells as key and value pairs on one line below 600px, the value end-aligned', async () => {
    const page = await newScPage(`<div style="inline-size: 360px">${fines('en')}</div>`);
    const r = await page.evaluate(() => {
      const td = document.querySelector('#t tbody tr td:not(.sc-table__select)')!;
      const before = getComputedStyle(td, '::before');
      return { display: getComputedStyle(td).display, align: getComputedStyle(td).textAlign, label: before.content, labelDisplay: before.display };
    });
    expect(r).toEqual({ display: 'table', align: 'end', label: '"Date"', labelDisplay: 'table-cell' });
  });

  it('styles from @layer sc.components, so unlayered service CSS wins without !important', async () => {
    const page = await newScPage(`<style>#t .container { border-radius: 0; }</style>${fines('en')}`);
    expect(await page.evaluate(() => getComputedStyle(document.querySelector('#t .container')!).borderTopLeftRadius)).toBe('0px');
  });
});

describeAxe('sc-table states', STATES);
