import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/RegisterScreen.css"
import API_URL from "../utils/api";

const RegisterScreen = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState(""); // Guardar el email registrado
  const [resendMessage, setResendMessage] = useState(""); // Mensaje de reenvío

  const navigate = useNavigate();

  const handleChange = (params) => {
    setUser({ ...user, [params.target.name]: params.target.value });
  };

  const handleSubmit = async (params) => {
    params.preventDefault();
    setError("");
    setSuccessMessage("");
    setResendMessage("");

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (!data.ok) throw new Error(data.message);

      setSuccessMessage("Registro exitoso. Se ha enviado un correo de verificación");
      setRegisteredEmail(user.email); // Guardar email para reenvío

      // Para redirigir después de 3 segundos
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleResendEmail = async () => {
    if (!registeredEmail) return;

    try {
      setResendMessage("");
      const response = await fetch(`${API_URL}/api/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: registeredEmail }),
      });

      const data = await response.json();

      if (!data.ok) throw new Error(data.message);

      setResendMessage("Correo de verificación reenviado con éxito");
    } catch (error) {
      setResendMessage("Error al reenviar el correo");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Crea tu cuenta</h2>

        {error && <p className="register-error">{error}</p>}
        {successMessage && <p className="register-success">{successMessage}</p>}
        {resendMessage && <p className="register-info">{resendMessage}</p>}

        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={user.name}
            onChange={handleChange}
            required
          />
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
          <button type="submit" className="register-btn">
            Registrarse
          </button>
        </form>

        {registeredEmail && (
          <button onClick={handleResendEmail} className="resend-email-btn">
            Reenviar correo de verificación
          </button>
        )}

        <p className="register-text">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="register-link">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
};


export default RegisterScreen