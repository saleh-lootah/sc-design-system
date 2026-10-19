import { defineStrings } from '../define';

/**
 * sc-callout. A visually hidden word before the content says what kind of message it
 * is, so the tone never relies on colour or the (decorative) icon alone.
 */
export default defineStrings({
  en: {
    calloutInfo: 'Information:',
    calloutSuccess: 'Success:',
    calloutWarning: 'Warning:',
    calloutError: 'Error:',
  },
  ar: {
    calloutInfo: 'معلومة:',
    calloutSuccess: 'تم بنجاح:',
    calloutWarning: 'تنبيه:',
    calloutError: 'خطأ:',
  },
});
