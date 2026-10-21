import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

const t = (en: string, ar: string, lang: string) => (lang === 'ar' ? ar : en);

const gallery = (l: string) => `
  <style>.shot{display:grid;gap:32px;padding:24px;inline-size:440px;background:var(--sc-color-surface)}</style>
  <div class="shot">
    <sc-radio-group label="${t('Who issued the plate?', 'من أصدر اللوحة؟', l)}" hint="${t("It's shown on the plate", 'تجده على اللوحة', l)}" value="dubai">
      <sc-radio value="dubai">${t('Dubai', 'دبي', l)}</sc-radio>
      <sc-radio id="focused" value="abu-dhabi" hint="${t('Including Al Ain', 'بما فيها العين', l)}">${t('Abu Dhabi', 'أبوظبي', l)}</sc-radio>
      <sc-radio value="other" disabled>${t('Another emirate', 'إمارة أخرى', l)}</sc-radio>
    </sc-radio-group>
    <sc-radio-group label="${t('Is the vehicle insured?', 'هل المركبة مؤمنة؟', l)}" inline error="${t('Select if the vehicle is insured', 'يُرجى تحديد ما إذا كانت المركبة مؤمنة', l)}">
      <sc-radio value="yes">${t('Yes', 'نعم', l)}</sc-radio><sc-radio value="no">${t('No', 'لا', l)}</sc-radio>
    </sc-radio-group>
  </div>`;

describeVisual('sc-radio-group screenshots', () => {
  it.each(contexts)('all states, $lang, $theme', async (ctx) => {
    const page = await newScPage(gallery(ctx.lang), ctx);
    await page.setViewport({ width: 640, height: 800, deviceScaleFactor: 1 });
    await page.focus('#focused input');
    await page.keyboard.press('Shift');
    await expectScreenshot(page, 'sc-radio-group', `states--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
