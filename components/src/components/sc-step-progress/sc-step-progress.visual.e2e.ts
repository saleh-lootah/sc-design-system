import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

describeVisual('sc-step-progress screenshots', () => {
  it.each(contexts)('full and compact, $lang, $theme', async (ctx) => {
    const ar = ctx.lang === 'ar';
    const names = (ar ? ['المركبة', 'رقم اللوحة', 'مراجعة الإجابات', 'الدفع'] : ['Vehicle', 'Plate number', 'Check answers', 'Pay']).map((n) => `<span>${n}</span>`).join('');
    const page = await newScPage(
      `<style>.shot{display:flex;flex-direction:column;gap:32px;padding:16px;inline-size:760px;background:var(--sc-color-surface)}</style>
      <div class="shot">
        <sc-step-progress current="2">${names}</sc-step-progress>
        <div style="inline-size:360px"><sc-step-progress current="2">${names}</sc-step-progress></div>
      </div>`,
      ctx,
    );
    await page.setViewport({ width: 820, height: 400, deviceScaleFactor: 1 });
    await expectScreenshot(page, 'sc-step-progress', `layouts--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
