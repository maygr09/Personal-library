import express from "express";
import { register, login, me } from "../controllers/authController.js";
import { registerValidator, loginValidator } from "../validators/authValidators.js";
import { handleValidationErrors } from "../middleware/handleValidation.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.post("/register", registerValidator, handleValidationErrors, register);
router.post("/login", loginValidator, handleValidationErrors, login);
router.get("/me", requireAuth, me);

export default router;
