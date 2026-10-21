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

/** Waits until every sc- element on the page has hydrated (Stencil adds the `hydrated` class). */
export async function waitForHydration(page: E2EPage): Promise<void> {
  await page.waitForFunction(() =>
    [...document.querySelectorAll('*')].filter((el) => el.localName.startsWith('sc-')).every((el) => el.classList.contains('hydrated')),
  );
  await page.waitForChanges();
}
