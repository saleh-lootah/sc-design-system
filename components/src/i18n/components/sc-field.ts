import { defineStrings } from '../define';

/**
 * Strings every v2 form field renders: the visually hidden "Error:" before an error message
 * and "(optional)" after a label. Merged into each field's own strings by `withField()` in
 * src/components/sc-text-input/field.tsx. Not listed in ./index.ts (the legacy merged
 * dictionary already has `errorPrefix` and `optional` in common.ts).
 */
export default defineStrings({
  en: {
    fieldErrorPrefix: 'Error:',
    fieldOptional: '(optional)',
  },
  ar: {
    fieldErrorPrefix: 'خطأ:',
    fieldOptional: '(اختياري)',
  },
});
