import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

const trail = (lang: string) =>
  lang === 'ar'
    ? `<a href="#h">الرئيسية</a><a href="#v">المركبات</a><span>تجديد ترخيص المركبة</span>`
    : `<a href="#h">Home</a><a href="#v">Vehicles</a><span>Renew your vehicle registration</span>`;

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
