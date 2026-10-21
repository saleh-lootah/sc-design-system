import { newSpecPage } from '@stencil/core/testing';
import { ScBreadcrumbs } from './sc-breadcrumbs';

const TRAIL = `<a href="/en">Home</a><a href="/en/vehicles">Vehicles</a><span>Renew your vehicle registration</span>`;
const render = (html: string) => newSpecPage({ components: [ScBreadcrumbs], html });
const shadow = (page: Awaited<ReturnType<typeof render>>) => page.body.querySelector('sc-breadcrumbs')!.shadowRoot!;

describe('sc-breadcrumbs (spec)', () => {
  it('renders a labelled nav with an ordered list, one item per child', async () => {
    const page = await render(`<sc-breadcrumbs>${TRAIL}</sc-breadcrumbs>`);
    const root = shadow(page);
    expect(root.querySelector('nav')!.getAttribute('aria-label')).toBe('Breadcrumb');
    expect(root.querySelectorAll('ol > li').length).toBe(3);
    const links = Array.from(root.querySelectorAll('a'));
    expect(links.map((a) => a.getAttribute('href'))).toEqual(['/en', '/en/vehicles']);
    expect(links[0].querySelector('.full')!.textContent).toBe('Home');
  });

  it('makes the last item the current page: plain text with aria-current="page"', async () => {
    const page = await render(`<sc-breadcrumbs>${TRAIL}</sc-breadcrumbs>`);
    const current = shadow(page).querySelector('li:last-child [part="current"]')!;
    expect(current.tagName).toBe('SPAN');
    expect(current.getAttribute('aria-current')).toBe('page');
    expect(current.textContent).toBe('Renew your vehicle registration');
  });

  it('treats a last child that is a link as the current page too (never a link)', async () => {
    const page = await render(`<sc-breadcrumbs><a href="/en">Home</a><a href="/en/vehicles">Vehicles</a></sc-breadcrumbs>`);
    expect(shadow(page).querySelectorAll('a').length).toBe(1);
  });

  it('puts a directional chevron between items, not before the first', async () => {
    const page = await render(`<sc-breadcrumbs>${TRAIL}</sc-breadcrumbs>`);
    const items = Array.from(shadow(page).querySelectorAll('li'));
    expect(items.map((li) => li.firstElementChild!.classList.contains('sep'))).toEqual([false, true, true]);
    expect(items[1].querySelector('svg.sep')!.getAttribute('class')).toContain('icon-directional');
    expect(items[1].querySelector('svg.sep')!.getAttribute('aria-hidden')).toBe('true');
  });

  it('marks the parent for the compact "Back to" link', async () => {
    const page = await render(`<sc-breadcrumbs>${TRAIL}</sc-breadcrumbs>`);
    const parent = shadow(page).querySelector('.item--parent')!;
    expect(parent.querySelector('.compact')!.textContent).toBe('Back to Vehicles');
  });

  it('overrides the compact text with compact-label', async () => {
    const page = await render(`<sc-breadcrumbs compact-label="All {parent}">${TRAIL}</sc-breadcrumbs>`);
    expect(shadow(page).querySelector('.item--parent .compact')!.textContent).toBe('All Vehicles');
  });

  it('uses Arabic strings and the label override', async () => {
    const page = await render(`<div lang="ar" dir="rtl"><sc-breadcrumbs>${TRAIL}</sc-breadcrumbs></div>`);
    expect(shadow(page).querySelector('nav')!.getAttribute('aria-label')).toBe('مسار التنقل');
    expect(shadow(page).querySelector('.item--parent .compact')!.textContent).toBe('رجوع إلى Vehicles');
    const custom = await render(`<sc-breadcrumbs label="You are here">${TRAIL}</sc-breadcrumbs>`);
    expect(shadow(custom).querySelector('nav')!.getAttribute('aria-label')).toBe('You are here');
  });

  it('accepts a list wrapper', async () => {
    const page = await render(`<sc-breadcrumbs><ol><li><a href="/en">Home</a></li><li><span>Fines</span></li></ol></sc-breadcrumbs>`);
    expect(shadow(page).querySelectorAll('li').length).toBe(2);
  });
});
