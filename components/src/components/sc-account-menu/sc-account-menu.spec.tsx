import { newSpecPage } from '@stencil/core/testing';
import { ScAccountMenu } from './sc-account-menu';

const FULL = `<sc-account-menu name="Sara Al Mansoori" acting-for="Al Mansoori Trading LLC" profile-href="/profile" settings-href="/settings" representation-href="/act-for" notifications-href="/notifications" unread="3"></sc-account-menu>`;
const render = (html: string) => newSpecPage({ components: [ScAccountMenu], html });
const text = (el: Element | null) => el!.textContent!.replace(/\s+/g, ' ').trim();

describe('sc-account-menu (spec)', () => {
  it('renders a disclosure button with initials, named "Account: <name>", and a hidden panel', async () => {
    const page = await render(FULL);
    const root = page.root!.shadowRoot!;
    const trigger = root.querySelector('button.trigger')!;
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('aria-controls')).toBe('panel');
    expect(root.querySelector('.avatar')!.textContent).toBe('SM');
    expect(root.querySelector('.avatar')!.getAttribute('aria-hidden')).toBe('true');
    expect(text(root.querySelector('.name'))).toBe('Account: Sara Al Mansoori');
    expect(root.querySelector('#panel')!.hasAttribute('hidden')).toBe(true);
  });

  it('lists profile, settings and representation, then sign out, with who the user acts for', async () => {
    const page = await render(FULL);
    const root = page.root!.shadowRoot!;
    expect(Array.from(root.querySelectorAll('.list a')).map((a) => [a.getAttribute('href'), text(a)])).toEqual([
      ['/profile', 'Profile'],
      ['/settings', 'Settings'],
      ['/act-for', 'Change who you act for'],
    ]);
    expect(text(root.querySelector('.who-acting'))).toBe('Acting for: Al Mansoori Trading LLC');
    expect(root.querySelector('.divider + button.item')!.textContent).toBe('Sign out');
  });

  it('fires scSignOut from the Sign out button, or links to sign-out-href', async () => {
    const page = await render(FULL);
    const spy = jest.fn();
    page.root!.addEventListener('scSignOut', spy);
    (page.root!.shadowRoot!.querySelector('.divider + button') as HTMLButtonElement).click();
    expect(spy).toHaveBeenCalledTimes(1);
    const linked = await render(`<sc-account-menu name="Sara" sign-out-href="/sign-out"></sc-account-menu>`);
    expect(linked.root!.shadowRoot!.querySelector('.divider + a')!.getAttribute('href')).toBe('/sign-out');
  });

  it('names the notifications button with the unread count, and caps the badge at 99+', async () => {
    const page = await render(FULL);
    const root = page.root!.shadowRoot!;
    expect(text(root.querySelector('.notifications .visually-hidden'))).toBe('Notifications, 3 unread');
    expect(root.querySelector('.badge')!.textContent).toBe('3');
    const many = await render(`<sc-account-menu name="Sara" notifications-href="/n" unread="140"></sc-account-menu>`);
    expect(many.root!.shadowRoot!.querySelector('.badge')!.textContent).toBe('99+');
    const none = await render(`<sc-account-menu name="Sara" notifications-href="/n"></sc-account-menu>`);
    expect(none.root!.shadowRoot!.querySelector('.badge')).toBeNull();
    expect(text(none.root!.shadowRoot!.querySelector('.notifications .visually-hidden'))).toBe('Notifications');
  });

  it('takes initials from the name as written, or from initials', async () => {
    const one = await render(`<sc-account-menu name="  Sara  "></sc-account-menu>`);
    expect(one.root!.shadowRoot!.querySelector('.avatar')!.textContent).toBe('S');
    const own = await render(`<sc-account-menu name="Sara Al Mansoori" initials="SAM"></sc-account-menu>`);
    expect(own.root!.shadowRoot!.querySelector('.avatar')!.textContent).toBe('SAM');
    const ar = await render(`<sc-account-menu name="سارة المنصوري"></sc-account-menu>`);
    expect(ar.root!.shadowRoot!.querySelector('.avatar')!.textContent).toBe('سا');
  });

  it('uses Arabic strings', async () => {
    const page = await render(`<div lang="ar">${FULL}</div>`);
    const root = page.body.querySelector('sc-account-menu')!.shadowRoot!;
    expect(text(root.querySelector('.notifications .visually-hidden'))).toBe('الإشعارات، 3 غير مقروءة');
    expect(root.querySelector('.divider + button')!.textContent).toBe('تسجيل الخروج');
  });
});
