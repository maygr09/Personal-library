import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p className="text-center mt-10">Cargando…</p>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  return children;
}
