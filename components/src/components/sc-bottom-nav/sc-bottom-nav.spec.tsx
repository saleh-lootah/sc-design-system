import { newSpecPage } from '@stencil/core/testing';
import { ScBottomNav } from './sc-bottom-nav';

const ITEMS = `<a href="/en" data-icon="home" aria-current="page">Home</a><a href="/en/services" data-icon="apps">Services</a><a href="/en/activity" data-icon="history">Activity</a>`;
const render = (html: string) => newSpecPage({ components: [ScBottomNav], html });
const root = (page: Awaited<ReturnType<typeof render>>) => page.body.querySelector('sc-bottom-nav')!.shadowRoot!;

describe('sc-bottom-nav (spec)', () => {
  it('renders a nav labelled "Main" with one item per link', async () => {
    const page = await render(`<sc-bottom-nav>${ITEMS}</sc-bottom-nav>`);
    expect(root(page).querySelector('nav')!.getAttribute('aria-label')).toBe('Main');
    const links = Array.from(root(page).querySelectorAll('a'));
    expect(links.map((a) => [a.getAttribute('href'), a.textContent])).toEqual([
      ['/en', 'Home'],
      ['/en/services', 'Services'],
      ['/en/activity', 'Activity'],
    ]);
  });

  it('puts the icon in the indicator above the label, and marks the current item', async () => {
    const page = await render(`<sc-bottom-nav>${ITEMS}</sc-bottom-nav>`);
    const first = root(page).querySelector('a')!;
    expect(Array.from(first.children).map((c) => c.className)).toEqual(['indicator', 'label']);
    expect(first.querySelector('.indicator svg')).not.toBeNull();
    expect(first.getAttribute('aria-current')).toBe('page');
    expect(first).toHaveClass('item--current');
    expect(root(page).querySelectorAll('[aria-current]').length).toBe(1);
  });

  it('uses Arabic strings and the label override', async () => {
    const page = await render(`<div lang="ar"><sc-bottom-nav>${ITEMS}</sc-bottom-nav></div>`);
    expect(root(page).querySelector('nav')!.getAttribute('aria-label')).toBe('رئيسية');
    const custom = await render(`<sc-bottom-nav label="Account">${ITEMS}</sc-bottom-nav>`);
    expect(root(custom).querySelector('nav')!.getAttribute('aria-label')).toBe('Account');
  });
});
