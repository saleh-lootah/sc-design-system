import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

const EN = '[{"value":"t","label":"Transport and vehicles"},{"value":"p","label":"Paid online"},{"value":"y","label":"2026"}]';
const AR = '[{"value":"t","label":"النقل والمركبات"},{"value":"p","label":"مدفوع إلكترونيًا"},{"value":"y","label":"2026"}]';

describeVisual('sc-filter-chips screenshots', () => {
  it.each(contexts)('applied filters, $lang, $theme', async (ctx) => {
    const page = await newScPage(
      `<style>.shot{display:grid;gap:16px;padding:24px;inline-size:560px;background:var(--sc-color-surface)}</style>
      <div class="shot"><sc-filter-chips filters='${ctx.lang === 'ar' ? AR : EN}'></sc-filter-chips><sc-filter-chips id="focused" data-channel="transport" filters='${ctx.lang === 'ar' ? AR : EN}'></sc-filter-chips></div>`,
      ctx,
    );
    await page.setViewport({ width: 640, height: 400, deviceScaleFactor: 1 });
    await page.focus('#focused .sc-filter-chips__chip');
    await page.keyboard.press('Shift');
    await expectScreenshot(page, 'sc-filter-chips', `states--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
