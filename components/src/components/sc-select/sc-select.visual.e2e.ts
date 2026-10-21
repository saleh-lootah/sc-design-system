import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

const t = (en: string, ar: string, lang: string) => (lang === 'ar' ? ar : en);

const gallery = (l: string) => `
  <style>.shot{display:grid;gap:24px;padding:24px;inline-size:400px;background:var(--sc-color-surface)}</style>
  <div class="shot">
    <sc-select label="${t('Issuing authority', 'جهة الإصدار', l)}" value="dubai"><option value="dubai">${t('Dubai', 'دبي', l)}</option><option value="sharjah">${t('Sharjah', 'الشارقة', l)}</option></sc-select>
    <sc-select id="focused" label="${t('Inspection centre', 'مركز الفحص', l)}" hint="${t('Choose the one nearest to you', 'يُرجى اختيار الأقرب إليك', l)}"><option value="">${t('Select a centre', 'اختيار مركز', l)}</option></sc-select>
    <sc-select label="${t('Inspection centre', 'مركز الفحص', l)}" error="${t('Select an inspection centre', 'يُرجى اختيار مركز الفحص', l)}"><option value="">${t('Select a centre', 'اختيار مركز', l)}</option></sc-select>
    <sc-select label="${t('Vehicle type', 'نوع المركبة', l)}" disabled><option>${t('Light vehicle', 'مركبة خفيفة', l)}</option></sc-select>
  </div>`;

describeVisual('sc-select screenshots', () => {
  it.each(contexts)('all states, $lang, $theme', async (ctx) => {
    const page = await newScPage(gallery(ctx.lang), ctx);
    await page.setViewport({ width: 640, height: 800, deviceScaleFactor: 1 });
    await page.focus('#focused select');
    await expectScreenshot(page, 'sc-select', `states--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
