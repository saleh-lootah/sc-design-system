import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

const ICON = `<svg slot="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z"/></svg>`;
const gallery = (ar: boolean) => `
  <style>.shot{display:grid;grid-template-columns:repeat(2,300px);gap:24px;padding:24px;background:var(--sc-color-surface-container)}</style>
  <div class="shot">
    <sc-service-card href="#a" entity="${ar ? 'هيئة الطرق والمواصلات' : 'Roads and Transport Authority'}">${ar ? 'تجديد ترخيص المركبة' : 'Renew vehicle registration'}</sc-service-card>
    <sc-service-card href="#b" tint="amber" entity="${ar ? 'هيئة كهرباء ومياه دبي' : 'Dubai Electricity and Water Authority'}">${ICON}${ar ? 'دفع فواتير الماء والكهرباء' : 'Pay water and electricity bills'}</sc-service-card>
    <sc-service-card href="#c" entity="${ar ? 'دائرة الأراضي والأملاك' : 'Dubai Land Department'}">${ICON}${ar ? 'تسجيل عقد إيجار' : 'Register a tenancy contract'}</sc-service-card>
    <sc-service-card id="focused" href="#d" entity="${ar ? 'شرطة دبي' : 'Dubai Police'}">${ar ? 'دفع المخالفات المرورية' : 'Pay traffic fines'}</sc-service-card>
  </div>`;

describeVisual('sc-service-card screenshots', () => {
  it.each(contexts)('cards, $lang, $theme', async (ctx) => {
    const page = await newScPage(gallery(ctx.lang === 'ar'), ctx);
    await page.setViewport({ width: 720, height: 560, deviceScaleFactor: 1 });
    await page.evaluate(() => (document.querySelector('#focused') as HTMLElement).focus());
    await page.keyboard.press('Shift');
    await expectScreenshot(page, 'sc-service-card', `cards--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
