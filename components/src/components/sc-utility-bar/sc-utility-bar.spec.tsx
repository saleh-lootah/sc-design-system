import { newSpecPage } from '@stencil/core/testing';
import { ScUtilityBar } from './sc-utility-bar';

const ALL = `<sc-utility-bar happiness-href="/happiness" contact-href="tel:04" chat-href="/chat" accessibility-href="/accessibility"></sc-utility-bar>`;
const render = (html: string) => newSpecPage({ components: [ScUtilityBar], html });
const text = (el: Element) => el.textContent!.replace(/\s+/g, ' ').trim();

describe('sc-utility-bar (spec)', () => {
  it('renders a navigation labelled "Help and feedback" with four labelled links, icons hidden', async () => {
    const page = await render(ALL);
    const root = page.root!.shadowRoot!;
    const nav = root.querySelector('nav')!;
    expect(root.getElementById(nav.getAttribute('aria-labelledby')!)!.textContent).toBe('Help and feedback');
    const links = Array.from(root.querySelectorAll('a'));
    expect(links.map((a) => [a.getAttribute('href'), text(a)])).toEqual([
      ['/happiness', 'Happiness Meter'],
      ['tel:04', 'Contact and complaints 04'],
      ['/chat', 'Chat'],
      ['/accessibility', 'Accessibility'],
    ]);
    links.forEach((a) => expect(a.querySelector('svg')!.getAttribute('aria-hidden')).toBe('true'));
    expect(root.querySelector('bdi')!.getAttribute('dir')).toBe('ltr');
  });

  it('only renders items that have an href', async () => {
    const page = await render(`<sc-utility-bar chat-href="/chat"></sc-utility-bar>`);
    expect(page.root!.shadowRoot!.querySelectorAll('a').length).toBe(1);
  });

  it('uses Arabic strings', async () => {
    const page = await render(`<div lang="ar">${ALL}</div>`);
    const root = page.body.querySelector('sc-utility-bar')!.shadowRoot!;
    expect(root.querySelector('h2')!.textContent).toBe('المساعدة والملاحظات');
    expect(text(root.querySelectorAll('a')[1])).toBe('التواصل والشكاوى 04');
  });
});
