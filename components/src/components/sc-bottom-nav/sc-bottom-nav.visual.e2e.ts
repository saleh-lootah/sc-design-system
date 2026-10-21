import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

const items = (lang: string) =>
  lang === 'ar'
    ? `<a href="#h" data-icon="home" aria-current="page">الرئيسية</a><a href="#s" data-icon="apps">الخدمات</a><a href="#a" data-icon="history">النشاط</a>`
    : `<a href="#h" data-icon="home" aria-current="page">Home</a><a href="#s" data-icon="apps">Services</a><a href="#a" data-icon="history">Activity</a>`;

describeVisual('sc-bottom-nav screenshots', () => {
  it.each(contexts)('docked, $lang, $theme', async (ctx) => {
    const page = await newScPage(`<sc-bottom-nav>${items(ctx.lang)}</sc-bottom-nav>`, ctx);
    await page.setViewport({ width: 375, height: 200, deviceScaleFactor: 1 });
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await expectScreenshot(page, 'sc-bottom-nav', `docked--${ctx.lang}-${ctx.theme}`, 'sc-bottom-nav');
  });
});
