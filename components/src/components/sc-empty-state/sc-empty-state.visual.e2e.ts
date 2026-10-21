import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

describeVisual('sc-empty-state screenshots', () => {
  it.each(contexts)('default and all-clear, $lang, $theme', async (ctx) => {
    const ar = ctx.lang === 'ar';
    const page = await newScPage(
      `<style>.shot{display:flex;flex-direction:column;inline-size:560px;background:var(--sc-color-surface)}</style>
      <div class="shot">
        <sc-empty-state icon="inbox" heading="${ar ? 'لا توجد لديك إشعارات' : 'You have no notifications'}">${ar ? 'عندما تتوفر أخبار من إحدى الخدمات، تظهر هنا.' : 'When a service has news for you, it appears here.'}</sc-empty-state>
        <sc-empty-state variant="success" heading="${ar ? 'لا توجد لديك مخالفات للدفع' : 'You have no fines to pay'}">${ar ? 'لا يوجد أي مبلغ مستحق على مركباتك.' : 'Nothing is due on your vehicles.'}<sc-button slot="action" variant="secondary">${ar ? 'عرض المخالفات المدفوعة' : 'View paid fines'}</sc-button></sc-empty-state>
      </div>`,
      ctx,
    );
    await page.setViewport({ width: 640, height: 800, deviceScaleFactor: 1 });
    await expectScreenshot(page, 'sc-empty-state', `variants--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
