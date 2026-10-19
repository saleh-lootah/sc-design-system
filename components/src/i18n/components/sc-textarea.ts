import { defineStrings } from '../define';

/**
 * sc-textarea character count. Arabic counted nouns change form with the number, so there
 * is one key per Arabic plural category (Intl.PluralRules('ar')): zero, one, two, few
 * (3–10), many (11–99, e.g. 120) and other (100, 101, 102, …). English uses `One` for 1
 * and `Many` for everything else; its other keys exist only so both languages have every key.
 */
export default defineStrings({
  en: {
    textareaLimit: 'You can enter up to {max} characters',
    textareaRemainingZero: 'You have 0 characters remaining',
    textareaRemainingOne: 'You have 1 character remaining',
    textareaRemainingTwo: 'You have 2 characters remaining',
    textareaRemainingFew: 'You have {count} characters remaining',
    textareaRemainingMany: 'You have {count} characters remaining',
    textareaRemainingOther: 'You have {count} characters remaining',
    textareaOverOne: 'You have 1 character too many',
    textareaOverTwo: 'You have 2 characters too many',
    textareaOverFew: 'You have {count} characters too many',
    textareaOverMany: 'You have {count} characters too many',
    textareaOverOther: 'You have {count} characters too many',
  },
  ar: {
    textareaLimit: 'الحد الأقصى لعدد الأحرف: {max}',
    textareaRemainingZero: 'لم يتبقَّ لديك أي حرف',
    textareaRemainingOne: 'يتبقى لديك حرف واحد',
    textareaRemainingTwo: 'يتبقى لديك حرفان',
    textareaRemainingFew: 'يتبقى لديك {count} أحرف',
    textareaRemainingMany: 'يتبقى لديك {count} حرفًا',
    textareaRemainingOther: 'يتبقى لديك {count} حرف',
    textareaOverOne: 'لديك حرف واحد زائد عن الحد',
    textareaOverTwo: 'لديك حرفان زائدان عن الحد',
    textareaOverFew: 'لديك {count} أحرف زائدة عن الحد',
    textareaOverMany: 'لديك {count} حرفًا زائدًا عن الحد',
    textareaOverOther: 'لديك {count} حرف زائد عن الحد',
  },
});
