import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';
import { groupedFooter, simpleFooter } from '../../test/chrome';

describeVisual('sc-footer screenshots', () => {
  it.each(contexts)('$lang, $theme', async (ctx) => {
    const page = await newScPage(`<div class="shot" style="background: var(--sc-color-surface); padding-block-end: 8px">${groupedFooter(ctx.lang) + simpleFooter(ctx.lang)}</div>`, ctx);
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

    await expectScreenshot(page, 'sc-footer', `states--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
