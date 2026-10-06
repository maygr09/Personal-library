import pool from "./db.js";

// Migraciones simples y idempotentes que corren al arrancar el servidor.
// Para agregar un cambio de base de datos: añade un objeto NUEVO al final
// de la lista (nunca edites uno que ya se aplicó).
const migrations = [
  {
    id: "001_create_users",
    sql: `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `,
  },
  {
    id: "002_books_user_id",
    sql: `
      ALTER TABLE books
        ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;
      CREATE INDEX IF NOT EXISTS idx_books_user_id ON books (user_id);
    `,
  },
];

export async function runMigrations() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    for (const migration of migrations) {
      await client.query("BEGIN");
      try {
        // Evita que dos instancias apliquen la misma migración a la vez.
        await client.query("SELECT pg_advisory_xact_lock(727274)");

        const done = await client.query(
          "SELECT 1 FROM schema_migrations WHERE id = $1",
          [migration.id]
        );

        if (done.rowCount === 0) {
          await client.query(migration.sql);
          await client.query("INSERT INTO schema_migrations (id) VALUES ($1)", [
            migration.id,
          ]);
          console.log(`Migración aplicada: ${migration.id}`);
        }

        await client.query("COMMIT");
      } catch (err) {
        await client.query("ROLLBACK");
        throw err;
      }
    }
  } finally {
    client.release();
  }
}
