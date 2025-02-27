import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/LoginScreen.css"
import API_URL from "../utils/api.js";

const LoginScreen = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [showResendButton, setShowResendButton] = useState(false);
  const navigate = useNavigate();

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResendMessage("");
    setShowResendButton(false);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      setLoading(false);

      if (!data.ok) {
        if (data.message === "Cuenta no verificada. Revisa tu correo.") {
          setShowResendButton(true);
        }
        return // para evitar que se interrumpa antes de guardar el token
      }
      

      // Guardar token y redirigir
      localStorage.setItem("token", data.token);
      navigate("/tasks");
    } 
    catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };
  

  // Reenviar correo de verificación
  const handleResendEmail = async () => {
    setResendMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      const data = await response.json();
      setLoading(false);

      if (!data.ok) throw new Error(data.message);
      setResendMessage("Correo de verificación reenviado con éxito.");
    } catch (error) {
      setLoading(false);
      setResendMessage("Error al reenviar el correo. Inténtalo más tarde.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Iniciar Sesión</h2>

        {error && <p className="login-error">{error}</p>}
        {resendMessage && <p className="login-info">{resendMessage}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            name="email"
            placeholder="Correo"
            value={user.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={user.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Cargando..." : "Ingresar"}
          </button>
        </form>

        {showResendButton && (
          <button onClick={handleResendEmail} className="resend-email-btn" disabled={loading}>
            {loading ? "Reenviando..." : "Reenviar correo de verificación"}
          </button>
        )}

        <p className="login-text">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="login-link">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
