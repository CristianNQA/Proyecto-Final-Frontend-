import { useState, useEffect} from "react";
import { AuthContext } from "./AuthContext.jsx"; 
import API_URL from "../utils/api.js";

// AuthProvider envuelve la aplicación en el main y proporciona el estado de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // useEffect para sincronizar el token con localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // Iniciar Sesion
  const login = async (userData) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setUser(data.user);
      setToken(data.token);
    } catch (error) {
      console.error(error.message);
    }
  };

  // Cerrar Sesion
  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};