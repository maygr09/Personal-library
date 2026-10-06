import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/auth.js";

// Exige "Authorization: Bearer <token>" y deja el usuario en req.user.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Inicia sesión para continuar" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: Number(payload.sub) };
    next();
  } catch {
    return res.status(401).json({ message: "Tu sesión expiró, inicia sesión de nuevo" });
  }
}
