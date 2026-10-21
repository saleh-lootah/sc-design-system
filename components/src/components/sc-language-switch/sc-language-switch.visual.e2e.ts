import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

const gallery = `
  <style>.shot{display:flex;align-items:center;gap:32px;padding:24px;inline-size:420px;background:var(--sc-color-surface)}</style>
  <div class="shot">
    <sc-language-switch href="#a"></sc-language-switch>
    <sc-language-switch appearance="header" href="#a"></sc-language-switch>
    <sc-language-switch id="focused" href="#a"></sc-language-switch>
  </div>`;

describeVisual('sc-language-switch screenshots', () => {
  it.each(contexts)('all states, $lang, $theme', async (ctx) => {
    const page = await newScPage(gallery, ctx);
    await page.setViewport({ width: 500, height: 200, deviceScaleFactor: 1 });
    for (let i = 0; i < 3; i++) await page.keyboard.press('Tab');
    await expectScreenshot(page, 'sc-language-switch', `states--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
