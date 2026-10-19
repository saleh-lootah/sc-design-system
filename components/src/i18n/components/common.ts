import { defineStrings } from '../define';

/**
 * Strings shared by several components. Component-specific strings go in their own
 * file next to this one (src/i18n/components/<tag>.ts), never here.
 */
export default defineStrings({
  en: {
    problem: 'There is a problem',
    errorPrefix: 'Error:',
    optional: '(optional)',
    change: 'Change',
    back: 'Back',
    loading: 'Loading',
    step: 'Step {current} of {total}',
    opensInNewTab: '(opens in new tab)',
    alsoOn: 'Also on {channel}',

    channelNow: 'Dubai Now',
    channelTransport: 'Dubai Transport',
    channelVisit: 'Visit Dubai',
    channelJustice: 'Dubai Justice',
    channelBuild: 'Build in Dubai',
    channelInvest: 'Invest in Dubai',
    channelTrade: 'Dubai Trade',
  },
  ar: {
    problem: 'يوجد خطأ',
    errorPrefix: 'خطأ:',
    optional: '(اختياري)',
    change: 'تغيير',
    back: 'رجوع',
    loading: 'جارٍ التحميل',
    step: 'الخطوة {current} من {total}',
    opensInNewTab: '(يفتح في علامة تبويب جديدة)',
    alsoOn: 'متوفر أيضًا في {channel}',

    channelNow: 'دبي الآن',
    channelTransport: 'مواصلات دبي',
    channelVisit: 'زوروا دبي',
    channelJustice: 'عدالة دبي',
    channelBuild: 'ابنِ في دبي',
    channelInvest: 'استثمر في دبي',
    channelTrade: 'دبي التجارية',
  },
});
