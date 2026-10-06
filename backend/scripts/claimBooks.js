// Asigna a un usuario todos los libros que todavía no tienen dueño
// (los que existían antes de agregar el login).
// Uso, desde la carpeta backend:  node scripts/claimBooks.js tu@correo.com
import "dotenv/config";
import pool from "../db/db.js";

const email = (process.argv[2] || "").trim().toLowerCase();

if (!email) {
  console.error("Uso: node scripts/claimBooks.js tu@correo.com");
  process.exit(1);
}

try {
  const user = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
  if (user.rowCount === 0) {
    console.error(`No existe una cuenta con el correo ${email}. Regístrate primero en la app.`);
    process.exit(1);
  }

  const result = await pool.query(
    "UPDATE books SET user_id = $1 WHERE user_id IS NULL",
    [user.rows[0].id]
  );
  console.log(`Listo: ${result.rowCount} libros ahora pertenecen a ${email}.`);
} finally {
  await pool.end();
}
