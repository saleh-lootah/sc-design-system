import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

const t = (en: string, ar: string, lang: string) => (lang === 'ar' ? ar : en);

describeVisual('sc-radio screenshots', () => {
  it.each(contexts)('options with hints, $lang, $theme', async (ctx) => {
    const l = ctx.lang;
    const page = await newScPage(
      `<style>.shot{padding:24px;inline-size:400px;background:var(--sc-color-surface)}</style>
      <div class="shot"><sc-radio-group label="${t('How long do you want to renew for?', 'ما مدة التجديد؟', l)}" value="1">
        <sc-radio value="1" hint="${t('AED 450', '450 درهمًا', l)}">${t('1 year', 'سنة واحدة', l)}</sc-radio>
        <sc-radio value="2" hint="${t('AED 900', '900 درهم', l)}">${t('2 years', 'سنتان', l)}</sc-radio>
      </sc-radio-group></div>`,
      ctx,
    );
    await page.setViewport({ width: 640, height: 500, deviceScaleFactor: 1 });
    await expectScreenshot(page, 'sc-radio', `states--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
