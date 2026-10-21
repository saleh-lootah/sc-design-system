import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

const t = (en: string, ar: string, lang: string) => (lang === 'ar' ? ar : en);

const gallery = (l: string) => `
  <style>.shot{display:grid;gap:24px;padding:24px;inline-size:440px;background:var(--sc-color-surface)}</style>
  <div class="shot">
    <sc-textarea label="${t('Why are you cancelling the registration?', 'ما سبب إلغاء التسجيل؟', l)}" hint="${t('For example, the vehicle was sold or exported', 'مثلًا، بيعت المركبة أو صُدّرت', l)}" maxlength="200" rows="3" value="${t('Sold to a dealer', 'بيعت لتاجر', l)}"></sc-textarea>
    <sc-textarea label="${t('Add a note for the inspector', 'ملاحظة للمفتش', l)}" maxlength="10" rows="3" value="${t('Please call before arriving', 'يُرجى الاتصال قبل الوصول', l)}"></sc-textarea>
    <sc-textarea id="focused" label="${t('Describe the damage', 'وصف الضرر', l)}" error="${t('Describe the damage to the vehicle', 'يُرجى وصف الضرر في المركبة', l)}" rows="3"></sc-textarea>
  </div>`;

describeVisual('sc-textarea screenshots', () => {
  it.each(contexts)('all states, $lang, $theme', async (ctx) => {
    const page = await newScPage(gallery(ctx.lang), ctx);
    await page.setViewport({ width: 640, height: 900, deviceScaleFactor: 1 });
    await page.focus('#focused textarea');
    await expectScreenshot(page, 'sc-textarea', `states--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
