import { defineStrings } from '../define';

/** sc-date-input: part labels and validation messages. "Error:" and "(optional)" come from common.ts. */
export default defineStrings({
  en: {
    dateInputDay: 'Day',
    dateInputMonth: 'Month',
    dateInputYear: 'Year',
    dateInputRequired: 'Enter a date',
    dateInputInvalid: 'The date must be a real date',
  },
  ar: {
    dateInputDay: 'يوم',
    dateInputMonth: 'شهر',
    dateInputYear: 'سنة',
    dateInputRequired: 'يُرجى إدخال التاريخ',
    dateInputInvalid: 'يجب أن يكون التاريخ تاريخًا صحيحًا',
  },
});
