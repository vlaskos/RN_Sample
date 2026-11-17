/** One recognized line with a normalized box (top-left origin). */
export type RecognizedLine = {
  text: string;
  confidence: number;
  /** 0–1, left edge. */
  x: number;
  /** 0–1, top edge (Vision's bottom-left origin is converted natively). */
  y: number;
  /** 0–1 */
  width: number;
  /** 0–1 */
  height: number;
};
