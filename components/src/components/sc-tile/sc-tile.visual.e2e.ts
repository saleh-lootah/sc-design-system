import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

const ICON = `<svg slot="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 11l8-7 8 7v9H4z"/></svg>`;
const tiles = (ar: boolean) => `
  <div class="shot" style="display:grid;grid-template-columns:repeat(3,180px);gap:16px;padding:24px;background:var(--sc-color-surface)">
    <sc-tile href="#a" tint="orange" count="14">${ICON}${ar ? 'الانتقال إلى منزل جديد' : 'Moving home'}</sc-tile>
    <sc-tile href="#b" tint="rose" count="9">${ICON}${ar ? 'إنجاب طفل' : 'Having a baby'}</sc-tile>
    <sc-tile href="#c" tint="blue" count="2">${ICON}${ar ? 'امتلاك مركبة' : 'Owning a vehicle'}</sc-tile>
    <sc-tile href="#d" tint="violet">${ICON}${ar ? 'شهادة حسن السيرة' : 'Police certificate'}</sc-tile>
    <sc-tile href="#e" tint="green" count="1">${ICON}${ar ? 'الصحة' : 'Health'}</sc-tile>
    <sc-tile href="#f" id="focused">${ICON}${ar ? 'دفع مخالفة مرورية' : 'Pay a traffic fine'}</sc-tile>
  </div>`;

describeVisual('sc-tile screenshots', () => {
  it.each(contexts)('tiles, $lang, $theme', async (ctx) => {
    const page = await newScPage(tiles(ctx.lang === 'ar'), ctx);
    await page.setViewport({ width: 660, height: 360, deviceScaleFactor: 1 });
    await page.evaluate(() => (document.querySelector('#focused') as HTMLElement).focus());
    await page.keyboard.press('Shift');
    await expectScreenshot(page, 'sc-tile', `tiles--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
