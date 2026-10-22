import { newSpecPage } from '@stencil/core/testing';
import { ScChannelSwitcher } from './sc-channel-switcher';

const LINKS = `{"now":"/now/{lang}/","transport":"/transport/{lang}/","visit":"/visit/{lang}/","justice":"/justice/{lang}/","build":"/build/{lang}/","invest":"/invest/{lang}/","trade":"/trade/{lang}/"}`;
const render = (html: string) => newSpecPage({ components: [ScChannelSwitcher], html });

describe('sc-channel-switcher (spec)', () => {
  it('renders in light DOM: a disclosure button named "Choose a channel: <current>" and a hidden panel', async () => {
    const page = await render(`<sc-channel-switcher channel="transport" links='${LINKS}'></sc-channel-switcher>`);
    expect(page.root!.shadowRoot).toBeNull();
    const button = page.root!.querySelector('button')!;
    expect(button.getAttribute('type')).toBe('button');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    const panel = page.root!.querySelector(`#${button.getAttribute('aria-controls')}`)!;
    expect(panel.hasAttribute('hidden')).toBe(true);
    expect(button.textContent!.replace(/\s+/g, ' ').trim()).toBe('Choose a channel: Dubai Transport');
  });

  it('lists all seven channels in order, each with its own data-channel, name, descriptor and link in the page language', async () => {
    const page = await render(`<sc-channel-switcher channel="transport" links='${LINKS}'></sc-channel-switcher>`);
    const entries = Array.from(page.root!.querySelectorAll('li'));
    expect(entries.map((li) => li.getAttribute('data-channel'))).toEqual(['now', 'transport', 'visit', 'justice', 'build', 'invest', 'trade']);
    expect(entries.map((li) => li.querySelector('a')!.getAttribute('href'))[2]).toBe('/visit/en/');
    expect(entries[0].querySelector('.sc-channel-switcher__item-name')!.textContent).toBe('Dubai Now');
    expect(entries[0].querySelector('.sc-channel-switcher__desc')!.textContent).toBe('Services for everyone who lives in Dubai');
    const list = page.root!.querySelector('ul')!;
    expect(page.root!.querySelector(`#${list.getAttribute('aria-labelledby')}`)!.textContent).toBe('Choose a channel');
  });

  it('marks the current channel with aria-current and a check', async () => {
    const page = await render(`<sc-channel-switcher channel="visit" links='${LINKS}'></sc-channel-switcher>`);
    const current = page.root!.querySelectorAll('[aria-current="true"]');
    expect(current.length).toBe(1);
    expect(current[0].closest('li')!.getAttribute('data-channel')).toBe('visit');
    expect(current[0].querySelector('svg')).not.toBeNull();
  });

  it('takes the channel from the closest data-channel, and lists a channel without a link as text', async () => {
    const page = await render(`<div data-channel="justice"><sc-channel-switcher links='{"now":"/now"}'></sc-channel-switcher></div>`);
    const host = page.body.querySelector('sc-channel-switcher')!;
    expect(host.querySelector('button')!.textContent).toContain('Dubai Justice');
    expect(host.querySelectorAll('li a').length).toBe(1);
    expect(host.querySelectorAll('li span.sc-channel-switcher__item').length).toBe(6);
  });

  it('uses a slotted logo instead of the swatch mark', async () => {
    const page = await render(`<sc-channel-switcher><img alt="" src="logo.svg"></sc-channel-switcher>`);
    expect(page.root!.querySelector('.sc-channel-switcher__logo')!.classList.contains('is-mark')).toBe(false);
  });

  it('opens and closes through its methods', async () => {
    const page = await render(`<sc-channel-switcher></sc-channel-switcher>`);
    await (page.root as HTMLElement & { open(): Promise<void> }).open();
    await page.waitForChanges();
    expect(page.root!.querySelector('button')!.getAttribute('aria-expanded')).toBe('true');
    expect(page.root!.querySelector('.sc-channel-switcher__panel')!.hasAttribute('hidden')).toBe(false);
    await (page.root as HTMLElement & { close(): Promise<void> }).close();
    await page.waitForChanges();
    expect(page.root!.querySelector('button')!.getAttribute('aria-expanded')).toBe('false');
  });

  it('uses Arabic strings and Arabic links', async () => {
    const page = await render(`<div lang="ar"><sc-channel-switcher channel="trade" links='${LINKS}'></sc-channel-switcher></div>`);
    const host = page.body.querySelector('sc-channel-switcher')!;
    expect(host.querySelector('button')!.textContent!.replace(/\s+/g, ' ').trim()).toBe('اختيار القناة: دبي التجارية');
    expect(host.querySelector('li[data-channel="now"] a')!.getAttribute('href')).toBe('/now/ar/');
    expect(host.querySelector('li[data-channel="now"] a')!.getAttribute('hreflang')).toBe('ar');
  });

  it('shows value as the current channel, over channel and data-channel, and reflects it', async () => {
    const page = await render(`<div data-channel="now"><sc-channel-switcher channel="transport" value="trade" links='${LINKS}'></sc-channel-switcher></div>`);
    const host = page.body.querySelector('sc-channel-switcher')!;
    expect(host.querySelector('button')!.textContent!.replace(/\s+/g, ' ').trim()).toBe('Choose a channel: Dubai Trade');
    expect(host.querySelector('li[data-channel="trade"] a')!.getAttribute('aria-current')).toBe('true');
    (host as unknown as { value: string }).value = 'visit';
    await page.waitForChanges();
    expect(host.getAttribute('value')).toBe('visit');
  });
});
