import * as SQLite from 'expo-sqlite';
import { NewExpense } from './expenses.repo';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

const SEED: NewExpense[] = [
  {
    title: 'Groceries',
    amount_minor: 5000,
    currency: 'USD',
    spent_at: '2024-06-01T10:00:00Z',
    created_at: new Date().toISOString(),
  },
  {
    title: 'Taxi',
    amount_minor: 2000,
    currency: 'USD',
    spent_at: '2024-06-02T15:30:00Z',
    created_at: new Date().toISOString(),
  },
  {
    title: 'Coffee',
    amount_minor: 3000,
    currency: 'USD',
    spent_at: '2024-06-03T08:45:00Z',
    created_at: new Date().toISOString(),
  }
];

async function migrate(db: SQLite.SQLiteDatabase): Promise<void> {
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const version = row?.user_version ?? 0;

  if (version < 1) {
    await db.execAsync(`
      CREATE TABLE expenses (
        id           INTEGER PRIMARY KEY AUTOINCREMENT,
        title        TEXT    NOT NULL,
        amount_minor INTEGER NOT NULL,
        currency     TEXT    NOT NULL DEFAULT 'USD',
        spent_at     TEXT    NOT NULL,
        created_at   TEXT    NOT NULL
      );
    `);
    await db.execAsync('PRAGMA user_version = 1');
  }
}

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync('receipts.db');
      await migrate(db);
      return db;
    })();
  }
  return dbPromise;
}
