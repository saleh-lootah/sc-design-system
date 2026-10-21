import { defineStrings } from '../define';

/**
 * sc-account-nav (v2). `accountNavCount` is the visually hidden text after a count badge;
 * override it per item with `data-count-label` ("{count} unread").
 */
export default defineStrings({
  en: {
    accountNavLabel: 'Account',
    accountNavCount: '{count} new',
  },
  ar: {
    accountNavLabel: 'الحساب',
    accountNavCount: '{count} جديدة',
  },
});
