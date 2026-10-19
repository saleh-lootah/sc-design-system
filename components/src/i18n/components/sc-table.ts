import { defineStrings } from '../define';

/**
 * sc-table: selection labels, sort announcements and the "None" placeholder. Services
 * override these per table with the `strings` property (e.g. "Select fine {row}").
 */
export default defineStrings({
  en: {
    tableSelectAll: 'Select all rows on this page',
    tableSelectRow: 'Select {row}',
    tableSelected: '{count} selected',
    tableSortedBy: 'Sorted by {column}, {order}',
    tableSortTextAscending: 'A to Z',
    tableSortTextDescending: 'Z to A',
    tableSortAmountAscending: 'lowest first',
    tableSortAmountDescending: 'highest first',
    tableSortDateAscending: 'oldest first',
    tableSortDateDescending: 'newest first',
    tableNone: 'None',
  },
  ar: {
    tableSelectAll: 'تحديد كل الصفوف في هذه الصفحة',
    tableSelectRow: 'تحديد {row}',
    tableSelected: 'تم تحديد {count}',
    tableSortedBy: 'مرتبة حسب {column}، {order}',
    tableSortTextAscending: 'من أ إلى ي',
    tableSortTextDescending: 'من ي إلى أ',
    tableSortAmountAscending: 'الأقل أولًا',
    tableSortAmountDescending: 'الأعلى أولًا',
    tableSortDateAscending: 'الأقدم أولًا',
    tableSortDateDescending: 'الأحدث أولًا',
    tableNone: 'لا يوجد',
  },
});
