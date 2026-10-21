import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';
import { groupedFooter, siteHeader } from '../../test/chrome';

describeVisual('sc-page screenshots', () => {
  it.each(contexts)('$lang, $theme', async (ctx) => {
    const page = await newScPage(`<div class="shot" style="background: var(--sc-color-surface); padding-block-end: 8px">${`<sc-page channel="now" style="min-block-size:0"><div slot="header">${siteHeader(ctx.lang)}</div><div style="padding:24px 48px"><h1 class="sc-type-headline-large">${ctx.lang === 'ar' ? 'ماذا تريد أن تفعل؟' : 'What do you need to do?'}</h1></div><div slot="footer">${groupedFooter(ctx.lang)}</div></sc-page>`}</div>`, ctx);
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
    
    await expectScreenshot(page, 'sc-page', `states--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
