import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

const t = (en: string, ar: string, lang: string) => (lang === 'ar' ? ar : en);

describeVisual('sc-status-tag screenshots', () => {
  it.each(contexts)('every tone, $lang, $theme', async (ctx) => {
    const l = ctx.lang;
    const page = await newScPage(
      `<style>.shot{display:flex;flex-wrap:wrap;gap:8px;padding:16px;inline-size:520px;background:var(--sc-color-surface)}</style>
      <div class="shot">
        <sc-status-tag>${t('Draft', 'مسودة', l)}</sc-status-tag>
        <sc-status-tag tone="info">${t('In review', 'قيد المراجعة', l)}</sc-status-tag>
        <sc-status-tag tone="success">${t('Paid', 'تم الدفع', l)}</sc-status-tag>
        <sc-status-tag tone="warning">${t('Expires in 15 days', 'ينتهي خلال 15 يومًا', l)}</sc-status-tag>
        <sc-status-tag tone="error">${t('Action needed', 'إجراء مطلوب', l)}</sc-status-tag>
        <sc-status-tag tone="channel">${t('Life event', 'حدث حياتي', l)}</sc-status-tag>
      </div>`,
      ctx,
    );
    await page.setViewport({ width: 600, height: 300, deviceScaleFactor: 1 });
    await expectScreenshot(page, 'sc-status-tag', `tones--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
