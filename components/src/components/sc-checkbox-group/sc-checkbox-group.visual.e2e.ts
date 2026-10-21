import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

const t = (en: string, ar: string, lang: string) => (lang === 'ar' ? ar : en);

const gallery = (l: string) => `
  <style>.shot{display:grid;gap:32px;padding:24px;inline-size:440px;background:var(--sc-color-surface)}</style>
  <div class="shot">
    <sc-checkbox-group label="${t('Which documents do you have?', 'ما المستندات المتوفرة لديك؟', l)}" hint="${t('Select all that apply', 'يُرجى اختيار كل ما ينطبق', l)}">
      <sc-checkbox value="insurance" checked>${t('Valid insurance policy', 'وثيقة تأمين سارية', l)}</sc-checkbox>
      <sc-checkbox id="focused" value="inspection" hint="${t('From a centre approved by RTA', 'من مركز معتمد من هيئة الطرق والمواصلات', l)}">${t('Technical inspection certificate', 'شهادة الفحص الفني', l)}</sc-checkbox>
      <sc-checkbox value="fines">${t('Receipt for paid fines', 'إيصال المخالفات المدفوعة', l)}</sc-checkbox>
    </sc-checkbox-group>
    <sc-checkbox-group label="${t('Which documents do you have?', 'ما المستندات المتوفرة لديك؟', l)}" error="${t('Select at least one document', 'يُرجى اختيار مستند واحد على الأقل', l)}">
      <sc-checkbox value="a">${t('Valid insurance policy', 'وثيقة تأمين سارية', l)}</sc-checkbox>
    </sc-checkbox-group>
    <sc-checkbox-group label="${t('Send reminders by', 'إرسال التذكير عبر', l)}" inline disabled>
      <sc-checkbox value="sms" checked>${t('SMS', 'رسالة نصية', l)}</sc-checkbox><sc-checkbox value="email">${t('Email', 'البريد الإلكتروني', l)}</sc-checkbox>
    </sc-checkbox-group>
  </div>`;

describeVisual('sc-checkbox-group screenshots', () => {
  it.each(contexts)('all states, $lang, $theme', async (ctx) => {
    const page = await newScPage(gallery(ctx.lang), ctx);
    await page.setViewport({ width: 640, height: 900, deviceScaleFactor: 1 });
    await page.focus('#focused input');
    await page.keyboard.press('Shift');
    await expectScreenshot(page, 'sc-checkbox-group', `states--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
