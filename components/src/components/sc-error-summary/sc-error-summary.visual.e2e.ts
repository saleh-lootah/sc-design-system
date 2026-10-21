import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

describeVisual('sc-error-summary screenshots', () => {
  it.each(contexts)('focused with two errors, $lang, $theme', async (ctx) => {
    const ar = ctx.lang === 'ar';
    const page = await newScPage(
      `<style>.shot{padding:16px;inline-size:560px;background:var(--sc-color-surface)}</style>
      <div class="shot">
        <sc-error-summary>
          <a href="#plate-code">${ar ? 'يُرجى إدخال رمز اللوحة' : 'Enter the plate code'}</a>
          <a href="#plate-number">${ar ? 'يُرجى إدخال رقم اللوحة بالأرقام فقط، مثل 12345' : 'Enter the plate number using numbers only, like 12345'}</a>
        </sc-error-summary>
      </div>`,
      ctx,
    );
    await page.setViewport({ width: 640, height: 400, deviceScaleFactor: 1 });
    // Focus moves to the summary on load; make it keyboard-visible so the U1 ring is in the picture.
    await page.keyboard.press('Shift');
    await page.evaluate(() => (document.querySelector('sc-error-summary') as any).setFocus());
    await expectScreenshot(page, 'sc-error-summary', `errors--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
