import { normaliseDigits, normaliseText, stripBidiControls, toLatinDigits } from './digits';

/** A stand-in for an input: value plus a selection the helper reads and sets. */
function field(value: string, start: number, end = start) {
  return {
    value,
    selectionStart: start as number | null,
    selectionEnd: end as number | null,
    setSelectionRange(s: number, e: number) {
      this.selectionStart = s;
      this.selectionEnd = e;
    },
  };
}

describe('stripBidiControls (R9)', () => {
  it('removes LRM, RLM, embeddings, overrides and isolates', () => {
    const controls = ['\u200E', '\u200F', '\u202A', '\u202B', '\u202C', '\u202D', '\u202E', '\u2066', '\u2067', '\u2068', '\u2069'];
    for (const c of controls) expect(stripBidiControls(`12${c}34`)).toBe('1234');
    expect(stripBidiControls('\u2066123456\u2069')).toBe('123456');
  });

  it('leaves every other character alone', () => {
    // ZWNJ shapes Arabic and Persian text; the Arabic letter mark is outside R9's list.
    expect(stripBidiControls('مرحبا\u200Cبك')).toBe('مرحبا\u200Cبك');
    expect(stripBidiControls('784-1990 ab\u061C')).toBe('784-1990 ab\u061C');
  });
});

describe('normaliseText', () => {
  it('strips bidi controls and makes digits Latin', () => {
    expect(normaliseText('\u2067١٢٣٤٥٦\u2069')).toBe('123456');
    expect(normaliseText('ab')).toBe(toLatinDigits('ab'));
  });
});

describe('normaliseDigits', () => {
  it('returns the value untouched when nothing changes', () => {
    const f = field('123', 1);
    expect(normaliseDigits(f as unknown as HTMLInputElement)).toBe('123');
    expect(f.selectionStart).toBe(1);
  });

  it('keeps the caret in place when only digits change', () => {
    const f = field('١٢٣', 2);
    expect(normaliseDigits(f as unknown as HTMLInputElement)).toBe('123');
    expect([f.selectionStart, f.selectionEnd]).toEqual([2, 2]);
  });

  it('moves the caret back by the controls removed before it (a paste)', () => {
    // After pasting an isolated "123456" into "ab|cd" the caret sits after the closing isolate.
    const f = field('ab\u2066123456\u2069cd', 10);
    expect(normaliseDigits(f as unknown as HTMLInputElement)).toBe('ab123456cd');
    expect([f.selectionStart, f.selectionEnd]).toEqual([8, 8]);
  });

  it('keeps a selection on the same characters', () => {
    const f = field('\u200F12\u200E34', 1, 6);
    expect(normaliseDigits(f as unknown as HTMLInputElement)).toBe('1234');
    expect([f.selectionStart, f.selectionEnd]).toEqual([0, 4]);
  });

  it('works for inputs without a selection API (email)', () => {
    const f = {
      value: '\u2066a@b.ae\u2069',
      selectionStart: null,
      selectionEnd: null,
      setSelectionRange() {
        throw new Error('no selection');
      },
    };
    expect(normaliseDigits(f as unknown as HTMLInputElement)).toBe('a@b.ae');
    expect(f.value).toBe('a@b.ae');
  });
});
