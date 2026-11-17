import { getDb } from "./index";

export interface Expense {
	id: number;
	title: string;
	amount_minor: number;
	currency: string;
	spent_at: string;
    created_at: string;
}

export type NewExpense = Omit<Expense, "id">;

export async function listExpenses(): Promise<Expense[]> {
	const db = await getDb();
	return db.getAllAsync<Expense>(
		"SELECT id, title, amount_minor, currency, spent_at, created_at FROM expenses ORDER BY spent_at DESC",
	);
}

export async function getExpenseById(id: number): Promise<Expense | undefined> {
	const db = await getDb();
	return (await db.getFirstAsync<Expense>(
		"SELECT id, title, amount_minor, currency, spent_at, created_at FROM expenses WHERE id = ?",
		id,
	)) ?? undefined;
}

export async function insertExpense(expense: NewExpense): Promise<Expense> {
	const db = await getDb();
	const result = await db.runAsync(
		"INSERT INTO expenses (title, amount_minor, currency, spent_at, created_at) VALUES (?, ?, ?, ?, ?)",
		expense.title,
		expense.amount_minor,
		expense.currency,
		expense.spent_at,
		expense.created_at,
	);

	const inserted = await getExpenseById(Number(result.lastInsertRowId));
	if (!inserted) {
		throw new Error("Failed to retrieve inserted expense");
	}

	return inserted;
}

export async function seedExpensesIfEmpty(seedExpenses: NewExpense[]): Promise<void> {
	const db = await getDb();
	const result = await db.getFirstAsync<{ count: number }>("SELECT COUNT(*) AS count FROM expenses");

	if (result?.count === 0) {
		await db.withTransactionAsync(async () => {
			for (const expense of seedExpenses) {
				await db.runAsync(
					"INSERT INTO expenses (title, amount_minor, currency, spent_at, created_at) VALUES (?, ?, ?, ?, ?)",
					expense.title,
					expense.amount_minor,
					expense.currency,
					expense.spent_at,
					expense.created_at,
				);
			}
		});
	}
}

export async function clearExpenses(): Promise<void> {
	const db = await getDb();
	await db.runAsync("DELETE FROM expenses");
}

export async function deleteExpense(id: number): Promise<void> {
	const db = await getDb();
	await db.runAsync("DELETE FROM expenses WHERE id = ?", id);
}
