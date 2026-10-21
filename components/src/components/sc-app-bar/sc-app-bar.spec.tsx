import { newSpecPage } from '@stencil/core/testing';
import { ScAppBar } from './sc-app-bar';

const render = (html: string) => newSpecPage({ components: [ScAppBar], html });

describe('sc-app-bar (spec)', () => {
  it('renders the journey bar as a banner: start, title with a swatch, end', async () => {
    const page = await render(`<sc-app-bar><a slot="start" href="/back">Back</a><span slot="title">Dubai Transport</span><a slot="end" href="/ar">العربية</a></sc-app-bar>`);
    const root = page.root!.shadowRoot!;
    expect(page.root!.getAttribute('role')).toBe('banner');
    expect(Array.from(root.querySelectorAll('[part]')).map((p) => p.getAttribute('part'))).toEqual(['bar', 'start', 'title', 'content', 'end']);
    expect(root.querySelector('.swatch')!.getAttribute('aria-hidden')).toBe('true');
  });

  it('defaults the title to the channel name in the page language', async () => {
    const page = await render(`<div data-channel="transport" lang="ar"><sc-app-bar></sc-app-bar></div>`);
    expect(page.body.querySelector('sc-app-bar')!.shadowRoot!.querySelector('slot[name="title"]')!.textContent).toBe('مواصلات دبي');
  });

  it('drops the landmark role when landmark is false', async () => {
    const page = await render(`<sc-app-bar landmark="false"></sc-app-bar>`);
    expect(page.root!.hasAttribute('role')).toBe(false);
  });

  it('keeps the deprecated align="start" layout and marks empty content', async () => {
    const page = await render(`<sc-app-bar align="start"><nav>Links</nav></sc-app-bar><sc-app-bar id="e"></sc-app-bar>`);
    expect(page.body.querySelector('sc-app-bar')!.shadowRoot!.querySelector('.bar--start')).not.toBeNull();
    expect(page.body.querySelector('sc-app-bar')!.shadowRoot!.querySelector('.content')!.classList.contains('empty')).toBe(false);
    expect(page.body.querySelector('#e')!.shadowRoot!.querySelector('.content')!.classList.contains('empty')).toBe(true);
  });
});
