// Punto único para hablar con el backend: agrega el token y maneja errores.
const BASE_URL = import.meta.env.VITE_API_URL;
const TOKEN_KEY = "library_token";

// El token vive en localStorage. Todo el acceso pasa por estas tres
// funciones, así es fácil cambiarlo a cookies httpOnly más adelante.
export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* sin almacenamiento: la sesión dura solo mientras la pestaña esté abierta */
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* nada que limpiar */
  }
}

let onUnauthorized = null;

// AuthContext registra aquí qué hacer cuando el backend responde 401.
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function api(path, { method = "GET", body, auth = true } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    /* respuesta sin cuerpo */
  }

  if (!response.ok) {
    if (response.status === 401 && auth && onUnauthorized) onUnauthorized();
    const message = data?.errors?.[0]?.msg || data?.message || "Algo salió mal";
    throw new ApiError(message, response.status);
  }

  return data;
}
