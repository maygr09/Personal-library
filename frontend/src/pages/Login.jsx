import { Navigate, useLocation, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destination = location.state?.from?.pathname || "/";

  if (user) return <Navigate to={destination} replace />;

  const handleLogin = async (email, password) => {
    await login(email, password);
    navigate(destination, { replace: true });
  };

  return (
    <AuthForm
      title="Inicia sesión"
      submitLabel="Entrar"
      onSubmit={handleLogin}
      footerText="¿No tienes cuenta?"
      footerLinkText="Crear cuenta"
      footerLinkTo="/register"
    />
  );
}
