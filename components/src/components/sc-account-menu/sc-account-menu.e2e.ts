import { E2EPage } from '@stencil/core/testing';
import { describeAxe, expectNoAxeViolations } from '../../test/axe';
import { contexts, newScPage, setPageContext } from '../../test/page';

const MENU = `<div style="display:flex;justify-content:flex-end;padding:16px">
  <sc-account-menu name="Sara Al Mansoori" acting-for="Al Mansoori Trading LLC" profile-href="#profile" settings-href="#settings"
    representation-href="#act-for" notifications-href="#notifications" unread="3"></sc-account-menu></div>
  <p><a id="after" href="#after">After</a></p>`;

function inRoot<T = unknown>(page: E2EPage, expr: string): Promise<T> {
  return page.evaluate((e: string) => {
    const root = document.querySelector('sc-account-menu')!.shadowRoot!;
    // eslint-disable-next-line no-new-func
    return new Function('root', `return (${e});`)(root);
  }, expr) as Promise<T>;
}

const focused = (page: E2EPage) => inRoot<string>(page, 'root.activeElement ? root.activeElement.className.split(" ")[0] + ":" + root.activeElement.textContent.trim() : ""');

describe('sc-account-menu (e2e)', () => {
  it('Tab reaches notifications then the account button; Enter opens the panel instantly; Escape closes and returns focus', async () => {
    const page = await newScPage(MENU);
    await page.setViewport({ width: 1280, height: 800 });
    await page.keyboard.press('Tab');
    expect(await focused(page)).toMatch(/^notifications:/);
    await page.keyboard.press('Tab');
    expect(await focused(page)).toMatch(/^trigger:/);
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(await inRoot(page, 'root.querySelector(".trigger").getAttribute("aria-expanded")')).toBe('true');
    expect(await inRoot(page, 'root.querySelector(".panel").getAnimations().length')).toBe(0);
    await page.keyboard.press('Tab');
    expect(await focused(page)).toBe('item:Profile');
    await page.keyboard.press('Escape');
    await page.waitForChanges();
    expect(await inRoot(page, 'root.querySelector(".panel").hidden')).toBe(true);
    expect(await focused(page)).toMatch(/^trigger:/);
  });

  it('closes when focus leaves, and on a press outside', async () => {
    const page = await newScPage(MENU);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(await inRoot(page, 'root.querySelector(".trigger").getAttribute("aria-expanded")')).toBe('true');
    await page.evaluate(() => document.getElementById('after')!.focus());
    await page.waitForChanges();
    expect(await inRoot(page, 'root.querySelector(".trigger").getAttribute("aria-expanded")')).toBe('false');
    await page.click('sc-account-menu >>> .trigger');
    await page.waitForChanges();
    expect(await inRoot(page, 'root.querySelector(".trigger").getAttribute("aria-expanded")')).toBe('true');
    await page.mouse.click(5, 300);
    await page.waitForChanges();
    expect(await inRoot(page, 'root.querySelector(".trigger").getAttribute("aria-expanded")')).toBe('false');
  });

  it('shows the name from 1280px only, keeps 44px+ targets, and aligns the panel to the inline-end edge in both directions', async () => {
    const page = await newScPage(MENU);
    await page.setViewport({ width: 1280, height: 800 });
    expect(await inRoot(page, 'root.querySelector(".name").getBoundingClientRect().width > 50')).toBe(true);
    await page.setViewport({ width: 1100, height: 800 });
    expect(await inRoot(page, 'root.querySelector(".name").getBoundingClientRect().width')).toBeLessThanOrEqual(1);
    const sizes = await inRoot<number[]>(page, '[".notifications", ".trigger"].map((s) => Math.round(root.querySelector(s).getBoundingClientRect().height))');
    expect(sizes).toEqual([44, 48]);
    for (const lang of ['en', 'ar'] as const) {
      await setPageContext(page, { lang });
      await page.evaluate(() => (document.querySelector('sc-account-menu') as HTMLElement & { open(): Promise<void> }).open());
      await page.waitForChanges();
      const [t, p] = await inRoot<number[][]>(page, '[".trigger", ".panel"].map((s) => { const r = root.querySelector(s).getBoundingClientRect(); return [Math.round(r.left), Math.round(r.right)]; })');
      if (lang === 'en') expect(p[1]).toBe(t[1]);
      else expect(p[0]).toBe(t[0]);
      await page.evaluate(() => (document.querySelector('sc-account-menu') as HTMLElement & { close(): Promise<void> }).close());
      await page.waitForChanges();
    }
  });

  it('paints the badge in channel-action with its on colour', async () => {
    const page = await newScPage(MENU);
    const [bg, fg] = await inRoot<string[]>(page, '(() => { const s = getComputedStyle(root.querySelector(".badge")); return [s.backgroundColor, s.color]; })()');
    const probe = await page.evaluate(() => {
      const i = document.createElement('i');
      i.style.cssText = 'background-color: var(--sc-color-channel-action); color: var(--sc-color-channel-on-action)';
      document.body.append(i);
      const s = getComputedStyle(i);
      return [s.backgroundColor, s.color];
    });
    expect([bg, fg]).toEqual(probe);
  });

  it('has no axe violations with the panel open', async () => {
    for (const ctx of contexts) {
      const page = await newScPage(MENU, ctx);
      await page.evaluate(() => (document.querySelector('sc-account-menu') as HTMLElement & { open(): Promise<void> }).open());
      await page.waitForChanges();
      await expectNoAxeViolations(page);
    }
  });

  it('paints the initials in channel-action on channel-container, and pads the trigger 6 and 12', async () => {
    const page = await newScPage(MENU);
    const look = await inRoot<string[]>(page, '(() => { const a = getComputedStyle(root.querySelector(".avatar")); const t = getComputedStyle(root.querySelector(".trigger")); return [a.color, a.backgroundColor, t.paddingInlineStart, t.paddingInlineEnd]; })()');
    const colour = (n: string) =>
      page.evaluate((v: string) => {
        const i = document.createElement('i');
        i.style.color = `var(${v})`;
        document.body.append(i);
        return getComputedStyle(i).color;
      }, n);
    expect(look[0]).toBe(await colour('--sc-color-channel-action'));
    expect(look[1]).toBe(await colour('--sc-color-channel-container'));
    expect(look.slice(2)).toEqual(['6px', '12px']);
  });
});

describeAxe('sc-account-menu', MENU);
