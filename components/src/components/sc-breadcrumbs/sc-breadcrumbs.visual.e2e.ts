import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

const trail = (lang: string) =>
  lang === 'ar'
    ? `<nav aria-label="مسار التنقل"><ol><li><a href="#h">الرئيسية</a></li><li><a href="#v">المركبات</a></li><li aria-current="page">تجديد ترخيص المركبة</li></ol></nav>`
    : `<nav aria-label="Breadcrumb"><ol><li><a href="#h">Home</a></li><li><a href="#v">Vehicles</a></li><li aria-current="page">Renew your vehicle registration</li></ol></nav>`;

describeVisual('sc-breadcrumbs screenshots', () => {
  it.each(contexts)('wide and compact, $lang, $theme', async (ctx) => {
    const html = `<style>.shot{padding:24px;inline-size:560px;background:var(--sc-color-channel-subtle)}</style><div class="shot"><sc-breadcrumbs>${trail(ctx.lang)}</sc-breadcrumbs></div>`;
    const page = await newScPage(html, ctx);
    await page.setViewport({ width: 640, height: 200, deviceScaleFactor: 1 });
    await page.keyboard.press('Tab');
    await expectScreenshot(page, 'sc-breadcrumbs', `wide--${ctx.lang}-${ctx.theme}`, '.shot');
    await page.setViewport({ width: 375, height: 200, deviceScaleFactor: 1 });
    await page.evaluate(() => ((document.querySelector('.shot') as HTMLElement).style.inlineSize = '327px'));
    await expectScreenshot(page, 'sc-breadcrumbs', `compact--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
