import { newSpecPage } from '@stencil/core/testing';
import { ScFooter } from './sc-footer';

describe('sc-footer (spec)', () => {
  it('renders a footer with a hidden heading, a list of the standard links and the government line', async () => {
    const page = await newSpecPage({
      components: [ScFooter],
      html: `<sc-footer help-href="/help" accessibility-href="/a11y" privacy-href="/privacy" terms-href="/terms"></sc-footer>`,
    });
    const root = page.root!.shadowRoot!;
    expect(root.querySelector('footer')).not.toBeNull();
    expect(root.querySelector('h2.visually-hidden')!.textContent).toBe('Support links');
    const links = Array.from(root.querySelectorAll('ul > li > a'));
    expect(links.map((a) => a.textContent)).toEqual(['Help and contact', 'Accessibility', 'Privacy', 'Terms']);
    expect(links.map((a) => a.getAttribute('href'))).toEqual(['/help', '/a11y', '/privacy', '/terms']);
    expect(root.querySelector('[part="meta"] slot')!.textContent).toBe('Government of Dubai');
  });

  it('only renders standard links that have an href', async () => {
    const page = await newSpecPage({ components: [ScFooter], html: `<sc-footer privacy-href="/privacy"></sc-footer>` });
    expect(page.root!.shadowRoot!.querySelectorAll('li').length).toBe(1);
  });

  it('gives each slotted link its own list item', async () => {
    const page = await newSpecPage({ components: [ScFooter], html: `<sc-footer help-href="/help"><a href="/cookies">Cookies</a><a href="/feedback">Give feedback</a></sc-footer>` });
    const extra = Array.from(page.root!.querySelectorAll('a'));
    expect(extra.map((a) => a.getAttribute('slot'))).toEqual(['link-0', 'link-1']);
    expect(page.root!.shadowRoot!.querySelectorAll('li').length).toBe(3);
    expect(page.root!.shadowRoot!.querySelector('li slot[name="link-1"]')).not.toBeNull();
  });

  it('uses Arabic strings', async () => {
    const page = await newSpecPage({ components: [ScFooter], html: `<div lang="ar"><sc-footer help-href="/help"></sc-footer></div>` });
    const root = page.body.querySelector('sc-footer')!.shadowRoot!;
    expect(root.querySelector('li a')!.textContent).toBe('المساعدة والتواصل');
    expect(root.querySelector('[part="meta"] slot')!.textContent).toBe('حكومة دبي');
  });
});
