import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

const t = (en: string, ar: string, lang: string) => (lang === 'ar' ? ar : en);

describeVisual('sc-callout screenshots', () => {
  it.each(contexts)('every tone, $lang, $theme', async (ctx) => {
    const l = ctx.lang;
    const page = await newScPage(
      `<style>.shot{display:flex;flex-direction:column;gap:16px;padding:16px;inline-size:560px;background:var(--sc-color-surface)}</style>
      <div class="shot">
        <sc-callout>${t("You'll need your plate number and Emirates ID number.", 'ستحتاج إلى رقم اللوحة ورقم الهوية الإماراتية.', l)}</sc-callout>
        <sc-callout tone="success" heading="${t('Registration renewed', 'تم تجديد التسجيل', l)}">${t('Valid until 18 October 2027.', 'صالح حتى 18 أكتوبر 2027.', l)}</sc-callout>
        <sc-callout tone="warning">${t("If your payment is interrupted, don't pay again.", 'إذا انقطعت عملية الدفع، فلا داعي للدفع مرة أخرى.', l)} <a href="#s">${t('Check the payment status', 'التحقق من حالة الدفع', l)}</a></sc-callout>
        <sc-callout tone="error" heading="${t('Payment failed', 'تعذّر الدفع', l)}">${t('No money has been taken.', 'لم يتم خصم أي مبلغ.', l)}</sc-callout>
      </div>`,
      ctx,
    );
    await page.setViewport({ width: 640, height: 600, deviceScaleFactor: 1 });
    await expectScreenshot(page, 'sc-callout', `tones--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
