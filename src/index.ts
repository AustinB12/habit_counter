import { serve } from 'bun';
import indexDev from './index.html';
import { initializeDatabase, getDatabase } from './db';
import type { Habit_History, User } from './App';

// Initialize database on app load
initializeDatabase();

const isProduction = process.env.NODE_ENV === 'production';

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    '/*': isProduction
      ? async () =>
          new Response(await Bun.file('./dist/index.html').text(), {
            headers: { 'Content-Type': 'text/html' },
          })
      : async () =>
          new Response(indexDev.index, {
            headers: { 'Content-Type': 'text/html' },
          }),

    '/api/hello': {
      async GET(req) {
        return Response.json({
          message: 'Hello, world!',
          method: 'GET',
        });
      },
      async PUT(req) {
        return Response.json({
          message: 'Hello, world!',
          method: 'PUT',
        });
      },
    },

    '/api/hello/:name': async (req) => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },

    '/api/users': {
      async GET() {
        const db = getDatabase();
        const users = db.query('SELECT * FROM users').all();
        return Response.json(users);
      },
    },
    '/api/users/:user_id': {
      async GET(req) {
        const db = getDatabase();
        const user_id = req.params.user_id;
        const user = db
          .query(`SELECT * FROM users WHERE id = ${user_id}`)
          .get() as User;
        return Response.json(user);
      },
    },
    '/api/users/:user_id/count': {
      async POST(req) {
        const db = getDatabase();
        const user_id = req.params.user_id;
        const { count_added, description } = await req.json();

        // Get current count
        const user: User = db
          .prepare(`SELECT * FROM users WHERE id = ?`)
          .get(user_id) as User;
        if (!user) {
          return new Response('User not found', { status: 404 });
        }

        const new_count = user.count + count_added;

        // Update user count
        db.run(`UPDATE users SET count = ${new_count} WHERE id = ${user_id}`);

        // Insert into habit_history
        db.run(
          `INSERT INTO habit_history (user_id, count_added, running_total, description) VALUES (${user_id}, ${count_added}, ${new_count}, '${description}')`,
        );

        return Response.json({ new_count });
      },
    },
    '/api/habit_history': {
      async GET() {
        const db = getDatabase();
        const history = db
          .query('SELECT * FROM habit_history ORDER BY created_at DESC')
          .all() as Habit_History[];
        return Response.json(history);
      },
    },
  },

  development: process.env.NODE_ENV !== 'production' && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
