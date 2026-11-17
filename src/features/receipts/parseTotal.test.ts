import { describe, expect, it } from '@jest/globals';
import type { RecognizedLine } from './ocr';
import { parseAmountMinor, parseTotal } from './parseTotal';

function line(text: string, y = 0.9): RecognizedLine {
  return { text, confidence: 0.9, x: 0, y, width: 1, height: 0.05 };
}

describe('parseAmountMinor', () => {
  it('US format 12.99', () => expect(parseAmountMinor('12.99')).toBe(1299));
  it('EU format 12,99', () => expect(parseAmountMinor('12,99')).toBe(1299));
  it('thousands 1.234,56', () => expect(parseAmountMinor('1.234,56')).toBe(123456));
  it('thousands 1,234.56', () => expect(parseAmountMinor('1,234.56')).toBe(123456));
  it('no amount → null', () => expect(parseAmountMinor('hello world')).toBeNull());
});

describe('parseTotal', () => {
  it('keyword line wins over others', () => {
    const lines = [line('Coffee 3.00'), line('TOTAL 12.99')];
    expect(parseTotal(lines)?.amountMinor).toBe(1299);
  });

  it('falls back to largest amount in bottom 40%', () => {
    const lines = [line('99.00', 0.1), line('12.99', 0.9), line('5.00', 0.95)];
    expect(parseTotal(lines)?.amountMinor).toBe(1299);
  });

  it('returns null when no amount present', () => {
    expect(parseTotal([line('no numbers here')])).toBeNull();
  });
});
