import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

const table = (ar: boolean) => `
  <div class="shot" style="padding:24px;inline-size:760px;background:var(--sc-color-surface)">
    <sc-table caption="${ar ? 'مخالفاتك' : 'Your fines'}" selectable>
      <table>
        <thead><tr>
          <th scope="col" data-type="reference">${ar ? 'الرقم المرجعي' : 'Reference'}</th>
          <th scope="col" data-type="date" data-sort aria-sort="descending">${ar ? 'التاريخ' : 'Date'}</th>
          <th scope="col">${ar ? 'المخالفة' : 'Offence'}</th>
          <th scope="col" data-type="amount" data-sort>${ar ? 'المبلغ' : 'Amount'}</th>
        </tr></thead>
        <tbody>
          <tr data-id="a" data-selected><th scope="row"><a href="#a"><sc-ltr>F-2026-118204</sc-ltr></a></th><td>${ar ? '14 مارس 2026' : '14 Mar 2026'}</td><td>${ar ? 'تجاوز السرعة المحددة' : 'Speeding: 21 to 30 km/h over the limit'}</td><td data-value="600">${ar ? '600.00 درهم' : 'AED 600.00'}</td></tr>
          <tr data-id="b"><th scope="row"><a href="#b"><sc-ltr>F-2026-107455</sc-ltr></a></th><td>${ar ? '2 مارس 2026' : '2 Mar 2026'}</td><td></td><td data-value="1100">${ar ? '1,100.00 درهم' : 'AED 1,100.00'}</td></tr>
        </tbody>
      </table>
      <div slot="footer"><span>${ar ? 'عرض 1 إلى 2 من 2 مخالفات' : 'Showing 1 to 2 of 2 fines'}</span></div>
    </sc-table>
  </div>`;

describeVisual('sc-table screenshots', () => {
  it.each(contexts)('desktop, $lang, $theme', async (ctx) => {
    const page = await newScPage(table(ctx.lang === 'ar'), ctx);
    await page.setViewport({ width: 820, height: 600, deviceScaleFactor: 1 });
    await expectScreenshot(page, 'sc-table', `desktop--${ctx.lang}-${ctx.theme}`, '.shot');
  });

  it.each(contexts)('stacked, $lang, $theme', async (ctx) => {
    const page = await newScPage(table(ctx.lang === 'ar').replace('inline-size:760px', 'inline-size:364px'), ctx);
    await page.setViewport({ width: 412, height: 900, deviceScaleFactor: 1 });
    await expectScreenshot(page, 'sc-table', `stacked--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
