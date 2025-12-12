import express from 'express';
import cors from 'cors';
import booksRoutes from './routes/booksRoutes.js';
import bookRequests from "./requests/bookRequests.js";


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/books', booksRoutes);
app.use('/api/books', bookRequests);

app.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000');
});