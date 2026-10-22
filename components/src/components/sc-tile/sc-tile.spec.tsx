import { newSpecPage } from '@stencil/core/testing';
import { ScTile } from './sc-tile';

const root = (page: { root?: HTMLElement }) => page.root!.shadowRoot!;

describe('sc-tile (spec)', () => {
  it('renders one link holding the title and the plural-aware count', async () => {
    const page = await newSpecPage({ components: [ScTile], html: `<sc-tile href="/moving" tint="orange" count="14">Moving home<svg slot="icon"></svg></sc-tile>` });
    const links = root(page).querySelectorAll('a');
    expect(links.length).toBe(1);
    expect(links[0].getAttribute('href')).toBe('/moving');
    expect(root(page).querySelector('[part="count"]')!.textContent).toBe(', 14 services');
    expect(root(page).querySelector('[part="icon"]')).toHaveClasses(['icon-tile', 'icon-tile--orange']);
    expect(root(page).querySelector('[part="icon"]')!.getAttribute('aria-hidden')).toBe('true');
  });

  it.each([
    [0, '0 services'],
    [1, '1 service'],
    [1284, '1,284 services'],
  ])('writes %i in English as "%s"', async (n, text) => {
    const page = await newSpecPage({ components: [ScTile], html: `<sc-tile href="#" count="${n}">Moving home</sc-tile>` });
    expect(root(page).querySelector('[part="count"]')!.textContent).toBe(`, ${text}`);
  });

  it.each([
    [0, 'لا توجد خدمات'],
    [1, 'خدمة واحدة'],
    [2, 'خدمتان'],
    [3, '3 خدمات'],
    [14, '14 خدمة'],
    [100, '100 خدمة'],
  ])('writes %i in Arabic with the right plural form and Latin digits: "%s"', async (n, text) => {
    const page = await newSpecPage({ components: [ScTile], html: `<div lang="ar"><sc-tile href="#" count="${n}">الانتقال إلى منزل جديد</sc-tile></div>` });
    expect(page.body.querySelector('sc-tile')!.shadowRoot!.querySelector('[part="count"]')!.textContent).toBe(`, ${text}`);
  });

  it('uses count-label and leaves out the count without one', async () => {
    const own = await newSpecPage({ components: [ScTile], html: `<sc-tile href="#" count="2" count-label="{count} step|{count} steps">Having a baby</sc-tile>` });
    expect(root(own).querySelector('[part="count"]')!.textContent).toBe(', 2 steps');
    const none = await newSpecPage({ components: [ScTile], html: `<sc-tile href="#">Pay a traffic fine</sc-tile>` });
    expect(root(none).querySelector('[part="count"]')).toBeNull();
    expect(root(none).querySelector('[part="icon"]')).toHaveClass('is-empty');
  });

  it('ignores an unknown tint', async () => {
    const page = await newSpecPage({ components: [ScTile], html: `<sc-tile href="#" tint="teal">x<svg slot="icon"></svg></sc-tile>` });
    expect(root(page).querySelector('[part="icon"]')!.className).not.toContain('icon-tile--');
  });

  it('takes the href and title from a light-DOM <a href> child, which it then leaves unslotted', async () => {
    const page = await newSpecPage({ components: [ScTile], html: `<sc-tile count="3"><svg slot="icon"></svg><a href="/moving">Moving home</a></sc-tile>` });
    const links = root(page).querySelectorAll('a');
    expect(links.length).toBe(1);
    expect(links[0].getAttribute('href')).toBe('/moving');
    expect(root(page).querySelector('[part="title"]')!.textContent).toBe('Moving home');
    expect(root(page).querySelector('[part="title"] slot')).toBeNull();
  });
});
