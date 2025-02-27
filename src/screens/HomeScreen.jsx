import React from "react";
import { Link } from "react-router-dom";
import "../styles/HomeScreen.css";

const HomeScreen = () => {
  return (
    <div className="home-container">
      
      <div className="home-card">
        <h1 className="home-title">
          Bienvenido a 
          <span className="home-highlight"> Task Manager</span>
        </h1>
        <p className="home-description">
          Organiza tus tareas de manera fácil y eficiente. ¡Regístrate ahora y empieza!
        </p>
        <div className="home-buttons">
          <Link to="/login">
            <button className="home-btn login">Iniciar Sesión</button>
          </Link>
          <Link to="/register">
            <button className="home-btn register">Crear Cuenta</button>
          </Link>
        </div>
      </div>

    </div>
  );
};

export default HomeScreen;


