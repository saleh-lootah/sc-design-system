import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';
import { CHANNEL_LINKS } from '../../test/chrome';

describeVisual('sc-channel-network screenshots', () => {
  it.each(contexts)('$lang, $theme', async (ctx) => {
    const page = await newScPage(`<div class="shot" style="background: var(--sc-color-surface); padding-block-end: 8px">${`<div style="padding:24px 80px"><sc-channel-network links='${CHANNEL_LINKS}'></sc-channel-network></div>`}</div>`, ctx);
    await page.setViewport({ width: 1440, height: 400, deviceScaleFactor: 1 });
    
    await expectScreenshot(page, 'sc-channel-network', `states--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
