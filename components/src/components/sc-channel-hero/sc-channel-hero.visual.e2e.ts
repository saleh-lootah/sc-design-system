import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

const hero = (ar: boolean) => `
  <sc-channel-hero class="shot">
    <p slot="eyebrow">${ar ? 'خدمات حكومية لكل من يعيش في دبي' : 'Government services for everyone who lives in Dubai'}</p>
    <h1 slot="heading">${ar ? 'ماذا تريد أن تفعل؟' : 'What do you need to do?'}</h1>
    <div style="block-size:64px;border:1.5px solid var(--sc-color-outline);border-radius:8px;background:var(--sc-color-surface)"></div>
    <a slot="popular" href="#a">${ar ? 'تجديد ترخيص المركبة' : 'Renew vehicle registration'}</a>
    <a slot="popular" href="#b">${ar ? 'دفع فواتير الماء والكهرباء' : 'Pay water and electricity'}</a>
    <a slot="popular" id="focused" href="#c">${ar ? 'تسجيل عقد إيجار' : 'Register a tenancy contract'}</a>
  </sc-channel-hero>`;

describeVisual('sc-channel-hero screenshots', () => {
  it.each(contexts)('desktop, $lang, $theme', async (ctx) => {
    const page = await newScPage(hero(ctx.lang === 'ar'), ctx);
    await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
    await page.evaluate(() => (document.querySelector('#focused') as HTMLElement).focus());
    await page.keyboard.press('Shift');
    await expectScreenshot(page, 'sc-channel-hero', `desktop--${ctx.lang}-${ctx.theme}`, '.shot');
  });

  it.each(contexts)('phone, $lang, $theme', async (ctx) => {
    const page = await newScPage(hero(ctx.lang === 'ar'), ctx);
    await page.setViewport({ width: 412, height: 800, deviceScaleFactor: 1 });
    await expectScreenshot(page, 'sc-channel-hero', `phone--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
