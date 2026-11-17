import {
  clearExpenses,
  deleteExpense,
  getExpenseById,
  insertExpense,
  listExpenses,
  seedExpensesIfEmpty,
  type NewExpense,
} from '@/db/expenses.repo';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Demo seed (in a real app, seeding/migrations run on startup, not inside a query).
const SEED: NewExpense[] = [
  { title: 'Groceries', amount_minor: 5000, currency: 'USD', spent_at: '2024-06-01T10:00:00Z', created_at: new Date().toISOString() },
  { title: 'Taxi',      amount_minor: 2000, currency: 'USD', spent_at: '2024-06-02T15:30:00Z', created_at: new Date().toISOString() },
  { title: 'Coffee',    amount_minor: 3000, currency: 'USD', spent_at: '2024-06-03T08:45:00Z', created_at: new Date().toISOString() },
];

// Cache identity. One key → one slice of cache.
export const expensesKey = ['expenses'] as const;

// READ the list. Replaces useState(data/loading) + useEffect + cancelled flag.
export function useExpenses() {
  return useQuery({
    queryKey: expensesKey,
    queryFn: async () => {
      await seedExpensesIfEmpty(SEED); // demo-only
      return listExpenses();
    },
  });
}

// READ a single record by id (for the detail screen).
export function useExpense(id: number) {
  return useQuery({
    queryKey: ['expense', id] as const,
    queryFn: () => getExpenseById(id),
    enabled: Number.isFinite(id),
  });
}

// WRITE (add). On success — invalidate the key → RQ refetches the list itself.
export function useAddExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (expense: NewExpense) => insertExpense(expense),
    onSuccess: () => qc.invalidateQueries({ queryKey: expensesKey }),
  });
}

// WRITE (delete one). Used by swipe-to-delete.
export function useDeleteExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteExpense(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: expensesKey }),
  });
}

// WRITE (clear all). Same invalidation pattern instead of a manual reload.
export function useClearExpenses() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => clearExpenses(),
    onSuccess: () => qc.invalidateQueries({ queryKey: expensesKey }),
  });
}
