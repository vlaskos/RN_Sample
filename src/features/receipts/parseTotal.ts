import type { RecognizedLine } from './ocr';

export type ParsedTotal = { amountMinor: number; line: string } | null;

// Multilingual receipt keywords (English / German / Polish / Ukrainian).
const KEYWORDS = ['TOTAL', 'SUMME', 'GESAMT', 'SUMA', 'RAZEM', 'ДО СПЛАТИ', 'AMOUNT DUE', 'BALANCE'];

/**
 * Extracts an amount from a string in the formats 12,99 · 12.99 · 1.234,56 · 1,234.56
 * → minor units (integer). The last [.,] separator is treated as the decimal
 * point; the rest (thousands separators) are stripped.
 */
export function parseAmountMinor(text: string): number | null {
  const match = text.match(/\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})(?!\d)|\d+[.,]\d{2}(?!\d)/);
  if (!match) return null;
  const token = match[0];
  const lastSep = Math.max(token.lastIndexOf('.'), token.lastIndexOf(','));
  const intPart = token.slice(0, lastSep).replace(/[.,]/g, '');
  const fracPart = token.slice(lastSep + 1);
  const minor = Number(intPart) * 100 + Number(fracPart);
  return Number.isFinite(minor) ? minor : null;
}

/**
 * Determines the receipt's total amount:
 *  1) lines containing a keyword (TOTAL/SUMME/…) take priority;
 *  2) fallback — the largest amount in the bottom 40% of the receipt (by y coordinate).
 */
export function parseTotal(lines: RecognizedLine[]): ParsedTotal {
  for (const line of lines) {
    const upper = line.text.toUpperCase();
    if (KEYWORDS.some((k) => upper.includes(k))) {
      const amt = parseAmountMinor(line.text);
      if (amt != null) return { amountMinor: amt, line: line.text };
    }
  }

  const bottom = lines.filter((l) => l.y >= 0.6);
  let best: ParsedTotal = null;
  for (const line of bottom.length ? bottom : lines) {
    const amt = parseAmountMinor(line.text);
    if (amt != null && (best == null || amt > best.amountMinor)) {
      best = { amountMinor: amt, line: line.text };
    }
  }
  return best;
}
