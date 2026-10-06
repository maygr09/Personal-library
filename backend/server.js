import "dotenv/config";
import express from 'express';
import cors from 'cors';
import "./config/auth.js"; // falla al arrancar si falta JWT_SECRET
import { runMigrations } from "./db/migrate.js";
import authRoutes from './routes/authRoutes.js';
import booksRoutes from './routes/booksRoutes.js';
import { requireAuth } from './middleware/requireAuth.js';

const app = express();

app.use(cors());
app.use(express.json());

// Públicas: registro y login
app.use('/api/auth', authRoutes);

// Privadas: todo lo de libros exige sesión iniciada
app.use('/api/books', requireAuth, booksRoutes);

const PORT = process.env.PORT || 3000;

try {
  await runMigrations();
} catch (error) {
  console.error("No se pudieron aplicar las migraciones:", error);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
