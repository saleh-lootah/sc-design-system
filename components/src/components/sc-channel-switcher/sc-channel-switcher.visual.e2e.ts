import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';
import { CHANNEL_LINKS } from '../../test/chrome';

describeVisual('sc-channel-switcher screenshots', () => {
  it.each(contexts)('$lang, $theme', async (ctx) => {
    const page = await newScPage(`<div class="shot" style="background: var(--sc-color-surface); padding-block-end: 8px">${`<div style="display:flex;justify-content:flex-end;padding:16px;block-size:560px"><sc-channel-switcher channel="transport" links='${CHANNEL_LINKS}'></sc-channel-switcher></div>`}</div>`, ctx);
    await page.setViewport({ width: 1280, height: 600, deviceScaleFactor: 1 });
    await page.evaluate(() => (document.querySelector('sc-channel-switcher') as HTMLElement & { open(): Promise<void> }).open());
    await page.waitForChanges();
    await expectScreenshot(page, 'sc-channel-switcher', `states--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
