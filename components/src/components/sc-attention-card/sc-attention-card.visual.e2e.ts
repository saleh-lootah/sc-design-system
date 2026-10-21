import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

const BULB = `<svg slot="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z"/></svg>`;
const cards = (ar: boolean) => `
  <div class="shot" style="display:grid;grid-template-columns:repeat(2,280px);gap:16px;padding:24px;background:var(--sc-color-surface)">
    <sc-attention-card>${BULB}<sc-status-tag slot="status" tone="error">${ar ? 'غير مدفوعة' : 'Not paid'}</sc-status-tag>${ar ? 'فاتورة الكهرباء والماء' : 'Electricity and water bill'}
      <span slot="fact">${ar ? 'مستحقة غدًا، 21 أكتوبر 2026' : 'Due tomorrow, 21 Oct 2026'}</span>
      <span slot="meta"><sc-ltr>AED 412.60</sc-ltr> · ${ar ? 'حساب' : 'DEWA account'} <sc-ltr>2004 1187</sc-ltr></span>
      <sc-button slot="action" variant="secondary" size="m" full-width>${ar ? 'دفع' : 'Pay'} <sc-ltr>AED 412.60</sc-ltr></sc-button>
    </sc-attention-card>
    <sc-attention-card>${BULB}<sc-status-tag slot="status" tone="warning">${ar ? 'تنتهي خلال 21 يومًا' : 'Expires in 21 days'}</sc-status-tag>${ar ? 'تجديد ترخيص المركبة' : 'Renew vehicle registration'}
      <span slot="fact">${ar ? 'تنتهي في 10 نوفمبر 2026' : 'Expires 10 Nov 2026'}</span>
      <span slot="meta">${ar ? 'دبي' : 'Dubai'} <sc-ltr>A 12345</sc-ltr></span>
      <sc-button slot="action" variant="secondary" size="m" full-width>${ar ? 'تجديد التسجيل' : 'Renew registration'}</sc-button>
    </sc-attention-card>
  </div>`;

describeVisual('sc-attention-card screenshots', () => {
  it.each(contexts)('cards, $lang, $theme', async (ctx) => {
    const page = await newScPage(cards(ctx.lang === 'ar'), ctx);
    await page.setViewport({ width: 640, height: 400, deviceScaleFactor: 1 });
    await expectScreenshot(page, 'sc-attention-card', `cards--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
