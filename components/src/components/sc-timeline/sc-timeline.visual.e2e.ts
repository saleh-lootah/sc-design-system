import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

describeVisual('sc-timeline screenshots', () => {
  it.each(contexts)('history, $lang, $theme', async (ctx) => {
    const ar = ctx.lang === 'ar';
    const page = await newScPage(
      `<style>.shot{padding:16px;inline-size:520px;background:var(--sc-color-surface)}</style>
      <div class="shot"><sc-timeline><ol>
        <li><sc-status-tag tone="error">${ar ? 'إجراء مطلوب' : 'Action needed'}</sc-status-tag><time>${ar ? '20 أكتوبر 2026، 09:40' : '20 Oct 2026, 09:40'}</time><p>${ar ? 'يُرجى تحميل نسخة أوضح من الهوية الإماراتية.' : 'Upload a clearer copy of your Emirates ID.'}</p></li>
        <li><sc-status-tag>${ar ? 'قيد المراجعة' : 'In review'}</sc-status-tag><time>${ar ? '18 أكتوبر 2026، 14:05' : '18 Oct 2026, 14:05'}</time><p>${ar ? 'تراجع هيئة الطرق والمواصلات مستنداتك.' : 'RTA is checking your documents.'}</p></li>
        <li><sc-status-tag>${ar ? 'تم الاستلام' : 'Received'}</sc-status-tag><time>${ar ? '17 أكتوبر 2026، 11:12' : '17 Oct 2026, 11:12'}</time><p>${ar ? 'تم استلام طلبك.' : 'We received your application.'}</p></li>
      </ol></sc-timeline></div>`,
      ctx,
    );
    await page.setViewport({ width: 600, height: 600, deviceScaleFactor: 1 });
    await expectScreenshot(page, 'sc-timeline', `history--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
