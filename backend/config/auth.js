// Configuración de autenticación en un solo lugar.
const secret = process.env.JWT_SECRET;

if (!secret || secret.length < 16) {
  throw new Error(
    "Falta JWT_SECRET (mínimo 16 caracteres). Agrégala a backend/.env y a las variables de entorno de Render."
  );
}

export const JWT_SECRET = secret;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
export const BCRYPT_ROUNDS = 10;
