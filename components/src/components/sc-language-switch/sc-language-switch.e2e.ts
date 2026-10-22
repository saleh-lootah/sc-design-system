import { E2EPage, newE2EPage } from '@stencil/core/testing';
import type { HTTPRequest, Page as PuppeteerPage } from 'puppeteer';
import { describeAxe, expectNoAxeViolations } from '../../test/axe';
import { newScPage, setPageContext } from '../../test/page';

function inner<T = unknown>(page: E2EPage, selector: string, read: string): Promise<T> {
  return page.evaluate(
    (sel: string, expr: string) => {
      const host = document.querySelector(sel)!;
      const control = host.shadowRoot!.querySelector('[part="control"]') as HTMLElement;
      const name = host.querySelector('[data-sc-language-name]') as HTMLElement;
      // eslint-disable-next-line no-new-func
      return new Function('host', 'control', 'name', `return (${expr});`)(host, control, name);
    },
    selector,
    read,
  ) as Promise<T>;
}

/** The switch as a service writes it for PERF-04: the same link again, in slot="fallback". */
const WITH_FALLBACK = (lang: 'en' | 'ar') =>
  lang === 'ar'
    ? `<sc-language-switch href="/en/renew"><a slot="fallback" href="/en/renew" hreflang="en" lang="en" dir="ltr">English</a></sc-language-switch>`
    : `<sc-language-switch href="/ar/renew"><a slot="fallback" href="/ar/renew" hreflang="ar" lang="ar" dir="rtl">العربية</a></sc-language-switch>`;

/**
 * Opens `html` with sc.css and JavaScript disabled, so no sc- tag is ever defined: what a
 * visitor gets when script fails or is blocked (PERF-04), and what every visitor sees before
 * the upgrade.
 */
async function noScriptPage(html: string, lang = 'en') {
  const e2e = await newE2EPage();
  await e2e.setContent('');
  const origin = new URL(e2e.url()).origin;
  // E2EPage is a Puppeteer page; its type hides browser().
  const page = await (e2e as unknown as PuppeteerPage).browser().newPage();
  await page.setJavaScriptEnabled(false);
  await page.setRequestInterception(true);
  page.on('request', (r: HTTPRequest) =>
    r.url() === `${origin}/no-script.html`
      ? r.respond({ status: 200, contentType: 'text/html', body: `<!doctype html><html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}" data-channel="now"><head><meta charset="utf-8"><link rel="stylesheet" href="/build/sc.css"></head><body><p>${html}</p></body></html>` })
      : r.continue(),
  );
  await page.goto(`${origin}/no-script.html`, { waitUntil: 'load' });
  return page;
}

const token = (page: E2EPage, name: string) =>
  page.evaluate((n: string) => {
    const probe = document.createElement('i');
    probe.style.color = `var(${n})`;
    document.body.append(probe);
    const v = getComputedStyle(probe).color;
    probe.remove();
    return v;
  }, name);

const accessibleName = async (page: E2EPage, sel = 'sc-language-switch') =>
  (await page.accessibility.snapshot({ root: (await page.$(`${sel} >>> [part="control"]`))! }))!.name;

export const ALL_STATES = `
  <main style="padding: 16px">
    <h1>Renew your vehicle registration</h1>
    <sc-language-switch href="#other"></sc-language-switch>
    <sc-language-switch id="btn"></sc-language-switch>
    <sc-language-switch appearance="header" href="#other"></sc-language-switch>
  </main>`;

describe('sc-language-switch (e2e)', () => {
  it('names the other language in its own language and script, with lang and hreflang', async () => {
    const page = await newScPage(`<sc-language-switch href="/ar/renew"></sc-language-switch>`, { lang: 'en' });
    expect(await accessibleName(page)).toBe('العربية');
    expect(await inner(page, 'sc-language-switch', 'control.lang')).toBe('ar');
    expect(await inner(page, 'sc-language-switch', 'control.hreflang')).toBe('ar');
    // The Arabic name takes the Arabic label-medium values on an English page (18/24 Bold).
    expect(await inner(page, 'sc-language-switch', 'getComputedStyle(name).fontSize')).toBe('18px');
    expect(await inner(page, 'sc-language-switch', 'getComputedStyle(name).fontWeight')).toBe('700');
    // In Dubai W23's own face for the two names (fonts.css, "Dubai W23 Name": the same Bold
    // Arabic glyphs, just these letters), so an English page never fetches the Arabic file.
    expect(await inner(page, 'sc-language-switch', 'getComputedStyle(name).fontFamily')).toMatch(/^"Dubai W23 Name"/);

    await setPageContext(page, { lang: 'ar' });
    expect(await accessibleName(page)).toBe('English');
    expect(await inner(page, 'sc-language-switch', 'control.lang')).toBe('en');
    expect(await inner(page, 'sc-language-switch', 'control.hreflang')).toBe('en');
    expect(await inner(page, 'sc-language-switch', 'getComputedStyle(name).fontSize')).toBe('16px');
    expect(await inner(page, 'sc-language-switch', 'getComputedStyle(name).fontWeight')).toBe('500');
    expect(await inner(page, 'sc-language-switch', 'host.children.length')).toBe(1);
  });

  it('inline: an underlined link in the channel action colour; header: globe and on-surface, label-large', async () => {
    const page = await newScPage(`<sc-language-switch id="i" href="#ar"></sc-language-switch><sc-language-switch id="h" appearance="header" href="#ar"></sc-language-switch>`);
    expect(await inner(page, '#i', 'getComputedStyle(control).color')).toBe(await token(page, '--sc-color-channel-action'));
    expect(await inner(page, '#i', 'getComputedStyle(control).textDecorationLine')).toBe('underline');
    expect(await inner(page, '#h', 'getComputedStyle(control).color')).toBe(await token(page, '--sc-color-on-surface'));
    expect(await inner(page, '#h', 'getComputedStyle(control).textDecorationLine')).toBe('none');
    expect(await inner(page, '#h', 'control.querySelector("svg").getBoundingClientRect().width')).toBe(20);
    expect(await inner(page, '#h', 'getComputedStyle(name).fontSize')).toBe('20px');
  });

  it('does not mirror the globe in Arabic', async () => {
    const page = await newScPage(`<sc-language-switch appearance="header" href="#en"></sc-language-switch>`, { lang: 'ar' });
    expect(await inner(page, 'sc-language-switch', 'getComputedStyle(control.querySelector("svg")).transform')).toBe('none');
  });

  it('is a 44px target and follows its link with Enter', async () => {
    const page = await newScPage(`<sc-language-switch href="#ar"></sc-language-switch>`);
    expect(Math.round(await inner(page, 'sc-language-switch', 'control.getBoundingClientRect().height'))).toBe(44);
    await page.keyboard.press('Tab');
    expect(await inner(page, 'sc-language-switch', 'host.shadowRoot.activeElement === control')).toBe(true);
    expect(await inner(page, 'sc-language-switch', 'getComputedStyle(control).outlineWidth')).toBe('3px');
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(await page.evaluate(() => location.hash)).toBe('#ar');
  });

  it('fires scSwitch from the keyboard, and preventDefault stops navigation', async () => {
    const page = await newScPage(`<sc-language-switch href="#ar"></sc-language-switch>`);
    const spy = await page.spyOnEvent('scSwitch');
    await page.evaluate(() => document.addEventListener('scSwitch', (e) => e.preventDefault()));
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(spy).toHaveReceivedEventDetail({ lang: 'ar' });
    expect(await page.evaluate(() => location.hash)).toBe('');
  });

  it('works as a button with Space (deprecated mode)', async () => {
    const page = await newScPage(`<sc-language-switch></sc-language-switch>`, { lang: 'ar' });
    const spy = await page.spyOnEvent('scSwitch');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await page.waitForChanges();
    expect(spy).toHaveReceivedEventDetail({ lang: 'en' });
  });

  describe('without JavaScript (PERF-04, LANG-04)', () => {
    it.each(['en', 'ar'] as const)('shows the fallback link, visible, 44px and with href and hreflang, before any upgrade (%s page)', async (lang) => {
      const page = await noScriptPage(WITH_FALLBACK(lang), lang);
      expect(await page.evaluate(() => !!customElements.get('sc-language-switch'))).toBe(false);
      const link = await page.evaluate(() => {
        const a = document.querySelector('sc-language-switch a')!;
        const r = a.getBoundingClientRect();
        return [a.getAttribute('href'), a.getAttribute('hreflang'), r.width > 0 && getComputedStyle(a).visibility === 'visible', Math.round(r.height) >= 44, Math.round(r.width) >= 44, getComputedStyle(a).textDecorationLine];
      });
      const other = lang === 'ar' ? 'en' : 'ar';
      expect(link).toEqual([`/${other}/renew`, other, true, true, true, 'underline']);
      await page.close();
    });

    it('once upgraded, renders its own link to the same page and hides the fallback', async () => {
      const page = await newScPage(WITH_FALLBACK('en'));
      expect(await page.evaluate(() => document.querySelector('sc-language-switch a[slot="fallback"]')!.getClientRects().length)).toBe(0);
      expect(await inner(page, 'sc-language-switch', '[control.getAttribute("href"), control.getAttribute("hreflang")]')).toEqual(['/ar/renew', 'ar']);
      expect(await accessibleName(page)).toBe('العربية');
      expect(await page.evaluate(() => document.querySelectorAll('sc-language-switch > [data-sc-language-name]').length)).toBe(1);
    });
  });

  describeAxe('sc-language-switch', ALL_STATES);

  it('has no axe violations with focus on every channel', async () => {
    const page = await newScPage(ALL_STATES);
    await page.keyboard.press('Tab');
    for (const channel of ['now', 'transport', 'visit', 'justice', 'build', 'invest', 'trade'] as const) {
      await setPageContext(page, { channel, theme: 'light' });
      await expectNoAxeViolations(page);
    }
  });
});
