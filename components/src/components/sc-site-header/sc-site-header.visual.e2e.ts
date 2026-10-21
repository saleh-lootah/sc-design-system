import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';
import { siteHeader } from '../../test/chrome';

describeVisual('sc-site-header screenshots', () => {
  it.each(contexts)('$lang, $theme', async (ctx) => {
    const page = await newScPage(`<div class="shot" style="background: var(--sc-color-surface); padding-block-end: 8px">${siteHeader(ctx.lang, { signedIn: true }) + siteHeader(ctx.lang)}</div>`, ctx);
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.waitForChanges();
    await expectScreenshot(page, 'sc-site-header', `states--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
