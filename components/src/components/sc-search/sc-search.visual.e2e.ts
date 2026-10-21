import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

const t = (en: string, ar: string, lang: string) => (lang === 'ar' ? ar : en);

const gallery = (l: string) => `
  <style>.shot{display:grid;gap:32px;padding:24px;inline-size:600px;background:var(--sc-color-surface)}</style>
  <div class="shot">
    <sc-search label="${t('Search Dubai Now services', 'البحث في خدمات دبي الآن', l)}" placeholder="${t('Try “school fees”', 'مثلًا «الرسوم المدرسية»', l)}"></sc-search>
    <sc-search id="focused" label-hidden value="${t('renew registration', 'تجديد التسجيل', l)}"></sc-search>
    <sc-search size="l" label-hidden placeholder="${t('What do you need to do?', 'ما الذي تحتاج إليه؟', l)}"></sc-search>
  </div>`;

describeVisual('sc-search screenshots', () => {
  it.each(contexts)('sizes and focus, $lang, $theme', async (ctx) => {
    const page = await newScPage(gallery(ctx.lang), ctx);
    await page.setViewport({ width: 720, height: 600, deviceScaleFactor: 1 });
    await page.focus('#focused input');
    await expectScreenshot(page, 'sc-search', `states--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
