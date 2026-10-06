import { body } from "express-validator";

const emailRule = body("email")
  .trim()
  .toLowerCase()
  .isEmail()
  .withMessage("Escribe un correo válido");

export const registerValidator = [
  emailRule,
  body("password")
    .isString()
    .isLength({ min: 8, max: 72 })
    .withMessage("La contraseña debe tener entre 8 y 72 caracteres"),
];

export const loginValidator = [
  emailRule,
  body("password").isString().notEmpty().withMessage("Escribe tu contraseña"),
];
