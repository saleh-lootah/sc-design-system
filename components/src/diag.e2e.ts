import { siteHeader } from './test/chrome';
import { newScPage } from './test/page';

it('diag', async () => {
  const page = await newScPage(siteHeader('en', { signedIn: true }));
  const fonts = () => page.evaluate(() => [...document.fonts].map((f) => `${f.family} ${f.weight} ${f.status}`).join(' | '));
  console.log('after hydrate', await fonts());
  await page.setViewport({ width: 1440, height: 800 });
  await page.waitForChanges();
  const st = () => page.evaluate(() => {
    const h = document.querySelector('sc-site-header') as any;
    const r = h.shadowRoot;
    const nav = r.querySelector('.nav');
    return JSON.stringify({ w: h.clientWidth, nav: !!nav, navSW: nav?.scrollWidth, navCW: nav?.clientWidth, overflowAt: h.overflowAt, hover: matchMedia('(hover: hover)').matches, dpr: devicePixelRatio, inner: innerWidth });
  });
  console.log('state', await st());
  await page.evaluate(() => document.fonts.ready);
  console.log('after ready', await fonts(), await st());
});
