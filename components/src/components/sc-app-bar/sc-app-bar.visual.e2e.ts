import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';


describeVisual('sc-app-bar screenshots', () => {
  it.each(contexts)('$lang, $theme', async (ctx) => {
    const page = await newScPage(`<div class="shot" style="background: var(--sc-color-surface); padding-block-end: 8px">${'<sc-app-bar><sc-back-link slot="start" href="#b"></sc-back-link><sc-language-switch slot="end" href="#l"></sc-language-switch></sc-app-bar><div style="block-size:16px"></div><sc-app-bar data-channel="transport"></sc-app-bar>'}</div>`, ctx);
    await page.setViewport({ width: 390, height: 300, deviceScaleFactor: 1 });
    
    await expectScreenshot(page, 'sc-app-bar', `states--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
