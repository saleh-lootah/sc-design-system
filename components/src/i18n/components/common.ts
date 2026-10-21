import { defineStrings } from '../define';
import channelNames from './channel-names';

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

    // The official channel names, kept in ./channel-names.ts.
    ...channelNames.en,
  },
  ar: {
    problem: 'توجد مشكلة',
    errorPrefix: 'خطأ:',
    optional: '(اختياري)',
    change: 'تغيير',
    back: 'رجوع',
    loading: 'جارٍ التحميل',
    step: 'الخطوة {current} من {total}',
    opensInNewTab: '(يفتح في علامة تبويب جديدة)',
    alsoOn: 'متوفر أيضًا في {channel}',

    ...channelNames.ar,
  },
});
