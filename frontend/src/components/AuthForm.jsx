import { useState } from "react";
import { Link } from "react-router-dom";

// Formulario compartido por Login y Registro.
export default function AuthForm({
  title,
  submitLabel,
  onSubmit,
  confirmPassword = false,
  footerText,
  footerLinkText,
  footerLinkTo,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (confirmPassword && password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(email, password);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-purple-500";

  return (
    <div className="max-w-sm mx-auto p-6 mt-16">
      <h1 className="text-3xl font-bold text-center mb-1">My Personal Library</h1>
      <p className="text-center text-gray-600 mb-6">{title}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm mb-1">
            Correo
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm mb-1">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={confirmPassword ? 8 : undefined}
            autoComplete={confirmPassword ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
          {confirmPassword && (
            <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres.</p>
          )}
        </div>

        {confirmPassword && (
          <div>
            <label htmlFor="confirm" className="block text-sm mb-1">
              Repite la contraseña
            </label>
            <input
              id="confirm"
              type="password"
              required
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={inputClass}
            />
          </div>
        )}

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition disabled:opacity-60"
        >
          {submitting ? "Un momento…" : submitLabel}
        </button>
      </form>

      <p className="text-sm text-center text-gray-600 mt-6">
        {footerText}{" "}
        <Link to={footerLinkTo} className="text-purple-600 hover:underline">
          {footerLinkText}
        </Link>
      </p>
    </div>
  );
}
