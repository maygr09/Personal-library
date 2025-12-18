import "dotenv/config";
import express from 'express';
import cors from 'cors';
import booksRoutes from './routes/booksRoutes.js';
import bookRequests from "./requests/bookRequests.js";


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/books', booksRoutes);
app.use('/api/books', bookRequests);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});