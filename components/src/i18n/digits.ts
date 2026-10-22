/**
 * Latin digits only (LANG-20, LANG-21). People type Arabic-Indic (٠–٩) and Eastern
 * Arabic-Indic (۰–۹) digits; every field component turns them into 0–9 as they are typed,
 * before validation and before the value is submitted, and shows the result in the field.
 *
 * Pasted input (R9, amends LANG-21): text copied from an Arabic SMS, notification or PDF
 * often carries invisible bidirectional control characters around a code or reference
 * (LANG-15 isolates). Fields remove them: U+200E, U+200F, U+202A–U+202E and U+2066–U+2069.
 * Removing them is not a change to the identifier. No other character changes: separators,
 * letters and Arabic text stay as typed.
 */

/** The bidirectional control characters fields remove (R9): LRM, RLM, embeddings, overrides, isolates. */
const BIDI_CONTROLS = /[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g;

/** Replaces Arabic-Indic and Eastern Arabic-Indic digits with Latin digits. */
export function toLatinDigits(text: string): string {
  return text
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
}

/** Removes bidirectional control characters (R9). */
export function stripBidiControls(text: string): string {
  return text.replace(BIDI_CONTROLS, '');
}

/** Everything a field does to its text: bidi controls removed, digits made Latin. */
export function normaliseText(text: string): string {
  return toLatinDigits(stripBidiControls(text));
}

/**
 * Normalises a text field in place and returns its value. A digit is one character either
 * way, but a removed bidi control shortens the text, so the caret and selection move back
 * by the number of characters removed before them and stay on the same character.
 */
export function normaliseDigits(field: HTMLInputElement | HTMLTextAreaElement): string {
  const value = field.value;
  const clean = normaliseText(value);
  if (clean === value) return value;
  let start: number | null = null;
  let end: number | null = null;
  try {
    // null (or a throw) for input types without a selection, such as email.
    start = field.selectionStart;
    end = field.selectionEnd;
  } catch {
    /* no selection API */
  }
  field.value = clean;
  if (start !== null && end !== null) {
    const at = (i: number) => stripBidiControls(value.slice(0, i)).length;
    try {
      field.setSelectionRange(at(start), at(end));
    } catch {
      /* no selection API */
    }
  }
  return clean;
}
