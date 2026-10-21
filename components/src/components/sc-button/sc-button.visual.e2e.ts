import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

const label = (en: string, ar: string, lang: string) => (lang === 'ar' ? ar : en);

/** Every variant and state, in the page language. Runs with `npm run test:visual`. */
const gallery = (lang: string) => `
  <style>.shot{display:inline-flex;flex-wrap:wrap;gap:16px;padding:24px;inline-size:560px;background:var(--sc-color-surface)}</style>
  <div class="shot">
    <sc-button icon="arrow-forward">${label('Continue', 'متابعة', lang)}</sc-button>
    <sc-button variant="secondary">${label('Save and finish later', 'احفظ وأكمل لاحقًا', lang)}</sc-button>
    <sc-button variant="tertiary">${label('Cancel', 'إلغاء', lang)}</sc-button>
    <sc-button variant="destructive">${label('Delete draft', 'حذف المسودة', lang)}</sc-button>
    <sc-button variant="handoff">${label('Sign in with UAE PASS', 'تسجيل الدخول باستخدام الهوية الرقمية', lang)}</sc-button>
    <sc-button size="m" icon="search" icon-position="start">${label('Search', 'بحث', lang)}</sc-button>
    <sc-button disabled>${label('Continue', 'متابعة', lang)}</sc-button>
    <sc-button variant="secondary" disabled>${label('Change', 'تغيير', lang)}</sc-button>
    <sc-button loading>${label('Pay with Dubai Pay', 'الدفع عبر دبي للدفع', lang)}</sc-button>
    <sc-button id="focused">${label('Focused', 'مركّز', lang)}</sc-button>
  </div>`;

describeVisual('sc-button screenshots', () => {
  it.each(contexts)('all states, $lang, $theme', async (ctx) => {
    const page = await newScPage(gallery(ctx.lang), ctx);
    await page.setViewport({ width: 640, height: 480, deviceScaleFactor: 1 });
    // Keyboard focus, so the U1 ring is in the picture.
    await page.evaluate(() => (document.querySelector('#focused') as HTMLElement).focus());
    await page.keyboard.press('Shift');
    await expectScreenshot(page, 'sc-button', `states--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
