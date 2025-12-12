import express from 'express';
import {
  getBooks,
  fetchBookById,
  createBook,
  updateBook,
  deleteBook
} from '../controllers/bookController.js';

import {
  createBookValidator,
  updateBookValidator
} from "../validators/bookValidators.js";

import { idValidator } from "../validators/bookValidators.js";
import { handleValidationErrors } from "../middleware/handleValidation.js";

const router = express.Router();

router.get("/", getBooks);
router.get("/:id", idValidator, handleValidationErrors, fetchBookById);
router.post("/", createBookValidator, handleValidationErrors, createBook);
router.put("/:id", idValidator, updateBookValidator, handleValidationErrors, updateBook);
router.delete("/:id", idValidator, handleValidationErrors, deleteBook);

export default router;