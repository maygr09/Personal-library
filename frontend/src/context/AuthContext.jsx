import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./authContext";
import { clearToken, getToken, setToken, setUnauthorizedHandler } from "../services/api";
import { fetchMe, loginRequest, registerRequest } from "../services/auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Solo hay algo que comprobar al abrir la app si ya existe un token guardado.
  const [loading, setLoading] = useState(() => Boolean(getToken()));

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  // Si el backend responde 401 en cualquier petición, cerramos sesión.
  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  // Al abrir la app, si hay token guardado, comprobamos que siga siendo válido.
  useEffect(() => {
    if (!getToken()) return;
    fetchMe()
      .then((data) => setUser(data.user))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  const startSession = (data) => {
    setToken(data.token);
    setUser(data.user);
  };

  const login = useCallback(async (email, password) => {
    startSession(await loginRequest(email, password));
  }, []);

  const register = useCallback(async (email, password) => {
    startSession(await registerRequest(email, password));
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
