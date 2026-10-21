import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

const gallery = (ar: boolean) => `
  <style>.shot{display:grid;gap:16px;padding:24px;inline-size:420px;background:var(--sc-color-surface)}</style>
  <div class="shot">
    <sc-card landmark="section"><h2 class="sc-type-title-large">${ar ? 'مهامي' : 'My tasks'}</h2><p>${ar ? 'ينتهي تسجيل مركبتك خلال 15 يومًا.' : 'Your vehicle registration expires in 15 days.'}</p></sc-card>
    <sc-card padding="m"><p>${ar ? 'سبع خدمات من خمس جهات حكومية.' : 'Seven services from five government entities.'}</p></sc-card>
    <sc-card variant="filled"><p>${ar ? 'المجموع' : 'Total'} <sc-ltr>AED 420.00</sc-ltr></p></sc-card>
  </div>`;

describeVisual('sc-card screenshots', () => {
  it.each(contexts)('variants, $lang, $theme', async (ctx) => {
    const page = await newScPage(gallery(ctx.lang === 'ar'), ctx);
    await page.setViewport({ width: 520, height: 480, deviceScaleFactor: 1 });
    await expectScreenshot(page, 'sc-card', `variants--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
