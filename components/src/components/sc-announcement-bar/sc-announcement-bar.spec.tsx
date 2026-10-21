import { newSpecPage } from '@stencil/core/testing';
import { ScAnnouncementBar } from './sc-announcement-bar';

const render = (html: string) => newSpecPage({ components: [ScAnnouncementBar], html });

describe('sc-announcement-bar (spec)', () => {
  it('renders a labelled region (not a live region or alert) with the tone icon, the message and the link', async () => {
    const page = await render(`<sc-announcement-bar link-href="/status" link-text="See affected services">Planned maintenance on Saturday.</sc-announcement-bar>`);
    const root = page.root!.shadowRoot!;
    const region = root.querySelector('section')!;
    expect(region.getAttribute('aria-label')).toBe('Announcement');
    expect(region.getAttribute('role')).toBeNull();
    expect(region.getAttribute('aria-live')).toBeNull();
    expect(region.classList.contains('bar--warning')).toBe(true);
    expect(root.querySelector('.tone-icon')!.getAttribute('aria-hidden')).toBe('true');
    expect(root.querySelector('a.link')!.getAttribute('href')).toBe('/status');
    expect(root.querySelector('button')).toBeNull();
  });

  it.each(['info', 'error'])('supports the %s tone, and falls back to warning', async (tone) => {
    const page = await render(`<sc-announcement-bar tone="${tone}">x</sc-announcement-bar><sc-announcement-bar id="x" tone="loud">x</sc-announcement-bar>`);
    expect(page.body.querySelector('sc-announcement-bar')!.shadowRoot!.querySelector('section')!.classList.contains(`bar--${tone}`)).toBe(true);
    expect(page.body.querySelector('#x')!.shadowRoot!.querySelector('section')!.classList.contains('bar--warning')).toBe(true);
  });

  it('has a named dismiss button when dismissible, and dismissing hides it and fires scDismiss', async () => {
    const page = await render(`<sc-announcement-bar dismissible announcement-id="m-25-oct">x</sc-announcement-bar>`);
    const button = page.root!.shadowRoot!.querySelector('button')!;
    expect(button.getAttribute('type')).toBe('button');
    expect(button.querySelector('.visually-hidden')!.textContent).toBe('Dismiss announcement');
    const spy = jest.fn();
    page.root!.addEventListener('scDismiss', spy);
    await (page.root as HTMLElement & { dismiss(): Promise<void> }).dismiss();
    await page.waitForChanges();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0].detail).toEqual({ id: 'm-25-oct' });
    expect(page.root!.hasAttribute('hidden')).toBe(true);
  });

  it('stays when scDismiss is prevented', async () => {
    const page = await render(`<sc-announcement-bar dismissible>x</sc-announcement-bar>`);
    page.root!.addEventListener('scDismiss', (e) => e.preventDefault());
    await (page.root as HTMLElement & { dismiss(): Promise<void> }).dismiss();
    await page.waitForChanges();
    expect(page.root!.hasAttribute('hidden')).toBe(false);
  });

  it('uses Arabic strings', async () => {
    const page = await render(`<div lang="ar"><sc-announcement-bar dismissible>x</sc-announcement-bar></div>`);
    const root = page.body.querySelector('sc-announcement-bar')!.shadowRoot!;
    expect(root.querySelector('section')!.getAttribute('aria-label')).toBe('إعلان');
    expect(root.querySelector('button .visually-hidden')!.textContent).toBe('إغلاق الإعلان');
  });
});
