import { contexts, newScPage } from '../../test/page';
import { describeVisual, expectScreenshot } from '../../test/visual';

describeVisual('sc-notification-list screenshots', () => {
  it.each(contexts)('grouped, $lang, $theme', async (ctx) => {
    const ar = ctx.lang === 'ar';
    const page = await newScPage(
      `<style>.shot{padding:16px;inline-size:680px;background:var(--sc-color-surface)}</style>
      <div class="shot"><sc-notification-list>
        <h2>${ar ? 'اليوم' : 'Today'}</h2>
        <ul>
          <li data-unread><a href="#a"><strong>${ar ? 'تمت الموافقة على تصريح الوقوف' : 'Parking permit approved'}</strong><span>${ar ? 'تصريحك في البرشاء جاهز للتنزيل.' : 'Your permit for Al Barsha is ready to download.'}</span></a><time>09:40</time></li>
          <li><a href="#b"><strong>${ar ? 'تم دفع المخالفة' : 'Fine paid'}</strong><span>${ar ? 'تم استلام 600 درهم.' : 'We received AED 600.'}</span></a><time>08:12</time></li>
        </ul>
        <h2>${ar ? 'سابقًا' : 'Earlier'}</h2>
        <ul><li><a href="#c"><strong>${ar ? 'تم تجديد التسجيل' : 'Registration renewed'}</strong><span>${ar ? 'صالح حتى 18 أكتوبر 2027.' : 'Valid until 18 October 2027.'}</span></a><time>${ar ? '12 أكتوبر' : '12 Oct'}</time></li></ul>
      </sc-notification-list></div>`,
      ctx,
    );
    await page.setViewport({ width: 760, height: 700, deviceScaleFactor: 1 });
    await expectScreenshot(page, 'sc-notification-list', `grouped--${ctx.lang}-${ctx.theme}`, '.shot');
  });
});
