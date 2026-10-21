import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

const faq = (ar: boolean) => `
  <div class="shot" style="padding:24px;inline-size:560px;background:var(--sc-color-surface)">
    <sc-accordion show-all>
      <details open><summary>${ar ? 'كم يستغرق التجديد؟' : 'How long does renewal take?'}<small>${ar ? 'عبر الإنترنت في معظم الحالات' : 'Online, in most cases'}</small></summary><p>${ar ? 'عادة نحو 10 دقائق.' : 'Usually about 10 minutes, once your vehicle has passed its technical test.'}</p></details>
      <details><summary>${ar ? 'ماذا أحتاج؟' : 'What do I need?'}</summary><p>x</p></details>
      <details><summary id="focused">${ar ? 'هل يمكنني التجديد لمدة سنتين؟' : 'Can I renew for 2 years?'}</summary><p>x</p></details>
    </sc-accordion>
  </div>`;

describeVisual('sc-accordion screenshots', () => {
  it.each(contexts)('sections, $lang, $theme', async (ctx) => {
    const page = await newScPage(faq(ctx.lang === 'ar'), ctx);
    await page.setViewport({ width: 640, height: 480, deviceScaleFactor: 1 });
    await page.focus('#focused');
    await page.keyboard.press('Shift');
    await expectScreenshot(page, 'sc-accordion', `sections--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
