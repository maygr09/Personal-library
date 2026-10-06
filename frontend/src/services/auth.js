import { api } from "./api";

export const loginRequest = (email, password) =>
  api("/api/auth/login", { method: "POST", body: { email, password }, auth: false });

export const registerRequest = (email, password) =>
  api("/api/auth/register", { method: "POST", body: { email, password }, auth: false });

export const fetchMe = () => api("/api/auth/me");
