import { E2EPage } from '@stencil/core/testing';
import { describeAxe, expectNoAxeViolations } from '../../test/axe';
import { siteHeader } from '../../test/chrome';
import { contexts, loadFonts, newScPage, noScriptPage, setPageContext } from '../../test/page';
import { PRESSED, keyboardPress, pointerPress, transitions } from '../../test/press';

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
  // Both scripts, so a later switch to Arabic is covered too. Without it, on Linux CI the
  // row overflows in the fallback font at 1440px and stays compact (overflowAt).
  await loadFonts(page);
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

  // R10: Bold is no cue in Arabic, where every nav item is already Bold (D12), so the current
  // item also carries the 3px bar, in both languages.
  it.each(['en', 'ar'] as const)('marks the current item with a non-weight cue, the 3px bar (%s)', async (lang) => {
    // Signed in, so the Arabic row is not pushed into the compact fallback (tested below).
    const page = await newScPage(siteHeader(lang, { signedIn: true }), { lang });
    await desktop(page);
    expect(await inRoot(page, 'getComputedStyle(root.querySelector(".nav")).display')).toBe('flex');
    const [current, other] = await page.evaluate(() =>
      ['a[slot="nav"][aria-current="page"]', 'a[slot="nav"]:not([aria-current])'].map((sel) => {
        const s = getComputedStyle(document.querySelector(sel)!);
        return [s.borderBottomStyle, s.borderBottomWidth, s.borderBottomColor, s.fontWeight];
      }),
    );
    expect(current.slice(0, 3)).toEqual(['solid', '3px', await token(page, '--sc-color-channel-action')]);
    expect(other[2]).toBe('rgba(0, 0, 0, 0)');
    // In Arabic both are Bold: the bar is what tells them apart.
    if (lang === 'ar') expect(other[3]).toBe(current[3]);
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
      // Wait for the close to be handled, not just for the dialog to shut: its close event (which
      // clears the open state) fires a task later and would otherwise land after openMenu().
      await page.waitForFunction(() => {
        const root = document.querySelector('sc-site-header')!.shadowRoot!;
        return !root.querySelector('dialog')!.open && root.querySelector('.menu-button')!.getAttribute('aria-expanded') === 'false';
      });
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

    it('presses the menu button and the menu close button to 0.97 from a pointer, not from the keyboard or under reduced motion (MOT-09)', async () => {
      const SEL = 'sc-site-header >>> .menu-button';
      let page = await newScPage(siteHeader('en'));
      await phone(page);
      expect(await transitions(page, SEL)).toContain('transform 0.15s cubic-bezier(0.23, 1, 0.32, 1)');
      expect(await pointerPress(page, SEL)).toBe(PRESSED);
      expect(await inRoot(page, 'root.querySelector(".menu-button").getAttribute("aria-expanded")')).toBe('false');
      expect(await keyboardPress(page, SEL)).toBe('none');
      // The menu's close button, in a menu opened by pointer (from the keyboard it is focused and :focus-visible).
      page = await newScPage(siteHeader('en'));
      await phone(page);
      await page.click(SEL);
      await page.waitForChanges();
      expect(await pointerPress(page, 'sc-site-header >>> .menu-head .icon-button', 'sc-site-header >>> .menu-head')).toBe(PRESSED);
      page = await newScPage(siteHeader('en'));
      await phone(page);
      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
      expect(await pointerPress(page, SEL)).toBe('none');
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

describe('sc-site-header slots: search and name', () => {
  const SEARCH = '<sc-search slot="search" label="Search Dubai Now" label-hidden action="#search"></sc-search>';
  const NAME = '<a slot="name" href="#home">Dubai Now</a>';
  // Without the sign-in button: beside it, the name and an inline field don't fit in 1280px, and
  // the header takes its compact layout (tested below).
  const withSlots = (lang = 'en', signIn = false) => siteHeader(lang).replace(signIn ? '' : 'sign-in-href="#sign-in"', '').replace('<a slot="nav"', `${NAME}${SEARCH}<a slot="nav"`);

  it('puts an sc-search inline in the row on wide screens, instead of the search link, and keeps the order', async () => {
    const page = await newScPage(withSlots());
    await desktop(page);
    expect(await inRoot(page, 'root.querySelector(".end a.icon-button")')).toBeNull();
    expect(await inRoot(page, 'root.querySelector(".end .search slot").assignedElements()[0].localName')).toBe('sc-search');
    const r = await page.evaluate(() => {
      const box = (s: string) => document.querySelector(s)!.getBoundingClientRect();
      return { search: box('sc-search').left, lastNav: box('a[slot="nav"]:last-of-type').right, language: box('sc-language-switch').left, w: box('sc-search').width, h: box('sc-search').height };
    });
    expect(r.search).toBeGreaterThan(r.lastNav);
    expect(r.search).toBeLessThan(r.language);
    expect(r.w).toBeGreaterThanOrEqual(160);
    expect(r.w).toBeLessThanOrEqual(320);
    expect(r.h).toBeLessThanOrEqual(80);
  });

  it('takes the compact layout when the row cannot hold the field at 160px', async () => {
    const page = await newScPage(withSlots('en', true));
    await desktop(page);
    await page.waitForFunction(() => !!document.querySelector('sc-site-header')!.shadowRoot!.querySelector('.menu-button'));
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(1440);
  });

  it('moves the sc-search to the top of the mobile menu on compact screens', async () => {
    const page = await newScPage(withSlots());
    await phone(page);
    expect(await page.evaluate(() => document.querySelector('sc-search')!.getClientRects().length)).toBe(0);
    await inRoot(page, 'root.querySelector(".menu-button").click()');
    await page.waitForChanges();
    expect(await inRoot(page, 'root.querySelector(".menu-body > .menu-search-field slot").assignedElements()[0].localName')).toBe('sc-search');
    expect(await inRoot(page, 'root.querySelector(".menu-body > :first-child").className')).toBe('menu-search-field');
    expect(await page.evaluate(() => document.querySelector('sc-search')!.getClientRects().length)).toBe(1);
  });

  it('keeps search-href as the search link when the slot is empty', async () => {
    const page = await newScPage(siteHeader('en'));
    await desktop(page);
    expect(await inRoot(page, 'root.querySelector(".end a.icon-button").getAttribute("href")')).toBe('#search');
  });

  it('shows the site name after the lockup, in both layouts, and mirrors in Arabic', async () => {
    for (const lang of ['en', 'ar'] as const) {
      const page = await newScPage(withSlots(lang), { lang });
      await desktop(page);
      const order = () =>
        page.evaluate(() => {
          const x = (s: string) => document.querySelector(s)!.getBoundingClientRect().left;
          return [x('[slot="lockup"]'), x('[slot="name"]'), x('a[slot="nav"]')];
        });
      const wide = await order();
      expect(lang === 'en' ? [...wide].sort((a, b) => a - b) : [...wide].sort((a, b) => b - a)).toEqual(wide);
      expect(await page.evaluate(() => getComputedStyle(document.querySelector('[slot="name"]')!).fontWeight)).toBe('700');
      await phone(page);
      expect(await page.evaluate(() => document.querySelector('[slot="name"]')!.getClientRects().length)).toBe(1);
    }
  });
});

describe('sc-site-header before it upgrades and without JavaScript (PERF-04)', () => {
  it.each(['en', 'ar'] as const)('shows the light-DOM lockup and navigation as one row, the current link underlined in the channel colour (%s)', async (lang) => {
    const page = await noScriptPage(siteHeader(lang), lang);
    const r = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('sc-site-header > a[slot="nav"]'));
      const cur = getComputedStyle(document.querySelector('sc-site-header > [aria-current="page"]')!);
      return {
        visible: links.every((a) => a.getBoundingClientRect().width > 0),
        heights: links.map((a) => Math.round(a.getBoundingClientRect().height)),
        rows: new Set(links.map((a) => Math.round(a.getBoundingClientRect().top))).size,
        bar: [cur.borderBottomWidth, cur.borderBottomStyle, cur.fontWeight],
        search: document.querySelector('sc-site-header > [slot="search"]') === null,
      };
    });
    expect(r.visible).toBe(true);
    for (const h of r.heights) expect(h).toBeGreaterThanOrEqual(44);
    expect(r.rows).toBe(1);
    expect(r.bar).toEqual(['3px', 'solid', '700']);
    await page.close();
  });

  it('with JavaScript, holds its final height while it loads', async () => {
    const page = await newScPage(siteHeader('en'));
    await desktop(page);
    const h = await page.evaluate(() => {
      const el = document.querySelector('sc-site-header')!;
      const upgraded = el.getBoundingClientRect().height;
      el.classList.remove('hydrated');
      const before = getComputedStyle(el);
      const r = [upgraded, parseFloat(before.minHeight), parseFloat(before.maxHeight), before.overflow];
      el.classList.add('hydrated');
      return r;
    });
    expect(h).toEqual([81, 81, 81, 'hidden']);
  });
});

describeAxe('sc-site-header', `${siteHeader('en')}${siteHeader('en', { signedIn: true })}`);
