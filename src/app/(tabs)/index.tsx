import type { Expense } from '@/db/expenses.repo';
import ExpenseRow from '@/components/ui/ExpenseRow';
import { useClearExpenses, useDeleteExpense, useExpenses } from '@/features/expenses/useExpenses';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

export default function HomeScreen() {
  const router = useRouter();
  const expensesQuery = useExpenses();
  const clearAll = useClearExpenses();
  const deleteExpense = useDeleteExpense();

  if (expensesQuery.isPending) return <Text style={styles.msg}>Loading…</Text>;
  if (expensesQuery.isError) return <Text style={styles.msg}>Error: {expensesQuery.error.message}</Text>;

  const expenses = expensesQuery.data;

  return (
    <View style={styles.container}>
      <FlashList
        data={expenses}
        keyExtractor={(item) => String(item.id)}
        ItemSeparatorComponent={Separator}
        ListEmptyComponent={<Text style={styles.msg}>No expenses yet. Add one.</Text>}
        renderItem={({ item }) => (
          <SwipeableRow
            expense={item}
            onPress={() => router.push(`/expense/${item.id}`)}
            onDelete={() => deleteExpense.mutate(item.id)}
          />
        )}
      />

      <View style={styles.footer}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add expense"
          onPress={() => router.push('/expense/new')}
          style={styles.addBtn}
        >
          <Text style={styles.addText}>+ Add expense</Text>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Clear all expenses" onPress={() => clearAll.mutate()}>
          <Text style={styles.clear}>Clear all</Text>
        </Pressable>
      </View>
    </View>
  );
}

// Swipe left reveals "Delete". renderRightActions can ignore its SharedValue
// args (progress/translation) — a simple button doesn't need them.
function SwipeableRow({ expense, onPress, onDelete }: { expense: Expense; onPress: () => void; onDelete: () => void }) {
  return (
    <ReanimatedSwipeable
      renderRightActions={() => (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Delete expense"
          onPress={onDelete}
          style={styles.deleteAction}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      )}
    >
      <View style={styles.rowWrap}>
        <ExpenseRow title={expense.title} amount={(expense.amount_minor / 100).toFixed(2)} onPress={onPress} />
      </View>
    </ReanimatedSwipeable>
  );
}

function Separator() {
  return <View style={styles.sep} />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  msg: { padding: 16 },
  rowWrap: { backgroundColor: '#ffffff', paddingHorizontal: 16, paddingVertical: 12 },
  sep: { height: StyleSheet.hairlineWidth, backgroundColor: '#e2e8f0' },
  deleteAction: { backgroundColor: '#d9534f', justifyContent: 'center', paddingHorizontal: 24 },
  deleteText: { color: 'white', fontWeight: '700' },
  footer: { padding: 16, gap: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#e2e8f0' },
  addBtn: { backgroundColor: '#208AEF', padding: 14, borderRadius: 10, alignItems: 'center' },
  addText: { color: 'white', fontWeight: '600' },
  clear: { color: '#d9534f', textAlign: 'center' },
});
