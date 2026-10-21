import { newSpecPage } from '@stencil/core/testing';
import { ScSiteHeader } from './sc-site-header';

const render = (html: string) => newSpecPage({ components: [ScSiteHeader], html });

describe('sc-site-header (spec)', () => {
  it('renders a header with the lockup, the main navigation and the end controls, in order', async () => {
    const page = await render(`<sc-site-header sign-in-href="/sign-in" search-href="/search"></sc-site-header>`);
    const root = page.root!.shadowRoot!;
    const header = root.querySelector('header')!;
    expect(header).not.toBeNull();
    const parts = Array.from(header.querySelectorAll('slot, nav, a')).map((n) => n.getAttribute('name') ?? n.getAttribute('data-placeholder') ?? n.localName);
    expect(parts).toEqual(['lockup', 'nav', 'nav', 'a', 'language', 'uaepass', 'switcher']);
    expect(root.querySelector('nav')!.getAttribute('aria-label')).toBe('Main');
  });

  it('renders sign in as the marked UAE PASS placeholder (U3a), not an sc-button, and search as a named icon link', async () => {
    const page = await render(`<sc-site-header sign-in-href="/sign-in" search-href="/search"></sc-site-header>`);
    const root = page.root!.shadowRoot!;
    expect(root.querySelector('sc-button')).toBeNull();
    const signIn = root.querySelector('[data-placeholder="uaepass"]')!;
    expect(signIn.localName).toBe('a');
    expect(signIn.getAttribute('href')).toBe('/sign-in');
    expect(signIn.textContent).toBe('Sign in with UAE PASS');
    expect(signIn.querySelector('svg')!.getAttribute('aria-hidden')).toBe('true');
    const search = root.querySelector('header a')!;
    expect(search.getAttribute('href')).toBe('/search');
    expect(search.querySelector('.visually-hidden')!.textContent).toBe('Search');
    expect(search.querySelector('svg')!.getAttribute('aria-hidden')).toBe('true');
  });

  it('leaves out sign in and search without their hrefs, and lets sign-in-text override the label', async () => {
    const page = await render(`<sc-site-header></sc-site-header><sc-site-header id="b" sign-in-href="/s" sign-in-text="Log in"></sc-site-header>`);
    expect(page.body.querySelector('sc-site-header')!.shadowRoot!.querySelector('header a')).toBeNull();
    expect(page.body.querySelector('#b')!.shadowRoot!.querySelector('[data-placeholder]')!.textContent).toBe('Log in');
  });

  it('uses the official button from slot="signin" instead of the placeholder', async () => {
    const page = await render(`<sc-site-header sign-in-href="/s"><a slot="signin" href="/uaepass">Sign in with UAE PASS</a></sc-site-header>`);
    const root = page.root!.shadowRoot!;
    expect(root.querySelector('[data-placeholder]')).toBeNull();
    expect(root.querySelector('header slot[name="signin"]')).not.toBeNull();
  });

  it('replaces sign in with the account slot once signed in', async () => {
    const page = await render(`<sc-site-header sign-in-href="/sign-in"><span slot="account">Account</span></sc-site-header>`);
    const root = page.root!.shadowRoot!;
    expect(root.querySelector('[data-placeholder]')).toBeNull();
    expect(root.querySelector('header slot[name="account"]')).not.toBeNull();
  });

  it('has the mobile menu dialog, labelled by its title, and no menu button in the full layout', async () => {
    const page = await render(`<sc-site-header></sc-site-header>`);
    const dialog = page.root!.shadowRoot!.querySelector('dialog')!;
    expect(dialog.getAttribute('aria-labelledby')).toBe('menu-title');
    expect(page.root!.shadowRoot!.querySelector('.menu-button')).toBeNull();
  });

  it('uses Arabic strings', async () => {
    const page = await render(`<div lang="ar"><sc-site-header sign-in-href="/s" search-href="/q"></sc-site-header></div>`);
    const root = page.body.querySelector('sc-site-header')!.shadowRoot!;
    expect(root.querySelector('nav')!.getAttribute('aria-label')).toBe('رئيسية');
    expect(root.querySelector('[data-placeholder]')!.textContent).toBe('تسجيل الدخول باستخدام الهوية الرقمية');
    expect(root.querySelector('header a .visually-hidden')!.textContent).toBe('بحث');
  });
});
