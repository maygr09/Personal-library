import { Navigate, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../hooks/useAuth";

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();

  if (user) return <Navigate to="/" replace />;

  const handleRegister = async (email, password) => {
    await register(email, password);
    navigate("/", { replace: true });
  };

  return (
    <AuthForm
      title="Crea tu cuenta"
      submitLabel="Crear cuenta"
      onSubmit={handleRegister}
      confirmPassword
      footerText="¿Ya tienes cuenta?"
      footerLinkText="Inicia sesión"
      footerLinkTo="/login"
    />
  );
}
