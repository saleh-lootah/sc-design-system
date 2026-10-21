import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

const html = (ar: boolean) => `
  <style>html,body{block-size:100%;margin:0}</style>
  <sc-modal heading="${ar ? 'ستنتهي الجلسة قريبًا' : 'You will be signed out soon'}" alert countdown="125">
    <p>${ar ? 'سنحتفظ بإجاباتك إذا اخترت تمديد الجلسة.' : "We'll keep your answers if you stay signed in."}</p>
    <sc-button slot="actions">${ar ? 'تمديد الجلسة' : 'Stay signed in'}</sc-button>
    <sc-button slot="actions" variant="secondary">${ar ? 'تسجيل الخروج' : 'Sign out'}</sc-button>
  </sc-modal>`;

describeVisual('sc-modal screenshots', () => {
  it.each(contexts)('dialog, $lang, $theme', async (ctx) => {
    const page = await newScPage(html(ctx.lang === 'ar'), ctx);
    await page.setViewport({ width: 800, height: 500, deviceScaleFactor: 1 });
    await page.$eval('sc-modal', (el: any) => el.show());
    await page.waitForChanges();
    await expectScreenshot(page, 'sc-modal', `dialog--${ctx.lang}-${ctx.theme}`, 'html');
  });

  it.each(contexts)('sheet, $lang, $theme', async (ctx) => {
    const page = await newScPage(html(ctx.lang === 'ar'), ctx);
    await page.setViewport({ width: 390, height: 640, deviceScaleFactor: 1 });
    await page.waitForChanges();
    await page.$eval('sc-modal', (el: any) => el.show());
    await page.waitForChanges();
    await expectScreenshot(page, 'sc-modal', `sheet--${ctx.lang}-${ctx.theme}`, 'html');
  });
});
