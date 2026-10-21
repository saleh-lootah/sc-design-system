import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

describeVisual('sc-spinner screenshots', () => {
  it.each(contexts)('sizes and label, reduced motion, $lang, $theme', async (ctx) => {
    const label = ctx.lang === 'ar' ? 'جارٍ التحقق من رقم اللوحة' : 'Checking your plate number';
    const page = await newScPage(
      `<style>.shot{display:flex;align-items:center;gap:16px;padding:16px;inline-size:480px;background:var(--sc-color-surface);color:var(--sc-color-on-surface)}</style>
      <div class="shot"><sc-spinner></sc-spinner><sc-spinner size="l"></sc-spinner><sc-spinner show-label label="${label}"></sc-spinner></div>`,
      ctx,
    );
    await page.setViewport({ width: 560, height: 200, deviceScaleFactor: 1 });
    // The arc turns forever; reduced motion holds it still (and shows the labels), so the picture is stable.
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await expectScreenshot(page, 'sc-spinner', `sizes--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
