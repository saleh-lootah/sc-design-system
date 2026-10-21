import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

const CAR = `<svg slot="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 16h14v-4l-2-5H7l-2 5zM7 19v-3M17 19v-3"/></svg>`;
const cards = (ar: boolean) => `
  <div class="shot" style="display:grid;grid-template-columns:repeat(2,340px);gap:16px;padding:24px;background:var(--sc-color-surface)">
    <sc-module-card heading="${ar ? 'المخالفات المرورية' : 'Traffic fines'}" action-href="#a" action-text="${ar ? 'عرض المخالفات' : 'View fines'}" tint="amber" divided>${CAR}
      <div><p style="margin:0;color:var(--sc-color-on-surface-variant)">${ar ? 'للدفع' : 'To pay'}</p><p style="margin:0;font:var(--sc-type-headline-medium)"><sc-ltr>AED 600.00</sc-ltr></p></div>
      <p><sc-ltr>F-2026-118204</sc-ltr> · ${ar ? 'تجاوز السرعة' : 'Speeding'}</p>
      <sc-button slot="footer" variant="secondary" size="m" full-width>${ar ? 'ادفع كل المخالفات' : 'Pay all fines'}</sc-button>
    </sc-module-card>
    <sc-module-card heading="${ar ? 'الطلبات' : 'Applications'}" action-href="#b" action-text="${ar ? 'عرض الكل' : 'View all'}">
      <p>${ar ? 'تجديد عقد إيجار، الخطوة 2 من 4' : 'Ejari tenancy renewal, step 2 of 4'}</p>
    </sc-module-card>
  </div>`;

describeVisual('sc-module-card screenshots', () => {
  it.each(contexts)('cards, $lang, $theme', async (ctx) => {
    const page = await newScPage(cards(ctx.lang === 'ar'), ctx);
    await page.setViewport({ width: 760, height: 480, deviceScaleFactor: 1 });
    await expectScreenshot(page, 'sc-module-card', `cards--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
