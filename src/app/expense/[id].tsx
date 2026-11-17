import { useExpense } from '@/features/expenses/useExpenses';
import { useHistoricalRate } from '@/features/rates/useRates';
import { useAppSelector } from '@/store/hooks';
import { useLocalSearchParams } from 'expo-router';
import { type ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

function formatMoney(amount: number, currency: string) {
  return `${amount.toFixed(2)} ${currency}`;
}

export default function ExpenseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string | string[] }>();
  const expenseId = Number(Array.isArray(id) ? id[0] : id);
  const baseCurrency = useAppSelector((s) => s.settings.baseCurrency);

  const expenseQuery = useExpense(expenseId);
  const expense = expenseQuery.data;

  // All hooks run BEFORE any early return (Rules of Hooks). The `enabled`
  // flag gates the network request while the expense is missing or the
  // currencies match.
  const rateQuery = useHistoricalRate(
    expense?.currency ?? '',
    baseCurrency,
    expense?.spent_at.slice(0, 10) ?? '',
  );

  if (expenseQuery.isPending) return <Centered><ActivityIndicator /></Centered>;
  if (expenseQuery.isError) return <Centered><Text>Error: {expenseQuery.error.message}</Text></Centered>;
  if (!expense) return <Centered><Text>Expense not found</Text></Centered>;

  const amount = expense.amount_minor / 100;
  const sameCurrency = expense.currency === baseCurrency;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{expense.title}</Text>
      <Text style={styles.amount}>{formatMoney(amount, expense.currency)}</Text>
      <Text style={styles.date}>{expense.spent_at.slice(0, 10)}</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>In base currency ({baseCurrency})</Text>
        <Text style={styles.cardValue}>
          {sameCurrency
            ? `${formatMoney(amount, baseCurrency)} (same currency)`
            : rateQuery.isPending
              ? 'Loading rate…'
              : rateQuery.isError
                ? 'Rate error'
                : rateQuery.data == null
                  ? 'No rate for this date/currency'
                  : formatMoney(amount * rateQuery.data.rate, baseCurrency)}
        </Text>
        {!sameCurrency && rateQuery.data != null ? (
          <Text style={styles.rateNote}>
            rate {expense.currency}/{baseCurrency} on {rateQuery.data.date}: {rateQuery.data.rate}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

function Centered({ children }: { children: ReactNode }) {
  return <View style={styles.centered}>{children}</View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 6 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 26, fontWeight: '700' },
  amount: { fontSize: 20, fontWeight: '600', marginTop: 4 },
  date: { color: '#64748b', fontSize: 14 },
  card: {
    marginTop: 20,
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    gap: 6,
  },
  cardLabel: { color: '#64748b', fontSize: 13, fontWeight: '600' },
  cardValue: { color: '#0f172a', fontSize: 20, fontWeight: '700' },
  rateNote: { color: '#94a3b8', fontSize: 12 },
});
