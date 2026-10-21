import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';


describeVisual('sc-account-menu screenshots', () => {
  it.each(contexts)('$lang, $theme', async (ctx) => {
    const page = await newScPage(`<div class="shot" style="background: var(--sc-color-surface); padding-block-end: 8px">${`<div style="display:flex;justify-content:flex-end;padding:16px;block-size:460px"><sc-account-menu name="${ctx.lang === 'ar' ? 'سارة المنصوري' : 'Sara Al Mansoori'}" acting-for="${ctx.lang === 'ar' ? 'شركة المنصوري للتجارة' : 'Al Mansoori Trading LLC'}" profile-href="#p" settings-href="#s" representation-href="#r" notifications-href="#n" unread="3"></sc-account-menu></div>`}</div>`, ctx);
    await page.setViewport({ width: 1280, height: 520, deviceScaleFactor: 1 });
    await page.evaluate(() => (document.querySelector('sc-account-menu') as HTMLElement & { open(): Promise<void> }).open());
    await page.waitForChanges();
    await expectScreenshot(page, 'sc-account-menu', `states--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
