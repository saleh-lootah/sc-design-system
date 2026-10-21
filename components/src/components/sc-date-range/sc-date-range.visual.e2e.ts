import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

const t = (en: string, ar: string, lang: string) => (lang === 'ar' ? ar : en);

describeVisual('sc-date-range screenshots', () => {
  it.each(contexts)('field and open popover, $lang, $theme', async (ctx) => {
    const l = ctx.lang;
    const page = await newScPage(
      `<style>.shot{padding:24px;inline-size:960px;block-size:640px;box-sizing:border-box;background:var(--sc-color-surface)}</style>
      <div class="shot">
        <sc-date-range id="d" label="${t('Show payments between', 'عرض المدفوعات بين', l)}" hint="${t('For example, 21 9 2026', 'مثلًا، 21 9 2026', l)}" start="2026-09-21" end="2026-10-09" max="2026-10-19" today="2026-10-19" months="2" presets></sc-date-range>
      </div>`,
      ctx,
    );
    await page.setViewport({ width: 1000, height: 700, deviceScaleFactor: 1 });
    await page.evaluate(() => (document.querySelector('#d') as HTMLElement & { open: () => Promise<void> }).open());
    await page.waitForFunction(() => document.querySelector('.sc-date-range__picker--popover:popover-open'));
    await expectScreenshot(page, 'sc-date-range', `open--${ctx.lang}-${ctx.theme}`, 'body');
  });

  it.each(contexts)('error on one segment, $lang, $theme', async (ctx) => {
    const l = ctx.lang;
    const page = await newScPage(
      `<style>.shot{padding:24px;inline-size:560px;background:var(--sc-color-surface)}</style>
      <div class="shot"><sc-date-range label="${t('Dates', 'التواريخ', l)}" error="${t('The end date must be the same as or after the start date', 'يجب أن يكون تاريخ النهاية في يوم البداية أو بعده', l)}" error-parts="end" start="2026-10-09" end="2026-09-21" today="2026-10-19"></sc-date-range></div>`,
      ctx,
    );
    await page.setViewport({ width: 640, height: 400, deviceScaleFactor: 1 });
    await expectScreenshot(page, 'sc-date-range', `error--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
