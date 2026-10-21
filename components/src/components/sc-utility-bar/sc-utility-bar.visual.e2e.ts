import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';


describeVisual('sc-utility-bar screenshots', () => {
  it.each(contexts)('$lang, $theme', async (ctx) => {
    const page = await newScPage(`<div class="shot" style="background: var(--sc-color-surface); padding-block-end: 8px">${'<sc-utility-bar happiness-href="#h" contact-href="tel:04" services-href="#s" chat-href="#c" accessibility-href="#a"></sc-utility-bar>'}</div>`, ctx);
    await page.setViewport({ width: 390, height: 500, deviceScaleFactor: 1 });
    
    await expectScreenshot(page, 'sc-utility-bar', `states--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
