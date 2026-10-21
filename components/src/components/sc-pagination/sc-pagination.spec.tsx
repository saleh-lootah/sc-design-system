import { newSpecPage } from '@stencil/core/testing';
import { ScPagination } from './sc-pagination';

const render = (html: string) => newSpecPage({ components: [ScPagination], html });
const root = (page: Awaited<ReturnType<typeof render>>) => page.body.querySelector('sc-pagination')!.shadowRoot!;
/** The visible sequence: page numbers, "…" for gaps, and "<" / ">" for Previous and Next. */
const sequence = (page: Awaited<ReturnType<typeof render>>) =>
  Array.from(root(page).querySelectorAll('.list > li:not(.of)')).map((li) =>
    li.classList.contains('gap') ? '…' : li.classList.contains('step') ? (li.querySelector('.turn')!.textContent === 'Previous' ? '<' : '>') : li.textContent,
  );

describe('sc-pagination (spec)', () => {
  it.each([
    [1, 13, ['1', '2', '…', '13', '>']],
    [2, 13, ['<', '1', '2', '3', '…', '13', '>']],
    [4, 13, ['<', '1', '2', '3', '4', '5', '…', '13', '>']],
    [7, 13, ['<', '1', '…', '6', '7', '8', '…', '13', '>']],
    [13, 13, ['<', '1', '…', '12', '13']],
    [2, 3, ['<', '1', '2', '3', '>']],
  ])('page %i of %i shows %j', async (page, total, expected) => {
    const p = await render(`<sc-pagination page="${page}" total-pages="${total}" href-template="?page={page}"></sc-pagination>`);
    expect(sequence(p)).toEqual(expected);
  });

  it('marks the current page with aria-current and names every number', async () => {
    const page = await render(`<sc-pagination page="3" total-pages="5" href-template="?page={page}"></sc-pagination>`);
    const current = root(page).querySelector('[aria-current="page"]')!;
    expect(current.textContent).toBe('3');
    expect(current.getAttribute('aria-label')).toBe('Page 3');
    expect(current).toHaveClass('cell--current');
    expect(root(page).querySelectorAll('[aria-current]').length).toBe(1);
  });

  it('renders links from href-template, with rel prev and next', async () => {
    const page = await render(`<sc-pagination page="2" total-pages="5" href-template="/en/fines?page={page}"></sc-pagination>`);
    const turns = Array.from(root(page).querySelectorAll('.turn'));
    expect(turns.map((a) => [a.tagName, a.getAttribute('href'), a.getAttribute('rel')])).toEqual([
      ['A', '/en/fines?page=1', 'prev'],
      ['A', '/en/fines?page=3', 'next'],
    ]);
  });

  it('renders buttons without href-template', async () => {
    const page = await render(`<sc-pagination page="2" total-pages="5"></sc-pagination>`);
    expect(root(page).querySelector('.cell')!.tagName).toBe('BUTTON');
    expect(root(page).querySelector('.cell')!.getAttribute('type')).toBe('button');
  });

  it('labels the landmark and works out the page count from total-items', async () => {
    const page = await render(`<sc-pagination total-items="1284" page-size="20"></sc-pagination>`);
    expect(root(page).querySelector('nav')!.getAttribute('aria-label')).toBe('Pagination');
    expect(root(page).querySelector('.of')!.textContent).toBe('Page 1 of 65');
  });

  it('shows "Showing 1–20 of 1,284 fines" with Latin digits and a thousands comma', async () => {
    const page = await render(`<sc-pagination total-items="1284" item-label="fine|fines"></sc-pagination>`);
    expect(root(page).querySelector('.count')!.textContent).toBe('Showing 1–20 of 1,284 fines');
    const one = await render(`<sc-pagination total-items="1" item-label="fine|fines"></sc-pagination>`);
    expect(root(one).querySelector('.count')!.textContent).toBe('Showing 1 of 1 fine');
    expect(root(one).querySelector('nav')).toBeNull();
  });

  it('writes the Arabic range with a word, never a dash, and picks the Arabic plural form', async () => {
    const forms = 'مخالفة|مخالفة|مخالفتين|مخالفات|مخالفة|مخالفة';
    const page = await render(`<div lang="ar" dir="rtl"><sc-pagination page="1" total-items="1284" item-label="${forms}"></sc-pagination></div>`);
    const text = root(page).querySelector('.count')!.textContent!;
    expect(text).toBe('عرض 1 إلى 20 من 1,284 مخالفة');
    expect(text).not.toMatch(/[–-]/);
    const few = await render(`<div lang="ar"><sc-pagination total-items="5" item-label="${forms}"></sc-pagination></div>`);
    expect(root(few).querySelector('.count')!.textContent).toBe('عرض 1 إلى 5 من 5 مخالفات');
    const last = await render(`<div lang="ar"><sc-pagination page="65" total-items="1284"></sc-pagination></div>`);
    expect(root(last).querySelector('.count')!.textContent).toBe('عرض 1,281 إلى 1,284 من 1,284 نتيجة');
    expect(root(last).querySelector('.turn')!.textContent).toBe('السابق');
    expect(root(last).querySelector('.of')!.textContent).toBe('الصفحة 65 من 65');
  });

  it('clamps an out-of-range page', async () => {
    const page = await render(`<sc-pagination page="99" total-pages="4" href-template="?p={page}"></sc-pagination>`);
    expect(root(page).querySelector('[aria-current="page"]')!.textContent).toBe('4');
  });
});
