import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  BCRYPT_ROUNDS,
} from "../config/auth.js";
import { createUser, findUserByEmail, findUserById } from "../models/user.js";

// Hash de relleno para que login tarde parecido exista o no el correo.
const DUMMY_HASH = bcrypt.hashSync("no-existe", BCRYPT_ROUNDS);

function signToken(user) {
  return jwt.sign({ sub: String(user.id) }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

function publicUser(user) {
  return { id: user.id, email: user.email };
}

export async function register(req, res) {
  try {
    const { email, password } = req.body;

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: "Ese correo ya está registrado" });
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const user = await createUser(email, passwordHash);

    res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (error) {
    // 23505 = correo duplicado por una carrera entre dos registros
    if (error.code === "23505") {
      return res.status(409).json({ message: "Ese correo ya está registrado" });
    }
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "No se pudo crear la cuenta" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    const valid = await bcrypt.compare(password, user ? user.password_hash : DUMMY_HASH);

    if (!user || !valid) {
      return res.status(401).json({ message: "Correo o contraseña incorrectos" });
    }

    res.json({ token: signToken(user), user: publicUser(user) });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "No se pudo iniciar sesión" });
  }
}

export async function me(req, res) {
  try {
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(401).json({ message: "Tu sesión ya no es válida" });
    }
    res.json({ user: publicUser(user) });
  } catch (error) {
    console.error("ME ERROR:", error);
    res.status(500).json({ message: "No se pudo cargar tu sesión" });
  }
}
