import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

const items = (lang: string) =>
  lang === 'ar'
    ? `<a href="#a" data-icon="description">الطلبات</a>
       <a href="#p" data-icon="credit-card" aria-current="page">المدفوعات</a>
       <a href="#n" data-icon="notifications" data-count="3">الإشعارات</a>
       <a href="#s" data-icon="person">الملف الشخصي والإعدادات</a>
       <a href="#o" data-icon="logout" data-sign-out>تسجيل الخروج</a>`
    : `<a href="#a" data-icon="description">Applications</a>
       <a href="#p" data-icon="credit-card" aria-current="page">Payments</a>
       <a href="#n" data-icon="notifications" data-count="3">Notifications</a>
       <a href="#s" data-icon="person">Profile and settings</a>
       <a href="#o" data-icon="logout" data-sign-out>Sign out</a>`;

describeVisual('sc-account-nav screenshots', () => {
  it.each(contexts)('column, $lang, $theme', async (ctx) => {
    const page = await newScPage(`<style>.shot{padding:24px;inline-size:300px;background:var(--sc-color-surface)}</style><div class="shot"><sc-account-nav>${items(ctx.lang)}</sc-account-nav></div>`, ctx);
    await page.setViewport({ width: 720, height: 480, deviceScaleFactor: 1 });
    for (let i = 0; i < 4; i++) await page.keyboard.press('Tab');
    await expectScreenshot(page, 'sc-account-nav', `column--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
