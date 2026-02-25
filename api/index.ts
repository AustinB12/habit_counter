import express, { type Request, type Response } from 'express';
import { Database } from 'bun:sqlite';

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize SQLite database
const db = new Database('habits.db');

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON;');

db.run(`
  PRAGMA journal_mode = WAL;          -- Write-Ahead Logging for better concurrency
  PRAGMA synchronous = NORMAL;        -- Balance between safety and performance
  PRAGMA cache_size = 10000;          -- 10MB cache (10000 * 1KB pages)
  PRAGMA temp_store = MEMORY;         -- Store temporary tables in memory
  PRAGMA mmap_size = 268435456;       -- 256MB memory-mapped I/O
  PRAGMA optimize;                    -- Analyze and optimize query planner
`);

db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT(strftime('%Y-%m-%d %H:%M:%f', 'now', 'localtime'))
  )`);

db.run(`CREATE TABLE IF NOT EXISTS habit_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    count_added INTEGER DEFAULT 0,
    running_total INTEGER DEFAULT 0,
    description TEXT,
    created_at TEXT DEFAULT(strftime('%Y-%m-%d %H:%M:%f', 'now', 'localtime')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

console.log('📦 Database initialized');

console.log('SQLite database connected and initialized');

app.use(express.json());

// Enable CORS for all origins
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the Habit Counter API' });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', database: 'connected' });
});

app.get('/users', (req: Request, res: Response) => {
  const users = db.query('SELECT * FROM users').all();
  res.json(users);
});

app.get('/users/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  const user = db.query('SELECT * FROM users WHERE id = ?').get(id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

app.post('/users/:id/count', (req: Request, res: Response) => {
  const { id } = req.params;
  const { count, description } = req.body;

  if (typeof count !== 'number') {
    return res.status(400).json({ error: 'count must be a number' });
  }

  if (!id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const user = db.query('SELECT * FROM users WHERE id = ?').get(id) as {
    id: number;
    name: string;
    count: number;
  } | null;
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const newTotal = user.count + count;

  // Update user's count
  db.run('UPDATE users SET count = ? WHERE id = ?', [newTotal, id]);

  // Create habit_history record
  db.run(
    'INSERT INTO habit_history (user_id, count_added, running_total, description) VALUES (?, ?, ?, ?)',
    [id, count, newTotal, description || null],
  );

  res.json({ id: user.id, name: user.name, count: newTotal });
});

app.get('/history', (req: Request, res: Response) => {
  const history = db
    .query('SELECT * FROM habit_history ORDER BY created_at DESC')
    .all();
  res.json(history);
});

app.delete('/history', (req: Request, res: Response) => {
  db.run('DELETE FROM habit_history');
  res.json({ message: 'All history deleted' });
});

// Export db for use in other modules
export { db };

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
