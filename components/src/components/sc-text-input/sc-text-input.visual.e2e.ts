import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

const t = (en: string, ar: string, lang: string) => (lang === 'ar' ? ar : en);

/** The E2 plate fields and every state, in the page language. Runs with `npm run test:visual`. */
const gallery = (l: string) => `
  <style>.shot{display:grid;gap:24px;padding:24px;inline-size:420px;background:var(--sc-color-surface)}</style>
  <div class="shot">
    <sc-text-input label="${t('Plate code', 'رمز اللوحة', l)}" hint="${t('1 or 2 English letters', 'حرف أو حرفان باللغة الإنجليزية', l)}" value="A" width="4" ltr></sc-text-input>
    <sc-text-input label="${t('Plate number', 'رقم اللوحة', l)}" hint="${t('Up to 5 digits, for example 12345', 'حتى 5 أرقام، مثل 12345', l)}" error="${t('Enter numbers only, like 12345', 'يُرجى إدخال رقم اللوحة بالأرقام فقط، مثل 12345', l)}" value="48B13" width="10" ltr></sc-text-input>
    <sc-text-input id="focused" label="${t('Full name', 'الاسم الكامل', l)}" optional></sc-text-input>
    <sc-text-input label="${t('Amount', 'المبلغ', l)}" prefix-text="${t('AED', 'درهم', l)}" value="450.00" width="10" ltr></sc-text-input>
    <sc-text-input label="${t('Chassis number', 'رقم الهيكل', l)}" value="JTMHV05J604123456" disabled></sc-text-input>
    <sc-text-input label="${t('Policy number', 'رقم الوثيقة', l)}" value="POL-2026-0042" readonly ltr></sc-text-input>
  </div>`;

describeVisual('sc-text-input screenshots', () => {
  it.each(contexts)('all states, $lang, $theme', async (ctx) => {
    const page = await newScPage(gallery(ctx.lang), ctx);
    await page.setViewport({ width: 640, height: 900, deviceScaleFactor: 1 });
    await page.focus('#focused input');
    await expectScreenshot(page, 'sc-text-input', `states--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
