import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';
import { groupedFooter } from '../../test/chrome';

describeVisual('sc-footer screenshots', () => {
  it.each(contexts)('$lang, $theme', async (ctx) => {
    const page = await newScPage(`<div class="shot" style="background: var(--sc-color-surface); padding-block-end: 8px">${groupedFooter(ctx.lang) + '<sc-footer help-href="#h" accessibility-href="#a" privacy-href="#p" cookies-href="#c" terms-href="#t"></sc-footer>'}</div>`, ctx);
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    
    await expectScreenshot(page, 'sc-footer', `states--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
