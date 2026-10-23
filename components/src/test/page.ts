/**
 * E2E page helpers: open a page in a given language, theme and channel.
 *
 *   import { newScPage, setPageContext, contexts } from '../../test/page';
 *
 *   const page = await newScPage('<sc-button>Continue</sc-button>', { lang: 'ar', theme: 'dark' });
 *   for (const ctx of contexts) { await setPageContext(page, ctx); ... }  // en/ar x light/dark
 *
 * lang + dir and data-channel go on <html>; data-theme goes on <html> (forced light or dark).
 */
import { E2EPage, newE2EPage } from '@stencil/core/testing';
import type { HTTPRequest, Page as PuppeteerPage } from 'puppeteer';

export type TestLang = 'en' | 'ar';
export type TestTheme = 'light' | 'dark';
export type TestChannel = 'now' | 'transport' | 'visit' | 'justice' | 'build' | 'invest' | 'trade';

export interface PageContext {
  lang?: TestLang;
  theme?: TestTheme;
  channel?: TestChannel;
}

/** The four combinations every component is checked in. */
export const contexts: Required<Pick<PageContext, 'lang' | 'theme'>>[] = [
  { lang: 'en', theme: 'light' },
  { lang: 'en', theme: 'dark' },
  { lang: 'ar', theme: 'light' },
  { lang: 'ar', theme: 'dark' },
];

export async function setPageContext(page: E2EPage, { lang = 'en', theme = 'light', channel = 'now' }: PageContext = {}): Promise<void> {
  await page.evaluate(
    (l: string, t: string, c: string) => {
      const html = document.documentElement;
      html.lang = l;
      html.dir = l === 'ar' ? 'rtl' : 'ltr';
      html.dataset.theme = t;
      html.dataset.channel = c;
    },
    lang,
    theme,
    channel,
  );
  // The locale controller re-renders on the next mutation-observer tick.
  await page.waitForChanges();
  await settleTransitions(page);
}

/**
 * Jumps running colour transitions (a channel or theme switch starts them) to their end, so
 * computed colours and axe contrast checks read the end state, not a frame mid-fade. Uses
 * finish() rather than waiting, because background tabs throttle frames. getAnimations()
 * flushes style first, so transitions the switch just started are included. Infinite
 * animations, such as the spinner, are left alone.
 */
export async function settleTransitions(page: E2EPage): Promise<void> {
  await page.evaluate(() => {
    const all = (root: Document | ShadowRoot): Animation[] => [
      ...root.getAnimations(),
      ...[...root.querySelectorAll('*')].flatMap((el) => (el.shadowRoot ? all(el.shadowRoot) : [])),
    ];
    for (const a of all(document)) {
      if (a.effect?.getComputedTiming().iterations !== Infinity) a.finish();
    }
  });
}

/**
 * Opens a page as a service page would be: sc.css linked (tokens, fonts, base, light-DOM
 * styles, helpers), and Stencil's own globalStyle link removed, because a real page never
 * loads that file (it is the helper sheet shadow roots adopt). The context is applied first,
 * so components connect in the right language.
 */
export async function newScPage(html: string, context: PageContext = {}): Promise<E2EPage> {
  const page = await newE2EPage();
  await page.setContent('');
  await page.evaluate(
    () =>
      new Promise<void>((resolve, reject) => {
        document.querySelector('link[href*="sc-components.css"]')?.remove();
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/build/sc.css';
        link.onload = () => resolve();
        link.onerror = () => reject(new Error('sc.css did not load: run `npm run build:css`'));
        document.head.append(link);
      }),
  );
  await setPageContext(page, context);
  await page.evaluate((markup: string) => {
    document.body.insertAdjacentHTML('beforeend', markup);
  }, html);
  await waitForHydration(page);
  return page;
}

/**
 * Loads every Dubai W23 face (both scripts, every weight) before a layout is measured. While a
 * face loads, text is set in the "Dubai W23 Fallback" faces, metric-matched to Arial and
 * Tahoma. Where those are not installed (Linux CI), it is set in a wider system font, and a
 * layout that depends on text width, such as sc-site-header's full row, can overflow and
 * switch to compact mid-test. Use it in tests of the laid-out result, not of font-swap timing.
 * It takes a noScriptPage() too: fonts load there with scripting off.
 */
export async function loadFonts(page: E2EPage | PuppeteerPage): Promise<void> {
  await (page as PuppeteerPage).evaluate(() =>
    Promise.all(['400', '500', '700'].map((w) => document.fonts.load(`${w} 16px "Dubai W23 Arabic", "Dubai W23", "Dubai W23 Name"`, 'Aا'))),
  );
}

/** Waits until every sc- element on the page has hydrated (Stencil adds the `hydrated` class). */
export async function waitForHydration(page: E2EPage): Promise<void> {
  await page.waitForFunction(() =>
    // CSS-only tags (sc-container, sc-grid, sc-ltr) are never registered, so never hydrate.
    [...document.querySelectorAll('*')]
      .filter((el) => el.localName.startsWith('sc-') && customElements.get(el.localName))
      .every((el) => el.classList.contains('hydrated')),
  );
  await page.waitForChanges();
}

/**
 * Opens `html` with sc.css and JavaScript disabled: what a visitor gets when script fails or
 * is blocked (PERF-04), and, for registered tags, what every visitor sees before the upgrade.
 */
export async function noScriptPage(html: string, lang = 'en', width = 1280) {
  const e2e = await newE2EPage();
  await e2e.setContent('');
  const origin = new URL(e2e.url()).origin;
  // E2EPage is a Puppeteer page; its type hides browser().
  const page = await (e2e as unknown as PuppeteerPage).browser().newPage();
  await page.setJavaScriptEnabled(false);
  await page.setRequestInterception(true);
  page.on('request', (r: HTTPRequest) =>
    r.url() === `${origin}/no-script.html`
      ? r.respond({ status: 200, contentType: 'text/html', body: `<!doctype html><html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}" data-channel="now"><head><meta charset="utf-8"><link rel="stylesheet" href="/build/sc.css"></head><body>${html}</body></html>` })
      : r.continue(),
  );
  await page.setViewport({ width, height: 800 });
  await page.goto(`${origin}/no-script.html`, { waitUntil: 'load' });
  return page;
}
