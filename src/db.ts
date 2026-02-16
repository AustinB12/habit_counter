import { Database } from 'bun:sqlite';

let db: Database | null = null;

export function initializeDatabase(): Database {
  if (db) return db;

  db = new Database('mydb.sqlite', { create: true });

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS habit_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    count_added INTEGER DEFAULT 0,
    running_total INTEGER DEFAULT 0,
    description TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  console.log('📦 Database initialized');
  return db;
}

export function getDatabase(): Database {
  if (!db) {
    throw new Error(
      'Database not initialized. Call initializeDatabase() first.',
    );
  }
  return db;
}
