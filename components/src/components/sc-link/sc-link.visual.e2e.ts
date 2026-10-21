import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

const l = (en: string, ar: string, lang: string) => (lang === 'ar' ? ar : en);

const gallery = (lang: string) => `
  <style>.shot{display:flex;flex-direction:column;align-items:flex-start;gap:16px;padding:24px;inline-size:520px;background:var(--sc-color-surface)}.shot p{margin:0}</style>
  <div class="shot">
    <p>${l('You need a valid', 'تحتاج إلى', lang)} <sc-link href="#a">${l('insurance certificate', 'شهادة تأمين سارية', lang)}</sc-link>${l(' and a passed vehicle test.', ' واجتياز فحص المركبة.', lang)}</p>
    <p>${l('Read the', 'اقرأ', lang)} <sc-link href="#b" external>${l('RTA fees guide', 'دليل رسوم الهيئة', lang)}</sc-link>.</p>
    <sc-link href="#c" standalone>${l('All 412 services', 'جميع الخدمات (412)', lang)}</sc-link>
    <sc-link id="focused" href="#d" standalone>${l('Payment history', 'سجل المدفوعات', lang)}</sc-link>
  </div>`;

describeVisual('sc-link screenshots', () => {
  it.each(contexts)('all states, $lang, $theme', async (ctx) => {
    const page = await newScPage(gallery(ctx.lang), ctx);
    await page.setViewport({ width: 600, height: 400, deviceScaleFactor: 1 });
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await expectScreenshot(page, 'sc-link', `states--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
