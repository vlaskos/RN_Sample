import * as SQLite from 'expo-sqlite';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

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
