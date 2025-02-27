import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext.jsx";

//Facilita el acceso al contexto en cualquier componente sin necesidad de importar AuthContext directamente.
export const useAuth = () => useContext(AuthContext);