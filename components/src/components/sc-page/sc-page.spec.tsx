import { newSpecPage } from '@stencil/core/testing';
import { ScPage } from './sc-page';

describe('sc-page (spec)', () => {
  it('renders in light DOM: sets dir from its lang and data-channel from channel, and renders main', async () => {
    const page = await newSpecPage({ components: [ScPage], html: `<sc-page lang="ar" channel="transport"><p>Content</p></sc-page>` });
    expect(page.root!.shadowRoot).toBeNull();
    expect(page.root!.getAttribute('dir')).toBe('rtl');
    expect(page.root!.getAttribute('data-channel')).toBe('transport');
    const main = page.root!.querySelector('main')!;
    expect(main.id).toBe('main-content');
    expect(main.getAttribute('tabindex')).toBe('-1');
    expect(main.textContent).toBe('Content');
  });

  it('is left-to-right in English and ignores an unknown channel', async () => {
    const page = await newSpecPage({ components: [ScPage], html: `<sc-page lang="en" channel="mars" main-id="content"></sc-page>` });
    expect(page.root!.getAttribute('dir')).toBe('ltr');
    expect(page.root!.hasAttribute('data-channel')).toBe(false);
    expect(page.root!.querySelector('main')!.id).toBe('content');
  });

  it('takes the direction from an ancestor language', async () => {
    const page = await newSpecPage({ components: [ScPage], html: `<div lang="ar"><sc-page></sc-page></div>` });
    expect(page.body.querySelector('sc-page')!.getAttribute('dir')).toBe('rtl');
  });

  it('copies language, direction and channel to <html> with sync-document', async () => {
    const page = await newSpecPage({ components: [ScPage], html: `<sc-page lang="ar" channel="visit" sync-document></sc-page>` });
    const html = page.doc.documentElement;
    expect(html.getAttribute('lang')).toBe('ar');
    expect(html.getAttribute('dir')).toBe('rtl');
    expect(html.getAttribute('data-channel')).toBe('visit');
  });

  it('leaves <html> alone without sync-document', async () => {
    const page = await newSpecPage({ components: [ScPage], html: `<sc-page lang="ar" channel="visit"></sc-page>` });
    expect(page.doc.documentElement.getAttribute('data-channel')).toBeNull();
  });
});
