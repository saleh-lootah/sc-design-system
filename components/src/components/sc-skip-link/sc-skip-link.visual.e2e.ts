import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

const PAGE = `
  <style>.shot{position:relative;inline-size:480px;block-size:96px;background:var(--sc-color-channel-subtle)}</style>
  <div class="shot"><sc-skip-link></sc-skip-link></div>
  <main id="main-content"><h1>Renew</h1></main>`;

describeVisual('sc-skip-link screenshots', () => {
  it.each(contexts)('focused, $lang, $theme', async (ctx) => {
    const page = await newScPage(PAGE, ctx);
    await page.setViewport({ width: 560, height: 240, deviceScaleFactor: 1 });
    await page.keyboard.press('Tab');
    await expectScreenshot(page, 'sc-skip-link', `focused--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
