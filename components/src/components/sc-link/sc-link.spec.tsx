import { newSpecPage } from '@stencil/core/testing';
import { ScLink } from './sc-link';

const control = (root: HTMLElement) => root.shadowRoot!.querySelector('[part="control"]') as HTMLAnchorElement;

describe('sc-link (spec)', () => {
  it('renders an inline link with the href and the label slot', async () => {
    const page = await newSpecPage({ components: [ScLink], html: `<p>Read the <sc-link href="/fees">fees guide</sc-link>.</p>` });
    const a = control(page.body.querySelector('sc-link')!);
    expect(a.tagName).toBe('A');
    expect(a.getAttribute('href')).toBe('/fees');
    expect(a).toHaveClasses(['link', 'focus-ring']);
    expect(a).not.toHaveClass('link--standalone');
    expect(a.hasAttribute('target')).toBe(false);
    expect(a.querySelector('[part="label"] slot')).not.toBeNull();
    expect(a.querySelector('svg')).toBeNull();
  });

  it('opens external links in a new tab with an icon and hidden text', async () => {
    const page = await newSpecPage({ components: [ScLink], html: `<sc-link href="https://rta.ae" external>RTA website</sc-link>` });
    const a = control(page.root!);
    expect(a.getAttribute('target')).toBe('_blank');
    expect(a.getAttribute('rel')).toBe('noopener noreferrer');
    expect(a.querySelector('[part="icon"] svg.icon-directional')).not.toBeNull();
    expect(a.querySelector('.visually-hidden')!.textContent!.trim()).toBe('(opens in new tab)');
  });

  it('uses Arabic for the external text, and lets external-text override it', async () => {
    const page = await newSpecPage({ components: [ScLink], html: `<div lang="ar" dir="rtl"><sc-link href="https://rta.ae" external>موقع الهيئة</sc-link></div>` });
    expect(control(page.body.querySelector('sc-link')!).querySelector('.visually-hidden')!.textContent!.trim()).toBe('(يفتح في علامة تبويب جديدة)');

    const custom = await newSpecPage({ components: [ScLink], html: `<sc-link href="/a.pdf" external external-text="(PDF, opens in new tab)">Fees</sc-link>` });
    expect(control(custom.root!).querySelector('.visually-hidden')!.textContent!.trim()).toBe('(PDF, opens in new tab)');
  });

  it('adds a directional chevron and the label-m role when standalone', async () => {
    const page = await newSpecPage({ components: [ScLink], html: `<sc-link href="/services" standalone>View all services</sc-link>` });
    const a = control(page.root!);
    expect(a).toHaveClasses(['link--standalone', 'type-label-m']);
    expect(a.querySelector('[part="icon"] svg.icon-directional')).not.toBeNull();
    expect(page.root).toEqualAttributes({ href: '/services', standalone: '' });
  });

  it('shows only the external icon when standalone and external', async () => {
    const page = await newSpecPage({ components: [ScLink], html: `<sc-link href="https://rta.ae" standalone external>RTA</sc-link>` });
    expect(control(page.root!).querySelectorAll('svg').length).toBe(1);
  });

  it('passes hreflang and download through', async () => {
    const page = await newSpecPage({ components: [ScLink], html: `<sc-link href="/ar/fees" hreflang="ar" download="fees.pdf">Fees</sc-link>` });
    const a = control(page.root!);
    expect(a.getAttribute('hreflang')).toBe('ar');
    expect(a.getAttribute('download')).toBe('fees.pdf');
  });
});
