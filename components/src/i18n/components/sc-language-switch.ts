import { defineStrings } from '../define';

/**
 * sc-language-switch. Each language is always named in its own language (an endonym), so
 * both dictionaries hold the same values on purpose: an Arabic page links to "English",
 * an English page links to "العربية".
 */
export default defineStrings({
  en: {
    languageSwitchNameEn: 'English',
    languageSwitchNameAr: 'العربية',
  },
  ar: {
    languageSwitchNameEn: 'English',
    languageSwitchNameAr: 'العربية',
  },
});
