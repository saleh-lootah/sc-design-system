import { newSpecPage } from '@stencil/core/testing';
import { ScChannelNetwork } from './sc-channel-network';

const LINKS = `{"now":"/now/{lang}","transport":"/transport/{lang}","visit":"/visit/{lang}","justice":"/justice/{lang}","build":"/build/{lang}","invest":"/invest/{lang}","trade":"/trade/{lang}"}`;
const render = (html: string) => newSpecPage({ components: [ScChannelNetwork], html });

describe('sc-channel-network (spec)', () => {
  it('renders in light DOM a labelled navigation with the eyebrow and seven tiles in order', async () => {
    const page = await render(`<sc-channel-network channel="now" links='${LINKS}'></sc-channel-network>`);
    expect(page.root!.shadowRoot).toBeNull();
    const nav = page.root!.querySelector('nav')!;
    expect(nav.getAttribute('aria-label')).toBe('Government of Dubai channels');
    expect(nav.querySelector('.sc-channel-network__eyebrow')!.textContent).toBe('One network · seven channels');
    const entries = Array.from(nav.querySelectorAll('li'));
    expect(entries.map((li) => li.getAttribute('data-channel'))).toEqual(['now', 'transport', 'visit', 'justice', 'build', 'invest', 'trade']);
    expect(entries[1].querySelector('a')!.getAttribute('href')).toBe('/transport/en');
    expect(entries[1].querySelector('.sc-channel-network__desc')!.textContent).toBe('Driving, vehicles and roads');
  });

  it('shows the current channel as text that says "You are here", with aria-current', async () => {
    const page = await render(`<sc-channel-network channel="invest" links='${LINKS}'></sc-channel-network>`);
    const current = page.root!.querySelector('[aria-current="true"]')!;
    expect(current.localName).toBe('div');
    expect(current.closest('li')!.getAttribute('data-channel')).toBe('invest');
    expect(current.querySelector('.sc-channel-network__desc')!.textContent).toBe('You are here');
    expect(page.root!.querySelectorAll('li a').length).toBe(6);
  });

  it('takes the channel from the closest data-channel', async () => {
    const page = await render(`<div data-channel="trade"><sc-channel-network links='${LINKS}'></sc-channel-network></div>`);
    expect(page.body.querySelector('[aria-current]')!.closest('li')!.getAttribute('data-channel')).toBe('trade');
  });

  it('uses Arabic strings, and writes the number as a word', async () => {
    const page = await render(`<div lang="ar"><sc-channel-network channel="now" links='${LINKS}'></sc-channel-network></div>`);
    const host = page.body.querySelector('sc-channel-network')!;
    expect(host.querySelector('nav')!.getAttribute('aria-label')).toBe('قنوات حكومة دبي');
    expect(host.querySelector('.sc-channel-network__eyebrow')!.textContent).toBe('شبكة واحدة · سبع قنوات');
    expect(host.querySelector('li[data-channel="visit"] a')!.getAttribute('href')).toBe('/visit/ar');
  });
});
