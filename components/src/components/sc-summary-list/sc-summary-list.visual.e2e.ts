import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

const lists = (ar: boolean) => `
  <style>.shot{display:grid;gap:24px;padding:24px;inline-size:360px;background:var(--sc-color-surface)}</style>
  <div class="shot">
    <sc-summary-list>
      <sc-summary-row label="${ar ? 'المركبة' : 'Vehicle'}">${ar ? 'نيسان باترول 2021، أبيض' : 'Nissan Patrol 2021, white'}</sc-summary-row>
      <sc-summary-row label="${ar ? 'اللوحة' : 'Plate'}">${ar ? 'دبي' : 'Dubai'} <sc-ltr>A 48213</sc-ltr></sc-summary-row>
      <sc-summary-row label="${ar ? 'مدة التجديد' : 'Renew for'}" action-href="#a">${ar ? 'سنة واحدة' : '1 year, until 3 November 2027'}</sc-summary-row>
      <sc-summary-row label="${ar ? 'هاتف آخر' : 'Second phone'}" action-href="#b"></sc-summary-row>
    </sc-summary-list>
    <sc-summary-list layout="pairs">
      <sc-summary-row label="${ar ? 'الدفع مقابل' : 'Paying for'}">${ar ? 'تجديد ترخيص المركبة' : 'Vehicle registration renewal'}</sc-summary-row>
      <sc-summary-row label="${ar ? 'مرجع الدفع' : 'Payment reference'}"><sc-ltr>DT-2026-0048213</sc-ltr></sc-summary-row>
      <sc-summary-row label="${ar ? 'المبلغ' : 'Amount'}" variant="total"><sc-ltr>AED 420.00</sc-ltr></sc-summary-row>
    </sc-summary-list>
  </div>`;

describeVisual('sc-summary-list screenshots', () => {
  it.each(contexts)('stacked and pairs, $lang, $theme', async (ctx) => {
    const page = await newScPage(lists(ctx.lang === 'ar'), ctx);
    await page.setViewport({ width: 480, height: 800, deviceScaleFactor: 1 });
    await expectScreenshot(page, 'sc-summary-list', `narrow--${ctx.lang}-${ctx.theme}`, '.shot');
  });

  it.each(contexts)('columns, $lang, $theme', async (ctx) => {
    const page = await newScPage(lists(ctx.lang === 'ar').replace('inline-size:360px', 'inline-size:720px'), ctx);
    await page.setViewport({ width: 800, height: 800, deviceScaleFactor: 1 });
    await expectScreenshot(page, 'sc-summary-list', `wide--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
