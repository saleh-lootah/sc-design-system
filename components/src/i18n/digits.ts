/**
 * Latin digits only (LANG-20, LANG-21). People type Arabic-Indic (٠–٩) and Eastern
 * Arabic-Indic (۰–۹) digits; every field component turns them into 0–9 as they are typed,
 * before validation and before the value is submitted, and shows the result in the field.
 * No other character changes: separators, letters and Arabic text stay as typed.
 */

/** Replaces Arabic-Indic and Eastern Arabic-Indic digits with Latin digits. */
export function toLatinDigits(text: string): string {
  return text
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
}

/**
 * Normalises the digits in a text field in place and returns its value. Each digit is
 * one character either way, so the caret and selection stay where they were.
 */
export function normaliseDigits(field: HTMLInputElement | HTMLTextAreaElement): string {
  const value = field.value;
  const latin = toLatinDigits(value);
  if (latin === value) return value;
  let start: number | null = null;
  let end: number | null = null;
  try {
    // null (or a throw) for input types without a selection, such as email.
    start = field.selectionStart;
    end = field.selectionEnd;
  } catch {
    /* no selection API */
  }
  field.value = latin;
  if (start !== null && end !== null) {
    try {
      field.setSelectionRange(start, end);
    } catch {
      /* no selection API */
    }
  }
  return latin;
}
