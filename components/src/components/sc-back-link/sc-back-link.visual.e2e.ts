import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

const gallery = (lang: string) => `
  <style>.shot{display:flex;flex-wrap:wrap;gap:24px;padding:24px;inline-size:480px;background:var(--sc-color-surface)}</style>
  <div class="shot">
    <sc-back-link href="#a"></sc-back-link>
    <sc-back-link></sc-back-link>
    <sc-back-link href="#v">${lang === 'ar' ? 'رجوع إلى مركباتي' : 'Back to my vehicles'}</sc-back-link>
    <sc-back-link id="focused" href="#f"></sc-back-link>
  </div>`;

describeVisual('sc-back-link screenshots', () => {
  it.each(contexts)('all states, $lang, $theme', async (ctx) => {
    const page = await newScPage(gallery(ctx.lang), ctx);
    await page.setViewport({ width: 560, height: 300, deviceScaleFactor: 1 });
    for (let i = 0; i < 4; i++) await page.keyboard.press('Tab');
    await expectScreenshot(page, 'sc-back-link', `states--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
