import { useQuery } from '@tanstack/react-query';
import { fetchHistoricalRate } from './rates.repo';

/**
 * Historical base→quote rate for a date.
 * staleTime: Infinity — a past-date rate never changes, so we cache it forever.
 * `enabled` gates the request when the currencies match or the inputs aren't ready yet.
 */
export function useHistoricalRate(base: string, quote: string, date: string) {
  const sameCurrency = base === quote;
  return useQuery({
    queryKey: ['rate', base, quote, date] as const,
    queryFn: () => fetchHistoricalRate(base, quote, date),
    enabled: !sameCurrency && Boolean(base) && Boolean(quote) && Boolean(date),
    staleTime: Infinity,
  });
}
