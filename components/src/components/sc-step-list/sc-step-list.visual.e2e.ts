import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

describeVisual('sc-step-list screenshots', () => {
  it.each(contexts)('life event, $lang, $theme', async (ctx) => {
    const ar = ctx.lang === 'ar';
    const rows = ar
      ? [['تسجيل عقد الإيجار', 'دائرة الأراضي والأملاك'], ['توصيل الماء والكهرباء', 'هيئة كهرباء ومياه دبي'], ['تحديث العنوان على مركبتك', 'هيئة الطرق والمواصلات', 'transport'], ['طلب تصريح وقوف', 'هيئة الطرق والمواصلات', 'transport'], ['البحث عن مدرسة قريبة', 'هيئة المعرفة والتنمية البشرية']]
      : [['Register your tenancy contract', 'Dubai Land Department'], ['Connect water and electricity', 'DEWA'], ['Update the address on your vehicle', 'RTA', 'transport'], ['Apply for a parking permit', 'RTA', 'transport'], ['Find a school nearby', 'KHDA']];
    const items = rows.map(([t, e, ch]) => `<li${ch ? ` data-channel="${ch}"` : ''}><a href="#">${t}</a><span>${e}</span></li>`).join('');
    const page = await newScPage(
      `<style>.shot{display:flex;flex-direction:column;gap:24px;padding:16px;inline-size:780px;background:var(--sc-color-surface)}</style>
      <div class="shot"><sc-step-list><ol>${items}</ol></sc-step-list><div style="inline-size:360px"><sc-step-list><ol>${items}</ol></sc-step-list></div></div>`,
      ctx,
    );
    await page.setViewport({ width: 840, height: 1400, deviceScaleFactor: 1 });
    await expectScreenshot(page, 'sc-step-list', `life-event--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
