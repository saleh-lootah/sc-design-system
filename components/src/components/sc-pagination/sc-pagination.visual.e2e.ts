import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

const AR_FORMS = 'مخالفة|مخالفة|مخالفتين|مخالفات|مخالفة|مخالفة';

describeVisual('sc-pagination screenshots', () => {
  it.each(contexts)('wide and compact, $lang, $theme', async (ctx) => {
    const label = ctx.lang === 'ar' ? AR_FORMS : 'fine|fines';
    const html = `<style>.shot{padding:24px;inline-size:600px;background:var(--sc-color-surface)}</style>
      <div class="shot"><sc-pagination page="7" total-items="1284" item-label="${label}" href-template="#p{page}"></sc-pagination></div>`;
    const page = await newScPage(html, ctx);
    await page.setViewport({ width: 680, height: 240, deviceScaleFactor: 1 });
    for (let i = 0; i < 3; i++) await page.keyboard.press('Tab');
    await expectScreenshot(page, 'sc-pagination', `wide--${ctx.lang}-${ctx.theme}`, '.shot');
    await page.setViewport({ width: 375, height: 240, deviceScaleFactor: 1 });
    await page.evaluate(() => ((document.querySelector('.shot') as HTMLElement).style.inlineSize = '327px'));
    await expectScreenshot(page, 'sc-pagination', `compact--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
