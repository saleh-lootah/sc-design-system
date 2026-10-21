import { defineStrings } from '../define';

/**
 * sc-filter-chips: the group name, each chip's accessible name, "Clear all" and the polite
 * count announcements. Counts have one key per plural category (Intl.PluralRules: English
 * uses one and other; Arabic all six). Arabic uses verbal nouns, never an imperative (CNT-11).
 */
export default defineStrings({
  en: {
    filterChipsLabel: 'Applied filters',
    filterChipsRemove: 'Remove filter: {label}',
    filterChipsClear: 'Clear all filters',
    filterChipsCountZero: 'No filters applied',
    filterChipsCountOne: '1 filter applied',
    filterChipsCountTwo: '2 filters applied',
    filterChipsCountFew: '{count} filters applied',
    filterChipsCountMany: '{count} filters applied',
    filterChipsCountOther: '{count} filters applied',
    filterChipsRemoved: 'Filter removed: {label}. {count}',
  },
  ar: {
    filterChipsLabel: 'عوامل التصفية المطبّقة',
    filterChipsRemove: 'إزالة عامل التصفية: {label}',
    filterChipsClear: 'مسح كل عوامل التصفية',
    filterChipsCountZero: 'لا توجد عوامل تصفية مطبّقة',
    filterChipsCountOne: 'عامل تصفية واحد مطبّق',
    filterChipsCountTwo: 'عاملا تصفية مطبّقان',
    filterChipsCountFew: '{count} عوامل تصفية مطبّقة',
    filterChipsCountMany: '{count} عاملًا مطبّقًا',
    filterChipsCountOther: '{count} عامل تصفية مطبّق',
    filterChipsRemoved: 'تمت إزالة عامل التصفية: {label}. {count}',
  },
});
