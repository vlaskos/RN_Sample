import { z } from 'zod';

// The form works with strings (TextInput always returns a string).
// The amount is kept as a decimal string and converted to minor units
// only at submit time — no transform in the schema, so input === output types.
export const expenseFormSchema = z.object({
  title: z.string().trim().min(1, 'Enter a title'),
  amount: z.string().regex(/^\d+([.,]\d{1,2})?$/, 'e.g. 12.99'),
  currency: z.string().trim().length(3, '3 letters, e.g. USD'),
  spent_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format YYYY-MM-DD'),
});

export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;
