import { E2EPage } from '@stencil/core/testing';
import { describeAxe, expectNoAxeViolations } from '../../test/axe';
import { siteHeader } from '../../test/chrome';
import { contexts, newScPage, setPageContext } from '../../test/page';

/** Evaluates `expr` with `root`, the header's shadow root. */
function inRoot<T = unknown>(page: E2EPage, expr: string, sel = 'sc-site-header'): Promise<T> {
  return page.evaluate(
    (s: string, e: string) => {
      const root = document.querySelector(s)!.shadowRoot!;
      // eslint-disable-next-line no-new-func
      return new Function('root', `return (${e});`)(root);
    },
    sel,
    expr,
  ) as Promise<T>;
}

const token = (page: E2EPage, name: string) =>
  page.evaluate((n: string) => {
    const probe = document.createElement('i');
    probe.style.setProperty('color', `var(${n})`);
    document.body.append(probe);
    const v = getComputedStyle(probe).color;
    probe.remove();
    return v;
  }, name);

const activeName = (page: E2EPage) =>
  page.evaluate(() => {
    let el: Element | null = document.activeElement;
    while (el?.shadowRoot?.activeElement) el = el.shadowRoot.activeElement;
    return el ? `${el.localName}${el.className ? '.' + String(el.className).split(' ')[0] : ''}` : '';
  });

async function desktop(page: E2EPage) {
  await page.setViewport({ width: 1440, height: 800 });
  await page.waitForChanges();
}

async function phone(page: E2EPage) {
  await page.setViewport({ width: 390, height: 800 });
  await page.waitForFunction(() => !!document.querySelector('sc-site-header')!.shadowRoot!.querySelector('.menu-button'));
}

describe('sc-site-header (e2e)', () => {
  it('lays out lockup, navigation, search, language, account and switcher from inline-start, mirrored in Arabic (CHR-01)', async () => {
    // Signed in, so the long Arabic UAE PASS placeholder label does not push the row into the
    // compact fallback (that case has its own test below).
    const page = await newScPage(siteHeader('en', { signedIn: true }));
    await desktop(page);
    const xs = () =>
      page.evaluate(() => {
        const host = document.querySelector('sc-site-header')!;
        const root = host.shadowRoot!;
        const x = (el: Element | null) => Math.round(el!.getBoundingClientRect().left);
        return [
          x(host.querySelector('[slot="lockup"]')),
          x(host.querySelector('[slot="nav"]')),
          x(root.querySelector('header a.icon-button')),
          x(host.querySelector('[slot="language"]')),
          x(host.querySelector('[slot="account"]')),
          x(host.querySelector('[slot="switcher"]')),
        ];
      });
    const ltr = await xs();
    expect([...ltr].sort((a, b) => a - b)).toEqual(ltr);
    await setPageContext(page, { lang: 'ar' });
    await page.waitForChanges();
    const rtl = await xs();
    expect([...rtl].sort((a, b) => b - a)).toEqual(rtl);
  });

  it('is an 80px flat surface bar with a 1px outline-variant rule, and a banner with a "Main" navigation', async () => {
    const page = await newScPage(siteHeader('en'));
    await desktop(page);
    expect(await inRoot(page, 'Math.round(root.querySelector("header").getBoundingClientRect().height)')).toBe(81);
    expect(await inRoot(page, 'getComputedStyle(root.querySelector("header")).backgroundColor')).toBe(await token(page, '--sc-color-surface'));
    expect(await inRoot(page, 'getComputedStyle(root.querySelector("header")).borderBottomColor')).toBe(await token(page, '--sc-color-outline-variant'));
    expect(await inRoot(page, 'getComputedStyle(root.querySelector("header")).boxShadow')).toBe('none');
    const tree = JSON.stringify(await page.accessibility.snapshot());
    expect(tree).toContain('"role":"banner"');
    expect(tree).toMatch(/"role":"navigation"[^{}]*"name":"Main"/);
  });

  it('marks the current item with a 3px channel-action bar, Bold and aria-current, and keeps 44px targets', async () => {
    const page = await newScPage(siteHeader('en'));
    await desktop(page);
    const current = await page.evaluate(() => {
      const a = document.querySelector('a[slot="nav"][aria-current="page"]')!;
      const s = getComputedStyle(a);
      return [s.borderBottomWidth, s.borderBottomColor, s.color, s.fontWeight, Math.round(a.getBoundingClientRect().height)];
    });
    const action = await token(page, '--sc-color-channel-action');
    expect(current).toEqual(['3px', action, action, '700', 80]);
    const other = await page.evaluate(() => getComputedStyle(document.querySelector('a[slot="nav"]:not([aria-current])')!).fontWeight);
    expect(other).toBe('500');
    const targets = await inRoot<number[]>(page, '[root.querySelector("header a.icon-button"), root.querySelector("[data-placeholder]")].map((e) => Math.round(e.getBoundingClientRect().height))');
    expect(Math.min(...targets)).toBeGreaterThanOrEqual(44);
  });

  it('renders sign in as the UAE PASS placeholder (U3a): black, white label, 56px, the same on every channel and theme', async () => {
    const page = await newScPage(siteHeader('en'));
    await desktop(page);
    const look = () => inRoot<string[]>(page, '(() => { const s = getComputedStyle(root.querySelector("[data-placeholder=uaepass]")); return [s.backgroundColor, s.color, s.height]; })()');
    const light = await look();
    expect(light[2]).toBe('56px');
    expect(light[0]).not.toBe(await token(page, '--sc-color-primary'));
    await setPageContext(page, { channel: 'visit', theme: 'dark' });
    expect(await look()).toEqual(light);
  });

  it('replaces sign in with the account menu once signed in', async () => {
    const page = await newScPage(siteHeader('en', { signedIn: true }));
    await desktop(page);
    expect(await inRoot(page, 'root.querySelector("[data-placeholder]")')).toBeNull();
    expect(await page.evaluate(() => document.querySelector('sc-account-menu')!.getBoundingClientRect().width > 0)).toBe(true);
  });

  it('Tab follows the visual order: lockup, navigation, search, language, sign in, switcher', async () => {
    const page = await newScPage(siteHeader('en'));
    await desktop(page);
    const seen: string[] = [];
    for (let i = 0; i < 9; i++) {
      await page.keyboard.press('Tab');
      seen.push(await activeName(page));
    }
    expect(seen).toEqual([
      'a',
      'a',
      'a',
      'a',
      'a',
      'a.icon-button',
      'a.control',
      'a.uaepass',
      'button.sc-channel-switcher__trigger',
    ]);
  });

  describe('compact (below 1024px, CHR-04)', () => {
    it('keeps the menu button, lockup, language and switcher in a 64px row; navigation, search and sign in move to the menu', async () => {
      const page = await newScPage(siteHeader('en'));
      await phone(page);
      expect(await inRoot(page, 'Math.round(root.querySelector("header").getBoundingClientRect().height)')).toBe(65);
      expect(await inRoot(page, 'root.querySelector("header nav")')).toBeNull();
      expect(await inRoot(page, 'root.querySelector("header [data-placeholder]")')).toBeNull();
      const button = await inRoot<string[]>(page, '["aria-expanded", "aria-haspopup", "aria-controls"].map((a) => root.querySelector(".menu-button").getAttribute(a))');
      expect(button).toEqual(['false', 'dialog', 'menu']);
      expect(await inRoot(page, 'root.querySelector(".menu-button").textContent')).toBe('Menu');
      // Nothing in the row overflows a 390px screen.
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    });

    it('opens a modal menu from the keyboard: focus on close, page inert, Escape closes and returns focus', async () => {
      const page = await newScPage(`${siteHeader('en')}<p><a id="behind" href="#x">Behind</a></p>`);
      await phone(page);
      await page.keyboard.press('Tab');
      expect(await activeName(page)).toBe('button.icon-button');
      await page.keyboard.press('Enter');
      await page.waitForChanges();
      expect(await inRoot(page, 'root.querySelector("dialog").open && root.querySelector("dialog").matches(":modal")')).toBe(true);
      expect(await inRoot(page, 'root.querySelector(".menu-button").getAttribute("aria-expanded")')).toBe('true');
      expect(await inRoot(page, 'root.activeElement === root.querySelector(".menu-head .icon-button")')).toBe(true);
      // Keyboard: no animation (MOT-02).
      expect(await inRoot(page, 'root.querySelector("dialog").getAnimations().length')).toBe(0);
      // The menu holds search, the navigation, sign in and the language switch.
      const inside = await inRoot<string[]>(page, 'Array.from(root.querySelectorAll("dialog slot")).map((s) => s.name)');
      expect(inside).toEqual(['language', 'nav']);
      expect(await inRoot(page, '!!root.querySelector("dialog .menu-search") && !!root.querySelector("dialog [data-placeholder]")')).toBe(true);
      const navVisible = await page.evaluate(() => document.querySelector('a[slot="nav"]')!.getBoundingClientRect().height);
      expect(navVisible).toBeGreaterThanOrEqual(56);
      // Tab stays in the dialog; the page behind is inert.
      for (let i = 0; i < 12; i++) await page.keyboard.press('Tab');
      expect(await page.evaluate(() => document.activeElement!.id)).not.toBe('behind');
      await page.keyboard.press('Escape');
      await page.waitForChanges();
      expect(await inRoot(page, 'root.querySelector("dialog").open')).toBe(false);
      expect(await inRoot(page, 'root.querySelector(".menu-button").getAttribute("aria-expanded")')).toBe('false');
      expect(await activeName(page)).toBe('button.icon-button');
    });

    it('the close button closes it, and a navigation link inside closes it', async () => {
      const page = await newScPage(siteHeader('en'));
      await phone(page);
      await inRoot(page, 'root.querySelector(".menu-button").click()');
      await page.waitForChanges();
      await inRoot(page, 'root.querySelector(".menu-head .icon-button").click()');
      await page.waitForFunction(() => !document.querySelector('sc-site-header')!.shadowRoot!.querySelector('dialog')!.open);
      await page.evaluate(() => (document.querySelector('sc-site-header') as HTMLElement & { openMenu(): Promise<void> }).openMenu());
      await page.waitForChanges();
      await page.evaluate(() => (document.querySelector('a[slot="nav"][href="#services"]') as HTMLElement).click());
      await page.waitForChanges();
      expect(await inRoot(page, 'root.querySelector("dialog").open')).toBe(false);
    });

    it('a pointer opens the menu with a short rise and fade (MOT-01)', async () => {
      const page = await newScPage(siteHeader('en'));
      await phone(page);
      await page.click('sc-site-header >>> .menu-button');
      expect(await inRoot(page, 'root.querySelector("dialog").getAnimations().length')).toBe(1);
    });

    it('marks the current row with an inline-start bar, and mirrors in Arabic', async () => {
      const page = await newScPage(siteHeader('ar'), { lang: 'ar' });
      await phone(page);
      await page.evaluate(() => (document.querySelector('sc-site-header') as HTMLElement & { openMenu(): Promise<void> }).openMenu());
      await page.waitForChanges();
      const row = await page.evaluate(() => {
        const s = getComputedStyle(document.querySelector('a[slot="nav"][aria-current="page"]')!);
        return [s.borderRightWidth, s.borderRightColor];
      });
      expect(row).toEqual(['3px', await token(page, '--sc-color-channel-action')]);
      expect(await inRoot(page, 'root.querySelector("#menu-title").textContent')).toBe('القائمة');
    });
  });

  it('falls back to the compact row when the full row does not fit (1024px, Arabic)', async () => {
    const page = await newScPage(siteHeader('ar'), { lang: 'ar' });
    await page.setViewport({ width: 1024, height: 800 });
    await page.waitForChanges();
    await page.waitForChanges();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(1024);
    const nav = await inRoot<boolean>(page, '(() => { const n = root.querySelector("header nav"); return !n || n.scrollWidth <= n.clientWidth + 1; })()');
    expect(nav).toBe(true);
  });

  it('is sticky only with sticky', async () => {
    const page = await newScPage(siteHeader('en', { attrs: 'sticky' }));
    expect(await page.evaluate(() => getComputedStyle(document.querySelector('sc-site-header')!).position)).toBe('sticky');
  });

  it('has no axe violations with the menu open', async () => {
    for (const ctx of contexts) {
      const page = await newScPage(siteHeader(ctx.lang), ctx);
      await phone(page);
      await page.evaluate(() => (document.querySelector('sc-site-header') as HTMLElement & { openMenu(): Promise<void> }).openMenu());
      await page.waitForChanges();
      await expectNoAxeViolations(page);
    }
  });

  it('spaces the row as the board at 1440: 56 from the lockup to the navigation, 36 between items, 24 between end controls', async () => {
    const page = await newScPage(siteHeader('en'));
    await desktop(page);
    const gaps = await page.evaluate(() => {
      const h = document.querySelector('sc-site-header')!;
      const lockup = h.shadowRoot!.querySelector('.lockup')!.getBoundingClientRect();
      const nav = Array.from(h.querySelectorAll('a[slot="nav"]')).map((a) => a.getBoundingClientRect());
      const end = Array.from(h.shadowRoot!.querySelector('.end')!.children).map((e) => e.getBoundingClientRect());
      return [Math.round(nav[0].left - lockup.right), Math.round(nav[1].left - nav[0].right), Math.round(end[1].left - end[0].right)];
    });
    expect(gaps).toEqual([56, 36, 24]);
  });
});

describeAxe('sc-site-header', `${siteHeader('en')}${siteHeader('en', { signedIn: true })}`);
