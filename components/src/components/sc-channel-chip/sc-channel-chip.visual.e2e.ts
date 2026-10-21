import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

const CHANNELS = ['now', 'transport', 'visit', 'justice', 'build', 'invest', 'trade'];

const gallery = `
  <style>.shot{display:flex;flex-wrap:wrap;gap:12px;padding:24px;inline-size:640px;background:var(--sc-color-surface)}.tint{display:flex;flex-wrap:wrap;gap:12px;padding:12px;border-radius:8px;background:var(--sc-color-channel-subtle)}</style>
  <div class="shot">
    ${CHANNELS.map((c) => `<sc-channel-chip channel="${c}"></sc-channel-chip>`).join('')}
    <sc-channel-chip channel="transport" href="#t"></sc-channel-chip>
    <sc-channel-chip id="focused" channel="visit" href="#v"></sc-channel-chip>
    <div class="tint" data-channel="build">
      <sc-channel-chip channel="build" variant="outlined"></sc-channel-chip>
      <sc-channel-chip channel="justice" variant="outlined" href="#j"></sc-channel-chip>
    </div>
  </div>`;

describeVisual('sc-channel-chip screenshots', () => {
  it.each(contexts)('all states, $lang, $theme', async (ctx) => {
    const page = await newScPage(gallery, ctx);
    await page.setViewport({ width: 720, height: 400, deviceScaleFactor: 1 });
    await page.evaluate(() => (document.querySelector('#focused') as HTMLElement).focus());
    await page.keyboard.press('Shift');
    await expectScreenshot(page, 'sc-channel-chip', `states--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
