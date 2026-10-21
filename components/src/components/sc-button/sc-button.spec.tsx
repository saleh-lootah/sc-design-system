import { newSpecPage } from '@stencil/core/testing';
import { ScButton } from './sc-button';

/** The native control sc-button renders into its own light DOM. */
const control = (root: HTMLElement) => root.querySelector('.sc-button') as HTMLElement;
const render = (html: string) => newSpecPage({ components: [ScButton], html });
/** The visually hidden "Loading" word inside the control. */
const hiddenText = (el: HTMLElement) => Array.from(el.children).find((c) => c.classList.contains('visually-hidden'))?.textContent;

describe('sc-button (spec)', () => {
  it('renders a native button in light DOM, with no shadow root', async () => {
    const page = await render(`<sc-button>Continue</sc-button>`);
    expect(page.root!.shadowRoot).toBeNull();
    const el = control(page.root!);
    expect(el.tagName).toBe('BUTTON');
    expect(el.getAttribute('type')).toBe('button');
    expect(el.querySelector('.sc-button__label')!.textContent).toBe('Continue');
  });

  it.each([
    ['primary', 'l'],
    ['secondary', 'm'],
    ['tertiary', 'm'],
    ['destructive', 'l'],
    ['handoff', 'l'],
  ])('renders the %s variant at its own height (%s)', async (variant, size) => {
    const page = await render(`<sc-button variant="${variant}">Continue</sc-button>`);
    expect(control(page.root!)).toHaveClasses(['sc-button', `sc-button--${variant}`, `sc-button--${size}`, 'focus-ring']);
  });

  it('lets size override the variant height', async () => {
    const page = await render(`<sc-button variant="secondary" size="l">Change</sc-button><sc-button id="x" size="xl">Search</sc-button>`);
    expect(control(page.body.querySelector('sc-button')!)).toHaveClass('sc-button--l');
    expect(control(page.body.querySelector('#x')!)).toHaveClass('sc-button--xl');
  });

  it('falls back to primary for an unknown variant', async () => {
    const page = await render(`<sc-button variant="loud">Continue</sc-button>`);
    expect(control(page.root!)).toHaveClass('sc-button--primary');
  });

  it('passes type, name, value and form to the native button', async () => {
    const page = await render(`<sc-button type="submit" name="action" value="save" form="renewal">Save</sc-button>`);
    const el = control(page.root!);
    expect(el.getAttribute('type')).toBe('submit');
    expect(el.getAttribute('name')).toBe('action');
    expect(el.getAttribute('value')).toBe('save');
    expect(el.getAttribute('form')).toBe('renewal');
  });

  it('renders a link when href is set', async () => {
    const page = await render(`<sc-button href="/renew">Start now</sc-button>`);
    const el = control(page.root!);
    expect(el.tagName).toBe('A');
    expect(el.getAttribute('href')).toBe('/renew');
    expect(page.root!.querySelector('button')).toBeNull();
  });

  it('disables the native button', async () => {
    const page = await render(`<sc-button disabled>Continue</sc-button>`);
    expect(control(page.root!).hasAttribute('disabled')).toBe(true);
  });

  it('removes href and sets aria-disabled on a disabled link', async () => {
    const page = await render(`<sc-button href="/renew" disabled>Start now</sc-button>`);
    const el = control(page.root!);
    expect(el.hasAttribute('href')).toBe(false);
    expect(el.getAttribute('role')).toBe('link');
    expect(el.getAttribute('aria-disabled')).toBe('true');
  });

  it('shows a spinner, sets aria-busy and announces while loading', async () => {
    const page = await render(`<sc-button loading>Pay with Dubai Pay</sc-button>`);
    const el = control(page.root!);
    expect(el.getAttribute('aria-busy')).toBe('true');
    expect(el).toHaveClass('is-loading');
    expect(el.querySelector('.sc-button__spinner svg')).not.toBeNull();
    expect(hiddenText(el)).toBe('Loading');
    expect(page.root!.querySelector('[role="status"]')!.textContent).toBe('Pay with Dubai Pay, Loading');
  });

  it('lets loading-text override the string', async () => {
    const page = await render(`<sc-button loading loading-text="Starting payment">Pay</sc-button>`);
    expect(hiddenText(control(page.root!))).toBe('Starting payment');
  });

  it('uses Arabic strings under lang="ar"', async () => {
    const page = await render(`<div lang="ar"><sc-button loading>ادفع</sc-button></div>`);
    const host = page.body.querySelector('sc-button')!;
    expect(hiddenText(control(host))).toBe('جارٍ التحميل');
    expect(host.querySelector('[role="status"]')!.textContent).toBe('ادفع، جارٍ التحميل');
  });

  it('renders an icon at the end by default, at the start on request', async () => {
    const page = await render(`<sc-button icon="arrow-forward">Continue</sc-button><sc-button id="s" icon="search" icon-position="start">Search</sc-button>`);
    const end = control(page.body.querySelector('sc-button')!);
    expect(end.lastElementChild).toHaveClass('sc-button__icon');
    expect(end.querySelector('svg.icon-directional')).not.toBeNull();
    const start = control(page.body.querySelector('#s')!);
    expect(start.firstElementChild).toHaveClass('sc-button__icon');
  });

  it('renders no icon box without an icon', async () => {
    const page = await render(`<sc-button>Continue</sc-button>`);
    expect(page.root!.querySelector('.sc-button__icon')).toBeNull();
  });
});
