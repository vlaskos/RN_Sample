// Frankfurter v2 (ECB rates). Historical rate: /v2/rates?date=YYYY-MM-DD&base=..&quotes=..
// Returns an ARRAY [{date, base, quote, rate}]; an empty [] means no rate
// (currency outside the ~30 ECB currencies, or a date outside coverage).
export type RateRow = {
  date: string;
  base: string;
  quote: string;
  rate: number;
};

const BASE_URL = 'https://api.frankfurter.dev/v2';

export async function fetchHistoricalRate(
  base: string,
  quote: string,
  date: string, // YYYY-MM-DD
): Promise<RateRow | null> {
  const url = `${BASE_URL}/rates?date=${date}&base=${base}&quotes=${quote}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Rates HTTP ${res.status}`);
  const data = (await res.json()) as RateRow[];
  return data[0] ?? null;
}
