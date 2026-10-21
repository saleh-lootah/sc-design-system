import { E2EPage } from '@stencil/core/testing';
import { describeAxe } from '../../test/axe';
import { newScPage } from '../../test/page';

const token = (page: E2EPage, name: string) =>
  page.evaluate((n: string) => {
    const i = document.createElement('i');
    i.style.color = `var(${n})`;
    document.body.append(i);
    const c = getComputedStyle(i).color;
    i.remove();
    return c;
  }, name);

const HTML = `<main><h1>Notifications</h1><p>You have 1 unread notification.</p>
<sc-notification-list>
  <h2>Today</h2>
  <ul>
    <li data-unread><a href="#a"><strong>Parking permit approved</strong><span>Your permit for Al Barsha is ready to download.</span></a><time datetime="2026-10-21T09:40">09:40</time></li>
    <li><a href="#b"><strong>Fine paid</strong><span>We received AED 600 for fine F-2026-118204.</span></a><time datetime="2026-10-21T08:12">08:12</time></li>
  </ul>
  <h2>Earlier</h2>
  <ul>
    <li><a href="#c"><strong>Registration renewed</strong><span>Valid until 18 October 2027.</span></a><time datetime="2026-10-12">12 Oct</time></li>
  </ul>
</sc-notification-list></main>`;

const item = (page: E2EPage, i: number, read: string) =>
  page.evaluate(
    (n: number, expr: string) => {
      const li = document.querySelectorAll('sc-notification-list li')[n] as HTMLElement;
      // eslint-disable-next-line no-new-func
      return new Function('li', `return (${expr});`)(li);
    },
    i,
    read,
  );

describe('sc-notification-list (e2e)', () => {
  it('shows unread with a fill, a dot, Bold and words; read items have none of them', async () => {
    const page = await newScPage(HTML);
    expect(await item(page, 0, 'getComputedStyle(li).backgroundColor')).toBe(await token(page, '--sc-color-channel-subtle'));
    expect(await item(page, 0, 'getComputedStyle(li, "::before").backgroundColor')).toBe(await token(page, '--sc-color-channel-action'));
    expect(await item(page, 0, 'getComputedStyle(li.querySelector("strong")).fontWeight')).toBe('700');
    expect(await item(page, 1, 'getComputedStyle(li).backgroundColor')).toBe('rgba(0, 0, 0, 0)');
    expect(await item(page, 1, 'getComputedStyle(li.querySelector("strong")).fontWeight')).toBe('500');
    expect(await item(page, 0, 'li.querySelector("a").textContent')).toBe('Unread: Parking permit approvedYour permit for Al Barsha is ready to download.');
  });

  it('each item is a link at least 44px tall, reached with Tab, in the channel link colour', async () => {
    const page = await newScPage(HTML);
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement!.getAttribute('href'))).toBe('#a');
    expect(await item(page, 0, 'li.querySelector("a").getBoundingClientRect().height >= 44')).toBe(true);
    expect(await item(page, 0, 'getComputedStyle(li.querySelector("strong")).color')).toBe(await token(page, '--sc-color-channel-action'));
  });

  it('sets the body in body-medium on-surface, 2px under the title; the time starts its column (board 8J4-0)', async () => {
    const page = await newScPage(HTML);
    const body = 'getComputedStyle(li.querySelector("a > span:not(.visually-hidden)"))';
    expect(await item(page, 0, `${body}.color`)).toBe(await token(page, '--sc-color-on-surface'));
    expect(await item(page, 0, `${body}.fontSize`)).toBe('16px');
    expect(await item(page, 0, `${body}.lineHeight`)).toBe('24px');
    expect(await item(page, 0, 'getComputedStyle(li.querySelector("a")).rowGap')).toBe('2px');
    expect(await item(page, 0, 'getComputedStyle(li.querySelector("time")).textAlign')).toBe('start');
  });

  it('groups are cards with 12px corners and 1px rules between rows', async () => {
    const page = await newScPage(HTML);
    const ul = await page.$eval('sc-notification-list ul', (el) => [getComputedStyle(el).borderTopLeftRadius, getComputedStyle(el).borderTopWidth]);
    expect(ul).toEqual(['12px', '1px']);
    expect(await item(page, 1, 'getComputedStyle(li).borderTopWidth')).toBe('1px');
  });

  it('markAllRead() fades the fill for a pointer and is instant from the keyboard', async () => {
    const page = await newScPage(HTML);
    expect(await item(page, 0, 'getComputedStyle(li).transitionDuration')).toBe('0.2s');
    await page.keyboard.press('Tab');
    await page.$eval('sc-notification-list', (el: any) => el.markAllRead());
    await page.waitForChanges();
    expect(await item(page, 0, 'getComputedStyle(li).transitionDuration')).toBe('0s');
    expect(await item(page, 0, 'li.hasAttribute("data-unread")')).toBe(false);
  });

  it('puts the time under the body below 600px, and mirrors in Arabic', async () => {
    const page = await newScPage(`<div style="inline-size: 360px">${HTML}</div>`, { lang: 'ar' });
    const r = await item(page, 0, '({ a: { bottom: li.querySelector("a").getBoundingClientRect().bottom }, t: { top: li.querySelector("time").getBoundingClientRect().top } })');
    expect(r.t.top).toBeGreaterThanOrEqual(r.a.bottom);
    expect(await item(page, 0, 'li.getBoundingClientRect().right - li.querySelector("a").getBoundingClientRect().right > 16')).toBe(true);
  });
});

describeAxe('sc-notification-list', HTML);
