import { defineStrings } from '../define';

/**
 * sc-pagination (v2). Numbers are written with Latin digits and a comma for thousands in
 * both languages. Arabic ranges use a word, never a dash (LANG-22A). `paginationItems` is a
 * plural template ("one|other" in English, "zero|one|two|few|many|other" in Arabic) for the
 * thing being counted; services override it with the `item-label` prop ("fine|fines").
 */
export default defineStrings({
  en: {
    paginationLabel: 'Pagination',
    paginationShowing: 'Showing {from}–{to} of {total} {items}',
    paginationShowingOne: 'Showing {from} of {total} {items}',
    paginationItems: 'result|results',
    paginationPrevious: 'Previous',
    paginationNext: 'Next',
    paginationPage: 'Page {page}',
    paginationPageOf: 'Page {page} of {total}',
  },
  ar: {
    paginationLabel: 'ترقيم الصفحات',
    paginationShowing: 'عرض {from} إلى {to} من {total} {items}',
    paginationShowingOne: 'عرض {from} من {total} {items}',
    paginationItems: 'نتيجة|نتيجة|نتيجتين|نتائج|نتيجة|نتيجة',
    paginationPrevious: 'السابق',
    paginationNext: 'التالي',
    paginationPage: 'الصفحة {page}',
    paginationPageOf: 'الصفحة {page} من {total}',
  },
});
