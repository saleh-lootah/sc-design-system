import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';


describeVisual('sc-announcement-bar screenshots', () => {
  it.each(contexts)('$lang, $theme', async (ctx) => {
    const page = await newScPage(`<div class="shot" style="background: var(--sc-color-surface); padding-block-end: 8px">${['warning', 'info', 'error'].map((tone) => `<sc-announcement-bar tone="${tone}" dismissible link-href="#s" link-text="${ctx.lang === 'ar' ? 'عرض الخدمات المتأثرة' : 'See affected services'}">${ctx.lang === 'ar' ? 'صيانة مجدولة يوم السبت 25 أكتوبر. لن تتوفر خدمات الدفع من الساعة 2 حتى الساعة 6 صباحًا (بتوقيت دبي).' : 'Planned maintenance on Saturday 25 October. Payment services will be unavailable from 2am to 6am (Dubai time).'}</sc-announcement-bar><div style="block-size:16px"></div>`).join('')}</div>`, ctx);
    await page.setViewport({ width: 1024, height: 400, deviceScaleFactor: 1 });
    
    await expectScreenshot(page, 'sc-announcement-bar', `states--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
