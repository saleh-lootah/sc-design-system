import { newSpecPage } from '@stencil/core/testing';
import { ScAccountNav } from './sc-account-nav';

export const ITEMS = `
  <a href="/en/account/applications" data-icon="description">Applications</a>
  <a href="/en/account/payments" data-icon="credit-card" aria-current="page">Payments</a>
  <a href="/en/account/notifications" data-icon="notifications" data-count="3" data-count-label="3 unread">Notifications</a>
  <a href="/en/account/profile" data-icon="person">Profile and settings</a>
  <a href="/en/sign-out" data-icon="logout" data-sign-out>Sign out</a>`;

const render = (html: string) => newSpecPage({ components: [ScAccountNav], html });
const root = (page: Awaited<ReturnType<typeof render>>) => page.body.querySelector('sc-account-nav')!.shadowRoot!;

describe('sc-account-nav (spec)', () => {
  it('renders a labelled nav: four items, then Sign out in its own list after the divider', async () => {
    const page = await render(`<sc-account-nav>${ITEMS}</sc-account-nav>`);
    expect(root(page).querySelector('nav')!.getAttribute('aria-label')).toBe('Account');
    const lists = root(page).querySelectorAll('ul');
    expect(lists.length).toBe(2);
    expect(lists[0].querySelectorAll('li').length).toBe(4);
    expect(lists[1]).toHaveClass('list--out');
    expect(lists[1].querySelector('a')!.getAttribute('href')).toBe('/en/sign-out');
  });

  it('marks the current item with aria-current and the current class', async () => {
    const page = await render(`<sc-account-nav>${ITEMS}</sc-account-nav>`);
    const current = root(page).querySelectorAll('[aria-current="page"]');
    expect(current.length).toBe(1);
    expect(current[0].textContent).toBe('Payments');
    expect(current[0]).toHaveClass('item--current');
  });

  it('draws the named 24px icons; sign out mirrors', async () => {
    const page = await render(`<sc-account-nav>${ITEMS}</sc-account-nav>`);
    const icons = Array.from(root(page).querySelectorAll('a > svg'));
    expect(icons.length).toBe(5);
    expect(icons[4].getAttribute('class')).toContain('icon-directional');
    expect(icons[0].getAttribute('class')).not.toContain('icon-directional');
  });

  it('shows a count badge, hidden from the accessibility tree, with hidden text read with the link', async () => {
    const page = await render(`<sc-account-nav>${ITEMS}</sc-account-nav>`);
    const link = root(page).querySelectorAll('a')[2];
    expect(link.querySelector('.badge')!.textContent).toBe('3');
    expect(link.querySelector('.badge')!.getAttribute('aria-hidden')).toBe('true');
    expect(link.querySelector('.visually-hidden')!.textContent).toBe(' 3 unread');
  });

  it('uses the default count text and Arabic strings', async () => {
    const page = await render(`<div lang="ar" dir="rtl"><sc-account-nav><a href="/ar/n" data-icon="notifications" data-count="12">الإشعارات</a></sc-account-nav></div>`);
    expect(root(page).querySelector('nav')!.getAttribute('aria-label')).toBe('الحساب');
    expect(root(page).querySelector('.visually-hidden')!.textContent).toBe(' 12 جديدة');
    const en = await render(`<sc-account-nav><a href="/n" data-count="2">Notifications</a><a href="/x" data-count="0">Payments</a></sc-account-nav>`);
    expect(root(en).querySelector('.visually-hidden')!.textContent).toBe(' 2 new');
    expect(root(en).querySelectorAll('.badge').length).toBe(1);
  });

  it('ignores children that are not links, and has no sign-out list without one', async () => {
    const page = await render(`<sc-account-nav><span>Hello</span><a href="/a">Applications</a></sc-account-nav>`);
    expect(root(page).querySelectorAll('a').length).toBe(1);
    expect(root(page).querySelectorAll('ul').length).toBe(1);
  });
});
