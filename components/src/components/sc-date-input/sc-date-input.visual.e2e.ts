import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

const t = (en: string, ar: string, lang: string) => (lang === 'ar' ? ar : en);

const gallery = (l: string) => `
  <style>.shot{display:grid;gap:32px;padding:24px;inline-size:440px;background:var(--sc-color-surface)}</style>
  <div class="shot">
    <sc-date-input label="${t('When does your insurance policy start?', 'متى تبدأ وثيقة التأمين؟', l)}" hint="${t('For example, 27 3 2026', 'مثلًا، 27 3 2026', l)}" value="2026-03-27"></sc-date-input>
    <sc-date-input id="focused" label="${t('When does your insurance policy start?', 'متى تبدأ وثيقة التأمين؟', l)}" error="${t('The date your policy starts must include a year', 'يجب أن يتضمن تاريخ بدء الوثيقة السنة', l)}" error-parts="year" value=""></sc-date-input>
    <sc-date-input label="${t('Registration expiry date', 'تاريخ انتهاء التسجيل', l)}" value="2026-11-15" disabled></sc-date-input>
  </div>`;

describeVisual('sc-date-input screenshots', () => {
  it.each(contexts)('all states, $lang, $theme', async (ctx) => {
    const page = await newScPage(gallery(ctx.lang), ctx);
    await page.setViewport({ width: 640, height: 800, deviceScaleFactor: 1 });
    await page.focus('#focused input');
    await expectScreenshot(page, 'sc-date-input', `states--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
