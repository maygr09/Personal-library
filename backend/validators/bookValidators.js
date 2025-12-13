import { body } from "express-validator";

export const createBookValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title is required"),

  body("original_title")
    .notEmpty()
    .withMessage("Original title is required"),

  body("author")
    .optional()
    .isString()
    .withMessage("Author must be a string"),

 body("series")
  .optional({ nullable: true, checkFalsy: true })
  .isString()
  .withMessage("Series must be a string"),

body("series_order")
  .optional({ nullable: true, checkFalsy: true })
  .isFloat({ min: 0 })
  .withMessage("Series order must be a number (decimals allowed)"),

  body("publication_year")
    .notEmpty()
    .isInt({ min: 0 })
    .withMessage("Publication year must be a valid number"),

 body("rating")
  .optional({ nullable: true, checkFalsy: true })
  .isInt({ min: 1, max: 5 })
  .withMessage("Rating must be an integer between 1 and 5"),

  body("format")
    .optional()
    .isIn(["ePub", "Físico"])
    .withMessage("Invalid format"),

  body("status")
    .notEmpty()
    .isIn(["Leído", "Pendiente"])
    .withMessage("Invalid status"),

  body("location")
    .optional()
    .isIn(["iPhone/Books", "iPhone/Files", "Portatil", "Físico/Twilight", "Físico/Outlander", "Físico/Languages", "Físico/Música", "Físico/Varios", "No disponible"])
    .withMessage("Invalid location"),    

  body("genre")
    .optional()
    .isIn(["Histórico Inglaterra", "Escocés historico", "Escocés moderno", "Nórdico romántico", "Romance", "Juvenil romántico", "Fantasía/Magia", "Autoconocimiento", "Suspenso", "Terror", "Ciencia ficción", "Música", "Matemáticas", "Idiomas"])
    .withMessage("Invalid genre"),
];

export const updateBookValidator = [
  body("title")
    .optional()
    .isString()
    .withMessage("Title must be a string"),

  body("original_title")
    .optional()
    .isString()
    .withMessage("Original title must be a string"),

  body("author")
    .optional()
    .isString()
    .withMessage("Author must be a string"),

  body("series")
    .optional()
    .isString()
    .withMessage("Series must be a string"),

body("series_order")
    .optional()
    .isFloat({ min: 0})
    .withMessage("Series order must be a number (decimals allowed"),    

  body("publication_year")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Publication year must be a valid number"),

  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5"),

  body("format")
    .optional()
    .isIn(["ePub", "Físico"])
    .withMessage("Invalid format"),

  body("status")
    .optional()
    .isIn(["Leído", "Pendiente"])
    .withMessage("Invalid status"),

  body("location")
    .optional()
    .isIn(["iPhone/Books", "iPhone/Files", "Portatil", "Físico/Twilight", "Físico/Outlander", "Físico/Languages", "Físico/Música", "Físico/Varios", "No disponible"])
    .withMessage("Invalid location"),   

  body("genre")
    .optional()
    .isIn(["Histórico Inglaterra", "Escocés historico", "Escocés moderno", "Nórdico romántico", "Romance", "Juvenil romántico", "Fantasía/Magia", "Autoconocimiento", "Suspenso", "Terror", "Ciencia ficción", "Música", "Matemáticas", "Idiomas"])
    .withMessage("Invalid genre"),
];

import { param } from "express-validator";

export const idValidator = [
  param("id")
    .exists().withMessage("ID is required")
    .isInt({ min: 1 }).withMessage("ID must be a positive integer")
];
