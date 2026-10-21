import { newSpecPage } from '@stencil/core/testing';
import { ScChannelChip } from './sc-channel-chip';

const chip = (el: Element) => el.shadowRoot!.querySelector('[part="chip"]')!;

describe('sc-channel-chip (spec)', () => {
  it.each([
    ['now', 'Also on Dubai Now'],
    ['transport', 'Also on Dubai Transport'],
    ['visit', 'Also on Visit Dubai'],
    ['justice', 'Also on Dubai Justice'],
    ['build', 'Also on Build in Dubai'],
    ['invest', 'Also on Invest in Dubai'],
    ['trade', 'Also on Dubai Trade'],
  ])('sets data-channel="%s" on itself and names the channel', async (channel, text) => {
    const page = await newSpecPage({ components: [ScChannelChip], html: `<sc-channel-chip channel="${channel}"></sc-channel-chip>` });
    expect(page.root!.getAttribute('data-channel')).toBe(channel);
    expect(chip(page.root!).textContent).toBe(text);
    expect(chip(page.root!).tagName).toBe('SPAN');
  });

  it('renders a link with an end chevron when href is set', async () => {
    const page = await newSpecPage({ components: [ScChannelChip], html: `<sc-channel-chip channel="transport" href="/transport/renew"></sc-channel-chip>` });
    const a = chip(page.root!);
    expect(a.tagName).toBe('A');
    expect(a.getAttribute('href')).toBe('/transport/renew');
    expect(a).toHaveClass('focus-ring');
    expect(a.querySelector('svg.icon-directional')).not.toBeNull();
  });

  it('updates data-channel when the channel changes, and drops it for an unknown channel', async () => {
    const page = await newSpecPage({ components: [ScChannelChip], html: `<sc-channel-chip channel="visit"></sc-channel-chip>` });
    page.root!.setAttribute('channel', 'trade');
    await page.waitForChanges();
    expect(page.root!.getAttribute('data-channel')).toBe('trade');
    page.root!.setAttribute('channel', 'mars');
    await page.waitForChanges();
    expect(page.root!.hasAttribute('data-channel')).toBe(false);
  });

  it('uses Arabic strings and the label override', async () => {
    const page = await newSpecPage({
      components: [ScChannelChip],
      html: `<div lang="ar"><sc-channel-chip channel="transport"></sc-channel-chip></div><sc-channel-chip channel="invest" label="Start on Invest in Dubai"></sc-channel-chip>`,
    });
    const [ar, custom] = Array.from(page.body.querySelectorAll('sc-channel-chip'));
    expect(chip(ar).textContent).toBe('متوفر أيضًا في مواصلات دبي');
    expect(chip(custom).textContent).toBe('Start on Invest in Dubai');
  });
});

describe('sc-channel-chip variants (spec)', () => {
  it('is subtle by default and outlined on request', async () => {
    const page = await newSpecPage({ components: [ScChannelChip], html: `<sc-channel-chip channel="visit"></sc-channel-chip><sc-channel-chip id="o" channel="visit" variant="outlined"></sc-channel-chip>` });
    expect(chip(page.body.querySelector('sc-channel-chip')!)).not.toHaveClass('chip--outlined');
    expect(chip(page.body.querySelector('#o')!)).toHaveClass('chip--outlined');
  });
});
