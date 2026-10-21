import { newSpecPage } from '@stencil/core/testing';
import { ScNotificationList } from './sc-notification-list';

const HTML = (lang = 'en') => `<div lang="${lang}"><sc-notification-list>
  <h2>Today</h2>
  <ul>
    <li data-unread><a href="/a"><strong>Permit approved</strong><span>Ready to download.</span></a><time>09:40</time></li>
    <li><a href="/b"><strong>Fine paid</strong><span>We received AED 600.</span></a><time>08:12</time></li>
  </ul>
</sc-notification-list></div>`;

describe('sc-notification-list (spec)', () => {
  it('adds a hidden "Unread:" to unread items only, in the page language', async () => {
    const page = await newSpecPage({ components: [ScNotificationList], html: HTML() });
    const [a, b] = Array.from(page.body.querySelectorAll('li > a'));
    expect(a.querySelector('.sc-notification-list__unread')!.textContent).toBe('Unread: ');
    expect(a.querySelector('.sc-notification-list__unread')).toHaveClass('visually-hidden');
    expect(b.querySelector('.sc-notification-list__unread')).toBeNull();
    const ar = await newSpecPage({ components: [ScNotificationList], html: HTML('ar') });
    expect(ar.body.querySelector('.sc-notification-list__unread')!.textContent).toBe('غير مقروء: ');
  });

  it('markAllRead() clears the unread state and the hidden word', async () => {
    const page = await newSpecPage({ components: [ScNotificationList], html: HTML() });
    const list = page.body.querySelector('sc-notification-list') as HTMLScNotificationListElement;
    expect(await list.markAllRead()).toBe(1);
    await page.waitForChanges();
    expect(page.body.querySelector('li[data-unread]')).toBeNull();
    expect(page.body.querySelector('.sc-notification-list__unread')).toBeNull();
  });
});
