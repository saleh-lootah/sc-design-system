import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

const t = (en: string, ar: string, lang: string) => (lang === 'ar' ? ar : en);

const gallery = (l: string) => `
  <style>.shot{display:grid;gap:16px;padding:24px;inline-size:440px;background:var(--sc-color-surface)}</style>
  <div class="shot">
    <sc-checkbox checked>${t('I confirm the vehicle details are correct', 'أؤكد أن بيانات المركبة صحيحة', l)}</sc-checkbox>
    <sc-checkbox error="${t('Confirm that you accept the terms', 'يُرجى تأكيد الموافقة على الشروط', l)}">${t('I accept the terms', 'أوافق على الشروط', l)}</sc-checkbox>
    <sc-checkbox checked disabled>${t('Registration card', 'بطاقة التسجيل', l)}</sc-checkbox>
  </div>`;

describeVisual('sc-checkbox screenshots', () => {
  it.each(contexts)('on its own, $lang, $theme', async (ctx) => {
    const page = await newScPage(gallery(ctx.lang), ctx);
    await page.setViewport({ width: 640, height: 600, deviceScaleFactor: 1 });
    await expectScreenshot(page, 'sc-checkbox', `states--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
